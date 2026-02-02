import { useState, useEffect } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Save, ShieldCheck } from 'lucide-react';

export default function Edit({ role, permissions, rolePermissions }: { role: any, permissions: Record<string, any[]>, rolePermissions: string[] }) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: rolePermissions,
    });

    const handlePermissionChange = (permissionName: string, checked: boolean) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            setData('permissions', data.permissions.filter(p => p !== permissionName));
        }
    };

    const toggleGroup = (groupPermissions: any[], checked: boolean) => {
        const groupNames = groupPermissions.map(p => p.name);
        if (checked) {
            const unique = new Set([...data.permissions, ...groupNames]);
            setData('permissions', Array.from(unique));
        } else {
            setData('permissions', data.permissions.filter(p => !groupNames.includes(p)));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('roles.update', role.id));
    };

    return (
        <SuperAdminLayout header={`Editar Rol: ${role.name}`}>
            <Head title="Editar Rol" />

            <div className="mb-6">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-blue-600">
                    <Link href={route('roles.index')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Roles
                    </Link>
                </Button>
            </div>

            <form onSubmit={submit}>
                <div className="max-w-4xl mx-auto space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Básica</CardTitle>
                            <CardDescription>
                                Modifica el nombre del rol para identificarlo correctamente.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full max-w-md items-center gap-1.5">
                                <Label htmlFor="name">Nombre del Rol</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej. Administrador de Soporte"
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && <p className="text-sm text-red-500 font-medium">{errors.name}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Sistema Global</h3>
                                <p className="text-sm text-slate-500">Selecciona las acciones y accesos para este rol.</p>
                            </div>
                            <div className="text-sm font-medium text-slate-500">
                                {data.permissions.length} permisos seleccionados
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(permissions).map(([moduleName, modulePermissions]) => {
                                const moduleNames = modulePermissions.map(p => p.name);
                                const allSelected = moduleNames.every(name => data.permissions.includes(name));
                                const someSelected = moduleNames.some(name => data.permissions.includes(name));

                                return (
                                    <Card key={moduleName} className="overflow-hidden border-slate-200">
                                        <div className="bg-slate-50/50 p-3 border-b border-slate-200 flex items-center justify-between">
                                            <div className="font-bold flex items-center gap-2 text-slate-800">
                                                <ShieldCheck className={`h-4 w-4 ${someSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                                                {moduleName}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`module-${moduleName}`}
                                                    checked={allSelected}
                                                    onCheckedChange={(checked) => toggleGroup(modulePermissions, checked === true)}
                                                />
                                                <label
                                                    htmlFor={`module-${moduleName}`}
                                                    className="text-xs font-medium text-slate-500 cursor-pointer select-none"
                                                >
                                                    Todos
                                                </label>
                                            </div>
                                        </div>
                                        <CardContent className="p-3 grid gap-2">
                                            {modulePermissions.map((permission: any) => (
                                                <div key={permission.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                                    <Checkbox
                                                        id={permission.name}
                                                        checked={data.permissions.includes(permission.name)}
                                                        onCheckedChange={(checked) => handlePermissionChange(permission.name, checked === true)}
                                                    />
                                                    <div className="grid gap-1.5 leading-none">
                                                        <label
                                                            htmlFor={permission.name}
                                                            className="text-sm font-medium leading-none cursor-pointer"
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

                    {errors.permissions && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                            {errors.permissions}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-4 pt-4 pb-12">
                        <Button variant="outline" asChild>
                            <Link href={route('roles.index')}>
                                Cancelar
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="min-w-[150px] font-bold">
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Guardando...' : 'Actualizar Rol'}
                        </Button>
                    </div>
                </div>
            </form>
        </SuperAdminLayout>
    );
}
