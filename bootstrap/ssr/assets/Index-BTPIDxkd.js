import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link, Head } from "@inertiajs/react";
import axios from "axios";
import { P as PublicLayout, u as useCart } from "./PublicLayout-SbrFcTnr.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { ArrowLeft, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { f as formatPrice } from "./utils-B0hQsrDj.js";
import { A as AlertDialog, h as AlertDialogTrigger, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import "sonner";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./input-B_4qRSOV.js";
import "./label-L_u-fyc1.js";
import "@radix-ui/react-label";
import "class-variance-authority";
import "./textarea-BpljFL5D.js";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
const CartInner = ({ tenant }) => {
  const { items, cartTotal, updateQuantity, removeFromCart, clearCart, mergeProductImageUrls, isLoaded } = useCart();
  const [imageErrors, setImageErrors] = useState(/* @__PURE__ */ new Set());
  const itemImageUrl = (item) => {
    const url = typeof item.image_url === "string" ? item.image_url.trim() : "";
    return url && (url.startsWith("http://") || url.startsWith("https://")) ? url : null;
  };
  const showItemImage = (item) => Boolean(itemImageUrl(item)) && !imageErrors.has(item.lineKey);
  const handleImageError = (lineKey) => {
    setImageErrors((prev) => new Set(prev).add(lineKey));
  };
  useEffect(() => {
    if (!tenant?.slug || !isLoaded || items.length === 0) return;
    const needImage = items.filter((i) => !itemImageUrl(i));
    if (needImage.length === 0) return;
    const ids = [...new Set(needImage.map((i) => i.id))];
    axios.post(route("tenant.menu.products.batch", [tenant.slug]), { ids }).then((res) => {
      const products = Array.isArray(res.data) ? res.data : [];
      if (products.length) mergeProductImageUrls(products);
    }).catch(() => {
    });
  }, [tenant?.slug, isLoaded, items.length]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-50 pb-32", children: [
    /* @__PURE__ */ jsx(Head, { title: "Tu Carrito" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white sticky top-0 z-40 border-b px-4 py-4 flex items-center justify-between shadow-sm", children: [
      /* @__PURE__ */ jsx(Link, { href: route("tenant.home", tenant.slug), className: "p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-6 h-6" }) }),
      /* @__PURE__ */ jsx("h1", { className: "font-bold text-lg text-slate-800", children: "Tu Pedido" }),
      items.length > 0 ? /* @__PURE__ */ jsxs(AlertDialog, { children: [
        /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
          "button",
          {
            className: "text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-full transition-colors",
            children: "Vaciar"
          }
        ) }),
        /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
          /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Estás seguro?" }),
            /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Esta acción eliminará todos los productos de tu carrito. No podrás deshacer esta acción." })
          ] }),
          /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
            /* @__PURE__ */ jsx(AlertDialogAction, { onClick: clearCart, className: "bg-red-600 hover:bg-red-700 text-white", children: "Sí, vaciar carrito" })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "w-10" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto p-4", children: items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(ShoppingBag, { className: "w-12 h-12 text-slate-400" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-800", children: "Tu carrito está vacío" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 max-w-xs mx-auto", children: "Parece que aún no has agregado nada delicioso a tu pedido." })
      ] }),
      /* @__PURE__ */ jsx(Link, { href: route("tenant.menu", tenant.slug), children: /* @__PURE__ */ jsx(Button, { className: "font-bold", size: "lg", children: "Ir al Menú" }) })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsx(AnimatePresence, { initial: false, children: items.map((item) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          layout: true,
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
          className: "bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center", children: showItemImage(item) ? /* @__PURE__ */ jsx(
              "img",
              {
                src: itemImageUrl(item),
                alt: item.name,
                className: "w-full h-full object-cover",
                onError: () => handleImageError(item.lineKey)
              }
            ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-slate-300", children: /* @__PURE__ */ jsx(ShoppingBag, { className: "w-8 h-8" }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 line-clamp-2", children: item.name }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900 ml-2", children: formatPrice(item.price * item.quantity) })
                ] }),
                item.variant_options && item.variant_options.length > 0 && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1", children: item.variant_options.map((v) => v.value).join(", ") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-slate-100 rounded-lg p-1", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Disminuir cantidad",
                      onClick: () => updateQuantity(item.lineKey, item.quantity - 1),
                      className: "w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600 active:scale-95 transition-transform",
                      children: /* @__PURE__ */ jsx(Minus, { className: "w-4 h-4" })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 w-6 text-center", "aria-live": "polite", children: item.quantity }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Aumentar cantidad",
                      onClick: () => updateQuantity(item.lineKey, item.quantity + 1),
                      className: "w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-900 active:scale-95 transition-transform",
                      children: /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Quitar del carrito",
                    onClick: () => removeFromCart(item.lineKey),
                    className: "p-2 text-slate-400 hover:text-red-500 transition-colors",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5" })
                  }
                )
              ] })
            ] })
          ]
        },
        item.lineKey
      )) }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg border-b pb-4", children: "Resumen" }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-slate-600", children: [
          /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
          /* @__PURE__ */ jsx("span", { children: formatPrice(cartTotal) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-slate-600", children: [
          /* @__PURE__ */ jsx("span", { children: "Servicio (Opcional)" }),
          /* @__PURE__ */ jsx("span", { children: "-" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-4 border-t text-xl font-black text-slate-900", children: [
          /* @__PURE__ */ jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsx("span", { children: formatPrice(cartTotal) })
        ] })
      ] })
    ] }) })
  ] });
};
function CartIndex({ tenant }) {
  const bgColor = tenant.brand_colors?.bg_color || "#f8fafc";
  return /* @__PURE__ */ jsx(
    PublicLayout,
    {
      bgColor,
      showFloatingCart: false,
      renderBottomAction: (cart) => cart.items.length > 0 ? /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto", children: /* @__PURE__ */ jsx(Link, { href: route("tenant.checkout", tenant.slug), className: "w-full block", children: /* @__PURE__ */ jsx(
        Button,
        {
          className: "w-full h-14 text-lg font-bold shadow-xl shadow-slate-900/20",
          children: "Continuar a Pagar"
        }
      ) }) }) : null,
      children: /* @__PURE__ */ jsx(CartInner, { tenant })
    }
  );
}
export {
  CartIndex as default
};
