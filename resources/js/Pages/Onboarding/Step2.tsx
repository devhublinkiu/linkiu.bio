import { Head, useForm, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { route } from 'ziggy-js';

// ShadCN Components
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Separator } from '@/Components/ui/separator';
import { Badge } from '@/Components/ui/badge';
import OnboardingLayout from '@/Layouts/OnboardingLayout';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";
import { Textarea } from "@/Components/ui/textarea";

// Lucide Icons
import {
    ShoppingBag,
    ArrowRight,
    ChevronLeft,
    CheckCircle2,
    Store,
    Globe,
    MessageCircle,
    Loader2,
    Shield,
    Mail,
    MapPin,
    FileText,
    Lock
} from 'lucide-react';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator
} from '@/Components/ui/input-otp';

interface Plan {
    id: number;
    name: string;
    allow_custom_slug: boolean;
}

interface Props {
    onboardingData: any;
    plan?: Plan;
    siteSettings?: {
        app_name: string;
        logo_url: string | null;
    };
}

export default function Step2({ onboardingData, plan, siteSettings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        tenant_name: onboardingData?.tenant_name || '',
        slug: onboardingData?.slug || '',
        owner_phone: onboardingData?.owner_phone || '',
        owner_country_code: onboardingData?.owner_country_code || '57',
        fiscal_regime: onboardingData?.fiscal_regime || 'Responsable de IVA',
        doc_type: onboardingData?.doc_type || 'NIT',
        doc_number: onboardingData?.doc_number || '',
        doc_dv: onboardingData?.doc_dv || '',
        is_address_same: onboardingData?.is_address_same !== undefined ? onboardingData.is_address_same : true,
        fiscal_address: onboardingData?.fiscal_address || '',
        public_email: onboardingData?.public_email || '',
    });

    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpLoading, setIsOtpLoading] = useState(false);

    const allowCustomSlug = plan?.allow_custom_slug ?? true;

    // Helper to generate a unique random slug
    const generateRandomSlug = (name: string) => {
        const base = name.toLowerCase().replace(/[^\w]/g, '').substring(0, 10);
        if (!base) return '';
        const random = Math.random().toString(36).substring(2, 6);
        if (base.length <= 4) return base + random;
        return base.substring(0, 2) + random + base.substring(base.length - 4);
    };

    // Auto-generate slug from tenant name
    useEffect(() => {
        if (data.tenant_name && !onboardingData?.slug) {
            if (allowCustomSlug) {
                const generatedSlug = data.tenant_name
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                setData('slug', generatedSlug);
            } else {
                setData('slug', generateRandomSlug(data.tenant_name));
            }
        }
    }, [data.tenant_name, allowCustomSlug]);

    // State for real-time validation
    const [validating, setValidating] = useState<Record<string, boolean>>({});
    const [validationErrors, setValidationErrors] = useState<Record<string, string | null>>({});

    // Persistence Logic
    const STORAGE_KEY = 'onboarding_step2_data';

    // Load from local storage on mount
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Merge saved data with current data, respecting server data if needed but prioritization user input
                // If server data is present (e.g. editing), usually we want that, unless user typed something new.
                // Simple merge: Saved overwrites initial server state if present, ensuring recovery.
                setData(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error('Error loading saved data', e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    // Debounce function
    const useDebounce = (value: string, delay: number) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);
            return () => clearTimeout(handler);
        }, [value, delay]);
        return debouncedValue;
    };

    const debouncedName = useDebounce(data.tenant_name, 500);
    const debouncedSlug = useDebounce(data.slug, 500);
    const debouncedEmail = useDebounce(data.public_email, 500);

    const validateField = async (field: string, value: string) => {
        if (!value) return;

        setValidating(prev => ({ ...prev, [field]: true }));
        setValidationErrors(prev => ({ ...prev, [field]: null }));

        try {
            const response = await axios.post(route('onboarding.validate'), { field, value });
            if (!response.data.valid) {
                setValidationErrors(prev => ({ ...prev, [field]: response.data.message }));
            }
        } catch (error) {
            console.error('Validation error:', error);
        } finally {
            setValidating(prev => ({ ...prev, [field]: false }));
        }
    };

    // Effect for validating Name
    useEffect(() => {
        if (debouncedName) validateField('tenant_name', debouncedName);
    }, [debouncedName]);

    // Effect for validating Slug
    useEffect(() => {
        if (debouncedSlug && allowCustomSlug) validateField('slug', debouncedSlug);
    }, [debouncedSlug]);

    // Effect for validating Email
    useEffect(() => {
        if (debouncedEmail) validateField('public_email', debouncedEmail);
    }, [debouncedEmail]);

    const handleSendOtp = async () => {
        if (!data.owner_phone) {
            toast.error('Ingresa tu número de WhatsApp');
            return;
        }

        setIsVerifying(true);
        setIsOtpLoading(true);
        setOtp('');
        try {
            await axios.post(route('auth.whatsapp.send'), {
                phone: data.owner_phone,
                country_code: data.owner_country_code
            });
            setOtpSent(true);
            toast.success('Código enviado a tu WhatsApp');
        } catch (error) {
            toast.error('Error al enviar el código. Intenta de nuevo.');
            setIsVerifying(false);
        } finally {
            setIsOtpLoading(false);
        }
    };

    const handleVerifyOtp = async (codeToVerify?: string) => {
        const finalCode = codeToVerify || otp;
        if (finalCode.length < 6) {
            toast.error('Ingresa el código de 6 dígitos');
            return;
        }

        setIsOtpLoading(true);
        try {
            await axios.post(route('auth.whatsapp.verify'), {
                phone: data.owner_phone,
                country_code: data.owner_country_code,
                code: finalCode
            });
            setIsVerified(true);
            setIsVerifying(false);
            toast.success('WhatsApp verificado correctamente');
        } catch (error) {
            toast.error('Código incorrecto. Verifica e intenta de nuevo.');
        } finally {
            setIsOtpLoading(false);
        }
    };

    // Auto-verify when OTP reaches 6 digits
    useEffect(() => {
        if (otp.length === 6) {
            handleVerifyOtp(otp);
        }
    }, [otp]);

    const handleContinue = () => {
        if (!data.tenant_name || !data.slug) {
            toast.error('Completa los campos obligatorios');
            return;
        }

        // Block if there are validation errors
        if (Object.values(validationErrors).some(err => err !== null)) {
            toast.error('Corrige los errores antes de continuar');
            return;
        }

        post(route('onboarding.step2.store'), {
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(typeof firstError === 'string' ? firstError : 'Revisa los campos marcados');
            },
            onSuccess: () => {
                // Clear storage on success
                localStorage.removeItem(STORAGE_KEY);
            }
        });
    };

    return (
        <OnboardingLayout
            currentStep={2}
            siteSettings={siteSettings}
            title="Paso 2 - Datos del Negocio | Linkiu"
        >
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 max-w-5xl mx-auto px-4 md:px-24">
                <div className="text-center mb-10">
                    <Badge variant="secondary" className="mb-4">Paso 3 de 4</Badge>
                    <h2 className="text-3xl font-bold tracking-tight mb-3">
                        Cuéntanos sobre tu negocio
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Personaliza la identidad de tu tienda en segundos
                    </p>
                </div>

                <Card className="border-border shadow-sm overflow-hidden bg-card">
                    <CardHeader className="bg-muted/40 border-b pb-6">
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Store className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Información del Negocio</CardTitle>
                                <CardDescription>Configura la identidad pública y fiscal de tu tienda</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Business Name */}
                            <div className="space-y-2">
                                <Label htmlFor="tenant_name">
                                    Nombre del Negocio (Público)
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="tenant_name"
                                        placeholder="linkiuecomm"
                                        className={cn((errors.tenant_name || validationErrors.tenant_name) && "border-destructive")}
                                        value={data.tenant_name}
                                        onChange={e => {
                                            setData('tenant_name', e.target.value);
                                            setValidationErrors(prev => ({ ...prev, tenant_name: null }));
                                        }}
                                    />
                                    {validating.tenant_name && (
                                        <div className="absolute right-3 top-2.5">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        </div>
                                    )}
                                </div>
                                {(errors.tenant_name || validationErrors.tenant_name) && (
                                    <p className="text-destructive text-xs font-medium">
                                        {errors.tenant_name || validationErrors.tenant_name}
                                    </p>
                                )}
                            </div>

                            {/* Store URL (Slug) */}
                            <div className="space-y-2">
                                <Label htmlFor="slug">
                                    Slug (URL)
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-[7px] flex items-center gap-1 text-muted-foreground">
                                        <span className="text-sm font-medium">linkiu.bio/</span>
                                    </div>
                                    <Input
                                        id="slug"
                                        placeholder="mi-tienda"
                                        className={cn(
                                            "pl-[72px] font-medium",
                                            !allowCustomSlug && "text-muted-foreground bg-muted",
                                            (errors.slug || validationErrors.slug) && "border-destructive"
                                        )}
                                        value={data.slug}
                                        onChange={e => {
                                            if (allowCustomSlug) {
                                                setData('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'));
                                                setValidationErrors(prev => ({ ...prev, slug: null }));
                                            }
                                        }}
                                        disabled={!allowCustomSlug}
                                    />
                                    <div className="absolute right-3 top-2.5 flex items-center gap-2">
                                        {validating.slug ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        ) : !allowCustomSlug ? (
                                            <Lock className="w-4 h-4 text-muted-foreground" />
                                        ) : (
                                            data.slug && !validationErrors.slug && (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            )
                                        )}
                                    </div>
                                </div>
                                {!allowCustomSlug ? (
                                    <p className="text-[11px] text-orange-600 font-medium">
                                        • Este plan no cuenta con slug personalizado
                                    </p>
                                ) : (
                                    <p className="text-[11px] text-muted-foreground">
                                        Usa este nombre para tu marca
                                    </p>
                                )}
                                {(errors.slug || validationErrors.slug) && (
                                    <p className="text-destructive text-xs font-medium">
                                        {errors.slug || validationErrors.slug}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Fiscal Regime */}
                            <div className="space-y-2">
                                <Label>Régimen Fiscal</Label>
                                <Select value={data.fiscal_regime} onValueChange={v => setData('fiscal_regime', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona régimen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Responsable de IVA">Responsable de IVA</SelectItem>
                                        <SelectItem value="No Responsable de IVA">No Responsable de IVA</SelectItem>
                                        <SelectItem value="Régimen Simple">Régimen Simple</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.fiscal_regime && <p className="text-destructive text-xs font-medium">{errors.fiscal_regime}</p>}
                            </div>

                            {/* Document Info */}
                            <div className="grid grid-cols-12 gap-2">
                                <div className="col-span-4 space-y-2">
                                    <Label>Doc</Label>
                                    <Select value={data.doc_type} onValueChange={v => setData('doc_type', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NIT">NIT</SelectItem>
                                            <SelectItem value="CC">CC</SelectItem>
                                            <SelectItem value="CE">CE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-6 space-y-2">
                                    <Label>Número</Label>
                                    <Input
                                        placeholder="1002493883"
                                        value={data.doc_number}
                                        onChange={e => setData('doc_number', e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>DV</Label>
                                    <Input
                                        placeholder="1"
                                        className="text-center px-1"
                                        maxLength={1}
                                        value={data.doc_dv}
                                        onChange={e => setData('doc_dv', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Fiscal Address */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_address_same"
                                    checked={data.is_address_same}
                                    onCheckedChange={(checked) => setData('is_address_same', checked as boolean)}
                                />
                                <label
                                    htmlFor="is_address_same"
                                    className="text-sm font-medium leading-none cursor-pointer"
                                >
                                    Usar la misma dirección del propietario
                                </label>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fiscal_address">
                                    Dirección Fiscal
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="fiscal_address"
                                        placeholder="Ej: Calle 11A #25-19 BQ 30 Apto 201"
                                        className={cn(data.is_address_same && "bg-muted")}
                                        value={data.fiscal_address}
                                        onChange={e => setData('fiscal_address', e.target.value)}
                                        disabled={data.is_address_same}
                                    />
                                    <Shield className="absolute right-3 top-2.5 w-5 h-5 text-primary/60" />
                                </div>
                                {errors.fiscal_address && <p className="text-destructive text-xs font-medium">{errors.fiscal_address}</p>}
                            </div>
                        </div>

                        {/* Public Email */}
                        <div className="space-y-2">
                            <Label htmlFor="public_email">
                                Email de Contacto (Público)
                            </Label>
                            <div className="relative">
                                <Input
                                    id="public_email"
                                    type="email"
                                    placeholder="linkiucloud@gmail.com"
                                    value={data.public_email}
                                    className={cn(
                                        "pr-10",
                                        (errors.public_email || validationErrors.public_email) && "border-destructive"
                                    )}
                                    onChange={e => {
                                        setData('public_email', e.target.value);
                                        setValidationErrors(prev => ({ ...prev, public_email: null }));
                                    }}
                                />
                                <div className="absolute right-3 top-2.5 flex items-center gap-2">
                                    {validating.public_email ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    ) : (
                                        data.public_email && !validationErrors.public_email && !errors.public_email && (
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        )
                                    )}
                                </div>
                            </div>
                            {(errors.public_email || validationErrors.public_email) && (
                                <p className="text-destructive text-xs font-medium">
                                    {errors.public_email || validationErrors.public_email}
                                </p>
                            )}
                        </div>

                        {/* WhatsApp Independent Section */}
                        <div className="pt-6 border-t border-border">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="text-sm font-bold">Verificación de WhatsApp</h4>
                                    <p className="text-xs text-muted-foreground">Esencial para recibir notificaciones de pedidos</p>
                                </div>
                                {isVerified && (
                                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Verificado
                                    </Badge>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <div className="w-[100px]">
                                    <Select
                                        value={data.owner_country_code || '57'}
                                        onValueChange={v => setData('owner_country_code', v)}
                                        disabled={isVerified}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="País" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="57">🇨🇴 +57</SelectItem>
                                            <SelectItem value="1">🇺🇸 +1</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="relative flex-1">
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="300 123 4567"
                                        value={data.owner_phone}
                                        onChange={e => setData('owner_phone', e.target.value)}
                                        disabled={isVerified}
                                    />
                                </div>
                                {!isVerified && (
                                    <Button
                                        type="button"
                                        variant="default"
                                        className="px-6"
                                        onClick={handleSendOtp}
                                    >
                                        Verificar Ahora
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100 flex items-start gap-3">
                            <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-700 leading-relaxed">
                                Toda la información proporcionada está protegida por nuestra política de privacidad. Los datos fiscales se utilizarán exclusivamente para la emisión de facturas y cumplimiento legal.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Navigation Footer */}
                <div className="mt-12 flex justify-between items-center bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <Link
                        href={route('onboarding.step1')}
                        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Volver a planes
                    </Link>

                    <Button
                        size="lg"
                        onClick={handleContinue}
                        disabled={processing}
                        className="font-bold shadow-lg"
                    >
                        {processing ? 'Guardando...' : 'Último paso'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>

            {/* WhatsApp Verification Dialog */}
            <Dialog open={isVerifying} onOpenChange={setIsVerifying}>
                <DialogContent className="sm:max-w-md p-8 z-[100]">
                    <DialogHeader className="text-center space-y-4">
                        <div className="mx-auto h-16 w-16 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <MessageCircle className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-2xl font-bold">Verifica tu WhatsApp</DialogTitle>
                        <DialogDescription className="text-base text-muted-foreground">
                            {otpSent
                                ? `Ingresa el código que enviamos al +${data.owner_country_code} ${data.owner_phone}`
                                : `Enviaremos un código de seguridad al +${data.owner_country_code} ${data.owner_phone} vía WhatsApp.`}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6">
                        {otpSent ? (
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <InputOTP
                                        maxLength={6}
                                        value={otp}
                                        onChange={(value) => setOtp(value)}
                                        autoFocus
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} className="w-12 h-14 text-2xl" />
                                            <InputOTPSlot index={1} className="w-12 h-14 text-2xl" />
                                            <InputOTPSlot index={2} className="w-12 h-14 text-2xl" />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} className="w-12 h-14 text-2xl" />
                                            <InputOTPSlot index={4} className="w-12 h-14 text-2xl" />
                                            <InputOTPSlot index={5} className="w-12 h-14 text-2xl" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                <p className="text-center text-xs text-muted-foreground">
                                    Ingresa los 6 dígitos enviados
                                </p>
                                <Button
                                    variant="link"
                                    className="w-full text-sm font-medium"
                                    onClick={() => setOtpSent(false)}
                                >
                                    ¿Número incorrecto? Cambiar
                                </Button>
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground text-sm italic">
                                Al continuar, recibirás un mensaje automático.
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button
                            className="w-full"
                            onClick={otpSent ? () => handleVerifyOtp() : handleSendOtp}
                            disabled={isOtpLoading}
                        >
                            {isOtpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {otpSent ? 'Confirmar Código' : 'Enviar Código WhatsApp'}
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => setIsVerifying(false)}
                        >
                            Cancelar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </OnboardingLayout>
    );

}
