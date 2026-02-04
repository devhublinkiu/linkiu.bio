import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Plus, Pencil, Trash2, CheckCircle, XCircle, Eye, Search } from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/Components/ui/empty';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import Pagination from '@/Components/Shared/Pagination';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import { useState } from 'react';

interface Plan {
    id: number;
    name: string;
    vertical?: { name: string };
    monthly_price: number;
    currency: string;
    is_public: boolean;
    is_featured: boolean;
    trial_days: number;
    created_at: string;
}

interface Props {
    plans: any;
}

export default function Index({ plans }: Props) {
    const { auth } = usePage<any>().props;
    const permissions = auth.permissions || [];
    const hasPermission = (p: string) => permissions.includes('*') || permissions.includes(p);
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    const plansList = plans.data || plans;
    const plansLinks = plans.links || [];

    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('plans.index'), { search }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (id: number) => {
        if (!hasPermission('sa.plans.delete')) {
            setShowPermissionModal(true);
            return;
        }
        router.delete(route('plans.destroy', id), {
            onSuccess: () => {
                // handle success if needed
            }
        });
    };

    const handleCreateClick = (e: React.MouseEvent) => {
        if (!hasPermission('sa.plans.create')) {
            e.preventDefault();
            setShowPermissionModal(true);
        }
    };

    const handleEditClick = (e: React.MouseEvent) => {
        if (!hasPermission('sa.plans.update')) {
            e.preventDefault();
            setShowPermissionModal(true);
        }
    };

    return (
        <SuperAdminLayout header="Planes de Suscripción">
            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />
            <Head title="Planes" />

            <div className="max-w-7xl mx-auto py-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">Planes y Precios</h2>
                        <p className="text-muted-foreground">Gestiona la oferta comercial por verticales y monedas.</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar planes..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </form>
                        <Button asChild>
                            <Link href={route('plans.create')} onClick={handleCreateClick}>
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Nuevo Plan
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Planes</CardTitle>
                        <CardDescription>
                            Mostrando {plansList.length} planes registrados.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Vertical</TableHead>
                                    <TableHead>Precio Base</TableHead>
                                    <TableHead>Prueba</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plansList.map((plan: Plan) => (
                                    <TableRow key={plan.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{plan.name}</span>
                                                {plan.is_featured && (
                                                    <span className="text-[10px] text-yellow-600 font-bold uppercase tracking-wider">Destacado</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {plan.vertical?.name || 'General'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-gray-900">
                                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: plan.currency }).format(plan.monthly_price)}
                                            </span>
                                            <span className="text-xs text-muted-foreground"> / mes</span>
                                        </TableCell>
                                        <TableCell>
                                            {plan.trial_days > 0 ? (
                                                <Badge variant="secondary">
                                                    {plan.trial_days} días
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {plan.is_public ? (
                                                    <Badge className="bg-green-500 hover:bg-green-600">Público</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Oculto</Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={route('plans.show', plan.id)}>
                                                        <Eye className="h-4 w-4 text-gray-500" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={route('plans.edit', plan.id)} onClick={handleEditClick}>
                                                        <Pencil className="h-4 w-4 text-blue-600" />
                                                    </Link>
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                if (!hasPermission('sa.plans.delete')) {
                                                                    e.preventDefault();
                                                                    setShowPermissionModal(true);
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    {hasPermission('sa.plans.delete') && (
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>¿Eliminar este plan?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta acción no se puede deshacer. El plan dejará de estar disponible para nuevas suscripciones.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(plan.id)} className="bg-red-600 hover:bg-red-700">
                                                                    Eliminar
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    )}
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {plansList.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-[400px]">
                                            <Empty className="h-full">
                                                <EmptyHeader>
                                                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                                                        <Plus className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                </EmptyHeader>
                                                <EmptyContent>
                                                    <EmptyTitle>No hay planes</EmptyTitle>
                                                    <EmptyDescription>
                                                        Comienza creando tu primer plan de suscripción para las tiendas.
                                                    </EmptyDescription>
                                                </EmptyContent>
                                                <div className="mt-6">
                                                    <Button asChild onClick={handleCreateClick}>
                                                        <Link href={route('plans.create')}>
                                                            Crear Primer Plan
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </Empty>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <div className="mt-4 flex justify-end">
                            <Pagination links={plansLinks} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SuperAdminLayout>
    );
}
