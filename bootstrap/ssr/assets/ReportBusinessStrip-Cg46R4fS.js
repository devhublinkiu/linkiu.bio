import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { usePage, Link, router } from "@inertiajs/react";
import { Lock, Truck, CreditCard, Headphones, ArrowUpRight, ArrowRight } from "lucide-react";
import { useState } from "react";
import { c as cn } from "./utils-B0hQsrDj.js";
import { toast } from "sonner";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
const LEGAL_LINKS = [
  { slug: "terminos-y-condiciones", label: "Términos y condiciones" },
  { slug: "politica-privacidad", label: "Política de privacidad" },
  { slug: "politica-cookies", label: "Política de cookies" },
  { slug: "condiciones-uso", label: "Condiciones de uso" },
  { slug: "politica-devoluciones", label: "Política de devoluciones y reembolsos" },
  { slug: "condiciones-reservas", label: "Condiciones de reservas" },
  { slug: "informacion-consumidores", label: "Información para consumidores" }
];
function Footer() {
  const page = usePage();
  const tenant = page.props.currentTenant ?? page.props.tenant;
  const tenantSlug = tenant?.slug ?? "";
  return /* @__PURE__ */ jsx("footer", { className: "mt-auto bg-slate-950 px-8 py-12 text-sm text-slate-300 pb-32", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[480px] space-y-6", children: [
    /* @__PURE__ */ jsxs("section", { className: "grid grid-cols-2 gap-2 text-center sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex size-10 items-center justify-center rounded-xl bg-emerald-500/25 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]", children: /* @__PURE__ */ jsx(Lock, { className: "size-5", "aria-hidden": true }) }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-slate-300", children: "Seguridad SSL" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex size-10 items-center justify-center rounded-xl bg-blue-500/25 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.35)]", children: /* @__PURE__ */ jsx(Truck, { className: "size-5", "aria-hidden": true }) }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-slate-300", children: "Envíos seguros" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex size-10 items-center justify-center rounded-xl bg-violet-500/25 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.35)]", children: /* @__PURE__ */ jsx(CreditCard, { className: "size-5", "aria-hidden": true }) }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-slate-300", children: "Pagos seguros" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex size-10 items-center justify-center rounded-xl bg-amber-500/25 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)]", children: /* @__PURE__ */ jsx(Headphones, { className: "size-5", "aria-hidden": true }) }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-slate-300", children: "Soporte" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-3 flex items-center gap-2 font-semibold uppercase tracking-wider text-slate-200", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-lg", children: "Legal" }) }),
      /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-1", children: LEGAL_LINKS.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        Link,
        {
          href: tenantSlug ? route("tenant.legal.show", { tenant: tenantSlug, slug: item.slug }) : "#",
          className: "flex items-center gap-2 py-0.5 text-slate-400 transition-colors hover:text-slate-100",
          children: [
            /* @__PURE__ */ jsx(ArrowUpRight, { className: "size-3.5 shrink-0 text-slate-500", "aria-hidden": true }),
            item.label
          ]
        }
      ) }, item.slug)) })
    ] }),
    /* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsx("h3", { className: "mb-3 flex items-center gap-2 font-semibold uppercase tracking-wider text-slate-200", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-lg", children: "Medios de pago" }) }) }),
    /* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsxs(
      "a",
      {
        href: "https://linkiu.bio",
        target: "_blank",
        rel: "noopener noreferrer",
        className: "flex items-center justify-center text-slate-300 transition-colors hover:text-slate-100",
        children: [
          /* @__PURE__ */ jsxs("span", { className: "font-medium text-gray-400", children: [
            "Hecho con amor por ",
            /* @__PURE__ */ jsx("span", { className: "text-white font-bold", children: "Linkiu" })
          ] }),
          /* @__PURE__ */ jsx(ArrowUpRight, { className: "size-3.5 text-white", "aria-hidden": true })
        ]
      }
    ) })
  ] }) });
}
const AnimatedShinyText = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return /* @__PURE__ */ jsx(
    "span",
    {
      style: {
        "--shiny-width": `${shimmerWidth}px`
      },
      className: cn(
        "mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70",
        // Shine effect
        "animate-shiny-text [background-size:var(--shiny-width)_100%] bg-clip-text [background-position:0_0] bg-no-repeat [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
        // Shine gradient
        "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80",
        className
      ),
      ...props,
      children
    }
  );
};
const CATEGORIES = [
  { value: "problema_pedido", label: "Problema con pedido" },
  { value: "publicidad_enganosa", label: "Publicidad engañosa" },
  { value: "trato_indebido", label: "Trato indebido" },
  { value: "producto_servicio", label: "Producto o servicio" },
  { value: "otro", label: "Otro" }
];
function ReportModal({ open, onOpenChange, tenantSlug }) {
  const [category, setCategory] = useState("otro");
  const [message, setMessage] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [reporterWhatsapp, setReporterWhatsapp] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const resetForm = () => {
    setCategory("otro");
    setMessage("");
    setReporterEmail("");
    setReporterWhatsapp("");
    setImage(null);
    setErrors({});
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    if (!message.trim()) {
      setErrors({ message: "Describe el problema (obligatorio)." });
      return;
    }
    setIsSubmitting(true);
    const url = route("tenant.report.store", { tenant: tenantSlug });
    const formData = {
      category,
      message: message.trim(),
      url_context: typeof window !== "undefined" ? window.location.href : ""
    };
    if (reporterEmail.trim()) formData.reporter_email = reporterEmail.trim();
    if (reporterWhatsapp.trim()) formData.reporter_whatsapp = reporterWhatsapp.trim();
    if (image) formData.image = image;
    router.post(url, formData, {
      forceFormData: true,
      onSuccess: () => {
        toast.success("Gracias, hemos recibido tu reporte. Lo revisaremos a la brevedad.");
        onOpenChange(false);
        resetForm();
      },
      onError: (err) => {
        const next = {};
        if (typeof err === "object" && err !== null) {
          for (const [k, v] of Object.entries(err)) {
            next[k] = Array.isArray(v) ? v[0] : String(v);
          }
        }
        setErrors(next);
        toast.error("Revisa los campos e intenta de nuevo.");
      },
      onFinish: () => setIsSubmitting(false)
    });
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Reportar problema con este negocio" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Tu reporte es confidencial. Los datos de contacto son opcionales si prefieres ser anónimo." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "grid gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "report-category", children: "Categoría" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            id: "report-category",
            value: category,
            onChange: (e) => setCategory(e.target.value),
            className: cn(
              "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            ),
            children: CATEGORIES.map((c) => /* @__PURE__ */ jsx("option", { value: c.value, children: c.label }, c.value))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "report-message", children: "Mensaje *" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "report-message",
            value: message,
            onChange: (e) => setMessage(e.target.value),
            placeholder: "Describe el problema...",
            rows: 4,
            maxLength: 2e3,
            className: errors.message ? "border-destructive" : ""
          }
        ),
        errors.message && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "report-email", children: "Correo (opcional)" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "report-email",
            type: "email",
            value: reporterEmail,
            onChange: (e) => setReporterEmail(e.target.value),
            placeholder: "para poder contactarte"
          }
        ),
        errors.reporter_email && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors.reporter_email })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "report-whatsapp", children: "WhatsApp (opcional)" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "report-whatsapp",
            type: "text",
            value: reporterWhatsapp,
            onChange: (e) => setReporterWhatsapp(e.target.value),
            placeholder: "ej. 3001234567"
          }
        ),
        errors.reporter_whatsapp && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors.reporter_whatsapp })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "report-image", children: "Evidencia con imagen (opcional)" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "report-image",
            type: "file",
            accept: "image/jpeg,image/png,image/gif,image/webp",
            onChange: (e) => setImage(e.target.files?.[0] ?? null)
          }
        ),
        image && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: image.name }),
        errors.image && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors.image })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { showCloseButton: false, children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => onOpenChange(false),
            disabled: isSubmitting,
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isSubmitting, children: isSubmitting ? "Enviando..." : "Enviar reporte" })
      ] })
    ] })
  ] }) });
}
function ReportBusinessStrip() {
  const [open, setOpen] = useState(false);
  const page = usePage();
  const tenant = page.props.currentTenant;
  const tenantSlug = tenant?.slug ?? "";
  if (!tenantSlug) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setOpen(true),
        className: cn(
          "group flex w-full items-center justify-center border-y border-black/5 bg-neutral-100 py-2 px-4 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        ),
        children: /* @__PURE__ */ jsxs(AnimatedShinyText, { className: "inline-flex items-center justify-center gap-1.5 px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "¿Problemas con este negocio? ",
            /* @__PURE__ */ jsx("span", { className: "text-red-600 font-bold", children: "Reporta aquí" })
          ] }),
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1 size-3 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5", "aria-hidden": true })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(ReportModal, { open, onOpenChange: setOpen, tenantSlug })
  ] });
}
export {
  Footer as F,
  ReportBusinessStrip as R
};
