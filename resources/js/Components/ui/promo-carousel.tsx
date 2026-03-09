'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface CarouselProps {
    items: React.ReactNode[];
    initialScroll?: number;
}

export type PromoCardData = {
    title: string;
    short_embed_url: string;
    action_url: string;
    link_type: string;
};

const CarouselContext = createContext<{ activeIndex: number }>({ activeIndex: 0 });

function ObservedCard({
    index,
    setActiveIndex,
    children,
    className,
}: {
    index: number;
    setActiveIndex: (i: number) => void;
    children: React.ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setActiveIndex(index);
                }
            },
            { threshold: 0.5, rootMargin: '0px' }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [index, setActiveIndex]);
    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollLeft = initialScroll;
            checkScrollability();
        }
    }, [initialScroll]);

    const checkScrollability = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
        }
    };

    const scrollLeft = () => {
        if (carouselRef.current) {
            const step = carouselRef.current.querySelector('[data-promo-card]')?.getBoundingClientRect().width ?? 280;
            const gap = 16;
            carouselRef.current.scrollBy({ left: -(step + gap), behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            const step = carouselRef.current.querySelector('[data-promo-card]')?.getBoundingClientRect().width ?? 280;
            const gap = 16;
            carouselRef.current.scrollBy({ left: step + gap, behavior: 'smooth' });
        }
    };

    return (
        <CarouselContext.Provider value={{ activeIndex }}>
            <div className="relative w-full min-w-0 overflow-hidden">
                <div
                    className="block w-full min-w-0 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory py-4 md:py-6 [-webkit-overflow-scrolling:touch] [scrollbar-width:none]"
                    ref={carouselRef}
                    onScroll={checkScrollability}
                >
                    <div className={cn('absolute right-0 top-0 bottom-0 z-[1000] w-[5%] overflow-hidden bg-gradient-to-l pointer-events-none')} />
                    <div className={cn('flex flex-row justify-start gap-4', 'max-w-7xl pl-[calc(50%-7rem)] md:pl-[calc(50%-12rem)]')}>
                        {items.map((item, index) => (
                            <ObservedCard
                                key={'obs-' + index}
                                index={index}
                                setActiveIndex={setActiveIndex}
                                className="rounded-lg last:pr-[5%] md:last:pr-[33%] snap-start shrink-0"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: 0.5,
                                            delay: 0.2 * index,
                                            ease: 'easeOut',
                                        },
                                    }}
                                >
                                    {item}
                                </motion.div>
                            </ObservedCard>
                        ))}
                    </div>
                </div>
            <div className="mt-2 flex justify-center gap-2">
                <button
                    type="button"
                    className="relative z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 disabled:opacity-50"
                    onClick={scrollLeft}
                    disabled={!canScrollLeft}
                    aria-label="Anterior"
                >
                    <ChevronLeft className="h-6 w-6 text-gray-500" />
                </button>
                <button
                    type="button"
                    className="relative z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 disabled:opacity-50"
                    onClick={scrollRight}
                    disabled={!canScrollRight}
                    aria-label="Siguiente"
                >
                    <ChevronRight className="h-6 w-6 text-gray-500" />
                </button>
            </div>
            </div>
        </CarouselContext.Provider>
    );
};

const LINK_TYPE_LABELS: Record<string, string> = {
    category: 'Categoría',
    product: 'Producto',
};

function buildEmbedUrl(embedUrl: string, autoplay: boolean): string {
    try {
        const url = new URL(embedUrl);
        if (autoplay) {
            url.searchParams.set('autoplay', 'true');
            url.searchParams.set('muted', 'false');
            url.searchParams.set('preload', 'true');
        }
        return url.toString();
    } catch {
        return autoplay ? `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=true&muted=false` : embedUrl;
    }
}

export const PromoCard = ({
    card,
    index,
}: {
    card: PromoCardData;
    index: number;
}) => {
    const { activeIndex } = useContext(CarouselContext);
    const badgeLabel = LINK_TYPE_LABELS[card.link_type] ?? null;
    const hasAction = card.action_url && card.action_url !== '#';
    const isActive = activeIndex === index;
    const iframeSrc = isActive ? buildEmbedUrl(card.short_embed_url, true) : 'about:blank';

    return (
        <article
            data-promo-card
            className="relative z-10 flex w-56 flex-shrink-0 flex-col overflow-hidden rounded-lg bg-gray-100 shadow-lg md:w-96 dark:bg-neutral-900"
            aria-labelledby={`promo-title-${index}`}
        >
            <div className="relative aspect-[9/16] w-full overflow-hidden bg-black rounded-t-lg">
                <iframe
                    title={card.title}
                    src={iframeSrc}
                    key={iframeSrc}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
                {/* Parte superior: título y debajo en dos columnas badges + botón */}
                <div className="absolute inset-x-0 top-0 z-10 flex flex-col gap-2 bg-gradient-to-b from-black/70 to-transparent px-4 pt-4 pb-6">
                    <h3
                        id={`promo-title-${index}`}
                        className="font-semibold text-white text-lg drop-shadow md:text-xl"
                    >
                        {card.title}
                    </h3>
                    <div className="flex flex-row items-center gap-1">
                        {badgeLabel && (
                            <span className="inline-flex rounded-lg bg-white/70 backdrop-blur-sm px-2 py-0.5 text-xs font-bold text-slate-900 border border-white/30">
                                {badgeLabel}
                            </span>
                        )}
                        {hasAction && (
                            <a
                                href={card.action_url}
                                className="shrink-0 rounded-lg border border-white/60 bg-white/70 px-3 py-0.5 text-xs font-bold text-slate-900 backdrop-blur-sm hover:bg-white/30 transition-colors"
                            >
                                Ver promoción
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};
