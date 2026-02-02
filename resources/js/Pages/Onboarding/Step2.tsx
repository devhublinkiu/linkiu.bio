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

        post(route('onboarding.step2.store'), {
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(typeof firstError === 'string' ? firstError : 'Revisa los campos marcados');
            }
        });
    };

    return (
        <>
            <Head title="Paso 2 - Datos del Negocio | Linkiu" />

            <div className="min-h-screen bg-slate-50/50">
                {/* Header - 3/4 Progress */}
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
                                            step === 3 ? "w-8 bg-primary" :
                                                step < 3 ? "w-2 bg-primary" : "w-2 bg-gray-200"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-3xl mx-auto px-6 py-12">
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <div className="text-center mb-10">
                            <Badge variant="secondary" className="mb-4">Paso 3 de 4</Badge>
                            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                                Cuéntanos sobre tu negocio
                            </h2>
                            <p className="text-lg text-gray-500">
                                Personaliza la identidad de tu tienda en segundos
                            </p>
                        </div>

                        <Card className="border-gray-100 shadow-sm overflow-hidden bg-white">
                            <CardHeader className="bg-gray-50/50 border-b pb-6">
                                <div className="flex items-center gap-2">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Store className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg text-indigo-950">Información del Negocio</CardTitle>
                                        <CardDescription>Configura la identidad pública y fiscal de tu tienda</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8 space-y-8">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Business Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="tenant_name" className="text-[13px] font-semibold text-indigo-950">
                                            Nombre del Negocio (Público)
                                        </Label>
                                        <Input
                                            id="tenant_name"
                                            placeholder="linkiuecomm"
                                            className={cn("h-10 border-gray-200", errors.tenant_name && "border-red-500")}
                                            value={data.tenant_name}
                                            onChange={e => setData('tenant_name', e.target.value)}
                                        />
                                        {errors.tenant_name && <p className="text-red-500 text-xs font-medium">{errors.tenant_name}</p>}
                                    </div>

                                    {/* Store URL (Slug) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="slug" className="text-[13px] font-semibold text-indigo-950">
                                            Slug (URL)
                                        </Label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-2.5 flex items-center gap-1 text-gray-400">
                                                <span className="text-sm font-medium">linkiu.bio/</span>
                                            </div>
                                            <Input
                                                id="slug"
                                                placeholder="mi-tienda"
                                                className={cn("pl-[72px] h-10 font-medium border-gray-200 bg-gray-50/50", !allowCustomSlug && "text-gray-400", errors.slug && "border-red-500")}
                                                value={data.slug}
                                                onChange={e => allowCustomSlug && setData('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                                disabled={!allowCustomSlug}
                                            />
                                            {!allowCustomSlug && <Lock className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />}
                                        </div>
                                        {!allowCustomSlug ? (
                                            <p className="text-[11px] text-orange-600 font-medium">
                                                • Este plan no cuenta con slug personalizado
                                            </p>
                                        ) : (
                                            <p className="text-[11px] text-gray-400">
                                                Usa este nombre para tu marca
                                            </p>
                                        )}
                                        {errors.slug && <p className="text-red-500 text-xs font-medium">{errors.slug}</p>}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Fiscal Regime */}
                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-semibold text-indigo-950">Régimen Fiscal</Label>
                                        <Select value={data.fiscal_regime} onValueChange={v => setData('fiscal_regime', v)}>
                                            <SelectTrigger className="h-10 border-gray-200">
                                                <SelectValue placeholder="Selecciona régimen" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Responsable de IVA">Responsable de IVA</SelectItem>
                                                <SelectItem value="No Responsable de IVA">No Responsable de IVA</SelectItem>
                                                <SelectItem value="Régimen Simple">Régimen Simple</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.fiscal_regime && <p className="text-red-500 text-xs font-medium">{errors.fiscal_regime}</p>}
                                    </div>

                                    {/* Document Info */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <div className="col-span-4 space-y-2">
                                            <Label className="text-[13px] font-semibold text-indigo-950">Doc</Label>
                                            <Select value={data.doc_type} onValueChange={v => setData('doc_type', v)}>
                                                <SelectTrigger className="h-10 border-gray-200">
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
                                            <Label className="text-[13px] font-semibold text-indigo-950">Número</Label>
                                            <Input
                                                placeholder="1002493883"
                                                className="h-10 border-gray-200"
                                                value={data.doc_number}
                                                onChange={e => setData('doc_number', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label className="text-[13px] font-semibold text-indigo-950">DV</Label>
                                            <Input
                                                placeholder="1"
                                                className="h-10 border-gray-200 text-center px-1"
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
                                            className="border-indigo-600 data-[state=checked]:bg-indigo-600"
                                            checked={data.is_address_same}
                                            onCheckedChange={(checked) => setData('is_address_same', checked as boolean)}
                                        />
                                        <label
                                            htmlFor="is_address_same"
                                            className="text-sm font-medium leading-none cursor-pointer text-indigo-950"
                                        >
                                            Usar la misma dirección del propietario
                                        </label>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fiscal_address" className="text-[13px] font-semibold text-indigo-950">
                                            Dirección Fiscal
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="fiscal_address"
                                                placeholder="Ej: Calle 11A #25-19 BQ 30 Apto 201"
                                                className={cn("h-10 border-gray-200", data.is_address_same && "bg-gray-50/50")}
                                                value={data.fiscal_address}
                                                onChange={e => setData('fiscal_address', e.target.value)}
                                                disabled={data.is_address_same}
                                            />
                                            <Shield className="absolute right-3 top-2.5 w-5 h-5 text-indigo-600" />
                                        </div>
                                        {errors.fiscal_address && <p className="text-red-500 text-xs font-medium">{errors.fiscal_address}</p>}
                                    </div>
                                </div>

                                {/* Public Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="public_email" className="text-[13px] font-semibold text-indigo-950">
                                        Email de Contacto (Público)
                                    </Label>
                                    <Input
                                        id="public_email"
                                        type="email"
                                        placeholder="linkiucloud@gmail.com"
                                        className="h-10 border-gray-200"
                                        value={data.public_email}
                                        onChange={e => setData('public_email', e.target.value)}
                                    />
                                    {errors.public_email && <p className="text-red-500 text-xs font-medium">{errors.public_email}</p>}
                                </div>

                                {/* WhatsApp Independent Section */}
                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">Verificación de WhatsApp</h4>
                                            <p className="text-xs text-gray-500">Esencial para recibir notificaciones de pedidos</p>
                                        </div>
                                        {isVerified && (
                                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20 px-3 py-1">
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
                                                <SelectTrigger className="h-10 border-gray-200">
                                                    <SelectValue placeholder="País" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="57">🇨🇴 +57</SelectItem>
                                                    <SelectItem value="1">🇺🇸 +1</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="relative flex-1">
                                            <MessageCircle className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="300 123 4567"
                                                className="pl-10 h-10 border-gray-200"
                                                value={data.owner_phone}
                                                onChange={e => setData('owner_phone', e.target.value)}
                                                disabled={isVerified}
                                            />
                                        </div>
                                        {!isVerified && (
                                            <Button
                                                type="button"
                                                className="h-10 px-6 bg-indigo-950 hover:bg-indigo-900 border-none text-white font-semibold shadow-md transition-all active:scale-95"
                                                onClick={handleSendOtp}
                                            >
                                                Verificar Ahora
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100/50 flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-indigo-700 leading-relaxed">
                                        Toda la información proporcionada está protegida por nuestra política de privacidad. Los datos fiscales se utilizarán exclusivamente para la emisión de facturas y cumplimiento legal.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Navigation Footer */}
                        <div className="mt-12 flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <Link
                                href={route('onboarding.step1')}
                                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-4 py-2"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Volver a planes
                            </Link>

                            <Button
                                size="lg"
                                onClick={handleContinue}
                                disabled={processing}
                                className="bg-primary hover:bg-primary/90 px-8 h-12 text-base font-bold shadow-indigo-100 shadow-xl"
                            >
                                {processing ? 'Guardando...' : 'Último paso'}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </main>

                {/* WhatsApp Verification Dialog */}
                <Dialog open={isVerifying} onOpenChange={setIsVerifying}>
                    <DialogContent className="sm:max-w-md p-8">
                        <DialogHeader className="text-center space-y-4">
                            <div className="mx-auto h-16 w-16 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <MessageCircle className="w-8 h-8" />
                            </div>
                            <DialogTitle className="text-2xl font-bold">Verifica tu WhatsApp</DialogTitle>
                            <DialogDescription className="text-base text-gray-500">
                                {otpSent
                                    ? `Ingresa el código que enviamos al +${data.owner_country_code} ${data.owner_phone}`
                                    : `Enviaremos un código de seguridad al +${data.owner_country_code} ${data.owner_phone} vía WhatsApp.`}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-6">
                            {otpSent ? (
                                <div className="space-y-4">
                                    <Input
                                        placeholder="000000"
                                        className="text-center text-3xl h-16 tracking-[1em] font-bold border-gray-200 bg-gray-50/50"
                                        maxLength={6}
                                        value={otp}
                                        onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                        autoFocus
                                    />
                                    <p className="text-center text-xs text-muted-foreground">
                                        Ingresa los 6 dígitos enviados
                                    </p>
                                    <Button
                                        variant="link"
                                        className="w-full text-sm text-indigo-600 font-medium"
                                        onClick={() => setOtpSent(false)}
                                    >
                                        ¿Número incorrecto? Cambiar
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 text-sm italic">
                                    Al continuar, recibirás un mensaje automático.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                className="w-full h-12 text-base font-bold bg-green-600 hover:bg-green-700 text-white"
                                onClick={otpSent ? () => handleVerifyOtp() : handleSendOtp}
                                disabled={isOtpLoading}
                            >
                                {isOtpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {otpSent ? 'Confirmar Código' : 'Enviar Código WhatsApp'}
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full h-11"
                                onClick={() => setIsVerifying(false)}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
