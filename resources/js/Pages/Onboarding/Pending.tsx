import { Head, Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

// ShadCN Components
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';

// Lucide Icons
import {
    Clock,
    ShoppingBag,
    MessageCircle,
    Home,
    CheckCircle2,
    SearchCheck,
    ArrowRight,
    ShieldCheck,
    BellRing,
    CalendarCheck
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
            <Head title="En proceso de revisión | Linkiu" />

            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-50/50 via-white to-white">
                <div className="max-w-xl w-full text-center space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">

                    {/* Status Icon */}
                    <div className="space-y-6">
                        <div className="relative inline-block">
                            <div className="h-28 w-28 bg-amber-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-amber-200 animate-pulse">
                                <Clock className="w-14 h-14 text-white" />
                            </div>
                            <div className="absolute -top-6 -right-6 h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-12 scale-110">
                                <SearchCheck className="w-7 h-7" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Badge variant="outline" className="px-4 py-1.5 border-amber-200 bg-amber-50 text-amber-700 font-bold uppercase tracking-wider">
                                <ShieldCheck className="w-3.5 h-3.5 mr-2" />
                                SOLICITUD EN REVISIÓN
                            </Badge>
                            <h1 className="text-4xl font-black tracking-tight text-slate-800">
                                ¡Ya casi está listo, <span className="text-amber-600">{tenant.name}</span>!
                            </h1>
                            <p className="text-slate-500 max-w-lg mx-auto font-medium">
                                Tu industria requiere una validación rápida por parte de nuestro equipo para asegurar que todo esté perfecto.
                            </p>
                        </div>
                    </div>

                    {/* Timeline Card */}
                    <Card className="border-slate-100 bg-white shadow-2xl shadow-slate-200/40 p-10 rounded-[2.5rem] text-left space-y-10 ring-1 ring-slate-100">
                        <div className="space-y-8">
                            {/* Step 1 */}
                            <div className="flex gap-6 relative group">
                                <div className="absolute left-[19px] top-10 bottom-[-40px] w-0.5 bg-slate-100 group-last:hidden" />
                                <div className="h-10 w-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 z-10 border-2 border-green-100">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div className="space-y-1 mt-1">
                                    <h4 className="font-extrabold text-slate-900 leading-tight">Perfil Registrado</h4>
                                    <p className="text-sm text-slate-500 font-medium">Hemos recibido la información de tu cuenta y negocio.</p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex gap-6 relative group">
                                <div className="absolute left-[19px] top-10 bottom-[-40px] w-0.5 bg-slate-100 group-last:hidden" />
                                <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 z-10 border-2 border-amber-200 ring-4 ring-amber-50">
                                    <CalendarCheck className="w-5 h-5" />
                                </div>
                                <div className="space-y-1 mt-1">
                                    <h4 className="font-extrabold text-slate-900 leading-tight">Revisión de Seguridad</h4>
                                    <p className="text-sm text-slate-500 font-medium">Nuestro equipo está validando tu categoría de negocio (Gastro/Ventas).</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex gap-6 relative group">
                                <div className="h-10 w-10 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center flex-shrink-0 z-10 border-2 border-slate-100">
                                    <BellRing className="w-5 h-5" />
                                </div>
                                <div className="space-y-1 mt-1">
                                    <h4 className="font-extrabold text-slate-400 leading-tight italic">Activación de Cuenta</h4>
                                    <p className="text-sm text-slate-400">Recibirás un WhatsApp en menos de 24 horas.</p>
                                </div>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                asChild
                                size="lg"
                                className="h-14 flex-1 text-base font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02]"
                            >
                                <Link href="/">
                                    Volver al Inicio
                                    <Home className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-14 flex-1 text-base font-bold rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                                onClick={() => window.open('https://wa.me/support', '_blank')}
                            >
                                <MessageCircle className="mr-2 w-5 h-5" />
                                Hablar con Soporte
                            </Button>
                        </div>
                    </Card>

                    {/* Final Branding */}
                    <div className="pt-4 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-300 opacity-60">
                            <div className="h-10 w-10 flex items-center justify-center bg-slate-100 p-2 rounded-xl">
                                <ShoppingBag className="h-6 h-6 text-slate-400" />
                            </div>
                            <span className="font-black">LINKIU.BIO</span>
                        </div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                            Verificando tiendas extraordinarias
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
