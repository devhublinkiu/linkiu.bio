import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Store, ShoppingBag, Users, Zap } from 'lucide-react';

export default function Dashboard() {
    const { auth, tenant } = usePage<any>().props;
    const currentTenant = auth?.currentTenant || tenant;

    return (
        <AdminLayout title="Panel de Control">
            <Head title={`Dashboard - ${currentTenant?.name || 'Cargando...'}`} />

            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold tracking-tight">¡Hola, {auth?.user?.name?.split(' ')[0]}! 👋</h2>
                    <p className="text-slate-500">Bienvenido al centro de control de <span className="font-semibold text-slate-900">{currentTenant?.name || 'tu tienda'}</span>.</p>
                </div>

                {/* Stats Grid Placeholder */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none shadow-sm shadow-blue-100/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                            <Zap className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$0.00</div>
                            <p className="text-xs text-muted-foreground">+0% desde el mes anterior</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm shadow-blue-100/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pedidos Nuevos</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">+0 desde ayer</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm shadow-blue-100/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                            <Users className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">+0 nuevos este mes</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm shadow-blue-100/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Estado Tienda</CardTitle>
                            <Store className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Activa</div>
                            <p className="text-xs text-green-600 font-medium">Todo funciona correctamente</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Placeholder */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4 border-none shadow-sm shadow-blue-100/50">
                        <CardHeader>
                            <CardTitle>Resumen de Actividad</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[200px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl m-1">
                            <p className="text-slate-400 text-sm font-medium">Pronto verás gráficas de tus ventas aquí</p>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3 border-none shadow-sm shadow-blue-100/50">
                        <CardHeader>
                            <CardTitle>Últimos Pedidos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
                                    <p className="text-slate-400 text-sm font-medium">Aún no tienes pedidos</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
