import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { route } from 'ziggy-js';

// ShadCN Components
import { Card } from '@/Components/ui/card';
import { Progress } from '@/Components/ui/progress';

// Lucide Icons
import {
    Store,
    Layout,
    Globe,
    Rocket,
    CheckCircle2,
    Settings,
    Paintbrush,
    ShoppingBag,
    Loader2
} from 'lucide-react';

interface Props {
    tenantName: string;
    tenantSlug: string;
    requiresApproval: boolean;
}

export default function Building({ tenantName, tenantSlug, requiresApproval }: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const buildSteps = [
        { icon: Layout, label: 'Estructurando tu tienda...', detail: 'Creando bases de datos y archivos' },
        { icon: Paintbrush, label: 'Aplicando diseño...', detail: 'Configurando el tema visual' },
        { icon: Globe, label: 'Lanzando al mundo...', detail: 'Generando tu slug personalizado' },
        { icon: Rocket, label: '¡Todo listo!', detail: 'Tu espacio está preparado' },
    ];

    useEffect(() => {
        // Step animation
        const interval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev >= buildSteps.length - 1) {
                    clearInterval(interval);
                    setIsComplete(true);
                    return prev;
                }
                return prev + 1;
            });
        }, 2000);

        // Progress bar animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 0.5;
            });
        }, 100);

        return () => {
            clearInterval(interval);
            clearInterval(progressInterval);
        };
    }, []);

    useEffect(() => {
        if (isComplete) {
            setProgress(100);
            const timer = setTimeout(() => {
                if (requiresApproval) {
                    router.visit(route('onboarding.pending'));
                } else {
                    router.visit(route('onboarding.success'));
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isComplete, requiresApproval]);

    return (
        <>
            <Head title="Preparando tu tienda | Linkiu" />

            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-slate-50">
                <div className="max-w-md w-full space-y-12">
                    {/* Brand */}
                    <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700">
                        <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 animate-bounce">
                            <Store className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                            {tenantName || 'Preparando tu tienda'}
                        </h1>
                    </div>

                    {/* Build Progress Card */}
                    <Card className="p-8 border-gray-100 shadow-2xl shadow-blue-100/50 relative overflow-hidden bg-white/80 backdrop-blur-md">
                        <div className="space-y-8 relative z-10">
                            {/* Current Action */}
                            <div className="space-y-6 text-center">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Configuración en curso
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800 transition-all duration-300">
                                        {buildSteps[currentStep].label}
                                    </h2>
                                    <p className="text-sm text-gray-500 italic">
                                        {buildSteps[currentStep].detail}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold text-gray-400">
                                        <span>PROGRESO</span>
                                        <span className="text-primary">{Math.round(progress)}%</span>
                                    </div>
                                    <Progress value={progress} className="h-3 rounded-full bg-slate-100" />
                                </div>
                            </div>

                            {/* Steps Icons */}
                            <div className="flex justify-between items-center relative py-4">
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2"></div>
                                {buildSteps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isActive = index === currentStep;
                                    const isDone = index < currentStep;

                                    return (
                                        <div key={index} className="relative z-10 group">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 border-2",
                                                isActive ? "bg-primary border-primary text-white scale-110 shadow-lg" :
                                                    isDone ? "bg-green-100 border-green-200 text-green-600" :
                                                        "bg-white border-gray-100 text-gray-300"
                                            )}>
                                                {isDone ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                                            </div>
                                            {isActive && (
                                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rotate-45 rounded-sm animate-pulse -z-10" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Background Subtle Gradient */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                    </Card>

                    {/* Feedback */}
                    <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 delay-500 duration-1000">
                        <p className="text-sm text-gray-400 font-medium">Esto tomará menos de 30 segundos</p>
                        <div className="flex justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse delay-75" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse delay-150" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
