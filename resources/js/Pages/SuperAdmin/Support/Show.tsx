import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { getEcho } from '@/echo';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import {
    ChevronLeft,
    Send,
    User,
    Clock,
    Shield,
    CheckCircle2,
    RotateCcw,
    UserCheck,
    AlertCircle,
    Info,
    Lock,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Separator } from '@/Components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRef, useEffect } from 'react';

interface Reply {
    id: number;
    message: string;
    is_staff: boolean;
    created_at: string;
    user: {
        name: string;
        email: string;
    };
}

interface Ticket {
    id: number;
    reference_id?: string;
    subject: string;
    status: 'open' | 'in_progress' | 'awaiting_response' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    created_at: string;
    updated_at: string;
    tenant: {
        id: number;
        name: string;
        slug: string;
    };
    user: {
        id: number;
        name: string;
        email: string;
    };
    assigned_to_id: number | null;
    replies: Reply[];
}

interface Props {
    ticket: Ticket;
}

const statusMap = {
    open: { label: 'Abierto', color: 'bg-blue-100 text-blue-700' },
    in_progress: { label: 'En progreso', color: 'bg-amber-100 text-amber-700' },
    awaiting_response: { label: 'Esperando respuesta', color: 'bg-purple-100 text-purple-700' },
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

export default function Show({ ticket }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
    });

    const updateStatus = (status: string) => {
        router.patch(route('superadmin.support.update', ticket.id), {
            status,
            priority: ticket.priority
        });
    };

    const updatePriority = (priority: string) => {
        router.patch(route('superadmin.support.update', ticket.id), {
            status: ticket.status,
            priority
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.message.trim()) return;

        post(route('superadmin.support.reply', ticket.id), {
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
            const channelName = 'superadmin-updates';
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
    }, [ticket.id]);

    return (
        <SuperAdminLayout
            header={`Ticket ${ticket.reference_id || `#${ticket.id}`}`}
            breadcrumbs={[
                { label: 'Soporte Técnico', href: route('superadmin.support.index') },
                { label: ticket.reference_id || `#${ticket.id}` }
            ]}
        >
            <Head title={`${ticket.subject} - Soporte Admin`} />

            <div className="max-w-6xl mx-auto space-y-4">
                {/* Header Actions */}
                <div className="flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-tight">Referencia</span>
                        <Badge variant="outline" className="font-mono text-base font-bold">{ticket?.reference_id || `#${ticket?.id}`}</Badge>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={route('superadmin.support.index')}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <div>
                                    <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-1">
                                        <span className="font-semibold">{ticket.tenant.name}</span>
                                        <span>•</span>
                                        <span>{categoryMap[ticket.category] || ticket.category}</span>
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                    {(statusMap?.[ticket.status] || statusMap?.open || { label: 'Abierto' }).label}
                                </Badge>
                                <Badge variant="outline">
                                    {(priorityMap?.[ticket.priority] || priorityMap?.medium || { label: 'Media' }).label}
                                </Badge>
                            </div>
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
                                {ticket.replies.map((reply) => (
                                    <div
                                        key={reply.id}
                                        className={`flex ${reply.is_staff ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex gap-3 max-w-[85%] ${reply.is_staff ? 'flex-row-reverse' : ''}`}>
                                            <Avatar className="h-8 w-8 mt-1 border">
                                                <AvatarFallback className={reply.is_staff ? 'bg-blue-600 text-white text-[10px]' : 'bg-slate-200 text-slate-600 text-[10px]'}>
                                                    {reply.is_staff ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className={`space-y-1 ${reply.is_staff ? 'items-end' : 'items-start'}`}>
                                                <div className={`flex items-center gap-2 px-1 ${reply.is_staff ? 'flex-row-reverse' : ''}`}>
                                                    <span className="text-xs font-bold text-slate-700">{reply.user?.name || (reply.is_staff ? 'Soporte' : 'Usuario')}</span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {safeFormatDistance(reply.created_at)}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`p-4 rounded-2xl text-sm leading-relaxed ${reply.is_staff
                                                        ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-100 shadow-md'
                                                        : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'
                                                        }`}
                                                >
                                                    {reply.message}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Reply Form */}
                            <div className="p-4 border-t bg-white">
                                {ticket.status === 'closed' || ticket.status === 'resolved' ? (
                                    <div className="bg-slate-50 border rounded-xl p-4 flex flex-col items-center gap-3 text-center">
                                        <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-slate-900">Ticket {ticket.status === 'resolved' ? 'Resuelto' : 'Cerrado'}</p>
                                            <p className="text-xs text-muted-foreground">Este ticket ya no acepta nuevas respuestas.</p>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => updateStatus('open')}>
                                            Reabrir Ticket
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-3">
                                        <Textarea
                                            placeholder="Escribe tu respuesta aquí..."
                                            className="min-h-[100px] bg-slate-50/50 focus:bg-white resize-none border-slate-200"
                                            value={data.message}
                                            onChange={e => setData('message', e.target.value)}
                                        />
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-muted-foreground">
                                                Tu respuesta se enviará al correo del usuario.
                                            </span>
                                            <Button
                                                type="submit"
                                                disabled={processing || !data.message.trim()}
                                                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100"
                                            >
                                                {processing ? 'Enviando...' : <><Send className="h-4 w-4" /> Enviar Respuesta</>}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar Details */}
                    <div className="space-y-6">
                        <Card className="shadow-sm border-slate-200 overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b pb-4">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Info className="h-4 w-4 text-blue-600" />
                                    Detalles del Ticket
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Estado</label>
                                    <Select value={ticket.status} onValueChange={updateStatus}>
                                        <SelectTrigger className="h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="open">Abierto</SelectItem>
                                            <SelectItem value="in_progress">En progreso</SelectItem>
                                            <SelectItem value="awaiting_response">Esperando respuesta</SelectItem>
                                            <SelectItem value="resolved">Resuelto</SelectItem>
                                            <SelectItem value="closed">Cerrado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Prioridad</label>
                                    <Select value={ticket.priority} onValueChange={updatePriority}>
                                        <SelectTrigger className="h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Baja</SelectItem>
                                            <SelectItem value="medium">Media</SelectItem>
                                            <SelectItem value="high">Alta</SelectItem>
                                            <SelectItem value="urgent">Urgente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Categoría</label>
                                    <div className="text-sm font-semibold text-slate-700">{categoryMap[ticket.category] || ticket.category}</div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground">ID Referencia</label>
                                    <div className="text-sm font-mono text-blue-600 font-bold">{ticket.reference_id || `#${ticket.id}`}</div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Información del Cliente</p>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="text-[8px]">{ticket.user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold">{ticket.user.name}</span>
                                                <span className="text-[10px] text-muted-foreground">{ticket.user.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Tienda (Tenant)</p>
                                        <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 flex items-center justify-between">
                                            <span className="text-xs font-medium">{ticket.tenant.name}</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                                                <Link href={route('tenants.show', ticket.tenant.id)}>
                                                    <ExternalLink className="h-3 w-3" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-slate-200">
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100/50">
                                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold">Acción Rápida</p>
                                        <button
                                            onClick={() => updateStatus('resolved')}
                                            className="text-[10px] hover:underline"
                                        >
                                            Resolver ticket ahora
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}

