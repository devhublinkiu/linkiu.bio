import Benefits from './parts/benefits';
import SocialMedia from './parts/socialMedia';
import Contact from './parts/contact';
import LegalsVerticals from './parts/legalsVerticals';
import ButtonRegisterLinkiu from './parts/buttonRegisterLinkiu';
import BagdeOperative from './parts/bagdeOperative';
import LegalsLinkiu from './parts/legalsLinkiu';
import VerticalsAds from './parts/verticalsAds';

/**
 * Footer multi-vertical. Ensambla piezas en `parts/`.
 */
export default function FooterShellAll() {
    return (
        <footer className="footer-shell mt-auto w-full" data-layout="footer-shell">
            <VerticalsAds />
            <div className="border-t border-slate-200/80 bg-slate-100 pt-8 pb-6">
                <Benefits />
                <SocialMedia />
                <Contact />
                <LegalsVerticals />
            </div>
            <div className="w-full space-y-8 bg-slate-950 px-4 py-12 text-slate-300 pb-32">
                <div className="flex justify-center">
                    <ButtonRegisterLinkiu />
                </div>
                <div className="flex justify-center">
                    <BagdeOperative />
                </div>
                <LegalsLinkiu />
            </div>
        </footer>
    );
}
