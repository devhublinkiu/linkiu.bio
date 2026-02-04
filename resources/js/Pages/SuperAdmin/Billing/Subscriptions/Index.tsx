import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Search, Filter, Calendar, CreditCard } from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/Components/Shared/Pagination';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/Components/ui/empty';

// Interfaces
interface Subscription {
    id: number;
    status: string;
    billing_cycle: string;
    starts_at: string;
    ends_at: string;
    next_payment_date: string;
    tenant?: { id: number; name?: string }; // Assuming tenant has a name, otherwise fallback to ID
    plan?: { name: string; monthly_price: number; currency: string };
}

interface Props {
    subscriptions: {
        data: Subscription[];
        links: any[];
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ subscriptions, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('subscriptions.index'), { search, status }, { preserveState: true });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get(route('subscriptions.index'), { search, status: value }, { preserveState: true });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <Badge className="bg-green-600">Activa</Badge>;
            case 'trialing': return <Badge variant="secondary" className="bg-blue-100 text-blue-700">En Prueba</Badge>;
            case 'past_due': return <Badge variant="destructive">En Mora</Badge>;
            case 'cancelled': return <Badge variant="outline" className="text-gray-500">Cancelada</Badge>;
            case 'expired': return <Badge variant="outline" className="text-gray-500">Expirada</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <SuperAdminLayout header="Gestión de Suscripciones">
            <Head title="Suscripciones" />

            <div className="space-y-6">
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar por ID de cliente o tienda..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </form>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Estado:</Label>
                                <Select value={status} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filtrar estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas las suscripciones</SelectItem>
                                        <SelectItem value="active">Activas</SelectItem>
                                        <SelectItem value="trialing">En Prueba</SelectItem>
                                        <SelectItem value="past_due">En Mora</SelectItem>
                                        <SelectItem value="cancelled">Canceladas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Suscripciones</CardTitle>
                        <CardDescription>Visualiza el estado de las suscripciones de tus clientes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID Suscripción</TableHead>
                                    <TableHead>Tienda</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Ciclo</TableHead>
                                    <TableHead>Próximo Pago</TableHead>
                                    {/* <TableHead className="text-right">Acciones</TableHead> */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscriptions.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-[400px]">
                                            <Empty className="h-full">
                                                <EmptyHeader>
                                                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                                                        <CreditCard className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                </EmptyHeader>
                                                <EmptyContent>
                                                    <EmptyTitle>No hay suscripciones</EmptyTitle>
                                                    <EmptyDescription>
                                                        Aún no se han registrado suscripciones activas en el sistema.
                                                    </EmptyDescription>
                                                </EmptyContent>
                                            </Empty>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    subscriptions.data.map((sub) => (
                                        <TableRow key={sub.id}>
                                            <TableCell className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                                                #{sub.id}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {sub.tenant?.name || `Tienda #${sub.tenant?.id}`}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{sub.plan?.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: sub.plan?.currency || 'COP' }).format(sub.plan?.monthly_price || 0)}/mes
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(sub.status)}</TableCell>
                                            <TableCell className="capitalize">
                                                {sub.billing_cycle === 'monthly' ? 'Mensual' :
                                                    sub.billing_cycle === 'yearly' ? 'Anual' :
                                                        sub.billing_cycle === 'quarterly' ? 'Trimestral' :
                                                            sub.billing_cycle === 'weekly' ? 'Semanal' :
                                                                sub.billing_cycle === 'daily' ? 'Diario' :
                                                                    sub.billing_cycle}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="h-4 w-4" />
                                                    {sub.next_payment_date ? new Date(sub.next_payment_date).toLocaleDateString() : '-'}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <div className="mt-4 flex justify-end">
                            <Pagination links={subscriptions.links} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SuperAdminLayout>
    );
}
