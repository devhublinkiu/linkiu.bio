import React from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ChevronLeft, MapPin } from "lucide-react";
import LocationForm from '@/Components/Tenant/Admin/Locations/LocationForm';

interface Location {
    id: number;
    name: string;
    manager: string | null;
    description: string | null;
    is_main: boolean;
    phone: string | null;
    whatsapp: string | null;
    whatsapp_message: string | null;
    state: string | null;
    city: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    opening_hours: Record<string, { open: string; close: string }[]> | null;
    social_networks: { facebook?: string; instagram?: string; tiktok?: string } | null;
    is_active: boolean;
}

interface Props {
    location: Location;
}

export default function Edit({ location }: Props) {
    const { currentTenant } = usePage<PageProps>().props;

    return (
        <AdminLayout title={`Editar Sede - ${location.name}`}>
            <Head title={`Editar Sede - ${location.name}`} />

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
                            Editar Sede
                        </h1>
                        <p className="text-muted-foreground">Actualiza la información de {location.name}.</p>
                    </div>

                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <LocationForm
                            location={location}
                            onSuccess={() => { }}
                            onCancel={() => window.history.back()}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
