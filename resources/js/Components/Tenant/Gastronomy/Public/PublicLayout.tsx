import React, { PropsWithChildren } from 'react';
import { CartProvider, useCart, CartContextType } from '@/Contexts/CartContext';
import FloatingCart from './FloatingCart';
import Footer from '@/Components/Public/Footer';
import ReportBusinessStrip from '@/Components/Public/ReportBusinessStrip';
import { Toaster } from 'sonner';
import { MapPin } from 'lucide-react';

interface PublicLayoutProps extends PropsWithChildren {
    bgColor?: string;
    renderBottomAction?: (cart: CartContextType) => React.ReactNode;
    showFloatingCart?: boolean;
}

const LayoutContent = ({ children, bgColor, renderBottomAction, showFloatingCart = true }: PublicLayoutProps) => {
    const cart = useCart();
    const { selectedTable } = cart;

    return (
        <div className="h-dvh w-full flex justify-center items-stretch relative overflow-hidden transition-colors duration-500">
            {/* 1. Base Image Layer (Deep back) */}
            <div className="fixed inset-0 -z-30 bg-[url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />

            {/* 2. Color Tint Layer (The brand color) - Semi-transparent */}
            <div
                className="fixed inset-0 -z-20 transition-colors duration-500 mix-blend-multiply opacity-80"
                style={{ backgroundColor: bgColor || '#f0f2f5' }}
            />

            {/* 3. Glass/Blur Layer (Frosted effect) */}
            <div className="fixed inset-0 -z-10 backdrop-blur-[100px] bg-white/10" />

            {/* Mobile-First Wrapper (The "Phone") — altura vista para que el scroll sea interno */}
            <div className="w-full max-w-[480px] h-full max-h-[100dvh] bg-white shadow-2xl overflow-hidden flex flex-col relative mx-auto z-10">
                {selectedTable && (
                    <div className="bg-primary/10 text-primary px-4 py-2.5 text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b border-primary/20 animate-in fade-in slide-in-from-top duration-700 z-50">
                        <MapPin className="w-3 h-3 animate-bounce" />
                        Pidiendo en: <span className="opacity-80">{selectedTable.name}</span> {selectedTable.zone?.name && <span className="text-[9px] opacity-60 ml-0.5">[{selectedTable.zone.name}]</span>}
                    </div>
                )}


                <div className="scrollbar-public flex-1 min-h-0 relative overflow-y-auto overflow-x-hidden">
                    <div className="min-h-full flex flex-col">
                        <div className="flex-1">{children}</div>
                        <ReportBusinessStrip />
                        <Footer />
                    </div>
                </div>

                {/* Cart Components */}
                {showFloatingCart && <FloatingCart />}

                {/* Bottom Action Bar (Dynamic) */}
                {renderBottomAction && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 px-6 z-40 sm:absolute sm:bottom-0">
                        {renderBottomAction(cart)}
                    </div>
                )}

                {/* iPhone Home Bar Indicator (Visual Flair) */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-200 rounded-full sm:block hidden pointer-events-none mb-1 z-50"></div>
            </div>
        </div>
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
