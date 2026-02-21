import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { S as SuperAdminLayout } from "./SuperAdminLayout-DVPOojgY.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { ArrowLeft, EyeOff, Eye, Save } from "lucide-react";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
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
import "@radix-ui/react-select";
function Create({ roles }) {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    post(route("users.store"));
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: "Crear Nuevo Usuario", children: [
    /* @__PURE__ */ jsx(Head, { title: "Crear Usuario" }),
    /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", asChild: true, className: "pl-0 hover:bg-transparent hover:text-blue-600 cursor-pointer", children: /* @__PURE__ */ jsxs(Link, { href: route("users.index"), children: [
      /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
      "Volver a Usuarios"
    ] }) }) }),
    /* @__PURE__ */ jsx("form", { onSubmit: submit, children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 max-w-2xl", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Información Personal" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Ingresa los datos básicos para el nuevo usuario." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre Completo" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "name",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                placeholder: "Ej. Juan Pérez",
                required: true
              }
            ),
            errors.name && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Correo Electrónico" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "email",
                type: "email",
                value: data.email,
                onChange: (e) => setData("email", e.target.value),
                placeholder: "juan@ejemplo.com",
                required: true
              }
            ),
            errors.email && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs", children: errors.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Contraseña" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "password",
                    type: showPassword ? "text" : "password",
                    value: data.password,
                    onChange: (e) => setData("password", e.target.value),
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer",
                    onClick: () => setShowPassword(!showPassword),
                    children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4 text-gray-500" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 text-gray-500" })
                  }
                )
              ] }),
              errors.password && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs", children: errors.password })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "password_confirmation", children: "Confirmar Contraseña" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "password_confirmation",
                  type: showPassword ? "text" : "password",
                  value: data.password_confirmation,
                  onChange: (e) => setData("password_confirmation", e.target.value),
                  required: true
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Asignación de Rol" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "(Opcional) Asigna un rol global de administración. Si es un usuario normal, déjalo vacío." })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid gap-2 text-left", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "role", children: "Rol Global" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              onValueChange: (value) => setData("role_id", value === "none" ? null : Number(value)),
              value: data.role_id ? String(data.role_id) : void 0,
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar un rol..." }) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "-- Ningún Rol (Usuario Normal) --" }),
                  roles.map((role) => /* @__PURE__ */ jsx(SelectItem, { value: String(role.id), className: "cursor-pointer", children: role.name }, role.id))
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-[0.8rem] text-muted-foreground", children: 'Los usuarios con rol "Super Admin" tienen acceso total. Otros roles tienen permisos específicos.' }),
          errors.role_id && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs", children: errors.role_id })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: processing, className: "w-full sm:w-auto cursor-pointer", children: [
        /* @__PURE__ */ jsx(Save, { className: "mr-2 h-4 w-4" }),
        "Crear Usuario"
      ] }) })
    ] }) })
  ] });
}
export {
  Create as default
};
