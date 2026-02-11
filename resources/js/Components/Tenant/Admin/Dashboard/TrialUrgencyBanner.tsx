import React, { useState, useEffect } from 'react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Clock, Rocket, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { cn } from '@/lib/utils';

interface Props {
    tenant: any;
}

export default function TrialUrgencyBanner({ tenant }: Props) {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!tenant?.trial_ends_at) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(tenant.trial_ends_at).getTime();
            const diff = end - now;

            if (diff <= 0) {
                setIsExpired(true);
                setTimeLeft('Expirado');
                clearInterval(timer);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m`);
            } else {
                setTimeLeft(`${minutes}m`);
            }
        }, 1000 * 60);

        return () => clearInterval(timer);
    }, [tenant?.trial_ends_at]);

    // Don't show if they already have an active/pending subscription
    // Using simple check for now, can be refined based on subscription model
    if (!tenant?.trial_ends_at || (tenant?.latest_subscription && tenant?.latest_subscription?.status !== 'pending')) {
        return null;
    }

    return (
        <Card className={cn(
            "relative overflow-hidden border-none shadow-lg animate-in fade-in slide-in-from-top-4 duration-500",
            isExpired ? "bg-destructive/10 border-destructive/20" : "bg-gradient-to-r from-blue-600 to-indigo-700"
        )}>
            {/* Animated background element */}
            <div className="absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 bg-white/5 rounded-full blur-3xl" />

            <div className="relative p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-center md:text-left">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner shrink-0",
                        isExpired ? "bg-destructive/20 text-destructive" : "bg-white/10 text-white"
                    )}>
                        {isExpired ? <AlertCircle className="w-6 h-6" /> : <Clock className="w-6 h-6 animate-pulse" />}
                    </div>

                    <div className="space-y-1">
                        <h3 className={cn(
                            "text-lg font-black tracking-tight",
                            isExpired ? "text-destructive" : "text-white"
                        )}>
                            {isExpired ? "Tu periodo de configuración ha expirado" : "Tu ventana de lanzamiento está activa"}
                        </h3>
                        <p className={cn(
                            "text-sm font-medium opacity-90",
                            isExpired ? "text-destructive/80" : "text-white/80"
                        )}>
                            {isExpired
                                ? "Para que tus clientes puedan comprar, necesitas activar un plan ahora."
                                : `Tienes ${timeLeft} para configurar y lanzar tu tienda.`
                            }
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <Link href={route('tenant.subscription.index', { tenant: tenant.slug })}>
                        <Button
                            variant={isExpired ? "destructive" : "secondary"}
                            className="font-bold shadow-sm active:scale-95 transition-all group px-6"
                        >
                            <Rocket className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                            {isExpired ? "Activar ahora" : "Elegir un Plan"}
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}
