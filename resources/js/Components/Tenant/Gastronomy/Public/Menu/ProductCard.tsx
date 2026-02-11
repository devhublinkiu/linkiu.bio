import React from 'react';
import { Flame, Heart, Plus, ShoppingBag } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface Product {
    id: number;
    name: string;
    short_description: string | null;
    price: string;
    original_price?: string | null;
    image_url: string | null;
    is_available: boolean;
    is_featured?: boolean;
}

interface ProductCardProps {
    product: Product;
    onClick?: () => void;
}

const formatPrice = (price: string) => {
    const p = parseFloat(price);
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(p);
};

export default function ProductCard({ product, onClick }: ProductCardProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const favorite = isFavorite(product.id);

    const priceVal = parseFloat(product.price);
    const originalPriceVal = product.original_price ? parseFloat(product.original_price) : 0;
    const hasDiscount = originalPriceVal > priceVal;

    const discountPercent = hasDiscount
        ? Math.round(((originalPriceVal - priceVal) / originalPriceVal) * 100)
        : 0;

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-[1.5rem] p-3 shadow-sm border border-slate-100 flex gap-4 transition-all duration-300 active:scale-[0.98] group relative overflow-hidden cursor-pointer"
        >
            {/* Image Container (Left) */}
            <div className="w-28 h-28 shrink-0 rounded-[1.2rem] overflow-hidden relative bg-gray-100">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingBag className="size-8" />
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
                    className={`absolute -top-1 right-0 p-2 transition-all duration-300 rounded-full active:scale-90 ${favorite ? 'text-rose-500 bg-rose-50/50' : 'text-slate-300 hover:text-rose-400'}`}
                >
                    <Heart className={`size-5 ${favorite ? 'fill-current' : ''}`} />
                </button>

                <div className="pr-8">
                    <h3 className="text-base font-bold text-gray-900 leading-tight mb-1 line-clamp-2">
                        {product.name}
                    </h3>
                    {product.short_description && (
                        <p className="text-xs text-slate-500 line-clamp-2 font-medium leading-relaxed">
                            {product.short_description}
                        </p>
                    )}
                </div>

                <div className="flex items-end justify-between mt-2">
                    <div className="flex flex-col">
                        {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through font-medium decoration-gray-400 decoration-1">
                                {formatPrice(product.original_price!)}
                            </span>
                        )}
                        <span className={`text-lg font-black tracking-tight ${hasDiscount ? 'text-rose-600' : 'text-gray-900'}`}>
                            {formatPrice(product.price)}
                        </span>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick?.();
                        }}
                        className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/20 active:bg-slate-800 transition-colors transform active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
