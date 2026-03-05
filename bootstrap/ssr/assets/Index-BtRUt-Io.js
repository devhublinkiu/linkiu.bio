import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CdwLWQ00.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { toast } from "sonner";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, d as CardContent } from "./card-BaovBWX5.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { E as Empty, a as EmptyHeader, e as EmptyMedia, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { Plus, Briefcase, Edit, Trash2 } from "lucide-react";
import { P as PermissionDeniedModal } from "./dropdown-menu-Dkgv2tnp.js";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import "./echo-DaX0krWj.js";
import "@ably/laravel-echo";
import "ably";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./badge-C_PGNHO8.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-vY7u-Ro3.js";
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
function Index({ services }) {
  const { currentTenant, currentUserRole } = usePage().props;
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const hasPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner === true || currentUserRole.permissions?.includes("*") === true || currentUserRole.permissions?.includes(permission) === true;
  };
  const withPermission = (permission, fn) => {
    if (hasPermission(permission)) fn();
    else setShowPermissionModal(true);
  };
  const handleDelete = () => {
    if (!serviceToDelete) return;
    router.delete(route("tenant.admin.services.destroy", [currentTenant?.slug, serviceToDelete.id]), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Servicio eliminado correctamente");
        setServiceToDelete(null);
      },
      onError: () => toast.error("No se pudo eliminar el servicio")
    });
  };
  const toggleActive = (service) => {
    if (togglingId !== null) return;
    setTogglingId(service.id);
    router.put(route("tenant.admin.services.update", [currentTenant?.slug, service.id]), {
      name: service.name,
      description: service.description ?? "",
      schedule: service.schedule ?? "",
      location: service.location ?? "",
      image_url: service.image_url ?? "",
      order: service.order,
      is_active: !service.is_active
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(service.is_active ? "Servicio desactivado" : "Servicio activado");
        setTogglingId(null);
      },
      onError: () => {
        toast.error("Error al actualizar");
        setTogglingId(null);
      }
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Mis Servicios", children: [
    /* @__PURE__ */ jsx(Head, { title: "Mis Servicios" }),
    /* @__PURE__ */ jsx(PermissionDeniedModal, { open: showPermissionModal, onOpenChange: setShowPermissionModal }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Mis Servicios" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Cultos, reuniones y actividades que ofrece tu iglesia." })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => withPermission("services.create", () => router.visit(route("tenant.admin.services.create", currentTenant?.slug))),
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            " Nuevo servicio"
          ]
        }
      )
    ] }),
    services.data.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-16", children: /* @__PURE__ */ jsxs(Empty, { children: [
      /* @__PURE__ */ jsxs(EmptyHeader, { children: [
        /* @__PURE__ */ jsx(EmptyMedia, { variant: "icon", children: /* @__PURE__ */ jsx(Briefcase, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay servicios creados" }),
        /* @__PURE__ */ jsx(EmptyDescription, { children: "Añade cultos, reuniones, estudios bíblicos o cualquier actividad que ofrezca tu iglesia. Luego podrás mostrarlos en tu enlace." })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => withPermission("services.create", () => router.visit(route("tenant.admin.services.create", currentTenant?.slug))),
          className: "gap-2 mt-4",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            " Crear primer servicio"
          ]
        }
      )
    ] }) }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Card, { className: "hidden md:block", children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "w-[100px]", children: "Imagen" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[40px]", children: "#" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Nombre" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Horario" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Estado" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: services.data.map((service) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "relative w-24 h-12 rounded-lg overflow-hidden bg-muted border", children: service.image_url ? /* @__PURE__ */ jsx(
            "img",
            {
              src: service.image_url,
              alt: service.name,
              className: "w-full h-full object-cover"
            }
          ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Briefcase, { className: "w-6 h-6 text-muted-foreground" }) }) }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground font-mono text-xs", children: service.order }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: service.name }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-sm", children: service.schedule || "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(
            Switch,
            {
              checked: service.is_active,
              onCheckedChange: () => withPermission("services.update", () => toggleActive(service)),
              disabled: togglingId === service.id,
              "aria-label": service.is_active ? "Desactivar" : "Activar"
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                asChild: true,
                children: /* @__PURE__ */ jsx(Link, { href: route("tenant.admin.services.edit", [currentTenant?.slug, service.id]), "aria-label": "Editar", children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" }) })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                className: "text-destructive hover:text-destructive hover:bg-destructive/10",
                onClick: () => withPermission("services.delete", () => setServiceToDelete(service)),
                "aria-label": "Eliminar",
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
              }
            )
          ] }) })
        ] }, service.id)) })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden space-y-3", children: services.data.map((service) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-lg overflow-hidden bg-muted border flex-shrink-0", children: service.image_url ? /* @__PURE__ */ jsx("img", { src: service.image_url, alt: service.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Briefcase, { className: "w-8 h-8 text-muted-foreground" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium truncate", children: service.name }),
          service.schedule && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: service.schedule }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-3", children: [
            /* @__PURE__ */ jsx(
              Switch,
              {
                checked: service.is_active,
                onCheckedChange: () => withPermission("services.update", () => toggleActive(service)),
                disabled: togglingId === service.id
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("tenant.admin.services.edit", [currentTenant?.slug, service.id]), children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" }) }) }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "text-destructive",
                  onClick: () => withPermission("services.delete", () => setServiceToDelete(service)),
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                }
              )
            ] })
          ] })
        ] })
      ] }) }) }, service.id)) }),
      services.last_page > 1 && /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(SharedPagination, { links: services.links }) })
    ] }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!serviceToDelete, onOpenChange: (open) => !open && setServiceToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar servicio?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          'Se eliminará "',
          serviceToDelete?.name,
          '". Esta acción no se puede deshacer.'
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: handleDelete,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: "Eliminar"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
