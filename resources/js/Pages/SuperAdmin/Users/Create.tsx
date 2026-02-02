import { useState } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select"

export default function Create({ roles }: { roles: any[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: null as number | null,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <SuperAdminLayout header="Crear Nuevo Usuario">
            <Head title="Crear Usuario" />

            <div className="mb-6">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-blue-600 cursor-pointer">
                    <Link href={route('users.index')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Usuarios
                    </Link>
                </Button>
            </div>

            <form onSubmit={submit}>
                <div className="grid gap-6 max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Personal</CardTitle>
                            <CardDescription>
                                Ingresa los datos básicos para el nuevo usuario.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre Completo</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej. Juan Pérez"
                                    required
                                />
                                {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="juan@ejemplo.com"
                                    required
                                />
                                {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            )}
                                        </Button>
                                    </div>
                                    {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
                                    <Input
                                        id="password_confirmation"
                                        type={showPassword ? "text" : "password"}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Asignación de Rol</CardTitle>
                            <CardDescription>
                                (Opcional) Asigna un rol global de administración. Si es un usuario normal, déjalo vacío.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2 text-left">
                                <Label htmlFor="role">Rol Global</Label>
                                <Select
                                    onValueChange={(value) => setData('role_id', value === 'none' ? null : Number(value))}
                                    value={data.role_id ? String(data.role_id) : undefined}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccionar un rol..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">-- Ningún Rol (Usuario Normal) --</SelectItem>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={String(role.id)} className="cursor-pointer">
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Los usuarios con rol "Super Admin" tienen acceso total. Otros roles tienen permisos específicos.
                                </p>
                                {errors.role_id && <span className="text-red-500 text-xs">{errors.role_id}</span>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto cursor-pointer">
                            <Save className="mr-2 h-4 w-4" />
                            Crear Usuario
                        </Button>
                    </div>
                </div>
            </form>
        </SuperAdminLayout>
    );
}
