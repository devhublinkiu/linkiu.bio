import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/Components/ui/empty';
import { FieldError } from '@/Components/ui/field';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Textarea } from '@/Components/ui/textarea';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Check, X, Search, Filter } from "lucide-react";
import React, { useState } from 'react';
import Pagination from '@/Components/Shared/Pagination';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PageProps } from '@/types';

interface Tenant {
    id: number;
    name: string;
    vertical?: { name: string };
    category?: { name: string };
}

interface IconRequest {
    id: number;
    tenant_id: number;
    requested_name: string;
    reference_image_path: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_feedback?: string;
    created_at: string;
    tenant?: Tenant;
}

interface Props {
    requests: {
        data: IconRequest[];
        links: any[];
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ requests, filters }: Props) {
    const { auth } = usePage<PageProps & { auth: { permissions: string[] } }>().props;
    const permissions = auth.permissions || [];

    const hasPermission = (permission: string) => {
        return permissions.includes('*') || permissions.includes(permission);
    };

    const [selectedRequest, setSelectedRequest] = useState<IconRequest | null>(null);
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    // Filters State
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('icon-requests.index'), { search, status }, {
            preserveState: true,
            replace: true
        });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get(route('icon-requests.index'), { search, status: value }, {
            preserveState: true,
            replace: true
        });
    };

    // Form for Approve
    const { data: approveData, setData: setApproveData, post: postApprove, processing: processingApprove, errors: errorsApprove, reset: resetApprove } = useForm({
        name: '',
        icon: null as File | null,
        vertical_id: '',
        is_global: false,
        admin_feedback: '',
        _method: 'PATCH',
    });

    // Form for Reject
    const { data: rejectData, setData: setRejectData, post: postReject, processing: processingReject, errors: errorsReject, reset: resetReject } = useForm({
        admin_feedback: '',
        _method: 'PATCH',
    });

    const openApprove = (req: IconRequest) => {
        setSelectedRequest(req);
        resetApprove();
        setApproveData({
            name: req.requested_name,
            icon: null,
            vertical_id: '',
            is_global: false,
            admin_feedback: '',
            _method: 'PATCH'
        });
        setIsApproveOpen(true);
    };

    const openReject = (req: IconRequest) => {
        setSelectedRequest(req);
        resetReject();
        setIsRejectOpen(true);
    };

    const submitApprove = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;

        postApprove(route('icon-requests.approve', selectedRequest.id), {
            onSuccess: () => setIsApproveOpen(false),
        });
    };

    const submitReject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;

        postReject(route('icon-requests.reject', selectedRequest.id), {
            onSuccess: () => setIsRejectOpen(false),
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">Aprobado</Badge>;
            case 'rejected': return <Badge variant="destructive">Rechazado</Badge>;
            default: return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">Pendiente</Badge>;
        }
    };

    return (
        <SuperAdminLayout header="Centro de Solicitudes">
            <Head title="Solicitudes" />

            <div className="max-w-7xl mx-auto py-6">
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar por nombre o tienda..."
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
                                        <SelectItem value="all">Todas las solicitudes</SelectItem>
                                        <SelectItem value="pending">Pendientes</SelectItem>
                                        <SelectItem value="approved">Aprobadas</SelectItem>
                                        <SelectItem value="rejected">Rechazadas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Solicitudes Recientes</CardTitle>
                        <CardDescription>Gestiona las peticiones de iconografía y otros requerimientos de los tenants.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Tienda</TableHead>
                                    <TableHead>Icono Sugerido</TableHead>
                                    <TableHead>Referencia</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.data.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell className="text-sm">
                                            {format(new Date(req.created_at), 'dd MMM yyyy', { locale: es })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm">{req.tenant?.name || 'N/A'}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                                    {req.tenant?.vertical?.name || '-'} / {req.tenant?.category?.name || '-'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-sm">{req.requested_name}</TableCell>
                                        <TableCell>
                                            <a
                                                href={`/media/${req.reference_image_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block h-10 w-10 relative rounded overflow-hidden transition-all border group"
                                            >
                                                <img
                                                    src={`/media/${req.reference_image_path}`}
                                                    alt="Referencia"
                                                    className="object-cover w-full h-full transition-transform group-hover:scale-110"
                                                />
                                            </a>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(req.status)}</TableCell>
                                        <TableCell className="text-right">
                                            {req.status === 'pending' && (
                                                <div className="flex justify-end gap-1.5">
                                                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200" onClick={() => {
                                                        if (!hasPermission('sa.categories.edit')) {
                                                            setShowPermissionModal(true);
                                                        } else {
                                                            openApprove(req);
                                                        }
                                                    }} title="Aprobar">
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => {
                                                        if (!hasPermission('sa.categories.edit')) {
                                                            setShowPermissionModal(true);
                                                        } else {
                                                            openReject(req);
                                                        }
                                                    }} title="Rechazar">
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {requests.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-[400px]">
                                            <Empty className="h-full">
                                                <EmptyHeader>
                                                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                                                        <Search className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                </EmptyHeader>
                                                <EmptyContent>
                                                    <EmptyTitle>No hay solicitudes pendientes</EmptyTitle>
                                                    <EmptyDescription>
                                                        Todo está al día. No se encontraron solicitudes que requieran atención.
                                                    </EmptyDescription>
                                                </EmptyContent>
                                            </Empty>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <div className="mt-4 flex justify-end">
                            <Pagination links={requests.links} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Approve Modal */}
            <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Aprobar Solicitud</DialogTitle>
                        <DialogDescription>
                            Confirmar la aprobación de la solicitud. El icono debe ser creado manualmente en la sección "Iconos de Categoría".
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitApprove} className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="feedback_approve">Nota para Tienda (Opcional)</Label>
                            <Textarea
                                id="feedback_approve"
                                value={approveData.admin_feedback}
                                onChange={(e) => setApproveData('admin_feedback', e.target.value)}
                                placeholder="Ej: Icono 'Zapatos' creado y disponible globalmente."
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsApproveOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={processingApprove}>Aprobar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Reject Modal */}
            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rechazar Solicitud</DialogTitle>
                        <DialogDescription>
                            Por favor indica la razón del rechazo para informar a la tienda.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitReject} className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="feedback_reject">Motivo del Rechazo</Label>
                            <Textarea
                                id="feedback_reject"
                                value={rejectData.admin_feedback}
                                onChange={(e) => setRejectData('admin_feedback', e.target.value)}
                                required
                            />
                            <FieldError>{errorsReject.admin_feedback}</FieldError>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsRejectOpen(false)}>Cancelar</Button>
                            <Button type="submit" variant="destructive" disabled={processingReject}>Rechazar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />
        </SuperAdminLayout>
    );
}
