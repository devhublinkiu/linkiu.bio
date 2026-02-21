import React, { useState, useEffect, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { PageProps } from '@/types';
import { getEcho } from '@/echo';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import {
    ChefHat,
    UtensilsCrossed,
    Bell,
    ArrowLeft,
    Wifi,
    WifiOff,
    RefreshCw,
    Filter,
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';
import { Tenant, Location, KitchenOrder, EchoInstance, EchoChannel } from '@/types/pos';
import { KitchenOrderCard } from './Components/KitchenOrderCard';

interface Props extends PageProps {
    orders: KitchenOrder[];
    tenant: Tenant;
    currentLocationId: number | null;
    locations: Location[];
}

export default function KitchenIndex({ orders: initialOrders, tenant, currentLocationId, locations = [] }: Props) {
    const [orders, setOrders] = useState<KitchenOrder[]>(initialOrders);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [isEchoConnected, setIsEchoConnected] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [locationId, setLocationId] = useState<number | null>(currentLocationId);

    // Confirmación para despachar
    const [confirmAction, setConfirmAction] = useState<{ id: number; action: 'ready' | 'preparing' } | null>(null);

    const playNotification = useCallback(() => {
        try {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            const ctx = new AudioCtx();
            // Sonido tipo "ding-dong-ding" llamativo para cocina
            const notes = [830, 1046, 1318]; // Do5, Mi5, Sol5 (acorde mayor ascendente)
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.4, ctx.currentTime + i * 0.18);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.18 + 0.3);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + i * 0.18);
                osc.stop(ctx.currentTime + i * 0.18 + 0.3);
            });
        } catch {
            // Audio no disponible — fallback visual
            toast.info('🔔 Nuevo pedido recibido', { icon: <Bell className="w-4 h-4 text-blue-500" /> });
        }
    }, []);

    // --- API Actions ---

    const updateOrderStatus = useCallback(async (id: number, status: 'ready' | 'preparing') => {
        setProcessingId(id);
        try {
            const response = await axios.post(route('tenant.admin.kitchen.ready', { tenant: tenant.slug, order: id }), { status });
            if (response.data.success) {
                if (status === 'ready') {
                    setOrders(prev => prev.filter(o => o.id !== id));
                    toast.success('Pedido despachado');
                } else {
                    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'preparing' } : o));
                    toast.success('Pedido marcado como preparando');
                }
            }
        } catch (error) {
            toast.error('Error al actualizar pedido');
        } finally {
            setProcessingId(null);
            setConfirmAction(null);
        }
    }, [tenant.slug]);

    const handleReady = (id: number) => {
        setConfirmAction({ id, action: 'ready' });
    };

    const handlePreparing = (id: number) => {
        updateOrderStatus(id, 'preparing');
    };

    const confirmActionExecute = () => {
        if (!confirmAction) return;
        updateOrderStatus(confirmAction.id, confirmAction.action);
    };

    // --- Real-time Echo ---

    useEffect(() => {
        const echoInstance = getEcho() as EchoInstance | undefined;

        if (!echoInstance?.connector || !tenant.id) {
            setIsEchoConnected(false);
            return;
        }

        setIsEchoConnected(true);

        const channelName = locationId
            ? `tenant.${tenant.id}.location.${locationId}.kitchen`
            : `tenant.${tenant.id}.kitchen`;

        let channel: EchoChannel | null = null;

        try {
            channel = echoInstance.channel(channelName)
                .listen('.order.sent', (data: Record<string, unknown>) => {
                    const orderData = data as unknown as KitchenOrder;
                    setOrders(prev => {
                        const index = prev.findIndex(o => o.id === orderData.id);
                        if (index !== -1) {
                            const updated = [...prev];
                            updated[index] = orderData;
                            return updated;
                        }
                        return [...prev, orderData];
                    });
                    playNotification();
                    toast.info(`Nuevo pedido: ${orderData.ticket_number}`, {
                        description: `${orderData.service_type === 'dine_in' ? orderData.table?.name || 'Mesa' : 'Para llevar'}`,
                        icon: <Bell className="w-4 h-4 text-blue-500" />,
                    });
                });
        } catch (error) {
            console.error('Error subscribing to Echo channel:', error);
            setIsEchoConnected(false);
        }

        return () => {
            try {
                echoInstance.leave(channelName);
            } catch {
                // Silently ignore leave errors
            }
        };
    }, [tenant.id, locationId, playNotification]);

    // --- Polling Fallback (cada 30s si Echo no está conectado) ---

    useEffect(() => {
        if (isEchoConnected) return;

        const poll = async () => {
            try {
                const params: Record<string, string> = {};
                if (locationId) params.location_id = String(locationId);
                if (statusFilter !== 'all') params.status = statusFilter;

                const response = await axios.get(route('tenant.admin.kitchen.orders', { tenant: tenant.slug }), { params });
                setOrders(response.data);
            } catch {
                // Silently fail polling
            }
        };

        const interval = setInterval(poll, 30000);
        return () => clearInterval(interval);
    }, [isEchoConnected, tenant.slug, locationId, statusFilter]);

    // --- Manual refresh ---

    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleManualRefresh = async () => {
        setIsRefreshing(true);
        try {
            const params: Record<string, string> = {};
            if (locationId) params.location_id = String(locationId);

            const response = await axios.get(route('tenant.admin.kitchen.orders', { tenant: tenant.slug }), { params });
            setOrders(response.data);
            toast.success('Comandas actualizadas');
        } catch {
            toast.error('Error al refrescar');
        } finally {
            setIsRefreshing(false);
        }
    };

    // --- Location change ---
    const handleLocationChange = (val: string) => {
        const newLocId = val === 'all' ? null : Number(val);
        setLocationId(newLocId);
        // Reload via route
        window.location.href = route('tenant.admin.kitchen.index', {
            tenant: tenant.slug,
            ...(newLocId ? { location_id: newLocId } : {}),
        });
    };

    // --- Filtered orders ---
    const filteredOrders = statusFilter === 'all'
        ? orders
        : orders.filter(o => o.status === statusFilter);

    const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
    const preparingCount = orders.filter(o => o.status === 'preparing').length;

    return (
        <AdminLayout hideSidebar hideNavbar hideFooter maxwidth="w-full h-screen">
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

                    <div className="flex items-center gap-4">
                        {/* Location Selector */}
                        {locations.length > 1 && (
                            <Select value={locationId ? String(locationId) : 'all'} onValueChange={handleLocationChange}>
                                <SelectTrigger className="w-[160px] h-9 bg-slate-700 border-slate-600 text-white text-xs">
                                    <SelectValue placeholder="Todas las sedes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las sedes</SelectItem>
                                    {locations.map(loc => (
                                        <SelectItem key={loc.id} value={String(loc.id)}>{loc.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {/* Status Filter */}
                        <div className="flex items-center gap-1 bg-slate-700/50 rounded-lg p-1">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors ${statusFilter === 'all' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                Todos ({orders.length})
                            </button>
                            <button
                                onClick={() => setStatusFilter('confirmed')}
                                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors ${statusFilter === 'confirmed' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-white'}`}
                            >
                                Nuevos ({confirmedCount})
                            </button>
                            <button
                                onClick={() => setStatusFilter('preparing')}
                                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors ${statusFilter === 'preparing' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                Preparando ({preparingCount})
                            </button>
                        </div>

                        <div className="h-10 w-px bg-slate-700 mx-1" />

                        {/* Manual Refresh */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-white hover:bg-slate-700"
                            onClick={handleManualRefresh}
                            disabled={isRefreshing}
                        >
                            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </Button>

                        {/* Urgency Legend */}
                        <div className="hidden lg:flex gap-4">
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

                        <div className="h-10 w-px bg-slate-700 mx-1" />

                        <div className="text-right">
                            <div className="text-2xl font-mono font-bold text-blue-400 leading-none">
                                {filteredOrders.length}
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Activos</span>
                        </div>
                    </div>
                </header>

                {/* Grid Monitor */}
                <main className="flex-1 p-4 overflow-hidden relative">
                    {filteredOrders.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                            <UtensilsCrossed className="w-24 h-24 mb-4 opacity-10" />
                            <h2 className="text-2xl font-bold opacity-20">
                                {statusFilter !== 'all' ? 'SIN COMANDAS EN ESTE FILTRO' : 'COCINA SIN COMANDAS'}
                            </h2>
                            <p className="text-slate-700 opacity-20">Esperando nuevos pedidos...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 h-full content-start overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {filteredOrders.map((order) => (
                                    <KitchenOrderCard
                                        key={order.id}
                                        order={order}
                                        onReady={handleReady}
                                        onPreparing={handlePreparing}
                                        processingId={processingId}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </main>

                {/* Footer con estado de conexión real */}
                <footer className="bg-slate-800/50 p-2 shrink-0 border-t border-slate-700">
                    <div className="flex justify-center items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                        {isEchoConnected ? (
                            <>
                                <Wifi className="w-3.5 h-3.5 text-green-500" />
                                <span className="text-green-400">Tiempo Real Conectado</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-amber-400">Modo Polling (30s)</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            </>
                        )}
                        <span className="opacity-50">|</span>
                        <span>KDS v2.0</span>
                    </div>
                </footer>
            </div>

            {/* Confirmación Despachar */}
            <AlertDialog open={!!confirmAction} onOpenChange={(open) => { if (!open) setConfirmAction(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Despachar pedido?</AlertDialogTitle>
                        <AlertDialogDescription>
                            El pedido será marcado como <strong className="text-green-600">Listo</strong> y notificado al POS. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmActionExecute}
                            className="bg-green-600 text-white hover:bg-green-700"
                        >
                            Sí, Despachar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
