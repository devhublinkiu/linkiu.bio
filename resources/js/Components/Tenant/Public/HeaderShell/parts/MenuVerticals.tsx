import { useEffect, useMemo, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import { cn } from '@/lib/utils';
import { getMenuForVertical, type MenuVerticalItem } from './menuVerticalConfig';

function resolveActiveItemId(currentRoute: string | undefined, items: MenuVerticalItem[]): string {
    for (const item of items) {
        if (item.routeName === currentRoute) {
            return item.id;
        }
        if (item.activeRouteNames?.includes(currentRoute ?? '')) {
            return item.id;
        }
    }
    if (currentRoute?.startsWith('tenant.menu')) {
        const menuItem = items.find((i) => i.id === 'menu');
        if (menuItem) return menuItem.id;
    }
    const homeItem = items.find((i) => i.id === 'home');
    return homeItem?.id ?? items[0]?.id ?? 'home';
}

export default function MenuVerticals() {
    const { currentTenant } = usePage<PageProps>().props;
    const verticalSlug = currentTenant?.vertical?.slug;
    const tenantSlug = currentTenant?.slug;
    const items = useMemo(() => getMenuForVertical(verticalSlug), [verticalSlug]);

    const currentRoute = route().current() as string | undefined;
    const [activeId, setActiveId] = useState<string>(() =>
        items ? resolveActiveItemId(currentRoute, items) : 'home',
    );

    useEffect(() => {
        if (items) {
            setActiveId(resolveActiveItemId(currentRoute, items));
        }
    }, [currentRoute, items]);

    if (!items || !tenantSlug) {
        return null;
    }

    return (
        <nav
            className="flex w-full max-w-[348px] mx-auto flex-row items-center justify-center gap-2 md:gap-6 px-1 py-2 mt-2"
            aria-label="Navegación principal"
            data-layout="menu-verticals"
        >
            {items.map((item) => {
                const href = route(item.routeName, tenantSlug) as string;
                const isActive = activeId === item.id;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.id}
                        href={href}
                        className={cn(
                            'flex min-w-[56px] w-19 shrink-0 flex-col items-center justify-center gap-1 rounded-lg p-2 transition-colors',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2',
                            isActive ? 'bg-slate-950' : 'bg-transparent',
                        )}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        <Icon
                            className={cn('size-6 shrink-0', isActive ? 'text-slate-100' : 'text-slate-500')}
                            strokeWidth={2}
                            aria-hidden
                        />
                        <span
                            className={cn(
                                'max-w-[56px] text-center text-xs md:text-sm font-normal leading-none whitespace-nowrap',
                                isActive ? 'text-slate-100' : 'text-slate-500',
                            )}
                        >
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
