import { useState, useEffect } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/Components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/Components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/Components/ui/select"
import { Checkbox } from '@/Components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Check, ShieldAlert, BadgeCheck, Plus, Pencil, Trash2, Search, Store } from 'lucide-react';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';


export default function Index({ categories, verticals, filters, flash }: { categories: any[], verticals: any[], filters: any, flash: any }) {
    const { auth } = usePage<any>().props;
    const permissions = auth.permissions || [];
    const hasPermission = (p: string) => permissions.includes('*') || permissions.includes(p);

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
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={(e) => {
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
                                <div className="grid gap-2">
                                    <Label htmlFor="c-name">Nombre</Label>
                                    <Input id="c-name" value={createData.name} onChange={(e) => setCreateData('name', e.target.value)} required />
                                    {createErrors.name && <span className="text-red-500 text-xs">{createErrors.name}</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="c-vertical">Vertical</Label>
                                    <select
                                        id="c-vertical"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                        value={createData.vertical_id}
                                        onChange={(e) => setCreateData('vertical_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Selecciona Vertical...</option>
                                        {verticals.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                    </select>
                                    {createErrors.vertical_id && <span className="text-red-500 text-xs">{createErrors.vertical_id}</span>}
                                </div>
                                <div className="flex items-center space-x-2 mt-2 border p-3 rounded-md bg-gray-50">
                                    <Checkbox
                                        id="c-verif"
                                        checked={createData.require_verification}
                                        onCheckedChange={(checked) => setCreateData('require_verification', checked === true)}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <label htmlFor="c-verif" className="text-sm font-medium leading-none cursor-pointer">
                                            Requiere Aprobación Manual
                                        </label>
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
            <div className="flex gap-4 mb-6">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar categorías..."
                        className="pl-8 bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={verticalFilter} onValueChange={handleVerticalChange}>
                    <SelectTrigger className="w-[200px] bg-white">
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
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium">
                                    <div>{category.name}</div>
                                    <div className="text-xs text-gray-400">/{category.slug}</div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                        {category.vertical?.name}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {category.require_verification ? (
                                        <div className="flex items-center text-amber-600 text-xs font-medium">
                                            <ShieldAlert className="h-4 w-4 mr-1" />
                                            Manual
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-green-600 text-xs font-medium">
                                            <BadgeCheck className="h-4 w-4 mr-1" />
                                            Automática
                                        </div>
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
                        {categories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No se encontraron categorías.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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
                            <div className="grid gap-2">
                                <Label htmlFor="e-name">Nombre</Label>
                                <Input id="e-name" value={editData.name} onChange={(e) => setEditData('name', e.target.value)} required />
                                {editErrors.name && <span className="text-red-500 text-xs">{editErrors.name}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="e-vertical">Vertical</Label>
                                <select
                                    id="e-vertical"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={editData.vertical_id}
                                    onChange={(e) => setEditData('vertical_id', e.target.value)}
                                    required
                                >
                                    <option value="">Selecciona Vertical...</option>
                                    {verticals.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                                {editErrors.vertical_id && <span className="text-red-500 text-xs">{editErrors.vertical_id}</span>}
                            </div>
                            <div className="flex items-center space-x-2 mt-2 border p-3 rounded-md bg-gray-50">
                                <Checkbox
                                    id="e-verif"
                                    checked={editData.require_verification}
                                    onCheckedChange={(checked) => setEditData('require_verification', checked === true)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label htmlFor="e-verif" className="text-sm font-medium leading-none cursor-pointer">
                                        Requiere Aprobación Manual
                                    </label>
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
