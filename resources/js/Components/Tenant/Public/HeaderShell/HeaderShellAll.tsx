import VerticalsAds from './parts/verticalsAds';
import SelectSede from './parts/SelectSede';
import Hero from './parts/Hero';
import MenuVerticals from './parts/MenuVerticals';
import OpeningHours from './parts/OpeningHours';

/**
 * Header universal multi-vertical. Ensambla piezas en `parts/`.
 * `VerticalsAds` va a ancho completo; el resto comparte padding horizontal.
 */
export default function HeaderShellAll() {
    return (
        <header className="header-shell pb-8" data-layout="header-shell">
            <VerticalsAds />
            <div className="relative z-20 w-full shrink-0 px-4 pt-2 pointer-events-auto">
                <SelectSede />
                <Hero />
                <MenuVerticals />
                <OpeningHours />
            </div>
        </header>
    );
}
