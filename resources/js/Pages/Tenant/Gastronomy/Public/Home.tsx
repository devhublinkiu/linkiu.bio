import { useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import type { Ticker } from '@/types/ticker';
import PublicLayout from '@/Components/Tenant/Gastronomy/Public/PublicLayout';
import Header from '@/Components/Tenant/Gastronomy/Public/Header';
import BannerSlider from '@/Components/Tenant/Gastronomy/Public/BannerSlider';
import CategoryGrid from '@/Components/Tenant/Gastronomy/Public/CategoryGrid';
import PromotionalTicker from '@/Components/Tenant/Public/PromotionalTicker';
import ProductList, { type ProductListRef } from '@/Components/Tenant/Gastronomy/Public/ProductList';
import { Carousel, PromoCard, type PromoCardData } from '@/Components/ui/promo-carousel';
import { ChevronLeft, ChevronRight, Clock, Flame, Trophy } from 'lucide-react';

interface TenantBrandColors {
    bg_color?: string;
    name_color?: string;
    description_color?: string;
}

interface HomeCategory {
    id: number;
    name: string;
    slug: string;
    icon?: { icon_url: string; name: string };
}

interface HomeProduct {
    id: number;
    name: string;
    price: number;
    original_price?: number;
    image_url?: string;
    is_featured: boolean;
    short_description?: string;
    variant_groups?: unknown[];
}

interface HomeSlider {
    id: number;
    name: string;
    image_url: string;
    link_type: string;
    external_url?: string;
}

interface PromoShort {
    id: number;
    name: string;
    description: string;
    short_embed_url: string;
    link_type: string;
    action_url: string;
}

interface TopCategory {
    id: number;
    name: string;
    slug: string;
    products: HomeProduct[];
}

interface Props {
    tenant: { name: string; slug: string; logo_url?: string; store_description?: string; brand_colors?: TenantBrandColors };
    sliders: HomeSlider[];
    categories: HomeCategory[];
    featured_products?: HomeProduct[];
    top_selling_products?: HomeProduct[];
    top_categories?: TopCategory[];
    location_status_message?: string | null;
    tickers: Ticker[];
    promo_shorts?: PromoShort[];
}

export default function Home({
    tenant,
    sliders,
    categories,
    featured_products = [],
    top_selling_products = [],
    top_categories = [],
    location_status_message = null,
    tickers,
    promo_shorts = [],
}: Props) {
    const brandColors = tenant.brand_colors ?? {};
    const bg_color = brandColors.bg_color ?? '#db2777';
    const name_color = brandColors.name_color ?? '#ffffff';
    const description_color = brandColors.description_color;
    const destacadosSliderRef = useRef<ProductListRef>(null);
    const topSellingSliderRef = useRef<ProductListRef>(null);
    const categorySliderRefs = useRef<(ProductListRef | null)[]>([]);

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title={tenant.name} />

            <div className="flex flex-col">
                <Header
                    tenantName={tenant.name}
                    logoUrl={tenant.logo_url}
                    description={tenant.store_description}
                    bgColor={bg_color}
                    textColor={name_color}
                    descriptionColor={description_color}
                />

                {location_status_message && (
                    <div className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700">
                        <Clock className="size-4 text-slate-500 shrink-0" aria-hidden />
                        <span>{location_status_message}</span>
                    </div>
                )}

                <PromotionalTicker tickers={tickers} />
            </div>

            <div className="flex-1 bg-gray-50 p-4 -mt-4 relative z-0 pb-20 flex flex-col gap-4">
                <BannerSlider sliders={sliders} tenantSlug={tenant.slug} />

                <CategoryGrid categories={categories} />

                {Array.isArray(featured_products) && featured_products.length > 0 && (
                    <section className="w-full px-4" aria-labelledby="destacados-heading">
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <h2 id="destacados-heading" className="text-lg font-bold text-slate-900">
                                Destacados
                            </h2>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={route('tenant.menu', { tenant: tenant.slug })}
                                    className="text-sm font-medium text-slate-500 hover:text-slate-700"
                                >
                                    Ver todos
                                </Link>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => destacadosSliderRef.current?.scrollPrev()}
                                        className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                        aria-label="Anterior"
                                    >
                                        <ChevronLeft className="size-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => destacadosSliderRef.current?.scrollNext()}
                                        className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                        aria-label="Siguiente"
                                    >
                                        <ChevronRight className="size-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <ProductList ref={destacadosSliderRef} products={featured_products} section="destacados" layout="vertical" />
                    </section>
                )}

                {Array.isArray(top_selling_products) && top_selling_products.length > 0 && (
                    <section className="w-full px-4" aria-labelledby="mas-vendidos-heading">
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <h2 id="mas-vendidos-heading" className="text-lg font-bold text-slate-900">
                                Los 3 más vendidos
                            </h2>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={route('tenant.menu', { tenant: tenant.slug })}
                                    className="text-sm font-medium text-slate-500 hover:text-slate-700"
                                >
                                    Ver todos
                                </Link>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => topSellingSliderRef.current?.scrollPrev()}
                                        className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                        aria-label="Anterior"
                                    >
                                        <ChevronLeft className="size-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => topSellingSliderRef.current?.scrollNext()}
                                        className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                        aria-label="Siguiente"
                                    >
                                        <ChevronRight className="size-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <ProductList ref={topSellingSliderRef} products={top_selling_products} section="top_selling" layout="vertical" />
                    </section>
                )}

                {Array.isArray(promo_shorts) && promo_shorts.length > 0 && (
                    <section className="w-full" aria-labelledby="promos-heading">
                        <h2 id="promos-heading" className="text-[140px] font-bold text-gray-200 px-4 flex items-center -mb-24">
                            Shorts
                        </h2>
                        <Carousel
                            items={promo_shorts.map((short, index) => (
                                <PromoCard
                                    key={short.id}
                                    card={{
                                        title: short.name,
                                        short_embed_url: short.short_embed_url,
                                        action_url: short.action_url,
                                        link_type: short.link_type,
                                    }}
                                    index={index}
                                />
                            ))}
                        />
                    </section>
                )}

                {top_categories.map((category, index) => (
                    <section key={category.id} className="w-full px-4" aria-labelledby={`category-${category.id}-heading`}>
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <h2 id={`category-${category.id}-heading`} className="text-lg font-bold text-slate-900">
                                {category.name}
                            </h2>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={route('tenant.menu.category', { tenant: tenant.slug, slug: category.slug })}
                                    className="text-sm font-medium text-slate-500 hover:text-slate-700"
                                >
                                    Ver todos
                                </Link>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => categorySliderRefs.current[index]?.scrollPrev()}
                                        className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                        aria-label="Anterior"
                                    >
                                        <ChevronLeft className="size-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => categorySliderRefs.current[index]?.scrollNext()}
                                        className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                        aria-label="Siguiente"
                                    >
                                        <ChevronRight className="size-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <ProductList
                            ref={(el) => { categorySliderRefs.current[index] = el; }}
                            products={category.products}
                            section="category"
                            layout="vertical"
                        />
                    </section>
                ))}

            </div>
        </PublicLayout>
    );
}
