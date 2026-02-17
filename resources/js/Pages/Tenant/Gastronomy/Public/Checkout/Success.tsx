import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Components/Tenant/Gastronomy/Public/PublicLayout';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';
import { Ripple } from '@/Components/ui/ripple';
// @ts-ignore
import { CheckCircle2, Clock, MapPin, Home, FileText, ThumbsUp } from 'lucide-react';

interface OrderProps {
    id: number;
    total: number;
    status: string;
    customer_name: string;
    customer_phone: string;
    delivery_address: any;
    items: any[];
    created_at: string;
    status_history: any[];
    ticket_number: string;
}

export default function Success({ tenant, order: initialOrder }: { tenant: any, order: OrderProps }) {
    const [order, setOrder] = useState<OrderProps>(initialOrder);

    // Update local state when prop changes (e.g. initial load or router reload)
    useEffect(() => {
        setOrder(initialOrder);
    }, [initialOrder]);

    // Real-time listener: actualizar estado y mostrar toast sin recargar la página
    useEffect(() => {
        const echoInstance = (window as unknown as { Echo?: { channel: (n: string) => { listen: (e: string, cb: (e: unknown) => void) => void }; leave: (n: string) => void } }).Echo;
        if (!echoInstance?.channel || !tenant?.id || !order?.id) return;

        const channelName = `tenant.${tenant.id}.orders.${order.id}`;
        const channel = echoInstance.channel(channelName);
        channel.listen('.order.status.updated', (e: any) => {
            setOrder((prev: OrderProps) => ({ ...prev, status: e.status }));

            let message = e.message;
            if (e.status === 'confirmed') message = '¡Tu pedido ha sido confirmado!';
            if (e.status === 'preparing') message = '¡Están preparando tu pedido!';
            if (e.status === 'ready') message = '¡Tu pedido está listo!';
            if (e.status === 'completed') message = '¡Pedido entregado! Gracias por tu compra.';
            if (e.status === 'cancelled') message = 'El pedido ha sido cancelado.';

            toast.success(message);
        });

        return () => {
            try { echoInstance.leave(channelName); } catch { /* ignore */ }
        };
    }, [order.id, tenant.id]);

    if (order.status === 'cancelled') {
        return (
            <PublicLayout bgColor="#fff" showFloatingCart={false}>
                <Head title={`Pedido Cancelado ${order.ticket_number}`} />
                <div className="max-w-md mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <FileText className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Pedido Cancelado</h1>
                    <p className="text-slate-500 mb-8">
                        Este pedido ({order.ticket_number}) ha sido cancelado. Si tienes dudas, contáctanos.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                        {tenant.whatsapp_number && (
                            <a
                                href={`https://wa.me/57${tenant.whatsapp_number}?text=${encodeURIComponent(`Hola, tengo una duda sobre mi pedido cancelado ${order.ticket_number}.`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white border-2 border-green-500 text-green-600 font-bold py-3 px-6 rounded-xl hover:bg-green-50 transition-all text-center"
                                aria-label="Contactar por WhatsApp sobre el pedido cancelado"
                            >
                                Contactar por WhatsApp
                            </a>
                        )}
                        <a
                            href={route('tenant.home', tenant.slug)}
                            className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-slate-800 transition-all text-center"
                            aria-label="Volver al menú"
                        >
                            Volver al Menú
                        </a>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    // Helper for estimated time
    const getEstimatedTime = () => {
        const createdAt = new Date(order.created_at);
        // Default prep time 45 mins + 15 mins delivery window
        const minTime = new Date(createdAt.getTime() + 45 * 60000);
        const maxTime = new Date(createdAt.getTime() + 60 * 60000);

        const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();

        return `${formatTime(minTime)} a ${formatTime(maxTime)}`;
    };

    const steps = [
        { status: 'pending', label: 'Recibido', icon: FileText },
        { status: 'confirmed', label: 'Confirmado', icon: ThumbsUp },
        { status: 'preparing', label: 'Preparando', icon: Clock },
        { status: 'ready', label: 'Listo', icon: CheckCircle2 },
        { status: 'completed', label: 'Entregado', icon: Home }
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status) === -1
        ? 0
        : steps.findIndex(s => s.status === order.status);

    // Map strict backend status to visual steps
    const getVisualStep = (status: string) => {
        if (status === 'pending') return 0;
        if (status === 'confirmed') return 1;
        if (status === 'preparing') return 2;
        if (status === 'ready') return 3;
        if (status === 'completed') return 4;
        return 0;
    };

    const activeStep = getVisualStep(order.status);

    const hasWhatsApp = Boolean(tenant.whatsapp_number);
    const whatsappMessage = `Hola *${tenant.name}*, tengo una duda sobre mi pedido *${order.ticket_number}*.`;
    const whatsappLink = hasWhatsApp ? `https://wa.me/57${tenant.whatsapp_number}?text=${encodeURIComponent(whatsappMessage)}` : '#';

    return (
        <PublicLayout bgColor="#f8fafc" showFloatingCart={false}>
            <Head title={`Pedido ${order.ticket_number}`} />

            <div className="max-w-lg mx-auto p-6 pb-24 min-h-[80vh] flex flex-col items-center pt-12">

                    {/* 1. Icon & Greeting — Ripple detrás del check, sin encerrar (capa ancha, sin overflow-hidden) */}
                    <div className="relative w-full flex flex-col items-center text-center animate-in zoom-in-50 duration-500 mb-6">
                        {/* Capa del Ripple: centrada, overflow-visible para que los círculos no queden encerrados */}
                        <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[560px] h-[560px] z-0 flex items-center justify-center pointer-events-none overflow-visible">
                            <Ripple mainCircleSize={100} mainCircleOpacity={0.22} numCircles={5} />
                        </div>
                        {/* Check y texto por encima */}
                        <div className="relative z-10 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">¡Pedido Recibido!</h1>
                        <p className="text-slate-500 mt-1 font-medium">Gracias, {order.customer_name.split(' ')[0]}</p>
                    </div>

                {/* 2. Time Info */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 w-full text-center mb-8 shadow-sm">
                    <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">Hora estimada de entrega</p>
                    <p className="text-slate-900 text-xl font-black">
                        {getEstimatedTime()}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2 leading-tight px-4">
                        Este tiempo es calculado basado en la hora del pedido y el tiempo de preparación del restaurante.
                    </p>
                </div>

                {/* 3. Timeline - More Aesthetic Version */}
                <div className="w-full mb-10 mt-2 px-2">
                    <div className="relative w-full">
                        {/* Background Line */}
                        <div className="absolute top-[18px] left-0 right-0 h-1 bg-slate-100 rounded-full z-0" />

                        {/* Progress Line */}
                        <div
                            className="absolute top-[18px] left-0 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full z-0 transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                        />

                        <div className="relative z-10 flex justify-between items-start">
                            {steps.map((step, index) => {
                                const isActive = index <= activeStep;
                                const isCurrent = index === activeStep;
                                const isCompleted = index < activeStep;

                                return (
                                    <div key={step.status} className="flex flex-col items-center group w-16">
                                        <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10
                                           ${isCompleted ? 'bg-green-500 border-2 border-green-500 text-white shadow-md shadow-green-200' : ''}
                                           ${isCurrent ? 'bg-white border-2 border-green-500 text-green-600 scale-110 shadow-lg shadow-green-100' : ''}
                                           ${!isActive ? 'bg-white border-2 border-slate-200 text-slate-300' : ''}
                                       `}>
                                            {isCurrent && (
                                                <span className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-20"></span>
                                            )}
                                            <step.icon className={`w-5 h-5 transition-transform duration-300 ${isCurrent ? 'scale-110' : ''}`} />
                                        </div>

                                        <div className={`mt-3 flex flex-col items-center transition-all duration-500 transform
                                            ${isActive ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-1'}
                                       `}>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider text-center leading-tight
                                                ${isActive ? 'text-slate-900' : 'text-slate-400'}
                                                ${isCurrent ? 'text-green-600' : ''}
                                            `}>
                                                {step.label}
                                            </span>
                                            {isCurrent && step.status !== 'completed' && (
                                                <span className="text-[9px] font-medium text-slate-400 animate-pulse mt-0.5">
                                                    En proceso...
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 4. Order Info & Value */}
                <div className="w-full flex justify-between items-end border-b border-slate-200 pb-4 mb-4">
                    <div className="text-left">
                        <p className="text-xs text-slate-500 font-medium">No. Pedido</p>
                        <p className="text-xl font-black text-slate-900">{order.ticket_number}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 font-medium">Valor Total</p>
                        <p className="text-xl font-black text-slate-900">{formatPrice(order.total)}</p>
                    </div>
                </div>

                {/* 5. Order Details */}
                <div className="w-full space-y-3 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detalles de Entrega</h3>

                    <div className="flex items-start gap-3">
                        <div className="mt-0.5"><Clock className="w-4 h-4 text-slate-400" /></div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{order.customer_name}</p>
                            <p className="text-xs text-slate-500">{order.customer_phone}</p>
                        </div>
                    </div>

                    {order.delivery_address && (
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5"><MapPin className="w-4 h-4 text-slate-400" /></div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">{order.delivery_address.neighborhood || 'Dirección'}</p>
                                <p className="text-xs text-slate-500">{order.delivery_address.address}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-3 border-t border-slate-200 pt-3 mt-1">
                        <div className="mt-0.5"><FileText className="w-4 h-4 text-slate-400" /></div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{order.items.length} Productos</p>
                            <p className="text-xs text-slate-500 line-clamp-1">
                                {order.items.map((i: any) => i.product?.name ?? i.product_name ?? 'Producto').join(', ')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 6. Buttons */}
                <div className={`grid gap-3 w-full ${hasWhatsApp ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {hasWhatsApp && (
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white border border-green-500 text-green-600 font-bold py-3.5 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-green-50 transition-all text-sm shadow-sm"
                            aria-label="Contactar al restaurante por WhatsApp"
                        >
                            <span>Contactar por WhatsApp</span>
                        </a>
                    )}
                    <a
                        href={route('tenant.home', tenant.slug)}
                        className="bg-slate-900 text-white font-bold py-3.5 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-slate-800 transition-all text-sm shadow-lg"
                        aria-label="Volver al inicio"
                    >
                        <span>Volver al Inicio</span>
                    </a>
                </div>

            </div>
        </PublicLayout>
    );
}
