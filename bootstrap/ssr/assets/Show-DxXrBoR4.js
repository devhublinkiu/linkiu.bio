import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { P as PublicLayout, H as Header } from "./Header-8AGqQP0J.js";
import { ArrowLeft, Users, Mail, Phone, MessageCircle } from "lucide-react";
import "./ReportBusinessStrip-Cg46R4fS.js";
import "react";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "sonner";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./button-BdX_X5dq.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./input-B_4qRSOV.js";
import "./label-L_u-fyc1.js";
import "@radix-ui/react-label";
import "./textarea-BpljFL5D.js";
function formatWhatsAppNumber(phone) {
  if (!phone || typeof phone !== "string") return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 10) return `57${digits}`;
  return digits;
}
function TeamShow({ tenant, collaborator }) {
  const brandColors = tenant.brand_colors ?? {};
  const bg_color = brandColors.bg_color ?? "#1e3a5f";
  const hasEmail = collaborator.email?.trim();
  const hasPhone = collaborator.phone?.trim();
  const hasWhatsApp = collaborator.whatsapp?.trim();
  const whatsappNum = formatWhatsAppNumber(collaborator.whatsapp || collaborator.phone);
  const whatsappUrl = whatsappNum ? `https://wa.me/${whatsappNum}` : "";
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: `${collaborator.name} - Nuestro equipo - ${tenant.name}` }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsx(
      Header,
      {
        tenantName: tenant.name,
        description: tenant.store_description,
        logoUrl: tenant.logo_url,
        bgColor: bg_color,
        textColor: brandColors.name_color ?? "#ffffff",
        descriptionColor: brandColors.description_color
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto px-4 w-full flex-1 pb-20 pt-6", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("tenant.public.team", tenant.slug),
          className: "inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-6",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" }),
            "Volver al equipo"
          ]
        }
      ),
      /* @__PURE__ */ jsx("article", { className: "rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col items-center text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg mb-4", children: collaborator.photo ? /* @__PURE__ */ jsx(
          "img",
          {
            src: collaborator.photo,
            alt: "",
            className: "w-full h-full object-cover"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Users, { className: "size-14 text-slate-400" }) }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-black text-slate-900 tracking-tight", children: collaborator.name }),
        collaborator.role && /* @__PURE__ */ jsx("p", { className: "text-primary font-semibold mt-1", children: collaborator.role }),
        collaborator.bio && /* @__PURE__ */ jsx("p", { className: "text-slate-600 mt-4 text-left leading-relaxed whitespace-pre-line", children: collaborator.bio }),
        (hasEmail || hasPhone || hasWhatsApp) && /* @__PURE__ */ jsxs("div", { className: "mt-6 w-full border-t border-slate-100 pt-5", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3", children: "Contacto" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-3", children: [
            hasEmail && /* @__PURE__ */ jsxs(
              "a",
              {
                href: `mailto:${collaborator.email.trim()}`,
                className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors",
                children: [
                  /* @__PURE__ */ jsx(Mail, { className: "size-4" }),
                  "Correo"
                ]
              }
            ),
            hasPhone && !hasWhatsApp && /* @__PURE__ */ jsxs(
              "a",
              {
                href: `tel:${collaborator.phone.trim().replace(/\s/g, "")}`,
                className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors",
                children: [
                  /* @__PURE__ */ jsx(Phone, { className: "size-4" }),
                  "Llamar"
                ]
              }
            ),
            hasWhatsApp && /* @__PURE__ */ jsxs(
              "a",
              {
                href: whatsappUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium text-sm transition-colors",
                children: [
                  /* @__PURE__ */ jsx(MessageCircle, { className: "size-4" }),
                  "WhatsApp"
                ]
              }
            ),
            hasPhone && hasWhatsApp && /* @__PURE__ */ jsxs(
              "a",
              {
                href: `tel:${collaborator.phone.trim().replace(/\s/g, "")}`,
                className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors",
                children: [
                  /* @__PURE__ */ jsx(Phone, { className: "size-4" }),
                  "Llamar"
                ]
              }
            )
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  TeamShow as default
};
