import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, router, usePage, Link } from '@inertiajs/react';
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
    Navigation2,
    Eye,
    Loader2,
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Switch } from '@/Components/ui/switch';
import SharedPagination from '@/Components/Shared/Pagination';
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

type OpeningHoursSlot = { open: string; close: string };
type OpeningHours = Record<string, OpeningHoursSlot[]>;
type SocialNetworks = { facebook?: string; instagram?: string; tiktok?: string };

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
    opening_hours: OpeningHours | null;
    social_networks: SocialNetworks | null;
    is_active: boolean;
}

type PaginationLink = { url: string | null; label: string; active: boolean };

interface Props {
    locations: {
        data: Location[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
    locations_limit: number | null;
    locations_count: number;
}

export default function Index({ locations, locations_limit, locations_count }: Props) {
    const { currentTenant, currentUserRole } = usePage<PageProps>().props;
    const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);
    const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    const hasPermission = (permission: string) => {
        if (!currentUserRole) return false;
        return currentUserRole.is_owner === true
            || currentUserRole.permissions?.includes('*') === true
            || currentUserRole.permissions?.includes(permission) === true;
    };

    const atLimit = locations_limit !== null && locations_count >= locations_limit;

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
                const first = errors?.delete ?? Object.values(errors ?? {})[0];
                const msg = Array.isArray(first) ? first[0] : first;
                setLocationToDelete(null);
                setDeleteErrorMessage((msg as string) || 'Error al eliminar la sede');
            },
        });
    };

    const toggleActive = (location: Location) => {
        if (!hasPermission('locations.update')) {
            setShowPermissionModal(true);
            return;
        }
        setTogglingId(location.id);
        const nextActive = !location.is_active;
        router.patch(route('tenant.locations.toggle-active', [currentTenant?.slug, location.id]), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Estado actualizado'),
            onError: () => {
                toast.error('No se pudo actualizar el estado');
                setTogglingId(null);
            },
            onFinish: () => setTogglingId(null),
        });
    };

    const handleProtectedAction = (e: React.MouseEvent, permission: string) => {
        if (!hasPermission(permission)) {
            e.preventDefault();
            e.stopPropagation();
            setShowPermissionModal(true);
        }
    };

    const isEmpty = locations.data.length === 0;

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
                        {locations_limit !== null && (
                            <span className="ml-1 font-medium text-foreground">
                                ({locations_count} / {locations_limit} usados)
                            </span>
                        )}
                    </p>
                </div>
                {atLimit ? (
                    <Button
                        className="cursor-pointer font-bold"
                        disabled
                        title="Has alcanzado el máximo de sedes permitidas en tu plan"
                    >
                        <Plus className="mr-2 size-4" /> Nueva Sede
                    </Button>
                ) : (
                    <Link
                        href={route('tenant.locations.create', currentTenant?.slug)}
                        onClick={(e) => handleProtectedAction(e, 'locations.create')}
                    >
                        <Button className="cursor-pointer font-bold">
                            <Plus className="mr-2 size-4" /> Nueva Sede
                        </Button>
                    </Link>
                )}
            </div>

            {isEmpty ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="rounded-full bg-primary/10 p-4 mb-4">
                            <MapPin className="size-12 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No tienes sedes registradas</h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                            Crea tu primera sede para gestionar ubicaciones, horarios y contacto.
                        </p>
                        {!atLimit && (
                            <Link href={route('tenant.locations.create', currentTenant?.slug)}>
                                <Button className="cursor-pointer font-bold">
                                    <Plus className="mr-2 size-4" /> Crear primera sede
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Desktop: table */}
                    <Card className="hidden md:block">
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
                                    {locations.data.map((location) => (
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
                                                        disabled={togglingId === location.id}
                                                        className="cursor-pointer"
                                                    />
                                                    {togglingId === location.id && (
                                                        <Loader2 className="size-4 animate-spin ml-1 inline text-muted-foreground" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Link href={route('tenant.locations.show', [currentTenant?.slug, location.id])}>
                                                        <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-600 hover:text-primary hover:bg-primary/5 cursor-pointer">
                                                            <Eye className="size-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('tenant.locations.edit', [currentTenant?.slug, location.id])} onClick={(e) => handleProtectedAction(e, 'locations.update')}>
                                                        <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-600 hover:text-primary hover:bg-primary/5 cursor-pointer">
                                                            <Edit className="size-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 text-red-600 hover:bg-red-50 cursor-pointer"
                                                        onClick={(e) => { handleProtectedAction(e, 'locations.delete'); setLocationToDelete(location); }}
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

                    {/* Mobile: cards */}
                    <div className="md:hidden space-y-3">
                        {locations.data.map((location) => (
                            <Card key={location.id} className="overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-bold text-gray-900">{location.name}</span>
                                                {location.is_main && (
                                                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] uppercase py-0">
                                                        Principal
                                                    </Badge>
                                                )}
                                            </div>
                                            <span className="text-xs text-muted-foreground">{location.manager || 'Sin encargado'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Switch
                                                checked={location.is_active}
                                                onCheckedChange={() => toggleActive(location)}
                                                disabled={togglingId === location.id}
                                                className="cursor-pointer"
                                            />
                                            {togglingId === location.id && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                                        </div>
                                    </div>
                                    {(location.address || location.city) && (
                                        <p className="text-xs text-muted-foreground truncate mb-2">
                                            {[location.address, location.city, location.state].filter(Boolean).join(', ')}
                                        </p>
                                    )}
                                    <div className="flex justify-end gap-1 pt-2 border-t">
                                        <Link href={route('tenant.locations.show', [currentTenant?.slug, location.id])}>
                                            <Button size="sm" variant="ghost" className="h-8 cursor-pointer"><Eye className="size-4" /></Button>
                                        </Link>
                                        <Link href={route('tenant.locations.edit', [currentTenant?.slug, location.id])} onClick={(e) => handleProtectedAction(e, 'locations.update')}>
                                            <Button size="sm" variant="ghost" className="h-8 cursor-pointer"><Edit className="size-4" /></Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 text-red-600 hover:bg-red-50 cursor-pointer"
                                            onClick={(e) => { handleProtectedAction(e, 'locations.delete'); setLocationToDelete(location); }}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-6">
                        <SharedPagination links={locations.links} />
                    </div>
                </>
            )}

            <AlertDialog open={!!locationToDelete} onOpenChange={(open) => !open && setLocationToDelete(null)}>
                <AlertDialogContent className="border-red-100">
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar esta sede?</AlertDialogTitle>
                        <AlertDialogDescription>
                            La sede <span className="font-bold text-gray-900">{locationToDelete?.name}</span> se eliminará de forma permanente.
                            {locationToDelete && !locationToDelete.is_main && ' Se perderán los datos de contacto y ubicación asociados.'}
                            {locationToDelete?.is_main && ' No se puede eliminar la sede principal.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                        {locationToDelete && !locationToDelete.is_main && (
                            <AlertDialogAction variant="destructive" onClick={handleDelete} className="cursor-pointer">
                                Eliminar sede
                            </AlertDialogAction>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!deleteErrorMessage} onOpenChange={(open) => !open && setDeleteErrorMessage(null)}>
                <AlertDialogContent className="border-amber-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle>No se puede eliminar la sede</AlertDialogTitle>
                        <AlertDialogDescription className="text-left">
                            {deleteErrorMessage}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setDeleteErrorMessage(null)} className="cursor-pointer">
                            Entendido
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <PermissionDeniedModal open={showPermissionModal} onOpenChange={setShowPermissionModal} />
        </AdminLayout>
    );
}
