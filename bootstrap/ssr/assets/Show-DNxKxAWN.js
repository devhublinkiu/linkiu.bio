import { jsxs, jsx } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-CegS7XIj.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, d as CardContent, a as CardHeader, b as CardTitle } from "./card-BaovBWX5.js";
import { ChevronLeft, Image, ExternalLink, HardDrive, FileText, Calendar } from "lucide-react";
import "react";
import "sonner";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./badge-C_PGNHO8.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./dropdown-menu-Dkgv2tnp.js";
import "vaul";
import "axios";
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
import "./menuConfig-rtCrEhXP.js";
import "./sonner-ZUDSQr7N.js";
function Show({ media }) {
  const { currentTenant } = usePage().props;
  const isImage = media.type === "image";
  const displayUrl = media.url ?? media.full_url ?? (media.path ? `/media/${media.path}` : null);
  const dimensions = media.metadata && typeof media.metadata === "object" ? { width: media.metadata.width, height: media.metadata.height } : null;
  return /* @__PURE__ */ jsxs(AdminLayout, { title: media.name, children: [
    /* @__PURE__ */ jsx(Head, { title: media.name }),
    /* @__PURE__ */ jsxs("div", { className: "py-6 max-w-4xl mx-auto sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "mb-4 -ml-2", asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: route("tenant.media.index", { tenant: currentTenant?.slug ?? "" }), children: [
        /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 mr-1" }),
        "Volver a Mis Archivos"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-0 flex items-center justify-center bg-slate-50 min-h-[320px] rounded-b-lg", children: isImage && displayUrl ? /* @__PURE__ */ jsx(
          "img",
          {
            src: displayUrl,
            alt: media.alt_text ?? media.name,
            className: "max-w-full max-h-[400px] w-auto h-auto object-contain rounded-lg"
          }
        ) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 text-slate-400 py-12", children: [
          /* @__PURE__ */ jsx(Image, { className: "w-16 h-16" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Vista previa no disponible" }),
          displayUrl && /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxs("a", { href: displayUrl, target: "_blank", rel: "noopener noreferrer", children: [
            /* @__PURE__ */ jsx(ExternalLink, { className: "w-4 h-4 mr-1" }),
            "Abrir archivo"
          ] }) })
        ] }) }) }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Información" }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-500", children: "Nombre" }),
              /* @__PURE__ */ jsx("p", { className: "font-medium truncate", title: media.name, children: media.name })
            ] }),
            media.alt_text && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-500", children: "Texto alternativo" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm", children: media.alt_text })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                /* @__PURE__ */ jsx(HardDrive, { className: "w-4 h-4 text-slate-400" }),
                /* @__PURE__ */ jsx("span", { children: media.size_human ?? (media.size ? `${(media.size / 1024).toFixed(1)} KB` : "—") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-slate-400" }),
                /* @__PURE__ */ jsx("span", { children: media.extension ?? media.type ?? "—" })
              ] }),
              dimensions && (dimensions.width || dimensions.height) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                /* @__PURE__ */ jsx(Image, { className: "w-4 h-4 text-slate-400" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  dimensions.width ?? "?",
                  " × ",
                  dimensions.height ?? "?",
                  " px"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-slate-400" }),
                /* @__PURE__ */ jsx("span", { children: new Date(media.created_at).toLocaleDateString("es") })
              ] })
            ] }),
            media.description && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-500", children: "Descripción" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm", children: media.description })
            ] }),
            displayUrl && /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxs("a", { href: displayUrl, target: "_blank", rel: "noopener noreferrer", children: [
              /* @__PURE__ */ jsx(ExternalLink, { className: "w-4 h-4 mr-1" }),
              "Abrir en nueva pestaña"
            ] }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  Show as default
};
