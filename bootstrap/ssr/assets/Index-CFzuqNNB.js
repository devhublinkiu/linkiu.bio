import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { P as PublicLayout, H as Header } from "./Header-8AGqQP0J.js";
import { BookOpen, Calendar, Heart, HandHeart, Share2 } from "lucide-react";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
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
function formatDate(d) {
  return new Date(d).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" });
}
function DevotionalCard({
  tenantSlug,
  devotional
}) {
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href: route("tenant.public.devotionals.show", [tenantSlug, devotional.id]),
      className: "block rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition-all",
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-full h-44 bg-slate-100 relative overflow-hidden", children: devotional.cover_image ? /* @__PURE__ */ jsx(
          "img",
          {
            src: devotional.cover_image,
            alt: "",
            className: "absolute inset-0 w-full h-full object-cover"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "size-12 text-slate-300" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 line-clamp-2 text-lg", children: devotional.title }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mt-2 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "size-3.5" }),
            formatDate(devotional.date)
          ] }),
          devotional.scripture_reference && /* @__PURE__ */ jsx("p", { className: "text-sm text-primary font-medium mt-1 line-clamp-1", children: devotional.scripture_reference }),
          (devotional.excerpt || devotional.author) && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-2 line-clamp-2", children: devotional.excerpt || (devotional.author ? `Por ${devotional.author}` : null) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", title: "Fue de bendición", children: [
              /* @__PURE__ */ jsx(Heart, { className: "size-3.5" }),
              Number(devotional.blessing_count) || 0
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", title: "Orando", children: [
              /* @__PURE__ */ jsx(HandHeart, { className: "size-3.5" }),
              Number(devotional.prayer_count) || 0
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", title: "Compartidos", children: [
              /* @__PURE__ */ jsx(Share2, { className: "size-3.5" }),
              Number(devotional.share_count) || 0
            ] })
          ] })
        ] })
      ]
    }
  );
}
function DevotionalsIndex({ tenant, devotionals }) {
  const brandColors = tenant.brand_colors ?? {};
  const bg_color = brandColors.bg_color ?? "#1e3a5f";
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: `Devocionales - ${tenant.name}` }),
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
    /* @__PURE__ */ jsx("div", { className: "max-w-md mx-auto px-4 w-full flex-1 pb-20 pt-8", children: /* @__PURE__ */ jsxs("section", { "aria-labelledby": "devocionales-heading", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-primary/10 p-2.5 rounded-xl", children: /* @__PURE__ */ jsx(BookOpen, { className: "size-6 text-primary" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { id: "devocionales-heading", className: "text-xl font-black tracking-tight", children: "Devocionales" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: devotionals.total === 0 ? "Reflexiones y palabra del día" : `${devotionals.total} ${devotionals.total === 1 ? "devocional" : "devocionales"}` })
        ] })
      ] }),
      devotionals.data.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-slate-100 rounded-full size-16 mx-auto mb-4 flex items-center justify-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "size-8 text-slate-400" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-600 font-medium", children: "No hay devocionales publicados" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Próximamente verás aquí reflexiones y palabra del día" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("ul", { className: "space-y-4 list-none p-0 m-0", children: devotionals.data.map((d) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(DevotionalCard, { tenantSlug: tenant.slug, devotional: d }) }, d.id)) }),
        devotionals.last_page > 1 && /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(SharedPagination, { links: devotionals.links }) })
      ] })
    ] }) })
  ] });
}
export {
  DevotionalsIndex as default
};
