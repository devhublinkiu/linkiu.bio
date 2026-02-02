import { useState } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Separator } from '@/Components/ui/separator';
import { ArrowLeft, Save, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface Permission {
    id: number;
    name: string;
    label: string;
    module: string;
}

interface Props extends PageProps {
    role?: {
        id: number;
        name: string;
        permissions: Permission[];
    };
    permissions: Record<string, Permission[]>;
    currentTenant: any;
}

export default function RolesCreateEdit({ role, permissions, currentTenant }: Props) {
    const isEditing = !!role;

    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name || '',
        permissions: role?.permissions.map(p => p.id) || [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(route('tenant.roles.update', { tenant: currentTenant.slug, role: role.id }));
        } else {
            post(route('tenant.roles.store', { tenant: currentTenant.slug }));
        }
    };

    const togglePermission = (permissionId: number) => {
        const currentPermissions = new Set(data.permissions);
        if (currentPermissions.has(permissionId)) {
            currentPermissions.delete(permissionId);
        } else {
            currentPermissions.add(permissionId);
        }
        setData('permissions', Array.from(currentPermissions));
    };

    const toggleModule = (modulePermissions: Permission[]) => {
        const moduleIds = modulePermissions.map(p => p.id);
        const allSelected = moduleIds.every(id => data.permissions.includes(id));

        let newPermissions = [...data.permissions];

        if (allSelected) {
            // Unselect all
            newPermissions = newPermissions.filter(id => !moduleIds.includes(id));
        } else {
            // Select all (add missing ones)
            moduleIds.forEach(id => {
                if (!newPermissions.includes(id)) {
                    newPermissions.push(id);
                }
            });
        }

        setData('permissions', newPermissions);
    };

    return (
        <AdminLayout title={isEditing ? 'Editar Rol' : 'Crear Nuevo Rol'}>
            <Head title={isEditing ? 'Editar Rol' : 'Crear Nuevo Rol'} />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('tenant.roles.index', { tenant: currentTenant.slug })}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {isEditing ? `Editar Rol: ${role.name}` : 'Crear Nuevo Rol'}
                        </h2>
                        <p className="text-slate-500">Define el nombre del rol y sus permisos de acceso.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Básica</CardTitle>
                            <CardDescription>
                                Asigna un nombre descriptivo para identificar este rol en tu equipo.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="name">Nombre del Rol</Label>
                                <Input
                                    id="name"
                                    placeholder="Ej. Gerente de Tienda"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && <p className="text-sm text-red-500 font-medium">{errors.name}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Permisos del Sistema</h3>
                                <p className="text-sm text-slate-500">Selecciona las acciones que este rol podrá realizar.</p>
                            </div>
                            <div className="text-sm font-medium text-slate-500">
                                {data.permissions.length} permisos seleccionados
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(permissions).map(([module, modulePermissions]) => {
                                const moduleIds = modulePermissions.map(p => p.id);
                                const allSelected = moduleIds.every(id => data.permissions.includes(id));
                                const someSelected = moduleIds.some(id => data.permissions.includes(id));

                                return (
                                    <Card key={module} className="overflow-hidden border-slate-200">
                                        <div className="bg-slate-50/50 p-3 border-b border-slate-200 flex items-center justify-between">
                                            <div className="font-bold flex items-center gap-2">
                                                <ShieldCheck className={`h-4 w-4 ${someSelected ? 'text-primary' : 'text-slate-400'}`} />
                                                {module}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`module-${module}`}
                                                    checked={allSelected}
                                                    onCheckedChange={() => toggleModule(modulePermissions)}
                                                />
                                                <label
                                                    htmlFor={`module-${module}`}
                                                    className="text-xs font-medium text-slate-500 cursor-pointer select-none"
                                                >
                                                    Todos
                                                </label>
                                            </div>
                                        </div>
                                        <CardContent className="p-3 grid gap-2">
                                            {modulePermissions.map((permission) => (
                                                <div key={permission.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                                    <Checkbox
                                                        id={`perm-${permission.id}`}
                                                        checked={data.permissions.includes(permission.id)}
                                                        onCheckedChange={() => togglePermission(permission.id)}
                                                    />
                                                    <div className="grid gap-1.5 leading-none">
                                                        <label
                                                            htmlFor={`perm-${permission.id}`}
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                        >
                                                            {permission.label || permission.name}
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4 pb-12">
                        <Button variant="outline" asChild>
                            <Link href={route('tenant.roles.index', { tenant: currentTenant.slug })}>
                                Cancelar
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="min-w-[150px] font-bold">
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Guardando...' : 'Guardar Rol'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
