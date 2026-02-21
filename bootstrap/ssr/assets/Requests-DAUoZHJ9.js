import { jsxs, jsx } from "react/jsx-runtime";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, d as CardContent, a as CardHeader, b as CardTitle, c as CardDescription } from "./card-BaovBWX5.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { E as Empty, a as EmptyHeader, b as EmptyContent, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import { F as FieldError } from "./field-BEfz_npx.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { P as PermissionDeniedModal } from "./dropdown-menu-Dkgv2tnp.js";
import { S as SuperAdminLayout } from "./SuperAdminLayout-DVPOojgY.js";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { Search, Check, X } from "lucide-react";
import { useState } from "react";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "vaul";
import "axios";
import "sonner";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./echo-DaX0krWj.js";
import "@ably/laravel-echo";
import "ably";
import "./ApplicationLogo-xMpxFOcX.js";
function Index({ requests, filters }) {
  const { auth } = usePage().props;
  const permissions = auth.permissions || [];
  const hasPermission = (permission) => {
    return permissions.includes("*") || permissions.includes(permission);
  };
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "all");
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("icon-requests.index"), { search, status }, {
      preserveState: true,
      replace: true
    });
  };
  const handleStatusChange = (value) => {
    setStatus(value);
    router.get(route("icon-requests.index"), { search, status: value }, {
      preserveState: true,
      replace: true
    });
  };
  const { data: approveData, setData: setApproveData, post: postApprove, processing: processingApprove, errors: errorsApprove, reset: resetApprove } = useForm({
    name: "",
    icon: null,
    vertical_id: "",
    is_global: false,
    admin_feedback: "",
    _method: "PATCH"
  });
  const { data: rejectData, setData: setRejectData, post: postReject, processing: processingReject, errors: errorsReject, reset: resetReject } = useForm({
    admin_feedback: "",
    _method: "PATCH"
  });
  const openApprove = (req) => {
    setSelectedRequest(req);
    resetApprove();
    setApproveData({
      name: req.requested_name,
      icon: null,
      vertical_id: "",
      is_global: false,
      admin_feedback: "",
      _method: "PATCH"
    });
    setIsApproveOpen(true);
  };
  const openReject = (req) => {
    setSelectedRequest(req);
    resetReject();
    setIsRejectOpen(true);
  };
  const submitApprove = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    postApprove(route("icon-requests.approve", selectedRequest.id), {
      onSuccess: () => setIsApproveOpen(false)
    });
  };
  const submitReject = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    postReject(route("icon-requests.reject", selectedRequest.id), {
      onSuccess: () => setIsRejectOpen(false)
    });
  };
  const getStatusBadge = (status2) => {
    switch (status2) {
      case "approved":
        return /* @__PURE__ */ jsx(Badge, { className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100", children: "Aprobado" });
      case "rejected":
        return /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: "Rechazado" });
      default:
        return /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100", children: "Pendiente" });
    }
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: "Centro de Solicitudes", children: [
    /* @__PURE__ */ jsx(Head, { title: "Solicitudes" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto py-6", children: [
      /* @__PURE__ */ jsx(Card, { className: "mb-6", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-between items-center", children: [
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "relative w-full sm:w-80", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-2 h-4 w-4 text-gray-400" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "Buscar por nombre o tienda...",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "pl-9"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium text-muted-foreground whitespace-nowrap", children: "Estado:" }),
          /* @__PURE__ */ jsxs(Select, { value: status, onValueChange: handleStatusChange, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Filtrar estado" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las solicitudes" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "pending", children: "Pendientes" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "approved", children: "Aprobadas" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "rejected", children: "Rechazadas" })
            ] })
          ] })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Solicitudes Recientes" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Gestiona las peticiones de iconografía y otros requerimientos de los tenants." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Fecha" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Tienda" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Icono Sugerido" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Referencia" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
            ] }) }),
            /* @__PURE__ */ jsxs(TableBody, { children: [
              requests.data.map((req) => /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: format(new Date(req.created_at), "dd MMM yyyy", { locale: es }) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm", children: req.tenant?.name || "N/A" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-medium", children: [
                    req.tenant?.vertical?.name || "-",
                    " / ",
                    req.tenant?.category?.name || "-"
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "font-medium text-sm", children: req.requested_name }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: `/media/${req.reference_image_path}`,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "block h-10 w-10 relative rounded overflow-hidden transition-all border group",
                    children: /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: `/media/${req.reference_image_path}`,
                        alt: "Referencia",
                        className: "object-cover w-full h-full transition-transform group-hover:scale-110"
                      }
                    )
                  }
                ) }),
                /* @__PURE__ */ jsx(TableCell, { children: getStatusBadge(req.status) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: req.status === "pending" && /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1.5", children: [
                  /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", className: "h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200", onClick: () => {
                    if (!hasPermission("sa.categories.edit")) {
                      setShowPermissionModal(true);
                    } else {
                      openApprove(req);
                    }
                  }, title: "Aprobar", children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", className: "h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200", onClick: () => {
                    if (!hasPermission("sa.categories.edit")) {
                      setShowPermissionModal(true);
                    } else {
                      openReject(req);
                    }
                  }, title: "Rechazar", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
                ] }) })
              ] }, req.id)),
              requests.data.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "h-[400px]", children: /* @__PURE__ */ jsxs(Empty, { className: "h-full", children: [
                /* @__PURE__ */ jsx(EmptyHeader, { children: /* @__PURE__ */ jsx("div", { className: "bg-gray-50 p-4 rounded-full mb-4", children: /* @__PURE__ */ jsx(Search, { className: "h-8 w-8 text-gray-400" }) }) }),
                /* @__PURE__ */ jsxs(EmptyContent, { children: [
                  /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay solicitudes pendientes" }),
                  /* @__PURE__ */ jsx(EmptyDescription, { children: "Todo está al día. No se encontraron solicitudes que requieran atención." })
                ] })
              ] }) }) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsx(SharedPagination, { links: requests.links }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: isApproveOpen, onOpenChange: setIsApproveOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Aprobar Solicitud" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: 'Confirmar la aprobación de la solicitud. El icono debe ser creado manualmente en la sección "Iconos de Categoría".' })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submitApprove, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "feedback_approve", children: "Nota para Tienda (Opcional)" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "feedback_approve",
              value: approveData.admin_feedback,
              onChange: (e) => setApproveData("admin_feedback", e.target.value),
              placeholder: "Ej: Icono 'Zapatos' creado y disponible globalmente."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setIsApproveOpen(false), children: "Cancelar" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processingApprove, children: "Aprobar" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: isRejectOpen, onOpenChange: setIsRejectOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Rechazar Solicitud" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Por favor indica la razón del rechazo para informar a la tienda." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submitReject, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "feedback_reject", children: "Motivo del Rechazo" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "feedback_reject",
              value: rejectData.admin_feedback,
              onChange: (e) => setRejectData("admin_feedback", e.target.value),
              required: true
            }
          ),
          /* @__PURE__ */ jsx(FieldError, { children: errorsReject.admin_feedback })
        ] }),
        /* @__PURE__ */ jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setIsRejectOpen(false), children: "Cancelar" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", variant: "destructive", disabled: processingReject, children: "Rechazar" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    )
  ] });
}
export {
  Index as default
};
