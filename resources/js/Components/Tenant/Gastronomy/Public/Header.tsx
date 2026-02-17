import { MapPin, Calendar, LayoutGrid, Home, Heart, BadgeCheck, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { cn } from '@/lib/utils';
import { AnimatedGradientText } from '@/Components/ui/animated-gradient-text';

interface HeaderProps {
    tenantName: string;
    description?: string;
    logoUrl?: string;
    coverUrl?: string;
    bgColor?: string;
    textColor?: string;
    /** Color de la descripción (ej. desde admin brand_colors.description_color) */
    descriptionColor?: string;
}

export default function Header({ tenantName, description, logoUrl, bgColor, textColor, descriptionColor }: HeaderProps) {
    const { currentTenant } = usePage<PageProps>().props;
    const currentRoute = route().current();

    const determineActiveTab = () => {
        if (currentRoute === 'tenant.public.locations') return 'locations';
        if (currentRoute === 'tenant.menu') return 'menu';
        if (currentRoute === 'tenant.favorites') return 'favorites';
        if (currentRoute === 'tenant.reservations.index') return 'reservations';
        if (currentRoute === 'tenant.home') return 'home';
        return 'home';
    };

    const [activeTab, setActiveTab] = useState(determineActiveTab());

    // Update active tab when route changes
    useEffect(() => {
        setActiveTab(determineActiveTab());
    }, [currentRoute]);

    const brandColor = bgColor || '#db2777'; // Fallback to pink-600 hex
    const brandTextColor = textColor || '#ffffff';

    const menuItems = [
        { id: 'locations', label: 'Sedes', icon: MapPin, href: route('tenant.public.locations', currentTenant?.slug) },
        { id: 'menu', label: 'Menú', icon: LayoutGrid, href: route('tenant.menu', currentTenant?.slug) },
        { id: 'home', label: 'Inicio', icon: Home, href: route('tenant.home', currentTenant?.slug) },
        { id: 'reservations', label: 'Reservas', icon: Calendar, href: route('tenant.reservations.index', currentTenant?.slug) },
        { id: 'favorites', label: 'Favoritos', icon: Heart, href: route('tenant.favorites', currentTenant?.slug) },
    ];

    const { selectedLocationName, locationsCount = 0 } = usePage<PageProps>().props as { selectedLocationName?: string | null; locationsCount?: number };
    const shortsUrl = currentTenant?.slug ? route('tenant.public.shorts', currentTenant.slug) : null;
    const hasMultipleLocations = locationsCount > 1;

    return (
        <div className="w-full px-4 pt-4 pb-2 z-10 space-y-0">
            {/* Barra sede actual — mismo ancho que el header, estilo Magic UI */}
            {selectedLocationName && shortsUrl && (
                <Link
                    href={shortsUrl}
                    className="group relative mt-3 mb-3 flex w-full items-center justify-center rounded-[2rem] px-4 py-1 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]"
                >
                    <span
                        className={cn(
                            "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
                        )}
                        style={{
                            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            WebkitMaskComposite: "destination-out",
                            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            maskComposite: "subtract",
                            WebkitClipPath: "padding-box",
                        }}
                    />
                    <span className="shrink-0 text-lg" aria-hidden>📍</span>
                    <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
                    <AnimatedGradientText className="text-sm font-medium truncate min-w-0 flex-1 text-center">
                        {hasMultipleLocations
                            ? `Sede actual: ${selectedLocationName}. Toca para cambiar.`
                            : `Sede: ${selectedLocationName}. Ver promociones`}
                    </AnimatedGradientText>
                    <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </Link>
            )}
            <div className="w-full bg-white rounded-[1rem] overflow-hidden relative">
                {/* Upper Section: Vibrant Brand Color */}
                <div
                    className="p-6 text-white relative overflow-hidden transition-colors duration-500"
                    style={{ backgroundColor: brandColor, color: brandTextColor }}
                >
                    {/* Background decoration (optional gradients/blur) */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

                    <div className="relative z-10 flex items-center gap-3">
                        {/* Column 1: Logo */}
                        <div className="w-20 h-20 shrink-0 rounded-full border border-white/30 shadow-lg bg-white p-1 relative group">
                            <div className="absolute inset-0 rounded-full bg-white/20 blur-md group-hover:blur-lg transition-all" />
                            <img
                                src={logoUrl || `https://ui-avatars.com/api/?name=${tenantName}&background=random`}
                                alt={tenantName}
                                className="w-full h-full object-cover rounded-full relative z-10"
                            />
                        </div>

                        {/* Column 2: Info */}
                        <div className="flex flex-col text-left">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-black tracking-tight leading-none">{tenantName}</h1>
                                <BadgeCheck className="w-5 h-5 text-green-400 fill-white shrink-0" />
                            </div>

                            <p
                                className="text-xs md:text-sm font-medium leading-light line-clamp-2"
                                style={{ color: descriptionColor ? descriptionColor : 'rgba(255,255,255,0.9)' }}
                            >
                                {description || "Comida rápida, bebidas, cocteles y comida gourmet."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lower Section: Navigation Pills — iconos y nombre más pequeños en móvil, sin scroll */}
                <div className="bg-slate-100 py-3 sm:py-4 px-4">
                    <nav className="relative flex md:items-center md:justify-between justify-start gap-0.5 px-2 sm:px-4" aria-label="Navegación principal">
                        {menuItems.map((item) => {
                            const isActive = activeTab === item.id;
                            const isLink = item.href && item.href !== '#';

                            const itemContent = (
                                <div className="relative flex flex-col items-center justify-center gap-0.5 transition-all duration-300 flex-1 min-w-0">
                                    {isActive ? (
                                        <div className="bg-slate-900 text-white md:px-4 px-3 py-2 md:py-3 rounded-full shadow-lg shadow-slate-900/20 flex items-center gap-1 justify-center">
                                            <item.icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" aria-hidden />
                                            <span className="text-xs md:text-xs font-bold whitespace-nowrap">{item.label}</span>
                                        </div>
                                    ) : (
                                        <div className="rounded-full text-slate-500 flex items-center justify-start md:justify-center w-10 h-10">
                                            <item.icon className="w-5 h-5" aria-hidden />
                                        </div>
                                    )}
                                </div>
                            );

                            return isLink ? (
                                <Link
                                    key={item.id}
                                    href={item.href!}
                                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-[1.25rem] sm:rounded-[1.5rem] flex-1 min-w-0 flex justify-center"
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {itemContent}
                                </Link>
                            ) : (
                                <div key={item.id} className="cursor-not-allowed opacity-80 flex-1 min-w-0 flex justify-center" aria-disabled>
                                    {itemContent}
                                </div>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
}
