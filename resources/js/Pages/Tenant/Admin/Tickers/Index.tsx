import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { Badge } from '@/Components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
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
} from "@/Components/ui/alert-dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Plus, Edit, Trash2, ExternalLink, Megaphone, Link as LinkIcon, Palette, Smile } from "lucide-react";
import { toast } from 'sonner';
import { PageProps } from '@/types';
import { cn } from "@/lib/utils";
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';

interface Ticker {
    id: number;
    content: string;
    link?: string;
    background_color: string;
    is_active: boolean;
    created_at: string;
}

interface Props {
    tickers: Ticker[];
}

const PRESET_COLORS = [
    { name: 'Negro', value: '#000000' },
    { name: 'Rojo', value: '#EF4444' },
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Verde', value: '#22C55E' },
    { name: 'Naranja', value: '#F97316' },
    { name: 'Púrpura', value: '#A855F7' },
];

const EMOJI_LIST = [
    "🔥", "🎉", "🚀", "📢", "🏷️", "🎁", "💎", "✨", "⭐", "⚡",
    "🚚", "📦", "💳", "📍", "👉", "⚠️", "✅", "🆕",
    "🍔", "🍕", "🍣", "🥗", "☕", "🍺", "🍷", "🍰", "❤️", "💯"
];

export default function Index({ tickers }: Props) {
    const { currentTenant } = usePage<PageProps>().props;
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingTicker, setEditingTicker] = useState<Ticker | null>(null);
    const [tickerToDelete, setTickerToDelete] = useState<Ticker | null>(null);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const contentInputRef = React.useRef<HTMLInputElement>(null);

    const { currentUserRole } = usePage<PageProps>().props;

    const checkPermission = (permission: string) => {
        if (!currentUserRole) return false;
        return currentUserRole.is_owner ||
            currentUserRole.permissions.includes('*') ||
            currentUserRole.permissions.includes(permission);
    };

    const handleActionWithPermission = (permission: string, action: () => void) => {
        if (checkPermission(permission)) {
            action();
        } else {
            setShowPermissionModal(true);
        }
    };

    const { data, setData, processing, errors, reset, clearErrors } = useForm({
        content: '',
        link: '',
        background_color: '#000000',
        is_active: true,
    });

    const insertEmoji = (emoji: string) => {
        const input = contentInputRef.current;
        if (input) {
            const start = input.selectionStart || 0;
            const end = input.selectionEnd || 0;
            const text = data.content;
            const newText = text.substring(0, start) + emoji + text.substring(end);

            setData('content', newText);

            // Restore focus and cursor position after React update
            setTimeout(() => {
                input.focus();
                const newCursorPos = start + emoji.length;
                input.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
        } else {
            setData('content', data.content + emoji);
        }
    };

    const openCreate = () => {
        setEditingTicker(null);
        reset();
        clearErrors();
        setIsSheetOpen(true);
    };

    const openEdit = (ticker: Ticker) => {
        setEditingTicker(ticker);
        clearErrors();
        setData({
            content: ticker.content,
            link: ticker.link || '',
            background_color: ticker.background_color,
            is_active: ticker.is_active,
        });
        setIsSheetOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const permission = editingTicker ? 'tickers.update' : 'tickers.create';

        handleActionWithPermission(permission, () => {
            if (editingTicker) {
                router.put(route('tenant.admin.tickers.update', [currentTenant?.slug, editingTicker.id]), data, {
                    onSuccess: () => {
                        toast.success('Ticker actualizado');
                        setIsSheetOpen(false);
                    },
                    onError: () => toast.error('Error al actualizar'),
                });
            } else {
                router.post(route('tenant.admin.tickers.store', currentTenant?.slug), data, {
                    onSuccess: () => {
                        toast.success('Ticker creado');
                        setIsSheetOpen(false);
                    },
                    onError: () => toast.error('Error al crear'),
                });
            }
        });
    };

    const handleDelete = () => {
        if (!tickerToDelete) return;
        router.delete(route('tenant.admin.tickers.destroy', [currentTenant?.slug, tickerToDelete.id]), {
            onSuccess: () => {
                toast.success('Ticker eliminado');
                setTickerToDelete(null);
            },
        });
    };

    const toggleActive = (ticker: Ticker) => {
        handleActionWithPermission('tickers.update', () => {
            router.put(route('tenant.admin.tickers.update', [currentTenant?.slug, ticker.id]), {
                ...ticker,
                is_active: !ticker.is_active
            }, {
                onSuccess: () => toast.success('Estado actualizado'),
            });
        });
    };

    return (
        <AdminLayout title="Tickers Promocionales">
            <Head title="Tickers Promocionales" />

            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Tickers Promocionales</h1>
                    <p className="text-sm text-muted-foreground">Barra de anuncios y promociones en la parte superior de tu tienda.</p>
                </div>
                <Button onClick={() => handleActionWithPermission('tickers.create', openCreate)} className="gap-2">
                    <Plus className="w-4 h-4" /> Nuevo Ticker
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Mensaje</TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead>Enlace</TableHead>
                                <TableHead className="text-center">Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickers.map((ticker) => (
                                <TableRow key={ticker.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {ticker.content}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-6 h-6 rounded-full border shadow-sm"
                                                style={{ backgroundColor: ticker.background_color }}
                                            />
                                            <span className="text-xs font-mono text-muted-foreground">{ticker.background_color}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {ticker.link ? (
                                            <a href={ticker.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                                                <ExternalLink className="w-3 h-3" /> Ver enlace
                                            </a>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Switch
                                            checked={ticker.is_active}
                                            onCheckedChange={() => toggleActive(ticker)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="ghost" onClick={() => handleActionWithPermission('tickers.update', () => openEdit(ticker))}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleActionWithPermission('tickers.delete', () => setTickerToDelete(ticker))}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {tickers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No hay tickers creados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create/Edit Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>{editingTicker ? 'Editar Ticker' : 'Nuevo Ticker'}</SheetTitle>
                        <SheetDescription>Configura el mensaje y estilo de tu barra promocional.</SheetDescription>
                    </SheetHeader>

                    <form onSubmit={submit} className="space-y-6 mt-6">
                        {/* Preview */}
                        <div className="space-y-2">
                            <Label>Vista Previa</Label>
                            <div
                                className="w-full py-3 px-4 text-white font-medium text-center text-sm shadow-sm rounded-lg transition-colors flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap"
                                style={{ backgroundColor: data.background_color }}
                            >
                                <span>{data.content || 'Escribe tu mensaje...'}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <Label htmlFor="content">Mensaje</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="content"
                                    ref={contentInputRef}
                                    value={data.content}
                                    onChange={e => setData('content', e.target.value)}
                                    placeholder="Ej: 🔥 Envíos gratis por compras superiores a $50.000"
                                    required
                                    maxLength={255}
                                    className="flex-1"
                                />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button type="button" variant="outline" size="icon" className="shrink-0" title="Agregar Emoji">
                                            <Smile className="w-5 h-5 text-gray-500" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-2 justify-center" align="end">
                                        <div className="flex flex-wrap gap-1">
                                            {EMOJI_LIST.map(emoji => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => insertEmoji(emoji)}
                                                    className="h-8 w-8 flex items-center justify-center text-lg hover:bg-slate-100 rounded transition-colors"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            {errors.content && <p className="text-red-500 text-xs">{errors.content}</p>}
                        </div>

                        {/* Color Picker */}
                        <div className="space-y-3">
                            <Label>Color de Fondo</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {PRESET_COLORS.map(color => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setData('background_color', color.value)}
                                        className={cn(
                                            "w-8 h-8 rounded-full border border-gray-200 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900",
                                            data.background_color === color.value && "ring-2 ring-offset-2 ring-slate-900 scale-110"
                                        )}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <Input
                                        value={data.background_color}
                                        onChange={e => setData('background_color', e.target.value)}
                                        className="pl-9 font-mono"
                                        placeholder="#000000"
                                    />
                                </div>
                                <input
                                    type="color"
                                    value={data.background_color}
                                    onChange={e => setData('background_color', e.target.value)}
                                    className="h-10 w-10 p-1 rounded-md border cursor-pointer"
                                />
                            </div>
                            {errors.background_color && <p className="text-red-500 text-xs">{errors.background_color}</p>}
                        </div>

                        {/* Link Configuration */}
                        <div className="space-y-2">
                            <Label htmlFor="link" className="flex items-center gap-2">
                                <LinkIcon className="w-4 h-4" /> Enlace (Opcional)
                            </Label>
                            <Input
                                id="link"
                                value={data.link}
                                onChange={e => setData('link', e.target.value)}
                                placeholder="https://..."
                                type="url"
                            />
                            <p className="text-[10px] text-muted-foreground">Si agregas un enlace, toda la barra será cliqueable.</p>
                            {errors.link && <p className="text-red-500 text-xs">{errors.link}</p>}
                        </div>

                        <div className="space-y-2 flex items-center justify-between border p-3 rounded-lg bg-slate-50">
                            <Label htmlFor="is_active" className="cursor-pointer">Activar inmediatamente</Label>
                            <Switch
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked)}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsSheetOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={processing} className="bg-slate-900 text-white hover:bg-slate-800">
                                {editingTicker ? 'Guardar Cambios' : 'Crear Ticker'}
                            </Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>

            <AlertDialog open={!!tickerToDelete} onOpenChange={(open) => !open && setTickerToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar Ticker?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
