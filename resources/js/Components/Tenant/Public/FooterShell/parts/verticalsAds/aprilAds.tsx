import { ScrollVelocityContainer, ScrollVelocityRow } from '@/Components/ui/scroll-based-velocity';
import { cn } from '@/lib/utils';

export type AprilAdsProps = {
    className?: string;
};

/** Bloque scroll + imagen tema abril — footer; enrutado desde `parts/verticalsAds.tsx`. */
export default function AprilAds({ className }: AprilAdsProps) {
    return (
        <div
            className={cn('flex w-full shrink-0 flex-col items-end overflow-x-hidden', className)}
            data-part="footer-verticals-ads-april"
        >
            <div className="flex w-full flex-col items-center justify-center overflow-hidden pt-0 pb-1">
                <ScrollVelocityContainer className="text-xl font-bold leading-tight tracking-tight text-slate-950 md:text-3xl [&>div]:py-0.5">
                    <ScrollVelocityRow baseVelocity={4} direction={1}>
                        Imagina sin límites 🌈🧩
                    </ScrollVelocityRow>
                    <ScrollVelocityRow baseVelocity={4} direction={-1}>
                        Celebramos ser niños 🎈🧸
                    </ScrollVelocityRow>
                    <ScrollVelocityRow baseVelocity={4} direction={1}>
                        La magia de jugar 🎨🪁
                    </ScrollVelocityRow>
                </ScrollVelocityContainer>
            </div>
            <img
                src="/themes/april_26/Assets_april_26_03.webp"
                alt=""
                className="pointer-events-none w-full max-w-72 object-contain"
                aria-hidden
            />
        </div>
    );
}
