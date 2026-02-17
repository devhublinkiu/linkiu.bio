import { jsxs, jsx } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-CvP9QKT2.js";
import { usePage, useForm, Head } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, e as CardFooter } from "./card-BaovBWX5.js";
import { MessageCircle, ShieldCheck, ShieldAlert, AlertCircle, Smartphone, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { A as Alert, b as AlertTitle, a as AlertDescription } from "./alert-NB8JTTvo.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { P as PermissionDeniedModal } from "./dropdown-menu-BCxMx_rd.js";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-rtCrEhXP.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./sheet-DFnQxYfh.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
function Settings({ settings, hasFeature, tenant }) {
  const { currentUserRole } = usePage().props;
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const { data, setData, patch, processing, errors } = useForm({
    whatsapp_admin_phone: settings.whatsapp_admin_phone || ""
  });
  const checkPermission = (permission) => {
    if (!currentUserRole) return false;
    if (currentUserRole.is_owner) return true;
    return currentUserRole.permissions.includes("*") || currentUserRole.permissions.includes(permission);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkPermission("whatsapp.update")) {
      setShowPermissionModal(true);
      return;
    }
    patch(route("tenant.whatsapp.update", { tenant: tenant.slug }), {
      onSuccess: () => toast.success("Configuración guardada correctamente"),
      onError: () => toast.error("Error al guardar la configuración")
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Notificaciones WhatsApp", children: [
    /* @__PURE__ */ jsx(Head, { title: "Notificaciones WhatsApp - Linkiu.Bio" }),
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto py-8 px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(MessageCircle, { className: "size-8 text-primary" }),
            "Notificaciones WhatsApp"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1", children: "Configura cómo recibes las alertas de tu negocio." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: hasFeature ? /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "bg-green-100 text-green-700 border-green-200 px-3 py-1 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "size-4" }),
          "Módulo Activo"
        ] }) : /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-yellow-600 border-yellow-200 bg-yellow-50 px-3 py-1 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(ShieldAlert, { className: "size-4" }),
          "Requiere Plan Pro"
        ] }) })
      ] }),
      !hasFeature && /* @__PURE__ */ jsxs(Alert, { className: "mb-6 bg-amber-50 border-amber-200 text-amber-900", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "size-4 text-amber-600" }),
        /* @__PURE__ */ jsx(AlertTitle, { className: "font-bold", children: "Módulo no incluido en tu plan" }),
        /* @__PURE__ */ jsx(AlertDescription, { className: "text-amber-800/80", children: "Tu plan actual no incluye notificaciones automáticas por WhatsApp. Para activar esta función y que tus clientes reciban sus reservas y pedidos, debes mejorar tu plan." }),
        /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(Button, { variant: "outline", className: "border-amber-300 text-amber-800 hover:bg-amber-100", asChild: true, children: /* @__PURE__ */ jsx("a", { href: route("tenant.subscription.index", { tenant: tenant.slug }), children: "Ver Planes Disponibles" }) }) })
      ] }),
      /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-lg shadow-black/5 bg-white overflow-hidden", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4 border-b border-gray-50 bg-gray-50/30", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-xl flex items-center gap-2 font-bold", children: [
            /* @__PURE__ */ jsx(Smartphone, { className: "size-5 text-primary" }),
            "Alertas para el Administrador"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-gray-500 font-medium", children: "Este número recibirá notificaciones cada vez que entre un nuevo pedido o una nueva reserva." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "p-8 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "phone", className: "text-gray-700 font-bold", children: "Número de WhatsApp Administrativo" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "phone",
                value: data.whatsapp_admin_phone,
                onChange: (e) => setData("whatsapp_admin_phone", e.target.value),
                placeholder: "Ej: +573102223344",
                className: `h-12 text-lg px-4 border-gray-200 focus:ring-primary/20 ${errors.whatsapp_admin_phone ? "border-destructive ring-destructive/20" : ""}`
              }
            ),
            errors.whatsapp_admin_phone && /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-destructive mt-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "size-3" }),
              errors.whatsapp_admin_phone
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1.5 pt-1", children: [
              /* @__PURE__ */ jsx("span", { className: "inline-block size-1.5 rounded-full bg-blue-500" }),
              "Usa el formato internacional (ej: +57310...)."
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl p-5 border border-slate-100", children: [
            /* @__PURE__ */ jsxs("h4", { className: "text-sm font-bold mb-3 flex items-center gap-2 text-slate-800", children: [
              /* @__PURE__ */ jsx(ShieldCheck, { className: "size-4 text-green-600" }),
              "¿Qué notificaciones se enviarán?"
            ] }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-2.5", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-xs text-slate-600", children: [
                /* @__PURE__ */ jsx("div", { className: "size-2 rounded-full bg-primary/20 mt-1 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "size-1 rounded-full bg-primary" }) }),
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "Nuevas Reservas:" }),
                  " Al número configurado arriba."
                ] })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-xs text-slate-600", children: [
                /* @__PURE__ */ jsx("div", { className: "size-2 rounded-full bg-primary/20 mt-1 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "size-1 rounded-full bg-primary" }) }),
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "Confirmación:" }),
                  " Al número que el cliente registre."
                ] })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-xs text-slate-600", children: [
                /* @__PURE__ */ jsx("div", { className: "size-2 rounded-full bg-primary/20 mt-1 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "size-1 rounded-full bg-primary" }) }),
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "Recordatorios:" }),
                  " Enviados automáticamente 1 hora antes."
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardFooter, { className: "bg-slate-50/50 border-t border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-center gap-4", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-gray-500 font-medium text-center sm:text-left", children: [
            "Integrado con ",
            /* @__PURE__ */ jsx("strong", { children: "Infobip Direct API" }),
            " para máxima velocidad."
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "submit",
              disabled: processing,
              className: "w-full sm:w-auto px-10 font-bold shadow-md shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
              children: [
                processing ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 size-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "mr-2 size-4" }),
                "Guardar Configuración"
              ]
            }
          )
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Settings as default
};
