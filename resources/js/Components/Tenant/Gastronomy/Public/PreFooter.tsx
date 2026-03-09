import { Link, usePage } from '@inertiajs/react';
import { CreditCard, Headphones, Lock, Truck } from 'lucide-react';

const LEGAL_LINKS: { slug: string; label: string }[] = [
    { slug: 'terminos-y-condiciones', label: 'Términos y condiciones' },
    { slug: 'politica-privacidad', label: 'Política de privacidad' },
    { slug: 'politica-cookies', label: 'Política de cookies' },
    { slug: 'condiciones-uso', label: 'Condiciones de uso' },
    { slug: 'politica-devoluciones', label: 'Política de devoluciones y reembolsos' },
    { slug: 'condiciones-reservas', label: 'Condiciones de reservas' },
    { slug: 'informacion-consumidores', label: 'Información para consumidores' },
];

/**
 * Prefooter de Gastronomy: pilares de confianza y enlaces legales.
 * Va después del banner "Reportar problemas". Diseño sutil, no invasivo.
 */
export default function PreFooter() {
    const page = usePage();
    const tenant = (page.props as { currentTenant?: { slug: string }; tenant?: { slug: string } }).currentTenant
        ?? (page.props as { tenant?: { slug: string } }).tenant;
    const tenantSlug = tenant?.slug ?? '';

    return (
        <section className="bg-slate-50/80 border-t border-slate-200/80 px-6 py-6 text-sm" aria-label="Confianza y legal">
            <div className="mx-auto max-w-[480px] space-y-5">
                {/* 4 pilares — iconos pequeños, colores suaves, sin resplandor */}
                <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-slate-200/80 text-slate-500">
                            <Lock className="size-4" aria-hidden />
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">SSL</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-slate-200/80 text-slate-500">
                            <Truck className="size-4" aria-hidden />
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">Envíos</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-slate-200/80 text-slate-500">
                            <CreditCard className="size-4" aria-hidden />
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">Pagos</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-slate-200/80 text-slate-500">
                            <Headphones className="size-4" aria-hidden />
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">Soporte</span>
                    </div>
                </div>

                {/* Legal — lista compacta, texto pequeño */}
                <ul className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-slate-500">
                    {LEGAL_LINKS.map((item, i) => (
                        <li key={item.slug} className="flex items-center gap-x-2">
                            {i > 0 && <span className="text-slate-300">·</span>}
                            <Link
                                href={tenantSlug ? route('tenant.legal.show', { tenant: tenantSlug, slug: item.slug }) : '#'}
                                className="text-xs hover:text-slate-700 transition-colors"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
