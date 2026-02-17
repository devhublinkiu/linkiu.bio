import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { S as SuperAdminLayout } from "./SuperAdminLayout-C_fBwscp.js";
import { usePage, useForm, Head } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, e as CardFooter } from "./card-BaovBWX5.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-B4HNlFNZ.js";
import { S as Separator } from "./separator-DbxqJzR0.js";
import { A as Alert, a as AlertDescription } from "./alert-NB8JTTvo.js";
import { F as FieldError } from "./field-BEfz_npx.js";
import { Image, Globe, Upload, Mail, Facebook, Instagram, Twitter, CreditCard, Info } from "lucide-react";
import { P as PermissionDeniedModal } from "./dropdown-menu-B2I3vWlQ.js";
import "sonner";
import "./ApplicationLogo-xMpxFOcX.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "radix-ui";
import "@radix-ui/react-separator";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./sheet-BclLUCFD.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
function Index({ settings, logo_url, favicon_url }) {
  const { auth } = usePage().props;
  const permissions = auth.permissions || [];
  const isSuperAdminEnv = auth.user?.is_super_admin || permissions.some((p) => p.startsWith("sa.")) && !auth.user?.tenant_id;
  const canUpdate = !isSuperAdminEnv || permissions.includes("*") || permissions.includes("sa.settings.update");
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    app_name: settings.app_name || "",
    support_email: settings.support_email || "",
    facebook_url: settings.facebook_url || "",
    instagram_url: settings.instagram_url || "",
    twitter_url: settings.twitter_url || "",
    meta_title: settings.meta_title || "",
    meta_description: settings.meta_description || "",
    bank_name: settings.bank_name || "",
    bank_account_type: settings.bank_account_type || "",
    bank_account_number: settings.bank_account_number || "",
    bank_account_holder: settings.bank_account_holder || "",
    bank_account_nit: settings.bank_account_nit || "",
    logo: null,
    favicon: null,
    profile_photo: null,
    profile_photo_preview: null
  });
  const [logoPreview, setLogoPreview] = useState(logo_url);
  const [faviconPreview, setFaviconPreview] = useState(favicon_url);
  useEffect(() => {
    setLogoPreview(logo_url);
    setFaviconPreview(favicon_url);
    setData({
      ...data,
      app_name: settings.app_name || "",
      support_email: settings.support_email || "",
      facebook_url: settings.facebook_url || "",
      instagram_url: settings.instagram_url || "",
      twitter_url: settings.twitter_url || "",
      meta_title: settings.meta_title || "",
      meta_description: settings.meta_description || "",
      bank_name: settings.bank_name || "",
      bank_account_type: settings.bank_account_type || "",
      bank_account_number: settings.bank_account_number || "",
      bank_account_holder: settings.bank_account_holder || "",
      bank_account_nit: settings.bank_account_nit || ""
    });
  }, [settings, logo_url, favicon_url]);
  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      setData(field, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === "logo") setLogoPreview(reader.result);
        if (field === "favicon") setFaviconPreview(reader.result);
        if (field === "profile_photo") setData("profile_photo_preview", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFileClick = (e) => {
    if (!canUpdate) {
      e.preventDefault();
      setShowPermissionModal(true);
    }
  };
  const submit = (e) => {
    e.preventDefault();
    if (!canUpdate) {
      setShowPermissionModal(true);
      return;
    }
    post(route("settings.update"), {
      forceFormData: true
    });
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: "Configuración General", children: [
    /* @__PURE__ */ jsx(Head, { title: "Configuración" }),
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto py-6", children: /* @__PURE__ */ jsx("form", { onSubmit: submit, children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "general", className: "w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "general", children: "Identidad" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "contact", children: "Contacto y Redes" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "billing", children: "Facturación" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "seo", children: "SEO Global" })
      ] }) }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "general", className: "space-y-6", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Identidad de Marca" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Configura los elementos visuales clave de tu plataforma." })
          ] }) }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-3 max-w-md", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "app_name", children: "Nombre del Aplicativo" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "app_name",
                  value: data.app_name,
                  onChange: (e) => setData("app_name", e.target.value),
                  required: true,
                  placeholder: "Ej. Mi Plataforma SaaS"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-[0.8rem] text-muted-foreground", children: "Este nombre aparecerá en títulos y correos electrónicos." }),
              /* @__PURE__ */ jsx(FieldError, { children: errors.app_name })
            ] }),
            /* @__PURE__ */ jsx(Separator, {}),
            /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx(Label, { children: "Logo Principal" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 p-4 border border-dashed rounded-lg bg-muted/50 hover:bg-muted transition-colors relative group", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-16 w-16 flex-shrink-0 bg-background border rounded-md shadow-sm flex items-center justify-center p-1 overflow-hidden pointer-events-none", children: logoPreview ? /* @__PURE__ */ jsx("img", { src: logoPreview, className: "w-full h-full object-contain", alt: "Logo" }) : /* @__PURE__ */ jsx(Image, { className: "h-6 w-6 text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: "Subir imagen" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Recomendado: SVG o PNG transparente.",
                      /* @__PURE__ */ jsx("br", {}),
                      "Máx. 2MB."
                    ] }),
                    /* @__PURE__ */ jsx(FieldError, { className: "mt-1", children: errors.logo })
                  ] }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "file",
                      accept: "image/*",
                      onClick: handleFileClick,
                      onChange: (e) => handleFileChange(e, "logo"),
                      className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx(Label, { children: "Favicon" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 p-4 border border-dashed rounded-lg bg-muted/50 hover:bg-muted transition-colors relative group", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-16 w-16 flex-shrink-0 bg-background border rounded-md shadow-sm flex items-center justify-center p-3 overflow-hidden pointer-events-none", children: faviconPreview ? /* @__PURE__ */ jsx("img", { src: faviconPreview, className: "w-full h-full object-contain", alt: "Favicon" }) : /* @__PURE__ */ jsx(Globe, { className: "h-6 w-6 text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: "Subir icono" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Visible en la pestaña del navegador.",
                      /* @__PURE__ */ jsx("br", {}),
                      "ICO, PNG o SVG."
                    ] }),
                    /* @__PURE__ */ jsx(FieldError, { className: "mt-1", children: errors.favicon })
                  ] }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "file",
                      accept: "image/x-icon,image/png,image/svg+xml",
                      onClick: handleFileClick,
                      onChange: (e) => handleFileChange(e, "favicon"),
                      className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    }
                  )
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(CardFooter, { children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? "Guardando..." : "Guardar Cambios" }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Tu Perfil" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Personaliza cómo te ven otros usuarios y el sistema." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx("div", { className: "h-24 w-24 rounded-full overflow-hidden border-2 border-background shadow-md bg-muted flex-shrink-0", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: data.profile_photo_preview || usePage().props.auth.user.profile_photo_url || `https://ui-avatars.com/api/?name=${usePage().props.auth.user.name}&background=0D8ABC&color=fff`,
                  alt: "Profile",
                  className: "h-full w-full object-cover transition-transform group-hover:scale-105"
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-1 right-1 h-5 w-5 bg-green-500 border-2 border-background rounded-full" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-base font-medium leading-none", children: usePage().props.auth.user.name }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: usePage().props.auth.user.email })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden", children: [
                  /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-2 relative pointer-events-none", children: [
                    /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }),
                    "Cambiar Foto"
                  ] }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "file",
                      accept: "image/*",
                      onClick: handleFileClick,
                      onChange: (e) => handleFileChange(e, "profile_photo"),
                      className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "JPG, PNG o WebP. Máx 2MB." })
              ] }),
              errors.profile_photo && /* @__PURE__ */ jsx(FieldError, { children: errors.profile_photo })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(CardFooter, { children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? "Guardando..." : "Guardar Cambios" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "contact", className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Contacto y Redes Sociales" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Enlaces visibles en el footer y correos del sistema." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "support_email", children: "Email de Soporte" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Mail, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(Input, { id: "support_email", type: "email", className: "pl-9", placeholder: "support@linkiu.bio", value: data.support_email, onChange: (e) => setData("support_email", e.target.value) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "facebook", children: "Facebook URL" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Facebook, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(Input, { id: "facebook", className: "pl-9", placeholder: "https://facebook.com/...", value: data.facebook_url, onChange: (e) => setData("facebook_url", e.target.value) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "instagram", children: "Instagram URL" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Instagram, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(Input, { id: "instagram", className: "pl-9", placeholder: "https://instagram.com/...", value: data.instagram_url, onChange: (e) => setData("instagram_url", e.target.value) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "twitter", children: "Twitter / X URL" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Twitter, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(Input, { id: "twitter", className: "pl-9", placeholder: "https://x.com/...", value: data.twitter_url, onChange: (e) => setData("twitter_url", e.target.value) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardFooter, { children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? "Guardando..." : "Guardar Cambios" }) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "seo", className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "SEO Global" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Metadatos por defecto para compartir en redes." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "meta_title", children: "Meta Título (Default)" }),
            /* @__PURE__ */ jsx(Input, { id: "meta_title", value: data.meta_title, onChange: (e) => setData("meta_title", e.target.value), maxLength: 60 }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
              data.meta_title.length,
              "/60"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "meta_description", children: "Meta Descripción (Default)" }),
            /* @__PURE__ */ jsx(Input, { id: "meta_description", value: data.meta_description, onChange: (e) => setData("meta_description", e.target.value), maxLength: 160 }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
              data.meta_description.length,
              "/160"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardFooter, { children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? "Guardando..." : "Guardar Cambios" }) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "billing", className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Datos de Recaudo" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Información bancaria para pagos manuales de los inquilinos." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "bank_name", children: "Nombre del Banco" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(CreditCard, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(Input, { id: "bank_name", className: "pl-9", placeholder: "Ej. Bancolombia", value: data.bank_name, onChange: (e) => setData("bank_name", e.target.value) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "bank_account_type", children: "Tipo de Cuenta" }),
              /* @__PURE__ */ jsx(Input, { id: "bank_account_type", placeholder: "Ej. Ahorros", value: data.bank_account_type, onChange: (e) => setData("bank_account_type", e.target.value) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "bank_account_number", children: "Número de Cuenta" }),
              /* @__PURE__ */ jsx(Input, { id: "bank_account_number", placeholder: "000-000-000-00", value: data.bank_account_number, onChange: (e) => setData("bank_account_number", e.target.value) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "bank_account_nit", children: "NIT / Cédula" }),
              /* @__PURE__ */ jsx(Input, { id: "bank_account_nit", placeholder: "900.000.000-0", value: data.bank_account_nit, onChange: (e) => setData("bank_account_nit", e.target.value) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "bank_account_holder", children: "Titular de la Cuenta" }),
            /* @__PURE__ */ jsx(Input, { id: "bank_account_holder", placeholder: "Nombre completo o Razón Social", value: data.bank_account_holder, onChange: (e) => setData("bank_account_holder", e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs(Alert, { children: [
            /* @__PURE__ */ jsx(Info, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx(AlertDescription, { children: "Estos datos aparecerán automáticamente en la tarjeta de suscripción del panel de inquilinos cuando su plan esté por vencer." })
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardFooter, { children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? "Guardando..." : "Guardar Cambios" }) })
      ] }) })
    ] }) }) })
  ] });
}
export {
  Index as default
};
