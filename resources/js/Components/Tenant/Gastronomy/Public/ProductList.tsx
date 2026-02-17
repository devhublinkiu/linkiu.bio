import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Flame, Heart, Plus } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';
import ProductDetailDrawer from './ProductDetailDrawer';
import { useFavorites } from '@/hooks/useFavorites';
import { formatPrice } from '@/lib/utils';

interface Product {
    id: number;
    name: string;
    short_description?: string;
    price: number;
    original_price?: number;
    image_url?: string;
    is_featured: boolean;
    preparation_time?: string;
    calories?: string;
    variant_groups?: any[]; // We let the drawer handle the exact type
}

export type ProductListRef = {
    scrollPrev: () => void;
    scrollNext: () => void;
};

interface ProductListProps {
    products: Product[];
    currency?: string;
    hideTitle?: boolean;
    section?: string;
    layout?: 'horizontal' | 'vertical';
}

const ProductList = forwardRef<ProductListRef, ProductListProps>(function ProductList(
    { products, currency = '$', hideTitle = false, section, layout = 'horizontal' },
    ref
) {
    const { addToCart } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
        scrollPrev() {
            if (!sliderRef.current) return;
            const card = sliderRef.current.querySelector('[data-featured-card]');
            const step = (card?.getBoundingClientRect().width ?? 224) + 16;
            sliderRef.current.scrollBy({ left: -step, behavior: 'smooth' });
        },
        scrollNext() {
            if (!sliderRef.current) return;
            const card = sliderRef.current.querySelector('[data-featured-card]');
            const step = (card?.getBoundingClientRect().width ?? 224) + 16;
            sliderRef.current.scrollBy({ left: step, behavior: 'smooth' });
        },
    }), []);

    if (!products || products.length === 0) return null;

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsDrawerOpen(true);
    };

    const showTitle = !hideTitle && section !== 'destacados' && section !== 'top_selling' && section !== 'category';

    const isVertical = layout === 'vertical';

    return (
        <div className="w-full px-4 mb-4">
            {showTitle && <h2 className="text-xl font-bold text-gray-400 uppercase mb-4">Todos los productos</h2>}

            <div
                ref={isVertical ? sliderRef : undefined}
                className={isVertical ? 'flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4 [scrollbar-width:none]' : 'flex flex-col gap-4'}
            >
                {products.map((product) => {
                    const priceVal = Number(product.price);
                    const originalPriceVal = Number(product.original_price);
                    const isFav = isFavorite(product.id);

                    const hasDiscount = originalPriceVal > priceVal;
                    const discountPercent = hasDiscount
                        ? Math.round(((originalPriceVal - priceVal) / originalPriceVal) * 100)
                        : 0;

                    if (isVertical) {
                        return (
                            <div
                                key={product.id}
                                onClick={() => handleProductClick(product)}
                                className="w-56 shrink-0 snap-start bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100/80 transition-all duration-300 active:scale-[0.98] group cursor-pointer"
                                data-featured-card
                            >
                                {/* Imagen arriba: protagonista, ratio 1/1 */}
                                <div className="relative aspect-[1/1] overflow-hidden bg-gray-100">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    {product.is_featured && (
                                        <div className="absolute top-2 left-2 bg-amber-400/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-0.5 z-10">
                                            <Flame className="w-3 h-3 fill-white" />
                                            <span>TOP</span>
                                        </div>
                                    )}
                                    {hasDiscount && (
                                        <div className="absolute bottom-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow z-10">
                                            -{discountPercent}%
                                        </div>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(product.id);
                                        }}
                                        className={`absolute top-2 right-2 p-1.5 rounded-full shadow transition-all z-10 ${isFav ? 'text-rose-500 bg-white/90' : 'text-white/90 bg-black/20 hover:bg-black/30'}`}
                                    >
                                        <Heart className={`size-4 ${isFav ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                                {/* Texto abajo: compacto */}
                                <div className="p-3">
                                    <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-1.5">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            {hasDiscount && (
                                                <span className="text-xs text-gray-400 line-through block">
                                                    {formatPrice(Number(product.original_price ?? 0))}
                                                </span>
                                            )}
                                            <span className={`text-base font-bold tracking-tight ${hasDiscount ? 'text-rose-600' : 'text-gray-900'}`}>
                                                {formatPrice(Number(product.price))}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleProductClick(product);
                                            }}
                                            className="shrink-0 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow active:scale-95 transition-transform"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            className="bg-white rounded-[1.5rem] p-3 shadow-sm border border-slate-100 flex gap-4 transition-all duration-300 active:scale-[0.98] group relative overflow-hidden cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className="w-28 h-28 shrink-0 rounded-[1.2rem] overflow-hidden relative bg-gray-100">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}

                                {/* Featured Badge */}
                                {product.is_featured && (
                                    <div className="absolute top-2 left-2 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-0.5 z-10">
                                        <Flame className="w-3 h-3 fill-white" />
                                        <span>TOP</span>
                                    </div>
                                )}

                                {/* Discount Badge */}
                                {hasDiscount && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-rose-500 text-white text-[10px] font-bold py-0.5 text-center shadow-lg transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        -{discountPercent}%
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-between py-1 relative">

                                {/* Favorite Button (Absolute Top Right) */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(product.id);
                                    }}
                                    className={`absolute -top-1 right-0 p-2 transition-all duration-300 rounded-full active:scale-90 ${isFav ? 'text-rose-500 bg-rose-50/50' : 'text-slate-300 hover:text-rose-400'}`}
                                >
                                    <Heart className={`size-5 ${isFav ? 'fill-current' : ''}`} />
                                </button>

                                <div className="pr-8">
                                    <h3 className="text-base font-bold text-gray-900 leading-tight mb-1 line-clamp-2">
                                        {product.name}
                                    </h3>

                                    {product.short_description && (
                                        <p className="text-xs text-gray-500 line-clamp-2 font-medium leading-relaxed">
                                            {product.short_description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-end justify-between mt-2">
                                    <div className="flex flex-col">
                                        {hasDiscount && (
                                            <span className="text-xs text-gray-400 line-through font-medium decoration-gray-400 decoration-1">
                                                {formatPrice(Number(product.original_price ?? 0))}
                                            </span>
                                        )}
                                        <span className={`text-lg font-black tracking-tight ${hasDiscount ? 'text-rose-600' : 'text-gray-900'}`}>
                                            {formatPrice(Number(product.price))}
                                        </span>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleProductClick(product);
                                        }}
                                        className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/20 active:bg-slate-800 transition-colors transform active:scale-95"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedProduct && (
                <ProductDetailDrawer
                    product={selectedProduct}
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                />
            )}
        </div>
    );
});

export default ProductList;
