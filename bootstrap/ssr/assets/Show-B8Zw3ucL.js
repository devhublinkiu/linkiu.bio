import { jsxs, jsx } from "react/jsx-runtime";
import { S as SuperAdminLayout } from "./SuperAdminLayout-BMVUVnkF.js";
import { Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { ArrowLeft, Pencil, Check, Tag, Clock, CreditCard, X, Shield } from "lucide-react";
import "react";
import "./dropdown-menu-Dkgv2tnp.js";
import "@radix-ui/react-slot";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "vaul";
import "axios";
import "sonner";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./input-B_4qRSOV.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./ApplicationLogo-xMpxFOcX.js";
import "class-variance-authority";
function Show({ plan }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: plan.currency
    }).format(price);
  };
  const calculateDiscountedPrice = (months, discount) => {
    const total = plan.monthly_price * months;
    return total * (1 - discount / 100);
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: `Detalles del Plan: ${plan.name}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Plan ${plan.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto py-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", asChild: true, className: "pl-0 hover:bg-transparent text-muted-foreground hover:text-gray-900", children: /* @__PURE__ */ jsxs(Link, { href: route("plans.index"), children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }),
          "Volver al listado"
        ] }) }),
        /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: route("plans.edit", plan.id), children: [
          /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4 mr-2" }),
          "Editar Plan"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-6", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-start justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: plan.name }),
                  plan.is_featured && /* @__PURE__ */ jsx(Badge, { className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100", children: plan.highlight_text || "Destacado" }),
                  !plan.is_public && /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Oculto" })
                ] }),
                /* @__PURE__ */ jsx(CardDescription, { className: "mt-2 text-base", children: plan.description || "Sin descripción" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "mb-2 block w-fit ml-auto", children: plan.vertical?.name || "General" }),
                /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-gray-900", children: [
                  formatPrice(plan.monthly_price),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-normal text-muted-foreground", children: " / mes" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { children: [
              plan.cover_url && /* @__PURE__ */ jsx("div", { className: "rounded-lg overflow-hidden border bg-gray-50 h-64 w-full flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx("img", { src: plan.cover_url, alt: plan.name, className: "h-full object-contain" }) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Características incluidas" }),
                /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-3", children: plan.features?.map((feature, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 text-sm text-gray-600", children: [
                  /* @__PURE__ */ jsx("div", { className: "mt-0.5 rounded-full bg-green-100 p-0.5 text-green-600", children: /* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }) }),
                  feature
                ] }, idx)) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Tag, { className: "h-5 w-5 text-blue-600" }),
              "Precios y Descuentos"
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-lg bg-gray-50 border space-y-2", children: [
                /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-500", children: "Trimestral" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-gray-900", children: formatPrice(calculateDiscountedPrice(3, plan.quarterly_discount_percent)) }),
                  plan.quarterly_discount_percent > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "bg-green-100 text-green-700", children: [
                    "-",
                    plan.quarterly_discount_percent,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Por 3 meses" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-lg bg-gray-50 border space-y-2", children: [
                /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-500", children: "Semestral" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-gray-900", children: formatPrice(calculateDiscountedPrice(6, plan.semiannual_discount_percent)) }),
                  plan.semiannual_discount_percent > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "bg-green-100 text-green-700", children: [
                    "-",
                    plan.semiannual_discount_percent,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Por 6 meses" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-lg bg-blue-50 border border-blue-100 space-y-2", children: [
                /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-blue-600", children: "Anual" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-blue-900", children: formatPrice(calculateDiscountedPrice(12, plan.yearly_discount_percent)) }),
                  plan.yearly_discount_percent > 0 && /* @__PURE__ */ jsxs(Badge, { className: "bg-blue-600 hover:bg-blue-700", children: [
                    "-",
                    plan.yearly_discount_percent,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-blue-600/80", children: "Por 12 meses" })
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Configuración del Plan" }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2 border-b last:border-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsx("span", { children: "Días de Prueba" })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                  plan.trial_days,
                  " días"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2 border-b last:border-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
                  /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsx("span", { children: "Sin Tarjeta" })
                ] }),
                plan.no_initial_payment_required ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-green-600" }) : /* @__PURE__ */ jsx(X, { className: "h-4 w-4 text-gray-400" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2 border-b last:border-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
                  /* @__PURE__ */ jsx(Shield, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsx("span", { children: "Soporte" })
                ] }),
                /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "capitalize", children: plan.support_level })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2 border-b last:border-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-5 h-5 flex items-center justify-center border rounded text-[10px] font-bold", children: "@" }),
                  /* @__PURE__ */ jsx("span", { children: "Slug Personalizado" })
                ] }),
                plan.allow_custom_slug ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-green-600" }) : /* @__PURE__ */ jsx(X, { className: "h-4 w-4 text-gray-400" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Información Técnica" }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 text-sm", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-500 block text-[0.65rem] font-bold uppercase tracking-wider mb-1", children: "ID del Sistema" }),
                /* @__PURE__ */ jsx("span", { className: "bg-gray-100 px-2 py-1 rounded text-xs text-gray-700", children: plan.id })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-500 block text-[0.65rem] font-bold uppercase tracking-wider mb-1", children: "Slug" }),
                /* @__PURE__ */ jsx("span", { className: "bg-gray-100 px-2 py-1 rounded text-xs text-gray-700", children: plan.slug || "-" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-500 block text-xs uppercase tracking-wider mb-1", children: "Creado el" }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: new Date(plan.created_at).toLocaleDateString() })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  Show as default
};
