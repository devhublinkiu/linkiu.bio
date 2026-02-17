import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, CreditCard, Headphones, Lock, Truck } from 'lucide-react';

const LEGAL_LINKS: { slug: string; label: string }[] = [
    { slug: 'terminos-y-condiciones', label: 'Términos y condiciones' },
    { slug: 'politica-privacidad', label: 'Política de privacidad' },
    { slug: 'politica-cookies', label: 'Política de cookies' },
    { slug: 'condiciones-uso', label: 'Condiciones de uso' },
    { slug: 'politica-devoluciones', label: 'Política de devoluciones y reembolsos' },
    { slug: 'condiciones-reservas', label: 'Condiciones de reservas' },
    { slug: 'informacion-consumidores', label: 'Información para consumidores' },
];

export default function Footer() {
    const page = usePage();
    const tenant = (page.props as { currentTenant?: { slug: string }; tenant?: { slug: string } }).currentTenant
        ?? (page.props as { tenant?: { slug: string } }).tenant;
    const tenantSlug = tenant?.slug ?? '';
    return (
        <footer className="mt-auto bg-slate-950 px-8 py-12 text-sm text-slate-300 pb-32">
            <div className="mx-auto max-w-[480px] space-y-6">
                {/* 4 pilares de confianza — icono arriba con fondo y resplandor */}
                <section className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/25 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
                            <Lock className="size-5" aria-hidden />
                        </div>
                        <span className="text-xs font-medium text-slate-300">Seguridad SSL</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/25 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.35)]">
                            <Truck className="size-5" aria-hidden />
                        </div>
                        <span className="text-xs font-medium text-slate-300">Envíos seguros</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/25 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.35)]">
                            <CreditCard className="size-5" aria-hidden />
                        </div>
                        <span className="text-xs font-medium text-slate-300">Pagos seguros</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/25 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)]">
                            <Headphones className="size-5" aria-hidden />
                        </div>
                        <span className="text-xs font-medium text-slate-300">Soporte</span>
                    </div>
                </section>

                {/* Legal — una columna, sin fondo, items con arrow up */}
                <section>
                    <h3 className="mb-3 flex items-center gap-2 font-semibold uppercase tracking-wider text-slate-200">
                        <span className="text-white font-bold text-lg">Legal</span>
                    </h3>
                    <ul className="flex flex-col gap-1">
                        {LEGAL_LINKS.map((item) => (
                            <li key={item.slug}>
                                <Link
                                    href={tenantSlug ? route('tenant.legal.show', { tenant: tenantSlug, slug: item.slug }) : '#'}
                                    className="flex items-center gap-2 py-0.5 text-slate-400 transition-colors hover:text-slate-100"
                                >
                                    <ArrowUpRight className="size-3.5 shrink-0 text-slate-500" aria-hidden />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h3 className="mb-3 flex items-center gap-2 font-semibold uppercase tracking-wider text-slate-200">
                        <span className="text-white font-bold text-lg">Medios de pago</span>
                    </h3>
                </section>

                {/* Plataforma — bloque final */}
                <section>
                    <a
                        href="https://linkiu.bio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center text-slate-300 transition-colors hover:text-slate-100"
                    >
                        <span className="font-medium text-gray-400">Hecho con amor por <span className="text-white font-bold">Linkiu
                            </span></span>
                        <ArrowUpRight className="size-3.5 text-white" aria-hidden />
                    </a>
                </section>
            </div>
        </footer>
    );
}
