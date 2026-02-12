import React, { useState, useEffect, useCallback } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';
import {
    Clock,
    CheckCircle2,
    AlertCircle,
    ChefHat,
    Timer,
    UtensilsCrossed,
    Users,
    Table as TableIcon,
    Bell,
    ArrowLeft,
    LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import axios from 'axios';
import { Tenant } from '@/types/pos';

import { KitchenOrder, KitchenOrderCard } from './Components/KitchenOrderCard';

interface Props extends PageProps {
    orders: KitchenOrder[];
    tenant: Tenant;
    currentLocationId: number | null;
}

export default function KitchenIndex({ orders: initialOrders, tenant, currentLocationId }: Props) {
    const [orders, setOrders] = useState<KitchenOrder[]>(initialOrders);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize Audio for notifications
        audioRef.current = new Audio('/sounds/notification.mp3'); // We should ensure this file exists or use a cdn
    }, []);

    const playNotification = () => {
        audioRef.current?.play().catch(() => { });
    };

    const handleMarkAsReady = async (id: number) => {
        try {
            const response = await axios.post(route('tenant.admin.kitchen.ready', { tenant: tenant.slug, order: id }), {
                status: 'ready'
            });
            if (response.data.success) {
                setOrders(prev => prev.filter(o => o.id !== id));
                toast.success('Pedido despachado');
            }
        } catch (error) {
            toast.error('Error al despachar pedido');
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Echo && tenant.id) {
            const channelName = currentLocationId
                ? `tenant.${tenant.id}.location.${currentLocationId}.kitchen`
                : `tenant.${tenant.id}.kitchen`;

            console.log('Listening for kitchen events on channel: ', channelName);

            try {
                window.Echo.channel(channelName)
                    .listen('.order.sent', (data: KitchenOrder) => {
                        console.log('New order received in kitchen:', data);
                        setOrders(prev => {
                            const index = prev.findIndex(o => o.id === data.id);
                            if (index !== -1) {
                                // Update existing order with new items/data
                                const updatedOrders = [...prev];
                                updatedOrders[index] = data;
                                return updatedOrders;
                            }
                            return [...prev, data];
                        });
                        playNotification();
                        toast.info(`Nuevo pedido: ${data.ticket_number}`, {
                            description: `Servicio: ${data.service_type}`,
                            icon: <Bell className="w-4 h-4 text-blue-500" />
                        });
                    });
            } catch (error) {
                console.error("Error subscribing to Echo channel:", error);
            }

            return () => {
                try {
                    window.Echo.leave(channelName);
                } catch (error) {
                    console.error("Error leaving Echo channel:", error);
                }
            };
        }
    }, [tenant.id, currentLocationId]);

    return (
        <AdminLayout
            hideSidebar
            hideNavbar
            hideFooter
            maxwidth="w-full h-screen"
        >
            <Head title="Monitor de Cocina" />

            <div className="flex flex-col h-screen bg-slate-900 overflow-hidden">
                {/* Header KDS */}
                <header className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-white hover:bg-slate-700 rounded-full"
                            asChild
                        >
                            <Link href={route('tenant.dashboard', { tenant: tenant.slug })}>
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                        </Button>

                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <ChefHat className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-tight">MONITOR DE COCINA</h1>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Panel de Control de Comandas</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-100" />
                                <span className="text-[10px] text-slate-300 font-bold uppercase">A tiempo</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                <span className="text-[10px] text-slate-300 font-bold uppercase">Retraso</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="text-[10px] text-slate-300 font-bold uppercase">Urgente</span>
                            </div>
                        </div>

                        <div className="h-10 w-px bg-slate-700 mx-2" />

                        <div className="text-right">
                            <div className="text-2xl font-mono font-bold text-blue-400 leading-none">
                                {orders.length}
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Activos</span>
                        </div>
                    </div>
                </header>

                {/* Grid Monitor */}
                <main className="flex-1 p-4 overflow-hidden relative">
                    {orders.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                            <UtensilsCrossed className="w-24 h-24 mb-4 opacity-10" />
                            <h2 className="text-2xl font-bold opacity-20">COCINA SIN COMANDAS</h2>
                            <p className="text-slate-700 opacity-20">Esperando nuevos pedidos...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 h-full content-start overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {orders.map((order) => (
                                    <KitchenOrderCard
                                        key={order.id}
                                        order={order}
                                        onReady={handleMarkAsReady}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </main>

                <footer className="bg-slate-800/50 p-2 shrink-0 border-t border-slate-700">
                    <div className="flex justify-center items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                        <span>Pusher Connected</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="opacity-50">|</span>
                        <span>Auto-Refresh FIFO v1.0</span>
                    </div>
                </footer>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(30, 41, 59, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            `}</style>
        </AdminLayout>
    );
}
