import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { route } from 'ziggy-js';
import OnboardingLayout from '@/Layouts/OnboardingLayout';

// ShadCN Components
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Badge } from '@/Components/ui/badge';

// Lucide Icons
import {
    ArrowRight,
    ChevronLeft,
    Store,
    Link as LinkIcon,
    RefreshCw,
    CheckCircle2,
    Loader2,
    Sparkles,
    Globe
} from 'lucide-react';

interface Props {
    onboardingData: any;
    siteSettings?: {
        app_name: string;
        logo_url: string | null;
    };
}

export default function Step3({ onboardingData, siteSettings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        tenant_name: onboardingData?.tenant_name || '',
        slug: onboardingData?.slug || '',
    });

    const [isValidating, setIsValidating] = useState(false);
    const [slugError, setSlugError] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [randomId, setRandomId] = useState(() => Math.floor(1000 + Math.random() * 9000));

    // Pure helper to convert string to slug
    const toSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    };

    // Slug generation logic with random part (for the helper button)
    const generateSlugWithNewId = (name: string) => {
        const newId = Math.floor(1000 + Math.random() * 9000);
        setRandomId(newId);
        const base = toSlug(name);
        return base ? `${base}-${newId}` : `tienda-${newId}`;
    };

    // Remove the old useEffect that only ran once
    // We'll handle sync in the onChange for better control

    // Validate slug in real-time
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (data.slug) {
                setIsValidating(true);
                setSlugError(null);
                try {
                    const response = await axios.post(route('onboarding.validate'), {
                        field: 'slug',
                        value: data.slug
                    });
                    if (!response.data.valid) {
                        setSlugError(response.data.message);
                    }
                } catch (e) {
                    console.error('Validation error', e);
                } finally {
                    setIsValidating(false);
                }
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [data.slug]);

    const handleComplete = (e: React.FormEvent) => {
        e.preventDefault();

        if (slugError) {
            toast.error(slugError);
            return;
        }

        post(route('onboarding.complete'), {
            onError: (err) => {
                const msg = Object.values(err)[0];
                toast.error(typeof msg === 'string' ? msg : 'Revisa los datos de tu tienda');
            }
        });
    };

    return (
        <OnboardingLayout
            currentStep={3}
            siteSettings={siteSettings}
            title="Nombra tu tienda | Linkiu"
        >
            <div className="max-w-xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <Badge variant="outline" className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary">
                        <Sparkles className="w-3.5 h-3.5 mr-2" />
                        Paso 3: Identidad
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                        ¿Cómo se llama tu <span className="text-primary">Negocio</span>?
                    </h1>
                    <p className="text-slate-500">
                        Este será el nombre público de tu tienda y tu dirección web única.
                    </p>
                </div>

                {/* Form Card */}
                <form onSubmit={handleComplete} className="space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
                        {/* Tenant Name */}
                        <div className="space-y-2">
                            <Label htmlFor="tenant_name" className="text-sm font-bold text-slate-700 ml-1">
                                Nombre de la Tienda
                            </Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Store className="w-5 h-5" />
                                </div>
                                <Input
                                    id="tenant_name"
                                    placeholder="Ej: Deluxe Burger"
                                    className={cn(
                                        "h-14 pl-12 rounded-2xl border-slate-200 transition-all focus:ring-4 focus:ring-primary/10 font-medium",
                                        errors.tenant_name && "border-destructive ring-destructive/10"
                                    )}
                                    value={data.tenant_name}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (!isDirty) {
                                            const base = toSlug(val);
                                            setData({
                                                ...data,
                                                tenant_name: val,
                                                slug: base ? `${base}-${randomId}` : ''
                                            });
                                        } else {
                                            setData('tenant_name', val);
                                        }
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Slug Field (The URL) */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="slug" className="text-sm font-bold text-slate-700">
                                    Tu dirección web (Link)
                                </Label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsDirty(true);
                                        setData('slug', generateSlugWithNewId(data.tenant_name));
                                    }}
                                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                    Generar otro
                                </button>
                            </div>

                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm flex items-center gap-1">
                                    <Globe className="w-4 h-4" />
                                    <span>linkiu.bio/</span>
                                </div>
                                <Input
                                    id="slug"
                                    className={cn(
                                        "h-14 pl-[105px] pr-12 rounded-2xl border-slate-200 transition-all focus:ring-4 focus:ring-primary/10 font-bold text-primary",
                                        (errors.slug || slugError) && "border-destructive ring-destructive/10"
                                    )}
                                    value={data.slug}
                                    onChange={e => {
                                        setIsDirty(true);
                                        setData('slug', e.target.value.toLowerCase().replace(/ /g, '-'));
                                    }}
                                    required
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {isValidating ? (
                                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                    ) : data.slug && !slugError && (
                                        <CheckCircle2 className="w-5 h-5 text-green-500 animate-in zoom-in" />
                                    )}
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-400 ml-1 leading-normal">
                                {slugError
                                    ? <span className="text-destructive font-medium">{slugError}</span>
                                    : "Puedes personalizar este link ahora o cambiarlo más tarde desde tu panel."
                                }
                            </p>
                        </div>

                        {/* Social Proof / Trust */}
                        <div className="pt-4 flex items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all">
                            <div className="flex items-center gap-1.5 text-xs font-bold">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                SSL Seguro
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                CDN Ultra Rápido
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <Link
                            href={route('onboarding.step2')}
                            className="flex items-center text-sm font-bold text-slate-400 hover:text-primary transition-colors group"
                        >
                            <ChevronLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Volver a cuenta
                        </Link>

                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">¡Casi listo!</span>
                            <Button
                                type="submit"
                                size="lg"
                                disabled={processing || isValidating}
                                className="h-14 px-10 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all active:scale-95 group"
                            >
                                {processing ? 'Finalizando...' : 'Empezar ahora'}
                                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </OnboardingLayout>
    );
}
