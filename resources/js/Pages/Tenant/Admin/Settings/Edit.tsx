import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Switch } from '@/Components/ui/switch';
import {
    Palette,
    Search,
    Zap,
    Image as ImageIcon,
    ShieldAlert,
    Save,
    Upload,
    PenTool,
    Type,
    Code
} from 'lucide-react';
import { FormEventHandler, useRef } from 'react';
import { toast } from 'sonner';

export default function Edit({ tenantSettings, tenant, slugChangePrice }: { tenantSettings: any, tenant: any, slugChangePrice: number }) {
    const fileInputLogo = useRef<HTMLInputElement>(null);
    const fileInputFavicon = useRef<HTMLInputElement>(null);

    const { data, setData, patch, processing, errors } = useForm({
        store_name: tenantSettings.store_name || tenant.name,
        slug: tenant.slug || '',
        store_description: tenantSettings.store_description || '',
        bg_color: tenantSettings.bg_color || '#ffffff',
        name_color: tenantSettings.name_color || '#0f172a',
        description_color: tenantSettings.description_color || '#64748b',

        meta_title: tenantSettings.meta_title || '',
        meta_description: tenantSettings.meta_description || '',
        meta_keywords: tenantSettings.meta_keywords || '',
        maintenance_mode: !!tenantSettings.maintenance_mode,

        facebook_pixel_id: tenantSettings.facebook_pixel_id || '',
        google_analytics_id: tenantSettings.google_analytics_id || '',
        tiktok_pixel_id: tenantSettings.tiktok_pixel_id || '',
    });

    const submitSettings: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('tenant.settings.update', { tenant: tenant.slug }), {
            onSuccess: () => toast.success('Configuración guardada'),
            onError: () => toast.error('Error al guardar la configuración'),
        });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('logo', file);
            import('@inertiajs/react').then(({ router }) => {
                router.post(route('tenant.settings.logo.update', { tenant: tenant.slug }), formData, {
                    forceFormData: true,
                    onSuccess: () => toast.success('Logo actualizado'),
                });
            });
        }
    };

    const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('favicon', file);
            import('@inertiajs/react').then(({ router }) => {
                router.post(route('tenant.settings.favicon.update', { tenant: tenant.slug }), formData, {
                    forceFormData: true,
                    onSuccess: () => toast.success('Favicon actualizado'),
                });
            });
        }
    };

    return (
        <AdminLayout title="Configuración">
            <Head title="Configuración - Linkiu.Bio" />

            <div className="max-w-5xl mx-auto py-8 px-4">
                <form onSubmit={submitSettings}>
                    <Tabs defaultValue="brand" className="w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <TabsList className="bg-slate-100/50 p-1 rounded-xl">
                                <TabsTrigger value="brand" className="rounded-lg font-bold py-2 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    <Palette className="w-4 h-4 mr-2" />
                                    Identidad
                                </TabsTrigger>
                                <TabsTrigger value="seo" className="rounded-lg font-bold py-2 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    <Search className="w-4 h-4 mr-2" />
                                    SEO
                                </TabsTrigger>
                                <TabsTrigger value="integrations" className="rounded-lg font-bold py-2 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    <Zap className="w-4 h-4 mr-2" />
                                    Integraciones
                                </TabsTrigger>
                            </TabsList>
                            <Button disabled={processing} className="rounded-lg font-bold gap-2 px-8 shadow-lg shadow-primary/20">
                                <Save className="w-4 h-4" />
                                Guardar Todo
                            </Button>
                        </div>

                        {/* Brand Identity Tab */}
                        <TabsContent value="brand" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-none shadow-sm shadow-blue-100/50">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Logo y Favicon</CardTitle>
                                        <CardDescription>Sube las imágenes que representarán tu marca.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8">
                                        <div className="flex items-center gap-6">
                                            <div className="h-24 w-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
                                                {tenant.logo_url ? (
                                                    <img src={tenant.logo_url} className="h-full w-full object-contain p-2" alt="Logo" />
                                                ) : (
                                                    <ImageIcon className="w-8 h-8 text-slate-300" />
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputLogo.current?.click()}
                                                    className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                >
                                                    <Upload className="w-6 h-6" />
                                                </button>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-bold text-slate-900">Logo Principal</p>
                                                <p className="text-xs text-slate-500">Recomendado: (PNG/SVG)</p>
                                                <input type="file" ref={fileInputLogo} onChange={handleLogoChange} className="hidden" accept="image/*" />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="h-12 w-12 rounded-lg bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
                                                {tenantSettings.favicon_path ? (
                                                    <img src={tenantSettings.favicon_url /* Check this in backend */} className="h-full w-full object-contain p-1" alt="Favicon" />
                                                ) : (
                                                    <div className="w-4 h-4 bg-slate-200 rounded-sm" />
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputFavicon.current?.click()}
                                                    className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-bold text-slate-900">Favicon</p>
                                                <p className="text-xs text-slate-500">Icono de pestaña (32x32px)</p>
                                                <input type="file" ref={fileInputFavicon} onChange={handleFaviconChange} className="hidden" accept="image/*" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-sm shadow-blue-100/50">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Información de la Tienda</CardTitle>
                                        <CardDescription>Datos básicos y URL de tu página.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Nombre de la Tienda</Label>
                                            <Input
                                                value={data.store_name}
                                                onChange={e => setData('store_name', e.target.value)}
                                                placeholder="Nombre visible"
                                            />
                                        </div>

                                        {/* Slug (URL) Change */}
                                        <div className="space-y-2 pt-2">
                                            <div className="flex justify-between items-center">
                                                <Label>URL Personalizada (linkiu.bio/tu-url)</Label>
                                                {tenant.slug_changes_count === 0 ? (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[9px] font-black uppercase">Primero Gratis</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 text-[9px] font-black uppercase">Cambio con Costo</Badge>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-slate-400 text-sm">linkiu.bio/</span>
                                                    </div>
                                                    <Input
                                                        value={data.slug}
                                                        onChange={e => setData('slug', e.target.value)}
                                                        className="pl-[78px]"
                                                        placeholder="tu-negocio"
                                                    />
                                                </div>
                                            </div>
                                            {errors.slug && <p className="text-xs font-bold text-destructive">{errors.slug}</p>}
                                            <p className="text-[10px] text-slate-400 font-medium">
                                                {tenant.slug_changes_count === 0
                                                    ? "Tu primer cambio de URL es gratuito. Luego tendrá un costo."
                                                    : `El cambio de URL tiene un costo de $${new Intl.NumberFormat('es-CO').format(usePage().props.slugChangePrice as number)} y se permite cada 3 meses.`
                                                }
                                            </p>
                                        </div>

                                        <div className="space-y-2 pt-2">
                                            <Label>Descripción Corta (Max 60)</Label>
                                            <Input
                                                value={data.store_description}
                                                onChange={e => setData('store_description', e.target.value)}
                                                maxLength={60}
                                                placeholder="Una breve frase sobre tu negocio"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="border-none shadow-sm shadow-blue-100/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">Colores de Marca</CardTitle>
                                    <CardDescription>Define la paleta cromática de tu página pública.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: data.bg_color }} />
                                                    Fondo
                                                </Label>
                                                <span className="text-[10px] font-mono text-slate-400 uppercase">{data.bg_color}</span>
                                            </div>
                                            <Input
                                                type="color"
                                                value={data.bg_color}
                                                onChange={e => setData('bg_color', e.target.value)}
                                                className="h-12 p-1 cursor-pointer"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="flex items-center gap-2">
                                                    <Type className="w-4 h-4" style={{ color: data.name_color }} />
                                                    Nombre
                                                </Label>
                                                <span className="text-[10px] font-mono text-slate-400 uppercase">{data.name_color}</span>
                                            </div>
                                            <Input
                                                type="color"
                                                value={data.name_color}
                                                onChange={e => setData('name_color', e.target.value)}
                                                className="h-12 p-1 cursor-pointer"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="flex items-center gap-2">
                                                    <PenTool className="w-4 h-4" style={{ color: data.description_color }} />
                                                    Descripción
                                                </Label>
                                                <span className="text-[10px] font-mono text-slate-400 uppercase">{data.description_color}</span>
                                            </div>
                                            <Input
                                                type="color"
                                                value={data.description_color}
                                                onChange={e => setData('description_color', e.target.value)}
                                                className="h-12 p-1 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* SEO Tab */}
                        <TabsContent value="seo" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <Card className="border-none shadow-sm shadow-blue-100/50">
                                <CardHeader>
                                    <CardTitle>SEO y Meta Tags</CardTitle>
                                    <CardDescription>Configura cómo se verá tu tienda en Google y redes sociales.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Meta Título</Label>
                                        <Input
                                            value={data.meta_title}
                                            onChange={e => setData('meta_title', e.target.value)}
                                            placeholder="Ej: Tienda de Ropa Online | MiMarca"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Meta Descripción</Label>
                                        <textarea
                                            value={data.meta_description}
                                            onChange={e => setData('meta_description', e.target.value)}
                                            className="w-full flex min-h-[100px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/10 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Describe tu tienda para los resultados de búsqueda..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Palabras Clave (Separadas por coma)</Label>
                                        <Input
                                            value={data.meta_keywords}
                                            onChange={e => setData('meta_keywords', e.target.value)}
                                            placeholder="ropa, moda, estilo, bio-link"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-rose-100 bg-rose-50/30">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-rose-700 font-bold">
                                                <ShieldAlert className="w-4 h-4" />
                                                Modo Mantenimiento
                                            </div>
                                            <p className="text-sm text-rose-600/80">Tu tienda no será visible públicamente mientras esto esté activo.</p>
                                        </div>
                                        <Switch
                                            checked={data.maintenance_mode}
                                            onCheckedChange={(checked) => setData('maintenance_mode', checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Integrations Tab */}
                        <TabsContent value="integrations" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <Card className="border-none shadow-sm shadow-blue-100/50">
                                <CardHeader>
                                    <CardTitle>Analítica y Píxeles</CardTitle>
                                    <CardDescription>Mide el rendimiento de tus campañas y el tráfico de tu tienda.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                <Code className="w-4 h-4 text-blue-600" />
                                                Facebook Pixel ID
                                            </Label>
                                            <Input
                                                value={data.facebook_pixel_id}
                                                onChange={e => setData('facebook_pixel_id', e.target.value)}
                                                placeholder="Ej: 123456789012345"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                <Code className="w-4 h-4 text-green-600" />
                                                Google Analytics ID (GA4)
                                            </Label>
                                            <Input
                                                value={data.google_analytics_id}
                                                onChange={e => setData('google_analytics_id', e.target.value)}
                                                placeholder="Ej: G-XXXXXXXXXX"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                <Code className="w-4 h-4 text-black" />
                                                TikTok Pixel ID
                                            </Label>
                                            <Input
                                                value={data.tiktok_pixel_id}
                                                onChange={e => setData('tiktok_pixel_id', e.target.value)}
                                                placeholder="Ej: CXXXXXXXXXXXXXXXXX"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-slate-50/50 flex items-center gap-3 p-4 border-t border-slate-100 rounded-b-xl">
                                    <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <p className="text-xs font-medium text-slate-600">
                                        Implementar estos píxeles te permitirá hacer anuncios más inteligentes y conocer mejor a tu audiencia.
                                    </p>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </form>
            </div>
        </AdminLayout>
    );
}
