import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
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
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from '@/Components/ui/empty';
import { Plus, Edit, Trash2, Video, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageProps } from '@/types';
import SharedPagination from '@/Components/Shared/Pagination';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';

interface ShortItem {
    id: number;
    name: string;
    description: string | null;
    location_id: number;
    location: { id: number; name: string } | null;
    link_type: string;
    external_url: string | null;
    linkable_type: string | null;
    linkable_id: number | null;
    link_label: string;
    sort_order: number;
    is_active: boolean;
}

interface Props {
    shorts: {
        data: ShortItem[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
    shorts_limit: number | null;
    shorts_count: number;
}

export default function Index({ shorts, shorts_limit, shorts_count }: Props) {
    const { currentTenant, currentUserRole } = usePage<PageProps>().props;
    const [shortToDelete, setShortToDelete] = useState<ShortItem | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    const atLimit = shorts_limit !== null && shorts_count >= shorts_limit;

    const hasPermission = (permission: string) => {
        if (!currentUserRole) return false;
        return currentUserRole.is_owner === true
            || currentUserRole.permissions?.includes('*') === true
            || currentUserRole.permissions?.includes(permission) === true;
    };

    const handleDelete = () => {
        if (!shortToDelete) return;
        if (!hasPermission('shorts.delete')) {
            setShowPermissionModal(true);
            return;
        }
        router.delete(route('tenant.shorts.destroy', [currentTenant?.slug, shortToDelete.id]), {
            onSuccess: () => {
                toast.success('Short eliminado');
                setShortToDelete(null);
            },
        });
    };

    const toggleActive = (short: ShortItem) => {
        if (!hasPermission('shorts.update')) {
            setShowPermissionModal(true);
            return;
        }
        setTogglingId(short.id);
        router.patch(route('tenant.shorts.toggle-active', [currentTenant?.slug, short.id]), {}, {
            onSuccess: () => toast.success('Estado actualizado'),
            onFinish: () => setTogglingId(null),
        });
    };

    return (
        <AdminLayout title="Shorts">
            <Head title="Shorts" />
            <PermissionDeniedModal open={showPermissionModal} onOpenChange={setShowPermissionModal} />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Shorts</h1>
                    <p className="text-sm text-muted-foreground">
                        Gestiona los shorts promocionales por sede.
                        {shorts_limit !== null && (
                            <span className="ml-1 font-medium text-foreground">
                                ({shorts_count} / {shorts_limit} usados)
                            </span>
                        )}
                    </p>
                </div>
                <Button
                    asChild
                    disabled={atLimit}
                    title={atLimit ? 'Has alcanzado el máximo de shorts permitidos en tu plan' : undefined}
                >
                    <Link
                        href={route('tenant.shorts.create', currentTenant?.slug)}
                        onClick={(e) => {
                            if (!hasPermission('shorts.create')) {
                                e.preventDefault();
                                setShowPermissionModal(true);
                            }
                            if (atLimit) e.preventDefault();
                        }}
                        className="gap-2"
                    >
                        <Plus className="w-4 h-4" /> Nuevo short
                    </Link>
                </Button>
            </div>

            {shorts.data.length === 0 ? (
                <Card>
                    <CardContent className="py-16">
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <Video className="h-5 w-5" />
                                </EmptyMedia>
                                <EmptyTitle>No hay shorts creados</EmptyTitle>
                                <EmptyDescription>
                                    Crea shorts por sede con enlace a categoría, producto o URL para mostrar en la portada.
                                </EmptyDescription>
                            </EmptyHeader>
                            <Button
                                asChild
                                disabled={atLimit}
                                className="gap-2 mt-4"
                            >
                                <Link href={route('tenant.shorts.create', currentTenant?.slug)}>
                                    <Plus className="w-4 h-4" /> Crear primer short
                                </Link>
                            </Button>
                        </Empty>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Sede</TableHead>
                                    <TableHead>Enlace</TableHead>
                                    <TableHead className="w-20 text-center">Orden</TableHead>
                                    <TableHead className="w-24 text-center">Activo</TableHead>
                                    <TableHead className="w-[120px] text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {shorts.data.map((short) => (
                                    <TableRow key={short.id}>
                                        <TableCell>
                                            <span className="font-medium">{short.name}</span>
                                            {short.description && (
                                                <span className="block text-xs text-muted-foreground truncate max-w-[200px]">
                                                    {short.description}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>{short.location?.name ?? '—'}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm max-w-[180px] truncate" title={short.link_label}>
                                            {short.link_label || '—'}
                                        </TableCell>
                                        <TableCell className="text-center">{short.sort_order}</TableCell>
                                        <TableCell className="text-center">
                                            {togglingId === short.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                            ) : (
                                                <Switch
                                                    checked={short.is_active}
                                                    onCheckedChange={() => toggleActive(short)}
                                                    disabled={!hasPermission('shorts.update')}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    onClick={(e) => !hasPermission('shorts.update') && (e.preventDefault(), setShowPermissionModal(true))}
                                                >
                                                    <Link href={route('tenant.shorts.edit', [currentTenant?.slug, short.id])}>
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        if (hasPermission('shorts.delete')) setShortToDelete(short);
                                                        else setShowPermissionModal(true);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {shorts.last_page > 1 && (
                            <SharedPagination
                                links={shorts.links}
                                className="border-t p-2"
                            />
                        )}
                    </CardContent>
                </Card>
            )}

            <AlertDialog open={!!shortToDelete} onOpenChange={(open) => !open && setShortToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar short?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Se eliminará &quot;{shortToDelete?.name}&quot;. Esta acción no se puede deshacer.
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
