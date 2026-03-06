import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, usePage, Head, Link } from "@inertiajs/react";
import { P as PublicLayout, H as Header } from "./Header-8AGqQP0J.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { C as Checkbox } from "./checkbox-dJXZmgY3.js";
import { CalendarCheck, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import "./ReportBusinessStrip-Cg46R4fS.js";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-checkbox";
function AppointmentRequest({ tenant, appointmentTypes }) {
  const brandColors = tenant.brand_colors ?? {};
  const bg_color = brandColors.bg_color ?? "#1e3a5f";
  const { data, setData, post, processing, errors, reset } = useForm({
    guest_name: "",
    guest_phone: "",
    guest_email: "",
    appointment_type: "",
    notes: "",
    consent: false
  });
  const page = usePage();
  useEffect(() => {
    if (page.props.flash?.success) {
      toast.success(page.props.flash.success);
      reset();
    }
  }, [page.props.flash?.success, reset]);
  const submit = (e) => {
    e.preventDefault();
    post(route("tenant.public.appointments.store", tenant.slug), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Recibimos tu solicitud. Te contactaremos pronto para confirmar tu cita.");
        reset();
      },
      onError: () => toast.error("Revisa los campos e intenta de nuevo.")
    });
  };
  const typeOptions = Object.entries(appointmentTypes).filter(([value]) => value !== "").map(([value, label]) => ({ value, label }));
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: "Solicitar cita" }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsx(
      Header,
      {
        tenantName: tenant.name,
        description: tenant.store_description,
        logoUrl: tenant.logo_url,
        bgColor: bg_color,
        textColor: brandColors.name_color ?? "#ffffff",
        descriptionColor: brandColors.description_color
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 bg-slate-50/80 p-4 -mt-4 pb-20 pt-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsx(CalendarCheck, { className: "size-6 text-primary" }),
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-slate-900", children: "Solicitar cita" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 mb-6", children: "Solicita una cita para oración, consejería pastoral o reunión con nuestro equipo. Te contactaremos para confirmar día y hora." }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4 rounded-2xl bg-white border border-slate-100 p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "guest_name", children: "Nombre completo *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "guest_name",
              value: data.guest_name,
              onChange: (e) => setData("guest_name", e.target.value),
              placeholder: "Tu nombre",
              className: errors.guest_name ? "border-destructive" : ""
            }
          ),
          errors.guest_name && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.guest_name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "guest_phone", children: "Teléfono / WhatsApp *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "guest_phone",
              type: "tel",
              value: data.guest_phone,
              onChange: (e) => setData("guest_phone", e.target.value),
              placeholder: "300 123 4567",
              className: errors.guest_phone ? "border-destructive" : ""
            }
          ),
          errors.guest_phone && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.guest_phone })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "guest_email", children: "Correo electrónico (opcional)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "guest_email",
              type: "email",
              value: data.guest_email,
              onChange: (e) => setData("guest_email", e.target.value),
              placeholder: "correo@ejemplo.com",
              className: errors.guest_email ? "border-destructive" : ""
            }
          ),
          errors.guest_email && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.guest_email })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Tipo de cita *" }),
          /* @__PURE__ */ jsxs(Select, { value: data.appointment_type, onValueChange: (v) => setData("appointment_type", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: errors.appointment_type ? "border-destructive" : "", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Elige una opción" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: typeOptions.map((opt) => /* @__PURE__ */ jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
          ] }),
          errors.appointment_type && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.appointment_type })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "notes", children: "Motivo o mensaje (opcional)" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "notes",
              value: data.notes,
              onChange: (e) => setData("notes", e.target.value),
              placeholder: "Cuéntanos brevemente por qué deseas la cita...",
              rows: 3,
              className: errors.notes ? "border-destructive" : ""
            }
          ),
          errors.notes && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.notes })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              id: "consent",
              checked: data.consent,
              onCheckedChange: (checked) => setData("consent", checked === true),
              className: errors.consent ? "border-destructive" : ""
            }
          ),
          /* @__PURE__ */ jsx(Label, { htmlFor: "consent", className: "text-sm leading-tight cursor-pointer", children: "Acepto que mis datos se usen para contactarme y confirmar mi cita. *" })
        ] }),
        errors.consent && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.consent }),
        /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: processing, className: "w-full gap-2", children: [
          processing && /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }),
          "Solicitar cita"
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-center mt-4", children: /* @__PURE__ */ jsx(Link, { href: route("tenant.home", tenant.slug), className: "text-sm text-primary hover:underline", children: "← Volver al inicio" }) })
    ] }) })
  ] });
}
export {
  AppointmentRequest as default
};
