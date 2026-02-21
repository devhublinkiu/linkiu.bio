import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-ndko6Pty.js";
import { usePage, useForm, router, Head, Link } from "@inertiajs/react";
import { ChevronLeft, RefreshCw, ShieldCheck, Lock, Send, HelpCircle, CheckCircle2 } from "lucide-react";
import { B as Button } from "./button-BdX_X5dq.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-BaovBWX5.js";
import { A as Avatar, j as AvatarImage, k as AvatarFallback } from "./dropdown-menu-Dkgv2tnp.js";
import { useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { g as getEcho } from "./echo-DaX0krWj.js";
import "sonner";
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
import "./input-B_4qRSOV.js";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@ably/laravel-echo";
import "ably";
const statusMap = {
  open: { label: "Abierto", color: "bg-blue-100 text-blue-700" },
  in_progress: { label: "En progreso", color: "bg-amber-100 text-amber-700" },
  awaiting_response: { label: "Esperando tu respuesta", color: "bg-purple-100 text-purple-700" },
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
const safeFormatDate = (dateStr) => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Fecha no disponible";
    return date.toLocaleString();
  } catch (e) {
    return "Fecha no disponible";
  }
};
function Show({ ticket, currentTenant }) {
  const { auth } = usePage().props;
  const scrollRef = useRef(null);
  const { data, setData, post, processing, reset, errors } = useForm({
    message: ""
  });
  const isClosed = ticket.status === "closed" || ticket.status === "resolved";
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.message.trim()) return;
    post(route("tenant.support.reply", { tenant: currentTenant.slug, ticket: ticket.id }), {
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
    const echo = getEcho();
    if (echo) {
      const channelName = `tenant-updates.${currentTenant.id}`;
      echo.channel(channelName).listen(".ticket.replied", (e) => {
        if (e.ticket_id === ticket.id) {
          console.log("[Echo] Real-time reply received for this ticket:", e);
          router.reload();
        }
      });
      return () => {
        try {
          if (typeof echo.leave === "function") {
            echo.leave(channelName);
          }
        } catch {
        }
      };
    }
  }, [ticket.id, currentTenant.id]);
  return /* @__PURE__ */ jsxs(
    AdminLayout,
    {
      title: `Ticket ${ticket.reference_id || `#${ticket.id}`}`,
      breadcrumbs: [
        { label: "Soporte y Ayuda", href: route("tenant.support.index", { tenant: currentTenant.slug }) },
        { label: ticket.reference_id || `#${ticket.id}` }
      ],
      children: [
        /* @__PURE__ */ jsx(Head, { title: `${ticket.subject} - Soporte` }),
        /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto space-y-6", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-muted-foreground uppercase", children: "Referencia" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "font-mono text-base font-bold", children: ticket.reference_id || `#${ticket.id}` })
          ] }) }),
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("tenant.support.index", { tenant: currentTenant.slug }), children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-xl", children: ticket.subject }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: (statusMap?.[ticket.status] || statusMap?.open || { label: "Ticket" }).label }),
                  /* @__PURE__ */ jsx(Badge, { variant: "outline", children: (priorityMap?.[ticket.priority] || priorityMap?.medium || { label: "Media" }).label })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => router.reload(), children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" }) })
          ] }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [
            /* @__PURE__ */ jsx(Card, { className: "lg:col-span-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-0", children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  ref: scrollRef,
                  className: "h-[calc(100vh-400px)] overflow-y-auto p-6 space-y-6",
                  children: [
                    ticket.replies.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                      /* @__PURE__ */ jsxs(Avatar, { className: "h-10 w-10 border-2 border-primary/10", children: [
                        /* @__PURE__ */ jsx(AvatarImage, { src: auth.user.profile_photo_url || ticket.replies[0]?.user?.profile_photo_url }),
                        /* @__PURE__ */ jsx(AvatarFallback, { children: (auth.user.name || ticket.replies[0]?.user?.name || "U").charAt(0) })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-1 max-w-[85%]", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm", children: auth.user.name || ticket.replies[0]?.user?.name }),
                          /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs h-4", children: "Original" })
                        ] }),
                        /* @__PURE__ */ jsx(Card, { className: "border-slate-200", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4 text-sm", children: ticket.replies[0]?.message }) }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: safeFormatDate(ticket.created_at || ticket.replies[0]?.created_at) })
                      ] })
                    ] }),
                    ticket.replies.slice(1).map((reply) => {
                      const isSupport = reply.is_staff;
                      return /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: isSupport ? "flex gap-4" : "flex gap-4 flex-row-reverse",
                          children: [
                            /* @__PURE__ */ jsx(Avatar, { className: isSupport ? "h-10 w-10 border-2 border-primary/10" : "h-10 w-10 border-2 border-blue-500/20", children: isSupport ? /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-slate-200 text-slate-600", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5" }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                              /* @__PURE__ */ jsx(AvatarImage, { src: reply.user?.profile_photo_url }),
                              /* @__PURE__ */ jsx(AvatarFallback, { children: reply.user?.name?.charAt(0) || "U" })
                            ] }) }),
                            /* @__PURE__ */ jsxs("div", { className: isSupport ? "space-y-1 max-w-[85%]" : "space-y-1 max-w-[85%] items-end", children: [
                              /* @__PURE__ */ jsxs("div", { className: isSupport ? "flex items-center gap-2" : "flex items-center gap-2 flex-row-reverse", children: [
                                /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm", children: isSupport ? "Soporte Linkiu" : reply.user?.name || "Voz del Cliente" }),
                                isSupport && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs h-4", children: "Oficial" })
                              ] }),
                              /* @__PURE__ */ jsx("div", { className: isSupport ? "p-4 rounded-2xl text-sm bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm" : "p-4 rounded-2xl text-sm bg-blue-600 text-white rounded-tr-none shadow-md", children: reply.message }),
                              /* @__PURE__ */ jsx("span", { className: isSupport ? "text-xs text-muted-foreground block" : "text-xs text-muted-foreground block text-right", children: safeFormatDistance(reply.created_at) })
                            ] })
                          ]
                        },
                        reply.id
                      );
                    })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "p-4 border-t bg-slate-50/50 dark:bg-slate-900/30", children: isClosed ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-muted-foreground gap-2", children: [
                /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Este ticket está cerrado y no permite más respuestas." })
              ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(
                    Textarea,
                    {
                      placeholder: "Escribe tu respuesta aquí...",
                      value: data.message,
                      onChange: (e) => setData("message", e.target.value),
                      className: "min-h-[100px] pr-12"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      type: "submit",
                      size: "icon",
                      disabled: processing || !data.message.trim(),
                      className: "absolute bottom-3 right-3 h-8 w-8",
                      children: /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center px-1", children: /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(HelpCircle, { className: "h-3 w-3" }),
                  " Soporte te responderá lo antes posible."
                ] }) })
              ] }) })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs(Card, { className: "border-slate-200 shadow-sm overflow-hidden", children: [
                /* @__PURE__ */ jsx(CardHeader, { className: "bg-slate-50/50 border-b pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-xs font-bold uppercase tracking-wider text-slate-500", children: "Información" }) }),
                /* @__PURE__ */ jsxs(CardContent, { className: "pt-4 space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] uppercase text-slate-400 font-bold", children: "Categoría" }),
                    /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-slate-700", children: categoryMap[ticket.category] || ticket.category })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] uppercase text-slate-400 font-bold", children: "ID de Referencia" }),
                    /* @__PURE__ */ jsx("div", { className: "text-sm font-mono text-slate-600", children: ticket.reference_id || `#${ticket.id}` })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] uppercase text-slate-400 font-bold", children: "Última actualización" }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-600", children: safeFormatDate(ticket.updated_at) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-sm bg-blue-50/30", children: [
                /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2 text-center", children: [
                  /* @__PURE__ */ jsx(HelpCircle, { className: "h-8 w-8 mx-auto text-blue-500/50" }),
                  /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "¿Necesitas algo más?" })
                ] }),
                /* @__PURE__ */ jsxs(CardContent, { className: "text-center space-y-4", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Si el problema persiste o tienes una nueva consulta, puedes abrir un nuevo ticket." }),
                  /* @__PURE__ */ jsx(Button, { className: "w-full cursor-pointer", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("tenant.support.create", { tenant: currentTenant.slug }), children: "Nuevo Ticket" }) }),
                  !isClosed && /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "destructive",
                      className: "w-full gap-2 cursor-pointer",
                      onClick: () => {
                        if (confirm("¿Estás seguro de que deseas cerrar este ticket? No podrás enviar más respuestas.")) {
                          router.post(route("tenant.support.close", { tenant: currentTenant.slug, support: ticket.id }));
                        }
                      },
                      children: [
                        /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
                        "Cerrar Ticket"
                      ]
                    }
                  )
                ] })
              ] })
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
