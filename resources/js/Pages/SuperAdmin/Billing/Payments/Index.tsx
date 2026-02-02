import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { CheckCircle, XCircle, FileText, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Invoice {
    id: number;
    amount: string;
    status: string;
    created_at: string;
    proof_of_payment_path: string | null;
    admin_notes: string | null;
    tenant: {
        name: string;
        id: string;
    };
    subscription: {
        plan: {
            name: string;
        };
    };
}

interface Props {
    payments: {
        data: Invoice[];
        links: any[];
    };
}

export default function Index({ payments }: Props) {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);
    const { data, setData, put, processing, errors, reset } = useForm({
        action: '',
        notes: '',
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = (invoice: Invoice, actionType: 'approve' | 'reject') => {
        setSelectedInvoice(invoice);
        setAction(actionType);
        setData({ action: actionType, notes: '' });
        setIsDialogOpen(true);
    };

    const submitAction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInvoice) return;

        put(route('payments.update', selectedInvoice.id), {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
                setSelectedInvoice(null);
                setAction(null);
            }
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge className="bg-green-500 hover:bg-green-600">Pagado</Badge>;
            case 'pending_review':
                return <Badge className="bg-yellow-500 hover:bg-yellow-600">Revisión</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rechazado</Badge>;
            case 'pending':
                return <Badge variant="outline">Pendiente</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <SuperAdminLayout
            header="Gestión de Pagos"
        >
            <Head title="Pagos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pagos Pendientes</CardTitle>
                            <CardDescription>Revisa y aprueba los reportes de pago de los planes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Plan</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead>Comprobante</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.data.length > 0 ? (
                                        payments.data.map((invoice) => (
                                            <TableRow key={invoice.id}>
                                                <TableCell>{format(new Date(invoice.created_at), 'dd MMM yyyy', { locale: es })}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium text-sm">{invoice.tenant?.name}</div>
                                                </TableCell>
                                                <TableCell>{invoice.subscription?.plan?.name}</TableCell>
                                                <TableCell>${Number(invoice.amount).toLocaleString()}</TableCell>
                                                <TableCell>
                                                    {invoice.proof_of_payment_path ? (
                                                        <a
                                                            href={route('media.proxy', { path: invoice.proof_of_payment_path })}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center text-blue-600 hover:underline"
                                                        >
                                                            <FileText className="w-4 h-4 mr-1" />
                                                            Ver
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    {invoice.status === 'pending_review' && (
                                                        <div className="flex justify-end gap-2">
                                                            <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 h-8" onClick={() => openDialog(invoice, 'approve')}>
                                                                <CheckCircle className="w-4 h-4" />
                                                            </Button>
                                                            <Button size="sm" variant="destructive" className="h-8" onClick={() => openDialog(invoice, 'reject')}>
                                                                <XCircle className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                No hay pagos pendientes de revisión.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{action === 'approve' ? 'Aprobar Pago' : 'Rechazar Pago'}</DialogTitle>
                        <DialogDescription>
                            {action === 'approve'
                                ? 'Al aprobar, la suscripción se extenderá automáticamente. ¿Confirmas que recibiste el dinero?'
                                : 'Indica la razón del rechazo para que el cliente pueda corregirlo.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitAction} className="space-y-4">
                        {action === 'reject' && (
                            <div className="space-y-2">
                                <Label>Motivo del rechazo</Label>
                                <Textarea
                                    placeholder="Ej: No se ve el número de transferencia..."
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        {action === 'approve' && (
                            <div className="space-y-2">
                                <Label>Notas internas (opcional)</Label>
                                <Textarea
                                    placeholder="Ej: Aprobado por Whatsapp..."
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                />
                            </div>
                        )}
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                variant={action === 'approve' ? 'default' : 'destructive'}
                                className={action === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                                {processing ? 'Procesando...' : (action === 'approve' ? 'Aprobar Pago' : 'Rechazar Pago')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </SuperAdminLayout>
    );
}
