import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Plus, Trash2, Edit, RefreshCw, QrCode, MoreHorizontal, MapPin, Hash, UserPlus } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/Components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
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
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/Components/ui/empty';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import { toast } from 'sonner';

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';
type TableStatusLegacy = TableStatus | 'active' | 'inactive';

interface Table {
    id: number;
    zone_id: number;
    location_id?: number;
    name: string;
    token: string;
    capacity: number | null;
    status: TableStatusLegacy;
}

interface Location {
    id: number;
    name: string;
    is_main: boolean;
}

interface Zone {
    id: number;
    name: string;
    location_id?: number;
    tables: Table[];
}

interface Props {
    zones: Zone[];
    locations: Location[];
    currentLocationId: number;
}

function normalizeTableStatus(s: Table['status']): TableStatus {
    if (s === 'active') return 'available';
    if (s === 'inactive') return 'maintenance';
    return s as TableStatus;
}

export default function Index({ zones, locations, currentLocationId }: Props) {
    const { currentTenant, currentUserRole, flash } = usePage<PageProps & { flash?: { error?: string; success?: string } }>().props;
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.error]);
    const [isZoneSheetOpen, setIsZoneSheetOpen] = useState(false);
    const [isTableSheetOpen, setIsTableSheetOpen] = useState(false);
    const [isBulkSheetOpen, setIsBulkSheetOpen] = useState(false);
    const [editingZone, setEditingZone] = useState<Zone | null>(null);
    const [editingTable, setEditingTable] = useState<Table | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'zone' | 'table', id: number } | null>(null);

    const hasPermission = (permission: string) => {
        if (!currentUserRole) return false;
        return currentUserRole.is_owner === true
            || currentUserRole.permissions?.includes('*') === true
            || currentUserRole.permissions?.includes(permission) === true;
    };
    const handleProtectedAction = (e: React.MouseEvent | null, permission: string, callback: () => void) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!hasPermission(permission)) {
            setShowPermissionModal(true);
        } else {
            callback();
        }
    };

    // Zone Form
    const zoneForm = useForm({
        name: '',
        location_id: currentLocationId.toString(),
    });

    // Table Form
    const tableForm = useForm<{
        zone_id: string;
        location_id: string;
        name: string;
        capacity: string;
        status: 'available' | 'occupied' | 'reserved' | 'maintenance';
    }>({
        zone_id: '',
        location_id: currentLocationId.toString(),
        name: '',
        capacity: '',
        status: 'available',
    });

    // Bulk Form
    const bulkForm = useForm({
        zone_id: '',
        location_id: currentLocationId.toString(),
        prefix: 'Mesa ',
        start_number: 1,
        count: 10,
        capacity: '',
    });

    const handleOpenZoneSheet = (zone?: Zone) => {
        if (zone) {
            setEditingZone(zone);
            zoneForm.setData({
                name: zone.name,
                location_id: (zone.location_id ?? currentLocationId).toString(),
            });
        } else {
            setEditingZone(null);
            zoneForm.reset('name');
            zoneForm.setData('location_id', currentLocationId.toString());
        }
        setIsZoneSheetOpen(true);
    };

    const handleOpenTableSheet = (table?: Table, zoneId?: number) => {
        if (table) {
            setEditingTable(table);
            tableForm.setData({
                zone_id: table.zone_id.toString(),
                name: table.name,
                capacity: table.capacity?.toString() || '',
                status: normalizeTableStatus(table.status),
                location_id: (table.location_id ?? currentLocationId).toString(),
            });
        } else {
            setEditingTable(null);
            tableForm.reset('name', 'capacity', 'status');
            tableForm.setData('location_id', currentLocationId.toString());
            if (zoneId) tableForm.setData('zone_id', zoneId.toString());
        }
        setIsTableSheetOpen(true);
    };

    const submitZone = (e: React.FormEvent) => {
        e.preventDefault();
        const onError = () => toast.error('Revisa los campos del formulario.');
        if (editingZone) {
            zoneForm.put(route('tenant.admin.zones.update', [currentTenant?.slug, editingZone.id]), {
                onSuccess: () => {
                    toast.success('Zona actualizada');
                    setIsZoneSheetOpen(false);
                },
                onError,
            });
        } else {
            zoneForm.post(route('tenant.admin.zones.store', currentTenant?.slug), {
                onSuccess: () => {
                    toast.success('Zona creada');
                    setIsZoneSheetOpen(false);
                },
                onError,
            });
        }
    };

    const submitTable = (e: React.FormEvent) => {
        e.preventDefault();
        const onError = () => toast.error('Revisa los campos del formulario.');
        if (editingTable) {
            tableForm.put(route('tenant.admin.tables.update', [currentTenant?.slug, editingTable.id]), {
                onSuccess: () => {
                    toast.success('Mesa actualizada');
                    setIsTableSheetOpen(false);
                },
                onError,
            });
        } else {
            tableForm.post(route('tenant.admin.tables.store', currentTenant?.slug), {
                onSuccess: () => {
                    toast.success('Mesa creada');
                    setIsTableSheetOpen(false);
                },
                onError,
            });
        }
    };

    const submitBulk = (e: React.FormEvent) => {
        e.preventDefault();
        bulkForm.post(route('tenant.admin.tables.bulk', currentTenant?.slug), {
            onSuccess: () => {
                toast.success('Mesas creadas masivamente');
                setIsBulkSheetOpen(false);
                bulkForm.reset();
            },
            onError: () => toast.error('No se pudieron crear las mesas. Revisa los campos o intenta con menos cantidad.'),
        });
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;

        const url = itemToDelete.type === 'zone'
            ? route('tenant.admin.zones.destroy', [currentTenant?.slug, itemToDelete.id])
            : route('tenant.admin.tables.destroy', [currentTenant?.slug, itemToDelete.id]);

        router.delete(url, {
            onSuccess: () => {
                toast.success(`${itemToDelete.type === 'zone' ? 'Zona' : 'Mesa'} eliminada`);
                setItemToDelete(null);
            },
            onError: () => toast.error('No se pudo eliminar. Inténtalo de nuevo.'),
        });
    };

    const regenerateToken = (tableId: number) => {
        router.post(route('tenant.admin.tables.regenerate-token', [currentTenant?.slug, tableId]), {}, {
            onSuccess: () => toast.success('Token regenerado. El QR antiguo ya no funcionará.')
        });
    };

    const getStatusBadge = (status: Table['status']) => {
        switch (status) {
            case 'available':
            case 'active': // Legacy
                return <Badge className="bg-emerald-500">Disponible</Badge>;
            case 'occupied':
                return <Badge className="bg-amber-500">Ocupada</Badge>;
            case 'reserved':
                return <Badge className="bg-indigo-500">Reservada</Badge>;
            case 'maintenance':
            case 'inactive': // Legacy
                return <Badge variant="outline" className="text-slate-400 border-slate-200 bg-slate-50">Mantenimiento</Badge>;
        }
    };

    return (
        <AdminLayout title="Mesas y Zonas">
            <Head title="Mesas y Zonas" />

            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Mesas y Zonas</h1>
                        <p className="text-sm text-muted-foreground">Organiza tus espacios y genera QRs para pedidos en mesa.</p>

                        {/* Location Selector */}
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sede:</span>
                            <Select
                                value={currentLocationId.toString()}
                                onValueChange={(val) => router.get(route('tenant.admin.tables.index', [currentTenant?.slug]), { location_id: val }, { preserveState: true })}
                            >
                                <SelectTrigger className="w-[200px] h-8 text-xs bg-white">
                                    <SelectValue placeholder="Seleccionar Sede" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map(loc => (
                                        <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                                variant="outline"
                                onClick={() => handleProtectedAction(null, 'tables.view', () => router.get(route('tenant.admin.tables.print', [currentTenant?.slug])))}
                            >
                                <QrCode className="w-4 h-4 mr-2" /> Centro de QRs
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleProtectedAction(null, 'tables.create', () => handleOpenZoneSheet())}
                            >
                                <MapPin className="w-4 h-4 mr-2" /> Nueva Zona
                            </Button>
                            <Button onClick={() => handleProtectedAction(null, 'tables.create', () => handleOpenTableSheet())}>
                                <Plus className="w-4 h-4 mr-2" /> Nueva Mesa
                            </Button>
                    </div>
                </div>

                {zones.length === 0 ? (
                    <Empty className="border-2 border-dashed rounded-xl bg-white py-12">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <MapPin className="size-4" />
                            </EmptyMedia>
                            <EmptyTitle>No hay zonas configuradas</EmptyTitle>
                            <EmptyDescription>
                                Empieza creando una zona como &quot;Salón Principal&quot; o &quot;Terraza&quot;.
                            </EmptyDescription>
                        </EmptyHeader>
                        <Button className="mt-4" onClick={() => handleProtectedAction(null, 'tables.create', () => handleOpenZoneSheet())}>
                            <Plus className="w-4 h-4 mr-2" /> Crear mi primera zona
                        </Button>
                    </Empty>
                ) : (
                    <div className="grid gap-6">
                        {zones.map((zone) => (
                            <Card key={zone.id} className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
                                <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between py-4">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            {zone.name}
                                            <Badge variant="outline" className="ml-2 bg-white">{zone.tables.length} mesas</Badge>
                                        </CardTitle>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleProtectedAction(null, 'tables.create', () => {
                                                setIsBulkSheetOpen(true);
                                                bulkForm.setData('zone_id', zone.id.toString());
                                            })}
                                        >
                                            <UserPlus className="w-4 h-4 mr-2" /> Carga Masiva
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleProtectedAction(null, 'tables.update', () => handleOpenZoneSheet(zone))}>
                                                    <Edit className="w-4 h-4 mr-2" /> Editar Zona
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 focus:text-red-700" onClick={() => handleProtectedAction(null, 'tables.delete', () => setItemToDelete({ type: 'zone', id: zone.id }))}>
                                                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar Zona
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-slate-200">
                                        {zone.tables.map((table) => (
                                            <div key={table.id} className="bg-white p-4 group hover:bg-slate-50 transition-colors">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{table.name}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {getStatusBadge(table.status)}
                                                            {table.capacity && (
                                                                <span className="text-xs text-muted-foreground flex items-center">
                                                                    <Hash className="w-3 h-3 mr-0.5" /> Cap. {table.capacity}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleProtectedAction(null, 'tables.update', () => handleOpenTableSheet(table))}>
                                                                <Edit className="w-4 h-4 mr-2" /> Editar Mesa
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleProtectedAction(null, 'tables.update', () => regenerateToken(table.id))}>
                                                                <RefreshCw className="w-4 h-4 mr-2" /> Regenerar Token
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600 focus:text-red-700" onClick={() => handleProtectedAction(null, 'tables.delete', () => setItemToDelete({ type: 'table', id: table.id }))}>
                                                                <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                <div className="flex flex-col gap-2 mt-4">
                                                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Acceso Cliente</div>
                                                    <div className="flex gap-2">
                                                        <Button variant="secondary" size="sm" className="flex-1 h-8 text-xs font-bold" onClick={() => window.open(`${window.location.origin}/${currentTenant?.slug}?m=${table.token}`, '_blank')}>
                                                            <QrCode className="w-3 h-3 mr-1.5" /> Ver QR
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => handleProtectedAction(null, 'tables.create', () => handleOpenTableSheet(undefined, zone.id))}
                                            className="bg-slate-50 border-2 border-dashed border-slate-200 p-4 flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:bg-white transition-all group cursor-pointer"
                                        >
                                            <Plus className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-bold uppercase tracking-tight">Agregar Mesa</span>
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Zone Sheet */}
            <Sheet open={isZoneSheetOpen} onOpenChange={setIsZoneSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{editingZone ? 'Editar Zona' : 'Nueva Zona'}</SheetTitle>
                        <SheetDescription>
                            Las zonas ayudan a organizar tus mesas (ej. Terraza, VIP).
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={submitZone} className="space-y-4 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="zone-name">Nombre de la Zona</Label>
                            <Input
                                id="zone-name"
                                value={zoneForm.data.name}
                                onChange={e => zoneForm.setData('name', e.target.value)}
                                placeholder="Ej. Terraza"
                                required
                            />
                            {zoneForm.errors.name && <p className="text-destructive text-xs">{zoneForm.errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Sede</Label>
                            <Select
                                value={zoneForm.data.location_id}
                                onValueChange={v => zoneForm.setData('location_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map(loc => (
                                        <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {zoneForm.errors.location_id && <p className="text-destructive text-xs">{zoneForm.errors.location_id}</p>}
                        </div>
                        <SheetFooter>
                            <Button type="submit" disabled={zoneForm.processing} className="w-full">
                                {zoneForm.processing ? 'Guardando...' : editingZone ? 'Actualizar' : 'Crear Zona'}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            {/* Table Sheet */}
            <Sheet open={isTableSheetOpen} onOpenChange={setIsTableSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{editingTable ? 'Editar Mesa' : 'Nueva Mesa'}</SheetTitle>
                        <SheetDescription>
                            Configura los detalles de la mesa individual.
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={submitTable} className="space-y-4 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="table-zone">Zona</Label>
                            <Select
                                value={tableForm.data.zone_id}
                                onValueChange={v => tableForm.setData('zone_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar zona" />
                                </SelectTrigger>
                                <SelectContent>
                                    {zones.map(z => (
                                        <SelectItem key={z.id} value={z.id.toString()}>{z.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {tableForm.errors.zone_id && <p className="text-destructive text-xs">{tableForm.errors.zone_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="table-name">Nombre / ID de Mesa</Label>
                            <Input
                                id="table-name"
                                value={tableForm.data.name}
                                onChange={e => tableForm.setData('name', e.target.value)}
                                placeholder="Ej. Mesa 01"
                                required
                            />
                            {tableForm.errors.name && <p className="text-destructive text-xs">{tableForm.errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="table-capacity">Capacidad (Personas)</Label>
                            <Input
                                id="table-capacity"
                                type="number"
                                value={tableForm.data.capacity}
                                onChange={e => tableForm.setData('capacity', e.target.value)}
                                placeholder="Ej. 4"
                            />
                            {tableForm.errors.capacity && <p className="text-destructive text-xs">{tableForm.errors.capacity}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="table-status">Estado</Label>
                            <Select
                                value={tableForm.data.status}
                                onValueChange={(v) => tableForm.setData('status', v as TableStatus)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Disponible</SelectItem>
                                    <SelectItem value="occupied">Ocupada</SelectItem>
                                    <SelectItem value="reserved">Reservada</SelectItem>
                                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                                </SelectContent>
                            </Select>
                            {tableForm.errors.status && <p className="text-destructive text-xs">{tableForm.errors.status}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Sede</Label>
                            <Select
                                value={tableForm.data.location_id}
                                onValueChange={v => tableForm.setData('location_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map(loc => (
                                        <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {tableForm.errors.location_id && <p className="text-destructive text-xs">{tableForm.errors.location_id}</p>}
                        </div>
                        <SheetFooter>
                            <Button type="submit" disabled={tableForm.processing} className="w-full">
                                {tableForm.processing ? 'Guardando...' : editingTable ? 'Actualizar' : 'Crear Mesa'}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            {/* Bulk Sheet */}
            <Sheet open={isBulkSheetOpen} onOpenChange={setIsBulkSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Carga Masiva de Mesas</SheetTitle>
                        <SheetDescription>
                            Crea múltiples mesas rápidamente con un prefijo.
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={submitBulk} className="space-y-4 py-6">
                        <div className="space-y-2">
                            <Label>Zona Destino</Label>
                            <Select
                                value={bulkForm.data.zone_id}
                                onValueChange={v => bulkForm.setData('zone_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {zones.map(z => (
                                        <SelectItem key={z.id} value={z.id.toString()}>{z.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {bulkForm.errors.zone_id && <p className="text-destructive text-xs">{bulkForm.errors.zone_id}</p>}
                            {bulkForm.errors.location_id && <p className="text-destructive text-xs">{bulkForm.errors.location_id}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Prefijo</Label>
                                <Input
                                    value={bulkForm.data.prefix}
                                    onChange={e => bulkForm.setData('prefix', e.target.value)}
                                    placeholder="Ej. Mesa "
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Inicia en</Label>
                                <Input
                                    type="number"
                                    value={bulkForm.data.start_number}
                                    onChange={e => bulkForm.setData('start_number', parseInt(e.target.value) || 1)}
                                />
                                {bulkForm.errors.start_number && <p className="text-destructive text-xs">{bulkForm.errors.start_number}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Cantidad a crear</Label>
                            <Input
                                type="number"
                                max="50"
                                value={bulkForm.data.count}
                                onChange={e => bulkForm.setData('count', parseInt(e.target.value) || 1)}
                            />
                            {bulkForm.errors.count && <p className="text-destructive text-xs">{bulkForm.errors.count}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Capacidad por mesa</Label>
                            <Input
                                type="number"
                                value={bulkForm.data.capacity}
                                onChange={e => bulkForm.setData('capacity', e.target.value)}
                            />
                            {bulkForm.errors.capacity && <p className="text-destructive text-xs">{bulkForm.errors.capacity}</p>}
                        </div>
                        <SheetFooter>
                            <Button type="submit" disabled={bulkForm.processing} className="w-full">
                                {bulkForm.processing ? 'Procesando...' : `Generar ${bulkForm.data.count} Mesas`}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            {/* Alert Dialog for Deletion */}
            <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Confirmas la eliminación?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer.
                            {itemToDelete?.type === 'zone' && ' Al eliminar la zona se eliminarán también todas sus mesas asociadas.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={confirmDelete}>
                            Eliminar
                        </AlertDialogAction>
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
