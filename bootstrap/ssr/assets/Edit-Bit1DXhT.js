import { jsxs, jsx } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-C8hB-Nb-.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { ChevronLeft, MapPin } from "lucide-react";
import { L as LocationForm } from "./LocationForm-VUF8Pt4Z.js";
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
import "./switch-7q5oG5BF.js";
import "@radix-ui/react-switch";
import "./tabs-B4HNlFNZ.js";
import "radix-ui";
import "./scroll-area-iVmBTZv4.js";
import "@radix-ui/react-scroll-area";
import "leaflet";
/* empty css                 */
function Edit({ location }) {
  const { currentTenant } = usePage().props;
  return /* @__PURE__ */ jsxs(AdminLayout, { title: `Editar Sede - ${location.name}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Editar Sede - ${location.name}` }),
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
          "Editar Sede"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
          "Actualiza la información de ",
          location.name,
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border shadow-sm overflow-hidden", children: /* @__PURE__ */ jsx(
        LocationForm,
        {
          location,
          onSuccess: () => {
          },
          onCancel: () => window.history.back()
        }
      ) })
    ] }) })
  ] });
}
export {
  Edit as default
};
