import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/Components/ui/alert-dialog";
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/Components/ui/empty';
import { FieldError } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/Components/ui/input-group';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import React, { useState } from 'react';
import Pagination from '@/Components/Shared/Pagination';
import { PageProps } from '@/types';

interface Vertical {
    id: number;
    name: string;
}

interface BusinessCategory {
    id: number;
    name: string;
    vertical_id: number;
}

interface CategoryIcon {
    id: number;
    name: string;
    path: string;
    vertical_id: number | null;
    is_global: boolean;
    is_active: boolean;
    vertical?: Vertical;
    business_category_id: number | null;
    business_category?: BusinessCategory;
}

interface Props {
    icons: {
        data: CategoryIcon[];
        links: any[]; // Pagination links
    };
    verticals: Vertical[];
    businessCategories: BusinessCategory[];
    filters: {
        search?: string;
        vertical_id?: string;
        business_category_id?: string;
        is_global?: string;
    };
}

export default function Index({ icons, verticals, businessCategories, filters }: Props) {
    const { auth } = usePage<PageProps & { auth: { permissions: string[] } }>().props;
    const permissions = auth.permissions || [];

    const hasPermission = (permission: string) => {
        return permissions.includes('*') || permissions.includes(permission);
    };

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [verticalFilter, setVerticalFilter] = useState(filters.vertical_id || 'all');
    const [businessCategoryFilter, setBusinessCategoryFilter] = useState(filters.business_category_id || 'all');
    const [isGlobalFilter, setIsGlobalFilter] = useState(filters.is_global || 'all');
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    const filteredBusinessCategories = verticalFilter !== 'all'
        ? businessCategories.filter(bc => bc.vertical_id.toString() === verticalFilter)
        : [];

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingIcon, setEditingIcon] = useState<CategoryIcon | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Form for Create/Edit
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        icon: null as File | null,
        vertical_id: '',
        business_category_id: '',
        is_global: false,
        _method: 'POST', // For update spoofing if needed, but we use post for files
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('category-icons.index'), {
            search: searchTerm,
            vertical_id: verticalFilter === 'all' ? null : verticalFilter,
            business_category_id: businessCategoryFilter === 'all' ? null : businessCategoryFilter,
            is_global: isGlobalFilter === 'all' ? null : isGlobalFilter,
        }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingIcon(null);
        reset();
        clearErrors();
        setData({
            name: '',
            icon: null,
            vertical_id: '',
            business_category_id: '',
            is_global: false,
            _method: 'POST'
        });
        setIsCreateOpen(true);
    };

    const openEditModal = (icon: CategoryIcon) => {
        setEditingIcon(icon);
        clearErrors();
        setData({
            name: icon.name,
            icon: null, // Don't prepopulate file
            vertical_id: icon.vertical_id ? icon.vertical_id.toString() : '',
            business_category_id: icon.business_category_id ? icon.business_category_id.toString() : '',
            is_global: icon.is_global,
            _method: 'PUT', // Route resource uses PUT/PATCH, but file upload requires POST with _method spoofing
        });
        setIsCreateOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingIcon) {
            post(route('category-icons.update', editingIcon.id), {
                onSuccess: () => setIsCreateOpen(false),
            });
        } else {
            post(route('category-icons.store'), {
                onSuccess: () => setIsCreateOpen(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (deleteId) {
            router.delete(route('category-icons.destroy', deleteId), {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    return (
        <SuperAdminLayout
            header={<h2 className="font-semibold text-base text-gray-800 leading-tight">Gestión de Iconos y Categorías</h2>}
        >
            <Head title="Iconos de Categorías" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        {/* Filters & Actions */}
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                            <form onSubmit={handleSearch} className="flex gap-2 items-center flex-wrap w-full md:w-auto">
                                <div className="w-full md:w-64">
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <Search className="h-4 w-4" />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            placeholder="Buscar..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </InputGroup>
                                </div>

                                <Select
                                    value={verticalFilter}
                                    onValueChange={(val) => setVerticalFilter(val)}
                                >
                                    <SelectTrigger className="w-full md:w-[220px]">
                                        <SelectValue placeholder="Todas las Verticales" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas las Verticales</SelectItem>
                                        {verticals.map(v => (
                                            <SelectItem key={v.id} value={v.id.toString()}>{v.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={isGlobalFilter}
                                    onValueChange={(val) => setIsGlobalFilter(val)}
                                >
                                    <SelectTrigger className="w-full md:w-[170px]">
                                        <SelectValue placeholder="Tipo de Icono" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los tipos</SelectItem>
                                        <SelectItem value="true">Globales</SelectItem>
                                        <SelectItem value="false">Específicos</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button type="submit" variant="secondary" className="w-full md:w-auto px-6">Filtrar</Button>
                            </form>

                            <Button onClick={(e) => {
                                if (!hasPermission('sa.categories.create')) {
                                    e.preventDefault();
                                    setShowPermissionModal(true);
                                } else {
                                    openCreateModal();
                                }
                            }} className="w-full md:w-auto">
                                <Plus className="mr-2 h-4 w-4" /> Nuevo Icono
                            </Button>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {icons.data.map((icon) => (
                                <Card key={icon.id} className="relative group overflow-hidden shadow-none">
                                    <div className=" bg-gray-50 flex items-center justify-center p-4">
                                        <img
                                            src={`/media/${icon.path}`} // Assuming route for media or direct S3 url via controller props? Controller passed 'path', usually string. Need full URL? 
                                            // Model Accessor? Or just path. If path is relative to storage root. 
                                            // Layout usually handles logic. Let's assume `/media/{path}` proxy works or full URL needed.
                                            // Wait, `CategoryIconController` stored in `category-icons`. 
                                            // MediaController proxy is `/media/{path}`.
                                            // So src should be `/media/${icon.path}`
                                            alt={icon.name}
                                            className="w-16 h-16 object-contain border rounded-md"
                                        />
                                    </div>
                                    <CardContent className="p-3">
                                        <p className="font-semibold truncate text-center text-sm" title={icon.name}>{icon.name}</p>
                                        <p className="text-xs text-gray-500 text-center">
                                            {icon.is_global ? 'Global' : (
                                                <>
                                                    <span className="block font-medium text-blue-600">{icon.vertical?.name || 'N/A'}</span>
                                                    {icon.business_category && <span className="block text-gray-400">{icon.business_category.name}</span>}
                                                </>
                                            )}
                                        </p>
                                    </CardContent>
                                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                                        <Button size="icon" variant="secondary" className="h-8 w-8 shadow-sm" onClick={() => {
                                            if (!hasPermission('sa.categories.edit')) {
                                                setShowPermissionModal(true);
                                            } else {
                                                openEditModal(icon);
                                            }
                                        }}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="destructive" className="h-8 w-8 shadow-sm" onClick={() => {
                                            if (!hasPermission('sa.categories.delete')) {
                                                setShowPermissionModal(true);
                                            } else {
                                                handleDelete(icon.id);
                                            }
                                        }}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {icons.data.length === 0 && (
                            <div className="py-12">
                                <Empty>
                                    <EmptyHeader>
                                        <EmptyTitle>No se encontraron iconos</EmptyTitle>
                                        <EmptyDescription>
                                            No hay iconos registrados que coincidan con tu búsqueda.
                                        </EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <Pagination links={icons.links} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Create/Edit */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingIcon ? 'Editar Icono' : 'Nuevo Icono'}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={submit} className="space-y-5">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <FieldError>{errors.name}</FieldError>
                        </div>

                        <div className="flex items-center space-x-2 py-1">
                            <Switch
                                id="is_global"
                                checked={data.is_global}
                                onCheckedChange={(checked) => setData('is_global', checked)}
                            />
                            <Label htmlFor="is_global">Es Global (Disponible para todos)</Label>
                        </div>

                        {!data.is_global && (
                            <>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="vertical">Vertical</Label>
                                    <Select
                                        value={data.vertical_id}
                                        onValueChange={(val) => setData('vertical_id', val)}
                                    >
                                        <SelectTrigger className="border-blue-100 bg-blue-50/30">
                                            <SelectValue placeholder="Selecciona Vertical" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {verticals.map(v => (
                                                <SelectItem key={v.id} value={v.id.toString()}>{v.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {data.vertical_id && (
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="business_category">Categoría de Negocio (Nicho) - Opcional</Label>
                                        <Select
                                            value={data.business_category_id}
                                            onValueChange={(val) => setData('business_category_id', val)}
                                        >
                                            <SelectTrigger className="border-blue-100 bg-blue-50/30">
                                                <SelectValue placeholder="Selecciona Categoría" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {businessCategories
                                                    .filter(bc => bc.vertical_id.toString() === data.vertical_id)
                                                    .map(bc => (
                                                        <SelectItem key={bc.id} value={bc.id.toString()}>{bc.name}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FieldError>{errors.business_category_id}</FieldError>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="icon">Icono (Imagen) {editingIcon && '(Opcional)'}</Label>
                            <Input
                                id="icon"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('icon', e.target.files ? e.target.files[0] : null)}
                                required={!editingIcon}
                                className="cursor-pointer"
                            />
                            <p className="text-[0.75rem] text-muted-foreground">Máximo 2MB</p>
                            <FieldError>{errors.icon}</FieldError>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            {/* Delete Confirmation Alert */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el icono.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />

        </SuperAdminLayout>
    );
}
