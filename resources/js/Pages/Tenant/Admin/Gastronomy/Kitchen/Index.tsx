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

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    variant_options?: any[];
}

interface Order {
    id: number;
    ticket_number: string;
    status: string;
    service_type: string;
    customer_name: string;
    table?: { name: string };
    creator?: { name: string };
    created_at: string;
    items: OrderItem[];
}

interface Props extends PageProps {
    orders: Order[];
    tenant: any;
}

const KitchenOrderCard = ({ order, onReady }: { order: Order; onReady: (id: number) => void }) => {
    const [elapsedMinutes, setElapsedMinutes] = useState(0);

    useEffect(() => {
        const calculate = () => {
            const start = new Date(order.created_at).getTime();
            const now = new Date().getTime();
            setElapsedMinutes(Math.floor((now - start) / 60000));
        };

        calculate();
        const interval = setInterval(calculate, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, [order.created_at]);

    const getUrgencyColor = () => {
        if (elapsedMinutes >= 20) return 'border-red-500 bg-red-50/50';
        if (elapsedMinutes >= 10) return 'border-amber-500 bg-amber-50/50';
        return 'border-slate-200 bg-white';
    };

    const getTimeBadgeColor = () => {
        if (elapsedMinutes >= 20) return 'bg-red-500 text-white animate-pulse';
        if (elapsedMinutes >= 10) return 'bg-amber-500 text-white';
        return 'bg-slate-100 text-slate-700';
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 100 }}
            className="h-full"
        >
            <Card className={cn(
                "flex flex-col h-full border-t-4 transition-all duration-300 shadow-sm",
                getUrgencyColor()
            )}>
                <CardHeader className="p-3 pb-2 space-y-1">
                    <div className="flex justify-between items-start">
                        <span className="text-2xl font-black text-slate-900 leading-none">
                            {order.ticket_number}
                        </span>
                        <Badge className={getTimeBadgeColor()}>
                            <Clock className="w-3 h-3 mr-1" />
                            {elapsedMinutes} min
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        {order.service_type === 'dine_in' ? (
                            <div className="flex items-center bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                <TableIcon className="w-3 h-3 mr-1" />
                                {order.table?.name || 'Mesa'}
                            </div>
                        ) : (
                            <div className="flex items-center bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                                <Users className="w-3 h-3 mr-1" />
                                {order.service_type === 'delivery' ? 'Domicilio' : 'Para llevar'}
                            </div>
                        )}
                        <span className="truncate max-w-[100px]">{order.customer_name}</span>
                    </div>
                </CardHeader>

                <CardContent className="p-3 pt-0 flex-1 overflow-hidden">
                    <ScrollArea className="h-full pr-2">
                        <div className="space-y-3 pt-2">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex gap-3 border-b border-slate-100 pb-2 last:border-0">
                                    <span className="text-xl font-bold text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0">
                                        {item.quantity}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-semibold text-slate-800 leading-tight">
                                            {item.product_name}
                                        </span>
                                        {item.variant_options && item.variant_options.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {item.variant_options.map((opt: any, oIdx: number) => (
                                                    <span key={oIdx} className="text-[10px] bg-slate-100 text-slate-600 px-1 rounded">
                                                        {opt.value || opt.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>

                <CardFooter className="p-3 pt-2 bg-slate-50/50">
                    <Button
                        onClick={() => onReady(order.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-lg shadow-sm"
                    >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        DESPACHAR
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default function KitchenIndex({ orders: initialOrders, tenant }: Props) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
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
            const response = await axios.post(route('tenant.admin.kitchen.ready', { tenant: tenant.slug, order: id }));
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
            console.log('Listening for kitchen events on channel: ', `tenant.${tenant.id}.kitchen`);

            try {
                window.Echo.channel(`tenant.${tenant.id}.kitchen`)
                    .listen('.order.sent', (data: any) => {
                        console.log('New order received in kitchen:', data);
                        setOrders(prev => {
                            // Avoid duplicates
                            if (prev.find(o => o.id === data.id)) return prev;
                            return [...prev, data];
                        });
                        playNotification();
                        toast.info(`Nuevo pedido: ${data.ticket_number}`, {
                            description: `Mesa: ${data.table_name || 'N/A'}`,
                            icon: <Bell className="w-4 h-4 text-blue-500" />
                        });
                    });
            } catch (error) {
                console.error("Error subscribing to Echo channel:", error);
            }
        }

        return () => {
            if (typeof window !== 'undefined' && window.Echo && tenant.id) {
                try {
                    window.Echo.leave(`tenant.${tenant.id}.kitchen`);
                } catch (error) {
                    console.error("Error leaving Echo channel:", error);
                }
            }
        };
    }, [tenant.id]);

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
