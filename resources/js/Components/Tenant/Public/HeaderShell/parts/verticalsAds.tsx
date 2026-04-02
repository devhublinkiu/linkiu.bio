import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import { cn } from '@/lib/utils';

export type VerticalsAdsProps = {
    className?: string;
};

/**
 * Cabecera temática (abril) — solo gastronomía; distinto del `FooterShell/parts/verticalsAds`.
 * Va antes del selector de sedes en `HeaderShellAll`.
 */
export default function VerticalsAds({ className }: VerticalsAdsProps) {
    const verticalSlug = usePage<PageProps>().props.currentTenant?.vertical?.slug;

    if (verticalSlug !== 'gastronomia') {
        return null;
    }

    return (
        <div
            className={cn(
                'relative w-full shrink-0 pointer-events-none min-h-[min(42vh,160px)]',
                className,
            )}
            data-part="header-verticals-ads"
            style={{
                background: 'linear-gradient(to bottom,rgba(161, 41, 185, 0.3),rgba(255, 255, 255, 0.06))',
            }}
        >
            <img
                src="/themes/april_26/Assets_april_26_01.webp"
                alt=""
                className="relative -mt-1 z-10 h-auto w-full object-contain"
                aria-hidden
            />
            <img
                src="/themes/april_26/Assets_april_26_02.webp"
                alt=""
                className="absolute right-[70px] top-[30px] z-30 h-auto w-40 object-contain will-change-transform animate-float"
                aria-hidden
            />
            {/* Float en el wrapper: si va en la img, pisa el rotate (ambos usan transform) */}
            <span className="absolute left-[20px] top-[90px] z-10 inline-block origin-center will-change-transform animate-float">
                <img
                    src="/themes/april_26/Assets_april_26_05.webp"
                    alt=""
                    className="h-auto w-48 -rotate-[22deg] object-contain animate-sparkle-glow [animation-delay:0.3s]"
                    aria-hidden
                />
            </span>
        </div>
    );
}
