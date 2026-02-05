import { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { toast } from 'sonner';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Shield, MoreHorizontal, Plus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
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

interface Role {
    id: number;
    name: string;
    is_system: boolean;
    permissions_count: number;
    created_at: string;
}

interface Props extends PageProps {
    roles: Role[];
    currentTenant: any;
}

export default function RolesIndex({ auth, roles, currentUserRole, currentTenant }: PageProps<{ roles: any[] }>) {
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<any>(null);

    const checkPermission = (permission: string) => {
        if (!currentUserRole) return false;
        return currentUserRole.is_owner ||
            currentUserRole.permissions.includes('*') ||
            currentUserRole.permissions.includes(permission);
    };

    const handleProtectedNavigation = (e: React.MouseEvent, permission: string, url: string) => {
        e.preventDefault();
        if (checkPermission(permission)) {
            router.visit(url);
        } else {
            setShowPermissionModal(true);
        }
    };

    const handleProtectedDelete = (permission: string, url: string) => {
        if (checkPermission(permission)) {
            router.delete(url, {
                onSuccess: () => toast.success('Rol eliminado con éxito'),
            });
        } else {
            setShowPermissionModal(true);
        }
    };

    return (
        <AdminLayout title="Roles y Permisos">
            <Head title="Roles y Permisos" />

            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Roles y Permisos</h2>
                        <p className="text-slate-500">Administra los roles y niveles de acceso de tu equipo.</p>
                    </div>
                    <Button
                        className="cursor-pointer"
                        onClick={(e) => handleProtectedNavigation(e, 'roles.create', route('tenant.roles.create', { tenant: currentTenant?.slug }))}
                    >
                        <Plus />
                        Crear Nuevo Rol
                    </Button>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Nombre del Rol</TableHead>
                                <TableHead>Permisos Asignados</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-muted-foreground" />
                                            {role.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-mono">
                                            {role.permissions_count} permisos
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {role.is_system ? (
                                            <Badge variant="secondary">Sistema</Badge>
                                        ) : (
                                            <Badge variant="outline">Personalizado</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Abrir menú</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    className="cursor-pointer ring-0 hover:ring-0 focus:ring-0"
                                                    onClick={(e) => handleProtectedNavigation(e, 'roles.update', route('tenant.roles.edit', { tenant: currentTenant?.slug, role: role.id }))}
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar Permisos
                                                </DropdownMenuItem>
                                                {!role.is_system && (
                                                    <>
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            className="cursor-pointer ring-0 hover:ring-0 focus:ring-0"
                                                            onSelect={() => setRoleToDelete(role)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Eliminar Rol
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {roles.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                        No hay roles creados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog open={!!roleToDelete} onOpenChange={(open) => !open && setRoleToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar Rol?</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de que deseas eliminar el rol <span className="font-bold">{roleToDelete?.name}</span>? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer ring-0 hover:ring-0 focus:ring-0">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                handleProtectedDelete('roles.delete', route('tenant.roles.destroy', { tenant: currentTenant?.slug, role: roleToDelete?.id }));
                                setRoleToDelete(null);
                            }}
                            variant="destructive"
                            className="cursor-pointer ring-0 hover:ring-0 focus:ring-0"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
