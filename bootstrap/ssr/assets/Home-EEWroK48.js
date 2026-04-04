import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useState, useEffect, useMemo, useCallback, forwardRef, useImperativeHandle } from "react";
import { Link, Head } from "@inertiajs/react";
import { P as PublicLayout } from "./PublicLayout-B1Bmlg8s.js";
import { u as useFavorites, P as ProductDetailDrawer } from "./ProductDetailDrawer-DnydXzpn.js";
import { T as TickersPromo, S as SlidersPromo, a as ShortsFeed } from "./index-DiOeUUHd.js";
import { ArrowUpRight, ArrowLeft, ArrowRight, Flame, Users, ArrowDown, Plus, Heart, ChevronDown, ArrowLeftRight, Store, CircleCheck, WandSparkles, Truck, HouseHeart, CalendarCheck, Armchair } from "lucide-react";
import { c as cn, f as formatPrice } from "./utils-B0hQsrDj.js";
import { toast } from "sonner";
import { g as getEcho } from "./echo-DaX0krWj.js";
import "./HeaderShellAll-dJouNd-7.js";
import "./badge-C_PGNHO8.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "./dialog-1eiaoMgl.js";
import "@radix-ui/react-dialog";
import "./button-BdX_X5dq.js";
import "./input-B_4qRSOV.js";
import "./label-L_u-fyc1.js";
import "@radix-ui/react-label";
import "./textarea-BpljFL5D.js";
import "motion/react";
import "framer-motion";
import "./util-Dl4_fw_3.js";
import "./sheet-BFMMArVC.js";
import "clsx";
import "tailwind-merge";
import "@ably/laravel-echo";
import "ably";
function ExploreCategoriesButton({
  tenantSlug,
  label = "Ver todas las categorías",
  className
}) {
  const href = route("tenant.menu", { tenant: tenantSlug });
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href,
      className: cn(
        "group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-normal transition-colors sm:w-auto",
        "bg-slate-200 text-slate-950",
        "hover:bg-slate-950 hover:text-slate-100",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950",
        className
      ),
      children: [
        /* @__PURE__ */ jsx("span", { className: "whitespace-nowrap", children: label }),
        /* @__PURE__ */ jsx(
          ArrowUpRight,
          {
            className: "size-4 shrink-0 text-slate-950 transition-colors group-hover:text-slate-100",
            strokeWidth: 2,
            "aria-hidden": true
          }
        )
      ]
    }
  );
}
function HeroCategoryShort({
  title = "Categorías",
  headingId = "category-short-heading",
  availableCount,
  pillSuffix = "Disponibles",
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  navPrevAriaLabel = "Página anterior de categorías",
  navNextAriaLabel = "Página siguiente de categorías",
  className
}) {
  const navDisabled = !onPrev && !onNext;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn("relative flex w-full items-center justify-between gap-3 mt-4 mb-4", className),
      "data-name": "Hero_categoryShort",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "h2",
            {
              id: headingId,
              className: "shrink-0 whitespace-nowrap text-center text-base font-bold leading-none text-slate-950",
              children: title
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "flex shrink-0 items-center justify-center rounded-full bg-slate-100 px-2 py-1",
              "data-name": "button_explorer_categoryShort",
              children: /* @__PURE__ */ jsxs("p", { className: "text-center text-[11px] font-normal leading-none text-slate-600", children: [
                availableCount,
                " ",
                pillSuffix
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onPrev,
              disabled: navDisabled || !onPrev || prevDisabled,
              className: "flex shrink-0 items-center justify-center rounded-lg border border-slate-950 bg-slate-100 p-1 text-slate-950 transition-colors hover:bg-slate-200 disabled:pointer-events-none disabled:opacity-40",
              "aria-label": navPrevAriaLabel,
              children: /* @__PURE__ */ jsx(ArrowLeft, { className: "size-4", strokeWidth: 2, "aria-hidden": true })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onNext,
              disabled: navDisabled || !onNext || nextDisabled,
              className: "flex shrink-0 items-center justify-center rounded-lg border border-slate-950 bg-slate-100 p-1 text-slate-950 transition-colors hover:bg-slate-200 disabled:pointer-events-none disabled:opacity-40",
              "aria-label": navNextAriaLabel,
              children: /* @__PURE__ */ jsx(ArrowRight, { className: "size-4", strokeWidth: 2, "aria-hidden": true })
            }
          )
        ] })
      ]
    }
  );
}
function ItemsCategoryShort({ category, tenantSlug, className }) {
  const href = route("tenant.menu.category", { tenant: tenantSlug, slug: category.slug });
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href,
      className: cn(
        "group flex w-[72px] shrink-0 flex-col items-center gap-2 outline-none",
        className
      ),
      "data-name": "Items_categoryShort",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-2",
              "transition-shadow duration-200",
              "group-hover:shadow-[0px_14px_14px_0px_rgba(0,0,0,0.09)]",
              "group-focus-visible:ring-2 group-focus-visible:ring-slate-950 group-focus-visible:ring-offset-2"
            ),
            children: /* @__PURE__ */ jsx("div", { className: "relative size-14 shrink-0 overflow-hidden", children: category.icon ? /* @__PURE__ */ jsx(
              "img",
              {
                src: category.icon.icon_url,
                alt: "",
                className: "size-full object-contain"
              }
            ) : /* @__PURE__ */ jsx("div", { className: "flex size-full items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-400", children: category.name.charAt(0).toUpperCase() }) })
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "min-h-[24px] w-full text-center text-[11px] font-normal leading-3 text-black line-clamp-2", children: category.name })
      ]
    }
  );
}
const ITEMS_PER_PAGE_MOBILE = 8;
const ITEMS_PER_PAGE_DESKTOP = 10;
const MD_UP = "(min-width: 768px)";
function chunkCategories(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}
function CategoryShort({ categories, tenantSlug, className }) {
  const scrollRef = useRef(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_MOBILE);
  useEffect(() => {
    const mq = window.matchMedia(MD_UP);
    const apply = () => setItemsPerPage(mq.matches ? ITEMS_PER_PAGE_DESKTOP : ITEMS_PER_PAGE_MOBILE);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  const pages = useMemo(() => chunkCategories(categories, itemsPerPage), [categories, itemsPerPage]);
  const pageCount = pages.length;
  const multiPage = pageCount > 1;
  const syncPageFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || pageCount === 0) return;
    const w = el.offsetWidth;
    if (w <= 0) return;
    const idx = Math.round(el.scrollLeft / w);
    setPageIndex(Math.min(Math.max(0, idx), pageCount - 1));
  }, [pageCount]);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollLeft = 0;
    }
    setPageIndex(0);
  }, [categories, itemsPerPage]);
  const goToPage = useCallback(
    (index) => {
      const el = scrollRef.current;
      if (!el || pageCount <= 0) return;
      const clamped = Math.min(Math.max(0, index), pageCount - 1);
      const w = el.offsetWidth;
      el.scrollTo({ left: clamped * w, behavior: "smooth" });
      setPageIndex(clamped);
    },
    [pageCount]
  );
  const goPrev = useCallback(() => goToPage(pageIndex - 1), [goToPage, pageIndex]);
  const goNext = useCallback(() => goToPage(pageIndex + 1), [goToPage, pageIndex]);
  if (!categories?.length) {
    return null;
  }
  return /* @__PURE__ */ jsxs("section", { className: cn("w-full", className), "aria-labelledby": "category-short-heading", children: [
    /* @__PURE__ */ jsx(
      HeroCategoryShort,
      {
        headingId: "category-short-heading",
        availableCount: categories.length,
        onPrev: multiPage ? goPrev : void 0,
        onNext: multiPage ? goNext : void 0,
        prevDisabled: pageIndex <= 0,
        nextDisabled: pageIndex >= pageCount - 1
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: scrollRef,
        onScroll: syncPageFromScroll,
        className: cn(
          "flex w-full snap-x snap-mandatory overflow-x-auto pb-1",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ),
        role: "region",
        "aria-roledescription": "carrusel",
        "aria-label": "Categorías por página",
        children: pages.map((pageCategories, pageIdx) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-full min-w-full shrink-0 snap-start",
            "aria-label": `Página ${pageIdx + 1} de ${pageCount}`,
            children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-x-1.5 gap-y-2 md:grid-cols-5 md:gap-x-1.5 md:gap-y-2.5", children: pageCategories.map((category) => /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(ItemsCategoryShort, { category, tenantSlug }) }, category.id)) })
          },
          pageIdx
        ))
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex w-full justify-center", children: /* @__PURE__ */ jsx(ExploreCategoriesButton, { tenantSlug }) })
  ] });
}
function BgHeaderTopBestSeller({ className }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]",
        className
      ),
      "aria-hidden": true,
      "data-name": "BgHeaderTopBestSeller",
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute left-[24%] top-[32%] h-[56px] w-[100px] rounded-full bg-blue-600 blur-[36px]" }),
        /* @__PURE__ */ jsx("div", { className: "absolute right-[24%] top-[32%] h-[72px] w-[150px] rounded-full bg-red-600 blur-[36px]" }),
        /* @__PURE__ */ jsx("div", { className: "absolute left-[48%] top-[40%] h-[32px] w-[56px] -translate-x-1/2 rounded-full bg-pink-600 blur-[36px]" })
      ]
    }
  );
}
const ICON_SRC = "/tenant/Shared/icon_top_best_seller.svg";
function HeaderTopBestSeller({
  headingId,
  topCount = 6,
  subtitle = "más vendidos",
  className
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "relative w-full overflow-hidden",
        className
      ),
      "data-name": "HeaderTopBestSeller",
      children: [
        /* @__PURE__ */ jsx(BgHeaderTopBestSeller, {}),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex w-full flex-col items-center justify-center gap-[9px] px-5 py-8 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "relative h-[112px] w-full max-w-[129px] shrink-0", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: ICON_SRC,
              alt: "",
              className: "h-full w-full object-contain object-center",
              width: 129,
              height: 112,
              decoding: "async"
            }
          ) }),
          /* @__PURE__ */ jsxs("h2", { id: headingId, className: "min-w-0 text-slate-950", children: [
            /* @__PURE__ */ jsxs("span", { className: "mb-0 block text-[40px] font-extrabold leading-[32px] tracking-[-2px]", children: [
              "Top ",
              topCount
            ] }),
            /* @__PURE__ */ jsx("span", { className: "block text-[24px] font-medium leading-[32px] tracking-[-1.2px]", children: subtitle })
          ] })
        ] })
      ]
    }
  );
}
function TopBestSellerCardBadges({
  showTopBadge = true,
  soldCount,
  hasDiscount,
  discountPercent,
  className
}) {
  const soldN = soldCount != null ? Number(soldCount) : NaN;
  const showSold = Number.isFinite(soldN) && soldN > 0;
  const iconClass = "block h-3 w-3 shrink-0";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn("flex w-full min-w-0 flex-wrap items-center gap-2", className),
      "data-name": "TopBestSellerCardBadges",
      children: [
        showTopBadge ? /* @__PURE__ */ jsxs("div", { className: "inline-flex h-5 min-h-5 shrink-0 items-center gap-1 rounded-full bg-amber-500 px-1.5", children: [
          /* @__PURE__ */ jsx(Flame, { className: cn(iconClass, "text-amber-100"), strokeWidth: 2, "aria-hidden": true }),
          /* @__PURE__ */ jsx("span", { className: "whitespace-nowrap text-[11px] font-medium leading-none text-amber-100", children: "TOP" })
        ] }) : null,
        showSold ? /* @__PURE__ */ jsxs(
          "div",
          {
            className: "inline-flex h-5 min-h-5 shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-1.5",
            title: "Unidades vendidas (últimos 30 días)",
            children: [
              /* @__PURE__ */ jsx(Users, { className: cn(iconClass, "text-emerald-800"), strokeWidth: 2, "aria-hidden": true }),
              /* @__PURE__ */ jsxs("span", { className: "whitespace-nowrap text-[11px] font-medium leading-none text-emerald-800", children: [
                "+",
                soldN
              ] })
            ]
          }
        ) : null,
        hasDiscount ? /* @__PURE__ */ jsxs("div", { className: "inline-flex h-5 min-h-5 shrink-0 items-center gap-1 rounded-full bg-red-600 px-1.5", children: [
          /* @__PURE__ */ jsx(ArrowDown, { className: cn(iconClass, "text-red-100"), strokeWidth: 2, "aria-hidden": true }),
          /* @__PURE__ */ jsxs("span", { className: "whitespace-nowrap text-[11px] font-bold leading-none text-red-100", children: [
            "-",
            discountPercent,
            "%"
          ] })
        ] }) : null
      ]
    }
  );
}
const ACTION = "[data-top-seller-action]";
function ItemProductTopBestSeller({
  name,
  imageUrl,
  price,
  originalPrice,
  soldCount,
  showTopBadge = true,
  onCardClick,
  onAddClick,
  onFavoriteClick,
  isFavorite = false,
  className
}) {
  const priceVal = Number(price);
  const originalPriceVal = originalPrice != null ? Number(originalPrice) : 0;
  const hasDiscount = originalPriceVal > priceVal && originalPriceVal > 0;
  const discountPercent = hasDiscount ? Math.round((originalPriceVal - priceVal) / originalPriceVal * 100) : 0;
  const handleCardClick = (e) => {
    if (e.target.closest(ACTION)) return;
    onCardClick?.();
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onCardClick?.();
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "button",
      tabIndex: 0,
      "aria-label": `Ver detalle: ${name}`,
      onClick: handleCardClick,
      onKeyDown: handleKeyDown,
      className: cn(
        "flex w-full min-w-0 cursor-pointer overflow-hidden rounded-lg bg-white ",
        className
      ),
      "data-name": "ItemProductTopBestSeller",
      children: [
        /* @__PURE__ */ jsx("div", { className: "relative h-[107px] w-[107px] shrink-0 overflow-hidden bg-slate-100", children: imageUrl ? /* @__PURE__ */ jsx(
          "img",
          {
            src: imageUrl,
            alt: "",
            className: "pointer-events-none absolute inset-0 size-full object-cover",
            loading: "lazy",
            decoding: "async"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-200", "aria-hidden": true }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col justify-center gap-[5px] bg-slate-100 px-[15px] py-2.5", children: [
          /* @__PURE__ */ jsx(
            TopBestSellerCardBadges,
            {
              showTopBadge,
              soldCount,
              hasDiscount,
              discountPercent
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "line-clamp-2 text-left text-[14px] font-medium leading-snug text-slate-950", children: name }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-col items-start gap-1.5 leading-none", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[16px] font-bold text-slate-950", children: formatPrice(priceVal) }),
              hasDiscount ? /* @__PURE__ */ jsx("p", { className: "text-[14px] font-normal text-slate-400 line-through decoration-solid", children: formatPrice(originalPriceVal) }) : null
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  "data-top-seller-action": true,
                  onClick: (e) => {
                    e.stopPropagation();
                    onAddClick?.(e);
                  },
                  className: "flex items-center justify-center rounded-full bg-slate-950 p-2 text-white transition-transform active:scale-95",
                  "aria-label": "Añadir o ver producto",
                  children: /* @__PURE__ */ jsx(Plus, { className: "size-5", strokeWidth: 2, "aria-hidden": true })
                }
              ),
              onFavoriteClick ? /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  "data-top-seller-action": true,
                  onClick: (e) => {
                    e.stopPropagation();
                    onFavoriteClick(e);
                  },
                  className: "flex items-center justify-center rounded-full bg-red-100 p-2 text-red-500 transition-colors hover:bg-red-100",
                  "aria-label": isFavorite ? "Quitar de favoritos" : "Añadir a favoritos",
                  children: /* @__PURE__ */ jsx(
                    Heart,
                    {
                      className: cn("size-5", isFavorite ? "fill-red-500 text-red-500" : "text-red-500"),
                      strokeWidth: 2,
                      "aria-hidden": true
                    }
                  )
                }
              ) : null
            ] })
          ] })
        ] })
      ]
    }
  );
}
function TopBestSellerExpandButton({ expanded, onToggle, className }) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: onToggle,
      className: cn(
        "mx-auto mt-3 flex items-center justify-center gap-1.5 rounded-full border border-slate-200/90 bg-slate-100/90 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-200/90",
        className
      ),
      "data-name": "TopBestSellerExpandButton",
      children: [
        expanded ? "Ver menos" : "Ver más productos",
        /* @__PURE__ */ jsx(
          ChevronDown,
          {
            className: cn("size-4 shrink-0 transition-transform", expanded && "rotate-180"),
            "aria-hidden": true
          }
        )
      ]
    }
  );
}
const INITIAL_VISIBLE = 3;
function TopBestSeller({
  products,
  onProductClick,
  topCount = 6,
  className
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [expanded, setExpanded] = useState(false);
  const list = products.slice(0, topCount);
  const canExpand = list.length > INITIAL_VISIBLE;
  const visibleList = expanded || !canExpand ? list : list.slice(0, INITIAL_VISIBLE);
  if (!list.length) {
    return null;
  }
  return /* @__PURE__ */ jsxs("section", { className: cn("w-full", className), "aria-labelledby": "top-best-seller-heading", children: [
    /* @__PURE__ */ jsx(HeaderTopBestSeller, { headingId: "top-best-seller-heading", topCount }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-col gap-3 px-1", "data-name": "TopBestSellerList", children: visibleList.map((product) => {
      const raw = product.sold_count_30d;
      const sold = typeof raw === "number" ? raw : typeof raw === "string" ? parseInt(raw, 10) : NaN;
      return /* @__PURE__ */ jsx(
        ItemProductTopBestSeller,
        {
          name: product.name,
          imageUrl: product.image_url,
          price: product.price,
          originalPrice: product.original_price,
          soldCount: Number.isFinite(sold) ? sold : void 0,
          showTopBadge: true,
          onCardClick: () => onProductClick(product),
          onAddClick: () => onProductClick(product),
          onFavoriteClick: (e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          },
          isFavorite: isFavorite(product.id)
        },
        product.id
      );
    }) }),
    canExpand ? /* @__PURE__ */ jsx(TopBestSellerExpandButton, { expanded, onToggle: () => setExpanded((v) => !v) }) : null
  ] });
}
function HeaderSectionProducts({
  title,
  availableCount,
  navPrevAriaLabel = "Anterior",
  navNextAriaLabel = "Siguiente",
  ...rest
}) {
  return /* @__PURE__ */ jsx(
    HeroCategoryShort,
    {
      title,
      availableCount,
      navPrevAriaLabel,
      navNextAriaLabel,
      ...rest
    }
  );
}
function ProductCardVertical({
  name,
  imageUrl,
  price,
  originalPrice,
  isFeatured = false,
  isFavorite = false,
  onCardClick,
  onFavoriteClick,
  onAddClick,
  className
}) {
  const priceVal = Number(price);
  const originalPriceVal = originalPrice != null ? Number(originalPrice) : 0;
  const hasDiscount = originalPriceVal > priceVal && originalPriceVal > 0;
  const discountPercent = hasDiscount ? Math.round((originalPriceVal - priceVal) / originalPriceVal * 100) : 0;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "group flex w-[200px] shrink-0 cursor-pointer snap-start flex-col overflow-hidden rounded-lg border border-slate-100/80 bg-white shadow-sm transition-all duration-300 active:scale-[0.98]",
        className
      ),
      "data-featured-card": true,
      "data-name": "ProductCardVertical",
      role: "button",
      tabIndex: 0,
      onClick: onCardClick,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardClick?.();
        }
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-[200px] w-full shrink-0 overflow-hidden rounded-t-lg bg-slate-100", children: [
          imageUrl ? /* @__PURE__ */ jsx(
            "img",
            {
              src: imageUrl,
              alt: "",
              className: "pointer-events-none absolute inset-0 size-full object-cover",
              loading: "lazy",
              decoding: "async"
            }
          ) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-200", "aria-hidden": true }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex h-full flex-col p-2", children: [
            onFavoriteClick ? /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: (e) => {
                  e.stopPropagation();
                  onFavoriteClick(e);
                },
                className: "flex shrink-0 items-center justify-center rounded-full bg-red-50 p-1 text-red-600 shadow-sm transition-colors hover:bg-red-100",
                "aria-label": isFavorite ? "Quitar de favoritos" : "Añadir a favoritos",
                children: /* @__PURE__ */ jsx(Heart, { className: cn("size-4", isFavorite && "fill-red-600"), strokeWidth: 2, "aria-hidden": true })
              }
            ) }) : /* @__PURE__ */ jsx("div", { className: "min-h-[24px]", "aria-hidden": true }),
            /* @__PURE__ */ jsxs("div", { className: "mt-auto flex w-full flex-wrap items-center gap-2", children: [
              isFeatured ? /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center justify-center gap-0.5 rounded-full bg-amber-500 px-1 py-0.5", children: [
                /* @__PURE__ */ jsx(Flame, { className: "size-3 shrink-0 text-amber-100", strokeWidth: 2, "aria-hidden": true }),
                /* @__PURE__ */ jsx("span", { className: "whitespace-nowrap text-center text-[10px] font-medium text-amber-100", children: "TOP" })
              ] }) : null,
              hasDiscount ? /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center justify-center gap-0.5 rounded-full bg-red-600 px-1 py-0.5", children: [
                /* @__PURE__ */ jsx(ArrowDown, { className: "size-3 shrink-0 text-red-100", strokeWidth: 2, "aria-hidden": true }),
                /* @__PURE__ */ jsxs("span", { className: "whitespace-nowrap text-center text-[10px] font-bold text-red-100", children: [
                  "-",
                  discountPercent,
                  "%"
                ] })
              ] }) : null,
              hasDiscount ? /* @__PURE__ */ jsx("div", { className: "flex shrink-0 items-center justify-center rounded-full bg-slate-200 px-1 py-0.5", children: /* @__PURE__ */ jsx("span", { className: "whitespace-nowrap text-center text-[10px] font-bold leading-none text-slate-950 line-through decoration-solid", children: formatPrice(originalPriceVal) }) }) : null
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex h-[88px] shrink-0 flex-col justify-between bg-slate-100 px-2 py-2.5 rounded-b-lg", children: [
          /* @__PURE__ */ jsx("p", { className: "w-full text-left text-[14px] font-normal leading-4 text-slate-950 line-clamp-2", children: name }),
          /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsx("p", { className: "shrink-0 whitespace-nowrap text-[16px] font-bold leading-4 text-slate-950", children: formatPrice(priceVal) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: (e) => {
                  e.stopPropagation();
                  onAddClick?.(e);
                },
                className: "flex shrink-0 items-center justify-center rounded-full bg-slate-950 p-2 text-white shadow-sm transition-transform active:scale-95",
                "aria-label": "Añadir al pedido",
                children: /* @__PURE__ */ jsx(Plus, { className: "size-5", strokeWidth: 2, "aria-hidden": true })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const ProductListVertical = forwardRef(function ProductListVertical2({ products, onProductClick }, ref) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const sliderRef = useRef(null);
  useImperativeHandle(ref, () => ({
    scrollPrev() {
      if (!sliderRef.current) return;
      const card = sliderRef.current.querySelector("[data-featured-card]");
      const step = (card?.getBoundingClientRect().width ?? 200) + 16;
      sliderRef.current.scrollBy({ left: -step, behavior: "smooth" });
    },
    scrollNext() {
      if (!sliderRef.current) return;
      const card = sliderRef.current.querySelector("[data-featured-card]");
      const step = (card?.getBoundingClientRect().width ?? 200) + 16;
      sliderRef.current.scrollBy({ left: step, behavior: "smooth" });
    }
  }));
  if (!products?.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: sliderRef,
      className: "flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4 [scrollbar-width:none]",
      "data-name": "ProductListVertical",
      children: products.map((product) => {
        const priceVal = Number(product.price);
        const isFav = isFavorite(product.id);
        return /* @__PURE__ */ jsx(
          ProductCardVertical,
          {
            name: product.name,
            imageUrl: product.image_url,
            price: priceVal,
            originalPrice: product.original_price,
            isFeatured: product.is_featured,
            isFavorite: isFav,
            onCardClick: () => onProductClick(product),
            onFavoriteClick: (e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            },
            onAddClick: (e) => {
              e.stopPropagation();
              onProductClick(product);
            }
          },
          product.id
        );
      })
    }
  );
});
function mapOrderStatusToTimeline(status) {
  switch (status) {
    case "pending":
      return "recibido";
    case "confirmed":
      return "confirmado";
    case "preparing":
      return "preparando";
    case "ready":
      return "en_camino";
    case "completed":
      return "entregado";
    default:
      return "recibido";
  }
}
function isTerminalPublicOrderStatus(status) {
  return status === "completed" || status === "cancelled";
}
function InfoTimelineShort({
  estimatedDeliveryRange = "6:34 p.m. - 6:49 p.m.",
  orderNumber = "0035",
  className
}) {
  const orderDisplay = orderNumber.startsWith("#") ? orderNumber : `#${orderNumber}`;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn("flex w-full items-center justify-between gap-2", className),
      "data-name": "InfoTimelineShort",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] font-normal leading-tight text-slate-500", children: "Entrega estimada" }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm font-bold leading-tight text-slate-950", children: estimatedDeliveryRange })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex shrink-0 items-center justify-center text-slate-400", "aria-hidden": true, children: /* @__PURE__ */ jsx(ArrowLeftRight, { className: "size-5", strokeWidth: 2 }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 text-right", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] font-normal leading-tight text-slate-500", children: "Número de pedido" }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm font-bold leading-tight text-slate-950", children: orderDisplay })
        ] })
      ]
    }
  );
}
const STEPS$1 = [
  { status: "recibido", label: "Recibido", Icon: Store },
  { status: "confirmado", label: "Confirmado", Icon: CircleCheck },
  { status: "preparando", label: "Preparando", Icon: WandSparkles },
  { status: "en_camino", label: "En camino", Icon: Truck },
  { status: "entregado", label: "Entregado", Icon: HouseHeart }
];
const N$1 = STEPS$1.length;
function statusToIndex$1(status) {
  const i = STEPS$1.findIndex((s) => s.status === status);
  return i >= 0 ? i : 0;
}
function fillPercentToCurrentStep$1(currentIdx) {
  if (N$1 <= 1) return 100;
  return currentIdx / (N$1 - 1) * 100;
}
function TimelineShortOrders({ status = "recibido", className }) {
  const currentIdx = statusToIndex$1(status);
  const fillPercent = fillPercentToCurrentStep$1(currentIdx);
  const trackInsetPct = 100 / (2 * N$1);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn("w-full px-0 py-1", className),
      "data-name": "TimelineShortOrders",
      role: "group",
      "aria-label": `Estado del pedido: ${STEPS$1[currentIdx].label}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "pointer-events-none absolute top-[13px] z-0 h-0.5",
              style: {
                left: `${trackInsetPct}%`,
                right: `${trackInsetPct}%`
              },
              children: /* @__PURE__ */ jsxs("div", { className: "relative h-full w-full", children: [
                /* @__PURE__ */ jsx("div", { className: "h-full w-full rounded-full bg-slate-200" }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute left-0 top-0 h-full rounded-full bg-emerald-600 transition-[width] duration-300 ease-out",
                    style: { width: `${fillPercent}%` }
                  }
                )
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "relative z-10 grid w-full gap-0",
              style: { gridTemplateColumns: `repeat(${N$1}, minmax(0, 1fr))` },
              children: STEPS$1.map((step, i) => {
                const isFuture = i > currentIdx;
                return /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full transition-colors",
                      isFuture ? "bg-emerald-100 text-emerald-800" : "bg-emerald-600 text-white shadow-sm"
                    ),
                    children: /* @__PURE__ */ jsx(step.Icon, { className: "block size-4 shrink-0", strokeWidth: 2, "aria-hidden": true })
                  }
                ) }, step.status);
              })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "mt-1 grid w-full gap-0 px-0",
            style: { gridTemplateColumns: `repeat(${N$1}, minmax(0, 1fr))` },
            children: STEPS$1.map((step, i) => /* @__PURE__ */ jsx("div", { className: "flex justify-center px-0.5", children: i === currentIdx ? /* @__PURE__ */ jsx("span", { className: "text-center text-[10px] font-medium leading-tight text-slate-600", children: step.label }) : /* @__PURE__ */ jsx("span", { className: "min-h-[14px]", "aria-hidden": true }) }, `${step.status}-label`))
          }
        )
      ]
    }
  );
}
function OrderTimelineShortCard({ order, className }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "w-full rounded-3xl bg-slate-50 p-4",
        className
      ),
      "data-name": "OrderTimelineShortCard",
      "data-order-id": order.id,
      children: [
        /* @__PURE__ */ jsx(
          InfoTimelineShort,
          {
            estimatedDeliveryRange: order.estimated_delivery_range,
            orderNumber: order.order_number
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "mt-4 w-full", children: /* @__PURE__ */ jsx(TimelineShortOrders, { status: order.timeline_status }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 empty:hidden", "data-name": "TimelineShortOrderActions" })
      ]
    }
  );
}
function formatTimeLabel(raw) {
  const t = raw.trim();
  if (!t) return "—";
  const m = t.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!m) return t;
  const d = /* @__PURE__ */ new Date();
  d.setHours(parseInt(m[1], 10), parseInt(m[2], 10), 0, 0);
  return d.toLocaleTimeString("es", { hour: "numeric", minute: "2-digit" });
}
function InfoReservationTimelineShort({
  reservationDate,
  reservationTime,
  partySize,
  reservationNumber,
  className
}) {
  const refDisplay = reservationNumber.startsWith("#") ? reservationNumber : `#${reservationNumber}`;
  const dateObj = /* @__PURE__ */ new Date(`${reservationDate}T12:00:00`);
  const dateLine = Number.isNaN(dateObj.getTime()) ? reservationDate : dateObj.toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" });
  const timeLine = formatTimeLabel(reservationTime);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn("flex w-full items-center justify-between gap-2", className),
      "data-name": "InfoReservationTimelineShort",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] font-normal leading-tight text-slate-500", children: "Fecha y hora" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-sm font-bold leading-tight text-slate-950", children: [
            dateLine,
            " · ",
            timeLine
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex shrink-0 items-center justify-center text-slate-400", "aria-hidden": true, children: /* @__PURE__ */ jsx(ArrowLeftRight, { className: "size-5", strokeWidth: 2 }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 text-right", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] font-normal leading-tight text-slate-500", children: "Reserva" }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm font-bold leading-tight text-slate-950", children: refDisplay }),
          /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-[11px] font-medium text-slate-600", children: [
            partySize,
            " ",
            partySize === 1 ? "persona" : "personas"
          ] })
        ] })
      ]
    }
  );
}
const STEPS = [
  { status: "solicitada", label: "Solicitada", Icon: CalendarCheck },
  { status: "confirmada", label: "Confirmada", Icon: CircleCheck },
  { status: "sentado", label: "Sentado", Icon: Armchair }
];
const N = STEPS.length;
function statusToIndex(status) {
  const i = STEPS.findIndex((s) => s.status === status);
  return i >= 0 ? i : 0;
}
function fillPercentToCurrentStep(currentIdx) {
  if (N <= 1) return 100;
  return currentIdx / (N - 1) * 100;
}
function TimelineShortReservation({
  status = "solicitada",
  className
}) {
  const currentIdx = statusToIndex(status);
  const fillPercent = fillPercentToCurrentStep(currentIdx);
  const trackInsetPct = 100 / (2 * N);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn("w-full px-0 py-1", className),
      "data-name": "TimelineShortReservation",
      role: "group",
      "aria-label": `Estado de la reserva: ${STEPS[currentIdx].label}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "pointer-events-none absolute top-[13px] z-0 h-0.5",
              style: {
                left: `${trackInsetPct}%`,
                right: `${trackInsetPct}%`
              },
              children: /* @__PURE__ */ jsxs("div", { className: "relative h-full w-full", children: [
                /* @__PURE__ */ jsx("div", { className: "h-full w-full rounded-full bg-slate-200" }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute left-0 top-0 h-full rounded-full bg-emerald-600 transition-[width] duration-300 ease-out",
                    style: { width: `${fillPercent}%` }
                  }
                )
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "relative z-10 grid w-full gap-0",
              style: { gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` },
              children: STEPS.map((step, i) => {
                const isFuture = i > currentIdx;
                return /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full transition-colors",
                      isFuture ? "bg-emerald-100 text-emerald-800" : "bg-emerald-600 text-white shadow-sm"
                    ),
                    children: /* @__PURE__ */ jsx(step.Icon, { className: "block size-4 shrink-0", strokeWidth: 2, "aria-hidden": true })
                  }
                ) }, step.status);
              })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "mt-1 grid w-full gap-0 px-0",
            style: { gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` },
            children: STEPS.map((step, i) => /* @__PURE__ */ jsx("div", { className: "flex justify-center px-0.5", children: i === currentIdx ? /* @__PURE__ */ jsx("span", { className: "text-center text-[10px] font-medium leading-tight text-slate-600", children: step.label }) : /* @__PURE__ */ jsx("span", { className: "min-h-[14px]", "aria-hidden": true }) }, `${step.status}-label`))
          }
        )
      ]
    }
  );
}
function ReservationTimelineShortCard({
  reservation,
  className
}) {
  const reservationNumber = String(reservation.id).padStart(4, "0");
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "w-full rounded-3xl bg-slate-50 p-4",
        className
      ),
      "data-name": "ReservationTimelineShortCard",
      "data-reservation-id": reservation.id,
      children: [
        /* @__PURE__ */ jsx(
          InfoReservationTimelineShort,
          {
            reservationDate: reservation.reservation_date,
            reservationTime: reservation.reservation_time,
            partySize: reservation.party_size,
            reservationNumber
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "mt-4 w-full", children: /* @__PURE__ */ jsx(TimelineShortReservation, { status: reservation.timeline_status }) })
      ]
    }
  );
}
function mergeSlides(orders, reservations) {
  const rows = [];
  orders.forEach((data) => {
    rows.push({
      slide: { kind: "order", data },
      sort: new Date(data.created_at ?? 0).getTime()
    });
  });
  reservations.forEach((data) => {
    rows.push({
      slide: { kind: "reservation", data },
      sort: new Date(data.created_at).getTime()
    });
  });
  return rows.sort((a, b) => b.sort - a.sort).map((r) => r.slide);
}
function SuccesTimelineShort({
  orders = [],
  reservations = [],
  tenantId,
  title = "Tus órdenes activas",
  pillSuffixSingular = "orden",
  pillSuffixPlural = "órdenes",
  className
}) {
  const scrollRef = useRef(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [liveOrders, setLiveOrders] = useState(orders);
  const [liveReservations, setLiveReservations] = useState(reservations);
  const slides = useMemo(
    () => mergeSlides(liveOrders, liveReservations),
    [liveOrders, liveReservations]
  );
  const count = slides.length;
  const pillSuffix = count === 1 ? pillSuffixSingular : pillSuffixPlural;
  const orderIdsKey = orders.map((o) => o.id).join(",");
  const reservationIdsKey = reservations.map((r) => r.id).join(",");
  const slidesSyncKey = `${orderIdsKey}|${reservationIdsKey}`;
  const syncIndexFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || count === 0) return;
    const w = el.offsetWidth;
    if (w <= 0) return;
    const idx = Math.round(el.scrollLeft / w);
    setSlideIndex(Math.min(Math.max(0, idx), count - 1));
  }, [count]);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScrollEnd = () => syncIndexFromScroll();
    let debounce;
    const onScroll = () => {
      clearTimeout(debounce);
      debounce = setTimeout(onScrollEnd, 64);
    };
    el.addEventListener("scroll", onScroll);
    el.addEventListener("scrollend", onScrollEnd);
    return () => {
      clearTimeout(debounce);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", onScrollEnd);
    };
  }, [syncIndexFromScroll]);
  useEffect(() => {
    setLiveOrders(orders);
  }, [orderIdsKey]);
  useEffect(() => {
    setLiveReservations(reservations);
  }, [reservationIdsKey]);
  useEffect(() => {
    setSlideIndex(0);
    const el = scrollRef.current;
    if (el) el.scrollTo({ left: 0, behavior: "auto" });
  }, [slidesSyncKey]);
  useEffect(() => {
    if (slideIndex > 0 && slideIndex >= slides.length) {
      const next = Math.max(0, slides.length - 1);
      setSlideIndex(next);
      const el = scrollRef.current;
      if (el && slides.length > 0) {
        const w = el.offsetWidth;
        el.scrollTo({ left: next * w, behavior: "auto" });
      }
    }
  }, [slides.length, slideIndex]);
  const liveOrderIdsKey = liveOrders.map((o) => o.id).join(",");
  useEffect(() => {
    const echoInstance = getEcho();
    if (!echoInstance?.connector || !tenantId || liveOrders.length === 0) {
      return;
    }
    const channels = [];
    liveOrders.forEach((o) => {
      const orderId = o.id;
      const ch = echoInstance.channel(`tenant.${tenantId}.orders.${orderId}`).listen(
        ".order.status.updated",
        (e) => {
          if (e.id !== orderId) return;
          if (isTerminalPublicOrderStatus(e.status)) {
            setLiveOrders((prev) => prev.filter((row) => row.id !== e.id));
            if (e.status === "cancelled") {
              toast.info("Tu pedido ha sido cancelado.");
            } else {
              toast.success("¡Pedido entregado! Gracias por tu compra.");
            }
            return;
          }
          setLiveOrders(
            (prev) => prev.map(
              (row) => row.id === e.id ? { ...row, timeline_status: mapOrderStatusToTimeline(e.status) } : row
            )
          );
          if (e.status === "confirmed") toast.success("¡Tu pedido ha sido confirmado!");
          else if (e.status === "preparing") toast.success("¡Están preparando tu pedido!");
          else if (e.status === "ready") toast.success("¡Tu pedido está listo!");
        }
      );
      channels.push(ch);
    });
    return () => {
      channels.forEach((ch) => ch.stopListening(".order.status.updated"));
    };
  }, [tenantId, liveOrderIdsKey]);
  const goTo = (i) => {
    const el = scrollRef.current;
    if (!el || count === 0) return;
    const clamped = Math.max(0, Math.min(i, count - 1));
    const w = el.offsetWidth;
    el.scrollTo({ left: clamped * w, behavior: "smooth" });
    setSlideIndex(clamped);
  };
  if (slides.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: cn("w-full pt-2", className),
      "aria-labelledby": "succes-timeline-heading",
      children: [
        /* @__PURE__ */ jsx(
          HeaderSectionProducts,
          {
            headingId: "succes-timeline-heading",
            title,
            availableCount: count,
            pillSuffix,
            onPrev: count > 1 ? () => goTo(slideIndex - 1) : void 0,
            onNext: count > 1 ? () => goTo(slideIndex + 1) : void 0,
            prevDisabled: count <= 1 || slideIndex <= 0,
            nextDisabled: count <= 1 || slideIndex >= count - 1,
            navPrevAriaLabel: "Anterior",
            navNextAriaLabel: "Siguiente"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: scrollRef,
            className: cn(
              "mt-1 flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth",
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            ),
            "aria-roledescription": "carrusel",
            children: slides.map((slide) => /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-full min-w-full shrink-0 snap-start snap-always px-0",
                children: slide.kind === "order" ? /* @__PURE__ */ jsx(OrderTimelineShortCard, { order: slide.data }) : /* @__PURE__ */ jsx(ReservationTimelineShortCard, { reservation: slide.data })
              },
              slide.kind === "order" ? `order-${slide.data.id}` : `reservation-${slide.data.id}`
            ))
          }
        ),
        count > 1 && /* @__PURE__ */ jsx(
          "div",
          {
            className: "mt-3 flex w-full items-center justify-center gap-1.5",
            role: "tablist",
            "aria-label": "Posición en el carrusel",
            children: slides.map((slide, i) => /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": i === slideIndex,
                tabIndex: i === slideIndex ? 0 : -1,
                "aria-label": `Elemento ${i + 1} de ${count}`,
                className: cn(
                  "h-1.5 shrink-0 rounded-full transition-[width,background-color] duration-200 ease-out",
                  i === slideIndex ? "w-5 bg-emerald-600" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                ),
                onClick: () => goTo(i)
              },
              slide.kind === "order" ? `dot-order-${slide.data.id}` : `dot-reservation-${slide.data.id}`
            ))
          }
        )
      ]
    }
  );
}
function Home({
  tenant,
  sliders,
  categories,
  featured_products = [],
  top_selling_products = [],
  tickers,
  promo_shorts = [],
  active_public_orders = [],
  active_public_reservations = []
}) {
  const brandColors = tenant.brand_colors ?? {};
  const bg_color = brandColors.bg_color ?? "#db2777";
  const destacadosSliderRef = useRef(null);
  const [drawerProduct, setDrawerProduct] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openProduct = (product) => {
    setDrawerProduct(product);
    setDrawerOpen(true);
  };
  const hasOrders = active_public_orders.length > 0;
  const hasReservations = active_public_reservations.length > 0;
  const timelineTitle = hasOrders && hasReservations ? "Pedidos y reservas activas" : hasReservations ? "Tus reservas activas" : "Tus órdenes activas";
  const pillSuffixSingular = hasOrders && hasReservations ? "activo" : hasReservations ? "reserva" : "orden";
  const pillSuffixPlural = hasOrders && hasReservations ? "activos" : hasReservations ? "reservas" : "órdenes";
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: tenant.name }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsx(TickersPromo, { tickers }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 p-4 -mt-4 relative z-0 pb-4 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsx(SlidersPromo, { sliders, tenantSlug: tenant.slug }),
      /* @__PURE__ */ jsx(
        SuccesTimelineShort,
        {
          orders: active_public_orders,
          reservations: active_public_reservations,
          tenantId: tenant.id,
          title: timelineTitle,
          pillSuffixSingular,
          pillSuffixPlural
        }
      ),
      /* @__PURE__ */ jsx(CategoryShort, { categories, tenantSlug: tenant.slug }),
      Array.isArray(top_selling_products) && top_selling_products.length > 0 && /* @__PURE__ */ jsx(TopBestSeller, { products: top_selling_products, onProductClick: openProduct }),
      Array.isArray(featured_products) && featured_products.length > 0 && /* @__PURE__ */ jsxs("section", { className: "w-full px-4", "aria-labelledby": "destacados-heading", children: [
        /* @__PURE__ */ jsx(
          HeaderSectionProducts,
          {
            headingId: "destacados-heading",
            title: "Destacados",
            availableCount: featured_products.length,
            onPrev: () => destacadosSliderRef.current?.scrollPrev(),
            onNext: () => destacadosSliderRef.current?.scrollNext()
          }
        ),
        /* @__PURE__ */ jsx(
          ProductListVertical,
          {
            ref: destacadosSliderRef,
            products: featured_products,
            onProductClick: openProduct
          }
        )
      ] }),
      Array.isArray(promo_shorts) && promo_shorts.length > 0 && /* @__PURE__ */ jsxs("section", { className: "w-full px-4", "aria-labelledby": "promos-heading", children: [
        /* @__PURE__ */ jsx("h2", { id: "promos-heading", className: "mb-3 text-lg font-bold text-slate-900", children: "Shorts" }),
        /* @__PURE__ */ jsx(ShortsFeed, { items: promo_shorts })
      ] })
    ] }),
    drawerProduct && /* @__PURE__ */ jsx(
      ProductDetailDrawer,
      {
        product: drawerProduct,
        isOpen: drawerOpen,
        onClose: () => setDrawerOpen(false)
      }
    )
  ] });
}
export {
  Home as default
};
