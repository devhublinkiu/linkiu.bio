import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AprilAds from './verticalsAds/aprilAds';

export type VerticalsAdsProps = {
    className?: string;
};

/**
 * Ads de cabecera por vertical. Creá el componente en `parts/verticalsAds/<nombre>.tsx` e importalo en el `case` correspondiente.
 */
export default function VerticalsAds(props: VerticalsAdsProps) {
    const slug = usePage<PageProps>().props.currentTenant?.vertical?.slug;

    switch (slug) {
        case 'gastronomia':
            return <AprilAds {...props} />;

        case 'ecommerce':
            // import EcommerceAds from './verticalsAds/ecommerceAds';
            // return <EcommerceAds {...props} />;
            return null;

        case 'church':
        case 'iglesias':
            // import ChurchAds from './verticalsAds/churchAds';
            // return <ChurchAds {...props} />;
            return null;

        case 'servicios':
            // import ServiciosAds from './verticalsAds/serviciosAds';
            // return <ServiciosAds {...props} />;
            return null;

        case 'dropshipping':
            // import DropshippingAds from './verticalsAds/dropshippingAds';
            // return <DropshippingAds {...props} />;
            return null;

        default:
            return null;
    }
}
