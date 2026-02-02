import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { ShoppingBag, Zap, ChevronDown, CheckCircle2, Sparkles, BadgeCheck } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { PageProps } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Progress } from '@/Components/ui/progress';
import { Separator } from '@/Components/ui/separator';
import { useState } from 'react';
import {
    MODULE_ICONS,
    MODULE_LABELS,
    MODULE_ROUTES,
    MODULE_CHILDREN,
    VERTICAL_CONFIG,
    VERTICAL_FEATURES
} from '@/Config/menuConfig';

interface NavItem {
    label: string;
    route: string;
    icon: any;
    key: string;
    children?: Array<{ label: string, route: string }>;
}

interface NavGroup {
    group: string;
    items: NavItem[];
}

export default function AdminSidebar() {
    const { auth, currentTenant } = usePage<PageProps & { currentTenant: any }>().props;
    const user = auth?.user;
    const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

    const toggleSubmenu = (key: string) => {
        setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Get vertical slug (fallback to default)
    const rawSlug = currentTenant?.vertical?.slug?.toLowerCase() || 'default';
    const verticalSlug = rawSlug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Get modules for this vertical
    const modulesList = VERTICAL_CONFIG[verticalSlug] || VERTICAL_CONFIG['default'];

    // Map modules to NavItems
    const dynamicItems: NavItem[] = modulesList.map(moduleKey => {
        const icon = MODULE_ICONS[moduleKey] || MODULE_ICONS['dashboard']; // Fallback icon

        let children = MODULE_CHILDREN[moduleKey];

        // Filter children if VERTICAL_FEATURES is defined for this vertical
        const features = VERTICAL_FEATURES[verticalSlug];
        if (features && children) {
            if (moduleKey === 'integrations') {
                children = children.filter(child => {
                    const featureKey = `integration_${child.label.toLowerCase().replace('é', 'e')}`;
                    return features[featureKey] === true;
                });
            }
        }

        return {
            label: MODULE_LABELS[moduleKey] || moduleKey,
            route: MODULE_ROUTES[moduleKey] || '#',
            icon: icon,
            key: moduleKey,
            children: children
        };
    });

    const navGroups: NavGroup[] = [
        {
            group: 'Menú Principal',
            items: dynamicItems
        },
    ];

    return (
        <div className="flex flex-col h-full bg-white border-r border-slate-200/60 shadow-sm">
            {/* Header: Name + Verified Badge */}
            {/* Header: Verified Badge */}
            <div className="px-4 py-4 pt-6">
                <div className="relative bg-blue-50/50 border border-blue-100 rounded-xl p-3 overflow-hidden group">
                    <div className="relative flex items-center justify-center gap-3">
                        <div className="relative">
                            <BadgeCheck className="h-6 w-6 text-blue-500 fill-blue-500/10" />
                            <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full animate-pulse opacity-50" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[12px] font-black text-slate-800 uppercase tracking-wider leading-none">
                                Tienda Verificada
                            </span>
                            <span className="text-[9px] font-medium text-slate-500 leading-tight">
                                Ya puedes brindar seguridad
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-2 px-4 space-y-8 scrollbar-thin scrollbar-thumb-slate-200">
                {navGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-2">
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                // FEATURE LOCKING LOGIC
                                // 1. Identify required feature key (default to item.key)
                                // Adjust mapping if needed, e.g., 'linkiu_pos' -> 'pos'
                                const featureKey = item.key;

                                // 2. Check if feature is allowed in current plan
                                // Assuming currentTenant.latest_subscription.plan.features is a Record<string, boolean>
                                // If features is undefined/null, default to TRUE (allow all) to avoid blocking by mistake unless strict.
                                // But usually, plan features define what you HAVE.
                                const planFeatures = currentTenant?.latest_subscription?.plan?.features;

                                // But if features exist, check the key.
                                let isLocked = false;

                                // Parse features to find the config object
                                let configObject: Record<string, boolean> = {};

                                if (Array.isArray(planFeatures)) {
                                    const found = planFeatures.find(f => typeof f === 'object' && !Array.isArray(f));
                                    if (found) configObject = found;
                                } else if (typeof planFeatures === 'object' && planFeatures !== null) {
                                    // Fallback for legacy object structure
                                    configObject = planFeatures;
                                }

                                if (configObject[featureKey] === false) {
                                    isLocked = true;
                                }

                                const hasChildren = item.children && item.children.length > 0;
                                const isActive = item.route !== '#' && route().current(item.route);
                                const isSubmenuOpen = openSubmenus[item.key];

                                if (isLocked) {
                                    // LOCKED ITEM RENDER
                                    return (
                                        <div key={item.key} className="group relative">
                                            <Link
                                                href={route('tenant.subscription.index', { tenant: currentTenant.slug })}
                                                className="group flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-xl text-slate-400 hover:bg-slate-50 transition-all duration-200 cursor-pointer opacity-70 hover:opacity-100"
                                            >
                                                <item.icon className="h-4 w-4 text-slate-400 group-hover:text-slate-950 transition-colors" />
                                                <span className="flex-1 text-left">{item.label}</span>
                                                <div className="flex items-center gap-1 bg-slate-950 text-slate-50 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase border border-slate-200/50">
                                                    Pro
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={item.key}>
                                        {hasChildren ? (
                                            <button
                                                onClick={() => toggleSubmenu(item.key)}
                                                className={cn(
                                                    "w-full group flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-xl transition-all duration-200",
                                                    (isActive || isSubmenuOpen)
                                                        ? "bg-slate-50 text-slate-900"
                                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                )}
                                            >
                                                <item.icon className={cn(
                                                    "h-4 w-4 transition-colors", // Smaller icons
                                                    (isActive || isSubmenuOpen) ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                                                )} />
                                                <span className="flex-1 text-left">{item.label}</span>
                                                <ChevronDown className={cn("h-3 w-3 transition-transform text-slate-300", isSubmenuOpen && "transform rotate-180")} />
                                            </button>
                                        ) : (
                                            <Link
                                                href={item.route === '#' ? '#' : route(item.route, { tenant: currentTenant.slug })}
                                                className={cn(
                                                    "group flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-xl transition-all duration-200",
                                                    isActive
                                                        ? "bg-primary/10 text-primary shadow-sm"
                                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                )}
                                            >
                                                <item.icon className={cn(
                                                    "h-4 w-4 transition-colors", // Smaller icons
                                                    isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                                                )} />
                                                {item.label}
                                                {isActive && (
                                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                )}
                                            </Link>
                                        )}

                                        {/* Recursive Sub-menu rendering */}
                                        {hasChildren && isSubmenuOpen && (
                                            <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-100 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                                                {item.children?.map((child) => (
                                                    <Link
                                                        key={child.label}
                                                        href={child.route === '#' ? '#' : route(child.route, { tenant: currentTenant.slug })} // Assuming standard tenant route params
                                                        className="block px-3 py-1.5 text-xs font-medium text-slate-500 rounded-lg hover:text-primary hover:bg-primary/5 transition-colors"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Profile / Bottom Section */}
            <div className="px-4 py-2 border-t border-slate-100">

                {currentTenant?.latest_subscription && (
                    <div className="px-3 pb-2 pt-2 mt-auto">
                        <div className="rounded-xl bg-[#0f172a] p-5 text-white shadow-2xl ring-1 ring-purple-500/30 relative overflow-hidden">
                            {/* Background Glow */}
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-500/70 blur-3xl rounded-full pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="mb-3 flex items-center justify-between text-xs font-semibold tracking-wide">
                                    <span className="text-slate-300">Plan {currentTenant.latest_subscription.plan?.name || 'Pro'}</span>
                                    <span className={cn(
                                        "text-white",
                                        currentTenant.latest_subscription.days_remaining <= 3 ? "text-red-400" : ""
                                    )}>
                                        {currentTenant.latest_subscription.status === 'trialing'
                                            ? `${currentTenant.latest_subscription.trial_days_remaining} días`
                                            : `${currentTenant.latest_subscription.days_remaining} días`
                                        } rest.
                                    </span>
                                </div>

                                <div className="mb-4 h-2 w-full rounded-full bg-slate-800/50 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.max(5, currentTenant.latest_subscription.percent_completed)}%` }}
                                    />
                                </div>

                                <Button
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/50 shadow-lg group transition-all duration-300 hover:shadow-purple-500/20"
                                    asChild
                                >
                                    <Link href={route('tenant.subscription.index', { tenant: currentTenant.slug })}>
                                        <Sparkles className="mr-2 h-4 w-4 text-fuchsia-400 group-hover:scale-110 transition-transform duration-300" />
                                        <span className="font-bold tracking-wide">Mejorar Plan</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
