import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useRef, useState, useEffect } from "react";
import { Link2, ChevronLeft, ChevronRight, SquareArrowUpRight, Play } from "lucide-react";
import { c as cn } from "./utils-B0hQsrDj.js";
import { D as Dialog, a as DialogContent, c as DialogTitle } from "./dialog-1eiaoMgl.js";
import { u as usePublicLayoutPortal } from "./HeaderShellAll-dJouNd-7.js";
function LinkedBadge() {
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: "pointer-events-none absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/95 ring-1 ring-white/15 backdrop-blur-sm",
      "aria-hidden": true,
      children: [
        /* @__PURE__ */ jsx(Link2, { className: "size-3 opacity-90", strokeWidth: 2 }),
        /* @__PURE__ */ jsx("span", { children: "Ver promo" })
      ]
    }
  );
}
function BannerSlide({ slider, url, total, imageLoading = "lazy" }) {
  const media = slider.desktop_image_url ? /* @__PURE__ */ jsxs("picture", { className: "block h-full w-full", children: [
    /* @__PURE__ */ jsx("source", { media: "(min-width: 768px)", srcSet: slider.desktop_image_url }),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: slider.image_url,
        alt: slider.name,
        className: "h-full w-full object-cover",
        loading: imageLoading,
        decoding: "async"
      }
    )
  ] }) : /* @__PURE__ */ jsx(
    "img",
    {
      src: slider.image_url,
      alt: slider.name,
      className: "h-full w-full object-cover",
      loading: imageLoading,
      decoding: "async"
    }
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative w-full flex-shrink-0 overflow-hidden",
      role: "group",
      "aria-roledescription": "slide",
      "aria-label": `${slider.name}, ${total} promociones en total`,
      children: [
        url ? /* @__PURE__ */ jsxs("a", { href: url, className: "relative block h-full w-full min-h-0", "aria-label": slider.name, children: [
          /* @__PURE__ */ jsx(LinkedBadge, {}),
          media
        ] }) : media,
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" })
      ]
    }
  );
}
function CarouselDots({ count, activeRealIndex, onGoTo }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/15 px-2 py-1 ring-1 ring-white/10 backdrop-blur-[2px]",
      role: "tablist",
      "aria-label": "Ir a una promoción",
      children: Array.from({ length: count }, (_, idx) => {
        const isActive = activeRealIndex === idx;
        return /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": isActive,
            "aria-label": `Ir a la promoción ${idx + 1} de ${count}`,
            onClick: () => onGoTo(idx),
            className: `h-1.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 ${isActive ? "w-3 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"}`
          },
          idx
        );
      })
    }
  );
}
function CarouselNav({ onPrev, onNext }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onPrev,
        className: "absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white shadow-lg backdrop-blur-md transition-opacity duration-300 hover:bg-black/50 sm:opacity-100 opacity-0 group-hover:opacity-100",
        "aria-label": "Slide anterior",
        children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-5", "aria-hidden": true })
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onNext,
        className: "absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white shadow-lg backdrop-blur-md transition-opacity duration-300 hover:bg-black/50 sm:opacity-100 opacity-0 group-hover:opacity-100",
        "aria-label": "Slide siguiente",
        children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-5", "aria-hidden": true })
      }
    )
  ] });
}
function SlidersPromo({ sliders, aspectRatio = "video", tenantSlug }) {
  const scrollContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const infiniteSliders = sliders && sliders.length > 1 ? [sliders[sliders.length - 1], ...sliders, sliders[0]] : sliders || [];
  const extendedLength = infiniteSliders.length;
  const scrollBehavior = () => reduceMotion ? "auto" : "smooth";
  useEffect(() => {
    if (sliders && sliders.length > 1 && scrollContainerRef.current) {
      const itemWidth = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollLeft = itemWidth;
    }
  }, [sliders?.length]);
  const scrollToSlide = (index, behavior) => {
    if (!scrollContainerRef.current) return;
    const itemWidth = scrollContainerRef.current.offsetWidth;
    const b = behavior ?? scrollBehavior();
    setIsScrolling(true);
    scrollContainerRef.current.scrollTo({
      left: index * itemWidth,
      behavior: b
    });
  };
  const handleScrollEnd = () => {
    setIsScrolling(false);
    if (!scrollContainerRef.current || !sliders?.length) return;
    const itemWidth = scrollContainerRef.current.offsetWidth;
    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const index = Math.round(scrollLeft / itemWidth);
    if (index === 0) {
      scrollContainerRef.current.scrollTo({ left: sliders.length * itemWidth, behavior: "auto" });
      setActiveIndex(sliders.length);
    } else if (index === extendedLength - 1) {
      scrollContainerRef.current.scrollTo({ left: itemWidth, behavior: "auto" });
      setActiveIndex(1);
    } else {
      setActiveIndex(index);
    }
  };
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let timeout;
    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleScrollEnd, 150);
    };
    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [extendedLength, sliders?.length]);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;
  useEffect(() => {
    if (!sliders || sliders.length <= 1 || isHovered || reduceMotion) return;
    const interval = setInterval(() => {
      const next = activeIndexRef.current + 1;
      scrollToSlide(next);
    }, 4e3);
    return () => clearInterval(interval);
  }, [isHovered, sliders?.length, reduceMotion]);
  const nextSlide = () => {
    if (isScrolling) return;
    scrollToSlide(activeIndex + 1, scrollBehavior());
  };
  const prevSlide = () => {
    if (isScrolling) return;
    scrollToSlide(activeIndex - 1, scrollBehavior());
  };
  const goToRealSlide = (realIdx) => {
    if (isScrolling || !sliders?.length || sliders.length <= 1) return;
    scrollToSlide(realIdx + 1, scrollBehavior());
  };
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "wide":
        return "aspect-[2/1]";
      case "video":
      default:
        return "aspect-video";
    }
  };
  if (!sliders || sliders.length === 0) return null;
  const clickUrl = (s) => s.link_type !== "none" ? route("tenant.sliders.click", [tenantSlug, s.id]) : null;
  let realActiveIndex = activeIndex - 1;
  if (activeIndex === 0) realActiveIndex = sliders.length - 1;
  if (activeIndex === extendedLength - 1) realActiveIndex = 0;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "region",
      "aria-roledescription": "carrusel",
      "aria-label": "Banner de promociones",
      className: "group relative mt-4 w-full",
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: scrollContainerRef,
            className: `relative flex w-full overflow-x-hidden ${getAspectRatioClass()} rounded-2xl bg-gray-200 shadow-sm`,
            children: infiniteSliders.map((slider, index) => {
              const url = clickUrl(slider);
              const isFirstReal = sliders.length > 1 && index === 1;
              return /* @__PURE__ */ jsx(
                BannerSlide,
                {
                  slider,
                  url,
                  total: sliders.length,
                  imageLoading: isFirstReal ? "eager" : "lazy"
                },
                `${slider.id}-${index}`
              );
            })
          }
        ),
        sliders.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(CarouselNav, { onPrev: prevSlide, onNext: nextSlide }),
          /* @__PURE__ */ jsx(CarouselDots, { count: sliders.length, activeRealIndex: realActiveIndex, onGoTo: goToRealSlide })
        ] })
      ]
    }
  );
}
function TickerLink({ href, label = "Ver enlace", className }) {
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      className: cn(
        "inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-gray-50 px-2 py-1 text-xs font-bold text-slate-950 transition-opacity hover:opacity-90",
        className
      ),
      children: [
        /* @__PURE__ */ jsx("span", { className: "whitespace-nowrap leading-normal", children: label }),
        /* @__PURE__ */ jsx("span", { className: "inline-flex size-4 shrink-0 items-center justify-center", "aria-hidden": true, children: /* @__PURE__ */ jsx(SquareArrowUpRight, { className: "size-4", strokeWidth: 2 }) })
      ]
    }
  );
}
function TickersPromo({ tickers }) {
  if (!tickers || tickers.length === 0) {
    return null;
  }
  const duplicated = [...tickers, ...tickers];
  return /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-full overflow-hidden", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "flex animate-marquee whitespace-nowrap py-1 hover:[animation-play-state:paused]",
        role: "marquee",
        "aria-label": "Promociones y anuncios",
        children: duplicated.map((ticker, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "inline-flex shrink-0 items-center gap-[11px] px-4 py-2",
            style: { backgroundColor: ticker.background_color },
            children: [
              /* @__PURE__ */ jsx(
                "p",
                {
                  className: "shrink-0 whitespace-nowrap text-center text-sm font-bold leading-normal",
                  style: { color: ticker.text_color },
                  children: ticker.content
                }
              ),
              ticker.link ? /* @__PURE__ */ jsx(TickerLink, { href: ticker.link }) : null
            ]
          },
          `${ticker.id}-${index}`
        ))
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee ${Math.max(15, tickers.length * 8)}s linear infinite;
                    width: max-content;
                }
                ` })
  ] });
}
function buildEmbedUrl(embedUrl, autoplay) {
  try {
    const url = new URL(embedUrl);
    if (autoplay) {
      url.searchParams.set("autoplay", "true");
      url.searchParams.set("muted", "false");
      url.searchParams.set("preload", "true");
    }
    return url.toString();
  } catch {
    return autoplay ? `${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=true&muted=false` : embedUrl;
  }
}
function ShortsFeedModal({ active, onOpenChange }) {
  const portalContainer = usePublicLayoutPortal();
  return /* @__PURE__ */ jsx(Dialog, { open: active !== null, onOpenChange, children: /* @__PURE__ */ jsx(
    DialogContent,
    {
      portalContainer: portalContainer ?? void 0,
      showCloseButton: true,
      className: "max-h-[90vh] max-w-[min(22rem,calc(100vw-2rem))] gap-0 overflow-hidden border-0 bg-black p-0 text-white sm:max-w-[min(22rem,calc(100vw-2rem))] [&_button]:text-white [&_button]:hover:bg-white/15",
      children: active && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "sr-only", children: active.name }),
        /* @__PURE__ */ jsx("div", { className: "relative aspect-[9/16] w-full bg-black", children: /* @__PURE__ */ jsx(
          "iframe",
          {
            title: active.name,
            src: buildEmbedUrl(active.short_embed_url, true),
            className: "absolute inset-0 size-full",
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowFullScreen: true
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 border-t border-white/10 bg-slate-950 p-3 text-white", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold leading-snug", children: active.name }),
          active.description ? /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed text-white/80", children: active.description }) : null,
          active.action_url && active.action_url !== "#" ? /* @__PURE__ */ jsx(
            "a",
            {
              href: active.action_url,
              className: "inline-flex rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-900 transition-colors hover:bg-white/90",
              children: "Ver promoción"
            }
          ) : null
        ] })
      ] })
    }
  ) });
}
const LINK_TYPE_LABELS = {
  category: "Categoría",
  product: "Producto"
};
function youtubePosterFromEmbedUrl(embedUrl) {
  try {
    const u = new URL(embedUrl);
    let id = null;
    if (u.hostname.includes("youtube.com") || u.hostname === "www.youtube.com") {
      if (u.pathname.startsWith("/embed/")) {
        id = u.pathname.replace("/embed/", "").split("/")[0] ?? null;
      } else {
        id = u.searchParams.get("v");
      }
    } else if (u.hostname === "youtu.be") {
      id = u.pathname.replace(/^\//, "") || null;
    }
    if (!id) return null;
    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  } catch {
    return null;
  }
}
function ShortsFeed({ items, className }) {
  const [active, setActive] = useState(null);
  const [failedPosterIds, setFailedPosterIds] = useState(() => /* @__PURE__ */ new Set());
  if (!items?.length) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: cn("grid w-full grid-cols-3 gap-1 pb-6", className),
        role: "list",
        "data-name": "ShortsFeed",
        children: items.map((item) => {
          const posterRaw = item.poster_url?.trim() || youtubePosterFromEmbedUrl(item.short_embed_url);
          const poster = posterRaw && !failedPosterIds.has(item.id) ? posterRaw : null;
          const badgeLabel = LINK_TYPE_LABELS[item.link_type] ?? null;
          const hasAction = item.action_url && item.action_url !== "#";
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              role: "listitem",
              onClick: () => setActive(item),
              className: "group relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-slate-900 text-left shadow-sm ring-1 ring-slate-200/90 transition-transform active:scale-[0.98] md:active:scale-100 md:hover:ring-slate-300",
              "aria-label": `Reproducir short: ${item.name}`,
              children: [
                poster ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: poster,
                    alt: "",
                    className: "absolute inset-0 size-full object-cover [image-orientation:from-image] transition-transform duration-300 group-hover:scale-105",
                    loading: "lazy",
                    decoding: "async",
                    onError: () => setFailedPosterIds((prev) => {
                      if (prev.has(item.id)) return prev;
                      const next = new Set(prev);
                      next.add(item.id);
                      return next;
                    })
                  }
                ) : /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute inset-0 bg-gradient-to-b from-slate-700 to-slate-900",
                    "aria-hidden": true
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "flex size-12 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md ring-2 ring-white/40 md:size-14", children: /* @__PURE__ */ jsx(Play, { className: "size-6 translate-x-0.5 fill-current md:size-7", "aria-hidden": true }) }) }),
                /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-1.5 pb-2 pt-8 md:px-2 md:pb-2.5", children: [
                  /* @__PURE__ */ jsx("p", { className: "line-clamp-2 text-[10px] font-semibold leading-tight text-white md:text-xs", children: item.name }),
                  (badgeLabel || hasAction) && /* @__PURE__ */ jsx("div", { className: "mt-1 flex flex-wrap gap-1", children: badgeLabel ? /* @__PURE__ */ jsx("span", { className: "inline-flex rounded bg-white/20 px-1 py-px text-[9px] font-medium text-white backdrop-blur-sm", children: badgeLabel }) : null })
                ] })
              ]
            },
            item.id
          );
        })
      }
    ),
    /* @__PURE__ */ jsx(ShortsFeedModal, { active, onOpenChange: (open) => !open && setActive(null) })
  ] });
}
export {
  SlidersPromo as S,
  TickersPromo as T,
  ShortsFeed as a
};
