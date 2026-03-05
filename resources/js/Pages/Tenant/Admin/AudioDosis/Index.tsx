import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Switch } from '@/Components/ui/switch';
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from '@/Components/ui/empty';
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
import { Plus, Edit, Trash2, Headphones, Loader2 } from 'lucide-react';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import SharedPagination from '@/Components/Shared/Pagination';

interface Episode {
    id: number;
    title: string;
    audio_path: string;
    duration_seconds: number;
    sort_order: number;
    is_published: boolean;
    created_at: string;
}

interface Props {
    config: { page_title: string };
    episodes: {
        data: Episode[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Index({ config, episodes }: Props) {
    const { currentTenant, currentUserRole } = usePage<PageProps>().props;
    const [pageTitle, setPageTitle] = useState(config.page_title);
    const [savingTitle, setSavingTitle] = useState(false);
    const [episodeToDelete, setEpisodeToDelete] = useState<Episode | null>(null);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [togglingId, setTogglingId] = useState<number | null>(null);

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

    const savePageTitle = () => {
        setSavingTitle(true);
        router.put(route('tenant.admin.audio-dosis.update-config', currentTenant?.slug), { page_title: pageTitle }, {
            preserveScroll: true,
            onSuccess: () => toast.success('Título guardado'),
            onError: () => toast.error('No se pudo guardar'),
            onFinish: () => setSavingTitle(false),
        });
    };

    const handleDelete = () => {
        if (!episodeToDelete) return;
        router.delete(route('tenant.admin.audio-dosis.destroy', [currentTenant?.slug, episodeToDelete.id]), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Episodio eliminado');
                setEpisodeToDelete(null);
            },
            onError: () => toast.error('No se pudo eliminar'),
        });
    };

    const togglePublished = (ep: Episode) => {
        if (togglingId !== null) return;
        setTogglingId(ep.id);
        router.patch(route('tenant.admin.audio-dosis.toggle-published', [currentTenant?.slug, ep.id]), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(ep.is_published ? 'Episodio despublicado' : 'Episodio publicado');
                setTogglingId(null);
            },
            onError: () => {
                toast.error('Error al actualizar');
                setTogglingId(null);
            },
        });
    };

    return (
        <AdminLayout title="Audio Dosis">
            <Head title="Audio Dosis" />

            <PermissionDeniedModal open={showPermissionModal} onOpenChange={setShowPermissionModal} />

            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Headphones className="size-6 text-primary" />
                            Audio Dosis
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Episodios de audio. El título de la página pública se puede personalizar abajo.
                        </p>
                    </div>
                    <Button
                        onClick={() => withPermission('audio_dosis.create', () => router.visit(route('tenant.admin.audio-dosis.create', currentTenant?.slug)))}
                        className="gap-2 shrink-0"
                    >
                        <Plus className="size-4" /> Nuevo episodio
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="page_title">Título de la página pública</Label>
                                <Input
                                    id="page_title"
                                    value={pageTitle}
                                    onChange={(e) => setPageTitle(e.target.value)}
                                    onBlur={savePageTitle}
                                    placeholder="Ej: Audio Dosis"
                                />
                            </div>
                            {savingTitle && (
                                <div className="flex items-end">
                                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {episodes.data.length === 0 ? (
                    <Card>
                        <CardContent className="py-16">
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <Headphones className="h-5 w-5" />
                                    </EmptyMedia>
                                    <EmptyTitle>No hay episodios</EmptyTitle>
                                    <EmptyDescription>
                                        Crea el primer episodio para que aparezca en la página pública.
                                    </EmptyDescription>
                                </EmptyHeader>
                                <Button
                                    className="mt-4 gap-2"
                                    onClick={() => withPermission('audio_dosis.create', () => router.visit(route('tenant.admin.audio-dosis.create', currentTenant?.slug)))}
                                >
                                    <Plus className="size-4" /> Crear primer episodio
                                </Button>
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
                                            <TableHead>Título</TableHead>
                                            <TableHead>Duración</TableHead>
                                            <TableHead>Orden</TableHead>
                                            <TableHead>Publicado</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {episodes.data.map((ep) => (
                                            <TableRow key={ep.id}>
                                                <TableCell className="font-medium">{ep.title}</TableCell>
                                                <TableCell className="text-muted-foreground">{formatDuration(ep.duration_seconds)}</TableCell>
                                                <TableCell>{ep.sort_order}</TableCell>
                                                <TableCell>
                                                    <Switch
                                                        checked={ep.is_published}
                                                        onCheckedChange={() => withPermission('audio_dosis.update', () => togglePublished(ep))}
                                                        disabled={togglingId === ep.id}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={route('tenant.admin.audio-dosis.edit', [currentTenant?.slug, ep.id])}
                                                            className="inline-flex items-center gap-1 text-sm"
                                                        >
                                                            <Edit className="size-4" /> Editar
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => withPermission('audio_dosis.delete', () => setEpisodeToDelete(ep))}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        {episodes.last_page > 1 && (
                            <SharedPagination links={episodes.links} />
                        )}
                    </>
                )}
            </div>

            <AlertDialog open={!!episodeToDelete} onOpenChange={(open) => !open && setEpisodeToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar episodio?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Se eliminará &quot;{episodeToDelete?.title}&quot; y su archivo de audio. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
