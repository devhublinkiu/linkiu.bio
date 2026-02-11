import { useCart } from '@/Contexts/CartContext';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { router, usePage } from '@inertiajs/react';

export default function FloatingCart() {
    const { cartCount, cartTotal } = useCart();
    const { tenant } = usePage<any>().props;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <AnimatePresence>
            {cartCount > 0 && (
                <div className="fixed bottom-4 md:bottom-8 left-4 right-4 z-50 pointer-events-none flex justify-center">
                    <motion.button
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        onClick={() => router.visit(route('tenant.cart', tenant.slug))}
                        className="pointer-events-auto w-[calc(100%-2rem)] max-w-[448px] bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-3xl shadow-xl shadow-slate-900/20 flex items-center justify-between group active:scale-[0.98] transition-all border border-white/10"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-xl relative">
                                <ShoppingBag className="w-5 h-5 text-white" />
                                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-xs text-slate-300 font-medium">Total Estimado</span>
                                <span className="text-lg font-black tracking-tight">{formatPrice(cartTotal)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 pl-4 border-l border-white/10 group-hover:translate-x-1 transition-transform">
                            <span className="text-sm font-bold">Ver Pedido</span>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </motion.button>
                </div>
            )}
        </AnimatePresence>
    );
}
