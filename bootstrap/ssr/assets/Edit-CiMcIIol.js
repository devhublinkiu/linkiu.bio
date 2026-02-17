import { jsxs, jsx } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-C8hB-Nb-.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";
import { P as ProductForm } from "./ProductForm-3dvqFXGn.js";
import "react";
import "sonner";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./button-BdX_X5dq.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./badge-C_PGNHO8.js";
import "./card-BaovBWX5.js";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./dropdown-menu-B2I3vWlQ.js";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./input-B_4qRSOV.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BclLUCFD.js";
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
import "./MediaManagerModal-BXLLBMxU.js";
import "./scroll-area-iVmBTZv4.js";
import "@radix-ui/react-scroll-area";
import "./alert-dialog-Dk6SFJ_Z.js";
import "@radix-ui/react-alert-dialog";
import "./empty-CTOMHEXK.js";
import "./accordion-YG9U3R8-.js";
import "@radix-ui/react-accordion";
function Edit({ product, categories, locations }) {
  const { currentTenant } = usePage().props;
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Editar Producto", children: [
    /* @__PURE__ */ jsx(Head, { title: `Editar ${product.name}` }),
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
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-black tracking-tight", children: "Editar Producto" }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
          "Actualiza los detalles de ",
          /* @__PURE__ */ jsx("strong", { children: product.name }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        ProductForm,
        {
          product,
          categories,
          locations,
          submitRoute: route("tenant.admin.products.update", [currentTenant?.slug, product.id]),
          method: "put"
        }
      )
    ] }) })
  ] });
}
export {
  Edit as default
};
