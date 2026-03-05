import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CdwLWQ00.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { toast } from "sonner";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, d as CardContent } from "./card-BaovBWX5.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { E as Empty, a as EmptyHeader, e as EmptyMedia, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { Plus, Quote, Edit, Trash2 } from "lucide-react";
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
function TestimonialsIndex({ testimonials }) {
  const { currentTenant, currentUserRole } = usePage().props;
  const [toDelete, setToDelete] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const hasPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner === true || currentUserRole.permissions?.includes("*") === true || currentUserRole.permissions?.includes(permission) === true;
  };
  const withPermission = (permission, fn) => {
    if (hasPermission(permission)) fn();
    else setShowPermissionModal(true);
  };
  const handleDelete = () => {
    if (!toDelete) return;
    router.delete(route("tenant.admin.testimonials.destroy", [currentTenant?.slug, toDelete.id]), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Testimonio eliminado");
        setToDelete(null);
      },
      onError: () => toast.error("No se pudo eliminar")
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Testimonios", children: [
    /* @__PURE__ */ jsx(Head, { title: "Testimonios" }),
    /* @__PURE__ */ jsx(PermissionDeniedModal, { open: showPermissionModal, onOpenChange: setShowPermissionModal }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Testimonios" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Historias, videos y citas de tu comunidad." })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => withPermission("testimonials.create", () => router.visit(route("tenant.admin.testimonials.create", currentTenant?.slug))),
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            " Nuevo testimonio"
          ]
        }
      )
    ] }),
    testimonials.data.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-16", children: /* @__PURE__ */ jsxs(Empty, { children: [
      /* @__PURE__ */ jsxs(EmptyHeader, { children: [
        /* @__PURE__ */ jsx(EmptyMedia, { variant: "icon", children: /* @__PURE__ */ jsx(Quote, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay testimonios" }),
        /* @__PURE__ */ jsx(EmptyDescription, { children: "Añade testimonios en video o texto para compartir lo que Dios está haciendo." })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => withPermission("testimonials.create", () => router.visit(route("tenant.admin.testimonials.create", currentTenant?.slug))),
          className: "gap-2 mt-4",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            " Crear primer testimonio"
          ]
        }
      )
    ] }) }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "w-[80px]", children: "Imagen" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Título" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Autor" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Categoría" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Destacado" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Estado" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: testimonials.data.map((t) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "w-14 h-10 rounded overflow-hidden bg-muted border", children: t.image_url ? /* @__PURE__ */ jsx("img", { src: t.image_url, alt: "", className: "w-full h-full object-cover" }) : t.video_url ? /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-slate-200", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500", children: "Video" }) }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Quote, { className: "w-5 h-5 text-muted-foreground" }) }) }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium max-w-[200px] truncate", children: t.title }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-sm", children: t.author || "—" }),
          /* @__PURE__ */ jsx(TableCell, { children: t.category ? /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: t.category }) : "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: t.is_featured ? /* @__PURE__ */ jsx(Badge, { variant: "default", children: "Destacado" }) : "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: t.is_published ? /* @__PURE__ */ jsx(Badge, { variant: "default", className: "bg-green-600", children: "Publicado" }) : /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Borrador" }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1", children: [
            /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("tenant.admin.testimonials.edit", [currentTenant?.slug, t.id]), "aria-label": "Editar", children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" }) }) }),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                onClick: () => withPermission("testimonials.delete", () => setToDelete(t)),
                "aria-label": "Eliminar",
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 text-destructive" })
              }
            )
          ] }) })
        ] }, t.id)) })
      ] }) }) }),
      /* @__PURE__ */ jsx(SharedPagination, { links: testimonials.links, className: "mt-4" })
    ] }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!toDelete, onOpenChange: (open) => !open && setToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar testimonio?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          'Se eliminará "',
          toDelete?.title,
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
  TestimonialsIndex as default
};
