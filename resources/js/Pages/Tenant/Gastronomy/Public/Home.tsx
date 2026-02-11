import PublicLayout from '@/Components/Tenant/Gastronomy/Public/PublicLayout';
import Header from '@/Components/Tenant/Gastronomy/Public/Header';
import BannerSlider from '@/Components/Tenant/Gastronomy/Public/BannerSlider';
import CategoryGrid from '@/Components/Tenant/Gastronomy/Public/CategoryGrid';
import PromotionalTicker from '@/Components/Tenant/Gastronomy/Public/PromotionalTicker';
import ProductList from '@/Components/Tenant/Gastronomy/Public/ProductList';
import { Head } from '@inertiajs/react';

interface Props {
    tenant: any;
    sliders: any[];
    categories: any[];
    products: any[];
    tickers: any[];
}

export default function Home({ tenant, sliders, categories, products, tickers }: Props) {
    const { bg_color, name_color, description_color } = tenant.brand_colors;

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
                />

                <PromotionalTicker tickers={tickers} />
            </div>

            <div className="flex-1 bg-gray-50 p-4 -mt-4 relative z-0 pb-20 flex flex-col gap-8">
                <BannerSlider sliders={sliders} />

                <CategoryGrid categories={categories} />

                <ProductList products={products} />

                {/* Footer Spacer if needed */}
                <div className="h-10" />
            </div>
        </PublicLayout>
    );
}
