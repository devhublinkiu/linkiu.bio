import { cn } from '@/lib/utils';

export type AprilAdsProps = {
    className?: string;
};

/** Cabecera temática abril (gradiente + assets) — enrutado desde `parts/verticalsAds.tsx`. */
export default function AprilAds({ className }: AprilAdsProps) {
    return (
        <div
            className={cn(
                'relative min-h-[min(42vh,160px)] w-full shrink-0 pointer-events-none',
                className,
            )}
            data-part="header-verticals-ads-april"
            style={{
                background: 'linear-gradient(to bottom,rgba(161, 41, 185, 0.3),rgba(255, 255, 255, 0.06))',
            }}
        >
            <img
                src="/themes/april_26/Assets_april_26_01.webp"
                alt=""
                className="relative z-10 -mt-1 h-auto w-full object-contain"
                aria-hidden
            />
            <img
                src="/themes/april_26/Assets_april_26_02.webp"
                alt=""
                className="absolute right-[70px] top-[30px] z-30 h-auto w-40 object-contain will-change-transform animate-float"
                aria-hidden
            />
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
