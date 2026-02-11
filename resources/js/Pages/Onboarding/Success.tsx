import { Head, Link } from '@inertiajs/react';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

// ShadCN Components
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';

// Lucide Icons
import {
    CheckCircle2,
    Store,
    ArrowRight,
    ShoppingBag,
    Copy,
    Check,
    Rocket,
    LayoutDashboard,
    Globe,
    PartyPopper
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
    const [copied, setCopied] = useState(false);
    const storeUrl = `https://linkiu.bio/${tenant.slug}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(storeUrl);
        setCopied(true);
        toast.success('¡Enlace copiado al portapapeles!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <Head title="¡Tienda Lista! | Linkiu" />

            <ReactConfetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={400}
                gravity={0.12}
                colors={['#4F46E5', '#10B981', '#F59E0B', '#6366F1']}
            />

            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-white to-white">
                <div className="max-w-2xl w-full text-center space-y-12 animate-in fade-in zoom-in duration-1000">

                    {/* Hero Section */}
                    <div className="space-y-6">
                        <div className="relative inline-block">
                            <div className="h-28 w-28 bg-green-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-green-200 rotate-6 animate-bounce transition-all hover:rotate-0">
                                <CheckCircle2 className="w-16 h-16 text-white" />
                            </div>
                            <div className="absolute -top-6 -right-6 h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl -rotate-12 scale-110 animate-pulse">
                                <PartyPopper className="w-7 h-7" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Badge variant="outline" className="px-4 py-1.5 border-green-200 bg-green-50 text-green-700 font-bold uppercase tracking-wider backdrop-blur-sm">
                                <span className="mr-2">✨</span> Registro Exitoso
                            </Badge>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                                ¡Tu tienda está <span className="text-primary italic">Lista</span>!
                            </h1>
                            <p className="text-lg md:text-xl text-slate-500 max-w-lg mx-auto font-medium">
                                Felicitaciones <span className="text-slate-900 font-bold">{tenant.name}</span>, acabas de dar el primer paso hacia el éxito digital.
                            </p>
                        </div>
                    </div>

                    {/* Action Card */}
                    <Card className="border-slate-100 bg-white shadow-2xl shadow-slate-200/50 p-8 rounded-[2rem] space-y-10 relative overflow-hidden ring-1 ring-slate-100">
                        {/* Slug Display */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400">
                                <Globe className="w-4 h-4" />
                                TU DIRECCIÓN WEB PÚBLICA
                            </div>
                            <div className="p-1 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2 group transition-all hover:border-primary/30">
                                <div className="flex-1 px-6 py-4 font-mono font-bold text-xl md:text-2xl text-primary tracking-tight truncate">
                                    linkiu.bio/<span className="text-slate-900">{tenant.slug}</span>
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className={cn(
                                        "h-12 w-12 rounded-xl flex items-center justify-center transition-all mr-1",
                                        copied ? "bg-green-500 text-white" : "bg-white text-slate-400 hover:text-primary hover:bg-slate-100 border border-slate-100"
                                    )}
                                >
                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="h-16 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                            >
                                <Link href={`/${tenant.slug}/admin/dashboard`}>
                                    <LayoutDashboard className="mr-2 w-5 h-5" />
                                    Ir al Dashboard
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-16 text-lg font-bold rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-primary transition-all"
                                onClick={() => window.open(storeUrl, '_blank')}
                            >
                                <Store className="mr-2 w-5 h-5" />
                                Ver mi Tienda
                            </Button>
                        </div>

                        {/* Decorative background element */}
                        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                    </Card>

                    {/* Footer / Branding */}
                    <div className="pt-4 flex flex-col items-center gap-6">
                        <div className="flex items-center gap-6 opacity-40">
                            <Rocket className="w-10 h-10 text-slate-400" />
                            <div className="h-8 w-px bg-slate-200" />
                            <ShoppingBag className="w-10 h-10 text-slate-400" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                            Powered by Linkiu Ecosystem
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
