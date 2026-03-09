import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { useMemo, useState, useEffect } from "react";
import { P as PublicLayout, H as Header } from "./Header-DqQsy9AV.js";
import { Calendar, User, ExternalLink, Heart, HandHeart, Share2, Copy, Mail } from "lucide-react";
import { toast } from "sonner";
import "./ReportBusinessStrip-U20bW72V.js";
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
function getVideoEmbedUrl(url) {
  if (!url || typeof url !== "string") return null;
  const u = url.trim();
  const ytMatch = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}
function formatDate(d) {
  return new Date(d).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" });
}
function isHtml(html) {
  if (!html || typeof html !== "string") return false;
  const t = html.trim();
  return t.startsWith("<") && (t.includes("</p>") || t.includes("<p>") || t.includes("<br") || t.includes("<strong") || t.includes("<em"));
}
const VISITOR_ID_KEY = "devotional_visitor_id";
function getVisitorId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID?.() ?? `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}
const COOKIE_NAME = "devotional_visitor_id";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;
function DevotionalShow({ tenant, devotional, blessing_count: initialBlessingCount, prayer_count: initialPrayerCount, already_blessing: initialAlreadyBlessing, already_prayer: initialAlreadyPrayer }) {
  const brandColors = tenant.brand_colors ?? {};
  const bg_color = brandColors.bg_color ?? "#1e3a5f";
  const embedUrl = devotional.video_url ? getVideoEmbedUrl(devotional.video_url) : null;
  const bodyIsHtml = isHtml(devotional.body);
  const visitorId = useMemo(getVisitorId, []);
  const [blessingCount, setBlessingCount] = useState(() => Number(initialBlessingCount) || 0);
  const [prayerCount, setPrayerCount] = useState(() => Number(initialPrayerCount) || 0);
  const [alreadyBlessing, setAlreadyBlessing] = useState(!!initialAlreadyBlessing);
  const [alreadyPrayer, setAlreadyPrayer] = useState(!!initialAlreadyPrayer);
  const [loadingBlessing, setLoadingBlessing] = useState(false);
  const [loadingPrayer, setLoadingPrayer] = useState(false);
  useEffect(() => {
    if (!visitorId || typeof document === "undefined") return;
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(visitorId)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  }, [visitorId]);
  useEffect(() => {
    if (!visitorId || initialAlreadyBlessing !== void 0 || initialAlreadyPrayer !== void 0) return;
    const baseUrl = route("tenant.public.devotionals.reactions-status", [tenant.slug, devotional.id]);
    const url = `${baseUrl}?visitor_id=${encodeURIComponent(visitorId)}`;
    fetch(url).then((r) => r.json()).then((data) => {
      setAlreadyBlessing(!!data.already_blessing);
      setAlreadyPrayer(!!data.already_prayer);
    }).catch(() => {
    });
  }, [tenant.slug, devotional.id, visitorId, initialAlreadyBlessing, initialAlreadyPrayer]);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `${devotional.title} - ${tenant.name}`;
  function getCsrfHeadersAndBody() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    const bodyToken = meta?.content ?? "";
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    const cookieToken = match ? decodeURIComponent(match[1].trim()) : "";
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-Requested-With": "XMLHttpRequest"
    };
    if (cookieToken) headers["X-XSRF-TOKEN"] = cookieToken;
    if (bodyToken) headers["X-CSRF-TOKEN"] = bodyToken;
    return { headers, bodyToken };
  }
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
      if (res.status === 419) {
        toast.error("Sesión expirada. Recarga la página e intenta de nuevo.");
        return;
      }
      const msg = typeof data.message === "string" ? data.message : data.error ?? "No se pudo registrar";
      toast.error(String(msg));
      return;
    }
    onSuccess(data);
  }
  const handleBlessing = () => {
    if (alreadyBlessing || loadingBlessing) return;
    setLoadingBlessing(true);
    handleReaction(route("tenant.public.devotionals.blessing", [tenant.slug, devotional.id]), (data) => {
      const bc = typeof data.blessing_count === "number" ? data.blessing_count : void 0;
      const pc = typeof data.prayer_count === "number" ? data.prayer_count : void 0;
      setBlessingCount((prev) => typeof bc === "number" && Number.isFinite(bc) ? bc : prev + 1);
      setPrayerCount((prev) => typeof pc === "number" && Number.isFinite(pc) ? pc : prev);
      setAlreadyBlessing(true);
      if (typeof data.already_prayer === "boolean") setAlreadyPrayer(data.already_prayer);
      toast.success("Gracias, ¡que sea de bendición!");
    }).catch(() => toast.error("No se pudo registrar")).finally(() => setLoadingBlessing(false));
  };
  const handlePrayer = () => {
    if (alreadyPrayer || loadingPrayer) return;
    setLoadingPrayer(true);
    handleReaction(route("tenant.public.devotionals.prayer", [tenant.slug, devotional.id]), (data) => {
      const bc = typeof data.blessing_count === "number" ? data.blessing_count : void 0;
      const pc = typeof data.prayer_count === "number" ? data.prayer_count : void 0;
      setBlessingCount((prev) => typeof bc === "number" && Number.isFinite(bc) ? bc : prev);
      setPrayerCount((prev) => typeof pc === "number" && Number.isFinite(pc) ? pc : prev + 1);
      setAlreadyPrayer(true);
      if (typeof data.already_blessing === "boolean") setAlreadyBlessing(data.already_blessing);
      toast.success("Gracias por orar");
    }).catch(() => toast.error("No se pudo registrar")).finally(() => setLoadingPrayer(false));
  };
  const registerShare = () => {
    const { headers } = getCsrfHeadersAndBody();
    fetch(route("tenant.public.devotionals.share", [tenant.slug, devotional.id]), {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({}),
      credentials: "same-origin"
    }).catch(() => {
    });
  };
  const copyLink = () => {
    registerShare();
    navigator.clipboard.writeText(shareUrl).then(() => toast.success("Enlace copiado")).catch(() => toast.error("No se pudo copiar"));
  };
  const shareWhatsApp = () => {
    registerShare();
    const u = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    window.open(u, "_blank");
  };
  const shareEmail = () => {
    registerShare();
    const u = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`;
    window.location.href = u;
  };
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: `${devotional.title} - Devocionales - ${tenant.name}` }),
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
      /* @__PURE__ */ jsx(
        Link,
        {
          href: route("tenant.public.devotionals", tenant.slug),
          className: "text-sm font-medium text-primary hover:underline inline-flex items-center gap-1 mb-4",
          children: "← Volver a Devocionales"
        }
      ),
      /* @__PURE__ */ jsxs("article", { className: "overflow-hidden", children: [
        devotional.cover_image && /* @__PURE__ */ jsx("div", { className: "w-full aspect-[1200/630] max-h-56 bg-slate-100 relative overflow-hidden rounded-2xl mb-6", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: devotional.cover_image,
            alt: "",
            className: "w-full h-full object-cover"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight", children: devotional.title }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm text-slate-500", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "size-4 shrink-0" }),
              formatDate(devotional.date)
            ] }),
            devotional.author && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(User, { className: "size-4 shrink-0" }),
              devotional.author
            ] })
          ] }),
          devotional.scripture_reference && /* @__PURE__ */ jsxs("div", { className: "border-l-4 border-amber-600/80 pl-4 py-2 space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-amber-800 uppercase tracking-widest", children: devotional.scripture_reference }),
            devotional.scripture_text && /* @__PURE__ */ jsxs("p", { className: "text-slate-700 leading-relaxed italic text-[15px]", children: [
              "“",
              devotional.scripture_text,
              "”"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: bodyIsHtml ? /* @__PURE__ */ jsx(
            "div",
            {
              className: "prose prose-slate prose-sm max-w-none text-justify leading-relaxed text-slate-700 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_img]:rounded-lg [&_a]:text-primary [&_a]:underline",
              dangerouslySetInnerHTML: { __html: devotional.body }
            }
          ) : /* @__PURE__ */ jsx("p", { className: "text-slate-700 text-justify leading-relaxed whitespace-pre-wrap", children: devotional.body }) }),
          devotional.reflection_question && /* @__PURE__ */ jsxs("div", { className: "py-4 px-0 border-t border-b border-slate-200", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-primary uppercase tracking-wider mb-2", children: "Pregunta de reflexión" }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-800 font-medium leading-relaxed", children: devotional.reflection_question })
          ] }),
          devotional.prayer && /* @__PURE__ */ jsxs("div", { className: "py-4 px-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2", children: "Oración" }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-700 leading-relaxed whitespace-pre-wrap italic", children: devotional.prayer })
          ] }),
          embedUrl && /* @__PURE__ */ jsx("div", { className: "rounded-xl overflow-hidden border border-slate-200 bg-slate-900", children: /* @__PURE__ */ jsx("div", { className: "aspect-video w-full", children: /* @__PURE__ */ jsx(
            "iframe",
            {
              src: embedUrl,
              title: "Video del devocional",
              className: "w-full h-full",
              allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
              allowFullScreen: true
            }
          ) }) }),
          devotional.external_link && /* @__PURE__ */ jsxs(
            "a",
            {
              href: devotional.external_link,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 active:scale-[0.99] transition-colors shadow-md",
              children: [
                /* @__PURE__ */ jsx(ExternalLink, { className: "size-4 shrink-0" }),
                "Ver artículo o recurso externo"
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "pt-8 mt-8 border-t border-slate-200 space-y-5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-600", children: "¿Te bendijo este devocional?" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleBlessing,
                  disabled: alreadyBlessing || loadingBlessing,
                  className: `w-full inline-flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 shadow-sm ${alreadyBlessing ? "bg-emerald-500 text-white border-2 border-emerald-600 cursor-default" : "bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md active:scale-[0.98]"}`,
                  children: [
                    /* @__PURE__ */ jsx(Heart, { className: `size-5 shrink-0 ${alreadyBlessing ? "fill-current" : ""}` }),
                    /* @__PURE__ */ jsx("span", { className: "truncate", children: "Fue de bendición" }),
                    /* @__PURE__ */ jsx("span", { className: "min-w-[1.25rem] inline-flex justify-center rounded-full bg-black/10 px-1.5 py-0.5 text-xs font-bold tabular-nums shrink-0", children: Number.isFinite(blessingCount) ? blessingCount : 0 })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: handlePrayer,
                  disabled: alreadyPrayer || loadingPrayer,
                  className: `w-full inline-flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 shadow-sm ${alreadyPrayer ? "bg-amber-500 text-white border-2 border-amber-600 cursor-default" : "bg-white text-slate-700 border-2 border-slate-200 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md active:scale-[0.98]"}`,
                  children: [
                    /* @__PURE__ */ jsx(HandHeart, { className: "size-5 shrink-0" }),
                    /* @__PURE__ */ jsx("span", { className: "truncate", children: "Orando" }),
                    /* @__PURE__ */ jsx("span", { className: "min-w-[1.25rem] inline-flex justify-center rounded-full bg-black/10 px-1.5 py-0.5 text-xs font-bold tabular-nums shrink-0", children: Number.isFinite(prayerCount) ? prayerCount : 0 })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-5 border-t border-slate-100", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-600 mb-3", children: "Compartir este devocional" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: shareWhatsApp,
                    className: "flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-md hover:shadow-lg transition-all active:scale-[0.98]",
                    children: [
                      /* @__PURE__ */ jsx(Share2, { className: "size-5 shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: "WhatsApp" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: copyLink,
                    className: "flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors active:scale-[0.98]",
                    children: [
                      /* @__PURE__ */ jsx(Copy, { className: "size-5 shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: "Copiar" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: shareEmail,
                    className: "flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors active:scale-[0.98]",
                    children: [
                      /* @__PURE__ */ jsx(Mail, { className: "size-5 shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: "Correo" })
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  DevotionalShow as default
};
