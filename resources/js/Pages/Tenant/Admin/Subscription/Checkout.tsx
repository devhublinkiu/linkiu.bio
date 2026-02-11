import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
    CheckCircle2,
    CreditCard,
    Banknote,
    ShieldCheck,
    ArrowRight,
    Info,
    Calendar,
    Globe,
    UploadCloud,
    FileText,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { route } from 'ziggy-js';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

interface Props {
    tenant: any;
    plan: any;
    billing_cycle: 'monthly' | 'yearly';
    amount: number;
    proration_credit?: number;
    reserved_slug?: string;
    bank_details?: {
        bank_name: string;
        account_type: string;
        account_number: string;
        account_holder: string;
        nit: string;
    };
}

export default function Checkout({ tenant, plan, billing_cycle, amount, proration_credit, reserved_slug, bank_details }: Props) {
    const [method, setMethod] = React.useState<'wompi' | 'transfer'>('wompi');
    const [showProofModal, setShowProofModal] = React.useState(false);

    const { data, setData, post, processing } = useForm({
        plan_id: plan.id,
        billing_cycle: billing_cycle,
        payment_method: method as string,
        slug: reserved_slug,
        proof: null as File | null,
    });

    React.useEffect(() => {
        setData('payment_method', method);
    }, [method]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    const handleConfirm = () => {
        if (method === 'transfer' && !showProofModal) {
            setShowProofModal(true);
            return;
        }

        post(route('tenant.subscription.process-payment', { tenant: tenant.slug }), {
            forceFormData: true,
            onFinish: () => setShowProofModal(false),
        });
    };

    return (
        <AdminLayout title="Finalizar Suscripción">
            <Head title="Checkout - Suscripción" />

            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Left Column: Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <CreditCard className="w-4 h-4" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight uppercase">Resumen de tu Orden</h2>
                        </div>

                        <Card className="p-8 rounded-[32px] border-none shadow-xl shadow-slate-200/50 overflow-hidden relative bg-white">
                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-start border-b border-slate-50 pb-6">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Plan Seleccionado</span>
                                        <h3 className="text-2xl font-black uppercase text-slate-900">{plan.name}</h3>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Ciclo {billing_cycle === 'monthly' ? 'Mensual' : 'Anual'}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-slate-900">
                                            {formatCurrency(billing_cycle === 'monthly' ? plan.monthly_price : plan.yearly_price)}
                                        </div>
                                    </div>
                                </div>

                                {reserved_slug && (
                                    <div className="flex items-center justify-between py-4 px-5 rounded-2xl bg-amber-50 border border-amber-100">
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-5 h-5 text-amber-600" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-amber-700 tracking-tighter">Tu URL Personalizada</span>
                                                <span className="text-sm font-bold text-amber-900">linkiu.bio/{reserved_slug}</span>
                                            </div>
                                        </div>
                                        <CheckCircle2 className="w-5 h-5 text-amber-500" />
                                    </div>
                                )}

                                <div className="space-y-4 pt-2">
                                    <div className="flex justify-between text-sm font-bold text-slate-500">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(amount + (proration_credit || 0))}</span>
                                    </div>

                                    {proration_credit && proration_credit > 0 && (
                                        <div className="flex justify-between text-sm font-bold text-green-600">
                                            <span>Crédito por plan anterior (Prorrateo)</span>
                                            <span>-{formatCurrency(proration_credit)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-4 border-t-2 border-slate-900 border-dashed">
                                        <span className="text-lg font-black uppercase">Total a Pagar</span>
                                        <div className="flex flex-col items-end">
                                            <span className="text-3xl font-black text-primary">{formatCurrency(amount)}</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IVA Incluido</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="space-y-4">
                            <Button
                                onClick={handleConfirm}
                                disabled={processing}
                                className="w-full h-16 rounded-[24px] bg-primary hover:bg-primary/90 text-white font-black text-xl uppercase tracking-widest shadow-xl shadow-primary/20 group"
                            >
                                {processing ? 'Procesando...' : method === 'wompi' ? 'Pagar con Wompi' : 'Confirmar Transferencia'}
                                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            {/* Security Badge */}
                            <div className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500">
                                <ShieldCheck className="w-5 h-5 text-green-500" />
                                <span className="text-xs font-bold uppercase tracking-tight">Transacción 100% Segura con encriptación SSL</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment Methods */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-black tracking-tight uppercase">Métodos de Pago</h2>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    setMethod('wompi');
                                    setData('payment_method', 'wompi');
                                }}
                                className={cn(
                                    "w-full p-4 bg-white rounded-[24px] border-2 text-left transition-all relative group overflow-hidden",
                                    method === 'wompi' ? "border-primary shadow-lg shadow-primary/5" : "border-slate-100 hover:border-slate-200"
                                )}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                                        method === 'wompi' ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                                    )}>
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black text-slate-900 uppercase tracking-tight text-sm">Wompi</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Tarjetas, PSE, Nequi</span>
                                    </div>
                                </div>
                                {method === 'wompi' && (
                                    <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                    </div>
                                )}
                            </button>

                            <button
                                onClick={() => {
                                    setMethod('transfer');
                                    setData('payment_method', 'transfer');
                                }}
                                className={cn(
                                    "w-full p-4 bg-white rounded-[24px] border-2 text-left transition-all relative group overflow-hidden",
                                    method === 'transfer' ? "border-primary shadow-lg shadow-primary/5" : "border-slate-100 hover:border-slate-200"
                                )}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                                        method === 'transfer' ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                                    )}>
                                        <Banknote className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black text-slate-900 uppercase tracking-tight text-sm">Transferencia</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Directa a Banco</span>
                                    </div>
                                </div>
                                {method === 'transfer' && (
                                    <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Payment Details / Bank Details */}
                        {method === 'transfer' && bank_details ? (
                            <Card className="p-4 bg-white rounded-[24px] border text-slate-900 space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                                        <Banknote className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-black">Datos de Pago</h3>
                                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Transferencia Directa</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex flex-col gap-1 border-b border-white/10 pb-2">
                                        <span className="text-[9px] font-black uppercase text-slate-500">Banco</span>
                                        <span className="text-sm font-black">{bank_details.bank_name}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 border-b border-white/10 pb-2">
                                        <span className="text-[9px] font-black uppercase text-slate-500">Tipo de Cuenta</span>
                                        <span className="text-sm font-black">{bank_details.account_type}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 border-b border-white/10 pb-2 relative group">
                                        <span className="text-[9px] font-black uppercase text-slate-500">Número de Cuenta</span>
                                        <span className="text-sm font-black">{bank_details.account_number}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 border-b border-white/10 pb-2">
                                        <span className="text-[9px] font-black uppercase text-slate-500">Titular</span>
                                        <span className="text-sm font-black">{bank_details.account_holder}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 pb-1">
                                        <span className="text-[9px] font-black uppercase text-slate-500">NIT / Documento</span>
                                        <span className="text-sm font-black">{bank_details.nit}</span>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                                    <p className="text-[10px] font-bold text-slate-400">
                                        Reporta tu pago en la sección de facturas o vía soporte para activación inmediata.
                                    </p>
                                </div>
                            </Card>
                        ) : (
                            <div className="p-8 rounded-[32px] bg-white border border-slate-100 text-slate-900 space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-lg font-black uppercase leading-tight">¿Listo para activar tu marca?</h4>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                        Serás redirigido a la pasarela segura de **Wompi** para finalizar tu pago inmediatamente.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 justify-center text-[10px] font-black text-slate-500 uppercase tracking-widest border-t border-white/10 pt-4">
                                    <Info className="w-3 h-3 text-primary" />
                                    Pago seguro encriptado
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Receipt Upload Modal */}
            <Dialog open={showProofModal} onOpenChange={setShowProofModal}>
                <DialogContent className="max-w-md rounded-lg p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="pt-8 pb-0">
                        <DialogTitle className="text-2xl font-black text-center">
                            Confirmar Transferencia
                        </DialogTitle>
                    </DialogHeader>

                    <div className="px-8 space-y-6">
                        <div className="space-y-4 pt-0">
                            <p className="text-xs font-medium text-slate-600">
                                "Sube una captura de pantalla o el PDF de tu transferencia para activar tu plan **{plan.name}**."
                            </p>

                            <div className="relative group">
                                <input
                                    type="file"
                                    onChange={e => setData('proof', e.target.files?.[0] || null)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    accept="image/*,application/pdf"
                                />
                                <div className={cn(
                                    "p-10 rounded-[28px] border-2 border-dashed transition-all flex flex-col items-center gap-4 bg-slate-50 text-center",
                                    data.proof ? "border-primary bg-primary/5" : "border-slate-100 group-hover:border-slate-200"
                                )}>
                                    {data.proof ? (
                                        <>
                                            <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg animate-in zoom-in">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="block font-black text-slate-900 uppercase text-xs truncate max-w-[200px]">
                                                    {data.proof.name}
                                                </span>
                                                <span className="text-[10px] font-bold text-primary uppercase">¡Comprobante Listo!</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                                                <UploadCloud className="w-8 h-8" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-black text-slate-900 uppercase text-xs tracking-tight">Seleccionar Comprobante</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">PNG, JPG o PDF hasta 4MB</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={handleConfirm}
                                disabled={processing || !data.proof}
                                className="w-full h-10 hover:bg-primary/90 text-white font-black text-sm uppercase shadow-xl shadow-primary/20 group"
                            >
                                {processing ? 'Procesando...' : 'Finalizar y Notificar'}
                                <CheckCircle2 className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={() => setShowProofModal(false)}
                                disabled={processing}
                                className="w-full h-10 font-bold uppercase text-[10px] tracking-widest"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 flex items-center justify-center gap-2 border-t border-slate-100">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        <span className="text-[10px] font-black text-slate-400 tracking-widest">Pago Protegido con Linkiu Pay</span>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
