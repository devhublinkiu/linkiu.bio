import { useState, useEffect } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
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
import { Search, Pencil, Trash2, ShieldCheck, Mail, Store } from 'lucide-react';

export default function Index({ users, filters }: { users: any, filters: any }) {
    // State
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [deletingUser, setDeletingUser] = useState<any>(null);

    // Filters State
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(route('users.index'), {
                    search: search,
                    role: roleFilter === 'all' ? '' : roleFilter
                }, { preserveState: true, replace: true });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Handle Role Filter
    const handleRoleChange = (value: string) => {
        setRoleFilter(value);
        router.get(route('users.index'), {
            search: search,
            role: value === 'all' ? '' : value
        }, { preserveState: true, replace: true });
    };

    // Edit Form
    const { data: editData, setData: setEditData, put: editPut, processing: editProcessing, errors: editErrors, reset: editReset } = useForm({
        name: '',
        email: '',
        is_super_admin: false,
    });

    const openEdit = (user: any) => {
        setEditingUser(user);
        setEditData({
            name: user.name,
            email: user.email,
            is_super_admin: Boolean(user.is_super_admin),
        });
        setEditOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        editPut(route('users.update', editingUser.id), {
            onSuccess: () => {
                setEditOpen(false);
                setEditingUser(null);
            },
        });
    };

    // Delete Logic
    const openDelete = (user: any) => {
        setDeletingUser(user);
        setDeleteOpen(true);
    };

    const submitDelete = () => {
        if (!deletingUser) return;
        router.delete(route('users.destroy', deletingUser.id), {
            onSuccess: () => setDeleteOpen(false),
        });
    };

    return (
        <SuperAdminLayout header="Gestión de Usuarios">
            <Head title="Usuarios" />

            {/* Header */}
            <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight">Directorio de Usuarios</h2>
                <p className="text-sm text-muted-foreground mt-1">Administra todos los usuarios registrados en la plataforma.</p>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar por nombre o email..."
                        className="pl-8 bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={roleFilter} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-[200px] bg-white">
                        <SelectValue placeholder="Filtrar por Rol" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los Roles</SelectItem>
                        <SelectItem value="superadmin">Super Admins</SelectItem>
                        <SelectItem value="user">Usuarios</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-md border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Tenants Asociados</TableHead>
                            <TableHead>Fecha Registro</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data.map((user: any) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} />
                                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.name}</span>
                                            <span className="text-xs text-gray-400 flex items-center">
                                                <Mail className="h-3 w-3 mr-1" />
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {user.is_super_admin ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-1 text-xs font-semibold text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                            <ShieldCheck className="h-3 w-3" />
                                            Super Admin
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                            Usuario
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        {user.tenants && user.tenants.length > 0 ? (
                                            user.tenants.map((t: any) => (
                                                <Link
                                                    key={t.id}
                                                    href={`#`}
                                                    className="inline-flex items-center text-xs text-blue-600 hover:underline"
                                                >
                                                    <Store className="h-3 w-3 mr-1" />
                                                    {t.name}
                                                </Link>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Sin tiendas</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-500 text-xs">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="icon" onClick={() => openEdit(user)}>
                                        <Pencil className="h-4 w-4 text-gray-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => openDelete(user)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="p-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                    <div>
                        Mostrando {users.from} a {users.to} de {users.total} usuarios
                    </div>
                    <div className="flex gap-1">
                        {users.links.map((link: any, i: number) => (
                            link.url ? (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={`px-3 py-1 rounded border ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={i}
                                    className="px-3 py-1 rounded border bg-gray-50 text-gray-400 cursor-not-allowed"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        ))}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={submitEdit}>
                        <DialogHeader>
                            <DialogTitle>Editar Usuario</DialogTitle>
                            <DialogDescription>Modifica los detalles del usuario.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="e-name">Nombre</Label>
                                <Input id="e-name" value={editData.name} onChange={(e) => setEditData('name', e.target.value)} required />
                                {editErrors.name && <span className="text-red-500 text-xs">{editErrors.name}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="e-email">Email</Label>
                                <Input id="e-email" type="email" value={editData.email} onChange={(e) => setEditData('email', e.target.value)} required />
                                {editErrors.email && <span className="text-red-500 text-xs">{editErrors.email}</span>}
                            </div>
                            <div className="flex items-center space-x-2 mt-2 border p-3 rounded-md bg-purple-50 border-purple-100">
                                <Checkbox
                                    id="e-super"
                                    checked={editData.is_super_admin}
                                    onCheckedChange={(checked) => setEditData('is_super_admin', checked === true)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label htmlFor="e-super" className="text-sm font-medium leading-none cursor-pointer text-purple-900">
                                        Es Super Administrador
                                    </label>
                                    <p className="text-xs text-purple-600">Acceso total al panel de control.</p>
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
                        <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente al usuario <strong>{deletingUser?.name}</strong>.
                            Si tiene tiendas activas, estas podrían quedar huérfanas o inaccesibles.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={submitDelete} className="bg-red-600 hover:bg-red-700">Eliminar Cuenta</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </SuperAdminLayout>
    );
}
