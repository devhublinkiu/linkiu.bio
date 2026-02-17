import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Plus, Trash2, Edit, Search, Package, Boxes } from 'lucide-react';
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/Components/ui/empty';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import { toast } from 'sonner';
import { Textarea } from '@/Components/ui/textarea';

interface Tenant {
    id: number;
    name: string;
    slug: string;
}

interface CurrentUserRole {
    is_owner: boolean;
    permissions: string[];
}

interface Location {
    id: number;
    name: string;
}

interface InventoryStock {
    id: number;
    location: Location;
    quantity: number;
    min_stock: number;
    is_low_stock: boolean;
    is_out_of_stock: boolean;
}

interface InventoryItem {
    id: number;
    name: string;
    slug: string;
    sku: string | null;
    description: string | null;
    unit: 'kg' | 'g' | 'l' | 'ml' | 'units' | 'pieces';
    cost_per_unit: number | null;
    image: string | null;
    image_url: string | null;
    category: string | null;
    status: 'active' | 'inactive';
    stocks?: InventoryStock[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    items: {
        data: InventoryItem[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    categories: string[];
    locations: Location[];
    filters: {
        search?: string;
        category?: string;
        status?: string;
    };
}

const UNIT_LABELS: Record<string, string> = {
    kg: 'Kilogramos',
    g: 'Gramos',
    l: 'Litros',
    ml: 'Mililitros',
    units: 'Unidades',
    pieces: 'Piezas',
};

export default function Index({ items, categories, locations, filters }: Props) {
    const { currentTenant, currentUserRole, flash } = usePage<PageProps & { currentTenant: Tenant; currentUserRole: CurrentUserRole; flash?: { error?: string; success?: string } }>().props;
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash?.error, flash?.success]);

    const hasPermission = (permission: string): boolean => {
        if (!currentUserRole) return false;
        return currentUserRole.is_owner ||
            currentUserRole.permissions.includes('*') ||
            currentUserRole.permissions.includes(permission);
    };

    const handleProtectedAction = (e: React.MouseEvent | null, permission: string, callback: () => void) => {
        if (e) e.preventDefault();
        if (hasPermission(permission)) {
            callback();
        } else {
            setShowPermissionModal(true);
        }
    };

    const form = useForm({
        name: '',
        sku: '',
        description: '',
        unit: 'units' as 'kg' | 'g' | 'l' | 'ml' | 'units' | 'pieces',
        cost_per_unit: '',
        category: '',
        status: 'active' as 'active' | 'inactive',
    });

    const handleOpenSheet = (item?: InventoryItem) => {
        if (item) {
            setEditingItem(item);
            form.setData({
                name: item.name,
                sku: item.sku || '',
                description: item.description || '',
                unit: item.unit,
                cost_per_unit: item.cost_per_unit?.toString() || '',
                category: item.category || '',
                status: item.status,
            });
        } else {
            setEditingItem(null);
            form.reset();
        }
        setIsSheetOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingItem) {
            form.put(route('tenant.admin.inventory.update', { tenant: currentTenant.slug, inventoryItem: editingItem.id }), {
                onSuccess: () => {
                    setIsSheetOpen(false);
                    toast.success('Item actualizado correctamente.');
                },
                onError: () => {
                    toast.error('No se pudo actualizar el item. Verifica los datos.');
                },
            });
        } else {
            form.post(route('tenant.admin.inventory.store', { tenant: currentTenant.slug }), {
                onSuccess: () => {
                    setIsSheetOpen(false);
                    form.reset();
                    toast.success('Item creado correctamente.');
                },
                onError: () => {
                    toast.error('No se pudo crear el item. Verifica los datos.');
                },
            });
        }
    };

    const handleDelete = () => {
        if (!itemToDelete) return;

        router.delete(route('tenant.admin.inventory.destroy', { tenant: currentTenant.slug, inventoryItem: itemToDelete.id }), {
            onSuccess: () => {
                setItemToDelete(null);
                toast.success('Item eliminado correctamente.');
            },
            onError: () => {
                toast.error('No se pudo eliminar el item.');
            },
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(route('tenant.admin.inventory.index', { tenant: currentTenant.slug }), {
            ...filters,
            [key]: value || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getTotalStock = (item: InventoryItem): number => {
        if (!item.stocks || item.stocks.length === 0) return 0;
        return item.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
    };

    const getStockBadge = (item: InventoryItem) => {
        const totalStock = getTotalStock(item);
        const hasLowStock = item.stocks?.some(s => s.is_low_stock) || false;
        const hasOutOfStock = item.stocks?.some(s => s.is_out_of_stock) || false;

        if (hasOutOfStock) {
            return <Badge variant="outline" className="bg-red-100 text-red-800">Sin stock</Badge>;
        }
        if (hasLowStock) {
            return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Stock bajo</Badge>;
        }
        return <Badge variant="outline" className="bg-green-100 text-green-800">Disponible</Badge>;
    };

    return (
        <AdminLayout title="Inventario" breadcrumbs={[{ label: 'Gastronomía' }, { label: 'Inventario' }]}>
            <Head title="Inventario" />

            <div className="flex flex-col gap-6">
                {/* Banner de desarrollo */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-amber-900 mb-1">
                            Módulo en proceso de implementación
                        </h3>
                        <p className="text-sm text-amber-800">
                            Actualmente puedes gestionar el catálogo de items. La funcionalidad completa (registro de movimientos, control de stock por sede y reportes) estará disponible próximamente.
                        </p>
                    </div>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Buscar por nombre, SKU o categoría..."
                                value={filters.search || ''}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="pl-10 w-[300px]"
                            />
                        </div>
                        <Select value={filters.category || 'all'} onValueChange={(v) => handleFilterChange('category', v === 'all' ? '' : v)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Todas las categorías" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las categorías</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={filters.status || 'all'} onValueChange={(v) => handleFilterChange('status', v === 'all' ? '' : v)}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="active">Activos</SelectItem>
                                <SelectItem value="inactive">Inactivos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={(e) => handleProtectedAction(e, 'inventory.create', () => handleOpenSheet())}>
                        <Plus className="w-4 h-4 mr-2" /> Nuevo Item
                    </Button>
                </div>

                {/* Content */}
                {items.data.length === 0 ? (
                    <Empty className="border-2 border-dashed rounded-xl bg-white py-12">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Package className="size-4" />
                            </EmptyMedia>
                            <EmptyTitle>No hay items de inventario</EmptyTitle>
                            <EmptyDescription>
                                Empieza creando un item como "Harina 00" o "Aceite de oliva".
                            </EmptyDescription>
                        </EmptyHeader>
                        <Button className="mt-4" onClick={(e) => handleProtectedAction(e, 'inventory.create', () => handleOpenSheet())}>
                            <Plus className="w-4 h-4 mr-2" /> Crear mi primer item
                        </Button>
                    </Empty>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.data.map((item) => (
                                <Card key={item.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-base font-bold">{item.name}</CardTitle>
                                                {item.sku && (
                                                    <p className="text-xs text-slate-500 mt-1">SKU: {item.sku}</p>
                                                )}
                                            </div>
                                            {getStockBadge(item)}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600">Unidad:</span>
                                            <span className="font-medium">{UNIT_LABELS[item.unit]}</span>
                                        </div>
                                        {item.category && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-600">Categoría:</span>
                                                <Badge variant="outline">{item.category}</Badge>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600">Stock Total:</span>
                                            <span className="font-bold text-indigo-600">{getTotalStock(item).toFixed(2)} {item.unit}</span>
                                        </div>
                                        {item.cost_per_unit && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-600">Costo/Unidad:</span>
                                                <span className="font-medium">${item.cost_per_unit.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={(e) => handleProtectedAction(e, 'inventory.update', () => handleOpenSheet(item))}
                                            >
                                                <Edit className="w-3 h-3 mr-1" /> Editar
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => handleProtectedAction(e, 'inventory.delete', () => setItemToDelete(item))}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Paginación */}
                        {items.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                {items.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Sheet para Crear/Editar */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>{editingItem ? 'Editar Item' : 'Nuevo Item'}</SheetTitle>
                        <SheetDescription>
                            {editingItem ? 'Actualiza la información del item de inventario.' : 'Crea un nuevo item de inventario (ingrediente o insumo).'}
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                        <div className="space-y-2">
                            <Label>Nombre *</Label>
                            <Input
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Ej: Harina 00, Aceite de oliva"
                            />
                            {form.errors.name && (
                                <p className="text-xs text-red-600">{form.errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>SKU (Código)</Label>
                            <Input
                                value={form.data.sku}
                                onChange={(e) => form.setData('sku', e.target.value)}
                                placeholder="Opcional"
                            />
                            {form.errors.sku && (
                                <p className="text-xs text-red-600">{form.errors.sku}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Unidad de Medida *</Label>
                            <Select value={form.data.unit} onValueChange={(value: any) => form.setData('unit', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                                    <SelectItem value="g">Gramos (g)</SelectItem>
                                    <SelectItem value="l">Litros (l)</SelectItem>
                                    <SelectItem value="ml">Mililitros (ml)</SelectItem>
                                    <SelectItem value="units">Unidades</SelectItem>
                                    <SelectItem value="pieces">Piezas</SelectItem>
                                </SelectContent>
                            </Select>
                            {form.errors.unit && (
                                <p className="text-xs text-red-600">{form.errors.unit}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Categoría</Label>
                            <Input
                                value={form.data.category}
                                onChange={(e) => form.setData('category', e.target.value)}
                                placeholder="Ej: Lácteos, Carnes, Verduras"
                            />
                            {form.errors.category && (
                                <p className="text-xs text-red-600">{form.errors.category}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Costo por Unidad (Opcional)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={form.data.cost_per_unit}
                                onChange={(e) => form.setData('cost_per_unit', e.target.value)}
                                placeholder="0.00"
                            />
                            {form.errors.cost_per_unit && (
                                <p className="text-xs text-red-600">{form.errors.cost_per_unit}</p>
                            )}
                            <p className="text-xs text-slate-500">Se calculará automáticamente con las compras.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Descripción</Label>
                            <Textarea
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                placeholder="Información adicional del item..."
                                rows={3}
                            />
                            {form.errors.description && (
                                <p className="text-xs text-red-600">{form.errors.description}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Estado *</Label>
                            <Select value={form.data.status} onValueChange={(value: any) => form.setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Activo</SelectItem>
                                    <SelectItem value="inactive">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                            {form.errors.status && (
                                <p className="text-xs text-red-600">{form.errors.status}</p>
                            )}
                        </div>

                        <SheetFooter className="mt-6">
                            <Button type="button" variant="ghost" onClick={() => setIsSheetOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                {form.processing ? 'Guardando...' : editingItem ? 'Actualizar' : 'Crear'}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            {/* AlertDialog para Eliminar */}
            <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar este item?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Se eliminará <strong>{itemToDelete?.name}</strong> y todos sus registros de stock. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={handleDelete}>
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
