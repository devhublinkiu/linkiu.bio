import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import {
    MapPin,
    MessageCircle,
    Clock,
    Navigation,
    Star,
    Instagram,
    Facebook,
    X,
    Map as MapIcon
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PublicLocation } from '@/types/location';
import LocationMap from './LocationMap';

export interface LocationCardProps {
    location: PublicLocation;
    /** Es la sede actualmente seleccionada por el usuario */
    isCurrentSede?: boolean;
    /** Si hay 2+ sedes y no es la actual: callback para "Quiero entrar en esta sede" */
    onEnterSede?: (locationId: number) => void;
}

const DAYS_MAP: { [key: number]: string } = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
};

const DAY_LABELS: { [key: string]: string } = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
};

const ORDERED_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function formatAddress(address: string | null, city: string | null): string {
    return [address, city].filter(Boolean).join(', ') || 'Ubicación sin dirección';
}

export default function LocationCard({ location, isCurrentSede = false, onEnterSede }: LocationCardProps) {
    const [showHours, setShowHours] = useState(false);

    // Get current day and time
    const currentStatus = useMemo(() => {
        const now = new Date();
        const dayKey = DAYS_MAP[now.getDay()];
        const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight

        const todayHours = location.opening_hours[dayKey] || [];

        if (todayHours.length === 0) {
            return { isOpen: false, message: 'Cerrado hoy', color: 'bg-red-100 text-red-700' };
        }

        for (const slot of todayHours) {
            const [openH, openM] = slot.open.split(':').map(Number);
            const [closeH, closeM] = slot.close.split(':').map(Number);
            const openTime = openH * 60 + openM;
            const closeTime = closeH * 60 + closeM;

            if (currentTime >= openTime && currentTime < closeTime) {
                return { isOpen: true, message: `Abierto hasta las ${slot.close}`, color: 'bg-green-100 text-green-700 font-bold' };
            }
        }

        // Find next opening time
        const nextSlot = todayHours.find(slot => {
            const [openH, openM] = slot.open.split(':').map(Number);
            const openTime = openH * 60 + openM;
            return currentTime < openTime;
        });

        if (nextSlot) {
            return { isOpen: false, message: `Abre a las ${nextSlot.open}`, color: 'bg-amber-100 text-amber-700' };
        }

        return { isOpen: false, message: 'Cerrado', color: 'bg-red-100 text-red-700' };
    }, [location.opening_hours]);

    const hasValidCoords = location.latitude != null && location.longitude != null && (location.latitude !== 0 || location.longitude !== 0);
    const googleMapsUrl = hasValidCoords ? `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}` : null;
    const wazeUrl = hasValidCoords ? `https://waze.com/ul?ll=${location.latitude},${location.longitude}&navigate=yes` : null;
    const whatsappUrl = location.whatsapp
        ? `https://wa.me/${location.whatsapp.replace(/\D/g, '')}${location.whatsapp_message ? `?text=${encodeURIComponent(location.whatsapp_message)}` : ''}`
        : null;

    return (
        <Card className="overflow-hidden border border-slate-200 shadow-lg rounded-[2rem] bg-white relative group">
            {/* Visual Header: Static Map o placeholder */}
            <div className="h-32 w-full relative z-0">
                <LocationMap latitude={location.latitude} longitude={location.longitude} />

                {/* Gradient overlay for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent z-[400]" />

                {/* Floating Principal Badge */}
                {location.is_main && (
                    <div className="absolute top-3 right-3 z-[400]">
                        <Badge className="bg-amber-500 text-white border-0 px-2.5 py-1 text-[10px] font-bold shadow-md rounded-full flex items-center gap-1">
                            <Star className="size-3 fill-white" />
                            PRINCIPAL
                        </Badge>
                    </div>
                )}
            </div>

            <CardContent className="px-6 pb-6 pt-0 relative z-10 -mt-6">
                {/* Main Info */}
                <div className="flex justify-between items-end mb-4">
                    <div className="bg-white p-1 rounded-2xl shadow-sm inline-block">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <MapPin className="size-6 text-slate-800" />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowHours(true)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-colors ${currentStatus.color.includes('green') ? 'bg-green-50 text-green-700 border-green-100' : currentStatus.color.includes('red') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}
                        aria-label={`Horario: ${currentStatus.isOpen ? 'Abierto' : 'Cerrado'}. Ver horarios de atención`}
                    >
                        <Clock className="size-3.5" aria-hidden />
                        {currentStatus.isOpen ? 'Abierto' : 'Cerrado'}
                        <span className="opacity-60 font-normal">| Ver Horarios</span>
                    </button>
                </div>

                <div className="space-y-1 mb-5">
                    <h3 className="font-black text-2xl text-slate-900 tracking-tight">{location.name}</h3>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">{formatAddress(location.address, location.city)}</p>
                    {location.description && <p className="text-xs text-slate-400">{location.description}</p>}
                </div>

                {/* Social Networks Row */}
                {location.social_networks && Object.values(location.social_networks).some(Boolean) && (
                    <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide" role="list" aria-label="Redes sociales">
                        {location.social_networks.instagram && (
                            <a href={location.social_networks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors" aria-label="Instagram">
                                <Instagram className="size-5" />
                            </a>
                        )}
                        {location.social_networks.facebook && (
                            <a href={location.social_networks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" aria-label="Facebook">
                                <Facebook className="size-5" />
                            </a>
                        )}
                        {location.social_networks.tiktok && (
                            <a href={location.social_networks.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors" aria-label="TikTok">
                                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                            </a>
                        )}
                    </div>
                )}

                {/* Main Actions: una fila de 3 (Maps, Waze, WhatsApp) + fila sede/entrar */}
                <div className="grid grid-cols-3 gap-2.5">
                    <Button
                        variant="default"
                        onClick={() => googleMapsUrl && window.open(googleMapsUrl, '_blank')}
                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 shadow-md shadow-slate-200 text-xs sm:text-sm"
                        aria-label="Abrir en Google Maps"
                        disabled={!googleMapsUrl}
                    >
                        <MapIcon className="size-3 shrink-0" aria-hidden /> <span className="truncate text-xs">Google Maps</span>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => wazeUrl && window.open(wazeUrl, '_blank')}
                        className="border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl h-12 text-xs sm:text-sm"
                        aria-label="Abrir en Waze"
                        disabled={!wazeUrl}
                    >
                        <Navigation className="size-3 text-cyan-500 shrink-0" aria-hidden /> <span className="truncate text-xs">Waze</span>
                    </Button>
                    {whatsappUrl ? (
                        <Button
                            onClick={() => window.open(whatsappUrl, '_blank')}
                            className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl h-12 font-bold shadow-md shadow-green-100 text-xs sm:text-sm"
                            aria-label="Escribir por WhatsApp"
                        >
                            <MessageCircle className="size-3 shrink-0" aria-hidden /> <span className="truncate text-xs">WhatsApp</span>
                        </Button>
                    ) : (
                        <div className="rounded-xl h-12 border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 text-xs">
                            —
                        </div>
                    )}
                    {/* Fila: sede actual o botón entrar (solo cuando hay 2+ sedes) */}
                    {isCurrentSede && (
                        <div className="col-span-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary/10 text-primary border border-primary/20 text-sm font-bold" role="status" aria-live="polite">
                            Te encuentras en esta sede
                        </div>
                    )}
                    {onEnterSede && (
                        <Button
                            onClick={() => onEnterSede(location.id)}
                            className="col-span-3 rounded-xl h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                            aria-label={`Quiero entrar en esta sede: ${location.name}`}
                        >
                            Quiero entrar en esta sede
                        </Button>
                    )}
                </div>
            </CardContent>

            {/* Hours Modal (Custom Backdrop & Modal) */}
            <AnimatePresence>
                {showHours && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowHours(false)}
                            className="fixed inset-0 bg-black/60 z-[9999] backdrop-blur-sm"
                        />
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="hours-modal-title"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-x-4 top-[20%] max-w-sm mx-auto bg-white rounded-[2rem] z-[10000] overflow-hidden shadow-2xl"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 id="hours-modal-title" className="font-black text-xl text-slate-900">Horarios de Atención</h3>
                                        <p className="text-xs text-slate-500">{location.name}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowHours(false)}
                                        className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                                        aria-label="Cerrar horarios"
                                    >
                                        <X className="size-5 text-slate-600" aria-hidden />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {ORDERED_DAYS.map(day => {
                                        const hours = location.opening_hours[day] || [];
                                        const isToday = DAYS_MAP[new Date().getDay()] === day;

                                        return (
                                            <div key={day} className={`flex justify-between items-center pb-2 border-b border-slate-100 last:border-0 ${isToday ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                                                <span className="capitalize">{DAY_LABELS[day]}</span>
                                                <div className="flex flex-col items-end">
                                                    {hours.length > 0 ? (
                                                        hours.map((slot, i) => (
                                                            <span key={i} className={`text-sm ${isToday ? 'bg-green-100 text-green-700 px-2 py-0.5 rounded-md' : ''}`}>
                                                                {slot.open} - {slot.close}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-slate-300 italic">Cerrado</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-6">
                                    <Button onClick={() => setShowHours(false)} className="w-full rounded-xl" variant="default">Entendido</Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </Card>
    );
}
