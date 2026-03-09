import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { ChevronRight, Lock, ArrowUpRight, ArrowRight } from "lucide-react";
import { c as cn } from "./utils-B0hQsrDj.js";
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
function AnimatedGradientText({
  children,
  className,
  speed = 1,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      style: {
        "--bg-size": `${speed * 300}%`,
        "--color-from": colorFrom,
        "--color-to": colorTo
      },
      className: cn(
        `animate-gradient inline bg-gradient-to-r from-[var(--color-from)] via-[var(--color-to)] to-[var(--color-from)] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
        className
      ),
      ...props,
      children
    }
  );
}
const LINKIU_BASE = "https://linkiu.bio";
const APP_VERSION = "1.0";
const LEGAL_LINKS = [
  { href: `${LINKIU_BASE}/politica-tratamiento-datos`, label: "Política de Tratamiento de Datos Personales" },
  { href: `${LINKIU_BASE}/politica-cookies`, label: "Política de Cookies" },
  { href: `${LINKIU_BASE}/terminos-y-condiciones`, label: "Términos y Condiciones" },
  { href: `${LINKIU_BASE}/aviso-legal`, label: "Aviso legal" },
  { href: `${LINKIU_BASE}/informacion-consumidores`, label: "Información al consumidor" },
  { href: `${LINKIU_BASE}/derecho-retracto`, label: "Derecho de retracto" },
  { href: `${LINKIU_BASE}/ayuda`, label: "Centro de ayuda" },
  { href: `${LINKIU_BASE}/descargo-responsabilidad`, label: "Descargo de responsabilidad" }
];
const SocialIcon = ({ src, alt, className }) => /* @__PURE__ */ jsx("img", { src, alt, className: cn("brightness-0 invert", className ?? "size-5") });
const SOCIAL_LINKS = [
  { href: `${LINKIU_BASE}`, icon: (p) => /* @__PURE__ */ jsx(SocialIcon, { src: "/social-icons/instagram.svg", alt: "Instagram", className: p.className }), label: "Instagram" },
  { href: `${LINKIU_BASE}`, icon: (p) => /* @__PURE__ */ jsx(SocialIcon, { src: "/social-icons/facebook.svg", alt: "Facebook", className: p.className }), label: "Facebook" },
  { href: `${LINKIU_BASE}`, icon: (p) => /* @__PURE__ */ jsx(SocialIcon, { src: "/social-icons/youtube.svg", alt: "YouTube", className: p.className }), label: "YouTube" },
  { href: `${LINKIU_BASE}`, icon: (p) => /* @__PURE__ */ jsx(SocialIcon, { src: "/social-icons/twitter.svg", alt: "Twitter", className: p.className }), label: "Twitter" },
  { href: `${LINKIU_BASE}`, icon: (p) => /* @__PURE__ */ jsx(SocialIcon, { src: "/social-icons/tiktok.svg", alt: "TikTok", className: p.className }), label: "TikTok" }
];
function Footer() {
  return /* @__PURE__ */ jsxs("footer", { className: "mt-auto bg-slate-950 px-6 text-sm text-slate-300 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[480px] space-y-8 mt-16", children: [
      /* @__PURE__ */ jsx("div", { className: "px-4", children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: LINKIU_BASE,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "group relative flex w-full items-center justify-center rounded-[2rem] px-4 py-2 bg-white-900 backdrop-blur-lg bg-opacity-10",
          children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: cn(
                  "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[2px]"
                ),
                style: {
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "subtract",
                  WebkitClipPath: "padding-box"
                }
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "shrink-0 text-lg mr-2", "aria-hidden": true, children: "✨" }),
            /* @__PURE__ */ jsx(AnimatedGradientText, { className: "text-base font-semibold text-center min-w-0 flex-1", children: "Crea tu Linkiu — es gratis" }),
            /* @__PURE__ */ jsx(ChevronRight, { className: "ml-2 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 shrink-0" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs("section", { className: "px-4", "aria-label": "Horarios de atención", children: [
        /* @__PURE__ */ jsx("p", { className: "text-base font-semibold text-slate-200 mb-1.5", children: "Horarios de atención" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 leading-relaxed", children: [
          "Equipo de ventas: 8:00 a. m. – 6:00 p. m.",
          /* @__PURE__ */ jsx("br", {}),
          "Equipo de facturación: 8:00 a. m. – 6:00 p. m.",
          /* @__PURE__ */ jsx("br", {}),
          "Equipo de servicio al cliente: 8:00 a. m. – 6:00 p. m.",
          /* @__PURE__ */ jsx("br", {}),
          "Equipo de soporte: 8:00 a. m. – 11:00 p. m."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "px-4", "aria-label": "Horarios de atención", children: [
        /* @__PURE__ */ jsx("p", { className: "text-base font-semibold text-slate-200 mb-1.5", children: "Dirección y teléfonos" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 leading-relaxed", children: [
          "Dirección: Barranquilla, Colombia",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("a", { href: "mailto:info@linkiu.bio", className: "underline text-slate-400 hover:text-slate-100 transition-colors", children: "Correo ventas: info@linkiu.bio" }),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("a", { href: "https://wa.me/573104594344", className: "underline text-slate-400 hover:text-slate-100 transition-colors", children: "WhatsApp ventas: +57 310 459 4344" }),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("a", { href: "mailto:info@linkiu.bio", className: "underline text-slate-400 hover:text-slate-100 transition-colors", children: "Correo soporte: info@linkiu.bio" }),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("a", { href: "https://wa.me/57323333211", className: "underline text-slate-400 hover:text-slate-100 transition-colors", children: "WhatsApp soporte: +57 323 333 3211" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Legal Linkiu", className: "px-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-base font-semibold text-slate-200 mb-1.5", children: "Legal" }),
        /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-1", children: LEGAL_LINKS.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          "a",
          {
            href: item.href,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-xs text-slate-400 hover:text-slate-100 transition-colors",
            children: item.label
          }
        ) }, item.label)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-4", children: SOCIAL_LINKS.map(({ href, icon: Icon, label }) => /* @__PURE__ */ jsx(
        "a",
        {
          href,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "flex size-10 items-center justify-center rounded-full bg-slate-800/80 text-white hover:text-white hover:bg-slate-700/80 transition-colors",
          "aria-label": label,
          children: /* @__PURE__ */ jsx(Icon, { className: "size-5" })
        },
        label
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-4 gap-y-3", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs text-emerald-400/80", children: [
          /* @__PURE__ */ jsx(Lock, { className: "size-3.5 text-emerald-400/80", "aria-hidden": true }),
          "Sitio seguro"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs text-slate-300 border border-slate-600/50", children: [
          /* @__PURE__ */ jsxs("span", { className: "relative flex size-2", "aria-hidden": true, children: [
            /* @__PURE__ */ jsx("span", { className: "absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75 animate-ping" }),
            /* @__PURE__ */ jsx("span", { className: "relative inline-flex size-2 rounded-full bg-emerald-500" })
          ] }),
          "Todos los sistemas operativos"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-500", children: [
          "v",
          APP_VERSION
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "pointer-events-none flex justify-center mt-6",
        "aria-hidden": true,
        children: /* @__PURE__ */ jsx("span", { className: "mix-blend-overlay select-none text-[200px] font-extrabold leading-none tracking-tighter text-white", children: "Linkiu" })
      }
    ),
    /* @__PURE__ */ jsxs(
      "a",
      {
        href: LINKIU_BASE,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "flex items-center justify-center text-slate-300 transition-colors hover:text-slate-100 mt-2",
        children: [
          /* @__PURE__ */ jsxs("span", { className: "font-medium text-gray-400", children: [
            "Hecho con amor por ",
            /* @__PURE__ */ jsx("span", { className: "text-white font-bold", children: "Linkiu" })
          ] }),
          /* @__PURE__ */ jsx(ArrowUpRight, { className: "size-3.5 text-white ml-1", "aria-hidden": true })
        ]
      }
    )
  ] });
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
  AnimatedGradientText as A,
  Footer as F,
  ReportBusinessStrip as R
};
