import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button } from "./button-BdX_X5dq.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { F as FieldError } from "./field-BEfz_npx.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { usePage, useForm } from "@inertiajs/react";
import { useState, useRef } from "react";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "lucide-react";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "@radix-ui/react-label";
function DeleteUserForm({
  className = "",
  onPermissionDenied
}) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const passwordInput = useRef(null);
  const { auth } = usePage().props;
  const permissions = auth.permissions || [];
  const isSuperAdminEnv = auth.user?.is_super_admin || permissions.some((p) => p.startsWith("sa.")) && !auth.user?.tenant_id;
  const canDelete = !isSuperAdminEnv || permissions.includes("*") || permissions.includes("sa.account.delete");
  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
    clearErrors
  } = useForm({
    password: ""
  });
  const confirmUserDeletion = () => {
    if (!canDelete) {
      onPermissionDenied();
      return;
    }
    setConfirmingUserDeletion(true);
  };
  const deleteUser = (e) => {
    e.preventDefault();
    destroy(route("profile.destroy"), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordInput.current?.focus(),
      onFinish: () => reset()
    });
  };
  const closeModal = () => {
    setConfirmingUserDeletion(false);
    clearErrors();
    reset();
  };
  return /* @__PURE__ */ jsxs(Card, { className, children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: "Eliminar Cuenta" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Una vez que se elimine tu cuenta, todos sus recursos y datos se eliminarán permanentemente. Antes de eliminar tu cuenta, descarga cualquier dato o información que desees conservar." })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "destructive", onClick: confirmUserDeletion, children: "Eliminar Cuenta" }),
      /* @__PURE__ */ jsx(Dialog, { open: confirmingUserDeletion, onOpenChange: setConfirmingUserDeletion, children: /* @__PURE__ */ jsx(DialogContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: deleteUser, children: [
        /* @__PURE__ */ jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsx(DialogTitle, { children: "¿Seguro de que deseas eliminar tu cuenta?" }),
          /* @__PURE__ */ jsx(DialogDescription, { children: "Una vez que se elimine tu cuenta, todos sus recursos y datos se eliminarán permanentemente. Por favor, ingresa tu contraseña para confirmar que deseas eliminar permanentemente tu cuenta." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "my-6", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", title: "Contraseña", className: "sr-only", children: "Contraseña" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "password",
              type: "password",
              name: "password",
              ref: passwordInput,
              value: data.password,
              onChange: (e) => setData("password", e.target.value),
              className: "mt-1 block w-3/4",
              autoFocus: true,
              placeholder: "Contraseña"
            }
          ),
          /* @__PURE__ */ jsx(FieldError, { children: errors.password })
        ] }),
        /* @__PURE__ */ jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: closeModal, type: "button", children: "Cancelar" }),
          /* @__PURE__ */ jsx(Button, { variant: "destructive", className: "ms-3", disabled: processing, type: "submit", children: "Eliminar Cuenta" })
        ] })
      ] }) }) })
    ] })
  ] });
}
export {
  DeleteUserForm as default
};
