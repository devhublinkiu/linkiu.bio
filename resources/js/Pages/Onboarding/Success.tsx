import { Head, Link } from '@inertiajs/react';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { cn } from '@/lib/utils';

// ShadCN Components
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

// Lucide Icons
import {
    CheckCircle2,
    Store,
    ArrowRight,
    ShoppingBag,
    Share2,
    Rocket,
    LayoutDashboard
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

export default function Success({ tenant, siteSettings }: Props) {
    const { width, height } = useWindowSize();
    const storeUrl = `linkiu.bio/${tenant.slug}`;

    return (
        <>
            <Head title="¡Tienda Creada! | Linkiu" />

            {/* Confetti! */}
            <ReactConfetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={500}
                gravity={0.15}
                colors={['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#EC4899']}
            />

            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-50/50 via-white to-slate-50">
                <div className="max-w-2xl w-full text-center space-y-10">
                    {/* Success Icon */}
                    <div className="relative inline-block animate-in zoom-in duration-1000">
                        <div className="h-24 w-24 bg-green-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-200 animate-bounce cursor-default">
                            <CheckCircle2 className="w-14 h-14 text-white" />
                        </div>
                        <div className="absolute -top-4 -right-4 h-10 w-10 bg-amber-400 rounded-xl flex items-center justify-center text-white shadow-xl rotate-12 scale-110">
                            <Rocket className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                            ¡Felicitaciones, {tenant.name}!
                        </h1>
                        <p className="text-xl text-gray-600 max-w-lg mx-auto">
                            Tu tienda está lista para recibir sus primeros pedidos. El futuro de tu negocio empieza hoy.
                        </p>
                    </div>

                    <Card className="border-green-100 bg-white shadow-2xl shadow-green-300/80 overflow-hidden transform transition-all hover:scale-[1.01] duration-500">
                        <CardHeader className="bg-green-50/30 border-b border-green-50 py-6">
                            <CardTitle className="text-green-800 text-lg flex items-center justify-center gap-2">
                                <Store className="w-5 h-5" />
                                Enlace de tu tienda
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-gray-200 group relative">
                                <span className="text-2xl md:text-3xl font-mono font-bold text-primary tracking-tight">
                                    {storeUrl}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border-gray-200 hover:bg-white hover:text-primary"
                                    onClick={() => {
                                        navigator.clipboard.writeText(storeUrl);
                                        // toast handle would be good here but sonner needs to be available
                                    }}
                                >
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-indigo-100"
                                >
                                    <a href={`//${storeUrl}`} target="_blank" rel="noopener noreferrer">
                                        Ver mi tienda
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </a>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="h-14 text-lg font-bold border-gray-200 hover:bg-gray-50"
                                >
                                    <Link href={`/${tenant.slug}/admin/dashboard`}>
                                        <LayoutDashboard className="mr-2 w-5 h-5" />
                                        Panel de Control
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="pt-8 flex flex-col items-center gap-4">
                        {siteSettings?.logo_url ? (
                            <img
                                src={siteSettings.logo_url}
                                alt={siteSettings.app_name}
                                className="h-8 w-auto opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
                            />
                        ) : (
                            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-400 opacity-50">
                                <div className="h-8 w-8 flex items-center justify-center bg-gray-400 p-1.5 rounded-lg">
                                    <ShoppingBag className="h-5 w-5 text-white" />
                                </div>
                                <span>{siteSettings?.app_name || 'Linkiu.bio'}</span>
                            </div>
                        )}
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                            Powered by Dev Hub Linkiu
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
