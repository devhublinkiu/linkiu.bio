import { jsxs, jsx } from "react/jsx-runtime";
import { S as SuperAdminLayout } from "./SuperAdminLayout-DVPOojgY.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { ArrowLeft } from "lucide-react";
import { F as FieldError } from "./field-BEfz_npx.js";
import "react";
import "./dropdown-menu-Dkgv2tnp.js";
import "@radix-ui/react-slot";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "vaul";
import "axios";
import "sonner";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./echo-DaX0krWj.js";
import "@ably/laravel-echo";
import "ably";
import "./ApplicationLogo-xMpxFOcX.js";
import "class-variance-authority";
import "@radix-ui/react-label";
function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    slug: "",
    sort_order: 0
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("release-note-categories.store"));
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: "Crear categoría", children: [
    /* @__PURE__ */ jsx(Head, { title: "Crear categoría - Release Notes" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-xl mx-auto py-6", children: [
      /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "mb-4 pl-0", asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: route("release-note-categories.index"), className: "flex items-center gap-2 text-muted-foreground hover:text-gray-900", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        "Volver al listado"
      ] }) }),
      /* @__PURE__ */ jsx("form", { onSubmit: submit, children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Nueva categoría" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Nombre y slug (opcional; se genera desde el nombre si se deja vacío)." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "name",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                placeholder: "Ej. Producto, Plataforma, Registro de cambios"
              }
            ),
            /* @__PURE__ */ jsx(FieldError, { children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "slug", children: "Slug (opcional)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "slug",
                value: data.slug,
                onChange: (e) => setData("slug", e.target.value),
                placeholder: "producto"
              }
            ),
            /* @__PURE__ */ jsx(FieldError, { children: errors.slug })
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
                onChange: (e) => setData("sort_order", parseInt(e.target.value, 10) || 0)
              }
            ),
            /* @__PURE__ */ jsx(FieldError, { children: errors.sort_order })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: "Crear categoría" }),
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("release-note-categories.index"), children: "Cancelar" }) })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Create as default
};
