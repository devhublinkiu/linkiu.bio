import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
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
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';
import { MediaManagerModal, MediaFile } from '@/Components/Shared/MediaManager/MediaManagerModal';
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

    // Media Manager State
    const [showMediaManager, setShowMediaManager] = useState(false);

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

    const handleMediaSelect = (file: MediaFile) => {
        if (file.url) {
            import('@inertiajs/react').then(({ router }) => {
                router.post(route('tenant.profile.photo.update', { tenant: activeTenant.slug }), {
                    photo_url: file.url
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Foto de perfil actualizada');
                        setShowMediaManager(false);
                    },
                    onError: () => toast.error('Error al actualizar la foto'),
                });
            });
        }
    };

    return (
        <AdminLayout title="Mi Perfil">
            <Head title="Mi Perfil - Linkiu.Bio" />

            <MediaManagerModal
                open={showMediaManager}
                onOpenChange={setShowMediaManager}
                onSelect={handleMediaSelect}
                apiRoute={route('tenant.media.list', { tenant: activeTenant.slug })}
            />

            <div className="max-w-5xl mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Column: Avatar Card */}
                    <div className="md:w-1/3">
                        <Card className="border-none shadow-sm shadow-blue-100/50 sticky top-28">
                            <CardContent className="pt-10 pb-8 flex flex-col items-center">
                                <div className="relative group">
                                    <Avatar className="h-32 w-32 ring-4 ring-slate-50 transition-all group-hover:ring-primary/20">
                                        <AvatarImage src={user.profile_photo_url} className="object-cover" />
                                        <AvatarFallback className="text-3xl font-bold bg-primary/5 text-primary">
                                            {user.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <button
                                        onClick={() => setShowMediaManager(true)}
                                        className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <Camera className="w-5 h-5" />
                                    </button>
                                </div>
                                <h3 className="mt-4 text-xl font-bold text-slate-900">{user.name}</h3>
                                <p className="text-sm text-slate-500 font-medium">{user.email}</p>

                                <div className="mt-6 flex flex-wrap justify-center gap-2">
                                    {user.phone && (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                            WhatsApp Verificado
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                                        Admin Principal
                                    </div>
                                </div>

                                {/* Business Identity info */}
                                <div className="mt-8 w-full pt-6 border-t border-slate-100 space-y-4">
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-1">Información de Negocio</p>
                                        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100/50">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[11px] font-bold text-slate-500">Tipo de Negocio</span>
                                                <span className="text-[11px] font-extrabold text-primary uppercase bg-primary/5 px-2 py-0.5 rounded leading-none">
                                                    {tenant?.vertical_name || 'Particular'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-slate-500">Categoría</span>
                                                <span className="text-[11px] font-bold text-slate-900">
                                                    {tenant?.category_name || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="py-4 border-t border-slate-50 bg-slate-50/50 rounded-b-xl px-6">
                                <p className="text-[11px] text-slate-400 font-medium text-center w-full uppercase tracking-wider">
                                    Miembro desde {new Date(user.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                </p>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Right Column: Content Tabs */}
                    <div className="md:w-2/3">
                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-slate-100/50 p-1 rounded-xl mb-6">
                                <TabsTrigger value="general" className="rounded-lg font-bold py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    <User className="w-4 h-4 mr-2" />
                                    Información General
                                </TabsTrigger>
                                <TabsTrigger value="security" className="rounded-lg font-bold py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    <Lock className="w-4 h-4 mr-2" />
                                    Seguridad
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="general" className="space-y-6">
                                <Card className="border-none shadow-sm shadow-blue-100/50">
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
                                                        className="border-slate-200 focus:border-primary focus:ring-primary/10"
                                                    />
                                                    {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Correo Electrónico</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={data.email}
                                                        disabled
                                                        className="bg-slate-50 text-slate-500 border-slate-200"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">WhatsApp Personal</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <Input
                                                        id="phone"
                                                        value={data.phone}
                                                        onChange={e => setData('phone', e.target.value)}
                                                        className="pl-10 border-slate-200 focus:border-primary focus:ring-primary/10"
                                                        placeholder="Ej: +57 300 000 0000"
                                                    />
                                                </div>
                                                {errors.phone && <p className="text-xs text-rose-500 font-medium">{errors.phone}</p>}
                                            </div>

                                            <div className="pt-4 pb-2 border-b border-slate-50">
                                                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    Ubicación
                                                </h4>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="address">Dirección de Residencia</Label>
                                                <Input
                                                    id="address"
                                                    value={data.address}
                                                    onChange={e => setData('address', e.target.value)}
                                                    className="border-slate-200 focus:border-primary focus:ring-primary/10"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="city">Ciudad</Label>
                                                    <Input
                                                        id="city"
                                                        value={data.city}
                                                        onChange={e => setData('city', e.target.value)}
                                                        className="border-slate-200 focus:border-primary focus:ring-primary/10"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="country">País</Label>
                                                    <div className="relative">
                                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <Input
                                                            id="country"
                                                            value={data.country}
                                                            onChange={e => setData('country', e.target.value)}
                                                            className="pl-10 border-slate-200 focus:border-primary focus:ring-primary/10"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="bg-slate-50/50 rounded-b-xl border-t border-slate-50 px-6 py-4 flex justify-end">
                                            <Button disabled={processing} className="rounded-lg font-bold gap-2 px-6 shadow-lg shadow-primary/20">
                                                <Save className="w-4 h-4" />
                                                Guardar Cambios
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </Card>
                            </TabsContent>

                            <TabsContent value="security" className="space-y-6">
                                <Card className="border-none shadow-sm shadow-blue-100/50">
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
                                                    className="border-slate-200 focus:border-primary focus:ring-primary/10"
                                                />
                                                {passwordErrors.current_password && <p className="text-xs text-rose-500 font-medium">{passwordErrors.current_password}</p>}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="password">Nueva Contraseña</Label>
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        value={passwordData.password}
                                                        onChange={e => setPasswordData('password', e.target.value)}
                                                        className="border-slate-200 focus:border-primary focus:ring-primary/10"
                                                    />
                                                    {passwordErrors.password && <p className="text-xs text-rose-500 font-medium">{passwordErrors.password}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="password_confirmation">Confirmar Nueva Contraseña</Label>
                                                    <Input
                                                        id="password_confirmation"
                                                        type="password"
                                                        value={passwordData.password_confirmation}
                                                        onChange={e => setPasswordData('password_confirmation', e.target.value)}
                                                        className="border-slate-200 focus:border-primary focus:ring-primary/10"
                                                    />
                                                    {passwordErrors.password_confirmation && <p className="text-xs text-rose-500 font-medium">{passwordErrors.password_confirmation}</p>}
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="bg-slate-50/50 rounded-b-xl border-t border-slate-50 px-6 py-4 flex justify-end">
                                            <Button disabled={passwordProcessing} className="rounded-lg font-bold gap-2 px-6 shadow-lg shadow-primary/20">
                                                <Lock className="w-4 h-4" />
                                                Actualizar Contraseña
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </Card>

                                <div className="bg-amber-50 border border-amber-100 text-amber-800 rounded-xl p-4 flex gap-4">
                                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                                    <div className="space-y-1">
                                        <p className="font-bold">Recomendación de Seguridad</p>
                                        <p className="text-sm font-medium opacity-90">
                                            Te recomendamos cambiar tu contraseña al menos cada 3 meses para mantener tu cuenta segura.
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
