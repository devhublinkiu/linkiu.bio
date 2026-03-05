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
import { Plus, Edit, Trash2, Briefcase } from 'lucide-react';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import SharedPagination from '@/Components/Shared/Pagination';

export interface ChurchServiceItem {
    id: number;
    name: string;
    description: string | null;
    audience: string | null;
    service_type: string | null;
    schedule: string | null;
    frequency: string | null;
    duration: string | null;
    location: string | null;
    modality: string | null;
    image_url: string | null;
    leader: string | null;
    contact_info: string | null;
    external_url: string | null;
    order: number;
    is_active: boolean;
    created_at: string;
}

type PaginationLink = { url: string | null; label: string; active: boolean };

interface Props {
    services: {
        data: ChurchServiceItem[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function Index({ services }: Props) {
    const { currentTenant, currentUserRole } = usePage<PageProps>().props;
    const [serviceToDelete, setServiceToDelete] = useState<ChurchServiceItem | null>(null);
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
        if (!serviceToDelete) return;
        router.delete(route('tenant.admin.services.destroy', [currentTenant?.slug, serviceToDelete.id]), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Servicio eliminado correctamente');
                setServiceToDelete(null);
            },
            onError: () => toast.error('No se pudo eliminar el servicio'),
        });
    };

    const toggleActive = (service: ChurchServiceItem) => {
        if (togglingId !== null) return;
        setTogglingId(service.id);
        router.put(route('tenant.admin.services.update', [currentTenant?.slug, service.id]), {
            name: service.name,
            description: service.description ?? '',
            schedule: service.schedule ?? '',
            location: service.location ?? '',
            image_url: service.image_url ?? '',
            order: service.order,
            is_active: !service.is_active,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(service.is_active ? 'Servicio desactivado' : 'Servicio activado');
                setTogglingId(null);
            },
            onError: () => {
                toast.error('Error al actualizar');
                setTogglingId(null);
            },
        });
    };

    return (
        <AdminLayout title="Mis Servicios">
            <Head title="Mis Servicios" />

            <PermissionDeniedModal open={showPermissionModal} onOpenChange={setShowPermissionModal} />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Mis Servicios</h1>
                    <p className="text-sm text-muted-foreground">
                        Cultos, reuniones y actividades que ofrece tu iglesia.
                    </p>
                </div>
                <Button
                    onClick={() => withPermission('services.create', () => router.visit(route('tenant.admin.services.create', currentTenant?.slug)))}
                    className="gap-2"
                >
                    <Plus className="w-4 h-4" /> Nuevo servicio
                </Button>
            </div>

            {services.data.length === 0 ? (
                <Card>
                    <CardContent className="py-16">
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <Briefcase className="h-5 w-5" />
                                </EmptyMedia>
                                <EmptyTitle>No hay servicios creados</EmptyTitle>
                                <EmptyDescription>
                                    Añade cultos, reuniones, estudios bíblicos o cualquier actividad que ofrezca tu iglesia. Luego podrás mostrarlos en tu enlace.
                                </EmptyDescription>
                            </EmptyHeader>
                            <Button
                                onClick={() => withPermission('services.create', () => router.visit(route('tenant.admin.services.create', currentTenant?.slug)))}
                                className="gap-2 mt-4"
                            >
                                <Plus className="w-4 h-4" /> Crear primer servicio
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
                                        <TableHead className="w-[100px]">Imagen</TableHead>
                                        <TableHead className="w-[40px]">#</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Horario</TableHead>
                                        <TableHead className="text-center">Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {services.data.map((service) => (
                                        <TableRow key={service.id}>
                                            <TableCell>
                                                <div className="relative w-24 h-12 rounded-lg overflow-hidden bg-muted border">
                                                    {service.image_url ? (
                                                        <img
                                                            src={service.image_url}
                                                            alt={service.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Briefcase className="w-6 h-6 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground font-mono text-xs">
                                                {service.order}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {service.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {service.schedule || '—'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Switch
                                                    checked={service.is_active}
                                                    onCheckedChange={() => withPermission('services.update', () => toggleActive(service))}
                                                    disabled={togglingId === service.id}
                                                    aria-label={service.is_active ? 'Desactivar' : 'Activar'}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        asChild
                                                    >
                                                        <Link href={route('tenant.admin.services.edit', [currentTenant?.slug, service.id])} aria-label="Editar">
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => withPermission('services.delete', () => setServiceToDelete(service))}
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
                        {services.data.map((service) => (
                            <Card key={service.id}>
                                <CardContent className="p-4">
                                    <div className="flex gap-3">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted border flex-shrink-0">
                                            {service.image_url ? (
                                                <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Briefcase className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{service.name}</p>
                                            {service.schedule && (
                                                <p className="text-sm text-muted-foreground mt-1">{service.schedule}</p>
                                            )}
                                            <div className="flex items-center justify-between mt-3">
                                                <Switch
                                                    checked={service.is_active}
                                                    onCheckedChange={() => withPermission('services.update', () => toggleActive(service))}
                                                    disabled={togglingId === service.id}
                                                />
                                                <div className="flex gap-1">
                                                    <Button size="icon" variant="ghost" asChild>
                                                        <Link href={route('tenant.admin.services.edit', [currentTenant?.slug, service.id])}>
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-destructive"
                                                        onClick={() => withPermission('services.delete', () => setServiceToDelete(service))}
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

                    {services.last_page > 1 && (
                        <div className="mt-4">
                            <SharedPagination links={services.links} />
                        </div>
                    )}
                </>
            )}

            <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Se eliminará &quot;{serviceToDelete?.name}&quot;. Esta acción no se puede deshacer.
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
