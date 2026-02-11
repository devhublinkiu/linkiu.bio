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
    Clock,
    ShieldCheck,
    AlertCircle,
    Eye,
    Upload,
    Banknote,
    ChevronRight,
    Calendar,
    Check
} from 'lucide-react';
import { toast } from 'sonner';
import PaymentUploadModal from '@/Components/Tenant/Admin/PaymentUploadModal';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import { PageProps } from '@/types';
import { cn } from '@/lib/utils';
import { route } from 'ziggy-js';
import { MODULE_LABELS } from '@/Config/menuConfig';

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
    quarterly_price: number;
    semiannual_price: number;
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
    const { props } = usePage<PageProps>();
    const flash = (props as any).flash || {};
    const currentUserRole = props.currentUserRole;

    const subscription = tenant.latest_subscription;
    const currentPlan = subscription?.plan;
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
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

    const checkPermission = (permission: string) => {
        if (!currentUserRole) return false;
        return currentUserRole.is_owner ||
            currentUserRole.permissions.includes('*') ||
            currentUserRole.permissions.includes(permission);
    };

    const handleActionWithPermission = (permission: string, action: () => void) => {
        if (checkPermission(permission)) {
            action();
        } else {
            setShowPermissionModal(true);
        }
    };

    // Handle slug warning from backend
    useEffect(() => {
        if (flash?.slug_warning) {
            setSlugWarning({
                show: true,
                currentSlug: flash.current_slug || '',
                newAutoSlug: flash.new_auto_slug || '',
                pendingPlanId: flash.pending_plan_id || null,
                pendingBillingCycle: flash.pending_billing_cycle || 'monthly'
            });
        }
    }, [flash]);

    const handleAdvanceInvoice = () => {
        handleActionWithPermission('billing.manage', () => {
            router.post(route('tenant.subscription.advance-invoice', { tenant: tenant.slug }), {}, {
                onSuccess: () => {
                    toast.success("Factura generada. Ya puedes reportar tu pago.");
                },
                onError: () => {
                    toast.error("Error al generar la factura anticipada");
                }
            });
        });
    };

    const handleSelectPlan = (plan: Plan, confirmSlugLoss = false) => {
        if (plan.id === currentPlan?.id && billingCycle === subscription?.billing_cycle) {
            toast.info("Ya te encuentras en este plan y ciclo");
            return;
        }

        handleActionWithPermission('billing.manage', () => {
            router.post(route('tenant.subscription.change-plan', { tenant: tenant.slug }), {
                plan_id: plan.id,
                billing_cycle: billingCycle,
                confirm_slug_loss: confirmSlugLoss
            }, {
                onSuccess: (page: any) => {
                    if (page.props?.flash?.slug_warning) {
                        return;
                    }
                    toast.success("Solicitud de cambio procesada correctamente");
                    setSlugWarning({ show: false, currentSlug: '', newAutoSlug: '', pendingPlanId: null, pendingBillingCycle: 'monthly' });
                },
                onError: (err) => {
                    console.error(err);
                    toast.error("Error al procesar el cambio de plan");
                }
            });
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

    const getRemainingTimeText = () => {
        if (!subscription) return 'N/A';
        const days = subscription.status === 'trialing' ? subscription.trial_days_remaining : subscription.days_remaining;
        if (days <= 0) return '0 días';
        if (days < 30) return `${days} días`;
        const months = Math.floor(days / 30);
        const remainingDays = days % 30;
        if (months > 0 && remainingDays > 0) {
            return `${months} ${months === 1 ? 'mes' : 'meses'} y ${remainingDays} ${remainingDays === 1 ? 'día' : 'días'}`;
        } else if (months > 0) {
            return `${months} ${months === 1 ? 'mes' : 'meses'}`;
        }
        return `${days} días`;
    };

    const getCycleLabel = (cycle: string) => {
        switch (cycle) {
            case 'monthly': return 'Mensual';
            case 'quarterly': return 'Trimestral';
            case 'semiannual': return 'Semestral';
            case 'yearly': return 'Anual';
            default: return cycle;
        }
    };

    return (
        <AdminLayout>
            <Head title="Mi Plan y Suscripción" />

            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />

            <div className="max-w-7xl mx-auto space-y-16 pb-20">
                {/* Headers */}
                <div className="text-center space-y-2">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-slate-900">Planes y Suscripción</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Gestiona tu nivel de servicio y activa nuevas funcionalidades.</p>
                </div>

                {/* Current Status Banner */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 shadow-xl border overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                            <Zap className="w-48 h-48" />
                        </div>
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge variant="outline" className="text-primary border-primary/20 mb-2 uppercase tracking-widest font-black text-[10px]">
                                        Plan Actual
                                    </Badge>
                                    <CardTitle className="text-3xl font-black">
                                        {currentPlan?.name || 'Inactivo'}
                                    </CardTitle>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Estado</p>
                                    <Badge
                                        variant={subscription?.status === 'active' || subscription?.status === 'trialing' ? "default" : "destructive"}
                                    >
                                        {subscription?.status === 'trialing' ? 'En Prueba' : 'Suscripción Activa'}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-muted-foreground">Progreso del Ciclo</span>
                                    <span className="text-primary">{subscription?.percent_completed}% completado</span>
                                </div>
                                <Progress value={subscription?.percent_completed} className="h-2 bg-muted shadow-inner" />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                                        {subscription?.status === 'trialing' ? 'Días de Prueba' : 'Tiempo Restante'}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-black">
                                            {getRemainingTimeText()}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Próximo Cobro</p>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-black">
                                            {subscription?.next_payment_date ? new Date(subscription.next_payment_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pendiente'}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                                        Valor {getCycleLabel(subscription?.billing_cycle || '')}
                                    </p>
                                    <p className="text-xl font-black text-primary">
                                        {formatCurrency(
                                            subscription?.billing_cycle === 'yearly' ? currentPlan?.yearly_price || 0 :
                                                subscription?.billing_cycle === 'semiannual' ? currentPlan?.semiannual_price || 0 :
                                                    subscription?.billing_cycle === 'quarterly' ? currentPlan?.quarterly_price || 0 :
                                                        currentPlan?.monthly_price || 0
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Actions */}
                            <div className="pt-4 flex flex-wrap gap-4 border-t">
                                {pendingInvoice ? (
                                    <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border w-full animate-in fade-in slide-in-from-top-2">
                                        <div className="h-10 w-10 bg-muted rounded-xl flex items-center justify-center text-amber-600">
                                            <AlertCircle className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-black uppercase tracking-tight">Tienes una factura pendiente</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">#{pendingInvoice.id} • {formatCurrency(pendingInvoice.amount)}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="h-9 px-4 rounded-xl font-bold bg-background" asChild>
                                                <Link href={route('tenant.invoices.show', { tenant: tenant?.slug, invoice: pendingInvoice.id })}>
                                                    <Eye className="w-4 h-4 mr-2" /> Detalle
                                                </Link>
                                            </Button>
                                            <Button size="sm" className="h-9 px-6 rounded-xl font-black" onClick={() => handleActionWithPermission('billing.manage', () => setIsUploadOpen(true))}>
                                                <Upload className="w-4 h-4 mr-2" /> Pagar Ahora
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between w-full bg-muted/30 p-4 rounded-2xl border">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 bg-background rounded-xl shadow-sm border flex items-center justify-center text-muted-foreground">
                                                <Banknote className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-tight">¿Quieres pagar por adelantado?</p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Asegura tu servicio para el próximo ciclo</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="h-9 px-6 rounded-xl font-bold bg-background transition-all hover:scale-[1.02]" onClick={handleAdvanceInvoice}>
                                            Adelantar Pago
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border bg-muted/30 flex flex-col justify-between">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4" />
                                Tu Seguridad
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                Tu información de facturación está protegida. Si tienes dudas sobre tu plan actual, puedes ver tus facturas anteriores.
                            </p>
                            <Button variant="outline" className="w-full h-10 font-bold bg-background" asChild>
                                <Link href={route('tenant.invoices.index', { tenant: tenant?.slug })}>
                                    Ver Historial de Facturas
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Available Plans Section */}
                <div className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900">Selecciona tu Plan</h3>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Escoge la opción que mejor se adapte a tu marca.</p>
                        </div>

                        {/* Professional Cycle Selector */}
                        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1">
                            {(['monthly', 'quarterly', 'yearly'] as const).map((cycle) => (
                                <Button
                                    key={cycle}
                                    variant={billingCycle === cycle ? 'default' : 'ghost'}
                                    size="sm"
                                    className={cn(
                                        "h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                                        billingCycle === cycle ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                                    )}
                                    onClick={() => setBillingCycle(cycle)}
                                >
                                    {cycle === 'monthly' ? 'Mensual' : cycle === 'quarterly' ? 'Trimestral' : 'Anual'}
                                    {cycle === 'yearly' && <Badge className="ml-2 bg-green-500 text-[8px] py-0 px-1 border-none text-white">-15%</Badge>}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {plans.map((plan) => {
                            const isFeatured = plan.name.toLowerCase().includes('pro') || plan.name.toLowerCase().includes('premium');
                            const price = billingCycle === 'yearly' ? plan.yearly_price :
                                billingCycle === 'quarterly' ? plan.quarterly_price || 0 :
                                    plan.monthly_price;

                            const isCurrentCycle = plan.id === currentPlan?.id && billingCycle === subscription?.billing_cycle;

                            return (
                                <Card
                                    key={plan.id}
                                    className={cn(
                                        "relative transition-all duration-500 border-2 flex flex-col h-full overflow-hidden group",
                                        isFeatured
                                            ? "border-primary shadow-2xl shadow-primary/10 z-10 scale-[1.02]"
                                            : "border-slate-100 hover:border-slate-200"
                                    )}
                                >
                                    {isFeatured && (
                                        <div className="absolute top-0 right-0 left-0 bg-primary text-white py-2 text-[10px] font-black uppercase tracking-[0.2em] text-center">
                                            ¡Oferta por tiempo limitado!
                                        </div>
                                    )}

                                    <CardHeader className={cn("pt-6", isFeatured && "pt-14")}>
                                        <CardTitle className="text-xl font-black tracking-tighter text-slate-900 uppercase">
                                            {plan.name}
                                        </CardTitle>
                                        <div className="flex flex-col">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                                                    {formatCurrency(price)}
                                                </span>
                                                <span className="text-slate-400 text-[10px] font-bold uppercase">
                                                    /{billingCycle === 'monthly' ? 'mes' : 'ciclo'}
                                                </span>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="flex-1 px-8 flex flex-col">
                                        <Button
                                            disabled={isCurrentCycle}
                                            onClick={() => handleActionWithPermission('billing.manage', () => {
                                                router.visit(route('tenant.subscription.checkout', {
                                                    tenant: tenant.slug,
                                                    plan_id: plan.id,
                                                    billing_cycle: billingCycle
                                                }));
                                            })}
                                            className={cn(
                                                "w-full h-8 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all",
                                                isCurrentCycle
                                                    ? "bg-slate-100 text-slate-400 border shadow-none"
                                                    : isFeatured
                                                        ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                                                        : "bg-slate-900 hover:bg-slate-800 text-white"
                                            )}
                                        >
                                            {isCurrentCycle ? "Plan Actual" : "Continuar al Pago"}
                                        </Button>

                                        <div className="w-full space-y-2 pt-4 border-t border-slate-50">
                                            {(() => {
                                                const features = plan.features as any;
                                                if (!features) return null;

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
                                                } else if (typeof features === 'object') {
                                                    Object.keys(features).forEach(k => {
                                                        if (features[k] === true || features[k] === 1 || features[k] === '1') displayFeatures.push(k);
                                                    });
                                                }

                                                if (displayFeatures.length === 0) return null;

                                                return displayFeatures.map((feature, i) => {
                                                    const isExcluded = feature.startsWith('-');
                                                    const cleanFeature = isExcluded ? feature.substring(1) : feature;

                                                    // Map technical keys to human labels (imported from menuConfig)
                                                    const label = (MODULE_LABELS as any)[cleanFeature] || cleanFeature;

                                                    return (
                                                        <div key={i} className={cn(
                                                            "flex items-center justify-start",
                                                            isExcluded ? "opacity-30" : "opacity-100"
                                                        )}>
                                                            <Check className={cn(
                                                                "w-4 h-4 mr-2",
                                                                isExcluded ? "text-slate-400" : "text-slate-600"
                                                            )} />
                                                            <span className={cn(
                                                                "text-[12px] font-bold",
                                                                isExcluded ? "text-slate-400" : "text-slate-600"
                                                            )}>
                                                                {label}
                                                            </span>
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pb-8 pt-0 px-8 flex flex-col gap-4">
                                        {/* Spacer */}
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-muted/30 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 border">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-widest">Importante</span>
                        </div>
                        <h4 className="text-xl font-black uppercase">¿Necesitas un plan personalizado?</h4>
                        <p className="text-muted-foreground text-sm font-medium">Si tu proyecto requiere límites especiales o integraciones dedicadas, estamos aquí para ayudarte.</p>
                    </div>
                    <Button size="lg" className="rounded-2xl font-black h-14 px-8 border-2 shadow-sm min-w-[200px]" variant="outline">
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
                                        <span className="text-muted-foreground">Actual:</span>
                                        <code className="bg-muted px-2 py-1 rounded font-bold text-sm">
                                            /{slugWarning.currentSlug}
                                        </code>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">Nueva:</span>
                                        <code className="bg-muted px-2 py-1 rounded font-bold text-sm">
                                            /{slugWarning.newAutoSlug}
                                        </code>
                                    </div>
                                </div>
                                <p className="text-amber-600 text-sm font-bold">
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
