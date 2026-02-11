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

interface Props {
    categories: Category[];
}

export default function Create({ categories }: Props) {
    const { currentTenant } = usePage<PageProps>().props;

    return (
        <AdminLayout title="Nuevo Producto">
            <Head title="Nuevo Producto" />

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
                        <h1 className="text-3xl font-black tracking-tight">Crear Producto</h1>
                        <p className="text-muted-foreground">Completa los campos para añadir un nuevo plato a tu menú.</p>
                    </div>

                    <ProductForm
                        categories={categories}
                        submitRoute={route('tenant.admin.products.store', currentTenant?.slug)}
                        method="post"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
