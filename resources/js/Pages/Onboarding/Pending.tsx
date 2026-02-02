import { Head, Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

// ShadCN Components
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';

// Lucide Icons
import {
    Clock,
    ShoppingBag,
    MessageCircle,
    Home,
    CheckCircle2,
    Calendar,
    ArrowRight,
    ShieldCheck
} from 'lucide-react';

interface Props {
    tenant: {
        name: string;
        slug: string;
    };
    siteSettings?: {
        app_name: string;
        logo_url: string | null;
    };
}

export default function Pending({ tenant, siteSettings }: Props) {
    return (
        <>
            <Head title="Solicitud en Revisión | Linkiu" />

            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/50 via-white to-slate-50">
                <div className="max-w-2xl w-full text-center space-y-10">
                    {/* Pending Icon */}
                    <div className="relative inline-block animate-in zoom-in duration-1000">
                        <div className="h-24 w-24 bg-amber-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-200 animate-pulse cursor-default">
                            <Clock className="w-14 h-14 text-white" />
                        </div>
                        <div className="absolute -top-4 -right-4 h-10 w-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-xl rotate-12 scale-110">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                            ¡Ya casi está listo, {tenant.name}!
                        </h1>
                        <p className="text-xl text-gray-600 max-w-lg mx-auto">
                            Tu solicitud ha sido recibida correctamente. Por seguridad, nuestro equipo revisa manualmente ciertos tipos de tiendas.
                        </p>
                    </div>

                    <Card className="border-amber-100 bg-white shadow-2xl shadow-amber-100/30 overflow-hidden text-left">
                        <CardHeader className="bg-amber-50/30 border-b border-amber-50 py-6 text-center">
                            <CardTitle className="text-amber-800 text-lg flex items-center justify-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Próximos Pasos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Validación de Perfil</h4>
                                        <p className="text-sm text-gray-500">Estamos verificando la información de tu industria para asegurar la mejor configuración.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Notificación de Activación</h4>
                                        <p className="text-sm text-gray-500">Recibirás un mensaje por WhatsApp y correo en cuanto tu tienda esté activa (máximo 24 horas).</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 grid sm:grid-cols-2 gap-4">
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-indigo-100"
                                >
                                    <Link href="/">
                                        Ir al inicio
                                        <Home className="ml-2 w-5 h-5" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="h-14 text-lg font-bold border-gray-200 hover:bg-gray-50"
                                >
                                    <a href="https://wa.me/your-support-link" target="_blank" rel="noopener noreferrer">
                                        Hablar con soporte
                                        <MessageCircle className="ml-2 w-5 h-5" />
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="pt-8 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-400 opacity-50">
                            <div className="h-8 w-8 flex items-center justify-center bg-gray-400 p-1.5 rounded-lg">
                                <ShoppingBag className="h-5 w-5 text-white" />
                            </div>
                            <span>{siteSettings?.app_name || 'Linkiu.bio'}</span>
                        </div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                            Tu seguridad es nuestra prioridad
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
