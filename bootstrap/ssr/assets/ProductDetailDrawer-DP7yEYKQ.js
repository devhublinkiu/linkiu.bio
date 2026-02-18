import { useLocalStorage } from "react-use";
import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { toast } from "sonner";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { S as Sheet, a as SheetContent } from "./sheet-DFnQxYfh.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { u as useCart } from "./PublicLayout-BPgzBK4n.js";
import { X, ShoppingBag, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { f as formatPrice } from "./utils-B0hQsrDj.js";
function useFavorites() {
  const { currentTenant } = usePage().props;
  const tenantSlug = currentTenant?.slug || "default";
  const storageKey = `linkiu_favorites_${tenantSlug}`;
  const [favorites, setFavorites] = useLocalStorage(storageKey, []);
  const toggleFavorite = useCallback((productId, productName) => {
    const current = favorites || [];
    let newFavorites;
    if (current.includes(productId)) {
      toast.info("Eliminado de favoritos");
      newFavorites = current.filter((id) => id !== productId);
    } else {
      toast.success(productName ? `¡${productName} agregado a favoritos!` : "Agregado a favoritos");
      newFavorites = [...current, productId];
    }
    setFavorites(newFavorites);
  }, [favorites, setFavorites]);
  const isFavorite = useCallback((productId) => {
    return (favorites || []).includes(productId);
  }, [favorites]);
  const favoritesCount = useMemo(() => (favorites || []).length, [favorites]);
  return {
    favorites: favorites || [],
    toggleFavorite,
    isFavorite,
    favoritesCount
  };
}
function ProductDetailDrawer({ product, isOpen, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const scrollContainerRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedVariants({});
    }
  }, [isOpen, product.id]);
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };
  const basePrice = Number(product.price);
  const totalPrice = useMemo(() => {
    let total = basePrice;
    if (product.variant_groups) {
      product.variant_groups.forEach((group) => {
        const selectedOptionIds = selectedVariants[group.id] || [];
        selectedOptionIds.forEach((optionId) => {
          const option = group.options.find((o) => o.id === optionId);
          if (option) {
            total += Number(option.price_adjustment);
          }
        });
      });
    }
    return total * quantity;
  }, [product, selectedVariants, quantity, basePrice]);
  const handleVariantChange = (groupId, optionId, type) => {
    const group = product.variant_groups?.find((g) => g.id === groupId);
    if (!group) return;
    setSelectedVariants((prev) => {
      const currentSelected = prev[groupId] || [];
      if (type === "radio") {
        return { ...prev, [groupId]: [optionId] };
      }
      if (currentSelected.includes(optionId)) {
        return { ...prev, [groupId]: currentSelected.filter((id) => id !== optionId) };
      }
      const newSelected = [...currentSelected, optionId];
      if (group.max_selection > 0 && newSelected.length > group.max_selection) {
        toast.error(`Máximo ${group.max_selection} opción(es) en ${group.name}`);
        return prev;
      }
      return { ...prev, [groupId]: newSelected };
    });
  };
  const handleAddToCart = () => {
    if (product.variant_groups) {
      for (const group of product.variant_groups) {
        const selected = selectedVariants[group.id] || [];
        if (group.is_required && selected.length < group.min_selection) {
          toast.error(`Debes seleccionar al menos ${group.min_selection} opción(es) en ${group.name}`);
          return;
        }
        if (group.max_selection > 0 && selected.length > group.max_selection) {
          toast.error(`Máximo ${group.max_selection} opción(es) en ${group.name}`);
          return;
        }
      }
    }
    const variantOptionsFormatted = [];
    if (product.variant_groups) {
      product.variant_groups.forEach((group) => {
        const selectedList = selectedVariants[group.id] || [];
        selectedList.forEach((optId) => {
          const opt = group.options.find((o) => o.id === optId);
          if (opt) {
            variantOptionsFormatted.push({
              name: group.name,
              value: opt.name,
              price: Number(opt.price_adjustment)
            });
          }
        });
      });
    }
    addToCart({
      ...product,
      image_url: product.image_url ?? product.imageUrl,
      price: totalPrice / quantity,
      quantity,
      variant_selections: selectedVariants,
      variant_options: variantOptionsFormatted
    });
    onClose();
    setQuantity(1);
    setSelectedVariants({});
  };
  return /* @__PURE__ */ jsx(Sheet, { open: isOpen, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsxs(
    SheetContent,
    {
      side: "bottom",
      className: "h-[80vh] w-full max-w-[480px] mx-auto left-0 right-0 p-0 rounded-t-[2rem] bg-slate-50 flex flex-col overflow-hidden border-none focus-visible:outline-none shadow-2xl",
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 right-0 flex justify-center pt-3 pb-1 z-50 pointer-events-none", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-1.5 bg-slate-200/50 backdrop-blur-sm rounded-full" }) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "absolute top-4 right-4 z-50 bg-black/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/30 transition-colors",
            children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex-1 max-h-[75vh] overflow-y-auto",
            style: { scrollbarWidth: "none", msOverflowStyle: "none" },
            children: [
              /* @__PURE__ */ jsxs("div", { className: "h-64 sm:h-72 w-full relative group", children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    ref: scrollContainerRef,
                    className: "w-full h-full overflow-x-auto flex flex-nowrap snap-x snap-mandatory",
                    style: { scrollbarWidth: "none", msOverflowStyle: "none" },
                    children: [
                      product.image_url && /* @__PURE__ */ jsxs("div", { className: "w-full h-full shrink-0 snap-center relative", children: [
                        /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: product.image_url,
                            alt: product.name,
                            className: "w-full h-full object-cover",
                            draggable: false
                          }
                        ),
                        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" })
                      ] }),
                      (product.gallery_urls || product.gallery)?.map((img, index) => {
                        const isFullUrl = typeof img === "string" && img.startsWith("http");
                        if (!isFullUrl) return null;
                        return /* @__PURE__ */ jsxs("div", { className: "w-full h-full shrink-0 snap-center relative", children: [
                          /* @__PURE__ */ jsx(
                            "img",
                            {
                              src: img,
                              alt: `${product.name} - ${index + 1}`,
                              className: "w-full h-full object-cover",
                              draggable: false
                            }
                          ),
                          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" })
                        ] }, index);
                      }),
                      !product.image_url && (!product.gallery_urls || product.gallery_urls.length === 0) && /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-slate-200 flex items-center justify-center snap-center", children: /* @__PURE__ */ jsx(ShoppingBag, { className: "w-12 h-12 text-slate-300" }) })
                    ]
                  }
                ),
                product.gallery_urls && product.gallery_urls.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => scroll("left"),
                      className: "absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-colors active:scale-95 shadow-sm",
                      children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => scroll("right"),
                      className: "absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-colors active:scale-95 shadow-sm",
                      children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5" })
                    }
                  )
                ] }),
                product.gallery_urls && product.gallery_urls.length > 0 && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-white/80 shadow-sm" }),
                  product.gallery_urls.map((_, idx) => /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-white/40" }, idx))
                ] }),
                product.gallery_urls && product.gallery_urls.length > 0 && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 right-4 bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white z-20 pointer-events-none", children: [
                  1 + (product.gallery_urls?.length || 0),
                  " Fotos"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-6 pb-8 -mt-12 relative z-10 flex flex-col gap-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl p-5 shadow-sm border border-slate-100", children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-slate-900 leading-tight mb-2", children: product.name }),
                  product.short_description && /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm leading-relaxed", children: product.short_description }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-baseline gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-2xl font-black text-slate-900", children: formatPrice(basePrice) }),
                    product.original_price && Number(product.original_price) > basePrice && /* @__PURE__ */ jsx("span", { className: "text-slate-400 line-through text-sm", children: formatPrice(Number(product.original_price)) })
                  ] })
                ] }),
                (product.preparation_time || product.calories) && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  product.preparation_time && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("div", { className: "bg-amber-100 p-2 rounded-xl text-amber-600", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "text-[10px] text-slate-400 font-bold uppercase tracking-wider", children: "Tiempo" }),
                      /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-slate-900", children: product.preparation_time })
                    ] })
                  ] }),
                  product.calories && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("div", { className: "bg-rose-100 p-2 rounded-xl text-rose-600", children: /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: [
                      /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" }),
                      /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" })
                    ] }) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "text-[10px] text-slate-400 font-bold uppercase tracking-wider", children: "Calorías" }),
                      /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-slate-900", children: product.calories })
                    ] })
                  ] })
                ] }),
                (product.tags?.length || 0) > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: product.tags?.map((tag, i) => /* @__PURE__ */ jsxs("span", { className: "bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200", children: [
                  "#",
                  tag
                ] }, i)) }),
                product.variant_groups?.map((group) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl p-5 shadow-sm border border-slate-100", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-lg", children: group.name }),
                    group.is_required && /* @__PURE__ */ jsx("span", { className: "bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full", children: "Obligatorio" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-3", children: group.options.map((option) => {
                    const isSelected = (selectedVariants[group.id] || []).includes(option.id);
                    const priceAdj = Number(option.price_adjustment);
                    const unavailable = option.is_available === false;
                    return /* @__PURE__ */ jsxs(
                      "label",
                      {
                        className: `flex items-center justify-between p-3 rounded-xl border transition-all ${unavailable ? "cursor-not-allowed opacity-60 bg-slate-50 border-slate-100" : isSelected ? "border-slate-900 bg-slate-50 cursor-pointer" : "border-slate-100 hover:border-slate-200 cursor-pointer"}`,
                        children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                            /* @__PURE__ */ jsx("div", { className: `w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "bg-slate-900 border-slate-900" : "border-slate-300"}`, children: isSelected && /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-white rounded-full" }) }),
                            /* @__PURE__ */ jsxs("span", { className: `font-medium ${isSelected ? "text-slate-900" : "text-slate-600"}`, children: [
                              option.name,
                              unavailable && /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-xs ml-1", children: "(no disponible)" })
                            ] })
                          ] }),
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: group.type === "radio" ? "radio" : "checkbox",
                              name: `group-${group.id}`,
                              className: "hidden",
                              checked: isSelected,
                              disabled: unavailable,
                              onChange: () => !unavailable && handleVariantChange(group.id, option.id, group.type)
                            }
                          ),
                          priceAdj > 0 && !unavailable && /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-slate-900", children: [
                            "+",
                            formatPrice(priceAdj)
                          ] })
                        ]
                      },
                      option.id
                    );
                  }) })
                ] }, group.id))
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 border-t border-slate-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 mb-4", children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: "Cantidad" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-slate-100 rounded-xl p-1 h-10", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setQuantity(Math.max(1, quantity - 1)),
                  className: "w-10 h-full flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 active:scale-95 transition-transform",
                  children: /* @__PURE__ */ jsx(Minus, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "w-12 text-center font-bold text-lg", children: quantity }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setQuantity(quantity + 1),
                  className: "w-10 h-full flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-900 active:scale-95 transition-transform",
                  children: /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: handleAddToCart,
              className: "w-full h-14 text-lg font-bold rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/10 active:scale-[0.98] transition-all flex justify-between items-center px-6",
              children: [
                /* @__PURE__ */ jsx("span", { children: "Agregar" }),
                /* @__PURE__ */ jsx("span", { children: formatPrice(totalPrice) })
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
export {
  ProductDetailDrawer as P,
  useFavorites as u
};
