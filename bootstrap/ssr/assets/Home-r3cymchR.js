import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useState, useEffect, useMemo, useCallback, forwardRef, useImperativeHandle } from "react";
import { Link, Head } from "@inertiajs/react";
import { P as PublicLayout } from "./PublicLayout-B1Bmlg8s.js";
import { u as useFavorites, P as ProductDetailDrawer } from "./ProductDetailDrawer-DnydXzpn.js";
import { T as TickersPromo, S as SlidersPromo, a as ShortsFeed } from "./index-DiOeUUHd.js";
import { ArrowUpRight, ArrowLeft, ArrowRight, Heart, Flame, ArrowDown, Plus } from "lucide-react";
import { c as cn, f as formatPrice } from "./utils-B0hQsrDj.js";
import "sonner";
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
                " Disponibles"
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
          /* @__PURE__ */ jsxs("h2", { id: headingId, className: "min-w-0 text-slate-700", children: [
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
function TopBestSeller({ className }) {
  return /* @__PURE__ */ jsx("section", { className: cn("w-full", className), "aria-labelledby": "top-best-seller-heading", children: /* @__PURE__ */ jsx(HeaderTopBestSeller, { headingId: "top-best-seller-heading" }) });
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
function Home({
  tenant,
  sliders,
  categories,
  featured_products = [],
  top_selling_products = [],
  tickers,
  promo_shorts = []
}) {
  const brandColors = tenant.brand_colors ?? {};
  const bg_color = brandColors.bg_color ?? "#db2777";
  const destacadosSliderRef = useRef(null);
  const topSellingSliderRef = useRef(null);
  const [drawerProduct, setDrawerProduct] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openProduct = (product) => {
    setDrawerProduct(product);
    setDrawerOpen(true);
  };
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: tenant.name }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsx(TickersPromo, { tickers }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 p-4 -mt-4 relative z-0 pb-4 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsx(SlidersPromo, { sliders, tenantSlug: tenant.slug }),
      /* @__PURE__ */ jsx(CategoryShort, { categories, tenantSlug: tenant.slug }),
      /* @__PURE__ */ jsx(TopBestSeller, {}),
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
      Array.isArray(top_selling_products) && top_selling_products.length > 0 && /* @__PURE__ */ jsxs("section", { className: "w-full px-4", "aria-labelledby": "mas-vendidos-heading", children: [
        /* @__PURE__ */ jsx(
          HeaderSectionProducts,
          {
            headingId: "mas-vendidos-heading",
            title: "Los más vendidos",
            availableCount: top_selling_products.length,
            onPrev: () => topSellingSliderRef.current?.scrollPrev(),
            onNext: () => topSellingSliderRef.current?.scrollNext()
          }
        ),
        /* @__PURE__ */ jsx(
          ProductListVertical,
          {
            ref: topSellingSliderRef,
            products: top_selling_products,
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
