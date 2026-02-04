import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Plus, Search, Store, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import Pagination from '@/Components/Shared/Pagination';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/Components/ui/input-group';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/Components/ui/empty';

// Interfaces
interface Tenant {
    id: number;
    name: string;
    slug: string;
    domain: string | null;
    doc_number?: string;
    category?: {
        name: string;
        vertical?: { name: string };
    };
    created_at: string;
}

interface Props {
    tenants: {
        data: Tenant[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function Index({ tenants, filters }: Props) {
    const { auth } = usePage<any>().props;
    const permissions = auth.permissions || [];
    const hasPermission = (p: string) => permissions.includes('*') || permissions.includes(p);
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('tenants.index'), { search }, { preserveState: true });
    };

    const handleCreateClick = (e: React.MouseEvent) => {
        if (!hasPermission('sa.tenants.create')) {
            e.preventDefault();
            setShowPermissionModal(true);
        }
    };

    return (
        <SuperAdminLayout header="Gestión de Tiendas">
            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />
            <Head title="Tiendas" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <form onSubmit={handleSearch} className="w-full max-w-sm">
                        <InputGroup>
                            <InputGroupAddon>
                                <Search className="h-4 w-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                                placeholder="Buscar por nombre, enlace o NIT..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </InputGroup>
                    </form>
                    <Button asChild>
                        <Link href={route('tenants.create')} onClick={handleCreateClick}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Tienda
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Tiendas</CardTitle>
                        <CardDescription>Todas las tiendas registradas en la plataforma.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre / Slug</TableHead>
                                    <TableHead>Vertical / Categoría</TableHead>
                                    <TableHead>Identificación</TableHead>
                                    <TableHead>Registro</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tenants.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-8">
                                            <Empty>
                                                <EmptyHeader>
                                                    <EmptyTitle>No se encontraron tiendas</EmptyTitle>
                                                    <EmptyDescription>
                                                        No hay tiendas registradas que coincidan con tu búsqueda.
                                                    </EmptyDescription>
                                                </EmptyHeader>
                                            </Empty>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tenants.data.map((tenant) => (
                                        <TableRow key={tenant.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 bg-blue-100 text-blue-600 rounded-lg">
                                                        <AvatarFallback className="bg-transparent rounded-lg">
                                                            <Store className="h-5 w-5" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span>{tenant.name}</span>
                                                        <span className="text-xs text-muted-foreground">/{tenant.slug}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{tenant.category?.vertical?.name || '-'}</span>
                                                    <span className="text-xs text-muted-foreground">{tenant.category?.name || '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                    {tenant.doc_number || 'N/A'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(tenant.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={route('tenants.show', tenant.id)}>
                                                        Ver Detalle
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        <div className="mt-4 flex justify-end">
                            <Pagination links={tenants.links} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SuperAdminLayout >
    );
}
