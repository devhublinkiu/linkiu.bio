import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/Components/ui/alert';
import {
    User,
    Lock,
    Camera,
    AlertCircle,
    Save,
    MapPin,
    Phone,
    Globe
} from 'lucide-react';
import { FormEventHandler, useState, useRef } from 'react';
import { toast } from 'sonner';
import { PageProps } from '@/types';

interface Props extends PageProps {
    status?: string;
    tenant: {
        id: number;
        name: string;
        slug: string;
        category_name: string;
        vertical_name: string;
    };
    // currentUserRole is inherited from PageProps now
}

export default function Edit({ auth, status, tenant, currentUserRole, currentTenant }: Props) {
    const roleLabel = currentUserRole?.label || 'Miembro';
    const user = auth.user;
    const activeTenant = currentTenant || tenant;

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, patch, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || 'Colombia',
    });

    const { data: passwordData, setData: setPasswordData, put: updatePassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('tenant.profile.update', { tenant: activeTenant.slug }));
    };

    const submitPassword: FormEventHandler = (e) => {
        e.preventDefault();
        updatePassword(route('tenant.profile.password.update', { tenant: activeTenant.slug }), {
            onSuccess: () => resetPassword(),
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            import('@inertiajs/react').then(({ router }) => {
                router.post(route('tenant.profile.photo.update', { tenant: activeTenant.slug }), {
                    photo: file
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Foto de perfil actualizada');
                    },
                    onError: () => toast.error('Error al actualizar la foto'),
                });
            });
        }
    };

    return (
        <AdminLayout title="Mi Perfil">
            <Head title="Mi Perfil - Linkiu.Bio" />

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            <div className="max-w-5xl mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Column: Avatar Card */}
                    <div className="md:w-1/3">
                        <Card className="sticky">
                            <CardContent className="pt-10 pb-8 flex flex-col items-center">
                                <div className="relative group">
                                    <Avatar className="h-32 w-32">
                                        <AvatarImage src={user.profile_photo_url} className="object-cover" />
                                        <AvatarFallback className="text-3xl">
                                            {user.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer"
                                    >
                                        <Camera className="w-5 h-5" />
                                    </button>
                                </div>
                                <h3 className="mt-4 text-xl font-bold">{user.name}</h3>
                                <p className="text-sm text-muted-foreground">{user.email}</p>

                                <div className="mt-6 flex flex-wrap justify-center gap-2">
                                    {user.phone && (
                                        <Badge variant="secondary" className="gap-1.5">
                                            <div className="size-1.5 bg-green-500 rounded-full animate-pulse" />
                                            WhatsApp Verificado
                                        </Badge>
                                    )}
                                    <Badge variant="outline">
                                        Admin Principal
                                    </Badge>
                                </div>

                                {/* Business Identity info */}
                                <div className="mt-8 w-full pt-6 border-t space-y-4">
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold px-1">Información de Negocio</p>
                                        <div className="bg-muted/50 rounded-xl p-3 border">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[11px] font-bold text-muted-foreground">Tipo de Negocio</span>
                                                <Badge variant="secondary">
                                                    {tenant?.vertical_name || 'Particular'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-muted-foreground">Categoría</span>
                                                <span className="text-[11px] font-bold">
                                                    {tenant?.category_name || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="py-4 border-t bg-muted/30 rounded-b-xl px-6">
                                <p className="text-[11px] text-muted-foreground font-medium text-center w-full uppercase tracking-wider">
                                    Miembro desde {new Date(user.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                </p>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Right Column: Content Tabs */}
                    <div className="md:w-2/3">
                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="general" className="cursor-pointer">
                                    <User className="mr-2" />
                                    Información General
                                </TabsTrigger>
                                <TabsTrigger value="security" className="cursor-pointer">
                                    <Lock className="mr-2" />
                                    Seguridad
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="general" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Datos Personales</CardTitle>
                                        <CardDescription>Actualiza tu información básica de contacto.</CardDescription>
                                    </CardHeader>
                                    <form onSubmit={submitProfile}>
                                        <CardContent className="space-y-4 pt-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Nombre Completo</Label>
                                                    <Input
                                                        id="name"
                                                        value={data.name}
                                                        onChange={e => setData('name', e.target.value)}
                                                    />
                                                    {errors.name && <p className="text-xs text-destructive font-medium">{errors.name}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Correo Electrónico</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={data.email}
                                                        disabled
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">WhatsApp Personal</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        id="phone"
                                                        value={data.phone}
                                                        onChange={e => setData('phone', e.target.value)}
                                                        className="pl-10"
                                                        placeholder="Ej: +57 300 000 0000"
                                                    />
                                                </div>
                                                {errors.phone && <p className="text-xs text-destructive font-medium">{errors.phone}</p>}
                                            </div>

                                            <div className="pt-4 pb-2 border-b">
                                                <h4 className="flex items-center gap-2 text-sm font-bold">
                                                    <MapPin className="w-4 h-4" />
                                                    Ubicación
                                                </h4>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="address">Dirección de Residencia</Label>
                                                <Input
                                                    id="address"
                                                    value={data.address}
                                                    onChange={e => setData('address', e.target.value)}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="city">Ciudad</Label>
                                                    <Input
                                                        id="city"
                                                        value={data.city}
                                                        onChange={e => setData('city', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="country">País</Label>
                                                    <div className="relative">
                                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                        <Input
                                                            id="country"
                                                            value={data.country}
                                                            onChange={e => setData('country', e.target.value)}
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="bg-muted/30 rounded-b-xl border-t px-6 py-4 flex justify-end">
                                            <Button disabled={processing} className="cursor-pointer">
                                                <Save />
                                                Guardar Cambios
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </Card>
                            </TabsContent>

                            <TabsContent value="security" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Cambiar Contraseña</CardTitle>
                                        <CardDescription>Asegúrate de usar una contraseña fuerte y única.</CardDescription>
                                    </CardHeader>
                                    <form onSubmit={submitPassword}>
                                        <CardContent className="space-y-4 pt-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="current_password">Contraseña Actual</Label>
                                                <Input
                                                    id="current_password"
                                                    type="password"
                                                    value={passwordData.current_password}
                                                    onChange={e => setPasswordData('current_password', e.target.value)}
                                                />
                                                {passwordErrors.current_password && <p className="text-xs text-destructive font-medium">{passwordErrors.current_password}</p>}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="password">Nueva Contraseña</Label>
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        value={passwordData.password}
                                                        onChange={e => setPasswordData('password', e.target.value)}
                                                    />
                                                    {passwordErrors.password && <p className="text-xs text-destructive font-medium">{passwordErrors.password}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="password_confirmation">Confirmar Nueva Contraseña</Label>
                                                    <Input
                                                        id="password_confirmation"
                                                        type="password"
                                                        value={passwordData.password_confirmation}
                                                        onChange={e => setPasswordData('password_confirmation', e.target.value)}
                                                    />
                                                    {passwordErrors.password_confirmation && <p className="text-xs text-destructive font-medium">{passwordErrors.password_confirmation}</p>}
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="bg-muted/30 rounded-b-xl border-t px-6 py-4 flex justify-end">
                                            <Button disabled={passwordProcessing} className="cursor-pointer">
                                                <Lock />
                                                Actualizar Contraseña
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </Card>

                                <Alert>
                                    <AlertTitle>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Recomendación de Seguridad
                                    </AlertTitle>
                                    <AlertDescription>
                                        Te recomendamos cambiar tu contraseña al menos cada 3 meses para mantener tu cuenta segura.
                                    </AlertDescription>
                                </Alert>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
