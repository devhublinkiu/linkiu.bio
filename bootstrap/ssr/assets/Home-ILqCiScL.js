import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { P as PublicLayout, H as Header } from "./Header-CiFZ-R5L.js";
import { E as EpisodeCard, F as FloatingAudioPlayer } from "./FloatingAudioPlayer-BhmGsfMj.js";
import { P as PromotionalTicker, B as BannerSlider, C as Carousel, a as PromoCard } from "./promo-carousel-COMO4-b_.js";
import { Briefcase, BookOpen, Headphones, Radio, Quote, Banknote, ChevronRight, Calendar, Church, HandHeart, Heart, Share2, Users, Mail, Phone, MessageCircle } from "lucide-react";
import "./ReportBusinessStrip-Cg46R4fS.js";
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
import "motion/react";
function Home({ tenant, sliders, tickers, services = [], devotionals = [], promo_shorts = [], collaborators = [], podcast_page_title = "Podcast", podcast_episode_of_the_day = null, sermons_live = [], sermons_upcoming = [], testimonials = [] }) {
  const brandColors = tenant.brand_colors ?? {};
  const bg_color = brandColors.bg_color ?? "#1e3a5f";
  const [playerOpen, setPlayerOpen] = useState(false);
  const quickLinks = [
    { label: "Servicios", href: route("tenant.public.services", tenant.slug), icon: Briefcase, description: "Cultos, reuniones y actividades" },
    { label: "Devocionales", href: route("tenant.public.devotionals", tenant.slug), icon: BookOpen, description: "Reflexiones y palabra del día" },
    { label: podcast_page_title, href: route("tenant.public.podcast", tenant.slug), icon: Headphones, description: "Mensajes y enseñanzas en audio" },
    { label: "Predicas", href: route("tenant.public.sermons", tenant.slug), icon: Radio, description: "Transmisiones en vivo y archivo" },
    { label: "Testimonios", href: route("tenant.public.testimonials", tenant.slug), icon: Quote, description: "Historias de fe y transformación" },
    { label: "Donaciones", href: route("tenant.public.donations", tenant.slug), icon: Banknote, description: "Apoya con tu ofrenda" }
  ];
  return /* @__PURE__ */ jsxs(
    PublicLayout,
    {
      bgColor: bg_color,
      renderFloatingBottom: playerOpen && podcast_episode_of_the_day ? /* @__PURE__ */ jsx(
        FloatingAudioPlayer,
        {
          episodes: [podcast_episode_of_the_day],
          currentIndex: 0,
          onClose: () => setPlayerOpen(false),
          onIndexChange: () => {
          }
        }
      ) : null,
      children: [
        /* @__PURE__ */ jsx(Head, { title: tenant.name }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx(
            Header,
            {
              tenantName: tenant.name,
              description: tenant.store_description,
              logoUrl: tenant.logo_url,
              bgColor: bg_color,
              textColor: brandColors.name_color ?? "#ffffff",
              descriptionColor: brandColors.description_color
            }
          ),
          /* @__PURE__ */ jsx(PromotionalTicker, { tickers })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-gray-50 p-4 -mt-4 relative z-0 pb-20 flex flex-col gap-6", children: [
          /* @__PURE__ */ jsx(BannerSlider, { sliders, tenantSlug: tenant.slug }),
          (podcast_episode_of_the_day || podcast_page_title) && /* @__PURE__ */ jsxs("section", { className: "w-full", "aria-labelledby": "podcast-heading", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsx("h2", { id: "podcast-heading", className: "text-lg font-bold text-slate-900", children: podcast_page_title }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route("tenant.public.podcast", tenant.slug),
                  className: "text-sm font-semibold text-primary flex items-center gap-0.5",
                  children: [
                    "Ver todos",
                    /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { children: podcast_episode_of_the_day ? /* @__PURE__ */ jsx(
              EpisodeCard,
              {
                ep: podcast_episode_of_the_day,
                logoUrl: tenant.logo_url,
                bgColor: bg_color,
                onPlay: () => setPlayerOpen(true)
              }
            ) : /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-slate-50 border border-slate-100 p-6 flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Headphones, { className: "size-7 text-slate-400" }) }),
              /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm", children: "Próximamente: mensajes y enseñanzas en audio" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "w-full", "aria-labelledby": "predicas-heading", children: [
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
                    /* @__PURE__ */ jsx("h3", { className: "font-semibold text-slate-900 line-clamp-2 leading-none", children: sermon.title }),
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
          services.length > 0 && /* @__PURE__ */ jsxs("section", { className: "w-full", "aria-labelledby": "servicios-slider-heading", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsx("h2", { id: "servicios-slider-heading", className: "text-lg font-bold text-slate-900", children: "Nuestros servicios" }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route("tenant.public.services", tenant.slug),
                  className: "text-sm font-semibold text-primary flex items-center gap-0.5",
                  children: [
                    "Ver todos",
                    /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto snap-x snap-mandatory flex gap-3 pb-2 scrollbar-none", children: services.map((service) => /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("tenant.public.services", tenant.slug),
                className: "snap-center shrink-0 w-[180px] rounded-lg bg-white shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "h-32 w-full bg-slate-100 relative overflow-hidden", children: [
                    service.image_url ? /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: service.image_url,
                        alt: "",
                        className: "absolute inset-0 w-full h-full object-cover"
                      }
                    ) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(Church, { className: "size-10 text-slate-300" }) }),
                    service.service_type && /* @__PURE__ */ jsx("span", { className: "absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white", children: service.service_type })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "p-3 flex flex-col flex-1", children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 line-clamp-2", children: service.name }),
                    service.schedule && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 line-clamp-1", children: service.schedule })
                  ] })
                ]
              },
              service.id
            )) })
          ] }),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("tenant.public.appointments.request", tenant.slug),
              className: "group relative block overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]",
              children: /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "relative min-h-[80px] px-2 py-2 flex flex-col justify-center",
                  style: {
                    background: `linear-gradient(135deg, ${bg_color} 0%, ${bg_color}dd 50%, ${bg_color}99 100%)`
                  },
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-2xl" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0 border border-white/30 shadow-inner group-hover:bg-white/25 transition-colors", children: /* @__PURE__ */ jsx(HandHeart, { className: "w-8 h-8 text-white" }) }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("p", { className: "text-white/90 text-sm font-medium", children: "Estamos aquí para ti" }),
                          /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-xl font-black text-white tracking-tight", children: "Solicita una cita" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 shrink-0", children: /* @__PURE__ */ jsxs("span", { className: "px-2 py-2 rounded-xl bg-white text-slate-800 font-bold text-sm shadow-md group-hover:bg-white/95 group-hover:shadow-lg transition-all inline-flex items-center gap-2", children: [
                        "Pedir cita",
                        /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 group-hover:translate-x-0.5 transition-transform" })
                      ] }) })
                    ] })
                  ]
                }
              )
            }
          ),
          devotionals.length > 0 && /* @__PURE__ */ jsxs("section", { className: "w-full", "aria-labelledby": "devocionales-slider-heading", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsx("h2", { id: "devocionales-slider-heading", className: "text-lg font-bold text-slate-900", children: "Devocionales" }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route("tenant.public.devotionals", tenant.slug),
                  className: "text-sm font-semibold text-primary flex items-center gap-0.5",
                  children: [
                    "Ver todos",
                    /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto snap-x snap-mandatory flex gap-3 pb-2 scrollbar-none", children: devotionals.map((d) => /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("tenant.public.devotionals.show", [tenant.slug, d.id]),
                className: "snap-center shrink-0 w-[200px] rounded-lg bg-white shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "h-32 w-full bg-slate-100 relative overflow-hidden", children: d.cover_image ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: d.cover_image,
                      alt: "",
                      className: "absolute inset-0 w-full h-full object-cover"
                    }
                  ) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "size-10 text-slate-300" }) }) }),
                  /* @__PURE__ */ jsxs("div", { className: "p-3 flex flex-col flex-1", children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 line-clamp-2 leading-none", children: d.title }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-2", children: new Date(d.date).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" }) }),
                    (d.excerpt || d.scripture_reference) && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5 line-clamp-2", children: d.excerpt || d.scripture_reference }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-2 text-xs text-slate-500", children: [
                      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-0.5", title: "Fue de bendición", children: [
                        /* @__PURE__ */ jsx(Heart, { className: "size-3.5" }),
                        Number(d.blessing_count) || 0
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-0.5", title: "Orando", children: [
                        /* @__PURE__ */ jsx(HandHeart, { className: "size-3.5" }),
                        Number(d.prayer_count) || 0
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-0.5", title: "Compartidos", children: [
                        /* @__PURE__ */ jsx(Share2, { className: "size-3.5" }),
                        Number(d.share_count) || 0
                      ] })
                    ] })
                  ] })
                ]
              },
              d.id
            )) })
          ] }),
          Array.isArray(promo_shorts) && promo_shorts.length > 0 && /* @__PURE__ */ jsxs("section", { className: "w-full", "aria-labelledby": "shorts-heading", children: [
            /* @__PURE__ */ jsx("h2", { id: "shorts-heading", className: "text-[140px] font-bold text-gray-200 px-4 flex items-center -mb-24", children: "Shorts" }),
            /* @__PURE__ */ jsx(
              Carousel,
              {
                items: promo_shorts.map((short, index) => /* @__PURE__ */ jsx(
                  PromoCard,
                  {
                    card: {
                      title: short.name,
                      short_embed_url: short.short_embed_url,
                      action_url: short.action_url,
                      link_type: short.link_type
                    },
                    index
                  },
                  short.id
                ))
              }
            )
          ] }),
          Array.isArray(collaborators) && collaborators.length > 0 && /* @__PURE__ */ jsxs("section", { className: "w-full -mx-4", "aria-labelledby": "colaboradores-slider-heading", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 mb-3", children: [
              /* @__PURE__ */ jsx("h2", { id: "colaboradores-slider-heading", className: "text-lg font-bold text-slate-900", children: "Nuestro equipo" }),
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
                    /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-sm line-clamp-2 leading-none", children: c.name }),
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
          Array.isArray(testimonials) && testimonials.length > 0 && /* @__PURE__ */ jsxs("section", { className: "w-full -mx-4", "aria-labelledby": "testimonios-slider-heading", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 mb-3", children: [
              /* @__PURE__ */ jsx("h2", { id: "testimonios-slider-heading", className: "text-lg font-bold text-slate-900", children: "Testimonios" }),
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
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "w-full px-2", "aria-labelledby": "accesos-heading", children: [
            /* @__PURE__ */ jsx("h2", { id: "accesos-heading", className: "text-lg font-bold text-slate-900 mb-4", children: "Accesos rápidos" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3", children: quickLinks.map((item) => /* @__PURE__ */ jsxs(
              Link,
              {
                href: item.href,
                className: "flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(item.icon, { className: "w-6 h-6 text-slate-600" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 text-left", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900 block", children: item.label }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-500", children: item.description })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-sm shrink-0", children: "Ir →" })
                ]
              },
              item.label
            )) })
          ] })
        ] })
      ]
    }
  );
}
export {
  Home as default
};
