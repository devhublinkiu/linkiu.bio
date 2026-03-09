import React, { PropsWithChildren } from 'react';
import Footer from '@/Components/Public/Footer';
import ReportBusinessStrip from '@/Components/Public/ReportBusinessStrip';
import { Toaster } from 'sonner';

interface PublicLayoutProps extends PropsWithChildren {
    bgColor?: string;
    /** Bloque opcional antes del banner "Reportar problemas" (por vertical; Church no usa) */
    renderPrefooter?: React.ReactNode;
    /** Barra fija inferior opcional (ej. CTA) */
    renderBottomAction?: React.ReactNode;
    /** Reproductor o elemento flotante al fondo (como el carrito en gastronomía) */
    renderFloatingBottom?: React.ReactNode;
}

export default function PublicLayout({ children, bgColor, renderPrefooter, renderBottomAction, renderFloatingBottom }: PublicLayoutProps) {
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
            <div className="w-full max-w-[480px] h-full max-h-[100dvh] bg-white shadow-2xl overflow-hidden flex flex-col relative mx-auto z-10">
                <div className="scrollbar-public flex-1 min-h-0 relative overflow-y-auto overflow-x-hidden">
                    <div className="min-h-full flex flex-col">
                        <div className="flex-1">{children}</div>
                        <ReportBusinessStrip />
                        {renderPrefooter}
                        <Footer />
                    </div>
                </div>

                {/* Bottom Action Bar (opcional) */}
                {renderBottomAction && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 px-6 z-40 sm:absolute sm:bottom-0">
                        {renderBottomAction}
                    </div>
                )}

                {/* Floating bottom (reproductor, etc.) — dentro del layout como el carrito en gastronomía */}
                {renderFloatingBottom && (
                    <div className="absolute bottom-0 left-0 right-0 z-40 w-full max-w-[480px] mx-auto">
                        {renderFloatingBottom}
                    </div>
                )}

                {/* iPhone Home Bar Indicator (Visual Flair) */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-200 rounded-full sm:block hidden pointer-events-none mb-1 z-50" />
            </div>
            <Toaster position="top-center" />
        </div>
    );
}
