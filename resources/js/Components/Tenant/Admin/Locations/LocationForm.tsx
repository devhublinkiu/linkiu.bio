import React, { useEffect, useState, useMemo } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Badge } from '@/Components/ui/badge';
import { cn } from "@/lib/utils";
import {
    MapPin,
    Smartphone,
    Clock,
    Globe,
    Save,
    X,
    Plus,
    Trash2,
    Info,
    MessageCircle,
    Navigation,
    Calendar,
    Search,
    Eye,
    Copy
} from 'lucide-react';
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
    opening_hours: any | null;
    social_networks: any | null;
    is_active: boolean;
}

interface Props {
    location: Location | null;
    onSuccess: () => void;
    onCancel: () => void;
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

function ManualMap({ position, setPosition, zoom = 13 }: { position: [number, number], setPosition?: (pos: [number, number]) => void, zoom?: number }) {
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

        if (setPosition) {
            leafletMap.current.on('click', (e) => {
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]);
            });
        }

        // Force resize after a short delay to fix rendering in hidden tabs
        setTimeout(() => {
            leafletMap.current?.invalidateSize();
        }, 300);

        return () => {
            leafletMap.current?.remove();
            leafletMap.current = null;
        };
    }, []);

    React.useEffect(() => {
        if (leafletMap.current && markerRef.current) {
            markerRef.current.setLatLng(position);
            // Use flyTo for a smoother experience when geocoding
            leafletMap.current.flyTo(position, leafletMap.current.getZoom());
        }
    }, [position]);

    return <div ref={mapRef} className="h-full w-full" />;
}

export default function LocationForm({ location, onSuccess, onCancel }: Props) {
    const { currentTenant } = usePage<PageProps>().props;
    const [mapPosition, setMapPosition] = useState<[number, number]>(
        location?.latitude && location?.longitude
            ? [Number(location.latitude), Number(location.longitude)]
            : [4.6097, -74.0817] // Default Bogota
    );

    const [isSearching, setIsSearching] = useState(false);

    const { data, setData, post, patch, processing, errors, transform } = useForm({
        name: location?.name || '',
        manager: location?.manager || '',
        description: location?.description || '',
        is_main: location?.is_main || false,
        phone: location?.phone || '',
        whatsapp: location?.whatsapp || '',
        whatsapp_message: location?.whatsapp_message || '',
        state: location?.state || '',
        city: location?.city || '',
        address: location?.address || '',
        latitude: location?.latitude || 4.6097,
        longitude: location?.longitude || -74.0817,
        opening_hours: location?.opening_hours || {
            monday: [{ open: '08:00', close: '18:00' }],
            tuesday: [{ open: '08:00', close: '18:00' }],
            wednesday: [{ open: '08:00', close: '18:00' }],
            thursday: [{ open: '08:00', close: '18:00' }],
            friday: [{ open: '08:00', close: '18:00' }],
            saturday: [{ open: '08:00', close: '14:00' }],
            sunday: [],
        },
        social_networks: location?.social_networks || {
            facebook: '',
            instagram: '',
            tiktok: '',
        },
        is_active: location?.is_active ?? true,
    });

    useEffect(() => {
        setData(d => ({
            ...d,
            latitude: mapPosition[0],
            longitude: mapPosition[1]
        }));
    }, [mapPosition]);

    const searchAddress = async () => {
        if (!data.address || !data.city) return;
        setIsSearching(true);

        const query = `${data.address}, ${data.city}, ${data.state}, Colombia`;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
                {
                    headers: {
                        'User-Agent': 'LinkiuApp/1.0'
                    }
                }
            );
            const results = await response.json();

            if (results && results.length > 0) {
                const { lat, lon } = results[0];
                const newPos: [number, number] = [parseFloat(lat), parseFloat(lon)];
                setMapPosition(newPos);
            }
        } catch (error) {
            // Silent catch
        } finally {
            setIsSearching(false);
        }
    };

    // Auto-search address when fields change (with debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (data.address && data.city) {
                searchAddress();
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [data.address, data.city, data.state]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (location) {
            patch(route('tenant.locations.update', [currentTenant?.slug, location.id]), {
                onSuccess: () => {
                    toast.success('Sede actualizada');
                    onSuccess();
                }
            });
        } else {
            post(route('tenant.locations.store', currentTenant?.slug), {
                onSuccess: () => {
                    toast.success('Sede creada');
                    onSuccess();
                }
            });
        }
    };

    const addTimeSlot = (day: string) => {
        const hours = { ...data.opening_hours };
        if (!hours[day]) hours[day] = [];
        hours[day].push({ open: '08:00', close: '18:00' });
        setData('opening_hours', hours);
    };

    const removeTimeSlot = (day: string, index: number) => {
        const hours = { ...data.opening_hours };
        hours[day].splice(index, 1);
        setData('opening_hours', hours);
    };

    const updateTimeSlot = (day: string, index: number, field: 'open' | 'close', value: string) => {
        const hours = { ...data.opening_hours };
        hours[day][index][field] = value;
        setData('opening_hours', hours);
    };

    const replicateToAllDays = () => {
        const mondayHours = data.opening_hours.monday || [];
        const hours = { ...data.opening_hours };

        DAYS.forEach(day => {
            if (day.key !== 'monday') {
                hours[day.key] = JSON.parse(JSON.stringify(mondayHours));
            }
        });

        setData('opening_hours', hours);
        toast.success('Horarios replicados a todos los días');
    };

    return (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1">
                <div className="p-6">
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-8">
                            <TabsTrigger value="general" className="gap-2">
                                <Info className="size-4" /> General
                            </TabsTrigger>
                            <TabsTrigger value="contact" className="gap-2">
                                <Smartphone className="size-4" /> Contacto
                            </TabsTrigger>
                            <TabsTrigger value="location" className="gap-2">
                                <MapPin className="size-4" /> Ubicación
                            </TabsTrigger>
                            <TabsTrigger value="hours" className="gap-2">
                                <Clock className="size-4" /> Horarios
                            </TabsTrigger>
                        </TabsList>

                        {/* TAB: GENERAL */}
                        <TabsContent value="general" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="font-bold">Nombre de la Sede</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Ej: Sede Norte / Principal / Local 101"
                                        className="h-11"
                                        required
                                    />
                                    {errors.name && <p className="text-xs font-bold text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="manager" className="font-bold">Encargado</Label>
                                    <Input
                                        id="manager"
                                        value={data.manager || ''}
                                        onChange={e => setData('manager', e.target.value)}
                                        placeholder="Nombre de la persona responsable"
                                        className="h-11"
                                    />
                                    {errors.manager && <p className="text-xs font-bold text-red-500">{errors.manager}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="font-bold">Descripción Corta</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description || ''}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Breve detalle de la sede..."
                                        className="min-h-[80px]"
                                    />
                                    {errors.description && <p className="text-xs font-bold text-red-500">{errors.description}</p>}
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-bold">¿Es la sede principal?</Label>
                                        <p className="text-xs text-muted-foreground">Solo puede haber una sede principal.</p>
                                    </div>
                                    <Switch
                                        checked={data.is_main}
                                        onCheckedChange={val => setData('is_main', val)}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB: CONTACTO */}
                        <TabsContent value="contact" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="font-bold">Teléfono Fijo/Celular</Label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-3 top-3 size-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            value={data.phone || ''}
                                            onChange={e => setData('phone', e.target.value)}
                                            className="pl-10 h-11"
                                            placeholder="+57..."
                                        />
                                    </div>
                                    {errors.phone && <p className="text-xs font-bold text-red-500">{errors.phone}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp" className="font-bold">WhatsApp Operativo</Label>
                                    <div className="relative">
                                        <MessageCircle className="absolute left-3 top-3 size-4 text-green-600" />
                                        <Input
                                            id="whatsapp"
                                            value={data.whatsapp || ''}
                                            onChange={e => setData('whatsapp', e.target.value)}
                                            className="pl-10 h-11"
                                            placeholder="+57..."
                                        />
                                    </div>
                                    {errors.whatsapp && <p className="text-xs font-bold text-red-500">{errors.whatsapp}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="wa_message" className="font-bold text-xs uppercase tracking-wider text-slate-500">Mensaje predeterminado de WhatsApp</Label>
                                <Textarea
                                    id="wa_message"
                                    value={data.whatsapp_message || ''}
                                    onChange={e => setData('whatsapp_message', e.target.value)}
                                    placeholder="Ej: Hola, quiero contactar con la sede norte..."
                                    className="min-h-[60px]"
                                />
                                <p className="text-[10px] text-muted-foreground italic">Este mensaje aparecerá cuando el cliente haga clic en el botón de WhatsApp.</p>
                            </div>

                            <Separator className="my-4" />

                            <div className="grid gap-4">
                                <Label className="font-bold flex items-center gap-2"><Globe className="size-4 text-primary" /> Redes Sociales (Opcional)</Label>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="w-20 justify-center">Facebook</Badge>
                                        <Input
                                            value={data.social_networks.facebook}
                                            onChange={e => setData('social_networks', { ...data.social_networks, facebook: e.target.value })}
                                            placeholder="URL perfil..."
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="w-20 justify-center">Instagram</Badge>
                                        <Input
                                            value={data.social_networks.instagram}
                                            onChange={e => setData('social_networks', { ...data.social_networks, instagram: e.target.value })}
                                            placeholder="@usuario..."
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="w-20 justify-center">TikTok</Badge>
                                        <Input
                                            value={data.social_networks.tiktok}
                                            onChange={e => setData('social_networks', { ...data.social_networks, tiktok: e.target.value })}
                                            placeholder="@usuario..."
                                            className="h-9"
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB: UBICACIÓN */}
                        <TabsContent value="location" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold">Departamento / Estado</Label>
                                    <Input value={data.state || ''} onChange={e => setData('state', e.target.value)} placeholder="Ej: Antioquia" className="h-11" />
                                    {errors.state && <p className="text-xs font-bold text-red-500">{errors.state}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">Ciudad / Municipio</Label>
                                    <Input value={data.city || ''} onChange={e => setData('city', e.target.value)} placeholder="Ej: Medellín" className="h-11" />
                                    {errors.city && <p className="text-xs font-bold text-red-500">{errors.city}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-bold">Dirección Completa</Label>
                                <div className="flex gap-2">
                                    <Input value={data.address || ''} onChange={e => setData('address', e.target.value)} placeholder="Ej: Calle 10 # 43 - 50..." className="h-11 flex-1" />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={searchAddress}
                                        disabled={isSearching || !data.address}
                                        className="h-11 px-3 border-dashed hover:border-primary hover:text-primary transition-all"
                                        title="Buscar en el mapa"
                                    >
                                        <Search className={cn("size-4", isSearching && "animate-spin")} />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-bold flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span>Puntero en el Mapa</span>
                                        {isSearching && (
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-600 animate-pulse border-blue-100 py-0 h-5 text-[10px]">
                                                Buscando ubicación...
                                            </Badge>
                                        )}
                                    </div>
                                    <Badge variant="secondary" className="font-normal text-[10px]">Lat: {data.latitude?.toFixed(4)} Lng: {data.longitude?.toFixed(4)}</Badge>
                                </Label>
                                <div className="h-[250px] w-full rounded-xl overflow-hidden border shadow-inner bg-slate-50">
                                    <ManualMap position={mapPosition} setPosition={setMapPosition} />
                                </div>
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Info className="size-3" /> Haz clic en el mapa para ajustar la ubicación exacta para Waze y Google Maps.
                                </p>
                            </div>
                        </TabsContent>

                        {/* TAB: HORARIOS */}
                        <TabsContent value="hours" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3 mb-4">
                                <Calendar className="size-5 text-primary mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-800">Horarios de Atención</h4>
                                    <p className="text-[11px] text-slate-500">Configura los rangos de apertura. Si un día no tiene rangos, aparecerá como "Cerrado".</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={replicateToAllDays}
                                    className="h-8 text-xs font-bold gap-1.5 border-dashed hover:border-primary hover:text-primary"
                                    title="Copiar horario de Lunes a todos los días"
                                >
                                    <Copy className="size-3.5" />
                                    Replicar Lunes
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {DAYS.map((day) => (
                                    <div key={day.key} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="font-bold text-sm min-w-[80px]">{day.label}</Label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs text-primary hover:bg-primary/5 font-bold"
                                                onClick={() => addTimeSlot(day.key)}
                                            >
                                                <Plus className="size-3 mr-1" /> Añadir Rango
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            {data.opening_hours[day.key]?.map((slot: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                                    <Input
                                                        type="time"
                                                        value={slot.open}
                                                        onChange={e => updateTimeSlot(day.key, idx, 'open', e.target.value)}
                                                        className="h-9 w-[120px] text-xs"
                                                    />
                                                    <span className="text-xs text-muted-foreground">a</span>
                                                    <Input
                                                        type="time"
                                                        value={slot.close}
                                                        onChange={e => updateTimeSlot(day.key, idx, 'close', e.target.value)}
                                                        className="h-9 w-[120px] text-xs"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => removeTimeSlot(day.key, idx)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {(!data.opening_hours[day.key] || data.opening_hours[day.key].length === 0) && (
                                                <p className="text-[10px] text-muted-foreground italic pl-1">Cerrado</p>
                                            )}
                                        </div>
                                        <Separator className="mt-2 opacity-50" />
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </ScrollArea>

            <div className="p-6 border-t bg-slate-50/50 flex justify-between items-center gap-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    className="font-bold text-slate-600 cursor-pointer"
                >
                    <X className="mr-2 size-4" /> Cancelar
                </Button>
                <Button
                    type="submit"
                    disabled={processing}
                    className="px-10 h-11 font-bold cursor-pointer"
                >
                    <Save className="mr-2 size-4" />
                    {location ? 'Guardar Cambios' : 'Crear Sede'}
                </Button>
            </div>
        </form >
    );
}
