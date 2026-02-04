import { useState, useEffect } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
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
import { Search, Pencil, Trash2, ShieldCheck, Mail, Store, Plus } from 'lucide-react';
import Pagination from '@/Components/Shared/Pagination';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';

export default function Index({ users, filters, roles }: { users: any, filters: any, roles: any[] }) {
    const { auth } = usePage<any>().props;
    const permissions = auth.permissions || [];
    const hasPermission = (p: string) => permissions.includes('*') || permissions.includes(p);

    // State
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [deletingUser, setDeletingUser] = useState<any>(null);
    const [showPermissionModal, setShowPermissionModal] = useState(false);

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
        role_id: null as number | null,
    });

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        editPut(route('users.update', editingUser.id), {
            onSuccess: () => {
                setEditOpen(false);
                setEditingUser(null);
            },
        });
    };

    const handleCreateClick = (e: React.MouseEvent) => {
        if (!hasPermission('sa.users.create')) {
            e.preventDefault();
            setShowPermissionModal(true);
        }
    };

    const openEdit = (user: any) => {
        if (!hasPermission('sa.users.update')) {
            setShowPermissionModal(true);
            return;
        }
        setEditingUser(user);
        setEditData({
            name: user.name,
            email: user.email,
            is_super_admin: Boolean(user.is_super_admin),
            role_id: user.role_id,
        });
        setEditOpen(true);
    };

    const openDelete = (user: any) => {
        if (!hasPermission('sa.users.delete')) {
            setShowPermissionModal(true);
            return;
        }
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
            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />
            <Head title="Usuarios" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Directorio de Usuarios</h2>
                    <p className="text-sm text-muted-foreground mt-1">Administra todos los usuarios registrados en la plataforma.</p>
                </div>
                <Button asChild className="cursor-pointer">
                    <Link href={route('users.create')} onClick={handleCreateClick}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Usuario
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar por nombre o email..."
                        className="pl-9 bg-card"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={roleFilter} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-[200px] bg-card">
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
            <div className="bg-card rounded-xl border overflow-hidden">
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
                                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary uppercase tracking-tight ring-1 ring-inset ring-primary/20">
                                            <ShieldCheck className="h-3 w-3" />
                                            Super Admin
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-tight ring-1 ring-inset ring-border">
                                            {user.global_role ? user.global_role.name : 'Usuario'}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1.5">
                                        {user.tenants && user.tenants.length > 0 ? (
                                            user.tenants.map((t: any) => (
                                                <Link
                                                    key={t.id}
                                                    href={`#`}
                                                    className="inline-flex items-center px-1.5 py-0.5 rounded bg-muted/50 text-[10px] font-medium text-primary hover:bg-muted transition-colors border border-border"
                                                >
                                                    <Store className="h-2.5 w-2.5 mr-1" />
                                                    {t.name}
                                                </Link>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-muted-foreground/60 italic">Sin tiendas</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-500 text-xs">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right space-x-1">
                                    <Button variant="ghost" size="icon-xs" onClick={() => openEdit(user)}>
                                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => openDelete(user)}
                                        disabled={(user.tenants && user.tenants.length > 0) || user.id === auth.user.id}
                                        title={
                                            user.id === auth.user.id
                                                ? "No puedes eliminar tu propia cuenta"
                                                : (user.tenants && user.tenants.length > 0)
                                                    ? "No se puede eliminar usuario con tiendas activas"
                                                    : "Eliminar usuario"
                                        }
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="px-4 py-3 border-t flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">
                        Mostrando <span className="text-foreground">{users.from}</span> a <span className="text-foreground">{users.to}</span> de <span className="text-foreground">{users.total}</span> usuarios
                    </p>
                    <Pagination links={users.links} />
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
                            <div className="grid gap-2">
                                <Label htmlFor="e-role">Rol Global</Label>
                                <Select
                                    onValueChange={(value) => setEditData('role_id', value === 'none' ? null : Number(value))}
                                    value={editData.role_id ? String(editData.role_id) : 'none'}
                                >
                                    <SelectTrigger id="e-role" className="w-full">
                                        <SelectValue placeholder="Seleccionar un rol..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">-- Ningún Rol (Usuario Normal) --</SelectItem>
                                        {roles.map((role: any) => (
                                            <SelectItem key={role.id} value={String(role.id)}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editErrors.role_id && <span className="text-red-500 text-xs">{editErrors.role_id}</span>}
                            </div>
                            <div className="flex items-center space-x-3 mt-2 border p-3 rounded-xl bg-primary/5 border-primary/10">
                                <Checkbox
                                    id="e-super"
                                    checked={editData.is_super_admin}
                                    onCheckedChange={(checked) => setEditData('is_super_admin', checked === true)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label htmlFor="e-super" className="text-sm font-semibold leading-none cursor-pointer text-primary">
                                        Es Super Administrador
                                    </label>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Acceso total al panel de control</p>
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
