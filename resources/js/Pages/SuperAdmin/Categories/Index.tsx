import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Checkbox } from '@/Components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/Components/ui/empty';
import { FieldError } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/Components/ui/input-group';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/Components/ui/alert-dialog";
import { BadgeCheck, Pencil, Plus, Search, ShieldAlert, Store, Trash2 } from 'lucide-react';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import Pagination from '@/Components/Shared/Pagination';
import { useEffect, useState } from 'react';

export default function Index({ categories, verticals, filters, flash }: { categories: any, verticals: any[], filters: any, flash: any }) {
    const { auth, route } = usePage<any>().props;
    const permissions = auth.permissions || [];
    const hasPermission = (p: string) => permissions.includes('*') || permissions.includes(p);

    const categoriesList = categories.data || categories;
    const categoriesLinks = categories.links || [];

    // State
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [deletingCategory, setDeletingCategory] = useState<any>(null);
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    // Filters State
    const [search, setSearch] = useState(filters.search || '');
    const [verticalFilter, setVerticalFilter] = useState(filters.vertical_id || 'all');

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(route('categories.index'), {
                    search: search,
                    vertical_id: verticalFilter === 'all' ? '' : verticalFilter
                }, { preserveState: true, replace: true });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Handle Vertical Filter
    const handleVerticalChange = (value: string) => {
        setVerticalFilter(value);
        router.get(route('categories.index'), {
            search: search,
            vertical_id: value === 'all' ? '' : value
        }, { preserveState: true, replace: true });
    };

    // Create Form
    const { data: createData, setData: setCreateData, post: createPost, processing: createProcessing, errors: createErrors, reset: createReset } = useForm({
        name: '',
        vertical_id: '',
        require_verification: false,
    });

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createPost(route('categories.store'), {
            onSuccess: () => {
                createReset();
                setCreateOpen(false);
            },
        });
    };

    // Edit Form
    const { data: editData, setData: setEditData, put: editPut, processing: editProcessing, errors: editErrors, reset: editReset } = useForm({
        name: '',
        vertical_id: '',
        require_verification: false,
    });

    const openEdit = (category: any) => {
        if (!hasPermission('sa.categories.update')) {
            setShowPermissionModal(true);
            return;
        }
        setEditingCategory(category);
        setEditData({
            name: category.name,
            vertical_id: category.vertical_id.toString(),
            require_verification: Boolean(category.require_verification),
        });
        setEditOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        editPut(route('categories.update', editingCategory.id), {
            onSuccess: () => {
                setEditOpen(false);
                setEditingCategory(null);
            },
        });
    };

    // Delete Logic
    const openDelete = (category: any) => {
        if (!hasPermission('sa.categories.delete')) {
            setShowPermissionModal(true);
            return;
        }
        setDeletingCategory(category);
        setDeleteOpen(true);
    };

    const submitDelete = () => {
        if (!deletingCategory) return;
        router.delete(route('categories.destroy', deletingCategory.id), {
            onSuccess: () => setDeleteOpen(false),
        });
    };

    return (
        <SuperAdminLayout header="Categorías de Negocio">
            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />
            <Head title="Categorías" />

            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Gestión de Categorías</h2>
                    <p className="text-sm text-muted-foreground mt-1">Define las reglas para cada tipo de negocio.</p>
                </div>

                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={(e) => {
                            if (!hasPermission('sa.categories.create')) {
                                e.preventDefault();
                                setShowPermissionModal(true);
                            }
                        }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Categoría
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={submitCreate}>
                            <DialogHeader>
                                <DialogTitle>Crear Categoría</DialogTitle>
                                <DialogDescription>Añade una nueva categoría para que los tenants la seleccionen.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="c-name">Nombre</Label>
                                    <Input id="c-name" value={createData.name} onChange={(e) => setCreateData('name', e.target.value)} required />
                                    <FieldError>{createErrors.name}</FieldError>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="c-vertical">Vertical</Label>
                                    <Select
                                        value={createData.vertical_id}
                                        onValueChange={(value) => setCreateData('vertical_id', value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecciona Vertical..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {verticals.map(v => (
                                                <SelectItem key={v.id} value={v.id.toString()}>
                                                    {v.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError>{createErrors.vertical_id}</FieldError>
                                </div>
                                <div className="flex items-center space-x-2 mt-2 border p-3 rounded-md bg-gray-50">
                                    <Checkbox
                                        id="c-verif"
                                        checked={createData.require_verification}
                                        onCheckedChange={(checked) => setCreateData('require_verification', checked === true)}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="c-verif" className="text-sm font-medium leading-none cursor-pointer">
                                            Requiere Aprobación Manual
                                        </Label>
                                        <p className="text-xs text-muted-foreground">Para negocios regulados (Salud, Alcohol).</p>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createProcessing}>Guardar</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="w-full max-sm:w-full md:max-w-sm">
                    <InputGroup>
                        <InputGroupAddon>
                            <Search className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                            type="search"
                            placeholder="Buscar categorías..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </InputGroup>
                </div>
                <Select value={verticalFilter} onValueChange={handleVerticalChange}>
                    <SelectTrigger className="w-full md:w-[200px] bg-white">
                        <SelectValue placeholder="Filtrar por Vertical" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las Verticales</SelectItem>
                        {verticals.map((v) => (
                            <SelectItem key={v.id} value={v.id.toString()}>{v.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-md border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Vertical</TableHead>
                            <TableHead>Aprobación</TableHead>
                            <TableHead>Tiendas</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categoriesList.map((category: any) => (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium">
                                    <div>{category.name}</div>
                                    <div className="text-xs text-muted-foreground">/{category.slug}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {category.vertical?.name}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {category.require_verification ? (
                                        <Badge variant="secondary" className="gap-1 text-amber-600 bg-amber-50 hover:bg-amber-100">
                                            <ShieldAlert className="h-3 w-3" />
                                            Manual
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="gap-1 text-green-600 bg-green-50 hover:bg-green-100">
                                            <BadgeCheck className="h-3 w-3" />
                                            Automática
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-gray-500">
                                        <Store className="h-4 w-4 mr-1" />
                                        {category.tenants_count}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="icon" onClick={() => openEdit(category)}>
                                        <Pencil className="h-4 w-4 text-gray-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => openDelete(category)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {categoriesList.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="py-12">
                                    <Empty>
                                        <EmptyHeader>
                                            <EmptyTitle>No se encontraron categorías</EmptyTitle>
                                            <EmptyDescription>
                                                No hay categorías registradas que coincidan con tu búsqueda.
                                            </EmptyDescription>
                                        </EmptyHeader>
                                    </Empty>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="mt-4 flex justify-end">
                <Pagination links={categoriesLinks} />
            </div>

            {/* Edit Modal */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={submitEdit}>
                        <DialogHeader>
                            <DialogTitle>Editar Categoría</DialogTitle>
                            <DialogDescription>Modifica los datos de la categoría.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="e-name">Nombre</Label>
                                <Input id="e-name" value={editData.name} onChange={(e) => setEditData('name', e.target.value)} required />
                                <FieldError>{editErrors.name}</FieldError>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="e-vertical">Vertical</Label>
                                <Select
                                    value={editData.vertical_id}
                                    onValueChange={(value) => setEditData('vertical_id', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona Vertical..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {verticals.map(v => (
                                            <SelectItem key={v.id} value={v.id.toString()}>
                                                {v.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError>{editErrors.vertical_id}</FieldError>
                            </div>
                            <div className="flex items-center space-x-2 mt-2 border p-3 rounded-md bg-gray-50">
                                <Checkbox
                                    id="e-verif"
                                    checked={editData.require_verification}
                                    onCheckedChange={(checked) => setEditData('require_verification', checked === true)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="e-verif" className="text-sm font-medium leading-none cursor-pointer">
                                        Requiere Aprobación Manual
                                    </Label>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={editProcessing}>Actualizar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará la categoría <strong>{deletingCategory?.name}</strong>.
                            {deletingCategory?.tenants_count > 0 && (
                                <div className="mt-2 p-2 bg-red-50 text-red-600 rounded-md font-medium border border-red-200">
                                    ⚠️ ¡Atención! Esta categoría tiene {deletingCategory.tenants_count} tiendas asociadas. El sistema bloqueará esta eliminación.
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={submitDelete} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </SuperAdminLayout>
    );
}
