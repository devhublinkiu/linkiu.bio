import SelectSede from './parts/SelectSede';
import Hero from './parts/Hero';
import MenuVerticals from './parts/MenuVerticals';
import OpeningHours from './parts/OpeningHours';

/**
 * Header universal multi-vertical. Ensambla piezas en `parts/`.
 * Sustituirá gradualmente a los Header por vertical.
 */
export default function HeaderShellAll() {
    return (
        <header className="header-shell pb-8" data-layout="header-shell">
            <SelectSede />
            <Hero />
            <MenuVerticals />
            <OpeningHours />
        </header>
    );
}
