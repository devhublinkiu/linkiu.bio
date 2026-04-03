import { SquareArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TickerLinkProps {
    href: string;
    label?: string;
    className?: string;
}

export default function TickerLink({ href, label = 'Ver enlace', className }: TickerLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                'inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-gray-50 px-2 py-1 text-xs font-bold text-slate-950 transition-opacity hover:opacity-90',
                className,
            )}
        >
            <span className="whitespace-nowrap leading-normal">{label}</span>
            <span className="inline-flex size-4 shrink-0 items-center justify-center" aria-hidden>
                <SquareArrowUpRight className="size-4" strokeWidth={2} />
            </span>
        </a>
    );
}
