import { jsxs, jsx } from "react/jsx-runtime";
import { S as SuperAdminLayout } from "./SuperAdminLayout-DVPOojgY.js";
import { Head, router } from "@inertiajs/react";
import { C as Card, d as CardContent, a as CardHeader, b as CardTitle, c as CardDescription } from "./card-BaovBWX5.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { Search, CreditCard, Calendar } from "lucide-react";
import { useState } from "react";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import { E as Empty, a as EmptyHeader, b as EmptyContent, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import "./button-BdX_X5dq.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./dropdown-menu-Dkgv2tnp.js";
import "vaul";
import "axios";
import "sonner";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./echo-DaX0krWj.js";
import "@ably/laravel-echo";
import "ably";
import "./ApplicationLogo-xMpxFOcX.js";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
function Index({ subscriptions, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "all");
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("subscriptions.index"), { search, status }, { preserveState: true });
  };
  const handleStatusChange = (value) => {
    setStatus(value);
    router.get(route("subscriptions.index"), { search, status: value }, { preserveState: true });
  };
  const getStatusBadge = (status2) => {
    switch (status2) {
      case "active":
        return /* @__PURE__ */ jsx(Badge, { className: "bg-green-600", children: "Activa" });
      case "trialing":
        return /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-blue-100 text-blue-700", children: "En Prueba" });
      case "past_due":
        return /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: "En Mora" });
      case "cancelled":
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-gray-500", children: "Cancelada" });
      case "expired":
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-gray-500", children: "Expirada" });
      default:
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", children: status2 });
    }
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: "Gestión de Suscripciones", children: [
    /* @__PURE__ */ jsx(Head, { title: "Suscripciones" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(Card, { className: "mb-6", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-between items-center", children: [
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "relative w-full sm:w-80", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-2 h-4 w-4 text-gray-400" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "Buscar por ID de cliente o tienda...",
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
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las suscripciones" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "active", children: "Activas" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "trialing", children: "En Prueba" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "past_due", children: "En Mora" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "cancelled", children: "Canceladas" })
            ] })
          ] })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Listado de Suscripciones" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Visualiza el estado de las suscripciones de tus clientes." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "ID Suscripción" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Tienda" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Plan" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Ciclo" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Próximo Pago" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: subscriptions.data.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "h-[400px]", children: /* @__PURE__ */ jsxs(Empty, { className: "h-full", children: [
              /* @__PURE__ */ jsx(EmptyHeader, { children: /* @__PURE__ */ jsx("div", { className: "bg-gray-50 p-4 rounded-full mb-4", children: /* @__PURE__ */ jsx(CreditCard, { className: "h-8 w-8 text-gray-400" }) }) }),
              /* @__PURE__ */ jsxs(EmptyContent, { children: [
                /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay suscripciones" }),
                /* @__PURE__ */ jsx(EmptyDescription, { children: "Aún no se han registrado suscripciones activas en el sistema." })
              ] })
            ] }) }) }) : subscriptions.data.map((sub) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxs(TableCell, { className: "text-xs font-medium text-muted-foreground whitespace-nowrap", children: [
                "#",
                sub.id
              ] }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: sub.tenant?.name || `Tienda #${sub.tenant?.id}` }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: sub.plan?.name }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  new Intl.NumberFormat("es-CO", { style: "currency", currency: sub.plan?.currency || "COP" }).format(sub.plan?.monthly_price || 0),
                  "/mes"
                ] })
              ] }) }),
              /* @__PURE__ */ jsx(TableCell, { children: getStatusBadge(sub.status) }),
              /* @__PURE__ */ jsx(TableCell, { className: "capitalize", children: sub.billing_cycle === "monthly" ? "Mensual" : sub.billing_cycle === "yearly" ? "Anual" : sub.billing_cycle === "quarterly" ? "Trimestral" : sub.billing_cycle === "weekly" ? "Semanal" : sub.billing_cycle === "daily" ? "Diario" : sub.billing_cycle }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }),
                sub.next_payment_date ? new Date(sub.next_payment_date).toLocaleDateString() : "-"
              ] }) })
            ] }, sub.id)) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsx(SharedPagination, { links: subscriptions.links }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
