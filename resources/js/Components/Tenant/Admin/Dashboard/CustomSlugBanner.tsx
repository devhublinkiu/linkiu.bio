import React, { useState, useEffect } from 'react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Sparkles, Globe, ArrowRight, Check, X, Loader2, Rocket } from 'lucide-react';
import { Link, useForm, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { cn } from '@/lib/utils';
import { MODULE_LABELS } from '@/Config/menuConfig';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Badge } from '@/Components/ui/badge';
import axios from 'axios';
import { toast } from 'sonner';

interface Props {
    tenant: any;
    plans?: any[];
}

export default function CustomSlugBanner({ tenant, plans }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<'search' | 'pricing'>('search');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [isValidating, setIsValidating] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [slugError, setSlugError] = useState<string | null>(null);

    const { data, setData, post, processing } = useForm({
        slug: tenant?.slug?.replace(/-\d{4}$/, '') || '',
        plan_id: null as number | null,
        billing_cycle: 'monthly' as string,
    });

    // Auto-validate current suggested slug when modal opens
    useEffect(() => {
        if (isOpen && data.slug && step === 'search') {
            validateSlug(data.slug);
        }
    }, [isOpen]);

    // Detect if current slug is provisional (ends with - and 4 digits)
    const isProvisional = /-\d{4}$/.test(tenant?.slug || '');

    // Check if within 48h configuration period
    const isWithinTrial = tenant?.trial_ends_at ? new Date(tenant.trial_ends_at) > new Date() : false;

    // REALLY has a active pro plan with custom slug enabled
    const isActuallyPro = !!(tenant?.latest_subscription?.plan?.allow_custom_slug && tenant?.latest_subscription?.status === 'active');

    // Users can use the modal if they are Pro or in Trial period
    const canCustomize = isActuallyPro || isWithinTrial;

    if (!isProvisional) return null;

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
        setData('slug', val);
        validateSlug(val);
    };

    const validateSlug = async (slug: string) => {
        setIsValidating(true);
        setSlugError(null);
        setIsAvailable(null);
        try {
            const response = await axios.post(route('onboarding.validate'), {
                field: 'slug',
                value: slug
            });
            if (response.data.valid) {
                setIsAvailable(true);
            } else {
                setIsAvailable(false);
                setSlugError(response.data.message);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsValidating(false);
        }
    };

    const handleSelectPlan = (planId: number) => {
        router.post(route('tenant.subscription.change-plan', { tenant: tenant.slug }), {
            slug: data.slug,
            plan_id: planId,
            billing_cycle: billingCycle
        }, {
            onSuccess: () => {
                setIsOpen(false);
                toast.success('¡Plan seleccionado y URL actualizada con éxito!');
            },
            onError: (err) => {
                toast.error("Error al procesar el cambio de plan");
            }
        });
    };

    const updateSlug = () => {
        post(route('tenant.slug.update', { tenant: tenant.slug }), {
            onSuccess: () => {
                setIsOpen(false);
                toast.success('¡URL y Plan actualizados con éxito!');
            },
            onError: (err) => {
                toast.error(Object.values(err)[0] as string);
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (slugError) return;

        if (isActuallyPro) {
            updateSlug();
        } else {
            setStep('pricing');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <>
            <Card className="p-1 border-none bg-gradient-to-r from-amber-50 to-orange-50 overflow-hidden relative group">
                {/* Decorative sparkles */}
                <Sparkles className="absolute -right-2 -top-2 w-12 h-12 text-amber-200/50 rotate-12 group-hover:scale-110 transition-transform" />

                <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">¡Tu marca merece un link profesional!</h4>
                            <p className="text-xs text-slate-500 font-medium">
                                Actualmente usas <span className="font-bold text-slate-700">{tenant.slug}</span>.
                                {canCustomize ? "Reclama tu link corto ahora." : "Pásate a Pro para eliminar los números."}
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => setIsOpen(true)}
                    >
                        {isActuallyPro ? "Personalizar URL" : "Quitar números"}
                        <ArrowRight className="w-3.5 h-3.5 ml-2" />
                    </Button>
                </div>
            </Card>

            <Dialog open={isOpen} onOpenChange={(val) => {
                setIsOpen(val);
                if (!val) setStep('search');
            }}>
                <DialogContent className={cn(
                    "rounded-[32px] border-none shadow-2xl px-8 py-6 transition-all duration-300",
                    step === 'pricing' ? "sm:max-w-[700px]" : "sm:max-w-[425px]"
                )}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                            {step === 'search' ? (
                                <>
                                    <Globe className="w-6 h-6 text-primary" />
                                    Personaliza tu URL
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-6 h-6 text-amber-500" />
                                    Elige tu Plan Pro
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription className="font-medium">
                            {step === 'search'
                                ? "Elige una dirección web limpia y fácil de recordar para tus clientes."
                                : "Activa tu link personalizado seleccionando el plan que prefieras."
                            }
                        </DialogDescription>
                    </DialogHeader>

                    {step === 'search' ? (
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="space-y-4">
                                <Label htmlFor="slug" className="text-sm font-bold ml-1">Nueva dirección web</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">linkiu.bio/</span>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={handleSlugChange}
                                        placeholder="tu-marca"
                                        className={cn(
                                            "h-14 pl-[85px] pr-10 rounded-2xl font-bold border-slate-100 bg-slate-50/50 transition-all text-lg",
                                            slugError ? "ring-destructive/20 border-destructive" : "focus:ring-primary/20 focus:border-primary"
                                        )}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        {isValidating && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                                        {!isValidating && isAvailable === true && (
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500 rounded-full text-[10px] font-black text-white uppercase animate-in zoom-in duration-300">
                                                <Check className="w-3 h-3" />
                                                Disponible
                                            </div>
                                        )}
                                        {!isValidating && isAvailable === false && (
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-destructive rounded-full text-[10px] font-black text-white uppercase animate-in zoom-in duration-300">
                                                <X className="w-3 h-3" />
                                                Ocupado
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {slugError && <p className="text-[11px] font-bold text-destructive ml-1">{slugError}</p>}
                            </div>

                            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 space-y-3">
                                <div className="flex items-center gap-2 text-amber-700">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase tracking-tight">Estrategia de Marca</span>
                                </div>
                                <p className="text-[11px] text-amber-900/70 font-bold leading-relaxed">
                                    {isActuallyPro
                                        ? "Como usuario Pro, puedes cambiar tu URL inmediatamente."
                                        : "Esta URL profesional se activará al elegir tu Plan Pro. ¡Asegura tu nombre ahora!"}
                                </p>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={processing || isValidating || !isAvailable || data.slug.length < 3}
                                    className="w-full h-10 font-black text-lg shadow-lg"
                                >
                                    {isActuallyPro ? 'Confirmar URL' : 'Continuar a Selección de Plan'}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </DialogFooter>
                        </form>
                    ) : (
                        <div className="py-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Cycle Toggle */}
                            <div className="flex justify-center">
                                <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1">
                                    <Button
                                        variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setBillingCycle('monthly')}
                                        className={cn(
                                            "h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                                            billingCycle === 'monthly' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                                        )}
                                    >
                                        Mensual
                                    </Button>
                                    <Button
                                        variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setBillingCycle('yearly')}
                                        className={cn(
                                            "h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                                            billingCycle === 'yearly' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                                        )}
                                    >
                                        Anual
                                        <Badge className="ml-2 bg-green-500 text-[8px] py-0 px-1 border-none text-white">-15%</Badge>
                                    </Button>
                                </div>
                            </div>

                            {/* Plans Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {plans?.filter(p => !p.name.toLowerCase().includes('free')).map((plan) => (
                                    <PlanCard
                                        key={plan.id}
                                        plan={plan}
                                        billingCycle={billingCycle}
                                        processing={processing}
                                        onSelect={handleSelectPlan}
                                        formatCurrency={formatCurrency}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setStep('search')}
                                className="w-full text-center text-sm font-bold text-slate-900 hover:text-slate-600 transition-colors"
                            >
                                ← Volver a buscar URL
                            </button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

function PlanCard({ plan, billingCycle, processing, onSelect, formatCurrency }: {
    plan: any,
    billingCycle: 'monthly' | 'yearly',
    processing: boolean,
    onSelect: (id: number) => void,
    formatCurrency: (amount: number) => string
}) {
    const [showMore, setShowMore] = useState(false);
    const isPro = plan.name.toLowerCase().includes('pro');
    const price = billingCycle === 'yearly' ? plan.yearly_price : plan.monthly_price;

    const features = plan.features as any;
    let displayFeatures: string[] = [];

    if (Array.isArray(features)) {
        features.forEach(f => {
            if (typeof f === 'string') displayFeatures.push(f);
            else if (typeof f === 'object' && f !== null) {
                Object.keys(f).forEach(k => {
                    if (f[k] === true || f[k] === 1 || f[k] === '1') displayFeatures.push(k);
                });
            }
        });
    } else if (typeof features === 'object' && features !== null) {
        Object.keys(features).forEach(k => {
            if (features[k] === true || features[k] === 1 || features[k] === '1') displayFeatures.push(k);
        });
    }

    const visibleFeatures = showMore ? displayFeatures : displayFeatures.slice(0, 5);
    const hasMore = displayFeatures.length > 5;

    return (
        <Card
            className={cn(
                "p-6 rounded-3xl border-2 transition-all cursor-pointer group hover:scale-[1.02]",
                isPro ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" : "border-slate-100"
            )}
            onClick={() => !processing && onSelect(plan.id)}
        >
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <h5 className="font-black uppercase tracking-tighter text-lg">{plan.name}</h5>
                    {isPro && <Badge className="bg-primary text-[8px] animate-pulse whitespace-nowrap">RECOMENDADO</Badge>}
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black">{formatCurrency(price)}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">/{billingCycle === 'monthly' ? 'mes' : 'año'}</span>
                </div>

                <ul >
                    {visibleFeatures.map((feature, i) => {
                        const isExcluded = feature.startsWith('-');
                        const cleanFeature = isExcluded ? feature.substring(1) : feature;
                        const label = (MODULE_LABELS as any)[cleanFeature] || cleanFeature;

                        return (
                            <li key={i} className={cn(
                                "flex items-center gap-2 text-[11px] font-medium text-left",
                                isExcluded ? "text-slate-300 line-through" : "text-slate-600"
                            )}>
                                <Check className={cn("w-3 h-3 shrink-0", isExcluded ? "text-slate-200" : "text-green-500")} />
                                <span className="flex-1">{label}</span>
                            </li>
                        );
                    })}
                </ul>

                {hasMore && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMore(!showMore);
                        }}
                        className="w-full text-center text-[10px] font-black text-primary uppercase tracking-tight hover:underline flex items-center justify-center gap-1"
                    >
                        {showMore ? "Ver menos" : `Ver ${displayFeatures.length - 5} más`}
                    </button>
                )}

                <Button
                    className={cn(
                        isPro ? "bg-primary text-white" : "w-full"
                    )}
                    disabled={processing}
                >
                    {processing ? 'Procesando...' : 'Seleccionar Plan'}
                </Button>
            </div>
        </Card>
    );
}
