import { jsxs, jsx } from "react/jsx-runtime";
import { Head } from "@inertiajs/react";
import { Store } from "lucide-react";
import { B as Button } from "./button-BdX_X5dq.js";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
function Unavailable() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx(Head, { title: "Tienda no disponible" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100", children: [
      /* @__PURE__ */ jsx("div", { className: "h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(Store, { className: "h-10 w-10 text-amber-500" }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-slate-900 mb-3", children: "Esta tienda no está disponible" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 mb-8 leading-relaxed", children: "La tienda que intentas visitar no está visible al público en este momento. Podría estar en mantenimiento o configurándose." }),
      /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-slate-100", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400 mb-4", children: "¿Eres el dueño de este negocio?" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => window.location.href = "/tenant/admin/login",
            variant: "outline",
            className: "w-full",
            children: "Ingresar al Panel Administrativo"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 font-medium flex items-center justify-center gap-1", children: [
      "Powered by ",
      /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-600", children: "Linkiu" })
    ] }) })
  ] });
}
export {
  Unavailable as default
};
