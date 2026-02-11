
import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import Pagination from '@/Components/Shared/Pagination';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/Components/ui/dialog';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/Components/ui/sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Switch } from "@/Components/ui/switch";
import { Card, CardContent } from '@/Components/ui/card';
import { Plus, Edit, Trash2, Search, HelpCircle, Bug, Headphones } from "lucide-react";
import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Separator } from '@/Components/ui/separator';
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

interface CategoryIcon {
    id: number;
    name: string;
    path: string;
    is_global: boolean;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    category_icon_id: number;
    parent_id: number | null;
    is_active: boolean;
    products_count?: number;
    children_count?: number;
    icon?: CategoryIcon;
    parent?: Category;
    children?: Category[]; // If nested
}

interface IconRequest {
    id: number;
    requested_name: string;
    status: string;
    created_at: string;
}

interface Props {
    categories: {
        data: Category[];
        links: any[]; // Pagination
    };
    availableIcons: CategoryIcon[];
    myRequests: {
        data: IconRequest[];
        links: any[];
    };
    parents: Category[];
}

export default function Index({ categories, availableIcons, myRequests, parents }: Props) {
    // Helper to handle both Paginator and Array (backwards compatibility)
    const requestsList = (myRequests as any).data || myRequests;
    const requestsLinks = (myRequests as any).links || [];
    const { currentTenant } = usePage<PageProps>().props;
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isRequestIconOpen, setIsRequestIconOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [iconSearch, setIconSearch] = useState('');
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    // Create/Edit Form
    const { data, setData, post, put, processing, errors, reset, clearErrors, transform } = useForm({
        name: '',
        category_icon_id: '',
        parent_id: 'root', // 'root' or ID
    });

    // Request Icon Form
    const { data: requestData, setData: setRequestData, post: postRequest, processing: processingRequest, errors: errorsRequest, reset: resetRequest } = useForm({
        requested_name: '',
        reference_image: null as File | null,
    });

    const openCreate = () => {
        setEditingCategory(null);
        reset();
        clearErrors();
        setIsCreateOpen(true);
    };

    const openEdit = (category: Category) => {
        setEditingCategory(category);
        clearErrors();
        setData({
            name: category.name,
            category_icon_id: category.category_icon_id.toString(),
            parent_id: category.parent_id ? category.parent_id.toString() : 'root',
        });
        setIsCreateOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            parent_id: data.parent_id === 'root' ? null : data.parent_id,
        }));

        if (editingCategory) {
            put(route('tenant.categories.update', [currentTenant?.slug, editingCategory.id]), {
                onSuccess: () => setIsCreateOpen(false),
            });
        } else {
            post(route('tenant.categories.store', currentTenant?.slug), {
                onSuccess: () => setIsCreateOpen(false),
            });
        }
    };

    const handleDelete = (categoryId: number) => {
        router.delete(route('tenant.categories.destroy', [currentTenant?.slug, categoryId]), {
            onSuccess: () => {
                toast.success('Categoría eliminada con éxito');
                setCategoryToDelete(null);
            },
        });
    };

    const submitRequestIcon = (e: React.FormEvent) => {
        e.preventDefault();
        postRequest(route('tenant.categories.request-icon', currentTenant?.slug), {
            onSuccess: () => {
                setIsRequestIconOpen(false);
                resetRequest();
            },
        });
    };

    const filteredIcons = availableIcons.filter(icon =>
        icon.name.toLowerCase().includes(iconSearch.toLowerCase())
    );

    return (
        <AdminLayout title="Categorías">
            <Head title="Categorías" />

            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Categorías</h1>
                    <p className="text-sm text-muted-foreground">Organiza tus productos en categorías.</p>
                </div>
                <Button onClick={openCreate} className="cursor-pointer ring-0 hover:ring-0 focus:ring-0">
                    <Plus /> Nueva Categoría
                </Button>
            </div>

            {/* Content */}
            <div className="grid gap-6 md:grid-cols-3">

                {/* Categories List (Main) */}
                {/* Categories List (Main) */}
                <div className="md:col-span-2 space-y-4">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Icono</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead className="text-center">Productos</TableHead>
                                        <TableHead className="text-center">Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.data.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell>
                                                <Avatar className="rounded-lg">
                                                    {category.icon && <AvatarImage src={`/media/${category.icon.path}`} alt={category.icon.name} className="object-contain p-1" />}
                                                    <AvatarFallback className="bg-muted">
                                                        <div className="size-2 rounded-full bg-slate-300" />
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell>
                                                {category.parent ? (
                                                    <div className="flex flex-col text-[10px] uppercase tracking-wider font-bold">
                                                        <span className="text-muted-foreground">Subcategoría</span>
                                                        <span>{category.parent.name}</span>
                                                    </div>
                                                ) : (
                                                    <Badge variant="outline">Principal</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary">{category.products_count || 0}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Switch
                                                    className="cursor-pointer ring-0 hover:ring-0 focus:ring-0"
                                                    checked={category.is_active}
                                                    onCheckedChange={() => {
                                                        router.patch(route('tenant.categories.toggle-active', [currentTenant?.slug, category.id]), {}, {
                                                            preserveScroll: true,
                                                        });
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button size="icon" variant="ghost" className="cursor-pointer ring-0 hover:ring-0 focus:ring-0" onClick={() => openEdit(category)}>
                                                        <Edit />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="cursor-pointer ring-0 hover:ring-0 focus:ring-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => setCategoryToDelete(category)}
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {categories.data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                                No tienes categorías creadas.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Icon Requests Status */}
                <div className="md:col-span-1">
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <HelpCircle className="h-4 w-4" /> Mis Solicitudes de Iconos
                            </h3>
                            {requestsList.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">No has solicitado iconos.</p>
                            ) : (
                                <div className="space-y-1">
                                    {requestsList.map((req: IconRequest, index: number) => (
                                        <React.Fragment key={req.id}>
                                            <div className="flex justify-between items-center py-2 px-1">
                                                <span className="text-sm font-medium">{req.requested_name}</span>
                                                <Badge variant={req.status === 'approved' ? 'default' : (req.status === 'rejected' ? 'destructive' : 'secondary')}>
                                                    {req.status === 'approved' ? 'Aprobado' : (req.status === 'rejected' ? 'Rechazado' : 'Pendiente')}
                                                </Badge>
                                            </div>
                                            {index < requestsList.length - 1 && <Separator className="opacity-50" />}
                                        </React.Fragment>
                                    ))}
                                    {/* Small Pagination */}
                                    <div className="flex justify-center pt-2">
                                        <Pagination links={requestsLinks} className="scale-90" />
                                    </div>
                                </div>
                            )}
                            <Button
                                variant="outline"
                                className="w-full mt-4 cursor-pointer ring-0 hover:ring-0 focus:ring-0"
                                onClick={() => setIsRequestIconOpen(true)}
                            >
                                Solicitar Icono Nuevo
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</SheetTitle>
                        <SheetDescription>
                            Configura los detalles de la categoría.
                        </SheetDescription>
                    </SheetHeader>

                    <form onSubmit={submit} className="space-y-6 mt-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                className="ring-0 hover:ring-0 focus:ring-0"
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parent">Categoría Superior (Opcional)</Label>
                            <Select
                                value={data.parent_id}
                                onValueChange={(val) => setData('parent_id', val)}
                            >
                                <SelectTrigger className="ring-0 hover:ring-0 focus:ring-0 cursor-pointer">
                                    <SelectValue placeholder="Selecciona..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="root">Ninguna (Categoría Principal)</SelectItem>
                                    {parents
                                        .filter(p => !editingCategory || p.id !== editingCategory.id) // Filter self
                                        .map(p => (
                                            <SelectItem key={p.id} value={p.id.toString()} className="cursor-pointer ring-0 hover:ring-0 focus:ring-0">{p.name}</SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            {errors.parent_id && <p className="text-red-500 text-xs">{errors.parent_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Icono</Label>
                            <Input
                                placeholder="Buscar icono..."
                                className="mb-2 ring-0 hover:ring-0 focus:ring-0"
                                value={iconSearch}
                                onChange={(e) => setIconSearch(e.target.value)}
                            />
                            <div className="grid grid-cols-4 gap-2 border rounded-md p-2 max-h-48 overflow-y-auto">
                                {filteredIcons.map(icon => (
                                    <div
                                        key={icon.id}
                                        className={`cursor-pointer rounded border p-2 flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${data.category_icon_id == icon.id.toString()
                                            ? 'border-primary bg-primary/5' // Pure choice
                                            : 'border-muted hover:bg-muted/50' // Pure default
                                            }`}
                                        onClick={() => setData('category_icon_id', icon.id.toString())}
                                    >
                                        <img src={`/media/${icon.path}`} alt={icon.name} className="w-8 h-8 object-contain" />
                                        <span className="text-[10px] truncate w-full text-center" title={icon.name}>{icon.name}</span>
                                    </div>
                                ))}
                                {filteredIcons.length === 0 && (
                                    <div className="col-span-4 text-center py-4 text-xs text-muted-foreground">
                                        No se encontraron iconos.
                                    </div>
                                )}
                            </div>
                            {errors.category_icon_id && <p className="text-red-500 text-xs">{errors.category_icon_id}</p>}
                            <div className="text-xs text-center pt-2">
                                ¿No encuentras el icono? <button type="button" className="text-blue-600 underline" onClick={() => setIsRequestIconOpen(true)}>Solicita uno nuevo</button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" className="cursor-pointer ring-0 hover:ring-0 focus:ring-0" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={processing} className="cursor-pointer ring-0 hover:ring-0 focus:ring-0">{editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}</Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>

            {/* Request Icon Modal */}
            <Dialog open={isRequestIconOpen} onOpenChange={setIsRequestIconOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Solicitar Nuevo Icono</DialogTitle>
                        <DialogDescription>
                            Sube una imagen de referencia y nosotros crearemos el icono para ti.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitRequestIcon} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="req_name">Nombre del Icono</Label>
                            <Input
                                id="req_name"
                                value={requestData.requested_name}
                                onChange={(e) => setRequestData('requested_name', e.target.value)}
                                required
                                className="ring-0 hover:ring-0 focus:ring-0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                id="req_image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setRequestData('reference_image', e.target.files ? e.target.files[0] : null)}
                                required
                                className="ring-0 hover:ring-0 focus:ring-0 border-dashed"
                            />
                            <p className="text-[0.8rem] text-muted-foreground">Máximo 2MB</p>
                            {errorsRequest.reference_image && <p className="text-red-500 text-xs">{errorsRequest.reference_image}</p>}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" className="cursor-pointer ring-0 hover:ring-0 focus:ring-0" onClick={() => setIsRequestIconOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={processingRequest} className="cursor-pointer ring-0 hover:ring-0 focus:ring-0">Enviar Solicitud</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar Categoría?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {(categoryToDelete?.products_count || 0) > 0 || (categoryToDelete?.children_count || 0) > 0 ? (
                                <div className="space-y-3">
                                    <p className="text-red-500 font-bold">No se puede eliminar esta categoría.</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {(categoryToDelete?.products_count || 0) > 0 && (
                                            <li>Tiene <span className="font-bold">{categoryToDelete?.products_count}</span> productos asociados.</li>
                                        )}
                                        {(categoryToDelete?.children_count || 0) > 0 && (
                                            <li>Tiene <span className="font-bold">{categoryToDelete?.children_count}</span> subcategorías asociadas.</li>
                                        )}
                                    </ul>
                                    <p className="text-sm">Debes mover o eliminar estos elementos antes de borrar la categoría.</p>
                                </div>
                            ) : (
                                <p>¿Estás seguro de que deseas eliminar la categoría <span className="font-bold">{categoryToDelete?.name}</span>? Esta acción no se puede deshacer.</p>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer ring-0 hover:ring-0 focus:ring-0">Cerrar</AlertDialogCancel>
                        {(!categoryToDelete?.products_count || categoryToDelete.products_count === 0) && (!categoryToDelete?.children_count || categoryToDelete.children_count === 0) && (
                            <AlertDialogAction
                                onClick={() => categoryToDelete && handleDelete(categoryToDelete.id)}
                                variant="destructive"
                                className="cursor-pointer ring-0 hover:ring-0 focus:ring-0"
                            >
                                Eliminar
                            </AlertDialogAction>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </AdminLayout>
    );
}
