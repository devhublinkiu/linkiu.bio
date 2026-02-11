import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
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
    Code,
    Gavel
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';
import { PageProps } from '@/types';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import { useRef } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';

export default function Edit({ tenantSettings, tenant, slugChangePrice }: { tenantSettings: any, tenant: any, slugChangePrice: number }) {
    const { currentUserRole } = usePage<PageProps>().props;

    const canUpdate = currentUserRole?.is_owner ||
        currentUserRole?.permissions?.includes('*') ||
        currentUserRole?.permissions?.includes('settings.update');

    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);

    const checkPermissionAndExecute = (action: () => void) => {
        if (canUpdate) {
            action();
        } else {
            setShowPermissionModal(true);
        }
    };

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

        // Tax Settings
        tax_name: tenantSettings.tax_name || 'IVA',
        tax_rate: tenantSettings.tax_rate || 0,
        price_includes_tax: !!tenantSettings.price_includes_tax,
    });

    const submitSettings: FormEventHandler = (e) => {
        e.preventDefault();
        checkPermissionAndExecute(() => {
            patch(route('tenant.settings.update', { tenant: tenant.slug }), {
                onSuccess: () => toast.success('Configuración guardada'),
                onError: () => toast.error('Error al guardar la configuración'),
            });
        });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            checkPermissionAndExecute(() => {
                router.post(route('tenant.settings.logo.update', { tenant: tenant.slug }), { logo: file }, {
                    onSuccess: () => toast.success('Logo actualizado'),
                    onError: () => toast.error('Error al actualizar el logo'),
                    preserveScroll: true,
                });
            });
        }
    };

    const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            checkPermissionAndExecute(() => {
                router.post(route('tenant.settings.favicon.update', { tenant: tenant.slug }), { favicon: file }, {
                    onSuccess: () => toast.success('Favicon actualizado'),
                    onError: () => toast.error('Error al actualizar el favicon'),
                    preserveScroll: true,
                });
            });
        }
    };

    return (
        <AdminLayout title="Configuración">
            <Head title="Configuración - Linkiu.Bio" />

            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
                title="Acción Denegada"
                description="No tienes permisos para modificar la configuración de la tienda. Contacta al el administrador para solicitar acceso."
            />

            <input
                type="file"
                ref={logoInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleLogoChange}
            />

            <input
                type="file"
                ref={faviconInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFaviconChange}
            />

            <div className="max-w-5xl mx-auto py-8 px-4">
                <form onSubmit={submitSettings}>
                    <Tabs defaultValue="brand" className="w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <TabsList>
                                <TabsTrigger value="brand">
                                    <Palette className="mr-2" />
                                    Identidad
                                </TabsTrigger>
                                <TabsTrigger value="seo">
                                    <Search className="mr-2" />
                                    SEO
                                </TabsTrigger>
                                <TabsTrigger value="integrations">
                                    <Zap className="mr-2" />
                                    Integraciones
                                </TabsTrigger>
                                <TabsTrigger value="legal">
                                    <Gavel className="mr-2" />
                                    Legal e Impuestos
                                </TabsTrigger>
                            </TabsList>
                            <Button disabled={processing} className="px-8 cursor-pointer">
                                <Save />
                                Guardar Todo
                            </Button>
                        </div>

                        {/* Brand Identity Tab */}
                        <TabsContent value="brand" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Logo y Favicon</CardTitle>
                                        <CardDescription>Sube las imágenes que representarán tu marca.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8">
                                        <div className="flex items-center gap-6">
                                            <div className="space-y-2 w-full max-w-xs">
                                                <Label>Logo Principal</Label>
                                                <div className="flex items-center gap-3">
                                                    <div className="size-16 rounded border bg-muted/50 flex items-center justify-center overflow-hidden">
                                                        {tenant.logo_url ? (
                                                            <img src={tenant.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                                                        ) : (
                                                            <ImageIcon className="size-6 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="cursor-pointer"
                                                        onClick={() => checkPermissionAndExecute(() => logoInputRef.current?.click())}
                                                    >
                                                        <Upload /> Cambiar Logo
                                                    </Button>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Recomendado: (PNG/SVG)</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="space-y-2 w-full max-w-xs">
                                                <Label>Favicon</Label>
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded border bg-muted/50 flex items-center justify-center overflow-hidden">
                                                        {tenantSettings.favicon_url ? (
                                                            <img src={tenantSettings.favicon_url} alt="Favicon" className="w-full h-full object-contain p-2" />
                                                        ) : (
                                                            <ImageIcon className="size-4 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="cursor-pointer"
                                                        onClick={() => checkPermissionAndExecute(() => faviconInputRef.current?.click())}
                                                    >
                                                        <Upload /> Cambiar Favicon
                                                    </Button>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Icono de pestaña (32x32px)</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
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
                                                disabled={!canUpdate}
                                            />
                                        </div>

                                        {/* Slug (URL) Change */}
                                        <div className="space-y-2 pt-2">
                                            <div className="flex justify-between items-center">
                                                {/* ... existing code ... */}
                                                <Label>URL Personalizada (linkiu.bio/tu-url)</Label>
                                                {tenant.slug_changes_count === 0 ? (
                                                    <Badge variant="secondary" className="text-[9px] uppercase tracking-wider">Primero Gratis</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider">Cambio con Costo</Badge>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-muted-foreground text-sm">linkiu.bio/</span>
                                                    </div>
                                                    <Input
                                                        value={data.slug}
                                                        onChange={e => setData('slug', e.target.value)}
                                                        className="pl-[78px]"
                                                        placeholder="tu-negocio"
                                                        disabled={!canUpdate}
                                                    />
                                                </div>
                                            </div>
                                            {errors.slug && <p className="text-xs font-bold text-destructive">{errors.slug}</p>}
                                            <p className="text-[10px] text-muted-foreground font-medium">
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
                                                disabled={!canUpdate}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
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
                                                <span className="text-[10px] font-mono text-muted-foreground uppercase">{data.bg_color}</span>
                                            </div>
                                            <Input
                                                type="color"
                                                value={data.bg_color}
                                                onChange={e => setData('bg_color', e.target.value)}
                                                className="h-10 p-1 cursor-pointer"
                                                disabled={!canUpdate}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="flex items-center gap-2">
                                                    <Type className="w-4 h-4" style={{ color: data.name_color }} />
                                                    Nombre
                                                </Label>
                                                <span className="text-[10px] font-mono text-muted-foreground uppercase">{data.name_color}</span>
                                            </div>
                                            <Input
                                                type="color"
                                                value={data.name_color}
                                                onChange={e => setData('name_color', e.target.value)}
                                                className="h-10 p-1 cursor-pointer"
                                                disabled={!canUpdate}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="flex items-center gap-2">
                                                    <PenTool className="w-4 h-4" style={{ color: data.description_color }} />
                                                    Descripción
                                                </Label>
                                                <span className="text-[10px] font-mono text-muted-foreground uppercase">{data.description_color}</span>
                                            </div>
                                            <Input
                                                type="color"
                                                value={data.description_color}
                                                onChange={e => setData('description_color', e.target.value)}
                                                className="h-10 p-1 cursor-pointer"
                                                disabled={!canUpdate}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* SEO Tab */}
                        <TabsContent value="seo" className="space-y-6">
                            <Card>
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
                                            disabled={!canUpdate}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Meta Descripción</Label>
                                        <textarea
                                            value={data.meta_description}
                                            onChange={e => setData('meta_description', e.target.value)}
                                            className="w-full flex min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Describe tu tienda para los resultados de búsqueda..."
                                            disabled={!canUpdate}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Palabras Clave (Separadas por coma)</Label>
                                        <Input
                                            value={data.meta_keywords}
                                            onChange={e => setData('meta_keywords', e.target.value)}
                                            placeholder="ropa, moda, estilo, bio-link"
                                            disabled={!canUpdate}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Alert variant="destructive">
                                <ShieldAlert className="size-4" />
                                <div className="flex w-full items-center justify-between">
                                    <div>
                                        <AlertTitle>Modo Mantenimiento</AlertTitle>
                                        <AlertDescription>
                                            Tu tienda no será visible públicamente mientras esto esté activo.
                                        </AlertDescription>
                                    </div>
                                    <Switch
                                        className="cursor-pointer"
                                        checked={data.maintenance_mode}
                                        onCheckedChange={(checked) => setData('maintenance_mode', checked)}
                                        disabled={!canUpdate}
                                    />
                                </div>
                            </Alert>
                        </TabsContent>

                        {/* Integrations Tab */}
                        <TabsContent value="integrations" className="space-y-6">
                            <Card>
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
                                                disabled={!canUpdate}
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
                                                disabled={!canUpdate}
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
                                                disabled={!canUpdate}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/30 flex items-center gap-3 p-4 border-t rounded-b-xl">
                                    <div className="p-2 bg-primary/10 text-primary rounded-full">
                                        <Zap className="size-4" />
                                    </div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Implementar estos píxeles te permitirá hacer anuncios más inteligentes y conocer mejor a tu audiencia.
                                    </p>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Legal & Taxes Tab */}
                        <TabsContent value="legal" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Impuestos y Facturación</CardTitle>
                                    <CardDescription>Configura los impuestos aplicables a tus productos.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label>Nombre del Impuesto</Label>
                                            <Input
                                                value={data.tax_name}
                                                onChange={e => setData('tax_name', e.target.value)}
                                                placeholder="Ej: IVA, Impoconsumo"
                                                disabled={!canUpdate}
                                            />
                                            <p className="text-[10px] text-muted-foreground">Nombre que aparecerá en el recibo y checkout.</p>
                                        </div>
                                        <div className="space-y-3">
                                            <Label>Tarifa (%)</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    value={data.tax_rate}
                                                    onChange={e => setData('tax_rate', parseFloat(e.target.value))}
                                                    placeholder="0"
                                                    min={0}
                                                    max={100}
                                                    step={0.01}
                                                    disabled={!canUpdate}
                                                    className="pr-8"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                                            </div>
                                            {errors.tax_rate && <p className="text-xs font-bold text-destructive">{errors.tax_rate}</p>}
                                            <p className="text-[10px] text-muted-foreground">Porcentaje global aplicado a todos los productos (a menos que se anule por producto).</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                                        <div className="space-y-1">
                                            <Label className="text-base">Precios incluyen Impuesto</Label>
                                            <div className="text-sm text-muted-foreground space-y-1">
                                                <p>Define si tus precios de venta ya incluyen el impuesto.</p>
                                                <ul className="list-disc list-inside text-xs">
                                                    <li><strong>Activado:</strong> El precio ingresado es el precio final (Impuesto incluido).</li>
                                                    <li><strong>Desactivado:</strong> El impuesto se sumará al precio ingresado en el checkout.</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={data.price_includes_tax}
                                            onCheckedChange={(checked) => setData('price_includes_tax', checked)}
                                            disabled={!canUpdate}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </form>
            </div>
        </AdminLayout>
    );
}
