import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface Props {
    invoice: any;
    tenant: any;
    plan: any;
}

export const ReceiptTicket = React.forwardRef<HTMLDivElement, Props>(({ invoice, tenant, plan }, ref) => {
    // Use production domain for QR code to ensure it works when scanned
    const baseUrl = window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')
        ? 'https://linkiu.bio'
        : window.location.origin;
    const verifyUrl = `${baseUrl}/verificar/${invoice.id}`;
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div
            ref={ref}
            className="w-[400px] bg-white p-8 rounded-[20px] shadow-2xl relative overflow-hidden font-sans border border-slate-100"
            style={{ minHeight: '600px' }}
        >
            {/* Top Branding */}
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tighter uppercase text-slate-900 leading-none">LINKIU.BIO</h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Comprobante de Pago</p>
                </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center mb-8">
                <div className="px-6 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Pago Aprobado</span>
                </div>
            </div>

            {/* The "Tear-off" Visual */}
            <div className="relative py-4 mb-4">
                <div className="absolute left-[-40px] right-[-40px] border-t border-dashed border-slate-200" />
                <div className="absolute left-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-200 shadow-inner" />
                <div className="absolute right-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-200 shadow-inner" />
            </div>

            {/* Ticket Content */}
            <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Factura</span>
                        <p className="text-sm font-bold text-slate-900">#INV-{invoice.id}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Fecha</span>
                        <p className="text-sm font-bold text-slate-900">{formatDate(invoice.paid_at || invoice.created_at)}</p>
                    </div>
                </div>

                <div className="space-y-1 border-t border-slate-100 pt-4">
                    <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Cliente</span>
                    <p className="text-sm font-bold text-slate-900">{tenant.name}</p>
                    <p className="text-xs font-bold text-primary underline">linkiu.bio/{tenant.slug}</p>
                </div>

                <div className="space-y-1 border-t border-slate-100 pt-4">
                    <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Concepto</span>
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-slate-900 uppercase">Plan {plan.name}</p>
                        <p className="text-sm font-bold text-slate-900">{formatAmount(invoice.amount)}</p>
                    </div>
                    <p className="text-xs font-bold text-slate-400 pt-4">
                        Suscripción activa hasta: {formatDate(
                            invoice.subscription?.ends_at ||
                            tenant.latest_subscription?.ends_at ||
                            tenant.latestSubscription?.ends_at ||
                            invoice.subscription?.trial_ends_at ||
                            tenant.latest_subscription?.trial_ends_at ||
                            tenant.latestSubscription?.trial_ends_at ||
                            new Date().toISOString()
                        )}
                    </p>
                </div>

                {/* The "Tear-off" Visual */}
                <div className="relative py-4">
                    <div className="absolute left-[-40px] right-[-40px] border-t border-dashed border-slate-200" />
                    <div className="absolute left-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-200 shadow-inner" />
                    <div className="absolute right-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-200 shadow-inner" />
                </div>

                {/* Total Section */}
                <div className="space-y-4 text-center pt-2">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Total Pagado</span>
                        <div className="text-5xl font-bold text-primary tracking-tighter">
                            {formatAmount(invoice.amount)}
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <div className="p-1 bg-white rounded-lg border border-slate-900 shadow-sm">
                            <QRCodeCanvas
                                value={verifyUrl}
                                size={56}
                                level="M"
                                includeMargin={false}
                            />
                        </div>
                        <div className="text-left py-1">
                            <p className="text-[8px] font-bold uppercase text-slate-400 leading-none">Verificado por</p>
                            <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tighter">Linkiu Pay Secure</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center space-y-2 pb-2">
                <div className="flex items-center justify-center gap-2 text-green-500">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Transacción Protegida</span>
                </div>
                <p className="text-[8px] font-bold text-slate-300 uppercase leading-relaxed max-w-[200px] mx-auto italic">
                    Este documento es un comprobante válido de suscripción a los servicios de Linkiu.bio
                </p>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -z-0" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -z-0" />
        </div>
    );
});

ReceiptTicket.displayName = 'ReceiptTicket';
