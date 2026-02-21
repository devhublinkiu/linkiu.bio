import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import ReactConfetti from "react-confetti";
import { c as cn } from "./utils-B0hQsrDj.js";
import { useState } from "react";
import { toast } from "sonner";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card } from "./card-BaovBWX5.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { CheckCircle2, PartyPopper, Globe, Check, Copy, LayoutDashboard, Store, Rocket, ShoppingBag } from "lucide-react";
import { u as useWindowSize } from "./useWindowSize-BFapJuGt.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./util-Dl4_fw_3.js";
function Success({ tenant, siteSettings }) {
  const { width, height } = useWindowSize();
  const [copied, setCopied] = useState(false);
  const storeUrl = `https://linkiu.bio/${tenant.slug}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    toast.success("¡Enlace copiado al portapapeles!");
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "¡Tienda Lista! | Linkiu" }),
    /* @__PURE__ */ jsx(
      ReactConfetti,
      {
        width,
        height,
        recycle: false,
        numberOfPieces: 400,
        gravity: 0.12,
        colors: ["#4F46E5", "#10B981", "#F59E0B", "#6366F1"]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-white to-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl w-full text-center space-y-12 animate-in fade-in zoom-in duration-1000", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative inline-block", children: [
          /* @__PURE__ */ jsx("div", { className: "h-28 w-28 bg-green-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-green-200 rotate-6 animate-bounce transition-all hover:rotate-0", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-16 h-16 text-white" }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute -top-6 -right-6 h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl -rotate-12 scale-110 animate-pulse", children: /* @__PURE__ */ jsx(PartyPopper, { className: "w-7 h-7" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "px-4 py-1.5 border-green-200 bg-green-50 text-green-700 font-bold uppercase tracking-wider backdrop-blur-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-2", children: "✨" }),
            " Registro Exitoso"
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight", children: [
            "¡Tu tienda está ",
            /* @__PURE__ */ jsx("span", { className: "text-primary italic", children: "Lista" }),
            "!"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-lg md:text-xl text-slate-500 max-w-lg mx-auto font-medium", children: [
            "Felicitaciones ",
            /* @__PURE__ */ jsx("span", { className: "text-slate-900 font-bold", children: tenant.name }),
            ", acabas de dar el primer paso hacia el éxito digital."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-slate-100 bg-white shadow-2xl shadow-slate-200/50 p-8 rounded-[2rem] space-y-10 relative overflow-hidden ring-1 ring-slate-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-sm font-bold text-slate-400", children: [
            /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4" }),
            "TU DIRECCIÓN WEB PÚBLICA"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-1 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2 group transition-all hover:border-primary/30", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 px-6 py-4 font-mono font-bold text-xl md:text-2xl text-primary tracking-tight truncate", children: [
              "linkiu.bio/",
              /* @__PURE__ */ jsx("span", { className: "text-slate-900", children: tenant.slug })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: copyToClipboard,
                className: cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center transition-all mr-1",
                  copied ? "bg-green-500 text-white" : "bg-white text-slate-400 hover:text-primary hover:bg-slate-100 border border-slate-100"
                ),
                children: copied ? /* @__PURE__ */ jsx(Check, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Copy, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              asChild: true,
              size: "lg",
              className: "h-16 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all",
              children: /* @__PURE__ */ jsxs(Link, { href: `/${tenant.slug}/admin/dashboard`, children: [
                /* @__PURE__ */ jsx(LayoutDashboard, { className: "mr-2 w-5 h-5" }),
                "Ir al Dashboard"
              ] })
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "lg",
              className: "h-16 text-lg font-bold rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-primary transition-all",
              onClick: () => window.open(storeUrl, "_blank"),
              children: [
                /* @__PURE__ */ jsx(Store, { className: "mr-2 w-5 h-5" }),
                "Ver mi Tienda"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute -bottom-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-4 flex flex-col items-center gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 opacity-40", children: [
          /* @__PURE__ */ jsx(Rocket, { className: "w-10 h-10 text-slate-400" }),
          /* @__PURE__ */ jsx("div", { className: "h-8 w-px bg-slate-200" }),
          /* @__PURE__ */ jsx(ShoppingBag, { className: "w-10 h-10 text-slate-400" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]", children: "Powered by Linkiu Ecosystem" })
      ] })
    ] }) })
  ] });
}
export {
  Success as default
};
