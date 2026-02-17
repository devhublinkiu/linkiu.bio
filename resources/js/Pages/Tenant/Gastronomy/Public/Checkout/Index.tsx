import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useCart, CartContextType } from '@/Contexts/CartContext';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/Components/ui/card';
import { toast } from 'sonner';
import PublicLayout from '@/Components/Tenant/Gastronomy/Public/PublicLayout';
import { ArrowLeft, Store, Utensils, CreditCard, Banknote, Smartphone, Copy, Upload, FileText } from 'lucide-react';

// Types
type ServiceType = 'dine_in' | 'takeout' | 'delivery';
type PaymentMethod = 'cash' | 'transfer' | 'card';

interface CheckoutFormProps {
    tenant: any;
    table?: any;
    shippingMethod?: any;
    bankAccounts: any[];
    defaultLocationId?: number | null;
    serviceType: ServiceType;
    setServiceType: (type: ServiceType) => void;
    deliveryCost: number;
}

const CheckoutForm = ({ tenant, table, shippingMethod, bankAccounts, defaultLocationId, serviceType, setServiceType, deliveryCost }: CheckoutFormProps) => {
    const { items, cartTotal, clearCart } = useCart();
    const selectedLocationId = (usePage().props as { selected_location_id?: number | null }).selected_location_id;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

    // Form Data
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        delivery_neighborhood: '',
        delivery_address: '',
        cash_amount: '',
        notes: '',
    });

    // File for Transfer Proof
    const [paymentProof, setPaymentProof] = useState<File | null>(null);

    const total = cartTotal + deliveryCost;
    const change = (paymentMethod === 'cash' && formData.cash_amount)
        ? parseFloat(formData.cash_amount) - total
        : 0;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('¡Copiado al portapapeles!');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error('Tu carrito está vacío');
            return;
        }

        setIsSubmitting(true);

        const locationId = serviceType === 'dine_in' && table?.location_id
                ? table.location_id
                : (selectedLocationId ?? defaultLocationId);
        if (!locationId && serviceType !== 'dine_in') {
            toast.error('No se pudo determinar la sede. Recarga la página o elige una sede.');
            setIsSubmitting(false);
            return;
        }

        try {
            const payload = new FormData();
            payload.append('service_type', serviceType);
            if (serviceType === 'dine_in' && table) payload.append('table_id', table.id);
            if (locationId) payload.append('location_id', String(locationId));

            payload.append('customer_name', formData.customer_name);
            if (formData.customer_phone) payload.append('customer_phone', formData.customer_phone);

            if (serviceType === 'delivery') {
                payload.append('delivery_address[neighborhood]', formData.delivery_neighborhood);
                payload.append('delivery_address[address]', formData.delivery_address);
                payload.append('delivery_cost', deliveryCost.toString());
            }

            payload.append('payment_method', paymentMethod);
            if (paymentMethod === 'cash') payload.append('cash_amount', formData.cash_amount);
            if (paymentMethod === 'transfer' && paymentProof) payload.append('payment_proof', paymentProof);

            // Add Items
            items.forEach((item, index) => {
                payload.append(`items[${index}][product_id]`, item.id.toString());
                payload.append(`items[${index}][quantity]`, item.quantity.toString());
                if (item.variant_options && Array.isArray(item.variant_options)) {
                    item.variant_options.forEach((opt: any, vIndex: number) => {
                        payload.append(`items[${index}][variant_options][${vIndex}][name]`, opt.name);
                        payload.append(`items[${index}][variant_options][${vIndex}][value]`, opt.value);
                        if (opt.price) {
                            payload.append(`items[${index}][variant_options][${vIndex}][price]`, opt.price.toString());
                        }
                    });
                }
            });

            const response = await axios.post(route('tenant.checkout.process', { tenant: tenant.slug }), payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data?.success && response.data?.redirect_url) {
                toast.success('¡Pedido enviado!');
                clearCart();
                window.location.href = response.data.redirect_url;
            } else {
                toast.error(response.data?.message || 'Error al procesar el pedido');
            }
        } catch (error: any) {
            const message = error.response?.data?.message || error.response?.data?.errors?.location_id?.[0] || 'Error al procesar el pedido';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 pb-32">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href={route('tenant.cart', tenant.slug)} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
                    <ArrowLeft className="w-6 h-6 text-slate-600" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">Finalizar Pedido</h1>
            </div>

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">

                {/* Service Type Selection */}
                <section>
                    <h2 className="text-sm font-bold text-slate-500 uppercase mb-3 tracking-wider">¿Cómo quieres tu pedido?</h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {/* DINE IN - Only if table detected */}
                        {table && (
                            <div
                                onClick={() => setServiceType('dine_in')}
                                className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${serviceType === 'dine_in' ? 'border-black bg-slate-50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                            >
                                <Utensils className={`w-8 h-8 ${serviceType === 'dine_in' ? 'text-black' : 'text-slate-400'}`} />
                                <span className={`font-bold text-sm ${serviceType === 'dine_in' ? 'text-slate-900' : 'text-slate-500'}`}>Mesa {table.name}</span>
                            </div>
                        )}

                        {/* TAKEOUT */}
                        <div
                            onClick={() => setServiceType('takeout')}
                            className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${serviceType === 'takeout' ? 'border-black bg-slate-50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                        >
                            <Store className={`w-8 h-8 ${serviceType === 'takeout' ? 'text-black' : 'text-slate-400'}`} />
                            <span className={`font-bold text-sm ${serviceType === 'takeout' ? 'text-slate-900' : 'text-slate-500'}`}>Para Recoger</span>
                        </div>

                        {/* DELIVERY */}
                        <div
                            onClick={() => setServiceType('delivery')}
                            className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${serviceType === 'delivery' ? 'border-black bg-slate-50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                        >
                            <Smartphone className={`w-8 h-8 ${serviceType === 'delivery' ? 'text-black' : 'text-slate-400'}`} />
                            <span className={`font-bold text-sm ${serviceType === 'delivery' ? 'text-slate-900' : 'text-slate-500'}`}>Domicilio</span>
                        </div>
                    </div>
                </section>

                {/* Customer Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tus Datos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre <span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                placeholder="Tu nombre"
                                value={formData.customer_name}
                                onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">WhatsApp {serviceType === 'delivery' && <span className="text-red-500">*</span>}</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="300 123 4567"
                                value={formData.customer_phone}
                                onChange={e => setFormData({ ...formData, customer_phone: e.target.value })}
                                required={serviceType === 'delivery'}
                            />
                        </div>

                        {serviceType === 'delivery' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="neighborhood">Barrio <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="neighborhood"
                                        placeholder="Ej: El Poblado"
                                        value={formData.delivery_neighborhood}
                                        onChange={e => setFormData({ ...formData, delivery_neighborhood: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Dirección de Entrega <span className="text-red-500">*</span></Label>
                                    <Textarea
                                        id="address"
                                        placeholder="Calle 123 # 45 - 67, Apto 201"
                                        value={formData.delivery_address}
                                        onChange={e => setFormData({ ...formData, delivery_address: e.target.value })}
                                        required
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                    <CardHeader>
                        <CardTitle>Método de Pago</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup value={paymentMethod} onValueChange={(v: PaymentMethod) => setPaymentMethod(v)} className="space-y-3">

                            {/* CASH */}
                            <div className={`flex items-start space-x-3 space-y-0 rounded-md border p-4 ${paymentMethod === 'cash' ? 'border-black bg-slate-50' : ''}`}>
                                <RadioGroupItem value="cash" id="cash" className="mt-1" />
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="cash" className="font-bold cursor-pointer">Efectivo</Label>
                                    <p className="text-sm text-muted-foreground">Pagas al recibir.</p>
                                    {paymentMethod === 'cash' && (
                                        <div className="pt-2 animate-in slide-in-from-top-2">
                                            <Label htmlFor="cash_amount" className="text-xs">¿Con cuánto pagas?</Label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-slate-500">$</span>
                                                <Input
                                                    id="cash_amount"
                                                    type="number"
                                                    className="h-9"
                                                    placeholder="Ej: 50000"
                                                    value={formData.cash_amount}
                                                    onChange={e => setFormData({ ...formData, cash_amount: e.target.value })}
                                                />
                                            </div>
                                            {change > 0 && <p className="text-xs text-green-600 font-bold mt-1">Cambio: ${change.toLocaleString()}</p>}
                                            {change < 0 && formData.cash_amount && <p className="text-xs text-red-500 mt-1">Faltan: ${Math.abs(change).toLocaleString()}</p>}
                                        </div>
                                    )}
                                </div>
                                <Banknote className="h-5 w-5 text-slate-500" />
                            </div>

                            {/* TRANSFER */}
                            <div className={`flex items-start space-x-3 space-y-0 rounded-md border p-4 ${paymentMethod === 'transfer' ? 'border-black bg-slate-50' : ''}`}>
                                <RadioGroupItem value="transfer" id="transfer" className="mt-1" />
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="transfer" className="font-bold cursor-pointer">Transferencia Bancaria</Label>
                                    <p className="text-sm text-muted-foreground">Envía el comprobante.</p>

                                    {paymentMethod === 'transfer' && (
                                        <div className="pt-3 animate-in fade-in slide-in-from-top-2">
                                            {bankAccounts && bankAccounts.length > 0 ? (
                                                <div className="space-y-2 mb-4">
                                                    {bankAccounts.map((account: any) => (
                                                        <div key={account.id} className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex justify-between items-center shadow-sm">
                                                            <div>
                                                                <p className="font-bold text-slate-900 text-sm">{account.bank_name}</p>
                                                                <p className="font-mono text-slate-600 mt-0.5">{account.account_type}</p>
                                                                <p className="font-mono font-bold text-slate-800 text-sm tracking-wide">{account.account_number}</p>
                                                                {account.account_holder && <p className="text-[10px] text-slate-400 uppercase mt-1">Titular: {account.account_holder}</p>}
                                                            </div>
                                                            <Button
                                                                size="icon" variant="secondary" className="h-9 w-9 shrink-0 text-slate-600 hover:text-slate-900"
                                                                onClick={(e) => { e.preventDefault(); copyToClipboard(account.account_number); }}
                                                                title="Copiar número"
                                                            >
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-yellow-50 text-yellow-700 text-xs rounded mb-3 border border-yellow-100">
                                                    No hay cuentas bancarias configuradas. Consulta al establecimiento.
                                                </div>
                                            )}

                                            <div className="mt-4">
                                                <Label htmlFor="proof" className="text-xs font-bold text-slate-700">Comprobante de Pago</Label>
                                                <div className="mt-2 flex items-center gap-3">
                                                    <Input
                                                        id="proof"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={e => setPaymentProof(e.target.files?.[0] || null)}
                                                    />
                                                    <label
                                                        htmlFor="proof"
                                                        className="cursor-pointer bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center active:scale-95"
                                                    >
                                                        <Upload className="w-4 h-4" />
                                                        {paymentProof ? 'Cambiar archivo' : 'Subir Comprobante'}
                                                    </label>
                                                </div>
                                                {paymentProof && (
                                                    <div className="mt-2 flex items-center gap-2 text-green-600 text-xs font-bold animate-in fade-in">
                                                        <FileText className="w-3 h-3" />
                                                        <span className="truncate max-w-[250px]">{paymentProof.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Smartphone className="h-5 w-5 text-slate-500" />
                            </div>

                            {/* CARD */}
                            <div className={`flex items-start space-x-3 space-y-0 rounded-md border p-4 ${paymentMethod === 'card' ? 'border-black bg-slate-50' : ''}`}>
                                <RadioGroupItem value="card" id="card" className="mt-1" />
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="card" className="font-bold cursor-pointer">Datáfono (Tarjeta)</Label>
                                    <p className="text-sm text-muted-foreground">Llevamos el datáfono.</p>
                                </div>
                                <CreditCard className="h-5 w-5 text-slate-500" />
                            </div>

                        </RadioGroup>
                    </CardContent>
                </Card>

                {/* Summary Footer Placeholder */}
                <div className="h-24"></div>

            </form>
        </div>
    );
};

// Main Page Component
export default function CheckoutIndex({ tenant, table, shippingMethod, bankAccounts = [], default_location_id }: { tenant: any; table?: any; shippingMethod?: any; bankAccounts?: any[]; default_location_id?: number | null }) {
    const [serviceType, setServiceType] = useState<ServiceType>(table ? 'dine_in' : 'takeout');

    // Calculate costs at parent level to pass to Layout
    const deliveryCost = serviceType === 'delivery'
        ? (parseFloat(shippingMethod?.cost) || 0)
        : 0;

    const renderFooter = (cart: CartContextType) => {
        const total = cart.cartTotal + deliveryCost;

        return (
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span>${cart.cartTotal.toLocaleString()}</span>
                </div>
                {serviceType === 'delivery' && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Domicilio</span>
                        <span>${deliveryCost.toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between items-center text-xl font-bold text-slate-900 pb-2">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                </div>

                <Button
                    onClick={() => {
                        // Trigger submit on the form inside CheckoutForm
                        // Simple ID hack:
                        const form = document.getElementById('checkout-form') as HTMLFormElement;
                        if (form) form.requestSubmit();
                    }}
                    disabled={cart.items.length === 0}
                    className="w-full h-12 text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
                >
                    Confirmar Pedido • ${total.toLocaleString()}
                </Button>
            </div>
        );
    };

    return (
        <PublicLayout
            bgColor="#f8fafc"
            showFloatingCart={false}
            renderBottomAction={renderFooter}
        >
            <Head title="Finalizar Pedido" />
            <CheckoutForm
                tenant={tenant}
                table={table}
                shippingMethod={shippingMethod}
                bankAccounts={bankAccounts}
                defaultLocationId={default_location_id}
                serviceType={serviceType}
                setServiceType={setServiceType}
                deliveryCost={deliveryCost}
            />
        </PublicLayout>
    );
}
