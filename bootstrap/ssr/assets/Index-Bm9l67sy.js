import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CegS7XIj.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, d as CardContent } from "./card-BaovBWX5.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { E as Empty, a as EmptyHeader, e as EmptyMedia, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import { Plus, Video, Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import { P as PermissionDeniedModal } from "./dropdown-menu-Dkgv2tnp.js";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./badge-C_PGNHO8.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-rtCrEhXP.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-switch";
import "@radix-ui/react-alert-dialog";
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
function Index({ shorts, shorts_limit, shorts_count }) {
  const { currentTenant, currentUserRole } = usePage().props;
  const [shortToDelete, setShortToDelete] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const atLimit = shorts_limit !== null && shorts_count >= shorts_limit;
  const hasPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner === true || currentUserRole.permissions?.includes("*") === true || currentUserRole.permissions?.includes(permission) === true;
  };
  const handleDelete = () => {
    if (!shortToDelete) return;
    if (!hasPermission("shorts.delete")) {
      setShowPermissionModal(true);
      return;
    }
    router.delete(route("tenant.shorts.destroy", [currentTenant?.slug, shortToDelete.id]), {
      onSuccess: () => {
        toast.success("Short eliminado");
        setShortToDelete(null);
      }
    });
  };
  const toggleActive = (short) => {
    if (!hasPermission("shorts.update")) {
      setShowPermissionModal(true);
      return;
    }
    setTogglingId(short.id);
    router.patch(route("tenant.shorts.toggle-active", [currentTenant?.slug, short.id]), {}, {
      onSuccess: () => toast.success("Estado actualizado"),
      onFinish: () => setTogglingId(null)
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Shorts", children: [
    /* @__PURE__ */ jsx(Head, { title: "Shorts" }),
    /* @__PURE__ */ jsx(PermissionDeniedModal, { open: showPermissionModal, onOpenChange: setShowPermissionModal }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Shorts" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Gestiona los shorts promocionales por sede.",
          shorts_limit !== null && /* @__PURE__ */ jsxs("span", { className: "ml-1 font-medium text-foreground", children: [
            "(",
            shorts_count,
            " / ",
            shorts_limit,
            " usados)"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          asChild: true,
          disabled: atLimit,
          title: atLimit ? "Has alcanzado el máximo de shorts permitidos en tu plan" : void 0,
          children: /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("tenant.shorts.create", currentTenant?.slug),
              onClick: (e) => {
                if (!hasPermission("shorts.create")) {
                  e.preventDefault();
                  setShowPermissionModal(true);
                }
                if (atLimit) e.preventDefault();
              },
              className: "gap-2",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                " Nuevo short"
              ]
            }
          )
        }
      )
    ] }),
    shorts.data.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-16", children: /* @__PURE__ */ jsxs(Empty, { children: [
      /* @__PURE__ */ jsxs(EmptyHeader, { children: [
        /* @__PURE__ */ jsx(EmptyMedia, { variant: "icon", children: /* @__PURE__ */ jsx(Video, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay shorts creados" }),
        /* @__PURE__ */ jsx(EmptyDescription, { children: "Crea shorts por sede con enlace a categoría, producto o URL para mostrar en la portada." })
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          asChild: true,
          disabled: atLimit,
          className: "gap-2 mt-4",
          children: /* @__PURE__ */ jsxs(Link, { href: route("tenant.shorts.create", currentTenant?.slug), children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            " Crear primer short"
          ] })
        }
      )
    ] }) }) }) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-0", children: [
      /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Nombre" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Sede" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Enlace" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-20 text-center", children: "Orden" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-24 text-center", children: "Activo" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[120px] text-right", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: shorts.data.map((short) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxs(TableCell, { children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: short.name }),
            short.description && /* @__PURE__ */ jsx("span", { className: "block text-xs text-muted-foreground truncate max-w-[200px]", children: short.description })
          ] }),
          /* @__PURE__ */ jsx(TableCell, { children: short.location?.name ?? "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-sm max-w-[180px] truncate", title: short.link_label, children: short.link_label || "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: short.sort_order }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: togglingId === short.id ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin mx-auto" }) : /* @__PURE__ */ jsx(
            Switch,
            {
              checked: short.is_active,
              onCheckedChange: () => toggleActive(short),
              disabled: !hasPermission("shorts.update")
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                asChild: true,
                onClick: (e) => !hasPermission("shorts.update") && (e.preventDefault(), setShowPermissionModal(true)),
                children: /* @__PURE__ */ jsx(Link, { href: route("tenant.shorts.edit", [currentTenant?.slug, short.id]), children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" }) })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: () => {
                  if (hasPermission("shorts.delete")) setShortToDelete(short);
                  else setShowPermissionModal(true);
                },
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 text-destructive" })
              }
            )
          ] }) })
        ] }, short.id)) })
      ] }),
      shorts.last_page > 1 && /* @__PURE__ */ jsx(
        SharedPagination,
        {
          links: shorts.links,
          className: "border-t p-2"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!shortToDelete, onOpenChange: (open) => !open && setShortToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar short?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          'Se eliminará "',
          shortToDelete?.name,
          '". Esta acción no se puede deshacer.'
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: handleDelete, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Eliminar" })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
