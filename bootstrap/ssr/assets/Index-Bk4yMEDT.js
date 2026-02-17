import { jsxs, jsx } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-CvP9QKT2.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent, e as CardFooter } from "./card-BaovBWX5.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { P as Progress } from "./progress-BW8YadT0.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { Zap, Clock, Calendar, AlertCircle, Eye, Upload, Banknote, ShieldCheck, Check } from "lucide-react";
import { toast } from "sonner";
import { P as PaymentUploadModal } from "./PaymentUploadModal-CAe0w48h.js";
import { P as PermissionDeniedModal } from "./dropdown-menu-BCxMx_rd.js";
import { c as cn } from "./utils-B0hQsrDj.js";
import { route } from "ziggy-js";
import { a as MODULE_LABELS } from "./menuConfig-rtCrEhXP.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-progress";
import "@radix-ui/react-dialog";
import "vaul";
import "axios";
import "./input-B_4qRSOV.js";
import "./sheet-DFnQxYfh.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "clsx";
import "tailwind-merge";
function Index({ tenant, plans, pendingInvoice }) {
  const { props } = usePage();
  const flash = props.flash || {};
  const currentUserRole = props.currentUserRole;
  const subscription = tenant.latest_subscription;
  const currentPlan = subscription?.plan;
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [slugWarning, setSlugWarning] = useState({
    show: false,
    currentSlug: "",
    newAutoSlug: "",
    pendingPlanId: null,
    pendingBillingCycle: "monthly"
  });
  const checkPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner || currentUserRole.permissions.includes("*") || currentUserRole.permissions.includes(permission);
  };
  const handleActionWithPermission = (permission, action) => {
    if (checkPermission(permission)) {
      action();
    } else {
      setShowPermissionModal(true);
    }
  };
  useEffect(() => {
    if (flash?.slug_warning) {
      setSlugWarning({
        show: true,
        currentSlug: flash.current_slug || "",
        newAutoSlug: flash.new_auto_slug || "",
        pendingPlanId: flash.pending_plan_id || null,
        pendingBillingCycle: flash.pending_billing_cycle || "monthly"
      });
    }
  }, [flash]);
  const handleAdvanceInvoice = () => {
    handleActionWithPermission("billing.manage", () => {
      router.post(route("tenant.subscription.advance-invoice", { tenant: tenant.slug }), {}, {
        onSuccess: () => {
          toast.success("Factura generada. Ya puedes reportar tu pago.");
        },
        onError: () => {
          toast.error("Error al generar la factura anticipada");
        }
      });
    });
  };
  const handleSelectPlan = (plan, confirmSlugLoss = false) => {
    if (plan.id === currentPlan?.id && billingCycle === subscription?.billing_cycle) {
      toast.info("Ya te encuentras en este plan y ciclo");
      return;
    }
    handleActionWithPermission("billing.manage", () => {
      router.post(route("tenant.subscription.change-plan", { tenant: tenant.slug }), {
        plan_id: plan.id,
        billing_cycle: billingCycle,
        confirm_slug_loss: confirmSlugLoss
      }, {
        onSuccess: (page) => {
          if (page.props?.flash?.slug_warning) {
            return;
          }
          toast.success("Solicitud de cambio procesada correctamente");
          setSlugWarning({ show: false, currentSlug: "", newAutoSlug: "", pendingPlanId: null, pendingBillingCycle: "monthly" });
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
      const plan = plans.find((p) => p.id === slugWarning.pendingPlanId);
      if (plan) {
        handleSelectPlan(plan, true);
      }
    }
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(amount);
  };
  const getRemainingTimeText = () => {
    if (!subscription) return "N/A";
    const days = subscription.status === "trialing" ? subscription.trial_days_remaining : subscription.days_remaining;
    if (days <= 0) return "0 días";
    if (days < 30) return `${days} días`;
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    if (months > 0 && remainingDays > 0) {
      return `${months} ${months === 1 ? "mes" : "meses"} y ${remainingDays} ${remainingDays === 1 ? "día" : "días"}`;
    } else if (months > 0) {
      return `${months} ${months === 1 ? "mes" : "meses"}`;
    }
    return `${days} días`;
  };
  const getCycleLabel = (cycle) => {
    switch (cycle) {
      case "monthly":
        return "Mensual";
      case "quarterly":
        return "Trimestral";
      case "semiannual":
        return "Semestral";
      case "yearly":
        return "Anual";
      default:
        return cycle;
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Mi Plan y Suscripción" }),
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto space-y-16 pb-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-black tracking-tighter uppercase text-slate-900", children: "Planes y Suscripción" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-400 font-bold uppercase tracking-widest text-[11px]", children: "Gestiona tu nivel de servicio y activa nuevas funcionalidades." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs(Card, { className: "md:col-span-2 shadow-xl border overflow-hidden relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-12 opacity-[0.03] rotate-12", children: /* @__PURE__ */ jsx(Zap, { className: "w-48 h-48" }) }),
          /* @__PURE__ */ jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-primary border-primary/20 mb-2 uppercase tracking-widest font-black text-[10px]", children: "Plan Actual" }),
              /* @__PURE__ */ jsx(CardTitle, { className: "text-3xl font-black", children: currentPlan?.name || "Inactivo" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1", children: "Estado" }),
              /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: subscription?.status === "active" || subscription?.status === "trialing" ? "default" : "destructive",
                  children: subscription?.status === "trialing" ? "En Prueba" : "Suscripción Activa"
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6 relative z-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs font-bold uppercase tracking-widest", children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Progreso del Ciclo" }),
                /* @__PURE__ */ jsxs("span", { className: "text-primary", children: [
                  subscription?.percent_completed,
                  "% completado"
                ] })
              ] }),
              /* @__PURE__ */ jsx(Progress, { value: subscription?.percent_completed, className: "h-2 bg-muted shadow-inner" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-6 pt-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1", children: subscription?.status === "trialing" ? "Días de Prueba" : "Tiempo Restante" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsx("span", { className: "font-black", children: getRemainingTimeText() })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1", children: "Próximo Cobro" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsx("span", { className: "font-black", children: subscription?.next_payment_date ? new Date(subscription.next_payment_date).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }) : "Pendiente" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1", children: [
                  "Valor ",
                  getCycleLabel(subscription?.billing_cycle || "")
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-primary", children: formatCurrency(
                  subscription?.billing_cycle === "yearly" ? currentPlan?.yearly_price || 0 : subscription?.billing_cycle === "semiannual" ? currentPlan?.semiannual_price || 0 : subscription?.billing_cycle === "quarterly" ? currentPlan?.quarterly_price || 0 : currentPlan?.monthly_price || 0
                ) })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "pt-4 flex flex-wrap gap-4 border-t", children: pendingInvoice ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border w-full animate-in fade-in slide-in-from-top-2", children: [
              /* @__PURE__ */ jsx("div", { className: "h-10 w-10 bg-muted rounded-xl flex items-center justify-center text-amber-600", children: /* @__PURE__ */ jsx(AlertCircle, { className: "w-6 h-6" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-black uppercase tracking-tight", children: "Tienes una factura pendiente" }),
                /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: [
                  "#",
                  pendingInvoice.id,
                  " • ",
                  formatCurrency(pendingInvoice.amount)
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", className: "h-9 px-4 rounded-xl font-bold bg-background", asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: route("tenant.invoices.show", { tenant: tenant?.slug, invoice: pendingInvoice.id }), children: [
                  /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4 mr-2" }),
                  " Detalle"
                ] }) }),
                /* @__PURE__ */ jsxs(Button, { size: "sm", className: "h-9 px-6 rounded-xl font-black", onClick: () => handleActionWithPermission("billing.manage", () => setIsUploadOpen(true)), children: [
                  /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4 mr-2" }),
                  " Pagar Ahora"
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full bg-muted/30 p-4 rounded-2xl border", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "h-9 w-9 bg-background rounded-xl shadow-sm border flex items-center justify-center text-muted-foreground", children: /* @__PURE__ */ jsx(Banknote, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] font-black uppercase tracking-tight", children: "¿Quieres pagar por adelantado?" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Asegura tu servicio para el próximo ciclo" })
                ] })
              ] }),
              /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", className: "h-9 px-6 rounded-xl font-bold bg-background transition-all hover:scale-[1.02]", onClick: handleAdvanceInvoice, children: "Adelantar Pago" })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "shadow-lg border bg-muted/30 flex flex-col justify-between", children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-widest", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4" }),
            "Tu Seguridad"
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground font-medium leading-relaxed", children: "Tu información de facturación está protegida. Si tienes dudas sobre tu plan actual, puedes ver tus facturas anteriores." }),
            /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full h-10 font-bold bg-background", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("tenant.invoices.index", { tenant: tenant?.slug }), children: "Ver Historial de Facturas" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black tracking-tighter uppercase text-slate-900", children: "Selecciona tu Plan" }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] font-bold text-slate-400 uppercase tracking-widest", children: "Escoge la opción que mejor se adapte a tu marca." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1", children: ["monthly", "quarterly", "yearly"].map((cycle) => /* @__PURE__ */ jsxs(
            Button,
            {
              variant: billingCycle === cycle ? "default" : "ghost",
              size: "sm",
              className: cn(
                "h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                billingCycle === cycle ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
              ),
              onClick: () => setBillingCycle(cycle),
              children: [
                cycle === "monthly" ? "Mensual" : cycle === "quarterly" ? "Trimestral" : "Anual",
                cycle === "yearly" && /* @__PURE__ */ jsx(Badge, { className: "ml-2 bg-green-500 text-[8px] py-0 px-1 border-none text-white", children: "-15%" })
              ]
            },
            cycle
          )) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", children: plans.map((plan) => {
          const isFeatured = plan.name.toLowerCase().includes("pro") || plan.name.toLowerCase().includes("premium");
          const price = billingCycle === "yearly" ? plan.yearly_price : billingCycle === "quarterly" ? plan.quarterly_price || 0 : plan.monthly_price;
          const isCurrentCycle = plan.id === currentPlan?.id && billingCycle === subscription?.billing_cycle;
          return /* @__PURE__ */ jsxs(
            Card,
            {
              className: cn(
                "relative transition-all duration-500 border-2 flex flex-col h-full overflow-hidden group",
                isFeatured ? "border-primary shadow-2xl shadow-primary/10 z-10 scale-[1.02]" : "border-slate-100 hover:border-slate-200"
              ),
              children: [
                isFeatured && /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 left-0 bg-primary text-white py-2 text-[10px] font-black uppercase tracking-[0.2em] text-center", children: "¡Oferta por tiempo limitado!" }),
                /* @__PURE__ */ jsxs(CardHeader, { className: cn("pt-6", isFeatured && "pt-14"), children: [
                  /* @__PURE__ */ jsx(CardTitle, { className: "text-xl font-black tracking-tighter text-slate-900 uppercase", children: plan.name }),
                  /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-4xl font-black text-slate-900 tracking-tighter", children: formatCurrency(price) }),
                    /* @__PURE__ */ jsxs("span", { className: "text-slate-400 text-[10px] font-bold uppercase", children: [
                      "/",
                      billingCycle === "monthly" ? "mes" : "ciclo"
                    ] })
                  ] }) })
                ] }),
                /* @__PURE__ */ jsxs(CardContent, { className: "flex-1 px-8 flex flex-col", children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      disabled: isCurrentCycle,
                      onClick: () => handleActionWithPermission("billing.manage", () => {
                        router.visit(route("tenant.subscription.checkout", {
                          tenant: tenant.slug,
                          plan_id: plan.id,
                          billing_cycle: billingCycle
                        }));
                      }),
                      className: cn(
                        "w-full h-8 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all",
                        isCurrentCycle ? "bg-slate-100 text-slate-400 border shadow-none" : isFeatured ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" : "bg-slate-900 hover:bg-slate-800 text-white"
                      ),
                      children: isCurrentCycle ? "Plan Actual" : "Continuar al Pago"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "w-full space-y-2 pt-4 border-t border-slate-50", children: (() => {
                    const features = plan.features;
                    if (!features) return null;
                    let displayFeatures = [];
                    if (Array.isArray(features)) {
                      features.forEach((f) => {
                        if (typeof f === "string") displayFeatures.push(f);
                        else if (typeof f === "object" && f !== null) {
                          Object.keys(f).forEach((k) => {
                            if (f[k] === true || f[k] === 1 || f[k] === "1") displayFeatures.push(k);
                          });
                        }
                      });
                    } else if (typeof features === "object") {
                      Object.keys(features).forEach((k) => {
                        if (features[k] === true || features[k] === 1 || features[k] === "1") displayFeatures.push(k);
                      });
                    }
                    if (displayFeatures.length === 0) return null;
                    return displayFeatures.map((feature, i) => {
                      const isExcluded = feature.startsWith("-");
                      const cleanFeature = isExcluded ? feature.substring(1) : feature;
                      const label = MODULE_LABELS[cleanFeature] || cleanFeature;
                      return /* @__PURE__ */ jsxs("div", { className: cn(
                        "flex items-center justify-start",
                        isExcluded ? "opacity-30" : "opacity-100"
                      ), children: [
                        /* @__PURE__ */ jsx(Check, { className: cn(
                          "w-4 h-4 mr-2",
                          isExcluded ? "text-slate-400" : "text-slate-600"
                        ) }),
                        /* @__PURE__ */ jsx("span", { className: cn(
                          "text-[12px] font-bold",
                          isExcluded ? "text-slate-400" : "text-slate-600"
                        ), children: label })
                      ] }, i);
                    });
                  })() })
                ] }),
                /* @__PURE__ */ jsx(CardFooter, { className: "pb-8 pt-0 px-8 flex flex-col gap-4" })
              ]
            },
            plan.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-muted/30 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 border", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-primary", children: [
            /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-black uppercase tracking-widest", children: "Importante" })
          ] }),
          /* @__PURE__ */ jsx("h4", { className: "text-xl font-black uppercase", children: "¿Necesitas un plan personalizado?" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm font-medium", children: "Si tu proyecto requiere límites especiales o integraciones dedicadas, estamos aquí para ayudarte." })
        ] }),
        /* @__PURE__ */ jsx(Button, { size: "lg", className: "rounded-2xl font-black h-14 px-8 border-2 shadow-sm min-w-[200px]", variant: "outline", children: "Contactar Soporte" })
      ] })
    ] }),
    pendingInvoice && /* @__PURE__ */ jsx(
      PaymentUploadModal,
      {
        isOpen: isUploadOpen,
        onClose: () => setIsUploadOpen(false),
        invoice: pendingInvoice
      }
    ),
    /* @__PURE__ */ jsx(Dialog, { open: slugWarning.show, onOpenChange: (open) => !open && setSlugWarning({ ...slugWarning, show: false }), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-amber-600", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5" }),
          "Advertencia: Perderás tu URL personalizada"
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { asChild: true, className: "pt-4 space-y-3", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { children: [
            "El plan que seleccionaste ",
            /* @__PURE__ */ jsx("strong", { children: "no permite URL personalizada" }),
            ". Si continúas, tu tienda cambiará de dirección:"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-lg p-4 space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Actual:" }),
              /* @__PURE__ */ jsxs("code", { className: "bg-muted px-2 py-1 rounded font-bold text-sm", children: [
                "/",
                slugWarning.currentSlug
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Nueva:" }),
              /* @__PURE__ */ jsxs("code", { className: "bg-muted px-2 py-1 rounded font-bold text-sm", children: [
                "/",
                slugWarning.newAutoSlug
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-amber-600 text-sm font-bold", children: "⚠️ Todos los enlaces anteriores a tu tienda dejarán de funcionar." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setSlugWarning({ ...slugWarning, show: false }),
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "destructive",
            onClick: handleConfirmSlugLoss,
            children: "Entiendo, cambiar de plan"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
