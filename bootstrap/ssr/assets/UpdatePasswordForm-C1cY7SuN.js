import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button } from "./button-BdX_X5dq.js";
import { F as FieldError } from "./field-BEfz_npx.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { Transition } from "@headlessui/react";
import { usePage, useForm } from "@inertiajs/react";
import { useRef } from "react";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "@radix-ui/react-label";
function UpdatePasswordForm({
  className = "",
  onPermissionDenied
}) {
  const passwordInput = useRef(null);
  const currentPasswordInput = useRef(null);
  const { auth } = usePage().props;
  const permissions = auth.permissions || [];
  const isSuperAdminEnv = auth.user?.is_super_admin || permissions.some((p) => p.startsWith("sa.")) && !auth.user?.tenant_id;
  const canUpdate = !isSuperAdminEnv || permissions.includes("*") || permissions.includes("sa.account.password.update");
  const {
    data,
    setData,
    errors,
    put,
    reset,
    processing,
    recentlySuccessful
  } = useForm({
    current_password: "",
    password: "",
    password_confirmation: ""
  });
  const updatePassword = (e) => {
    e.preventDefault();
    if (!canUpdate) {
      onPermissionDenied();
      return;
    }
    put(route("password.update"), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors2) => {
        if (errors2.password) {
          reset("password", "password_confirmation");
          passwordInput.current?.focus();
        }
        if (errors2.current_password) {
          reset("current_password");
          currentPasswordInput.current?.focus();
        }
      }
    });
  };
  return /* @__PURE__ */ jsxs(Card, { className, children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: "Actualizar Contraseña" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Asegúrate de que tu cuenta esté usando una contraseña larga y aleatoria para mantenerse segura." })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: updatePassword, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "current_password", children: "Contraseña Actual" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "current_password",
            ref: currentPasswordInput,
            value: data.current_password,
            onChange: (e) => setData("current_password", e.target.value),
            type: "password",
            autoComplete: "current-password"
          }
        ),
        /* @__PURE__ */ jsx(FieldError, { children: errors.current_password })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Nueva Contraseña" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            ref: passwordInput,
            value: data.password,
            onChange: (e) => setData("password", e.target.value),
            type: "password",
            autoComplete: "new-password"
          }
        ),
        /* @__PURE__ */ jsx(FieldError, { children: errors.password })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password_confirmation", children: "Confirmar Contraseña" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password_confirmation",
            value: data.password_confirmation,
            onChange: (e) => setData("password_confirmation", e.target.value),
            type: "password",
            autoComplete: "new-password"
          }
        ),
        /* @__PURE__ */ jsx(FieldError, { children: errors.password_confirmation })
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
  UpdatePasswordForm as default
};
