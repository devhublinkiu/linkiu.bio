import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CdwLWQ00.js";
import { usePage, Head, router } from "@inertiajs/react";
import { toast } from "sonner";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, d as CardContent } from "./card-BaovBWX5.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { E as Empty, a as EmptyHeader, e as EmptyMedia, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { CalendarCheck, Phone, Mail, Loader2 } from "lucide-react";
import { P as PermissionDeniedModal } from "./dropdown-menu-Dkgv2tnp.js";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import "./echo-DaX0krWj.js";
import "@ably/laravel-echo";
import "ably";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-vY7u-Ro3.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-select";
import "@radix-ui/react-label";
import "@radix-ui/react-dialog";
import "vaul";
import "axios";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  contacted: "bg-sky-100 text-sky-800 border-sky-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-300",
  cancelled: "bg-slate-100 text-slate-600 border-slate-300"
};
function Index({ appointments, typeLabels, statusLabels }) {
  const { currentTenant, currentUserRole } = usePage().props;
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [updating, setUpdating] = useState(false);
  const hasPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner === true || currentUserRole.permissions?.includes("*") === true || currentUserRole.permissions?.includes(permission) === true;
  };
  const withPermission = (permission, fn) => {
    if (hasPermission(permission)) fn();
    else setShowPermissionModal(true);
  };
  const openEdit = (apt) => {
    setEditingId(apt.id);
    setStatus(apt.status);
    setAssignedDate(apt.assigned_date ? apt.assigned_date.slice(0, 10) : "");
  };
  const saveUpdate = () => {
    if (editingId == null) return;
    setUpdating(true);
    router.put(route("tenant.admin.appointments.update", [currentTenant?.slug, editingId]), {
      status,
      assigned_date: assignedDate || null
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Cita actualizada");
        setEditingId(null);
      },
      onError: () => toast.error("No se pudo actualizar"),
      onFinish: () => setUpdating(false)
    });
  };
  const formatDate = (d) => new Date(d).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" });
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Citas", children: [
    /* @__PURE__ */ jsx(Head, { title: "Citas" }),
    /* @__PURE__ */ jsx(PermissionDeniedModal, { open: showPermissionModal, onOpenChange: setShowPermissionModal }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Citas" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Solicitudes de cita (oración, consejería, reunión). Confirma o asigna hora desde aquí." })
      ] }),
      appointments.data.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-16", children: /* @__PURE__ */ jsx(Empty, { children: /* @__PURE__ */ jsxs(EmptyHeader, { children: [
        /* @__PURE__ */ jsx(EmptyMedia, { variant: "icon", children: /* @__PURE__ */ jsx(CalendarCheck, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay citas solicitadas" }),
        /* @__PURE__ */ jsx(EmptyDescription, { children: "Cuando alguien solicite una cita desde tu enlace público, aparecerá aquí." })
      ] }) }) }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Fecha solicitud" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Nombre" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Contacto" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Tipo" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Fecha asignada" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: appointments.data.map((apt) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-sm whitespace-nowrap", children: formatDate(apt.created_at) }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: apt.guest_name }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5 text-sm", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Phone, { className: "size-3.5" }),
                " ",
                apt.guest_phone
              ] }),
              apt.guest_email && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-muted-foreground", children: [
                /* @__PURE__ */ jsx(Mail, { className: "size-3.5" }),
                " ",
                apt.guest_email
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { children: typeLabels[apt.appointment_type] ?? apt.appointment_type }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-sm whitespace-nowrap", children: apt.assigned_date ? formatDate(apt.assigned_date) : "—" }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: STATUS_COLORS[apt.status] ?? "", children: statusLabels[apt.status] ?? apt.status }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => withPermission("appointments.update", () => openEdit(apt)),
                children: "Gestionar"
              }
            ) })
          ] }, apt.id)) })
        ] }) }) }),
        appointments.last_page > 1 && /* @__PURE__ */ jsx(SharedPagination, { links: appointments.links })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: editingId !== null, onOpenChange: (open) => !open && setEditingId(null), children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Gestionar cita" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Estado" }),
          /* @__PURE__ */ jsxs(Select, { value: status, onValueChange: setStatus, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: Object.entries(statusLabels).filter(([value]) => value !== "").map(([value, label]) => /* @__PURE__ */ jsx(SelectItem, { value, children: label }, value)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "assigned_date", children: "Fecha asignada (opcional)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "assigned_date",
              type: "date",
              value: assignedDate,
              onChange: (e) => setAssignedDate(e.target.value)
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Fecha en que se contactó o se prestó la cita." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setEditingId(null), children: "Cancelar" }),
        /* @__PURE__ */ jsxs(Button, { onClick: saveUpdate, disabled: updating, className: "gap-2", children: [
          updating && /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }),
          "Guardar"
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
