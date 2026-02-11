import React, { useState, useMemo } from 'react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    Users,
    Phone,
    Armchair,
    Eye
} from 'lucide-react';
import {
    format,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    isToday,
    addDays,
    addWeeks,
    addMonths,
    subDays,
    subWeeks,
    subMonths,
    getDay,
    isSameMonth
} from 'date-fns';

/**
 * Parse a date string as LOCAL time (not UTC).
 * Handles both "2026-02-10" and "2026-02-10T00:00:00.000000Z" formats.
 * Always extracts the YYYY-MM-DD portion and creates local midnight.
 */
function parseLocalDate(dateStr: string): Date {
    // Extract just the date portion (first 10 chars: YYYY-MM-DD)
    const datePart = dateStr.substring(0, 10);
    return new Date(datePart + 'T00:00:00');
}
import { es } from 'date-fns/locale';

interface Reservation {
    id: number;
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
}

type ViewMode = 'day' | 'week' | 'month';

interface ReservationCalendarProps {
    reservations: Reservation[];
    currentDate: Date;
    viewMode: ViewMode;
    onViewChange: (view: ViewMode) => void;
    onDateChange: (date: Date) => void;
    onReservationClick: (reservation: Reservation) => void;
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 7:00 to 22:00

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    confirmed: 'bg-emerald-100 border-emerald-300 text-emerald-800',
    seated: 'bg-blue-100 border-blue-300 text-blue-800',
    cancelled: 'bg-red-100 border-red-300 text-red-800',
    no_show: 'bg-slate-100 border-slate-300 text-slate-600',
};

const STATUS_DOT: Record<string, string> = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-emerald-500',
    seated: 'bg-blue-500',
    cancelled: 'bg-red-500',
    no_show: 'bg-slate-400',
};

export default function ReservationCalendar({
    reservations,
    currentDate,
    viewMode,
    onViewChange,
    onDateChange,
    onReservationClick,
}: ReservationCalendarProps) {

    const navigate = (direction: 'prev' | 'next') => {
        const fn = direction === 'prev'
            ? viewMode === 'day' ? subDays : viewMode === 'week' ? subWeeks : subMonths
            : viewMode === 'day' ? addDays : viewMode === 'week' ? addWeeks : addMonths;
        onDateChange(fn(currentDate, 1));
    };

    const goToToday = () => onDateChange(new Date());

    const headerLabel = useMemo(() => {
        if (viewMode === 'day') return format(currentDate, "EEEE d 'de' MMMM, yyyy", { locale: es });
        if (viewMode === 'week') {
            const start = startOfWeek(currentDate, { weekStartsOn: 1 });
            const end = endOfWeek(currentDate, { weekStartsOn: 1 });
            return `${format(start, "d MMM", { locale: es })} — ${format(end, "d MMM yyyy", { locale: es })}`;
        }
        return format(currentDate, "MMMM yyyy", { locale: es });
    }, [currentDate, viewMode]);

    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate('prev')}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToToday} className="text-xs font-medium">
                        Hoy
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate('next')}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                    <h2 className="text-sm font-bold text-slate-800 ml-2 capitalize">{headerLabel}</h2>
                </div>
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                    {(['day', 'week', 'month'] as ViewMode[]).map((v) => (
                        <button
                            key={v}
                            onClick={() => onViewChange(v)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === v
                                ? 'bg-white shadow text-indigo-700'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {v === 'day' ? 'Día' : v === 'week' ? 'Semana' : 'Mes'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {viewMode === 'month' && (
                <MonthView
                    currentDate={currentDate}
                    reservations={reservations}
                    onDayClick={(date) => { onDateChange(date); onViewChange('day'); }}
                    onReservationClick={onReservationClick}
                />
            )}
            {viewMode === 'week' && (
                <WeekView
                    currentDate={currentDate}
                    reservations={reservations}
                    onReservationClick={onReservationClick}
                    onDayClick={(date) => { onDateChange(date); onViewChange('day'); }}
                />
            )}
            {viewMode === 'day' && (
                <DayView
                    currentDate={currentDate}
                    reservations={reservations}
                    onReservationClick={onReservationClick}
                />
            )}
        </div>
    );
}

// ==================== MONTH VIEW ====================
function MonthView({ currentDate, reservations, onDayClick, onReservationClick }: {
    currentDate: Date;
    reservations: Reservation[];
    onDayClick: (date: Date) => void;
    onReservationClick: (r: Reservation) => void;
}) {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: calStart, end: calEnd });

    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    const getReservationsForDay = (day: Date) =>
        reservations.filter(r => {
            const rDate = r.reservation_date ? parseLocalDate(r.reservation_date) : null;
            return rDate && isSameDay(rDate, day);
        });

    return (
        <div className="p-2">
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
                {dayNames.map(d => (
                    <div key={d} className="text-center text-[11px] font-bold text-slate-400 uppercase py-2">{d}</div>
                ))}
            </div>
            {/* Day cells */}
            <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-lg overflow-hidden">
                {days.map((day) => {
                    const dayReservations = getReservationsForDay(day);
                    const inMonth = isSameMonth(day, currentDate);
                    const today = isToday(day);
                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => onDayClick(day)}
                            className={`min-h-[90px] p-1.5 text-left transition-colors ${inMonth ? 'bg-white hover:bg-indigo-50' : 'bg-slate-50/50 text-slate-300'
                                } ${today ? 'ring-2 ring-inset ring-indigo-500' : ''}`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-bold ${today ? 'bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : ''}`}>
                                    {format(day, 'd')}
                                </span>
                                {dayReservations.length > 0 && (
                                    <Badge variant="outline" className="text-[9px] h-4 px-1 font-black bg-indigo-50 text-indigo-700 border-indigo-200">
                                        {dayReservations.length}
                                    </Badge>
                                )}
                            </div>
                            <div className="space-y-0.5">
                                {dayReservations.slice(0, 3).map((r) => (
                                    <div
                                        key={r.id}
                                        onClick={(e) => { e.stopPropagation(); onReservationClick(r); }}
                                        className={`text-[9px] leading-tight px-1 py-0.5 rounded border truncate cursor-pointer hover:opacity-80 ${STATUS_COLORS[r.status]}`}
                                    >
                                        {r.reservation_time?.substring(0, 5)} {r.customer_name}
                                    </div>
                                ))}
                                {dayReservations.length > 3 && (
                                    <div className="text-[9px] text-slate-400 pl-1">+{dayReservations.length - 3} más</div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ==================== WEEK VIEW ====================
function WeekView({ currentDate, reservations, onReservationClick, onDayClick }: {
    currentDate: Date;
    reservations: Reservation[];
    onReservationClick: (r: Reservation) => void;
    onDayClick: (date: Date) => void;
}) {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });

    const getReservationsForDay = (day: Date) =>
        reservations.filter(r => {
            const rDate = r.reservation_date ? parseLocalDate(r.reservation_date) : null;
            return rDate && isSameDay(rDate, day);
        });

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[700px]">
                {/* Time column + Day columns */}
                <div className="grid grid-cols-[60px_repeat(7,1fr)]">
                    {/* Header row */}
                    <div className="border-b border-r bg-slate-50 p-2" />
                    {days.map((day) => (
                        <button
                            key={day.toISOString()}
                            onClick={() => onDayClick(day)}
                            className={`border-b border-r p-2 text-center hover:bg-indigo-50 transition-colors ${isToday(day) ? 'bg-indigo-50' : 'bg-slate-50'
                                }`}
                        >
                            <div className="text-[10px] uppercase font-bold text-slate-400">
                                {format(day, 'EEE', { locale: es })}
                            </div>
                            <div className={`text-sm font-black mt-0.5 ${isToday(day) ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full mx-auto' : 'text-slate-700'
                                }`}>
                                {format(day, 'd')}
                            </div>
                        </button>
                    ))}

                    {/* Time rows */}
                    {HOURS.map((hour) => (
                        <React.Fragment key={hour}>
                            <div className="border-r border-b px-2 py-3 text-[10px] font-bold text-slate-400 text-right">
                                {`${hour}:00`}
                            </div>
                            {days.map((day) => {
                                const dayRes = getReservationsForDay(day);
                                const hourRes = dayRes.filter(r => {
                                    const h = parseInt(r.reservation_time?.substring(0, 2) || '0');
                                    return h === hour;
                                });
                                return (
                                    <div key={`${day.toISOString()}-${hour}`} className="border-r border-b p-0.5 min-h-[48px] relative">
                                        {hourRes.map((r) => (
                                            <button
                                                key={r.id}
                                                onClick={() => onReservationClick(r)}
                                                className={`w-full text-left text-[10px] leading-tight px-1.5 py-1 rounded border mb-0.5 cursor-pointer hover:shadow transition-shadow ${STATUS_COLORS[r.status]}`}
                                            >
                                                <div className="font-bold truncate">{r.customer_name}</div>
                                                <div className="flex items-center gap-1 opacity-70">
                                                    <Clock className="w-2.5 h-2.5" />
                                                    {r.reservation_time?.substring(0, 5)}
                                                    <Users className="w-2.5 h-2.5 ml-1" />
                                                    {r.party_size}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ==================== DAY VIEW ====================
function DayView({ currentDate, reservations, onReservationClick }: {
    currentDate: Date;
    reservations: Reservation[];
    onReservationClick: (r: Reservation) => void;
}) {
    const dayReservations = reservations.filter(r => {
        const rDate = r.reservation_date ? parseLocalDate(r.reservation_date) : null;
        return rDate && isSameDay(rDate, currentDate);
    });

    // Group by hour
    const groupedByHour = HOURS.map(hour => ({
        hour,
        label: `${hour}:00`,
        reservations: dayReservations.filter(r => {
            const h = parseInt(r.reservation_time?.substring(0, 2) || '0');
            return h === hour;
        })
    }));

    const pendingCount = dayReservations.filter(r => r.status === 'pending').length;
    const confirmedCount = dayReservations.filter(r => r.status === 'confirmed').length;
    const seatedCount = dayReservations.filter(r => r.status === 'seated').length;

    return (
        <div>
            {/* Day summary bar */}
            <div className="flex items-center gap-4 px-4 py-3 bg-slate-50/70 border-b text-xs">
                <span className="font-bold text-slate-600">
                    {dayReservations.length} reservas
                </span>
                {pendingCount > 0 && (
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        {pendingCount} pendientes
                    </span>
                )}
                {confirmedCount > 0 && (
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {confirmedCount} confirmadas
                    </span>
                )}
                {seatedCount > 0 && (
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        {seatedCount} sentados
                    </span>
                )}
            </div>

            {/* Timeline */}
            <div className="divide-y">
                {groupedByHour.map(({ hour, label, reservations: hourRes }) => (
                    <div key={hour} className="grid grid-cols-[70px_1fr] min-h-[56px]">
                        <div className="flex items-start justify-end pr-3 pt-2 text-xs font-bold text-slate-400 border-r">
                            {label}
                        </div>
                        <div className="p-1.5 space-y-1.5">
                            {hourRes.map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => onReservationClick(r)}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all hover:shadow-md cursor-pointer ${STATUS_COLORS[r.status]}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${STATUS_DOT[r.status]}`} />
                                            <span className="font-bold text-sm">{r.customer_name}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs opacity-70">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {r.reservation_time?.substring(0, 5)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {r.party_size}
                                            </span>
                                            {r.table && (
                                                <span className="flex items-center gap-1 font-medium">
                                                    <Armchair className="w-3 h-3" />
                                                    {r.table.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {r.notes && (
                                        <p className="text-[10px] mt-1 italic opacity-60 truncate">"{r.notes}"</p>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
