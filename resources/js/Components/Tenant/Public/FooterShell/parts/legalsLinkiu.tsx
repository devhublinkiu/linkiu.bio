import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import ReportModal from '@/Components/Public/ReportModal';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';

const LINKIU_BASE = 'https://linkiu.bio';

/** Orden y textos alineados a Figma nodo 259:1530; URLs al sitio público Linkiu. */
const LINKIU_LEGAL_LINKS: { href: string; label: string }[] = [
    { href: `${LINKIU_BASE}/politica-privacidad`, label: 'Política de Privacidad' },
    { href: `${LINKIU_BASE}/politica-tratamiento-datos`, label: 'Tratamiento de Datos Personales' },
    { href: `${LINKIU_BASE}/politica-cookies`, label: 'Política de Cookies' },
    { href: `${LINKIU_BASE}/terminos-y-condiciones`, label: 'Términos y Condiciones' },
    { href: `${LINKIU_BASE}/descargo-responsabilidad`, label: 'Descargo de Responsabilidad' },
    { href: `${LINKIU_BASE}/derecho-retracto`, label: 'Devoluciones y Retracto' },
    { href: `${LINKIU_BASE}/informacion-consumidores`, label: 'Derechos del Consumidor' },
    { href: `${LINKIU_BASE}/transparencia`, label: 'Informe de Transparencia' },
    { href: `${LINKIU_BASE}/centro-confianza`, label: 'Centro de Confianza' },
    { href: `${LINKIU_BASE}/ayuda`, label: 'Centro de Ayuda' },
];

export type LegalsLinkiuProps = {
    className?: string;
};

export default function LegalsLinkiu({ className }: LegalsLinkiuProps) {
    const [reportOpen, setReportOpen] = useState(false);
    const { currentTenant } = usePage<PageProps>().props;
    const tenantSlug = currentTenant?.slug?.trim() ?? '';

    return (
        <section
            className={cn('w-full px-4 text-center', className)}
            data-part="legals-linkiu"
            data-name="Legals_linkiu"
        >
            <nav className="mx-auto flex max-w-lg flex-col items-center" aria-label="Legales de Linkiu">
                <p className="mb-0 text-xs font-bold leading-5 text-slate-500">Legales de Linkiu</p>

                <p className="mb-0 mt-2 text-xs leading-[14px] text-slate-500">
                    {LINKIU_LEGAL_LINKS.map((item, index) => (
                        <span key={item.href}>
                            {index > 0 ? <span aria-hidden> · </span> : null}
                            <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 underline-offset-2 transition-colors hover:text-slate-400 hover:underline"
                            >
                                {item.label}
                            </a>
                        </span>
                    ))}
                </p>

                {tenantSlug ? (
                    <>
                        <button
                            type="button"
                            className="mt-2 border-0 bg-transparent p-0 text-xs font-bold leading-5 text-slate-300 underline-offset-2 transition-colors hover:text-slate-200 hover:underline"
                            onClick={() => setReportOpen(true)}
                        >
                            Reportar actividad sospechosa en la tienda
                        </button>
                        <ReportModal open={reportOpen} onOpenChange={setReportOpen} tenantSlug={tenantSlug} />
                    </>
                ) : (
                    <a
                        href="mailto:info@linkiu.bio?subject=Reporte%20de%20actividad%20sospechosa"
                        className="mt-2 text-xs font-bold leading-5 text-slate-300 underline-offset-2 transition-colors hover:text-slate-200 hover:underline"
                    >
                        Reportar actividad sospechosa la tienda
                    </a>
                )}
            </nav>
        </section>
    );
}
