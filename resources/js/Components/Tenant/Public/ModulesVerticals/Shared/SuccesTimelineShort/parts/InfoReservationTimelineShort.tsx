import { ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InfoReservationTimelineShortProps {
    reservationDate: string;
    reservationTime: string;
    partySize: number;
    /** Número de reserva sin # (se muestra como #00xx). */
    reservationNumber: string;
    className?: string;
}

function formatTimeLabel(raw: string): string {
    const t = raw.trim();
    if (!t) return '—';
    const m = t.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (!m) return t;
    const d = new Date();
    d.setHours(parseInt(m[1], 10), parseInt(m[2], 10), 0, 0);
    return d.toLocaleTimeString('es', { hour: 'numeric', minute: '2-digit' });
}

export default function InfoReservationTimelineShort({
    reservationDate,
    reservationTime,
    partySize,
    reservationNumber,
    className,
}: InfoReservationTimelineShortProps) {
    const refDisplay = reservationNumber.startsWith('#') ? reservationNumber : `#${reservationNumber}`;
    const dateObj = new Date(`${reservationDate}T12:00:00`);
    const dateLine = Number.isNaN(dateObj.getTime())
        ? reservationDate
        : dateObj.toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' });
    const timeLine = formatTimeLabel(reservationTime);

    return (
        <div
            className={cn('flex w-full items-center justify-between gap-2', className)}
            data-name="InfoReservationTimelineShort"
        >
            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-normal leading-tight text-slate-500">Fecha y hora</p>
                <p className="mt-0.5 text-sm font-bold leading-tight text-slate-950">
                    {dateLine} · {timeLine}
                </p>
            </div>

            <div className="flex shrink-0 items-center justify-center text-slate-400" aria-hidden>
                <ArrowLeftRight className="size-5" strokeWidth={2} />
            </div>

            <div className="min-w-0 flex-1 text-right">
                <p className="text-[11px] font-normal leading-tight text-slate-500">Reserva</p>
                <p className="mt-0.5 text-sm font-bold leading-tight text-slate-950">{refDisplay}</p>
                <p className="mt-0.5 text-[11px] font-medium text-slate-600">
                    {partySize} {partySize === 1 ? 'persona' : 'personas'}
                </p>
            </div>
        </div>
    );
}
