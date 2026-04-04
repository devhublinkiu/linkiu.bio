import { ArrowDown, Flame, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TopBestSellerCardBadgesProps {
    /** Badge naranja “TOP” + llama (bloque más vendidos). */
    showTopBadge?: boolean;
    soldCount?: number | null;
    hasDiscount: boolean;
    discountPercent: number;
    className?: string;
}

export default function TopBestSellerCardBadges({
    showTopBadge = true,
    soldCount,
    hasDiscount,
    discountPercent,
    className,
}: TopBestSellerCardBadgesProps) {
    const soldN = soldCount != null ? Number(soldCount) : NaN;
    const showSold = Number.isFinite(soldN) && soldN > 0;

    const iconClass = 'block h-3 w-3 shrink-0';

    return (
        <div
            className={cn('flex w-full min-w-0 flex-wrap items-center gap-2', className)}
            data-name="TopBestSellerCardBadges"
        >
            {showTopBadge ? (
                <div className="inline-flex h-5 min-h-5 shrink-0 items-center gap-1 rounded-full bg-amber-500 px-1.5">
                    <Flame className={cn(iconClass, 'text-amber-100')} strokeWidth={2} aria-hidden />
                    <span className="whitespace-nowrap text-[11px] font-medium leading-none text-amber-100">TOP</span>
                </div>
            ) : null}
            {showSold ? (
                <div
                    className="inline-flex h-5 min-h-5 shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-1.5"
                    title="Unidades vendidas (últimos 30 días)"
                >
                    <Users className={cn(iconClass, 'text-emerald-800')} strokeWidth={2} aria-hidden />
                    <span className="whitespace-nowrap text-[11px] font-medium leading-none text-emerald-800">
                        +{soldN}
                    </span>
                </div>
            ) : null}
            {hasDiscount ? (
                <div className="inline-flex h-5 min-h-5 shrink-0 items-center gap-1 rounded-full bg-red-600 px-1.5">
                    <ArrowDown className={cn(iconClass, 'text-red-100')} strokeWidth={2} aria-hidden />
                    <span className="whitespace-nowrap text-[11px] font-bold leading-none text-red-100">
                        -{discountPercent}%
                    </span>
                </div>
            ) : null}
        </div>
    );
}
