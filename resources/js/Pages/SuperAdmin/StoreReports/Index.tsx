import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { AlertCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Pagination from '@/Components/Shared/Pagination';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

interface Report {
    id: number;
    tenant_id: number;
    tenant: { id: number; name: string; slug: string } | null;
    category: string;
    category_label: string;
    message: string;
    message_preview: string;
    reporter_email: string | null;
    reporter_whatsapp: string | null;
    image_path: string | null;
    image_url: string | null;
    url_context: string | null;
    status: string;
    status_label: string;
    created_at: string;
}

interface Props {
    reports: {
        data: Report[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { status?: string; tenant_id?: string };
    statuses: Record<string, string>;
    categories: Record<string, string>;
}

export default function Index({ reports, filters, statuses }: Props) {
    const { flash } = usePage().props as { flash?: { success?: string } };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash?.success]);

    const handleStatusChange = (reportId: number, status: string) => {
        router.patch(route('superadmin.store-reports.update-status', reportId), { status }, {
            preserveScroll: true,
        });
    };

    return (
        <SuperAdminLayout header="Reportes tiendas">
            <Head title="Reportes tiendas" />

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="size-5" />
                            Reportes de problemas con negocios
                        </CardTitle>
                        <CardDescription>
                            Reportes enviados por usuarios desde las tiendas. Email y WhatsApp son opcionales (pueden ser anónimos).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-wrap gap-2">
                            <Select
                                value={filters.status ?? 'all'}
                                onValueChange={(v) =>
                                    router.get(route('superadmin.store-reports.index'), { ...filters, status: v === 'all' ? undefined : v }, { preserveState: true })
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los estados</SelectItem>
                                    {Object.entries(statuses).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tienda</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Mensaje</TableHead>
                                    <TableHead>Contacto</TableHead>
                                    <TableHead>Evidencia</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Fecha</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                            No hay reportes.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    reports.data.map((r) => (
                                        <TableRow key={r.id}>
                                            <TableCell>
                                                {r.tenant ? (
                                                    <a
                                                        href={route('tenants.show', r.tenant.id)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline flex items-center gap-1"
                                                    >
                                                        {r.tenant.name}
                                                        <ExternalLink className="size-3" />
                                                    </a>
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">{r.category_label}</span>
                                            </TableCell>
                                            <TableCell className="max-w-[200px]">
                                                <span className="text-sm line-clamp-2" title={r.message}>
                                                    {r.message_preview}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {r.reporter_email || r.reporter_whatsapp ? (
                                                    <span>
                                                        {r.reporter_email && <span>{r.reporter_email}</span>}
                                                        {r.reporter_email && r.reporter_whatsapp && ' · '}
                                                        {r.reporter_whatsapp && <span>{r.reporter_whatsapp}</span>}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">Anónimo</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {r.image_url ? (
                                                    <a
                                                        href={r.image_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline flex items-center gap-1 text-sm"
                                                    >
                                                        <ImageIcon className="size-4" />
                                                        Ver
                                                    </a>
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={r.status}
                                                    onValueChange={(v) => handleStatusChange(r.id, v)}
                                                >
                                                    <SelectTrigger className="w-[140px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(statuses).map(([key, label]) => (
                                                            <SelectItem key={key} value={key}>
                                                                {label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: es })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {reports.data.length > 0 && (
                            <Pagination links={reports.links} className="mt-4" />
                        )}
                    </CardContent>
                </Card>
            </div>
        </SuperAdminLayout>
    );
}
