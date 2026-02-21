import { jsxs, jsx } from "react/jsx-runtime";
import { S as SuperAdminLayout } from "./SuperAdminLayout-DVPOojgY.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { C as Checkbox } from "./checkbox-dJXZmgY3.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { ArrowLeft, ShieldCheck, Save } from "lucide-react";
import "react";
import "./dropdown-menu-Dkgv2tnp.js";
import "@radix-ui/react-slot";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "vaul";
import "axios";
import "sonner";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./echo-DaX0krWj.js";
import "@ably/laravel-echo";
import "ably";
import "./ApplicationLogo-xMpxFOcX.js";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-checkbox";
function Create({ permissions }) {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    permissions: []
  });
  const handlePermissionChange = (permissionName, checked) => {
    if (checked) {
      setData("permissions", [...data.permissions, permissionName]);
    } else {
      setData("permissions", data.permissions.filter((p) => p !== permissionName));
    }
  };
  const toggleGroup = (groupPermissions, checked) => {
    const groupNames = groupPermissions.map((p) => p.name);
    if (checked) {
      const unique = /* @__PURE__ */ new Set([...data.permissions, ...groupNames]);
      setData("permissions", Array.from(unique));
    } else {
      setData("permissions", data.permissions.filter((p) => !groupNames.includes(p)));
    }
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("roles.store"));
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: "Crear Nuevo Rol", children: [
    /* @__PURE__ */ jsx(Head, { title: "Crear Rol" }),
    /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", asChild: true, className: "pl-0 hover:bg-transparent hover:text-blue-600", children: /* @__PURE__ */ jsxs(Link, { href: route("roles.index"), children: [
      /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
      "Volver a Roles"
    ] }) }) }),
    /* @__PURE__ */ jsx("form", { onSubmit: submit, children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-8", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Información Básica" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Asigna un nombre único para este rol." })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid w-full max-w-md items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre del Rol" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "name",
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              placeholder: "Ej. Administrador de Soporte",
              className: errors.name ? "border-destructive" : "",
              required: true
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive font-medium", children: errors.name })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-1", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-foreground", children: "Sistema Global" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Selecciona las acciones y accesos para este rol." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-muted-foreground", children: [
            data.permissions.length,
            " permisos seleccionados"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: Object.entries(permissions).map(([moduleName, modulePermissions]) => {
          const moduleNames = modulePermissions.map((p) => p.name);
          const allSelected = moduleNames.every((name) => data.permissions.includes(name));
          const someSelected = moduleNames.some((name) => data.permissions.includes(name));
          return /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden border-border bg-card", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-muted p-3 border-b border-border flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "font-bold flex items-center gap-2 text-foreground", children: [
                /* @__PURE__ */ jsx(ShieldCheck, { className: `h-4 w-4 ${someSelected ? "text-primary" : "text-muted-foreground"}` }),
                moduleName
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    id: `module-${moduleName}`,
                    checked: allSelected,
                    onCheckedChange: (checked) => toggleGroup(modulePermissions, checked === true)
                  }
                ),
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    htmlFor: `module-${moduleName}`,
                    className: "text-xs font-medium text-muted-foreground cursor-pointer select-none",
                    children: "Todos"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-3 grid gap-2", children: modulePermissions.map((permission) => /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors", children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  id: permission.name,
                  checked: data.permissions.includes(permission.name),
                  onCheckedChange: (checked) => handlePermissionChange(permission.name, checked === true)
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "grid gap-1.5 leading-none", children: /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: permission.name,
                  className: "text-sm font-medium leading-none cursor-pointer",
                  children: permission.label || permission.name
                }
              ) })
            ] }, permission.id)) })
          ] }, moduleName);
        }) })
      ] }),
      errors.permissions && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm", children: errors.permissions }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-4 pt-4 pb-12", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("roles.index"), children: "Cancelar" }) }),
        /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: processing, className: "min-w-[150px] font-bold", children: [
          /* @__PURE__ */ jsx(Save, { className: "mr-2 h-4 w-4" }),
          processing ? "Guardando..." : "Guardar Rol"
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Create as default
};
