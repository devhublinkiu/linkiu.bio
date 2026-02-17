import { jsxs, jsx } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-C8hB-Nb-.js";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, e as CardFooter } from "./card-BaovBWX5.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-B4HNlFNZ.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { A as Accordion, a as AccordionItem, b as AccordionTrigger, c as AccordionContent } from "./accordion-YG9U3R8-.js";
import { useRef, useEffect, useCallback, useState } from "react";
import { c as cn } from "./utils-B0hQsrDj.js";
import { Bold, Italic, List, ListOrdered, Palette, Search, Zap, Gavel, Save, Image, Upload, Type, PenTool, ShieldAlert, Code } from "lucide-react";
import { toast } from "sonner";
import { P as PermissionDeniedModal } from "./dropdown-menu-B2I3vWlQ.js";
import { A as Alert, b as AlertTitle, a as AlertDescription } from "./alert-NB8JTTvo.js";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-rtCrEhXP.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sonner-ZUDSQr7N.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
import "radix-ui";
import "@radix-ui/react-switch";
import "@radix-ui/react-accordion";
import "clsx";
import "tailwind-merge";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./sheet-BclLUCFD.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
function RichTextEditor({
  value,
  onChange,
  placeholder = "Escribe aquí...",
  className,
  disabled,
  minHeight = "200px"
}) {
  const ref = useRef(null);
  const isInternal = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.innerHTML !== value && !isInternal.current) {
      el.innerHTML = value || "";
    }
  }, [value]);
  const handleInput = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    isInternal.current = true;
    onChange(el.innerHTML);
    isInternal.current = false;
  }, [onChange]);
  const exec = useCallback((cmd, value2) => {
    document.execCommand(cmd, false, value2);
    ref.current?.focus();
    handleInput();
  }, [handleInput]);
  return /* @__PURE__ */ jsxs("div", { className: cn("rounded-lg border border-input bg-background", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 border-b border-input p-1", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          className: "h-8 w-8 p-0",
          onClick: () => exec("bold"),
          disabled,
          title: "Negrita",
          children: /* @__PURE__ */ jsx(Bold, { className: "size-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          className: "h-8 w-8 p-0",
          onClick: () => exec("italic"),
          disabled,
          title: "Cursiva",
          children: /* @__PURE__ */ jsx(Italic, { className: "size-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          className: "h-8 w-8 p-0",
          onClick: () => exec("insertUnorderedList"),
          disabled,
          title: "Lista con viñetas",
          children: /* @__PURE__ */ jsx(List, { className: "size-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          className: "h-8 w-8 p-0",
          onClick: () => exec("insertOrderedList"),
          disabled,
          title: "Lista numerada",
          children: /* @__PURE__ */ jsx(ListOrdered, { className: "size-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        contentEditable: !disabled,
        "data-placeholder": placeholder,
        className: cn(
          "min-w-0 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground",
          disabled && "cursor-not-allowed opacity-60"
        ),
        style: { minHeight },
        onInput: handleInput,
        suppressContentEditableWarning: true
      }
    )
  ] });
}
function Edit({ tenantSettings, tenant, slugChangePrice, legalPages = [] }) {
  const { currentUserRole } = usePage().props;
  const canUpdate = currentUserRole?.is_owner || currentUserRole?.permissions?.includes("*") || currentUserRole?.permissions?.includes("settings.update");
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);
  const [legalDraft, setLegalDraft] = useState(
    () => Object.fromEntries((legalPages || []).map((p) => [p.slug, p.content ?? ""]))
  );
  const [legalSaving, setLegalSaving] = useState(null);
  useEffect(() => {
    if (legalPages?.length) {
      setLegalDraft((prev) => ({
        ...prev,
        ...Object.fromEntries(legalPages.map((p) => [p.slug, p.content ?? ""]))
      }));
    }
  }, [legalPages]);
  const saveLegalPage = (slug) => {
    if (!canUpdate) return;
    setLegalSaving(slug);
    router.visit(route("tenant.settings.legal-pages.update", { tenant: tenant.slug }), {
      method: "post",
      data: { slug, content: legalDraft[slug] ?? "" },
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Contenido legal guardado");
        setLegalSaving(null);
      },
      onError: () => {
        setLegalSaving(null);
        toast.error("Error al guardar");
      }
    });
  };
  const checkPermissionAndExecute = (action) => {
    if (canUpdate) {
      action();
    } else {
      setShowPermissionModal(true);
    }
  };
  const { data, setData, patch, processing, errors } = useForm({
    store_name: tenantSettings.store_name || tenant.name,
    slug: tenant.slug || "",
    store_description: tenantSettings.store_description || "",
    bg_color: tenantSettings.bg_color || "#ffffff",
    name_color: tenantSettings.name_color || "#0f172a",
    description_color: tenantSettings.description_color || "#64748b",
    meta_title: tenantSettings.meta_title || "",
    meta_description: tenantSettings.meta_description || "",
    meta_keywords: tenantSettings.meta_keywords || "",
    maintenance_mode: !!tenantSettings.maintenance_mode,
    facebook_pixel_id: tenantSettings.facebook_pixel_id || "",
    google_analytics_id: tenantSettings.google_analytics_id || "",
    tiktok_pixel_id: tenantSettings.tiktok_pixel_id || "",
    // Tax Settings
    tax_name: tenantSettings.tax_name || "IVA",
    tax_rate: tenantSettings.tax_rate || 0,
    price_includes_tax: !!tenantSettings.price_includes_tax
  });
  const submitSettings = (e) => {
    e.preventDefault();
    checkPermissionAndExecute(() => {
      patch(route("tenant.settings.update", { tenant: tenant.slug }), {
        onSuccess: () => toast.success("Configuración guardada"),
        onError: () => toast.error("Error al guardar la configuración")
      });
    });
  };
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      checkPermissionAndExecute(() => {
        router.post(route("tenant.settings.logo.update", { tenant: tenant.slug }), { logo: file }, {
          onSuccess: () => toast.success("Logo actualizado"),
          onError: () => toast.error("Error al actualizar el logo"),
          preserveScroll: true
        });
      });
    }
  };
  const handleFaviconChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      checkPermissionAndExecute(() => {
        router.post(route("tenant.settings.favicon.update", { tenant: tenant.slug }), { favicon: file }, {
          onSuccess: () => toast.success("Favicon actualizado"),
          onError: () => toast.error("Error al actualizar el favicon"),
          preserveScroll: true
        });
      });
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Configuración", children: [
    /* @__PURE__ */ jsx(Head, { title: "Configuración - Linkiu.Bio" }),
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal,
        title: "Acción Denegada",
        description: "No tienes permisos para modificar la configuración de la tienda. Contacta al el administrador para solicitar acceso."
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "file",
        ref: logoInputRef,
        className: "hidden",
        accept: "image/*",
        onChange: handleLogoChange
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "file",
        ref: faviconInputRef,
        className: "hidden",
        accept: "image/*",
        onChange: handleFaviconChange
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto py-8 px-4", children: /* @__PURE__ */ jsx("form", { onSubmit: submitSettings, children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "brand", className: "w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8", children: [
        /* @__PURE__ */ jsxs(TabsList, { children: [
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "brand", children: [
            /* @__PURE__ */ jsx(Palette, { className: "mr-2" }),
            "Identidad"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "seo", children: [
            /* @__PURE__ */ jsx(Search, { className: "mr-2" }),
            "SEO"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "integrations", children: [
            /* @__PURE__ */ jsx(Zap, { className: "mr-2" }),
            "Integraciones"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "legal", children: [
            /* @__PURE__ */ jsx(Gavel, { className: "mr-2" }),
            "Legal e Impuestos"
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Button, { disabled: processing, className: "px-8 cursor-pointer", children: [
          /* @__PURE__ */ jsx(Save, {}),
          "Guardar Todo"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "brand", className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Logo y Favicon" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Sube las imágenes que representarán tu marca." })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-8", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2 w-full max-w-xs", children: [
                /* @__PURE__ */ jsx(Label, { children: "Logo Principal" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "size-16 rounded border bg-muted/50 flex items-center justify-center overflow-hidden", children: tenant.logo_url ? /* @__PURE__ */ jsx("img", { src: tenant.logo_url, alt: "Logo", className: "w-full h-full object-contain p-2" }) : /* @__PURE__ */ jsx(Image, { className: "size-6 text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "cursor-pointer",
                      onClick: () => checkPermissionAndExecute(() => logoInputRef.current?.click()),
                      children: [
                        /* @__PURE__ */ jsx(Upload, {}),
                        " Cambiar Logo"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-bold", children: "Recomendado: (PNG/SVG)" })
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2 w-full max-w-xs", children: [
                /* @__PURE__ */ jsx(Label, { children: "Favicon" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "size-10 rounded border bg-muted/50 flex items-center justify-center overflow-hidden", children: tenantSettings.favicon_url ? /* @__PURE__ */ jsx("img", { src: tenantSettings.favicon_url, alt: "Favicon", className: "w-full h-full object-contain p-2" }) : /* @__PURE__ */ jsx(Image, { className: "size-4 text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "cursor-pointer",
                      onClick: () => checkPermissionAndExecute(() => faviconInputRef.current?.click()),
                      children: [
                        /* @__PURE__ */ jsx(Upload, {}),
                        " Cambiar Favicon"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-bold", children: "Icono de pestaña (32x32px)" })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Información de la Tienda" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Datos básicos y URL de tu página." })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Nombre de la Tienda" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: data.store_name,
                    onChange: (e) => setData("store_name", e.target.value),
                    placeholder: "Nombre visible",
                    disabled: !canUpdate
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx(Label, { children: "URL Personalizada (linkiu.bio/tu-url)" }),
                  tenant.slug_changes_count === 0 ? /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-[9px] uppercase tracking-wider", children: "Primero Gratis" }) : /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[9px] uppercase tracking-wider", children: "Cambio con Costo" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-sm", children: "linkiu.bio/" }) }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      value: data.slug,
                      onChange: (e) => setData("slug", e.target.value),
                      className: "pl-[78px]",
                      placeholder: "tu-negocio",
                      disabled: !canUpdate
                    }
                  )
                ] }) }),
                errors.slug && /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-destructive", children: errors.slug }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground font-medium", children: tenant.slug_changes_count === 0 ? "Tu primer cambio de URL es gratuito. Luego tendrá un costo." : `El cambio de URL tiene un costo de $${new Intl.NumberFormat("es-CO").format(usePage().props.slugChangePrice)} y se permite cada 3 meses.` })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Descripción Corta (Max 60)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: data.store_description,
                    onChange: (e) => setData("store_description", e.target.value),
                    maxLength: 60,
                    placeholder: "Una breve frase sobre tu negocio",
                    disabled: !canUpdate
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Colores de Marca" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Define la paleta cromática de tu página pública." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-4 h-4 rounded-full border", style: { backgroundColor: data.bg_color } }),
                  "Fondo"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono text-muted-foreground uppercase", children: data.bg_color })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "color",
                  value: data.bg_color,
                  onChange: (e) => setData("bg_color", e.target.value),
                  className: "h-10 p-1 cursor-pointer",
                  disabled: !canUpdate
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Type, { className: "w-4 h-4", style: { color: data.name_color } }),
                  "Nombre"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono text-muted-foreground uppercase", children: data.name_color })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "color",
                  value: data.name_color,
                  onChange: (e) => setData("name_color", e.target.value),
                  className: "h-10 p-1 cursor-pointer",
                  disabled: !canUpdate
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(PenTool, { className: "w-4 h-4", style: { color: data.description_color } }),
                  "Descripción"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono text-muted-foreground uppercase", children: data.description_color })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "color",
                  value: data.description_color,
                  onChange: (e) => setData("description_color", e.target.value),
                  className: "h-10 p-1 cursor-pointer",
                  disabled: !canUpdate
                }
              )
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "seo", className: "space-y-6", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "SEO y Meta Tags" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Configura cómo se verá tu tienda en Google y redes sociales." })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Meta Título" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: data.meta_title,
                  onChange: (e) => setData("meta_title", e.target.value),
                  placeholder: "Ej: Tienda de Ropa Online | MiMarca",
                  disabled: !canUpdate
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Meta Descripción" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: data.meta_description,
                  onChange: (e) => setData("meta_description", e.target.value),
                  className: "w-full flex min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  placeholder: "Describe tu tienda para los resultados de búsqueda...",
                  disabled: !canUpdate
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Palabras Clave (Separadas por coma)" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: data.meta_keywords,
                  onChange: (e) => setData("meta_keywords", e.target.value),
                  placeholder: "ropa, moda, estilo, bio-link",
                  disabled: !canUpdate
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Alert, { variant: "destructive", children: [
          /* @__PURE__ */ jsx(ShieldAlert, { className: "size-4" }),
          /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(AlertTitle, { children: "Modo Mantenimiento" }),
              /* @__PURE__ */ jsx(AlertDescription, { children: "Tu tienda no será visible públicamente mientras esto esté activo." })
            ] }),
            /* @__PURE__ */ jsx(
              Switch,
              {
                className: "cursor-pointer",
                checked: data.maintenance_mode,
                onCheckedChange: (checked) => setData("maintenance_mode", checked),
                disabled: !canUpdate
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "integrations", className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Analítica y Píxeles" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Mide el rendimiento de tus campañas y el tráfico de tu tienda." })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Code, { className: "w-4 h-4 text-blue-600" }),
              "Facebook Pixel ID"
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: data.facebook_pixel_id,
                onChange: (e) => setData("facebook_pixel_id", e.target.value),
                placeholder: "Ej: 123456789012345",
                disabled: !canUpdate
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Code, { className: "w-4 h-4 text-green-600" }),
              "Google Analytics ID (GA4)"
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: data.google_analytics_id,
                onChange: (e) => setData("google_analytics_id", e.target.value),
                placeholder: "Ej: G-XXXXXXXXXX",
                disabled: !canUpdate
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Code, { className: "w-4 h-4 text-black" }),
              "TikTok Pixel ID"
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: data.tiktok_pixel_id,
                onChange: (e) => setData("tiktok_pixel_id", e.target.value),
                placeholder: "Ej: CXXXXXXXXXXXXXXXXX",
                disabled: !canUpdate
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(CardFooter, { className: "bg-muted/30 flex items-center gap-3 p-4 border-t rounded-b-xl", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-primary/10 text-primary rounded-full", children: /* @__PURE__ */ jsx(Zap, { className: "size-4" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Implementar estos píxeles te permitirá hacer anuncios más inteligentes y conocer mejor a tu audiencia." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "legal", className: "space-y-6", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Impuestos y Facturación" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Configura los impuestos aplicables a tus productos." })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx(Label, { children: "Nombre del Impuesto" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: data.tax_name,
                    onChange: (e) => setData("tax_name", e.target.value),
                    placeholder: "Ej: IVA, Impoconsumo",
                    disabled: !canUpdate
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Nombre que aparecerá en el recibo y checkout." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx(Label, { children: "Tarifa (%)" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "number",
                      value: data.tax_rate,
                      onChange: (e) => setData("tax_rate", parseFloat(e.target.value)),
                      placeholder: "0",
                      min: 0,
                      max: 100,
                      step: 0.01,
                      disabled: !canUpdate,
                      className: "pr-8"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: "%" })
                ] }),
                errors.tax_rate && /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-destructive", children: errors.tax_rate }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Porcentaje global aplicado a todos los productos (a menos que se anule por producto)." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg bg-slate-50", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx(Label, { className: "text-base", children: "Precios incluyen Impuesto" }),
                /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground space-y-1", children: [
                  /* @__PURE__ */ jsx("p", { children: "Define si tus precios de venta ya incluyen el impuesto." }),
                  /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside text-xs", children: [
                    /* @__PURE__ */ jsxs("li", { children: [
                      /* @__PURE__ */ jsx("strong", { children: "Activado:" }),
                      " El precio ingresado es el precio final (Impuesto incluido)."
                    ] }),
                    /* @__PURE__ */ jsxs("li", { children: [
                      /* @__PURE__ */ jsx("strong", { children: "Desactivado:" }),
                      " El impuesto se sumará al precio ingresado en el checkout."
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                Switch,
                {
                  checked: data.price_includes_tax,
                  onCheckedChange: (checked) => setData("price_includes_tax", checked),
                  disabled: !canUpdate
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Gavel, { className: "size-5" }),
              "Páginas legales"
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Textos legales que se muestran en el footer. Cada uno tiene su vista pública individual." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, className: "w-full", children: (legalPages || []).map((page) => /* @__PURE__ */ jsxs(AccordionItem, { value: page.slug, children: [
            /* @__PURE__ */ jsx(AccordionTrigger, { children: page.title }),
            /* @__PURE__ */ jsx(AccordionContent, { className: "pt-2", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx(
                RichTextEditor,
                {
                  value: legalDraft[page.slug] ?? "",
                  onChange: (html) => setLegalDraft((prev) => ({ ...prev, [page.slug]: html })),
                  placeholder: `Redacta el contenido de "${page.title}"…`,
                  disabled: !canUpdate,
                  minHeight: "240px"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  disabled: !canUpdate || legalSaving === page.slug,
                  onClick: () => saveLegalPage(page.slug),
                  children: legalSaving === page.slug ? "Guardando…" : "Guardar esta página"
                }
              )
            ] }) })
          ] }, page.slug)) }) })
        ] })
      ] })
    ] }) }) })
  ] });
}
export {
  Edit as default
};
