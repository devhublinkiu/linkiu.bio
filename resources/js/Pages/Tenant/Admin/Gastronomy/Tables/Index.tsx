import React, { useState } from 'react';
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
import { toast } from 'sonner';

interface Table {
    id: number;
    zone_id: number;
    name: string;
    token: string;
    capacity: number | null;
    status: 'active' | 'maintenance' | 'inactive';
}

interface Zone {
    id: number;
    name: string;
    tables: Table[];
}

interface Props {
    zones: Zone[];
}

export default function Index({ zones }: Props) {
    const { currentTenant } = usePage<PageProps>().props;
    const [isZoneSheetOpen, setIsZoneSheetOpen] = useState(false);
    const [isTableSheetOpen, setIsTableSheetOpen] = useState(false);
    const [isBulkSheetOpen, setIsBulkSheetOpen] = useState(false);
    const [editingZone, setEditingZone] = useState<Zone | null>(null);
    const [editingTable, setEditingTable] = useState<Table | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'zone' | 'table', id: number } | null>(null);

    // Zone Form
    const zoneForm = useForm({
        name: '',
    });

    // Table Form
    const tableForm = useForm<{
        zone_id: string;
        name: string;
        capacity: string;
        status: 'active' | 'maintenance' | 'inactive';
    }>({
        zone_id: '',
        name: '',
        capacity: '',
        status: 'active',
    });

    // Bulk Form
    const bulkForm = useForm({
        zone_id: '',
        prefix: 'Mesa ',
        start_number: 1,
        count: 10,
        capacity: '',
    });

    const handleOpenZoneSheet = (zone?: Zone) => {
        if (zone) {
            setEditingZone(zone);
            zoneForm.setData('name', zone.name);
        } else {
            setEditingZone(null);
            zoneForm.reset();
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
                status: table.status,
            });
        } else {
            setEditingTable(null);
            tableForm.reset();
            if (zoneId) tableForm.setData('zone_id', zoneId.toString());
        }
        setIsTableSheetOpen(true);
    };

    const submitZone = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingZone) {
            zoneForm.put(route('tenant.admin.zones.update', [currentTenant?.slug, editingZone.id]), {
                onSuccess: () => {
                    toast.success('Zona actualizada');
                    setIsZoneSheetOpen(false);
                }
            });
        } else {
            zoneForm.post(route('tenant.admin.zones.store', currentTenant?.slug), {
                onSuccess: () => {
                    toast.success('Zona creada');
                    setIsZoneSheetOpen(false);
                }
            });
        }
    };

    const submitTable = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTable) {
            tableForm.put(route('tenant.admin.tables.update', [currentTenant?.slug, editingTable.id]), {
                onSuccess: () => {
                    toast.success('Mesa actualizada');
                    setIsTableSheetOpen(false);
                }
            });
        } else {
            tableForm.post(route('tenant.admin.tables.store', currentTenant?.slug), {
                onSuccess: () => {
                    toast.success('Mesa creada');
                    setIsTableSheetOpen(false);
                }
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
            }
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
            }
        });
    };

    const regenerateToken = (tableId: number) => {
        router.post(route('tenant.admin.tables.regenerate-token', [currentTenant?.slug, tableId]), {}, {
            onSuccess: () => toast.success('Token regenerado. El QR antiguo ya no funcionará.')
        });
    };

    const getStatusBadge = (status: Table['status']) => {
        switch (status) {
            case 'active': return <Badge className="bg-green-500">Activa</Badge>;
            case 'maintenance': return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Mantenimiento</Badge>;
            case 'inactive': return <Badge variant="secondary">Inactiva</Badge>;
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
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.get(route('tenant.admin.tables.print', [currentTenant?.slug]))}>
                            <QrCode className="w-4 h-4 mr-2" /> Centro de QRs
                        </Button>
                        <Button variant="outline" onClick={() => handleOpenZoneSheet()}>
                            <MapPin className="w-4 h-4 mr-2" /> Nueva Zona
                        </Button>
                        <Button onClick={() => handleOpenTableSheet()}>
                            <Plus className="w-4 h-4 mr-2" /> Nueva Mesa
                        </Button>
                    </div>
                </div>

                {zones.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
                        <MapPin className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                        <h3 className="text-lg font-medium">No hay zonas configuradas</h3>
                        <p className="text-sm text-muted-foreground mb-6">Empieza creando una zona como "Salón Principal" o "Terraza".</p>
                        <Button onClick={() => handleOpenZoneSheet()}>
                            <Plus className="w-4 h-4 mr-2" /> Crear mi primera zona
                        </Button>
                    </Card>
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
                                        <Button variant="ghost" size="sm" onClick={() => {
                                            setIsBulkSheetOpen(true);
                                            bulkForm.setData('zone_id', zone.id.toString());
                                        }}>
                                            <UserPlus className="w-4 h-4 mr-2" /> Carga Masiva
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenZoneSheet(zone)}>
                                                    <Edit className="w-4 h-4 mr-2" /> Editar Zona
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 focus:text-red-700" onClick={() => setItemToDelete({ type: 'zone', id: zone.id })}>
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
                                                            <DropdownMenuItem onClick={() => handleOpenTableSheet(table)}>
                                                                <Edit className="w-4 h-4 mr-2" /> Editar Mesa
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => regenerateToken(table.id)}>
                                                                <RefreshCw className="w-4 h-4 mr-2" /> Regenerar Token
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600 focus:text-red-700" onClick={() => setItemToDelete({ type: 'table', id: table.id })}>
                                                                <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                <div className="flex flex-col gap-2 mt-4">
                                                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Acceso Cliente</div>
                                                    <div className="flex gap-2">
                                                        <Button variant="secondary" size="sm" className="flex-1 h-8 text-xs font-bold" onClick={() => window.open(route('tenant.table.detect', [currentTenant?.slug, table.token]), '_blank')}>
                                                            <QrCode className="w-3 h-3 mr-1.5" /> Ver QR
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => handleOpenTableSheet(undefined, zone.id)}
                                            className="bg-slate-50 border-2 border-dashed border-slate-200 p-4 flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:bg-white transition-all group"
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
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="table-status">Estado</Label>
                            <Select
                                value={tableForm.data.status}
                                onValueChange={v => tableForm.setData('status', v as any)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Activa</SelectItem>
                                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                                    <SelectItem value="inactive">Inactiva</SelectItem>
                                </SelectContent>
                            </Select>
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
                        </div>
                        <div className="space-y-2">
                            <Label>Capacidad por mesa</Label>
                            <Input
                                type="number"
                                value={bulkForm.data.capacity}
                                onChange={e => bulkForm.setData('capacity', e.target.value)}
                            />
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
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
