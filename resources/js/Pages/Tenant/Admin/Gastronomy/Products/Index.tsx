import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Pagination from '@/Components/Shared/Pagination';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { formatPrice } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Switch } from "@/Components/ui/switch";
import {
    Plus,
    Search,
    LayoutGrid,
    List,
    Edit,
    Trash2,
    MoreHorizontal,
    Star,
    Clock,
    Flame,
    Eye,
    MapPin,
    Loader2
} from "lucide-react";
import ProductViewDrawer from '@/Components/Tenant/Admin/Gastronomy/Products/ProductViewDrawer';
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
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';

interface Category {
    id: number;
    name: string;
}

interface LocationPivot {
    id: number;
    name: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    category?: Category;
    price: string | number;
    cost?: string | number;
    sku?: string;
    image: string;
    image_url?: string | null;
    gallery?: string[];
    gallery_urls?: string[];
    is_available: boolean;
    is_featured: boolean;
    status: 'active' | 'inactive';
    short_description?: string;
    preparation_time?: number | string;
    calories?: number | string;
    allergens?: string[];
    tags?: string[];
    locations?: LocationPivot[];
}

interface Props {
    products: {
        data: Product[];
        links: PaginationLink[];
    };
    categories: Category[];
    locations: LocationPivot[];
    products_limit: number | null;
    products_count: number;
}

export default function Index({ products, categories, locations, products_limit, products_count }: Props) {
    const { currentTenant, currentUserRole } = usePage<PageProps>().props;
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [productToToggle, setProductToToggle] = useState<Product | null>(null);
    const [productToView, setProductToView] = useState<Product | null>(null);
    const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);

    const checkPermission = (permission: string) => {
        if (!currentUserRole) return false;
        return currentUserRole.is_owner === true ||
            (Array.isArray(currentUserRole.permissions) && currentUserRole.permissions.includes('*')) ||
            (Array.isArray(currentUserRole.permissions) && currentUserRole.permissions.includes(permission));
    };

    const handleActionWithPermission = (permission: string, action: () => void) => {
        if (checkPermission(permission)) {
            action();
        } else {
            setShowPermissionModal(true);
        }
    };
    const [togglingId, setTogglingId] = useState<number | null>(null);

    const limitReached = products_limit !== null && products_count >= products_limit;

    const handleDelete = () => {
        if (!productToDelete) return;

        router.delete(route('tenant.admin.products.destroy', [currentTenant?.slug, productToDelete.id]), {
            onSuccess: () => {
                toast.success('Producto eliminado con éxito');
                setProductToDelete(null);
            },
        });
    };

    const confirmToggleAvailability = () => {
        if (!productToToggle) return;
        setTogglingId(productToToggle.id);

        router.patch(
            route('tenant.admin.products.toggle-availability', [currentTenant?.slug, productToToggle.id]),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        productToToggle.is_available
                            ? 'Producto marcado como agotado'
                            : 'Producto disponible nuevamente'
                    );
                    setProductToToggle(null);
                    setTogglingId(null);
                },
                onError: () => {
                    toast.error('Error al cambiar disponibilidad');
                    setTogglingId(null);
                },
            }
        );
    };

    const getProductImageUrl = (product: Product): string => {
        if (product.image_url) return product.image_url;
        if (product.image) return `/media/${product.image}`;
        return '';
    };

    const filteredProducts = products.data.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.category_id.toString() === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <AdminLayout title="Menú / Productos">
            <Head title="Productos" />

            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
                        <p className="text-sm text-muted-foreground">
                            Gestiona los platos y bebidas de tu menú digital.
                            <span className="ml-2 font-medium text-foreground">
                                {products_limit !== null
                                    ? `(${products_count} / ${products_limit} usados)`
                                    : `(${products_count} productos)`}
                            </span>
                        </p>
                    </div>
                    <Button
                        className="cursor-pointer gap-2"
                        disabled={limitReached}
                        title={limitReached ? `Has alcanzado el máximo de ${products_limit} productos en tu plan.` : ''}
                        onClick={() => handleActionWithPermission('products.create', () => {
                            if (!limitReached) router.visit(route('tenant.admin.products.create', currentTenant?.slug));
                        })}
                    >
                        <Plus className="w-4 h-4" />
                        {limitReached ? 'Límite alcanzado' : 'Nuevo Producto'}
                    </Button>
                </div>

                {/* Filters & View Toggle */}
                <Card className="border-none bg-muted/20">
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-1 w-full md:w-auto gap-3 flex-wrap">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar producto..."
                                    className="pl-9 bg-white"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[180px] bg-white">
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las categorías</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border">
                            <Button
                                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="px-3"
                                onClick={() => setViewMode('grid')}
                            >
                                <LayoutGrid className="w-4 h-4 mr-2" /> Cuadrícula
                            </Button>
                            <Button
                                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="px-3"
                                onClick={() => setViewMode('table')}
                            >
                                <List className="w-4 h-4 mr-2" /> Tabla
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Display */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                                <div className="relative aspect-square overflow-hidden bg-muted">
                                    <img
                                        src={getProductImageUrl(product)}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                                        {product.is_featured && (
                                            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-none shadow-sm">
                                                <Star className="w-3 h-3 fill-white mr-1" /> Destacado
                                            </Badge>
                                        )}
                                        {product.status === 'inactive' && (
                                            <Badge variant="secondary">Inactivo</Badge>
                                        )}
                                    </div>
                                    <div className="absolute bottom-2 left-2 flex gap-1">
                                        {product.tags?.includes('picante') && (
                                            <Badge className="bg-red-500 text-white border-none"><Flame className="w-3 h-3" /></Badge>
                                        )}
                                        {product.preparation_time && (
                                            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-none shadow-sm flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {product.preparation_time} min
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                                                {product.category?.name || 'Sin categoría'}
                                            </p>
                                            <h3 className="font-bold text-lg line-clamp-1">{product.name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-primary font-black text-lg">
                                                {formatPrice(product.price)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Location badges */}
                                    {product.locations && product.locations.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {product.locations.slice(0, 2).map(loc => (
                                                <Badge key={loc.id} variant="outline" className="text-[10px] h-5 gap-1">
                                                    <MapPin className="w-2.5 h-2.5" /> {loc.name}
                                                </Badge>
                                            ))}
                                            {product.locations.length > 2 && (
                                                <Badge variant="outline" className="text-[10px] h-5">
                                                    +{product.locations.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                        <div className="flex items-center gap-2">
                                            {togglingId === product.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                            ) : (
                                                <Switch
                                                    checked={product.is_available}
                                                    onCheckedChange={() => handleActionWithPermission('products.update', () => setProductToToggle(product))}
                                                />
                                            )}
                                            <span className="text-xs font-medium">
                                                {product.is_available ? 'Disponible' : 'Agotado'}
                                            </span>
                                        </div>
                                        <div className="flex">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 hover:bg-muted text-primary"
                                                onClick={() => {
                                                    setProductToView(product);
                                                    setIsViewDrawerOpen(true);
                                                }}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 hover:bg-muted"
                                                onClick={() => handleActionWithPermission('products.update', () => router.visit(route('tenant.admin.products.edit', [currentTenant?.slug, product.id])))}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-700 cursor-pointer" onClick={() => handleActionWithPermission('products.delete', () => setProductToDelete(product))}>
                                                        <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Imagen</TableHead>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead>Sedes</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                                                    <img
                                                        src={getProductImageUrl(product)}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold">{product.name}</span>
                                                    {product.is_featured && <span className="text-[10px] text-yellow-600 font-bold uppercase tracking-wider flex items-center gap-1"><Star className="w-2 h-2 fill-yellow-600" /> Destacado</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell>{product.category?.name}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {product.locations && product.locations.length > 0 ? (
                                                        product.locations.slice(0, 2).map(loc => (
                                                            <Badge key={loc.id} variant="outline" className="text-[10px] h-5">
                                                                {loc.name}
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">Todas</span>
                                                    )}
                                                    {product.locations && product.locations.length > 2 && (
                                                        <Badge variant="outline" className="text-[10px] h-5">
                                                            +{product.locations.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-bold text-primary">{formatPrice(product.price)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {togglingId === product.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                                    ) : (
                                                        <Switch
                                                            checked={product.is_available}
                                                            onCheckedChange={() => handleActionWithPermission('products.update', () => setProductToToggle(product))}
                                                        />
                                                    )}
                                                    <Badge variant={product.is_available ? 'default' : 'secondary'}>
                                                        {product.is_available ? 'Disponible' : 'Agotado'}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-primary"
                                                        onClick={() => {
                                                            setProductToView(product);
                                                            setIsViewDrawerOpen(true);
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleActionWithPermission('products.update', () => router.visit(route('tenant.admin.products.edit', [currentTenant?.slug, product.id])))}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleActionWithPermission('products.delete', () => setProductToDelete(product))}>
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
                )}

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border-2 border-dashed">
                        <div className="bg-muted p-4 rounded-full mb-4">
                            <Plus className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold">No se encontraron productos</h3>
                        <p className="text-muted-foreground mt-1 max-w-sm">
                            {search || categoryFilter !== 'all'
                                ? 'No hay resultados para los filtros aplicados. Intenta con otros términos.'
                                : 'Comienza agregando tu primer producto al menú para que tus clientes puedan verlo.'}
                        </p>
                        {!limitReached && (
                            <Button
                                className="mt-6 cursor-pointer"
                                onClick={() => handleActionWithPermission('products.create', () => router.visit(route('tenant.admin.products.create', currentTenant?.slug)))}
                            >
                                Crear Producto
                            </Button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {products.links && products.data.length > 0 && (
                    <div className="flex justify-center py-6">
                        <Pagination links={products.links} />
                    </div>
                )}
            </div>

            {/* Delete Confirmation */}
            <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente el producto <span className="font-bold border-b">{productToDelete?.name}</span> de tu menú y no se podrá deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Sí, eliminar producto
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Toggle Availability Confirmation */}
            <AlertDialog open={!!productToToggle} onOpenChange={(open) => !open && setProductToToggle(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {productToToggle?.is_available ? '¿Marcar como agotado?' : '¿Marcar como disponible?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {productToToggle?.is_available
                                ? `"${productToToggle?.name}" dejará de ser visible en tu menú público.`
                                : `"${productToToggle?.name}" volverá a ser visible para tus clientes.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmToggleAvailability}>
                            {productToToggle?.is_available ? 'Sí, marcar agotado' : 'Sí, habilitar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <ProductViewDrawer
                product={productToView}
                open={isViewDrawerOpen}
                onOpenChange={setIsViewDrawerOpen}
            />

            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />
        </AdminLayout>
    );
}
