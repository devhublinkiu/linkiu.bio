import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HeroCategoryShortProps {
    /** Texto principal (maqueta: "Categorías") */
    title?: string;
    /** `id` del encabezado para `aria-labelledby` del bloque */
    headingId?: string;
    /** Número mostrado en la pastilla, p. ej. cantidad de categorías */
    availableCount: number;
    /** Texto tras el número en la pastilla (por defecto «Disponibles»). */
    pillSuffix?: string;
    onPrev?: () => void;
    onNext?: () => void;
    /** Deshabilitar flecha izquierda (p. ej. primera página del slider) */
    prevDisabled?: boolean;
    /** Deshabilitar flecha derecha (p. ej. última página) */
    nextDisabled?: boolean;
    /** Texto accesible del botón anterior (p. ej. otro módulo que reutiliza el hero) */
    navPrevAriaLabel?: string;
    /** Texto accesible del botón siguiente */
    navNextAriaLabel?: string;
    className?: string;
}

export default function HeroCategoryShort({
    title = 'Categorías',
    headingId = 'category-short-heading',
    availableCount,
    pillSuffix = 'Disponibles',
    onPrev,
    onNext,
    prevDisabled = false,
    nextDisabled = false,
    navPrevAriaLabel = 'Página anterior de categorías',
    navNextAriaLabel = 'Página siguiente de categorías',
    className,
}: HeroCategoryShortProps) {
    const navDisabled = !onPrev && !onNext;

    return (
        <div
            className={cn('relative flex w-full items-center justify-between gap-3 mt-4 mb-4', className)}
            data-name="Hero_categoryShort"
        >
            <div className="flex shrink-0 items-center gap-2">
                <h2
                    id={headingId}
                    className="shrink-0 whitespace-nowrap text-center text-base font-bold leading-none text-slate-950"
                >
                    {title}
                </h2>
                <div
                    className="flex shrink-0 items-center justify-center rounded-full bg-slate-100 px-2 py-1"
                    data-name="button_explorer_categoryShort"
                >
                    <p className="text-center text-[11px] font-normal leading-none text-slate-600">
                        {availableCount} {pillSuffix}
                    </p>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-4">
                <button
                    type="button"
                    onClick={onPrev}
                    disabled={navDisabled || !onPrev || prevDisabled}
                    className="flex shrink-0 items-center justify-center rounded-lg border border-slate-950 bg-slate-100 p-1 text-slate-950 transition-colors hover:bg-slate-200 disabled:pointer-events-none disabled:opacity-40"
                    aria-label={navPrevAriaLabel}
                >
                    <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={navDisabled || !onNext || nextDisabled}
                    className="flex shrink-0 items-center justify-center rounded-lg border border-slate-950 bg-slate-100 p-1 text-slate-950 transition-colors hover:bg-slate-200 disabled:pointer-events-none disabled:opacity-40"
                    aria-label={navNextAriaLabel}
                >
                    <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
                </button>
            </div>
        </div>
    );
}
