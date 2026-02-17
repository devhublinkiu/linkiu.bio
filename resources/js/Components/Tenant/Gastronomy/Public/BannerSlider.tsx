import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slider {
    id: number;
    name: string;
    image_url: string;
    desktop_image_url?: string;
    link_type: string;
    external_url?: string;
}

interface BannerSliderProps {
    sliders: Slider[];
    aspectRatio?: 'video' | 'square' | 'wide';
    tenantSlug: string;
}

export default function BannerSlider({ sliders, aspectRatio = 'video', tenantSlug }: BannerSliderProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(1); // Start at 1 because of clone
    const [isHovered, setIsHovered] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    // Prepare infinite slides: [Last, ...Originals, First]
    const infiniteSliders = sliders && sliders.length > 1
        ? [sliders[sliders.length - 1], ...sliders, sliders[0]]
        : (sliders || []);

    const extendedLength = infiniteSliders.length;

    // Initialize position directly to the first "real" slide (index 1)
    useEffect(() => {
        if (sliders && sliders.length > 1 && scrollContainerRef.current) {
            const itemWidth = scrollContainerRef.current.offsetWidth;
            scrollContainerRef.current.scrollLeft = itemWidth;
        }
    }, [sliders?.length]);

    const scrollToSlide = (index: number, behavior: ScrollBehavior = 'smooth') => {
        if (!scrollContainerRef.current) return;
        const itemWidth = scrollContainerRef.current.offsetWidth;

        setIsScrolling(true);
        scrollContainerRef.current.scrollTo({
            left: index * itemWidth,
            behavior: behavior
        });
    };

    // Handle Infinite Loop Reset logic on scroll end
    const handleScrollEnd = () => {
        setIsScrolling(false);
        if (!scrollContainerRef.current) return;

        const itemWidth = scrollContainerRef.current.offsetWidth;
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const index = Math.round(scrollLeft / itemWidth);

        // If at the clone of Last (Index 0), jump to real Last
        if (index === 0) {
            scrollContainerRef.current.scrollTo({ left: (sliders.length) * itemWidth, behavior: 'auto' });
            setActiveIndex(sliders.length);
        }
        // If at the clone of First (Index Length - 1), jump to real First
        else if (index === extendedLength - 1) {
            scrollContainerRef.current.scrollTo({ left: itemWidth, behavior: 'auto' });
            setActiveIndex(1);
        } else {
            setActiveIndex(index);
        }
    };

    // Add scroll listener with debounce/timeout to detect "end"
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let timeout: NodeJS.Timeout;
        const onScroll = () => {
            clearTimeout(timeout);
            timeout = setTimeout(handleScrollEnd, 150);
        };

        container.addEventListener('scroll', onScroll);
        return () => container.removeEventListener('scroll', onScroll);
    }, [extendedLength, sliders?.length]);


    const activeIndexRef = useRef(activeIndex);
    activeIndexRef.current = activeIndex;

    // Auto-scroll (ref evita depender de activeIndex y recrear el interval en cada cambio)
    useEffect(() => {
        if (!sliders || sliders.length <= 1 || isHovered) return;
        const interval = setInterval(() => {
            const next = activeIndexRef.current + 1;
            scrollToSlide(next);
        }, 4000);
        return () => clearInterval(interval);
    }, [isHovered, sliders?.length]);


    const nextSlide = () => {
        if (isScrolling) return;
        scrollToSlide(activeIndex + 1);
    };

    const prevSlide = () => {
        if (isScrolling) return;
        scrollToSlide(activeIndex - 1);
    };

    const getAspectRatioClass = () => {
        switch (aspectRatio) {
            case 'square': return 'aspect-square';
            case 'wide': return 'aspect-[2/1]';
            case 'video': default: return 'aspect-video'; // 16:9
        }
    };

    if (!sliders || sliders.length === 0) return null;

    const clickUrl = (s: Slider) => (s.link_type !== 'none' ? route('tenant.sliders.click', [tenantSlug, s.id]) : null);

    return (
        <div
            role="region"
            aria-roledescription="carrusel"
            aria-label="Banner de promociones"
            className="w-full relative group mt-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                ref={scrollContainerRef}
                className={`w-full overflow-x-hidden flex ${getAspectRatioClass()} rounded-2xl bg-gray-200 shadow-sm relative`}
            >
                {infiniteSliders.map((slider, index) => {
                    const url = clickUrl(slider);
                    return (
                        <div
                            key={`${slider.id}-${index}`}
                            className="w-full flex-shrink-0 relative overflow-hidden"
                            role="group"
                            aria-label={`Slide ${index + 1} de ${sliders.length}`}
                        >
                            {url ? (
                                <a href={url} className="block w-full h-full" aria-label={slider.name}>
                                    <img
                                        src={slider.image_url}
                                        alt={slider.name}
                                        className="w-full h-full object-cover"
                                    />
                                </a>
                            ) : (
                                <img
                                    src={slider.image_url}
                                    alt={slider.name}
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                        </div>
                    );
                })}
            </div>

            {sliders.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hover:bg-white/50 sm:opacity-100"
                        aria-label="Slide anterior"
                    >
                        <ChevronLeft className="w-5 h-5" aria-hidden />
                    </button>
                    <button
                        type="button"
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hover:bg-white/50 sm:opacity-100"
                        aria-label="Slide siguiente"
                    >
                        <ChevronRight className="w-5 h-5" aria-hidden />
                    </button>

                    <div
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 px-2 py-1 rounded-full bg-black/10 backdrop-blur-[2px]"
                        role="tablist"
                        aria-label="Indicadores de diapositivas"
                    >
                        {sliders.map((_, idx) => {
                            if (idx >= sliders.length) return null;
                            let realActiveIndex = activeIndex - 1;
                            if (activeIndex === 0) realActiveIndex = sliders.length - 1;
                            if (activeIndex === extendedLength - 1) realActiveIndex = 0;
                            const isActive = realActiveIndex === idx;
                            return (
                                <div
                                    key={idx}
                                    role="tab"
                                    aria-selected={isActive}
                                    aria-label={`Ir a slide ${idx + 1}`}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-white w-3' : 'bg-white/60'}`}
                                />
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
