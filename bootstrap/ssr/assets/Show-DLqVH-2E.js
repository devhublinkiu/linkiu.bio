import { jsxs, jsx } from "react/jsx-runtime";
import { useMemo, useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { P as PublicLayout, H as Header } from "./Header-B2wecguQ.js";
import { ArrowLeft, User, Heart, HandHeart, Quote, MessageCircle, Copy, Mail } from "lucide-react";
import { toast } from "sonner";
import "./ReportBusinessStrip-Cg46R4fS.js";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./button-BdX_X5dq.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./input-B_4qRSOV.js";
import "./label-L_u-fyc1.js";
import "@radix-ui/react-label";
import "./textarea-BpljFL5D.js";
const VISITOR_ID_KEY = "testimonial_visitor_id";
const COOKIE_NAME = "testimonial_visitor_id";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;
function getVisitorId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID?.() ?? `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}
function isHtml(text) {
  if (!text || typeof text !== "string") return false;
  const t = text.trim();
  return t.startsWith("<") && (t.includes("</p>") || t.includes("<p>") || t.includes("<br"));
}
function getCsrfHeadersAndBody() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  const bodyToken = meta?.content ?? "";
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  const cookieToken = match ? decodeURIComponent(match[1].trim()) : "";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest"
  };
  if (cookieToken) headers["X-XSRF-TOKEN"] = cookieToken;
  if (bodyToken) headers["X-CSRF-TOKEN"] = bodyToken;
  return { headers, bodyToken };
}
function TestimonialShow({
  tenant,
  testimonial,
  blessing_count: initialBlessing = 0,
  prayer_count: initialPrayer = 0,
  amen_count: initialAmen = 0,
  share_count: initialShare = 0,
  already_blessing: initialAlreadyBlessing = false,
  already_prayer: initialAlreadyPrayer = false,
  already_amen: initialAlreadyAmen = false
}) {
  const brandColors = tenant.brand_colors ?? {};
  const bg_color = brandColors.bg_color ?? "#1e3a5f";
  const hasVideo = !!testimonial.embed_url;
  const bodyHtml = testimonial.body && isHtml(testimonial.body);
  const bodyText = testimonial.body && !bodyHtml ? testimonial.body : "";
  const visitorId = useMemo(getVisitorId, []);
  const [blessingCount, setBlessingCount] = useState(() => Number(initialBlessing) || 0);
  const [prayerCount, setPrayerCount] = useState(() => Number(initialPrayer) || 0);
  const [amenCount, setAmenCount] = useState(() => Number(initialAmen) || 0);
  const [shareCount, setShareCount] = useState(() => Number(initialShare) || 0);
  const [alreadyBlessing, setAlreadyBlessing] = useState(!!initialAlreadyBlessing);
  const [alreadyPrayer, setAlreadyPrayer] = useState(!!initialAlreadyPrayer);
  const [alreadyAmen, setAlreadyAmen] = useState(!!initialAlreadyAmen);
  const [loadingBlessing, setLoadingBlessing] = useState(false);
  const [loadingPrayer, setLoadingPrayer] = useState(false);
  const [loadingAmen, setLoadingAmen] = useState(false);
  useEffect(() => {
    if (!visitorId || typeof document === "undefined") return;
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(visitorId)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  }, [visitorId]);
  useEffect(() => {
    if (!visitorId || initialAlreadyBlessing !== void 0) return;
    const url = `${route("tenant.public.testimonials.reactions-status", [tenant.slug, testimonial.id])}?visitor_id=${encodeURIComponent(visitorId)}`;
    fetch(url).then((r) => r.json()).then((data) => {
      setAlreadyBlessing(!!data.already_blessing);
      setAlreadyPrayer(!!data.already_prayer);
      setAlreadyAmen(!!data.already_amen);
    }).catch(() => {
    });
  }, [tenant.slug, testimonial.id, visitorId, initialAlreadyBlessing]);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `${testimonial.title} - ${tenant.name}`;
  async function handleReaction(url, onSuccess) {
    if (!visitorId) {
      toast.error("Recarga la página e intenta de nuevo.");
      return;
    }
    const { headers, bodyToken } = getCsrfHeadersAndBody();
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ visitor_id: visitorId, _token: bodyToken }),
      credentials: "same-origin"
    });
    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
    }
    if (!res.ok) {
      toast.error(res.status === 419 ? "Sesión expirada. Recarga la página." : "No se pudo registrar");
      return;
    }
    onSuccess(data);
  }
  const handleBlessing = () => {
    if (alreadyBlessing || loadingBlessing) return;
    setLoadingBlessing(true);
    handleReaction(route("tenant.public.testimonials.blessing", [tenant.slug, testimonial.id]), (data) => {
      if (typeof data.blessing_count === "number") setBlessingCount(data.blessing_count);
      if (typeof data.prayer_count === "number") setPrayerCount(data.prayer_count);
      if (typeof data.amen_count === "number") setAmenCount(data.amen_count);
      setAlreadyBlessing(true);
      toast.success("Gracias");
    }).finally(() => setLoadingBlessing(false));
  };
  const handlePrayer = () => {
    if (alreadyPrayer || loadingPrayer) return;
    setLoadingPrayer(true);
    handleReaction(route("tenant.public.testimonials.prayer", [tenant.slug, testimonial.id]), (data) => {
      if (typeof data.blessing_count === "number") setBlessingCount(data.blessing_count);
      if (typeof data.prayer_count === "number") setPrayerCount(data.prayer_count);
      if (typeof data.amen_count === "number") setAmenCount(data.amen_count);
      setAlreadyPrayer(true);
      toast.success("Gracias");
    }).finally(() => setLoadingPrayer(false));
  };
  const handleAmen = () => {
    if (alreadyAmen || loadingAmen) return;
    setLoadingAmen(true);
    handleReaction(route("tenant.public.testimonials.amen", [tenant.slug, testimonial.id]), (data) => {
      if (typeof data.blessing_count === "number") setBlessingCount(data.blessing_count);
      if (typeof data.prayer_count === "number") setPrayerCount(data.prayer_count);
      if (typeof data.amen_count === "number") setAmenCount(data.amen_count);
      setAlreadyAmen(true);
      toast.success("Amén");
    }).finally(() => setLoadingAmen(false));
  };
  const registerShare = () => {
    const { headers } = getCsrfHeadersAndBody();
    fetch(route("tenant.public.testimonials.share", [tenant.slug, testimonial.id]), {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({}),
      credentials: "same-origin"
    }).then((r) => r.json()).then((data) => {
      if (typeof data.share_count === "number") setShareCount(data.share_count);
    }).catch(() => {
    });
  };
  const copyLink = () => {
    registerShare();
    navigator.clipboard.writeText(shareUrl).then(() => toast.success("Enlace copiado")).catch(() => toast.error("No se pudo copiar"));
  };
  const shareWhatsApp = () => {
    registerShare();
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank");
  };
  const shareEmail = () => {
    registerShare();
    window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`;
  };
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: `${testimonial.title} - ${tenant.name}` }),
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
    /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto w-full flex-1 pb-20 px-4 pt-4", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("tenant.public.testimonials", tenant.slug),
          className: "inline-flex items-center gap-1.5 text-sm font-medium text-primary mb-4",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" }),
            "Volver a testimonios"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("article", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("header", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-slate-900 leading-tight", children: testimonial.title }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1 mt-2", children: [
            testimonial.category && /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-slate-500 uppercase tracking-wider", children: testimonial.category }),
            testimonial.author && /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-600 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(User, { className: "size-4 text-slate-400 shrink-0" }),
              testimonial.author
            ] })
          ] })
        ] }),
        hasVideo && /* @__PURE__ */ jsx("div", { className: "aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg", children: /* @__PURE__ */ jsx(
          "iframe",
          {
            src: testimonial.embed_url,
            title: testimonial.title,
            className: "w-full h-full",
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            allowFullScreen: true
          }
        ) }),
        testimonial.short_quote && /* @__PURE__ */ jsx("blockquote", { className: "pl-4 border-l-4 border-primary/50 text-slate-700 italic text-sm", children: testimonial.short_quote }),
        /* @__PURE__ */ jsxs("div", { className: "prose prose-slate max-w-none text-sm", children: [
          bodyHtml && /* @__PURE__ */ jsx("div", { className: "text-slate-700 leading-relaxed", dangerouslySetInnerHTML: { __html: testimonial.body } }),
          bodyText && /* @__PURE__ */ jsx("p", { className: "text-slate-700 whitespace-pre-wrap leading-relaxed", children: bodyText })
        ] }),
        !testimonial.body && !testimonial.short_quote && !hasVideo && /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm", children: "Sin contenido adicional." }),
        /* @__PURE__ */ jsxs("div", { className: "pt-6 mt-6 border-t border-slate-200 space-y-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-600", children: "Reacciones" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: handleBlessing,
                disabled: alreadyBlessing || loadingBlessing,
                className: `inline-flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl text-sm font-semibold transition-all ${alreadyBlessing ? "bg-emerald-500 text-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200"}`,
                children: [
                  /* @__PURE__ */ jsx(Heart, { className: `size-5 ${alreadyBlessing ? "fill-current" : ""}` }),
                  /* @__PURE__ */ jsx("span", { children: "Bendición" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs tabular-nums", children: blessingCount })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: handlePrayer,
                disabled: alreadyPrayer || loadingPrayer,
                className: `inline-flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl text-sm font-semibold transition-all ${alreadyPrayer ? "bg-amber-500 text-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-200"}`,
                children: [
                  /* @__PURE__ */ jsx(HandHeart, { className: "size-5" }),
                  /* @__PURE__ */ jsx("span", { children: "Oración" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs tabular-nums", children: prayerCount })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: handleAmen,
                disabled: alreadyAmen || loadingAmen,
                className: `inline-flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl text-sm font-semibold transition-all ${alreadyAmen ? "bg-slate-700 text-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"}`,
                children: [
                  /* @__PURE__ */ jsx(Quote, { className: "size-5" }),
                  /* @__PURE__ */ jsx("span", { children: "Amén" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs tabular-nums", children: amenCount })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-2 border-t border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500", children: "Compartir" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: shareWhatsApp,
                  className: "p-2 rounded-lg bg-[#25D366] text-white hover:bg-[#20BD5A]",
                  title: "WhatsApp",
                  children: /* @__PURE__ */ jsx(MessageCircle, { className: "size-4" })
                }
              ),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: copyLink, className: "p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200", title: "Copiar enlace", children: /* @__PURE__ */ jsx(Copy, { className: "size-4" }) }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: shareEmail, className: "p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200", title: "Email", children: /* @__PURE__ */ jsx(Mail, { className: "size-4" }) })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500 tabular-nums", children: shareCount })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  TestimonialShow as default
};
