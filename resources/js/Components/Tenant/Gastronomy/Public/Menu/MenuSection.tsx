import React, { useEffect, useRef } from 'react';
import ProductCard from './ProductCard';

interface Product {
    id: number;
    name: string;
    short_description: string | null;
    price: string;
    original_price?: string | null;
    image_url: string | null;
    is_available: boolean;
}

interface Category {
    id: number;
    name: string;
    products: Product[];
}

interface MenuSectionProps {
    category: Category;
    onVisible: (id: number) => void;
    onProductClick: (product: Product) => void;
}

export default function MenuSection({ category, onProductClick }: Omit<MenuSectionProps, 'onVisible'>) {
    const sectionRef = useRef<HTMLDivElement>(null);

    return (
        <section
            id={`category-${category.id}`}
            ref={sectionRef}
            className="scroll-mt-52 mb-10"
        >
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-black text-slate-900 tracking-tight pl-2 border-l-4 border-slate-900">
                    {category.name}
                </h2>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-lg">
                    {category.products.length} {category.products.length === 1 ? 'ítem' : 'ítems'}
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {category.products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onClick={() => onProductClick(product)}
                    />
                ))}
            </div>
        </section>
    );
}
