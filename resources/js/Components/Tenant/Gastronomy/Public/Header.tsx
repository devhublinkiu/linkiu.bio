import { MapPin, Calendar, LayoutGrid, Home, Heart, BadgeCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface HeaderProps {
    tenantName: string;
    description?: string;
    logoUrl?: string;
    coverUrl?: string;
    bgColor?: string;
    textColor?: string;
}

export default function Header({ tenantName, description, logoUrl, bgColor, textColor }: HeaderProps) {
    const { currentTenant } = usePage<PageProps>().props;
    const currentRoute = route().current();

    // Determine active tab based on route
    const determineActiveTab = () => {
        // Log for debugging
        console.log('Current Route:', currentRoute);

        if (currentRoute === 'tenant.public.locations') return 'locations';
        if (currentRoute === 'tenant.menu') return 'menu';
        if (currentRoute === 'tenant.favorites') return 'favorites';
        if (currentRoute === 'tenant.home') return 'home'; // Inicio is Home

        return 'home'; // Default fallback
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

    return (
        <div className="w-full px-4 pt-4 pb-2 z-10">
            <div className="w-full bg-white rounded-[2rem] shadow-xl overflow-hidden relative">
                {/* Upper Section: Vibrant Brand Color */}
                <div
                    className="p-6 text-white relative overflow-hidden transition-colors duration-500"
                    style={{ backgroundColor: brandColor, color: brandTextColor }}
                >
                    {/* Background decoration (optional gradients/blur) */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

                    <div className="relative z-10 flex items-center gap-5">
                        {/* Column 1: Logo */}
                        <div className="w-24 h-24 shrink-0 rounded-full border border-white/30 shadow-lg bg-white p-1 relative group">
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

                            <p className="text-white/90 text-sm font-medium leading-snug drop-shadow-sm">
                                {description || "Comida rápida, bebidas, cocteles y comida gourmet."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lower Section: Navigation Pills */}
                <div className="bg-white py-4 px-2">
                    <div className="flex items-center justify-between relative px-6">
                        {menuItems.map((item) => {
                            const isActive = activeTab === item.id;

                            // Visual content logic directly used in render
                            const itemContent = (
                                <div className={`relative flex flex-col items-center justify-center gap-1 transition-all duration-300 w-14`}>
                                    {isActive ? (
                                        // Active Item Style (Big Pill)
                                        <div className="bg-slate-900 text-white p-3.5 rounded-[1.5rem] shadow-lg shadow-slate-900/20 transform hover:scale-105 transition-transform flex items-center gap-2">
                                            <item.icon className="w-5 h-5" />
                                            <span className="text-xs font-bold">{item.label}</span>
                                        </div>
                                    ) : (
                                        // Inactive Item Style (Small Icon)
                                        <div className={`p-3.5 rounded-[1.5rem] bg-white text-slate-500 border border-slate-100 shadow-slate-200/50 flex items-center justify-center`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                            );

                            return item.href && item.href !== '#' ? (
                                <Link key={item.id} href={item.href}>
                                    {itemContent}
                                </Link>
                            ) : (
                                <div key={item.id} className={`${isActive ? '' : 'cursor-not-allowed opacity-80'}`}>
                                    {itemContent}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
