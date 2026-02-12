import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';
import {
    Clock,
    CheckCircle2,
    Table as TableIcon,
    Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface KitchenOrderItem {
    id: number;
    product_name: string;
    quantity: number;
    variant_options?: { name: string; value?: string }[];
}

export interface KitchenOrder {
    id: number;
    ticket_number: string;
    status: string;
    priority: 'high' | 'normal' | 'low';
    service_type: string;
    customer_name: string;
    table?: { name: string };
    creator?: { name: string };
    created_at: string;
    items: KitchenOrderItem[];
}

interface KitchenOrderCardProps {
    order: KitchenOrder;
    onReady: (id: number) => void;
}

export const KitchenOrderCard = ({ order, onReady }: KitchenOrderCardProps) => {
    const [elapsedMinutes, setElapsedMinutes] = useState(0);

    useEffect(() => {
        const calculate = () => {
            const start = new Date(order.created_at).getTime();
            const now = new Date().getTime();
            setElapsedMinutes(Math.floor((now - start) / 60000));
        };

        calculate();
        const interval = setInterval(calculate, 30000); // Actualizar cada 30s
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
                        <div className="flex flex-col gap-1">
                            <span className="text-2xl font-black text-slate-900 leading-none">
                                {order.ticket_number}
                            </span>
                            {order.priority === 'high' && (
                                <Badge className="bg-red-600 text-white text-[10px] py-0 px-1 font-bold animate-pulse">
                                    ALTA PRIORIDAD
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
                                                {item.variant_options.map((opt, oIdx) => (
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
