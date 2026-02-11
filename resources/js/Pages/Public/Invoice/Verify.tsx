import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, XCircle, ShieldCheck, Globe, Calendar, CreditCard, ArrowLeft } from 'lucide-react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
    isValid: boolean;
    invoice?: any;
    tenant?: any;
    plan?: any;
    status?: string;
    message?: string;
}

export default function Verify({ isValid, invoice, tenant, plan, status, message }: Props) {
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
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans select-none">
            <Head title="Verificación de Comprobante - Linkiu.bio" />

            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                {/* Logo Branding */}
                <div className="flex flex-col items-center gap-2 mb-4">
                    <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900 leading-none">LINKIU.BIO</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Verification Service</p>
                </div>

                <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden bg-white p-8 sm:p-12 text-center relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0" />

                    <div className="relative z-10 space-y-8">
                        {isValid ? (
                            <>
                                <div className="flex justify-center">
                                    <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                                        <CheckCircle2 className="w-16 h-16" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Comprobante Válido</h2>
                                    <Badge className="bg-green-500 text-white font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest border-none">
                                        Estado: {status === 'paid' ? 'Pagado y Activo' : 'En Procesamiento'}
                                    </Badge>
                                </div>

                                <div className="space-y-6 pt-6 border-t border-slate-100">
                                    <div className="grid grid-cols-2 gap-4 text-left">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                                                <Globe className="w-3 h-3" /> Marca
                                            </span>
                                            <p className="text-sm font-black text-slate-900">{tenant.name}</p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center justify-end gap-1">
                                                <CreditCard className="w-3 h-3" /> Factura
                                            </span>
                                            <p className="text-sm font-black text-slate-900">#INV-{invoice.id}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                                                <ShieldCheck className="w-3 h-3" /> Plan
                                            </span>
                                            <p className="text-sm font-black text-slate-900 uppercase">Plan {plan.name}</p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center justify-end gap-1">
                                                <Calendar className="w-3 h-3" /> Fecha
                                            </span>
                                            <p className="text-sm font-black text-slate-900">{formatDate(invoice.paid_at || invoice.created_at)}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center gap-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Total Transacción</span>
                                        <div className="text-4xl font-black text-primary tracking-tighter">
                                            {formatAmount(invoice.amount)}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-center">
                                    <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center text-red-600">
                                        <XCircle className="w-16 h-16" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Error de Validación</h3>
                                    <p className="text-slate-500 font-bold text-sm leading-relaxed">
                                        {message || "El comprobante que intentas verificar no es válido o ha expirado."}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </Card>

                {/* Footer Security */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic opacity-50">Verified by Linkiu Pay Secure Systems</span>
                    </div>
                    <Button variant="ghost" asChild className="font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-primary gap-2">
                        <Link href="/">
                            <ArrowLeft className="w-4 h-4" />
                            Volver a Linkiu.bio
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-amber-500/50 to-primary/50" />
        </div>
    );
}
