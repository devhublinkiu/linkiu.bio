import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ExploreCategoriesButtonProps {
    tenantSlug: string;
    /** Por defecto coincide con la maqueta Figma */
    label?: string;
    className?: string;
}

export default function ExploreCategoriesButton({
    tenantSlug,
    label = 'Ver todas las categorías',
    className,
}: ExploreCategoriesButtonProps) {
    const href = route('tenant.menu', { tenant: tenantSlug });

    return (
        <Link
            href={href}
            className={cn(
                'group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-normal transition-colors sm:w-auto',
                'bg-slate-200 text-slate-950',
                'hover:bg-slate-950 hover:text-slate-100',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950',
                className,
            )}
        >
            <span className="whitespace-nowrap">{label}</span>
            <ArrowUpRight
                className="size-4 shrink-0 text-slate-950 transition-colors group-hover:text-slate-100"
                strokeWidth={2}
                aria-hidden
            />
        </Link>
    );
}
