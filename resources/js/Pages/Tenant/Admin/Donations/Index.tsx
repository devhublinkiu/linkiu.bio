import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from '@/Components/ui/empty';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Banknote, CheckCircle2, ExternalLink, Loader2 } from 'lucide-react';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import SharedPagination from '@/Components/Shared/Pagination';

interface BankAccountRef {
    id: number;
    bank_name: string;
    account_number: string;
}

interface Donation {
    id: number;
    donor_name: string;
    donor_phone: string;
    amount: string;
    currency: string;
    status: string;
    proof_path: string | null;
    proof_url: string | null;
    created_at: string;
    bank_account: BankAccountRef | null;
}

interface Props {
    donations: {
        data: Donation[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
    statusLabels: Record<string, string>;
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 border-amber-300',
    confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
};

export default function Index({ donations, statusLabels }: Props) {
    const { currentTenant, currentUserRole } = usePage<PageProps>().props;
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [confirmingId, setConfirmingId] = useState<number | null>(null);

    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const currentStatus = urlParams.get('status') ?? '';

    const hasPermission = (permission: string) => {
        if (!currentUserRole) return false;
        return currentUserRole.is_owner === true
            || currentUserRole.permissions?.includes('*') === true
            || currentUserRole.permissions?.includes(permission) === true;
    };

    const withPermission = (permission: string, fn: () => void) => {
        if (hasPermission(permission)) fn();
        else setShowPermissionModal(true);
    };

    const setStatusFilter = (status: string) => {
        const params: Record<string, string> = {};
        if (status) params.status = status;
        router.get(route('tenant.admin.donations.index', currentTenant?.slug), params, {
            preserveState: true,
        });
    };

    const confirmDonation = (d: Donation) => {
        if (d.status === 'confirmed') return;
        setConfirmingId(d.id);
        router.patch(route('tenant.admin.donations.confirm', [currentTenant?.slug, d.id]), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Donación confirmada'),
            onError: () => toast.error('No se pudo confirmar'),
            onFinish: () => setConfirmingId(null),
        });
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
    const formatAmount = (amount: string, currency: string) => {
        const n = Number(amount);
        if (!Number.isFinite(n)) return amount;
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: currency || 'COP' }).format(n);
    };

    return (
        <AdminLayout title="Donaciones">
            <Head title="Donaciones" />

            <PermissionDeniedModal open={showPermissionModal} onOpenChange={setShowPermissionModal} />

            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Donaciones</h1>
                        <p className="text-sm text-muted-foreground">
                            Ofrendas recibidas. Marca como confirmada cuando verifiques el comprobante o la consignación.
                        </p>
                    </div>
                    <Select value={currentStatus || 'all'} onValueChange={(v) => setStatusFilter(v === 'all' ? '' : v)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Todos los estados" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="pending">Pendientes</SelectItem>
                            <SelectItem value="confirmed">Confirmadas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {donations.data.length === 0 ? (
                    <Card>
                        <CardContent className="py-16">
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <Banknote className="h-5 w-5" />
                                    </EmptyMedia>
                                    <EmptyTitle>No hay donaciones</EmptyTitle>
                                    <EmptyDescription>
                                        Cuando alguien envíe una donación desde la página pública, aparecerá aquí.
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Donante</TableHead>
                                            <TableHead>Teléfono</TableHead>
                                            <TableHead>Monto</TableHead>
                                            <TableHead>Cuenta</TableHead>
                                            <TableHead>Comprobante</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {donations.data.map((d) => (
                                            <TableRow key={d.id}>
                                                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                                                    {formatDate(d.created_at)}
                                                </TableCell>
                                                <TableCell className="font-medium">{d.donor_name}</TableCell>
                                                <TableCell className="text-sm">{d.donor_phone}</TableCell>
                                                <TableCell className="font-medium">
                                                    {formatAmount(d.amount, d.currency)}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {d.bank_account
                                                        ? `${d.bank_account.bank_name} · ${d.bank_account.account_number}`
                                                        : '—'}
                                                </TableCell>
                                                <TableCell>
                                                    {d.proof_url ? (
                                                        <a
                                                            href={d.proof_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                                        >
                                                            <ExternalLink className="size-3.5" />
                                                            Ver
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={STATUS_COLORS[d.status] ?? ''}>
                                                        {statusLabels[d.status] ?? d.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {d.status === 'pending' && (
                                                        <Button
                                                            size="sm"
                                                            className="gap-1"
                                                            onClick={() => withPermission('donations.update', () => confirmDonation(d))}
                                                            disabled={confirmingId === d.id}
                                                        >
                                                            {confirmingId === d.id ? (
                                                                <Loader2 className="size-4 animate-spin" />
                                                            ) : (
                                                                <CheckCircle2 className="size-4" />
                                                            )}
                                                            Confirmar
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {donations.last_page > 1 && (
                            <SharedPagination links={donations.links} />
                        )}
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
