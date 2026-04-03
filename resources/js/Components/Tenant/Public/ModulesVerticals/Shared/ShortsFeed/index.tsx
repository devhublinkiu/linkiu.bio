import { useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

import ShortsFeedModal from './parts/ShortsFeedModal';
import type { ShortsFeedItem } from './shortsFeedTypes';

export type { ShortsFeedItem };

const LINK_TYPE_LABELS: Record<string, string> = {
    category: 'Categoría',
    product: 'Producto',
};

function youtubePosterFromEmbedUrl(embedUrl: string): string | null {
    try {
        const u = new URL(embedUrl);
        let id: string | null = null;
        if (u.hostname.includes('youtube.com') || u.hostname === 'www.youtube.com') {
            if (u.pathname.startsWith('/embed/')) {
                id = u.pathname.replace('/embed/', '').split('/')[0] ?? null;
            } else {
                id = u.searchParams.get('v');
            }
        } else if (u.hostname === 'youtu.be') {
            id = u.pathname.replace(/^\//, '') || null;
        }
        if (!id) return null;
        return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    } catch {
        return null;
    }
}

interface ShortsFeedProps {
    items: ShortsFeedItem[];
    className?: string;
}

export default function ShortsFeed({ items, className }: ShortsFeedProps) {
    const [active, setActive] = useState<ShortsFeedItem | null>(null);
    const [failedPosterIds, setFailedPosterIds] = useState<Set<number>>(() => new Set());

    if (!items?.length) {
        return null;
    }

    return (
        <>
            <div
                className={cn('grid w-full grid-cols-3 gap-1 pb-6', className)}
                role="list"
                data-name="ShortsFeed"
            >
                {items.map((item) => {
                    const posterRaw =
                        item.poster_url?.trim() ||
                        youtubePosterFromEmbedUrl(item.short_embed_url);
                    const poster =
                        posterRaw && !failedPosterIds.has(item.id) ? posterRaw : null;
                    const badgeLabel = LINK_TYPE_LABELS[item.link_type] ?? null;
                    const hasAction = item.action_url && item.action_url !== '#';

                    return (
                        <button
                            key={item.id}
                            type="button"
                            role="listitem"
                            onClick={() => setActive(item)}
                            className="group relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-slate-900 text-left shadow-sm ring-1 ring-slate-200/90 transition-transform active:scale-[0.98] md:active:scale-100 md:hover:ring-slate-300"
                            aria-label={`Reproducir short: ${item.name}`}
                        >
                            {poster ? (
                                <img
                                    src={poster}
                                    alt=""
                                    className="absolute inset-0 size-full object-cover [image-orientation:from-image] transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                    decoding="async"
                                    onError={() =>
                                        setFailedPosterIds((prev) => {
                                            if (prev.has(item.id)) return prev;
                                            const next = new Set(prev);
                                            next.add(item.id);
                                            return next;
                                        })
                                    }
                                />
                            ) : (
                                <div
                                    className="absolute inset-0 bg-gradient-to-b from-slate-700 to-slate-900"
                                    aria-hidden
                                />
                            )}
                            <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md ring-2 ring-white/40 md:size-14">
                                    <Play className="size-6 translate-x-0.5 fill-current md:size-7" aria-hidden />
                                </span>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-1.5 pb-2 pt-8 md:px-2 md:pb-2.5">
                                <p className="line-clamp-2 text-[10px] font-semibold leading-tight text-white md:text-xs">
                                    {item.name}
                                </p>
                                {(badgeLabel || hasAction) && (
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {badgeLabel ? (
                                            <span className="inline-flex rounded bg-white/20 px-1 py-px text-[9px] font-medium text-white backdrop-blur-sm">
                                                {badgeLabel}
                                            </span>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            <ShortsFeedModal active={active} onOpenChange={(open) => !open && setActive(null)} />
        </>
    );
}
