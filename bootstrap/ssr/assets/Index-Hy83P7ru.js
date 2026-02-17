import { jsxs, jsx } from "react/jsx-runtime";
import { S as SuperAdminLayout } from "./SuperAdminLayout-C_fBwscp.js";
import { usePage, useForm, Head } from "@inertiajs/react";
import { P as PermissionDeniedModal } from "./dropdown-menu-B2I3vWlQ.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import { FileText, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import { E as Empty, a as EmptyHeader, b as EmptyContent, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import "sonner";
import "./ApplicationLogo-xMpxFOcX.js";
import "@radix-ui/react-slot";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "vaul";
import "axios";
import "./input-B_4qRSOV.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BclLUCFD.js";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "class-variance-authority";
import "@radix-ui/react-label";
function Index({ payments }) {
  const { auth } = usePage().props;
  const permissions = auth.permissions || [];
  const hasPermission = (p) => permissions.includes("*") || permissions.includes(p);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [action, setAction] = useState(null);
  const { data, setData, put, processing, errors, reset } = useForm({
    action: "",
    notes: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = (invoice, actionType) => {
    if (!hasPermission("sa.payments.update")) {
      setShowPermissionModal(true);
      return;
    }
    setSelectedInvoice(invoice);
    setAction(actionType);
    setData({ action: actionType, notes: "" });
    setIsDialogOpen(true);
  };
  const submitAction = (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    put(route("payments.update", selectedInvoice.id), {
      onSuccess: () => {
        setIsDialogOpen(false);
        reset();
        setSelectedInvoice(null);
        setAction(null);
      }
    });
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return /* @__PURE__ */ jsx(Badge, { className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100", children: "Pagado" });
      case "pending_review":
        return /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100", children: "Revisión" });
      case "rejected":
        return /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: "Rechazado" });
      case "pending":
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", children: "Pendiente" });
      default:
        return /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: status });
    }
  };
  return /* @__PURE__ */ jsxs(
    SuperAdminLayout,
    {
      header: "Gestión de Pagos",
      children: [
        /* @__PURE__ */ jsx(
          PermissionDeniedModal,
          {
            open: showPermissionModal,
            onOpenChange: setShowPermissionModal
          }
        ),
        /* @__PURE__ */ jsx(Head, { title: "Pagos" }),
        /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto py-6", children: /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Pagos Pendientes" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Revisa y aprueba los reportes de pago de los planes." })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxs(Table, { children: [
              /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableHead, { children: "Fecha" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Cliente" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Plan" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Valor" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Comprobante" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
                /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
              ] }) }),
              /* @__PURE__ */ jsx(TableBody, { children: payments.data.length > 0 ? payments.data.map((invoice) => /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableCell, { children: format(new Date(invoice.created_at), "dd MMM yyyy", { locale: es }) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: invoice.tenant?.name }) }),
                /* @__PURE__ */ jsx(TableCell, { children: invoice.subscription?.plan?.name }),
                /* @__PURE__ */ jsxs(TableCell, { children: [
                  "$",
                  Number(invoice.amount).toLocaleString()
                ] }),
                /* @__PURE__ */ jsx(TableCell, { children: invoice.proof_of_payment_path ? /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: route("media.proxy", { path: invoice.proof_of_payment_path }),
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "flex items-center text-blue-600 hover:underline",
                    onClick: (e) => {
                      if (!hasPermission("sa.payments.proof.view")) {
                        e.preventDefault();
                        setShowPermissionModal(true);
                      }
                    },
                    children: [
                      /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 mr-1.5" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Ver comprobante" })
                    ]
                  }
                ) : /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-xs italic", children: "Sin adjunto" }) }),
                /* @__PURE__ */ jsx(TableCell, { children: getStatusBadge(invoice.status) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: invoice.status === "pending_review" && /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1.5", children: [
                  /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", className: "h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200", onClick: () => openDialog(invoice, "approve"), title: "Aprobar", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }) }),
                  /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", className: "h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200", onClick: () => openDialog(invoice, "reject"), title: "Rechazar", children: /* @__PURE__ */ jsx(XCircle, { className: "w-4 h-4" }) })
                ] }) })
              ] }, invoice.id)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "h-[400px]", children: /* @__PURE__ */ jsxs(Empty, { className: "h-full", children: [
                /* @__PURE__ */ jsx(EmptyHeader, { children: /* @__PURE__ */ jsx("div", { className: "bg-gray-50 p-4 rounded-full mb-4", children: /* @__PURE__ */ jsx(FileText, { className: "h-8 w-8 text-gray-400" }) }) }),
                /* @__PURE__ */ jsxs(EmptyContent, { children: [
                  /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay pagos pendientes" }),
                  /* @__PURE__ */ jsx(EmptyDescription, { children: "Todas las solicitudes de pago han sido procesadas o no hay registros aún." })
                ] })
              ] }) }) }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsx(SharedPagination, { links: payments.links }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsx(DialogTitle, { children: action === "approve" ? "Aprobar Pago" : "Rechazar Pago" }),
            /* @__PURE__ */ jsx(DialogDescription, { children: action === "approve" ? "Al aprobar, la suscripción se extenderá automáticamente. ¿Confirmas que recibiste el dinero?" : "Indica la razón del rechazo para que el cliente pueda corregirlo." })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submitAction, className: "space-y-6 pt-4", children: [
            action === "reject" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsx(Label, { children: "Motivo del rechazo" }),
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  placeholder: "Ej: No se ve el número de transferencia...",
                  value: data.notes,
                  onChange: (e) => setData("notes", e.target.value),
                  required: true
                }
              )
            ] }),
            action === "approve" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsx(Label, { children: "Notas internas (opcional)" }),
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  placeholder: "Ej: Aprobado por Whatsapp...",
                  value: data.notes,
                  onChange: (e) => setData("notes", e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setIsDialogOpen(false), children: "Cancelar" }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "submit",
                  disabled: processing,
                  variant: action === "approve" ? "default" : "destructive",
                  className: action === "approve" ? "bg-green-600 hover:bg-green-700" : "",
                  children: processing ? "Procesando..." : action === "approve" ? "Aprobar Pago" : "Rechazar Pago"
                }
              )
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  Index as default
};
