import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button } from "./button-BdX_X5dq.js";
import { F as FieldError } from "./field-BEfz_npx.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { Transition } from "@headlessui/react";
import { usePage, useForm, Link } from "@inertiajs/react";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "@radix-ui/react-label";
function UpdateProfileInformation({
  mustVerifyEmail,
  status,
  className = "",
  onPermissionDenied
}) {
  const { auth } = usePage().props;
  const user = auth.user;
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    name: user.name,
    email: user.email
  });
  const permissions = auth.permissions || [];
  const isSuperAdminEnv = auth.user?.is_super_admin || permissions.some((p) => p.startsWith("sa.")) && !auth.user?.tenant_id;
  const canUpdate = !isSuperAdminEnv || permissions.includes("*") || permissions.includes("sa.account.update");
  const submit = (e) => {
    e.preventDefault();
    if (!canUpdate) {
      onPermissionDenied();
      return;
    }
    patch(route("profile.update"));
  };
  return /* @__PURE__ */ jsxs(Card, { className, children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: "Información del Perfil" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Actualiza la información de perfil y correo electrónico de tu cuenta." })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "name",
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            required: true,
            autoFocus: true,
            autoComplete: "name"
          }
        ),
        /* @__PURE__ */ jsx(FieldError, { children: errors.name })
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
            required: true,
            autoComplete: "username"
          }
        ),
        /* @__PURE__ */ jsx(FieldError, { children: errors.email })
      ] }),
      mustVerifyEmail && user.email_verified_at === null && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
          "Tu dirección de correo electrónico no está verificada.",
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("verification.send"),
              method: "post",
              as: "button",
              className: "rounded-md text-sm text-primary underline hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              children: "Haz clic aquí para reenviar el correo de verificación."
            }
          )
        ] }),
        status === "verification-link-sent" && /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm font-medium text-green-600 dark:text-green-400", children: "Se ha enviado un nuevo enlace de verificación a tu dirección de correo electrónico." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { disabled: processing, children: "Guardar" }),
        /* @__PURE__ */ jsx(
          Transition,
          {
            show: recentlySuccessful,
            enter: "transition ease-in-out",
            enterFrom: "opacity-0",
            leave: "transition ease-in-out",
            leaveTo: "opacity-0",
            children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Guardado." })
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  UpdateProfileInformation as default
};
