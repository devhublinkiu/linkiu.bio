import { useState, useEffect } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Separator } from '@/Components/ui/separator';
import { Upload, Save, Image as ImageIcon, AtSign, Facebook, Instagram, Twitter, Globe, Mail, CreditCard } from 'lucide-react';
import { PageProps } from '@/types';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';

interface Props {
    settings: {
        app_name: string;
        support_email?: string;
        facebook_url?: string;
        instagram_url?: string;
        twitter_url?: string;
        meta_title?: string;
        meta_description?: string;
        logo_path: string | null;
        favicon_path: string | null;
        bank_name?: string;
        bank_account_type?: string;
        bank_account_number?: string;
        bank_account_holder?: string;
        bank_account_nit?: string;
    };
    logo_url: string | null;
    favicon_url: string | null;
}

export default function Index({ settings, logo_url, favicon_url }: Props) {
    const { auth } = usePage<PageProps>().props;
    const permissions = auth.permissions || [];
    const isSuperAdminEnv = auth.user?.is_super_admin ||
        (permissions.some(p => p.startsWith('sa.')) && !auth.user?.tenant_id);

    // Check for 'sa.settings.update' permission
    const canUpdate = !isSuperAdminEnv || permissions.includes('*') || permissions.includes('sa.settings.update');

    const [showPermissionModal, setShowPermissionModal] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        app_name: settings.app_name || '',
        support_email: settings.support_email || '',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        twitter_url: settings.twitter_url || '',
        meta_title: settings.meta_title || '',
        meta_description: settings.meta_description || '',
        bank_name: settings.bank_name || '',
        bank_account_type: settings.bank_account_type || '',
        bank_account_number: settings.bank_account_number || '',
        bank_account_holder: settings.bank_account_holder || '',
        bank_account_nit: settings.bank_account_nit || '',
        logo: null as File | null,
        favicon: null as File | null,
        profile_photo: null as File | null,
        profile_photo_preview: null as string | null,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(logo_url);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(favicon_url);

    // Sync state with props on fresh data (e.g. after save)
    useEffect(() => {
        setLogoPreview(logo_url);
        setFaviconPreview(favicon_url);
        setData({
            ...data,
            app_name: settings.app_name || '',
            support_email: settings.support_email || '',
            facebook_url: settings.facebook_url || '',
            instagram_url: settings.instagram_url || '',
            twitter_url: settings.twitter_url || '',
            meta_title: settings.meta_title || '',
            meta_description: settings.meta_description || '',
            bank_name: settings.bank_name || '',
            bank_account_type: settings.bank_account_type || '',
            bank_account_number: settings.bank_account_number || '',
            bank_account_holder: settings.bank_account_holder || '',
            bank_account_nit: settings.bank_account_nit || '',
        });
    }, [settings, logo_url, favicon_url]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'favicon' | 'profile_photo') => {
        const file = e.target.files?.[0];
        if (file) {
            setData(field, file);
            const reader = new FileReader();
            reader.onloadend = () => {
                if (field === 'logo') setLogoPreview(reader.result as string);
                if (field === 'favicon') setFaviconPreview(reader.result as string);
                if (field === 'profile_photo') setData('profile_photo_preview', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileClick = (e: React.MouseEvent) => {
        if (!canUpdate) {
            e.preventDefault();
            setShowPermissionModal(true);
        }
    };



    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!canUpdate) {
            setShowPermissionModal(true);
            return;
        }

        post(route('settings.update'), {
            forceFormData: true,
        });
    };

    return (
        <SuperAdminLayout header="Configuración General">
            <Head title="Configuración" />

            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />

            <div className="max-w-4xl mx-auto py-6">
                <form onSubmit={submit}>
                    <Tabs defaultValue="general" className="w-full">
                        <div className="flex items-center justify-between mb-6">
                            <TabsList>
                                <TabsTrigger value="general">Identidad</TabsTrigger>
                                <TabsTrigger value="contact">Contacto y Redes</TabsTrigger>
                                <TabsTrigger value="billing">Facturación</TabsTrigger>
                                <TabsTrigger value="seo">SEO Global</TabsTrigger>
                            </TabsList>
                            <Button type="submit" disabled={processing} size="sm">
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </div>

                        <TabsContent value="general" className="space-y-6">
                            {/* Brand & Site Info */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1.5">
                                            <CardTitle>Identidad de Marca</CardTitle>
                                            <CardDescription>Configura los elementos visuales clave de tu plataforma.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    {/* App Name */}
                                    <div className="grid gap-3 max-w-md">
                                        <Label htmlFor="app_name">Nombre del Aplicativo</Label>
                                        <Input
                                            id="app_name"
                                            value={data.app_name}
                                            onChange={e => setData('app_name', e.target.value)}
                                            required
                                            placeholder="Ej. Mi Plataforma SaaS"
                                        />
                                        <p className="text-[0.8rem] text-muted-foreground">Este nombre aparecerá en títulos y correos electrónicos.</p>
                                        {errors.app_name && <p className="text-red-500 text-sm">{errors.app_name}</p>}
                                    </div>

                                    <Separator />

                                    {/* Assets Grid */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Logo Uploader */}
                                        <div className="space-y-3">
                                            <Label>Logo Principal</Label>
                                            <div className="flex items-start gap-4 p-4 border border-dashed rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors relative group">
                                                <div className="h-16 w-16 flex-shrink-0 bg-white border rounded-md shadow-sm flex items-center justify-center p-1 overflow-hidden pointer-events-none">
                                                    {logoPreview ? (
                                                        <img src={logoPreview} className="w-full h-full object-contain" alt="Logo" />
                                                    ) : (
                                                        <ImageIcon className="h-6 w-6 text-gray-300" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <p className="text-sm font-medium text-gray-900">Subir imagen</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Recomendado: SVG o PNG transparente.<br />Máx. 2MB.
                                                    </p>
                                                    {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
                                                </div>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onClick={handleFileClick}
                                                    onChange={e => handleFileChange(e, 'logo')}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        {/* Favicon Uploader */}
                                        <div className="space-y-3">
                                            <Label>Favicon</Label>
                                            <div className="flex items-start gap-4 p-4 border border-dashed rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors relative group">
                                                <div className="h-16 w-16 flex-shrink-0 bg-white border rounded-md shadow-sm flex items-center justify-center p-3 overflow-hidden pointer-events-none">
                                                    {faviconPreview ? (
                                                        <img src={faviconPreview} className="w-full h-full object-contain" alt="Favicon" />
                                                    ) : (
                                                        <Globe className="h-6 w-6 text-gray-300" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <p className="text-sm font-medium text-gray-900">Subir icono</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Visible en la pestaña del navegador.<br />ICO, PNG o SVG.
                                                    </p>
                                                    {errors.favicon && <p className="text-red-500 text-xs mt-1">{errors.favicon}</p>}
                                                </div>
                                                <Input
                                                    type="file"
                                                    accept="image/x-icon,image/png,image/svg+xml"
                                                    onClick={handleFileClick}
                                                    onChange={e => handleFileChange(e, 'favicon')}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Admin Profile */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tu Perfil</CardTitle>
                                    <CardDescription>Personaliza cómo te ven otros usuarios y el sistema.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-6">
                                        <div className="relative group">
                                            <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100 flex-shrink-0">
                                                <img
                                                    src={data.profile_photo_preview || usePage<any>().props.auth.user.profile_photo_url || `https://ui-avatars.com/api/?name=${usePage<any>().props.auth.user.name}&background=0D8ABC&color=fff`}
                                                    alt="Profile"
                                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                />
                                            </div>
                                            {/* Decorative status dot */}
                                            <div className="absolute bottom-1 right-1 h-5 w-5 bg-green-500 border-2 border-white rounded-full"></div>
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div className="space-y-1">
                                                <h4 className="text-base font-medium leading-none">{usePage<any>().props.auth.user.name}</h4>
                                                <p className="text-sm text-muted-foreground">{usePage<any>().props.auth.user.email}</p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="relative overflow-hidden">
                                                    <Button variant="outline" size="sm" className="gap-2 relative pointer-events-none">
                                                        <Upload className="h-4 w-4" />
                                                        Cambiar Foto
                                                    </Button>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onClick={handleFileClick}
                                                        onChange={e => handleFileChange(e, 'profile_photo')}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    JPG, PNG o WebP. Máx 2MB.
                                                </p>
                                            </div>
                                            {errors.profile_photo && <p className="text-red-500 text-xs">{errors.profile_photo}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="contact" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contacto y Redes Sociales</CardTitle>
                                    <CardDescription>Enlaces visibles en el footer y correos del sistema.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="support_email">Email de Soporte</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input id="support_email" type="email" className="pl-9" placeholder="support@linkiu.bio" value={data.support_email} onChange={e => setData('support_email', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="facebook">Facebook URL</Label>
                                        <div className="relative">
                                            <Facebook className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input id="facebook" className="pl-9" placeholder="https://facebook.com/..." value={data.facebook_url} onChange={e => setData('facebook_url', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="instagram">Instagram URL</Label>
                                        <div className="relative">
                                            <Instagram className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input id="instagram" className="pl-9" placeholder="https://instagram.com/..." value={data.instagram_url} onChange={e => setData('instagram_url', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="twitter">Twitter / X URL</Label>
                                        <div className="relative">
                                            <Twitter className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input id="twitter" className="pl-9" placeholder="https://x.com/..." value={data.twitter_url} onChange={e => setData('twitter_url', e.target.value)} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="seo" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>SEO Global</CardTitle>
                                    <CardDescription>Metadatos por defecto para compartir en redes.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="meta_title">Meta Título (Default)</Label>
                                        <Input id="meta_title" value={data.meta_title} onChange={e => setData('meta_title', e.target.value)} maxLength={60} />
                                        <p className="text-xs text-muted-foreground text-right">{data.meta_title.length}/60</p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="meta_description">Meta Descripción (Default)</Label>
                                        <Input id="meta_description" value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} maxLength={160} />
                                        <p className="text-xs text-muted-foreground text-right">{data.meta_description.length}/160</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="billing" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Datos de Recaudo</CardTitle>
                                    <CardDescription>Información bancaria para pagos manuales de los inquilinos.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="bank_name">Nombre del Banco</Label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                                <Input id="bank_name" className="pl-9" placeholder="Ej. Bancolombia" value={data.bank_name} onChange={e => setData('bank_name', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="bank_account_type">Tipo de Cuenta</Label>
                                            <Input id="bank_account_type" placeholder="Ej. Ahorros" value={data.bank_account_type} onChange={e => setData('bank_account_type', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="bank_account_number">Número de Cuenta</Label>
                                            <Input id="bank_account_number" placeholder="000-000-000-00" value={data.bank_account_number} onChange={e => setData('bank_account_number', e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="bank_account_nit">NIT / Cédula</Label>
                                            <Input id="bank_account_nit" placeholder="900.000.000-0" value={data.bank_account_nit} onChange={e => setData('bank_account_nit', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="bank_account_holder">Titular de la Cuenta</Label>
                                        <Input id="bank_account_holder" placeholder="Nombre completo o Razón Social" value={data.bank_account_holder} onChange={e => setData('bank_account_holder', e.target.value)} />
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 flex gap-3 items-start">
                                        <div className="mt-0.5 min-w-[16px]">ℹ️</div>
                                        <p>Estos datos aparecerán automáticamente en la tarjeta de suscripción del panel de inquilinos cuando su plan esté por vencer.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </form>
            </div>
        </SuperAdminLayout>
    );
}
