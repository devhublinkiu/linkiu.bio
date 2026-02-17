import { jsxs, jsx } from "react/jsx-runtime";
import { S as SuperAdminLayout } from "./SuperAdminLayout-rjkAJMgZ.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { I as Input } from "./input-B_4qRSOV.js";
import { E as Empty, a as EmptyHeader, b as EmptyContent, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import { A as AlertDialog, h as AlertDialogTrigger, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import { P as PermissionDeniedModal } from "./dropdown-menu-BCxMx_rd.js";
import { useState } from "react";
import "sonner";
import "./ApplicationLogo-xMpxFOcX.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
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
function Index({ plans }) {
  const { auth } = usePage().props;
  const permissions = auth.permissions || [];
  const hasPermission = (p) => permissions.includes("*") || permissions.includes(p);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const plansList = plans.data || plans;
  const plansLinks = plans.links || [];
  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("plans.index"), { search }, {
      preserveState: true,
      replace: true
    });
  };
  const handleDelete = (id) => {
    if (!hasPermission("sa.plans.delete")) {
      setShowPermissionModal(true);
      return;
    }
    router.delete(route("plans.destroy", id), {
      onSuccess: () => {
      }
    });
  };
  const handleCreateClick = (e) => {
    if (!hasPermission("sa.plans.create")) {
      e.preventDefault();
      setShowPermissionModal(true);
    }
  };
  const handleEditClick = (e) => {
    if (!hasPermission("sa.plans.update")) {
      e.preventDefault();
      setShowPermissionModal(true);
    }
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: "Planes de Suscripción", children: [
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    ),
    /* @__PURE__ */ jsx(Head, { title: "Planes" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto py-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-end gap-4 mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "Planes y Precios" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Gestiona la oferta comercial por verticales y monedas." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 w-full md:w-auto", children: [
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "relative w-full sm:w-80", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-2 h-4 w-4 text-gray-400" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Buscar planes...",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "pl-9"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: route("plans.create"), onClick: handleCreateClick, children: [
            /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
            "Crear Nuevo Plan"
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Listado de Planes" }),
          /* @__PURE__ */ jsxs(CardDescription, { children: [
            "Mostrando ",
            plansList.length,
            " planes registrados."
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Nombre" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Vertical" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Precio Base" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Prueba" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
            ] }) }),
            /* @__PURE__ */ jsxs(TableBody, { children: [
              plansList.map((plan) => /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx("span", { children: plan.name }),
                  plan.is_featured && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-yellow-600 font-bold uppercase tracking-wider", children: "Destacado" })
                ] }) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: plan.vertical?.name || "General" }) }),
                /* @__PURE__ */ jsxs(TableCell, { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: new Intl.NumberFormat("es-CO", { style: "currency", currency: plan.currency }).format(plan.monthly_price) }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: " / mes" })
                ] }),
                /* @__PURE__ */ jsx(TableCell, { children: plan.trial_days > 0 ? /* @__PURE__ */ jsxs(Badge, { variant: "secondary", children: [
                  plan.trial_days,
                  " días"
                ] }) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-sm", children: "-" }) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: plan.is_public ? /* @__PURE__ */ jsx(Badge, { className: "bg-green-500 hover:bg-green-600", children: "Público" }) : /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Oculto" }) }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("plans.show", plan.id), children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 text-gray-500" }) }) }),
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("plans.edit", plan.id), onClick: handleEditClick, children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4 text-blue-600" }) }) }),
                  /* @__PURE__ */ jsxs(AlertDialog, { children: [
                    /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        onClick: (e) => {
                          if (!hasPermission("sa.plans.delete")) {
                            e.preventDefault();
                            setShowPermissionModal(true);
                          }
                        },
                        children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-500" })
                      }
                    ) }),
                    hasPermission("sa.plans.delete") && /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
                      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
                        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar este plan?" }),
                        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Esta acción no se puede deshacer. El plan dejará de estar disponible para nuevas suscripciones." })
                      ] }),
                      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
                        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
                        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: () => handleDelete(plan.id), className: "bg-red-600 hover:bg-red-700", children: "Eliminar" })
                      ] })
                    ] })
                  ] })
                ] }) })
              ] }, plan.id)),
              plansList.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "h-[400px]", children: /* @__PURE__ */ jsxs(Empty, { className: "h-full", children: [
                /* @__PURE__ */ jsx(EmptyHeader, { children: /* @__PURE__ */ jsx("div", { className: "bg-gray-50 p-4 rounded-full mb-4", children: /* @__PURE__ */ jsx(Plus, { className: "h-8 w-8 text-gray-400" }) }) }),
                /* @__PURE__ */ jsxs(EmptyContent, { children: [
                  /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay planes" }),
                  /* @__PURE__ */ jsx(EmptyDescription, { children: "Comienza creando tu primer plan de suscripción para las tiendas." })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(Button, { asChild: true, onClick: handleCreateClick, children: /* @__PURE__ */ jsx(Link, { href: route("plans.create"), children: "Crear Primer Plan" }) }) })
              ] }) }) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsx(SharedPagination, { links: plansLinks }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
