import React, { useState, useRef } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/Components/ui/sheet';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/Components/ui/popover';
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from '@/Components/ui/empty';
import { Plus, Edit, Trash2, ExternalLink, Megaphone, Link as LinkIcon, Palette, Smile } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import SharedPagination from '@/Components/Shared/Pagination';
import type { PageProps } from '@/types';
import type { Ticker, PaginatedTickers } from '@/types/ticker';

interface Props {
    tickers: PaginatedTickers;
    tickers_limit: number | null;
    tickers_count: number;
}

const PRESET_COLORS = [
    { name: 'Negro', value: '#000000' },
    { name: 'Rojo', value: '#EF4444' },
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Verde', value: '#22C55E' },
    { name: 'Naranja', value: '#F97316' },
    { name: 'Púrpura', value: '#A855F7' },
    { name: 'Blanco', value: '#FFFFFF' },
];

const EMOJI_LIST = [
    '🔥', '🎉', '🚀', '📢', '🏷️', '🎁', '💎', '✨', '⭐', '⚡',
    '🚚', '📦', '💳', '📍', '👉', '⚠️', '✅', '🆕',
    '🍔', '🍕', '🍣', '🥗', '☕', '🍺', '🍷', '🍰', '❤️', '💯',
];

interface TickerForm {
    content: string;
    link: string;
    background_color: string;
    text_color: string;
    order: number;
    is_active: boolean;
}

const INITIAL_FORM: TickerForm = {
    content: '',
    link: '',
    background_color: '#000000',
    text_color: '#FFFFFF',
    order: 0,
    is_active: true,
};

export default function Index({ tickers, tickers_limit, tickers_count }: Props) {
    const { currentTenant, currentUserRole } = usePage<PageProps>().props;

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingTicker, setEditingTicker] = useState<Ticker | null>(null);
    const [tickerToDelete, setTickerToDelete] = useState<Ticker | null>(null);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [formData, setFormData] = useState<TickerForm>(INITIAL_FORM);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const contentInputRef = useRef<HTMLInputElement>(null);

    const atLimit = tickers_limit !== null && tickers_count >= tickers_limit;

    // --- Permisos ---
    const checkPermission = (permission: string): boolean => {
        if (!currentUserRole) return false;
        return currentUserRole.is_owner ||
            currentUserRole.permissions.includes('*') ||
            currentUserRole.permissions.includes(permission);
    };

    const withPermission = (permission: string, action: () => void) => {
        if (checkPermission(permission)) {
            action();
        } else {
            setShowPermissionModal(true);
        }
    };

    // --- Helpers de formulario ---
    const setField = <K extends keyof TickerForm>(key: K, value: TickerForm[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        setErrors(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const insertEmoji = (emoji: string) => {
        const input = contentInputRef.current;
        if (input) {
            const start = input.selectionStart || 0;
            const end = input.selectionEnd || 0;
            const newText = formData.content.substring(0, start) + emoji + formData.content.substring(end);
            setField('content', newText);
            setTimeout(() => {
                input.focus();
                const pos = start + emoji.length;
                input.setSelectionRange(pos, pos);
            }, 0);
        } else {
            setField('content', formData.content + emoji);
        }
    };

    // --- Acciones CRUD ---
    const openCreate = () => {
        setEditingTicker(null);
        setFormData({ ...INITIAL_FORM, order: tickers.total });
        setErrors({});
        setIsSheetOpen(true);
    };

    const openEdit = (ticker: Ticker) => {
        setEditingTicker(ticker);
        setFormData({
            content: ticker.content,
            link: ticker.link || '',
            background_color: ticker.background_color,
            text_color: ticker.text_color,
            order: ticker.order,
            is_active: ticker.is_active,
        });
        setErrors({});
        setIsSheetOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const permission = editingTicker ? 'tickers.update' : 'tickers.create';

        withPermission(permission, () => {
            setProcessing(true);
            const routeParams = editingTicker
                ? route('tenant.admin.tickers.update', [currentTenant?.slug, editingTicker.id])
                : route('tenant.admin.tickers.store', currentTenant?.slug);
            const method = editingTicker ? 'put' : 'post';

            router[method](routeParams, { ...formData }, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(editingTicker ? 'Ticker actualizado correctamente' : 'Ticker creado correctamente');
                    setIsSheetOpen(false);
                    setProcessing(false);
                },
                onError: (errs) => {
                    setErrors(errs);
                    const limitMsg = errs?.limit;
                    toast.error(typeof limitMsg === 'string' ? limitMsg : 'Revisa los campos del formulario');
                    setProcessing(false);
                },
            });
        });
    };

    const handleDelete = () => {
        if (!tickerToDelete) return;
        setProcessing(true);
        router.delete(route('tenant.admin.tickers.destroy', [currentTenant?.slug, tickerToDelete.id]), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Ticker eliminado correctamente');
                setTickerToDelete(null);
                setProcessing(false);
            },
            onError: () => {
                toast.error('Error al eliminar el ticker');
                setProcessing(false);
            },
        });
    };

    const toggleActive = (ticker: Ticker) => {
        withPermission('tickers.update', () => {
            router.put(route('tenant.admin.tickers.update', [currentTenant?.slug, ticker.id]), {
                content: ticker.content,
                link: ticker.link || '',
                background_color: ticker.background_color,
                text_color: ticker.text_color,
                order: ticker.order,
                is_active: !ticker.is_active,
            }, {
                preserveScroll: true,
                onSuccess: () => toast.success(ticker.is_active ? 'Ticker desactivado' : 'Ticker activado'),
            });
        });
    };

    // --- Color picker compartido ---
    const ColorPicker = ({ label, field }: { label: string; field: 'background_color' | 'text_color' }) => (
        <div className="space-y-3">
            <Label>{label}</Label>
            <div className="flex flex-wrap gap-2 mb-2">
                {PRESET_COLORS.map(color => (
                    <button
                        key={color.value}
                        type="button"
                        onClick={() => setField(field, color.value)}
                        className={cn(
                            'w-8 h-8 rounded-full border border-gray-200 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900',
                            formData[field] === color.value && 'ring-2 ring-offset-2 ring-slate-900 scale-110',
                            color.value === '#FFFFFF' && 'border-gray-300'
                        )}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                        aria-label={`Color ${color.name}`}
                    />
                ))}
            </div>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        value={formData[field]}
                        onChange={e => setField(field, e.target.value)}
                        className="pl-9 font-mono"
                        placeholder="#000000"
                    />
                </div>
                <input
                    type="color"
                    value={formData[field]}
                    onChange={e => setField(field, e.target.value)}
                    className="h-10 w-10 p-1 rounded-md border cursor-pointer"
                    aria-label={`Selector de ${label.toLowerCase()}`}
                />
            </div>
            {errors[field] && <p className="text-destructive text-xs">{errors[field]}</p>}
        </div>
    );

    return (
        <AdminLayout title="Tickers Promocionales">
            <Head title="Tickers Promocionales" />

            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Tickers Promocionales</h1>
                    <p className="text-sm text-muted-foreground">
                        Barra de anuncios y promociones en la parte superior de tu tienda.
                        {tickers_limit !== null && (
                            <span className="ml-1 font-medium text-foreground">
                                ({tickers_count} / {tickers_limit} usados)
                            </span>
                        )}
                    </p>
                </div>
                <Button
                    onClick={() => withPermission('tickers.create', () => !atLimit && openCreate())}
                    disabled={atLimit}
                    className="gap-2"
                    title={atLimit ? 'Has alcanzado el máximo de tickers permitidos en tu plan' : undefined}
                >
                    <Plus className="w-4 h-4" /> Nuevo Ticker
                </Button>
            </div>

            {/* Tabla / Empty State */}
            {tickers.data.length === 0 ? (
                <Card>
                    <CardContent className="py-16">
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <Megaphone className="h-5 w-5" />
                                </EmptyMedia>
                                <EmptyTitle>No hay tickers creados</EmptyTitle>
                                <EmptyDescription>
                                    Los tickers promocionales aparecen como una barra animada en la parte superior de tu tienda. Crea el primero para empezar a comunicar ofertas y novedades.
                                </EmptyDescription>
                            </EmptyHeader>
                            <Button
                                onClick={() => withPermission('tickers.create', () => !atLimit && openCreate())}
                                disabled={atLimit}
                                className="gap-2 mt-4"
                                title={atLimit ? 'Has alcanzado el máximo de tickers permitidos en tu plan' : undefined}
                            >
                                <Plus className="w-4 h-4" /> Crear primer ticker
                            </Button>
                        </Empty>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Desktop: Tabla */}
                    <Card className="hidden md:block">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40px]">#</TableHead>
                                        <TableHead className="w-[300px]">Mensaje</TableHead>
                                        <TableHead>Colores</TableHead>
                                        <TableHead>Enlace</TableHead>
                                        <TableHead className="text-center">Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tickers.data.map((ticker) => (
                                        <TableRow key={ticker.id}>
                                            <TableCell className="text-muted-foreground font-mono text-xs">
                                                {ticker.order}
                                            </TableCell>
                                            <TableCell className="font-medium max-w-[300px] truncate">
                                                {ticker.content}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-6 h-6 rounded-full border shadow-sm flex items-center justify-center text-[8px] font-bold"
                                                        style={{ backgroundColor: ticker.background_color, color: ticker.text_color }}
                                                        title={`Fondo: ${ticker.background_color} | Texto: ${ticker.text_color}`}
                                                    >
                                                        Aa
                                                    </div>
                                                    <span className="text-xs font-mono text-muted-foreground">{ticker.background_color}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {ticker.link ? (
                                                    <a href={ticker.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                                                        <ExternalLink className="w-3 h-3" /> Ver enlace
                                                    </a>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Switch
                                                    checked={ticker.is_active}
                                                    onCheckedChange={() => toggleActive(ticker)}
                                                    aria-label={`${ticker.is_active ? 'Desactivar' : 'Activar'} ticker`}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => withPermission('tickers.update', () => openEdit(ticker))}
                                                        aria-label="Editar ticker"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => withPermission('tickers.delete', () => setTickerToDelete(ticker))}
                                                        aria-label="Eliminar ticker"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Mobile: Cards */}
                    <div className="md:hidden space-y-3">
                        {tickers.data.map((ticker) => (
                            <Card key={ticker.id}>
                                <CardContent className="p-4">
                                    {/* Preview del ticker */}
                                    <div
                                        className="w-full py-2 px-3 text-sm font-bold rounded-md mb-3 truncate"
                                        style={{ backgroundColor: ticker.background_color, color: ticker.text_color }}
                                    >
                                        {ticker.content}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Switch
                                                checked={ticker.is_active}
                                                onCheckedChange={() => toggleActive(ticker)}
                                                aria-label={`${ticker.is_active ? 'Desactivar' : 'Activar'} ticker`}
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                {ticker.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>

                                        <div className="flex gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8"
                                                onClick={() => withPermission('tickers.update', () => openEdit(ticker))}
                                                aria-label="Editar ticker"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => withPermission('tickers.delete', () => setTickerToDelete(ticker))}
                                                aria-label="Eliminar ticker"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Paginación */}
                    <div className="mt-6">
                        <SharedPagination links={tickers.links} />
                    </div>
                </>
            )}

            {/* Sheet: Crear / Editar */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>{editingTicker ? 'Editar Ticker' : 'Nuevo Ticker'}</SheetTitle>
                        <SheetDescription>Configura el mensaje y estilo de tu barra promocional.</SheetDescription>
                    </SheetHeader>

                    <form onSubmit={submit} className="space-y-6 mt-6">
                        {/* Preview animado */}
                        <div className="space-y-2">
                            <Label>Vista previa</Label>
                            <div className="overflow-hidden rounded-lg">
                                <div
                                    className="w-full py-2.5 px-4 font-bold text-center text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                                    style={{
                                        backgroundColor: formData.background_color,
                                        color: formData.text_color,
                                    }}
                                >
                                    <span>{formData.content || 'Escribe tu mensaje...'}</span>
                                    {formData.link && <ExternalLink className="w-3 h-3 shrink-0" />}
                                </div>
                            </div>
                        </div>

                        {/* Contenido + Emojis */}
                        <div className="space-y-2">
                            <Label htmlFor="content">Mensaje</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="content"
                                    ref={contentInputRef}
                                    value={formData.content}
                                    onChange={e => setField('content', e.target.value)}
                                    placeholder="Ej: 🔥 Envíos gratis por compras superiores a $50.000"
                                    required
                                    maxLength={255}
                                    className="flex-1"
                                />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button type="button" variant="outline" size="icon" className="shrink-0" title="Agregar emoji">
                                            <Smile className="w-5 h-5 text-gray-500" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-2" align="end">
                                        <div className="flex flex-wrap gap-1">
                                            {EMOJI_LIST.map(emoji => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => insertEmoji(emoji)}
                                                    className="h-8 w-8 flex items-center justify-center text-lg hover:bg-slate-100 rounded transition-colors"
                                                    aria-label={`Insertar ${emoji}`}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            {errors.content && <p className="text-destructive text-xs">{errors.content}</p>}
                        </div>

                        {/* Color de fondo */}
                        <ColorPicker label="Color de fondo" field="background_color" />

                        {/* Color de texto */}
                        <ColorPicker label="Color de texto" field="text_color" />

                        {/* Link */}
                        <div className="space-y-2">
                            <Label htmlFor="link" className="flex items-center gap-2">
                                <LinkIcon className="w-4 h-4" /> Enlace (opcional)
                            </Label>
                            <Input
                                id="link"
                                value={formData.link}
                                onChange={e => setField('link', e.target.value)}
                                placeholder="https://..."
                                type="url"
                            />
                            <p className="text-[10px] text-muted-foreground">Si agregas un enlace, toda la barra será cliqueable.</p>
                            {errors.link && <p className="text-destructive text-xs">{errors.link}</p>}
                        </div>

                        {/* Orden */}
                        <div className="space-y-2">
                            <Label htmlFor="order">Orden de aparición</Label>
                            <Input
                                id="order"
                                type="number"
                                min={0}
                                value={formData.order}
                                onChange={e => setField('order', parseInt(e.target.value) || 0)}
                            />
                            <p className="text-[10px] text-muted-foreground">Menor número = aparece primero.</p>
                            {errors.order && <p className="text-destructive text-xs">{errors.order}</p>}
                        </div>

                        {/* Activo */}
                        <div className="flex items-center justify-between border p-3 rounded-lg bg-slate-50">
                            <Label htmlFor="is_active" className="cursor-pointer">Activar inmediatamente</Label>
                            <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => setField('is_active', checked)}
                            />
                        </div>

                        {/* Acciones */}
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsSheetOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Guardando...'
                                    : editingTicker ? 'Guardar cambios' : 'Crear ticker'
                                }
                            </Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>

            {/* AlertDialog: Eliminar */}
            <AlertDialog open={!!tickerToDelete} onOpenChange={(open) => !open && setTickerToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar ticker?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El ticker dejará de mostrarse en tu tienda.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={processing}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {processing ? 'Eliminando...' : 'Eliminar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
