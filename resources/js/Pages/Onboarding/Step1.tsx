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
import { CheckCircle2, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';

// Assets por vertical: bg e icon (onboarding)
const VERTICAL_ONBOARDING_ASSETS: Record<string, { bg: string; icon: string }> = {
    drop: { bg: 'bg_verticals_drop_onboarding', icon: 'icon_verticals_drop_onboarding' },
    ecommerce: { bg: 'bg_verticals_ecommerce_onboarding', icon: 'icon_verticals_ecommerce_onboarding' },
    service: { bg: 'bg_verticals_service_onboarding', icon: 'icon_verticals_service_onboarding' },
    gastronomy: { bg: 'bg_verticals_gastronomy_onboarding', icon: 'icon_verticals_gastronomy_onboarding' },
    church: { bg: 'bg_verticals_church_onboarding', icon: 'icon_verticals_church_onboarding' },
};

function getVerticalOnboardingSlug(name: string): string | null {
    const t = name.toLowerCase();
    if (t.includes('dropshipping')) return 'drop';
    if (t.includes('ecommerce') || t.includes('e-commerce')) return 'ecommerce';
    if (t.includes('servicio')) return 'service';
    if (t.includes('gastronom')) return 'gastronomy';
    if (t.includes('iglesia') || t.includes('church')) return 'church';
    return null;
}


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

                {/* Vertical Selection Grid — 3 columnas; card Dropshipping: fondo 256×155 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {verticals.map((vertical) => {
                        const isSelected = data.vertical_id === vertical.id.toString();
                        const verticalSlug = getVerticalOnboardingSlug(vertical.name);
                        const assets = verticalSlug ? VERTICAL_ONBOARDING_ASSETS[verticalSlug] : null;
                        const hasCustomAssets = Boolean(assets);

                        return (
                            <Card
                                key={vertical.id}
                                onClick={() => {
                                    setData(prev => ({ ...prev, vertical_id: vertical.id.toString(), category_id: '' }));
                                }}
                                className={cn(
                                    "group relative p-6 cursor-pointer transition-all duration-500 border-0 shadow-none",
                                    isSelected && "scale-[1.03] shadow-xl shadow-primary/20",
                                    !isSelected && "hover:scale-[1.03] hover:shadow-lg",
                                    hasCustomAssets && "bg-transparent",
                                    !hasCustomAssets && isSelected && "bg-primary",
                                    !hasCustomAssets && !isSelected && "bg-white"
                                )}
                                style={hasCustomAssets && assets ? {
                                    backgroundImage: `url(/onboarding-assets/${assets.bg}.webp)`,
                                    backgroundSize: '256px 155px',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                } : undefined}
                            >
                                <div className={cn(
                                    "space-y-4 relative z-10 flex flex-col",
                                    hasCustomAssets && "items-start text-center text-white"
                                )}>
                                    {hasCustomAssets && assets ? (
                                        <div className="w-12 h-12 flex items-center justify-center shrink-0">
                                            <img
                                                src={`/onboarding-assets/${assets.icon}.svg`}
                                                alt=""
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500",
                                            isSelected ? "bg-white/20 text-white" : "bg-slate-50 group-hover:bg-primary/10"
                                        )}>
                                            <span className="text-2xl font-bold text-slate-400">{vertical.name.charAt(0)}</span>
                                        </div>
                                    )}
                                    <div className={cn(hasCustomAssets && "w-full text-left")}>
                                        <h3 className={cn(
                                            "font-bold text-lg",
                                            hasCustomAssets ? "text-white" : isSelected ? "text-white" : "text-slate-800"
                                        )}>
                                            {vertical.name}
                                        </h3>
                                        <p className={cn(
                                            "text-xs mt-1",
                                            hasCustomAssets ? "text-white/80" : isSelected ? "text-white/70" : "text-slate-400"
                                        )}>
                                            {vertical.categories.length} categorías disponibles
                                        </p>
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="absolute top-4 right-6 animate-in zoom-in duration-300">
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
