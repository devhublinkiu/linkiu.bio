import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { A as AdminLayout } from "./AdminLayout-CegS7XIj.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { P as PermissionDeniedModal, A as Avatar, j as AvatarImage, k as AvatarFallback, D as DropdownMenu, i as DropdownMenuTrigger, l as DropdownMenuContent, p as DropdownMenuItem } from "./dropdown-menu-Dkgv2tnp.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { UserPlus, Mail, User, Shield, Building2, Trash2, MoreHorizontal } from "lucide-react";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { toast } from "sonner";
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
import "@radix-ui/react-label";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "vaul";
import "axios";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-alert-dialog";
function MembersIndex({ members, roles, locations, currentTenant }) {
  const { currentUserRole } = usePage().props;
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const checkPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner || currentUserRole.permissions.includes("*") || currentUserRole.permissions.includes(permission);
  };
  const handleActionWithPermission = (permission, action) => {
    if (checkPermission(permission)) {
      action();
    } else {
      setShowPermissionModal(true);
    }
  };
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    email: "",
    name: "",
    password: "",
    role_id: "",
    location_id: ""
  });
  useForm({
    role_id: ""
  });
  const handleInvite = (e) => {
    e.preventDefault();
    handleActionWithPermission("users.create", () => {
      post(route("tenant.members.store", { tenant: currentTenant?.slug }), {
        onSuccess: () => {
          setIsInviteOpen(false);
          reset();
          toast.success("Miembro invitado correctamente");
        },
        onError: () => {
          toast.error("Error al invitar miembro");
        }
      });
    });
  };
  const handleUpdatePivot = (memberId, field, value) => {
    handleActionWithPermission("users.update", () => {
      router.put(route("tenant.members.update", { tenant: currentTenant?.slug, member: memberId }), {
        role_id: field === "role_id" ? value : void 0,
        location_id: field === "location_id" ? value === "all" ? null : value : void 0
      }, {
        onSuccess: () => toast.success("Usuario actualizado"),
        onError: () => toast.error("Error al actualizar")
      });
    });
  };
  const handleDelete = (memberId) => {
    handleActionWithPermission("users.delete", () => {
      router.delete(route("tenant.members.destroy", { tenant: currentTenant?.slug, member: memberId }), {
        onSuccess: () => {
          toast.success("Miembro eliminado");
          setMemberToDelete(null);
        },
        onError: () => toast.error("No se pudo eliminar al miembro")
      });
    });
  };
  const openInviteModal = () => {
    handleActionWithPermission("users.create", () => setIsInviteOpen(true));
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Equipo", children: [
    /* @__PURE__ */ jsx(Head, { title: "Equipo" }),
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
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "Equipo" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500", children: "Gestiona los miembros de tu equipo y sus permisos." })
        ] }),
        /* @__PURE__ */ jsxs(Dialog, { open: isInviteOpen, onOpenChange: (open) => {
          if (open) openInviteModal();
          else setIsInviteOpen(false);
        }, children: [
          /* @__PURE__ */ jsxs(Button, { className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", onClick: openInviteModal, children: [
            /* @__PURE__ */ jsx(UserPlus, { className: "mr-2 h-4 w-4" }),
            "Agregar Miembro"
          ] }),
          /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [
            /* @__PURE__ */ jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsx(DialogTitle, { children: "Agregar Nuevo Miembro" }),
              /* @__PURE__ */ jsx(DialogDescription, { children: "Invita a un usuario existente por su correo electrónico para unirse a tu equipo." })
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: handleInvite, className: "space-y-4 py-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Correo Electrónico" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(Mail, { className: "absolute left-3 top-3 h-4 w-4 text-slate-400" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "email",
                      type: "email",
                      placeholder: "correo@ejemplo.com",
                      className: "pl-9 ring-0 hover:ring-0 focus:ring-0",
                      value: data.email,
                      onChange: (e) => setData("email", e.target.value)
                    }
                  )
                ] }),
                errors.email && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.email })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre (Solo para nuevos usuarios)" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(User, { className: "absolute left-3 top-3 h-4 w-4 text-slate-400" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "name",
                      placeholder: "Nombre Completo",
                      className: "pl-9 ring-0 hover:ring-0 focus:ring-0",
                      value: data.name,
                      onChange: (e) => setData("name", e.target.value)
                    }
                  )
                ] }),
                errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Contraseña (Solo para nuevos usuarios)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "password",
                    type: "password",
                    placeholder: "******",
                    className: "ring-0 hover:ring-0 focus:ring-0",
                    value: data.password,
                    onChange: (e) => setData("password", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500", children: "Si el usuario ya existe, estos campos se ignorarán." }),
                errors.password && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.password })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "role", children: "Rol Asignado" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    onValueChange: (val) => setData("role_id", val),
                    value: data.role_id,
                    children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona un rol" }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: roles.map((role) => /* @__PURE__ */ jsx(SelectItem, { value: String(role.id), className: "cursor-pointer", children: role.name }, role.id)) })
                    ]
                  }
                ),
                errors.role_id && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.role_id })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "location", children: "Sede Asignada (Opcional)" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    onValueChange: (val) => setData("location_id", val),
                    value: data.location_id,
                    children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Global (Todas las sedes)" }) }),
                      /* @__PURE__ */ jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Global (Todas las sedes)" }),
                        locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: String(loc.id), className: "cursor-pointer", children: loc.name }, loc.id))
                      ] })
                    ]
                  }
                ),
                errors.location_id && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.location_id })
              ] }),
              /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, className: "w-full cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: processing ? "Procesando..." : "Agregar Miembro" }) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-transparent", children: [
          /* @__PURE__ */ jsx(TableHead, { className: "w-[30%]", children: "Usuario" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Rol Actual" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Sede Asignada" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Fecha de Ingreso" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: members.map((member) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs(Avatar, { children: [
              /* @__PURE__ */ jsx(AvatarImage, { src: member.profile_photo_url }),
              /* @__PURE__ */ jsx(AvatarFallback, { children: member.name.substring(0, 2).toUpperCase() })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-slate-900", children: member.name }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: member.email })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { children: member.role_type === "owner" ? /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs(Badge, { className: "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200", children: [
            /* @__PURE__ */ jsx(Shield, { className: "w-3 h-3 mr-1" }),
            "Propietario"
          ] }) }) : /* @__PURE__ */ jsx(
            "div",
            {
              onClickCapture: (e) => {
                if (!checkPermission("users.update")) {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowPermissionModal(true);
                }
              },
              children: /* @__PURE__ */ jsxs(
                Select,
                {
                  defaultValue: member.pivot.role_id ? String(member.pivot.role_id) : void 0,
                  onValueChange: (val) => handleUpdatePivot(member.id, "role_id", val),
                  disabled: !checkPermission("users.update"),
                  children: [
                    /* @__PURE__ */ jsx(
                      SelectTrigger,
                      {
                        className: `w-[160px] h-8 text-xs cursor-pointer ring-0 hover:ring-0 focus:ring-0 ${!checkPermission("users.update") ? "opacity-50 cursor-not-allowed" : ""}`,
                        children: /* @__PURE__ */ jsx(SelectValue, { placeholder: member.role_label })
                      }
                    ),
                    /* @__PURE__ */ jsx(SelectContent, { children: roles.map((role) => /* @__PURE__ */ jsx(SelectItem, { value: String(role.id), className: "cursor-pointer", children: role.name }, role.id)) })
                  ]
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { children: member.role_type === "owner" ? /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px] h-6 px-2 border-primary/20 bg-primary/5 text-primary", children: [
            /* @__PURE__ */ jsx(Building2, { className: "w-3 h-3 mr-1" }),
            "Acceso Total"
          ] }) : /* @__PURE__ */ jsx(
            "div",
            {
              onClickCapture: (e) => {
                if (!checkPermission("users.update")) {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowPermissionModal(true);
                }
              },
              children: /* @__PURE__ */ jsxs(
                Select,
                {
                  defaultValue: member.pivot.location_id ? String(member.pivot.location_id) : "all",
                  onValueChange: (val) => handleUpdatePivot(member.id, "location_id", val),
                  disabled: !checkPermission("users.update"),
                  children: [
                    /* @__PURE__ */ jsx(
                      SelectTrigger,
                      {
                        className: `w-[180px] h-8 text-xs cursor-pointer ring-0 hover:ring-0 focus:ring-0 ${!checkPermission("users.update") ? "opacity-50 cursor-not-allowed" : ""}`,
                        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsx(Building2, { className: "w-3 h-3 text-primary" }),
                          /* @__PURE__ */ jsx(SelectValue, { placeholder: "Global" })
                        ] })
                      }
                    ),
                    /* @__PURE__ */ jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsx(SelectItem, { value: "all", className: "cursor-pointer", children: "Global (Todas las sedes)" }),
                      locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: String(loc.id), className: "cursor-pointer", children: loc.name }, loc.id))
                    ] })
                  ]
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-slate-500 text-sm", children: new Date(member.pivot.created_at).toLocaleDateString() }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: member.role_type === "owner" ? /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 opacity-50 cursor-not-allowed", disabled: true, children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-slate-300" }) }) : /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", children: /* @__PURE__ */ jsxs(
              DropdownMenuItem,
              {
                variant: "destructive",
                className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0",
                onSelect: () => handleActionWithPermission("users.delete", () => setMemberToDelete(member)),
                children: [
                  /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                  "Eliminar del Equipo"
                ]
              }
            ) })
          ] }) })
        ] }, member.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!memberToDelete, onOpenChange: (open) => !open && setMemberToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar Miembro?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "¿Estás seguro de que deseas eliminar a ",
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: memberToDelete?.name }),
          " del equipo? Esta acción no se puede deshacer."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: "Cancelar" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: () => memberToDelete && handleDelete(memberToDelete.id),
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
  MembersIndex as default
};
