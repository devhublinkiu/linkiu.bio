import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { S as SuperAdminLayout } from "./SuperAdminLayout-C_fBwscp.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { P as PermissionDeniedModal, T as TooltipProvider, H as Tooltip, I as TooltipTrigger, J as TooltipContent } from "./dropdown-menu-B2I3vWlQ.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { Plus, Shield, Pencil, Trash2 } from "lucide-react";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import "sonner";
import "./ApplicationLogo-xMpxFOcX.js";
import "@radix-ui/react-slot";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./input-B_4qRSOV.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BclLUCFD.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "class-variance-authority";
import "@radix-ui/react-alert-dialog";
function Index({ roles }) {
  const { auth } = usePage().props;
  const permissions = auth.permissions || [];
  const hasPermission = (p) => permissions.includes("*") || permissions.includes(p);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingRole, setDeletingRole] = useState(null);
  const handleDelete = (role) => {
    if (!hasPermission("sa.roles.delete")) {
      setShowPermissionModal(true);
      return;
    }
    setDeletingRole(role);
    setDeleteOpen(true);
  };
  const confirmDelete = () => {
    if (deletingRole) {
      router.delete(route("roles.destroy", deletingRole.id), {
        onSuccess: () => setDeleteOpen(false)
      });
    }
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: "Gestión de Roles Globales", children: [
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    ),
    /* @__PURE__ */ jsx(Head, { title: "Roles Globales" }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold tracking-tight text-foreground", children: "Roles del Sistema" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Define los roles y permisos globales para los administradores." })
      ] }),
      /* @__PURE__ */ jsx(Button, { asChild: true, className: "cursor-pointer", children: /* @__PURE__ */ jsxs(Link, { href: route("roles.create"), onClick: (e) => {
        if (!hasPermission("sa.roles.create")) {
          e.preventDefault();
          setShowPermissionModal(true);
        }
      }, children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "Crear Nuevo Rol"
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-card rounded-md border border-border", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Nombre del Rol" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Usuarios Asignados" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Guard" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: roles.data.map((role) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Shield, { className: "h-4 w-4 text-primary" }),
          role.name,
          role.name === "Super Admin" && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20 uppercase", children: "Sistema" })
        ] }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border", children: [
          role.users_count,
          " usuarios"
        ] }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-xs", children: role.guard_name }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right space-x-2", children: role.name !== "Super Admin" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "cursor-pointer", children: /* @__PURE__ */ jsx(Link, { href: route("roles.edit", role.id), onClick: (e) => {
            if (!hasPermission("sa.roles.update")) {
              e.preventDefault();
              setShowPermissionModal(true);
            }
          }, children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4 text-gray-500" }) }) }),
          role.users_count > 0 ? /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(Tooltip, { children: [
            /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx("span", { tabIndex: 0, children: /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "text-gray-300 cursor-not-allowed",
                disabled: true,
                children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
              }
            ) }) }),
            /* @__PURE__ */ jsx(TooltipContent, { children: /* @__PURE__ */ jsx("p", { children: "No se puede eliminar: tiene usuarios asignados" }) })
          ] }) }) : /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer",
              onClick: () => handleDelete(role),
              children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] }) })
      ] }, role.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: deleteOpen, onOpenChange: setDeleteOpen, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar este rol?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "Estás a punto de eliminar el rol ",
          /* @__PURE__ */ jsx("strong", { children: deletingRole?.name }),
          ". Esta acción no se puede deshacer."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { className: "cursor-pointer", children: "Cancelar" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: confirmDelete, className: "bg-red-600 hover:bg-red-700 cursor-pointer", children: "Eliminar Rol" })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
