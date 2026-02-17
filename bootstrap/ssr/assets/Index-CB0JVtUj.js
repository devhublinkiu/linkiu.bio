import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CvP9QKT2.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { P as PermissionDeniedModal } from "./dropdown-menu-BCxMx_rd.js";
import { toast } from "sonner";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, d as CardContent } from "./card-BaovBWX5.js";
import { MapPin, Plus, Smartphone, Navigation2, Loader2, Eye, Edit, Trash2 } from "lucide-react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-rtCrEhXP.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-slot";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./input-B_4qRSOV.js";
import "./sheet-DFnQxYfh.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "class-variance-authority";
import "@radix-ui/react-switch";
import "@radix-ui/react-alert-dialog";
function Index({ locations, locations_limit, locations_count }) {
  const { currentTenant, currentUserRole } = usePage().props;
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const hasPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner === true || currentUserRole.permissions?.includes("*") === true || currentUserRole.permissions?.includes(permission) === true;
  };
  const atLimit = locations_limit !== null && locations_count >= locations_limit;
  const handleDelete = () => {
    if (!locationToDelete) return;
    if (!hasPermission("locations.delete")) {
      setShowPermissionModal(true);
      return;
    }
    router.delete(route("tenant.locations.destroy", [currentTenant?.slug, locationToDelete.id]), {
      onSuccess: () => {
        toast.success("Sede eliminada correctamente");
        setLocationToDelete(null);
      },
      onError: (errors) => {
        const first = errors?.delete ?? Object.values(errors ?? {})[0];
        const msg = Array.isArray(first) ? first[0] : first;
        setLocationToDelete(null);
        setDeleteErrorMessage(msg || "Error al eliminar la sede");
      }
    });
  };
  const toggleActive = (location) => {
    if (!hasPermission("locations.update")) {
      setShowPermissionModal(true);
      return;
    }
    setTogglingId(location.id);
    !location.is_active;
    router.patch(route("tenant.locations.toggle-active", [currentTenant?.slug, location.id]), {}, {
      preserveScroll: true,
      onSuccess: () => toast.success("Estado actualizado"),
      onError: () => {
        toast.error("No se pudo actualizar el estado");
        setTogglingId(null);
      },
      onFinish: () => setTogglingId(null)
    });
  };
  const handleProtectedAction = (e, permission) => {
    if (!hasPermission(permission)) {
      e.preventDefault();
      e.stopPropagation();
      setShowPermissionModal(true);
    }
  };
  const isEmpty = locations.data.length === 0;
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Gestión de Sedes", children: [
    /* @__PURE__ */ jsx(Head, { title: "Sedes y Puntos de Venta" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold tracking-tight flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "size-6 text-primary" }),
          "Sedes y Puntos de Venta"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
          "Administra las ubicaciones físicas de tu negocio y sus horarios.",
          locations_limit !== null && /* @__PURE__ */ jsxs("span", { className: "ml-1 font-medium text-foreground", children: [
            "(",
            locations_count,
            " / ",
            locations_limit,
            " usados)"
          ] })
        ] })
      ] }),
      atLimit ? /* @__PURE__ */ jsxs(
        Button,
        {
          className: "cursor-pointer font-bold",
          disabled: true,
          title: "Has alcanzado el máximo de sedes permitidas en tu plan",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "mr-2 size-4" }),
            " Nueva Sede"
          ]
        }
      ) : /* @__PURE__ */ jsx(
        Link,
        {
          href: route("tenant.locations.create", currentTenant?.slug),
          onClick: (e) => handleProtectedAction(e, "locations.create"),
          children: /* @__PURE__ */ jsxs(Button, { className: "cursor-pointer font-bold", children: [
            /* @__PURE__ */ jsx(Plus, { className: "mr-2 size-4" }),
            " Nueva Sede"
          ] })
        }
      )
    ] }),
    isEmpty ? /* @__PURE__ */ jsx(Card, { className: "border-dashed", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center justify-center py-16 px-6 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "rounded-full bg-primary/10 p-4 mb-4", children: /* @__PURE__ */ jsx(MapPin, { className: "size-12 text-primary" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 mb-1", children: "No tienes sedes registradas" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6 max-w-sm", children: "Crea tu primera sede para gestionar ubicaciones, horarios y contacto." }),
      !atLimit && /* @__PURE__ */ jsx(Link, { href: route("tenant.locations.create", currentTenant?.slug), children: /* @__PURE__ */ jsxs(Button, { className: "cursor-pointer font-bold", children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-2 size-4" }),
        " Crear primera sede"
      ] }) })
    ] }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Card, { className: "hidden md:block", children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { className: "bg-slate-50", children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Sede" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Ubicación" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Contacto" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center font-bold", children: "Estado" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right font-bold", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: locations.data.map((location) => /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-slate-50/50 transition-colors", children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900", children: location.name }),
              location.is_main && /* @__PURE__ */ jsx(Badge, { className: "bg-blue-100 text-blue-700 border-blue-200 text-[10px] uppercase tracking-wider py-0", children: "Principal" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: location.manager || "Sin encargado" })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col max-w-[250px]", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm truncate", title: location.address || "—", children: location.address || "—" }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground lowercase", children: [
              location.city,
              ", ",
              location.state
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            location.phone && /* @__PURE__ */ jsxs("div", { className: "flex items-center text-xs text-muted-foreground gap-1", children: [
              /* @__PURE__ */ jsx(Smartphone, { className: "size-3" }),
              location.phone
            ] }),
            location.whatsapp && /* @__PURE__ */ jsxs("div", { className: "flex items-center text-xs text-green-600 font-medium gap-1", children: [
              /* @__PURE__ */ jsx(Navigation2, { className: "size-3" }),
              "WhatsApp"
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center", children: [
            /* @__PURE__ */ jsx(
              Switch,
              {
                checked: location.is_active,
                onCheckedChange: () => toggleActive(location),
                disabled: togglingId === location.id,
                className: "cursor-pointer"
              }
            ),
            togglingId === location.id && /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin ml-1 inline text-muted-foreground" })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1", children: [
            /* @__PURE__ */ jsx(Link, { href: route("tenant.locations.show", [currentTenant?.slug, location.id]), children: /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", className: "h-9 w-9 text-slate-600 hover:text-primary hover:bg-primary/5 cursor-pointer", children: /* @__PURE__ */ jsx(Eye, { className: "size-4" }) }) }),
            /* @__PURE__ */ jsx(Link, { href: route("tenant.locations.edit", [currentTenant?.slug, location.id]), onClick: (e) => handleProtectedAction(e, "locations.update"), children: /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", className: "h-9 w-9 text-slate-600 hover:text-primary hover:bg-primary/5 cursor-pointer", children: /* @__PURE__ */ jsx(Edit, { className: "size-4" }) }) }),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                className: "h-9 w-9 text-red-600 hover:bg-red-50 cursor-pointer",
                onClick: (e) => {
                  handleProtectedAction(e, "locations.delete");
                  setLocationToDelete(location);
                },
                children: /* @__PURE__ */ jsx(Trash2, { className: "size-4" })
              }
            )
          ] }) })
        ] }, location.id)) })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden space-y-3", children: locations.data.map((location) => /* @__PURE__ */ jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2 mb-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900", children: location.name }),
              location.is_main && /* @__PURE__ */ jsx(Badge, { className: "bg-blue-100 text-blue-700 border-blue-200 text-[10px] uppercase py-0", children: "Principal" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: location.manager || "Sin encargado" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(
              Switch,
              {
                checked: location.is_active,
                onCheckedChange: () => toggleActive(location),
                disabled: togglingId === location.id,
                className: "cursor-pointer"
              }
            ),
            togglingId === location.id && /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin text-muted-foreground" })
          ] })
        ] }),
        (location.address || location.city) && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate mb-2", children: [location.address, location.city, location.state].filter(Boolean).join(", ") }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1 pt-2 border-t", children: [
          /* @__PURE__ */ jsx(Link, { href: route("tenant.locations.show", [currentTenant?.slug, location.id]), children: /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", className: "h-8 cursor-pointer", children: /* @__PURE__ */ jsx(Eye, { className: "size-4" }) }) }),
          /* @__PURE__ */ jsx(Link, { href: route("tenant.locations.edit", [currentTenant?.slug, location.id]), onClick: (e) => handleProtectedAction(e, "locations.update"), children: /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", className: "h-8 cursor-pointer", children: /* @__PURE__ */ jsx(Edit, { className: "size-4" }) }) }),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "h-8 text-red-600 hover:bg-red-50 cursor-pointer",
              onClick: (e) => {
                handleProtectedAction(e, "locations.delete");
                setLocationToDelete(location);
              },
              children: /* @__PURE__ */ jsx(Trash2, { className: "size-4" })
            }
          )
        ] })
      ] }) }, location.id)) }),
      /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(SharedPagination, { links: locations.links }) })
    ] }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!locationToDelete, onOpenChange: (open) => !open && setLocationToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { className: "border-red-100", children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar esta sede?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "La sede ",
          /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900", children: locationToDelete?.name }),
          " se eliminará de forma permanente.",
          locationToDelete && !locationToDelete.is_main && " Se perderán los datos de contacto y ubicación asociados.",
          locationToDelete?.is_main && " No se puede eliminar la sede principal."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { className: "cursor-pointer", children: "Cancelar" }),
        locationToDelete && !locationToDelete.is_main && /* @__PURE__ */ jsx(AlertDialogAction, { variant: "destructive", onClick: handleDelete, className: "cursor-pointer", children: "Eliminar sede" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!deleteErrorMessage, onOpenChange: (open) => !open && setDeleteErrorMessage(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { className: "border-amber-200", children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "No se puede eliminar la sede" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { className: "text-left", children: deleteErrorMessage })
      ] }),
      /* @__PURE__ */ jsx(AlertDialogFooter, { children: /* @__PURE__ */ jsx(AlertDialogAction, { onClick: () => setDeleteErrorMessage(null), className: "cursor-pointer", children: "Entendido" }) })
    ] }) }),
    /* @__PURE__ */ jsx(PermissionDeniedModal, { open: showPermissionModal, onOpenChange: setShowPermissionModal })
  ] });
}
export {
  Index as default
};
