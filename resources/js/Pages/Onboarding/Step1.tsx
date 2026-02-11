import { Head, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { route } from 'ziggy-js';
import OnboardingLayout from '@/Layouts/OnboardingLayout';

// ShadCN Components
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card } from '@/Components/ui/card';

// Lucide Icons
import {
    CheckCircle2,
    ArrowRight,
    Utensils,
    ShoppingBag,
    HeartPulse,
    Briefcase,
    Zap,
    ChevronRight,
    Sparkles
} from 'lucide-react';

// --- Visual Industry Icon Component ---
const IndustryIcon = ({ name, active }: { name: string, active: boolean }) => {
    const t = name.toLowerCase();
    const iconClass = cn(
        "w-8 h-8 transition-all duration-500",
        active ? "text-white scale-110" : "text-slate-400 grayscale group-hover:grayscale-0"
    );

    if (t.includes('restaurante') || t.includes('comida') || t.includes('gastro')) {
        return <Utensils className={iconClass} />;
    }
    if (t.includes('tienda') || t.includes('ecommerce') || t.includes('ventas') || t.includes('dropshipping')) {
        return <ShoppingBag className={iconClass} />;
    }
    if (t.includes('salud') || t.includes('bienestar') || t.includes('medico')) {
        return <HeartPulse className={iconClass} />;
    }
    return <Briefcase className={iconClass} />;
};

// --- Interfaces ---
interface Category {
    id: number;
    name: string;
}

interface Vertical {
    id: number;
    name: string;
    categories: Category[];
}

interface Props {
    verticals: Vertical[];
    siteSettings?: {
        app_name: string;
        logo_url: string | null;
    };
}

export default function Step1({ verticals = [], siteSettings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        vertical_id: '',
        category_id: '',
    });

    const selectedVertical = verticals.find(v => v.id.toString() === data.vertical_id);
    const availableCategories = selectedVertical?.categories || [];

    const handleContinue = () => {
        if (!data.vertical_id) {
            toast.error('Por favor, selecciona tu tipo de negocio');
            return;
        }
        if (!data.category_id) {
            toast.error('Por favor, selecciona una categoría para tu negocio');
            return;
        }

        post(route('onboarding.step1.store'), {
            onError: (err) => {
                const msg = Object.values(err)[0];
                toast.error(typeof msg === 'string' ? msg : 'Revisa los campos seleccionados');
            }
        });
    };

    return (
        <OnboardingLayout
            currentStep={1}
            siteSettings={siteSettings}
            title="Cuéntanos sobre tu negocio | Linkiu"
        >
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <Badge variant="outline" className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary animate-pulse">
                        <Sparkles className="w-3.5 h-3.5 mr-2" />
                        Comienza tu aventura
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                        ¿Cuál es tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">industria</span>?
                    </h1>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto">
                        Personalizaremos tu experiencia según tu tipo de negocio. No te preocupes, podrás cambiarlo después.
                    </p>
                </div>

                {/* Vertical Selection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {verticals.map((vertical) => {
                        const isSelected = data.vertical_id === vertical.id.toString();
                        return (
                            <Card
                                key={vertical.id}
                                onClick={() => {
                                    setData(prev => ({ ...prev, vertical_id: vertical.id.toString(), category_id: '' }));
                                }}
                                className={cn(
                                    "group relative p-6 cursor-pointer transition-all duration-500 border-2 overflow-hidden",
                                    isSelected
                                        ? "border-primary bg-primary shadow-xl shadow-primary/20 scale-[1.03]"
                                        : "border-slate-100 hover:border-primary/30 hover:shadow-lg bg-white"
                                )}
                            >
                                <div className="space-y-4 relative z-10">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500",
                                        isSelected ? "bg-white/20 text-white" : "bg-slate-50 group-hover:bg-primary/10"
                                    )}>
                                        <IndustryIcon name={vertical.name} active={isSelected} />
                                    </div>
                                    <div>
                                        <h3 className={cn(
                                            "font-bold text-lg",
                                            isSelected ? "text-white" : "text-slate-800"
                                        )}>
                                            {vertical.name}
                                        </h3>
                                        <p className={cn(
                                            "text-xs mt-1 line-clamp-1",
                                            isSelected ? "text-white/70" : "text-slate-400"
                                        )}>
                                            {vertical.categories.length} categorías disponibles
                                        </p>
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="absolute -right-2 -bottom-2 opacity-10">
                                        <Zap className="w-24 h-24 text-primary fill-primary" />
                                    </div>
                                )}

                                {isSelected && (
                                    <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                                        <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                        </div>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>

                {/* Category Selection Area */}
                <div className={cn(
                    "transition-all duration-700 overflow-hidden",
                    data.vertical_id ? "max-h-[500px] opacity-100 mt-12" : "max-h-0 opacity-0"
                )}>
                    <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                                <ChevronRight className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-xl tracking-tight">
                                Selecciona tu categoría específica
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {availableCategories.map((category) => {
                                const isSelected = data.category_id === category.id.toString();
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => setData('category_id', category.id.toString())}
                                        className={cn(
                                            "px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 border-2",
                                            isSelected
                                                ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105"
                                                : "bg-white border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary"
                                        )}
                                    >
                                        {category.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-slate-400">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={cn(
                                    "h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold",
                                    i === 1 ? "bg-primary/10 text-primary border-primary/20" : ""
                                )}>
                                    {i}
                                </div>
                            ))}
                        </div>
                        <span className="text-sm font-medium">Paso 1 de 3: Perfil de negocio</span>
                    </div>

                    <Button
                        size="lg"
                        onClick={handleContinue}
                        disabled={processing || !data.category_id}
                        className={cn(
                            "h-14 px-10 rounded-2xl font-bold text-base transition-all duration-300",
                            data.category_id
                                ? "bg-primary text-primary-foreground hover:shadow-primary/30 hover:scale-[1.02]"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        )}
                    >
                        {processing ? 'Procesando...' : 'Continuar'}
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </div>
        </OnboardingLayout>
    );
}
