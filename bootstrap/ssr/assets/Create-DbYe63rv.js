import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { S as SuperAdminLayout } from "./SuperAdminLayout-BMVUVnkF.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { ArrowLeft, Upload } from "lucide-react";
import { F as FieldError } from "./field-BEfz_npx.js";
import { R as RichTextEditor } from "./RichTextEditor-Cfsf-8a0.js";
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
import "./ApplicationLogo-xMpxFOcX.js";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-switch";
import "@tiptap/react";
import "@tiptap/starter-kit";
import "@tiptap/extension-placeholder";
import "@tiptap/extension-image";
const TYPES = [
  { value: "new", label: "Nuevo" },
  { value: "fix", label: "Corrección" },
  { value: "improvement", label: "Mejora" },
  { value: "security", label: "Seguridad" },
  { value: "performance", label: "Rendimiento" }
];
const ICON_OPTIONS = [
  { value: "none", label: "Sin icono" },
  { value: "CalendarRange", label: "CalendarRange" },
  { value: "Sparkles", label: "Sparkles" },
  { value: "Package", label: "Package" },
  { value: "Wrench", label: "Wrench" },
  { value: "Shield", label: "Shield" },
  { value: "Zap", label: "Zap" }
];
function Create({ categories }) {
  const fileInputRef = useRef(null);
  const [initialBody] = useState("");
  const { data, setData, post, processing, errors } = useForm({
    release_note_category_id: categories[0]?.id?.toString() ?? "",
    title: "",
    slug: "",
    type: "new",
    icon_name: "",
    cover_path: "",
    cover_preview: null,
    cover: null,
    hero_path: "",
    snippet: "",
    body: "",
    published_at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    status: "draft",
    is_featured: false
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("release-notes.store"));
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: "Nuevo Release Note", children: [
    /* @__PURE__ */ jsx(Head, { title: "Nuevo Release Note" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto py-6", children: [
      /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "mb-4 pl-0", asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: route("release-notes.index"), className: "flex items-center gap-2 text-muted-foreground hover:text-gray-900", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        "Volver al listado"
      ] }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Contenido" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Título, categoría, tipo y resumen." })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Categoría" }),
                /* @__PURE__ */ jsxs(Select, { value: data.release_note_category_id, onValueChange: (v) => setData("release_note_category_id", v), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona categoría" }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: categories.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: String(c.id), children: c.name }, c.id)) })
                ] }),
                /* @__PURE__ */ jsx(FieldError, { children: errors.release_note_category_id })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Tipo" }),
                /* @__PURE__ */ jsxs(Select, { value: data.type, onValueChange: (v) => setData("type", v), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: TYPES.map((t) => /* @__PURE__ */ jsx(SelectItem, { value: t.value, children: t.label }, t.value)) })
                ] }),
                /* @__PURE__ */ jsx(FieldError, { children: errors.type })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Icono" }),
                /* @__PURE__ */ jsxs(Select, { value: data.icon_name === "" ? "none" : data.icon_name, onValueChange: (v) => setData("icon_name", v === "none" ? "" : v), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Icono (Lucide)" }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: ICON_OPTIONS.map((opt) => /* @__PURE__ */ jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
                ] }),
                /* @__PURE__ */ jsx(FieldError, { children: errors.icon_name })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "title", children: "Título" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "title",
                  value: data.title,
                  onChange: (e) => setData("title", e.target.value),
                  placeholder: "Ej. Reservas y mejoras en menú"
                }
              ),
              /* @__PURE__ */ jsx(FieldError, { children: errors.title })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "slug", children: "Slug (opcional)" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "slug",
                  value: data.slug,
                  onChange: (e) => setData("slug", e.target.value),
                  placeholder: "Se genera automáticamente si está vacío"
                }
              ),
              /* @__PURE__ */ jsx(FieldError, { children: errors.slug })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "snippet", children: "Resumen / Snippet" }),
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  id: "snippet",
                  value: data.snippet,
                  onChange: (e) => setData("snippet", e.target.value),
                  rows: 3,
                  placeholder: "Texto corto para la card en el listado público."
                }
              ),
              /* @__PURE__ */ jsx(FieldError, { children: errors.snippet })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Imagen y cuerpo" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Portada para la card; cuerpo en HTML (texto plano por ahora)." })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Imagen de portada (cover)" }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 items-start", children: [
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: () => fileInputRef.current?.click(),
                    children: [
                      /* @__PURE__ */ jsx(Upload, { className: "mr-2 h-4 w-4" }),
                      "Abrir ventana de carga"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref: fileInputRef,
                    type: "file",
                    accept: "image/jpeg,image/png,image/gif,image/webp,image/svg+xml",
                    className: "hidden",
                    onChange: (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setData("cover", file);
                        setData("cover_preview", URL.createObjectURL(file));
                        setData("cover_path", "");
                      }
                      e.target.value = "";
                    }
                  }
                ),
                data.cover_preview && /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx("img", { src: data.cover_preview, alt: "Vista previa", className: "h-24 w-32 object-cover rounded border" }),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      className: "absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-muted",
                      onClick: () => {
                        setData("cover", null);
                        setData("cover_preview", null);
                        setData("cover_path", "");
                      },
                      children: "×"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx(FieldError, { children: errors.cover_path })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Cuerpo" }),
              /* @__PURE__ */ jsx(
                RichTextEditor,
                {
                  initialContent: initialBody,
                  onChange: (html) => setData("body", html),
                  placeholder: "Contenido del release…",
                  uploadImageUrl: route("release-notes.upload-image")
                }
              ),
              /* @__PURE__ */ jsx(FieldError, { children: errors.body })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Publicación" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Fecha, estado y destacado." })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "published_at", children: "Fecha de publicación" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "published_at",
                    type: "date",
                    value: data.published_at,
                    onChange: (e) => setData("published_at", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(FieldError, { children: errors.published_at })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Estado" }),
                /* @__PURE__ */ jsxs(Select, { value: data.status, onValueChange: (v) => setData("status", v), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "draft", children: "Borrador" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "published", children: "Publicado" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(FieldError, { children: errors.status })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                Switch,
                {
                  id: "is_featured",
                  checked: data.is_featured,
                  onCheckedChange: (v) => setData("is_featured", v)
                }
              ),
              /* @__PURE__ */ jsx(Label, { htmlFor: "is_featured", children: "Marcar como destacado" })
            ] }),
            /* @__PURE__ */ jsx(FieldError, { children: errors.is_featured })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: "Crear release note" }),
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("release-notes.index"), children: "Cancelar" }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Create as default
};
