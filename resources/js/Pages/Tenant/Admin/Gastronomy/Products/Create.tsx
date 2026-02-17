import React from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import ProductForm from '@/Components/Tenant/Admin/Gastronomy/Products/ProductForm';

interface Category {
    id: number;
    name: string;
}

interface LocationItem {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
    locations: LocationItem[];
    limit_reached?: boolean;
    products_limit?: number | null;
}

export default function Create({ categories, locations, limit_reached, products_limit }: Props) {
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

                    {limit_reached ? (
                        <Card className="border-orange-200 bg-orange-50">
                            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                <AlertTriangle className="w-12 h-12 text-orange-500" />
                                <div>
                                    <h3 className="text-lg font-bold text-orange-800">Límite de productos alcanzado</h3>
                                    <p className="text-sm text-orange-700 mt-1">
                                        Tu plan actual permite un máximo de <strong>{products_limit}</strong> productos.
                                        Para agregar más, actualiza tu plan.
                                    </p>
                                </div>
                                <Link href={route('tenant.admin.products.index', currentTenant?.slug)}>
                                    <Button variant="outline">Volver a productos</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <ProductForm
                            categories={categories}
                            locations={locations}
                            submitRoute={route('tenant.admin.products.store', currentTenant?.slug)}
                            method="post"
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
