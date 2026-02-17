import React from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ChevronLeft } from "lucide-react";
import ProductForm from '@/Components/Tenant/Admin/Gastronomy/Products/ProductForm';

interface Category {
    id: number;
    name: string;
}

interface LocationItem {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    category_id: number;
    short_description?: string;
    price: number | string;
    original_price?: number | string;
    cost?: number | string;
    sku?: string;
    image: string;
    image_url?: string | null;
    gallery?: string[];
    gallery_urls?: string[];
    preparation_time?: number;
    calories?: number;
    allergens?: string[];
    tags?: string[];
    is_available: boolean;
    is_featured: boolean;
    status: 'active' | 'inactive';
    locations?: LocationItem[];
}

interface Props {
    product: Product;
    categories: Category[];
    locations: LocationItem[];
}

export default function Edit({ product, categories, locations }: Props) {
    const { currentTenant } = usePage<PageProps>().props;

    return (
        <AdminLayout title="Editar Producto">
            <Head title={`Editar ${product.name}`} />

            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col gap-6">
                    {/* Header with back link */}
                    <div className="space-y-2">
                        <Link
                            href={route('tenant.admin.products.index', currentTenant?.slug)}
                            className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" /> Volver a la lista
                        </Link>
                        <h1 className="text-3xl font-black tracking-tight">Editar Producto</h1>
                        <p className="text-muted-foreground">Actualiza los detalles de <strong>{product.name}</strong>.</p>
                    </div>

                    <ProductForm
                        product={product}
                        categories={categories}
                        locations={locations}
                        submitRoute={route('tenant.admin.products.update', [currentTenant?.slug, product.id])}
                        method="put"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
