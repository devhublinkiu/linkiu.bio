import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CdwLWQ00.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { toast } from "sonner";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { ChevronLeft, Quote, Loader2 } from "lucide-react";
import "./echo-DaX0krWj.js";
import "@ably/laravel-echo";
import "ably";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./badge-C_PGNHO8.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "./card-BaovBWX5.js";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./dropdown-menu-Dkgv2tnp.js";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./menuConfig-vY7u-Ro3.js";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-label";
import "@radix-ui/react-switch";
function Create() {
  const { currentTenant } = usePage().props;
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: "",
    body: "",
    video_url: "",
    category: "",
    is_featured: false,
    short_quote: "",
    author: "",
    is_published: false,
    order: 0,
    image_file: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };
  const submit = (e) => {
    e.preventDefault();
    setProcessing(true);
    const payload = {
      title: form.title,
      body: form.body || null,
      video_url: form.video_url || null,
      category: form.category || null,
      is_featured: form.is_featured,
      short_quote: form.short_quote || null,
      author: form.author || null,
      is_published: form.is_published,
      order: form.order
    };
    if (form.image_file) payload.image_file = form.image_file;
    router.post(route("tenant.admin.testimonials.store", currentTenant?.slug), payload, {
      preserveScroll: true,
      onSuccess: () => toast.success("Testimonio creado correctamente"),
      onError: (errs) => {
        setErrors(errs);
        toast.error("Revisa los campos");
      },
      onFinish: () => setProcessing(false)
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Nuevo testimonio", children: [
    /* @__PURE__ */ jsx(Head, { title: "Nuevo testimonio" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("tenant.admin.testimonials.index", currentTenant?.slug),
            className: "text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }),
              " Volver a Testimonios"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold tracking-tight flex items-center gap-2 mt-2", children: [
          /* @__PURE__ */ jsx(Quote, { className: "size-6 text-primary" }),
          "Nuevo testimonio"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6 rounded-xl border bg-card p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "title", children: "Título *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "title",
              value: form.title,
              onChange: (e) => setField("title", e.target.value),
              placeholder: "Ej. Cómo Dios transformó mi familia",
              maxLength: 255,
              className: errors.title ? "border-destructive" : ""
            }
          ),
          errors.title && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.title })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "body", children: "Texto del testimonio" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "body",
              value: form.body,
              onChange: (e) => setField("body", e.target.value),
              placeholder: "Cuenta la historia...",
              rows: 5,
              className: errors.body ? "border-destructive" : ""
            }
          ),
          errors.body && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.body })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "short_quote", children: "Cita corta" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "short_quote",
              value: form.short_quote,
              onChange: (e) => setField("short_quote", e.target.value),
              placeholder: "Una frase para destacar (máx. 500 caracteres)",
              maxLength: 500,
              className: errors.short_quote ? "border-destructive" : ""
            }
          ),
          errors.short_quote && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.short_quote })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "video_url", children: "Enlace del video (YouTube)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "video_url",
              type: "url",
              value: form.video_url,
              onChange: (e) => setField("video_url", e.target.value),
              placeholder: "https://www.youtube.com/watch?v=..."
            }
          ),
          errors.video_url && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.video_url })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "image_file", children: "Imagen" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Opcional. Se usará en el listado. Máx. 2 MB." }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "image_file",
              type: "file",
              accept: "image/*",
              className: errors.image_file ? "border-destructive" : "",
              onChange: (e) => {
                const file = e.target.files?.[0];
                setField("image_file", file ?? null);
                if (imagePreview) URL.revokeObjectURL(imagePreview);
                setImagePreview(file ? URL.createObjectURL(file) : null);
              }
            }
          ),
          errors.image_file && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.image_file }),
          imagePreview && /* @__PURE__ */ jsx("div", { className: "w-40 h-24 rounded-lg border overflow-hidden bg-muted", children: /* @__PURE__ */ jsx("img", { src: imagePreview, alt: "Vista previa", className: "w-full h-full object-cover" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "author", children: "Autor" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "author",
              value: form.author,
              onChange: (e) => setField("author", e.target.value),
              placeholder: "Nombre o anónimo",
              maxLength: 255,
              className: errors.author ? "border-destructive" : ""
            }
          ),
          errors.author && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.author })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "category", children: "Categoría" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "category",
              value: form.category,
              onChange: (e) => setField("category", e.target.value),
              placeholder: "Ej. Conversión, Sanidad, Familia",
              maxLength: 100,
              className: errors.category ? "border-destructive" : ""
            }
          ),
          errors.category && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.category })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "order", children: "Orden" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "order",
              type: "number",
              min: 0,
              value: form.order,
              onChange: (e) => setField("order", parseInt(e.target.value, 10) || 0),
              className: errors.order ? "border-destructive" : ""
            }
          ),
          errors.order && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.order })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border p-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "is_featured", children: "Destacado" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Mostrar en sección destacada" })
          ] }),
          /* @__PURE__ */ jsx(Switch, { id: "is_featured", checked: form.is_featured, onCheckedChange: (c) => setField("is_featured", c) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border p-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "is_published", children: "Publicado" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Visible en tu enlace público" })
          ] }),
          /* @__PURE__ */ jsx(Switch, { id: "is_published", checked: form.is_published, onCheckedChange: (c) => setField("is_published", c) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: processing, className: "gap-2", children: [
            processing && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
            "Crear testimonio"
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("tenant.admin.testimonials.index", currentTenant?.slug), children: "Cancelar" }) })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Create as default
};
