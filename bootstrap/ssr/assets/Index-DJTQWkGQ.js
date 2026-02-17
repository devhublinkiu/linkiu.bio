import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { toast } from "sonner";
import { A as AdminLayout } from "./AdminLayout-C8hB-Nb-.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { P as PermissionDeniedModal, D as DropdownMenu, i as DropdownMenuTrigger, l as DropdownMenuContent, m as DropdownMenuLabel, p as DropdownMenuItem } from "./dropdown-menu-B2I3vWlQ.js";
import { Plus, Shield, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./card-BaovBWX5.js";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-rtCrEhXP.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./input-B_4qRSOV.js";
import "./sheet-BclLUCFD.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-alert-dialog";
function RolesIndex({ auth, roles, currentUserRole, currentTenant }) {
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const checkPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner || currentUserRole.permissions.includes("*") || currentUserRole.permissions.includes(permission);
  };
  const handleProtectedNavigation = (e, permission, url) => {
    e.preventDefault();
    if (checkPermission(permission)) {
      router.visit(url);
    } else {
      setShowPermissionModal(true);
    }
  };
  const handleProtectedDelete = (permission, url) => {
    if (checkPermission(permission)) {
      router.delete(url, {
        onSuccess: () => toast.success("Rol eliminado con éxito")
      });
    } else {
      setShowPermissionModal(true);
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Roles y Permisos", children: [
    /* @__PURE__ */ jsx(Head, { title: "Roles y Permisos" }),
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "Roles y Permisos" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500", children: "Administra los roles y niveles de acceso de tu equipo." })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            className: "cursor-pointer",
            onClick: (e) => handleProtectedNavigation(e, "roles.create", route("tenant.roles.create", { tenant: currentTenant?.slug })),
            children: [
              /* @__PURE__ */ jsx(Plus, {}),
              "Crear Nuevo Rol"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "w-[300px]", children: "Nombre del Rol" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Permisos Asignados" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Tipo" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsxs(TableBody, { children: [
          roles.map((role) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Shield, { className: "h-4 w-4 text-muted-foreground" }),
              role.name
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "font-mono", children: [
              role.permissions_count,
              " permisos"
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { children: role.is_system ? /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Sistema" }) : /* @__PURE__ */ jsx(Badge, { variant: "outline", children: "Personalizado" }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 cursor-pointer", children: [
                /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Abrir menú" })
              ] }) }),
              /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Acciones" }),
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0",
                    onClick: (e) => handleProtectedNavigation(e, "roles.update", route("tenant.roles.edit", { tenant: currentTenant?.slug, role: role.id })),
                    children: [
                      /* @__PURE__ */ jsx(Edit, { className: "mr-2 h-4 w-4" }),
                      "Editar Permisos"
                    ]
                  }
                ),
                !role.is_system && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    variant: "destructive",
                    className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0",
                    onSelect: () => setRoleToDelete(role),
                    children: [
                      /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                      "Eliminar Rol"
                    ]
                  }
                ) })
              ] })
            ] }) })
          ] }, role.id)),
          roles.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, className: "h-24 text-center text-slate-500", children: "No hay roles creados." }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!roleToDelete, onOpenChange: (open) => !open && setRoleToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar Rol?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "¿Estás seguro de que deseas eliminar el rol ",
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: roleToDelete?.name }),
          "? Esta acción no se puede deshacer."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: "Cancelar" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: () => {
              handleProtectedDelete("roles.delete", route("tenant.roles.destroy", { tenant: currentTenant?.slug, role: roleToDelete?.id }));
              setRoleToDelete(null);
            },
            variant: "destructive",
            className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0",
            children: "Eliminar"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  RolesIndex as default
};
