import { ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InfoTimelineShortProps {
    /** Rango de hora mostrado bajo «Entrega estimada». */
    estimatedDeliveryRange?: string;
    /** Número de pedido sin # (se muestra como #00xx). */
    orderNumber?: string;
    className?: string;
}

export default function InfoTimelineShort({
    estimatedDeliveryRange = '6:34 p.m. - 6:49 p.m.',
    orderNumber = '0035',
    className,
}: InfoTimelineShortProps) {
    const orderDisplay = orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`;

    return (
        <div
            className={cn('flex w-full items-center justify-between gap-2', className)}
            data-name="InfoTimelineShort"
        >
            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-normal leading-tight text-slate-500">Entrega estimada</p>
                <p className="mt-0.5 text-sm font-bold leading-tight text-slate-950">{estimatedDeliveryRange}</p>
            </div>

            <div className="flex shrink-0 items-center justify-center text-slate-400" aria-hidden>
                <ArrowLeftRight className="size-5" strokeWidth={2} />
            </div>

            <div className="min-w-0 flex-1 text-right">
                <p className="text-[11px] font-normal leading-tight text-slate-500">Número de pedido</p>
                <p className="mt-0.5 text-sm font-bold leading-tight text-slate-950">{orderDisplay}</p>
            </div>
        </div>
    );
}
