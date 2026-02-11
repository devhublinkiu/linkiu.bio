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
    Eye
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

interface Category {
    id: number;
    name: string;
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
    gallery?: string[];
    is_available: boolean;
    is_featured: boolean;
    status: 'active' | 'inactive';
    short_description?: string;
    preparation_time?: number | string;
    calories?: number | string;
    allergens?: string[];
    tags?: string[];
}

interface Props {
    products: {
        data: Product[];
        links: any[];
    };
    categories: Category[];
}

export default function Index({ products, categories }: Props) {
    const { currentTenant } = usePage<PageProps>().props;
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [productToView, setProductToView] = useState<Product | null>(null);
    const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);


    const handleDelete = () => {
        if (!productToDelete) return;

        router.delete(route('tenant.admin.products.destroy', [currentTenant?.slug, productToDelete.id]), {
            onSuccess: () => {
                toast.success('Producto eliminado con éxito');
                setProductToDelete(null);
            },
        });
    };

    const toggleAvailability = (product: Product) => {
        router.patch(route('tenant.admin.products.update', [currentTenant?.slug, product.id]), {
            is_available: !product.is_available,
            // We need to send other required fields if the StoreRequest is strict
            // But since this is a partial update, we might need a separate endpoint or loose request
            // For now, let's assume update handles it if we send name/price/category etc too
            name: product.name,
            price: product.price,
            category_id: product.category_id,
            status: product.status
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success('Estado actualizado'),
        });
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
                        <p className="text-sm text-muted-foreground">Gestiona los platos y bebidas de tu menú digital.</p>
                    </div>
                    <Link href={route('tenant.admin.products.create', currentTenant?.slug)}>
                        <Button className="cursor-pointer gap-2">
                            <Plus className="w-4 h-4" /> Nuevo Producto
                        </Button>
                    </Link>
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
                                        src={`/media/${product.image}`}
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

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={product.is_available}
                                                onCheckedChange={() => toggleAvailability(product)}
                                            />
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
                                            <Link href={route('tenant.admin.products.edit', [currentTenant?.slug, product.id])}>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-muted">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-700 cursor-pointer" onClick={() => setProductToDelete(product)}>
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
                                                        src={`/media/${product.image}`}
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
                                            <TableCell className="font-bold text-primary">{formatPrice(product.price)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={product.is_available}
                                                        onCheckedChange={() => toggleAvailability(product)}
                                                    />
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
                                                    <Link href={route('tenant.admin.products.edit', [currentTenant?.slug, product.id])}>
                                                        <Button size="icon" variant="ghost">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setProductToDelete(product)}>
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
                        <Link href={route('tenant.admin.products.create', currentTenant?.slug)} className="mt-6">
                            <Button>Crear Producto</Button>
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {products.links && products.data.length > 0 && (
                    <div className="flex justify-center py-6">
                        <Pagination links={products.links} />
                    </div>
                )}
            </div>

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

            <ProductViewDrawer
                product={productToView}
                open={isViewDrawerOpen}
                onOpenChange={setIsViewDrawerOpen}
            />
        </AdminLayout>
    );
}
