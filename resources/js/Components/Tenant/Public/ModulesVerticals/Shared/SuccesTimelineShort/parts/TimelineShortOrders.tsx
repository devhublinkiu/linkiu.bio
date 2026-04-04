import type { LucideIcon } from 'lucide-react';
import { CircleCheck, HouseHeart, WandSparkles, Store, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TimelineShortOrderStatus =
    | 'recibido'
    | 'confirmado'
    | 'preparando'
    | 'en_camino'
    | 'entregado';

const STEPS: {
    status: TimelineShortOrderStatus;
    label: string;
    Icon: LucideIcon;
}[] = [
    { status: 'recibido', label: 'Recibido', Icon: Store },
    { status: 'confirmado', label: 'Confirmado', Icon: CircleCheck },
    { status: 'preparando', label: 'Preparando', Icon: WandSparkles },
    { status: 'en_camino', label: 'En camino', Icon: Truck },
    { status: 'entregado', label: 'Entregado', Icon: HouseHeart },
];

const N = STEPS.length;

function statusToIndex(status: TimelineShortOrderStatus): number {
    const i = STEPS.findIndex((s) => s.status === status);
    return i >= 0 ? i : 0;
}

export interface TimelineShortOrdersProps {
    /** Paso actual del pedido (maqueta Figma 280:2805). */
    status?: TimelineShortOrderStatus;
    className?: string;
}

/** De centro del 1.er icono al centro del último: paso i está en i/(n-1) de ese tramo. */
function fillPercentToCurrentStep(currentIdx: number): number {
    if (N <= 1) return 100;
    return (currentIdx / (N - 1)) * 100;
}

export default function TimelineShortOrders({ status = 'recibido', className }: TimelineShortOrdersProps) {
    const currentIdx = statusToIndex(status);
    const fillPercent = fillPercentToCurrentStep(currentIdx);

    /** Centros de iconos en columnas iguales: 1/(2n), 3/(2n), … — la pista va del 1.º al último centro */
    const trackInsetPct = 100 / (2 * N);

    return (
        <div
            className={cn('w-full px-0 py-1', className)}
            data-name="TimelineShortOrders"
            role="group"
            aria-label={`Estado del pedido: ${STEPS[currentIdx].label}`}
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
