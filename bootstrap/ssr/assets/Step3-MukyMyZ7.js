import { jsx, jsxs } from "react/jsx-runtime";
import { useForm, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { c as cn } from "./utils-B0hQsrDj.js";
import axios from "axios";
import { route } from "ziggy-js";
import { O as OnboardingLayout } from "./OnboardingLayout-EEwXEmJx.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { Sparkles, Store, RefreshCw, Globe, Loader2, CheckCircle2, ChevronLeft, ArrowRight } from "lucide-react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
function Step3({ onboardingData, siteSettings }) {
  const { data, setData, post, processing, errors } = useForm({
    tenant_name: onboardingData?.tenant_name || "",
    slug: onboardingData?.slug || ""
  });
  const [isValidating, setIsValidating] = useState(false);
  const [slugError, setSlugError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [randomId, setRandomId] = useState(() => Math.floor(1e3 + Math.random() * 9e3));
  const toSlug = (text) => {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  };
  const generateSlugWithNewId = (name) => {
    const newId = Math.floor(1e3 + Math.random() * 9e3);
    setRandomId(newId);
    const base = toSlug(name);
    return base ? `${base}-${newId}` : `tienda-${newId}`;
  };
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (data.slug) {
        setIsValidating(true);
        setSlugError(null);
        try {
          const response = await axios.post(route("onboarding.validate"), {
            field: "slug",
            value: data.slug
          });
          if (!response.data.valid) {
            setSlugError(response.data.message);
          }
        } catch (e) {
          console.error("Validation error", e);
        } finally {
          setIsValidating(false);
        }
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [data.slug]);
  const handleComplete = (e) => {
    e.preventDefault();
    if (slugError) {
      toast.error(slugError);
      return;
    }
    post(route("onboarding.complete"), {
      onError: (err) => {
        const msg = Object.values(err)[0];
        toast.error(typeof msg === "string" ? msg : "Revisa los datos de tu tienda");
      }
    });
  };
  return /* @__PURE__ */ jsx(
    OnboardingLayout,
    {
      currentStep: 3,
      siteSettings,
      title: "Nombra tu tienda | Linkiu",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
          /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "px-4 py-1.5 border-primary/20 bg-primary/5 text-primary", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 mr-2" }),
            "Paso 3: Identidad"
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "text-4xl font-extrabold tracking-tight text-slate-900", children: [
            "¿Cómo se llama tu ",
            /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Negocio" }),
            "?"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500", children: "Este será el nombre público de tu tienda y tu dirección web única." })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleComplete, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "tenant_name", className: "text-sm font-bold text-slate-700 ml-1", children: "Nombre de la Tienda" }),
              /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors", children: /* @__PURE__ */ jsx(Store, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "tenant_name",
                    placeholder: "Ej: Deluxe Burger",
                    className: cn(
                      "h-14 pl-12 rounded-2xl border-slate-200 transition-all focus:ring-4 focus:ring-primary/10 font-medium",
                      errors.tenant_name && "border-destructive ring-destructive/10"
                    ),
                    value: data.tenant_name,
                    onChange: (e) => {
                      const val = e.target.value;
                      if (!isDirty) {
                        const base = toSlug(val);
                        setData({
                          ...data,
                          tenant_name: val,
                          slug: base ? `${base}-${randomId}` : ""
                        });
                      } else {
                        setData("tenant_name", val);
                      }
                    },
                    required: true
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between ml-1", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "slug", className: "text-sm font-bold text-slate-700", children: "Tu dirección web (Link)" }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setIsDirty(true);
                      setData("slug", generateSlugWithNewId(data.tenant_name));
                    },
                    className: "text-xs font-bold text-primary hover:underline flex items-center gap-1",
                    children: [
                      /* @__PURE__ */ jsx(RefreshCw, { className: "w-3 h-3" }),
                      "Generar otro"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsxs("div", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: "linkiu.bio/" })
                ] }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "slug",
                    className: cn(
                      "h-14 pl-[105px] pr-12 rounded-2xl border-slate-200 transition-all focus:ring-4 focus:ring-primary/10 font-bold text-primary",
                      (errors.slug || slugError) && "border-destructive ring-destructive/10"
                    ),
                    value: data.slug,
                    onChange: (e) => {
                      setIsDirty(true);
                      setData("slug", e.target.value.toLowerCase().replace(/ /g, "-"));
                    },
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute right-4 top-1/2 -translate-y-1/2", children: isValidating ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 text-primary animate-spin" }) : data.slug && !slugError && /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-green-500 animate-in zoom-in" }) })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 ml-1 leading-normal", children: slugError ? /* @__PURE__ */ jsx("span", { className: "text-destructive font-medium", children: slugError }) : "Puedes personalizar este link ahora o cambiarlo más tarde desde tu panel." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-4 flex items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs font-bold", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-green-600" }),
                "SSL Seguro"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs font-bold", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-green-600" }),
                "CDN Ultra Rápido"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-6", children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("onboarding.step2"),
                className: "flex items-center text-sm font-bold text-slate-400 hover:text-primary transition-colors group",
                children: [
                  /* @__PURE__ */ jsx(ChevronLeft, { className: "mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" }),
                  "Volver a cuenta"
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-300 tracking-widest uppercase", children: "¡Casi listo!" }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "submit",
                  size: "lg",
                  disabled: processing || isValidating,
                  className: "h-14 px-10 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all active:scale-95 group",
                  children: [
                    processing ? "Finalizando..." : "Empezar ahora",
                    /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" })
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] })
    }
  );
}
export {
  Step3 as default
};
