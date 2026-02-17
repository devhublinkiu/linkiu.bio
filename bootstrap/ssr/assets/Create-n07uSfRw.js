import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-CvP9QKT2.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { ChevronLeft, Send, LifeBuoy, Info } from "lucide-react";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, e as CardFooter } from "./card-BaovBWX5.js";
import { A as Alert, b as AlertTitle, a as AlertDescription } from "./alert-NB8JTTvo.js";
import "react";
import "sonner";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./badge-C_PGNHO8.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./dropdown-menu-BCxMx_rd.js";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-DFnQxYfh.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./menuConfig-rtCrEhXP.js";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
function Create({ currentTenant }) {
  const { data, setData, post, processing, errors } = useForm({
    subject: "",
    category: "",
    priority: "medium",
    message: ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("tenant.support.store", { tenant: currentTenant.slug }));
  };
  return /* @__PURE__ */ jsxs(
    AdminLayout,
    {
      title: "Nuevo Ticket",
      breadcrumbs: [
        { label: "Soporte y Ayuda", href: route("tenant.support.index", { tenant: currentTenant.slug }) },
        { label: "Nuevo Ticket" }
      ],
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Nuevo Ticket de Soporte" }),
        /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "cursor-pointer", children: /* @__PURE__ */ jsx(Link, { href: route("tenant.support.index", { tenant: currentTenant.slug }), children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900 font-outfit", children: "¿En qué podemos ayudarte?" }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Describe tu problema o solicitud y nuestro equipo te contactará lo antes posible." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsx("div", { className: "md:col-span-2 space-y-6", children: /* @__PURE__ */ jsx(Card, { className: "border-none shadow-premium bg-white/80 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
              /* @__PURE__ */ jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsx(CardTitle, { children: "Datos del ticket" }),
                /* @__PURE__ */ jsx(CardDescription, { children: "Por favor sé lo más detallado posible para brindarte una solución rápida." })
              ] }),
              /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "subject", children: "Asunto" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "subject",
                      value: data.subject,
                      onChange: (e) => setData("subject", e.target.value),
                      placeholder: "Ej: Problema con la carga de sliders",
                      className: errors.subject ? "border-red-500" : ""
                    }
                  ),
                  errors.subject && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.subject })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "category", children: "Categoría" }),
                    /* @__PURE__ */ jsxs(
                      Select,
                      {
                        value: data.category,
                        onValueChange: (val) => setData("category", val),
                        children: [
                          /* @__PURE__ */ jsx(SelectTrigger, { className: errors.category ? "border-red-500" : "", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona..." }) }),
                          /* @__PURE__ */ jsxs(SelectContent, { children: [
                            /* @__PURE__ */ jsx(SelectItem, { value: "technical", children: "Problema Técnico" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "billing", children: "Facturación" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "account", children: "Mi Cuenta" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "feature_request", children: "Solicitud de Funcionalidad" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "other", children: "Otros" })
                          ] })
                        ]
                      }
                    ),
                    errors.category && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.category })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "priority", children: "Prioridad" }),
                    /* @__PURE__ */ jsxs(
                      Select,
                      {
                        value: data.priority,
                        onValueChange: (val) => setData("priority", val),
                        children: [
                          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Media" }) }),
                          /* @__PURE__ */ jsxs(SelectContent, { children: [
                            /* @__PURE__ */ jsx(SelectItem, { value: "low", children: "Baja" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "medium", children: "Media" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "high", children: "Alta" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "urgent", children: "Urgente" })
                          ] })
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "message", children: "Mensaje detallado" }),
                  /* @__PURE__ */ jsx(
                    Textarea,
                    {
                      id: "message",
                      value: data.message,
                      onChange: (e) => setData("message", e.target.value),
                      placeholder: "Cuéntanos paso a paso qué está ocurriendo...",
                      rows: 6,
                      className: errors.message ? "border-red-500" : ""
                    }
                  ),
                  errors.message && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.message })
                ] })
              ] }),
              /* @__PURE__ */ jsx(CardFooter, { className: "justify-end bg-slate-50/50 rounded-b-xl border-t p-4", children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, className: "gap-2 cursor-pointer", children: processing ? "Enviando..." : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }),
                " Enviar Ticket"
              ] }) }) })
            ] }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs(Card, { className: "bg-blue-600 text-white border-none overflow-hidden", children: [
                /* @__PURE__ */ jsxs(CardHeader, { children: [
                  /* @__PURE__ */ jsx(LifeBuoy, { className: "h-8 w-8 mb-2 opacity-80" }),
                  /* @__PURE__ */ jsx(CardTitle, { className: "text-white", children: "Centro de Ayuda" }),
                  /* @__PURE__ */ jsx(CardDescription, { className: "text-blue-100", children: "¿Ya revisaste nuestra documentación?" })
                ] }),
                /* @__PURE__ */ jsxs(CardContent, { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-50/80 mb-4", children: "Muchos problemas comunes tienen solución inmediata en nuestra base de conocimientos." }),
                  /* @__PURE__ */ jsx(Button, { variant: "secondary", className: "w-full text-blue-700 font-semibold cursor-pointer", asChild: true, children: /* @__PURE__ */ jsx("a", { href: "#", target: "_blank", children: "Explorar documentación" }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(Alert, { children: [
                /* @__PURE__ */ jsx(Info, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx(AlertTitle, { children: "Importante" }),
                /* @__PURE__ */ jsx(AlertDescription, { className: "text-xs", children: "Te responderemos en un plazo máximo de 24 horas hábiles. Recibirás una notificación por correo electrónico." })
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  Create as default
};
