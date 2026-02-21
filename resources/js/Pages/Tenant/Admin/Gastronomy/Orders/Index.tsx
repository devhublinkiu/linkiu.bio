import { useState, useEffect, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { getEcho } from '@/echo';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Card, CardContent, CardHeader, CardFooter } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/Components/ui/dialog';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/Components/ui/table';
import {
    Clock, MapPin, Utensils, Bike, ShoppingBag, CheckCircle2, XCircle,
    User, Eye, History, ArrowLeftCircle, Search, Loader2, StickyNote,
    ChefHat, Package, Receipt, CreditCard, Wallet, Building2, Ban,
    ClipboardList, Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import { Tenant, Location, EchoInstance } from '@/types/pos';
import { formatCurrency } from '@/utils/currency';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';

// --- Tipos ---

interface OrderItemVariant {
    name?: string;
    group_name?: string;
    value?: string;
    option_name?: string;
    price?: string | number;
}

interface OrderItem {
    id: number;
    quantity: number;
    product_name: string;
    price: string | number;
    total: string | number;
    product?: { name: string; image_url?: string };
    variant_options?: OrderItemVariant[] | Record<string, OrderItemVariant>;
    notes?: string;
    status?: string;
    cancelled_by?: number;
    cancelled_at?: string;
}

interface StatusHistoryEntry {
    id: number;
    from_status: string | null;
    to_status: string;
    notes?: string | null;
    created_at: string;
    user?: { name: string };
}

interface Order {
    id: number;
    customer_name: string;
    customer_phone?: string;
    total: string | number;
    subtotal?: string | number;
    tax_amount?: string | number;
    status: OrderStatus;
    service_type: 'dine_in' | 'takeout' | 'delivery';
    items: OrderItem[];
    created_at: string;
    delivery_address?: { neighborhood?: string; address?: string } | null;
    table?: { id: number; name: string } | null;
    location?: { id: number; name: string } | null;
    creator?: { name: string } | null;
    ticket_number?: string;
    payment_proof_url?: string | null;
    payment_method?: string | null;
    payment_reference?: string | null;
    waiter_collected?: boolean;
    created_by?: number | null;
    status_history?: StatusHistoryEntry[];
}

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedOrders {
    data: Order[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    links: PaginationLink[];
}

interface Props {
    tenant: Tenant;
    orders: PaginatedOrders;
    isHistory: boolean;
    locations: Location[];
    currentLocationId: number | null;
}

// --- Constantes ---

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; kanbanColor: string }> = {
    pending:   { label: 'Pendiente',  color: 'bg-yellow-100 text-yellow-700 border-yellow-300', kanbanColor: 'bg-yellow-50 border-yellow-200' },
    confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-700 border-blue-300',       kanbanColor: 'bg-blue-50 border-blue-200' },
    preparing: { label: 'En Cocina',  color: 'bg-orange-100 text-orange-700 border-orange-300', kanbanColor: 'bg-orange-50 border-orange-200' },
    ready:     { label: 'Listo',      color: 'bg-purple-100 text-purple-700 border-purple-300', kanbanColor: 'bg-purple-50 border-purple-200' },
    completed: { label: 'Entregado',  color: 'bg-green-100 text-green-700 border-green-300',    kanbanColor: 'bg-green-50 border-green-200' },
    cancelled: { label: 'Cancelado',  color: 'bg-red-100 text-red-700 border-red-300',          kanbanColor: 'bg-red-50 border-red-200' },
};

const SERVICE_CONFIG: Record<string, { label: string; icon: typeof Utensils }> = {
    dine_in:  { label: 'Mesa',       icon: Utensils },
    takeout:  { label: 'Para Llevar', icon: ShoppingBag },
    delivery: { label: 'Domicilio',  icon: Bike },
};

const PAYMENT_LABELS: Record<string, string> = {
    cash: 'Efectivo', bank_transfer: 'Transferencia', transfer: 'Transferencia',
    card: 'Tarjeta', dataphone: 'Datáfono',
};

const NEXT_STATUS: Partial<Record<OrderStatus, { status: OrderStatus; label: string; color: string }>> = {
    pending:   { status: 'confirmed', label: 'Confirmar',  color: 'bg-blue-600 hover:bg-blue-700' },
    confirmed: { status: 'preparing', label: 'A Cocina',   color: 'bg-orange-500 hover:bg-orange-600' },
    preparing: { status: 'ready',     label: 'Listo',      color: 'bg-purple-600 hover:bg-purple-700' },
    ready:     { status: 'completed', label: 'Entregar',   color: 'bg-green-600 hover:bg-green-700' },
};

// --- Componente Principal ---

export default function OrdersIndex({ tenant, orders: paginatedOrders, isHistory, locations, currentLocationId }: Props) {
    const { currentUserRole } = usePage<PageProps>().props;
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [orders, setOrders] = useState<Order[]>(paginatedOrders.data || []);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetail, setShowDetail] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [processingOrderId, setProcessingOrderId] = useState<number | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ orderId: number; status: OrderStatus; label: string } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const checkPermission = (permission: string) => {
        if (!currentUserRole) return false;
        return currentUserRole.is_owner === true ||
            (Array.isArray(currentUserRole.permissions) && currentUserRole.permissions.includes('*')) ||
            (Array.isArray(currentUserRole.permissions) && currentUserRole.permissions.includes(permission));
    };

    const handleActionWithPermission = (permission: string, action: () => void) => {
        if (checkPermission(permission)) {
            action();
        } else {
            setShowPermissionModal(true);
        }
    };
    const [serviceFilter, setServiceFilter] = useState<string>('all');
    const [isPageLoaded, setIsPageLoaded] = useState(false);

    // Skeleton loader
    useEffect(() => {
        const t = setTimeout(() => setIsPageLoaded(true), 300);
        return () => clearTimeout(t);
    }, []);

    // Sync prop → state
    useEffect(() => {
        setOrders(paginatedOrders.data || []);
    }, [paginatedOrders]);

    // --- Echo: escuchar nuevos pedidos en tiempo real ---
    useEffect(() => {
        if (isHistory) return;
        const echoInstance = getEcho() as EchoInstance | undefined;
        if (!echoInstance?.connector || !tenant.id) return;

        const channelName = `tenant.${tenant.id}.orders`;

        try {
            const channel = echoInstance.channel(channelName);
            channel.listen('.order.created', (e: Record<string, unknown>) => {
                const data = e as { id: number; customer_name: string; total: number; status: string; service_type: string; message?: string };
                playNotificationSound();
                toast.success(data.message || `Nuevo pedido #${data.id}`, {
                    id: `new-order-${data.id}`,
                    duration: 15000,
                    description: `${data.customer_name} — ${formatCurrency(Number(data.total) || 0)}`,
                    style: { background: '#eff6ff', border: '2px solid #3b82f6', fontWeight: 'bold' },
                });
                router.reload({ only: ['orders'] });
            });
        } catch (err) {
            console.error('Error subscribing to Echo channel:', err);
        }

        return () => {
            try { echoInstance.leave(channelName); } catch { /* Silently ignore leave errors */ }
        };
    }, [tenant.id, isHistory]);

    // --- Audio ---
    const playNotificationSound = () => {
        try {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            const ctx = new AudioCtx();
            const notes = [830, 1046, 1318];
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
        } catch { /* Audio not available */ }
    };

    // --- Filtros ---
    const filteredOrders = useMemo(() => {
        let result = orders;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(o =>
                o.customer_name?.toLowerCase().includes(q) ||
                o.customer_phone?.includes(q) ||
                o.ticket_number?.toLowerCase().includes(q) ||
                String(o.id).includes(q)
            );
        }
        if (serviceFilter !== 'all') {
            result = result.filter(o => o.service_type === serviceFilter);
        }
        return result;
    }, [orders, searchQuery, serviceFilter]);

    const getOrdersByStatus = (status: string) => {
        const result = filteredOrders.filter(o => o.status === status);
        // Entregados: solo últimos 5 (ya no son accionables, el resto va al historial)
        if (status === 'completed') return result.slice(0, 5);
        // Demás columnas: scroll natural dentro de ScrollArea
        return result;
    };

    // --- Acciones ---
    const handleStatusUpdate = (orderId: number, newStatus: OrderStatus) => {
        setProcessingOrderId(orderId);
        router.post(
            route('tenant.admin.gastronomy.orders.update-status', { tenant: tenant.slug, order: orderId }),
            { status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Estado actualizado');
                    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                    setShowDetail(false);
                    setSelectedOrder(null);
                    setConfirmAction(null);
                },
                onError: (errors) => {
                    const msg = errors.status || errors.order || 'Error al actualizar estado';
                    toast.error(typeof msg === 'string' ? msg : 'Error al actualizar estado');
                },
                onFinish: () => setProcessingOrderId(null),
            }
        );
    };

    const handleViewDetail = async (order: Order) => {
        setSelectedOrder(order);
        setShowDetail(true);
        // Cargar detalle completo (con historial de estados)
        setLoadingDetail(true);
        try {
            const res = await fetch(
                route('tenant.admin.gastronomy.orders.show', { tenant: tenant.slug, order: order.id }),
                { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } }
            );
            if (res.ok) {
                const full = await res.json() as Order;
                setSelectedOrder(full);
            }
        } catch { /* keep partial data */ }
        finally { setLoadingDetail(false); }
    };

    const handleLocationChange = (value: string) => {
        const params: Record<string, string> = { tenant: tenant.slug };
        if (value !== 'all') params.location_id = value;
        if (isHistory) params.history = '1';
        router.visit(route('tenant.admin.gastronomy.orders.index', params));
    };

    // --- Kanban columns (vista activa) ---
    const kanbanColumns: { id: OrderStatus; title: string }[] = [
        { id: 'pending',   title: 'Pendientes' },
        { id: 'confirmed', title: 'Confirmados' },
        { id: 'preparing', title: 'En Cocina' },
        { id: 'ready',     title: 'Listos' },
        { id: 'completed', title: 'Entregados' },
    ];

    // --- Service icon helper ---
    const ServiceIcon = ({ type }: { type: string }) => {
        const cfg = SERVICE_CONFIG[type];
        if (!cfg) return <ClipboardList className="w-4 h-4" />;
        const Icon = cfg.icon;
        return <Icon className="w-4 h-4" />;
    };

    // --- Elapsed time ---
    const getElapsed = (createdAt: string): string => {
        const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
        if (diff < 1) return 'Ahora';
        if (diff < 60) return `${diff}m`;
        return `${Math.floor(diff / 60)}h ${diff % 60}m`;
    };

    return (
        <AdminLayout title="Gestión de Pedidos" breadcrumbs={[{ label: 'Gastronomía' }, { label: 'Pedidos' }]} maxwidth="max-w-[2000px]">
            <Head title="Gestión de Pedidos" />
            <div className="p-4 md:p-6 h-[calc(100vh-80px)] flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                            {isHistory ? 'Historial de Pedidos' : 'Tablero de Pedidos'}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {isHistory ? 'Consulta pedidos antiguos y cancelados.' : 'Gestiona tus pedidos en tiempo real.'}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                        {/* Selector de Sede */}
                        {locations.length > 1 && (
                            <Select value={currentLocationId ? String(currentLocationId) : 'all'} onValueChange={handleLocationChange}>
                                <SelectTrigger className="w-[180px] h-9">
                                    <Building2 className="w-4 h-4 mr-1 text-slate-400" />
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
                        {/* Filtro tipo servicio */}
                        <Select value={serviceFilter} onValueChange={setServiceFilter}>
                            <SelectTrigger className="w-[150px] h-9">
                                <Filter className="w-4 h-4 mr-1 text-slate-400" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="dine_in">Mesa</SelectItem>
                                <SelectItem value="takeout">Para Llevar</SelectItem>
                                <SelectItem value="delivery">Domicilio</SelectItem>
                            </SelectContent>
                        </Select>
                        {/* Búsqueda */}
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Buscar ticket, nombre, tel..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-9 h-9 w-[200px]"
                            />
                        </div>
                        {/* Toggle Kanban/Historial */}
                        <Button
                            variant={isHistory ? 'outline' : 'secondary'}
                            size="sm"
                            onClick={() => router.visit(route('tenant.admin.gastronomy.orders.index', { tenant: tenant.slug, history: isHistory ? '0' : '1' }))}
                            className="gap-1.5"
                        >
                            {isHistory ? <ArrowLeftCircle className="w-4 h-4" /> : <History className="w-4 h-4" />}
                            {isHistory ? 'Tablero' : 'Historial'}
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden bg-slate-50/50 rounded-xl border border-slate-200">

                    {!isPageLoaded ? (
                        /* Skeleton */
                        <div className="flex gap-4 p-4 h-full">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex-1 min-w-[200px] bg-slate-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : isHistory ? (
                        /* HISTORY TABLE */
                        <div className="h-full flex flex-col">
                            <div className="flex-1 overflow-auto p-4">
                                <Card>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[90px]">Ticket</TableHead>
                                                <TableHead>Fecha</TableHead>
                                                <TableHead>Cliente</TableHead>
                                                <TableHead>Tipo</TableHead>
                                                <TableHead>Sede</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead>Pago</TableHead>
                                                <TableHead className="text-right">Total</TableHead>
                                                <TableHead className="text-center w-[80px]">Ver</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredOrders.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={9} className="text-center h-32 text-slate-400">
                                                        <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                                        Sin pedidos en el historial.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredOrders.map(order => {
                                                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                                                    return (
                                                        <TableRow key={order.id} className="cursor-pointer hover:bg-slate-50" onClick={() => handleViewDetail(order)}>
                                                            <TableCell className="font-bold font-mono">{order.ticket_number || `#${order.id}`}</TableCell>
                                                            <TableCell className="text-xs text-slate-500">{new Date(order.created_at).toLocaleString('es-CO')}</TableCell>
                                                            <TableCell>
                                                                <div className="font-medium text-sm">{order.customer_name}</div>
                                                                {order.customer_phone && <div className="text-xs text-slate-400">{order.customer_phone}</div>}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-1 text-sm">
                                                                    <ServiceIcon type={order.service_type} />
                                                                    {SERVICE_CONFIG[order.service_type]?.label || order.service_type}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-xs text-slate-500">{order.location?.name || '—'}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className={`text-[10px] ${cfg.color}`}>{cfg.label}</Badge>
                                                            </TableCell>
                                                            <TableCell className="text-xs">
                                                                {Boolean(order.waiter_collected) && <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300">Mesero</Badge>}
                                                                {!order.waiter_collected && order.payment_method && <span>{PAYMENT_LABELS[order.payment_method] || order.payment_method}</span>}
                                                            </TableCell>
                                                            <TableCell className="text-right font-bold">{formatCurrency(Number(order.total))}</TableCell>
                                                            <TableCell className="text-center">
                                                                <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); handleViewDetail(order); }}>
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </div>
                            {/* Pagination */}
                            {paginatedOrders.last_page > 1 && (
                                <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between text-sm">
                                    <span className="text-slate-500">
                                        {paginatedOrders.from} – {paginatedOrders.to} de {paginatedOrders.total}
                                    </span>
                                    <div className="flex gap-1">
                                        {paginatedOrders.links.map((link, i) => {
                                            let label = link.label;
                                            // Laravel puede enviar: "pagination.previous", "&laquo; Previous", etc.
                                            if (label.includes('previous') || label.includes('Previous') || label.includes('laquo')) label = '← Anterior';
                                            if (label.includes('next') || label.includes('Next') || label.includes('raquo')) label = 'Siguiente →';
                                            // Limpiar cualquier entidad HTML restante
                                            label = label.replace(/&laquo;|&raquo;|pagination\./g, '').trim();
                                            return (
                                                <Button
                                                    key={i}
                                                    variant={link.active ? 'default' : 'outline'}
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.visit(link.url)}
                                                    className="h-8 px-3 text-xs"
                                                >
                                                    {label}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* KANBAN BOARD — Desktop: columnas, Mobile: tabs+cards */
                        <>
                            {/* Mobile: Tabs por estado */}
                            <div className="md:hidden p-3">
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {kanbanColumns.map(col => {
                                        const count = getOrdersByStatus(col.id).length;
                                        return (
                                            <Button
                                                key={col.id}
                                                variant="outline"
                                                size="sm"
                                                className={`flex-shrink-0 gap-1 ${STATUS_CONFIG[col.id].color}`}
                                                onClick={() => {
                                                    document.getElementById(`kanban-mobile-${col.id}`)?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                            >
                                                {col.title} <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">{count}</Badge>
                                            </Button>
                                        );
                                    })}
                                </div>
                                <div className="space-y-6 mt-2">
                                    {kanbanColumns.map(col => {
                                        const colOrders = getOrdersByStatus(col.id);
                                        return (
                                            <div key={col.id} id={`kanban-mobile-${col.id}`}>
                                                <h3 className={`text-sm font-bold px-2 py-1 rounded mb-2 ${STATUS_CONFIG[col.id].color}`}>
                                                    {col.title} ({colOrders.length})
                                                </h3>
                                                {colOrders.length === 0 ? (
                                                    <p className="text-center text-xs text-slate-400 py-4 italic">Sin pedidos</p>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {colOrders.map(order => (
                                                            <OrderCard
                                                                key={order.id}
                                                                order={order}
                                                                onView={() => handleViewDetail(order)}
                                                                onAction={(status, label) => handleActionWithPermission('orders.update', () => setConfirmAction({ orderId: order.id, status, label }))}
                                                                processing={processingOrderId === order.id}
                                                                getElapsed={getElapsed}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Desktop: Kanban columnas */}
                            <div className="hidden md:flex flex-1 overflow-x-auto h-full p-4">
                                <div className="flex gap-3 h-full w-full">
                                    {kanbanColumns.map(col => {
                                        const colOrders = getOrdersByStatus(col.id);
                                        const cfg = STATUS_CONFIG[col.id];
                                        return (
                                            <div key={col.id} className={`flex-1 min-w-[220px] flex flex-col rounded-xl border ${cfg.kanbanColor} h-full`}>
                                                <div className={`p-3 border-b font-bold text-sm flex justify-between items-center rounded-t-xl ${cfg.color}`}>
                                                    <span>{col.title}</span>
                                                    <Badge variant="secondary" className="bg-white/70 text-xs">{colOrders.length}</Badge>
                                                </div>
                                                <ScrollArea className="flex-1 p-2">
                                                    <div className="space-y-2">
                                                        {colOrders.map(order => (
                                                            <OrderCard
                                                                key={order.id}
                                                                order={order}
                                                                onView={() => handleViewDetail(order)}
                                                                onAction={(status, label) => handleActionWithPermission('orders.update', () => setConfirmAction({ orderId: order.id, status, label }))}
                                                                processing={processingOrderId === order.id}
                                                                getElapsed={getElapsed}
                                                            />
                                                        ))}
                                                        {colOrders.length === 0 && (
                                                            <div className="text-center py-10 text-slate-400">
                                                                <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                                                <p className="text-xs italic">Sin pedidos</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </ScrollArea>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* --- Confirmación de cambio de estado --- */}
            <AlertDialog open={!!confirmAction} onOpenChange={open => { if (!open) setConfirmAction(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Cambiar estado a "{confirmAction?.label}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmAction?.status === 'cancelled'
                                ? 'Esta acción cancelará el pedido. El cliente será notificado.'
                                : 'El estado del pedido cambiará y se notificará al cliente.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Volver</AlertDialogCancel>
                        <AlertDialogAction
                            className={confirmAction?.status === 'cancelled' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
                            onClick={() => confirmAction && handleStatusUpdate(confirmAction.orderId, confirmAction.status)}
                        >
                            {processingOrderId ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                            Sí, {confirmAction?.label}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* --- Modal de Detalle --- */}
            <Dialog open={showDetail} onOpenChange={open => { if (!open) { setShowDetail(false); setSelectedOrder(null); } }}>
                <DialogContent className="max-w-lg p-0 overflow-hidden max-h-[90vh]">
                    {selectedOrder && (
                        <div className="flex flex-col max-h-[90vh]">
                            {/* Header */}
                            <div className="p-5 border-b border-slate-100 bg-slate-50">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2 text-lg">
                                        <Receipt className="w-5 h-5 text-slate-600" />
                                        Pedido {selectedOrder.ticket_number || `#${selectedOrder.id}`}
                                    </DialogTitle>
                                    <DialogDescription className="flex items-center gap-3 mt-1">
                                        <span className="text-xs">{new Date(selectedOrder.created_at).toLocaleString('es-CO')}</span>
                                        <Badge variant="outline" className={`text-[10px] ${STATUS_CONFIG[selectedOrder.status]?.color || ''}`}>
                                            {STATUS_CONFIG[selectedOrder.status]?.label || selectedOrder.status}
                                        </Badge>
                                        <span className="text-xs flex items-center gap-1">
                                            <ServiceIcon type={selectedOrder.service_type} />
                                            {SERVICE_CONFIG[selectedOrder.service_type]?.label}
                                        </span>
                                    </DialogDescription>
                                </DialogHeader>
                            </div>

                            {/* Scrollable Body */}
                            <div className="overflow-y-auto flex-1 p-5 space-y-4">
                                {/* Info del cliente */}
                                <div className="bg-slate-50 p-3 rounded-lg space-y-1">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span className="font-bold">{selectedOrder.customer_name}</span>
                                    </div>
                                    {selectedOrder.customer_phone && <p className="text-sm text-slate-500 ml-6">{selectedOrder.customer_phone}</p>}
                                    {selectedOrder.table && (
                                        <p className="text-sm text-slate-500 ml-6 flex items-center gap-1"><Utensils className="w-3 h-3" /> {selectedOrder.table.name}</p>
                                    )}
                                    {selectedOrder.location && (
                                        <p className="text-sm text-slate-500 ml-6 flex items-center gap-1"><Building2 className="w-3 h-3" /> {selectedOrder.location.name}</p>
                                    )}
                                    {selectedOrder.creator && (
                                        <p className="text-xs text-slate-400 ml-6">Creado por: {selectedOrder.creator.name}</p>
                                    )}
                                    {selectedOrder.delivery_address && (
                                        <p className="text-sm text-slate-500 ml-6 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {selectedOrder.delivery_address.neighborhood} — {selectedOrder.delivery_address.address}
                                        </p>
                                    )}
                                </div>

                                {/* Items */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Productos</h4>
                                    <div className="space-y-1">
                                        {selectedOrder.items?.map(item => {
                                            const isCancelled = item.status === 'cancelled';
                                            const variants = item.variant_options
                                                ? (Array.isArray(item.variant_options) ? item.variant_options : Object.values(item.variant_options))
                                                : [];
                                            return (
                                                <div key={item.id} className={`flex justify-between items-start py-2 px-2 rounded-lg ${isCancelled ? 'bg-red-50 opacity-60' : 'hover:bg-slate-50'}`}>
                                                    <div className="flex items-start gap-2">
                                                        <span className="font-bold bg-slate-100 w-6 h-6 flex items-center justify-center rounded-full text-xs flex-shrink-0">
                                                            {item.quantity}
                                                        </span>
                                                        <div>
                                                            <span className={`text-sm font-medium ${isCancelled ? 'line-through text-red-500' : 'text-slate-900'}`}>
                                                                {item.product?.name || item.product_name}
                                                            </span>
                                                            {isCancelled && <Badge variant="destructive" className="ml-2 text-[9px] h-4">Anulado</Badge>}
                                                            {variants.length > 0 && (
                                                                <div className="text-[11px] text-slate-500 mt-0.5">
                                                                    {variants.map((v: OrderItemVariant, i: number) => (
                                                                        <span key={i}>
                                                                            {v.name || v.group_name}: {v.value || v.option_name}
                                                                            {v.price && Number(v.price) > 0 ? ` (+${formatCurrency(Number(v.price))})` : ''}
                                                                            {i < variants.length - 1 ? ' · ' : ''}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {item.notes && (
                                                                <p className="text-[11px] text-amber-600 flex items-center gap-1 mt-0.5">
                                                                    <StickyNote className="w-3 h-3" /> {item.notes}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className={`text-sm font-mono font-semibold flex-shrink-0 ${isCancelled ? 'line-through text-red-400' : 'text-slate-700'}`}>
                                                        {formatCurrency(Number(item.total))}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {/* Totales */}
                                    <div className="mt-3 pt-3 border-t border-slate-200 space-y-1">
                                        {selectedOrder.subtotal && (
                                            <div className="flex justify-between text-sm text-slate-500">
                                                <span>Subtotal</span>
                                                <span>{formatCurrency(Number(selectedOrder.subtotal))}</span>
                                            </div>
                                        )}
                                        {selectedOrder.tax_amount && Number(selectedOrder.tax_amount) > 0 && (
                                            <div className="flex justify-between text-sm text-slate-500">
                                                <span>Impuestos</span>
                                                <span>{formatCurrency(Number(selectedOrder.tax_amount))}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-black text-lg">
                                            <span>Total</span>
                                            <span>{formatCurrency(Number(selectedOrder.total))}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Pago */}
                                {(selectedOrder.payment_method || Boolean(selectedOrder.waiter_collected)) && (
                                    <div className="bg-blue-50 p-3 rounded-lg space-y-1">
                                        <h4 className="text-xs font-bold uppercase text-blue-600">Información de Pago</h4>
                                        <div className="flex items-center gap-2 text-sm">
                                            <CreditCard className="w-4 h-4 text-blue-500" />
                                            <span className="font-semibold">{PAYMENT_LABELS[selectedOrder.payment_method || ''] || selectedOrder.payment_method || 'No especificado'}</span>
                                        </div>
                                        {Boolean(selectedOrder.waiter_collected) && (
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-[10px]">
                                                Cobrado por Mesero
                                            </Badge>
                                        )}
                                        {selectedOrder.payment_reference && (
                                            <p className="text-xs text-slate-500">Ref: {selectedOrder.payment_reference}</p>
                                        )}
                                    </div>
                                )}

                                {/* Comprobante */}
                                {selectedOrder.payment_proof_url && (
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Comprobante</h4>
                                        <a href={selectedOrder.payment_proof_url} target="_blank" rel="noopener noreferrer"
                                            className="block rounded-lg overflow-hidden border border-slate-200 hover:border-blue-400 transition-colors">
                                            <img src={selectedOrder.payment_proof_url} alt="Comprobante" className="w-full max-h-48 object-contain bg-slate-100" />
                                        </a>
                                    </div>
                                )}

                                {/* Historial de estados */}
                                {selectedOrder.status_history && selectedOrder.status_history.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Historial de Estados</h4>
                                        <div className="space-y-1">
                                            {selectedOrder.status_history.map(entry => (
                                                <div key={entry.id} className="flex items-start gap-2 text-xs text-slate-600 py-1">
                                                    <Clock className="w-3 h-3 mt-0.5 text-slate-400 flex-shrink-0" />
                                                    <div>
                                                        <span className="font-semibold">
                                                            {entry.from_status ? `${STATUS_CONFIG[entry.from_status as OrderStatus]?.label || entry.from_status} → ` : ''}
                                                            {STATUS_CONFIG[entry.to_status as OrderStatus]?.label || entry.to_status}
                                                        </span>
                                                        {entry.user && <span className="text-slate-400"> — {entry.user.name}</span>}
                                                        <span className="text-slate-400 ml-1">{new Date(entry.created_at).toLocaleString('es-CO')}</span>
                                                        {entry.notes && <p className="text-slate-500 italic">{entry.notes}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {loadingDetail && (
                                    <div className="flex items-center justify-center py-4 text-slate-400 gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Cargando detalle...
                                    </div>
                                )}
                            </div>

                            {/* Footer con acciones */}
                            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
                                {NEXT_STATUS[selectedOrder.status] && (
                                    <Button
                                        className={`flex-1 h-10 font-bold text-white ${NEXT_STATUS[selectedOrder.status]!.color}`}
                                        disabled={processingOrderId === selectedOrder.id}
                                        onClick={() => handleActionWithPermission('orders.update', () => setConfirmAction({
                                            orderId: selectedOrder.id,
                                            status: NEXT_STATUS[selectedOrder.status]!.status,
                                            label: NEXT_STATUS[selectedOrder.status]!.label,
                                        }))}
                                    >
                                        {processingOrderId === selectedOrder.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                        {NEXT_STATUS[selectedOrder.status]!.label}
                                    </Button>
                                )}
                                {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                                    <Button
                                        variant="outline"
                                        className="h-10 border-red-200 text-red-600 hover:bg-red-50"
                                        onClick={() => handleActionWithPermission('orders.update', () => setConfirmAction({ orderId: selectedOrder.id, status: 'cancelled', label: 'Cancelar' }))}
                                    >
                                        <Ban className="w-4 h-4 mr-1" /> Cancelar
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />
        </AdminLayout>
    );
}

// --- Sub-componente: Tarjeta de Pedido (Kanban) ---

function OrderCard({ order, onView, onAction, processing, getElapsed }: {
    order: Order;
    onView: () => void;
    onAction: (status: OrderStatus, label: string) => void;
    processing: boolean;
    getElapsed: (date: string) => string;
}) {
    const next = NEXT_STATUS[order.status];
    return (
        <Card className="cursor-pointer hover:shadow-md transition-all border-slate-200 overflow-hidden" onClick={onView}>
            <CardHeader className="p-3 pb-1.5 space-y-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="h-5 gap-1 pl-1 pr-2 text-[10px]">
                            <ServiceIcon type={order.service_type} />
                            {order.ticket_number || `#${order.id}`}
                        </Badge>
                        <span className="text-[10px] text-slate-400 font-mono">{getElapsed(order.created_at)}</span>
                    </div>
                    {Boolean(order.waiter_collected) && (
                        <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-300 h-4">Mesero</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-3 py-1.5">
                <div className="flex items-center gap-1.5 mb-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span className="text-sm font-medium truncate">{order.customer_name}</span>
                </div>
                {order.table && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Utensils className="w-3 h-3" /> {order.table.name}
                    </div>
                )}
                <div className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {order.items?.map(item => `${item.quantity}x ${item.product?.name || item.product_name}`).join(', ')}
                </div>
            </CardContent>
            <CardFooter className="p-3 pt-1.5 flex justify-between items-center border-t border-slate-100 bg-slate-50/50">
                <span className="font-bold text-sm">{formatCurrency(Number(order.total))}</span>
                {next && (
                    <Button
                        size="sm"
                        className={`h-7 text-[11px] text-white ${next.color}`}
                        disabled={processing}
                        onClick={e => { e.stopPropagation(); onAction(next.status, next.label); }}
                    >
                        {processing ? <Loader2 className="w-3 h-3 animate-spin" /> : next.label}
                    </Button>
                )}
                {order.status === 'completed' && (
                    <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-300"><CheckCircle2 className="w-3 h-3 mr-0.5" />OK</Badge>
                )}
            </CardFooter>
        </Card>
    );
}

// Helper del ServiceIcon fuera del componente principal para reutilizarlo
function ServiceIcon({ type }: { type: string }) {
    const cfg = SERVICE_CONFIG[type];
    if (!cfg) return <ClipboardList className="w-4 h-4" />;
    const Icon = cfg.icon;
    return <Icon className="w-4 h-4" />;
}
