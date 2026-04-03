interface Props {
    count: number;
    activeRealIndex: number;
    onGoTo: (realIndex: number) => void;
}

export default function CarouselDots({ count, activeRealIndex, onGoTo }: Props) {
    return (
        <div
            className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/15 px-2 py-1 ring-1 ring-white/10 backdrop-blur-[2px]"
            role="tablist"
            aria-label="Ir a una promoción"
        >
            {Array.from({ length: count }, (_, idx) => {
                const isActive = activeRealIndex === idx;
                return (
                    <button
                        key={idx}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`Ir a la promoción ${idx + 1} de ${count}`}
                        onClick={() => onGoTo(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 ${isActive ? 'w-3 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/80'}`}
                    />
                );
            })}
        </div>
    );
}
