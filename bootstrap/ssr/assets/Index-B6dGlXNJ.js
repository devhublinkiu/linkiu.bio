import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { S as SuperAdminLayout } from "./SuperAdminLayout-C_fBwscp.js";
import { usePage, router, useForm, Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { C as Checkbox } from "./checkbox-dJXZmgY3.js";
import { P as PermissionDeniedModal, A as Avatar, j as AvatarImage, k as AvatarFallback } from "./dropdown-menu-B2I3vWlQ.js";
import { Plus, Search, Mail, ShieldCheck, Store, Pencil, Trash2 } from "lucide-react";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import "sonner";
import "./ApplicationLogo-xMpxFOcX.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-dialog";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-select";
import "@radix-ui/react-checkbox";
import "vaul";
import "axios";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BclLUCFD.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
function Index({ users, filters, roles }) {
  const { auth } = usePage().props;
  const permissions = auth.permissions || [];
  const hasPermission = (p) => permissions.includes("*") || permissions.includes(p);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [search, setSearch] = useState(filters.search || "");
  const [roleFilter, setRoleFilter] = useState(filters.role || "all");
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== filters.search) {
        router.get(route("users.index"), {
          search,
          role: roleFilter === "all" ? "" : roleFilter
        }, { preserveState: true, replace: true });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  const handleRoleChange = (value) => {
    setRoleFilter(value);
    router.get(route("users.index"), {
      search,
      role: value === "all" ? "" : value
    }, { preserveState: true, replace: true });
  };
  const { data: editData, setData: setEditData, put: editPut, processing: editProcessing, errors: editErrors, reset: editReset } = useForm({
    name: "",
    email: "",
    is_super_admin: false,
    role_id: null
  });
  const submitEdit = (e) => {
    e.preventDefault();
    editPut(route("users.update", editingUser.id), {
      onSuccess: () => {
        setEditOpen(false);
        setEditingUser(null);
      }
    });
  };
  const handleCreateClick = (e) => {
    if (!hasPermission("sa.users.create")) {
      e.preventDefault();
      setShowPermissionModal(true);
    }
  };
  const openEdit = (user) => {
    if (!hasPermission("sa.users.update")) {
      setShowPermissionModal(true);
      return;
    }
    setEditingUser(user);
    setEditData({
      name: user.name,
      email: user.email,
      is_super_admin: Boolean(user.is_super_admin),
      role_id: user.role_id
    });
    setEditOpen(true);
  };
  const openDelete = (user) => {
    if (!hasPermission("sa.users.delete")) {
      setShowPermissionModal(true);
      return;
    }
    setDeletingUser(user);
    setDeleteOpen(true);
  };
  const submitDelete = () => {
    if (!deletingUser) return;
    router.delete(route("users.destroy", deletingUser.id), {
      onSuccess: () => setDeleteOpen(false)
    });
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: "Gestión de Usuarios", children: [
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    ),
    /* @__PURE__ */ jsx(Head, { title: "Usuarios" }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Directorio de Usuarios" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Administra todos los usuarios registrados en la plataforma." })
      ] }),
      /* @__PURE__ */ jsx(Button, { asChild: true, className: "cursor-pointer", children: /* @__PURE__ */ jsxs(Link, { href: route("users.create"), onClick: handleCreateClick, children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "Nuevo Usuario"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-sm", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "search",
            placeholder: "Buscar por nombre o email...",
            className: "pl-9 bg-card",
            value: search,
            onChange: (e) => setSearch(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: roleFilter, onValueChange: handleRoleChange, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[200px] bg-card", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Filtrar por Rol" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los Roles" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "superadmin", children: "Super Admins" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "user", children: "Usuarios" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl border overflow-hidden", children: [
      /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Usuario" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Rol" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Tenants Asociados" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Fecha Registro" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: users.data.map((user) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs(Avatar, { className: "h-9 w-9", children: [
              /* @__PURE__ */ jsx(AvatarImage, { src: `https://ui-avatars.com/api/?name=${user.name}&background=random` }),
              /* @__PURE__ */ jsx(AvatarFallback, { children: user.name.substring(0, 2).toUpperCase() })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: user.name }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400 flex items-center", children: [
                /* @__PURE__ */ jsx(Mail, { className: "h-3 w-3 mr-1" }),
                user.email
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { children: user.is_super_admin ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary uppercase tracking-tight ring-1 ring-inset ring-primary/20", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3 w-3" }),
            "Super Admin"
          ] }) : /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-tight ring-1 ring-inset ring-border", children: user.global_role ? user.global_role.name : "Usuario" }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: user.tenants && user.tenants.length > 0 ? user.tenants.map((t) => /* @__PURE__ */ jsxs(
            Link,
            {
              href: `#`,
              className: "inline-flex items-center px-1.5 py-0.5 rounded bg-muted/50 text-[10px] font-medium text-primary hover:bg-muted transition-colors border border-border",
              children: [
                /* @__PURE__ */ jsx(Store, { className: "h-2.5 w-2.5 mr-1" }),
                t.name
              ]
            },
            t.id
          )) : /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground/60 italic", children: "Sin tiendas" }) }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-gray-500 text-xs", children: new Date(user.created_at).toLocaleDateString() }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-right space-x-1", children: [
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon-xs", onClick: () => openEdit(user), children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5 text-muted-foreground" }) }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon-xs",
                className: "text-destructive hover:text-destructive hover:bg-destructive/10",
                onClick: () => openDelete(user),
                disabled: user.tenants && user.tenants.length > 0 || user.id === auth.user.id,
                title: user.id === auth.user.id ? "No puedes eliminar tu propia cuenta" : user.tenants && user.tenants.length > 0 ? "No se puede eliminar usuario con tiendas activas" : "Eliminar usuario",
                children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] }, user.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-t flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-medium text-muted-foreground", children: [
          "Mostrando ",
          /* @__PURE__ */ jsx("span", { className: "text-foreground", children: users.from }),
          " a ",
          /* @__PURE__ */ jsx("span", { className: "text-foreground", children: users.to }),
          " de ",
          /* @__PURE__ */ jsx("span", { className: "text-foreground", children: users.total }),
          " usuarios"
        ] }),
        /* @__PURE__ */ jsx(SharedPagination, { links: users.links })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: editOpen, onOpenChange: setEditOpen, children: /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-[425px]", children: /* @__PURE__ */ jsxs("form", { onSubmit: submitEdit, children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Editar Usuario" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Modifica los detalles del usuario." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "e-name", children: "Nombre" }),
          /* @__PURE__ */ jsx(Input, { id: "e-name", value: editData.name, onChange: (e) => setEditData("name", e.target.value), required: true }),
          editErrors.name && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs", children: editErrors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "e-email", children: "Email" }),
          /* @__PURE__ */ jsx(Input, { id: "e-email", type: "email", value: editData.email, onChange: (e) => setEditData("email", e.target.value), required: true }),
          editErrors.email && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs", children: editErrors.email })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "e-role", children: "Rol Global" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              onValueChange: (value) => setEditData("role_id", value === "none" ? null : Number(value)),
              value: editData.role_id ? String(editData.role_id) : "none",
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { id: "e-role", className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar un rol..." }) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "-- Ningún Rol (Usuario Normal) --" }),
                  roles.map((role) => /* @__PURE__ */ jsx(SelectItem, { value: String(role.id), children: role.name }, role.id))
                ] })
              ]
            }
          ),
          editErrors.role_id && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs", children: editErrors.role_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 mt-2 border p-3 rounded-xl bg-primary/5 border-primary/10", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              id: "e-super",
              checked: editData.is_super_admin,
              onCheckedChange: (checked) => setEditData("is_super_admin", checked === true)
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5 leading-none", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "e-super", className: "text-sm font-semibold leading-none cursor-pointer text-primary", children: "Es Super Administrador" }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground font-medium uppercase tracking-tight", children: "Acceso total al panel de control" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: editProcessing, children: "Actualizar" }) })
    ] }) }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: deleteOpen, onOpenChange: setDeleteOpen, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar usuario?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "Esta acción eliminará permanentemente al usuario ",
          /* @__PURE__ */ jsx("strong", { children: deletingUser?.name }),
          ". Si tiene tiendas activas, estas podrían quedar huérfanas o inaccesibles."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: submitDelete, className: "bg-red-600 hover:bg-red-700", children: "Eliminar Cuenta" })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
