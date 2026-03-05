import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
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
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import SharedPagination from '@/Components/Shared/Pagination';

export interface ChurchDevotionalItem {
    id: number;
    title: string;
    scripture_reference: string | null;
    date: string;
    cover_image: string | null;
    order: number;
    is_published: boolean;
    created_at: string;
}

type PaginationLink = { url: string | null; label: string; active: boolean };

interface Props {
    devotionals: {
        data: ChurchDevotionalItem[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Index({ devotionals }: Props) {
    const { currentTenant, currentUserRole } = usePage<PageProps>().props;
    const [devotionalToDelete, setDevotionalToDelete] = useState<ChurchDevotionalItem | null>(null);
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

    const handleDelete = () => {
        if (!devotionalToDelete) return;
        router.delete(route('tenant.admin.devotionals.destroy', [currentTenant?.slug, devotionalToDelete.id]), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Devocional eliminado correctamente');
                setDevotionalToDelete(null);
            },
            onError: () => toast.error('No se pudo eliminar el devocional'),
        });
    };

    const togglePublished = (d: ChurchDevotionalItem) => {
        if (togglingId !== null) return;
        setTogglingId(d.id);
        router.patch(route('tenant.admin.devotionals.toggle-published', [currentTenant?.slug, d.id]), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(d.is_published ? 'Devocional despublicado' : 'Devocional publicado');
                setTogglingId(null);
            },
            onError: () => {
                toast.error('Error al actualizar');
                setTogglingId(null);
            },
        });
    };

    return (
        <AdminLayout title="Devocionales">
            <Head title="Devocionales" />

            <PermissionDeniedModal open={showPermissionModal} onOpenChange={setShowPermissionModal} />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Devocionales</h1>
                    <p className="text-sm text-muted-foreground">
                        Reflexiones diarias con título, versículo, reflexión y portada.
                    </p>
                </div>
                <Button
                    onClick={() => withPermission('devotionals.create', () => router.visit(route('tenant.admin.devotionals.create', currentTenant?.slug)))}
                    className="gap-2"
                >
                    <Plus className="w-4 h-4" /> Nuevo devocional
                </Button>
            </div>

            {devotionals.data.length === 0 ? (
                <Card>
                    <CardContent className="py-16">
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <BookOpen className="h-5 w-5" />
                                </EmptyMedia>
                                <EmptyTitle>No hay devocionales</EmptyTitle>
                                <EmptyDescription>
                                    Crea tu primer devocional con título, versículo, reflexión, portada y opcionalmente video o enlace externo.
                                </EmptyDescription>
                            </EmptyHeader>
                            <Button
                                onClick={() => withPermission('devotionals.create', () => router.visit(route('tenant.admin.devotionals.create', currentTenant?.slug)))}
                                className="gap-2 mt-4"
                            >
                                <Plus className="w-4 h-4" /> Crear primer devocional
                            </Button>
                        </Empty>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <Card className="hidden md:block">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Portada</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Título</TableHead>
                                        <TableHead>Versículo</TableHead>
                                        <TableHead className="text-center">Publicado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {devotionals.data.map((d) => (
                                        <TableRow key={d.id}>
                                            <TableCell>
                                                <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-muted border">
                                                    {d.cover_image ? (
                                                        <img
                                                            src={d.cover_image}
                                                            alt={d.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <BookOpen className="w-6 h-6 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                                                {formatDate(d.date)}
                                            </TableCell>
                                            <TableCell className="font-medium max-w-[200px] truncate">
                                                {d.title}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm max-w-[140px] truncate">
                                                {d.scripture_reference || '—'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Switch
                                                    checked={d.is_published}
                                                    onCheckedChange={() => withPermission('devotionals.update', () => togglePublished(d))}
                                                    disabled={togglingId === d.id}
                                                    aria-label={d.is_published ? 'Despublicar' : 'Publicar'}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button size="icon" variant="ghost" asChild>
                                                        <Link href={route('tenant.admin.devotionals.edit', [currentTenant?.slug, d.id])} aria-label="Editar">
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => withPermission('devotionals.delete', () => setDevotionalToDelete(d))}
                                                        aria-label="Eliminar"
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

                    <div className="md:hidden space-y-3">
                        {devotionals.data.map((d) => (
                            <Card key={d.id}>
                                <CardContent className="p-4">
                                    <div className="flex gap-3">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted border flex-shrink-0">
                                            {d.cover_image ? (
                                                <img src={d.cover_image} alt={d.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{d.title}</p>
                                            <p className="text-sm text-muted-foreground mt-1">{formatDate(d.date)}</p>
                                            {d.scripture_reference && (
                                                <p className="text-xs text-muted-foreground mt-0.5 truncate">{d.scripture_reference}</p>
                                            )}
                                            <div className="flex items-center justify-between mt-3">
                                                <Switch
                                                    checked={d.is_published}
                                                    onCheckedChange={() => withPermission('devotionals.update', () => togglePublished(d))}
                                                    disabled={togglingId === d.id}
                                                />
                                                <div className="flex gap-1">
                                                    <Button size="icon" variant="ghost" asChild>
                                                        <Link href={route('tenant.admin.devotionals.edit', [currentTenant?.slug, d.id])}>
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-destructive"
                                                        onClick={() => withPermission('devotionals.delete', () => setDevotionalToDelete(d))}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {devotionals.last_page > 1 && (
                        <div className="mt-4">
                            <SharedPagination links={devotionals.links} />
                        </div>
                    )}
                </>
            )}

            <AlertDialog open={!!devotionalToDelete} onOpenChange={(open) => !open && setDevotionalToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar devocional?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Se eliminará &quot;{devotionalToDelete?.title}&quot;. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
