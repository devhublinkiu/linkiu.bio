import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as Avatar, k as AvatarFallback } from "./dropdown-menu-BCxMx_rd.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-BaovBWX5.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { S as SuperAdminLayout } from "./SuperAdminLayout-rjkAJMgZ.js";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Building2, ExternalLink, MapPin, Mail, Phone, CreditCard, ShieldCheck } from "lucide-react";
import "@radix-ui/react-slot";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "react";
import "vaul";
import "axios";
import "sonner";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./input-B_4qRSOV.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-DFnQxYfh.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "class-variance-authority";
import "@radix-ui/react-label";
import "./ApplicationLogo-xMpxFOcX.js";
function Show({ tenant }) {
  const owner = tenant.users?.find((u) => u.pivot?.role === "owner");
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: `Detalle de Tienda: ${tenant.name}`, children: [
    /* @__PURE__ */ jsx(Head, { title: tenant.name }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(Button, { variant: "ghost", asChild: true, className: "mb-4 pl-0 hover:pl-2 transition-all", children: /* @__PURE__ */ jsxs(Link, { href: route("tenants.index"), children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }),
        "Volver al listado"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(Avatar, { className: "h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-transparent", children: /* @__PURE__ */ jsx(Building2, { className: "h-8 w-8" }) }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: tenant.name }),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: `https://linkiu.bio/${tenant.slug}`,
                target: "_blank",
                className: "text-blue-600 hover:underline flex items-center gap-1 text-sm font-medium",
                children: [
                  "linkiu.bio/",
                  tenant.slug,
                  " ",
                  /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-sm px-3 py-1", children: [
            tenant.category?.vertical?.name,
            " / ",
            tenant.category?.name
          ] }),
          /* @__PURE__ */ jsx(Badge, { className: "bg-green-600", children: "Activo" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-6", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Building2, { className: "h-5 w-5 text-gray-500" }),
              "Información Fiscal y de Contacto"
            ] }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "grid sm:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider font-bold", children: "Identificación" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: tenant.doc_type }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-sm", children: tenant.doc_number }),
                  tenant.verification_digit && /* @__PURE__ */ jsxs("span", { className: "font-medium text-sm", children: [
                    "- ",
                    tenant.verification_digit
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500 mt-1 capitalize", children: [
                  "Régimen ",
                  tenant.regime
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider font-bold", children: "Ubicación Fiscal" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 text-sm", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-gray-400 mt-0.5" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { children: tenant.address }),
                    /* @__PURE__ */ jsxs("p", { children: [
                      tenant.city,
                      ", ",
                      tenant.state
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider font-bold", children: "Contacto Comercial" }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-gray-400" }),
                    /* @__PURE__ */ jsx("a", { href: `mailto:${tenant.contact_email}`, className: "hover:underline", children: tenant.contact_email })
                  ] }),
                  tenant.contact_phone && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 text-gray-400" }),
                    /* @__PURE__ */ jsx("span", { children: tenant.contact_phone })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(CreditCard, { className: "h-5 w-5 text-gray-500" }),
              "Información de Suscripción"
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-gray-500", children: [
              /* @__PURE__ */ jsx("p", { children: "Suscripción activa gestionada en el módulo de facturación." }),
              /* @__PURE__ */ jsx(Button, { variant: "link", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("subscriptions.index", { search: tenant.id }), children: "Ver Historial de Pagos" }) })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { className: "bg-blue-50/50 border-blue-100", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-blue-800", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5" }),
            "Propietario (Admin)"
          ] }) }),
          /* @__PURE__ */ jsx(CardContent, { className: "space-y-6", children: owner ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(Avatar, { className: "h-12 w-12 bg-blue-200 text-blue-700 font-bold text-xl", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-transparent", children: owner.name.charAt(0) }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold", children: owner.name }),
                /* @__PURE__ */ jsxs("div", { className: "text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full inline-block", children: [
                  "Super Admin: ",
                  owner.is_super_admin ? "Sí" : "No"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-blue-100", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-blue-400" }),
                /* @__PURE__ */ jsx("span", { className: "truncate", title: owner.email, children: owner.email })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 text-sm", children: /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "border-blue-200 bg-white", children: [
                owner.doc_type,
                " ",
                owner.doc_number
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 text-sm text-gray-600", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-blue-400 mt-0.5" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { children: owner.address }),
                  /* @__PURE__ */ jsxs("p", { children: [
                    owner.city,
                    ", ",
                    owner.country
                  ] })
                ] })
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: "No se encontró propietario asignado." }) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  Show as default
};
