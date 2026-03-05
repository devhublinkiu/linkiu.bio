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
import { Plus, BookOpen, Edit, Trash2 } from "lucide-react";
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
function formatDate(d) {
  return new Date(d).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" });
}
function Index({ devotionals }) {
  const { currentTenant, currentUserRole } = usePage().props;
  const [devotionalToDelete, setDevotionalToDelete] = useState(null);
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
    if (!devotionalToDelete) return;
    router.delete(route("tenant.admin.devotionals.destroy", [currentTenant?.slug, devotionalToDelete.id]), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Devocional eliminado correctamente");
        setDevotionalToDelete(null);
      },
      onError: () => toast.error("No se pudo eliminar el devocional")
    });
  };
  const togglePublished = (d) => {
    if (togglingId !== null) return;
    setTogglingId(d.id);
    router.patch(route("tenant.admin.devotionals.toggle-published", [currentTenant?.slug, d.id]), {}, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(d.is_published ? "Devocional despublicado" : "Devocional publicado");
        setTogglingId(null);
      },
      onError: () => {
        toast.error("Error al actualizar");
        setTogglingId(null);
      }
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Devocionales", children: [
    /* @__PURE__ */ jsx(Head, { title: "Devocionales" }),
    /* @__PURE__ */ jsx(PermissionDeniedModal, { open: showPermissionModal, onOpenChange: setShowPermissionModal }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Devocionales" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Reflexiones diarias con título, versículo, reflexión y portada." })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => withPermission("devotionals.create", () => router.visit(route("tenant.admin.devotionals.create", currentTenant?.slug))),
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            " Nuevo devocional"
          ]
        }
      )
    ] }),
    devotionals.data.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-16", children: /* @__PURE__ */ jsxs(Empty, { children: [
      /* @__PURE__ */ jsxs(EmptyHeader, { children: [
        /* @__PURE__ */ jsx(EmptyMedia, { variant: "icon", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay devocionales" }),
        /* @__PURE__ */ jsx(EmptyDescription, { children: "Crea tu primer devocional con título, versículo, reflexión, portada y opcionalmente video o enlace externo." })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => withPermission("devotionals.create", () => router.visit(route("tenant.admin.devotionals.create", currentTenant?.slug))),
          className: "gap-2 mt-4",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            " Crear primer devocional"
          ]
        }
      )
    ] }) }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Card, { className: "hidden md:block", children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "w-[100px]", children: "Portada" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Fecha" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Título" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Versículo" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Publicado" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: devotionals.data.map((d) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "relative w-24 h-14 rounded-lg overflow-hidden bg-muted border", children: d.cover_image ? /* @__PURE__ */ jsx(
            "img",
            {
              src: d.cover_image,
              alt: d.title,
              className: "w-full h-full object-cover"
            }
          ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-6 h-6 text-muted-foreground" }) }) }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-sm whitespace-nowrap", children: formatDate(d.date) }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium max-w-[200px] truncate", children: d.title }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-sm max-w-[140px] truncate", children: d.scripture_reference || "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(
            Switch,
            {
              checked: d.is_published,
              onCheckedChange: () => withPermission("devotionals.update", () => togglePublished(d)),
              disabled: togglingId === d.id,
              "aria-label": d.is_published ? "Despublicar" : "Publicar"
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1", children: [
            /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("tenant.admin.devotionals.edit", [currentTenant?.slug, d.id]), "aria-label": "Editar", children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" }) }) }),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                className: "text-destructive hover:text-destructive hover:bg-destructive/10",
                onClick: () => withPermission("devotionals.delete", () => setDevotionalToDelete(d)),
                "aria-label": "Eliminar",
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
              }
            )
          ] }) })
        ] }, d.id)) })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden space-y-3", children: devotionals.data.map((d) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-lg overflow-hidden bg-muted border flex-shrink-0", children: d.cover_image ? /* @__PURE__ */ jsx("img", { src: d.cover_image, alt: d.title, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-8 h-8 text-muted-foreground" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium truncate", children: d.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: formatDate(d.date) }),
          d.scripture_reference && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: d.scripture_reference }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-3", children: [
            /* @__PURE__ */ jsx(
              Switch,
              {
                checked: d.is_published,
                onCheckedChange: () => withPermission("devotionals.update", () => togglePublished(d)),
                disabled: togglingId === d.id
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("tenant.admin.devotionals.edit", [currentTenant?.slug, d.id]), children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" }) }) }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "text-destructive",
                  onClick: () => withPermission("devotionals.delete", () => setDevotionalToDelete(d)),
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                }
              )
            ] })
          ] })
        ] })
      ] }) }) }, d.id)) }),
      devotionals.last_page > 1 && /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(SharedPagination, { links: devotionals.links }) })
    ] }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!devotionalToDelete, onOpenChange: (open) => !open && setDevotionalToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar devocional?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          'Se eliminará "',
          devotionalToDelete?.title,
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
