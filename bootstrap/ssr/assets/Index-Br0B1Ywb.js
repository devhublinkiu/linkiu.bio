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
import { Banknote, ExternalLink, Loader2, CheckCircle2 } from "lucide-react";
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
const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-300"
};
function Index({ donations, statusLabels }) {
  const { currentTenant, currentUserRole } = usePage().props;
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);
  const urlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const currentStatus = urlParams.get("status") ?? "";
  const hasPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner === true || currentUserRole.permissions?.includes("*") === true || currentUserRole.permissions?.includes(permission) === true;
  };
  const withPermission = (permission, fn) => {
    if (hasPermission(permission)) fn();
    else setShowPermissionModal(true);
  };
  const setStatusFilter = (status) => {
    const params = {};
    if (status) params.status = status;
    router.get(route("tenant.admin.donations.index", currentTenant?.slug), params, {
      preserveState: true
    });
  };
  const confirmDonation = (d) => {
    if (d.status === "confirmed") return;
    setConfirmingId(d.id);
    router.patch(route("tenant.admin.donations.confirm", [currentTenant?.slug, d.id]), {}, {
      preserveScroll: true,
      onSuccess: () => toast.success("Donación confirmada"),
      onError: () => toast.error("No se pudo confirmar"),
      onFinish: () => setConfirmingId(null)
    });
  };
  const formatDate = (d) => new Date(d).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" });
  const formatAmount = (amount, currency) => {
    const n = Number(amount);
    if (!Number.isFinite(n)) return amount;
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: currency || "COP" }).format(n);
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Donaciones", children: [
    /* @__PURE__ */ jsx(Head, { title: "Donaciones" }),
    /* @__PURE__ */ jsx(PermissionDeniedModal, { open: showPermissionModal, onOpenChange: setShowPermissionModal }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Donaciones" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Ofrendas recibidas. Marca como confirmada cuando verifiques el comprobante o la consignación." })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: currentStatus || "all", onValueChange: (v) => setStatusFilter(v === "all" ? "" : v), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Todos los estados" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "pending", children: "Pendientes" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "confirmed", children: "Confirmadas" })
          ] })
        ] })
      ] }),
      donations.data.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-16", children: /* @__PURE__ */ jsx(Empty, { children: /* @__PURE__ */ jsxs(EmptyHeader, { children: [
        /* @__PURE__ */ jsx(EmptyMedia, { variant: "icon", children: /* @__PURE__ */ jsx(Banknote, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay donaciones" }),
        /* @__PURE__ */ jsx(EmptyDescription, { children: "Cuando alguien envíe una donación desde la página pública, aparecerá aquí." })
      ] }) }) }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Fecha" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Donante" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Teléfono" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Monto" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Cuenta" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Comprobante" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: donations.data.map((d) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-sm whitespace-nowrap", children: formatDate(d.created_at) }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: d.donor_name }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: d.donor_phone }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: formatAmount(d.amount, d.currency) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-muted-foreground", children: d.bank_account ? `${d.bank_account.bank_name} · ${d.bank_account.account_number}` : "—" }),
            /* @__PURE__ */ jsx(TableCell, { children: d.proof_url ? /* @__PURE__ */ jsxs(
              "a",
              {
                href: d.proof_url,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "inline-flex items-center gap-1 text-sm text-primary hover:underline",
                children: [
                  /* @__PURE__ */ jsx(ExternalLink, { className: "size-3.5" }),
                  "Ver"
                ]
              }
            ) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-sm", children: "—" }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: STATUS_COLORS[d.status] ?? "", children: statusLabels[d.status] ?? d.status }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: d.status === "pending" && /* @__PURE__ */ jsxs(
              Button,
              {
                size: "sm",
                className: "gap-1",
                onClick: () => withPermission("donations.update", () => confirmDonation(d)),
                disabled: confirmingId === d.id,
                children: [
                  confirmingId === d.id ? /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "size-4" }),
                  "Confirmar"
                ]
              }
            ) })
          ] }, d.id)) })
        ] }) }) }),
        donations.last_page > 1 && /* @__PURE__ */ jsx(SharedPagination, { links: donations.links })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
