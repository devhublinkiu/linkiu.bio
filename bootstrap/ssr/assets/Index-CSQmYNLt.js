import { jsxs, jsx } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-CegS7XIj.js";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Search, Filter, MoreHorizontal, ExternalLink, MessageSquare } from "lucide-react";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { D as DropdownMenu, i as DropdownMenuTrigger, l as DropdownMenuContent, m as DropdownMenuLabel, p as DropdownMenuItem, n as DropdownMenuSeparator } from "./dropdown-menu-Dkgv2tnp.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-BaovBWX5.js";
import { useState } from "react";
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
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-alert-dialog";
const statusMap = {
  open: { label: "Abierto", color: "bg-blue-100 text-blue-700" },
  in_progress: { label: "En progreso", color: "bg-amber-100 text-amber-700" },
  awaiting_response: { label: "Esperando respuesta", color: "bg-purple-100 text-purple-700" },
  resolved: { label: "Resuelto", color: "bg-emerald-100 text-emerald-700" },
  closed: { label: "Cerrado", color: "bg-slate-100 text-slate-700" }
};
const priorityMap = {
  low: { label: "Baja", color: "bg-slate-100 text-slate-700" },
  medium: { label: "Media", color: "bg-blue-100 text-blue-700" },
  high: { label: "Alta", color: "bg-orange-100 text-orange-700" },
  urgent: { label: "Urgente", color: "bg-red-100 text-red-700" }
};
const categoryMap = {
  technical: "Problema Técnico",
  billing: "Facturación",
  account: "Mi Cuenta",
  feature_request: "Solicitud de Funcionalidad",
  other: "Otros"
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
function Index({ tickets, currentTenant, stats }) {
  const [ticketToClose, setTicketToClose] = useState(null);
  const handleCloseTicket = () => {
    if (ticketToClose) {
      router.post(route("tenant.support.close", {
        tenant: currentTenant.slug,
        support: ticketToClose
      }), {}, {
        onSuccess: () => setTicketToClose(null)
      });
    }
  };
  return /* @__PURE__ */ jsxs(
    AdminLayout,
    {
      title: "Soporte y Ayuda",
      breadcrumbs: [{ label: "Soporte y Ayuda" }],
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Soporte Técnico" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Tus tickets" }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Gestiona tus consultas y solicitudes de soporte." })
            ] }),
            /* @__PURE__ */ jsx(Button, { asChild: true, className: "gap-2", children: /* @__PURE__ */ jsxs(Link, { href: route("tenant.support.create", { tenant: currentTenant.slug }), className: "cursor-pointer", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
              " Nuevo Ticket"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Resueltos" }) }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-emerald-600", children: stats.resolved }) })
            ] }),
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Pendientes" }) }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-amber-600", children: stats.pending }) })
            ] }),
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Total" }) }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: stats.total }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-sm", children: [
                /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "search",
                    placeholder: "Buscar tickets...",
                    className: "pl-8"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }),
                " Filtros"
              ] }) })
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "rounded-md border", children: /* @__PURE__ */ jsxs(Table, { children: [
              /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableHead, { className: "w-[100px]", children: "ID" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Asunto" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Prioridad" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Última respuesta" }),
                /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
              ] }) }),
              /* @__PURE__ */ jsx(TableBody, { children: tickets.data.length > 0 ? tickets.data.map((ticket) => /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs font-bold text-blue-600 truncate max-w-[120px]", children: ticket.reference_id || `#${ticket.id}` }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route("tenant.support.show", { tenant: currentTenant.slug, support: ticket.id }),
                      className: "font-semibold hover:underline decoration-primary cursor-pointer",
                      children: ticket.subject
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-tight", children: categoryMap[ticket.category] || ticket.category })
                ] }) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { className: (statusMap?.[ticket.status] || statusMap?.open || { color: "bg-blue-100" }).color, variant: "secondary", children: (statusMap?.[ticket.status] || statusMap?.open || { label: "Abierto" }).label }) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: `w-2 h-2 rounded-full ${(priorityMap[ticket.priority] || priorityMap.medium || { color: "bg-slate-400" }).color.split(" ")[0]}` }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm", children: (priorityMap?.[ticket.priority] || priorityMap?.medium || { label: "Media" }).label })
                ] }) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-xs", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground line-clamp-1 italic", children: [
                    '"',
                    ticket.last_reply?.message || "Sin respuestas",
                    '"'
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400", children: safeFormatDate(ticket.updated_at) })
                ] }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                  /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "cursor-pointer", children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }) }) }),
                  /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                    /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Acciones" }),
                    /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, className: "cursor-pointer", children: /* @__PURE__ */ jsxs(Link, { href: route("tenant.support.show", { tenant: currentTenant.slug, support: ticket.id }), children: [
                      /* @__PURE__ */ jsx(ExternalLink, { className: "mr-2 h-4 w-4" }),
                      " Ver conversación"
                    ] }) }),
                    /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                    /* @__PURE__ */ jsx(
                      DropdownMenuItem,
                      {
                        className: "text-red-600 cursor-pointer",
                        onClick: () => setTicketToClose(ticket.id),
                        children: "Cerrar Ticket"
                      }
                    )
                  ] })
                ] }) })
              ] }, ticket.id)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "h-24 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsx(MessageSquare, { className: "h-8 w-8 text-muted-foreground/50" }),
                /* @__PURE__ */ jsx("p", { children: "No tienes tickets de soporte registrados." }),
                /* @__PURE__ */ jsx(Button, { variant: "link", asChild: true, className: "cursor-pointer", children: /* @__PURE__ */ jsx(Link, { href: route("tenant.support.create", { tenant: currentTenant.slug }), children: "Crea tu primer ticket aquí" }) })
              ] }) }) }) })
            ] }) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(AlertDialog, { open: !!ticketToClose, onOpenChange: (open) => !open && setTicketToClose(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
          /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Cerrar este ticket de soporte?" }),
            /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Esta acción marcará el ticket como finalizado. No podrás enviar más respuestas a menos que sea reabierto por un administrador." })
          ] }),
          /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsx(AlertDialogCancel, { className: "cursor-pointer", children: "Cancelar" }),
            /* @__PURE__ */ jsx(
              AlertDialogAction,
              {
                onClick: handleCloseTicket,
                className: "bg-red-600 hover:bg-red-700 text-white cursor-pointer",
                children: "Confirmar y Cerrar"
              }
            )
          ] })
        ] }) })
      ]
    }
  );
}
export {
  Index as default
};
