import type { LucideIcon } from 'lucide-react';
import { Armchair, CalendarCheck, CircleCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Pasos del timeline de reserva (UI pública).
 * Mapeo típico desde BD: `pending` → solicitada, `confirmed` → confirmada, `seated` → sentado.
 */
export type TimelineShortReservationStatus = 'solicitada' | 'confirmada' | 'sentado';

const STEPS: {
    status: TimelineShortReservationStatus;
    label: string;
    Icon: LucideIcon;
}[] = [
    { status: 'solicitada', label: 'Solicitada', Icon: CalendarCheck },
    { status: 'confirmada', label: 'Confirmada', Icon: CircleCheck },
    { status: 'sentado', label: 'Sentado', Icon: Armchair },
];

const N = STEPS.length;

function statusToIndex(status: TimelineShortReservationStatus): number {
    const i = STEPS.findIndex((s) => s.status === status);
    return i >= 0 ? i : 0;
}

/** Estados en `gastronomy_reservations.status` → paso del timeline. */
export function mapBackendReservationStatusToTimeline(status: string): TimelineShortReservationStatus {
    switch (status) {
        case 'pending':
            return 'solicitada';
        case 'confirmed':
            return 'confirmada';
        case 'seated':
            return 'sentado';
        default:
            return 'solicitada';
    }
}

export interface TimelineShortReservationProps {
    status?: TimelineShortReservationStatus;
    className?: string;
}

function fillPercentToCurrentStep(currentIdx: number): number {
    if (N <= 1) return 100;
    return (currentIdx / (N - 1)) * 100;
}

export default function TimelineShortReservation({
    status = 'solicitada',
    className,
}: TimelineShortReservationProps) {
    const currentIdx = statusToIndex(status);
    const fillPercent = fillPercentToCurrentStep(currentIdx);
    const trackInsetPct = 100 / (2 * N);

    return (
        <div
            className={cn('w-full px-0 py-1', className)}
            data-name="TimelineShortReservation"
            role="group"
            aria-label={`Estado de la reserva: ${STEPS[currentIdx].label}`}
        >
            <div className="relative w-full">
                <div
                    className="pointer-events-none absolute top-[13px] z-0 h-0.5"
                    style={{
                        left: `${trackInsetPct}%`,
                        right: `${trackInsetPct}%`,
                    }}
                >
                    <div className="relative h-full w-full">
                        <div className="h-full w-full rounded-full bg-slate-200" />
                        <div
                            className="absolute left-0 top-0 h-full rounded-full bg-emerald-600 transition-[width] duration-300 ease-out"
                            style={{ width: `${fillPercent}%` }}
                        />
                    </div>
                </div>

                <div
                    className="relative z-10 grid w-full gap-0"
                    style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}
                >
                    {STEPS.map((step, i) => {
                        const isFuture = i > currentIdx;
                        return (
                            <div key={step.status} className="flex flex-col items-center justify-center">
                                <div
                                    className={cn(
                                        'flex size-7 shrink-0 items-center justify-center rounded-full transition-colors',
                                        isFuture
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-emerald-600 text-white shadow-sm',
                                    )}
                                >
                                    <step.Icon className="block size-4 shrink-0" strokeWidth={2} aria-hidden />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div
                className="mt-1 grid w-full gap-0 px-0"
                style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}
            >
                {STEPS.map((step, i) => (
                    <div key={`${step.status}-label`} className="flex justify-center px-0.5">
                        {i === currentIdx ? (
                            <span className="text-center text-[10px] font-medium leading-tight text-slate-600">
                                {step.label}
                            </span>
                        ) : (
                            <span className="min-h-[14px]" aria-hidden />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
