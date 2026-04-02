import { ScrollVelocityContainer, ScrollVelocityRow } from '@/Components/ui/scroll-based-velocity';
import { cn } from '@/lib/utils';

export type VerticalsAdsProps = {
    className?: string;
};

/**
 * Bloque promocional / velocidad (tema abril) — antes era pie de página en PublicLayout Gastronomy.
 */
export default function VerticalsAds({ className }: VerticalsAdsProps) {
    return (
        <div
            className={cn('flex w-full shrink-0 flex-col items-end overflow-x-hidden', className)}
            data-part="verticals-ads"
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
                className="w-full max-w-72 object-contain pointer-events-none"
                aria-hidden
            />
        </div>
    );
}
