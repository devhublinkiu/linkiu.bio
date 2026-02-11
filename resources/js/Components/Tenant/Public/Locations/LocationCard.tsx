import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import {
    MapPin,
    Phone,
    MessageCircle,
    Clock,
    Navigation,
    Star,
    ExternalLink,
    Instagram,
    Facebook,
    Video,
    X,
    Map as MapIcon
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import LocationMap from './LocationMap'; // Import the new component

interface Location {
    id: number;
    name: string;
    description: string | null;
    is_main: boolean;
    phone: string | null;
    whatsapp: string | null;
    whatsapp_message: string | null;
    state: string | null;
    city: string | null;
    address: string | null;
    latitude: number;
    longitude: number;
    opening_hours: {
        [key: string]: Array<{ open: string; close: string }>;
    };
    social_networks?: {
        facebook?: string;
        instagram?: string;
        tiktok?: string;
    };
    is_active: boolean;
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

export default function LocationCard({ location }: { location: Location }) {
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

    // Deep links
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    const wazeUrl = `https://waze.com/ul?ll=${location.latitude},${location.longitude}&navigate=yes`;
    const whatsappUrl = location.whatsapp
        ? `https://wa.me/${location.whatsapp.replace(/\D/g, '')}${location.whatsapp_message ? `?text=${encodeURIComponent(location.whatsapp_message)}` : ''}`
        : null;
    const phoneUrl = location.phone ? `tel:${location.phone}` : null;

    return (
        <Card className="overflow-hidden border border-slate-200 shadow-lg rounded-[2rem] bg-white relative group">
            {/* Visual Header: Static Map */}
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
                        onClick={() => setShowHours(true)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-colors ${currentStatus.color.includes('green') ? 'bg-green-50 text-green-700 border-green-100' : currentStatus.color.includes('red') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}
                    >
                        <Clock className="size-3.5" />
                        {currentStatus.isOpen ? 'Abierto' : 'Cerrado'}
                        <span className="opacity-60 font-normal">| Ver Horarios</span>
                    </button>
                </div>

                <div className="space-y-1 mb-5">
                    <h3 className="font-black text-2xl text-slate-900 tracking-tight">{location.name}</h3>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">{location.address}, {location.city}</p>
                    {location.description && <p className="text-xs text-slate-400">{location.description}</p>}
                </div>

                {/* Social Networks Row */}
                {location.social_networks && Object.values(location.social_networks).some(Boolean) && (
                    <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide">
                        {location.social_networks.instagram && (
                            <a href={location.social_networks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors">
                                <Instagram className="size-5" />
                            </a>
                        )}
                        {location.social_networks.facebook && (
                            <a href={location.social_networks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                                <Facebook className="size-5" />
                            </a>
                        )}
                        {location.social_networks.tiktok && (
                            <a href={location.social_networks.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors">
                                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                            </a>
                        )}
                    </div>
                )}

                {/* Main Actions Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                    <Button
                        variant="default"
                        onClick={() => window.open(googleMapsUrl, '_blank')}
                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 shadow-md shadow-slate-200"
                    >
                        <MapIcon className="size-4 mr-2" /> Google Maps
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.open(wazeUrl, '_blank')}
                        className="border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl h-12"
                    >
                        <Navigation className="size-4 mr-2 text-cyan-500" /> Waze
                    </Button>
                    {whatsappUrl && (
                        <Button
                            onClick={() => window.open(whatsappUrl, '_blank')}
                            className="col-span-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl h-11 font-bold shadow-md shadow-green-100"
                        >
                            <MessageCircle className="size-5 mr-2" /> Escribir por WhatsApp
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
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-x-4 top-[20%] max-w-sm mx-auto bg-white rounded-[2rem] z-[10000] overflow-hidden shadow-2xl"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="font-black text-xl text-slate-900">Horarios de Atención</h3>
                                        <p className="text-xs text-slate-500">{location.name}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowHours(false)}
                                        className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                                    >
                                        <X className="size-5 text-slate-600" />
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
