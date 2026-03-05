import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from '@/Components/ui/empty';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/Components/ui/dialog';
import { CalendarCheck, Loader2, Phone, Mail, MessageSquare } from 'lucide-react';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import SharedPagination from '@/Components/Shared/Pagination';

interface Appointment {
    id: number;
    guest_name: string;
    guest_phone: string;
    guest_email: string | null;
    appointment_type: string;
    preferred_date: string | null;
    assigned_date: string | null;
    notes: string | null;
    status: string;
    created_at: string;
}

interface Props {
    appointments: {
        data: Appointment[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
    typeLabels: Record<string, string>;
    statusLabels: Record<string, string>;
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 border-amber-300',
    contacted: 'bg-sky-100 text-sky-800 border-sky-300',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    cancelled: 'bg-slate-100 text-slate-600 border-slate-300',
};

export default function Index({ appointments, typeLabels, statusLabels }: Props) {
    const { currentTenant, currentUserRole } = usePage<PageProps>().props;
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [status, setStatus] = useState('');
    const [assignedDate, setAssignedDate] = useState('');
    const [updating, setUpdating] = useState(false);

    const hasPermission = (permission: string) => {
        if (!currentUserRole) return false;
        return currentUserRole.is_owner === true
            || currentUserRole.permissions?.includes('*') === true
            || currentUserRole.permissions?.includes(permission) === true;
    };

    const withPermission = (permission: string, fn: () => void) => {
        if (hasPermission(permission)) fn();
        else setShowPermissionModal(true);
    };

    const openEdit = (apt: Appointment) => {
        setEditingId(apt.id);
        setStatus(apt.status);
        setAssignedDate(apt.assigned_date ? apt.assigned_date.slice(0, 10) : '');
    };

    const saveUpdate = () => {
        if (editingId == null) return;
        setUpdating(true);
        router.put(route('tenant.admin.appointments.update', [currentTenant?.slug, editingId]), {
            status,
            assigned_date: assignedDate || null,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Cita actualizada');
                setEditingId(null);
            },
            onError: () => toast.error('No se pudo actualizar'),
            onFinish: () => setUpdating(false),
        });
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <AdminLayout title="Citas">
            <Head title="Citas" />

            <PermissionDeniedModal open={showPermissionModal} onOpenChange={setShowPermissionModal} />

            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Citas</h1>
                    <p className="text-sm text-muted-foreground">
                        Solicitudes de cita (oración, consejería, reunión). Confirma o asigna hora desde aquí.
                    </p>
                </div>

                {appointments.data.length === 0 ? (
                    <Card>
                        <CardContent className="py-16">
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <CalendarCheck className="h-5 w-5" />
                                    </EmptyMedia>
                                    <EmptyTitle>No hay citas solicitadas</EmptyTitle>
                                    <EmptyDescription>
                                        Cuando alguien solicite una cita desde tu enlace público, aparecerá aquí.
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fecha solicitud</TableHead>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Contacto</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Fecha asignada</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {appointments.data.map((apt) => (
                                            <TableRow key={apt.id}>
                                                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                                                    {formatDate(apt.created_at)}
                                                </TableCell>
                                                <TableCell className="font-medium">{apt.guest_name}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-0.5 text-sm">
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="size-3.5" /> {apt.guest_phone}
                                                        </span>
                                                        {apt.guest_email && (
                                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                                <Mail className="size-3.5" /> {apt.guest_email}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{typeLabels[apt.appointment_type] ?? apt.appointment_type}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                                                    {apt.assigned_date ? formatDate(apt.assigned_date) : '—'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={STATUS_COLORS[apt.status] ?? ''}>
                                                        {statusLabels[apt.status] ?? apt.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => withPermission('appointments.update', () => openEdit(apt))}
                                                    >
                                                        Gestionar
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {appointments.last_page > 1 && (
                            <SharedPagination links={appointments.links} />
                        )}
                    </>
                )}
            </div>

            <Dialog open={editingId !== null} onOpenChange={(open) => !open && setEditingId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Gestionar cita</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Estado</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(statusLabels)
                                        .filter(([value]) => value !== '')
                                        .map(([value, label]) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="assigned_date">Fecha asignada (opcional)</Label>
                            <Input
                                id="assigned_date"
                                type="date"
                                value={assignedDate}
                                onChange={(e) => setAssignedDate(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Fecha en que se contactó o se prestó la cita.</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingId(null)}>Cancelar</Button>
                        <Button onClick={saveUpdate} disabled={updating} className="gap-2">
                            {updating && <Loader2 className="size-4 animate-spin" />}
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
