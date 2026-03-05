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
import { ChevronLeft, Briefcase, Loader2 } from "lucide-react";
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
function Edit({ service }) {
  const { currentTenant } = usePage().props;
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: service.name,
    description: service.description ?? "",
    audience: service.audience ?? "",
    service_type: service.service_type ?? "",
    schedule: service.schedule ?? "",
    frequency: service.frequency ?? "",
    duration: service.duration ?? "",
    location: service.location ?? "",
    modality: service.modality ?? "",
    image_file: null,
    leader: service.leader ?? "",
    contact_info: service.contact_info ?? "",
    external_url: service.external_url ?? "",
    order: service.order,
    is_active: service.is_active
  });
  const [imagePreview, setImagePreview] = useState(null);
  const currentImageUrl = service.image_url ?? null;
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
      description: form.description || null,
      audience: form.audience || null,
      service_type: form.service_type || null,
      schedule: form.schedule || null,
      frequency: form.frequency || null,
      duration: form.duration || null,
      location: form.location || null,
      modality: form.modality || null,
      leader: form.leader || null,
      contact_info: form.contact_info || null,
      external_url: form.external_url || null,
      order: form.order,
      is_active: form.is_active
    };
    if (form.image_file) payload.image_file = form.image_file;
    const updateUrl = route("tenant.admin.services.update", [currentTenant?.slug, service.id]);
    const options = {
      preserveScroll: true,
      onSuccess: () => toast.success("Servicio actualizado correctamente"),
      onError: (errs) => {
        setErrors(errs);
        toast.error("Revisa los campos del formulario");
      },
      onFinish: () => setProcessing(false)
    };
    if (form.image_file) {
      router.post(updateUrl, { ...payload, _method: "PUT" }, options);
    } else {
      router.put(updateUrl, payload, options);
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Editar servicio", children: [
    /* @__PURE__ */ jsx(Head, { title: "Editar servicio" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("tenant.admin.services.index", currentTenant?.slug),
            className: "text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }),
              " Volver a Mis Servicios"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold tracking-tight flex items-center gap-2 mt-2", children: [
          /* @__PURE__ */ jsx(Briefcase, { className: "size-6 text-primary" }),
          "Editar servicio"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Modifica los datos del servicio." })
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
              placeholder: "Ej. Culto dominical",
              maxLength: 255,
              className: errors.name ? "border-destructive" : ""
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "description", children: "Descripción" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "description",
              value: form.description,
              onChange: (e) => setField("description", e.target.value),
              placeholder: "Qué se hace, a quién va dirigido...",
              rows: 4,
              className: errors.description ? "border-destructive" : ""
            }
          ),
          errors.description && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "audience", children: "Público / A quién va dirigido" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "audience",
              value: form.audience,
              onChange: (e) => setField("audience", e.target.value),
              placeholder: "Ej. Jóvenes 15-25, Toda la familia, Mujeres",
              maxLength: 255,
              className: errors.audience ? "border-destructive" : ""
            }
          ),
          errors.audience && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.audience })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "service_type", children: "Tipo de servicio" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "service_type",
              value: form.service_type,
              onChange: (e) => setField("service_type", e.target.value),
              placeholder: "Ej. Culto de adoración, Estudio bíblico, Reunión de oración",
              maxLength: 255,
              className: errors.service_type ? "border-destructive" : ""
            }
          ),
          errors.service_type && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.service_type })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "schedule", children: "Horario" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "schedule",
              value: form.schedule,
              onChange: (e) => setField("schedule", e.target.value),
              placeholder: "Ej. Domingos 10:00 a. m.",
              maxLength: 500,
              className: errors.schedule ? "border-destructive" : ""
            }
          ),
          errors.schedule && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.schedule })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "frequency", children: "Frecuencia" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "frequency",
              value: form.frequency,
              onChange: (e) => setField("frequency", e.target.value),
              placeholder: "Ej. Semanal, Quincenal, Mensual",
              maxLength: 100,
              className: errors.frequency ? "border-destructive" : ""
            }
          ),
          errors.frequency && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.frequency })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "duration", children: "Duración" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "duration",
              value: form.duration,
              onChange: (e) => setField("duration", e.target.value),
              placeholder: "Ej. 1:30 h, 2 horas",
              maxLength: 100,
              className: errors.duration ? "border-destructive" : ""
            }
          ),
          errors.duration && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.duration })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "location", children: "Lugar" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "location",
              value: form.location,
              onChange: (e) => setField("location", e.target.value),
              placeholder: "Ej. Auditorio principal",
              maxLength: 500,
              className: errors.location ? "border-destructive" : ""
            }
          ),
          errors.location && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.location })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "modality", children: "Modalidad" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "modality",
              value: form.modality,
              onChange: (e) => setField("modality", e.target.value),
              placeholder: "Ej. Presencial, En línea, Híbrido",
              maxLength: 100,
              className: errors.modality ? "border-destructive" : ""
            }
          ),
          errors.modality && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.modality })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "image_file", children: "Imagen" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Se redimensionará a 200 × 120 px. Máx. 2 MB. Sube una nueva para reemplazar la actual." }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "image_file",
              type: "file",
              accept: "image/*",
              className: `cursor-pointer ${errors.image_file ? "border-destructive" : ""}`,
              onChange: (e) => {
                const file = e.target.files?.[0];
                setField("image_file", file ?? null);
                if (imagePreview) URL.revokeObjectURL(imagePreview);
                setImagePreview(file ? URL.createObjectURL(file) : null);
              }
            }
          ),
          (imagePreview || currentImageUrl) && /* @__PURE__ */ jsx("div", { className: "w-[200px] h-[120px] rounded-lg border overflow-hidden bg-muted", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: imagePreview ?? currentImageUrl ?? "",
              alt: "Vista previa",
              className: "w-full h-full object-cover"
            }
          ) }),
          errors.image_file && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.image_file })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "leader", children: "Líder / Responsable" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "leader",
              value: form.leader,
              onChange: (e) => setField("leader", e.target.value),
              placeholder: "Ej. Pastor Juan Pérez, Ministerio de jóvenes",
              maxLength: 255,
              className: errors.leader ? "border-destructive" : ""
            }
          ),
          errors.leader && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.leader })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "contact_info", children: "Contacto o más información" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "contact_info",
              value: form.contact_info,
              onChange: (e) => setField("contact_info", e.target.value),
              placeholder: "Ej. WhatsApp 300 123 4567, pregunta en recepción",
              maxLength: 500,
              className: errors.contact_info ? "border-destructive" : ""
            }
          ),
          errors.contact_info && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.contact_info })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "external_url", children: "Enlace externo" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "external_url",
              type: "url",
              value: form.external_url,
              onChange: (e) => setField("external_url", e.target.value),
              placeholder: "https://... (transmisión en vivo, Zoom, etc.)",
              className: errors.external_url ? "border-destructive" : ""
            }
          ),
          errors.external_url && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.external_url })
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
            /* @__PURE__ */ jsx(Label, { htmlFor: "is_active", children: "Activo" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Visible en tu enlace cuando publiques esta sección." })
          ] }),
          /* @__PURE__ */ jsx(
            Switch,
            {
              id: "is_active",
              checked: form.is_active,
              onCheckedChange: (checked) => setField("is_active", checked)
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
              asChild: true,
              children: /* @__PURE__ */ jsx(Link, { href: route("tenant.admin.services.index", currentTenant?.slug), children: "Cancelar" })
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
