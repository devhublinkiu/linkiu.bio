import { Button } from '@/Components/ui/button';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Badge } from '@/Components/ui/badge';
import { ShoppingCart, Trash2, User, UserPlus, CreditCard, Banknote, Minus, Plus, ChefHat, Loader2, Package, Ban } from 'lucide-react';
import { CartItem as CartItemType, Customer, Table, TaxSettings, VariantOption } from '@/types/pos';
import { formatCurrency, calculateTax } from '@/utils/currency';
import { useMemo } from 'react';

interface CartSidebarProps {
    cart: CartItemType[];
    cartTotal: number;
    selectedCustomer: Customer | null;
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemoveFromCart: (id: string) => void;
    onClearCart: () => void;
    onOpenCustomerModal: () => void;
    onShowCheckout: () => void;
    onSendToKitchen: () => void;
    canPay: boolean;
    isProcessing?: boolean;
    isTakeoutMode?: boolean;
    selectedTable: Table | null;
    onAddProducts: () => void;
    onFreeTable?: () => void;
    onCancelSentItem?: (itemId: string) => void;
    taxSettings?: TaxSettings;
}

export default function CartSidebar({
    cart,
    cartTotal,
    selectedCustomer,
    onUpdateQuantity,
    onRemoveFromCart,
    onClearCart,
    onOpenCustomerModal,
    onShowCheckout,
    onSendToKitchen,
    canPay,
    isProcessing = false,
    isTakeoutMode = false,
    selectedTable,
    onAddProducts,
    onFreeTable,
    onCancelSentItem,
    taxSettings
}: CartSidebarProps) {

    const { subtotal, taxAmount, grandTotal } = useMemo(() => {
        return calculateTax(
            cartTotal,
            taxSettings?.tax_rate || 0,
            taxSettings?.price_includes_tax || false
        );
    }, [cartTotal, taxSettings]);

    if (!selectedTable && !isTakeoutMode) {
        return (
            <div className="flex flex-col h-full bg-white items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Sin Mesa Seleccionada</h3>
                <p className="text-slate-500 text-sm">Selecciona una mesa del mapa para comenzar una orden.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white w-full">
            {/* Cart Header */}
            <div className={`h-16 px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 ${isTakeoutMode ? 'bg-indigo-100' : 'bg-indigo-50'}`}>
                <div>
                    <h2 className="font-black text-xl text-indigo-900 flex items-center gap-2">
                        {isTakeoutMode ? (
                            <><Package className="w-5 h-5" /> Pedido Rápido</>
                        ) : (
                            selectedTable?.name
                        )}
                    </h2>
                    <p className="text-xs text-indigo-400 font-medium">
                        {isTakeoutMode ? 'Takeout / Delivery' : 'Orden en curso'}
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    {selectedTable?.status === 'occupied' && onFreeTable && !isTakeoutMode && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-[10px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 h-8 px-2 border border-red-100 uppercase"
                            onClick={onFreeTable}
                        >
                            Liberar
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={onClearCart}>
                        <Trash2 className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Customer Selector */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 shrink-0">
                <Button
                    variant="outline"
                    className={`w-full justify-between bg-white border-dashed h-auto py-3 ${selectedCustomer ? 'border-indigo-200 bg-indigo-50/50' : 'text-slate-500 hover:text-indigo-600 hover:border-indigo-300'}`}
                    onClick={onOpenCustomerModal}
                >
                    <div className="flex items-center gap-3 text-left">
                        <div className={`p-2 rounded-full ${selectedCustomer ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                            {selectedCustomer ? <User className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                        </div>
                        <div>
                            <div className={`text-sm font-bold ${selectedCustomer ? 'text-indigo-900' : 'text-slate-600'}`}>
                                {selectedCustomer ? selectedCustomer.name : 'Seleccionar Cliente'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                                {selectedCustomer ? (selectedCustomer.phone || 'Cliente Registrado') : 'Venta de Mostrador'}
                            </div>
                        </div>
                    </div>
                    {selectedCustomer ? (
                        <CreditCard className="w-4 h-4 text-indigo-300" />
                    ) : (
                        <Badge variant="secondary" className="opacity-50">INVITADO</Badge>
                    )}
                </Button>
            </div>

            {/* Cart Items List */}
            <ScrollArea className="flex-1 px-4">
                <div className="py-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="h-40 flex flex-col items-center justify-center text-slate-300 text-sm italic">
                            <ShoppingCart className="w-10 h-10 mb-2 opacity-20" />
                            Carrito vacío
                            <Button variant="link" onClick={onAddProducts} className="mt-2 text-indigo-600">
                                Agregar Productos
                            </Button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex gap-3 bg-white p-2 rounded-lg border border-slate-100 hover:border-indigo-100 transition-colors group">
                                <div className="w-12 h-12 bg-slate-100 rounded-md shrink-0 overflow-hidden">
                                    {item.image_url && <img src={item.image_url} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div className="font-bold text-sm text-slate-800 truncate pr-2">{item.name}</div>
                                        <div className="font-bold text-sm text-slate-900">{formatCurrency(item.total)}</div>
                                    </div>
                                    <div className="text-xs text-slate-400 min-h-[16px] flex items-center justify-between">
                                        <span>{formatCurrency(item.price)} c/u</span>
                                        {item.is_sent && (
                                            <Badge variant="outline" className="text-[9px] h-4 bg-orange-50 text-orange-600 border-orange-200">
                                                En Cocina
                                            </Badge>
                                        )}
                                    </div>
                                    {item.notes && (
                                        <div className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded mt-1 border border-amber-100 italic">
                                            📝 {item.notes}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-2">
                                        {/* Qty Controls */}
                                        {!item.is_sent ? (
                                            <div className="flex items-center gap-3 bg-slate-50 rounded-full px-1 border border-slate-200">
                                                <button onClick={() => item.quantity > 1 ? onUpdateQuantity(item.id, -1) : onRemoveFromCart(item.id)} className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-red-500">
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-indigo-600">
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between w-full">
                                                <span className="text-xs font-bold text-slate-400">Cantidad: {item.quantity}</span>
                                                {onCancelSentItem && (
                                                    <button
                                                        onClick={() => onCancelSentItem(item.id)}
                                                        className="text-[10px] font-bold text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                                                        title="Anular item"
                                                    >
                                                        <Ban className="w-3 h-3" />
                                                        Anular
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>

            {/* Add Products Button */}
            <div className="p-4 border-t border-slate-100">
                <Button
                    variant="outline"
                    className="w-full border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                    onClick={onAddProducts}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Productos
                </Button>
            </div>

            {/* Totals & Actions */}
            <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] shrink-0">
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Subtotal</span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    {taxSettings && taxSettings.tax_rate > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">
                                {taxSettings.tax_name} ({taxSettings.tax_rate}%)
                            </span>
                            <span className="font-medium">{formatCurrency(taxAmount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-end pt-2 border-t border-dashed border-slate-200">
                        <span className="font-bold text-lg text-slate-900">Total</span>
                        <span className="font-black text-2xl text-indigo-600">{formatCurrency(grandTotal)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {canPay ? (
                        <div className="grid grid-cols-2 gap-3">
                            {/* Enviar a Cocina (reemplaza Tarjeta) */}
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-14 flex flex-col items-center justify-center gap-1 border-orange-300 text-orange-600 hover:bg-orange-50"
                                disabled={cart.length === 0 || isProcessing || !cart.some(item => !item.is_sent)}
                                onClick={onSendToKitchen}
                            >
                                {isProcessing ? <Loader2 className="w-5 h-5 mb-0.5 animate-spin" /> : <ChefHat className="w-5 h-5 mb-0.5" />}
                                <span className="text-xs font-bold">Cocina</span>
                            </Button>
                            {/* Cobrar */}
                            <Button
                                size="lg"
                                className="h-14 flex flex-col items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white"
                                disabled={cart.length === 0 || isProcessing}
                                onClick={onShowCheckout}
                            >
                                <Banknote className="w-5 h-5 mb-0.5" />
                                <span className="text-xs font-bold">Cobrar</span>
                            </Button>
                        </div>
                    ) : (
                        <Button
                            size="lg"
                            className="h-14 flex flex-col items-center justify-center gap-1 bg-orange-500 hover:bg-orange-600 text-white w-full"
                            disabled={cart.length === 0 || isProcessing}
                            onClick={onSendToKitchen}
                        >
                            {isProcessing ? <Loader2 className="w-6 h-6 mb-0.5 animate-spin" /> : <ChefHat className="w-6 h-6 mb-0.5" />}
                            <span className="text-xs font-bold uppercase">{isProcessing ? 'Enviando...' : 'Enviar a Cocina'}</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
