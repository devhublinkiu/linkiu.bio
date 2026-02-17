import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card } from "./card-BaovBWX5.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { Clock, SearchCheck, ShieldCheck, CheckCircle2, CalendarCheck, BellRing, Home, MessageCircle, ShoppingBag } from "lucide-react";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
function Pending({ tenant, siteSettings }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "En proceso de revisión | Linkiu" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-50/50 via-white to-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-xl w-full text-center space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative inline-block", children: [
          /* @__PURE__ */ jsx("div", { className: "h-28 w-28 bg-amber-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-amber-200 animate-pulse", children: /* @__PURE__ */ jsx(Clock, { className: "w-14 h-14 text-white" }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute -top-6 -right-6 h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-12 scale-110", children: /* @__PURE__ */ jsx(SearchCheck, { className: "w-7 h-7" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "px-4 py-1.5 border-amber-200 bg-amber-50 text-amber-700 font-bold uppercase tracking-wider", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 mr-2" }),
            "SOLICITUD EN REVISIÓN"
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "text-4xl font-black tracking-tight text-slate-800", children: [
            "¡Ya casi está listo, ",
            /* @__PURE__ */ jsx("span", { className: "text-amber-600", children: tenant.name }),
            "!"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 max-w-lg mx-auto font-medium", children: "Tu industria requiere una validación rápida por parte de nuestro equipo para asegurar que todo esté perfecto." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-slate-100 bg-white shadow-2xl shadow-slate-200/40 p-10 rounded-[2.5rem] text-left space-y-10 ring-1 ring-slate-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex gap-6 relative group", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute left-[19px] top-10 bottom-[-40px] w-0.5 bg-slate-100 group-last:hidden" }),
            /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 z-10 border-2 border-green-100", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-6 h-6" }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1 mt-1", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-extrabold text-slate-900 leading-tight", children: "Perfil Registrado" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 font-medium", children: "Hemos recibido la información de tu cuenta y negocio." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-6 relative group", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute left-[19px] top-10 bottom-[-40px] w-0.5 bg-slate-100 group-last:hidden" }),
            /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 z-10 border-2 border-amber-200 ring-4 ring-amber-50", children: /* @__PURE__ */ jsx(CalendarCheck, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1 mt-1", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-extrabold text-slate-900 leading-tight", children: "Revisión de Seguridad" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 font-medium", children: "Nuestro equipo está validando tu categoría de negocio (Gastro/Ventas)." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-6 relative group", children: [
            /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center flex-shrink-0 z-10 border-2 border-slate-100", children: /* @__PURE__ */ jsx(BellRing, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1 mt-1", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-extrabold text-slate-400 leading-tight italic", children: "Activación de Cuenta" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400", children: "Recibirás un WhatsApp en menos de 24 horas." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 pt-4", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              asChild: true,
              size: "lg",
              className: "h-14 flex-1 text-base font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02]",
              children: /* @__PURE__ */ jsxs(Link, { href: "/", children: [
                "Volver al Inicio",
                /* @__PURE__ */ jsx(Home, { className: "ml-2 w-5 h-5" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "lg",
              className: "h-14 flex-1 text-base font-bold rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 transition-all",
              onClick: () => window.open("https://wa.me/support", "_blank"),
              children: [
                /* @__PURE__ */ jsx(MessageCircle, { className: "mr-2 w-5 h-5" }),
                "Hablar con Soporte"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-4 flex flex-col items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-bold text-xl tracking-tight text-slate-300 opacity-60", children: [
          /* @__PURE__ */ jsx("div", { className: "h-10 w-10 flex items-center justify-center bg-slate-100 p-2 rounded-xl", children: /* @__PURE__ */ jsx(ShoppingBag, { className: "h-6 h-6 text-slate-400" }) }),
          /* @__PURE__ */ jsx("span", { className: "font-black", children: "LINKIU.BIO" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 uppercase tracking-widest font-black", children: "Verificando tiendas extraordinarias" })
      ] })
    ] }) })
  ] });
}
export {
  Pending as default
};
