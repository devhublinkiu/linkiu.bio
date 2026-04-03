import { useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import type { Ticker } from '@/types/ticker';
import PublicLayout from '@/Components/Tenant/Gastronomy/Public/PublicLayout';
import ProductDetailDrawer from '@/Components/Tenant/Gastronomy/Public/ProductDetailDrawer';
import SlidersPromo from '@/Components/Tenant/Public/ModulesVerticals/Shared/SlidersPromo';
import CategoryShort from '@/Components/Tenant/Public/ModulesVerticals/Shared/CategoryShort';
import TopBestSeller from '@/Components/Tenant/Public/ModulesVerticals/Shared/TopBestSeller';
import HeaderSectionProducts from '@/Components/Tenant/Public/ModulesVerticals/Shared/HeaderSectionProducts';
import ProductListVertical, { type ProductListVerticalRef } from '@/Components/Tenant/Public/ModulesVerticals/Shared/ProductListVertical';
import TickersPromo from '@/Components/Tenant/Public/ModulesVerticals/Shared/TickersPromo';
import ShortsFeed from '@/Components/Tenant/Public/ModulesVerticals/Shared/ShortsFeed';

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
    variant_groups?: any[];
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
    poster_url?: string | null;
    link_type: string;
    action_url: string;
}

interface Props {
    tenant: { name: string; slug: string; logo_url?: string; store_description?: string; brand_colors?: TenantBrandColors };
    sliders: HomeSlider[];
    categories: HomeCategory[];
    featured_products?: HomeProduct[];
    top_selling_products?: HomeProduct[];
    tickers: Ticker[];
    promo_shorts?: PromoShort[];
}

export default function Home({
    tenant,
    sliders,
    categories,
    featured_products = [],
    top_selling_products = [],
    tickers,
    promo_shorts = [],
}: Props) {
    const brandColors = tenant.brand_colors ?? {};
    const bg_color = brandColors.bg_color ?? '#db2777';
    const destacadosSliderRef = useRef<ProductListVerticalRef>(null);
    const topSellingSliderRef = useRef<ProductListVerticalRef>(null);

    const [drawerProduct, setDrawerProduct] = useState<HomeProduct | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const openProduct = (product: HomeProduct) => {
        setDrawerProduct(product);
        setDrawerOpen(true);
    };

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title={tenant.name} />

            <div className="flex flex-col">
                <TickersPromo tickers={tickers} />
            </div>

            <div className="flex-1 min-w-0 p-4 -mt-4 relative z-0 pb-4 flex flex-col gap-4">
                <SlidersPromo sliders={sliders} tenantSlug={tenant.slug} />

                <CategoryShort categories={categories} tenantSlug={tenant.slug} />

                <TopBestSeller />

                {Array.isArray(featured_products) && featured_products.length > 0 && (
                    <section className="w-full px-4" aria-labelledby="destacados-heading">
                        <HeaderSectionProducts
                            headingId="destacados-heading"
                            title="Destacados"
                            availableCount={featured_products.length}
                            onPrev={() => destacadosSliderRef.current?.scrollPrev()}
                            onNext={() => destacadosSliderRef.current?.scrollNext()}
                        />
                        <ProductListVertical
                            ref={destacadosSliderRef}
                            products={featured_products}
                            onProductClick={openProduct}
                        />
                    </section>
                )}

                {Array.isArray(top_selling_products) && top_selling_products.length > 0 && (
                    <section className="w-full px-4" aria-labelledby="mas-vendidos-heading">
                        <HeaderSectionProducts
                            headingId="mas-vendidos-heading"
                            title="Los más vendidos"
                            availableCount={top_selling_products.length}
                            onPrev={() => topSellingSliderRef.current?.scrollPrev()}
                            onNext={() => topSellingSliderRef.current?.scrollNext()}
                        />
                        <ProductListVertical
                            ref={topSellingSliderRef}
                            products={top_selling_products}
                            onProductClick={openProduct}
                        />
                    </section>
                )}

                {Array.isArray(promo_shorts) && promo_shorts.length > 0 && (
                    <section className="w-full px-4" aria-labelledby="promos-heading">
                        <h2 id="promos-heading" className="mb-3 text-lg font-bold text-slate-900">
                            Shorts
                        </h2>
                        <ShortsFeed items={promo_shorts} />
                    </section>
                )}
            </div>

            {drawerProduct && (
                <ProductDetailDrawer
                    product={drawerProduct}
                    isOpen={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                />
            )}
        </PublicLayout>
    );
}
