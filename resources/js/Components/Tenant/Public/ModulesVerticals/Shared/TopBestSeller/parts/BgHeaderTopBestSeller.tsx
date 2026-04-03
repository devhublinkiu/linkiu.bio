import { cn } from '@/lib/utils';

interface Props {
    className?: string;
}

/**
 * Halos circulares (radiales) detrás del icono y el texto — no cubren todo el ancho.
 */
export default function BgHeaderTopBestSeller({ className }: Props) {
    return (
        <div
            className={cn(
                'pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]',
                className,
            )}
            aria-hidden
            data-name="BgHeaderTopBestSeller"
        >
            {/* Lavanda / azul — detrás del lado izquierdo (trofeo + “Top”) */}
            <div className="absolute left-[24%] top-[32%] h-[56px] w-[100px] rounded-full bg-blue-600 blur-[36px]" />
            {/* Rosa / coral — detrás del lado derecho (“6”) */}
            <div className="absolute right-[24%] top-[32%] h-[72px] w-[150px] rounded-full bg-red-600 blur-[36px]" />
            {/* Violeta suave — centro, une el bloque visual */}
            <div className="absolute left-[48%] top-[40%] h-[32px] w-[56px] -translate-x-1/2 rounded-full bg-pink-600 blur-[36px]" />
        </div>
    );
}
