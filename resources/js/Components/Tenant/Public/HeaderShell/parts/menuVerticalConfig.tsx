import type { LucideIcon } from 'lucide-react';
import {
    Building2,
    CalendarHeart,
    HandHeart,
    Headphones,
    Heart,
    Home,
    Store,
    UtensilsCrossed,
} from 'lucide-react';

export type MenuVerticalItem = {
    id: string;
    label: string;
    icon: LucideIcon;
    routeName: string;
    /** Rutas adicionales que marcan este ítem como activo */
    activeRouteNames?: string[];
};

/** Gastronomía — Figma Menu_gastronomy_Linkiu */
export const MENU_GASTRONOMY: MenuVerticalItem[] = [
    { id: 'locations', label: 'Sedes', icon: Store, routeName: 'tenant.public.locations', activeRouteNames: ['tenant.public.shorts'] },
    {
        id: 'menu',
        label: 'Menú',
        icon: UtensilsCrossed,
        routeName: 'tenant.menu',
        activeRouteNames: ['tenant.menu.category'],
    },
    { id: 'home', label: 'Inicio', icon: Home, routeName: 'tenant.home' },
    { id: 'reservations', label: 'Reservas', icon: CalendarHeart, routeName: 'tenant.reservations.index' },
    { id: 'favorites', label: 'Favoritos', icon: Heart, routeName: 'tenant.favorites' },
];

/** Iglesia — Figma Menu_church_Linkiu */
export const MENU_CHURCH: MenuVerticalItem[] = [
    { id: 'locations', label: 'Sedes', icon: Building2, routeName: 'tenant.public.locations' },
    { id: 'services', label: 'Servicios', icon: CalendarHeart, routeName: 'tenant.public.services' },
    { id: 'home', label: 'Inicio', icon: Home, routeName: 'tenant.home' },
    { id: 'podcast', label: 'Audios', icon: Headphones, routeName: 'tenant.public.podcast' },
    { id: 'donations', label: 'Donar', icon: HandHeart, routeName: 'tenant.public.donations' },
];

/** E-commerce, servicios, dropshipping u otras verticales: rutas transversales mientras no haya menú específico */
export const MENU_MINIMAL: MenuVerticalItem[] = [
    { id: 'home', label: 'Inicio', icon: Home, routeName: 'tenant.home' },
    { id: 'locations', label: 'Sedes', icon: Store, routeName: 'tenant.public.locations', activeRouteNames: ['tenant.public.shorts'] },
];

export function getMenuForVertical(slug: string | undefined): MenuVerticalItem[] | null {
    switch (slug) {
        case 'gastronomia':
            return MENU_GASTRONOMY;
        case 'church':
            return MENU_CHURCH;
        default:
            return slug ? MENU_MINIMAL : null;
    }
}
