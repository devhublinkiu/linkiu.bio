import { jsxs, jsx } from "react/jsx-runtime";
import React__default, { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CdwLWQ00.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { toast } from "sonner";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { ChevronLeft, Headphones, Upload, Loader2 } from "lucide-react";
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
function Edit({ episode }) {
  const { currentTenant } = usePage().props;
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: episode.title,
    audio_file: null,
    duration_seconds: episode.duration_seconds,
    sort_order: episode.sort_order,
    is_published: episode.is_published
  });
  const fileInputRef = React__default.useRef(null);
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
      duration_seconds: form.duration_seconds,
      sort_order: form.sort_order,
      is_published: form.is_published
    };
    if (form.audio_file) payload.audio_file = form.audio_file;
    router.put(route("tenant.admin.audio-dosis.update", [currentTenant?.slug, episode.id]), payload, {
      preserveScroll: true,
      forceFormData: !!form.audio_file,
      onSuccess: () => toast.success("Episodio actualizado"),
      onError: (errs) => {
        setErrors(errs);
        toast.error("Revisa los campos del formulario");
      },
      onFinish: () => setProcessing(false)
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Editar episodio", children: [
    /* @__PURE__ */ jsx(Head, { title: "Editar episodio" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("tenant.admin.audio-dosis.index", currentTenant?.slug),
            className: "text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }),
              " Volver a Audio Dosis"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold tracking-tight flex items-center gap-2 mt-2", children: [
          /* @__PURE__ */ jsx(Headphones, { className: "size-6 text-primary" }),
          "Editar episodio"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mt-1", children: episode.title })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "mt-6 space-y-6 rounded-xl border bg-card p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "title", children: "Título *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "title",
              value: form.title,
              onChange: (e) => setField("title", e.target.value),
              placeholder: "Ej: Mensaje del domingo",
              className: errors.title ? "border-destructive" : ""
            }
          ),
          errors.title && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.title })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Archivo de audio (opcional)" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Deja vacío para mantener el audio actual." }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              accept: ".mp3,.mpeg,.wav,.ogg,.m4a,audio/mpeg,audio/wav,audio/ogg,audio/mp4",
              className: "hidden",
              onChange: (e) => setField("audio_file", e.target.files?.[0] ?? null)
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "w-full gap-2",
              onClick: () => fileInputRef.current?.click(),
              children: [
                /* @__PURE__ */ jsx(Upload, { className: "size-4" }),
                form.audio_file ? form.audio_file.name : "Cambiar archivo (MP3, WAV, OGG, M4A)"
              ]
            }
          ),
          errors.audio_file && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.audio_file })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "duration_seconds", children: "Duración (segundos) *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "duration_seconds",
                type: "number",
                min: 0,
                value: form.duration_seconds === 0 ? "" : form.duration_seconds,
                onChange: (e) => setField("duration_seconds", parseInt(e.target.value, 10) || 0),
                placeholder: "Ej: 900",
                className: errors.duration_seconds ? "border-destructive" : ""
              }
            ),
            errors.duration_seconds && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.duration_seconds })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "sort_order", children: "Orden" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "sort_order",
                type: "number",
                min: 0,
                value: form.sort_order,
                onChange: (e) => setField("sort_order", parseInt(e.target.value, 10) || 0)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Switch,
            {
              id: "is_published",
              checked: form.is_published,
              onCheckedChange: (v) => setField("is_published", v)
            }
          ),
          /* @__PURE__ */ jsx(Label, { htmlFor: "is_published", children: "Publicado" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: processing, className: "gap-2", children: [
            processing && /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }),
            "Guardar cambios"
          ] }),
          /* @__PURE__ */ jsx(Link, { href: route("tenant.admin.audio-dosis.index", currentTenant?.slug), children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", children: "Cancelar" }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Edit as default
};
