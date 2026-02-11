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
    // We can add variants/modifiers support here later
    variant_options?: any[];
}

export interface CartContextType {
    items: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
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

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('gastronomy_cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
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

    const addToCart = (product: any) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.id === product.id);

            if (existingItem) {
                toast.success(`Agregaste otro ${product.name}`, {
                    description: "Cantidad actualizada",
                    duration: 2000,
                });
                return currentItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
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
                image_url: product.image_url,
                quantity: product.quantity || 1, // Use quantity from product if provided (from Drawer)
                variant_options: product.variant_options || []
            }];
        });
    };

    const removeFromCart = (productId: number) => {
        setItems(currentItems => currentItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setItems(currentItems =>
            currentItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem('gastronomy_cart');
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
