import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { CreditCard, Upload, CheckCircle, Clock, AlertCircle, Eye, Banknote } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PaymentUploadModal from '@/Components/Tenant/Admin/PaymentUploadModal';

interface Invoice {
    id: number;
    amount: string;
    status: string;
    due_date: string;
    created_at: string;
    proof_of_payment_path: string | null;
    subscription: {
        plan: {
            name: string;
        }
    };
    tenant_slug?: string;
}

interface Props {
    invoices: Invoice[];
    bankDetails: {
        bank_name: string;
        bank_account_type: string;
        bank_account_number: string;
        bank_account_holder: string;
        bank_account_nit: string;
    } | null;
}

export default function Index({ invoices, bankDetails }: Props) {
    const { auth, currentTenant } = usePage<any>().props;
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const handleUploadClick = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsUploadOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" /> Pagado</Badge>;
            case 'pending_review':
                return <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100"><Clock className="w-3 h-3 mr-1" /> En Revisión</Badge>;
            case 'pending':
                return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100"><AlertCircle className="w-3 h-3 mr-1" /> Pendiente</Badge>;
            case 'overdue':
                return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100"><AlertCircle className="w-3 h-3 mr-1" /> Vencida</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <AdminLayout>
            <Head title="Facturación" />

            <div className="space-y-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight text-slate-900">Facturación</h2>
                        <p className="text-slate-500 font-medium mt-1 uppercase text-xs tracking-widest">Historial de pagos y suscripción</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Bank Details Card */}
                    <Card className="md:col-span-1 shadow-sm border-slate-200">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                <Banknote className="w-5 h-5 text-primary" />
                                Datos Bancarios
                            </CardTitle>
                            <CardDescription className="font-medium">Realiza tu pago vía transferencia.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {bankDetails ? (
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between border-b border-slate-50 pb-2">
                                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Banco</span>
                                        <span className="font-bold text-slate-700">{bankDetails.bank_name}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-50 pb-2">
                                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Tipo</span>
                                        <span className="font-bold text-slate-700">{bankDetails.bank_account_type}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-50 pb-2">
                                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Número</span>
                                        <span className="font-mono font-bold text-slate-700">{bankDetails.bank_account_number}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">NIT</span>
                                        <span className="font-bold text-slate-700">{bankDetails.bank_account_nit}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-slate-400 text-sm italic font-medium">
                                    No hay datos bancarios configurados.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Active Plan Summary */}
                    <Card className="md:col-span-2 bg-slate-900 text-white shadow-xl shadow-slate-200 border-none relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <CreditCard className="w-32 h-32" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-slate-400 uppercase text-[10px] tracking-widest font-black">Tu Suscripción</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-8">
                            <div className="flex items-end gap-3 mb-4">
                                <div className="text-5xl font-black tracking-tighter">Activa</div>
                                <Badge className="mb-2 bg-primary text-white hover:bg-primary/90">Premium</Badge>
                            </div>
                            <p className="text-slate-400 text-sm max-w-md font-medium">
                                Tu servicio está funcionando correctamente. Puedes ver tus comprobantes reportados en la tabla inferior o reportar uno nuevo.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Invoices List */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6 mb-2">
                        <div>
                            <CardTitle className="font-black text-xl">Historial de Facturas</CardTitle>
                            <CardDescription className="font-medium">Listado detallado de tus cobros y pagos.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400 pl-6">Fecha</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Concepto</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Valor</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Estado</TableHead>
                                    <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest text-slate-400 pr-6">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.length > 0 ? (
                                    invoices.map((invoice) => (
                                        <TableRow key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="pl-6 font-bold text-slate-700">{format(new Date(invoice.created_at), 'dd MMM, yyyy', { locale: es })}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900">Plan {invoice.subscription?.plan?.name || 'Suscripción'}</span>
                                                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Factura #{invoice.id}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-black text-slate-900">${Number(invoice.amount).toLocaleString()}</TableCell>
                                            <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" asChild className="h-8">
                                                        <Link href={route('tenant.invoices.show', { tenant: currentTenant?.slug || 'admin', invoice: invoice.id })}>
                                                            <Eye className="w-4 h-4 mr-1" /> Ver Detalle
                                                        </Link>
                                                    </Button>

                                                    {invoice.status === 'pending' && (
                                                        <Button size="sm" className="h-8 shadow-sm" onClick={() => handleUploadClick(invoice)}>
                                                            <Upload className="w-4 h-4 mr-1" /> Subir Pago
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-slate-400 font-medium italic">
                                            No tienes facturas generadas aún.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {selectedInvoice && (
                <PaymentUploadModal
                    isOpen={isUploadOpen}
                    onClose={() => {
                        setIsUploadOpen(false);
                        setSelectedInvoice(null);
                    }}
                    invoice={selectedInvoice}
                />
            )}
        </AdminLayout>
    );
}
