import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { CheckCircle2, Globe, CreditCard, ShieldCheck, Calendar, XCircle, ArrowLeft } from "lucide-react";
import { C as Card } from "./card-BaovBWX5.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { B as Button } from "./button-BdX_X5dq.js";
import "react";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "class-variance-authority";
import "@radix-ui/react-slot";
function Verify({ isValid, invoice, tenant, plan, status, message }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(amount);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans select-none", children: [
    /* @__PURE__ */ jsx(Head, { title: "Verificación de Comprobante - Linkiu.bio" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black tracking-tighter uppercase text-slate-900 leading-none", children: "LINKIU.BIO" }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400", children: "Security Verification Service" })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "rounded-[40px] border-none shadow-2xl overflow-hidden bg-white p-8 sm:p-12 text-center relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0" }),
        /* @__PURE__ */ jsx("div", { className: "relative z-10 space-y-8", children: isValid ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-600", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-16 h-16" }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-slate-900 uppercase tracking-tight", children: "Comprobante Válido" }),
            /* @__PURE__ */ jsxs(Badge, { className: "bg-green-500 text-white font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest border-none", children: [
              "Estado: ",
              status === "paid" ? "Pagado y Activo" : "En Procesamiento"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6 pt-6 border-t border-slate-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 text-left", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Globe, { className: "w-3 h-3" }),
                  " Marca"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-black text-slate-900", children: tenant.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-right", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center justify-end gap-1", children: [
                  /* @__PURE__ */ jsx(CreditCard, { className: "w-3 h-3" }),
                  " Factura"
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-black text-slate-900", children: [
                  "#INV-",
                  invoice.id
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3 h-3" }),
                  " Plan"
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-black text-slate-900 uppercase", children: [
                  "Plan ",
                  plan.name
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-right", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center justify-end gap-1", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3" }),
                  " Fecha"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-black text-slate-900", children: formatDate(invoice.paid_at || invoice.created_at) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-slate-400", children: "Total Transacción" }),
              /* @__PURE__ */ jsx("div", { className: "text-4xl font-black text-primary tracking-tighter", children: formatAmount(invoice.amount) })
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center text-red-600", children: /* @__PURE__ */ jsx(XCircle, { className: "w-16 h-16" }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black text-slate-900 uppercase tracking-tight", children: "Error de Validación" }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-500 font-bold text-sm leading-relaxed", children: message || "El comprobante que intentas verificar no es válido o ha expirado." })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-slate-400", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest italic opacity-50", children: "Verified by Linkiu Pay Secure Systems" })
        ] }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", asChild: true, className: "font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-primary gap-2", children: /* @__PURE__ */ jsxs(Link, { href: "/", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
          "Volver a Linkiu.bio"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-amber-500/50 to-primary/50" })
  ] });
}
export {
  Verify as default
};
