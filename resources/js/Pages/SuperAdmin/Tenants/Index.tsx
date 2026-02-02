import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Plus, Search, Store, ExternalLink } from 'lucide-react';
import { useState } from 'react';

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
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('tenants.index'), { search }, { preserveState: true });
    };

    return (
        <SuperAdminLayout header="Gestión de Tiendas">
            <Head title="Tiendas" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <form onSubmit={handleSearch} className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por nombre, slug o NIT..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </form>
                    <Button asChild>
                        <Link href={route('tenants.create')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Tienda
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Tiendas (Tenants)</CardTitle>
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
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No se encontraron tiendas registradas.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tenants.data.map((tenant) => (
                                        <TableRow key={tenant.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                                        <Store className="h-5 w-5" />
                                                    </div>
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
                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                    {tenant.doc_number || 'N/A'}
                                                </code>
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
                    </CardContent>
                </Card>
            </div>
        </SuperAdminLayout>
    );
}
