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
import { ChevronLeft, Users, Loader2 } from "lucide-react";
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
    name: "",
    role: "",
    photo_file: null,
    bio: "",
    email: "",
    phone: "",
    whatsapp: "",
    order: 0,
    is_published: true
  });
  const [photoPreview, setPhotoPreview] = useState(null);
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
      name: form.name,
      role: form.role || null,
      bio: form.bio || null,
      email: form.email || null,
      phone: form.phone || null,
      whatsapp: form.whatsapp || null,
      order: form.order,
      is_published: form.is_published
    };
    if (form.photo_file) payload.photo_file = form.photo_file;
    router.post(route("tenant.admin.collaborators.store", currentTenant?.slug), payload, {
      preserveScroll: true,
      onSuccess: () => toast.success("Colaborador creado correctamente"),
      onError: (errs) => {
        setErrors(errs);
        toast.error("Revisa los campos del formulario");
      },
      onFinish: () => setProcessing(false)
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Nuevo colaborador", children: [
    /* @__PURE__ */ jsx(Head, { title: "Nuevo colaborador" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("tenant.admin.collaborators.index", currentTenant?.slug),
            className: "text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }),
              " Volver a Colaboradores"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold tracking-tight flex items-center gap-2 mt-2", children: [
          /* @__PURE__ */ jsx(Users, { className: "size-6 text-primary" }),
          "Nuevo colaborador"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Nombre, cargo, foto y biografía para la página Nuestro equipo." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6 rounded-xl border bg-card p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "name",
              value: form.name,
              onChange: (e) => setField("name", e.target.value),
              placeholder: "Ej. Juan Pérez",
              maxLength: 255,
              className: errors.name ? "border-destructive" : ""
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "role", children: "Cargo / ministerio" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "role",
              value: form.role,
              onChange: (e) => setField("role", e.target.value),
              placeholder: "Ej. Pastor principal, Líder de alabanza",
              maxLength: 255,
              className: errors.role ? "border-destructive" : ""
            }
          ),
          errors.role && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.role })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "photo_file", children: "Foto" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Se usará como foto de perfil (cuadrada). Máx. 2 MB." }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "photo_file",
              type: "file",
              accept: "image/*",
              className: `cursor-pointer ${errors.photo_file ? "border-destructive" : ""}`,
              onChange: (e) => {
                const file = e.target.files?.[0];
                setField("photo_file", file ?? null);
                if (photoPreview) URL.revokeObjectURL(photoPreview);
                setPhotoPreview(file ? URL.createObjectURL(file) : null);
              }
            }
          ),
          photoPreview && /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full border overflow-hidden bg-muted", children: /* @__PURE__ */ jsx("img", { src: photoPreview, alt: "Vista previa", className: "w-full h-full object-cover" }) }),
          errors.photo_file && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.photo_file })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "bio", children: "Biografía" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "bio",
              value: form.bio,
              onChange: (e) => setField("bio", e.target.value),
              placeholder: "Breve descripción o ministerio",
              rows: 4,
              maxLength: 2e3,
              className: errors.bio ? "border-destructive" : ""
            }
          ),
          errors.bio && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.bio })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Correo" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "email",
                type: "email",
                value: form.email,
                onChange: (e) => setField("email", e.target.value),
                placeholder: "correo@ejemplo.com",
                maxLength: 255,
                className: errors.email ? "border-destructive" : ""
              }
            ),
            errors.email && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "phone", children: "Teléfono" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "phone",
                value: form.phone,
                onChange: (e) => setField("phone", e.target.value),
                placeholder: "+57 300 123 4567",
                maxLength: 64,
                className: errors.phone ? "border-destructive" : ""
              }
            ),
            errors.phone && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.phone })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "whatsapp", children: "WhatsApp" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "whatsapp",
              value: form.whatsapp,
              onChange: (e) => setField("whatsapp", e.target.value),
              placeholder: "Número con código de país (ej. 573001234567)",
              maxLength: 64,
              className: errors.whatsapp ? "border-destructive" : ""
            }
          ),
          errors.whatsapp && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.whatsapp })
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
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Menor número aparece primero." }),
          errors.order && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.order })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border p-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "is_published", children: "Publicado" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Visible en la web (Nuestro equipo)" })
          ] }),
          /* @__PURE__ */ jsx(
            Switch,
            {
              id: "is_published",
              checked: form.is_published,
              onCheckedChange: (v) => setField("is_published", v)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: processing, className: "gap-2", children: [
            processing && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
            "Crear colaborador"
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("tenant.admin.collaborators.index", currentTenant?.slug), children: "Cancelar" }) })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Create as default
};
