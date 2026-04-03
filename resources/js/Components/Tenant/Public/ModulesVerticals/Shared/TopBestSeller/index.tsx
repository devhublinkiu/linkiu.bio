import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';
import type { ProductListVerticalProduct } from '../ProductListVertical/types';

import HeaderTopBestSeller from './parts/HeaderTopBestSeller';
import ItemProductTopBestSeller from './parts/ItemProductTopBestSeller';

interface TopBestSellerProps {
    products: ProductListVerticalProduct[];
    onProductClick: (product: ProductListVerticalProduct) => void;
    /** Máximo de ítems en la rejilla (por defecto 6 → 3×2). */
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
    const list = products.slice(0, topCount);

    if (!list.length) {
        return null;
    }

    return (
        <section className={cn('w-full', className)} aria-labelledby="top-best-seller-heading">
            <HeaderTopBestSeller headingId="top-best-seller-heading" topCount={topCount} />

            <div
                className="mt-3 grid grid-cols-3 gap-x-2 gap-y-3 justify-items-center px-1 pb-1"
                data-name="TopBestSellerGrid"
            >
                {list.map((product) => (
                    <ItemProductTopBestSeller
                        key={product.id}
                        name={product.name}
                        imageUrl={product.image_url}
                        onVerProductoClick={() => onProductClick(product)}
                        onFavoriteClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                        }}
                        isFavorite={isFavorite(product.id)}
                    />
                ))}
            </div>
        </section>
    );
}

export { default as HeaderTopBestSeller } from './parts/HeaderTopBestSeller';
export { default as ItemProductTopBestSeller } from './parts/ItemProductTopBestSeller';
