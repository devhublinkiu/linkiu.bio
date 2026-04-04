import { useState } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';
import type { ProductListVerticalProduct } from '../ProductListVertical/types';

import HeaderTopBestSeller from './parts/HeaderTopBestSeller';
import ItemProductTopBestSeller from './parts/ItemProductTopBestSeller';
import TopBestSellerExpandButton from './parts/TopBestSellerExpandButton';

const INITIAL_VISIBLE = 3;

interface TopBestSellerProps {
    products: ProductListVerticalProduct[];
    onProductClick: (product: ProductListVerticalProduct) => void;
    /** Máximo de ítems en el ranking (por defecto 6). */
    topCount?: number;
    className?: string;
}

export default function TopBestSeller({
    products,
    onProductClick,
    topCount = 6,
    className,
}: TopBestSellerProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const [expanded, setExpanded] = useState(false);

    const list = products.slice(0, topCount);
    const canExpand = list.length > INITIAL_VISIBLE;
    const visibleList = expanded || !canExpand ? list : list.slice(0, INITIAL_VISIBLE);

    if (!list.length) {
        return null;
    }

    return (
        <section className={cn('w-full', className)} aria-labelledby="top-best-seller-heading">
            <HeaderTopBestSeller headingId="top-best-seller-heading" topCount={topCount} />

            <div className="mt-3 flex flex-col gap-3 px-1" data-name="TopBestSellerList">
                {visibleList.map((product) => {
                    const raw = (product as { sold_count_30d?: unknown }).sold_count_30d;
                    const sold =
                        typeof raw === 'number'
                            ? raw
                            : typeof raw === 'string'
                              ? parseInt(raw, 10)
                              : NaN;

                    return (
                        <ItemProductTopBestSeller
                            key={product.id}
                            name={product.name}
                            imageUrl={product.image_url}
                            price={product.price}
                            originalPrice={product.original_price}
                            soldCount={Number.isFinite(sold) ? sold : undefined}
                            showTopBadge
                            onCardClick={() => onProductClick(product)}
                            onAddClick={() => onProductClick(product)}
                            onFavoriteClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(product.id);
                            }}
                            isFavorite={isFavorite(product.id)}
                        />
                    );
                })}
            </div>

            {canExpand ? (
                <TopBestSellerExpandButton expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
            ) : null}
        </section>
    );
}

export { default as HeaderTopBestSeller } from './parts/HeaderTopBestSeller';
export { default as ItemProductTopBestSeller } from './parts/ItemProductTopBestSeller';
export { default as TopBestSellerCardBadges } from './parts/TopBestSellerCardBadges';
