import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import type { PublicLocation } from '@/types/location';
import PublicLayout from '@/Components/Tenant/Gastronomy/Public/PublicLayout';
import LocationCard from '@/Components/Tenant/Public/Locations/LocationCard';
import Header from '@/Components/Tenant/Gastronomy/Public/Header';
import { MapPin } from 'lucide-react';

interface TenantPublic {
    name: string;
    slug: string;
    logo_url?: string | null;
    store_description?: string | null;
    brand_colors?: { bg_color?: string; name_color?: string };
}

interface LocationsPageProps {
    tenant: TenantPublic;
    locations: PublicLocation[];
    selected_location_id?: number | null;
}

export default function Index({ tenant, locations, selected_location_id = null }: LocationsPageProps) {
    const { locationsCount = 0 } = usePage().props as { locationsCount?: number };
    const slug = tenant.slug;
    const { bg_color, name_color } = tenant.brand_colors || { bg_color: '#db2777', name_color: '#ffffff' };

    const enterSede = (locationId: number) => {
        router.post(route('tenant.shorts.enter', { tenant: slug }), { location_id: locationId });
    };

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title={`Nuestras Sedes - ${tenant.name}`} />

            <div className="flex flex-col min-h-screen pb-20">
                <Header
                    tenantName={tenant.name}
                    logoUrl={tenant.logo_url ?? undefined}
                    description={tenant.store_description ?? undefined}
                    bgColor={bg_color}
                    textColor={name_color}
                />

                <div className="max-w-md mx-auto px-4 w-full">
                    <div className="flex items-center gap-3 mb-6 mt-2">
                        <div className="bg-primary/10 p-2.5 rounded-xl">
                            <MapPin className="size-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">Nuestras Sedes</h1>
                            <p className="text-xs text-muted-foreground">
                                {locations.length} {locations.length === 1 ? 'ubicación disponible' : 'ubicaciones disponibles'}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="py-6">
                        {locations.length > 0 ? (
                            <div className="space-y-4">
                                {locations.map((location) => (
                                    <LocationCard
                                        key={location.id}
                                        location={location}
                                        isCurrentSede={selected_location_id != null && location.id === selected_location_id}
                                        onEnterSede={locationsCount > 1 && selected_location_id !== location.id ? enterSede : undefined}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="bg-slate-100 rounded-full size-16 mx-auto mb-4 flex items-center justify-center">
                                    <MapPin className="size-8 text-slate-400" />
                                </div>
                                <p className="text-slate-600 font-medium">No hay sedes disponibles</p>
                                <p className="text-xs text-muted-foreground mt-1">Pronto estaremos cerca de ti</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
