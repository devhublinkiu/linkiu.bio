import { jsxs, jsx } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-CegS7XIj.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { Banknote, CreditCard, Eye, Upload, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { P as PaymentUploadModal } from "./PaymentUploadModal-CAe0w48h.js";
import "sonner";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./dropdown-menu-Dkgv2tnp.js";
import "@radix-ui/react-slot";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./input-B_4qRSOV.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./menuConfig-rtCrEhXP.js";
import "./sonner-ZUDSQr7N.js";
import "class-variance-authority";
function Index({ invoices, bankDetails }) {
  const { auth, currentTenant } = usePage().props;
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const handleUploadClick = (invoice) => {
    setSelectedInvoice(invoice);
    setIsUploadOpen(true);
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return /* @__PURE__ */ jsxs(Badge, { className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "w-3 h-3 mr-1" }),
          " Pagado"
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
        return /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: status });
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Facturación" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-8 max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-black tracking-tight", children: "Facturación" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground font-medium mt-1 uppercase text-xs tracking-widest", children: "Historial de pagos y suscripción" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs(Card, { className: "md:col-span-1 shadow-sm", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4", children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-lg font-bold", children: [
              /* @__PURE__ */ jsx(Banknote, { className: "w-5 h-5 text-primary" }),
              "Datos Bancarios"
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { className: "font-medium", children: "Realiza tu pago vía transferencia." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: bankDetails ? /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-b pb-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground font-bold uppercase text-[10px] tracking-widest", children: "Banco" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: bankDetails.bank_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-b pb-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground font-bold uppercase text-[10px] tracking-widest", children: "Tipo" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: bankDetails.bank_account_type })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-b pb-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground font-bold uppercase text-[10px] tracking-widest", children: "Número" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: bankDetails.bank_account_number })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground font-bold uppercase text-[10px] tracking-widest", children: "NIT" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: bankDetails.bank_account_nit })
            ] })
          ] }) : /* @__PURE__ */ jsx("div", { className: "text-center py-4 text-muted-foreground text-sm italic font-medium", children: "No hay datos bancarios configurados." }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "md:col-span-2 bg-primary text-primary-foreground shadow-xl border-none relative overflow-hidden group", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500", children: /* @__PURE__ */ jsx(CreditCard, { className: "w-32 h-32" }) }),
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "opacity-70 uppercase text-[10px] tracking-widest font-black", children: "Tu Suscripción" }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "pb-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-3 mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "text-5xl font-black tracking-tighter", children: "Activa" }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "mb-2 ring-0 hover:ring-0 focus:ring-0", children: "Premium" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "opacity-70 text-sm max-w-md font-medium", children: "Tu servicio está funcionando correctamente. Puedes ver tus comprobantes reportados en la tabla inferior o reportar uno nuevo." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "shadow-sm", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "flex flex-row items-center justify-between border-b pb-6 mb-2", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "font-black text-xl", children: "Historial de Facturas" }),
          /* @__PURE__ */ jsx(CardDescription, { className: "font-medium", children: "Listado detallado de tus cobros y pagos." })
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-transparent", children: [
            /* @__PURE__ */ jsx(TableHead, { className: "font-bold text-[10px] uppercase tracking-widest text-muted-foreground pl-6", children: "Fecha" }),
            /* @__PURE__ */ jsx(TableHead, { className: "font-bold text-[10px] uppercase tracking-widest text-muted-foreground", children: "Concepto" }),
            /* @__PURE__ */ jsx(TableHead, { className: "font-bold text-[10px] uppercase tracking-widest text-muted-foreground", children: "Valor" }),
            /* @__PURE__ */ jsx(TableHead, { className: "font-bold text-[10px] uppercase tracking-widest text-muted-foreground", children: "Estado" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right font-bold text-[10px] uppercase tracking-widest text-muted-foreground pr-6", children: "Acciones" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: invoices.length > 0 ? invoices.map((invoice) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "pl-6 font-bold", children: format(new Date(invoice.created_at), "dd MMM, yyyy", { locale: es }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxs("span", { className: "font-bold", children: [
                "Plan ",
                invoice.subscription?.plan?.name || "Suscripción"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-[10px] uppercase font-black text-muted-foreground tracking-tighter", children: [
                "Factura #",
                invoice.id
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs(TableCell, { className: "font-black", children: [
              "$",
              Number(invoice.amount).toLocaleString()
            ] }),
            /* @__PURE__ */ jsx(TableCell, { children: getStatusBadge(invoice.status) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right pr-6", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
              /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", asChild: true, className: "h-8 cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: /* @__PURE__ */ jsxs(Link, { href: route("tenant.invoices.show", { tenant: currentTenant?.slug, invoice: invoice.id }), children: [
                /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4 mr-1" }),
                " Ver Detalle"
              ] }) }),
              invoice.status === "pending" && /* @__PURE__ */ jsxs(Button, { size: "sm", className: "h-8 shadow-sm cursor-pointer ring-0 hover:ring-0 focus:ring-0", onClick: () => handleUploadClick(invoice), children: [
                /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4 mr-1" }),
                " Subir Pago"
              ] })
            ] }) })
          ] }, invoice.id)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 5, className: "text-center py-12 text-slate-400 font-medium italic", children: "No tienes facturas generadas aún." }) }) })
        ] }) })
      ] })
    ] }),
    selectedInvoice && /* @__PURE__ */ jsx(
      PaymentUploadModal,
      {
        isOpen: isUploadOpen,
        onClose: () => {
          setIsUploadOpen(false);
          setSelectedInvoice(null);
        },
        invoice: selectedInvoice
      }
    )
  ] });
}
export {
  Index as default
};
