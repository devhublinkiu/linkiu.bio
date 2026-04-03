import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import ProductCardVertical from './parts/ProductCardVertical';
import type { ProductListVerticalProduct } from './types';

export type { ProductListVerticalProduct } from './types';
export type { ProductCardVerticalProps } from './parts/ProductCardVertical';
export { default as ProductCardVertical } from './parts/ProductCardVertical';

export type ProductListVerticalRef = {
    scrollPrev: () => void;
    scrollNext: () => void;
};

export interface ProductListVerticalProps {
    products: ProductListVerticalProduct[];
    onProductClick: (product: ProductListVerticalProduct) => void;
}

const ProductListVertical = forwardRef<ProductListVerticalRef, ProductListVerticalProps>(function ProductListVertical(
    { products, onProductClick },
    ref,
) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const sliderRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
        scrollPrev() {
            if (!sliderRef.current) return;
            const card = sliderRef.current.querySelector('[data-featured-card]');
            const step = (card?.getBoundingClientRect().width ?? 200) + 16;
            sliderRef.current.scrollBy({ left: -step, behavior: 'smooth' });
        },
        scrollNext() {
            if (!sliderRef.current) return;
            const card = sliderRef.current.querySelector('[data-featured-card]');
            const step = (card?.getBoundingClientRect().width ?? 200) + 16;
            sliderRef.current.scrollBy({ left: step, behavior: 'smooth' });
        },
    }));

    if (!products?.length) {
        return null;
    }

    return (
        <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4 [scrollbar-width:none]"
            data-name="ProductListVertical"
        >
            {products.map((product) => {
                const priceVal = Number(product.price);
                const isFav = isFavorite(product.id);

                return (
                    <ProductCardVertical
                        key={product.id}
                        name={product.name}
                        imageUrl={product.image_url}
                        price={priceVal}
                        originalPrice={product.original_price}
                        isFeatured={product.is_featured}
                        isFavorite={isFav}
                        onCardClick={() => onProductClick(product)}
                        onFavoriteClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                        }}
                        onAddClick={(e) => {
                            e.stopPropagation();
                            onProductClick(product);
                        }}
                    />
                );
            })}
        </div>
    );
});

export default ProductListVertical;
