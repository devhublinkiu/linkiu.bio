import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { P as PublicLayout, H as Header } from "./Header-CiFZ-R5L.js";
import { ArrowLeft, Radio, MessageCircle, ExternalLink } from "lucide-react";
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
function buildChatUrl(tenantSlug, sermonId, liveChatId, pageToken) {
  const base = route("tenant.public.sermons.chat", [tenantSlug, sermonId]);
  const params = new URLSearchParams({ live_chat_id: liveChatId });
  if (pageToken) params.set("pageToken", pageToken);
  return `${base}?${params.toString()}`;
}
function SermonShow({ tenant, sermon }) {
  const brandColors = tenant.brand_colors ?? {};
  const bg_color = brandColors.bg_color ?? "#1e3a5f";
  const isLive = sermon.status === "live";
  const liveChatId = sermon.live_chat_id ?? null;
  const [messages, setMessages] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [pollingIntervalMs, setPollingIntervalMs] = useState(5e3);
  const chatEndRef = useRef(null);
  const pollingRef = useRef(null);
  const nextPageTokenRef = useRef(null);
  const pollingIntervalRef = useRef(5e3);
  nextPageTokenRef.current = nextPageToken;
  pollingIntervalRef.current = pollingIntervalMs;
  useEffect(() => {
    if (!liveChatId || !tenant.slug) return;
    const poll = (pageToken) => {
      const url = buildChatUrl(tenant.slug, sermon.id, liveChatId, pageToken);
      fetch(url, { headers: { Accept: "application/json" } }).then((res) => res.json()).then((data) => {
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages((prev) => {
            const byId = new Map(prev.map((m) => [m.id, m]));
            data.messages.forEach((m) => m.id && byId.set(m.id, m));
            return Array.from(byId.values()).sort(
              (a, b) => new Date(a.published_at ?? 0).getTime() - new Date(b.published_at ?? 0).getTime()
            );
          });
        }
        setNextPageToken(data.nextPageToken ?? null);
        setPollingIntervalMs(data.pollingIntervalMillis ?? 5e3);
      }).catch(() => {
      });
    };
    poll(null);
    const schedule = () => {
      pollingRef.current = setTimeout(() => {
        poll(nextPageTokenRef.current);
        schedule();
      }, pollingIntervalRef.current);
    };
    schedule();
    return () => {
      if (pollingRef.current) clearTimeout(pollingRef.current);
    };
  }, [liveChatId, tenant.slug, sermon.id]);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: `${sermon.title} - ${tenant.name}` }),
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
          href: route("tenant.public.sermons", tenant.slug),
          className: "inline-flex items-center gap-1.5 text-sm font-medium text-primary mb-4",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" }),
            "Volver a predicas"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        isLive && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white", children: [
          /* @__PURE__ */ jsx(Radio, { className: "size-3.5" }),
          "EN VIVO"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-slate-900 line-clamp-2", children: sermon.title })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg", children: /* @__PURE__ */ jsx(
        "iframe",
        {
          src: sermon.embed_url,
          title: sermon.title,
          className: "w-full h-full",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowFullScreen: true
        }
      ) }),
      liveChatId ? /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-2 border-b border-slate-200 bg-white", children: [
          /* @__PURE__ */ jsx(MessageCircle, { className: "size-4 text-slate-600" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-slate-800", children: "Chat en vivo" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "max-h-64 overflow-y-auto p-2 space-y-2", children: [
          messages.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 py-4 text-center", children: "Cargando mensajes..." }) : messages.map((msg) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2 text-sm", children: [
            msg.profile_image ? /* @__PURE__ */ jsx(
              "img",
              {
                src: msg.profile_image,
                alt: "",
                className: "w-7 h-7 rounded-full shrink-0 object-cover"
              }
            ) : /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-full bg-slate-300 shrink-0 flex items-center justify-center text-xs text-slate-500 font-medium", children: (msg.author || "?").slice(0, 1) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-700", children: msg.author }),
              /* @__PURE__ */ jsx("span", { className: "text-slate-500 mx-1", children: "·" }),
              /* @__PURE__ */ jsx("span", { className: "text-slate-800 break-words", children: msg.text })
            ] })
          ] }, msg.id ?? msg.published_at ?? msg.text)),
          /* @__PURE__ */ jsx("div", { ref: chatEndRef })
        ] })
      ] }) : isLive || sermon.status === "upcoming" ? /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-xl border border-slate-200 bg-amber-50 px-3 py-3", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-800", children: "El chat en vivo no está disponible para esta transmisión. Comprueba en YouTube Studio que el chat esté activado para el directo." }) }) : null,
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: sermon.watch_url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900",
          children: [
            /* @__PURE__ */ jsx(ExternalLink, { className: "size-4" }),
            "Ver en YouTube"
          ]
        }
      )
    ] })
  ] });
}
export {
  SermonShow as default
};
