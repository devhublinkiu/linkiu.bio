import { jsxs, jsx } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-C8hB-Nb-.js";
import { usePage, useForm, Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { ChevronLeft } from "lucide-react";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { F as FieldError } from "./field-BEfz_npx.js";
import "react";
import "sonner";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./badge-C_PGNHO8.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "./card-BaovBWX5.js";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./dropdown-menu-B2I3vWlQ.js";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BclLUCFD.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./menuConfig-rtCrEhXP.js";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
function Edit({ short, locations, categories, products }) {
  const { currentTenant } = usePage().props;
  const { data, setData, post, processing, errors } = useForm({
    _method: "put",
    location_id: short.location_id.toString(),
    name: short.name,
    description: short.description ?? "",
    link_type: short.link_type,
    external_url: short.external_url ?? "",
    linkable_type: short.link_type === "external" ? "" : short.linkable_type ?? (short.link_type === "product" ? "App\\Models\\Product" : "App\\Models\\Category"),
    linkable_id: short.link_type === "external" ? "" : short.linkable_id?.toString() ?? "",
    short_video: null,
    remove_short: false,
    sort_order: short.sort_order.toString(),
    is_active: short.is_active
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("tenant.shorts.update", [currentTenant?.slug, short.id]), { forceFormData: true });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: `Editar short - ${short.name}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Editar short - ${short.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("tenant.shorts.index", currentTenant?.slug),
          className: "text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 mb-4",
          children: [
            /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }),
            " Volver a Shorts"
          ]
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight mb-6", children: "Editar short" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre de la promo *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "name",
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              maxLength: 255
            }
          ),
          /* @__PURE__ */ jsx(FieldError, { children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Sede *" }),
          /* @__PURE__ */ jsxs(Select, { value: data.location_id, onValueChange: (v) => setData("location_id", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Escoge la sede" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: String(loc.id), children: loc.name }, loc.id)) })
          ] }),
          /* @__PURE__ */ jsx(FieldError, { children: errors.location_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Enlace *" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: data.link_type,
              onValueChange: (v) => {
                setData("link_type", v);
                setData("linkable_type", v === "category" ? "App\\Models\\Category" : v === "product" ? "App\\Models\\Product" : "");
                setData("linkable_id", "");
                setData("external_url", "");
              },
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "category", children: "Categoría" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "product", children: "Producto" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "external", children: "URL externa" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx(FieldError, { children: errors.link_type })
        ] }),
        data.link_type === "category" && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Categoría *" }),
          /* @__PURE__ */ jsxs(Select, { value: data.linkable_id, onValueChange: (v) => setData("linkable_id", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona categoría" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: categories.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: String(c.id), children: c.name }, c.id)) })
          ] }),
          /* @__PURE__ */ jsx(FieldError, { children: errors.linkable_id })
        ] }),
        data.link_type === "product" && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Producto *" }),
          /* @__PURE__ */ jsxs(Select, { value: data.linkable_id, onValueChange: (v) => setData("linkable_id", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona producto" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: products.map((p) => /* @__PURE__ */ jsx(SelectItem, { value: String(p.id), children: p.name }, p.id)) })
          ] }),
          /* @__PURE__ */ jsx(FieldError, { children: errors.linkable_id })
        ] }),
        data.link_type === "external" && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "URL *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "url",
              value: data.external_url,
              onChange: (e) => setData("external_url", e.target.value),
              placeholder: "https://..."
            }
          ),
          /* @__PURE__ */ jsx(FieldError, { children: errors.external_url })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Video del short" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "file",
              accept: ".mp4,.mov",
              onChange: (e) => setData("short_video", e.target.files?.[0] ?? null)
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Deja vacío para mantener el actual. MP4 o MOV, máx. 50 MB" }),
          /* @__PURE__ */ jsx(FieldError, { children: errors.short_video })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "description", children: "Descripción (máx. 50)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "description",
              value: data.description,
              onChange: (e) => setData("description", e.target.value.slice(0, 50)),
              maxLength: 50
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            data.description.length,
            "/50"
          ] }),
          /* @__PURE__ */ jsx(FieldError, { children: errors.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "sort_order", children: "Orden" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "sort_order",
              type: "number",
              min: 0,
              value: data.sort_order,
              onChange: (e) => setData("sort_order", e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(FieldError, { children: errors.sort_order })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? "Guardando…" : "Guardar cambios" }),
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("tenant.shorts.index", currentTenant?.slug), children: "Cancelar" }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Edit as default
};
