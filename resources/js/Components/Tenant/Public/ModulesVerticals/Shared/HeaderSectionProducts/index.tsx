import HeroCategoryShort from '../CategoryShort/parts/HeroCategoryShort';
import type { HeroCategoryShortProps } from '../CategoryShort/parts/HeroCategoryShort';

export type HeaderSectionProductsProps = Omit<HeroCategoryShortProps, 'title' | 'availableCount'> & {
    /** Título del bloque (ej. Destacados, Los más vendidos). */
    title: string;
    /** Valor de la pastilla (ej. cantidad de ítems). */
    availableCount: number;
};

/**
 * Cabecera reutilizable para secciones de productos (mismo patrón que categorías: título + “N Disponibles” + flechas).
 */
export default function HeaderSectionProducts({
    title,
    availableCount,
    navPrevAriaLabel = 'Anterior',
    navNextAriaLabel = 'Siguiente',
    ...rest
}: HeaderSectionProductsProps) {
    return (
        <HeroCategoryShort
            title={title}
            availableCount={availableCount}
            navPrevAriaLabel={navPrevAriaLabel}
            navNextAriaLabel={navNextAriaLabel}
            {...rest}
        />
    );
}
