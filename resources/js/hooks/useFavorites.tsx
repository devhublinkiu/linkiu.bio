import { useLocalStorage } from 'react-use';
import { useCallback, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { toast } from 'sonner';

export function useFavorites() {
    const { currentTenant } = usePage<PageProps>().props;
    const tenantSlug = currentTenant?.slug || 'default';

    // Key unique per tenant
    const storageKey = `linkiu_favorites_${tenantSlug}`;

    const [favorites, setFavorites] = useLocalStorage<number[]>(storageKey, []);

    const toggleFavorite = useCallback((productId: number, productName?: string) => {
        const current = favorites || [];
        let newFavorites;

        if (current.includes(productId)) {
            toast.info('Eliminado de favoritos');
            newFavorites = current.filter(id => id !== productId);
        } else {
            toast.success(productName ? `¡${productName} agregado a favoritos!` : 'Agregado a favoritos');
            newFavorites = [...current, productId];
        }

        setFavorites(newFavorites);
    }, [favorites, setFavorites]);

    const isFavorite = useCallback((productId: number) => {
        return (favorites || []).includes(productId);
    }, [favorites]);

    const favoritesCount = useMemo(() => (favorites || []).length, [favorites]);

    return {
        favorites: favorites || [],
        toggleFavorite,
        isFavorite,
        favoritesCount
    };
}
