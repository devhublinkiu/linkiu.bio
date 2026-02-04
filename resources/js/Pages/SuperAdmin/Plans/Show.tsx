import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { ArrowLeft, Pencil, Check, X, Shield, Clock, CreditCard, Tag } from 'lucide-react';

interface Plan {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    monthly_price: number;
    currency: string;
    vertical?: { name: string };
    cover_url: string | null;
    features: string[] | null;
    quarterly_discount_percent: number;
    semiannual_discount_percent: number;
    yearly_discount_percent: number;
    trial_days: number;
    no_initial_payment_required: boolean;
    support_level: string;
    is_public: boolean;
    is_featured: boolean;
    highlight_text: string | null;
    allow_custom_slug: boolean;
    created_at: string;
}

interface Props {
    plan: Plan;
}

export default function Show({ plan }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: plan.currency
        }).format(price);
    };

    const calculateDiscountedPrice = (months: number, discount: number) => {
        const total = plan.monthly_price * months;
        return total * (1 - discount / 100);
    };

    return (
        <SuperAdminLayout header={`Detalles del Plan: ${plan.name}`}>
            <Head title={`Plan ${plan.name}`} />

            <div className="max-w-5xl mx-auto py-6 space-y-6">
                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <Button variant="ghost" asChild className="pl-0 hover:bg-transparent text-muted-foreground hover:text-gray-900">
                        <Link href={route('plans.index')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver al listado
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={route('plans.edit', plan.id)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar Plan
                        </Link>
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Main Info Column */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Identity Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                        {plan.is_featured && (
                                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
                                                {plan.highlight_text || 'Destacado'}
                                            </Badge>
                                        )}
                                        {!plan.is_public && (
                                            <Badge variant="secondary">Oculto</Badge>
                                        )}
                                    </div>
                                    <CardDescription className="mt-2 text-base">
                                        {plan.description || 'Sin descripción'}
                                    </CardDescription>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className="mb-2 block w-fit ml-auto">
                                        {plan.vertical?.name || 'General'}
                                    </Badge>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {formatPrice(plan.monthly_price)}
                                        <span className="text-sm font-normal text-muted-foreground"> / mes</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {plan.cover_url && (
                                    <div className="rounded-lg overflow-hidden border bg-gray-50 h-64 w-full flex items-center justify-center mb-6">
                                        <img src={plan.cover_url} alt={plan.name} className="h-full object-contain" />
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900">Características incluidas</h3>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {plan.features?.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                <div className="mt-0.5 rounded-full bg-green-100 p-0.5 text-green-600">
                                                    <Check className="h-3 w-3" />
                                                </div>
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pricing Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Tag className="h-5 w-5 text-blue-600" />
                                    Precios y Descuentos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-lg bg-gray-50 border space-y-2">
                                        <div className="text-sm font-medium text-gray-500">Trimestral</div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-bold text-gray-900">
                                                {formatPrice(calculateDiscountedPrice(3, plan.quarterly_discount_percent))}
                                            </span>
                                            {plan.quarterly_discount_percent > 0 && (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                    -{plan.quarterly_discount_percent}%
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Por 3 meses</div>
                                    </div>

                                    <div className="p-4 rounded-lg bg-gray-50 border space-y-2">
                                        <div className="text-sm font-medium text-gray-500">Semestral</div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-bold text-gray-900">
                                                {formatPrice(calculateDiscountedPrice(6, plan.semiannual_discount_percent))}
                                            </span>
                                            {plan.semiannual_discount_percent > 0 && (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                    -{plan.semiannual_discount_percent}%
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Por 6 meses</div>
                                    </div>

                                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 space-y-2">
                                        <div className="text-sm font-medium text-blue-600">Anual</div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-bold text-blue-900">
                                                {formatPrice(calculateDiscountedPrice(12, plan.yearly_discount_percent))}
                                            </span>
                                            {plan.yearly_discount_percent > 0 && (
                                                <Badge className="bg-blue-600 hover:bg-blue-700">
                                                    -{plan.yearly_discount_percent}%
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-xs text-blue-600/80">Por 12 meses</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Configuración del Plan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b last:border-0">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="h-4 w-4" />
                                        <span>Días de Prueba</span>
                                    </div>
                                    <span className="font-medium">{plan.trial_days} días</span>
                                </div>

                                <div className="flex items-center justify-between py-2 border-b last:border-0">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <CreditCard className="h-4 w-4" />
                                        <span>Sin Tarjeta</span>
                                    </div>
                                    {plan.no_initial_payment_required ? (
                                        <Check className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <X className="h-4 w-4 text-gray-400" />
                                    )}
                                </div>

                                <div className="flex items-center justify-between py-2 border-b last:border-0">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Shield className="h-4 w-4" />
                                        <span>Soporte</span>
                                    </div>
                                    <Badge variant="outline" className="capitalize">
                                        {plan.support_level}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between py-2 border-b last:border-0">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <div className="w-5 h-5 flex items-center justify-center border rounded text-[10px] font-bold">@</div>
                                        <span>Slug Personalizado</span>
                                    </div>
                                    {plan.allow_custom_slug ? (
                                        <Check className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <X className="h-4 w-4 text-gray-400" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Información Técnica</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-500 block text-[0.65rem] font-bold uppercase tracking-wider mb-1">ID del Sistema</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">{plan.id}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-[0.65rem] font-bold uppercase tracking-wider mb-1">Slug</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">{plan.slug || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Creado el</span>
                                    <span className="text-gray-700">{new Date(plan.created_at).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
