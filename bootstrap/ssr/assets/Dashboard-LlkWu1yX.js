import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-CegS7XIj.js";
import { Link, useForm, router, usePage, Head } from "@inertiajs/react";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-BaovBWX5.js";
import { AlertCircle, Clock, Rocket, ArrowRight, Sparkles, Globe, Loader2, Check, X, Zap, ShoppingBag, Users, Store } from "lucide-react";
import { useState, useEffect } from "react";
import { B as Button } from "./button-BdX_X5dq.js";
import { route } from "ziggy-js";
import { c as cn } from "./utils-B0hQsrDj.js";
import { a as MODULE_LABELS } from "./menuConfig-rtCrEhXP.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import axios from "axios";
import { toast } from "sonner";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./dropdown-menu-Dkgv2tnp.js";
import "@radix-ui/react-slot";
import "vaul";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./sonner-ZUDSQr7N.js";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
function TrialUrgencyBanner({ tenant }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  useEffect(() => {
    if (!tenant?.trial_ends_at) return;
    const timer = setInterval(() => {
      const now = (/* @__PURE__ */ new Date()).getTime();
      const end = new Date(tenant.trial_ends_at).getTime();
      const diff = end - now;
      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft("Expirado");
        clearInterval(timer);
        return;
      }
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    }, 1e3 * 60);
    return () => clearInterval(timer);
  }, [tenant?.trial_ends_at]);
  if (!tenant?.trial_ends_at || tenant?.latest_subscription && tenant?.latest_subscription?.status !== "pending") {
    return null;
  }
  return /* @__PURE__ */ jsxs(Card, { className: cn(
    "relative overflow-hidden border-none shadow-lg animate-in fade-in slide-in-from-top-4 duration-500",
    isExpired ? "bg-destructive/10 border-destructive/20" : "bg-gradient-to-r from-blue-600 to-indigo-700"
  ), children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 bg-white/5 rounded-full blur-3xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-center md:text-left", children: [
        /* @__PURE__ */ jsx("div", { className: cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner shrink-0",
          isExpired ? "bg-destructive/20 text-destructive" : "bg-white/10 text-white"
        ), children: isExpired ? /* @__PURE__ */ jsx(AlertCircle, { className: "w-6 h-6" }) : /* @__PURE__ */ jsx(Clock, { className: "w-6 h-6 animate-pulse" }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("h3", { className: cn(
            "text-lg font-black tracking-tight",
            isExpired ? "text-destructive" : "text-white"
          ), children: isExpired ? "Tu periodo de configuración ha expirado" : "Tu ventana de lanzamiento está activa" }),
          /* @__PURE__ */ jsx("p", { className: cn(
            "text-sm font-medium opacity-90",
            isExpired ? "text-destructive/80" : "text-white/80"
          ), children: isExpired ? "Para que tus clientes puedan comprar, necesitas activar un plan ahora." : `Tienes ${timeLeft} para configurar y lanzar tu tienda.` })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 shrink-0", children: /* @__PURE__ */ jsx(Link, { href: route("tenant.subscription.index", { tenant: tenant.slug }), children: /* @__PURE__ */ jsxs(
        Button,
        {
          variant: isExpired ? "destructive" : "secondary",
          className: "font-bold shadow-sm active:scale-95 transition-all group px-6",
          children: [
            /* @__PURE__ */ jsx(Rocket, { className: "w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" }),
            isExpired ? "Activar ahora" : "Elegir un Plan",
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" })
          ]
        }
      ) }) })
    ] })
  ] });
}
function CustomSlugBanner({ tenant, plans }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("search");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [isValidating, setIsValidating] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [slugError, setSlugError] = useState(null);
  const { data, setData, post, processing } = useForm({
    slug: tenant?.slug?.replace(/-\d{4}$/, "") || "",
    plan_id: null,
    billing_cycle: "monthly"
  });
  useEffect(() => {
    if (isOpen && data.slug && step === "search") {
      validateSlug(data.slug);
    }
  }, [isOpen]);
  const isProvisional = /-\d{4}$/.test(tenant?.slug || "");
  const isWithinTrial = tenant?.trial_ends_at ? new Date(tenant.trial_ends_at) > /* @__PURE__ */ new Date() : false;
  const isActuallyPro = !!(tenant?.latest_subscription?.plan?.allow_custom_slug && tenant?.latest_subscription?.status === "active");
  const canCustomize = isActuallyPro || isWithinTrial;
  if (!isProvisional) return null;
  const handleSlugChange = (e) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    setData("slug", val);
    validateSlug(val);
  };
  const validateSlug = async (slug) => {
    setIsValidating(true);
    setSlugError(null);
    setIsAvailable(null);
    try {
      const response = await axios.post(route("onboarding.validate"), {
        field: "slug",
        value: slug
      });
      if (response.data.valid) {
        setIsAvailable(true);
      } else {
        setIsAvailable(false);
        setSlugError(response.data.message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsValidating(false);
    }
  };
  const handleSelectPlan = (planId) => {
    router.post(route("tenant.subscription.change-plan", { tenant: tenant.slug }), {
      slug: data.slug,
      plan_id: planId,
      billing_cycle: billingCycle
    }, {
      onSuccess: () => {
        setIsOpen(false);
        toast.success("¡Plan seleccionado y URL actualizada con éxito!");
      },
      onError: (err) => {
        toast.error("Error al procesar el cambio de plan");
      }
    });
  };
  const updateSlug = () => {
    post(route("tenant.slug.update", { tenant: tenant.slug }), {
      onSuccess: () => {
        setIsOpen(false);
        toast.success("¡URL y Plan actualizados con éxito!");
      },
      onError: (err) => {
        toast.error(Object.values(err)[0]);
      }
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (slugError) return;
    if (isActuallyPro) {
      updateSlug();
    } else {
      setStep("pricing");
    }
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(amount);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Card, { className: "p-1 border-none bg-gradient-to-r from-amber-50 to-orange-50 overflow-hidden relative group", children: [
      /* @__PURE__ */ jsx(Sparkles, { className: "absolute -right-2 -top-2 w-12 h-12 text-amber-200/50 rotate-12 group-hover:scale-110 transition-transform" }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0", children: /* @__PURE__ */ jsx(Globe, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-sm font-black text-slate-800 uppercase tracking-tight", children: "¡Tu marca merece un link profesional!" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 font-medium", children: [
              "Actualmente usas ",
              /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700", children: tenant.slug }),
              ".",
              canCustomize ? "Reclama tu link corto ahora." : "Pásate a Pro para eliminar los números."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: () => setIsOpen(true),
            children: [
              isActuallyPro ? "Personalizar URL" : "Quitar números",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5 ml-2" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: (val) => {
      setIsOpen(val);
      if (!val) setStep("search");
    }, children: /* @__PURE__ */ jsxs(DialogContent, { className: cn(
      "rounded-[32px] border-none shadow-2xl px-8 py-6 transition-all duration-300",
      step === "pricing" ? "sm:max-w-[700px]" : "sm:max-w-[425px]"
    ), children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-2xl font-black tracking-tight flex items-center gap-2", children: step === "search" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Globe, { className: "w-6 h-6 text-primary" }),
          "Personaliza tu URL"
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "w-6 h-6 text-amber-500" }),
          "Elige tu Plan Pro"
        ] }) }),
        /* @__PURE__ */ jsx(DialogDescription, { className: "font-medium", children: step === "search" ? "Elige una dirección web limpia y fácil de recordar para tus clientes." : "Activa tu link personalizado seleccionando el plan que prefieras." })
      ] }),
      step === "search" ? /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "slug", className: "text-sm font-bold ml-1", children: "Nueva dirección web" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm", children: "linkiu.bio/" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "slug",
                value: data.slug,
                onChange: handleSlugChange,
                placeholder: "tu-marca",
                className: cn(
                  "h-14 pl-[85px] pr-10 rounded-2xl font-bold border-slate-100 bg-slate-50/50 transition-all text-lg",
                  slugError ? "ring-destructive/20 border-destructive" : "focus:ring-primary/20 focus:border-primary"
                )
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2", children: [
              isValidating && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 text-primary animate-spin" }),
              !isValidating && isAvailable === true && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2 py-0.5 bg-green-500 rounded-full text-[10px] font-black text-white uppercase animate-in zoom-in duration-300", children: [
                /* @__PURE__ */ jsx(Check, { className: "w-3 h-3" }),
                "Disponible"
              ] }),
              !isValidating && isAvailable === false && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2 py-0.5 bg-destructive rounded-full text-[10px] font-black text-white uppercase animate-in zoom-in duration-300", children: [
                /* @__PURE__ */ jsx(X, { className: "w-3 h-3" }),
                "Ocupado"
              ] })
            ] })
          ] }),
          slugError && /* @__PURE__ */ jsx("p", { className: "text-[11px] font-bold text-destructive ml-1", children: slugError })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-2xl bg-amber-50 border border-amber-100 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-amber-700", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-black uppercase tracking-tight", children: "Estrategia de Marca" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-amber-900/70 font-bold leading-relaxed", children: isActuallyPro ? "Como usuario Pro, puedes cambiar tu URL inmediatamente." : "Esta URL profesional se activará al elegir tu Plan Pro. ¡Asegura tu nombre ahora!" })
        ] }),
        /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsxs(
          Button,
          {
            type: "submit",
            disabled: processing || isValidating || !isAvailable || data.slug.length < 3,
            className: "w-full h-10 font-black text-lg shadow-lg",
            children: [
              isActuallyPro ? "Confirmar URL" : "Continuar a Selección de Plan",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 ml-2" })
            ]
          }
        ) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "py-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-slate-100 p-1 rounded-2xl flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: billingCycle === "monthly" ? "default" : "ghost",
              size: "sm",
              onClick: () => setBillingCycle("monthly"),
              className: cn(
                "h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                billingCycle === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
              ),
              children: "Mensual"
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: billingCycle === "yearly" ? "default" : "ghost",
              size: "sm",
              onClick: () => setBillingCycle("yearly"),
              className: cn(
                "h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                billingCycle === "yearly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
              ),
              children: [
                "Anual",
                /* @__PURE__ */ jsx(Badge, { className: "ml-2 bg-green-500 text-[8px] py-0 px-1 border-none text-white", children: "-15%" })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: plans?.filter((p) => !p.name.toLowerCase().includes("free")).map((plan) => /* @__PURE__ */ jsx(
          PlanCard,
          {
            plan,
            billingCycle,
            processing,
            onSelect: handleSelectPlan,
            formatCurrency
          },
          plan.id
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setStep("search"),
            className: "w-full text-center text-sm font-bold text-slate-900 hover:text-slate-600 transition-colors",
            children: "← Volver a buscar URL"
          }
        )
      ] })
    ] }) })
  ] });
}
function PlanCard({ plan, billingCycle, processing, onSelect, formatCurrency }) {
  const [showMore, setShowMore] = useState(false);
  const isPro = plan.name.toLowerCase().includes("pro");
  const price = billingCycle === "yearly" ? plan.yearly_price : plan.monthly_price;
  const features = plan.features;
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
  } else if (typeof features === "object" && features !== null) {
    Object.keys(features).forEach((k) => {
      if (features[k] === true || features[k] === 1 || features[k] === "1") displayFeatures.push(k);
    });
  }
  const visibleFeatures = showMore ? displayFeatures : displayFeatures.slice(0, 5);
  const hasMore = displayFeatures.length > 5;
  return /* @__PURE__ */ jsx(
    Card,
    {
      className: cn(
        "p-6 rounded-3xl border-2 transition-all cursor-pointer group hover:scale-[1.02]",
        isPro ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" : "border-slate-100"
      ),
      onClick: () => !processing && onSelect(plan.id),
      children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsx("h5", { className: "font-black uppercase tracking-tighter text-lg", children: plan.name }),
          isPro && /* @__PURE__ */ jsx(Badge, { className: "bg-primary text-[8px] animate-pulse whitespace-nowrap", children: "RECOMENDADO" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-3xl font-black", children: formatCurrency(price) }),
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-slate-400 font-bold uppercase", children: [
            "/",
            billingCycle === "monthly" ? "mes" : "año"
          ] })
        ] }),
        /* @__PURE__ */ jsx("ul", { children: visibleFeatures.map((feature, i) => {
          const isExcluded = feature.startsWith("-");
          const cleanFeature = isExcluded ? feature.substring(1) : feature;
          const label = MODULE_LABELS[cleanFeature] || cleanFeature;
          return /* @__PURE__ */ jsxs("li", { className: cn(
            "flex items-center gap-2 text-[11px] font-medium text-left",
            isExcluded ? "text-slate-300 line-through" : "text-slate-600"
          ), children: [
            /* @__PURE__ */ jsx(Check, { className: cn("w-3 h-3 shrink-0", isExcluded ? "text-slate-200" : "text-green-500") }),
            /* @__PURE__ */ jsx("span", { className: "flex-1", children: label })
          ] }, i);
        }) }),
        hasMore && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: (e) => {
              e.stopPropagation();
              setShowMore(!showMore);
            },
            className: "w-full text-center text-[10px] font-black text-primary uppercase tracking-tight hover:underline flex items-center justify-center gap-1",
            children: showMore ? "Ver menos" : `Ver ${displayFeatures.length - 5} más`
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            className: cn(
              isPro ? "bg-primary text-white" : "w-full"
            ),
            disabled: processing,
            children: processing ? "Procesando..." : "Seleccionar Plan"
          }
        )
      ] })
    }
  );
}
function Dashboard({ plans }) {
  const { auth, currentTenant } = usePage().props;
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Panel de Control", children: [
    /* @__PURE__ */ jsx(Head, { title: `Dashboard - ${currentTenant?.name || "Cargando..."}` }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(TrialUrgencyBanner, { tenant: currentTenant }),
      /* @__PURE__ */ jsx(CustomSlugBanner, { tenant: currentTenant, plans }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold tracking-tight", children: [
          "¡Hola, ",
          auth?.user?.name?.split(" ")[0] || "Usuario",
          "! 👋"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-500", children: [
          "Bienvenido al centro de control de ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: currentTenant?.name || "tu tienda" }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-sm shadow-blue-100/50", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Ventas Totales" }),
            /* @__PURE__ */ jsx(Zap, { className: "h-4 w-4 text-primary" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: "$0.00" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "+0% desde el mes anterior" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-sm shadow-blue-100/50", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Pedidos Nuevos" }),
            /* @__PURE__ */ jsx(ShoppingBag, { className: "h-4 w-4 text-primary" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: "0" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "+0 desde ayer" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-sm shadow-blue-100/50", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Clientes" }),
            /* @__PURE__ */ jsx(Users, { className: "h-4 w-4 text-primary" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: "0" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "+0 nuevos este mes" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-sm shadow-blue-100/50", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Estado Tienda" }),
            /* @__PURE__ */ jsx(Store, { className: "h-4 w-4 text-primary" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: "Activa" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-green-600 font-medium", children: "Todo funciona correctamente" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-7", children: [
        /* @__PURE__ */ jsxs(Card, { className: "col-span-4 border-none shadow-sm shadow-blue-100/50", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Resumen de Actividad" }) }),
          /* @__PURE__ */ jsx(CardContent, { className: "h-[200px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl m-1", children: /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-sm font-medium", children: "Pronto verás gráficas de tus ventas aquí" }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "col-span-3 border-none shadow-sm shadow-blue-100/50", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Últimos Pedidos" }) }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsx("div", { className: "p-8 text-center border-2 border-dashed border-slate-100 rounded-xl", children: /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-sm font-medium", children: "Aún no tienes pedidos" }) }) }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Dashboard as default
};
