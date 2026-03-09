import { jsx, jsxs } from "react/jsx-runtime";
import React__default, { useState, useEffect, useContext, createContext, useRef } from "react";
import { usePage, router } from "@inertiajs/react";
import { toast, Toaster } from "sonner";
import { ShoppingBag, ChevronRight, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { R as ReportBusinessStrip, F as Footer } from "./ReportBusinessStrip-Cg46R4fS.js";
import { useScroll, useVelocity, useSpring, useTransform, useMotionValue, useAnimationFrame, motion as motion$1 } from "motion/react";
import { c as cn } from "./utils-B0hQsrDj.js";
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
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((v - min) % rangeSize + rangeSize) % rangeSize + min;
};
const ScrollVelocityContext = React__default.createContext(
  null
);
function ScrollVelocityContainer({
  children,
  className,
  ...props
}) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, (v) => {
    const sign = v < 0 ? -1 : 1;
    const magnitude = Math.min(5, Math.abs(v) / 1e3 * 5);
    return sign * magnitude;
  });
  return /* @__PURE__ */ jsx(ScrollVelocityContext.Provider, { value: velocityFactor, children: /* @__PURE__ */ jsx("div", { className: cn("relative w-full", className), ...props, children }) });
}
function ScrollVelocityRow(props) {
  const sharedVelocityFactor = useContext(ScrollVelocityContext);
  if (sharedVelocityFactor) {
    return /* @__PURE__ */ jsx(ScrollVelocityRowImpl, { ...props, velocityFactor: sharedVelocityFactor });
  }
  return /* @__PURE__ */ jsx(ScrollVelocityRowLocal, { ...props });
}
function ScrollVelocityRowImpl({
  children,
  baseVelocity = 5,
  direction = 1,
  className,
  velocityFactor,
  scrollReactivity = true,
  ...props
}) {
  const containerRef = useRef(null);
  const blockRef = useRef(null);
  const [numCopies, setNumCopies] = useState(1);
  const baseX = useMotionValue(0);
  const baseDirectionRef = useRef(direction >= 0 ? 1 : -1);
  const currentDirectionRef = useRef(direction >= 0 ? 1 : -1);
  const unitWidth = useMotionValue(0);
  const isInViewRef = useRef(true);
  const isPageVisibleRef = useRef(true);
  const prefersReducedMotionRef = useRef(false);
  useEffect(() => {
    const container = containerRef.current;
    const block = blockRef.current;
    let ro = null;
    let io = null;
    let mq = null;
    const handleVisibility = () => {
      isPageVisibleRef.current = document.visibilityState === "visible";
    };
    const handlePRM = () => {
      if (mq) {
        prefersReducedMotionRef.current = mq.matches;
      }
    };
    if (container && block) {
      const updateSizes = () => {
        const cw = container.offsetWidth || 0;
        const bw = block.scrollWidth || 0;
        unitWidth.set(bw);
        const nextCopies = bw > 0 ? Math.max(3, Math.ceil(cw / bw) + 2) : 1;
        setNumCopies((prev) => prev === nextCopies ? prev : nextCopies);
      };
      updateSizes();
      ro = new ResizeObserver(updateSizes);
      ro.observe(container);
      ro.observe(block);
      io = new IntersectionObserver(([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      });
      io.observe(container);
      document.addEventListener("visibilitychange", handleVisibility, {
        passive: true
      });
      handleVisibility();
      mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", handlePRM);
      handlePRM();
    }
    return () => {
      if (ro) {
        ro.disconnect();
      }
      if (io) {
        io.disconnect();
      }
      document.removeEventListener("visibilitychange", handleVisibility);
      if (mq) {
        mq.removeEventListener("change", handlePRM);
      }
    };
  }, [children, unitWidth]);
  const x = useTransform([baseX, unitWidth], ([v, bw]) => {
    const width = Number(bw) || 1;
    const offset = Number(v) || 0;
    return `${-wrap(0, width, offset)}px`;
  });
  useAnimationFrame((_, delta) => {
    if (!isInViewRef.current || !isPageVisibleRef.current) return;
    const dt = delta / 1e3;
    const vf = scrollReactivity ? velocityFactor.get() : 0;
    const absVf = Math.min(5, Math.abs(vf));
    const speedMultiplier = prefersReducedMotionRef.current ? 1 : 1 + absVf;
    if (absVf > 0.1) {
      const scrollDirection = vf >= 0 ? 1 : -1;
      currentDirectionRef.current = baseDirectionRef.current * scrollDirection;
    }
    const bw = unitWidth.get() || 0;
    if (bw <= 0) return;
    const pixelsPerSecond = bw * baseVelocity / 100;
    const moveBy = currentDirectionRef.current * pixelsPerSecond * speedMultiplier * dt;
    baseX.set(baseX.get() + moveBy);
  });
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      className: cn("w-full overflow-hidden whitespace-nowrap", className),
      ...props,
      children: /* @__PURE__ */ jsx(
        motion$1.div,
        {
          className: "inline-flex transform-gpu items-center will-change-transform select-none",
          style: { x },
          children: Array.from({ length: numCopies }).map((_, i) => /* @__PURE__ */ jsxs(
            "div",
            {
              ref: i === 0 ? blockRef : null,
              "aria-hidden": i !== 0,
              className: "inline-flex shrink-0 items-center",
              children: [
                children,
                /* @__PURE__ */ jsx("span", { className: "mx-1 text-inherit", "aria-hidden": true, children: "•" })
              ]
            },
            i
          ))
        }
      )
    }
  );
}
function ScrollVelocityRowLocal(props) {
  const { scrollY } = useScroll();
  const localVelocity = useVelocity(scrollY);
  const localSmoothVelocity = useSpring(localVelocity, {
    damping: 50,
    stiffness: 400
  });
  const localVelocityFactor = useTransform(localSmoothVelocity, (v) => {
    const sign = v < 0 ? -1 : 1;
    const magnitude = Math.min(5, Math.abs(v) / 1e3 * 5);
    return sign * magnitude;
  });
  return /* @__PURE__ */ jsx(ScrollVelocityRowImpl, { ...props, velocityFactor: localVelocityFactor });
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
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[480px] h-full max-h-[100dvh] shadow-2xl overflow-hidden flex flex-col relative mx-auto bg-white", children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "absolute top-0 left-0 right-0 w-full pointer-events-none z-10",
          style: {
            height: "50%",
            // cambia por el % que quieras (ej. 15%, 200px)
            background: "linear-gradient(to bottom, #ffceec, #ffffff)"
          },
          children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/themes/march_8/flowers_01.webp",
                alt: "",
                className: "absolute top-[100px] right-[350px] -rotate-45 w-56 h-auto object-contain opacity-90",
                "aria-hidden": true
              }
            ),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/themes/march_8/flowers_02.webp",
                alt: "",
                className: "absolute top-[200px] -right-[80px] rotate-180 w-80 h-auto object-contain opacity-60",
                "aria-hidden": true
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "relative flex w-full h-auto flex-col items-center justify-center overflow-hidden z-10 pt-6", children: /* @__PURE__ */ jsxs(ScrollVelocityContainer, { className: "text-2xl font-bold tracking-tight text-pink-600 md:text-4xl", children: [
        /* @__PURE__ */ jsx(ScrollVelocityRow, { baseVelocity: 4, direction: 1, children: "Tu día, tu poder 💪" }),
        /* @__PURE__ */ jsx(ScrollVelocityRow, { baseVelocity: 4, direction: -1, children: "Tu fuerza, tu día, tu momento ✨" }),
        /* @__PURE__ */ jsx(ScrollVelocityRow, { baseVelocity: 4, direction: 1, children: "Gracias por ser imparable 🌟" })
      ] }) }),
      selectedTable && /* @__PURE__ */ jsxs("div", { className: "bg-white text-primary px-4 py-2.5 text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b border-primary/20 animate-in fade-in slide-in-from-top duration-700 z-[9999]", children: [
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
      /* @__PURE__ */ jsx("div", { className: "scrollbar-public flex-1 min-h-0 relative overflow-y-auto overflow-x-hidden z-10", children: /* @__PURE__ */ jsxs("div", { className: "min-h-full flex flex-col", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1", children }),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/themes/march_8/heart_various.webp",
            alt: "",
            className: "top-0 w-full h-full object-contain opacity-90",
            "aria-hidden": true
          }
        ),
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
