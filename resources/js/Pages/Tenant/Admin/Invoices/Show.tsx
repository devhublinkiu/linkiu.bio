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
                return <Badge className="cursor-pointer ring-0 hover:ring-0 focus:ring-0"><CheckCircle2 className="w-3 h-3 mr-1" /> Pagada</Badge>;
            case 'pending_review':
                return <Badge variant="secondary" className="cursor-pointer ring-0 hover:ring-0 focus:ring-0"><Clock className="w-3 h-3 mr-1" /> En Revisión</Badge>;
            case 'pending':
                return <Badge variant="outline" className="cursor-pointer ring-0 hover:ring-0 focus:ring-0 text-amber-600 border-amber-200"><AlertCircle className="w-3 h-3 mr-1" /> Pendiente</Badge>;
            case 'overdue':
                return <Badge variant="destructive" className="cursor-pointer ring-0 hover:ring-0 focus:ring-0"><AlertCircle className="w-3 h-3 mr-1" /> Vencida</Badge>;
            default:
                return <Badge variant="outline" className="cursor-pointer ring-0 hover:ring-0 focus:ring-0">{status}</Badge>;
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
                    <Button variant="ghost" asChild className="pl-0 cursor-pointer ring-0 hover:ring-0 focus:ring-0">
                        <Link href={route('tenant.invoices.index', { tenant: currentTenant?.slug })}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver a Facturas
                        </Link>
                    </Button>
                    <div className="flex gap-2">
                        <Button onClick={() => window.print()} className="cursor-pointer ring-0 hover:ring-0 focus:ring-0">
                            <Printer className="w-4 h-4 mr-2" />
                            Imprimir
                        </Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Invoice Receipt */}
                    <Card className="md:col-span-2 shadow-lg overflow-hidden border">
                        <div className="h-2 bg-primary" />
                        <CardHeader className="bg-muted/30 border-b pb-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-2xl font-black text-primary tracking-tighter mb-1 uppercase">LINKIU.BIO</div>
                                    <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Recibo de Servicio</div>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-lg font-bold">Factura #{invoice.id}</h2>
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
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Fecha de Emisión</p>
                                    <p className="text-sm font-bold">{formatDate(invoice.created_at)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Fecha de Vencimiento</p>
                                    <p className="text-sm font-bold">{formatDate(invoice.due_date)}</p>
                                </div>
                            </div>

                            {/* Line Items */}
                            <div className="space-y-4">
                                <div className="border-b pb-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Concepto</p>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <div>
                                        <p className="font-bold">Plan {invoice.subscription?.plan?.name || 'Suscripción'}</p>
                                        <p className="text-xs text-muted-foreground">Ciclo de facturación: {invoice.subscription?.billing_cycle}</p>
                                    </div>
                                    <p className="font-bold">{formatAmount(invoice.amount)}</p>
                                </div>

                                <div className="pt-8 border-t">
                                    <div className="flex justify-between items-center">
                                        <p className="text-lg font-black">TOTAL</p>
                                        <p className="text-2xl font-black text-primary">{formatAmount(invoice.amount)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Rejection Note */}
                            {invoice.admin_notes && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mt-6">
                                    <p className="text-[10px] font-black text-destructive uppercase tracking-widest mb-1">Nota del Administrador</p>
                                    <p className="text-sm text-destructive italic">{invoice.admin_notes}</p>
                                </div>
                            )}
                        </CardContent>
                        <div className="p-6 bg-muted/30 border-t">
                            <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest">
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
                                    <Button className="w-full shadow-lg cursor-pointer ring-0 hover:ring-0 focus:ring-0" onClick={() => setIsUploadModalOpen(true)}>
                                        Enviar Comprobante
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Banknote className="w-4 h-4 text-muted-foreground" />
                                    Datos de Transferencia
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Banco</p>
                                    <p className="text-sm font-bold">{bankDetails.bank_name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tipo de Cuenta</p>
                                    <p className="text-sm font-bold">{bankDetails.bank_account_type}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Número de Cuenta</p>
                                    <p className="text-sm font-bold">{bankDetails.bank_account_number}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Titular</p>
                                    <p className="text-sm font-bold">{bankDetails.bank_account_holder}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">NIT/Cédula</p>
                                    <p className="text-sm font-bold">{bankDetails.bank_account_nit}</p>
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
