import React from 'react';
import { ExternalLink } from 'lucide-react';

interface Ticker {
    id: number;
    content: string;
    link?: string;
    background_color: string;
}

interface Props {
    tickers: Ticker[];
}

export default function PromotionalTicker({ tickers }: Props) {
    if (!tickers || tickers.length === 0) return null;

    // Duplicate content appropriately to clear any whitespace or gap if needed, 
    // but CSS marquee usually handles it by translating a long container.
    // simpler approach: Just list them. If only 1, maybe just center it?
    // User requested "Ticker" (Marquee).

    // Logic: If multiple, sliding text. If single, maybe static center or sliding if long?
    // Let's implement a standardized smooth CSS marquee.

    // We can use a simple CSS animation for infinite scroll.

    return (
        <div className="w-full overflow-hidden relative z-50">
            {/* Gradient fade on edges for smooth effect */}
            <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            <div className="py-1 flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
                {/* Render items twice to create seamless loop */}
                {[...tickers, ...tickers, ...tickers, ...tickers].map((ticker, index) => (
                    <div
                        key={`${ticker.id}-${index}`}
                        className="inline-flex items-center"
                        style={{ color: '#fff' }} // Force white text for contrast on colored bg? 
                    // Actually, tickers might have DIFFERENT background colors per user input.
                    // Wait, if each ticker has its own background color, a continuous strip looks weird.
                    // Usually a ticker bar has ONE background color.
                    // BUT my model allows per-ticker background color.
                    // Strategy: Use the ticker's background color as a "Tag" or "Badge" style, OR ignore it and use a global theme?
                    // User input shows "Color de Fondo" per ticker.
                    // Let's render each item as a "Pill" or "Card" with that color?
                    // Or just colored text?
                    // "Pill" style looks modern.
                    >
                        <a
                            href={ticker.link || '#'}
                            className={`
                                flex items-center px-6 py-3 text-sm font-bold shadow-sm transition-transform hover:scale-105
                                ${!ticker.link ? 'pointer-events-none' : ''}
                            `}
                            style={{ backgroundColor: ticker.background_color, color: '#fff' }}
                            target={ticker.link ? '_blank' : undefined}
                            rel="noreferrer"
                        >
                            <span>{ticker.content}</span>
                            {ticker.link && <ExternalLink className="w-3 h-3" />}
                        </a>
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
                    animation: marquee ${Math.max(20, tickers.length * 10)}s linear infinite;
                    /* Extend width to ensure content fits twice */
                    width: max-content;
                }
                `}
            </style>
        </div>
    );
}
