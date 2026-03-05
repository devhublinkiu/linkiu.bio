import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { P as PublicLayout, H as Header } from "./Header-CiFZ-R5L.js";
import { Quote, Play, ChevronRight } from "lucide-react";
import "./ReportBusinessStrip-Cg46R4fS.js";
import "react";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "sonner";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./button-BdX_X5dq.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./input-B_4qRSOV.js";
import "./label-L_u-fyc1.js";
import "@radix-ui/react-label";
import "./textarea-BpljFL5D.js";
function TestimonialsIndex({ tenant, testimonials }) {
  const brandColors = tenant.brand_colors ?? {};
  const bg_color = brandColors.bg_color ?? "#1e3a5f";
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: `Testimonios - ${tenant.name}` }),
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
    /* @__PURE__ */ jsx("div", { className: "max-w-md mx-auto px-4 w-full flex-1 pb-20 pt-8", children: /* @__PURE__ */ jsxs("section", { "aria-labelledby": "testimonios-heading", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-primary/10 p-2.5 rounded-xl", children: /* @__PURE__ */ jsx(Quote, { className: "size-6 text-primary" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { id: "testimonios-heading", className: "text-xl font-black tracking-tight", children: "Testimonios" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Lo que Dios está haciendo en la vida de las personas" })
        ] })
      ] }),
      testimonials.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-slate-100 rounded-full size-16 mx-auto mb-4 flex items-center justify-center", children: /* @__PURE__ */ jsx(Quote, { className: "size-8 text-slate-400" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-600 font-medium", children: "No hay testimonios publicados" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Próximamente verás aquí historias de fe y transformación" })
      ] }) : /* @__PURE__ */ jsx("ul", { className: "space-y-3 list-none p-0 m-0", children: testimonials.map((t) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("tenant.public.testimonials.show", [tenant.slug, t.id]),
          className: "flex gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100", children: [
              t.image_url ? /* @__PURE__ */ jsx("img", { src: t.image_url, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Quote, { className: "size-8 text-slate-400" }) }),
              t.video_url && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/30", children: /* @__PURE__ */ jsx(Play, { className: "size-6 text-white drop-shadow" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 flex flex-col justify-center", children: [
              /* @__PURE__ */ jsx("h2", { className: "font-semibold text-slate-900 line-clamp-2 text-sm", children: t.title }),
              (t.short_quote || t.author) && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5 line-clamp-2", children: t.short_quote || (t.author ? `— ${t.author}` : "") }),
              t.category && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-primary mt-1", children: t.category })
            ] }),
            /* @__PURE__ */ jsx(ChevronRight, { className: "size-5 text-slate-400 shrink-0 self-center" })
          ]
        }
      ) }, t.id)) })
    ] }) })
  ] });
}
export {
  TestimonialsIndex as default
};
