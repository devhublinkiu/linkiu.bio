import type { Ticker } from '@/types/ticker';
import TickerLink from './parts/TickerLink';

interface Props {
    tickers: Ticker[];
}

export default function TickersPromo({ tickers }: Props) {
    if (!tickers || tickers.length === 0) {
        return null;
    }

    const duplicated = [...tickers, ...tickers];

    return (
        <div className="relative z-10 w-full overflow-hidden">
            <div
                className="flex animate-marquee whitespace-nowrap py-1 hover:[animation-play-state:paused]"
                role="marquee"
                aria-label="Promociones y anuncios"
            >
                {duplicated.map((ticker, index) => (
                    <div
                        key={`${ticker.id}-${index}`}
                        className="inline-flex shrink-0 items-center gap-[11px] px-4 py-2"
                        style={{ backgroundColor: ticker.background_color }}
                    >
                        <p
                            className="shrink-0 whitespace-nowrap text-center text-sm font-bold leading-normal"
                            style={{ color: ticker.text_color }}
                        >
                            {ticker.content}
                        </p>
                        {ticker.link ? <TickerLink href={ticker.link} /> : null}
                    </div>
                ))}
            </div>

            <style>
                {`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee ${Math.max(15, tickers.length * 8)}s linear infinite;
                    width: max-content;
                }
                `}
            </style>
        </div>
    );
}
