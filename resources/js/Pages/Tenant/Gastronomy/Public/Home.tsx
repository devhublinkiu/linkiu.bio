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
import SuccesTimelineShort, {
    type ActivePublicOrder,
    type ActivePublicReservation,
} from '@/Components/Tenant/Public/ModulesVerticals/Shared/SuccesTimelineShort';

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
    sold_count_30d?: number;
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
    tenant: { id: number; name: string; slug: string; logo_url?: string; store_description?: string; brand_colors?: TenantBrandColors };
    sliders: HomeSlider[];
    categories: HomeCategory[];
    featured_products?: HomeProduct[];
    top_selling_products?: HomeProduct[];
    tickers: Ticker[];
    promo_shorts?: PromoShort[];
    /** Pedidos activos del visitante (sesión) para el timeline del home. */
    active_public_orders?: ActivePublicOrder[];
    /** Reservas activas del visitante (sesión) para el timeline del home. */
    active_public_reservations?: ActivePublicReservation[];
}

export default function Home({
    tenant,
    sliders,
    categories,
    featured_products = [],
    top_selling_products = [],
    tickers,
    promo_shorts = [],
    active_public_orders = [],
    active_public_reservations = [],
}: Props) {
    const brandColors = tenant.brand_colors ?? {};
    const bg_color = brandColors.bg_color ?? '#db2777';
    const destacadosSliderRef = useRef<ProductListVerticalRef>(null);

    const [drawerProduct, setDrawerProduct] = useState<HomeProduct | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const openProduct = (product: HomeProduct) => {
        setDrawerProduct(product);
        setDrawerOpen(true);
    };

    const hasOrders = active_public_orders.length > 0;
    const hasReservations = active_public_reservations.length > 0;
    const timelineTitle =
        hasOrders && hasReservations
            ? 'Pedidos y reservas activas'
            : hasReservations
              ? 'Tus reservas activas'
              : 'Tus órdenes activas';
    const pillSuffixSingular =
        hasOrders && hasReservations ? 'activo' : hasReservations ? 'reserva' : 'orden';
    const pillSuffixPlural =
        hasOrders && hasReservations ? 'activos' : hasReservations ? 'reservas' : 'órdenes';

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title={tenant.name} />

            <div className="flex flex-col">
                <TickersPromo tickers={tickers} />
            </div>

            <div className="flex-1 min-w-0 p-4 -mt-4 relative z-0 pb-4 flex flex-col gap-4">
                <SlidersPromo sliders={sliders} tenantSlug={tenant.slug} />

                <SuccesTimelineShort
                    orders={active_public_orders}
                    reservations={active_public_reservations}
                    tenantId={tenant.id}
                    title={timelineTitle}
                    pillSuffixSingular={pillSuffixSingular}
                    pillSuffixPlural={pillSuffixPlural}
                />

                <CategoryShort categories={categories} tenantSlug={tenant.slug} />

                {Array.isArray(top_selling_products) && top_selling_products.length > 0 && (
                    <TopBestSeller products={top_selling_products} onProductClick={openProduct} />
                )}

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
