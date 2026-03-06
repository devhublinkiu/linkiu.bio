import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useRef, useState, useEffect, useContext, createContext } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { c as cn } from "./utils-B0hQsrDj.js";
import { motion } from "motion/react";
function BannerSlider({ sliders, aspectRatio = "video", tenantSlug }) {
  const scrollContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const infiniteSliders = sliders && sliders.length > 1 ? [sliders[sliders.length - 1], ...sliders, sliders[0]] : sliders || [];
  const extendedLength = infiniteSliders.length;
  useEffect(() => {
    if (sliders && sliders.length > 1 && scrollContainerRef.current) {
      const itemWidth = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollLeft = itemWidth;
    }
  }, [sliders?.length]);
  const scrollToSlide = (index, behavior = "smooth") => {
    if (!scrollContainerRef.current) return;
    const itemWidth = scrollContainerRef.current.offsetWidth;
    setIsScrolling(true);
    scrollContainerRef.current.scrollTo({
      left: index * itemWidth,
      behavior
    });
  };
  const handleScrollEnd = () => {
    setIsScrolling(false);
    if (!scrollContainerRef.current) return;
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
    if (!sliders || sliders.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      const next = activeIndexRef.current + 1;
      scrollToSlide(next);
    }, 4e3);
    return () => clearInterval(interval);
  }, [isHovered, sliders?.length]);
  const nextSlide = () => {
    if (isScrolling) return;
    scrollToSlide(activeIndex + 1);
  };
  const prevSlide = () => {
    if (isScrolling) return;
    scrollToSlide(activeIndex - 1);
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
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "region",
      "aria-roledescription": "carrusel",
      "aria-label": "Banner de promociones",
      className: "w-full relative group mt-4",
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: scrollContainerRef,
            className: `w-full overflow-x-hidden flex ${getAspectRatioClass()} rounded-2xl bg-gray-200 shadow-sm relative`,
            children: infiniteSliders.map((slider, index) => {
              const url = clickUrl(slider);
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "w-full flex-shrink-0 relative overflow-hidden",
                  role: "group",
                  "aria-label": `Slide ${index + 1} de ${sliders.length}`,
                  children: [
                    url ? /* @__PURE__ */ jsx("a", { href: url, className: "block w-full h-full", "aria-label": slider.name, children: /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: slider.image_url,
                        alt: slider.name,
                        className: "w-full h-full object-cover"
                      }
                    ) }) : /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: slider.image_url,
                        alt: slider.name,
                        className: "w-full h-full object-cover"
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" })
                  ]
                },
                `${slider.id}-${index}`
              );
            })
          }
        ),
        sliders.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: prevSlide,
              className: "absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hover:bg-white/50 sm:opacity-100",
              "aria-label": "Slide anterior",
              children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5", "aria-hidden": true })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: nextSlide,
              className: "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hover:bg-white/50 sm:opacity-100",
              "aria-label": "Slide siguiente",
              children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5", "aria-hidden": true })
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 px-2 py-1 rounded-full bg-black/10 backdrop-blur-[2px]",
              role: "tablist",
              "aria-label": "Indicadores de diapositivas",
              children: sliders.map((_, idx) => {
                if (idx >= sliders.length) return null;
                let realActiveIndex = activeIndex - 1;
                if (activeIndex === 0) realActiveIndex = sliders.length - 1;
                if (activeIndex === extendedLength - 1) realActiveIndex = 0;
                const isActive = realActiveIndex === idx;
                return /* @__PURE__ */ jsx(
                  "div",
                  {
                    role: "tab",
                    "aria-selected": isActive,
                    "aria-label": `Ir a slide ${idx + 1}`,
                    className: `w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? "bg-white w-3" : "bg-white/60"}`
                  },
                  idx
                );
              })
            }
          )
        ] })
      ]
    }
  );
}
function PromotionalTicker({ tickers }) {
  if (!tickers || tickers.length === 0) return null;
  const duplicated = [...tickers, ...tickers];
  return /* @__PURE__ */ jsxs("div", { className: "w-full overflow-hidden relative z-10", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "py-1 flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]",
        role: "marquee",
        "aria-label": "Promociones y anuncios",
        children: duplicated.map((ticker, index) => {
          const Tag = ticker.link ? "a" : "span";
          const linkProps = ticker.link ? { href: ticker.link, target: "_blank", rel: "noopener noreferrer" } : {};
          return /* @__PURE__ */ jsxs(
            Tag,
            {
              ...linkProps,
              className: `
                                inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-bold
                                transition-transform hover:scale-105 shrink-0
                                ${ticker.link ? "cursor-pointer" : ""}
                            `,
              style: {
                backgroundColor: ticker.background_color,
                color: ticker.text_color
              },
              children: [
                /* @__PURE__ */ jsx("span", { children: ticker.content }),
                ticker.link && /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 ml-1" })
              ]
            },
            `${ticker.id}-${index}`
          );
        })
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
const CarouselContext = createContext({ activeIndex: 0 });
function ObservedCard({
  index,
  setActiveIndex,
  children,
  className
}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveIndex(index);
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
          }, 0);
        }
      },
      { threshold: 0.5, rootMargin: "0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index, setActiveIndex]);
  return /* @__PURE__ */ jsx("div", { ref, className, children });
}
const Carousel = ({ items, initialScroll = 0 }) => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);
  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft: scrollLeft2, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft2 > 0);
      setCanScrollRight(scrollLeft2 < scrollWidth - clientWidth);
    }
  };
  const scrollLeft = () => {
    if (carouselRef.current) {
      const step = carouselRef.current.querySelector("[data-promo-card]")?.getBoundingClientRect().width ?? 280;
      const gap = 16;
      carouselRef.current.scrollBy({ left: -(step + gap), behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (carouselRef.current) {
      const step = carouselRef.current.querySelector("[data-promo-card]")?.getBoundingClientRect().width ?? 280;
      const gap = 16;
      carouselRef.current.scrollBy({ left: step + gap, behavior: "smooth" });
    }
  };
  return /* @__PURE__ */ jsx(CarouselContext.Provider, { value: { activeIndex }, children: /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex w-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory py-4 [scrollbar-width:none] md:py-6 touch-pan-x [-webkit-overflow-scrolling:touch] [overscroll-behavior-x:contain]",
        ref: carouselRef,
        onScroll: checkScrollability,
        children: [
          /* @__PURE__ */ jsx("div", { className: cn("absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l") }),
          /* @__PURE__ */ jsx("div", { className: cn("flex flex-row justify-start gap-4 pl-4", "mx-auto max-w-7xl"), children: items.map((item, index) => /* @__PURE__ */ jsx(
            ObservedCard,
            {
              index,
              setActiveIndex,
              className: "rounded-3xl last:pr-[5%] md:last:pr-[33%] snap-start shrink-0",
              children: /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      delay: 0.2 * index,
                      ease: "easeOut"
                    }
                  },
                  children: item
                }
              )
            },
            "obs-" + index
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mt-2 flex justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50",
          onClick: scrollLeft,
          disabled: !canScrollLeft,
          "aria-label": "Anterior",
          children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-6 w-6 text-gray-500" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50",
          onClick: scrollRight,
          disabled: !canScrollRight,
          "aria-label": "Siguiente",
          children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-6 w-6 text-gray-500" })
        }
      )
    ] })
  ] }) });
};
const LINK_TYPE_LABELS = {
  category: "Categoría",
  product: "Producto"
};
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
    return `${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=true&muted=false`;
  }
}
const PromoCard = ({
  card,
  index
}) => {
  const { activeIndex } = useContext(CarouselContext);
  const badgeLabel = LINK_TYPE_LABELS[card.link_type] ?? null;
  const hasAction = card.action_url && card.action_url !== "#";
  const isActive = activeIndex === index;
  const iframeSrc = isActive ? buildEmbedUrl(card.short_embed_url, true) : "about:blank";
  return /* @__PURE__ */ jsx(
    "article",
    {
      "data-promo-card": true,
      className: "relative z-10 flex w-56 flex-shrink-0 flex-col overflow-hidden rounded-3xl bg-gray-100 shadow-lg md:w-96 dark:bg-neutral-900",
      "aria-labelledby": `promo-title-${index}`,
      children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-[9/16] w-full overflow-hidden bg-black rounded-t-3xl", children: [
        /* @__PURE__ */ jsx(
          "iframe",
          {
            title: card.title,
            src: iframeSrc,
            className: "h-full w-full",
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowFullScreen: true
          },
          iframeSrc
        ),
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 top-0 z-10 flex flex-col gap-3 bg-gradient-to-b from-black/70 to-transparent px-4 pt-4 pb-6", children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              id: `promo-title-${index}`,
              className: "font-semibold text-white text-xl drop-shadow md:text-3xl",
              children: card.title
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            badgeLabel && /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-white/50 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white/95 border border-white/30", children: badgeLabel }),
            hasAction && /* @__PURE__ */ jsx(
              "a",
              {
                href: card.action_url,
                className: "shrink-0 rounded-lg border border-white/60 bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/30 transition-colors",
                children: "Ver promoción"
              }
            )
          ] })
        ] })
      ] })
    }
  );
};
export {
  BannerSlider as B,
  Carousel as C,
  PromotionalTicker as P,
  PromoCard as a
};
