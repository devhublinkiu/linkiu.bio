import React, { PropsWithChildren } from 'react';
import { CartProvider, useCart, CartContextType } from '@/Contexts/CartContext';
import FloatingCart from './FloatingCart';
import Footer from '@/Components/Public/Footer';
import ReportBusinessStrip from '@/Components/Public/ReportBusinessStrip';
import { Toaster } from 'sonner';
import { MapPin } from 'lucide-react';
import { ScrollVelocityContainer, ScrollVelocityRow } from '@/Components/ui/scroll-based-velocity';

interface PublicLayoutProps extends PropsWithChildren {
    bgColor?: string;
    renderBottomAction?: (cart: CartContextType) => React.ReactNode;
    showFloatingCart?: boolean;
}

const LayoutContent = ({ children, bgColor, renderBottomAction, showFloatingCart = true }: PublicLayoutProps) => {
    const cart = useCart();
    const { selectedTable } = cart;

    return (
        <div className="h-dvh w-full flex justify-center items-stretch relative overflow-hidden transition-colors duration-500 bg-white">
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
            <div className="w-full max-w-[480px] h-full max-h-[100dvh] shadow-2xl overflow-hidden flex flex-col relative mx-auto bg-white">
                {/* Banda fija arriba: no hace scroll, el contenido pasa por debajo */}
                <div
                    className="absolute top-0 left-0 right-0 w-full pointer-events-none z-10"
                    style={{
                        height: '50%', // cambia por el % que quieras (ej. 15%, 200px)
                        background: 'linear-gradient(to bottom, #ffceec, #ffffff)',
                    }}
                >
                    <img
                        src="/themes/march_8/flowers_01.webp"
                        alt=""
                        className="absolute top-[100px] right-[350px] -rotate-45 w-56 h-auto object-contain opacity-90"
                        aria-hidden
                    />
                    <img
                        src="/themes/march_8/flowers_02.webp"
                        alt=""
                        className="absolute top-[200px] -right-[80px] rotate-180 w-80 h-auto object-contain opacity-60"
                        aria-hidden
                    />
                </div>

                {/* Scroll Velocity Text march 8 */}
                <div className="relative flex w-full h-auto flex-col items-center justify-center overflow-hidden z-10 pt-6">
                    <ScrollVelocityContainer className="text-2xl font-bold tracking-tight text-pink-600 md:text-4xl">
                        <ScrollVelocityRow baseVelocity={4} direction={1}>
                            Tu día, tu poder 💪
                        </ScrollVelocityRow>
                        <ScrollVelocityRow baseVelocity={4} direction={-1}>
                            Tu fuerza, tu día, tu momento ✨
                        </ScrollVelocityRow>
                        <ScrollVelocityRow baseVelocity={4} direction={1}>
                            Gracias por ser imparable 🌟
                        </ScrollVelocityRow>
                    </ScrollVelocityContainer>
                </div>

                {selectedTable && (
                    <div className="bg-white text-primary px-4 py-2.5 text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b border-primary/20 animate-in fade-in slide-in-from-top duration-700 z-[9999]">
                        <MapPin className="w-3 h-3 animate-bounce" />
                        Pidiendo en: <span className="opacity-80">{selectedTable.name}</span> {selectedTable.zone?.name && <span className="text-[9px] opacity-60 ml-0.5">[{selectedTable.zone.name}]</span>}
                    </div>
                )}


                <div className="scrollbar-public flex-1 min-h-0 relative overflow-y-auto overflow-x-hidden z-10">
                    <div className="min-h-full flex flex-col">
                        <div className="flex-1">{children}</div>
                        <img
                            src="/themes/march_8/heart_various.webp"
                            alt=""
                            className="top-0 w-full h-full object-contain opacity-90"
                            aria-hidden
                        />
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
