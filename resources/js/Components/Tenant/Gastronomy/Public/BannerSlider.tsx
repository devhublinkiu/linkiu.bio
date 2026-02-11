import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slider {
    id: number;
    name: string;
    image_url: string;
    desktop_image_url?: string;
    link_type: 'none' | 'internal' | 'external';
    external_url?: string;
}

interface BannerSliderProps {
    sliders: Slider[];
    aspectRatio?: 'video' | 'square' | 'wide';
}

export default function BannerSlider({ sliders, aspectRatio = 'video' }: BannerSliderProps) {
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


    // Auto-scroll
    useEffect(() => {
        if (!sliders || sliders.length <= 1 || isHovered) return;

        const interval = setInterval(() => {
            const nextIndex = activeIndex + 1;
            scrollToSlide(nextIndex);
        }, 4000);

        return () => clearInterval(interval);
    }, [activeIndex, isHovered, sliders?.length]);


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

    return (
        <div
            className="w-full relative group mt-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Side Fade/Blur Effect (Vignette) 
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
            */}

            <div
                ref={scrollContainerRef}
                className={`w-full overflow-x-hidden flex ${getAspectRatioClass()} rounded-2xl bg-gray-200 shadow-sm relative`}
            >
                {infiniteSliders.map((slider, index) => (
                    <div
                        key={`${slider.id}-${index}`}
                        className="w-full flex-shrink-0 relative overflow-hidden"
                    >
                        {slider.link_type !== 'none' ? (
                            <a
                                href={slider.link_type === 'external' ? slider.external_url : '#'}
                                target={slider.link_type === 'external' ? '_blank' : undefined}
                                className="block w-full h-full"
                            >
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
                        {/* Gradient Overlay for Text depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                    </div>
                ))}
            </div>

            {/* Navigation Arrows (Non-invasive) */}
            {sliders.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hover:bg-white/50"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hover:bg-white/50"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 px-2 py-1 rounded-full bg-black/10 backdrop-blur-[2px]">
                        {sliders.map((_, idx) => {
                            if (idx >= sliders.length) return null; // Avoid extra dots from clones

                            // Calculate Loop-safe active index for dots
                            let realActiveIndex = activeIndex - 1;
                            if (activeIndex === 0) realActiveIndex = sliders.length - 1;
                            if (activeIndex === extendedLength - 1) realActiveIndex = 0;

                            return (
                                <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${realActiveIndex === idx ? 'bg-white w-3' : 'bg-white/60'}`}
                                />
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
