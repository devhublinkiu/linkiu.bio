import { Head, Link } from '@inertiajs/react'; // Removed unused imports
import { useCart } from '@/Contexts/CartContext';
import { Button } from '@/Components/ui/button';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicLayout from '@/Components/Tenant/Gastronomy/Public/PublicLayout';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";

const CartInner = ({ tenant }: { tenant: any }) => {
    const { items, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

    // Helper function for price formatting
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            <Head title="Tu Carrito" />

            {/* Header */}
            <div className="bg-white sticky top-0 z-40 border-b px-4 py-4 flex items-center justify-between shadow-sm">
                <Link href={route('tenant.home', tenant.slug)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="font-bold text-lg text-slate-800">Tu Pedido</h1>

                {items.length > 0 ? (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-full transition-colors"
                            >
                                Vaciar
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción eliminará todos los productos de tu carrito. No podrás deshacer esta acción.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={clearCart} className="bg-red-600 hover:bg-red-700 text-white">
                                    Sí, vaciar carrito
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                ) : (
                    <div className="w-10"></div>
                )}
            </div>

            <div className="max-w-2xl mx-auto p-4">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center">
                            <ShoppingBag className="w-12 h-12 text-slate-400" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-slate-800">Tu carrito está vacío</h2>
                            <p className="text-slate-500 max-w-xs mx-auto">Parece que aún no has agregado nada delicioso a tu pedido.</p>
                        </div>
                        <Link href={route('tenant.home', tenant.slug)}>
                            <Button className="font-bold" size="lg">Ir al Menú</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <AnimatePresence initial={false}>
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4"
                                    >
                                        <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <ShoppingBag className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-slate-900 line-clamp-2">{item.name}</h3>
                                                    <span className="font-bold text-slate-900 ml-2">{formatPrice(item.price * item.quantity)}</span>
                                                </div>
                                                {item.variant_options && item.variant_options.length > 0 && (
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {item.variant_options.map(v => v.name).join(', ')}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600 active:scale-95 transition-transform"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="font-bold text-slate-800 w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-900 active:scale-95 transition-transform"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Summary */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                            <h3 className="font-bold text-lg border-b pb-4">Resumen</h3>
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Servicio (Opcional)</span>
                                <span>-</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t text-xl font-black text-slate-900">
                                <span>Total</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function CartIndex({ tenant }: { tenant: any }) {
    const bgColor = tenant.brand_colors?.bg_color || '#f8fafc';

    return (
        <PublicLayout
            bgColor={bgColor}
            showFloatingCart={false}
            renderBottomAction={(cart) => (
                cart.items.length > 0 ? (
                    <div className="max-w-2xl mx-auto">
                        <Link href={route('tenant.checkout', tenant.slug)} className="w-full block">
                            <Button
                                className="w-full h-14 text-lg font-bold shadow-xl shadow-slate-900/20"
                            >
                                Continuar a Pagar
                            </Button>
                        </Link>
                    </div>
                ) : null
            )}
        >
            <CartInner tenant={tenant} />
        </PublicLayout>
    );
}
