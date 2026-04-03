import { useEffect, useRef, useState } from 'react';
import BannerSlide from './parts/BannerSlide';
import CarouselDots from './parts/CarouselDots';
import CarouselNav from './parts/CarouselNav';
import type { BannerSliderItem } from './types';

export type { BannerSliderItem } from './types';

interface SlidersPromoProps {
    sliders: BannerSliderItem[];
    aspectRatio?: 'video' | 'square' | 'wide';
    tenantSlug: string;
}

export default function SlidersPromo({ sliders, aspectRatio = 'video', tenantSlug }: SlidersPromoProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(1);
    const [isHovered, setIsHovered] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduceMotion(mq.matches);
        const onChange = () => setReduceMotion(mq.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    const infiniteSliders =
        sliders && sliders.length > 1 ? [sliders[sliders.length - 1], ...sliders, sliders[0]] : sliders || [];

    const extendedLength = infiniteSliders.length;

    const scrollBehavior = (): ScrollBehavior => (reduceMotion ? 'auto' : 'smooth');

    useEffect(() => {
        if (sliders && sliders.length > 1 && scrollContainerRef.current) {
            const itemWidth = scrollContainerRef.current.offsetWidth;
            scrollContainerRef.current.scrollLeft = itemWidth;
        }
    }, [sliders?.length]);

    const scrollToSlide = (index: number, behavior?: ScrollBehavior) => {
        if (!scrollContainerRef.current) return;
        const itemWidth = scrollContainerRef.current.offsetWidth;
        const b = behavior ?? scrollBehavior();
        setIsScrolling(true);
        scrollContainerRef.current.scrollTo({
            left: index * itemWidth,
            behavior: b,
        });
    };

    const handleScrollEnd = () => {
        setIsScrolling(false);
        if (!scrollContainerRef.current || !sliders?.length) return;

        const itemWidth = scrollContainerRef.current.offsetWidth;
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const index = Math.round(scrollLeft / itemWidth);

        if (index === 0) {
            scrollContainerRef.current.scrollTo({ left: sliders.length * itemWidth, behavior: 'auto' });
            setActiveIndex(sliders.length);
        } else if (index === extendedLength - 1) {
            scrollContainerRef.current.scrollTo({ left: itemWidth, behavior: 'auto' });
            setActiveIndex(1);
        } else {
            setActiveIndex(index);
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let timeout: ReturnType<typeof setTimeout>;
        const onScroll = () => {
            clearTimeout(timeout);
            timeout = setTimeout(handleScrollEnd, 150);
        };

        container.addEventListener('scroll', onScroll);
        return () => container.removeEventListener('scroll', onScroll);
    }, [extendedLength, sliders?.length]);

    const activeIndexRef = useRef(activeIndex);
    activeIndexRef.current = activeIndex;

    useEffect(() => {
        if (!sliders || sliders.length <= 1 || isHovered || reduceMotion) return;
        const interval = setInterval(() => {
            const next = activeIndexRef.current + 1;
            scrollToSlide(next);
        }, 4000);
        return () => clearInterval(interval);
    }, [isHovered, sliders?.length, reduceMotion]);

    const nextSlide = () => {
        if (isScrolling) return;
        scrollToSlide(activeIndex + 1, scrollBehavior());
    };

    const prevSlide = () => {
        if (isScrolling) return;
        scrollToSlide(activeIndex - 1, scrollBehavior());
    };

    const goToRealSlide = (realIdx: number) => {
        if (isScrolling || !sliders?.length || sliders.length <= 1) return;
        scrollToSlide(realIdx + 1, scrollBehavior());
    };

    const getAspectRatioClass = () => {
        switch (aspectRatio) {
            case 'square':
                return 'aspect-square';
            case 'wide':
                return 'aspect-[2/1]';
            case 'video':
            default:
                return 'aspect-video';
        }
    };

    if (!sliders || sliders.length === 0) return null;

    const clickUrl = (s: BannerSliderItem) =>
        s.link_type !== 'none' ? route('tenant.sliders.click', [tenantSlug, s.id]) : null;

    let realActiveIndex = activeIndex - 1;
    if (activeIndex === 0) realActiveIndex = sliders.length - 1;
    if (activeIndex === extendedLength - 1) realActiveIndex = 0;

    return (
        <div
            role="region"
            aria-roledescription="carrusel"
            aria-label="Banner de promociones"
            className="group relative mt-4 w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                ref={scrollContainerRef}
                className={`relative flex w-full overflow-x-hidden ${getAspectRatioClass()} rounded-2xl bg-gray-200 shadow-sm`}
            >
                {infiniteSliders.map((slider, index) => {
                    const url = clickUrl(slider);
                    const isFirstReal = sliders.length > 1 && index === 1;
                    return (
                        <BannerSlide
                            key={`${slider.id}-${index}`}
                            slider={slider}
                            url={url}
                            total={sliders.length}
                            imageLoading={isFirstReal ? 'eager' : 'lazy'}
                        />
                    );
                })}
            </div>

            {sliders.length > 1 && (
                <>
                    <CarouselNav onPrev={prevSlide} onNext={nextSlide} />
                    <CarouselDots count={sliders.length} activeRealIndex={realActiveIndex} onGoTo={goToRealSlide} />
                </>
            )}
        </div>
    );
}
