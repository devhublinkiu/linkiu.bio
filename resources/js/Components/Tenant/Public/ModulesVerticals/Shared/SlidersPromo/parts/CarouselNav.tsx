import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    onPrev: () => void;
    onNext: () => void;
}

export default function CarouselNav({ onPrev, onNext }: Props) {
    return (
        <>
            <button
                type="button"
                onClick={onPrev}
                className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white shadow-lg backdrop-blur-md transition-opacity duration-300 hover:bg-black/50 sm:opacity-100 opacity-0 group-hover:opacity-100"
                aria-label="Slide anterior"
            >
                <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
                type="button"
                onClick={onNext}
                className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white shadow-lg backdrop-blur-md transition-opacity duration-300 hover:bg-black/50 sm:opacity-100 opacity-0 group-hover:opacity-100"
                aria-label="Slide siguiente"
            >
                <ChevronRight className="size-5" aria-hidden />
            </button>
        </>
    );
}
