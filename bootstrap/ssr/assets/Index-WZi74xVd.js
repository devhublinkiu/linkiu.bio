import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CdwLWQ00.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { toast } from "sonner";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, d as CardContent } from "./card-BaovBWX5.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { E as Empty, a as EmptyHeader, e as EmptyMedia, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { Headphones, Plus, Loader2, Edit, Trash2 } from "lucide-react";
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
import "@radix-ui/react-label";
import "@radix-ui/react-switch";
import "@radix-ui/react-alert-dialog";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
function Index({ config, episodes }) {
  const { currentTenant, currentUserRole } = usePage().props;
  const [pageTitle, setPageTitle] = useState(config.page_title);
  const [savingTitle, setSavingTitle] = useState(false);
  const [episodeToDelete, setEpisodeToDelete] = useState(null);
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
  const savePageTitle = () => {
    setSavingTitle(true);
    router.put(route("tenant.admin.audio-dosis.update-config", currentTenant?.slug), { page_title: pageTitle }, {
      preserveScroll: true,
      onSuccess: () => toast.success("Título guardado"),
      onError: () => toast.error("No se pudo guardar"),
      onFinish: () => setSavingTitle(false)
    });
  };
  const handleDelete = () => {
    if (!episodeToDelete) return;
    router.delete(route("tenant.admin.audio-dosis.destroy", [currentTenant?.slug, episodeToDelete.id]), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Episodio eliminado");
        setEpisodeToDelete(null);
      },
      onError: () => toast.error("No se pudo eliminar")
    });
  };
  const togglePublished = (ep) => {
    if (togglingId !== null) return;
    setTogglingId(ep.id);
    router.patch(route("tenant.admin.audio-dosis.toggle-published", [currentTenant?.slug, ep.id]), {}, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(ep.is_published ? "Episodio despublicado" : "Episodio publicado");
        setTogglingId(null);
      },
      onError: () => {
        toast.error("Error al actualizar");
        setTogglingId(null);
      }
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Audio Dosis", children: [
    /* @__PURE__ */ jsx(Head, { title: "Audio Dosis" }),
    /* @__PURE__ */ jsx(PermissionDeniedModal, { open: showPermissionModal, onOpenChange: setShowPermissionModal }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold tracking-tight flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Headphones, { className: "size-6 text-primary" }),
            "Audio Dosis"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Episodios de audio. El título de la página pública se puede personalizar abajo." })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: () => withPermission("audio_dosis.create", () => router.visit(route("tenant.admin.audio-dosis.create", currentTenant?.slug))),
            className: "gap-2 shrink-0",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
              " Nuevo episodio"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "page_title", children: "Título de la página pública" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "page_title",
              value: pageTitle,
              onChange: (e) => setPageTitle(e.target.value),
              onBlur: savePageTitle,
              placeholder: "Ej: Audio Dosis"
            }
          )
        ] }),
        savingTitle && /* @__PURE__ */ jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsx(Loader2, { className: "size-5 animate-spin text-muted-foreground" }) })
      ] }) }) }),
      episodes.data.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-16", children: /* @__PURE__ */ jsxs(Empty, { children: [
        /* @__PURE__ */ jsxs(EmptyHeader, { children: [
          /* @__PURE__ */ jsx(EmptyMedia, { variant: "icon", children: /* @__PURE__ */ jsx(Headphones, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay episodios" }),
          /* @__PURE__ */ jsx(EmptyDescription, { children: "Crea el primer episodio para que aparezca en la página pública." })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            className: "mt-4 gap-2",
            onClick: () => withPermission("audio_dosis.create", () => router.visit(route("tenant.admin.audio-dosis.create", currentTenant?.slug))),
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
              " Crear primer episodio"
            ]
          }
        )
      ] }) }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Título" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Duración" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Orden" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Publicado" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: episodes.data.map((ep) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: ep.title }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: formatDuration(ep.duration_seconds) }),
            /* @__PURE__ */ jsx(TableCell, { children: ep.sort_order }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
              Switch,
              {
                checked: ep.is_published,
                onCheckedChange: () => withPermission("audio_dosis.update", () => togglePublished(ep)),
                disabled: togglingId === ep.id
              }
            ) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route("tenant.admin.audio-dosis.edit", [currentTenant?.slug, ep.id]),
                  className: "inline-flex items-center gap-1 text-sm",
                  children: [
                    /* @__PURE__ */ jsx(Edit, { className: "size-4" }),
                    " Editar"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "text-destructive hover:text-destructive",
                  onClick: () => withPermission("audio_dosis.delete", () => setEpisodeToDelete(ep)),
                  children: /* @__PURE__ */ jsx(Trash2, { className: "size-4" })
                }
              )
            ] }) })
          ] }, ep.id)) })
        ] }) }) }),
        episodes.last_page > 1 && /* @__PURE__ */ jsx(SharedPagination, { links: episodes.links })
      ] })
    ] }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!episodeToDelete, onOpenChange: (open) => !open && setEpisodeToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar episodio?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          'Se eliminará "',
          episodeToDelete?.title,
          '" y su archivo de audio. Esta acción no se puede deshacer.'
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
