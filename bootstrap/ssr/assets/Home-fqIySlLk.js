import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef, useState, useRef, useImperativeHandle } from "react";
import { usePage, Link, Head } from "@inertiajs/react";
import { u as useCart, P as PublicLayout } from "./PublicLayout-Dszrp43g.js";
import { H as Header } from "./Header-CDUqNXGd.js";
import { P as PromotionalTicker, B as BannerSlider, C as Carousel, a as PromoCard } from "./promo-carousel-COMO4-b_.js";
import { Flame, Heart, Plus, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { u as useFavorites, P as ProductDetailDrawer } from "./ProductDetailDrawer-acH6lZzX.js";
import { f as formatPrice } from "./utils-B0hQsrDj.js";
import "sonner";
import "framer-motion";
import "./ReportBusinessStrip-Cg46R4fS.js";
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
import "./util-Dl4_fw_3.js";
import "./sheet-BFMMArVC.js";
import "clsx";
import "tailwind-merge";
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
