import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';
import {
    Clock,
    CheckCircle2,
    ChefHat,
    Table as TableIcon,
    Users,
    Loader2,
    Ban,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { KitchenOrder } from '@/types/pos';

// Re-export for backward compat
export type { KitchenOrder, KitchenOrderItem } from '@/types/pos';

interface KitchenOrderCardProps {
    order: KitchenOrder;
    onReady: (id: number) => void;
    onPreparing?: (id: number) => void;
    processingId?: number | null;
}

export const KitchenOrderCard = ({ order, onReady, onPreparing, processingId }: KitchenOrderCardProps) => {
    const [elapsedMinutes, setElapsedMinutes] = useState(0);
    const isProcessing = processingId === order.id;

    useEffect(() => {
        const calculate = () => {
            const start = new Date(order.created_at).getTime();
            const now = new Date().getTime();
            setElapsedMinutes(Math.floor((now - start) / 60000));
        };

        calculate();
        const interval = setInterval(calculate, 15000); // Actualizar cada 15s
        return () => clearInterval(interval);
    }, [order.created_at]);

    const getUrgencyColor = () => {
        if (elapsedMinutes >= 20) return 'border-red-500 bg-red-50';
        if (elapsedMinutes >= 10) return 'border-amber-500 bg-amber-50';
        return 'border-slate-200 bg-white';
    };

    const getTimeBadgeColor = () => {
        if (elapsedMinutes >= 20) return 'bg-red-500 text-white animate-pulse';
        if (elapsedMinutes >= 10) return 'bg-amber-500 text-white';
        return 'bg-slate-100 text-slate-700';
    };

    // Filtrar items: solo 'active' se muestran como pendientes, 'served' ya fueron despachados antes
    const activeItems = order.items.filter(i => i.status === 'active' || !i.status);
    const cancelledItems = order.items.filter(i => i.status === 'cancelled');

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
                        <div className="flex flex-col gap-1">
                            <span className="text-2xl font-black text-slate-900 leading-none">
                                {order.ticket_number}
                            </span>
                            {order.priority === 'high' && (
                                <Badge className="bg-red-600 text-white text-[10px] py-0 px-1 font-bold animate-pulse">
                                    ALTA PRIORIDAD
                                </Badge>
                            )}
                            {/* Badge de estado */}
                            {order.status === 'preparing' && (
                                <Badge className="bg-blue-600 text-white text-[10px] py-0 px-1 font-bold">
                                    EN PREPARACIÓN
                                </Badge>
                            )}
                        </div>
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
                            {/* Items activos */}
                            {activeItems.map((item) => (
                                <div key={item.id} className="flex gap-3 border-b border-slate-100 pb-2 last:border-0">
                                    <span className="text-xl font-bold text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0">
                                        {item.quantity}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-semibold text-slate-800 leading-tight">
                                            {item.product_name}
                                        </span>
                                        {item.variant_options && item.variant_options.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {item.variant_options.map((opt, oIdx) => (
                                                    <span key={oIdx} className="text-[10px] bg-slate-100 text-slate-600 px-1 rounded">
                                                        {opt.value || opt.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {item.notes && (
                                            <div className="mt-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200 font-medium">
                                                ⚠️ {item.notes}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Items cancelados (tachados) */}
                            {cancelledItems.length > 0 && (
                                <div className="border-t border-red-100 pt-2 mt-2">
                                    {cancelledItems.map((item) => (
                                        <div key={item.id} className="flex gap-3 pb-1 opacity-50">
                                            <span className="text-sm font-bold text-red-400 bg-red-50 w-6 h-6 flex items-center justify-center rounded flex-shrink-0">
                                                <Ban className="w-3 h-3" />
                                            </span>
                                            <span className="text-sm text-red-400 line-through leading-tight">
                                                {item.quantity}x {item.product_name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>

                <CardFooter className="p-3 pt-2 bg-slate-50 flex flex-col gap-2">
                    {/* Botón Preparando (solo si status es confirmed) */}
                    {order.status === 'confirmed' && onPreparing && (
                        <Button
                            onClick={() => onPreparing(order.id)}
                            variant="outline"
                            className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 font-bold h-10"
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <ChefHat className="w-4 h-4 mr-2" />
                            )}
                            PREPARANDO
                        </Button>
                    )}

                    {/* Botón Despachar */}
                    <Button
                        onClick={() => onReady(order.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-lg shadow-sm"
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                        )}
                        {isProcessing ? 'PROCESANDO...' : 'DESPACHAR'}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};
