import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    MessageSquare,
    Search,
    Filter,
    Clock,
    AlertCircle,
    CheckCircle2,
    MoreHorizontal,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Badge } from '@/Components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { useState } from 'react';

interface Ticket {
    id: number;
    reference_id?: string;
    subject: string;
    status: 'open' | 'in_progress' | 'awaiting_response' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    updated_at: string;
    created_at: string;
    last_reply?: {
        message: string;
        created_at: string;
    };
}

interface Props {
    tickets: {
        data: Ticket[];
        links: any;
    };
    tenant: any;
    currentTenant: any;
    stats: {
        resolved: number;
        pending: number;
        total: number;
    };
}

const statusMap = {
    open: { label: 'Abierto', color: 'bg-blue-100 text-blue-700' },
    in_progress: { label: 'En progreso', color: 'bg-amber-100 text-amber-700' },
    awaiting_response: { label: 'Esperando respuesta', color: 'bg-purple-100 text-purple-700' },
    resolved: { label: 'Resuelto', color: 'bg-emerald-100 text-emerald-700' },
    closed: { label: 'Cerrado', color: 'bg-slate-100 text-slate-700' },
};

const priorityMap = {
    low: { label: 'Baja', color: 'bg-slate-100 text-slate-700' },
    medium: { label: 'Media', color: 'bg-blue-100 text-blue-700' },
    high: { label: 'Alta', color: 'bg-orange-100 text-orange-700' },
    urgent: { label: 'Urgente', color: 'bg-red-100 text-red-700' },
};

const categoryMap: Record<string, string> = {
    technical: 'Problema Técnico',
    billing: 'Facturación',
    account: 'Mi Cuenta',
    feature_request: 'Solicitud de Funcionalidad',
    other: 'Otros',
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

export default function Index({ tickets, currentTenant, stats }: Props) {
    const [ticketToClose, setTicketToClose] = useState<number | null>(null);

    const handleCloseTicket = () => {
        if (ticketToClose) {
            router.post(route('tenant.support.close', {
                tenant: currentTenant.slug,
                support: ticketToClose
            }), {}, {
                onSuccess: () => setTicketToClose(null)
            });
        }
    };

    return (
        <AdminLayout
            title="Soporte y Ayuda"
            breadcrumbs={[{ label: 'Soporte y Ayuda' }]}
        >
            <Head title="Soporte Técnico" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tus tickets</h1>
                        <p className="text-muted-foreground">Gestiona tus consultas y solicitudes de soporte.</p>
                    </div>
                    <Button asChild className="gap-2">
                        <Link href={route('tenant.support.create', { tenant: currentTenant.slug })} className="cursor-pointer">
                            <Plus className="h-4 w-4" /> Nuevo Ticket
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Resueltos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">{stats.resolved}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Buscar tickets..."
                                    className="pl-8"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                                    <Filter className="h-4 w-4" /> Filtros
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">ID</TableHead>
                                        <TableHead>Asunto</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Prioridad</TableHead>
                                        <TableHead>Última respuesta</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tickets.data.length > 0 ? (
                                        tickets.data.map((ticket) => (
                                            <TableRow key={ticket.id}>
                                                <TableCell className="font-mono text-xs font-bold text-blue-600 truncate max-w-[120px]">
                                                    {ticket.reference_id || `#${ticket.id}`}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <Link
                                                            href={route('tenant.support.show', { tenant: currentTenant.slug, support: ticket.id })}
                                                            className="font-semibold hover:underline decoration-primary cursor-pointer"
                                                        >
                                                            {ticket.subject}
                                                        </Link>
                                                        <span className="text-[10px] text-muted-foreground uppercase tracking-tight">{categoryMap[ticket.category] || ticket.category}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={(statusMap?.[ticket.status] || statusMap?.open || { color: 'bg-blue-100' }).color} variant="secondary">
                                                        {(statusMap?.[ticket.status] || statusMap?.open || { label: 'Abierto' }).label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${(priorityMap[ticket.priority] || priorityMap.medium || { color: 'bg-slate-400' }).color.split(' ')[0]}`} />
                                                        <span className="text-sm">{(priorityMap?.[ticket.priority] || priorityMap?.medium || { label: 'Media' }).label}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-xs">
                                                        <span className="text-muted-foreground line-clamp-1 italic">
                                                            "{ticket.last_reply?.message || 'Sin respuestas'}"
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            {safeFormatDate(ticket.updated_at)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="cursor-pointer">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                            <DropdownMenuItem asChild className="cursor-pointer">
                                                                <Link href={route('tenant.support.show', { tenant: currentTenant.slug, support: ticket.id })}>
                                                                    <ExternalLink className="mr-2 h-4 w-4" /> Ver conversación
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600 cursor-pointer"
                                                                onClick={() => setTicketToClose(ticket.id)}
                                                            >
                                                                Cerrar Ticket
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                                                    <p>No tienes tickets de soporte registrados.</p>
                                                    <Button variant="link" asChild className="cursor-pointer">
                                                        <Link href={route('tenant.support.create', { tenant: currentTenant.slug })}>
                                                            Crea tu primer ticket aquí
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={!!ticketToClose} onOpenChange={(open) => !open && setTicketToClose(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Cerrar este ticket de soporte?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción marcará el ticket como finalizado. No podrás enviar más respuestas a menos que sea reabierto por un administrador.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCloseTicket}
                            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        >
                            Confirmar y Cerrar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
