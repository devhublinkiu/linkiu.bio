import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import {
    Zap,
    CheckCircle2,
    CreditCard,
    Clock,
    ShieldCheck,
    ChevronRight,
    Star,
    Sparkles,
    AlertCircle,
    Eye,
    Upload,
    Banknote,
    Link as LinkIcon
} from 'lucide-react';
import { toast } from 'sonner';
import PaymentUploadModal from '@/Components/Tenant/Admin/PaymentUploadModal';

interface Plan {
    id: number;
    name: string;
    description: string;
    monthly_price: number;
    yearly_price: number;
    features: string[];
    is_public: boolean;
    slug: string;
    allow_custom_slug?: boolean;
    quarterly_price?: number;
}

interface Subscription {
    id: number;
    status: string;
    billing_cycle: string;
    ends_at: string;
    trial_ends_at: string | null;
    next_payment_date: string | null;
    days_remaining: number;
    trial_days_remaining: number;
    percent_completed: number;
    plan: Plan;
}

interface Tenant {
    id: number;
    name: string;
    slug: string;
    latest_subscription: Subscription;
}

interface Props {
    tenant: Tenant;
    plans: Plan[];
    pendingInvoice: any | null;
}

export default function Index({ tenant, plans, pendingInvoice }: Props) {
    const { props } = usePage<any>();
    const flash = props.flash || {};
    const subscription = tenant.latest_subscription;
    const currentPlan = subscription?.plan;
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [slugWarning, setSlugWarning] = useState<{
        show: boolean;
        currentSlug: string;
        newAutoSlug: string;
        pendingPlanId: number | null;
        pendingBillingCycle: string;
    }>({
        show: false,
        currentSlug: '',
        newAutoSlug: '',
        pendingPlanId: null,
        pendingBillingCycle: 'monthly'
    });

    // Handle slug warning from backend
    useEffect(() => {
        console.log('[Subscription] Flash data received:', flash);
        console.log('[Subscription] props:', props);
        if (flash?.slug_warning) {
            console.log('[Subscription] Setting slug warning modal to show');
            setSlugWarning({
                show: true,
                currentSlug: flash.current_slug || '',
                newAutoSlug: flash.new_auto_slug || '',
                pendingPlanId: flash.pending_plan_id || null,
                pendingBillingCycle: flash.pending_billing_cycle || 'monthly'
            });
        }
    }, [flash, props]);

    const handleAdvanceInvoice = () => {
        router.post(route('tenant.subscription.advance-invoice', { tenant: tenant.slug }), {}, {
            onSuccess: () => {
                toast.success("Factura generada. Ya puedes reportar tu pago.");
            },
            onError: () => {
                toast.error("Error al generar la factura anticipada");
            }
        });
    };

    const handleSelectPlan = (plan: Plan, confirmSlugLoss = false) => {
        if (plan.id === currentPlan?.id && billingCycle === subscription?.billing_cycle) {
            toast.info("Ya te encuentras en este plan y ciclo");
            return;
        }

        router.post(route('tenant.subscription.change-plan', { tenant: tenant.slug }), {
            plan_id: plan.id,
            billing_cycle: billingCycle,
            confirm_slug_loss: confirmSlugLoss
        }, {
            onSuccess: (page: any) => {
                // Don't show success toast if slug warning is returned
                if (page.props?.flash?.slug_warning) {
                    return; // useEffect will handle showing the modal
                }
                toast.success("Solicitud de cambio procesada correctamente");
                setSlugWarning({ show: false, currentSlug: '', newAutoSlug: '', pendingPlanId: null, pendingBillingCycle: 'monthly' });
            },
            onError: (err) => {
                console.error(err);
                toast.error("Error al procesar el cambio de plan");
            }
        });
    };

    const handleConfirmSlugLoss = () => {
        if (slugWarning.pendingPlanId) {
            const plan = plans.find(p => p.id === slugWarning.pendingPlanId);
            if (plan) {
                handleSelectPlan(plan, true);
            }
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
        <AdminLayout>
            <Head title="Mi Plan y Suscripción" />

            <div className="max-w-6xl mx-auto space-y-10">
                {/* Header Header */}
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-black tracking-tight text-slate-900">Planes y Suscripción</h2>
                    <p className="text-slate-500 font-medium">Gestiona tu nivel de servicio y activa nuevas funcionalidades.</p>
                </div>

                {/* Current Status Banner */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 shadow-xl shadow-slate-200/50 border-slate-100 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                            <Zap className="w-48 h-48" />
                        </div>
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge className="bg-primary/10 text-primary border-primary/20 mb-2 uppercase tracking-widest font-black text-[10px]">
                                        Plan Actual
                                    </Badge>
                                    <CardTitle className="text-3xl font-black text-slate-900">
                                        {currentPlan?.name || 'Inactivo'}
                                    </CardTitle>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado</p>
                                    <Badge className={
                                        subscription?.status === 'active' || subscription?.status === 'trialing'
                                            ? "bg-green-100 text-green-700 border-green-200"
                                            : "bg-red-100 text-red-700 border-red-200"
                                    }>
                                        {subscription?.status === 'trialing' ? 'En Prueba' : 'Suscripción Activa'}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-slate-400">Progreso del Ciclo</span>
                                    <span className="text-primary">{subscription?.percent_completed}% completado</span>
                                </div>
                                <Progress value={subscription?.percent_completed} className="h-2 bg-slate-100 shadow-inner" />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                        {subscription?.status === 'trialing' ? 'Días de Prueba' : 'Días Restantes'}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-slate-300" />
                                        <span className="font-black text-slate-700">
                                            {subscription?.status === 'trialing' ? subscription?.trial_days_remaining : subscription?.days_remaining} días
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Próximo Cobro</p>
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-slate-300" />
                                        <span className="font-black text-slate-700">
                                            {subscription?.next_payment_date ? new Date(subscription.next_payment_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pendiente'}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                        Valor {
                                            subscription?.billing_cycle === 'yearly' ? 'Anual' :
                                                subscription?.billing_cycle === 'quarterly' ? 'Trimestral' : 'Mensual'
                                        }
                                    </p>
                                    <p className="text-xl font-black text-primary">
                                        {formatCurrency(
                                            subscription?.billing_cycle === 'yearly' ? currentPlan?.yearly_price || 0 :
                                                subscription?.billing_cycle === 'quarterly' ? currentPlan?.quarterly_price || 0 :
                                                    currentPlan?.monthly_price || 0
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Actions */}
                            <div className="pt-4 flex flex-wrap gap-4 border-t border-slate-50">
                                {pendingInvoice ? (
                                    <div className="flex items-center gap-4 bg-amber-50 p-4 rounded-2xl border border-amber-100 w-full animate-in fade-in slide-in-from-top-2">
                                        <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                                            <AlertCircle className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-black text-amber-900 uppercase tracking-tight">Tienes una factura pendiente</p>
                                            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">#{pendingInvoice.id} • {formatCurrency(pendingInvoice.amount)}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="h-9 px-4 rounded-xl font-bold border-amber-200 text-amber-700 bg-white hover:bg-amber-50" asChild>
                                                <Link href={route('tenant.invoices.show', { tenant: tenant.slug, invoice: pendingInvoice.id })}>
                                                    <Eye className="w-4 h-4 mr-2" /> Detalle
                                                </Link>
                                            </Button>
                                            <Button size="sm" className="h-9 px-6 rounded-xl font-black bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-200" onClick={() => setIsUploadOpen(true)}>
                                                <Upload className="w-4 h-4 mr-2" /> Pagar Ahora
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between w-full bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-400">
                                                <Banknote className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">¿Quieres pagar por adelantado?</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asegura tu servicio para el próximo ciclo</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="h-9 px-6 rounded-xl font-bold bg-white border-slate-200 text-slate-600 hover:bg-slate-50 transition-all hover:scale-[1.02]" onClick={handleAdvanceInvoice}>
                                            Adelantar Pago
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-slate-100 bg-slate-50 flex flex-col justify-between">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-600 uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4" />
                                Tu Seguridad
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                Tu información de facturación está protegida. Si tienes dudas sobre tu plan actual, puedes ver tus facturas anteriores.
                            </p>
                            <Button variant="outline" className="w-full h-10 border-slate-200 text-slate-700 font-bold bg-white shadow-sm" asChild>
                                <Link href={route('tenant.invoices.index', { tenant: tenant.slug })}>
                                    Ver Historial de Facturas
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Available Plans Section */}
                <div className="space-y-8 pt-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Mejora tu impacto</h3>
                                <p className="text-sm text-slate-500 font-medium tracking-tight">Selecciona el plan que se adapte mejor a tus objetivos.</p>
                            </div>
                        </div>

                        {/* Toggle Billing Cycle */}
                        <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
                            <Button
                                variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
                                size="sm"
                                className="h-9 px-4 rounded-lg font-extrabold text-[10px] uppercase tracking-wider"
                                onClick={() => setBillingCycle('monthly')}
                            >
                                Mensual
                            </Button>
                            <Button
                                variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
                                size="sm"
                                className="h-9 px-4 rounded-lg font-extrabold text-[10px] uppercase tracking-wider"
                                onClick={() => setBillingCycle('yearly')}
                            >
                                Anual <Badge className="ml-1 bg-green-500 text-[8px] py-0 px-1 border-none">-15%</Badge>
                            </Button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <Card
                                key={plan.id}
                                className={`relative shadow-xl transition-all duration-300 group hover:-translate-y-1 ${plan.id === currentPlan?.id && billingCycle === subscription?.billing_cycle
                                    ? "border-primary ring-4 ring-primary/10"
                                    : "border-slate-100 hover:border-primary/20"
                                    }`}
                            >
                                {plan.id === currentPlan?.id && billingCycle === subscription?.billing_cycle && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                        Tu Plan Actual
                                    </div>
                                )}

                                <CardHeader className="text-center pt-10 pb-6">
                                    <CardTitle className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">
                                        {plan.name}
                                    </CardTitle>
                                    <div className="mt-4 flex flex-col items-center">
                                        <div className="text-4xl font-black text-slate-900 tracking-tighter">
                                            {formatCurrency(billingCycle === 'yearly' ? plan.yearly_price : plan.monthly_price)}
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            {billingCycle === 'yearly' ? 'por año' : 'por mes'}
                                        </p>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6 px-8">
                                    <p className="text-slate-500 text-xs text-center font-medium min-h-[40px]">
                                        {plan.description}
                                    </p>

                                    <div className="space-y-4 pt-4">
                                        {plan.features?.filter(f => typeof f === 'string').map((feature, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className="mt-0.5">
                                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-700 leading-snug">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-8 pb-8 px-8 flex-col gap-3">
                                    <Button
                                        className={`w-full h-12 rounded-2xl font-black shadow-lg transition-all ${plan.id === currentPlan?.id && billingCycle === subscription?.billing_cycle
                                            ? "bg-slate-100 text-slate-400 hover:bg-slate-100 cursor-default shadow-none border-none"
                                            : "bg-primary text-white shadow-primary/20 hover:scale-[1.02]"
                                            }`}
                                        onClick={() => handleSelectPlan(plan)}
                                    >
                                        {plan.id === currentPlan?.id && billingCycle === subscription?.billing_cycle ? "Activo" : "Elegir Plan"}
                                    </Button>
                                    {billingCycle === 'yearly' ? (
                                        <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                                            Ahorras {formatCurrency((plan.monthly_price * 12) - plan.yearly_price)} al año
                                        </p>
                                    ) : (
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Sin permanencia mínima
                                        </p>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* FAQ or Info Section */}
                <div className="bg-slate-50 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-100">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-widest">Importante</span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900">¿Necesitas un plan personalizado?</h4>
                        <p className="text-slate-500 text-sm font-medium">Si tu proyecto requiere límites especiales o integraciones dedicadas, estamos aquí para ayudarte.</p>
                    </div>
                    <Button size="lg" className="rounded-2xl font-black h-14 px-8 bg-white border-slate-200 text-slate-900 hover:bg-slate-50 border-2 shadow-sm min-w-[200px]">
                        Contactar Soporte
                    </Button>
                </div>
            </div>

            {pendingInvoice && (
                <PaymentUploadModal
                    isOpen={isUploadOpen}
                    onClose={() => setIsUploadOpen(false)}
                    invoice={pendingInvoice}
                />
            )}

            {/* Slug Loss Warning Dialog */}
            <Dialog open={slugWarning.show} onOpenChange={(open) => !open && setSlugWarning({ ...slugWarning, show: false })}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-amber-600">
                            <AlertCircle className="w-5 h-5" />
                            Advertencia: Perderás tu URL personalizada
                        </DialogTitle>
                        <DialogDescription asChild className="pt-4 space-y-3">
                            <div>
                                <p>
                                    El plan que seleccionaste <strong>no permite URL personalizada</strong>.
                                    Si continúas, tu tienda cambiará de dirección:
                                </p>
                                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-slate-500">Actual:</span>
                                        <code className="bg-red-100 text-red-700 px-2 py-1 rounded font-mono text-sm">
                                            /{slugWarning.currentSlug}
                                        </code>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-slate-500">Nueva:</span>
                                        <code className="bg-green-100 text-green-700 px-2 py-1 rounded font-mono text-sm">
                                            /{slugWarning.newAutoSlug}
                                        </code>
                                    </div>
                                </div>
                                <p className="text-amber-600 text-sm font-medium">
                                    ⚠️ Todos los enlaces anteriores a tu tienda dejarán de funcionar.
                                </p>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setSlugWarning({ ...slugWarning, show: false })}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmSlugLoss}
                        >
                            Entiendo, cambiar de plan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}

function CalendarIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    )
}
