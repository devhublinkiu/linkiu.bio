import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    MessageSquare,
    Search,
    Filter,
    MoreHorizontal,
    ExternalLink,
    UserPlus,
    Tag,
    Clock,
    User
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
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Pagination from '@/Components/Shared/Pagination';

interface Ticket {
    id: number;
    reference_id?: string;
    subject: string;
    status: 'open' | 'in_progress' | 'awaiting_response' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    updated_at: string;
    created_at: string;
    tenant: {
        id: number;
        name: string;
        slug: string;
    };
    user: {
        name: string;
        email: string;
    };
    assigned_to?: {
        name: string;
    };
}

interface Props {
    tickets: {
        data: Ticket[];
        links: any;
    };
    agents: any[];
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

export default function Index({ tickets, agents }: Props) {
    const handleAssign = (ticketId: number, agentId: string) => {
        router.post(route('superadmin.support.assign', ticketId), {
            assigned_to_id: agentId
        });
    };



    return (
        <SuperAdminLayout
            header="Soporte Técnico"
            breadcrumbs={[{ label: 'Soporte Técnico' }]}
        >
            <Head title="Soporte - SuperAdmin" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Centro de Soporte</h1>
                        <p className="text-muted-foreground">Gestiona los tickets de todos los tenants de la plataforma.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Abiertos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tickets.data.filter(t => t.status === 'open').length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Urgentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{tickets.data.filter(t => t.priority === 'urgent').length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Sin Asignar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600">{tickets.data.filter(t => !t.assigned_to).length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tickets.data.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Buscar por asunto, tenant o usuario..."
                                    className="pl-8"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="gap-2 font-semibold">
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
                                        <TableHead className="w-[80px]">ID</TableHead>
                                        <TableHead>Tenant / Usuario</TableHead>
                                        <TableHead>Asunto</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Prioridad</TableHead>
                                        <TableHead>Asignado a</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tickets.data.length > 0 ? (
                                        tickets.data.map((ticket) => (
                                            <TableRow key={ticket.id}>
                                                <TableCell className="font-mono text-[10px] font-bold">
                                                    <Link
                                                        href={route('superadmin.support.show', ticket.id)}
                                                        className="text-blue-600 hover:underline hover:text-blue-800"
                                                    >
                                                        {ticket.reference_id || `#${String(ticket.id).padStart(4, '0')}`}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900">{ticket.tenant.name}</span>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <User className="h-3 w-3" /> {ticket.user.name}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <Link
                                                            href={route('superadmin.support.show', ticket.id)}
                                                            className="font-semibold hover:underline decoration-primary line-clamp-1"
                                                        >
                                                            {ticket.subject}
                                                        </Link>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] text-muted-foreground uppercase bg-slate-100 px-1 rounded">{categoryMap[ticket.category] || ticket.category}</span>
                                                            <span className="text-[9px] text-slate-400 flex items-center gap-1">
                                                                <Clock className="h-2.5 w-2.5" /> {safeFormatDistance(ticket.created_at)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${(statusMap?.[ticket.status] || statusMap?.open || { color: 'bg-blue-100' }).color} border-none shadow-none`} variant="secondary">
                                                        {(statusMap?.[ticket.status] || statusMap?.open || { label: 'Abierto' }).label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${(priorityMap?.[ticket.priority] || priorityMap?.medium || { color: 'bg-slate-400' }).color}`} />
                                                        <span className="text-xs capitalize">{(priorityMap?.[ticket.priority] || priorityMap?.medium || { label: 'Media' }).label}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        defaultValue={ticket.assigned_to ? String(agents.find(a => a.name === ticket.assigned_to?.name)?.id) : undefined}
                                                        onValueChange={(val) => handleAssign(ticket.id, val)}
                                                    >
                                                        <SelectTrigger className="h-8 text-xs w-[140px] shadow-none border-dashed focus:ring-0 focus:ring-offset-0">
                                                            <SelectValue placeholder="Sin asignar" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {agents.map((agent) => (
                                                                <SelectItem key={agent.id} value={String(agent.id)}>
                                                                    {agent.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="cursor-pointer">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                            <DropdownMenuItem asChild className="cursor-pointer">
                                                                <Link href={route('superadmin.support.show', ticket.id)}>
                                                                    <ExternalLink className="mr-2 h-4 w-4" /> Ver Detalles
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-emerald-600 cursor-pointer">
                                                                Marcar como Resuelto
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                <div className="flex flex-col items-center justify-center gap-2 py-8">
                                                    <MessageSquare className="h-12 w-12 text-muted-foreground/20" />
                                                    <p className="text-muted-foreground font-medium">No se encontraron tickets.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {tickets.data.length > 0 && (
                            <div className="mt-4">
                                <Pagination links={tickets.links} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </SuperAdminLayout>
    );
}
