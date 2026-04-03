import { Link2 } from 'lucide-react';

export default function LinkedBadge() {
    return (
        <span
            className="pointer-events-none absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/95 ring-1 ring-white/15 backdrop-blur-sm"
            aria-hidden
        >
            <Link2 className="size-3 opacity-90" strokeWidth={2} />
            <span>Ver promo</span>
        </span>
    );
}
