import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { route } from 'ziggy-js';

// ShadCN Components
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Separator } from '@/Components/ui/separator';
import { Badge } from '@/Components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

// Lucide Icons
import {
    ShoppingBag,
    ArrowRight,
    ChevronLeft,
    CheckCircle2,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Rocket,
    Check,
    ShieldCheck
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
        owner_name: onboardingData?.owner_name || '',
        owner_email: onboardingData?.owner_email || '',
        owner_password: '',
        owner_password_confirmation: '',
        owner_doc_type: onboardingData?.owner_doc_type || 'CC',
        owner_doc_number: onboardingData?.owner_doc_number || '',
        owner_phone: onboardingData?.owner_phone || '',
        owner_address: onboardingData?.owner_address || '',
        owner_country: onboardingData?.owner_country || 'Colombia',
        owner_state: onboardingData?.owner_state || '',
        owner_city: onboardingData?.owner_city || '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.owner_password !== data.owner_password_confirmation) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        post(route('onboarding.complete'), {
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(typeof firstError === 'string' ? firstError : 'Revisa los campos requeridos');
            }
        });
    };

    const passwordRequirements = [
        { label: 'Mínimo 8 caracteres', met: data.owner_password.length >= 8 },
        { label: 'Contraseñas coinciden', met: data.owner_password !== '' && data.owner_password === data.owner_password_confirmation },
    ];

    return (
        <>
            <Head title="Paso 4 - Crear Cuenta | Linkiu" />

            <div className="min-h-screen bg-slate-50/50">
                {/* Header - 4/4 Progress */}
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
                                            "w-8 bg-primary" // All steps are primary since we are at the end
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
                            <Badge variant="secondary" className="mb-4">Paso Final</Badge>
                            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                                Crea tu cuenta de administrador
                            </h2>
                            <p className="text-lg text-gray-500">
                                Con estos datos podrás gestionar tu tienda {onboardingData?.tenant_name && <span className="text-primary font-semibold">"{onboardingData.tenant_name}"</span>}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <Card className="border-gray-100 shadow-sm overflow-hidden mb-8">
                                <CardHeader className="bg-gray-50/50 border-b pb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">Información Personal</CardTitle>
                                            <CardDescription>Crea tus credenciales de acceso</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {/* Full Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="owner_name" className="text-sm font-semibold">
                                                Nombre completo
                                            </Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                                <Input
                                                    id="owner_name"
                                                    placeholder="Ej: Darwin Martinez"
                                                    className={cn("pl-11 h-12", errors.owner_name && "border-red-500")}
                                                    value={data.owner_name}
                                                    onChange={e => setData('owner_name', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {errors.owner_name && <p className="text-red-500 text-xs">{errors.owner_name}</p>}
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <Label htmlFor="owner_email" className="text-sm font-semibold">
                                                Correo electrónico
                                            </Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                                <Input
                                                    id="owner_email"
                                                    type="email"
                                                    placeholder="linkiucloud@gmail.com"
                                                    className={cn("pl-11 h-12", errors.owner_email && "border-red-500")}
                                                    value={data.owner_email}
                                                    onChange={e => setData('owner_email', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {errors.owner_email && <p className="text-red-500 text-xs">{errors.owner_email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-3 gap-6">
                                        {/* Doc Type */}
                                        <div className="space-y-2 sm:col-span-1">
                                            <Label htmlFor="owner_doc_type" className="text-sm font-semibold">
                                                Tipo Doc
                                            </Label>
                                            <Select
                                                value={data.owner_doc_type}
                                                onValueChange={v => setData('owner_doc_type', v)}
                                            >
                                                <SelectTrigger className="h-12">
                                                    <SelectValue placeholder="Tipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="CC">CC</SelectItem>
                                                    <SelectItem value="NIT">NIT</SelectItem>
                                                    <SelectItem value="CE">CE</SelectItem>
                                                    <SelectItem value="PP">Pasaporte</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Doc Number */}
                                        <div className="space-y-2 sm:col-span-1">
                                            <Label htmlFor="owner_doc_number" className="text-sm font-semibold">
                                                Número Documento
                                            </Label>
                                            <Input
                                                id="owner_doc_number"
                                                placeholder="1002493883"
                                                className="h-12"
                                                value={data.owner_doc_number}
                                                onChange={e => setData('owner_doc_number', e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-2 sm:col-span-1">
                                            <Label htmlFor="owner_phone" className="text-sm font-semibold">
                                                Celular / WhatsApp
                                            </Label>
                                            <Input
                                                id="owner_phone"
                                                placeholder="3233332112"
                                                className="h-12"
                                                value={data.owner_phone}
                                                onChange={e => setData('owner_phone', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Personal Address */}
                                    <div className="space-y-2">
                                        <Label htmlFor="owner_address" className="text-sm font-semibold">
                                            Dirección Personal
                                        </Label>
                                        <Input
                                            id="owner_address"
                                            placeholder="Calle 11A #25-19 BQ 30 Apto 201"
                                            className="h-12"
                                            value={data.owner_address}
                                            onChange={e => setData('owner_address', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid sm:grid-cols-3 gap-6">
                                        {/* Country */}
                                        <div className="space-y-2">
                                            <Label htmlFor="owner_country" className="text-sm font-semibold">
                                                País
                                            </Label>
                                            <Input
                                                id="owner_country"
                                                placeholder="Colombia"
                                                className="h-12 bg-gray-50/50"
                                                value={data.owner_country}
                                                onChange={e => setData('owner_country', e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* State */}
                                        <div className="space-y-2">
                                            <Label htmlFor="owner_state" className="text-sm font-semibold">
                                                Departamento
                                            </Label>
                                            <Input
                                                id="owner_state"
                                                placeholder="Sucre"
                                                className="h-12"
                                                value={data.owner_state}
                                                onChange={e => setData('owner_state', e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* City */}
                                        <div className="space-y-2">
                                            <Label htmlFor="owner_city" className="text-sm font-semibold">
                                                Ciudad
                                            </Label>
                                            <Input
                                                id="owner_city"
                                                placeholder="Sincelejo"
                                                className="h-12"
                                                value={data.owner_city}
                                                onChange={e => setData('owner_city', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Separator className="my-6" />

                                    <div className="grid sm:grid-cols-2 gap-6 pt-2">
                                        {/* Password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="owner_password" className="text-sm font-semibold">
                                                Establecer Contraseña
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                                <Input
                                                    id="owner_password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className={cn("pl-11 h-12", errors.owner_password && "border-red-500")}
                                                    value={data.owner_password}
                                                    onChange={e => setData('owner_password', e.target.value)}
                                                    autoComplete="new-password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="owner_password_confirmation" className="text-sm font-semibold">
                                                Confirmar Contraseña
                                            </Label>
                                            <div className="relative">
                                                <ShieldCheck className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                                <Input
                                                    id="owner_password_confirmation"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className="pl-11 h-12"
                                                    value={data.owner_password_confirmation}
                                                    onChange={e => setData('owner_password_confirmation', e.target.value)}
                                                    autoComplete="new-password"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Password Strength/Verification Indicators */}
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        {passwordRequirements.map((req, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className={cn(
                                                    "w-4 h-4 rounded-full flex items-center justify-center transition-colors",
                                                    req.met ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-300"
                                                )}>
                                                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                                                </div>
                                                <span className={cn(
                                                    "text-xs font-medium transition-colors",
                                                    req.met ? "text-green-700" : "text-gray-400"
                                                )}>
                                                    {req.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.owner_password && <p className="text-red-500 text-xs">{errors.owner_password}</p>}
                                </CardContent>
                            </Card>

                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-10 flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900 mb-1">Casi terminamos</h4>
                                    <p className="text-sm text-blue-700 leading-relaxed">
                                        Al hacer clic en el botón, completaremos la configuración técnica de tu espacio y podrás empezar a vender de inmediato.
                                    </p>
                                </div>
                            </div>

                            {/* Navigation Footer */}
                            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <Link
                                    href={route('onboarding.step2')}
                                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-4 py-2"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Datos del negocio
                                </Link>

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={processing}
                                    className="bg-primary hover:bg-primary/90 px-10 h-14 text-lg font-bold shadow-indigo-100 shadow-2xl group"
                                >
                                    {processing ? (
                                        <>Creando tienda...</>
                                    ) : (
                                        <>
                                            Lanzar mi Tienda
                                            <Rocket className="w-5 h-5 ml-3 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}
