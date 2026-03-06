import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { P as PublicLayout, H as Header } from "./Header-B2wecguQ.js";
import { Users, ChevronRight } from "lucide-react";
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
function CollaboratorCard({
  tenantSlug,
  collaborator
}) {
  return /* @__PURE__ */ jsx(
    Link,
    {
      href: route("tenant.public.team.show", [tenantSlug, collaborator.id]),
      className: "block rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition-all",
      children: /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow mb-3", children: collaborator.photo ? /* @__PURE__ */ jsx(
          "img",
          {
            src: collaborator.photo,
            alt: "",
            className: "w-full h-full object-cover"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Users, { className: "size-10 text-slate-400" }) }) }),
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-base line-clamp-2", children: collaborator.name }),
        collaborator.role && /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-0.5 line-clamp-2", children: collaborator.role }),
        collaborator.bio && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-600 mt-2 line-clamp-2", children: collaborator.bio }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-primary text-sm font-semibold mt-3", children: [
          "Ver perfil",
          /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" })
        ] })
      ] })
    }
  );
}
function TeamIndex({ tenant, collaborators }) {
  const brandColors = tenant.brand_colors ?? {};
  const bg_color = brandColors.bg_color ?? "#1e3a5f";
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: `Nuestro equipo - ${tenant.name}` }),
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
    /* @__PURE__ */ jsx("div", { className: "max-w-md mx-auto px-4 w-full flex-1 pb-20 pt-8", children: /* @__PURE__ */ jsxs("section", { "aria-labelledby": "equipo-heading", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-primary/10 p-2.5 rounded-xl", children: /* @__PURE__ */ jsx(Users, { className: "size-6 text-primary" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { id: "equipo-heading", className: "text-xl font-black tracking-tight", children: "Nuestro equipo" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: collaborators.length === 0 ? "Conoce a quienes nos sirven" : `${collaborators.length} ${collaborators.length === 1 ? "colaborador" : "colaboradores"}` })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "py-4", children: collaborators.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-slate-100 rounded-full size-16 mx-auto mb-4 flex items-center justify-center", children: /* @__PURE__ */ jsx(Users, { className: "size-8 text-slate-400" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-600 font-medium", children: "No hay colaboradores publicados" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Próximamente verás aquí a nuestro equipo" })
      ] }) : /* @__PURE__ */ jsx("ul", { className: "grid gap-4 list-none p-0 m-0 sm:grid-cols-2", children: collaborators.map((c) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(CollaboratorCard, { tenantSlug: tenant.slug, collaborator: c }) }, c.id)) }) })
    ] }) })
  ] });
}
export {
  TeamIndex as default
};
