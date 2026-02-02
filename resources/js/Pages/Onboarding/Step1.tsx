import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { route } from 'ziggy-js';

// ShadCN Components
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Separator } from '@/Components/ui/separator';

// Lucide Icons
import {
    ShoppingBag,
    CheckCircle2,
    ChevronLeft,
    ArrowRight,
    Sparkles,
    Check,
    Star,
    Rocket,
    Clock
} from 'lucide-react';

// --- Wireframe Component ---
const VerticalWireframe = ({ type, className }: { type: string, className?: string }) => {
    const t = type.toLowerCase();

    // Restaurant / Food
    if (t.includes('restaurante') || t.includes('comida') || t.includes('food')) {
        return (
            <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="80" height="80" rx="8" className="fill-blue-50 stroke-blue-200" strokeWidth="2" />
                <rect x="10" y="10" width="80" height="25" rx="8" className="fill-blue-100" />
                <rect x="20" y="45" width="12" height="12" rx="3" className="fill-blue-300" />
                <rect x="38" y="48" width="40" height="6" rx="2" className="fill-blue-200" />
                <rect x="20" y="65" width="12" height="12" rx="3" className="fill-blue-300" />
                <rect x="38" y="68" width="40" height="6" rx="2" className="fill-blue-200" />
            </svg>
        );
    }

    // Ecommerce / Shop
    if (t.includes('tienda') || t.includes('ecommerce') || t.includes('shop') || t.includes('ventas')) {
        return (
            <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="80" height="80" rx="8" className="fill-indigo-50 stroke-indigo-200" strokeWidth="2" />
                <rect x="20" y="20" width="25" height="25" rx="4" className="fill-indigo-200" />
                <rect x="55" y="20" width="25" height="25" rx="4" className="fill-indigo-200" />
                <rect x="20" y="55" width="25" height="25" rx="4" className="fill-indigo-200" />
                <rect x="55" y="55" width="25" height="25" rx="4" className="fill-indigo-200" />
            </svg>
        );
    }

    // Health / Medical
    if (t.includes('salud') || t.includes('medico') || t.includes('psicologia') || t.includes('bienestar')) {
        return (
            <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="80" height="80" rx="8" className="fill-teal-50 stroke-teal-200" strokeWidth="2" />
                <circle cx="50" cy="35" r="12" className="fill-teal-200" />
                <rect x="25" y="55" width="50" height="15" rx="4" className="fill-teal-100" />
                <rect x="35" y="75" width="30" height="4" rx="2" className="fill-teal-200" />
            </svg>
        );
    }

    // Services / Professional
    if (t.includes('servicio') || t.includes('profesional') || t.includes('legal') || t.includes('consultoria')) {
        return (
            <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="80" height="80" rx="8" className="fill-slate-50 stroke-slate-200" strokeWidth="2" />
                <rect x="20" y="25" width="60" height="30" rx="4" className="fill-slate-100" />
                <rect x="20" y="65" width="30" height="10" rx="2" className="fill-slate-200" />
                <rect x="60" y="65" width="20" height="10" rx="2" className="fill-slate-300" />
            </svg>
        );
    }

    // Default Fallback
    return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="80" height="80" rx="8" className="fill-gray-50 stroke-gray-200" strokeWidth="2" />
            <circle cx="50" cy="50" r="15" className="fill-gray-100" />
            <rect x="30" y="75" width="40" height="4" rx="2" className="fill-gray-200" />
        </svg>
    );
};

// --- Interfaces ---
interface Category {
    id: number;
    name: string;
    require_verification: number;
}

interface Vertical {
    id: number;
    name: string;
    slug: string;
    categories: Category[];
}

interface Plan {
    id: number;
    vertical_id?: number;
    name: string;
    monthly_price: number;
    currency: string;
    description: string;
    quarterly_discount_percent: number;
    semiannual_discount_percent: number;
    yearly_discount_percent: number;
    cover_url?: string;
    highlight_text?: string;
    features?: string[];
    trial_days?: number;
}

interface Props {
    verticals: Vertical[];
    plans: Plan[];
    siteSettings?: {
        app_name: string;
        logo_url: string | null;
    };
}

export default function Step1({ verticals = [], plans = [], siteSettings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        vertical_id: '',
        category_id: '',
        plan_id: '',
        billing_cycle: 'monthly' as 'monthly' | 'quarterly' | 'semiannual' | 'yearly',
    });

    const [currentSection, setCurrentSection] = useState<'vertical' | 'plan'>('vertical');
    const currentStep = currentSection === 'vertical' ? 1 : 2;

    const selectedVertical = verticals.find(v => v.id.toString() === data.vertical_id);
    const availableCategories = selectedVertical?.categories || [];
    const filteredPlans = plans.filter(p => !p.vertical_id || p.vertical_id.toString() === data.vertical_id);

    const calculatePrice = (plan: Plan) => {
        const monthlyBase = Number(plan.monthly_price);
        let months = 1;
        let discount = 0;

        switch (data.billing_cycle) {
            case 'quarterly': months = 3; discount = plan.quarterly_discount_percent; break;
            case 'semiannual': months = 6; discount = plan.semiannual_discount_percent; break;
            case 'yearly': months = 12; discount = plan.yearly_discount_percent; break;
        }

        const total = monthlyBase * months * (1 - discount / 100);
        const monthly = total / months;

        return { total, monthly, discount, months };
    };

    const handleContinue = () => {
        if (!data.vertical_id || !data.category_id) {
            toast.error('Selecciona tu tipo de negocio y categoría');
            return;
        }

        if (currentSection === 'vertical') {
            setCurrentSection('plan');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (!data.plan_id) {
            toast.error('Selecciona un plan para continuar');
            return;
        }

        post(route('onboarding.step1.store'), {
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(typeof firstError === 'string' ? firstError : 'Revisa los campos');
            }
        });
    };

    return (
        <>
            <Head title="Paso 1 - Industría y Plan | Linkiu" />

            <div className="min-h-screen bg-slate-50/50">
                {/* Header with 4-Step Progress */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="block">
                                {siteSettings?.logo_url ? (
                                    <img
                                        src={siteSettings.logo_url}
                                        alt={siteSettings.app_name || 'Logo'}
                                        className="h-8 w-auto object-contain max-w-[200px]"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground">
                                        <div className="h-8 w-8 flex items-center justify-center bg-primary p-1.5 rounded-lg">
                                            <ShoppingBag className="h-5 w-5 text-primary-foreground" />
                                        </div>
                                        <span>{siteSettings?.app_name || 'Linkiu.bio'}</span>
                                    </div>
                                )}
                            </Link>

                            <Separator orientation="vertical" className="h-8 mx-2 hidden sm:block" />
                            <p className="text-sm text-muted-foreground hidden sm:block font-medium">
                                Registro Linkiu
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map((step) => (
                                    <div
                                        key={step}
                                        className={cn(
                                            "h-2 rounded-full transition-all duration-500",
                                            step === currentStep ? "w-8 bg-primary" :
                                                step < currentStep ? "w-2 bg-primary" : "w-2 bg-gray-200"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto px-6 py-12">
                    {currentSection === 'vertical' ? (
                        /* Step 1: Industry Selection */
                        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <Badge variant="secondary" className="mb-4">Paso 1 de 4</Badge>
                                <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                                    ¿Qué tipo de negocio tienes?
                                </h2>
                                <p className="text-lg text-gray-500 max-w-xl mx-auto">
                                    Te ayudaremos a configurar tu tienda según tu industria
                                </p>
                            </div>

                            <div className="space-y-10">
                                {/* Vertical Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                    {verticals.map((vertical) => {
                                        const isSelected = data.vertical_id === vertical.id.toString();

                                        return (
                                            <button
                                                type="button"
                                                key={vertical.id}
                                                onClick={() => {
                                                    setData(prev => ({ ...prev, vertical_id: vertical.id.toString(), category_id: '' }));
                                                }}
                                                className={cn(
                                                    "relative p-4 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-xl group flex flex-col items-center gap-4 h-auto aspect-[4/5] bg-white",
                                                    isSelected
                                                        ? "border-primary ring-4 ring-primary/5 scale-[1.02]"
                                                        : "border-gray-100 hover:border-primary/30"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-full flex-1 rounded-lg flex items-center justify-center p-4 transition-colors",
                                                    isSelected ? "bg-primary/5" : "bg-gray-50 group-hover:bg-primary/5"
                                                )}>
                                                    <VerticalWireframe
                                                        type={vertical.name}
                                                        className={cn(
                                                            "w-full h-full transition-transform duration-500",
                                                            isSelected ? "scale-110 drop-shadow-sm" : "group-hover:scale-105 opacity-70 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                                                        )}
                                                    />
                                                </div>

                                                <span className={cn(
                                                    "font-semibold text-center text-sm w-full truncate px-2",
                                                    isSelected ? "text-primary" : "text-gray-700"
                                                )}>
                                                    {vertical.name}
                                                </span>

                                                {isSelected && (
                                                    <div className="absolute top-3 right-3 bg-primary rounded-full p-1 shadow-lg animate-in zoom-in">
                                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Category Selection */}
                                {data.vertical_id && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 pt-10 border-t border-gray-100">
                                        <h3 className="text-center font-medium text-gray-900 mb-6">
                                            ¿Cuál categoría te describe mejor?
                                        </h3>
                                        <div className="flex flex-wrap justify-center gap-3">
                                            {availableCategories.map((category) => {
                                                const isSelected = data.category_id === category.id.toString();

                                                return (
                                                    <Button
                                                        type="button"
                                                        key={category.id}
                                                        variant={isSelected ? "default" : "outline"}
                                                        onClick={() => setData('category_id', category.id.toString())}
                                                        className={cn(
                                                            "rounded-full px-6",
                                                            isSelected && "shadow-md scale-105"
                                                        )}
                                                    >
                                                        {isSelected && <Check className="w-4 h-4 mr-2" />}
                                                        {category.name}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Validation indicators */}
                                {data.vertical_id && data.category_id && (
                                    <div className="mt-8 flex justify-center animate-in fade-in slide-in-from-bottom-2">
                                        <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium flex items-center gap-2 border border-green-200">
                                            <CheckCircle2 className="w-4 h-4" />
                                            ¡Todo listo para elegir tu plan!
                                        </div>
                                    </div>
                                )}

                                {(errors.vertical_id || errors.category_id) && (
                                    <p className="text-center text-red-500 text-sm">
                                        {errors.vertical_id || errors.category_id}
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Step 2: Plan Selection */
                        <div className="animate-in fade-in slide-in-from-right-5 duration-500 max-w-5xl mx-auto">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                                    Elige el plan ideal para ti
                                </h2>
                                <p className="text-lg text-gray-500">
                                    Empieza tu prueba gratuita hoy. Cancela cuando quieras.
                                </p>
                            </div>

                            {/* Billing Cycle Selector - Clean Tabs */}
                            <div className="flex justify-center mb-10">
                                <div className="bg-gray-100 p-1 rounded-xl inline-flex relative border border-gray-200">
                                    {[
                                        { value: 'monthly', label: 'Mensual', badge: null },
                                        { value: 'quarterly', label: 'Trimestral', badge: '-5%' },
                                        { value: 'semiannual', label: 'Semestral', badge: '-10%' },
                                        { value: 'yearly', label: 'Anual', badge: '-20%' }
                                    ].map(cycle => (
                                        <button
                                            key={cycle.value}
                                            type="button"
                                            onClick={() => setData('billing_cycle', cycle.value as any)}
                                            className={cn(
                                                "px-4 py-2 rounded-lg text-sm font-medium transition-all relative z-10",
                                                data.billing_cycle === cycle.value
                                                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5 font-semibold"
                                                    : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                                            )}
                                        >
                                            {cycle.label}
                                            {cycle.badge && (
                                                <span className={cn(
                                                    "ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                                                    data.billing_cycle === cycle.value
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-200 text-gray-600"
                                                )}>
                                                    {cycle.badge}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing Cards */}
                            <div className="grid md:grid-cols-3 gap-6 items-start">
                                {filteredPlans.map((plan) => {
                                    const pricing = calculatePrice(plan);
                                    const isSelected = data.plan_id === plan.id.toString();

                                    return (
                                        <div
                                            key={plan.id}
                                            onClick={() => setData('plan_id', plan.id.toString())}
                                            className={cn(
                                                "relative rounded-2xl bg-white transition-all duration-300 cursor-pointer flex flex-col h-full group overflow-hidden",
                                                isSelected
                                                    ? "border-2 border-indigo-600 shadow-xl scale-[1.03] z-10 ring-4 ring-indigo-50"
                                                    : "border border-gray-200 hover:border-indigo-300 hover:shadow-lg shadow-sm"
                                            )}
                                        >
                                            {/* Cover Image Area */}
                                            <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                                                {plan.cover_url ? (
                                                    <img
                                                        src={plan.cover_url}
                                                        alt={plan.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                                                        <Rocket className="w-12 h-12 text-indigo-200" />
                                                    </div>
                                                )}

                                                {/* Highlight Badge (Overlay) */}
                                                <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2">
                                                    {plan.highlight_text && (
                                                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold shadow-md">
                                                            {plan.highlight_text}
                                                        </span>
                                                    )}
                                                    {(plan.trial_days || 0) > 0 && (
                                                        <span className="bg-white/90 backdrop-blur-sm text-indigo-600 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold shadow-sm border border-indigo-100 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {plan.trial_days} Días Prueba
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
                                            </div>

                                            <div className="p-6 pt-2 flex-1 flex flex-col relative">
                                                <div className="mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{plan.name}</h3>
                                                </div>

                                                {/* Price */}
                                                <div className="mb-2 pb-2 border-b border-gray-100">
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
                                                            {new Intl.NumberFormat('es-CO', {
                                                                style: 'currency',
                                                                currency: plan.currency,
                                                                maximumFractionDigits: 0
                                                            }).format(pricing.total)}
                                                        </span>
                                                        <span className="text-gray-500 font-medium text-sm">
                                                            {data.billing_cycle === 'monthly' ? '/mes' : ''}
                                                        </span>
                                                    </div>
                                                    {data.billing_cycle !== 'monthly' && (
                                                        <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-green-600" />
                                                            Equivale a {new Intl.NumberFormat('es-CO', {
                                                                style: 'currency',
                                                                currency: plan.currency,
                                                                maximumFractionDigits: 0
                                                            }).format(pricing.monthly)}/mes
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Features */}
                                                <ul className="space-y-3 mb-8 flex-1">
                                                    {plan.features?.slice(0, 6).map((feature, idx) => (
                                                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                                                            <div className="mt-0.5 min-w-4 min-h-4 w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                                                <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                                                            </div>
                                                            <span className="leading-tight">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <button
                                                    type="button"
                                                    className={cn(
                                                        "w-full py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-sm",
                                                        isSelected
                                                            ? "bg-indigo-600 text-white shadow-indigo-200 cursor-default ring-2 ring-indigo-600 ring-offset-2"
                                                            : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:scale-[1.02]"
                                                    )}
                                                >
                                                    {isSelected ? 'Plan Seleccionado' : 'Elegir Plan'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {errors.plan_id && <p className="text-red-600 text-sm text-center mt-4">{errors.plan_id}</p>}
                        </div>
                    )}

                    {/* Navigation Footer */}
                    <div className="max-w-4xl mx-auto mt-16 flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky bottom-6">
                        {currentSection === 'plan' ? (
                            <Button
                                variant="ghost"
                                size="lg"
                                onClick={() => setCurrentSection('vertical')}
                                className="group"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                                Atrás
                            </Button>
                        ) : (
                            <div /> /* Spacer */
                        )}

                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 px-8 h-12 text-base font-bold shadow-indigo-100 shadow-xl"
                            onClick={handleContinue}
                            disabled={processing}
                        >
                            {processing ? 'Guardando...' : 'Continuar'}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </main>
            </div>
        </>
    );
}
