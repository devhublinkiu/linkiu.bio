import React, { useState, useMemo } from 'react';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { getEcho } from '@/echo';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Label } from '@/Components/ui/label';
import { Separator } from '@/Components/ui/separator';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import {
    Clock,
    Users,
    Phone,
    CheckCircle,
    XCircle,
    Armchair,
    MapPin,
    Filter,
    Settings,
    DollarSign,
    Timer,
    CalendarDays,
    Pencil
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

/** Parse date string as LOCAL time. Extracts YYYY-MM-DD and creates local midnight. */
function parseLocalDate(dateStr: string): Date {
    const datePart = dateStr.substring(0, 10);
    return new Date(datePart + 'T00:00:00');
}
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from "@/Components/ui/switch";
import ReservationCalendar from '@/Components/Tenant/Admin/Gastronomy/Reservations/ReservationCalendar';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/Components/ui/empty';

interface Location {
    id: number;
    name: string;
    reservation_price_per_person: number;
    reservation_min_anticipation: number;
    reservation_slot_duration: number;
    reservation_payment_proof_required?: boolean;
}

interface Reservation {
    id: number;
    customer_id?: number | null;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    party_size: number;
    reservation_time: string;
    reservation_date?: string;
    status: 'pending' | 'confirmed' | 'seated' | 'cancelled' | 'no_show';
    notes?: string;
    table_id?: number | null;
    table?: { name: string };
    location?: { name: string };
    payment_proof?: string;
    payment_proof_url?: string | null;
}

interface Table {
    id: number;
    name: string;
    status: string;
    capacity?: number;
    location_id?: number;
    reservations?: {
        id: number;
        customer_name: string;
        reservation_time: string;
        reservation_date?: string;
        status: string;
        party_size: number;
    }[];
}

interface Tenant {
    id: number;
    name: string;
    slug: string;
}

interface CurrentUserRole {
    is_owner: boolean;
    permissions: string[];
}

interface Props {
    reservations: Reservation[];
    tables: Table[];
    locations: Location[];
    filters: { date: string; start_date?: string; end_date?: string; location_id?: string; view?: string };
}

type ViewMode = 'day' | 'week' | 'month';

export default function AdminReservationIndex({ reservations, tables, locations, filters }: Props) {
    const { currentTenant, currentUserRole } = usePage<PageProps & { currentTenant: Tenant; currentUserRole: CurrentUserRole }>().props;

    // Permission helpers
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    const hasPermission = (permission: string): boolean => {
        if (!currentUserRole) return false;
        return currentUserRole.is_owner ||
            currentUserRole.permissions.includes('*') ||
            currentUserRole.permissions.includes(permission);
    };

    const handleProtectedAction = (e: React.MouseEvent | null, permission: string, callback: () => void) => {
        if (e) e.preventDefault();
        if (hasPermission(permission)) {
            callback();
        } else {
            setShowPermissionModal(true);
        }
    };
    const [currentDate, setCurrentDate] = useState(() => {
        // Always use browser's local date to avoid UTC timezone offset issues
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    });
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [selectedLocationId, setSelectedLocationId] = useState(filters.location_id || '');

    // Modals
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [seatModalOpen, setSeatModalOpen] = useState(false);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
    const [targetStatus, setTargetStatus] = useState<string>('seated');
    const [editingConfigLocationId, setEditingConfigLocationId] = useState<string>('');
    const [cancelAlertOpen, setCancelAlertOpen] = useState(false);

    // Reschedule state
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [rescheduleDate, setRescheduleDate] = useState('');
    const [rescheduleTime, setRescheduleTime] = useState('');

    const configForm = useForm({
        reservation_price_per_person: 0,
        reservation_min_anticipation: 2,
        reservation_slot_duration: 60,
        reservation_payment_proof_required: false,
    });

    // Calculate date range based on view
    const getDateRange = (date: Date, view: ViewMode) => {
        if (view === 'day') return { start: date, end: date };
        if (view === 'week') return { start: startOfWeek(date, { weekStartsOn: 1 }), end: endOfWeek(date, { weekStartsOn: 1 }) };
        return { start: startOfMonth(date), end: endOfMonth(date) };
    };

    const fetchReservations = (date: Date, view: ViewMode, locationId: string) => {
        const { start, end } = getDateRange(date, view);
        router.get(route('tenant.admin.reservations.index', { tenant: currentTenant.slug }), {
            date: format(date, 'yyyy-MM-dd'),
            start_date: format(start, 'yyyy-MM-dd'),
            end_date: format(end, 'yyyy-MM-dd'),
            view,
            location_id: locationId === 'all' ? '' : locationId,
        }, { preserveState: true });
    };

    const handleDateChange = (date: Date) => {
        setCurrentDate(date);
        fetchReservations(date, viewMode, selectedLocationId);
    };

    const handleViewChange = (view: ViewMode) => {
        setViewMode(view);
        fetchReservations(currentDate, view, selectedLocationId);
    };

    const handleLocationChange = (locationId: string) => {
        setSelectedLocationId(locationId);
        fetchReservations(currentDate, viewMode, locationId);
    };

    // Real-time WebSocket listener
    React.useEffect(() => {
        const echo = getEcho();
        if (echo && currentTenant?.id) {
            echo.channel(`tenant.${currentTenant.id}.reservations`)
                .listen('.reservation.created', () => {
                    router.reload({ only: ['reservations'] });
                });
        }
        return () => {
            try {
                if (echo && currentTenant?.id && (echo as any).connector?.ably?.connection?.state === 'connected') {
                    (echo as any).leave(`tenant.${currentTenant.id}.reservations`);
                }
            } catch { /* Silent */ }
        };
    }, [currentTenant?.id]);

    // When clicking a reservation in the calendar
    const handleReservationClick = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setIsRescheduling(false);
        setRescheduleDate(reservation.reservation_date || '');
        setRescheduleTime(reservation.reservation_time?.substring(0, 5) || '');
        setDetailModalOpen(true);
    };

    // Reschedule handler
    const handleReschedule = () => {
        if (!selectedReservation) return;
        router.put(route('tenant.admin.reservations.update', {
            tenant: currentTenant.slug,
            reservation: selectedReservation.id
        }), {
            status: selectedReservation.status,
            reservation_date: rescheduleDate,
            reservation_time: rescheduleTime,
        }, {
            onSuccess: () => {
                toast.success('Reserva reagendada. Se notificó al cliente por WhatsApp.');
                setIsRescheduling(false);
                setDetailModalOpen(false);
            },
            onError: () => {
                toast.error('No se pudo reagendar la reserva. Intenta de nuevo.');
            },
        });
    };

    // Actions from detail modal
    const updateStatus = (reservation: Reservation, status: string) => {
        if (status === 'confirmed' && reservation.table_id) {
            router.put(route('tenant.admin.reservations.update', {
                tenant: currentTenant.slug,
                reservation: reservation.id
            }), { status: 'confirmed', table_id: reservation.table_id }, {
                onSuccess: () => {
                    toast.success('Reserva confirmada');
                    setDetailModalOpen(false);
                },
                onError: () => {
                    toast.error('No se pudo confirmar la reserva. Intenta de nuevo.');
                },
            });
            return;
        }

        if (status === 'seated' || status === 'confirmed') {
            setTargetStatus(status);
            setSelectedTableId(reservation.table_id || null);
            setDetailModalOpen(false);
            setSeatModalOpen(true);
            return;
        }

        router.put(route('tenant.admin.reservations.update', {
            tenant: currentTenant.slug,
            reservation: reservation.id
        }), { status }, {
            onSuccess: () => {
                toast.success(`Reserva ${status === 'cancelled' ? 'cancelada' : 'actualizada'}`);
                setDetailModalOpen(false);
            },
            onError: () => {
                toast.error('No se pudo actualizar la reserva. Intenta de nuevo.');
            },
        });
    };

    const confirmSeat = () => {
        if (!selectedReservation) return;
        router.put(route('tenant.admin.reservations.update', {
            tenant: currentTenant.slug,
            reservation: selectedReservation.id
        }), { status: targetStatus, table_id: selectedTableId }, {
            onSuccess: () => {
                setSeatModalOpen(false);
                toast.success(targetStatus === 'seated' ? 'Cliente sentado. Mesa ocupada.' : 'Reserva confirmada.');
            },
            onError: () => {
                toast.error('No se pudo completar la acción. Intenta de nuevo.');
            },
        });
    };

    // Settings
    const openSettings = () => {
        const locId = selectedLocationId && selectedLocationId !== 'all' ? selectedLocationId : (locations[0]?.id.toString() || '');
        setEditingConfigLocationId(locId);
        const loc = locations.find(l => l.id.toString() === locId);
        if (loc) {
            configForm.setData({
                reservation_price_per_person: loc.reservation_price_per_person,
                reservation_min_anticipation: loc.reservation_min_anticipation,
                reservation_slot_duration: loc.reservation_slot_duration,
                reservation_payment_proof_required: loc.reservation_payment_proof_required || false,
            });
        }
        setSettingsModalOpen(true);
    };

    const handleLocationConfigChange = (id: string) => {
        setEditingConfigLocationId(id);
        const loc = locations.find(l => l.id.toString() === id);
        if (loc) {
            configForm.setData({
                reservation_price_per_person: loc.reservation_price_per_person,
                reservation_min_anticipation: loc.reservation_min_anticipation,
                reservation_slot_duration: loc.reservation_slot_duration,
                reservation_payment_proof_required: loc.reservation_payment_proof_required || false,
            });
        }
    };

    const saveSettings = () => {
        configForm.put(route('tenant.admin.reservations.settings.update', {
            tenant: currentTenant.slug,
            location: editingConfigLocationId
        }), {
            onSuccess: () => {
                setSettingsModalOpen(false);
                toast.success('Configuración de sede actualizada');
            },
            onError: () => {
                toast.error('No se pudo actualizar la configuración. Intenta de nuevo.');
            },
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
            case 'confirmed': return <Badge variant="outline" className="bg-green-100 text-green-800">Confirmada</Badge>;
            case 'seated': return <Badge variant="outline" className="bg-blue-100 text-blue-800">Sentado</Badge>;
            case 'cancelled': return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelada</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AdminLayout title="Gestión de Reservas" breadcrumbs={[{ label: 'Gastronomía' }, { label: 'Reservas' }]}>
            <Head title="Gestión de Reservas" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-4">

                    {/* Mini Toolbar: Location filter + Settings */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-slate-400" />
                                <Select
                                    value={selectedLocationId || 'all'}
                                    onValueChange={handleLocationChange}
                                >
                                    <SelectTrigger className="w-[180px] h-9 text-sm">
                                        <SelectValue placeholder="Todas las Sedes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas las Sedes</SelectItem>
                                        {locations.map(loc => (
                                            <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={(e) => handleProtectedAction(e, 'reservations.update', openSettings)} className="gap-2">
                            <Settings className="w-4 h-4" /> Configuración
                        </Button>
                    </div>

                    {/* Calendar */}
                    {reservations.length === 0 && !selectedLocationId ? (
                        <Empty className="border-2 border-dashed rounded-xl bg-white py-12">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <CalendarDays className="size-4" />
                                </EmptyMedia>
                                <EmptyTitle>No hay reservas registradas</EmptyTitle>
                                <EmptyDescription>
                                    Las reservas creadas por los clientes aparecerán aquí.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <ReservationCalendar
                            reservations={reservations}
                            currentDate={currentDate}
                            viewMode={viewMode}
                            onViewChange={handleViewChange}
                            onDateChange={handleDateChange}
                            onReservationClick={handleReservationClick}
                        />
                    )}
                </div>
            </div>

            {/* Reservation Detail Modal */}
            <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Detalle de Reserva</DialogTitle>
                        <DialogDescription>
                            {selectedReservation && getStatusBadge(selectedReservation.status)}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedReservation && (
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-slate-800">
                                    <Users className="w-4 h-4 text-indigo-600" />
                                    <span className="font-bold text-lg">{selectedReservation.customer_name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 text-sm">
                                    <Phone className="w-4 h-4" />
                                    <span>{selectedReservation.customer_phone}</span>
                                </div>
                                {selectedReservation.location && (
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <MapPin className="w-4 h-4" />
                                        <span>{selectedReservation.location.name}</span>
                                    </div>
                                )}
                            </div>

                            <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm font-medium">
                                        <Clock className="w-4 h-4 text-indigo-600" />
                                        {selectedReservation.reservation_time.substring(0, 5)}
                                    </span>
                                    <span className="flex items-center gap-2 text-sm font-medium">
                                        <Users className="w-4 h-4 text-indigo-600" />
                                        {selectedReservation.party_size} personas
                                    </span>
                                </div>
                                {selectedReservation.table && (
                                    <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm">
                                        <Armchair className="w-4 h-4" />
                                        Mesa: {selectedReservation.table.name}
                                    </div>
                                )}
                                {selectedReservation.reservation_date && (
                                    <div className="text-xs text-slate-400">
                                        Fecha: {format(parseLocalDate(selectedReservation.reservation_date), "d 'de' MMMM, yyyy", { locale: es })}
                                    </div>
                                )}
                            </div>

                            {/* Reschedule Section */}
                            {selectedReservation.status !== 'cancelled' && selectedReservation.status !== 'seated' && (
                                <div className="border rounded-lg p-3 bg-white">
                                    {!isRescheduling ? (
                                        <button
                                            type="button"
                                            onClick={(e) => handleProtectedAction(e, 'reservations.update', () => setIsRescheduling(true))}
                                            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors w-full"
                                        >
                                            <CalendarDays className="w-4 h-4" />
                                            <Pencil className="w-3 h-3" />
                                            Reagendar reserva
                                        </button>
                                    ) : (
                                        <div className="space-y-3">
                                            <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                                <CalendarDays className="w-3.5 h-3.5" /> Reagendar reserva
                                            </p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label className="text-xs">Nueva fecha</Label>
                                                    <Input
                                                        type="date"
                                                        value={rescheduleDate}
                                                        onChange={(e) => setRescheduleDate(e.target.value)}
                                                        min={format(new Date(), 'yyyy-MM-dd')}
                                                        className="text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Nueva hora</Label>
                                                    <Input
                                                        type="time"
                                                        value={rescheduleTime}
                                                        onChange={(e) => setRescheduleTime(e.target.value)}
                                                        className="text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" variant="ghost" onClick={() => setIsRescheduling(false)}>Cancelar</Button>
                                                <Button
                                                    size="sm"
                                                    onClick={(e) => handleProtectedAction(e, 'reservations.update', handleReschedule)}
                                                    disabled={!rescheduleDate || !rescheduleTime}
                                                    className="gap-1"
                                                >
                                                    <CalendarDays className="w-3.5 h-3.5" /> Guardar y Notificar
                                                </Button>
                                            </div>
                                            <p className="text-[10px] text-slate-400">Se enviará notificación por WhatsApp al cliente con la nueva fecha/hora.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedReservation.notes && (
                                <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 italic">
                                    "{selectedReservation.notes}"
                                </div>
                            )}

                            {selectedReservation.payment_proof && selectedReservation.payment_proof_url && (
                                <div className="mt-2 border rounded-lg p-2 bg-slate-50">
                                    <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                                        <DollarSign className="w-3 h-3" /> Comprobante de Pago
                                    </p>
                                    <a href={selectedReservation.payment_proof_url} target="_blank" rel="noopener noreferrer" className="block relative group overflow-hidden rounded-md border border-slate-200">
                                        <img
                                            src={selectedReservation.payment_proof_url}
                                            alt="Comprobante"
                                            className="w-full h-auto max-h-[200px] object-cover transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                                            Clic para ver completo
                                        </div>
                                    </a>
                                </div>
                            )}

                            <Separator />

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {selectedReservation.status === 'pending' && (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="gap-1"
                                            onClick={(e) => handleProtectedAction(e, 'reservations.update', () => setCancelAlertOpen(true))}
                                        >
                                            <XCircle className="w-4 h-4" /> Cancelar
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="gap-1 ml-auto"
                                            onClick={(e) => handleProtectedAction(e, 'reservations.update', () => updateStatus(selectedReservation, 'confirmed'))}
                                        >
                                            <CheckCircle className="w-4 h-4" /> Confirmar + Asignar Mesa
                                        </Button>
                                    </>
                                )}
                                {selectedReservation.status === 'confirmed' && (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-1"
                                            onClick={(e) => handleProtectedAction(e, 'reservations.update', () => setCancelAlertOpen(true))}
                                        >
                                            <XCircle className="w-4 h-4" /> Cancelar
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="gap-1 ml-auto"
                                            onClick={(e) => handleProtectedAction(e, 'reservations.update', () => updateStatus(selectedReservation, 'seated'))}
                                        >
                                            <Armchair className="w-4 h-4" /> Sentar (Check-in)
                                        </Button>
                                    </>
                                )}
                                {(selectedReservation.status === 'cancelled' || selectedReservation.status === 'seated') && (
                                    <p className="text-xs text-slate-400 italic w-full text-center">
                                        {selectedReservation.status === 'seated' ? 'El cliente ya está sentado.' : 'Reserva cancelada.'}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Cancel Confirmation AlertDialog */}
            <AlertDialog open={cancelAlertOpen} onOpenChange={setCancelAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Cancelar esta reserva?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción cancelará la reserva de <strong>{selectedReservation?.customer_name}</strong> y liberará la mesa asignada. El cliente no será notificado automáticamente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Volver</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => {
                                if (selectedReservation) {
                                    updateStatus(selectedReservation, 'cancelled');
                                }
                                setCancelAlertOpen(false);
                            }}
                        >
                            Sí, cancelar reserva
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Seat Modal - Table Assignment */}
            <Dialog open={seatModalOpen} onOpenChange={setSeatModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Asignar Mesa a {selectedReservation?.customer_name}</DialogTitle>
                        <DialogDescription>
                            {selectedReservation && (
                                <span>Reserva para las <strong>{selectedReservation.reservation_time.substring(0, 5)}</strong> — {selectedReservation.party_size} personas</span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4 max-h-[400px] overflow-y-auto">
                        {tables
                            .filter(table => {
                                if (!selectedReservation?.location) return true;
                                const reservationLocationId = locations.find(l => l.name === selectedReservation.location?.name)?.id;
                                return !table.location_id || table.location_id === reservationLocationId;
                            })
                            .map(table => {
                            const tableReservations = table.reservations || [];
                            const hasReservations = tableReservations.length > 0;
                            const isSelected = selectedTableId === table.id;

                            return (
                                <button
                                    key={table.id}
                                    onClick={() => setSelectedTableId(table.id)}
                                    className={`rounded-xl border-2 p-3 text-left transition-all ${isSelected
                                        ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
                                        : table.status === 'occupied'
                                            ? 'border-red-200 bg-red-50 hover:border-red-400 opacity-75'
                                            : hasReservations
                                                ? 'border-amber-200 bg-amber-50 hover:border-amber-400'
                                                : 'border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-sm">{table.name}</span>
                                        {table.status === 'occupied' ? (
                                            <span className="text-[9px] font-black uppercase bg-red-500 text-white px-1.5 py-0.5 rounded-full">Ocupada (POS)</span>
                                        ) : hasReservations ? (
                                            <span className="text-[9px] font-black uppercase bg-amber-500 text-white px-1.5 py-0.5 rounded-full">Reservada</span>
                                        ) : (
                                            <span className="text-[9px] font-black uppercase bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">Libre</span>
                                        )}
                                    </div>
                                    {hasReservations && (
                                        <div className="space-y-1">
                                            {tableReservations.map((r) => (
                                                <div key={r.id} className="text-[10px] text-amber-800 bg-amber-100 rounded px-1.5 py-0.5">
                                                    <Clock className="w-2.5 h-2.5 inline mr-0.5" />
                                                    {r.reservation_time.substring(0, 5)} — {r.customer_name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {!hasReservations && table.status !== 'occupied' && (
                                        <p className="text-[10px] text-emerald-600 font-medium">Disponible</p>
                                    )}
                                    {table.status === 'occupied' && (
                                        <p className="text-[10px] text-red-600 font-medium">Mesa en servicio</p>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setSeatModalOpen(false)}>Cancelar</Button>
                        <Button
                            onClick={confirmSeat}
                            disabled={targetStatus === 'seated' && !selectedTableId}
                        >
                            {targetStatus === 'seated' ? 'Confirmar y Sentar' : 'Confirmar Reserva'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Config Settings Modal */}
            <Dialog open={settingsModalOpen} onOpenChange={setSettingsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-indigo-600" />
                            Configuración de Reservas
                        </DialogTitle>
                        <DialogDescription>
                            Ajusta los parámetros globales de reserva para tus sedes.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label>Seleccionar Sede para configurar</Label>
                            <Select value={editingConfigLocationId} onValueChange={handleLocationConfigChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona sede" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map(loc => (
                                        <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Timer className="w-4 h-4 text-slate-400" /> Anticipación Mínima (Horas)
                                </Label>
                                <Input
                                    type="number"
                                    step="0.5"
                                    value={configForm.data.reservation_min_anticipation}
                                    onChange={e => configForm.setData('reservation_min_anticipation', parseFloat(e.target.value))}
                                />
                                {configForm.errors.reservation_min_anticipation && (
                                    <p className="text-xs text-red-600">{configForm.errors.reservation_min_anticipation}</p>
                                )}
                                <p className="text-[11px] text-slate-500 italic">Ej: 0.5 para permitir reservas con 30 min de antelación.</p>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-400" /> Duración de la Reserva (Minutos)
                                </Label>
                                <Input
                                    type="number"
                                    step="15"
                                    value={configForm.data.reservation_slot_duration}
                                    onChange={e => configForm.setData('reservation_slot_duration', parseInt(e.target.value))}
                                />
                                {configForm.errors.reservation_slot_duration && (
                                    <p className="text-xs text-red-600">{configForm.errors.reservation_slot_duration}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-slate-400" /> Valor por Persona (Depósito)
                                </Label>
                                <Input
                                    type="number"
                                    value={configForm.data.reservation_price_per_person}
                                    onChange={e => configForm.setData('reservation_price_per_person', parseFloat(e.target.value))}
                                />
                                {configForm.errors.reservation_price_per_person && (
                                    <p className="text-xs text-red-600">{configForm.errors.reservation_price_per_person}</p>
                                )}
                                <p className="text-[11px] text-slate-500 italic">Monto informativo o garantía por comensal.</p>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold text-slate-700">Comprobante de Pago Obligatorio</Label>
                                    <p className="text-[10px] text-slate-500">Si se activa, el cliente deberá subir una foto del pago para completar la reserva.</p>
                                </div>
                                <Switch
                                    checked={configForm.data.reservation_payment_proof_required}
                                    onCheckedChange={val => configForm.setData('reservation_payment_proof_required', val)}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setSettingsModalOpen(false)}>Cancelar</Button>
                        <Button onClick={(e) => handleProtectedAction(e, 'reservations.update', saveSettings)} disabled={configForm.processing}>
                            {configForm.processing ? 'Guardando...' : 'Guardar Configuración'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />
        </AdminLayout >
    );
}

