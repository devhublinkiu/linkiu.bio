import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { S as SuperAdminLayout } from "./SuperAdminLayout-rjkAJMgZ.js";
import { useForm, router, Head, Link } from "@inertiajs/react";
import { ChevronLeft, Shield, User, Lock, Send, Info, ExternalLink, CheckCircle2 } from "lucide-react";
import { B as Button } from "./button-BdX_X5dq.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { A as Avatar, k as AvatarFallback } from "./dropdown-menu-BCxMx_rd.js";
import { S as Separator } from "./separator-DbxqJzR0.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useRef, useEffect } from "react";
import "sonner";
import "./ApplicationLogo-xMpxFOcX.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./input-B_4qRSOV.js";
import "./sheet-DFnQxYfh.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-separator";
import "@radix-ui/react-select";
const statusMap = {
  open: { label: "Abierto", color: "bg-blue-100 text-blue-700" },
  in_progress: { label: "En progreso", color: "bg-amber-100 text-amber-700" },
  awaiting_response: { label: "Esperando respuesta", color: "bg-purple-100 text-purple-700" },
  resolved: { label: "Resuelto", color: "bg-emerald-100 text-emerald-700" },
  closed: { label: "Cerrado", color: "bg-slate-100 text-slate-700" }
};
const priorityMap = {
  low: { label: "Baja", color: "bg-slate-400" },
  medium: { label: "Media", color: "bg-blue-500" },
  high: { label: "Alta", color: "bg-orange-500" },
  urgent: { label: "Urgente", color: "bg-red-500" }
};
const categoryMap = {
  technical: "Problema Técnico",
  billing: "Facturación",
  account: "Mi Cuenta",
  feature_request: "Solicitud de Funcionalidad",
  other: "Otros"
};
const safeFormatDistance = (dateStr) => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "recientemente";
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  } catch (e) {
    return "recientemente";
  }
};
function Show({ ticket }) {
  const scrollRef = useRef(null);
  const { data, setData, post, processing, reset, errors } = useForm({
    message: ""
  });
  const updateStatus = (status) => {
    router.patch(route("superadmin.support.update", ticket.id), {
      status,
      priority: ticket.priority
    });
  };
  const updatePriority = (priority) => {
    router.patch(route("superadmin.support.update", ticket.id), {
      status: ticket.status,
      priority
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.message.trim()) return;
    post(route("superadmin.support.reply", ticket.id), {
      onSuccess: () => {
        reset("message");
      }
    });
  };
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticket.replies]);
  useEffect(() => {
    if (window.Echo) {
      const channelName = "superadmin-updates";
      window.Echo.channel(channelName).listen(".ticket.replied", (e) => {
        if (e.ticket_id === ticket.id) {
          console.log("[Echo] Real-time reply received for this ticket:", e);
          router.reload();
        }
      });
      return () => {
        try {
          if (window.Echo) {
            window.Echo.leave(channelName);
          }
        } catch (e) {
        }
      };
    }
  }, [ticket.id]);
  return /* @__PURE__ */ jsxs(
    SuperAdminLayout,
    {
      header: `Ticket ${ticket.reference_id || `#${ticket.id}`}`,
      breadcrumbs: [
        { label: "Soporte Técnico", href: route("superadmin.support.index") },
        { label: ticket.reference_id || `#${ticket.id}` }
      ],
      children: [
        /* @__PURE__ */ jsx(Head, { title: `${ticket.subject} - Soporte Admin` }),
        /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between flex-shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-muted-foreground uppercase tracking-tight", children: "Referencia" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "font-mono text-base font-bold", children: ticket?.reference_id || `#${ticket?.id}` })
          ] }) }),
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("superadmin.support.index"), children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: ticket.subject }),
                /* @__PURE__ */ jsxs(CardDescription, { className: "flex items-center gap-2 mt-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-semibold", children: ticket.tenant.name }),
                  /* @__PURE__ */ jsx("span", { children: "•" }),
                  /* @__PURE__ */ jsx("span", { children: categoryMap[ticket.category] || ticket.category })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: (statusMap?.[ticket.status] || statusMap?.open || { label: "Abierto" }).label }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", children: (priorityMap?.[ticket.priority] || priorityMap?.medium || { label: "Media" }).label })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [
            /* @__PURE__ */ jsx(Card, { className: "lg:col-span-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-0", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  ref: scrollRef,
                  className: "h-[calc(100vh-400px)] overflow-y-auto p-6 space-y-6",
                  children: ticket.replies.map((reply) => /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `flex ${reply.is_staff ? "justify-end" : "justify-start"}`,
                      children: /* @__PURE__ */ jsxs("div", { className: `flex gap-3 max-w-[85%] ${reply.is_staff ? "flex-row-reverse" : ""}`, children: [
                        /* @__PURE__ */ jsx(Avatar, { className: "h-8 w-8 mt-1 border", children: /* @__PURE__ */ jsx(AvatarFallback, { className: reply.is_staff ? "bg-blue-600 text-white text-[10px]" : "bg-slate-200 text-slate-600 text-[10px]", children: reply.is_staff ? /* @__PURE__ */ jsx(Shield, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }) }) }),
                        /* @__PURE__ */ jsxs("div", { className: `space-y-1 ${reply.is_staff ? "items-end" : "items-start"}`, children: [
                          /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 px-1 ${reply.is_staff ? "flex-row-reverse" : ""}`, children: [
                            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-700", children: reply.user?.name || (reply.is_staff ? "Soporte" : "Usuario") }),
                            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: safeFormatDistance(reply.created_at) })
                          ] }),
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              className: `p-4 rounded-2xl text-sm leading-relaxed ${reply.is_staff ? "bg-blue-600 text-white rounded-tr-none shadow-blue-100 shadow-md" : "bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm"}`,
                              children: reply.message
                            }
                          )
                        ] })
                      ] })
                    },
                    reply.id
                  ))
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "p-4 border-t bg-white", children: ticket.status === "closed" || ticket.status === "resolved" ? /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border rounded-xl p-4 flex flex-col items-center gap-3 text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500", children: /* @__PURE__ */ jsx(Lock, { className: "h-5 w-5" }) }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-slate-900", children: [
                    "Ticket ",
                    ticket.status === "resolved" ? "Resuelto" : "Cerrado"
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Este ticket ya no acepta nuevas respuestas." })
                ] }),
                /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => updateStatus("open"), children: "Reabrir Ticket" })
              ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [
                /* @__PURE__ */ jsx(
                  Textarea,
                  {
                    placeholder: "Escribe tu respuesta aquí...",
                    className: "min-h-[100px] bg-slate-50/50 focus:bg-white resize-none border-slate-200",
                    value: data.message,
                    onChange: (e) => setData("message", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: "Tu respuesta se enviará al correo del usuario." }),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      type: "submit",
                      disabled: processing || !data.message.trim(),
                      className: "gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100",
                      children: processing ? "Enviando..." : /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }),
                        " Enviar Respuesta"
                      ] })
                    }
                  )
                ] })
              ] }) })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs(Card, { className: "shadow-sm border-slate-200 overflow-hidden", children: [
                /* @__PURE__ */ jsx(CardHeader, { className: "bg-slate-50/50 border-b pb-4", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-bold flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Info, { className: "h-4 w-4 text-blue-600" }),
                  "Detalles del Ticket"
                ] }) }),
                /* @__PURE__ */ jsxs(CardContent, { className: "pt-4 space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground", children: "Estado" }),
                    /* @__PURE__ */ jsxs(Select, { value: ticket.status, onValueChange: updateStatus, children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                      /* @__PURE__ */ jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsx(SelectItem, { value: "open", children: "Abierto" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "in_progress", children: "En progreso" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "awaiting_response", children: "Esperando respuesta" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "resolved", children: "Resuelto" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "closed", children: "Cerrado" })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground", children: "Prioridad" }),
                    /* @__PURE__ */ jsxs(Select, { value: ticket.priority, onValueChange: updatePriority, children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                      /* @__PURE__ */ jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsx(SelectItem, { value: "low", children: "Baja" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "medium", children: "Media" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "high", children: "Alta" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "urgent", children: "Urgente" })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground", children: "Categoría" }),
                    /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-slate-700", children: categoryMap[ticket.category] || ticket.category })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase font-bold text-muted-foreground", children: "ID Referencia" }),
                    /* @__PURE__ */ jsx("div", { className: "text-sm font-mono text-blue-600 font-bold", children: ticket.reference_id || `#${ticket.id}` })
                  ] }),
                  /* @__PURE__ */ jsx(Separator, {}),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase font-bold text-muted-foreground mb-1", children: "Información del Cliente" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx(Avatar, { className: "h-6 w-6", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "text-[8px]", children: ticket.user.name.charAt(0) }) }),
                        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: ticket.user.name }),
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: ticket.user.email })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase font-bold text-muted-foreground mb-1", children: "Tienda (Tenant)" }),
                      /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-lg p-2 border border-slate-100 flex items-center justify-between", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: ticket.tenant.name }),
                        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("tenants.show", ticket.tenant.id), children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" }) }) })
                      ] })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(Card, { className: "shadow-sm border-slate-200", children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6 space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100/50", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5 flex-shrink-0" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-bold", children: "Acción Rápida" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => updateStatus("resolved"),
                      className: "text-[10px] hover:underline",
                      children: "Resolver ticket ahora"
                    }
                  )
                ] })
              ] }) }) })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  Show as default
};
