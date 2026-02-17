import { ExternalLink } from 'lucide-react';
import type { Ticker } from '@/types/ticker';

interface Props {
    tickers: Ticker[];
}

export default function PromotionalTicker({ tickers }: Props) {
    if (!tickers || tickers.length === 0) return null;

    // Duplicar tickers para crear un loop de marquee fluido
    const duplicated = [...tickers, ...tickers];

    return (
        <div className="w-full overflow-hidden relative z-10">
            <div
                className="py-1 flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]"
                role="marquee"
                aria-label="Promociones y anuncios"
            >
                {duplicated.map((ticker, index) => {
                    const Tag = ticker.link ? 'a' : 'span';
                    const linkProps = ticker.link
                        ? { href: ticker.link, target: '_blank' as const, rel: 'noopener noreferrer' }
                        : {};

                    return (
                        <Tag
                            key={`${ticker.id}-${index}`}
                            {...linkProps}
                            className={`
                                inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-bold
                                transition-transform hover:scale-105 shrink-0
                                ${ticker.link ? 'cursor-pointer' : ''}
                            `}
                            style={{
                                backgroundColor: ticker.background_color,
                                color: ticker.text_color,
                            }}
                        >
                            <span>{ticker.content}</span>
                            {ticker.link && <ExternalLink className="w-3 h-3 ml-1" />}
                        </Tag>
                    );
                })}
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
