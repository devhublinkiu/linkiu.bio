import React from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ChevronLeft, MapPin } from "lucide-react";
import LocationForm from '@/Components/Tenant/Admin/Locations/LocationForm';

export default function Create() {
    const { currentTenant } = usePage<PageProps>().props;

    return (
        <AdminLayout title="Nueva Sede">
            <Head title="Nueva Sede" />

            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col gap-6">
                    {/* Header with back link */}
                    <div className="space-y-2">
                        <Link
                            href={route('tenant.locations.index', currentTenant?.slug)}
                            className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" /> Volver a la lista
                        </Link>
                        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <MapPin className="size-6 text-primary" />
                            Nueva Sede
                        </h1>
                        <p className="text-muted-foreground">Registra un nuevo punto de venta físico o centro de despacho.</p>
                    </div>

                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <LocationForm
                            location={null}
                            onSuccess={() => { }}
                            onCancel={() => window.history.back()}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
