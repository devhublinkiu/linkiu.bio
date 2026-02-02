import { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
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

export default function RolesIndex({ roles, currentTenant }: Props) {
    const { currentUserRole } = usePage<PageProps>().props;
    const [showPermissionModal, setShowPermissionModal] = useState(false);

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

    const handleProtectedDelete = (e: React.MouseEvent, permission: string, url: string) => {
        e.preventDefault();
        if (checkPermission(permission)) {
            router.delete(url);
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
                        className="font-bold"
                        onClick={(e) => handleProtectedNavigation(e, 'roles.create', route('tenant.roles.create', { tenant: currentTenant.slug }))}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Nuevo Rol
                    </Button>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
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
                                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                                <Shield className="h-4 w-4" />
                                            </div>
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
                                            <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200">Sistema</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">Personalizado</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Abrir menú</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={(e) => handleProtectedNavigation(e, 'roles.update', route('tenant.roles.edit', { tenant: currentTenant.slug, role: role.id }))}
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar Permisos
                                                </DropdownMenuItem>
                                                {!role.is_system && (
                                                    <>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                            onClick={(e) => handleProtectedDelete(e, 'roles.delete', route('tenant.roles.destroy', { tenant: currentTenant.slug, role: role.id }))}
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
        </AdminLayout>
    );
}
