import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';
// @ts-ignore
import { Clock, MapPin, Utensils, Bike, ShoppingBag, AlertCircle, CheckCircle2, XCircle, ChevronRight, User, Eye, History, ArrowLeftCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Dialog, DialogContent, DialogTrigger } from "@/Components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

interface Order {
    id: number;
    customer_name: string;
    customer_phone: string;
    total: number;
    status: string;
    service_type: string;
    items: {
        id: number;
        quantity: number;
        product_name: string;
        price: number;
        total: number;
        product?: { name: string; image_url: string };
        variant_options?: any; // JSON/Array of options
    }[];
    created_at: string;
    delivery_address?: any;
    table?: any;
    ticket_number?: string;
    payment_proof_url?: string;
    payment_method?: string;
}

export default function Index({ auth, tenant, orders: initialOrders, isHistory = false }: { auth: any, tenant: any, orders: any, isHistory?: boolean }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Initial load sort
    useEffect(() => {
        if (isHistory && initialOrders && initialOrders.data && Array.isArray(initialOrders.data)) {
            setOrders(initialOrders.data);
            setPagination(initialOrders);
        } else if (Array.isArray(initialOrders)) {
            setOrders(initialOrders as Order[]);
            setPagination(null);
        } else {
            // Fallback
            setOrders([]);
            setPagination(null);
        }
    }, [initialOrders, isHistory]);

    // Real-time listener: Only listen if NOT in history mode to avoid confusion, or listen and append? 
    // Best to keep listening but maybe filter if we are stringent. For now, keep as is.
    useEffect(() => {
        if (isHistory) return; // Don't listen for new orders in history view

        // @ts-ignore
        window.Echo.channel(`tenant.${tenant.id}.orders`)
            .listen('.order.created', (e: any) => {
                toast.success(e.message, {
                    description: `Total: $${parseFloat(e.total).toLocaleString()}`,
                    action: {
                        label: 'Ver',
                        onClick: () => console.log('View order', e.id)
                    }
                });

                // Add new order to state
                setOrders(prev => [e, ...prev]);

                // Play notification sound (optional)
                const audio = new Audio('/sounds/notification.mp3');
                audio.play().catch(err => console.log('Audio play failed', err));
            });

        return () => {
            // @ts-ignore
            try {
                if (window.Echo) window.Echo.leave(`tenant.${tenant.id}.orders`);
            } catch (error) { }
        }
    }, [tenant.id, isHistory]);


    // Columns definition
    const columns = isHistory
        ? [
            { id: 'completed', title: 'Entregados', color: 'bg-green-100 border-green-200 text-green-800' },
            { id: 'cancelled', title: 'Cancelados', color: 'bg-red-100 border-red-200 text-red-800' },
        ]
        : [
            { id: 'pending', title: 'Pendientes', color: 'bg-yellow-100 border-yellow-200 text-yellow-800' },
            { id: 'confirmed', title: 'Confirmados', color: 'bg-blue-100 border-blue-200 text-blue-800' },
            { id: 'preparing', title: 'En Cocina', color: 'bg-orange-100 border-orange-200 text-orange-800' },
            { id: 'ready', title: 'Listos / En Camino', color: 'bg-purple-100 border-purple-200 text-purple-800' },
            { id: 'completed', title: 'Entregados', color: 'bg-green-100 border-green-200 text-green-800' },
        ];

    const getOrdersByStatus = (status: string) => {
        if (!Array.isArray(orders)) return [];
        return orders.filter(o => o.status === status);
    };

    const handleStatusUpdate = (orderId: number, newStatus: string) => {
        router.post(route('tenant.admin.gastronomy.orders.update-status', { tenant: tenant.slug, order: orderId }), {
            status: newStatus
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Estado actualizado');
                // Optimistic update
                if (isHistory && newStatus !== 'cancelled' && newStatus !== 'completed') {
                    // If moving out of history view, remove it
                    setOrders(prev => prev.filter(o => o.id !== orderId));
                } else if (!isHistory && (newStatus === 'cancelled' || newStatus === 'completed')) {
                    // If moving to completed (and we show completed) keep it, but if cancelled remove it? 
                    // Logic: Active board shows Completed column, so keep completed. Remove cancelled.
                    if (newStatus === 'cancelled') {
                        setOrders(prev => prev.filter(o => o.id !== orderId));
                    } else {
                        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                    }
                } else {
                    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                }
                setSelectedOrder(null);
            },
            onError: () => toast.error('Error al actualizar estado')
        });
    };

    const getServiceIcon = (type: string) => {
        switch (type) {
            case 'delivery': return <Bike className="w-4 h-4" />;
            case 'dine_in': return <Utensils className="w-4 h-4" />;
            case 'takeout': return <ShoppingBag className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getServiceLabel = (type: string) => {
        switch (type) {
            case 'delivery': return 'Domicilio';
            case 'dine_in': return 'Mesa';
            case 'takeout': return 'Para Llevar';
            default: return type;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendiente';
            case 'confirmed': return 'Confirmado';
            case 'preparing': return 'En Cocina';
            case 'ready': return 'Listo';
            case 'completed': return 'Entregado';
            case 'cancelled': return 'Cancelado';
            default: return status;
        }
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'completed': return 'default'; // or specific green style
            case 'cancelled': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <AdminLayout title="Gestión de Pedidos" breadcrumbs={[{ label: 'Gastronomía' }, { label: 'Pedidos' }]} maxwidth="max-w-[2000px]">
            <Head title="Gestión de Pedidos" />
            <div className="p-6 h-[calc(100vh-80px)] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            {isHistory ? 'Historial de Pedidos' : 'Tablero de Pedidos'}
                        </h1>
                        <p className="text-slate-500">
                            {isHistory ? 'Consulta pedidos antiguos y cancelados.' : 'Gestiona tus pedidos en tiempo real.'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={isHistory ? "outline" : "secondary"}
                            onClick={() => router.visit(route('tenant.admin.gastronomy.orders.index', { tenant: tenant.slug, history: !isHistory ? '1' : '0' }))}
                            className="gap-2"
                        >
                            {isHistory ? <ArrowLeftCircle className="w-4 h-4" /> : <History className="w-4 h-4" />}
                            {isHistory ? 'Volver al Tablero' : 'Ver Historial'}
                        </Button>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 overflow-hidden bg-slate-50/50 rounded-xl border border-slate-200 relative">

                    {/* HISTORY VIEW (TABLE) */}
                    {isHistory ? (
                        <div className="h-full flex flex-col">
                            <div className="flex-1 overflow-auto p-4">
                                <Card>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Ticket</TableHead>
                                                <TableHead>Fecha</TableHead>
                                                <TableHead>Cliente</TableHead>
                                                <TableHead>Tipo</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead className="text-right">Total</TableHead>
                                                <TableHead className="text-center">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {orders.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                                        No hay pedidos en el historial.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                orders.map((order) => (
                                                    <TableRow key={order.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSelectedOrder(order)}>
                                                        <TableCell className="font-bold">{order.ticket_number}</TableCell>
                                                        <TableCell className="text-xs text-slate-500">
                                                            {new Date(order.created_at).toLocaleString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-medium">{order.customer_name}</div>
                                                            <div className="text-xs text-slate-500">{order.customer_phone}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1">
                                                                {getServiceIcon(order.service_type)}
                                                                <span className="text-sm">{getServiceLabel(order.service_type)}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className={order.status === 'cancelled' ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}>
                                                                {getStatusLabel(order.status)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right font-bold">
                                                            ${parseFloat(order.total.toString()).toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedOrder(order) }}>Ver</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </div>

                            {/* Pagination Controls */}
                            {pagination && (
                                <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
                                    <div className="text-sm text-slate-500">
                                        Mostrando {pagination.from} a {pagination.to} de {pagination.total} resultados
                                    </div>
                                    <div className="flex gap-2">
                                        {pagination.links.map((link: any, i: number) => {
                                            let label = link.label;
                                            if (label.includes('Previous')) label = 'Anterior';
                                            if (label.includes('Next')) label = 'Siguiente';

                                            return (
                                                <Button
                                                    key={i}
                                                    variant={link.active ? "default" : "outline"}
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.visit(link.url)}
                                                    dangerouslySetInnerHTML={{ __html: label }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* KANBAN BOARD */
                        <div className="flex-1 overflow-x-auto h-full p-4">
                            <div className="flex gap-4 min-w-[1000px] h-full">
                                {columns.map(col => (
                                    <div key={col.id} className="flex-1 min-w-[200px] flex flex-col bg-slate-50 rounded-xl border border-slate-200 h-full max-h-full">
                                        <div className={`p-3 border-b border-slate-200 font-bold flex justify-between items-center rounded-t-xl ${col.color} bg-opacity-20`}>
                                            <span>{col.title}</span>
                                            <Badge variant="secondary" className="bg-white/50">{getOrdersByStatus(col.id).length}</Badge>
                                        </div>
                                        <ScrollArea className="flex-1 p-3">
                                            <div className="space-y-3">
                                                {getOrdersByStatus(col.id).map(order => (
                                                    <Card key={order.id} className="cursor-pointer hover:shadow-md transition-all border-slate-200 group relative overflow-hidden" onClick={() => setSelectedOrder(order)}>
                                                        {/* Left Update Indicator */}
                                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${col.id === 'pending' ? 'bg-yellow-400 animate-pulse' : 'bg-transparent'}`} />

                                                        <CardHeader className="p-3 pb-2 space-y-0">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex items-center gap-1.5">
                                                                    <Badge variant="outline" className="h-6 gap-1 pl-1 pr-2">
                                                                        {getServiceIcon(order.service_type)}
                                                                        {order.ticket_number || `#${order.id}`}
                                                                    </Badge>
                                                                    <span className="text-xs text-slate-500 font-mono">
                                                                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="p-3 py-2">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <User className="w-3 h-3 text-slate-400" />
                                                                <span className="text-sm font-medium truncate">{order.customer_name}</span>
                                                            </div>
                                                            {order.service_type === 'delivery' && order.delivery_address && (
                                                                <div className="flex items-start gap-2 mb-2 text-xs text-slate-500">
                                                                    <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                                                                    <span className="truncate line-clamp-1">{order.delivery_address.neighborhood}</span>
                                                                </div>
                                                            )}
                                                            <div className="text-xs text-slate-600 line-clamp-2">
                                                                {order.items && order.items.map((item: any) => `${item.quantity}x ${item.product ? item.product.name : item.product_name}`).join(', ')}
                                                            </div>
                                                        </CardContent>
                                                        <CardFooter className="p-3 pt-2 flex justify-between items-center border-t border-slate-100 bg-slate-50/50">
                                                            <span className="font-bold text-slate-900">${parseFloat(order.total.toString()).toLocaleString()}</span>

                                                            {/* Quick Actions based on status */}
                                                            {order.status === 'pending' && (
                                                                <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order.id, 'confirmed'); }}>
                                                                    Confirmar
                                                                </Button>
                                                            )}
                                                            {order.status === 'confirmed' && (
                                                                <Button size="sm" className="h-7 text-xs bg-orange-500 hover:bg-orange-600" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order.id, 'preparing'); }}>
                                                                    Cocinar
                                                                </Button>
                                                            )}
                                                            {order.status === 'preparing' && (
                                                                <Button size="sm" className="h-7 text-xs bg-purple-600 hover:bg-purple-700" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order.id, 'ready'); }}>
                                                                    Listo
                                                                </Button>
                                                            )}
                                                            {order.status === 'ready' && (
                                                                <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order.id, 'completed'); }}>
                                                                    Entregar
                                                                </Button>
                                                            )}
                                                        </CardFooter>
                                                    </Card>
                                                ))}
                                                {getOrdersByStatus(col.id).length === 0 && (
                                                    <div className="text-center py-8 text-slate-400 text-sm italic">
                                                        Sin pedidos
                                                    </div>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Detailed View Modal / SlideOver (Simplified for MVP as a central overlay) */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
                        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold">Pedido {selectedOrder.ticket_number}</h2>
                                        <span className="text-sm text-slate-500">{new Date(selectedOrder.created_at).toLocaleString()}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)}>
                                        <XCircle className="w-6 h-6" />
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    {/* Customer Info */}
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Cliente</h3>
                                        <p className="font-bold text-lg">{selectedOrder.customer_name}</p>
                                        <p className="text-slate-600">{selectedOrder.customer_phone}</p>
                                        {selectedOrder.service_type === 'delivery' && selectedOrder.delivery_address && (
                                            <div className="mt-2 text-sm border-t border-slate-200 pt-2">
                                                <p className="font-semibold">{selectedOrder.delivery_address.neighborhood}</p>
                                                <p>{selectedOrder.delivery_address.address}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Items */}
                                    <div>
                                        <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Productos</h3>
                                        <div className="space-y-2">
                                            {selectedOrder.items && selectedOrder.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-start py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors px-2 -mx-2 rounded-lg">
                                                    <div className="flex items-start gap-3">
                                                        <span className="font-bold bg-slate-100 w-6 h-6 flex items-center justify-center rounded-full text-xs mt-0.5">{item.quantity}</span>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-slate-900">{item.product ? item.product.name : item.product_name}</span>
                                                            {/* Variants / Modifiers */}
                                                            {item.variant_options && (Array.isArray(item.variant_options) ? item.variant_options : Object.values(item.variant_options)).length > 0 && (
                                                                <div className="text-xs text-slate-500 mt-0.5 space-y-0.5">
                                                                    {(Array.isArray(item.variant_options) ? item.variant_options : Object.values(item.variant_options)).map((opt: any, i: number) => (
                                                                        <div key={i} className="flex items-center gap-1">
                                                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                                            <span>
                                                                                {opt.name || opt.group_name}: <span className="font-semibold text-slate-600">{opt.value || opt.option_name}</span>
                                                                                {opt.price && parseFloat(opt.price) > 0 && ` (+$${parseFloat(opt.price).toLocaleString()})`}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {/* Unit Price Helper */}
                                                            {item.quantity > 1 && (
                                                                <span className="text-[10px] text-slate-400 mt-1">
                                                                    ${parseFloat(item.price).toLocaleString()} c/u
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="font-medium font-mono text-slate-700">${parseFloat(item.total).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-200">
                                            <span className="font-bold text-lg">Total</span>
                                            <span className="font-black text-2xl">${parseFloat(selectedOrder.total.toString()).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-3 pt-4">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                                                    Cancelar Pedido
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta acción cancelará el pedido. El cliente será notificado.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Volver</AlertDialogCancel>
                                                    <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleStatusUpdate(selectedOrder.id, 'cancelled')}>
                                                        Sí, cancelar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                        <Button className="w-full" onClick={() => window.print()}>
                                            Imprimir Comanda
                                        </Button>
                                    </div>

                                    {/* Payment Proof Preview */}
                                    {selectedOrder.payment_proof_url && (
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Comprobante de Pago</h3>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <div className="relative group cursor-pointer overflow-hidden rounded-lg border border-slate-200">
                                                        <img
                                                            src={selectedOrder.payment_proof_url}
                                                            alt="Comprobante"
                                                            className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Eye className="text-white w-8 h-8 drop-shadow-lg" />
                                                        </div>
                                                    </div>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                                                    <img
                                                        src={selectedOrder.payment_proof_url}
                                                        alt="Comprobante Full"
                                                        className="w-full h-auto rounded-lg shadow-2xl"
                                                    />
                                                </DialogContent>
                                            </Dialog>
                                            <p className="text-xs text-slate-400 mt-1 text-center">Clic para ampliar</p>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
