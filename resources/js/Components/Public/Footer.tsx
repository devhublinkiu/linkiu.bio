import type { ComponentType } from 'react';
import { ArrowUpRight, ChevronRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedGradientText } from '@/Components/ui/animated-gradient-text';

const LINKIU_BASE = 'https://linkiu.bio';
const APP_VERSION = '1.0';

const LEGAL_LINKS: { href: string; label: string }[] = [
    { href: `${LINKIU_BASE}/politica-tratamiento-datos`, label: 'Política de Tratamiento de Datos Personales' },
    { href: `${LINKIU_BASE}/politica-cookies`, label: 'Política de Cookies' },
    { href: `${LINKIU_BASE}/terminos-y-condiciones`, label: 'Términos y Condiciones' },
    { href: `${LINKIU_BASE}/aviso-legal`, label: 'Aviso legal' },
    { href: `${LINKIU_BASE}/informacion-consumidores`, label: 'Información al consumidor' },
    { href: `${LINKIU_BASE}/derecho-retracto`, label: 'Derecho de retracto' },
    { href: `${LINKIU_BASE}/ayuda`, label: 'Centro de ayuda' },
    { href: `${LINKIU_BASE}/descargo-responsabilidad`, label: 'Descargo de responsabilidad' },
];

type SocialIconProps = { className?: string };
const SocialIcon = ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={cn('brightness-0 invert', className ?? 'size-5')} />
);

const SOCIAL_LINKS: { href: string; icon: ComponentType<SocialIconProps>; label: string }[] = [
    { href: `${LINKIU_BASE}`, icon: (p) => <SocialIcon src="/social-icons/instagram.svg" alt="Instagram" className={p.className} />, label: 'Instagram' },
    { href: `${LINKIU_BASE}`, icon: (p) => <SocialIcon src="/social-icons/facebook.svg" alt="Facebook" className={p.className} />, label: 'Facebook' },
    { href: `${LINKIU_BASE}`, icon: (p) => <SocialIcon src="/social-icons/youtube.svg" alt="YouTube" className={p.className} />, label: 'YouTube' },
    { href: `${LINKIU_BASE}`, icon: (p) => <SocialIcon src="/social-icons/twitter.svg" alt="Twitter" className={p.className} />, label: 'Twitter' },
    { href: `${LINKIU_BASE}`, icon: (p) => <SocialIcon src="/social-icons/tiktok.svg" alt="TikTok" className={p.className} />, label: 'TikTok' },
];

/**
 * Pie de página de Linkiu. Legal, horarios, confianza, redes y marca.
 */
export default function Footer() {
    return (
        <footer className="mt-auto bg-slate-950 px-6 text-sm text-slate-300 pb-32">
            <div className="mx-auto max-w-[480px] space-y-8 mt-16">
                {/* CTA — Crea tu Linkiu */}
                <div className="px-4">
                    <a
                        href={LINKIU_BASE}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex w-full items-center justify-center rounded-[2rem] px-4 py-2 bg-white-900 backdrop-blur-lg bg-opacity-10"
                    >
                        <span
                            className={cn(
                                "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[2px]"
                            )}
                            style={{
                                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                WebkitMaskComposite: "destination-out",
                                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                maskComposite: "subtract",
                                WebkitClipPath: "padding-box",
                            }}
                        />
                        <span className="shrink-0 text-lg mr-2" aria-hidden>✨</span>
                        <AnimatedGradientText className="text-base font-semibold text-center min-w-0 flex-1">
                            Crea tu Linkiu — es gratis
                        </AnimatedGradientText>
                        <ChevronRight className="ml-2 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 shrink-0" />
                    </a>
                </div>

                {/* Horarios de atención */}
                <section className="px-4" aria-label="Horarios de atención">
                    <p className="text-base font-semibold text-slate-200 mb-1.5">Horarios de atención</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Equipo de ventas: 8:00 a. m. – 6:00 p. m.
                        <br />
                        Equipo de facturación: 8:00 a. m. – 6:00 p. m.
                        <br />
                        Equipo de servicio al cliente: 8:00 a. m. – 6:00 p. m.
                        <br />
                        Equipo de soporte: 8:00 a. m. – 11:00 p. m.
                    </p>
                </section>

                {/* Dirección y teléfonos */}
                <section className="px-4" aria-label="Horarios de atención">
                    <p className="text-base font-semibold text-slate-200 mb-1.5">Dirección y teléfonos</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Dirección: Barranquilla, Colombia
                        <br />
                        <a href="mailto:info@linkiu.bio" className="underline text-slate-400 hover:text-slate-100 transition-colors">Correo ventas: info@linkiu.bio</a>
                        <br />
                        <a href="https://wa.me/573104594344" className="underline text-slate-400 hover:text-slate-100 transition-colors">WhatsApp ventas: +57 310 459 4344</a>
                        <br />
                        <a href="mailto:info@linkiu.bio" className="underline text-slate-400 hover:text-slate-100 transition-colors">Correo soporte: info@linkiu.bio</a>
                        <br />
                        <a href="https://wa.me/57323333211" className="underline text-slate-400 hover:text-slate-100 transition-colors">WhatsApp soporte: +57 323 333 3211</a>
                    </p>
                </section>

                {/* Legal — enlaces en bloque */}
                <nav aria-label="Legal Linkiu" className="px-4">
                    <p className="text-base font-semibold text-slate-200 mb-1.5">Legal</p>
                    <ul className="flex flex-col gap-1">
                        {LEGAL_LINKS.map((item) => (
                            <li key={item.label}>
                                <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-slate-400 hover:text-slate-100 transition-colors"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                
                {/* Redes sociales */}
                <div className="flex justify-center gap-4">
                    {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex size-10 items-center justify-center rounded-full bg-slate-800/80 text-white hover:text-white hover:bg-slate-700/80 transition-colors"
                            aria-label={label}
                        >
                            <Icon className="size-5" />
                        </a>
                    ))}
                </div>

                {/* Confianza: SSL + Badge sistemas operativos + Versión */}
                <div className="flex flex-col items-center justify-center gap-4 gap-y-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400/80">
                        <Lock className="size-3.5 text-emerald-400/80" aria-hidden />
                        Sitio seguro
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs text-slate-300 border border-slate-600/50">
                        <span className="relative flex size-2" aria-hidden>
                            <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                        </span>
                        Todos los sistemas operativos
                    </span>
                    <span className="text-xs text-slate-500">v{APP_VERSION}</span>
                </div>
            </div>

            {/* Marca grande */}
            <div
                className="pointer-events-none flex justify-center mt-6"
                aria-hidden
            >
                <span className="mix-blend-overlay select-none text-[200px] font-extrabold leading-none tracking-tighter text-white">
                    Linkiu
                </span>
            </div>

            {/* Hecho con amor */}
            <a
                href={LINKIU_BASE}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-slate-300 transition-colors hover:text-slate-100 mt-2"
            >
                <span className="font-medium text-gray-400">
                    Hecho con amor por <span className="text-white font-bold">Linkiu</span>
                </span>
                <ArrowUpRight className="size-3.5 text-white ml-1" aria-hidden />
            </a>
        </footer>
    );
}
