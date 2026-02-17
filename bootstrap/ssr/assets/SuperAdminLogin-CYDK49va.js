import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useForm, Head } from "@inertiajs/react";
import { useState } from "react";
import { c as cn } from "./utils-B0hQsrDj.js";
import { route } from "ziggy-js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { C as Checkbox } from "./checkbox-dJXZmgY3.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { ShieldCheck, Mail, Lock, EyeOff, Eye, Loader2, ArrowRight } from "lucide-react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-checkbox";
function SuperAdminLogin({ status, canResetPassword }) {
  const [showPassword, setShowPassword] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("login"), {
      onFinish: () => reset("password")
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-slate-50", children: [
    /* @__PURE__ */ jsx(Head, { title: "SuperAdmin Login" }),
    /* @__PURE__ */ jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-bold text-2xl tracking-tight text-foreground", children: [
        /* @__PURE__ */ jsx("div", { className: "h-10 w-10 flex items-center justify-center bg-primary p-2 rounded-xl shadow-lg shadow-primary/20", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-6 w-6 text-primary-foreground" }) }),
        /* @__PURE__ */ jsx("span", { children: "SuperLinkiu" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2 mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-extrabold text-gray-900 tracking-tight", children: "Panel de Control" }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-500 font-medium flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-primary" }),
          "Administración Global"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0", children: [
      /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-2xl shadow-blue-100/50 overflow-hidden bg-white/80 backdrop-blur-md", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-1 pb-4", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-xl", children: "Iniciar Sesión" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Ingresa tus credenciales de administrador" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          status && /* @__PURE__ */ jsx("div", { className: "mb-4 font-medium text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-100", children: status }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Correo Electrónico" }),
              /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" }) }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "email",
                    type: "email",
                    name: "email",
                    value: data.email,
                    className: cn("pl-10 h-12 bg-gray-50/50 border-gray-100 focus:bg-white transition-all", errors.email && "border-red-300 bg-red-50/10"),
                    autoComplete: "username",
                    placeholder: "admin@linkiu.bio",
                    onChange: (e) => setData("email", e.target.value),
                    required: true
                  }
                )
              ] }),
              errors.email && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 font-medium", children: errors.email })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Contraseña" }) }),
              /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(Lock, { className: "h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" }) }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "password",
                    type: showPassword ? "text" : "password",
                    name: "password",
                    value: data.password,
                    className: cn("pl-10 pr-10 h-12 bg-gray-50/50 border-gray-100 focus:bg-white transition-all", errors.password && "border-red-300 bg-red-50/10"),
                    autoComplete: "current-password",
                    placeholder: "••••••••",
                    onChange: (e) => setData("password", e.target.value),
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "absolute inset-y-0 right-0 pr-3 flex items-center",
                    onClick: () => setShowPassword(!showPassword),
                    children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" }) : /* @__PURE__ */ jsx(Eye, { className: "h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" })
                  }
                )
              ] }),
              errors.password && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 font-medium", children: errors.password })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  id: "remember",
                  checked: data.remember,
                  onCheckedChange: (checked) => setData("remember", checked)
                }
              ),
              /* @__PURE__ */ jsx(
                Label,
                {
                  htmlFor: "remember",
                  className: "ml-2 block text-sm text-gray-600 cursor-pointer select-none",
                  children: "Recordar mi sesión"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsx(
              Button,
              {
                className: "w-full h-12 text-base font-bold shadow-xl shadow-primary/20 group relative overflow-hidden transition-all active:scale-95",
                disabled: processing,
                children: processing ? /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  "Acceder al Panel",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" })
                ] })
              }
            ) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 text-center space-y-4", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-4 pt-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5" }),
        "Acceso Seguro 256-bit"
      ] }) }) })
    ] })
  ] });
}
export {
  SuperAdminLogin as default
};
