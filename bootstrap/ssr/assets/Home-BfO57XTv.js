import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useRef, useState, useEffect, forwardRef, useImperativeHandle, useContext, createContext } from "react";
import { usePage, Link, Head } from "@inertiajs/react";
import { u as useCart, P as PublicLayout } from "./PublicLayout-BPgzBK4n.js";
import { H as Header } from "./Header-CDUqNXGd.js";
import { ChevronLeft, ChevronRight, ExternalLink, Flame, Heart, Plus, Clock } from "lucide-react";
import { u as useFavorites, P as ProductDetailDrawer } from "./ProductDetailDrawer-D9Lykdzm.js";
import { f as formatPrice, c as cn } from "./utils-B0hQsrDj.js";
import { motion } from "motion/react";
import "sonner";
import "framer-motion";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./button-BdX_X5dq.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./input-B_4qRSOV.js";
import "./label-L_u-fyc1.js";
import "@radix-ui/react-label";
import "./textarea-BpljFL5D.js";
import "react-use";
import "./sheet-BFMMArVC.js";
import "clsx";
import "tailwind-merge";
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
function CategoryGrid({ categories }) {
  const { currentTenant } = usePage().props;
  if (!categories || categories.length === 0 || !currentTenant) return null;
  return /* @__PURE__ */ jsxs("div", { className: "w-full px-4 mb-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-900", children: "Categorías" }),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: route("tenant.menu", [currentTenant.slug]),
          className: "text-sm font-semibold text-pink-600 hover:text-pink-700",
          children: "Ver todo"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-4", children: categories.map((category) => /* @__PURE__ */ jsxs(
      Link,
      {
        href: route("tenant.menu.category", [currentTenant.slug, category.slug]),
        className: "flex flex-col items-center gap-2.5 group",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "w-[4.5rem] h-[4.5rem] rounded-[1.2rem] bg-white shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-active:scale-95 border border-slate-100/80 overflow-hidden relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-white to-slate-50 opacity-50" }),
            category.icon ? /* @__PURE__ */ jsx(
              "img",
              {
                src: category.icon.icon_url,
                alt: category.name,
                className: "w-9 h-9 object-contain relative z-10 opacity-90 group-hover:opacity-100 transition-opacity"
              }
            ) : /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-300 font-bold text-xs relative z-10", children: category.name.charAt(0) })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-slate-600 text-center leading-tight line-clamp-2 px-0.5 group-hover:text-slate-900 transition-colors", children: category.name })
        ]
      },
      category.id
    )) })
  ] });
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
const ProductList = forwardRef(function ProductList2({ products, currency = "$", hideTitle = false, section, layout = "horizontal" }, ref) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const sliderRef = useRef(null);
  useImperativeHandle(ref, () => ({
    scrollPrev() {
      if (!sliderRef.current) return;
      const card = sliderRef.current.querySelector("[data-featured-card]");
      const step = (card?.getBoundingClientRect().width ?? 224) + 16;
      sliderRef.current.scrollBy({ left: -step, behavior: "smooth" });
    },
    scrollNext() {
      if (!sliderRef.current) return;
      const card = sliderRef.current.querySelector("[data-featured-card]");
      const step = (card?.getBoundingClientRect().width ?? 224) + 16;
      sliderRef.current.scrollBy({ left: step, behavior: "smooth" });
    }
  }), []);
  if (!products || products.length === 0) return null;
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };
  const showTitle = !hideTitle && section !== "destacados" && section !== "top_selling" && section !== "category";
  const isVertical = layout === "vertical";
  return /* @__PURE__ */ jsxs("div", { className: "w-full px-4 mb-4", children: [
    showTitle && /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-400 uppercase mb-4", children: "Todos los productos" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: isVertical ? sliderRef : void 0,
        className: isVertical ? "flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4 [scrollbar-width:none]" : "flex flex-col gap-4",
        children: products.map((product) => {
          const priceVal = Number(product.price);
          const originalPriceVal = Number(product.original_price);
          const isFav = isFavorite(product.id);
          const hasDiscount = originalPriceVal > priceVal;
          const discountPercent = hasDiscount ? Math.round((originalPriceVal - priceVal) / originalPriceVal * 100) : 0;
          if (isVertical) {
            return /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => handleProductClick(product),
                className: "w-56 shrink-0 snap-start bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100/80 transition-all duration-300 active:scale-[0.98] group cursor-pointer",
                "data-featured-card": true,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "relative aspect-[1/1] overflow-hidden bg-gray-100", children: [
                    product.image_url ? /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: product.image_url,
                        alt: product.name,
                        className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      }
                    ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-300", children: /* @__PURE__ */ jsx("svg", { className: "w-10 h-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }),
                    product.is_featured && /* @__PURE__ */ jsxs("div", { className: "absolute top-2 left-2 bg-amber-400/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-0.5 z-10", children: [
                      /* @__PURE__ */ jsx(Flame, { className: "w-3 h-3 fill-white" }),
                      /* @__PURE__ */ jsx("span", { children: "TOP" })
                    ] }),
                    hasDiscount && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow z-10", children: [
                      "-",
                      discountPercent,
                      "%"
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        },
                        className: `absolute top-2 right-2 p-1.5 rounded-full shadow transition-all z-10 ${isFav ? "text-rose-500 bg-white/90" : "text-white/90 bg-black/20 hover:bg-black/30"}`,
                        children: /* @__PURE__ */ jsx(Heart, { className: `size-4 ${isFav ? "fill-current" : ""}` })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-1.5", children: product.name }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                        hasDiscount && /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 line-through block", children: formatPrice(Number(product.original_price ?? 0)) }),
                        /* @__PURE__ */ jsx("span", { className: `text-base font-bold tracking-tight ${hasDiscount ? "text-rose-600" : "text-gray-900"}`, children: formatPrice(Number(product.price)) })
                      ] }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: (e) => {
                            e.stopPropagation();
                            handleProductClick(product);
                          },
                          className: "shrink-0 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow active:scale-95 transition-transform",
                          children: /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" })
                        }
                      )
                    ] })
                  ] })
                ]
              },
              product.id
            );
          }
          return /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => handleProductClick(product),
              className: "bg-white rounded-[1.5rem] p-3 shadow-sm border border-slate-100 flex gap-4 transition-all duration-300 active:scale-[0.98] group relative overflow-hidden cursor-pointer",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "w-28 h-28 shrink-0 rounded-[1.2rem] overflow-hidden relative bg-gray-100", children: [
                  product.image_url ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: product.image_url,
                      alt: product.name,
                      className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    }
                  ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-300", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }),
                  product.is_featured && /* @__PURE__ */ jsxs("div", { className: "absolute top-2 left-2 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-0.5 z-10", children: [
                    /* @__PURE__ */ jsx(Flame, { className: "w-3 h-3 fill-white" }),
                    /* @__PURE__ */ jsx("span", { children: "TOP" })
                  ] }),
                  hasDiscount && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 bg-rose-500 text-white text-[10px] font-bold py-0.5 text-center shadow-lg transform translate-y-full group-hover:translate-y-0 transition-transform duration-300", children: [
                    "-",
                    discountPercent,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col justify-between py-1 relative", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      },
                      className: `absolute -top-1 right-0 p-2 transition-all duration-300 rounded-full active:scale-90 ${isFav ? "text-rose-500 bg-rose-50/50" : "text-slate-300 hover:text-rose-400"}`,
                      children: /* @__PURE__ */ jsx(Heart, { className: `size-5 ${isFav ? "fill-current" : ""}` })
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "pr-8", children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900 leading-tight mb-1 line-clamp-2", children: product.name }),
                    product.short_description && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 line-clamp-2 font-medium leading-relaxed", children: product.short_description })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between mt-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                      hasDiscount && /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 line-through font-medium decoration-gray-400 decoration-1", children: formatPrice(Number(product.original_price ?? 0)) }),
                      /* @__PURE__ */ jsx("span", { className: `text-lg font-black tracking-tight ${hasDiscount ? "text-rose-600" : "text-gray-900"}`, children: formatPrice(Number(product.price)) })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          handleProductClick(product);
                        },
                        className: "w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/20 active:bg-slate-800 transition-colors transform active:scale-95",
                        children: /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" })
                      }
                    )
                  ] })
                ] })
              ]
            },
            product.id
          );
        })
      }
    ),
    selectedProduct && /* @__PURE__ */ jsx(
      ProductDetailDrawer,
      {
        product: selectedProduct,
        isOpen: isDrawerOpen,
        onClose: () => setIsDrawerOpen(false)
      }
    )
  ] });
});
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
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
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
  const handlePointerDownCapture = (e) => {
    if (!carouselRef.current) return;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    scrollLeftStartRef.current = carouselRef.current.scrollLeft;
    carouselRef.current.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e) => {
    if (!carouselRef.current) return;
    const dx = startXRef.current - e.clientX;
    if (Math.abs(dx) > 5) hasDraggedRef.current = true;
    carouselRef.current.scrollLeft = scrollLeftStartRef.current + dx;
  };
  const handlePointerUp = (e) => {
    carouselRef.current?.releasePointerCapture(e.pointerId);
  };
  const handlePointerLeave = () => {
  };
  const handleClick = (e) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      hasDraggedRef.current = false;
    }
  };
  return /* @__PURE__ */ jsx(CarouselContext.Provider, { value: { activeIndex }, children: /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex w-full overflow-x-auto overscroll-x-auto scroll-smooth snap-x snap-mandatory py-4 [scrollbar-width:none] md:py-6 cursor-grab active:cursor-grabbing select-none touch-pan-x",
        ref: carouselRef,
        onScroll: checkScrollability,
        onPointerDownCapture: handlePointerDownCapture,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onPointerLeave: handlePointerLeave,
        onClickCapture: handleClick,
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
function Home({
  tenant,
  sliders,
  categories,
  featured_products = [],
  top_selling_products = [],
  top_categories = [],
  location_status_message = null,
  tickers,
  promo_shorts = []
}) {
  const brandColors = tenant.brand_colors ?? {};
  const bg_color = brandColors.bg_color ?? "#db2777";
  const name_color = brandColors.name_color ?? "#ffffff";
  const description_color = brandColors.description_color;
  const destacadosSliderRef = useRef(null);
  const topSellingSliderRef = useRef(null);
  const categorySliderRefs = useRef([]);
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: tenant.name }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsx(
        Header,
        {
          tenantName: tenant.name,
          logoUrl: tenant.logo_url,
          description: tenant.store_description,
          bgColor: bg_color,
          textColor: name_color,
          descriptionColor: description_color
        }
      ),
      location_status_message && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700", children: [
        /* @__PURE__ */ jsx(Clock, { className: "size-4 text-slate-500 shrink-0", "aria-hidden": true }),
        /* @__PURE__ */ jsx("span", { children: location_status_message })
      ] }),
      /* @__PURE__ */ jsx(PromotionalTicker, { tickers })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-gray-50 p-4 -mt-4 relative z-0 pb-20 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsx(BannerSlider, { sliders, tenantSlug: tenant.slug }),
      /* @__PURE__ */ jsx(CategoryGrid, { categories }),
      Array.isArray(featured_products) && featured_products.length > 0 && /* @__PURE__ */ jsxs("section", { className: "w-full px-4", "aria-labelledby": "destacados-heading", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("h2", { id: "destacados-heading", className: "text-lg font-bold text-slate-900", children: "Destacados" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("tenant.menu", { tenant: tenant.slug }),
                className: "text-sm font-medium text-slate-500 hover:text-slate-700",
                children: "Ver todos"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => destacadosSliderRef.current?.scrollPrev(),
                  className: "p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors",
                  "aria-label": "Anterior",
                  children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-5" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => destacadosSliderRef.current?.scrollNext(),
                  className: "p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors",
                  "aria-label": "Siguiente",
                  children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-5" })
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(ProductList, { ref: destacadosSliderRef, products: featured_products, section: "destacados", layout: "vertical" })
      ] }),
      Array.isArray(top_selling_products) && top_selling_products.length > 0 && /* @__PURE__ */ jsxs("section", { className: "w-full px-4", "aria-labelledby": "mas-vendidos-heading", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("h2", { id: "mas-vendidos-heading", className: "text-lg font-bold text-slate-900", children: "Los 3 más vendidos" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("tenant.menu", { tenant: tenant.slug }),
                className: "text-sm font-medium text-slate-500 hover:text-slate-700",
                children: "Ver todos"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => topSellingSliderRef.current?.scrollPrev(),
                  className: "p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors",
                  "aria-label": "Anterior",
                  children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-5" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => topSellingSliderRef.current?.scrollNext(),
                  className: "p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors",
                  "aria-label": "Siguiente",
                  children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-5" })
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(ProductList, { ref: topSellingSliderRef, products: top_selling_products, section: "top_selling", layout: "vertical" })
      ] }),
      Array.isArray(promo_shorts) && promo_shorts.length > 0 && /* @__PURE__ */ jsxs("section", { className: "w-full", "aria-labelledby": "promos-heading", children: [
        /* @__PURE__ */ jsx("h2", { id: "promos-heading", className: "text-[140px] font-bold text-gray-200 px-4 flex items-center -mb-24", children: "Shorts" }),
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
      top_categories.map((category, index) => /* @__PURE__ */ jsxs("section", { className: "w-full px-4", "aria-labelledby": `category-${category.id}-heading`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("h2", { id: `category-${category.id}-heading`, className: "text-lg font-bold text-slate-900", children: category.name }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("tenant.menu.category", { tenant: tenant.slug, slug: category.slug }),
                className: "text-sm font-medium text-slate-500 hover:text-slate-700",
                children: "Ver todos"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => categorySliderRefs.current[index]?.scrollPrev(),
                  className: "p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors",
                  "aria-label": "Anterior",
                  children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-5" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => categorySliderRefs.current[index]?.scrollNext(),
                  className: "p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors",
                  "aria-label": "Siguiente",
                  children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-5" })
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          ProductList,
          {
            ref: (el) => {
              categorySliderRefs.current[index] = el;
            },
            products: category.products,
            section: "category",
            layout: "vertical"
          }
        )
      ] }, category.id))
    ] })
  ] });
}
export {
  Home as default
};
