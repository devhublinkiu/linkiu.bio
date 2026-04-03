import { ArrowDown, Flame, Heart, Plus } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';

export interface ProductCardVerticalProps {
    name: string;
    imageUrl?: string | null;
    price: number;
    originalPrice?: number | null;
    /** Badge naranja “TOP” + llama */
    isFeatured?: boolean;
    isFavorite?: boolean;
    onCardClick?: () => void;
    onFavoriteClick?: (e: React.MouseEvent) => void;
    onAddClick?: (e: React.MouseEvent) => void;
    className?: string;
}

/**
 * Tarjeta vertical de producto (maqueta LINKIU OFICIAL — Figma node 275:2005).
 */
export default function ProductCardVertical({
    name,
    imageUrl,
    price,
    originalPrice,
    isFeatured = false,
    isFavorite = false,
    onCardClick,
    onFavoriteClick,
    onAddClick,
    className,
}: ProductCardVerticalProps) {
    const priceVal = Number(price);
    const originalPriceVal = originalPrice != null ? Number(originalPrice) : 0;
    const hasDiscount = originalPriceVal > priceVal && originalPriceVal > 0;
    const discountPercent = hasDiscount
        ? Math.round(((originalPriceVal - priceVal) / originalPriceVal) * 100)
        : 0;

    return (
        <div
            className={cn(
                'group flex w-[200px] shrink-0 cursor-pointer snap-start flex-col overflow-hidden rounded-lg border border-slate-100/80 bg-white shadow-sm transition-all duration-300 active:scale-[0.98]',
                className,
            )}
            data-featured-card
            data-name="ProductCardVertical"
            role="button"
            tabIndex={0}
            onClick={onCardClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onCardClick?.();
                }
            }}
        >
            <div className="relative h-[200px] w-full shrink-0 overflow-hidden rounded-t-lg bg-slate-100">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt=""
                        className="pointer-events-none absolute inset-0 size-full object-cover"
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <div className="absolute inset-0 bg-slate-200" aria-hidden />
                )}

                <div className="relative z-10 flex h-full flex-col p-2">
                    {onFavoriteClick ? (
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFavoriteClick(e);
                                }}
                                className="flex shrink-0 items-center justify-center rounded-full bg-red-50 p-1 text-red-600 shadow-sm transition-colors hover:bg-red-100"
                                aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                            >
                                <Heart className={cn('size-4', isFavorite && 'fill-red-600')} strokeWidth={2} aria-hidden />
                            </button>
                        </div>
                    ) : (
                        <div className="min-h-[24px]" aria-hidden />
                    )}

                    <div className="mt-auto flex w-full flex-wrap items-center gap-2">
                        {isFeatured ? (
                            <div className="flex shrink-0 items-center justify-center gap-0.5 rounded-full bg-amber-500 px-1 py-0.5">
                                <Flame className="size-3 shrink-0 text-amber-100" strokeWidth={2} aria-hidden />
                                <span className="whitespace-nowrap text-center text-[10px] font-medium text-amber-100">
                                    TOP
                                </span>
                            </div>
                        ) : null}
                        {hasDiscount ? (
                            <div className="flex shrink-0 items-center justify-center gap-0.5 rounded-full bg-red-600 px-1 py-0.5">
                                <ArrowDown className="size-3 shrink-0 text-red-100" strokeWidth={2} aria-hidden />
                                <span className="whitespace-nowrap text-center text-[10px] font-bold text-red-100">
                                    -{discountPercent}%
                                </span>
                            </div>
                        ) : null}
                        {hasDiscount ? (
                            <div className="flex shrink-0 items-center justify-center rounded-full bg-slate-200 px-1 py-0.5">
                                <span className="whitespace-nowrap text-center text-[10px] font-bold leading-none text-slate-950 line-through decoration-solid">
                                    {formatPrice(originalPriceVal)}
                                </span>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="flex h-[88px] shrink-0 flex-col justify-between bg-slate-100 px-2 py-2.5 rounded-b-lg">
                <p className="w-full text-left text-[14px] font-normal leading-4 text-slate-950 line-clamp-2">{name}</p>
                <div className="flex w-full items-center justify-between gap-2">
                    <p className="shrink-0 whitespace-nowrap text-[16px] font-bold leading-4 text-slate-950">
                        {formatPrice(priceVal)}
                    </p>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddClick?.(e);
                        }}
                        className="flex shrink-0 items-center justify-center rounded-full bg-slate-950 p-2 text-white shadow-sm transition-transform active:scale-95"
                        aria-label="Añadir al pedido"
                    >
                        <Plus className="size-5" strokeWidth={2} aria-hidden />
                    </button>
                </div>
            </div>
        </div>
    );
}
