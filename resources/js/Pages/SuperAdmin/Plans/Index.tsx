import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link, router } from '@inertiajs/react'; // Add router import
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Plus, Pencil, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
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
} from "@/Components/ui/alert-dialog"; // Add AlertDialog imports

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
    plans: Plan[];
}

export default function Index({ plans }: Props) {
    const handleDelete = (id: number) => {
        router.delete(route('plans.destroy', id));
    };

    return (
        <SuperAdminLayout header="Planes de Suscripción">
            <Head title="Planes" />

            <div className="max-w-7xl mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Planes y Precios</h2>
                        <p className="text-muted-foreground">Gestiona la oferta comercial por verticales y monedas.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('plans.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Crear Nuevo Plan
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Planes</CardTitle>
                        <CardDescription>
                            Mostrando {plans.length} planes registrados.
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
                                {plans.map((plan) => (
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
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
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
                                                <Badge variant="secondary" className="bg-green-50 text-green-700">
                                                    {plan.trial_days} días
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {plan.is_public ? (
                                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Público</Badge>
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
                                                    <Link href={route('plans.edit', plan.id)}>
                                                        <Pencil className="h-4 w-4 text-blue-600" />
                                                    </Link>
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </AlertDialogTrigger>
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
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {plans.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No hay planes creados todavía.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </SuperAdminLayout>
    );
}
