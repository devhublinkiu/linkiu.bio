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
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    Loader2,
    CheckCircle2
} from 'lucide-react';

interface Props {
    onboardingData: any;
    siteSettings?: {
        app_name: string;
        logo_url: string | null;
    };
}

export default function Step2({ onboardingData, siteSettings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        owner_name: onboardingData?.owner_name || '',
        owner_email: onboardingData?.owner_email || '',
        owner_password: '',
        owner_password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [emailValidating, setEmailValidating] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);

    // Debounce for email validation
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (data.owner_email && data.owner_email.includes('@')) {
                setEmailValidating(true);
                setEmailError(null);
                try {
                    const response = await axios.post(route('onboarding.validate'), {
                        field: 'owner_email',
                        value: data.owner_email
                    });
                    if (!response.data.valid) {
                        setEmailError(response.data.message);
                    }
                } catch (e) {
                    console.error('Validation error', e);
                } finally {
                    setEmailValidating(false);
                }
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [data.owner_email]);

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();

        if (emailError) {
            toast.error(emailError);
            return;
        }

        if (data.owner_password !== data.owner_password_confirmation) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        post(route('onboarding.step2.store'), {
            onError: (err) => {
                const msg = Object.values(err)[0];
                toast.error(typeof msg === 'string' ? msg : 'Revisa los campos marcados');
            }
        });
    };

    return (
        <OnboardingLayout
            currentStep={2}
            siteSettings={siteSettings}
            title="Crea tu cuenta | Linkiu"
        >
            <div className="max-w-xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <Badge variant="outline" className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary">
                        <User className="w-3.5 h-3.5 mr-2" />
                        Paso 2: Tu Cuenta
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                        Crea tu <span className="text-primary">Perfil</span>
                    </h1>
                    <p className="text-slate-500">
                        Ingresa tus datos para gestionar tu tienda desde cualquier lugar.
                    </p>
                </div>

                {/* Form Card */}
                <form onSubmit={handleContinue} className="space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="owner_name" className="text-sm font-bold text-slate-700 ml-1">
                                Nombre completo
                            </Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <Input
                                    id="owner_name"
                                    placeholder="Ej: Juan Pérez"
                                    className={cn(
                                        "h-14 pl-12 rounded-2xl border-slate-200 transition-all focus:ring-4 focus:ring-primary/10",
                                        errors.owner_name && "border-destructive ring-destructive/10"
                                    )}
                                    value={data.owner_name}
                                    onChange={e => setData('owner_name', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.owner_name && <p className="text-destructive text-xs font-medium ml-1">{errors.owner_name}</p>}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="owner_email" className="text-sm font-bold text-slate-700 ml-1">
                                Correo electrónico
                            </Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <Input
                                    id="owner_email"
                                    type="email"
                                    placeholder="tunombre@ejemplo.com"
                                    className={cn(
                                        "h-14 pl-12 pr-12 rounded-2xl border-slate-200 transition-all focus:ring-4 focus:ring-primary/10",
                                        (errors.owner_email || emailError) && "border-destructive ring-destructive/10"
                                    )}
                                    value={data.owner_email}
                                    onChange={e => setData('owner_email', e.target.value)}
                                    required
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                                    {emailValidating ? (
                                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                    ) : data.owner_email && !emailError && (
                                        <CheckCircle2 className="w-5 h-5 text-green-500 animate-in zoom-in" />
                                    )}
                                </div>
                            </div>
                            {(errors.owner_email || emailError) && (
                                <p className="text-destructive text-xs font-medium ml-1">
                                    {errors.owner_email || emailError}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="owner_password" className="text-sm font-bold text-slate-700 ml-1">
                                    Contraseña
                                </Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="owner_password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className={cn(
                                            "h-14 pl-12 pr-10 rounded-2xl border-slate-200 transition-all focus:ring-4 focus:ring-primary/10",
                                            errors.owner_password && "border-destructive ring-destructive/10"
                                        )}
                                        value={data.owner_password}
                                        onChange={e => setData('owner_password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="owner_password_confirmation" className="text-sm font-bold text-slate-700 ml-1">
                                    Confirmar
                                </Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="owner_password_confirmation"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className={cn(
                                            "h-14 pl-12 rounded-2xl border-slate-200 transition-all focus:ring-4 focus:ring-primary/10",
                                            data.owner_password && data.owner_password !== data.owner_password_confirmation && "border-destructive"
                                        )}
                                        value={data.owner_password_confirmation}
                                        onChange={e => setData('owner_password_confirmation', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security Note */}
                        <div className="pt-4 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Usamos encriptación de grado bancario para proteger tus datos. Tu privacidad es nuestra prioridad número uno.
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <Link
                            href={route('onboarding.step1')}
                            className="flex items-center text-sm font-bold text-slate-400 hover:text-primary transition-colors group"
                        >
                            <ChevronLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Volver a industrias
                        </Link>

                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">Paso 2 de 3</span>
                            <Button
                                type="submit"
                                size="lg"
                                disabled={processing || emailValidating}
                                className="h-14 px-10 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all active:scale-95"
                            >
                                {processing ? 'Guardando...' : 'Crear Cuenta'}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </OnboardingLayout>
    );
}
