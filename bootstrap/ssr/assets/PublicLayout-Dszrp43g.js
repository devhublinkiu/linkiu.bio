import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useContext, createContext } from "react";
import { usePage, router } from "@inertiajs/react";
import { toast, Toaster } from "sonner";
import { ShoppingBag, ChevronRight, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { R as ReportBusinessStrip, F as Footer } from "./ReportBusinessStrip-Cg46R4fS.js";
const CartContext = createContext(void 0);
function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  function getLineKey(item) {
    return `${item.id}_${JSON.stringify(item.variant_options || [])}`;
  }
  useEffect(() => {
    const savedCart = localStorage.getItem("gastronomy_cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        const migrated = parsed.map((item) => ({
          ...item,
          lineKey: item.lineKey || getLineKey(item)
        }));
        setItems(migrated);
      } catch {
        setItems([]);
      }
    }
    setIsLoaded(true);
  }, []);
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("gastronomy_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);
  const { selectedTable: sharedTable } = usePage().props;
  useEffect(() => {
    if (sharedTable) {
      setSelectedTable(sharedTable);
    }
  }, [sharedTable]);
  function normalizeImageUrl(p) {
    const url = p?.image_url ?? p?.imageUrl;
    if (typeof url !== "string") return void 0;
    const t = url.trim();
    return t.startsWith("http://") || t.startsWith("https://") ? t : void 0;
  }
  const addToCart = (product) => {
    const variantOptions = product.variant_options || [];
    const lineKey = getLineKey({ id: product.id, variant_options: variantOptions });
    const imageUrl = normalizeImageUrl(product);
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.lineKey === lineKey);
      if (existingItem) {
        toast.success(`Agregaste otro ${product.name}`, {
          description: "Cantidad actualizada",
          duration: 2e3
        });
        return currentItems.map(
          (item) => item.lineKey === lineKey ? { ...item, quantity: item.quantity + (product.quantity || 1), image_url: imageUrl ?? item.image_url } : item
        );
      }
      toast.success("Producto agregado", {
        description: `${product.name} añadido al carrito`,
        duration: 2e3
      });
      return [...currentItems, {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        original_price: product.original_price ? Number(product.original_price) : void 0,
        image_url: imageUrl ?? void 0,
        quantity: product.quantity || 1,
        variant_options: variantOptions,
        lineKey
      }];
    });
  };
  const removeFromCart = (lineKey) => {
    setItems((currentItems) => currentItems.filter((item) => item.lineKey !== lineKey));
  };
  const updateQuantity = (lineKey, quantity) => {
    if (quantity < 1) {
      removeFromCart(lineKey);
      return;
    }
    setItems(
      (currentItems) => currentItems.map((item) => item.lineKey === lineKey ? { ...item, quantity } : item)
    );
  };
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("gastronomy_cart");
  };
  const mergeProductImageUrls = (products) => {
    const byId = new Map(products.map((p) => [p.id, p.image_url]));
    setItems(
      (current) => current.map((item) => {
        const url = byId.get(item.id);
        if (url == null) return item;
        const trimmed = typeof url === "string" ? url.trim() : "";
        if (!trimmed || !trimmed.startsWith("http://") && !trimmed.startsWith("https://")) return item;
        return { ...item, image_url: trimmed };
      })
    );
  };
  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);
  return /* @__PURE__ */ jsx(CartContext.Provider, { value: {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    mergeProductImageUrls,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    selectedTable,
    setSelectedTable,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    isLoaded
  }, children });
}
function useCart() {
  const context = useContext(CartContext);
  if (context === void 0) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
function FloatingCart() {
  const { cartCount, cartTotal } = useCart();
  const { tenant } = usePage().props;
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(price);
  };
  return /* @__PURE__ */ jsx(AnimatePresence, { children: cartCount > 0 && /* @__PURE__ */ jsx("div", { className: "fixed bottom-4 md:bottom-8 left-4 right-4 z-50 pointer-events-none flex justify-center", children: /* @__PURE__ */ jsxs(
    motion.button,
    {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 100, opacity: 0 },
      onClick: () => router.visit(route("tenant.cart", tenant.slug)),
      className: "pointer-events-auto w-[calc(100%-2rem)] max-w-[448px] bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl shadow-slate-900/20 flex items-center justify-between group active:scale-[0.98] transition-all border border-white/10",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white/20 p-2 rounded-xl relative", children: [
            /* @__PURE__ */ jsx(ShoppingBag, { className: "w-5 h-5 text-white" }),
            /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full", children: cartCount })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-300 font-medium", children: "Total Estimado" }),
            /* @__PURE__ */ jsx("span", { className: "text-lg font-black tracking-tight", children: formatPrice(cartTotal) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 pl-4 border-l border-white/10 group-hover:translate-x-1 transition-transform", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: "Ver Pedido" }),
          /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
        ] })
      ]
    }
  ) }) });
}
const LayoutContent = ({ children, bgColor, renderBottomAction, showFloatingCart = true }) => {
  const cart = useCart();
  const { selectedTable } = cart;
  return /* @__PURE__ */ jsxs("div", { className: "h-dvh w-full flex justify-center items-stretch relative overflow-hidden transition-colors duration-500 bg-white", children: [
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 -z-30 bg-[url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 -z-20 transition-colors duration-500 mix-blend-multiply opacity-80",
        style: { backgroundColor: bgColor || "#f0f2f5" }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 -z-10 backdrop-blur-[100px] bg-white/10" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[480px] h-full max-h-[100dvh] bg-white shadow-2xl overflow-hidden flex flex-col relative mx-auto z-10", children: [
      selectedTable && /* @__PURE__ */ jsxs("div", { className: "bg-primary/10 text-primary px-4 py-2.5 text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b border-primary/20 animate-in fade-in slide-in-from-top duration-700 z-50", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3 animate-bounce" }),
        "Pidiendo en: ",
        /* @__PURE__ */ jsx("span", { className: "opacity-80", children: selectedTable.name }),
        " ",
        selectedTable.zone?.name && /* @__PURE__ */ jsxs("span", { className: "text-[9px] opacity-60 ml-0.5", children: [
          "[",
          selectedTable.zone.name,
          "]"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "scrollbar-public flex-1 min-h-0 relative overflow-y-auto overflow-x-hidden", children: /* @__PURE__ */ jsxs("div", { className: "min-h-full flex flex-col", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1", children }),
        /* @__PURE__ */ jsx(ReportBusinessStrip, {}),
        /* @__PURE__ */ jsx(Footer, {})
      ] }) }),
      showFloatingCart && /* @__PURE__ */ jsx(FloatingCart, {}),
      renderBottomAction && /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 left-0 right-0 bg-white border-t p-4 px-6 z-40 sm:absolute sm:bottom-0", children: renderBottomAction(cart) }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-200 rounded-full sm:block hidden pointer-events-none mb-1 z-50" })
    ] })
  ] });
};
function PublicLayout(props) {
  return /* @__PURE__ */ jsxs(CartProvider, { children: [
    /* @__PURE__ */ jsx(LayoutContent, { ...props }),
    /* @__PURE__ */ jsx(Toaster, { position: "top-center" })
  ] });
}
export {
  PublicLayout as P,
  useCart as u
};
