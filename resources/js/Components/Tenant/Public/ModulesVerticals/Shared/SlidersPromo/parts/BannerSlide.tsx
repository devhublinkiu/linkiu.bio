import LinkedBadge from './LinkedBadge';
import type { BannerSliderItem } from '../types';

interface Props {
    slider: BannerSliderItem;
    url: string | null;
    total: number;
    /** Primera diapositiva “real” del carrusel infinito: mejor LCP */
    imageLoading?: 'eager' | 'lazy';
}

export default function BannerSlide({ slider, url, total, imageLoading = 'lazy' }: Props) {
    const media = slider.desktop_image_url ? (
        <picture className="block h-full w-full">
            <source media="(min-width: 768px)" srcSet={slider.desktop_image_url} />
            <img
                src={slider.image_url}
                alt={slider.name}
                className="h-full w-full object-cover"
                loading={imageLoading}
                decoding="async"
            />
        </picture>
    ) : (
        <img
            src={slider.image_url}
            alt={slider.name}
            className="h-full w-full object-cover"
            loading={imageLoading}
            decoding="async"
        />
    );

    return (
        <div
            className="relative w-full flex-shrink-0 overflow-hidden"
            role="group"
            aria-roledescription="slide"
            aria-label={`${slider.name}, ${total} promociones en total`}
        >
            {url ? (
                <a href={url} className="relative block h-full w-full min-h-0" aria-label={slider.name}>
                    <LinkedBadge />
                    {media}
                </a>
            ) : (
                media
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
    );
}
