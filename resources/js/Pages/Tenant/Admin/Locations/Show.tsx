import React from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    ChevronLeft,
    MapPin,
    Smartphone,
    MessageCircle,
    Clock,
    Globe,
    Navigation,
    Edit,
    Calendar,
    Info,
    CheckCircle2
} from "lucide-react";
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
// Map Components (Manual implementation to avoid react-leaflet v5 context errors)
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

const DAYS = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
];

function ManualMap({ position, zoom = 13 }: { position: [number, number], zoom?: number }) {
    const mapRef = React.useRef<HTMLDivElement>(null);
    const leafletMap = React.useRef<L.Map | null>(null);
    const markerRef = React.useRef<L.Marker | null>(null);

    React.useEffect(() => {
        if (!mapRef.current || leafletMap.current) return;

        leafletMap.current = L.map(mapRef.current).setView(position, zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(leafletMap.current);

        markerRef.current = L.marker(position).addTo(leafletMap.current);

        // Force resize after a short delay
        setTimeout(() => {
            leafletMap.current?.invalidateSize();
        }, 300);

        return () => {
            leafletMap.current?.remove();
            leafletMap.current = null;
        };
    }, []);

    return <div ref={mapRef} className="h-full w-full" />;
}

export default function Show({ location }: Props) {
    const { currentTenant } = usePage<PageProps>().props;

    const navigateToMap = (provider: 'google' | 'waze') => {
        if (!location.latitude || !location.longitude) return;
        const url = provider === 'google'
            ? `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`
            : `https://waze.com/ul?ll=${location.latitude},${location.longitude}&navigate=yes`;
        window.open(url, '_blank');
    };

    return (
        <AdminLayout title={`Sede: ${location.name}`}>
            <Head title={`Sede: ${location.name}`} />

            <div className="flex flex-col gap-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <Link
                            href={route('tenant.locations.index', currentTenant?.slug)}
                            className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" /> Volver a sedes
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black tracking-tight">{location.name}</h1>
                            {location.is_main && (
                                <Badge className="bg-blue-100 text-blue-700 border-blue-200">Sede Principal</Badge>
                            )}
                            {!location.is_active && (
                                <Badge variant="destructive">Inactiva</Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <MapPin className="size-4" /> {location.address}, {location.city}, {location.state}
                        </p>
                    </div>
                    <Link href={route('tenant.locations.edit', [currentTenant?.slug, location.id])}>
                        <Button className="font-bold">
                            <Edit className="mr-2 size-4" /> Editar Información
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Quick Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card className="border-none bg-primary/5 shadow-none">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                        <Info className="size-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider font-bold text-primary/60">Encargado</p>
                                        <p className="font-bold text-lg">{location.manager || 'No asignado'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-none bg-green-50 shadow-none">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="bg-green-100 p-3 rounded-xl text-green-600">
                                        <MessageCircle className="size-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider font-bold text-green-600/60">WhatsApp Directo</p>
                                        <p className="font-bold text-lg">{location.whatsapp || 'No configurado'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Description Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CheckCircle2 className="size-5 text-primary" /> Detalles de la Sede
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {location.description || 'Sin descripción adicional para esta sede.'}
                                    </p>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    <div className="space-y-3">
                                        <h4 className="font-bold text-sm text-slate-500 uppercase tracking-widest">Información de contacto</h4>
                                        <div className="space-y-2">
                                            {location.phone && <div className="flex items-center gap-2 text-sm"><Smartphone className="size-4 text-slate-400" /> {location.phone}</div>}
                                            {location.whatsapp && <div className="flex items-center gap-2 text-sm"><MessageCircle className="size-4 text-green-500" /> {location.whatsapp}</div>}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="font-bold text-sm text-slate-500 uppercase tracking-widest">Redes Sociales</h4>
                                        <div className="space-y-2">
                                            {location.social_networks?.instagram && <div className="flex items-center gap-2 text-sm"><Globe className="size-4 text-pink-500" /> Instagram: {location.social_networks.instagram}</div>}
                                            {location.social_networks?.facebook && <div className="flex items-center gap-2 text-sm"><Globe className="size-4 text-blue-600" /> Facebook: {location.social_networks.facebook}</div>}
                                            {location.social_networks?.tiktok && <div className="flex items-center gap-2 text-sm"><Globe className="size-4 text-slate-800" /> TikTok: {location.social_networks.tiktok}</div>}
                                            {!location.social_networks?.instagram && !location.social_networks?.facebook && !location.social_networks?.tiktok && (
                                                <p className="text-xs text-muted-foreground italic">No configuradas</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Map Card */}
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-slate-50/50">
                                <CardTitle className="text-lg flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Navigation className="size-5 text-primary" /> Geocalización Exacta
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => navigateToMap('google')} className="gap-2 h-8 text-xs font-bold">
                                            Google Maps
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => navigateToMap('waze')} className="gap-2 h-8 text-xs font-bold">
                                            Waze
                                        </Button>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 h-[350px]">
                                {location.latitude && location.longitude ? (
                                    <ManualMap position={[location.latitude, location.longitude]} zoom={15} />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-slate-50 text-muted-foreground italic">
                                        Coordenadas no configuradas.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info Column */}
                    <div className="space-y-6">
                        {/* Hours Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="size-5 text-primary" /> Horarios de Atención
                                </CardTitle>
                                <CardDescription>Rangos configurados para esta sede.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 px-6 pb-6">
                                <div className="space-y-3">
                                    {DAYS.map((day) => (
                                        <div key={day.key} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                            <span className="text-sm font-bold text-slate-600">{day.label}</span>
                                            <div className="text-right">
                                                {(location.opening_hours?.[day.key] ?? []).length > 0 ? (
                                                    (location.opening_hours?.[day.key] ?? []).map((slot, idx) => (
                                                        <div key={idx} className="text-xs font-medium text-slate-800">
                                                            {slot.open} - {slot.close}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-200">Cerrado</Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions/Stats Placeholder */}
                        <Card className="border-primary/20 bg-primary/2 px-2 py-4 flex flex-col items-center justify-center text-center gap-2">
                            <Calendar className="size-10 text-primary opacity-20" />
                            <p className="text-sm font-bold text-primary/40 leading-tight">Módulo de Reservas y Disponibilidad próximamente.</p>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
