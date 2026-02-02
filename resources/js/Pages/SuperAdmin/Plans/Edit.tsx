import { useState, useEffect } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';
import { Trash2, ArrowLeft, Upload, Calculator, Plus } from 'lucide-react';
import { Checkbox } from '@/Components/ui/checkbox';
import { VERTICAL_CONFIG, MODULE_LABELS } from '@/Config/menuConfig';

interface Vertical {
    id: number;
    name: string;
}

interface Plan {
    id: number;
    name: string;
    slug: string;
    vertical_id: number;
    description: string | null;
    monthly_price: number;
    currency: string;
    quarterly_discount_percent: number;
    semiannual_discount_percent: number;
    yearly_discount_percent: number;
    trial_days: number;
    no_initial_payment_required: boolean;
    support_level: string;
    allow_custom_slug: boolean;
    is_public: boolean;
    is_featured: boolean;
    highlight_text: string | null;
    sort_order: number;
    features: any[] | null;
    cover_url: string | null;
}

interface Props {
    plan: Plan;
    verticals: Vertical[];
}

export default function Edit({ plan, verticals }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: plan.name,
        slug: plan.slug,
        vertical_id: plan.vertical_id.toString(),
        description: plan.description || '',
        monthly_price: plan.monthly_price.toString(),
        currency: plan.currency,
        quarterly_discount_percent: plan.quarterly_discount_percent,
        semiannual_discount_percent: plan.semiannual_discount_percent,
        yearly_discount_percent: plan.yearly_discount_percent,
        trial_days: plan.trial_days,
        no_initial_payment_required: !!plan.no_initial_payment_required,
        support_level: plan.support_level,
        allow_custom_slug: !!plan.allow_custom_slug,
        is_public: !!plan.is_public,
        is_featured: !!plan.is_featured,
        highlight_text: plan.highlight_text || '',
        sort_order: plan.sort_order,
        features: plan.features?.filter(f => typeof f === 'string') || [''],
        cover: null as File | null,
        cover_preview: plan.cover_url,
    });

    // Detect existing module config from plan features
    const initialModuleConfig: Record<string, boolean> = (() => {
        // Find the object in features
        const configObj = plan.features?.find(f => typeof f === 'object' && !Array.isArray(f) && f !== null);

        if (configObj) return configObj as Record<string, boolean>;

        // Fallback: Enable all for the vertical if it matches
        // We can try to load default for the vertical if we want, or start empty?
        // Let's try to load defaults if no config exists, ensuring existing plans "work" (enable all)
        // rather than "break" (disable all).
        if (plan.vertical_id) {
            const vertical = verticals.find(v => v.id === plan.vertical_id);
            if (vertical) {
                const slug = vertical.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                // Map to config key if possible, else default
                // This logic duplicates Create.tsx slightly but is safer here
                const configKey = Object.keys(VERTICAL_CONFIG).find(k => k === slug) || 'default';
                const modules = VERTICAL_CONFIG[configKey] || [];
                const defaults: Record<string, boolean> = {};
                modules.forEach(m => defaults[m] = true);
                return defaults;
            }
        }
        return {};
    })();

    const [moduleConfig, setModuleConfig] = useState<Record<string, boolean>>(initialModuleConfig);

    const handleModuleToggle = (key: string, enabled: boolean) => {
        setModuleConfig(prev => ({ ...prev, [key]: enabled }));
    };

    // Auto-generate slug from name if user changes name (optional behavior, maybe safer to disable on edit to avoid breaking links, keeping it manual-ish)
    // We'll leave it manual on Edit or only if slug is empty.

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...data.features];
        newFeatures[index] = value;
        setData('features', newFeatures);
    };

    const addFeature = () => {
        setData('features', [...data.features, '']);
    };

    const removeFeature = (index: number) => {
        const newFeatures = data.features.filter((_, i) => i !== index);
        setData('features', newFeatures);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('cover', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setData('cover_preview', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const calculateTotal = (months: number, discount: number) => {
        const price = parseFloat(data.monthly_price) || 0;
        const total = price * months;
        const final = total * (1 - discount / 100);
        return final;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare features: List of strings + Config Object
        const cleanFeatures = data.features.filter(f => typeof f === 'string' && f.trim() !== '');
        const finalFeatures = [
            ...cleanFeatures,
            moduleConfig
        ];

        // Use post with _method: PUT because of file upload
        // We need to manually override the features data sent
        // Inertia's `post` helper uses the `data` object from `useForm`.
        // We can't easily swap `data` inside `post`.
        // We will modify `data` via `setData` then post? No, state update is async.
        // We use `router.post` to send custom data payload while keeping useForm for errors?
        // OR we use the `transform` option if available, but `useForm` here is correct?

        // Let's use router.post directly to ensure we send exact payload.
        router.post(route('plans.update', plan.id), {
            ...data,
            _method: 'PUT',
            features: finalFeatures
        });
    };

    return (
        <SuperAdminLayout header={`Editar Plan: ${plan.name}`}>
            <Head title="Editar Plan" />

            <div className="max-w-4xl mx-auto py-6">
                <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent" asChild>
                    <Link href={route('plans.index')} className="flex items-center gap-2 text-muted-foreground hover:text-gray-900">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al listado
                    </Link>
                </Button>

                <form onSubmit={submit} className="space-y-8">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Básica</CardTitle>
                            <CardDescription>Detalles principales del plan y su vertical asociada.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="vertical">Vertical de Negocio</Label>
                                    <Select
                                        value={data.vertical_id}
                                        onValueChange={(value) => setData('vertical_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una vertical" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {verticals.map(vertical => (
                                                <SelectItem key={vertical.id} value={vertical.id.toString()}>
                                                    {vertical.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.vertical_id && <p className="text-red-500 text-sm">{errors.vertical_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Moneda</Label>
                                    <Select
                                        value={data.currency}
                                        onValueChange={(value) => setData('currency', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Moneda" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                                            <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.currency && <p className="text-red-500 text-sm">{errors.currency}</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre del Plan</Label>
                                    <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (URL amigable)</Label>
                                    <Input id="slug" value={data.slug} onChange={e => setData('slug', e.target.value)} required />
                                    {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción Corta</Label>
                                <Textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} />
                                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Imagen de Portada / Icono</Label>
                                <div className="flex items-center gap-4 border rounded-lg p-4 bg-gray-50 border-dashed">
                                    <div className="h-20 w-32 bg-white border rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {data.cover_preview ? (
                                            <img src={data.cover_preview} alt="Preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <Upload className="h-8 w-8 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <Input type="file" accept="image/*" onChange={handleFileChange} />
                                        <p className="text-xs text-muted-foreground mt-2">Recomendado: 800x600px o Icono SVG.</p>
                                    </div>
                                </div>
                                {errors.cover && <p className="text-red-500 text-sm">{errors.cover}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing Engine */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Calculator className="h-5 w-5 text-blue-600" />
                                <CardTitle>Motor de Precios</CardTitle>
                            </div>
                            <CardDescription>Define el precio base mensual y los descuentos por permanencia.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-100">
                                    <Label htmlFor="monthly_price" className="text-base font-semibold text-blue-900">Precio Base Mensual</Label>
                                    <div className="mt-2 relative">
                                        <span className="absolute left-3 top-2.5 font-bold text-gray-500">
                                            {data.currency === 'USD' ? '$' : '$'}
                                        </span>
                                        <Input
                                            id="monthly_price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="pl-8 text-lg font-bold h-12"
                                            placeholder="0.00"
                                            value={data.monthly_price}
                                            onChange={e => setData('monthly_price', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <p className="text-sm text-blue-600/80 mt-2">Este es el precio que pagará el usuario si elige facturación mes a mes.</p>
                                    {errors.monthly_price && <p className="text-red-500 text-sm mt-1">{errors.monthly_price}</p>}
                                </div>

                                <div className="space-y-6">
                                    <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">Descuentos por Periodo</h4>

                                    {/* Quarterly */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-40 flex-shrink-0">
                                            <Label htmlFor="quarterly" className="text-xs text-gray-500 uppercase">Trimestral (-%)</Label>
                                            <div className="relative mt-1">
                                                <Input
                                                    id="quarterly"
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={data.quarterly_discount_percent}
                                                    onChange={e => setData('quarterly_discount_percent', parseInt(e.target.value) || 0)}
                                                />
                                                <span className="absolute right-3 top-2.5 text-xs font-bold text-gray-400">%</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 pt-4">
                                            <div className="text-xs text-gray-500">Precio Final / periodo</div>
                                            <div className="font-mono font-bold text-green-700 text-lg">
                                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: data.currency }).format(calculateTotal(3, data.quarterly_discount_percent))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Semiannual */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-40 flex-shrink-0">
                                            <Label htmlFor="semiannual" className="text-xs text-gray-500 uppercase">Semestral (-%)</Label>
                                            <div className="relative mt-1">
                                                <Input
                                                    id="semiannual"
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={data.semiannual_discount_percent}
                                                    onChange={e => setData('semiannual_discount_percent', parseInt(e.target.value) || 0)}
                                                />
                                                <span className="absolute right-3 top-2.5 text-xs font-bold text-gray-400">%</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 pt-4">
                                            <div className="text-xs text-gray-500">Precio Final / periodo</div>
                                            <div className="font-mono font-bold text-green-700 text-lg">
                                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: data.currency }).format(calculateTotal(6, data.semiannual_discount_percent))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Annual */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-40 flex-shrink-0">
                                            <Label htmlFor="yearly" className="text-xs text-gray-500 uppercase">Anual (-%)</Label>
                                            <div className="relative mt-1">
                                                <Input
                                                    id="yearly"
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={data.yearly_discount_percent}
                                                    onChange={e => setData('yearly_discount_percent', parseInt(e.target.value) || 0)}
                                                />
                                                <span className="absolute right-3 top-2.5 text-xs font-bold text-gray-400">%</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 pt-4">
                                            <div className="text-xs text-gray-500">Precio Final / periodo</div>
                                            <div className="font-mono font-bold text-green-700 text-lg">
                                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: data.currency }).format(calculateTotal(12, data.yearly_discount_percent))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features & Config */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Features Column */}
                        <div className="md:col-span-2">
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>Características (Features)</CardTitle>
                                    <CardDescription>Lista de beneficios que verá el usuario.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {data.features.map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={feature}
                                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                placeholder={`Característica #${index + 1}`}
                                            />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)} disabled={data.features.length === 1}>
                                                <Trash2 className="h-4 w-4 text-red-400" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={addFeature} className="w-full border-dashed">
                                        <Plus className="h-4 w-4 mr-2" /> Agregar Característica
                                    </Button>
                                    {errors.features && <p className="text-red-500 text-sm">{errors.features}</p>}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Settings Column */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Configuración</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Días de Prueba Gratis</Label>
                                        <Input type="number" min="0" value={data.trial_days} onChange={e => setData('trial_days', parseInt(e.target.value) || 0)} />
                                    </div>

                                    <div className="flex items-center justify-between border p-3 rounded-lg">
                                        <Label htmlFor="no-payment" className="text-sm cursor-pointer">Sin Tarjeta Requerida</Label>
                                        <Switch
                                            id="no-payment"
                                            checked={data.no_initial_payment_required}
                                            onCheckedChange={(c) => setData('no_initial_payment_required', c)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Nivel de Soporte</Label>
                                        <Select
                                            value={data.support_level}
                                            onValueChange={(value) => setData('support_level', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="basic">Básico</SelectItem>
                                                <SelectItem value="priority">Prioritario</SelectItem>
                                                <SelectItem value="dedicated">Dedicado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <Label className="cursor-pointer" htmlFor="public">Público</Label>
                                        <Switch id="public" checked={data.is_public} onCheckedChange={c => setData('is_public', c)} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Label className="cursor-pointer" htmlFor="featured">Plan Destacado</Label>
                                        <Switch id="featured" checked={data.is_featured} onCheckedChange={c => setData('is_featured', c)} />
                                    </div>

                                    {data.is_featured && (
                                        <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-1">
                                            <Label>Texto Destacado</Label>
                                            <Input
                                                value={data.highlight_text}
                                                onChange={e => setData('highlight_text', e.target.value)}
                                                placeholder="Ej. Más Popular"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <Label className="cursor-pointer" htmlFor="custom-slug">Slug Personalizado</Label>
                                        <Switch id="custom-slug" checked={data.allow_custom_slug} onCheckedChange={c => setData('allow_custom_slug', c)} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Modules Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Permisos de Módulos</CardTitle>
                            <CardDescription>Define qué módulos del sidebar estarán activos para este plan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.keys(moduleConfig).length > 0 ? (
                                    Object.entries(moduleConfig).map(([key, enabled]) => (
                                        <div key={key} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                            <Checkbox
                                                id={`mod-${key}`}
                                                checked={enabled}
                                                onCheckedChange={(c) => handleModuleToggle(key, c as boolean)}
                                            />
                                            <Label htmlFor={`mod-${key}`} className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {MODULE_LABELS[key] || key}
                                            </Label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 col-span-full">
                                        No se detectaron módulos para esta vertical.
                                        Intenta cambiar la vertical para recargar los valores por defecto.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancelar</Button>
                        <Button type="submit" disabled={processing} className="min-w-[150px]">
                            {processing ? 'Guardando...' : 'Actualizar Plan'}
                        </Button>
                    </div>
                </form>
            </div>
        </SuperAdminLayout>
    );
}
