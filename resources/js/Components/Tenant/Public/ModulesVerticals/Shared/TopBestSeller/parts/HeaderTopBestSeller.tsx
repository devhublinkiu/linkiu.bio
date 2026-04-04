import BgHeaderTopBestSeller from './BgHeaderTopBestSeller';
import { cn } from '@/lib/utils';

const ICON_SRC = '/tenant/Shared/icon_top_best_seller.svg';

export interface HeaderTopBestSellerProps {
    /** `id` del `<h2>` para `aria-labelledby` del bloque padre */
    headingId?: string;
    /** Número del ranking (maqueta: 6 → "Top 6") */
    topCount?: number;
    /** Segunda línea bajo el título */
    subtitle?: string;
    className?: string;
}

export default function HeaderTopBestSeller({
    headingId,
    topCount = 6,
    subtitle = 'más vendidos',
    className,
}: HeaderTopBestSellerProps) {
    return (
        <div
            className={cn(
                'relative w-full overflow-hidden',
                className,
            )}
            data-name="HeaderTopBestSeller"
        >
            <BgHeaderTopBestSeller />

            <div className="relative z-10 flex w-full flex-col items-center justify-center gap-[9px] px-5 py-8 text-center">
                <div className="relative h-[112px] w-full max-w-[129px] shrink-0">
                    <img
                        src={ICON_SRC}
                        alt=""
                        className="h-full w-full object-contain object-center"
                        width={129}
                        height={112}
                        decoding="async"
                    />
                </div>

                <h2 id={headingId} className="min-w-0 text-slate-950">
                    <span className="mb-0 block text-[40px] font-extrabold leading-[32px] tracking-[-2px]">
                        Top {topCount}
                    </span>
                    <span className="block text-[24px] font-medium leading-[32px] tracking-[-1.2px]">{subtitle}</span>
                </h2>
            </div>
        </div>
    );
}
