import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from '@/Components/ui/empty';
import { Mic2, Settings, RefreshCw, ExternalLink, Loader2, CalendarClock } from 'lucide-react';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import SharedPagination from '@/Components/Shared/Pagination';

interface SermonItem {
    id: number;
    youtube_video_id: string;
    title: string;
    published_at: string | null;
    thumbnail_url: string | null;
    formatted_duration: string | null;
    status: string;
    live_start_at: string | null;
    watch_url: string;
}

interface YoutubeConfig {
    youtube_channel_id: string | null;
    last_synced_at: string | null;
}

interface Props {
    sermons: {
        data: SermonItem[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
    youtube_config: YoutubeConfig;
}

const STATUS_LABELS: Record<string, string> = {
    live: 'En vivo',
    upcoming: 'Próximo',
    completed: 'Grabado',
};

function formatDate(d: string | null) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
}

function toDatetimeLocal(iso: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day}T${h}:${min}`;
}

export default function Index({ sermons, youtube_config }: Props) {
    const { currentTenant, currentUserRole } = usePage<PageProps>().props;
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [editingSermon, setEditingSermon] = useState<SermonItem | null>(null);
    const [editStatus, setEditStatus] = useState<string>('completed');
    const [editLiveStartAt, setEditLiveStartAt] = useState<string>('');
    const [saving, setSaving] = useState(false);

    const hasPermission = (permission: string) => {
        if (!currentUserRole) return false;
        return currentUserRole.is_owner === true
            || currentUserRole.permissions?.includes('*') === true
            || currentUserRole.permissions?.includes(permission) === true;
    };

    const withPermission = (permission: string, fn: () => void) => {
        if (hasPermission(permission)) fn();
        else setShowPermissionModal(true);
    };

    const handleSync = () => {
        withPermission('sermons.update', () => {
            setSyncing(true);
            router.post(route('tenant.admin.sermons.sync', currentTenant?.slug), {}, {
                preserveScroll: true,
                onSuccess: () => toast.success('Sincronización completada'),
                onError: () => toast.error('Error al sincronizar. Revisa el canal y la API key.'),
                onFinish: () => setSyncing(false),
            });
        });
    };

    const openEdit = (s: SermonItem) => {
        setEditingSermon(s);
        setEditStatus(s.status);
        setEditLiveStartAt(toDatetimeLocal(s.live_start_at));
    };

    const handleSaveProgram = () => {
        if (!editingSermon || !currentTenant?.slug) return;
        withPermission('sermons.update', () => {
            setSaving(true);
            router.put(
                route('tenant.admin.sermons.update', [currentTenant.slug, editingSermon.id]),
                {
                    status: editStatus,
                    live_start_at: editLiveStartAt.trim() || null,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Predica actualizada');
                        setEditingSermon(null);
                    },
                    onError: () => toast.error('Error al guardar'),
                    onFinish: () => setSaving(false),
                }
            );
        });
    };

    return (
        <AdminLayout title="Predicas">
            <Head title="Predicas" />

            <PermissionDeniedModal open={showPermissionModal} onOpenChange={setShowPermissionModal} />

            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Predicas</h1>
                        <p className="text-sm text-muted-foreground">
                            Vídeos sincronizados desde tu canal. En vivo y próximas se detectan solas al sincronizar; puedes editarlas si necesitas.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={route('tenant.admin.sermons.config', currentTenant?.slug)}>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Settings className="size-4" />
                                Configurar canal
                            </Button>
                        </Link>
                        <Button
                            size="sm"
                            className="gap-2"
                            disabled={syncing || !youtube_config.youtube_channel_id}
                            onClick={handleSync}
                        >
                            {syncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                            Sincronizar
                        </Button>
                    </div>
                </div>

                {youtube_config.last_synced_at && (
                    <p className="text-xs text-muted-foreground">
                        Última sincronización: {new Date(youtube_config.last_synced_at).toLocaleString('es')}
                    </p>
                )}

                {sermons.data.length === 0 ? (
                    <Card>
                        <CardContent className="py-16">
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <Mic2 className="h-5 w-5" />
                                    </EmptyMedia>
                                    <EmptyTitle>No hay predicas</EmptyTitle>
                                    <EmptyDescription>
                                        Configura tu canal de YouTube y pulsa Sincronizar para importar los vídeos y transmisiones.
                                    </EmptyDescription>
                                </EmptyHeader>
                                <div className="flex justify-center gap-2 mt-4">
                                    <Link href={route('tenant.admin.sermons.config', currentTenant?.slug)}>
                                        <Button variant="outline" className="gap-2">
                                            <Settings className="size-4" />
                                            Configurar canal
                                        </Button>
                                    </Link>
                                </div>
                            </Empty>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Miniatura</TableHead>
                                            <TableHead>Título</TableHead>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Duración</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sermons.data.map((s) => (
                                            <TableRow key={s.id}>
                                                <TableCell>
                                                    {s.thumbnail_url ? (
                                                        <img
                                                            src={s.thumbnail_url}
                                                            alt=""
                                                            className="w-20 h-11 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="w-20 h-11 bg-slate-100 rounded flex items-center justify-center">
                                                            <Mic2 className="size-5 text-slate-400" />
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium max-w-[280px] truncate" title={s.title}>
                                                    {s.title}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                                                    {formatDate(s.published_at)}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {s.formatted_duration ?? '—'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            s.status === 'live'
                                                                ? 'bg-red-50 text-red-700 border-red-200'
                                                                : s.status === 'upcoming'
                                                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                                    : ''
                                                        }
                                                    >
                                                        {STATUS_LABELS[s.status] ?? s.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 gap-1"
                                                            onClick={() => openEdit(s)}
                                                            aria-label="Programar transmisión"
                                                        >
                                                            <CalendarClock className="size-4" />
                                                            Programar
                                                        </Button>
                                                        <a
                                                            href={s.watch_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                                                            aria-label="Ver en YouTube"
                                                        >
                                                            <ExternalLink className="size-4" />
                                                        </a>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {sermons.last_page > 1 && (
                            <SharedPagination links={sermons.links} />
                        )}
                    </>
                )}

                <Dialog open={!!editingSermon} onOpenChange={(open) => !open && setEditingSermon(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Programar transmisión</DialogTitle>
                        </DialogHeader>
                        {editingSermon && (
                            <>
                                <p className="text-sm text-muted-foreground truncate" title={editingSermon.title}>
                                    {editingSermon.title}
                                </p>
                                <div className="grid gap-4 py-2">
                                    <div className="grid gap-2">
                                        <Label>Estado</Label>
                                        <Select value={editStatus} onValueChange={setEditStatus}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="live">En vivo</SelectItem>
                                                <SelectItem value="upcoming">Próxima transmisión</SelectItem>
                                                <SelectItem value="completed">Grabado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Fecha y hora de transmisión (opcional)</Label>
                                        <input
                                            type="datetime-local"
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            value={editLiveStartAt}
                                            onChange={(e) => setEditLiveStartAt(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Para &quot;Próxima transmisión&quot; o &quot;En vivo&quot; indica cuándo es o será la transmisión.
                                        </p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setEditingSermon(null)}>
                                        Cancelar
                                    </Button>
                                    <Button onClick={handleSaveProgram} disabled={saving} className="gap-2">
                                        {saving && <Loader2 className="size-4 animate-spin" />}
                                        Guardar
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
