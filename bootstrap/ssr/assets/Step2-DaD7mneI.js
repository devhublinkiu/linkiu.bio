import { jsx, jsxs } from "react/jsx-runtime";
import { useForm, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { c as cn } from "./utils-B0hQsrDj.js";
import axios from "axios";
import { route } from "ziggy-js";
import { O as OnboardingLayout } from "./OnboardingLayout-EEwXEmJx.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { User, Mail, Loader2, CheckCircle2, Lock, EyeOff, Eye, ShieldCheck, ChevronLeft, ArrowRight } from "lucide-react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
function Step2({ onboardingData, siteSettings }) {
  const { data, setData, post, processing, errors } = useForm({
    owner_name: onboardingData?.owner_name || "",
    owner_email: onboardingData?.owner_email || "",
    owner_password: "",
    owner_password_confirmation: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailValidating, setEmailValidating] = useState(false);
  const [emailError, setEmailError] = useState(null);
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (data.owner_email && data.owner_email.includes("@")) {
        setEmailValidating(true);
        setEmailError(null);
        try {
          const response = await axios.post(route("onboarding.validate"), {
            field: "owner_email",
            value: data.owner_email
          });
          if (!response.data.valid) {
            setEmailError(response.data.message);
          }
        } catch (e) {
          console.error("Validation error", e);
        } finally {
          setEmailValidating(false);
        }
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [data.owner_email]);
  const handleContinue = (e) => {
    e.preventDefault();
    if (emailError) {
      toast.error(emailError);
      return;
    }
    if (data.owner_password !== data.owner_password_confirmation) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    post(route("onboarding.step2.store"), {
      onError: (err) => {
        const msg = Object.values(err)[0];
        toast.error(typeof msg === "string" ? msg : "Revisa los campos marcados");
      }
    });
  };
  return /* @__PURE__ */ jsx(
    OnboardingLayout,
    {
      currentStep: 2,
      siteSettings,
      title: "Crea tu cuenta | Linkiu",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
          /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "px-4 py-1.5 border-primary/20 bg-primary/5 text-primary", children: [
            /* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5 mr-2" }),
            "Paso 2: Tu Cuenta"
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "text-4xl font-extrabold tracking-tight text-slate-900", children: [
            "Crea tu ",
            /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Perfil" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500", children: "Ingresa tus datos para gestionar tu tienda desde cualquier lugar." })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleContinue, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "owner_name", className: "text-sm font-bold text-slate-700 ml-1", children: "Nombre completo" }),
              /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors", children: /* @__PURE__ */ jsx(User, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "owner_name",
                    placeholder: "Ej: Juan Pérez",
                    className: cn(
                      "h-14 pl-12 rounded-2xl border-slate-200 transition-all focus:ring-4 focus:ring-primary/10",
                      errors.owner_name && "border-destructive ring-destructive/10"
                    ),
                    value: data.owner_name,
                    onChange: (e) => setData("owner_name", e.target.value),
                    required: true
                  }
                )
              ] }),
              errors.owner_name && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs font-medium ml-1", children: errors.owner_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "owner_email", className: "text-sm font-bold text-slate-700 ml-1", children: "Correo electrónico" }),
              /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors", children: /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "owner_email",
                    type: "email",
                    placeholder: "tunombre@ejemplo.com",
                    className: cn(
                      "h-14 pl-12 pr-12 rounded-2xl border-slate-200 transition-all focus:ring-4 focus:ring-primary/10",
                      (errors.owner_email || emailError) && "border-destructive ring-destructive/10"
                    ),
                    value: data.owner_email,
                    onChange: (e) => setData("owner_email", e.target.value),
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute right-4 top-1/2 -translate-y-1/2 flex items-center", children: emailValidating ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 text-primary animate-spin" }) : data.owner_email && !emailError && /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-green-500 animate-in zoom-in" }) })
              ] }),
              (errors.owner_email || emailError) && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs font-medium ml-1", children: errors.owner_email || emailError })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "owner_password", className: "text-sm font-bold text-slate-700 ml-1", children: "Contraseña" }),
                /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors", children: /* @__PURE__ */ jsx(Lock, { className: "w-5 h-5" }) }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "owner_password",
                      type: showPassword ? "text" : "password",
                      placeholder: "••••••••",
                      className: cn(
                        "h-14 pl-12 pr-10 rounded-2xl border-slate-200 transition-all focus:ring-4 focus:ring-primary/10",
                        errors.owner_password && "border-destructive ring-destructive/10"
                      ),
                      value: data.owner_password,
                      onChange: (e) => setData("owner_password", e.target.value),
                      required: true
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowPassword(!showPassword),
                      className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors",
                      children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "owner_password_confirmation", className: "text-sm font-bold text-slate-700 ml-1", children: "Confirmar" }),
                /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors", children: /* @__PURE__ */ jsx(Lock, { className: "w-5 h-5" }) }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "owner_password_confirmation",
                      type: showPassword ? "text" : "password",
                      placeholder: "••••••••",
                      className: cn(
                        "h-14 pl-12 rounded-2xl border-slate-200 transition-all focus:ring-4 focus:ring-primary/10",
                        data.owner_password && data.owner_password !== data.owner_password_confirmation && "border-destructive"
                      ),
                      value: data.owner_password_confirmation,
                      onChange: (e) => setData("owner_password_confirmation", e.target.value),
                      required: true
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-4 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5 text-primary shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 leading-relaxed", children: "Usamos encriptación de grado bancario para proteger tus datos. Tu privacidad es nuestra prioridad número uno." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-6", children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("onboarding.step1"),
                className: "flex items-center text-sm font-bold text-slate-400 hover:text-primary transition-colors group",
                children: [
                  /* @__PURE__ */ jsx(ChevronLeft, { className: "mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" }),
                  "Volver a industrias"
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-300 tracking-widest uppercase", children: "Paso 2 de 3" }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "submit",
                  size: "lg",
                  disabled: processing || emailValidating,
                  className: "h-14 px-10 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all active:scale-95",
                  children: [
                    processing ? "Guardando..." : "Crear Cuenta",
                    /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-5 h-5" })
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] })
    }
  );
}
export {
  Step2 as default
};
