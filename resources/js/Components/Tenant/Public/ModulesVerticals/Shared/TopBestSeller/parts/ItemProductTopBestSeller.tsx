import { Heart, Plus } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';

import TopBestSellerCardBadges from './TopBestSellerCardBadges';

export interface ItemProductTopBestSellerProps {
    name: string;
    imageUrl?: string | null;
    price: number;
    originalPrice?: number | null;
    /** Unidades vendidas en el periodo (p. ej. últimos 30 días). */
    soldCount?: number | null;
    /** Muestra badge TOP + llama (maqueta Figma). */
    showTopBadge?: boolean;
    onCardClick?: () => void;
    onAddClick?: (e: React.MouseEvent) => void;
    onFavoriteClick?: (e: React.MouseEvent) => void;
    isFavorite?: boolean;
    className?: string;
}

const ACTION = '[data-top-seller-action]';

export default function ItemProductTopBestSeller({
    name,
    imageUrl,
    price,
    originalPrice,
    soldCount,
    showTopBadge = true,
    onCardClick,
    onAddClick,
    onFavoriteClick,
    isFavorite = false,
    className,
}: ItemProductTopBestSellerProps) {
    const priceVal = Number(price);
    const originalPriceVal = originalPrice != null ? Number(originalPrice) : 0;
    const hasDiscount = originalPriceVal > priceVal && originalPriceVal > 0;
    const discountPercent = hasDiscount
        ? Math.round(((originalPriceVal - priceVal) / originalPriceVal) * 100)
        : 0;

    const handleCardClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest(ACTION)) return;
        onCardClick?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCardClick?.();
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            aria-label={`Ver detalle: ${name}`}
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            className={cn(
                'flex w-full min-w-0 cursor-pointer overflow-hidden rounded-lg bg-white ',
                className,
            )}
            data-name="ItemProductTopBestSeller"
        >
            <div className="relative h-[107px] w-[107px] shrink-0 overflow-hidden bg-slate-100">
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
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center gap-[5px] bg-slate-100 px-[15px] py-2.5">
                <TopBestSellerCardBadges
                    showTopBadge={showTopBadge}
                    soldCount={soldCount}
                    hasDiscount={hasDiscount}
                    discountPercent={discountPercent}
                />

                <p className="line-clamp-2 text-left text-[14px] font-medium leading-snug text-slate-950">{name}</p>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 flex-col items-start gap-1.5 leading-none">
                        <p className="text-[16px] font-bold text-slate-950">{formatPrice(priceVal)}</p>
                        {hasDiscount ? (
                            <p className="text-[14px] font-normal text-slate-400 line-through decoration-solid">
                                {formatPrice(originalPriceVal)}
                            </p>
                        ) : null}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            data-top-seller-action
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddClick?.(e);
                            }}
                            className="flex items-center justify-center rounded-full bg-slate-950 p-2 text-white transition-transform active:scale-95"
                            aria-label="Añadir o ver producto"
                        >
                            <Plus className="size-5" strokeWidth={2} aria-hidden />
                        </button>
                        {onFavoriteClick ? (
                            <button
                                type="button"
                                data-top-seller-action
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFavoriteClick(e);
                                }}
                                className="flex items-center justify-center rounded-full bg-red-100 p-2 text-red-500 transition-colors hover:bg-red-100"
                                aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                            >
                                <Heart
                                    className={cn('size-5', isFavorite ? 'fill-red-500 text-red-500' : 'text-red-500')}
                                    strokeWidth={2}
                                    aria-hidden
                                />
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
