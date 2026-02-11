import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import { PageProps } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import {
    Plus,
    Edit,
    Trash2,
    MapPin,
    Smartphone,
    Clock,
    Globe,
    CheckCircle2,
    AlertCircle,
    Copy,
    Navigation2,
    Eye
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/Components/ui/table";
import { Badge } from '@/Components/ui/badge';
import { Switch } from "@/Components/ui/switch";
import SharedPagination from '@/Components/Shared/Pagination';
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

interface Location {
    id: number;
    name: string;
    manager: string | null;
    description: string | null;
    is_main: boolean;
    phone: string | null;
    whatsapp: string | null;
    whatsapp_message: string | null;
    state: string | null;
    city: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    opening_hours: any | null;
    social_networks: any | null;
    is_active: boolean;
}

interface Props {
    locations: {
        data: Location[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function Index({ locations }: Props) {
    const { currentTenant, currentUserRole } = usePage<PageProps>().props;
    const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    const hasPermission = (permission: string) => {
        return currentUserRole?.permissions?.includes(permission);
    };

    const handleDelete = () => {
        if (!locationToDelete) return;
        if (!hasPermission('locations.delete')) {
            setShowPermissionModal(true);
            return;
        }

        router.delete(route('tenant.locations.destroy', [currentTenant?.slug, locationToDelete.id]), {
            onSuccess: () => {
                toast.success('Sede eliminada correctamente');
                setLocationToDelete(null);
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] as string || 'Error al eliminar la sede');
            }
        });
    };

    const toggleActive = (location: Location) => {
        if (!hasPermission('locations.update')) {
            setShowPermissionModal(true);
            return;
        }

        router.patch(route('tenant.locations.toggle-active', [currentTenant?.slug, location.id]), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Estado actualizado'),
        });
    };

    const handleProtectedAction = (e: React.MouseEvent, permission: string) => {
        if (!hasPermission(permission)) {
            e.preventDefault();
            e.stopPropagation();
            setShowPermissionModal(true);
        }
    };

    return (
        <AdminLayout title="Gestión de Sedes">
            <Head title="Sedes y Puntos de Venta" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <MapPin className="size-6 text-primary" />
                        Sedes y Puntos de Venta
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Administra las ubicaciones físicas de tu negocio y sus horarios.
                    </p>
                </div>
                <Link
                    href={route('tenant.locations.create', currentTenant?.slug)}
                    onClick={(e) => handleProtectedAction(e, 'locations.create')}
                >
                    <Button className="cursor-pointer font-bold">
                        <Plus className="mr-2 size-4" /> Nueva Sede
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-bold">Sede</TableHead>
                                <TableHead className="font-bold">Ubicación</TableHead>
                                <TableHead className="font-bold">Contacto</TableHead>
                                <TableHead className="text-center font-bold">Estado</TableHead>
                                <TableHead className="text-right font-bold">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {locations.data.length > 0 ? (
                                locations.data.map((location) => (
                                    <TableRow key={location.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900">{location.name}</span>
                                                    {location.is_main && (
                                                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] uppercase tracking-wider py-0">
                                                            Principal
                                                        </Badge>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground">{location.manager || 'Sin encargado'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col max-w-[250px]">
                                                <span className="text-sm truncate" title={location.address || '—'}>
                                                    {location.address || '—'}
                                                </span>
                                                <span className="text-xs text-muted-foreground lowercase">
                                                    {location.city}, {location.state}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {location.phone && (
                                                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                                                        <Smartphone className="size-3" />
                                                        {location.phone}
                                                    </div>
                                                )}
                                                {location.whatsapp && (
                                                    <div className="flex items-center text-xs text-green-600 font-medium gap-1">
                                                        <Navigation2 className="size-3" />
                                                        WhatsApp
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center">
                                                <Switch
                                                    checked={location.is_active}
                                                    onCheckedChange={() => toggleActive(location)}
                                                    className="cursor-pointer"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={route('tenant.locations.show', [currentTenant?.slug, location.id])}>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 text-slate-600 hover:text-primary hover:bg-primary/5 cursor-pointer"
                                                    >
                                                        <Eye className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={route('tenant.locations.edit', [currentTenant?.slug, location.id])}
                                                    onClick={(e) => handleProtectedAction(e, 'locations.update')}
                                                >
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 text-slate-600 hover:text-primary hover:bg-primary/5 cursor-pointer"
                                                    >
                                                        <Edit className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-9 w-9 text-slate-600 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                                    onClick={(e) => { handleProtectedAction(e, 'locations.delete'); setLocationToDelete(location); }}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                        No tienes sedes registradas todavía.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="mt-6">
                <SharedPagination links={locations.links} />
            </div>

            <AlertDialog open={!!locationToDelete} onOpenChange={(open) => !open && setLocationToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará la sede <span className="font-bold text-gray-900">{locationToDelete?.name}</span> permanentemente.
                            {locationToDelete && !locationToDelete.is_main && " Se perderán los datos de contacto y ubicación asociados."}
                            {locationToDelete && locationToDelete.is_main && " No se puede eliminar la sede principal."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                        {locationToDelete && !locationToDelete.is_main && (
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
                                Eliminar Sede
                            </AlertDialogAction>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />
        </AdminLayout>
    );
}
