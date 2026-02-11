import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { CreditCard, Banknote, Smartphone, CheckCircle } from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';

import { Table } from '@/types/pos';

interface CheckoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    total: number;
    items: any[];
    onSuccess: () => void;
    customer: any;
    tenant: any;
    table?: Table | null; // Made table prop more specific
    isWaiter?: boolean;
}

export default function CheckoutDialog({ open, onOpenChange, total, items, onSuccess, customer, tenant, table, isWaiter = false }: CheckoutDialogProps) {
    const [method, setMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
    const [cashAmount, setCashAmount] = useState<string>('');
    const [transferRef, setTransferRef] = useState('');
    const [magicToken, setMagicToken] = useState<string>('');
    const [uploadedProof, setUploadedProof] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Safety check for tenant
    if (!tenant) {
        console.error('CheckoutDialog: Tenant prop is missing or undefined.');
        return null; // Or render an error state
    }

    // Generate Token on Mount/Open
    useEffect(() => {
        if (open && !magicToken) {
            setMagicToken(uuidv4());
        }
        if (!open) {
            setMagicToken('');
            setUploadedProof(null);
            setTransferRef(''); // Reset transfer ref too
        }
    }, [open]);

    // Listen for Upload Event
    useEffect(() => {
        if (!magicToken || !tenant.id) return;

        let channel: any = null;

        try {
            // @ts-ignore
            if (window.Echo) {
                // @ts-ignore
                channel = window.Echo.private(`pos.${tenant.id}.magic.${magicToken}`)
                    .listen('.proof.uploaded', (e: any) => {
                        console.log('Proof Uploaded:', e);
                        setUploadedProof(e.fileUrl);
                        setTransferRef('Linkiu Mágico - Recibido');
                        toast.success('¡Comprobante recibido!');
                    });
            } else {
                console.warn('Echo not initialized');
            }
        } catch (error) {
            console.error('Echo subscription error:', error);
        }

        return () => {
            if (channel) {
                channel.stopListening('.proof.uploaded');
            }
        };
    }, [magicToken, tenant?.id]);

    const change = method === 'cash' && cashAmount ? parseFloat(cashAmount) - total : 0;
    const isValid = method !== 'cash' || (parseFloat(cashAmount) >= total);

    const handleConfirm = () => {
        if (!isValid) return;

        setIsProcessing(true);

        router.post(route('tenant.pos.store'), {
            items: items.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                variant_options: item.variant_options
            })),
            payment_method: method,
            total,
            service_type: 'takeout', // Default for POS Quick Order
            cash_given: method === 'cash' ? parseFloat(cashAmount) : null,
            cash_change: method === 'cash' ? change : null,
            payment_reference: method === 'transfer' ? transferRef : null,
            customer_id: customer ? customer.id : null,
            customer_name: customer ? customer.name : 'Mostrador',
            customer_phone: customer ? customer.phone : null,
            table_id: table ? table.id : null,
        }, {
            onSuccess: () => {
                setIsProcessing(false);
                onOpenChange(false);
                onSuccess();
                toast.success('¡Pedido creado exitosamente!');
                // Automatically reset for next order handled by parent or page reload?
                // Parent acts on onSuccess to clear cart.
            },
            onError: (errors) => {
                setIsProcessing(false);
                console.error(errors);
                toast.error('Error al crear el pedido. Verifica los datos.');
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
                    <div className="text-center mb-6">
                        <span className="text-slate-500 text-sm">Total a Pagar</span>
                        <div className="text-5xl font-black text-indigo-600 mt-1">
                            ${total.toLocaleString()}
                        </div>
                    </div>

                    <Tabs value={method} onValueChange={(v) => setMethod(v as any)} className="w-full">
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
                                    <span className="font-black text-xl">${Math.max(0, change).toLocaleString()}</span>
                                </div>
                            )}

                            {method === 'cash' && change < 0 && (
                                <p className="text-red-500 text-xs font-bold text-center">
                                    Faltan ${Math.abs(change).toLocaleString()}
                                </p>
                            )}
                        </TabsContent>

                        <TabsContent value="card">
                            <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center gap-2">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <CreditCard className="w-6 h-6 text-indigo-600" />
                                </div>
                                <p className="text-sm text-slate-600 font-medium">Procesar pago en datáfono por <span className="font-bold text-slate-900">${total.toLocaleString()}</span></p>
                            </div>
                        </TabsContent>

                        <TabsContent value="transfer">
                            <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center gap-4">
                                <div className="text-center">
                                    <p className="text-sm text-slate-600 font-medium mb-1">Total a Transferir</p>
                                    <span className="font-bold text-2xl text-slate-900">${total.toLocaleString()}</span>
                                </div>

                                {uploadedProof ? (
                                    <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center gap-2 animate-in fade-in zoom-in">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                        <p className="text-green-800 font-bold text-sm">¡Comprobante Recibido!</p>
                                        <a href={uploadedProof} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 underline">
                                            Ver Comprobante
                                        </a>
                                        <img src={uploadedProof} alt="Proof" className="w-16 h-16 object-cover rounded border" />
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

                <DialogFooter className="sm:justify-between gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button
                        size="lg"
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                        onClick={handleConfirm}
                        disabled={!isValid || isProcessing}
                    >
                        {isProcessing ? 'Procesando...' : (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                {isWaiter ? 'Enviar Pedido (Pre-cuenta)' : 'Confirmar Pago'}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
