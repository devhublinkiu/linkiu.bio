import { jsxs, jsx } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-CvP9QKT2.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { C as Card, a as CardHeader, d as CardContent, b as CardTitle, c as CardDescription } from "./card-BaovBWX5.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { ArrowLeft, Printer, Upload, Banknote, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { P as PaymentUploadModal } from "./PaymentUploadModal-CAe0w48h.js";
import "sonner";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./dropdown-menu-BCxMx_rd.js";
import "@radix-ui/react-slot";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./input-B_4qRSOV.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-DFnQxYfh.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./menuConfig-rtCrEhXP.js";
import "./sonner-ZUDSQr7N.js";
import "class-variance-authority";
function Show({ invoice, bankDetails }) {
  const { auth, currentTenant } = usePage().props;
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return /* @__PURE__ */ jsxs(Badge, { className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 mr-1" }),
          " Pagada"
        ] });
      case "pending_review":
        return /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 mr-1" }),
          " En Revisión"
        ] });
      case "pending":
        return /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0 text-amber-600 border-amber-200", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3 mr-1" }),
          " Pendiente"
        ] });
      case "overdue":
        return /* @__PURE__ */ jsxs(Badge, { variant: "destructive", className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3 mr-1" }),
          " Vencida"
        ] });
      default:
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: status });
    }
  };
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(amount);
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: `Factura #${invoice.id}` }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", asChild: true, className: "pl-0 cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: /* @__PURE__ */ jsxs(Link, { href: route("tenant.invoices.index", { tenant: currentTenant?.slug }), children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
          "Volver a Facturas"
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxs(Button, { onClick: () => window.print(), className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: [
          /* @__PURE__ */ jsx(Printer, { className: "w-4 h-4 mr-2" }),
          "Imprimir"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs(Card, { className: "md:col-span-2 shadow-lg overflow-hidden border", children: [
          /* @__PURE__ */ jsx("div", { className: "h-2 bg-primary" }),
          /* @__PURE__ */ jsx(CardHeader, { className: "bg-muted/30 border-b pb-8", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-primary tracking-tighter mb-1 uppercase", children: "LINKIU.BIO" }),
              /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-[10px] font-bold uppercase tracking-widest", children: "Recibo de Servicio" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold", children: [
                "Factura #",
                invoice.id
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-col items-end gap-1 mt-1", children: getStatusBadge(invoice.status) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "p-8 space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-8", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1", children: "Fecha de Emisión" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold", children: formatDate(invoice.created_at) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1", children: "Fecha de Vencimiento" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold", children: formatDate(invoice.due_date) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("div", { className: "border-b pb-2", children: /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Concepto" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("p", { className: "font-bold", children: [
                    "Plan ",
                    invoice.subscription?.plan?.name || "Suscripción"
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Ciclo de facturación: ",
                    invoice.subscription?.billing_cycle
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "font-bold", children: formatAmount(invoice.amount) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "pt-8 border-t", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsx("p", { className: "text-lg font-black", children: "TOTAL" }),
                /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-primary", children: formatAmount(invoice.amount) })
              ] }) })
            ] }),
            invoice.admin_notes && /* @__PURE__ */ jsxs("div", { className: "bg-destructive/10 border border-destructive/20 rounded-xl p-4 mt-6", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-destructive uppercase tracking-widest mb-1", children: "Nota del Administrador" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive italic", children: invoice.admin_notes })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-6 bg-muted/30 border-t", children: /* @__PURE__ */ jsx("p", { className: "text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest", children: "Gracias por confiar en Linkiu.bio" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          invoice.status === "pending" && /* @__PURE__ */ jsxs(Card, { className: "border-primary/20 bg-primary/5", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "pb-3", children: [
              /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-bold flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4 text-primary" }),
                "Pagar Ahora"
              ] }),
              /* @__PURE__ */ jsx(CardDescription, { className: "text-xs", children: "Sube tu comprobante de pago para activar tu servicio." })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Button, { className: "w-full shadow-lg cursor-pointer ring-0 hover:ring-0 focus:ring-0", onClick: () => setIsUploadModalOpen(true), children: "Enviar Comprobante" }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-bold flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Banknote, { className: "w-4 h-4 text-muted-foreground" }),
              "Datos de Transferencia"
            ] }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Banco" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold", children: bankDetails.bank_name })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Tipo de Cuenta" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold", children: bankDetails.bank_account_type })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Número de Cuenta" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold", children: bankDetails.bank_account_number })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Titular" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold", children: bankDetails.bank_account_holder })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "NIT/Cédula" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold", children: bankDetails.bank_account_nit })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      PaymentUploadModal,
      {
        isOpen: isUploadModalOpen,
        onClose: () => setIsUploadModalOpen(false),
        invoice
      }
    )
  ] });
}
export {
  Show as default
};
