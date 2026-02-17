import React from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ChevronLeft } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { FieldError } from '@/Components/ui/field';
import { PageProps } from '@/types';

interface LocationOption {
    id: number;
    name: string;
}
interface CategoryOption {
    id: number;
    name: string;
    slug: string;
}
interface ProductOption {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    locations: LocationOption[];
    categories: CategoryOption[];
    products: ProductOption[];
    shorts_limit: number | null;
    shorts_count: number;
}

export default function Create({ locations, categories, products, shorts_limit, shorts_count }: Props) {
    const { currentTenant } = usePage<PageProps>().props;
    const atLimit = shorts_limit !== null && shorts_count >= shorts_limit;

    const { data, setData, post, processing, errors } = useForm({
        location_id: locations[0]?.id?.toString() ?? '',
        name: '',
        description: '',
        link_type: 'category' as 'category' | 'product' | 'external',
        external_url: '',
        linkable_type: 'App\\Models\\Category',
        linkable_id: '',
        short_video: null as File | null,
        sort_order: '0',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tenant.shorts.store', currentTenant?.slug), { forceFormData: true });
    };

    return (
        <AdminLayout title="Nuevo short">
            <Head title="Nuevo short" />
            <div className="max-w-2xl mx-auto">
                <Link
                    href={route('tenant.shorts.index', currentTenant?.slug)}
                    className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 mb-4"
                >
                    <ChevronLeft className="w-4 h-4" /> Volver a Shorts
                </Link>
                <h1 className="text-2xl font-bold tracking-tight mb-6">Nuevo short</h1>

                {atLimit ? (
                    <p className="text-muted-foreground">Has alcanzado el máximo de shorts permitidos en tu plan.</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre de la promo *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Ej. 2x1 en hamburguesas"
                                maxLength={255}
                            />
                            <FieldError>{errors.name}</FieldError>
                        </div>

                        <div className="space-y-2">
                            <Label>Sede *</Label>
                            <Select
                                value={data.location_id}
                                onValueChange={(v) => setData('location_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Escoge la sede" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map((loc) => (
                                        <SelectItem key={loc.id} value={String(loc.id)}>{loc.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FieldError>{errors.location_id}</FieldError>
                        </div>

                        <div className="space-y-2">
                            <Label>Enlace *</Label>
                            <Select
                                value={data.link_type}
                                onValueChange={(v: 'category' | 'product' | 'external') => {
                                    setData('link_type', v);
                                    setData('linkable_type', v === 'category' ? 'App\\Models\\Category' : v === 'product' ? 'App\\Models\\Product' : '');
                                    setData('linkable_id', '');
                                    setData('external_url', '');
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="category">Categoría</SelectItem>
                                    <SelectItem value="product">Producto</SelectItem>
                                    <SelectItem value="external">URL externa</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldError>{errors.link_type}</FieldError>
                        </div>

                        {data.link_type === 'category' && (
                            <div className="space-y-2">
                                <Label>Categoría *</Label>
                                <Select
                                    value={data.linkable_id}
                                    onValueChange={(v) => setData('linkable_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError>{errors.linkable_id}</FieldError>
                            </div>
                        )}

                        {data.link_type === 'product' && (
                            <div className="space-y-2">
                                <Label>Producto *</Label>
                                <Select
                                    value={data.linkable_id}
                                    onValueChange={(v) => setData('linkable_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona producto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError>{errors.linkable_id}</FieldError>
                            </div>
                        )}

                        {data.link_type === 'external' && (
                            <div className="space-y-2">
                                <Label>URL *</Label>
                                <Input
                                    type="url"
                                    value={data.external_url}
                                    onChange={(e) => setData('external_url', e.target.value)}
                                    placeholder="https://..."
                                />
                                <FieldError>{errors.external_url}</FieldError>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Subir short *</Label>
                            <Input
                                type="file"
                                accept=".mp4,.mov"
                                onChange={(e) => setData('short_video', e.target.files?.[0] ?? null)}
                            />
                            <p className="text-xs text-muted-foreground">MP4 o MOV, máx. 50 MB</p>
                            <FieldError>{errors.short_video}</FieldError>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción (máx. 50 caracteres)</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value.slice(0, 50))}
                                maxLength={50}
                                placeholder="Opcional"
                            />
                            <p className="text-xs text-muted-foreground">{data.description.length}/50</p>
                            <FieldError>{errors.description}</FieldError>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sort_order">Orden</Label>
                            <Input
                                id="sort_order"
                                type="number"
                                min={0}
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', e.target.value)}
                            />
                            <FieldError>{errors.sort_order}</FieldError>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Guardando…' : 'Crear short'}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href={route('tenant.shorts.index', currentTenant?.slug)}>Cancelar</Link>
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
