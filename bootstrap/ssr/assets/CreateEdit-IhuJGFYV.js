import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { A as AdminLayout } from "./AdminLayout-C8hB-Nb-.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { C as Checkbox } from "./checkbox-dJXZmgY3.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { ArrowLeft, ShieldCheck, Save } from "lucide-react";
import "react";
import "sonner";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./badge-C_PGNHO8.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./dropdown-menu-B2I3vWlQ.js";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BclLUCFD.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./menuConfig-rtCrEhXP.js";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-label";
import "@radix-ui/react-checkbox";
function RolesCreateEdit({ role, permissions, currentTenant }) {
  const isEditing = !!role;
  const { data, setData, post, put, processing, errors } = useForm({
    name: role?.name || "",
    permissions: role?.permissions.map((p) => p.id) || []
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      put(route("tenant.roles.update", { tenant: currentTenant.slug, role: role.id }));
    } else {
      post(route("tenant.roles.store", { tenant: currentTenant.slug }));
    }
  };
  const togglePermission = (permissionId) => {
    const currentPermissions = new Set(data.permissions);
    if (currentPermissions.has(permissionId)) {
      currentPermissions.delete(permissionId);
    } else {
      currentPermissions.add(permissionId);
    }
    setData("permissions", Array.from(currentPermissions));
  };
  const toggleModule = (modulePermissions) => {
    const moduleIds = modulePermissions.map((p) => p.id);
    const allSelected = moduleIds.every((id) => data.permissions.includes(id));
    let newPermissions = [...data.permissions];
    if (allSelected) {
      newPermissions = newPermissions.filter((id) => !moduleIds.includes(id));
    } else {
      moduleIds.forEach((id) => {
        if (!newPermissions.includes(id)) {
          newPermissions.push(id);
        }
      });
    }
    setData("permissions", newPermissions);
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: isEditing ? "Editar Rol" : "Crear Nuevo Rol", children: [
    /* @__PURE__ */ jsx(Head, { title: isEditing ? "Editar Rol" : "Crear Nuevo Rol" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "cursor-pointer", children: /* @__PURE__ */ jsx(Link, { href: route("tenant.roles.index", { tenant: currentTenant.slug }), children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight", children: isEditing ? `Editar Rol: ${role.name}` : "Crear Nuevo Rol" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Define el nombre del rol y sus permisos de acceso." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Información Básica" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Asigna un nombre descriptivo para identificar este rol en tu equipo." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid w-full max-w-sm items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre del Rol" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "name",
                placeholder: "Ej. Gerente de Tienda",
                value: data.name,
                onChange: (e) => setData("name", e.target.value)
              }
            ),
            errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive font-medium", children: errors.name })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-1", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900", children: "Permisos del Sistema" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: "Selecciona las acciones que este rol podrá realizar." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-slate-500", children: [
              data.permissions.length,
              " permisos seleccionados"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: Object.entries(permissions).map(([module, modulePermissions]) => {
            const moduleIds = modulePermissions.map((p) => p.id);
            const allSelected = moduleIds.every((id) => data.permissions.includes(id));
            const someSelected = moduleIds.some((id) => data.permissions.includes(id));
            return /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsxs(CardHeader, { className: "bg-muted/30 pb-3 flex flex-row items-center justify-between space-y-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "font-bold flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(ShieldCheck, { className: `h-4 w-4 ${someSelected ? "text-primary" : "text-muted-foreground"}` }),
                  module
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ jsx(
                    Checkbox,
                    {
                      id: `module-${module}`,
                      checked: allSelected,
                      onCheckedChange: () => toggleModule(modulePermissions)
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Label,
                    {
                      htmlFor: `module-${module}`,
                      className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground cursor-pointer select-none",
                      children: "Todos"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx(CardContent, { className: "p-4 grid gap-3", children: modulePermissions.map((permission) => /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3", children: [
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    id: `perm-${permission.id}`,
                    checked: data.permissions.includes(permission.id),
                    onCheckedChange: () => togglePermission(permission.id)
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "grid gap-1.5 leading-none", children: /* @__PURE__ */ jsx(
                  Label,
                  {
                    htmlFor: `perm-${permission.id}`,
                    className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                    children: permission.label || permission.name
                  }
                ) })
              ] }, permission.id)) })
            ] }, module);
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-4 pt-4 pb-12", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, className: "cursor-pointer", children: /* @__PURE__ */ jsx(Link, { href: route("tenant.roles.index", { tenant: currentTenant.slug }), children: "Cancelar" }) }),
          /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: processing, className: "min-w-[150px] cursor-pointer", children: [
            /* @__PURE__ */ jsx(Save, {}),
            processing ? "Guardando..." : "Guardar Rol"
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  RolesCreateEdit as default
};
