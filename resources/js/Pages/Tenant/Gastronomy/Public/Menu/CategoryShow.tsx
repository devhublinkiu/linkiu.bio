import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Components/Tenant/Gastronomy/Public/PublicLayout';
import Header from '@/Components/Tenant/Gastronomy/Public/Header';
import { Search, X, Flame, Star, Percent, Leaf, ChevronLeft } from 'lucide-react';
import ProductCard from '@/Components/Tenant/Gastronomy/Public/Menu/ProductCard';
import ProductDetailDrawer from '@/Components/Tenant/Gastronomy/Public/ProductDetailDrawer';

interface TenantProps {
    slug: string;
    name: string;
    logo_url?: string;
    store_description?: string;
    brand_colors?: { bg_color?: string; name_color?: string; description_color?: string };
}

interface Product {
    id: number;
    name: string;
    slug?: string;
    short_description: string | null;
    price: string;
    original_price?: string | null;
    image_url: string | null;
    is_available: boolean;
    is_featured?: boolean;
    tags?: string[];
}

interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: {
        icon_url: string;
        name: string;
    } | null;
    products: Product[];
}

interface Props {
    tenant: TenantProps;
    category: Category;
    categories: Category[];
}

/** Tags de producto que pueden venir en BD (slug o label) para filtrar "Vegetariano" */
const VEGGIE_TAG_VARIANTS = ['Vegetariano', 'vegetariano', 'veggie', 'Veggie'];

export default function CategoryShow({ tenant, category, categories }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTag, setActiveTag] = useState('Todos');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const brandColors = tenant.brand_colors ?? { bg_color: '#f8fafc', name_color: '#1e293b', description_color: '#64748b' };
    const { bg_color, name_color } = brandColors;

    // Abrir el producto si viene ?product=slug (ej. desde un short promocional)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const productSlug = params.get('product');
        if (!productSlug || !category.products?.length) return;
        const product = category.products.find((p) => p.slug === productSlug);
        if (product) {
            setSelectedProduct(product);
            setIsDrawerOpen(true);
        }
    }, [category.products]);

    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.visit(route('tenant.menu', tenant.slug));
        }
    };

    const tags = [
        { id: 'todos', label: 'Todos', icon: null },
        { id: 'featured', label: 'Destacados', icon: Flame },
        { id: 'offers', label: 'Ofertas', icon: Percent },
        { id: 'veggie', label: 'Vegetariano', icon: Leaf },
        { id: 'top', label: 'Populares', icon: Star },
    ];

    const filteredProducts = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();

        return category.products.filter(p => {
            const matchesSearch = !query ||
                p.name.toLowerCase().includes(query) ||
                (p.short_description && p.short_description.toLowerCase().includes(query));

            const tagMatch =
                activeTag === 'Todos' ||
                (activeTag === 'Destacados' && p.is_featured) ||
                (activeTag === 'Populares' && p.is_featured) ||
                (activeTag === 'Ofertas' && p.original_price && parseFloat(p.original_price) > parseFloat(p.price)) ||
                (activeTag === 'Vegetariano' && p.tags && p.tags.some(t => VEGGIE_TAG_VARIANTS.includes(String(t)))) ||
                (p.tags && p.tags.includes(activeTag));

            return matchesSearch && tagMatch;
        });
    }, [category.products, searchQuery, activeTag]);

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsDrawerOpen(true);
    };

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title={`${category.name} - ${tenant.name}`} />

            <div className="flex flex-col min-h-screen bg-gray-50/50">
                <Header
                    tenantName={tenant.name}
                    logoUrl={tenant.logo_url}
                    description={tenant.store_description}
                    bgColor={bg_color}
                    textColor={name_color}
                    descriptionColor={brandColors.description_color}
                />

                {/* Back Link & Category Header */}
                <div className="bg-white px-4 pt-4 pb-2 flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 active:scale-95 transition-all"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                            {category.name}
                        </h1>
                    </div>
                </div>

                {/* Horizontal Category Navigation */}
                <div className="bg-white border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-4 px-4 overflow-x-auto no-scrollbar py-2">
                        {categories.map((cat) => {
                            const isActive = cat.id === category.id;
                            return (
                                <Link
                                    key={cat.id}
                                    href={isActive ? '#' : route('tenant.menu.category', [tenant.slug, cat.slug])}
                                    className="flex flex-col items-center gap-2.5 shrink-0 group"
                                >
                                    {/* Squircle (Soft Rounded Square) Container - EXACTLY as Index/Home */}
                                    <div className={`
                                        w-[4.5rem] h-[4.5rem] rounded-[1.2rem] bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-active:scale-95 border border-slate-100/80 overflow-hidden relative
                                        ${isActive ? 'shadow-lg border-slate-300' : 'shadow-sm'}
                                    `}>
                                        <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50 opacity-50" />

                                        {cat.icon ? (
                                            <img
                                                src={cat.icon.icon_url}
                                                alt={cat.name}
                                                className="w-9 h-9 object-contain relative z-10 opacity-90 group-hover:opacity-100 transition-opacity"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-300 font-bold text-xs relative z-10">
                                                {cat.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <span className={`text-[11px] font-semibold text-center leading-tight line-clamp-2 px-0.5 transition-colors ${isActive ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                        {cat.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Sticky Search & Tags Bar */}
                <div className="sticky top-0 z-[100] bg-white shadow-sm border-b border-slate-100 pb-0.5">
                    {/* Search Bar */}
                    <div className="px-4 pt-4 pb-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="size-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder={`Buscar en ${category.name}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-11 pl-12 pr-10 bg-slate-100 border-transparent focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 rounded-2xl text-sm font-medium transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-3 flex items-center px-1"
                                >
                                    <X className="size-4 text-slate-400 bg-slate-200 rounded-full p-0.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tags Filter */}
                    <div className="flex items-center gap-2 px-4 pb-4 overflow-x-auto no-scrollbar scroll-smooth">
                        {tags.map((tag) => {
                            const Icon = tag.icon;
                            const isActive = activeTag === tag.label;
                            return (
                                <button
                                    key={tag.id}
                                    onClick={() => setActiveTag(tag.label)}
                                    className={`
                                        shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border
                                        ${isActive
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                                            : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                                        }
                                    `}
                                >
                                    {Icon && <Icon className={`size-3.5 ${isActive ? 'fill-current' : ''}`} />}
                                    {tag.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="p-4 pb-32 space-y-4">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={() => handleProductClick(product)}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                                <Search className="size-10 text-slate-200" />
                            </div>
                            <h3 className="font-bold text-slate-900">No encontramos productos</h3>
                            <p className="text-sm text-slate-400 mt-1 max-w-[200px]">
                                Intenta con otros filtros o busca algo distinto.
                            </p>
                        </div>
                    )}
                </div>

                {selectedProduct && (
                    <ProductDetailDrawer
                        product={selectedProduct as unknown as React.ComponentProps<typeof ProductDetailDrawer>['product']}
                        isOpen={isDrawerOpen}
                        onClose={() => setIsDrawerOpen(false)}
                    />
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </PublicLayout>
    );
}
