import { jsxs, jsx } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-CvP9QKT2.js";
import { useForm, Head } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { C as Card, d as CardContent, e as CardFooter, a as CardHeader, b as CardTitle, c as CardDescription } from "./card-BaovBWX5.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-B4HNlFNZ.js";
import { P as PermissionDeniedModal, A as Avatar, j as AvatarImage, k as AvatarFallback } from "./dropdown-menu-BCxMx_rd.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { A as Alert, b as AlertTitle, a as AlertDescription } from "./alert-NB8JTTvo.js";
import { Camera, User, Lock, Phone, MapPin, Globe, Save } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-rtCrEhXP.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "radix-ui";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./sheet-DFnQxYfh.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
function Edit({ auth, status, tenant, currentUserRole, currentTenant }) {
  const roleLabel = currentUserRole?.label || "Miembro";
  const user = auth.user;
  const activeTenant = currentTenant || tenant;
  const fileInputRef = useRef(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const canEdit = currentUserRole?.is_owner || currentUserRole?.permissions?.includes("profile.edit") || currentUserRole?.permissions?.includes("*");
  const handleProtectedAction = (action) => {
    if (!canEdit) {
      setShowPermissionModal(true);
      return;
    }
    action();
  };
  const { data, setData, patch, processing, errors } = useForm({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
    state: user.state || "",
    country: user.country || "Colombia"
  });
  const { data: passwordData, setData: setPasswordData, put: updatePassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
    current_password: "",
    password: "",
    password_confirmation: ""
  });
  const submitProfile = (e) => {
    e.preventDefault();
    handleProtectedAction(() => {
      patch(route("tenant.profile.update", { tenant: activeTenant.slug }), {
        onSuccess: () => toast.success("Perfil actualizado correctamente"),
        onError: () => toast.error("Error al actualizar el perfil")
      });
    });
  };
  const submitPassword = (e) => {
    e.preventDefault();
    handleProtectedAction(() => {
      updatePassword(route("tenant.profile.password.update", { tenant: activeTenant.slug }), {
        onSuccess: () => {
          resetPassword();
          toast.success("Contraseña actualizada correctamente");
        },
        onError: () => toast.error("Error al actualizar la contraseña")
      });
    });
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      import("@inertiajs/react").then(({ router }) => {
        router.post(route("tenant.profile.photo.update", { tenant: activeTenant.slug }), {
          photo: file
        }, {
          preserveScroll: true,
          onSuccess: () => {
            toast.success("Foto de perfil actualizada");
          },
          onError: () => toast.error("Error al actualizar la foto")
        });
      });
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Mi Perfil", children: [
    /* @__PURE__ */ jsx(Head, { title: "Mi Perfil - Linkiu.Bio" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "file",
        ref: fileInputRef,
        className: "hidden",
        accept: "image/*",
        onChange: handleFileChange
      }
    ),
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto py-8 px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-8", children: [
      /* @__PURE__ */ jsx("div", { className: "md:w-1/3", children: /* @__PURE__ */ jsxs(Card, { className: "sticky", children: [
        /* @__PURE__ */ jsxs(CardContent, { className: "pt-10 pb-8 flex flex-col items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsxs(Avatar, { className: "h-32 w-32", children: [
              /* @__PURE__ */ jsx(AvatarImage, { src: user.profile_photo_url, className: "object-cover" }),
              /* @__PURE__ */ jsx(AvatarFallback, { className: "text-3xl", children: user.name.substring(0, 2).toUpperCase() })
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                onClick: () => handleProtectedAction(() => fileInputRef.current?.click()),
                className: "absolute bottom-0 right-0 rounded-full shadow-lg cursor-pointer",
                children: /* @__PURE__ */ jsx(Camera, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "mt-4 text-xl font-bold", children: user.name }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: user.email }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
            user.phone && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "gap-1.5", children: [
              /* @__PURE__ */ jsx("div", { className: "size-1.5 bg-green-500 rounded-full animate-pulse" }),
              "WhatsApp Verificado"
            ] }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", children: roleLabel })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-8 w-full pt-6 border-t space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-widest text-muted-foreground font-bold px-1", children: "Información de Negocio" }),
            /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-xl p-3 border", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-muted-foreground", children: "Tipo de Negocio" }),
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: tenant?.vertical_name || "Particular" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-muted-foreground", children: "Categoría" }),
                /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold", children: tenant?.category_name || "N/A" })
              ] })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(CardFooter, { className: "py-4 border-t bg-muted/30 rounded-b-xl px-6", children: /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-muted-foreground font-medium text-center w-full uppercase tracking-wider", children: [
          "Miembro desde ",
          new Date(user.created_at).toLocaleDateString("es-ES", { month: "long", year: "numeric" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "md:w-2/3", children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "general", className: "w-full", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2 mb-6", children: [
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "general", className: "cursor-pointer", children: [
            /* @__PURE__ */ jsx(User, { className: "mr-2" }),
            "Información General"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "security", className: "cursor-pointer", children: [
            /* @__PURE__ */ jsx(Lock, { className: "mr-2" }),
            "Seguridad"
          ] })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "general", className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Datos Personales" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Actualiza tu información básica de contacto." })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submitProfile, children: [
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4 pt-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre Completo" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "name",
                      value: data.name,
                      onChange: (e) => setData("name", e.target.value)
                    }
                  ),
                  errors.name && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive font-medium", children: errors.name })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Correo Electrónico" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "email",
                      type: "email",
                      value: data.email,
                      disabled: true
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: "Tu correo es tu identificador único y no puede modificarse." })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "phone", children: "WhatsApp Personal" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(Phone, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "phone",
                      value: data.phone,
                      onChange: (e) => setData("phone", e.target.value),
                      className: "pl-10",
                      placeholder: "Ej: +57 300 000 0000"
                    }
                  )
                ] }),
                errors.phone && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive font-medium", children: errors.phone })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "pt-4 pb-2 border-b", children: /* @__PURE__ */ jsxs("h4", { className: "flex items-center gap-2 text-sm font-bold", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4" }),
                "Ubicación"
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "address", children: "Dirección de Residencia" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "address",
                    value: data.address,
                    onChange: (e) => setData("address", e.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "city", children: "Ciudad" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "city",
                      value: data.city,
                      onChange: (e) => setData("city", e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "country", children: "País" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx(Globe, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "country",
                        value: data.country,
                        onChange: (e) => setData("country", e.target.value),
                        className: "pl-10"
                      }
                    )
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(CardFooter, { className: "bg-muted/30 rounded-b-xl border-t px-6 py-4 flex justify-end", children: /* @__PURE__ */ jsxs(Button, { disabled: processing, className: "cursor-pointer", children: [
              /* @__PURE__ */ jsx(Save, {}),
              "Guardar Cambios"
            ] }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "security", className: "space-y-6", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "Cambiar Contraseña" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Asegúrate de usar una contraseña fuerte y única." })
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: submitPassword, children: [
              /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4 pt-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "current_password", children: "Contraseña Actual" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "current_password",
                      type: "password",
                      value: passwordData.current_password,
                      onChange: (e) => setPasswordData("current_password", e.target.value)
                    }
                  ),
                  passwordErrors.current_password && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive font-medium", children: passwordErrors.current_password })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Nueva Contraseña" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "password",
                        type: "password",
                        value: passwordData.password,
                        onChange: (e) => setPasswordData("password", e.target.value)
                      }
                    ),
                    passwordErrors.password && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive font-medium", children: passwordErrors.password })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "password_confirmation", children: "Confirmar Nueva Contraseña" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "password_confirmation",
                        type: "password",
                        value: passwordData.password_confirmation,
                        onChange: (e) => setPasswordData("password_confirmation", e.target.value)
                      }
                    ),
                    passwordErrors.password_confirmation && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive font-medium", children: passwordErrors.password_confirmation })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(CardFooter, { className: "bg-muted/30 rounded-b-xl border-t px-6 py-4 flex justify-end", children: /* @__PURE__ */ jsxs(Button, { disabled: passwordProcessing, className: "cursor-pointer", children: [
                /* @__PURE__ */ jsx(Lock, {}),
                "Actualizar Contraseña"
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Alert, { children: [
            /* @__PURE__ */ jsxs(AlertTitle, { children: [
              /* @__PURE__ */ jsx(Lock, { className: "mr-2 h-4 w-4" }),
              "Recomendación de Seguridad"
            ] }),
            /* @__PURE__ */ jsx(AlertDescription, { children: "Te recomendamos cambiar tu contraseña al menos cada 3 meses para mantener tu cuenta segura." })
          ] })
        ] })
      ] }) })
    ] }) })
  ] });
}
export {
  Edit as default
};
