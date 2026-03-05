import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { P as PublicLayout, H as Header } from "./Header-CiFZ-R5L.js";
import { Radio, Calendar, Play, ExternalLink } from "lucide-react";
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
function SermonCard({ sermon, variant, tenantSlug }) {
  const badge = variant === "live" ? /* @__PURE__ */ jsx("span", { className: "absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white", children: "EN VIVO" }) : variant === "upcoming" && sermon.live_start_at ? /* @__PURE__ */ jsx("span", { className: "absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-700 text-white", children: new Date(sermon.live_start_at).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }) }) : variant === "completed" && sermon.published_at ? /* @__PURE__ */ jsx("span", { className: "absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-600 text-white", children: new Date(sermon.published_at).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" }) }) : null;
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href: route("tenant.public.sermons.show", [tenantSlug, sermon.id]),
      className: "flex gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative w-28 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100", children: [
          sermon.thumbnail_url ? /* @__PURE__ */ jsx("img", { src: sermon.thumbnail_url, alt: "", className: "absolute inset-0 w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(Play, { className: "size-6 text-slate-400" }) }),
          badge
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 flex flex-col justify-center", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-slate-900 line-clamp-2 text-sm", children: sermon.title }),
          variant === "completed" && sermon.formatted_duration && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: sermon.formatted_duration }),
          variant === "live" && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mt-0.5 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Radio, { className: "size-3.5" }),
            "Transmisión en vivo"
          ] }),
          variant === "upcoming" && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mt-0.5 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "size-3.5" }),
            "Próxima transmisión"
          ] })
        ] }),
        /* @__PURE__ */ jsx(ExternalLink, { className: "size-4 text-slate-400 shrink-0 self-center" })
      ]
    }
  );
}
function SermonsIndex({ tenant, sermons_live, sermons_upcoming, sermons_by_date }) {
  const brandColors = tenant.brand_colors ?? {};
  const bg_color = brandColors.bg_color ?? "#1e3a5f";
  const hasAny = sermons_live.length > 0 || sermons_upcoming.length > 0 || sermons_by_date.length > 0;
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: `Predicas - ${tenant.name}` }),
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
    /* @__PURE__ */ jsx("div", { className: "max-w-md mx-auto px-4 w-full flex-1 pb-20 pt-8", children: /* @__PURE__ */ jsxs("section", { "aria-labelledby": "predicas-heading", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-primary/10 p-2.5 rounded-xl", children: /* @__PURE__ */ jsx(Radio, { className: "size-6 text-primary" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { id: "predicas-heading", className: "text-xl font-black tracking-tight", children: "Predicas" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Transmisiones en vivo y archivo por fecha" })
        ] })
      ] }),
      !hasAny ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-slate-100 rounded-full size-16 mx-auto mb-4 flex items-center justify-center", children: /* @__PURE__ */ jsx(Radio, { className: "size-8 text-slate-400" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-600 font-medium", children: "No hay predicas publicadas" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Las transmisiones en vivo y el archivo aparecerán aquí" })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        sermons_live.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-red-500 animate-pulse" }),
            "En vivo"
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2 list-none p-0 m-0", children: sermons_live.map((s) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(SermonCard, { sermon: s, variant: "live", tenantSlug: tenant.slug }) }, s.id)) })
        ] }),
        sermons_upcoming.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "size-4" }),
            "Próximas transmisiones"
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2 list-none p-0 m-0", children: sermons_upcoming.map((s) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(SermonCard, { sermon: s, variant: "upcoming", tenantSlug: tenant.slug }) }, s.id)) })
        ] }),
        sermons_by_date.map((group) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold text-slate-700 uppercase tracking-wider mb-3", children: group.label }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2 list-none p-0 m-0", children: group.sermons.map((s) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(SermonCard, { sermon: s, variant: "completed", tenantSlug: tenant.slug }) }, s.id)) })
        ] }, group.key))
      ] })
    ] }) })
  ] });
}
export {
  SermonsIndex as default
};
