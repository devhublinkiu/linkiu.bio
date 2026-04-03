import type { PropsWithChildren, ReactNode } from 'react';
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Toaster } from 'sonner';

import { PublicLayoutPortalContext } from '@/Components/Tenant/Public/contexts/PublicLayoutPortalContext';
import { CartProvider, useCart, type CartContextType } from '@/Contexts/CartContext';
import FooterShellAll from '@/Components/Tenant/Public/FooterShell/FooterShellAll';
import HeaderShellAll from '@/Components/Tenant/Public/HeaderShell/HeaderShellAll';

import FloatingCart from './FloatingCart';

interface PublicLayoutProps extends PropsWithChildren {
    bgColor?: string;
    renderBottomAction?: (cart: CartContextType) => ReactNode;
    showFloatingCart?: boolean;
}

const LayoutContent = ({
    children,
    bgColor,
    renderBottomAction,
    showFloatingCart = true,
}: PublicLayoutProps) => {
    const cart = useCart();
    const { selectedTable } = cart;
    const [portalEl, setPortalEl] = useState<HTMLDivElement | null>(null);

    return (
        <PublicLayoutPortalContext.Provider value={portalEl}>
        <div className="flex h-dvh w-full items-stretch justify-center overflow-hidden bg-white transition-colors duration-500">
            {/* 1. Base Image Layer (Deep back) */}
            <div className="fixed inset-0 -z-30 bg-[url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />

            {/* 2. Color Tint Layer (The brand color) - Semi-transparent */}
            <div
                className="fixed inset-0 -z-20 opacity-80 mix-blend-multiply transition-colors duration-500"
                style={{ backgroundColor: bgColor || '#f0f2f5' }}
            />

            {/* 3. Glass/Blur Layer (Frosted effect) */}
            <div className="fixed inset-0 -z-10 bg-white/10 backdrop-blur-[100px]" />

            {/* Mobile-First Wrapper — scroll interno; cabecera dentro del scroll */}
            <div className="relative mx-auto flex h-full max-h-[100dvh] w-full max-w-[480px] flex-col overflow-hidden bg-white shadow-2xl transform-gpu">
                {selectedTable && (
                    <div className="z-[9999] flex animate-in items-center justify-center gap-2 border-b border-primary/20 bg-white px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-primary fade-in slide-in-from-top duration-700">
                        <MapPin className="h-3 w-3 animate-bounce" />
                        Pidiendo en: <span className="opacity-80">{selectedTable.name}</span>{' '}
                        {selectedTable.zone?.name && (
                            <span className="ml-0.5 text-[9px] opacity-60">[{selectedTable.zone.name}]</span>
                        )}
                    </div>
                )}

                <div className="scrollbar-public relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="flex min-h-full flex-col">
                        <HeaderShellAll />
                        <div className="min-h-0 flex-1">{children}</div>
                        <FooterShellAll />
                    </div>
                </div>

                {showFloatingCart && <FloatingCart />}

                {renderBottomAction && (
                    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-4 px-6 sm:absolute sm:bottom-0">
                        {renderBottomAction(cart)}
                    </div>
                )}

                <div className="pointer-events-none absolute bottom-1 left-1/2 z-50 mb-1 hidden h-1 w-32 -translate-x-1/2 rounded-full bg-slate-200 sm:block" />

                {/* Portal para modales/overlays contenidos en el shell (p. ej. ShortsFeed) */}
                <div
                    ref={setPortalEl}
                    className="pointer-events-none absolute inset-0 z-[100] overflow-hidden"
                    aria-hidden
                />
            </div>
        </div>
        </PublicLayoutPortalContext.Provider>
    );
};

export default function PublicLayout(props: PublicLayoutProps) {
    return (
        <CartProvider>
            <LayoutContent {...props} />
            <Toaster position="top-center" />
        </CartProvider>
    );
}
