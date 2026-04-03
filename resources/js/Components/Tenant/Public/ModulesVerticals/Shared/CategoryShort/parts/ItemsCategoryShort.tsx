import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { CategoryShortCategory } from '../types';

export interface ItemsCategoryShortProps {
    category: CategoryShortCategory;
    tenantSlug: string;
    className?: string;
}

export default function ItemsCategoryShort({ category, tenantSlug, className }: ItemsCategoryShortProps) {
    const href = route('tenant.menu.category', { tenant: tenantSlug, slug: category.slug });

    return (
        <Link
            href={href}
            className={cn(
                'group flex w-[72px] shrink-0 flex-col items-center gap-2 outline-none',
                className,
            )}
            data-name="Items_categoryShort"
        >
            <div
                className={cn(
                    'flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-2',
                    'transition-shadow duration-200',
                    'group-hover:shadow-[0px_14px_14px_0px_rgba(0,0,0,0.09)]',
                    'group-focus-visible:ring-2 group-focus-visible:ring-slate-950 group-focus-visible:ring-offset-2',
                )}
            >
                <div className="relative size-14 shrink-0 overflow-hidden">
                    {category.icon ? (
                        <img
                            src={category.icon.icon_url}
                            alt=""
                            className="size-full object-contain"
                        />
                    ) : (
                        <div className="flex size-full items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-400">
                            {category.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
            </div>
            <p className="min-h-[24px] w-full text-center text-[11px] font-normal leading-3 text-black line-clamp-2">
                {category.name}
            </p>
        </Link>
    );
}
