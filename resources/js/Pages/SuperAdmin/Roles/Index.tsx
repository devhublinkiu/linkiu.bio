import { useState } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import { Button } from '@/Components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/Components/ui/table';
import { Shield, Plus, Pencil, Trash2 } from 'lucide-react';
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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip"

export default function Index({ roles }: { roles: any }) {
    const { auth } = usePage<any>().props;
    const permissions = auth.permissions || [];
    const hasPermission = (p: string) => permissions.includes('*') || permissions.includes(p);
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingRole, setDeletingRole] = useState<any>(null);

    const handleDelete = (role: any) => {
        if (!hasPermission('sa.roles.delete')) {
            setShowPermissionModal(true);
            return;
        }
        setDeletingRole(role);
        setDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (deletingRole) {
            router.delete(route('roles.destroy', deletingRole.id), {
                onSuccess: () => setDeleteOpen(false)
            });
        }
    };

    return (
        <SuperAdminLayout header="Gestión de Roles Globales">
            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />
            <Head title="Roles Globales" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Roles del Sistema</h2>
                    <p className="text-sm text-muted-foreground mt-1">Define los roles y permisos globales para los administradores.</p>
                </div>
                <Button asChild className="cursor-pointer">
                    <Link href={route('roles.create')} onClick={(e) => {
                        if (!hasPermission('sa.roles.create')) {
                            e.preventDefault();
                            setShowPermissionModal(true);
                        }
                    }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Nuevo Rol
                    </Link>
                </Button>
            </div>

            <div className="bg-card rounded-md border border-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre del Rol</TableHead>
                            <TableHead>Usuarios Asignados</TableHead>
                            <TableHead>Guard</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.data.map((role: any) => (
                            <TableRow key={role.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-primary" />
                                        {role.name}
                                        {role.name === 'Super Admin' && (
                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20 uppercase">
                                                Sistema
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">
                                        {role.users_count} usuarios
                                    </span>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-xs">
                                    {role.guard_name}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    {role.name !== 'Super Admin' && (
                                        <>
                                            <Button variant="ghost" size="icon" asChild className="cursor-pointer">
                                                <Link href={route('roles.edit', role.id)} onClick={(e) => {
                                                    if (!hasPermission('sa.roles.update')) {
                                                        e.preventDefault();
                                                        setShowPermissionModal(true);
                                                    }
                                                }}>
                                                    <Pencil className="h-4 w-4 text-gray-500" />
                                                </Link>
                                            </Button>

                                            {role.users_count > 0 ? (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span tabIndex={0}>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-gray-300 cursor-not-allowed"
                                                                    disabled
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>No se puede eliminar: tiene usuarios asignados</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                                    onClick={() => handleDelete(role)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar este rol?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Estás a punto de eliminar el rol <strong>{deletingRole?.name}</strong>. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 cursor-pointer">
                            Eliminar Rol
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SuperAdminLayout >
    );
}
