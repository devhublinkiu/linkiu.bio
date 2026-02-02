import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import {
    Download,
    Printer,
    ArrowLeft,
    CreditCard,
    Banknote,
    Calendar,
    AlertCircle,
    CheckCircle2,
    Clock,
    Upload
} from 'lucide-react';
import { useState } from 'react';
import PaymentUploadModal from '@/Components/Tenant/Admin/PaymentUploadModal';

interface Props {
    invoice: any;
    bankDetails: any;
}

export default function Show({ invoice, bankDetails }: Props) {
    const { auth, currentTenant } = usePage<any>().props;
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100"><CheckCircle2 className="w-3 h-3 mr-1" /> Pagada</Badge>;
            case 'pending_review':
                return <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100"><Clock className="w-3 h-3 mr-1" /> En Revisión</Badge>;
            case 'pending':
                return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100"><AlertCircle className="w-3 h-3 mr-1" /> Pendiente</Badge>;
            case 'overdue':
                return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100"><AlertCircle className="w-3 h-3 mr-1" /> Vencida</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

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
        <AdminLayout>
            <Head title={`Factura #${invoice.id}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild className="pl-0">
                        <Link href={route('tenant.invoices.index', { tenant: currentTenant?.slug || 'admin' })}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver a Facturas
                        </Link>
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => window.print()}>
                            <Printer className="w-4 h-4 mr-2" />
                            Imprimir
                        </Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Invoice Receipt */}
                    <Card className="md:col-span-2 shadow-lg border-slate-200 overflow-hidden">
                        <div className="h-2 bg-primary" />
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-2xl font-black text-primary tracking-tighter mb-1">LINKIU.BIO</div>
                                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">Recibo de Servicio</div>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-lg font-bold text-slate-900">Factura #{invoice.id}</h2>
                                    <div className="flex flex-col items-end gap-1 mt-1">
                                        {getStatusBadge(invoice.status)}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            {/* Dates & Billing */}
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha de Emisión</p>
                                    <p className="text-sm font-bold text-slate-700">{formatDate(invoice.created_at)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha de Vencimiento</p>
                                    <p className="text-sm font-bold text-slate-700">{formatDate(invoice.due_date)}</p>
                                </div>
                            </div>

                            {/* Line Items */}
                            <div className="space-y-4">
                                <div className="border-b border-slate-100 pb-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Concepto</p>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <div>
                                        <p className="font-bold text-slate-900">Plan {invoice.subscription?.plan?.name || 'Suscripción'}</p>
                                        <p className="text-xs text-slate-500">Ciclo de facturación: {invoice.subscription?.billing_cycle}</p>
                                    </div>
                                    <p className="font-bold text-slate-900">{formatAmount(invoice.amount)}</p>
                                </div>

                                <div className="pt-8 border-t border-slate-200">
                                    <div className="flex justify-between items-center">
                                        <p className="text-lg font-black text-slate-900">TOTAL</p>
                                        <p className="text-2xl font-black text-primary">{formatAmount(invoice.amount)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Rejection Note */}
                            {invoice.admin_notes && (
                                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mt-6">
                                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Nota del Administrador</p>
                                    <p className="text-sm text-red-700 italic">{invoice.admin_notes}</p>
                                </div>
                            )}
                        </CardContent>
                        <div className="p-6 bg-slate-50 border-t border-slate-100">
                            <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">
                                Gracias por confiar en Linkiu.bio
                            </p>
                        </div>
                    </Card>

                    {/* Action Sidebar */}
                    <div className="space-y-6">
                        {invoice.status === 'pending' && (
                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <Upload className="w-4 h-4 text-primary" />
                                        Pagar Ahora
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Sube tu comprobante de pago para activar tu servicio.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button className="w-full shadow-lg" onClick={() => setIsUploadModalOpen(true)}>
                                        Enviar Comprobante
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Banknote className="w-4 h-4 text-slate-500" />
                                    Datos de Transferencia
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Banco</p>
                                    <p className="text-sm font-bold text-slate-700">{bankDetails.bank_name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipo de Cuenta</p>
                                    <p className="text-sm font-bold text-slate-700">{bankDetails.bank_account_type}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Número de Cuenta</p>
                                    <p className="text-sm font-bold text-slate-700 font-mono">{bankDetails.bank_account_number}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Titular</p>
                                    <p className="text-sm font-bold text-slate-700">{bankDetails.bank_account_holder}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NIT/Cédula</p>
                                    <p className="text-sm font-bold text-slate-700 font-mono">{bankDetails.bank_account_nit}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <PaymentUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                invoice={invoice}
            />
        </AdminLayout>
    );
}
