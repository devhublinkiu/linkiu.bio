import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    image_url?: string;
    quantity: number;
    original_price?: number;
    variant_options?: { name: string; value: string; price?: number }[];
    /** Identificador único de línea: producto + variantes (mismo producto con otras opciones = otra línea) */
    lineKey: string;
}

export interface CartContextType {
    items: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (lineKey: string) => void;
    updateQuantity: (lineKey: string, quantity: number) => void;
    clearCart: () => void;
    /** Actualiza image_url de ítems del carrito por id de producto (p. ej. tras cargar desde API). */
    mergeProductImageUrls: (products: Array<{ id: number; image_url?: string | null }>) => void;
    cartTotal: number;
    cartCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    selectedTable: any | null;
    setSelectedTable: (table: any | null) => void;
    selectedPaymentMethod: any | null;
    setSelectedPaymentMethod: (method: any | null) => void;
    isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<any | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    function getLineKey(item: { id: number; variant_options?: unknown[] }) {
        return `${item.id}_${JSON.stringify(item.variant_options || [])}`;
    }

    useEffect(() => {
        const savedCart = localStorage.getItem('gastronomy_cart');
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart) as CartItem[];
                const migrated = parsed.map(item => ({
                    ...item,
                    lineKey: item.lineKey || getLineKey(item),
                }));
                setItems(migrated);
            } catch {
                setItems([]);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('gastronomy_cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const { selectedTable: sharedTable } = usePage<any>().props;

    useEffect(() => {
        if (sharedTable) {
            setSelectedTable(sharedTable);
        }
    }, [sharedTable]);

    function normalizeImageUrl(p: any): string | undefined {
        const url = p?.image_url ?? p?.imageUrl;
        if (typeof url !== 'string') return undefined;
        const t = url.trim();
        return (t.startsWith('http://') || t.startsWith('https://')) ? t : undefined;
    }

    const addToCart = (product: any) => {
        const variantOptions = product.variant_options || [];
        const lineKey = getLineKey({ id: product.id, variant_options: variantOptions });
        const imageUrl = normalizeImageUrl(product);

        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.lineKey === lineKey);

            if (existingItem) {
                toast.success(`Agregaste otro ${product.name}`, {
                    description: "Cantidad actualizada",
                    duration: 2000,
                });
                return currentItems.map(item =>
                    item.lineKey === lineKey
                        ? { ...item, quantity: item.quantity + (product.quantity || 1), image_url: imageUrl ?? item.image_url }
                        : item
                );
            }

            toast.success("Producto agregado", {
                description: `${product.name} añadido al carrito`,
                duration: 2000,
            });
            return [...currentItems, {
                id: product.id,
                name: product.name,
                price: Number(product.price),
                original_price: product.original_price ? Number(product.original_price) : undefined,
                image_url: imageUrl ?? undefined,
                quantity: product.quantity || 1,
                variant_options: variantOptions,
                lineKey,
            }];
        });
    };

    const removeFromCart = (lineKey: string) => {
        setItems(currentItems => currentItems.filter(item => item.lineKey !== lineKey));
    };

    const updateQuantity = (lineKey: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(lineKey);
            return;
        }
        setItems(currentItems =>
            currentItems.map(item => (item.lineKey === lineKey ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem('gastronomy_cart');
    };

    const mergeProductImageUrls = (products: Array<{ id: number; image_url?: string | null }>) => {
        const byId = new Map(products.map(p => [p.id, p.image_url]));
        setItems(current =>
            current.map(item => {
                const url = byId.get(item.id);
                if (url == null) return item;
                const trimmed = typeof url === 'string' ? url.trim() : '';
                if (!trimmed || (!trimmed.startsWith('http://') && !trimmed.startsWith('https://'))) return item;
                return { ...item, image_url: trimmed };
            })
        );
    };

    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            mergeProductImageUrls,
            cartTotal,
            cartCount,
            isCartOpen,
            setIsCartOpen,
            selectedTable,
            setSelectedTable,
            selectedPaymentMethod,
            setSelectedPaymentMethod,
            isLoaded
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
