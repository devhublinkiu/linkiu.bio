import { jsxs, jsx } from "react/jsx-runtime";
import { S as SuperAdminLayout } from "./SuperAdminLayout-rjkAJMgZ.js";
import { Head, Link, router } from "@inertiajs/react";
import { Search, Filter, User, Clock, MoreHorizontal, ExternalLink, MessageSquare } from "lucide-react";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { D as DropdownMenu, i as DropdownMenuTrigger, l as DropdownMenuContent, m as DropdownMenuLabel, p as DropdownMenuItem, n as DropdownMenuSeparator } from "./dropdown-menu-BCxMx_rd.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-BaovBWX5.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import "react";
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
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-DFnQxYfh.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
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
function Index({ tickets, agents }) {
  const handleAssign = (ticketId, agentId) => {
    router.post(route("superadmin.support.assign", ticketId), {
      assigned_to_id: agentId
    });
  };
  return /* @__PURE__ */ jsxs(
    SuperAdminLayout,
    {
      header: "Soporte Técnico",
      breadcrumbs: [{ label: "Soporte Técnico" }],
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Soporte - SuperAdmin" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Centro de Soporte" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Gestiona los tickets de todos los tenants de la plataforma." })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground uppercase", children: "Abiertos" }) }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: tickets.data.filter((t) => t.status === "open").length }) })
            ] }),
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground uppercase", children: "Urgentes" }) }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-red-600", children: tickets.data.filter((t) => t.priority === "urgent").length }) })
            ] }),
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground uppercase", children: "Sin Asignar" }) }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-amber-600", children: tickets.data.filter((t) => !t.assigned_to).length }) })
            ] }),
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground uppercase", children: "Total" }) }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: tickets.data.length }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative flex-1 max-w-sm", children: [
                /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "search",
                    placeholder: "Buscar por asunto, tenant o usuario...",
                    className: "pl-8"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-2 font-semibold", children: [
                /* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }),
                " Filtros"
              ] }) })
            ] }) }),
            /* @__PURE__ */ jsxs(CardContent, { children: [
              /* @__PURE__ */ jsx("div", { className: "rounded-md border", children: /* @__PURE__ */ jsxs(Table, { children: [
                /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
                  /* @__PURE__ */ jsx(TableHead, { className: "w-[80px]", children: "ID" }),
                  /* @__PURE__ */ jsx(TableHead, { children: "Tenant / Usuario" }),
                  /* @__PURE__ */ jsx(TableHead, { children: "Asunto" }),
                  /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
                  /* @__PURE__ */ jsx(TableHead, { children: "Prioridad" }),
                  /* @__PURE__ */ jsx(TableHead, { children: "Asignado a" }),
                  /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
                ] }) }),
                /* @__PURE__ */ jsx(TableBody, { children: tickets.data.length > 0 ? tickets.data.map((ticket) => /* @__PURE__ */ jsxs(TableRow, { children: [
                  /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-[10px] font-bold", children: /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route("superadmin.support.show", ticket.id),
                      className: "text-blue-600 hover:underline hover:text-blue-800",
                      children: ticket.reference_id || `#${String(ticket.id).padStart(4, "0")}`
                    }
                  ) }),
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: ticket.tenant.name }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(User, { className: "h-3 w-3" }),
                      " ",
                      ticket.user.name
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: route("superadmin.support.show", ticket.id),
                        className: "font-semibold hover:underline decoration-primary line-clamp-1",
                        children: ticket.subject
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground uppercase bg-slate-100 px-1 rounded", children: categoryMap[ticket.category] || ticket.category }),
                      /* @__PURE__ */ jsxs("span", { className: "text-[9px] text-slate-400 flex items-center gap-1", children: [
                        /* @__PURE__ */ jsx(Clock, { className: "h-2.5 w-2.5" }),
                        " ",
                        safeFormatDistance(ticket.created_at)
                      ] })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { className: `${(statusMap?.[ticket.status] || statusMap?.open || { color: "bg-blue-100" }).color} border-none shadow-none`, variant: "secondary", children: (statusMap?.[ticket.status] || statusMap?.open || { label: "Abierto" }).label }) }),
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: `w-2 h-2 rounded-full ${(priorityMap?.[ticket.priority] || priorityMap?.medium || { color: "bg-slate-400" }).color}` }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs capitalize", children: (priorityMap?.[ticket.priority] || priorityMap?.medium || { label: "Media" }).label })
                  ] }) }),
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(
                    Select,
                    {
                      defaultValue: ticket.assigned_to ? String(agents.find((a) => a.name === ticket.assigned_to?.name)?.id) : void 0,
                      onValueChange: (val) => handleAssign(ticket.id, val),
                      children: [
                        /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 text-xs w-[140px] shadow-none border-dashed focus:ring-0 focus:ring-offset-0", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Sin asignar" }) }),
                        /* @__PURE__ */ jsx(SelectContent, { children: agents.map((agent) => /* @__PURE__ */ jsx(SelectItem, { value: String(agent.id), children: agent.name }, agent.id)) })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "cursor-pointer", children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }) }) }),
                    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-48", children: [
                      /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Acciones" }),
                      /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, className: "cursor-pointer", children: /* @__PURE__ */ jsxs(Link, { href: route("superadmin.support.show", ticket.id), children: [
                        /* @__PURE__ */ jsx(ExternalLink, { className: "mr-2 h-4 w-4" }),
                        " Ver Detalles"
                      ] }) }),
                      /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                      /* @__PURE__ */ jsx(DropdownMenuItem, { className: "text-emerald-600 cursor-pointer", children: "Marcar como Resuelto" })
                    ] })
                  ] }) })
                ] }, ticket.id)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "h-24 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-2 py-8", children: [
                  /* @__PURE__ */ jsx(MessageSquare, { className: "h-12 w-12 text-muted-foreground/20" }),
                  /* @__PURE__ */ jsx("p", { className: "text-muted-foreground font-medium", children: "No se encontraron tickets." })
                ] }) }) }) })
              ] }) }),
              tickets.data.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(SharedPagination, { links: tickets.links }) })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  Index as default
};
