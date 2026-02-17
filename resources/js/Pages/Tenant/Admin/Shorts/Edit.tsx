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

interface ShortData {
    id: number;
    name: string;
    description: string | null;
    location_id: number;
    location: { id: number; name: string } | null;
    link_type: string;
    external_url: string | null;
    linkable_type: string | null;
    linkable_id: number | null;
    short_embed_url: string | null;
    sort_order: number;
    is_active: boolean;
}

interface Props {
    short: ShortData;
    locations: LocationOption[];
    categories: CategoryOption[];
    products: ProductOption[];
}

export default function Edit({ short, locations, categories, products }: Props) {
    const { currentTenant } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        location_id: short.location_id.toString(),
        name: short.name,
        description: short.description ?? '',
        link_type: short.link_type as 'category' | 'product' | 'external',
        external_url: short.external_url ?? '',
        linkable_type: short.link_type === 'external' ? '' : (short.linkable_type ?? (short.link_type === 'product' ? 'App\\Models\\Product' : 'App\\Models\\Category')),
        linkable_id: short.link_type === 'external' ? '' : (short.linkable_id?.toString() ?? ''),
        short_video: null as File | null,
        remove_short: false,
        sort_order: short.sort_order.toString(),
        is_active: short.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tenant.shorts.update', [currentTenant?.slug, short.id]), { forceFormData: true });
    };

    return (
        <AdminLayout title={`Editar short - ${short.name}`}>
            <Head title={`Editar short - ${short.name}`} />
            <div className="max-w-2xl mx-auto">
                <Link
                    href={route('tenant.shorts.index', currentTenant?.slug)}
                    className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 mb-4"
                >
                    <ChevronLeft className="w-4 h-4" /> Volver a Shorts
                </Link>
                <h1 className="text-2xl font-bold tracking-tight mb-6">Editar short</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre de la promo *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            maxLength={255}
                        />
                        <FieldError>{errors.name}</FieldError>
                    </div>

                    <div className="space-y-2">
                        <Label>Sede *</Label>
                        <Select value={data.location_id} onValueChange={(v) => setData('location_id', v)}>
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
                            <SelectTrigger><SelectValue /></SelectTrigger>
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
                            <Select value={data.linkable_id} onValueChange={(v) => setData('linkable_id', v)}>
                                <SelectTrigger><SelectValue placeholder="Selecciona categoría" /></SelectTrigger>
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
                            <Select value={data.linkable_id} onValueChange={(v) => setData('linkable_id', v)}>
                                <SelectTrigger><SelectValue placeholder="Selecciona producto" /></SelectTrigger>
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
                        <Label>Video del short</Label>
                        <Input
                            type="file"
                            accept=".mp4,.mov"
                            onChange={(e) => setData('short_video', e.target.files?.[0] ?? null)}
                        />
                        <p className="text-xs text-muted-foreground">Deja vacío para mantener el actual. MP4 o MOV, máx. 50 MB</p>
                        <FieldError>{errors.short_video}</FieldError>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción (máx. 50)</Label>
                        <Input
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value.slice(0, 50))}
                            maxLength={50}
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
                            {processing ? 'Guardando…' : 'Guardar cambios'}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href={route('tenant.shorts.index', currentTenant?.slug)}>Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
