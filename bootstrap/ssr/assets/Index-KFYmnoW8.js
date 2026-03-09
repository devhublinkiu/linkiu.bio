import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { P as PublicLayout, H as Header } from "./Header-DqQsy9AV.js";
import { C as Card, d as CardContent } from "./card-BaovBWX5.js";
import { Church, ChevronRight, Radio, Calendar, Users, Mail, Phone, MessageCircle, Quote, Heart, HandHeart, Share2, LayoutGrid, Clock, MapPin, User, ExternalLink } from "lucide-react";
import "./ReportBusinessStrip-U20bW72V.js";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "react";
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
function ServiceCard({ service }) {
  const hasMeta = service.schedule || service.frequency || service.duration || service.location || service.modality;
  return /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden border border-slate-200 shadow-sm rounded-xl bg-white relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 p-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-200 h-120 shrink-0 rounded-lg bg-slate-100 overflow-hidden relative", children: [
        service.image_url ? /* @__PURE__ */ jsx(
          "img",
          {
            src: service.image_url,
            alt: "",
            className: "w-full h-full object-cover"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Church, { className: "size-8 text-slate-300" }) }),
        service.service_type && /* @__PURE__ */ jsx("span", { className: "absolute top-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary text-white", children: service.service_type })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 pt-0.5 px-3 pb-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-base text-slate-900 leading-tight line-clamp-2", children: service.name }),
        service.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-600 mt-0.5 line-clamp-2", children: service.description }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-1", children: [
          service.schedule && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mt-1 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "size-3.5 shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "truncate", children: service.schedule })
          ] }),
          service.modality && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mt-1 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(LayoutGrid, { className: "size-3.5 shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "truncate", children: service.modality })
          ] }),
          service.frequency && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mt-1 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Share2, { className: "size-3.5 shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "truncate", children: service.frequency })
          ] }),
          service.duration && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mt-1 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Clock, { className: "size-3.5 shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "truncate", children: service.duration })
          ] })
        ] })
      ] })
    ] }),
    (hasMeta || service.audience || service.leader || service.contact_info || service.external_url) && /* @__PURE__ */ jsx(CardContent, { className: "flex flex-col-wrap gap-2 px-3 py-2 border-t border-slate-100", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5 text-xs text-slate-600", children: [
      service.audience && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-slate-600", children: [
        /* @__PURE__ */ jsx(Users, { className: "size-3.5 text-slate-400 shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: service.audience })
      ] }),
      service.location && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-slate-600", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "size-3.5 text-slate-400 shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: service.location })
      ] }),
      service.leader && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-slate-600", children: [
        /* @__PURE__ */ jsx(User, { className: "size-3.5 text-slate-400 shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: service.leader })
      ] }),
      service.contact_info && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-slate-600", children: [
        /* @__PURE__ */ jsx(Phone, { className: "size-3.5 text-slate-400 shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: service.contact_info })
      ] }),
      service.external_url && /* @__PURE__ */ jsxs(
        "a",
        {
          href: service.external_url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline",
          children: [
            /* @__PURE__ */ jsx(ExternalLink, { className: "size-3.5" }),
            "Ver más"
          ]
        }
      )
    ] }) })
  ] });
}
function ServicesIndex({ tenant, services, sermons_live = [], sermons_upcoming = [], collaborators = [], testimonials = [] }) {
  const brandColors = tenant.brand_colors ?? {};
  const bg_color = brandColors.bg_color ?? "#1e3a5f";
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: `Servicios - ${tenant.name}` }),
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
    /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto px-4 w-full flex-1 pb-20 pt-8", children: [
      /* @__PURE__ */ jsxs("section", { "aria-labelledby": "servicios-heading", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { id: "servicios-heading", className: "text-xl font-black tracking-tight", children: "Nuestros servicios" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: services.length === 0 ? "Cultos, reuniones y actividades" : `${services.length} ${services.length === 1 ? "servicio" : "servicios"}` })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "py-4", children: services.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-10", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-slate-100 rounded-full size-12 mx-auto mb-3 flex items-center justify-center", children: /* @__PURE__ */ jsx(Church, { className: "size-6 text-slate-400" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-600 font-medium text-sm", children: "No hay servicios publicados" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Próximamente verás aquí nuestros cultos y reuniones" })
        ] }) : /* @__PURE__ */ jsx("ul", { className: "space-y-2 list-none p-0 m-0", children: services.map((service) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(ServiceCard, { service }) }, service.id)) }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "w-full mt-8", "aria-labelledby": "predicas-heading", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsx("h2", { id: "predicas-heading", className: "text-lg font-bold text-slate-900", children: sermons_live.length > 0 ? "Predica en vivo" : sermons_upcoming.length > 0 ? "Próximas transmisiones" : "Predicas en vivo" }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("tenant.public.sermons", tenant.slug),
              className: "text-sm font-semibold text-primary flex items-center gap-0.5",
              children: [
                "Ver todas",
                /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: sermons_live.length > 0 ? sermons_live.slice(0, 2).map((sermon) => /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("tenant.public.sermons.show", [tenant.slug, sermon.id]),
            className: "flex gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "relative w-24 h-14 shrink-0 rounded-lg overflow-hidden bg-slate-100", children: [
                sermon.thumbnail_url ? /* @__PURE__ */ jsx("img", { src: sermon.thumbnail_url, alt: "", className: "absolute inset-0 w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(Radio, { className: "size-6 text-slate-400" }) }),
                /* @__PURE__ */ jsx("span", { className: "absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white", children: "EN VIVO" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 flex flex-col justify-center", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-semibold text-slate-900 line-clamp-2", children: sermon.title }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mt-0.5 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Radio, { className: "size-3.5" }),
                  "Transmisión en vivo"
                ] })
              ] }),
              /* @__PURE__ */ jsx(ChevronRight, { className: "size-5 text-slate-400 shrink-0 self-center" })
            ]
          },
          sermon.id
        )) : sermons_upcoming.length > 0 ? sermons_upcoming.slice(0, 2).map((sermon) => /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("tenant.public.sermons.show", [tenant.slug, sermon.id]),
            className: "flex gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "relative w-24 h-14 shrink-0 rounded-lg overflow-hidden bg-slate-100", children: [
                sermon.thumbnail_url ? /* @__PURE__ */ jsx("img", { src: sermon.thumbnail_url, alt: "", className: "absolute inset-0 w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(Calendar, { className: "size-6 text-slate-400" }) }),
                sermon.live_start_at && /* @__PURE__ */ jsx("span", { className: "absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-700 text-white", children: new Date(sermon.live_start_at).toLocaleDateString("es", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 flex flex-col justify-center", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-semibold text-slate-900 line-clamp-2", children: sermon.title }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mt-0.5 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "size-3.5" }),
                  "Próxima transmisión"
                ] })
              ] }),
              /* @__PURE__ */ jsx(ChevronRight, { className: "size-5 text-slate-400 shrink-0 self-center" })
            ]
          },
          sermon.id
        )) : /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-slate-50 border border-slate-100 p-6 flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Radio, { className: "size-7 text-slate-400" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm", children: "No hay transmisiones en vivo ni programadas por ahora" })
        ] }) })
      ] }),
      collaborators.length > 0 && /* @__PURE__ */ jsxs("section", { className: "w-full mt-8 -mx-4", "aria-labelledby": "colaboradores-heading", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 mb-3", children: [
          /* @__PURE__ */ jsx("h2", { id: "colaboradores-heading", className: "text-lg font-bold text-slate-900", children: "Nuestro equipo" }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("tenant.public.team", tenant.slug),
              className: "text-sm font-semibold text-primary flex items-center gap-0.5",
              children: [
                "Ver todos",
                /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto snap-x snap-mandatory flex gap-4 px-4 pb-2 scrollbar-none", children: collaborators.map((c) => {
          const hasEmail = !!c.email?.trim();
          const hasPhone = !!c.phone?.trim();
          const hasWhatsApp = !!c.whatsapp?.trim();
          const hasContact = hasEmail || hasPhone || hasWhatsApp;
          return /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("tenant.public.team.show", [tenant.slug, c.id]),
              className: "snap-center shrink-0 w-[172px] rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-200 transition-all flex flex-col items-center text-center p-4",
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow mb-2", children: c.photo ? /* @__PURE__ */ jsx("img", { src: c.photo, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Users, { className: "size-8 text-slate-400" }) }) }),
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-sm line-clamp-2", children: c.name }),
                c.role && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5 line-clamp-2", children: c.role }),
                hasContact && /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-center gap-1.5 flex-wrap", children: [
                  hasEmail && /* @__PURE__ */ jsx("span", { className: "inline-flex p-1.5 rounded-lg bg-slate-100 text-slate-500", title: "Correo", children: /* @__PURE__ */ jsx(Mail, { className: "size-3.5" }) }),
                  hasPhone && /* @__PURE__ */ jsx("span", { className: "inline-flex p-1.5 rounded-lg bg-slate-100 text-slate-500", title: "Teléfono", children: /* @__PURE__ */ jsx(Phone, { className: "size-3.5" }) }),
                  hasWhatsApp && /* @__PURE__ */ jsx("span", { className: "inline-flex p-1.5 rounded-lg bg-[#25D366]/15 text-[#25D366]", title: "WhatsApp", children: /* @__PURE__ */ jsx(MessageCircle, { className: "size-3.5" }) })
                ] })
              ]
            },
            c.id
          );
        }) })
      ] }),
      testimonials.length > 0 && /* @__PURE__ */ jsxs("section", { className: "w-full mt-8 -mx-4", "aria-labelledby": "testimonios-heading", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 mb-3", children: [
          /* @__PURE__ */ jsx("h2", { id: "testimonios-heading", className: "text-lg font-bold text-slate-900", children: "Testimonios" }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("tenant.public.testimonials", tenant.slug),
              className: "text-sm font-semibold text-primary flex items-center gap-0.5",
              children: [
                "Ver todos",
                /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto snap-x snap-mandatory flex gap-4 px-4 pb-2 scrollbar-none", children: testimonials.map((t) => /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("tenant.public.testimonials.show", [tenant.slug, t.id]),
            className: "snap-center shrink-0 w-[280px] rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-200 transition-all flex flex-col",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "h-32 w-full bg-slate-100 relative overflow-hidden", children: [
                t.image_url ? /* @__PURE__ */ jsx("img", { src: t.image_url, alt: "", className: "absolute inset-0 w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(Quote, { className: "size-10 text-slate-300" }) }),
                t.category && /* @__PURE__ */ jsx("span", { className: "absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-medium bg-white/90 text-slate-700", children: t.category })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-3 flex flex-col flex-1", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 line-clamp-2", children: t.title }),
                (t.short_quote || t.author) && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5 line-clamp-2", children: t.short_quote || (t.author ? `— ${t.author}` : "") }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-2 text-xs text-slate-500", children: [
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-0.5", title: "Bendición", children: [
                    /* @__PURE__ */ jsx(Heart, { className: "size-3.5" }),
                    Number(t.blessing_count) || 0
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-0.5", title: "Oración", children: [
                    /* @__PURE__ */ jsx(HandHeart, { className: "size-3.5" }),
                    Number(t.prayer_count) || 0
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-0.5", title: "Amén", children: [
                    /* @__PURE__ */ jsx(Quote, { className: "size-3.5" }),
                    Number(t.amen_count) || 0
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-0.5", title: "Compartidos", children: [
                    /* @__PURE__ */ jsx(Share2, { className: "size-3.5" }),
                    Number(t.share_count) || 0
                  ] })
                ] })
              ] })
            ]
          },
          t.id
        )) })
      ] })
    ] })
  ] });
}
export {
  ServicesIndex as default
};
