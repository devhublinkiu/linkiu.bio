import { jsxs, jsx } from "react/jsx-runtime";
import { ShoppingBag, Flame, Heart, Plus } from "lucide-react";
import { u as useFavorites } from "./ProductDetailDrawer-_wZAMaGc.js";
const formatPrice = (price) => {
  const p = parseFloat(price);
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(p);
};
function ProductCard({ product, onClick }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);
  const priceVal = parseFloat(product.price);
  const originalPriceVal = product.original_price ? parseFloat(product.original_price) : 0;
  const hasDiscount = originalPriceVal > priceVal;
  const discountPercent = hasDiscount ? Math.round((originalPriceVal - priceVal) / originalPriceVal * 100) : 0;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onClick,
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
          ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-300", children: /* @__PURE__ */ jsx(ShoppingBag, { className: "size-8" }) }),
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
              className: `absolute -top-1 right-0 p-2 transition-all duration-300 rounded-full active:scale-90 ${favorite ? "text-rose-500 bg-rose-50/50" : "text-slate-300 hover:text-rose-400"}`,
              children: /* @__PURE__ */ jsx(Heart, { className: `size-5 ${favorite ? "fill-current" : ""}` })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "pr-8", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900 leading-tight mb-1 line-clamp-2", children: product.name }),
            product.short_description && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 line-clamp-2 font-medium leading-relaxed", children: product.short_description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between mt-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              hasDiscount && /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 line-through font-medium decoration-gray-400 decoration-1", children: formatPrice(product.original_price) }),
              /* @__PURE__ */ jsx("span", { className: `text-lg font-black tracking-tight ${hasDiscount ? "text-rose-600" : "text-gray-900"}`, children: formatPrice(product.price) })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onClick?.();
                },
                className: "w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/20 active:bg-slate-800 transition-colors transform active:scale-95",
                children: /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  ProductCard as P
};
