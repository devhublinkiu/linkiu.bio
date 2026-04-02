import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';

/** Alineado a Figma `PoliticasVerticals` (nodo 258:1522). */
export type LegalsVerticalId = 'ecommerce' | 'church' | 'servicios' | 'gastronomy' | 'dropshipping';

type LegalSlug =
    | 'terminos-y-condiciones'
    | 'politica-privacidad'
    | 'politica-cookies'
    | 'condiciones-uso'
    | 'politica-devoluciones'
    | 'condiciones-reservas'
    | 'informacion-consumidores';

type LegalLine = { label: string; slug: LegalSlug };

const LINES_BY_VERTICAL: Record<LegalsVerticalId, LegalLine[]> = {
    gastronomy: [
        { label: 'Condiciones de reservas', slug: 'condiciones-reservas' },
        { label: 'Política de cancelación de reservas', slug: 'terminos-y-condiciones' },
        { label: 'Política de devoluciones y reembolsos', slug: 'politica-devoluciones' },
        { label: 'Política de tiempos de preparación y entrega', slug: 'condiciones-uso' },
        { label: 'Información al consumidor', slug: 'informacion-consumidores' },
    ],
    ecommerce: [
        { label: 'Política de envíos', slug: 'informacion-consumidores' },
        { label: 'Tiempos de entrega', slug: 'terminos-y-condiciones' },
        { label: 'Cambios y devoluciones', slug: 'politica-devoluciones' },
        { label: 'Política de garantías', slug: 'condiciones-uso' },
        { label: 'Derecho de retracto', slug: 'politica-privacidad' },
        { label: 'Información al consumidor', slug: 'informacion-consumidores' },
    ],
    dropshipping: [
        { label: 'Política de envíos', slug: 'informacion-consumidores' },
        { label: 'Tiempos de entrega estimados', slug: 'terminos-y-condiciones' },
        { label: 'Cambios y devoluciones', slug: 'politica-devoluciones' },
        { label: 'Política de garantías', slug: 'condiciones-uso' },
        { label: 'Derecho de retracto', slug: 'politica-privacidad' },
        { label: 'Información al consumidor', slug: 'informacion-consumidores' },
    ],
    servicios: [
        { label: 'Condiciones del servicio', slug: 'condiciones-uso' },
        { label: 'Política de cancelación y reprogramación', slug: 'terminos-y-condiciones' },
        { label: 'Política de no asistencia (no-show)', slug: 'condiciones-uso' },
        { label: 'Tiempos de respuesta/SLA', slug: 'informacion-consumidores' },
        { label: 'Tratamiento de datos para citas/formularios', slug: 'politica-privacidad' },
    ],
    church: [
        { label: 'Política de donaciones', slug: 'terminos-y-condiciones' },
        { label: 'Términos de donaciones recurrentes', slug: 'terminos-y-condiciones' },
        { label: 'Tratamiento de datos para comunidad y oración', slug: 'politica-privacidad' },
        {
            label: 'Política de uso de contenido (predicaciones, audios, testimonios)',
            slug: 'condiciones-uso',
        },
        { label: 'Lineamientos de comunidad', slug: 'politica-cookies' },
    ],
};

function resolveVerticalFromTenant(slug?: string): LegalsVerticalId {
    switch (slug) {
        case 'gastronomia':
            return 'gastronomy';
        case 'ecommerce':
            return 'ecommerce';
        case 'church':
        case 'iglesias':
            return 'church';
        case 'servicios':
            return 'servicios';
        case 'dropshipping':
            return 'dropshipping';
        default:
            return 'ecommerce';
    }
}

export type LegalsVerticalsProps = {
    className?: string;
    /** Si no se pasa, se usa `currentTenant.vertical.slug`. */
    vertical?: LegalsVerticalId;
};

export default function LegalsVerticals({ className, vertical: verticalProp }: LegalsVerticalsProps) {
    const page = usePage<PageProps>();
    const tenantSlug = page.props.currentTenant?.slug;
    const storeName = page.props.currentTenant?.name?.trim() || 'la tienda';
    const vSlug = page.props.currentTenant?.vertical?.slug;
    const vertical = verticalProp ?? resolveVerticalFromTenant(vSlug);
    const lines = LINES_BY_VERTICAL[vertical];

    return (
        <section
            className={cn(
                'footer-shell-legals flex w-full flex-col items-center gap-2.5 px-4 pb-6 pt-6 text-center text-slate-950',
                className,
            )}
            data-part="legals-verticals"
            data-vertical={vertical}
            aria-label="Políticas legales"
        >
            <p className="w-full min-w-0 shrink-0 text-sm font-bold leading-normal">
                {`Políticas de ${storeName}`}
            </p>
            <nav className="flex w-full max-w-md flex-col items-center gap-2 text-xs font-normal leading-[14px] text-slate-950">
                {lines.map(({ label, slug }) => {
                    const href =
                        tenantSlug != null && tenantSlug !== ''
                            ? route('tenant.legal.show', { tenant: tenantSlug, slug })
                            : '#';
                    return (
                        <Link
                            key={`${vertical}-${slug}-${label}`}
                            href={href}
                            className="block w-full py-0 leading-[14px] text-slate-950 transition-colors hover:text-slate-700 hover:underline"
                        >
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </section>
    );
}
