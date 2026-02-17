import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { MessageCircle, Save, Smartphone, ShieldCheck, ShieldAlert, AlertCircle, Loader2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { Badge } from '@/Components/ui/badge';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import { PageProps } from '@/types';

interface WhatsAppSettingsProps {
    settings: { whatsapp_admin_phone: string };
    hasFeature: boolean;
    tenant: { id: number; slug: string; name: string; logo_url?: string };
}

export default function Settings({ settings, hasFeature, tenant }: WhatsAppSettingsProps) {
    const { currentUserRole } = usePage<PageProps>().props;
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({
        whatsapp_admin_phone: settings.whatsapp_admin_phone || '',
    });

    const checkPermission = (permission: string) => {
        if (!currentUserRole) return false;
        if (currentUserRole.is_owner) return true;
        return currentUserRole.permissions.includes('*') || currentUserRole.permissions.includes(permission);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!checkPermission('whatsapp.update')) {
            setShowPermissionModal(true);
            return;
        }

        patch(route('tenant.whatsapp.update', { tenant: tenant.slug }), {
            onSuccess: () => toast.success('Configuración guardada correctamente'),
            onError: () => toast.error('Error al guardar la configuración'),
        });
    };

    return (
        <AdminLayout title="Notificaciones WhatsApp">
            <Head title="Notificaciones WhatsApp - Linkiu.Bio" />

            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />

            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                            <MessageCircle className="size-8 text-primary" />
                            Notificaciones WhatsApp
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Configura cómo recibes las alertas de tu negocio.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {hasFeature ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 px-3 py-1 flex items-center gap-1.5">
                                <ShieldCheck className="size-4" />
                                Módulo Activo
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50 px-3 py-1 flex items-center gap-1.5">
                                <ShieldAlert className="size-4" />
                                Requiere Plan Pro
                            </Badge>
                        )}
                    </div>
                </div>

                {!hasFeature && (
                    <Alert className="mb-6 bg-amber-50 border-amber-200 text-amber-900">
                        <AlertCircle className="size-4 text-amber-600" />
                        <AlertTitle className="font-bold">Módulo no incluido en tu plan</AlertTitle>
                        <AlertDescription className="text-amber-800/80">
                            Tu plan actual no incluye notificaciones automáticas por WhatsApp. Para activar esta función y que tus clientes reciban sus reservas y pedidos, debes mejorar tu plan.
                        </AlertDescription>
                        <div className="mt-4">
                            <Button variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-100" asChild>
                                <a href={route('tenant.subscription.index', { tenant: tenant.slug })}>Ver Planes Disponibles</a>
                            </Button>
                        </div>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border-0 shadow-lg shadow-black/5 bg-white overflow-hidden">
                        <CardHeader className="pb-4 border-b border-gray-50 bg-gray-50/30">
                            <CardTitle className="text-xl flex items-center gap-2 font-bold">
                                <Smartphone className="size-5 text-primary" />
                                Alertas para el Administrador
                            </CardTitle>
                            <CardDescription className="text-gray-500 font-medium">
                                Este número recibirá notificaciones cada vez que entre un nuevo pedido o una nueva reserva.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="phone" className="text-gray-700 font-bold">Número de WhatsApp Administrativo</Label>
                                <Input
                                    id="phone"
                                    value={data.whatsapp_admin_phone}
                                    onChange={e => setData('whatsapp_admin_phone', e.target.value)}
                                    placeholder="Ej: +573102223344"
                                    className={`h-12 text-lg px-4 border-gray-200 focus:ring-primary/20 ${errors.whatsapp_admin_phone ? 'border-destructive ring-destructive/20' : ''}`}
                                />
                                {errors.whatsapp_admin_phone && (
                                    <p className="text-xs font-bold text-destructive mt-1 flex items-center gap-1">
                                        <AlertCircle className="size-3" />
                                        {errors.whatsapp_admin_phone}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                                    <span className="inline-block size-1.5 rounded-full bg-blue-500" />
                                    Usa el formato internacional (ej: +57310...).
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                <h4 className="text-sm font-bold mb-3 flex items-center gap-2 text-slate-800">
                                    <ShieldCheck className="size-4 text-green-600" />
                                    ¿Qué notificaciones se enviarán?
                                </h4>
                                <ul className="space-y-2.5">
                                    <li className="flex items-start gap-3 text-xs text-slate-600">
                                        <div className="size-2 rounded-full bg-primary/20 mt-1 flex items-center justify-center">
                                            <div className="size-1 rounded-full bg-primary" />
                                        </div>
                                        <span><strong>Nuevas Reservas:</strong> Al número configurado arriba.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-xs text-slate-600">
                                        <div className="size-2 rounded-full bg-primary/20 mt-1 flex items-center justify-center">
                                            <div className="size-1 rounded-full bg-primary" />
                                        </div>
                                        <span><strong>Confirmación:</strong> Al número que el cliente registre.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-xs text-slate-600">
                                        <div className="size-2 rounded-full bg-primary/20 mt-1 flex items-center justify-center">
                                            <div className="size-1 rounded-full bg-primary" />
                                        </div>
                                        <span><strong>Recordatorios:</strong> Enviados automáticamente 1 hora antes.</span>
                                    </li>
                                </ul>
                            </div>
                        </CardContent>

                        <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-[11px] text-gray-500 font-medium text-center sm:text-left">
                                Integrado con <strong>Infobip Direct API</strong> para máxima velocidad.
                            </p>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto px-10 font-bold shadow-md shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            >
                                {processing ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                                Guardar Configuración
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
