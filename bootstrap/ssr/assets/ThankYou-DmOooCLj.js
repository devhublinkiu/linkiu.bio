import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { P as PublicLayout, H as Header } from "./Header-8AGqQP0J.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { R as Ripple } from "./ripple-DIsMoMRE.js";
import { CheckCircle2, Banknote } from "lucide-react";
import "./ReportBusinessStrip-Cg46R4fS.js";
import "react";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "sonner";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./input-B_4qRSOV.js";
import "./label-L_u-fyc1.js";
import "@radix-ui/react-label";
import "class-variance-authority";
import "./textarea-BpljFL5D.js";
import "@radix-ui/react-slot";
function DonationsThankYou({ tenant }) {
  const brandColors = tenant.brand_colors ?? {};
  const bg_color = brandColors.bg_color ?? "#1e3a5f";
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: "Gracias por tu ofrenda" }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsx(
      Header,
      {
        tenantName: tenant.name,
        description: tenant.store_description,
        logoUrl: tenant.logo_url,
        bgColor: bg_color,
        textColor: brandColors.name_color ?? "#ffffff",
        descriptionColor: brandColors.description_color
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 bg-slate-50/80 p-4 -mt-4 pb-20 pt-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative w-full flex flex-col items-center text-center animate-in zoom-in-50 duration-500 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -top-60 left-1/2 -translate-x-1/2 w-[560px] h-[560px] z-0 flex items-center justify-center pointer-events-none overflow-visible", children: /* @__PURE__ */ jsx(Ripple, { mainCircleSize: 100, mainCircleOpacity: 0.22, numCircles: 5 }) }),
        /* @__PURE__ */ jsx("div", { className: "relative z-10 w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4 shadow-sm", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-10 h-10 text-green-500" }) })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-slate-900 mb-2", children: "¡Gracias por tu ofrenda!" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-600 mb-8", children: "Hemos recibido tu información. Si subiste un comprobante, lo revisaremos pronto. Que Dios bendiga tu generosidad." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsx(Link, { href: route("tenant.public.donations", tenant.slug), children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "w-full gap-2", children: [
          /* @__PURE__ */ jsx(Banknote, { className: "size-4" }),
          "Hacer otra donación"
        ] }) }),
        /* @__PURE__ */ jsx(Link, { href: route("tenant.home", tenant.slug), children: /* @__PURE__ */ jsx(Button, { className: "w-full", children: "Volver al inicio" }) })
      ] })
    ] }) })
  ] });
}
export {
  DonationsThankYou as default
};
