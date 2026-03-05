import React from 'react';
import { Headphones, Clock, Share2 } from 'lucide-react';

export interface EpisodePublic {
    id: number;
    title: string;
    audio_url: string | null;
    formatted_duration: string;
    created_at: string;
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTimeAgo(createdAt: string): string {
    const now = new Date();
    const past = new Date(createdAt);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    if (diffWeeks < 4) return `Hace ${diffWeeks} ${diffWeeks === 1 ? 'semana' : 'semanas'}`;
    return formatDate(createdAt);
}

export interface EpisodeCardProps {
    ep: EpisodePublic;
    logoUrl?: string;
    bgColor?: string;
    onPlay: () => void;
}

export default function EpisodeCard({ ep, logoUrl, bgColor, onPlay }: EpisodeCardProps) {
    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = typeof window !== 'undefined' ? window.location.href : '';
        const text = `${ep.title} - ${ep.formatted_duration}`;
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({ title: ep.title, text, url }).catch(() => navigator.clipboard?.writeText(url));
        } else {
            navigator.clipboard?.writeText(url);
        }
    };

    const isGradient = Boolean(bgColor);
    const textClass = isGradient ? 'text-white' : 'text-slate-900';
    const metaClass = isGradient ? 'text-white/90' : 'text-slate-500';
    const dotClass = isGradient ? 'text-white/70' : 'text-slate-300';
    const shareBtnClass = isGradient
        ? 'text-white hover:bg-white/20 hover:text-white'
        : 'text-slate-500 hover:bg-slate-100 hover:text-primary';

    return (
        <article
            role="button"
            tabIndex={0}
            onClick={onPlay}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPlay()}
            className={`rounded-xl border border-slate-200 shadow-sm overflow-hidden flex gap-4 px-4 py-3 cursor-pointer hover:shadow-lg transition-all active:scale-[0.99] ${!bgColor ? 'bg-white' : ''}`}
            style={bgColor ? { background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 50%, ${bgColor}99 100%)` } : undefined}
        >
            <div className="shrink-0 w-12 h-12 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                {logoUrl ? (
                    <img src={logoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                    <Headphones className="size-7 text-slate-400" />
                )}
            </div>
            <div className="min-w-0 flex-1 flex flex-col justify-center">
                <h2 className={`font-bold text-base line-clamp-2 ${textClass}`}>{ep.title}</h2>
                <p className={`text-xs flex items-center gap-2 flex-wrap mt-0.5 ${metaClass}`}>
                    <span>{formatTimeAgo(ep.created_at)}</span>
                    <span className={dotClass}>·</span>
                    <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {ep.formatted_duration}
                    </span>
                    <span className={dotClass}>·</span>
                    <span>{formatDate(ep.created_at)}</span>
                </p>
            </div>
            <button
                type="button"
                onClick={handleShare}
                className={`p-2 rounded-lg transition-colors shrink-0 ${shareBtnClass}`}
                aria-label="Compartir"
            >
                <Share2 className="size-5" />
            </button>
        </article>
    );
}
