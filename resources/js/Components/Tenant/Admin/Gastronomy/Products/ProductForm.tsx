import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Switch } from "@/Components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Checkbox } from "@/Components/ui/checkbox";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { MediaManagerModal, MediaFile } from "@/Components/Shared/MediaManager/MediaManagerModal";
import { Info, DollarSign, Image as ImageIcon, UtensilsCrossed, Settings, AlertCircle, Save, Plus, X, Upload, Folder, Layers, Trash2, ArrowUp, ArrowDown, MapPin } from "lucide-react";
import { formatPrice } from '@/lib/utils';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";

interface Category {
    id: number;
    name: string;
}

interface LocationItem {
    id: number;
    name: string;
}

interface VariantOption {
    id?: number;
    name: string;
    price_adjustment: number | string;
    is_available: boolean;
    sort_order: number;
}

interface VariantGroup {
    id?: number;
    name: string;
    type: 'radio' | 'checkbox';
    min_selection: number;
    max_selection: number;
    is_required: boolean;
    sort_order: number;
    options: VariantOption[];
}

interface Product {
    id?: number;
    name: string;
    category_id: number;
    short_description?: string;
    price: number | string;
    original_price?: number | string;
    cost?: number | string;
    sku?: string;
    image?: string;
    image_url?: string | null;
    image_file?: File | null;
    gallery?: string[];
    gallery_urls?: string[];
    gallery_files?: File[];
    preparation_time?: number;
    calories?: number;
    allergens?: string[];
    tags?: string[];
    is_available: boolean;
    is_featured: boolean;
    status: 'active' | 'inactive';
    variant_groups?: VariantGroup[];
    tax_name?: string;
    tax_rate?: number;
    price_includes_tax?: boolean;
    locations?: LocationItem[];
}

interface Props {
    product?: Product;
    categories: Category[];
    locations?: LocationItem[];
    submitRoute: string;
    method?: 'post' | 'put' | 'patch';
}

const ALLERGENS = [
    { id: 'gluten', label: 'Gluten' },
    { id: 'lacteos', label: 'Lácteos' },
    { id: 'huevo', label: 'Huevo' },
    { id: 'frutos_secos', label: 'Frutos Secos' },
    { id: 'mariscos', label: 'Mariscos' },
    { id: 'soya', label: 'Soya' },
    { id: 'pescado', label: 'Pescado' },
];

const TAGS = [
    { id: 'vegano', label: 'Vegano' },
    { id: 'vegetariano', label: 'Vegetariano' },
    { id: 'sin_gluten', label: 'Sin Gluten' },
    { id: 'picante', label: 'Picante 🌶️' },
    { id: 'recomendado', label: 'Recomendado' },
    { id: 'nuevo', label: 'Nuevo' },
    { id: 'organico', label: 'Orgánico' },
];

interface ProductFormData {
    _method?: 'post' | 'put' | 'patch';
    name: string;
    category_id: number | string;
    short_description: string;
    price: number | string;
    original_price: number | string;
    cost: number | string;
    sku: string;
    image: string | null;
    image_file: File | null;
    gallery: string[];
    gallery_files: File[];
    preparation_time: number | string;
    calories: number | string;
    allergens: string[];
    tags: string[];
    is_available: boolean;
    is_featured: boolean;
    status: 'active' | 'inactive';
    variant_groups: VariantGroup[];
    tax_name: string;
    tax_rate: string | number;
    price_includes_tax: boolean;
    location_ids: number[];
}

export default function ProductForm({ product, categories, locations = [], submitRoute, method = 'post' }: Props) {
    const [galleryModalOpen, setGalleryModalOpen] = React.useState(false);

    const ensureArray = (val: unknown): string[] => {
        if (!val) return [];
        if (Array.isArray(val)) return val as string[];
        if (typeof val === 'string') {
            try {
                const parsed = JSON.parse(val);
                return Array.isArray(parsed) ? parsed : [val];
            } catch {
                return [val];
            }
        }
        return [];
    };

    const { data, setData, post, processing, errors } = useForm<ProductFormData>({
        _method: method === 'post' ? undefined : method,
        name: product?.name || '',
        category_id: product?.category_id || '',
        short_description: product?.short_description || '',
        price: product?.price ? Math.round(Number(product.price)).toString() : '',
        original_price: product?.original_price ? Math.round(Number(product.original_price)).toString() : '',
        cost: product?.cost ? Math.round(Number(product.cost)).toString() : '',
        sku: product?.sku || '',
        image: product?.image || null,
        image_file: null,
        gallery: ensureArray(product?.gallery),
        gallery_files: [],
        preparation_time: product?.preparation_time || '',
        calories: product?.calories || '',
        allergens: ensureArray(product?.allergens),
        tags: ensureArray(product?.tags),
        is_available: product?.is_available ?? true,
        is_featured: product?.is_featured ?? false,
        status: product?.status || 'active',
        variant_groups: product?.variant_groups || [],
        tax_name: product?.tax_name || '',
        tax_rate: product?.tax_rate ? Number(product.tax_rate).toString() : '',
        price_includes_tax: product?.price_includes_tax ?? false,
        location_ids: product?.locations?.map(l => l.id) || [],
    });

    const addVariantGroup = () => {
        setData('variant_groups', [
            ...data.variant_groups,
            {
                name: '',
                type: 'radio',
                min_selection: 0,
                max_selection: 1,
                is_required: false,
                sort_order: data.variant_groups.length,
                options: [
                    { name: '', price_adjustment: 0, is_available: true, sort_order: 0 }
                ]
            }
        ]);
    };

    const removeVariantGroup = (index: number) => {
        const newGroups = [...data.variant_groups];
        newGroups.splice(index, 1);
        setData('variant_groups', newGroups);
    };

    const updateVariantGroup = (index: number, field: keyof VariantGroup, value: string | number | boolean) => {
        const newGroups = [...data.variant_groups];
        newGroups[index] = { ...newGroups[index], [field]: value };
        setData('variant_groups', newGroups);
    };

    const addOption = (groupIndex: number) => {
        const newGroups = [...data.variant_groups];
        newGroups[groupIndex].options.push({
            name: '',
            price_adjustment: 0,
            is_available: true,
            sort_order: newGroups[groupIndex].options.length
        });
        setData('variant_groups', newGroups);
    };

    const removeOption = (groupIndex: number, optionIndex: number) => {
        const newGroups = [...data.variant_groups];
        newGroups[groupIndex].options.splice(optionIndex, 1);
        setData('variant_groups', newGroups);
    };

    const updateOption = (groupIndex: number, optionIndex: number, field: keyof VariantOption, value: string | number | boolean) => {
        const newGroups = [...data.variant_groups];
        newGroups[groupIndex].options[optionIndex] = {
            ...newGroups[groupIndex].options[optionIndex],
            [field]: value
        };
        setData('variant_groups', newGroups);
    };

    const moveOption = (groupIndex: number, optionIndex: number, direction: 'up' | 'down') => {
        const newGroups = [...data.variant_groups];
        const options = newGroups[groupIndex].options;
        if (direction === 'up' && optionIndex > 0) {
            [options[optionIndex], options[optionIndex - 1]] = [options[optionIndex - 1], options[optionIndex]];
        } else if (direction === 'down' && optionIndex < options.length - 1) {
            [options[optionIndex], options[optionIndex + 1]] = [options[optionIndex + 1], options[optionIndex]];
        }
        setData('variant_groups', newGroups);
    };

    const calculateMargin = () => {
        const price = Number(data.price);
        const cost = Number(data.cost);
        if (!price || !cost) return 0;
        return Math.round(((price - cost) / price) * 100);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(submitRoute, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const toggleArrayItem = (field: 'allergens' | 'tags', value: string) => {
        const current = data[field] as string[];
        if (current.includes(value)) {
            setData(field, current.filter(i => i !== value));
        } else {
            setData(field, [...current, value]);
        }
    };

    const toggleLocation = (locationId: number) => {
        const current = data.location_ids;
        if (current.includes(locationId)) {
            setData('location_ids', current.filter(id => id !== locationId));
        } else {
            setData('location_ids', [...current, locationId]);
        }
    };

    const imageInputRef = React.useRef<HTMLInputElement>(null);
    const galleryInputRef = React.useRef<HTMLInputElement>(null);

    const getImageUrl = (img: string | File | null | undefined) => {
        if (!img) return '';
        if (img instanceof File) return URL.createObjectURL(img);
        if (typeof img !== 'string') return '';
        if (img.startsWith('http') || img.startsWith('/')) return img;
        return `/media/${img}`;
    };

    // For the main image preview, prefer image_url from backend (BunnyCDN)
    const getMainImagePreview = (): string => {
        if (data.image_file) return URL.createObjectURL(data.image_file);
        if (product?.image_url) return product.image_url;
        if (data.image) return getImageUrl(data.image);
        return '';
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image_file', file);
            setData('image', null);
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const currentGalleryCount = (data.gallery?.length || 0) + (data.gallery_files?.length || 0);
            const availableSlots = 5 - currentGalleryCount;
            if (availableSlots > 0) {
                const toAdd = files.slice(0, availableSlots);
                setData('gallery_files', [...(data.gallery_files || []), ...toAdd]);
            }
        }
    };

    // Build gallery preview URLs: prefer gallery_urls from backend (BunnyCDN)
    const getGalleryPreviewUrl = (img: string, index: number): string => {
        if (product?.gallery_urls && product.gallery_urls[index]) {
            return product.gallery_urls[index];
        }
        return getImageUrl(img);
    };

    return (
        <form onSubmit={submit} className="space-y-8 pb-20">
            <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
            />
            <input
                type="file"
                ref={galleryInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
            />
            <Tabs defaultValue="basic" className="w-full">
                <div className="bg-white/50 backdrop-blur-sm sticky top-0 z-10 py-4 mb-6 border-b">
                    <TabsList className="flex w-full max-w-3xl mx-auto h-12 p-1 bg-muted/50 rounded-xl overflow-x-auto scrollbar-none">
                        <TabsTrigger value="basic" className="flex-1 py-2.5 rounded-lg data-[state=active]:!bg-white data-[state=active]:shadow-md transition-all">
                            <Info className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Información</span>
                        </TabsTrigger>
                        <TabsTrigger value="pricing" className="flex-1 py-2.5 rounded-lg data-[state=active]:!bg-white data-[state=active]:shadow-md transition-all">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Precios</span>
                        </TabsTrigger>
                        <TabsTrigger value="media" className="flex-1 py-2.5 rounded-lg data-[state=active]:!bg-white data-[state=active]:shadow-md transition-all">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Imágenes</span>
                        </TabsTrigger>
                        <TabsTrigger value="variants" className="flex-1 py-2.5 rounded-lg data-[state=active]:!bg-white data-[state=active]:shadow-md transition-all">
                            <Layers className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Variables</span>
                        </TabsTrigger>
                        <TabsTrigger value="culinary" className="flex-1 py-2.5 rounded-lg data-[state=active]:!bg-white data-[state=active]:shadow-md transition-all">
                            <UtensilsCrossed className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Detalles</span>
                        </TabsTrigger>
                        <TabsTrigger value="config" className="flex-1 py-2.5 rounded-lg data-[state=active]:!bg-white data-[state=active]:shadow-md transition-all">
                            <Settings className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Ajustes</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="max-w-4xl mx-auto w-full">
                    {/* Basic Info */}
                    <TabsContent value="basic" className="space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Información Básica</CardTitle>
                                <CardDescription>Datos esenciales del plato o bebida.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nombre del Producto <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Ej: Pizza Margarita"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="category">Categoría <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={data.category_id.toString()}
                                        onValueChange={val => setData('category_id', val)}
                                    >
                                        <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && <p className="text-xs text-red-500 font-medium">{errors.category_id}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="short_description">Descripción Corta</Label>
                                    <Textarea
                                        id="short_description"
                                        value={data.short_description}
                                        onChange={e => setData('short_description', e.target.value)}
                                        placeholder="Describe brevemente el plato para el cliente..."
                                        rows={3}
                                        maxLength={150}
                                    />
                                    <div className="flex justify-end">
                                        <span className="text-[10px] text-muted-foreground">{data.short_description?.length || 0}/150</span>
                                    </div>
                                    {errors.short_description && <p className="text-xs text-red-500 font-medium">{errors.short_description}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Pricing */}
                    <TabsContent value="pricing" className="space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Precios y Costos</CardTitle>
                                <CardDescription>Gestiona el valor comercial y el margen de ganancia.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6 items-start">
                                    <div className="grid gap-2">
                                        <Label htmlFor="price">Precio de Venta <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <Input
                                                id="price"
                                                type="text"
                                                value={data.price ? formatPrice(data.price, false) : ''}
                                                onChange={e => setData('price', e.target.value.replace(/\D/g, ''))}
                                                placeholder="25.000"
                                                className={`pl-7 ${errors.price ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        {errors.price && <p className="text-xs text-red-500 font-medium">{errors.price}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="original_price">Precio Original (Antes de Descuento)</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <Input
                                                id="original_price"
                                                type="text"
                                                value={data.original_price ? formatPrice(data.original_price, false) : ''}
                                                onChange={e => setData('original_price', e.target.value.replace(/\D/g, ''))}
                                                placeholder="30.000"
                                                className="pl-7"
                                            />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">Si llenas esto, el precio de venta se mostrará como oferta.</p>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="cost">Costo del Producto</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <Input
                                                id="cost"
                                                type="text"
                                                value={data.cost ? formatPrice(data.cost, false) : ''}
                                                onChange={e => setData('cost', e.target.value.replace(/\D/g, ''))}
                                                placeholder="12.000"
                                                className="pl-7"
                                            />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">Opcional para calcular margen de utilidad.</p>
                                    </div>
                                </div>

                                {data.price && data.cost && (
                                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                <DollarSign className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Margen Estimado</p>
                                                <p className="text-2xl font-black text-primary">{calculateMargin()}%</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground max-w-[200px] text-right">
                                            Utilidad por unidad: <strong>${formatPrice(Number(data.price) - Number(data.cost))}</strong>
                                        </p>
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="sku">SKU / Código Externo</Label>
                                    <Input
                                        id="sku"
                                        value={data.sku}
                                        onChange={e => setData('sku', e.target.value)}
                                        placeholder="Ej: PIZ-001"
                                    />
                                    {errors.sku && <p className="text-xs text-red-500 font-medium">{errors.sku}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tax Configuration */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Impuestos</CardTitle>
                                <CardDescription>Configuración específica de impuestos para este producto (sobrescribe la configuración global).</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-2 border p-3 rounded-lg bg-muted/20">
                                    <Switch
                                        id="price_includes_tax"
                                        checked={!!data.price_includes_tax}
                                        onCheckedChange={(checked) => {
                                            if (Boolean(data.price_includes_tax) !== checked) setData('price_includes_tax', checked);
                                        }}
                                    />
                                    <Label htmlFor="price_includes_tax" className="cursor-pointer">El precio de venta incluye impuestos</Label>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="tax_name">Nombre del Impuesto</Label>
                                        <Input
                                            id="tax_name"
                                            value={data.tax_name}
                                            onChange={e => setData('tax_name', e.target.value)}
                                            placeholder="Ej: IVA, Impoconsumo"
                                        />
                                        <p className="text-[10px] text-muted-foreground">Dejar en blanco para usar configuración global.</p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="tax_rate">Tasa de Impuesto (%)</Label>
                                        <div className="relative">
                                            <Input
                                                id="tax_rate"
                                                type="number"
                                                step="0.01"
                                                value={data.tax_rate}
                                                onChange={e => setData('tax_rate', e.target.value)}
                                                placeholder="Ej: 19"
                                                className="pr-7"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">Dejar en blanco para usar configuración global.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Media */}
                    <TabsContent value="media" className="space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Fotografías</CardTitle>
                                <CardDescription>Las imágenes serán redimensionadas automáticamente a formato cuadrado (1:1).</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-6">
                                    <div className="space-y-4">
                                        <Label className="text-base font-bold">Imagen Principal <span className="text-red-500">*</span></Label>

                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div
                                                className="relative w-full md:w-64 aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors shrink-0"
                                                onClick={() => imageInputRef.current?.click()}
                                            >
                                                {(data.image || data.image_file || product?.image_url) ? (
                                                    <img
                                                        src={getMainImagePreview()}
                                                        className="w-full h-full object-cover"
                                                        alt="Principal"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                        <div className="p-3 bg-white rounded-full shadow-sm">
                                                            <Upload className="w-6 h-6" />
                                                        </div>
                                                        <span className="text-xs font-bold uppercase">Subir Imagen</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <span className="text-white text-xs font-bold uppercase tracking-widest">Cambiar</span>
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-4">
                                                <div className="flex flex-col gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="h-10 px-4 rounded-xl border-dashed hover:border-primary/50 hover:bg-primary/5 justify-start text-xs font-bold uppercase transition-all"
                                                        onClick={() => imageInputRef.current?.click()}
                                                    >
                                                        <Upload className="w-4 h-4 mr-2 text-primary" />
                                                        Elegir Archivo
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-[10px] font-bold uppercase w-fit"
                                                        onClick={() => {
                                                            setGalleryModalOpen(true);
                                                        }}
                                                    >
                                                        <Folder className="w-3 h-3 mr-1" />
                                                        Biblioteca
                                                    </Button>
                                                </div>

                                                <div className="p-3 rounded-lg bg-orange-50/50 border border-orange-100 flex items-start gap-2">
                                                    <Info className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                                                    <p className="text-[10px] text-orange-800 leading-tight">
                                                        Formatos: JPG, PNG, WebP. Tamaño máx: 2MB. Se convertirá automáticamente a <strong>800x800px</strong>.
                                                    </p>
                                                </div>
                                                {errors.image && <p className="text-xs text-red-500 font-medium">{errors.image}</p>}
                                                {errors.image_file && <p className="text-xs text-red-500 font-medium">{errors.image_file}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-muted/30" />

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <Label className="text-base font-bold">Galería Adicional</Label>
                                                <p className="text-xs text-muted-foreground">Hasta 5 imágenes adicionales para tu producto.</p>
                                            </div>
                                            <div className="text-xs font-bold bg-muted px-2 py-1 rounded">
                                                {(data.gallery?.length || 0) + (data.gallery_files?.length || 0)} / 5
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                            {/* Existing Gallery (Paths) */}
                                            {data.gallery.map((img, i) => (
                                                <div key={`path-${i}`} className="relative aspect-square rounded-lg overflow-hidden border group">
                                                    <img
                                                        src={getGalleryPreviewUrl(img, i)}
                                                        alt={`Gallery ${i}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => {
                                                            const newGallery = [...data.gallery];
                                                            newGallery.splice(i, 1);
                                                            setData('gallery', newGallery);
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}

                                            {/* Local Gallery (Files) */}
                                            {data.gallery_files.map((file, i) => (
                                                <div key={`file-${i}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary/20 group animate-in fade-in zoom-in duration-300">
                                                    <img
                                                        src={getImageUrl(file)}
                                                        alt={`New Upload ${i}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute top-1 left-1 bg-primary text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">Nuevo</div>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => {
                                                            const newFiles = [...data.gallery_files];
                                                            newFiles.splice(i, 1);
                                                            setData('gallery_files', newFiles);
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}

                                            {(data.gallery.length + data.gallery_files.length) < 5 && (
                                                <div className="grid grid-cols-1 gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => galleryInputRef.current?.click()}
                                                        className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-muted/5 hover:bg-muted/10 transition-colors aspect-square group cursor-pointer"
                                                    >
                                                        <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                                            <Upload className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase mt-2 text-muted-foreground">Subir</span>
                                                    </button>

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-[10px] font-bold uppercase"
                                                        onClick={() => setGalleryModalOpen(true)}
                                                    >
                                                        <Folder className="w-3 h-3 mr-1" />
                                                        Biblioteca
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        {errors.gallery && <p className="text-xs text-red-500 font-medium">{errors.gallery}</p>}
                                        {errors.gallery_files && <p className="text-xs text-red-500 font-medium">{errors.gallery_files}</p>}
                                    </div>

                                    <MediaManagerModal
                                        open={galleryModalOpen}
                                        onOpenChange={setGalleryModalOpen}
                                        onSelect={(file: MediaFile) => {
                                            if (file.url) {
                                                setData('gallery', [...data.gallery, file.url]);
                                            }
                                            setGalleryModalOpen(false);
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Variants */}
                    <TabsContent value="variants" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold">Modificadores y Variables</h3>
                                <p className="text-sm text-muted-foreground">Define opciones como tamaño, término, adiciones, etc.</p>
                            </div>
                            <Button type="button" onClick={addVariantGroup} className="gap-2">
                                <Plus className="w-4 h-4" /> Agregar Grupo
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {data.variant_groups.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/5">
                                    <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                    <h4 className="font-semibold text-lg">Sin variables definidas</h4>
                                    <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                                        Agrega grupos de opciones para permitir a tus clientes personalizar este producto.
                                    </p>
                                    <Button type="button" variant="outline" onClick={addVariantGroup}>
                                        Crear primer grupo
                                    </Button>
                                </div>
                            )}

                            <Accordion type="multiple" className="w-full space-y-4" defaultValue={data.variant_groups.map((_, i) => `group-${i}`)}>
                                {data.variant_groups.map((group, gIndex) => (
                                    <AccordionItem value={`group-${gIndex}`} key={`group-${gIndex}`} className="border rounded-lg bg-card overflow-hidden">
                                        <div className="flex items-center px-4 bg-muted/10">
                                            <AccordionTrigger className="flex-1 hover:no-underline py-4">
                                                <div className="flex items-center gap-3 text-left">
                                                    <span className="font-bold text-lg">{group.name || `Nuevo Grupo ${gIndex + 1}`}</span>
                                                    <div className="flex gap-2">
                                                        <Badge variant={group.type === 'radio' ? 'secondary' : 'outline'} className="text-[10px] h-5">
                                                            {group.type === 'radio' ? 'Única' : 'Múltiple'}
                                                        </Badge>
                                                        {group.is_required && <Badge variant="destructive" className="text-[10px] h-5">Requerido</Badge>}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-destructive shrink-0 ml-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeVariantGroup(gIndex);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <AccordionContent className="p-0 border-t">
                                            <div className="p-6 space-y-6">
                                                {/* Group Settings */}
                                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-start">
                                                    <div className="md:col-span-2 space-y-2">
                                                        <Label>Nombre del Grupo</Label>
                                                        <Input
                                                            placeholder="Ej: Elige el tamaño, Qué salsa deseas?"
                                                            value={group.name}
                                                            onChange={e => updateVariantGroup(gIndex, 'name', e.target.value)}
                                                            className={`text-base ${errors[`variant_groups.${gIndex}.name`] ? 'border-red-500' : ''}`}
                                                        />
                                                        {errors[`variant_groups.${gIndex}.name`] && <p className="text-xs text-red-500">{errors[`variant_groups.${gIndex}.name`]}</p>}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Tipo de Selección</Label>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                type="button"
                                                                variant={group.type === 'radio' ? 'default' : 'outline'}
                                                                className="flex-1"
                                                                onClick={() => updateVariantGroup(gIndex, 'type', 'radio')}
                                                            >
                                                                Única
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant={group.type === 'checkbox' ? 'default' : 'outline'}
                                                                className="flex-1"
                                                                onClick={() => updateVariantGroup(gIndex, 'type', 'checkbox')}
                                                            >
                                                                Múltiple
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Configuración</Label>
                                                        <div className="flex items-center gap-2 border rounded-md p-2 bg-muted/20">
                                                            <Switch
                                                                checked={!!group.is_required}
                                                                onCheckedChange={val => {
                                                                    if (Boolean(group.is_required) !== val) updateVariantGroup(gIndex, 'is_required', val);
                                                                }}
                                                            />
                                                            <Label className="text-xs uppercase font-bold text-muted-foreground cursor-pointer" onClick={() => updateVariantGroup(gIndex, 'is_required', !group.is_required)}>
                                                                Obligatorio
                                                            </Label>
                                                        </div>
                                                    </div>
                                                </div>

                                                {group.type === 'checkbox' && (
                                                    <div className="flex items-center gap-4 text-sm bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-blue-800">
                                                        <Info className="w-4 h-4 text-blue-500" />
                                                        <div className="flex items-center gap-2">
                                                            <span>Limitar selección:</span>
                                                            <span className="text-xs font-bold uppercase ml-2">Mínimo</span>
                                                            <Input
                                                                type="number"
                                                                value={group.min_selection}
                                                                onChange={e => updateVariantGroup(gIndex, 'min_selection', parseInt(e.target.value))}
                                                                className="w-16 h-8 text-xs bg-white"
                                                                min={0}
                                                            />
                                                            <span className="text-xs font-bold uppercase ml-2">Máximo</span>
                                                            <Input
                                                                type="number"
                                                                value={group.max_selection}
                                                                onChange={e => updateVariantGroup(gIndex, 'max_selection', parseInt(e.target.value))}
                                                                className="w-16 h-8 text-xs bg-white"
                                                                min={1}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                <Separator />

                                                {/* Options List */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="uppercase text-xs font-bold text-muted-foreground">Opciones del Grupo</Label>
                                                        <span className="text-xs text-muted-foreground">{group.options.length} opciones</span>
                                                    </div>

                                                    <div className="space-y-2">
                                                        {group.options.map((option, oIndex) => (
                                                            <div key={`opt-${gIndex}-${oIndex}`} className="flex items-center gap-2 p-2 rounded-lg border bg-white group/option hover:border-primary/30 transition-colors">
                                                                <div className="flex flex-col gap-1 mt-0.5">
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-6 w-6 text-muted-foreground hover:bg-muted"
                                                                        disabled={oIndex === 0}
                                                                        onClick={() => moveOption(gIndex, oIndex, 'up')}
                                                                    >
                                                                        <ArrowUp className="w-3 h-3" />
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-6 w-6 text-muted-foreground hover:bg-muted"
                                                                        disabled={oIndex === group.options.length - 1}
                                                                        onClick={() => moveOption(gIndex, oIndex, 'down')}
                                                                    >
                                                                        <ArrowDown className="w-3 h-3" />
                                                                    </Button>
                                                                </div>

                                                                <div className="flex-1 space-y-2">
                                                                    <div className="flex gap-2">
                                                                        <Input
                                                                            placeholder="Nombre (Ej: Grande)"
                                                                            value={option.name}
                                                                            onChange={e => updateOption(gIndex, oIndex, 'name', e.target.value)}
                                                                            className={`h-9 ${errors[`variant_groups.${gIndex}.options.${oIndex}.name`] ? 'border-red-500' : ''}`}
                                                                        />
                                                                        <div className="relative w-32 shrink-0">
                                                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                                                                            <Input
                                                                                type="number"
                                                                                placeholder="0"
                                                                                value={option.price_adjustment}
                                                                                onChange={e => updateOption(gIndex, oIndex, 'price_adjustment', e.target.value)}
                                                                                className={`h-9 pl-5 ${errors[`variant_groups.${gIndex}.options.${oIndex}.price_adjustment`] ? 'border-red-500' : ''}`}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {(errors[`variant_groups.${gIndex}.options.${oIndex}.name`] || errors[`variant_groups.${gIndex}.options.${oIndex}.price_adjustment`]) && (
                                                                        <div className="text-[10px] text-red-500 font-medium px-1">
                                                                            {errors[`variant_groups.${gIndex}.options.${oIndex}.name`]}
                                                                            {errors[`variant_groups.${gIndex}.options.${oIndex}.price_adjustment`] && <span className="ml-2">{errors[`variant_groups.${gIndex}.options.${oIndex}.price_adjustment`]}</span>}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex items-center gap-1 mt-0.5">
                                                                    <Switch
                                                                        checked={!!option.is_available}
                                                                        onCheckedChange={val => {
                                                                            if (Boolean(option.is_available) !== val) updateOption(gIndex, oIndex, 'is_available', val);
                                                                        }}
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                                        onClick={() => removeOption(gIndex, oIndex)}
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => addOption(gIndex)}
                                                        className="w-full border border-dashed border-muted-foreground/30 text-muted-foreground hover:bg-muted/30 hover:text-primary"
                                                    >
                                                        <Plus className="w-3 h-3 mr-2" /> Agregar Opción
                                                    </Button>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </TabsContent>

                    {/* Culinary Details */}
                    <TabsContent value="culinary" className="space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Detalles Gastronómicos</CardTitle>
                                <CardDescription>Información extra para el cliente.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="preparation_time">Tiempo de Preparación (Minutos)</Label>
                                        <Input
                                            id="preparation_time"
                                            type="number"
                                            value={data.preparation_time}
                                            onChange={e => setData('preparation_time', e.target.value)}
                                            placeholder="Ej: 15"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="calories">Calorías (Kcal)</Label>
                                        <Input
                                            id="calories"
                                            type="number"
                                            value={data.calories}
                                            onChange={e => setData('calories', e.target.value)}
                                            placeholder="Ej: 450"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-orange-500" /> Alérgenos
                                    </Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {ALLERGENS.map(allergen => (
                                            <div key={allergen.id} className="flex items-center space-x-2 bg-muted/20 p-2 rounded-lg border border-transparent hover:border-primary/20 transition-colors">
                                                <Checkbox
                                                    id={`allergen-${allergen.id}`}
                                                    checked={data.allergens.includes(allergen.id)}
                                                    onCheckedChange={() => toggleArrayItem('allergens', allergen.id)}
                                                />
                                                <label
                                                    htmlFor={`allergen-${allergen.id}`}
                                                    className="text-xs font-medium leading-none cursor-pointer select-none"
                                                >
                                                    {allergen.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label>Etiquetas / Tags</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {TAGS.map(tag => (
                                            <Badge
                                                key={tag.id}
                                                variant={data.tags.includes(tag.id) ? 'default' : 'outline'}
                                                className={`cursor-pointer py-1.5 px-3 transition-all ${data.tags.includes(tag.id) ? '' : 'hover:bg-primary/5'}`}
                                                onClick={() => toggleArrayItem('tags', tag.id)}
                                            >
                                                {tag.label}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Configuration */}
                    <TabsContent value="config" className="space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Configuración de Visibilidad</CardTitle>
                                <CardDescription>Define cómo y dónde se muestra el producto.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Disponibilidad</Label>
                                        <p className="text-xs text-muted-foreground">Activa para permitir la venta, apaga si el producto está temporalmente agotado.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold uppercase tracking-widest ${data.is_available ? 'text-green-600' : 'text-slate-400'}`}>
                                            {data.is_available ? 'Disponible' : 'Agotado'}
                                        </span>
                                        <Switch
                                            checked={!!data.is_available}
                                            onCheckedChange={val => {
                                                if (Boolean(data.is_available) !== val) setData('is_available', val);
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-base">Producto Destacado</Label>
                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none">VIP</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Aparecerá en los primeros lugares y con un diseño especial en el menú.</p>
                                    </div>
                                    <Switch
                                        checked={!!data.is_featured}
                                        onCheckedChange={val => {
                                            if (Boolean(data.is_featured) !== val) setData('is_featured', val);
                                        }}
                                    />
                                </div>

                                <div className="space-y-4 pt-4 border-t">
                                    <Label>Estado General del Producto</Label>
                                    <Select value={data.status} onValueChange={val => setData('status', val as 'active' | 'inactive')}>
                                        <SelectTrigger className="max-w-[200px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active" className="text-green-600 font-medium">Activo</SelectItem>
                                            <SelectItem value="inactive" className="text-slate-400 font-medium">Inactivo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground italic">Los productos inactivos están ocultos totalmente del menú público.</p>
                                </div>

                                {/* Location Selector */}
                                {locations.length > 0 && (
                                    <div className="space-y-4 pt-4 border-t">
                                        <div className="space-y-1">
                                            <Label className="flex items-center gap-2 text-base">
                                                <MapPin className="w-4 h-4 text-primary" />
                                                Disponibilidad por Sede
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Selecciona en qué sedes estará disponible este producto.
                                                Si no seleccionas ninguna, estará disponible en <strong>todas</strong>.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {locations.map(loc => {
                                                const isChecked = data.location_ids.includes(loc.id);
                                                return (
                                                <div
                                                    key={loc.id}
                                                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                                                        isChecked ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/30'
                                                    }`}
                                                >
                                                    <Checkbox
                                                        id={`location-${loc.id}`}
                                                        checked={isChecked}
                                                        onCheckedChange={(checked) => {
                                                            const next = checked === true;
                                                            if (isChecked !== next) toggleLocation(loc.id);
                                                        }}
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-sm font-medium">{loc.name}</span>
                                                    </div>
                                                </div>
                                                );
                                            })}
                                        </div>

                                        {data.location_ids.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="text-xs">
                                                    {data.location_ids.length} sede{data.location_ids.length !== 1 ? 's' : ''} seleccionada{data.location_ids.length !== 1 ? 's' : ''}
                                                </Badge>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-xs h-6"
                                                    onClick={() => setData('location_ids', [])}
                                                >
                                                    Limpiar selección
                                                </Button>
                                            </div>
                                        )}

                                        {errors.location_ids && <p className="text-xs text-red-500 font-medium">{errors.location_ids}</p>}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>

            {/* Footer Actions */}
            <div className="sticky bottom-0 -mx-6 mt-10 px-6 py-4 bg-white/80 backdrop-blur-md border-t flex justify-end gap-3 z-20">
                <Button type="button" variant="outline" className="cursor-pointer" onClick={() => window.history.back()}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={processing} className="cursor-pointer gap-2 px-8">
                    {processing ? (
                        <>Guardando...</>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            {product ? 'Actualizar Producto' : 'Crear Producto'}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
