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
import { R as RichTextEditor } from "./RichTextEditor-Cfsf-8a0.js";
import { ChevronLeft, BookOpen, Loader2 } from "lucide-react";
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
import "@tiptap/react";
import "@tiptap/starter-kit";
import "@tiptap/extension-placeholder";
import "@tiptap/extension-image";
function Edit({ devotional }) {
  const { currentTenant } = usePage().props;
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const dateStr = typeof devotional.date === "string" && devotional.date.length >= 10 ? devotional.date.slice(0, 10) : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const [form, setForm] = useState({
    title: devotional.title,
    scripture_reference: devotional.scripture_reference ?? "",
    scripture_text: devotional.scripture_text ?? "",
    body: devotional.body,
    prayer: devotional.prayer ?? "",
    author: devotional.author ?? "",
    date: dateStr,
    reflection_question: devotional.reflection_question ?? "",
    cover_image_file: null,
    video_url: devotional.video_url ?? "",
    external_link: devotional.external_link ?? "",
    excerpt: devotional.excerpt ?? "",
    order: devotional.order,
    is_published: devotional.is_published
  });
  const [coverPreview, setCoverPreview] = useState(null);
  const currentCoverUrl = devotional.cover_image ?? null;
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
      scripture_reference: form.scripture_reference || null,
      scripture_text: form.scripture_text || null,
      body: form.body,
      prayer: form.prayer || null,
      author: form.author || null,
      date: form.date,
      reflection_question: form.reflection_question || null,
      video_url: form.video_url || null,
      external_link: form.external_link || null,
      excerpt: form.excerpt || null,
      order: form.order,
      is_published: form.is_published
    };
    if (form.cover_image_file) payload.cover_image_file = form.cover_image_file;
    const updateUrl = route("tenant.admin.devotionals.update", [currentTenant?.slug, devotional.id]);
    const options = {
      preserveScroll: true,
      onSuccess: () => toast.success("Devocional actualizado correctamente"),
      onError: (errs) => {
        setErrors(errs);
        toast.error("Revisa los campos del formulario");
      },
      onFinish: () => setProcessing(false)
    };
    if (form.cover_image_file) {
      router.post(updateUrl, { ...payload, _method: "PUT" }, options);
    } else {
      router.put(updateUrl, payload, options);
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Editar devocional", children: [
    /* @__PURE__ */ jsx(Head, { title: "Editar devocional" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("tenant.admin.devotionals.index", currentTenant?.slug),
            className: "text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }),
              " Volver a Devocionales"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold tracking-tight flex items-center gap-2 mt-2", children: [
          /* @__PURE__ */ jsx(BookOpen, { className: "size-6 text-primary" }),
          "Editar devocional"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Modifica título, versículo, reflexión, portada, video o enlace." })
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
              placeholder: "Ej. Un tiempo para prepararse",
              maxLength: 255,
              className: errors.title ? "border-destructive" : ""
            }
          ),
          errors.title && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.title })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "scripture_reference", children: "Referencia bíblica" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "scripture_reference",
              value: form.scripture_reference,
              onChange: (e) => setField("scripture_reference", e.target.value),
              placeholder: "Ej. 1 Reyes 17:5-7",
              maxLength: 255,
              className: errors.scripture_reference ? "border-destructive" : ""
            }
          ),
          errors.scripture_reference && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.scripture_reference })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "scripture_text", children: "Texto del versículo" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "scripture_text",
              value: form.scripture_text,
              onChange: (e) => setField("scripture_text", e.target.value),
              placeholder: "Pega aquí el texto del pasaje (opcional)",
              rows: 2,
              className: errors.scripture_text ? "border-destructive" : ""
            }
          ),
          errors.scripture_text && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.scripture_text })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "body", children: "Reflexión / Mensaje *" }),
          /* @__PURE__ */ jsx(
            RichTextEditor,
            {
              initialContent: form.body,
              onChange: (html) => setField("body", html),
              placeholder: "Reflexión o mensaje principal del devocional. Puedes usar negrita, listas, citas e imágenes.",
              uploadImageUrl: currentTenant?.slug ? route("tenant.admin.devotionals.upload-image", currentTenant.slug) : void 0,
              className: errors.body ? "border-destructive" : ""
            }
          ),
          errors.body && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.body })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "prayer", children: "Oración" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "prayer",
              value: form.prayer,
              onChange: (e) => setField("prayer", e.target.value),
              placeholder: "Oración de cierre (opcional)",
              rows: 3,
              className: errors.prayer ? "border-destructive" : ""
            }
          ),
          errors.prayer && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.prayer })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "author", children: "Autor" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "author",
              value: form.author,
              onChange: (e) => setField("author", e.target.value),
              placeholder: "Ej. Pastor Juan Pérez",
              maxLength: 255,
              className: errors.author ? "border-destructive" : ""
            }
          ),
          errors.author && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.author })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "date", children: "Fecha del devocional *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "date",
              type: "date",
              value: form.date,
              onChange: (e) => setField("date", e.target.value),
              className: errors.date ? "border-destructive" : ""
            }
          ),
          errors.date && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.date })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "reflection_question", children: "Pregunta de reflexión" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "reflection_question",
              value: form.reflection_question,
              onChange: (e) => setField("reflection_question", e.target.value),
              placeholder: "Ej. ¿Cómo puedes prepararte espiritualmente?",
              maxLength: 500,
              className: errors.reflection_question ? "border-destructive" : ""
            }
          ),
          errors.reflection_question && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.reflection_question })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "cover_image_file", children: "Imagen de portada" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Sube una nueva imagen para reemplazar la actual. Máx. 2 MB." }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "cover_image_file",
              type: "file",
              accept: "image/*",
              className: `cursor-pointer ${errors.cover_image_file ? "border-destructive" : ""}`,
              onChange: (e) => {
                const file = e.target.files?.[0];
                setField("cover_image_file", file ?? null);
                if (coverPreview) URL.revokeObjectURL(coverPreview);
                setCoverPreview(file ? URL.createObjectURL(file) : null);
              }
            }
          ),
          (coverPreview || currentCoverUrl) && /* @__PURE__ */ jsx("div", { className: "w-full max-w-[400px] aspect-[1200/630] rounded-lg border overflow-hidden bg-muted", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: coverPreview ?? currentCoverUrl ?? "",
              alt: "Portada",
              className: "w-full h-full object-cover"
            }
          ) }),
          errors.cover_image_file && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.cover_image_file })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "video_url", children: "Video (YouTube o Vimeo)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "video_url",
              value: form.video_url,
              onChange: (e) => setField("video_url", e.target.value),
              placeholder: "https://www.youtube.com/watch?v=... o https://vimeo.com/...",
              className: errors.video_url ? "border-destructive" : ""
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "URL del video; en la vista pública se mostrará incrustado." }),
          errors.video_url && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.video_url })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "external_link", children: "Enlace externo" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "external_link",
              type: "url",
              value: form.external_link,
              onChange: (e) => setField("external_link", e.target.value),
              placeholder: "https://... (artículo u otro recurso)",
              className: errors.external_link ? "border-destructive" : ""
            }
          ),
          errors.external_link && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.external_link })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "excerpt", children: "Resumen (para listados)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "excerpt",
              value: form.excerpt,
              onChange: (e) => setField("excerpt", e.target.value),
              placeholder: "Texto corto para tarjetas o vista previa",
              maxLength: 500,
              className: errors.excerpt ? "border-destructive" : ""
            }
          ),
          errors.excerpt && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.excerpt })
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
            /* @__PURE__ */ jsx(Label, { htmlFor: "is_published", children: "Publicado" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Visible en la vista pública cuando esté activa." })
          ] }),
          /* @__PURE__ */ jsx(
            Switch,
            {
              id: "is_published",
              checked: form.is_published,
              onCheckedChange: (checked) => setField("is_published", checked)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: processing, className: "gap-2", children: [
            processing && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
            "Guardar cambios"
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => router.visit(route("tenant.admin.devotionals.index", currentTenant?.slug)),
              children: "Cancelar"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Edit as default
};
