import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, useForm, Link, usePage, router } from '@inertiajs/react';
import {
    ChevronLeft,
    Send,
    User,
    ShieldCheck,
    Clock,
    CheckCircle2,
    Lock,
    RefreshCw,
    HelpCircle
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Badge } from '@/Components/ui/badge';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { PageProps } from '@/types';
import { getEcho } from '@/echo';

interface Reply {
    id: number;
    message: string;
    is_staff: boolean;
    created_at: string;
    user?: {
        name: string;
        profile_photo_url?: string;
    };
}

interface Ticket {
    id: number;
    reference_id?: string;
    subject: string;
    status: 'open' | 'in_progress' | 'awaiting_response' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    message: string;
    created_at: string;
    updated_at: string;
    replies: Reply[];
}

interface Props {
    ticket: Ticket;
    currentTenant: any;
}

const statusMap = {
    open: { label: 'Abierto', color: 'bg-blue-100 text-blue-700' },
    in_progress: { label: 'En progreso', color: 'bg-amber-100 text-amber-700' },
    awaiting_response: { label: 'Esperando tu respuesta', color: 'bg-purple-100 text-purple-700' },
    resolved: { label: 'Resuelto', color: 'bg-emerald-100 text-emerald-700' },
    closed: { label: 'Cerrado', color: 'bg-slate-100 text-slate-700' },
};

const priorityMap = {
    low: { label: 'Baja', color: 'bg-slate-400' },
    medium: { label: 'Media', color: 'bg-blue-500' },
    high: { label: 'Alta', color: 'bg-orange-500' },
    urgent: { label: 'Urgente', color: 'bg-red-500' },
};

const categoryMap: Record<string, string> = {
    technical: 'Problema Técnico',
    billing: 'Facturación',
    account: 'Mi Cuenta',
    feature_request: 'Solicitud de Funcionalidad',
    other: 'Otros',
};

const safeFormatDistance = (dateStr: any) => {
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'recientemente';
        return formatDistanceToNow(date, { addSuffix: true, locale: es });
    } catch (e) {
        return 'recientemente';
    }
};

const safeFormatDate = (dateStr: any) => {
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'Fecha no disponible';
        return date.toLocaleString();
    } catch (e) {
        return 'Fecha no disponible';
    }
};

export default function Show({ ticket, currentTenant }: Props) {
    const { auth } = usePage<PageProps>().props;
    const scrollRef = useRef<HTMLDivElement>(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
    });

    const isClosed = ticket.status === 'closed' || ticket.status === 'resolved';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.message.trim()) return;

        post(route('tenant.support.reply', { tenant: currentTenant.slug, ticket: ticket.id }), {
            onSuccess: () => {
                reset('message');
            },
        });
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [ticket.replies]);

    // Handle real-time updates (client-side echo registration)
    useEffect(() => {
        const echo = getEcho();
        if (echo) {
            const channelName = `tenant-updates.${currentTenant.id}`;
            echo.channel(channelName)
                .listen('.ticket.replied', (e: any) => {
                    if (e.ticket_id === ticket.id) {
                        console.log('[Echo] Real-time reply received for this ticket:', e);
                        router.reload();
                    }
                });

            return () => {
                try {
                    if (typeof (echo as any).leave === 'function') {
                        (echo as any).leave(channelName);
                    }
                } catch {
                    // Silent fail
                }
            };
        }
    }, [ticket.id, currentTenant.id]);

    return (
        <AdminLayout
            title={`Ticket ${ticket.reference_id || `#${ticket.id}`}`}
            breadcrumbs={[
                { label: 'Soporte y Ayuda', href: route('tenant.support.index', { tenant: currentTenant.slug }) },
                { label: ticket.reference_id || `#${ticket.id}` }
            ]}
        >
            <Head title={`${ticket.subject} - Soporte`} />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Referencia prominent ID */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground uppercase">Referencia</span>
                        <Badge variant="outline" className="font-mono text-base font-bold">{ticket.reference_id || `#${ticket.id}`}</Badge>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={route('tenant.support.index', { tenant: currentTenant.slug })}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <div>
                                    <CardTitle className="text-xl">{ticket.subject}</CardTitle>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="secondary">
                                            {(statusMap?.[ticket.status] || statusMap?.open || { label: 'Ticket' }).label}
                                        </Badge>
                                        <Badge variant="outline">
                                            {(priorityMap?.[ticket.priority] || priorityMap?.medium || { label: 'Media' }).label}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => router.reload()}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Chat Area */}
                    <Card className="lg:col-span-3">
                        <CardContent className="p-0">
                            <div
                                ref={scrollRef}
                                className="h-[calc(100vh-400px)] overflow-y-auto p-6 space-y-6"
                            >
                                {/* Original Message (First Reply) */}
                                {ticket.replies.length > 0 && (
                                    <div className="flex gap-4">
                                        <Avatar className="h-10 w-10 border-2 border-primary/10">
                                            <AvatarImage src={auth.user.profile_photo_url || (ticket.replies[0]?.user?.profile_photo_url)} />
                                            <AvatarFallback>{(auth.user.name || ticket.replies[0]?.user?.name || 'U').charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1 max-w-[85%]">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm">{auth.user.name || ticket.replies[0]?.user?.name}</span>
                                                <Badge variant="secondary" className="text-xs h-4">Original</Badge>
                                            </div>
                                            <Card className="border-slate-200">
                                                <CardContent className="p-4 text-sm">
                                                    {ticket.replies[0]?.message}
                                                </CardContent>
                                            </Card>
                                            <p className="text-xs text-muted-foreground">
                                                {safeFormatDate(ticket.created_at || ticket.replies[0]?.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Conversation Replies (skipping the first one) */}
                                {ticket.replies.slice(1).map((reply) => {
                                    const isSupport = reply.is_staff;
                                    return (
                                        <div
                                            key={reply.id}
                                            className={isSupport ? "flex gap-4" : "flex gap-4 flex-row-reverse"}
                                        >
                                            <Avatar className={isSupport ? "h-10 w-10 border-2 border-primary/10" : "h-10 w-10 border-2 border-blue-500/20"}>
                                                {isSupport ? (
                                                    <AvatarFallback className="bg-slate-200 text-slate-600">
                                                        <ShieldCheck className="h-5 w-5" />
                                                    </AvatarFallback>
                                                ) : (
                                                    <>
                                                        <AvatarImage src={reply.user?.profile_photo_url} />
                                                        <AvatarFallback>{reply.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                                                    </>
                                                )}
                                            </Avatar>
                                            <div className={isSupport ? "space-y-1 max-w-[85%]" : "space-y-1 max-w-[85%] items-end"}>
                                                <div className={isSupport ? "flex items-center gap-2" : "flex items-center gap-2 flex-row-reverse"}>
                                                    <span className="font-semibold text-sm">
                                                        {isSupport ? 'Soporte Linkiu' : (reply.user?.name || 'Voz del Cliente')}
                                                    </span>
                                                    {isSupport && (
                                                        <Badge variant="secondary" className="text-xs h-4">Oficial</Badge>
                                                    )}
                                                </div>
                                                <div className={isSupport
                                                    ? "p-4 rounded-2xl text-sm bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm"
                                                    : "p-4 rounded-2xl text-sm bg-blue-600 text-white rounded-tr-none shadow-md"
                                                }>
                                                    {reply.message}
                                                </div>
                                                <span className={isSupport ? "text-xs text-muted-foreground block" : "text-xs text-muted-foreground block text-right"}>
                                                    {safeFormatDistance(reply.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30">
                                {isClosed ? (
                                    <div className="flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-muted-foreground gap-2">
                                        <Lock className="h-4 w-4" />
                                        <span className="text-sm">Este ticket está cerrado y no permite más respuestas.</span>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-2">
                                        <div className="relative">
                                            <Textarea
                                                placeholder="Escribe tu respuesta aquí..."
                                                value={data.message}
                                                onChange={e => setData('message', e.target.value)}
                                                className="min-h-[100px] pr-12"
                                            />
                                            <Button
                                                type="submit"
                                                size="icon"
                                                disabled={processing || !data.message.trim()}
                                                className="absolute bottom-3 right-3 h-8 w-8"
                                            >
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <HelpCircle className="h-3 w-3" /> Soporte te responderá lo antes posible.
                                            </span>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar Details */}
                    <div className="space-y-6">
                        <Card className="border-slate-200 shadow-sm overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b pb-3">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Información</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase text-slate-400 font-bold">Categoría</Label>
                                    <div className="text-sm font-semibold text-slate-700">{categoryMap[ticket.category] || ticket.category}</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase text-slate-400 font-bold">ID de Referencia</Label>
                                    <div className="text-sm font-mono text-slate-600">{ticket.reference_id || `#${ticket.id}`}</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase text-slate-400 font-bold">Última actualización</Label>
                                    <div className="text-xs text-slate-600">
                                        {safeFormatDate(ticket.updated_at)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm bg-blue-50/30">
                            <CardHeader className="pb-2 text-center">
                                <HelpCircle className="h-8 w-8 mx-auto text-blue-500/50" />
                                <CardTitle className="text-sm">¿Necesitas algo más?</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center space-y-4">
                                <p className="text-xs text-muted-foreground">
                                    Si el problema persiste o tienes una nueva consulta, puedes abrir un nuevo ticket.
                                </p>
                                <Button className="w-full cursor-pointer" asChild>
                                    <Link href={route('tenant.support.create', { tenant: currentTenant.slug })}>
                                        Nuevo Ticket
                                    </Link>
                                </Button>

                                {!isClosed && (
                                    <Button
                                        variant="destructive"
                                        className="w-full gap-2 cursor-pointer"
                                        onClick={() => {
                                            if (confirm('¿Estás seguro de que deseas cerrar este ticket? No podrás enviar más respuestas.')) {
                                                router.post(route('tenant.support.close', { tenant: currentTenant.slug, support: ticket.id }));
                                            }
                                        }}
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        Cerrar Ticket
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function Info({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
    )
}
