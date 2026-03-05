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
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import SharedPagination from '@/Components/Shared/Pagination';

export interface ChurchCollaboratorItem {
    id: number;
    name: string;
    role: string | null;
    photo: string | null;
    order: number;
    is_published: boolean;
    created_at: string;
}

type PaginationLink = { url: string | null; label: string; active: boolean };

interface Props {
    collaborators: {
        data: ChurchCollaboratorItem[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function Index({ collaborators }: Props) {
    const { currentTenant, currentUserRole } = usePage<PageProps>().props;
    const [collaboratorToDelete, setCollaboratorToDelete] = useState<ChurchCollaboratorItem | null>(null);
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
        if (!collaboratorToDelete) return;
        router.delete(route('tenant.admin.collaborators.destroy', [currentTenant?.slug, collaboratorToDelete.id]), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Colaborador eliminado correctamente');
                setCollaboratorToDelete(null);
            },
            onError: () => toast.error('No se pudo eliminar el colaborador'),
        });
    };

    const togglePublished = (c: ChurchCollaboratorItem) => {
        if (togglingId !== null) return;
        setTogglingId(c.id);
        router.patch(route('tenant.admin.collaborators.toggle-published', [currentTenant?.slug, c.id]), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(c.is_published ? 'Colaborador despublicado' : 'Colaborador publicado');
                setTogglingId(null);
            },
            onError: () => {
                toast.error('Error al actualizar');
                setTogglingId(null);
            },
        });
    };

    return (
        <AdminLayout title="Colaboradores">
            <Head title="Colaboradores" />

            <PermissionDeniedModal open={showPermissionModal} onOpenChange={setShowPermissionModal} />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Colaboradores</h1>
                    <p className="text-sm text-muted-foreground">
                        Equipo y ministerios. Se muestran en la web en la sección Nuestro equipo.
                    </p>
                </div>
                <Button
                    onClick={() => withPermission('collaborators.create', () => router.visit(route('tenant.admin.collaborators.create', currentTenant?.slug)))}
                    className="gap-2"
                >
                    <Plus className="w-4 h-4" /> Nuevo colaborador
                </Button>
            </div>

            {collaborators.data.length === 0 ? (
                <Card>
                    <CardContent className="py-16">
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <Users className="h-5 w-5" />
                                </EmptyMedia>
                                <EmptyTitle>No hay colaboradores</EmptyTitle>
                                <EmptyDescription>
                                    Añade pastores, líderes y voluntarios con nombre, cargo, foto y biografía para la página Nuestro equipo.
                                </EmptyDescription>
                            </EmptyHeader>
                            <Button
                                onClick={() => withPermission('collaborators.create', () => router.visit(route('tenant.admin.collaborators.create', currentTenant?.slug)))}
                                className="gap-2 mt-4"
                            >
                                <Plus className="w-4 h-4" /> Crear primer colaborador
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
                                        <TableHead className="w-[80px]">Foto</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Cargo</TableHead>
                                        <TableHead className="text-center">Orden</TableHead>
                                        <TableHead className="text-center">Publicado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {collaborators.data.map((c) => (
                                        <TableRow key={c.id}>
                                            <TableCell>
                                                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted border">
                                                    {c.photo ? (
                                                        <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Users className="w-6 h-6 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{c.name}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{c.role || '—'}</TableCell>
                                            <TableCell className="text-center text-muted-foreground">{c.order}</TableCell>
                                            <TableCell className="text-center">
                                                <Switch
                                                    checked={c.is_published}
                                                    onCheckedChange={() => withPermission('collaborators.update', () => togglePublished(c))}
                                                    disabled={togglingId === c.id}
                                                    aria-label={c.is_published ? 'Despublicar' : 'Publicar'}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button size="icon" variant="ghost" asChild>
                                                        <Link href={route('tenant.admin.collaborators.edit', [currentTenant?.slug, c.id])} aria-label="Editar">
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => withPermission('collaborators.delete', () => setCollaboratorToDelete(c))}
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
                        {collaborators.data.map((c) => (
                            <Card key={c.id}>
                                <CardContent className="p-4">
                                    <div className="flex gap-3">
                                        <div className="w-14 h-14 rounded-full overflow-hidden bg-muted border flex-shrink-0">
                                            {c.photo ? (
                                                <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Users className="w-7 h-7 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{c.name}</p>
                                            {c.role && <p className="text-sm text-muted-foreground truncate">{c.role}</p>}
                                            <div className="flex items-center justify-between mt-3">
                                                <Switch
                                                    checked={c.is_published}
                                                    onCheckedChange={() => withPermission('collaborators.update', () => togglePublished(c))}
                                                    disabled={togglingId === c.id}
                                                />
                                                <div className="flex gap-1">
                                                    <Button size="icon" variant="ghost" asChild>
                                                        <Link href={route('tenant.admin.collaborators.edit', [currentTenant?.slug, c.id])}>
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-destructive"
                                                        onClick={() => withPermission('collaborators.delete', () => setCollaboratorToDelete(c))}
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

                    {collaborators.last_page > 1 && (
                        <div className="mt-4">
                            <SharedPagination links={collaborators.links} />
                        </div>
                    )}
                </>
            )}

            <AlertDialog open={!!collaboratorToDelete} onOpenChange={(open) => !open && setCollaboratorToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar colaborador?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Se eliminará a &quot;{collaboratorToDelete?.name}&quot;. Esta acción no se puede deshacer.
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
