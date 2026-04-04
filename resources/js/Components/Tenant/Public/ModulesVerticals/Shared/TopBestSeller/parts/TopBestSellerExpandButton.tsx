import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopBestSellerExpandButtonProps {
    expanded: boolean;
    onToggle: () => void;
    className?: string;
}

export default function TopBestSellerExpandButton({ expanded, onToggle, className }: TopBestSellerExpandButtonProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={cn(
                'mx-auto mt-3 flex items-center justify-center gap-1.5 rounded-full border border-slate-200/90 bg-slate-100/90 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-200/90',
                className,
            )}
            data-name="TopBestSellerExpandButton"
        >
            {expanded ? 'Ver menos' : 'Ver más productos'}
            <ChevronDown
                className={cn('size-4 shrink-0 transition-transform', expanded && 'rotate-180')}
                aria-hidden
            />
        </button>
    );
}
