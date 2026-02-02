import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { route } from 'ziggy-js';

// ShadCN Components
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';

// Lucide Icons
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    ArrowRight,
    Loader2
} from 'lucide-react';

interface Props {
    status?: string;
    canResetPassword?: boolean;
}

export default function SuperAdminLogin({ status, canResetPassword }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-slate-50">
            <Head title="SuperAdmin Login" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Brand Logo */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-foreground">
                        <div className="h-10 w-10 flex items-center justify-center bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span>SuperLinkiu</span>
                    </div>
                </div>

                <div className="text-center space-y-2 mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Panel de Control
                    </h2>
                    <p className="text-gray-500 font-medium flex items-center justify-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        Administración Global
                    </p>
                </div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
                <Card className="border-none shadow-2xl shadow-blue-100/50 overflow-hidden bg-white/80 backdrop-blur-md">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
                        <CardDescription>
                            Ingresa tus credenciales de administrador
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {status && (
                            <div className="mb-4 font-medium text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className={cn("pl-10 h-12 bg-gray-50/50 border-gray-100 focus:bg-white transition-all", errors.email && "border-red-300 bg-red-50/10")}
                                        autoComplete="username"
                                        placeholder="admin@linkiu.bio"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-600 font-medium">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Contraseña</Label>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className={cn("pl-10 pr-10 h-12 bg-gray-50/50 border-gray-100 focus:bg-white transition-all", errors.password && "border-red-300 bg-red-50/10")}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600 font-medium">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center">
                                <Checkbox
                                    id="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                />
                                <Label
                                    htmlFor="remember"
                                    className="ml-2 block text-sm text-gray-600 cursor-pointer select-none"
                                >
                                    Recordar mi sesión
                                </Label>
                            </div>

                            <div className="pt-2">
                                <Button
                                    className="w-full h-12 text-base font-bold shadow-xl shadow-primary/20 group relative overflow-hidden transition-all active:scale-95"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            Acceder al Panel
                                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center space-y-4">
                    <div className="flex items-center justify-center gap-4 pt-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Acceso Seguro 256-bit
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
