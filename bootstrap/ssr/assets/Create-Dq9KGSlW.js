import { jsxs, jsx } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-ndko6Pty.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { C as Card, d as CardContent } from "./card-BaovBWX5.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { P as ProductForm } from "./ProductForm-C4FiDDZl.js";
import "react";
import "sonner";
import "./echo-DaX0krWj.js";
import "@ably/laravel-echo";
import "ably";
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
import "./label-L_u-fyc1.js";
import "@radix-ui/react-label";
import "./textarea-BpljFL5D.js";
import "./select-BWhoZY6G.js";
import "@radix-ui/react-select";
import "./switch-7q5oG5BF.js";
import "@radix-ui/react-switch";
import "./tabs-B4HNlFNZ.js";
import "radix-ui";
import "./checkbox-dJXZmgY3.js";
import "@radix-ui/react-checkbox";
import "./MediaManagerModal-D8ddokO_.js";
import "./scroll-area-iVmBTZv4.js";
import "@radix-ui/react-scroll-area";
import "./alert-dialog-Dk6SFJ_Z.js";
import "@radix-ui/react-alert-dialog";
import "./empty-CTOMHEXK.js";
import "./accordion-YG9U3R8-.js";
import "@radix-ui/react-accordion";
function Create({ categories, locations, limit_reached, products_limit }) {
  const { currentTenant } = usePage().props;
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Nuevo Producto", children: [
    /* @__PURE__ */ jsx(Head, { title: "Nuevo Producto" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("tenant.admin.products.index", currentTenant?.slug),
            className: "text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors",
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }),
              " Volver a la lista"
            ]
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-black tracking-tight", children: "Crear Producto" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Completa los campos para añadir un nuevo plato a tu menú." })
      ] }),
      limit_reached ? /* @__PURE__ */ jsx(Card, { className: "border-orange-200 bg-orange-50", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6 flex flex-col items-center text-center gap-4", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-12 h-12 text-orange-500" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-orange-800", children: "Límite de productos alcanzado" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-orange-700 mt-1", children: [
            "Tu plan actual permite un máximo de ",
            /* @__PURE__ */ jsx("strong", { children: products_limit }),
            " productos. Para agregar más, actualiza tu plan."
          ] })
        ] }),
        /* @__PURE__ */ jsx(Link, { href: route("tenant.admin.products.index", currentTenant?.slug), children: /* @__PURE__ */ jsx(Button, { variant: "outline", children: "Volver a productos" }) })
      ] }) }) : /* @__PURE__ */ jsx(
        ProductForm,
        {
          categories,
          locations,
          submitRoute: route("tenant.admin.products.store", currentTenant?.slug),
          method: "post"
        }
      )
    ] }) })
  ] });
}
export {
  Create as default
};
