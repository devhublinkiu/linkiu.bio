import React__default, { createContext, useContext, useState, useRef, useEffect, useMemo } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Lock, Truck, PackageSearch, RefreshCcw, Leaf, Clock, MapPin, ChefHat, UserRoundCheck, MessageCircleMore, CalendarCheck, Trophy, Heart, RadioTower, Users, BookOpen, ShieldCheck, Headphones, BadgeCheck, ArrowUpRight, ServerCrash, Server, Home, Store, Building2, CalendarHeart, HandHeart, UtensilsCrossed } from "lucide-react";
import { usePage, Link, router } from "@inertiajs/react";
import { c as cn } from "./utils-B0hQsrDj.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { toast } from "sonner";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-1eiaoMgl.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import { useScroll, useVelocity, useSpring, useTransform, useMotionValue, useAnimationFrame, motion } from "motion/react";
const PublicLayoutPortalContext = createContext(null);
function usePublicLayoutPortal() {
  return useContext(PublicLayoutPortalContext);
}
const COLUMN_BOX = [
  ["bg-emerald-100", "text-emerald-900"],
  ["bg-orange-100", "text-orange-800"],
  ["bg-red-100", "text-red-700"],
  ["bg-blue-100", "text-blue-800"]
];
const BENEFITS_BY_VERTICAL = {
  ecommerce: [ShieldCheck, Headphones, Truck, BadgeCheck],
  church: [Heart, RadioTower, Users, BookOpen],
  servicios: [UserRoundCheck, MessageCircleMore, CalendarCheck, Trophy],
  gastronomy: [Leaf, Clock, MapPin, ChefHat],
  dropshipping: [Lock, Truck, PackageSearch, RefreshCcw]
};
const LABELS_BY_VERTICAL = {
  ecommerce: [
    ["Pagos", "seguros"],
    ["Atención", "24/7"],
    ["Envíos", "nacionales"],
    ["Garantías", "certificadas"]
  ],
  church: [
    ["Donaciones", "seguras"],
    ["Transmisiones", "en vivo"],
    ["Comunidad", "activa"],
    ["Devocionales", "y testimonios"]
  ],
  servicios: [
    ["Profesionales", "verificados"],
    ["Soporte", "inmediato"],
    ["Agenda", "online"],
    ["Calidad", "garantizada"]
  ],
  gastronomy: [
    ["Ingredientes", "frescos"],
    ["Pedidos", "rápidos"],
    ["Envío", "local"],
    ["Sabor", "auténtico"]
  ],
  dropshipping: [
    ["Pagos", "seguros"],
    ["Envíos", "nacionales"],
    ["Rastreo", "incluido"],
    ["Devoluciones", "fáciles"]
  ]
};
function resolveVerticalFromTenant$1(slug) {
  switch (slug) {
    case "gastronomia":
      return "gastronomy";
    case "ecommerce":
      return "ecommerce";
    case "church":
    case "iglesias":
      return "church";
    case "servicios":
      return "servicios";
    case "dropshipping":
      return "dropshipping";
    default:
      return "ecommerce";
  }
}
function buildItems(vertical) {
  const icons = BENEFITS_BY_VERTICAL[vertical];
  const labels = LABELS_BY_VERTICAL[vertical];
  return icons.map((Icon, i) => {
    const [box, iconColor] = COLUMN_BOX[i];
    const [line1, line2] = labels[i];
    return {
      icon: Icon,
      boxClass: box,
      iconClass: iconColor,
      line1,
      line2
    };
  });
}
function Benefits({ className, vertical: verticalProp }) {
  const page = usePage();
  const slug = page.props.currentTenant?.vertical?.slug;
  const vertical = verticalProp ?? resolveVerticalFromTenant$1(slug);
  const items = buildItems(vertical);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "flex w-full items-center justify-center gap-10 px-4 py-4",
        className
      ),
      "data-part": "benefits",
      "data-vertical": vertical,
      "aria-label": "Beneficios",
      children: items.map((item, index) => {
        const Icon = item.icon;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex shrink-0 flex-col items-center gap-0.5",
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: cn(
                    "flex items-center justify-center rounded-lg p-1.5",
                    item.boxClass
                  ),
                  children: /* @__PURE__ */ jsx(Icon, { className: cn("size-6", item.iconClass), strokeWidth: 2, "aria-hidden": true })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "text-center text-[10px] leading-[10px] text-slate-800 pt-2", children: [
                /* @__PURE__ */ jsx("p", { className: "mb-0", children: item.line1 }),
                /* @__PURE__ */ jsx("p", { children: item.line2 })
              ] })
            ]
          },
          `${vertical}-${index}`
        );
      })
    }
  );
}
const PLATFORMS = [
  { id: "instagram", label: "Instagram", src: "/tenant/FooterShell/instagram.svg" },
  { id: "facebook", label: "Facebook", src: "/tenant/FooterShell/facebook.svg" },
  { id: "tiktok", label: "TikTok", src: "/tenant/FooterShell/tiktok.svg" },
  { id: "twitter", label: "X (Twitter)", src: "/tenant/FooterShell/twitter.svg" },
  { id: "youtube", label: "YouTube", src: "/tenant/FooterShell/youtube.svg" }
];
function SocialMedia({ className, links }) {
  return /* @__PURE__ */ jsx(
    "nav",
    {
      className: cn(
        "footer-shell-social flex flex-wrap items-center justify-center gap-3 px-4 py-2",
        className
      ),
      "aria-label": "Redes sociales",
      "data-part": "social-media",
      children: PLATFORMS.map(({ id, label, src }) => {
        const href = links?.[id]?.trim();
        const active = Boolean(href);
        return /* @__PURE__ */ jsx(
          "a",
          {
            href: href || "#",
            target: active ? "_blank" : void 0,
            rel: active ? "noopener noreferrer" : void 0,
            className: "inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 p-1 transition-opacity hover:opacity-90",
            "aria-label": label,
            "aria-disabled": !active,
            "data-social": id,
            "data-active": active,
            onClick: (e) => {
              if (!active) e.preventDefault();
            },
            children: /* @__PURE__ */ jsx("img", { src, alt: "", className: "size-6 object-contain", width: 24, height: 24 })
          },
          id
        );
      })
    }
  );
}
const MAX_CHIPS = 4;
function digitsForWhatsAppUrl(raw) {
  return raw.replace(/\D/g, "");
}
function Contact({ className }) {
  const { currentTenant, location_status_message, locationsCount, public_location_names } = usePage().props;
  const slug = currentTenant?.slug ?? "";
  const waFromSettings = currentTenant?.settings?.whatsapp_admin_phone?.trim();
  const phoneFallback = currentTenant?.contact_phone?.trim();
  const whatsappNumber = waFromSettings || phoneFallback || "";
  const waDigits = whatsappNumber ? digitsForWhatsAppUrl(whatsappNumber) : "";
  const whatsappHref = waDigits ? `https://wa.me/${waDigits}` : "";
  const horario = location_status_message?.trim();
  const lineaAbierto = horario ? /^(abierto|cerrado)/i.test(horario) ? horario : `Abierto hoy: ${horario}` : "Abierto hoy: —";
  const count = typeof locationsCount === "number" && !Number.isNaN(locationsCount) ? locationsCount : 0;
  const namesFromServer = public_location_names ?? [];
  const sedesHref = slug ? route("tenant.public.locations", { tenant: slug }) : "#";
  const chips = namesFromServer.length > 0 ? namesFromServer.slice(0, MAX_CHIPS) : count === 1 ? ["Sede principal"] : count > 1 ? ["Varias sedes"] : [];
  const mostrarVerTodasEnChip = count > 1 && Boolean(slug);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "footer-shell-contact flex w-full flex-col items-center gap-2.5 pt-6 text-center text-slate-950",
        className
      ),
      "data-name": "Base_contacts",
      "data-part": "contact",
      children: [
        /* @__PURE__ */ jsx("p", { className: "w-full shrink-0 text-sm font-bold leading-normal", children: "Información de contacto" }),
        /* @__PURE__ */ jsxs("div", { className: "w-full shrink-0 text-xs font-normal leading-[14px] text-slate-950", children: [
          /* @__PURE__ */ jsx("p", { className: "mb-0 leading-[14px]", children: lineaAbierto }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex w-full flex-col items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "block w-full text-[12px] leading-[14px] text-slate-950", children: "WhatsApp:" }),
            /* @__PURE__ */ jsx("div", { className: "flex max-w-full flex-wrap items-center justify-center gap-1.5", children: whatsappNumber ? whatsappHref ? /* @__PURE__ */ jsx(
              Badge,
              {
                variant: "outline",
                className: "border-slate-200 bg-slate-50 font-medium text-slate-900",
                asChild: true,
                children: /* @__PURE__ */ jsx("a", { href: whatsappHref, target: "_blank", rel: "noopener noreferrer", children: whatsappNumber })
              }
            ) : /* @__PURE__ */ jsx(
              Badge,
              {
                variant: "outline",
                className: "border-slate-200 bg-slate-50 font-medium text-slate-900",
                children: whatsappNumber
              }
            ) : /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "font-normal text-slate-700", children: "—" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex w-full flex-col items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "block w-full text-[12px] leading-[14px] text-slate-950", children: "Sedes:" }),
            /* @__PURE__ */ jsxs("div", { className: "flex max-w-full flex-wrap items-center justify-center gap-1.5", children: [
              count === 0 && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "font-normal text-slate-700", children: "—" }),
              chips.map((name) => /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: "outline",
                  className: "max-w-[140px] truncate border-slate-200 bg-slate-50 font-medium text-slate-900",
                  children: name
                },
                name
              )),
              mostrarVerTodasEnChip && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "border-slate-200 bg-transparent p-0 font-medium", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: sedesHref, className: "px-2 py-0.5 text-slate-950 hover:bg-slate-100", children: "Ver todas las sedes" }) })
            ] })
          ] })
        ] })
      ]
    }
  );
}
const LINES_BY_VERTICAL = {
  gastronomy: [
    { label: "Condiciones de reservas", slug: "condiciones-reservas" },
    { label: "Política de cancelación de reservas", slug: "terminos-y-condiciones" },
    { label: "Política de devoluciones y reembolsos", slug: "politica-devoluciones" },
    { label: "Política de tiempos de preparación y entrega", slug: "condiciones-uso" },
    { label: "Información al consumidor", slug: "informacion-consumidores" }
  ],
  ecommerce: [
    { label: "Política de envíos", slug: "informacion-consumidores" },
    { label: "Tiempos de entrega", slug: "terminos-y-condiciones" },
    { label: "Cambios y devoluciones", slug: "politica-devoluciones" },
    { label: "Política de garantías", slug: "condiciones-uso" },
    { label: "Derecho de retracto", slug: "politica-privacidad" },
    { label: "Información al consumidor", slug: "informacion-consumidores" }
  ],
  dropshipping: [
    { label: "Política de envíos", slug: "informacion-consumidores" },
    { label: "Tiempos de entrega estimados", slug: "terminos-y-condiciones" },
    { label: "Cambios y devoluciones", slug: "politica-devoluciones" },
    { label: "Política de garantías", slug: "condiciones-uso" },
    { label: "Derecho de retracto", slug: "politica-privacidad" },
    { label: "Información al consumidor", slug: "informacion-consumidores" }
  ],
  servicios: [
    { label: "Condiciones del servicio", slug: "condiciones-uso" },
    { label: "Política de cancelación y reprogramación", slug: "terminos-y-condiciones" },
    { label: "Política de no asistencia (no-show)", slug: "condiciones-uso" },
    { label: "Tiempos de respuesta/SLA", slug: "informacion-consumidores" },
    { label: "Tratamiento de datos para citas/formularios", slug: "politica-privacidad" }
  ],
  church: [
    { label: "Política de donaciones", slug: "terminos-y-condiciones" },
    { label: "Términos de donaciones recurrentes", slug: "terminos-y-condiciones" },
    { label: "Tratamiento de datos para comunidad y oración", slug: "politica-privacidad" },
    {
      label: "Política de uso de contenido (predicaciones, audios, testimonios)",
      slug: "condiciones-uso"
    },
    { label: "Lineamientos de comunidad", slug: "politica-cookies" }
  ]
};
function resolveVerticalFromTenant(slug) {
  switch (slug) {
    case "gastronomia":
      return "gastronomy";
    case "ecommerce":
      return "ecommerce";
    case "church":
    case "iglesias":
      return "church";
    case "servicios":
      return "servicios";
    case "dropshipping":
      return "dropshipping";
    default:
      return "ecommerce";
  }
}
function LegalsVerticals({ className, vertical: verticalProp }) {
  const page = usePage();
  const tenantSlug = page.props.currentTenant?.slug;
  const storeName = page.props.currentTenant?.name?.trim() || "la tienda";
  const vSlug = page.props.currentTenant?.vertical?.slug;
  const vertical = verticalProp ?? resolveVerticalFromTenant(vSlug);
  const lines = LINES_BY_VERTICAL[vertical];
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: cn(
        "footer-shell-legals flex w-full flex-col items-center gap-2.5 px-4 pb-6 pt-6 text-center text-slate-950",
        className
      ),
      "data-part": "legals-verticals",
      "data-vertical": vertical,
      "aria-label": "Políticas legales",
      children: [
        /* @__PURE__ */ jsx("p", { className: "w-full min-w-0 shrink-0 text-sm font-bold leading-normal", children: `Políticas de ${storeName}` }),
        /* @__PURE__ */ jsx("nav", { className: "flex w-full max-w-md flex-col items-center gap-2 text-xs font-normal leading-[14px] text-slate-950", children: lines.map(({ label, slug }) => {
          const href = tenantSlug != null && tenantSlug !== "" ? route("tenant.legal.show", { tenant: tenantSlug, slug }) : "#";
          return /* @__PURE__ */ jsx(
            Link,
            {
              href,
              className: "block w-full py-0 leading-[14px] text-slate-950 transition-colors hover:text-slate-700 hover:underline",
              children: label
            },
            `${vertical}-${slug}-${label}`
          );
        }) })
      ]
    }
  );
}
function ButtonRegisterLinkiu({ className }) {
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href: route("register.tenant"),
      "aria-label": "Hecho con Linkiu. Crea tu negocio gratis",
      className: cn(
        "inline-flex items-center justify-center gap-[5px] rounded-full border border-slate-300 px-6 py-1 text-slate-300 transition-colors hover:border-slate-200 hover:text-slate-200",
        className
      ),
      "data-name": "button_register_linkiu",
      "data-part": "button-register-linkiu",
      children: [
        /* @__PURE__ */ jsxs("p", { className: "m-0 whitespace-nowrap text-center text-xs leading-normal", children: [
          /* @__PURE__ */ jsx("span", { className: "font-normal", children: "Hecho con Linkiu" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: " | " }),
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Crea tu negocio gratis" })
        ] }),
        /* @__PURE__ */ jsx(ArrowUpRight, { className: "size-4 shrink-0", strokeWidth: 2, "aria-hidden": true })
      ]
    }
  );
}
const STATUS_CONFIG = {
  operational: {
    label: "Todos los sistemas operativos",
    icon: Server,
    className: "bg-emerald-100",
    iconClassName: "text-emerald-900"
  },
  intermittent: {
    label: "Algunos servicios intermitentes",
    icon: Server,
    className: "bg-amber-100",
    iconClassName: "text-amber-700"
  },
  interrupted: {
    label: "Servicios con interrupciones",
    icon: ServerCrash,
    className: "bg-red-100",
    iconClassName: "text-red-600"
  }
};
function BagdeOperative({ className, status = "operational" }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  const textClass = status === "operational" ? "text-emerald-900" : status === "intermittent" ? "text-amber-700" : "text-red-600";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-2 py-1",
        cfg.className,
        className
      ),
      role: "status",
      "aria-label": cfg.label,
      "data-part": "badge-operative",
      "data-status": status,
      children: [
        /* @__PURE__ */ jsx("span", { className: "relative flex size-4 shrink-0 items-center justify-center", "aria-hidden": true, children: /* @__PURE__ */ jsx(Icon, { className: cn("size-4", cfg.iconClassName), strokeWidth: 2 }) }),
        /* @__PURE__ */ jsx("p", { className: cn("text-center text-xs font-normal leading-none whitespace-nowrap", textClass), children: cfg.label })
      ]
    }
  );
}
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
const LINKIU_BASE = "https://linkiu.bio";
const LINKIU_LEGAL_LINKS = [
  { href: `${LINKIU_BASE}/politica-privacidad`, label: "Política de Privacidad" },
  { href: `${LINKIU_BASE}/politica-tratamiento-datos`, label: "Tratamiento de Datos Personales" },
  { href: `${LINKIU_BASE}/politica-cookies`, label: "Política de Cookies" },
  { href: `${LINKIU_BASE}/terminos-y-condiciones`, label: "Términos y Condiciones" },
  { href: `${LINKIU_BASE}/descargo-responsabilidad`, label: "Descargo de Responsabilidad" },
  { href: `${LINKIU_BASE}/derecho-retracto`, label: "Devoluciones y Retracto" },
  { href: `${LINKIU_BASE}/informacion-consumidores`, label: "Derechos del Consumidor" },
  { href: `${LINKIU_BASE}/transparencia`, label: "Informe de Transparencia" },
  { href: `${LINKIU_BASE}/centro-confianza`, label: "Centro de Confianza" },
  { href: `${LINKIU_BASE}/ayuda`, label: "Centro de Ayuda" }
];
function LegalsLinkiu({ className }) {
  const [reportOpen, setReportOpen] = useState(false);
  const { currentTenant } = usePage().props;
  const tenantSlug = currentTenant?.slug?.trim() ?? "";
  return /* @__PURE__ */ jsx(
    "section",
    {
      className: cn("w-full px-4 text-center", className),
      "data-part": "legals-linkiu",
      "data-name": "Legals_linkiu",
      children: /* @__PURE__ */ jsxs("nav", { className: "mx-auto flex max-w-lg flex-col items-center", "aria-label": "Legales de Linkiu", children: [
        /* @__PURE__ */ jsx("p", { className: "mb-0 text-xs font-bold leading-5 text-slate-500", children: "Legales de Linkiu" }),
        /* @__PURE__ */ jsx("p", { className: "mb-0 mt-2 text-xs leading-[14px] text-slate-500", children: LINKIU_LEGAL_LINKS.map((item, index) => /* @__PURE__ */ jsxs("span", { children: [
          index > 0 ? /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: " · " }) : null,
          /* @__PURE__ */ jsx(
            "a",
            {
              href: item.href,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-slate-500 underline-offset-2 transition-colors hover:text-slate-400 hover:underline",
              children: item.label
            }
          )
        ] }, item.href)) }),
        tenantSlug ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "mt-2 border-0 bg-transparent p-0 text-xs font-bold leading-5 text-slate-300 underline-offset-2 transition-colors hover:text-slate-200 hover:underline",
              onClick: () => setReportOpen(true),
              children: "Reportar actividad sospechosa en la tienda"
            }
          ),
          /* @__PURE__ */ jsx(ReportModal, { open: reportOpen, onOpenChange: setReportOpen, tenantSlug })
        ] }) : /* @__PURE__ */ jsx(
          "a",
          {
            href: "mailto:info@linkiu.bio?subject=Reporte%20de%20actividad%20sospechosa",
            className: "mt-2 text-xs font-bold leading-5 text-slate-300 underline-offset-2 transition-colors hover:text-slate-200 hover:underline",
            children: "Reportar actividad sospechosa la tienda"
          }
        )
      ] })
    }
  );
}
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((v - min) % rangeSize + rangeSize) % rangeSize + min;
};
const ScrollVelocityContext = React__default.createContext(
  null
);
function ScrollVelocityContainer({
  children,
  className,
  ...props
}) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, (v) => {
    const sign = v < 0 ? -1 : 1;
    const magnitude = Math.min(5, Math.abs(v) / 1e3 * 5);
    return sign * magnitude;
  });
  return /* @__PURE__ */ jsx(ScrollVelocityContext.Provider, { value: velocityFactor, children: /* @__PURE__ */ jsx("div", { className: cn("relative w-full", className), ...props, children }) });
}
function ScrollVelocityRow(props) {
  const sharedVelocityFactor = useContext(ScrollVelocityContext);
  if (sharedVelocityFactor) {
    return /* @__PURE__ */ jsx(ScrollVelocityRowImpl, { ...props, velocityFactor: sharedVelocityFactor });
  }
  return /* @__PURE__ */ jsx(ScrollVelocityRowLocal, { ...props });
}
function ScrollVelocityRowImpl({
  children,
  baseVelocity = 5,
  direction = 1,
  className,
  velocityFactor,
  scrollReactivity = true,
  ...props
}) {
  const containerRef = useRef(null);
  const blockRef = useRef(null);
  const [numCopies, setNumCopies] = useState(1);
  const baseX = useMotionValue(0);
  const baseDirectionRef = useRef(direction >= 0 ? 1 : -1);
  const currentDirectionRef = useRef(direction >= 0 ? 1 : -1);
  const unitWidth = useMotionValue(0);
  const isInViewRef = useRef(true);
  const isPageVisibleRef = useRef(true);
  const prefersReducedMotionRef = useRef(false);
  useEffect(() => {
    const container = containerRef.current;
    const block = blockRef.current;
    let ro = null;
    let io = null;
    let mq = null;
    const handleVisibility = () => {
      isPageVisibleRef.current = document.visibilityState === "visible";
    };
    const handlePRM = () => {
      if (mq) {
        prefersReducedMotionRef.current = mq.matches;
      }
    };
    if (container && block) {
      const updateSizes = () => {
        const cw = container.offsetWidth || 0;
        const bw = block.scrollWidth || 0;
        unitWidth.set(bw);
        const nextCopies = bw > 0 ? Math.max(3, Math.ceil(cw / bw) + 2) : 1;
        setNumCopies((prev) => prev === nextCopies ? prev : nextCopies);
      };
      updateSizes();
      ro = new ResizeObserver(updateSizes);
      ro.observe(container);
      ro.observe(block);
      io = new IntersectionObserver(([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      });
      io.observe(container);
      document.addEventListener("visibilitychange", handleVisibility, {
        passive: true
      });
      handleVisibility();
      mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", handlePRM);
      handlePRM();
    }
    return () => {
      if (ro) {
        ro.disconnect();
      }
      if (io) {
        io.disconnect();
      }
      document.removeEventListener("visibilitychange", handleVisibility);
      if (mq) {
        mq.removeEventListener("change", handlePRM);
      }
    };
  }, [children, unitWidth]);
  const x = useTransform([baseX, unitWidth], ([v, bw]) => {
    const width = Number(bw) || 1;
    const offset = Number(v) || 0;
    return `${-wrap(0, width, offset)}px`;
  });
  useAnimationFrame((_, delta) => {
    if (!isInViewRef.current || !isPageVisibleRef.current) return;
    const dt = delta / 1e3;
    const vf = scrollReactivity ? velocityFactor.get() : 0;
    const absVf = Math.min(5, Math.abs(vf));
    const speedMultiplier = prefersReducedMotionRef.current ? 1 : 1 + absVf;
    if (absVf > 0.1) {
      const scrollDirection = vf >= 0 ? 1 : -1;
      currentDirectionRef.current = baseDirectionRef.current * scrollDirection;
    }
    const bw = unitWidth.get() || 0;
    if (bw <= 0) return;
    const pixelsPerSecond = bw * baseVelocity / 100;
    const moveBy = currentDirectionRef.current * pixelsPerSecond * speedMultiplier * dt;
    baseX.set(baseX.get() + moveBy);
  });
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      className: cn("w-full overflow-hidden whitespace-nowrap", className),
      ...props,
      children: /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "inline-flex transform-gpu items-center will-change-transform select-none",
          style: { x },
          children: Array.from({ length: numCopies }).map((_, i) => /* @__PURE__ */ jsxs(
            "div",
            {
              ref: i === 0 ? blockRef : null,
              "aria-hidden": i !== 0,
              className: "inline-flex shrink-0 items-center",
              children: [
                children,
                /* @__PURE__ */ jsx("span", { className: "mx-1 text-inherit", "aria-hidden": true, children: "•" })
              ]
            },
            i
          ))
        }
      )
    }
  );
}
function ScrollVelocityRowLocal(props) {
  const { scrollY } = useScroll();
  const localVelocity = useVelocity(scrollY);
  const localSmoothVelocity = useSpring(localVelocity, {
    damping: 50,
    stiffness: 400
  });
  const localVelocityFactor = useTransform(localSmoothVelocity, (v) => {
    const sign = v < 0 ? -1 : 1;
    const magnitude = Math.min(5, Math.abs(v) / 1e3 * 5);
    return sign * magnitude;
  });
  return /* @__PURE__ */ jsx(ScrollVelocityRowImpl, { ...props, velocityFactor: localVelocityFactor });
}
function AprilAds$1({ className }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn("flex w-full shrink-0 flex-col items-end overflow-x-hidden", className),
      "data-part": "footer-verticals-ads-april",
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex w-full flex-col items-center justify-center overflow-hidden pt-0 pb-1", children: /* @__PURE__ */ jsxs(ScrollVelocityContainer, { className: "text-xl font-bold leading-tight tracking-tight text-slate-950 md:text-3xl [&>div]:py-0.5", children: [
          /* @__PURE__ */ jsx(ScrollVelocityRow, { baseVelocity: 4, direction: 1, children: "Imagina sin límites 🌈🧩" }),
          /* @__PURE__ */ jsx(ScrollVelocityRow, { baseVelocity: 4, direction: -1, children: "Celebramos ser niños 🎈🧸" }),
          /* @__PURE__ */ jsx(ScrollVelocityRow, { baseVelocity: 4, direction: 1, children: "La magia de jugar 🎨🪁" })
        ] }) }),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/themes/april_26/Assets_april_26_03.webp",
            alt: "",
            className: "pointer-events-none w-full max-w-72 object-contain",
            "aria-hidden": true
          }
        )
      ]
    }
  );
}
function VerticalsAds$1(props) {
  const slug = usePage().props.currentTenant?.vertical?.slug;
  switch (slug) {
    case "gastronomia":
      return /* @__PURE__ */ jsx(AprilAds$1, { ...props });
    case "ecommerce":
      return null;
    case "church":
    case "iglesias":
      return null;
    case "servicios":
      return null;
    case "dropshipping":
      return null;
    default:
      return null;
  }
}
function FooterShellAll() {
  return /* @__PURE__ */ jsxs("footer", { className: "footer-shell mt-auto w-full", "data-layout": "footer-shell", children: [
    /* @__PURE__ */ jsx(VerticalsAds$1, {}),
    /* @__PURE__ */ jsxs("div", { className: "border-t border-slate-200/80 bg-slate-100 pt-8 pb-6", children: [
      /* @__PURE__ */ jsx(Benefits, {}),
      /* @__PURE__ */ jsx(SocialMedia, {}),
      /* @__PURE__ */ jsx(Contact, {}),
      /* @__PURE__ */ jsx(LegalsVerticals, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full space-y-8 bg-slate-950 px-4 py-12 text-slate-300 pb-32", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(ButtonRegisterLinkiu, {}) }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(BagdeOperative, {}) }),
      /* @__PURE__ */ jsx(LegalsLinkiu, {})
    ] })
  ] });
}
function AprilAds({ className }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "relative min-h-[min(42vh,160px)] w-full shrink-0 pointer-events-none",
        className
      ),
      "data-part": "header-verticals-ads-april",
      style: {
        background: "linear-gradient(to bottom,rgba(161, 41, 185, 0.3),rgba(255, 255, 255, 0.06))"
      },
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/themes/april_26/Assets_april_26_01.webp",
            alt: "",
            className: "relative z-10 -mt-1 h-auto w-full object-contain",
            "aria-hidden": true
          }
        ),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/themes/april_26/Assets_april_26_02.webp",
            alt: "",
            className: "absolute right-[70px] top-[30px] z-30 h-auto w-40 object-contain will-change-transform animate-float",
            "aria-hidden": true
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "absolute left-[20px] top-[90px] z-10 inline-block origin-center will-change-transform animate-float", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "/themes/april_26/Assets_april_26_05.webp",
            alt: "",
            className: "h-auto w-48 -rotate-[22deg] object-contain animate-sparkle-glow [animation-delay:0.3s]",
            "aria-hidden": true
          }
        ) })
      ]
    }
  );
}
function VerticalsAds(props) {
  const slug = usePage().props.currentTenant?.vertical?.slug;
  switch (slug) {
    case "gastronomia":
      return /* @__PURE__ */ jsx(AprilAds, { ...props });
    case "ecommerce":
      return null;
    case "church":
    case "iglesias":
      return null;
    case "servicios":
      return null;
    case "dropshipping":
      return null;
    default:
      return null;
  }
}
function SelectSede() {
  const { currentTenant, selectedLocationName, locationsCount = 0 } = usePage().props;
  const shortsUrl = currentTenant?.slug ? route("tenant.public.shorts", currentTenant.slug) : null;
  const hasMultipleLocations = locationsCount > 1;
  if (!selectedLocationName || !shortsUrl) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href: shortsUrl,
      className: cn(
        "group flex w-full max-w-[480px] mx-auto items-center justify-center gap-[5px] rounded-lg",
        "border border-gray-400 bg-slate-100 px-2 md:px-6 py-2 mb-2",
        "text-slate-800 transition-colors hover:bg-slate-200/90"
      ),
      "data-layout": "select-sede",
      children: [
        /* @__PURE__ */ jsx("p", { className: "min-w-0 flex-1 text-center text-xs md:text-sm leading-normal font-sans", children: hasMultipleLocations ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: "font-normal", children: "Sede actual: " }),
          /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
            selectedLocationName,
            " | Toca para cambiar"
          ] })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: "font-normal", children: "Sede: " }),
          /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
            selectedLocationName,
            " | Ver promociones"
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(
          ArrowUpRight,
          {
            className: "size-4 shrink-0 text-[#1d293d] transition-transform group-hover:translate-x-px group-hover:-translate-y-px",
            strokeWidth: 2,
            "aria-hidden": true
          }
        )
      ]
    }
  );
}
const VERIFIED_BADGE_SRC = "/header-shell-all/insign_verified_Linkiu_Success.svg";
function VerifiedInsightIcon() {
  return /* @__PURE__ */ jsx("span", { className: "inline-flex shrink-0", role: "img", "aria-label": "Negocio verificado en Linkiu", children: /* @__PURE__ */ jsx("img", { src: VERIFIED_BADGE_SRC, alt: "", width: 16, height: 16, className: "size-4 object-contain" }) });
}
function Hero() {
  const { currentTenant } = usePage().props;
  const name = currentTenant?.name?.trim() ?? "";
  const logoUrl = currentTenant?.logo_url;
  const description = currentTenant?.store_description?.trim() ?? "";
  if (!name) {
    return null;
  }
  const logoSrc = logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "w-full rounded-lg bg-slate-950 p-6 flex flex-row gap-6 items-center justify-center",
      "data-layout": "hero-frontend-linkiu",
      "data-name": "Hero_frontend_linkiu",
      children: [
        /* @__PURE__ */ jsx("div", { className: "shrink-0 size-16 rounded-full border-2 border-blue-50 overflow-hidden bg-white", children: /* @__PURE__ */ jsx("img", { src: logoSrc, alt: "", className: "size-full object-cover", width: 64, height: 64 }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 flex flex-col gap-1 items-start", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex w-full min-w-0 items-center gap-2", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-slate-50 leading-none truncate font-sans", children: name }),
            /* @__PURE__ */ jsx(VerifiedInsightIcon, {})
          ] }),
          description ? /* @__PURE__ */ jsx("p", { className: "w-full text-xs font-normal text-slate-50 leading-snug font-sans line-clamp-2", children: description }) : null
        ] })
      ]
    }
  );
}
const MENU_GASTRONOMY = [
  { id: "locations", label: "Sedes", icon: Store, routeName: "tenant.public.locations", activeRouteNames: ["tenant.public.shorts"] },
  {
    id: "menu",
    label: "Menú",
    icon: UtensilsCrossed,
    routeName: "tenant.menu",
    activeRouteNames: ["tenant.menu.category"]
  },
  { id: "home", label: "Inicio", icon: Home, routeName: "tenant.home" },
  { id: "reservations", label: "Reservas", icon: CalendarHeart, routeName: "tenant.reservations.index" },
  { id: "favorites", label: "Favoritos", icon: Heart, routeName: "tenant.favorites" }
];
const MENU_CHURCH = [
  { id: "locations", label: "Sedes", icon: Building2, routeName: "tenant.public.locations" },
  { id: "services", label: "Servicios", icon: CalendarHeart, routeName: "tenant.public.services" },
  { id: "home", label: "Inicio", icon: Home, routeName: "tenant.home" },
  { id: "podcast", label: "Audios", icon: Headphones, routeName: "tenant.public.podcast" },
  { id: "donations", label: "Donar", icon: HandHeart, routeName: "tenant.public.donations" }
];
const MENU_MINIMAL = [
  { id: "home", label: "Inicio", icon: Home, routeName: "tenant.home" },
  { id: "locations", label: "Sedes", icon: Store, routeName: "tenant.public.locations", activeRouteNames: ["tenant.public.shorts"] }
];
function getMenuForVertical(slug) {
  switch (slug) {
    case "gastronomia":
      return MENU_GASTRONOMY;
    case "church":
      return MENU_CHURCH;
    default:
      return slug ? MENU_MINIMAL : null;
  }
}
function resolveActiveItemId(currentRoute, items) {
  for (const item of items) {
    if (item.routeName === currentRoute) {
      return item.id;
    }
    if (item.activeRouteNames?.includes(currentRoute ?? "")) {
      return item.id;
    }
  }
  if (currentRoute?.startsWith("tenant.menu")) {
    const menuItem = items.find((i) => i.id === "menu");
    if (menuItem) return menuItem.id;
  }
  const homeItem = items.find((i) => i.id === "home");
  return homeItem?.id ?? items[0]?.id ?? "home";
}
function MenuVerticals() {
  const { currentTenant } = usePage().props;
  const verticalSlug = currentTenant?.vertical?.slug;
  const tenantSlug = currentTenant?.slug;
  const items = useMemo(() => getMenuForVertical(verticalSlug), [verticalSlug]);
  const currentRoute = route().current();
  const [activeId, setActiveId] = useState(
    () => items ? resolveActiveItemId(currentRoute, items) : "home"
  );
  useEffect(() => {
    if (items) {
      setActiveId(resolveActiveItemId(currentRoute, items));
    }
  }, [currentRoute, items]);
  if (!items || !tenantSlug) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "nav",
    {
      className: "flex w-full max-w-[348px] mx-auto flex-row items-center justify-center gap-2 md:gap-6 px-1 py-2 mt-2",
      "aria-label": "Navegación principal",
      "data-layout": "menu-verticals",
      children: items.map((item) => {
        const href = route(item.routeName, tenantSlug);
        const isActive = activeId === item.id;
        const Icon = item.icon;
        return /* @__PURE__ */ jsxs(
          Link,
          {
            href,
            className: cn(
              "flex min-w-[56px] w-19 shrink-0 flex-col items-center justify-center gap-1 rounded-lg p-2 transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
              isActive ? "bg-slate-950" : "bg-transparent"
            ),
            "aria-current": isActive ? "page" : void 0,
            children: [
              /* @__PURE__ */ jsx(
                Icon,
                {
                  className: cn("size-6 shrink-0", isActive ? "text-slate-100" : "text-slate-500"),
                  strokeWidth: 2,
                  "aria-hidden": true
                }
              ),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: cn(
                    "max-w-[56px] text-center text-xs md:text-sm font-normal leading-none whitespace-nowrap",
                    isActive ? "text-slate-100" : "text-slate-500"
                  ),
                  children: item.label
                }
              )
            ]
          },
          item.id
        );
      })
    }
  );
}
function variantFromMessage(message) {
  const lower = message.toLowerCase();
  if (lower.includes("cerrado")) {
    return "closed";
  }
  return "open";
}
function OpeningHours() {
  const { location_status_message, currentTenant } = usePage().props;
  const verticalSlug = currentTenant?.vertical?.slug;
  if (!location_status_message || verticalSlug !== "gastronomia") {
    return null;
  }
  const variant = variantFromMessage(location_status_message);
  return /* @__PURE__ */ jsx("div", { className: "flex w-full justify-center mt-2", "data-opening-hours-wrap": true, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "inline-flex w-fit max-w-full items-center justify-center gap-2 rounded-full px-2 py-1 font-sans",
        variant === "open" && "bg-emerald-200 text-emerald-900",
        variant === "closed" && "bg-red-200 text-red-600"
      ),
      "data-layout": "opening-hours",
      role: "status",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ jsx(Clock, { className: "size-4 shrink-0", strokeWidth: 2, "aria-hidden": true }),
        /* @__PURE__ */ jsx("p", { className: "text-center text-xs font-normal leading-tight", children: location_status_message })
      ]
    }
  ) });
}
function HeaderShellAll() {
  return /* @__PURE__ */ jsxs("header", { className: "header-shell pb-8", "data-layout": "header-shell", children: [
    /* @__PURE__ */ jsx(VerticalsAds, {}),
    /* @__PURE__ */ jsxs("div", { className: "relative z-20 w-full shrink-0 px-4 pt-2 pointer-events-auto", children: [
      /* @__PURE__ */ jsx(SelectSede, {}),
      /* @__PURE__ */ jsx(Hero, {}),
      /* @__PURE__ */ jsx(MenuVerticals, {}),
      /* @__PURE__ */ jsx(OpeningHours, {})
    ] })
  ] });
}
export {
  FooterShellAll as F,
  HeaderShellAll as H,
  PublicLayoutPortalContext as P,
  usePublicLayoutPortal as u
};
