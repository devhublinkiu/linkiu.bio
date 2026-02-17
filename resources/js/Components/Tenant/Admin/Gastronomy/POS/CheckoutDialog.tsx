import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { CreditCard, Banknote, Smartphone, CheckCircle, Utensils, Clock } from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '@/utils/currency';

import { Table, Tenant, CartItem, Customer } from '@/types/pos';

export interface CheckoutResult {
    orderId: number;
    paymentMethod: 'cash' | 'card' | 'transfer';
    cashAmount?: number;
    change?: number;
}

interface CheckoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    total: number;
    items: CartItem[];
    onSuccess: (result?: CheckoutResult) => void;
    customer: Customer | null;
    tenant: Tenant;
    table?: Table | null;
    isWaiter?: boolean;
    locationId: number;
}

export default function CheckoutDialog({ open, onOpenChange, total, items, onSuccess, customer, tenant, table, isWaiter = false, locationId }: CheckoutDialogProps) {
    const [method, setMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
    const [cashAmount, setCashAmount] = useState<string>('');
    const [transferRef, setTransferRef] = useState('');
    const [magicToken, setMagicToken] = useState<string>('');
    const [uploadedProof, setUploadedProof] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [sendToKitchen, setSendToKitchen] = useState(true);

    if (!tenant) {
        console.error('CheckoutDialog: Tenant prop is missing or undefined.');
        return null;
    }

    // Generate Token on Mount/Open
    useEffect(() => {
        if (open && !magicToken) {
            setMagicToken(uuidv4());
        }
        if (!open) {
            setMagicToken('');
            setUploadedProof(null);
            setTransferRef('');
        }
    }, [open]);

    // Listen for Upload Event (Echo real-time)
    useEffect(() => {
        if (!magicToken || !tenant.id) return;

        interface EchoChannel {
            listen: (event: string, cb: (e: { fileUrl: string }) => void) => EchoChannel;
            stopListening: (event: string) => void;
        }

        let channel: EchoChannel | null = null;

        try {
            const echoInstance = (window as unknown as Record<string, unknown>).Echo as {
                connector?: unknown;
                private: (ch: string) => EchoChannel;
            } | undefined;

            if (echoInstance?.connector) {
                channel = echoInstance.private(`pos.${tenant.id}.magic.${magicToken}`)
                    .listen('.proof.uploaded', (e: { fileUrl: string }) => {
                        setUploadedProof(e.fileUrl);
                        setTransferRef('Linkiu Mágico - Recibido');
                        toast.success('¡Comprobante recibido!');
                    });
            }
        } catch (error) {
            console.error('Echo subscription error:', error);
        }

        return () => {
            channel?.stopListening('.proof.uploaded');
        };
    }, [magicToken, tenant?.id]);

    const change = method === 'cash' && cashAmount ? parseFloat(cashAmount) - total : 0;
    const isValid = method !== 'cash' || (parseFloat(cashAmount) >= total);

    const handleConfirm = (payNow: boolean = true) => {
        if (payNow && !isValid) return;

        setIsProcessing(true);

        router.post(route('tenant.pos.store', { tenant: tenant.slug }), {
            location_id: locationId,
            items: items.filter(item => !item.is_sent).map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                variant_options: item.variant_options,
                notes: item.notes || null,
            })),
            payment_method: payNow ? method : null,
            service_type: table ? 'dine_in' : 'takeout',
            cash_amount: payNow && method === 'cash' ? parseFloat(cashAmount) : null,
            cash_change: payNow && method === 'cash' ? change : null,
            payment_reference: payNow && method === 'transfer' ? transferRef : null,
            customer_id: customer ? customer.id : null,
            customer_name: customer ? customer.name : (table ? `Mesa ${table.name}` : 'Mostrador'),
            customer_phone: customer ? customer.phone : null,
            table_id: table ? table.id : null,
            send_to_kitchen: sendToKitchen,
        }, {
            onSuccess: () => {
                setIsProcessing(false);
                onOpenChange(false);
                if (payNow) {
                    onSuccess({
                        orderId: 0,
                        paymentMethod: method,
                        cashAmount: method === 'cash' ? parseFloat(cashAmount) : undefined,
                        change: method === 'cash' ? change : undefined,
                    });
                } else {
                    onSuccess();
                    toast.success('¡Pedido guardado y mesa ocupada!');
                }
            },
            onError: (errors) => {
                setIsProcessing(false);
                console.error(errors);
                toast.error('Error al procesar el pedido.');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !isProcessing && onOpenChange(val)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">Cobrar Pedido</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {/* Kitchen Toggle (v2) */}
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 mb-6">
                        <div className="flex items-center gap-2">
                            <Utensils className="w-5 h-5 text-indigo-600" />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900">Enviar a Cocina</span>
                                <span className="text-[10px] text-slate-500">¿Emitir comanda al KDS?</span>
                            </div>
                        </div>
                        <Button
                            variant={sendToKitchen ? "default" : "outline"}
                            size="sm"
                            className={`h-8 px-3 ${sendToKitchen ? 'bg-indigo-600' : ''}`}
                            onClick={() => setSendToKitchen(!sendToKitchen)}
                        >
                            {sendToKitchen ? 'SÍ' : 'NO'}
                        </Button>
                    </div>

                    <div className="text-center mb-6">
                        <span className="text-slate-500 text-sm">Total a Pagar</span>
                        <div className="text-5xl font-black text-slate-900 mt-1">
                            {formatCurrency(total)}
                        </div>
                    </div>

                    <Tabs value={method} onValueChange={(v) => setMethod(v as 'cash' | 'card' | 'transfer')} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="cash" className="flex flex-col gap-1 py-2 h-auto">
                                <Banknote className="w-5 h-5" />
                                <span className="text-xs">Efectivo</span>
                            </TabsTrigger>
                            <TabsTrigger value="card" className="flex flex-col gap-1 py-2 h-auto">
                                <CreditCard className="w-5 h-5" />
                                <span className="text-xs">Tarjeta</span>
                            </TabsTrigger>
                            <TabsTrigger value="transfer" className="flex flex-col gap-1 py-2 h-auto">
                                <Smartphone className="w-5 h-5" />
                                <span className="text-xs">Transferencia</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="cash" className="space-y-4">
                            <div className="space-y-2">
                                <Label>Dinero Recibido</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">$</span>
                                    <Input
                                        type="number"
                                        value={cashAmount}
                                        onChange={(e) => setCashAmount(e.target.value)}
                                        className="pl-7 text-lg font-bold"
                                        placeholder="0"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {cashAmount && (
                                <div className={`p-4 rounded-lg flex justify-between items-center ${change >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    <span className="font-bold">Cambio / Devuelta:</span>
                                    <span className="font-black text-xl">{formatCurrency(Math.max(0, change))}</span>
                                </div>
                            )}

                            {method === 'cash' && change < 0 && (
                                <p className="text-red-500 text-xs font-bold text-center">
                                    Faltan {formatCurrency(Math.abs(change))}
                                </p>
                            )}
                        </TabsContent>

                        <TabsContent value="card">
                            <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center gap-2">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200">
                                    <CreditCard className="w-6 h-6 text-slate-900" />
                                </div>
                                <p className="text-sm text-slate-600 font-medium">Procesar pago en datáfono por <span className="font-bold text-slate-900">{formatCurrency(total)}</span></p>
                            </div>
                        </TabsContent>

                        <TabsContent value="transfer">
                            <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center gap-4">
                                <div className="text-center">
                                    <p className="text-sm text-slate-600 font-medium mb-1">Total a Transferir</p>
                                    <span className="font-bold text-2xl text-slate-900">{formatCurrency(total)}</span>
                                </div>

                                {uploadedProof ? (
                                    <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center gap-2 animate-in fade-in zoom-in">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                        <p className="text-green-800 font-bold text-sm">¡Comprobante Recibido!</p>
                                        <a href={uploadedProof} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 underline">
                                            Ver Comprobante
                                        </a>
                                        <img src={uploadedProof} alt="Comprobante" className="w-16 h-16 object-cover rounded border" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="bg-white p-2 rounded shadow-sm border">
                                            {magicToken && (
                                                <QRCodeSVG
                                                    value={route('tenant.magic.show', { tenant: tenant.slug, token: magicToken })}
                                                    size={128}
                                                    level="M"
                                                />
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Escanear para cargar comprobante</p>
                                    </div>
                                )}

                                <div className="w-full space-y-2 text-left">
                                    <Label>Referencia / Comprobante (Opcional)</Label>
                                    <Input
                                        placeholder="#123456"
                                        value={transferRef}
                                        onChange={(e) => setTransferRef(e.target.value)}
                                        className="bg-white"
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <div className="flex-1 flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancelar</Button>
                        {table && (
                            <Button
                                variant="secondary"
                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900"
                                onClick={() => handleConfirm(false)}
                                disabled={isProcessing}
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                Guardar
                            </Button>
                        )}
                    </div>
                    <Button
                        size="lg"
                        className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold"
                        onClick={() => handleConfirm(true)}
                        disabled={!isValid || isProcessing}
                    >
                        {isProcessing ? 'Procesando...' : (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                {isWaiter ? 'Enviar (Precaución)' : 'Confirmar Pago'}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
