import { Link } from '@inertiajs/react';
import { ArrowUp, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ItemProductTopBestSellerProps {
    name: string;
    imageUrl?: string | null;
    /** Badge verde (flecha + número), p. ej. tendencia de ventas */
    trendValue?: number | null;
    /** Enlace “Ver producto”; si no hay, se usa `onVerProductoClick` */
    verProductoHref?: string;
    onVerProductoClick?: () => void;
    onFavoriteClick?: (e: React.MouseEvent) => void;
    isFavorite?: boolean;
    className?: string;
}

export default function ItemProductTopBestSeller({
    name,
    imageUrl,
    trendValue,
    verProductoHref,
    onVerProductoClick,
    onFavoriteClick,
    isFavorite = false,
    className,
}: ItemProductTopBestSellerProps) {
    const showTrend = trendValue != null && Number.isFinite(Number(trendValue));

    const verProductoInner = (
        <span className="block w-full max-w-[89px] text-center text-[10px] font-normal leading-3 text-slate-100">
            Ver producto
        </span>
    );

    return (
        <div
            className={cn(
                'flex w-[100px] shrink-0 flex-col items-stretch overflow-hidden rounded-lg',
                className,
            )}
            data-name="ItemProductTopBestSeller"
        >
            <div className="relative h-[100px] w-full shrink-0 overflow-hidden rounded-t-lg bg-slate-100">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt=""
                        className="absolute inset-0 size-full object-cover"
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <div className="absolute inset-0 bg-slate-200" aria-hidden />
                )}

                {onFavoriteClick ? (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onFavoriteClick(e);
                        }}
                        className="absolute right-1 top-1 z-10 flex items-center justify-center rounded-full bg-red-50 p-1 shadow-sm"
                        aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    >
                        <Heart
                            className={cn('size-2', isFavorite ? 'fill-red-500 text-red-500' : 'text-red-500')}
                            strokeWidth={2}
                            aria-hidden
                        />
                    </button>
                ) : null}

                {showTrend ? (
                    <div className="absolute bottom-1 right-1 z-10 flex items-center gap-0.5 rounded-full bg-emerald-100 px-1 py-0.5">
                        <ArrowUp className="size-2 shrink-0 text-emerald-800" strokeWidth={2} aria-hidden />
                        <span className="text-[10px] font-bold leading-none text-emerald-800">{trendValue}</span>
                    </div>
                ) : null}
            </div>

            <div className="flex flex-col items-center justify-center bg-slate-50 px-1 py-2">
                <p className="line-clamp-2 w-full max-w-[89px] text-[10px] font-normal leading-3 text-slate-700">{name}</p>
            </div>

            {verProductoHref ? (
                <Link
                    href={verProductoHref}
                    className="flex flex-col items-center justify-center rounded-b-lg bg-slate-700 p-1 transition-colors hover:bg-slate-800"
                >
                    {verProductoInner}
                </Link>
            ) : onVerProductoClick ? (
                <button
                    type="button"
                    onClick={onVerProductoClick}
                    className="flex w-full flex-col items-center justify-center rounded-b-lg bg-slate-700 p-1 text-left transition-colors hover:bg-slate-800"
                >
                    {verProductoInner}
                </button>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-b-lg bg-slate-700 p-1">
                    {verProductoInner}
                </div>
            )}
        </div>
    );
}
