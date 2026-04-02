import { jsx, jsxs } from "react/jsx-runtime";
import { ShoppingBag, ChevronRight, MapPin } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useState, useEffect, useContext, createContext } from "react";
import { usePage, router } from "@inertiajs/react";
import { H as HeaderShellAll, F as FooterShellAll } from "./HeaderShellAll-i5N7L180.js";
import { AnimatePresence, motion } from "framer-motion";
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
const LayoutContent = ({
  children,
  bgColor,
  renderBottomAction,
  showFloatingCart = true
}) => {
  const cart = useCart();
  const { selectedTable } = cart;
  return /* @__PURE__ */ jsxs("div", { className: "flex h-dvh w-full items-stretch justify-center overflow-hidden bg-white transition-colors duration-500", children: [
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 -z-30 bg-[url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 -z-20 opacity-80 mix-blend-multiply transition-colors duration-500",
        style: { backgroundColor: bgColor || "#f0f2f5" }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 -z-10 bg-white/10 backdrop-blur-[100px]" }),
    /* @__PURE__ */ jsxs("div", { className: "relative mx-auto flex h-full max-h-[100dvh] w-full max-w-[480px] flex-col overflow-hidden bg-white shadow-2xl", children: [
      selectedTable && /* @__PURE__ */ jsxs("div", { className: "z-[9999] flex animate-in items-center justify-center gap-2 border-b border-primary/20 bg-white px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-primary fade-in slide-in-from-top duration-700", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3 animate-bounce" }),
        "Pidiendo en: ",
        /* @__PURE__ */ jsx("span", { className: "opacity-80", children: selectedTable.name }),
        " ",
        selectedTable.zone?.name && /* @__PURE__ */ jsxs("span", { className: "ml-0.5 text-[9px] opacity-60", children: [
          "[",
          selectedTable.zone.name,
          "]"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "scrollbar-public relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden", children: /* @__PURE__ */ jsxs("div", { className: "flex min-h-full flex-col", children: [
        /* @__PURE__ */ jsx(HeaderShellAll, {}),
        /* @__PURE__ */ jsx("div", { className: "min-h-0 flex-1", children }),
        /* @__PURE__ */ jsx(FooterShellAll, {})
      ] }) }),
      showFloatingCart && /* @__PURE__ */ jsx(FloatingCart, {}),
      renderBottomAction && /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-4 px-6 sm:absolute sm:bottom-0", children: renderBottomAction(cart) }),
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute bottom-1 left-1/2 z-50 mb-1 hidden h-1 w-32 -translate-x-1/2 rounded-full bg-slate-200 sm:block" })
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
