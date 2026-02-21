import { jsxs, jsx } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-ndko6Pty.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { ChevronLeft, MapPin, AlertCircle } from "lucide-react";
import { L as LocationForm } from "./LocationForm-VUF8Pt4Z.js";
import { A as Alert, b as AlertTitle, a as AlertDescription } from "./alert-NB8JTTvo.js";
import "react";
import "sonner";
import "./echo-DaX0krWj.js";
import "@ably/laravel-echo";
import "ably";
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
import "./switch-7q5oG5BF.js";
import "@radix-ui/react-switch";
import "./tabs-B4HNlFNZ.js";
import "radix-ui";
import "./scroll-area-iVmBTZv4.js";
import "@radix-ui/react-scroll-area";
import "leaflet";
/* empty css                 */
function Create({ locations_limit, locations_count }) {
  const { currentTenant } = usePage().props;
  const atLimit = locations_limit !== null && locations_count >= locations_limit;
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Nueva Sede", children: [
    /* @__PURE__ */ jsx(Head, { title: "Nueva Sede" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("tenant.locations.index", currentTenant?.slug),
            className: "text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors",
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }),
              " Volver a la lista"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-black tracking-tight flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "size-6 text-primary" }),
          "Nueva Sede"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Registra un nuevo punto de venta físico o centro de despacho." })
      ] }),
      atLimit && /* @__PURE__ */ jsxs(Alert, { className: "bg-amber-50 border-amber-200 text-amber-900", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "size-4" }),
        /* @__PURE__ */ jsx(AlertTitle, { children: "Límite alcanzado" }),
        /* @__PURE__ */ jsxs(AlertDescription, { children: [
          "Has alcanzado el máximo de ",
          locations_limit,
          " sedes de tu plan. Para crear más sedes, mejora tu plan."
        ] }),
        /* @__PURE__ */ jsx(Link, { href: route("tenant.locations.index", currentTenant?.slug), children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium underline mt-2 inline-block", children: "Volver a Sedes" }) })
      ] }),
      !atLimit && /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border shadow-sm overflow-hidden", children: /* @__PURE__ */ jsx(
        LocationForm,
        {
          location: null,
          onSuccess: () => {
          },
          onCancel: () => window.history.back()
        }
      ) })
    ] }) })
  ] });
}
export {
  Create as default
};
