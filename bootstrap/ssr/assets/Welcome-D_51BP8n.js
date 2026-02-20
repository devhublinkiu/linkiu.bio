import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useId, useRef, useState, useEffect, forwardRef } from "react";
import { Link as Link$1, Head } from "@inertiajs/react";
import { Link, Store, User, UtensilsCrossed, MessageCircle, Briefcase, ChevronLeft, ChevronRight, Link2, TrendingUp, Zap, Shield, Package, Wrench, Sparkles, CalendarRange, Menu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { c as cn } from "./utils-B0hQsrDj.js";
import { IconLink, IconBuildingStore, IconShoppingCart, IconCalendarEvent, IconToolsKitchen2, IconMapPin, IconBrandWhatsapp, IconVideo, IconCreditCard, IconPlug, IconChartBar, IconSpeakerphone, IconUserPlus, IconSettings, IconShare3, IconRocket } from "@tabler/icons-react";
import { A as Accordion, a as AccordionItem, b as AccordionTrigger, c as AccordionContent } from "./accordion-YG9U3R8-.js";
import { S as Sheet, a as SheetTrigger, b as SheetContent } from "./sheet-BFMMArVC.js";
import { B as Button } from "./button-BdX_X5dq.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-accordion";
import "@radix-ui/react-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}) {
  const id = useId();
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width: width2, height: height2 } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: width2, height: height2 });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const dots = Array.from(
    {
      length: Math.ceil(dimensions.width / width) * Math.ceil(dimensions.height / height)
    },
    (_, i) => {
      const col = i % Math.ceil(dimensions.width / width);
      const row = Math.floor(i / Math.ceil(dimensions.width / width));
      return {
        x: col * width + cx,
        y: row * height + cy,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2
      };
    }
  );
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ref: containerRef,
      "aria-hidden": "true",
      className: cn(
        "pointer-events-none absolute inset-0 h-full w-full text-neutral-400/80",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("radialGradient", { id: `${id}-gradient`, children: [
          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "currentColor", stopOpacity: "1" }),
          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "currentColor", stopOpacity: "0" })
        ] }) }),
        dots.map((dot, index) => /* @__PURE__ */ jsx(
          motion.circle,
          {
            cx: dot.x,
            cy: dot.y,
            r: cr,
            fill: glow ? `url(#${id}-gradient)` : "currentColor",
            initial: glow ? { opacity: 0.4, scale: 1 } : {},
            animate: glow ? {
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.5, 1]
            } : {},
            transition: glow ? {
              duration: dot.duration,
              repeat: Infinity,
              repeatType: "reverse",
              delay: dot.delay,
              ease: "easeInOut"
            } : {}
          },
          `${dot.x}-${dot.y}`
        ))
      ]
    }
  );
}
const AnimatedBeam = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  // Include the reverse prop
  duration = Math.random() * 3 + 4,
  delay = 0,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0
}) => {
  const id = useId();
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const gradientCoordinates = reverse ? {
    x1: ["90%", "-10%"],
    x2: ["100%", "0%"],
    y1: ["0%", "0%"],
    y2: ["0%", "0%"]
  } : {
    x1: ["10%", "110%"],
    x2: ["0%", "100%"],
    y1: ["0%", "0%"],
    y2: ["0%", "0%"]
  };
  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const rectA = fromRef.current.getBoundingClientRect();
        const rectB = toRef.current.getBoundingClientRect();
        const svgWidth = containerRect.width;
        const svgHeight = containerRect.height;
        setSvgDimensions({ width: svgWidth, height: svgHeight });
        const startX = rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
        const startY = rectA.top - containerRect.top + rectA.height / 2 + startYOffset;
        const endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
        const endY = rectB.top - containerRect.top + rectB.height / 2 + endYOffset;
        const controlY = startY - curvature;
        const d = `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`;
        setPathD(d);
      }
    };
    const resizeObserver = new ResizeObserver(() => {
      updatePath();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    updatePath();
    return () => {
      resizeObserver.disconnect();
    };
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset
  ]);
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      fill: "none",
      width: svgDimensions.width,
      height: svgDimensions.height,
      xmlns: "http://www.w3.org/2000/svg",
      className: cn(
        "pointer-events-none absolute top-0 left-0 transform-gpu stroke-2",
        className
      ),
      viewBox: `0 0 ${svgDimensions.width} ${svgDimensions.height}`,
      children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            d: pathD,
            stroke: pathColor,
            strokeWidth: pathWidth,
            strokeOpacity: pathOpacity,
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: pathD,
            strokeWidth: pathWidth,
            stroke: `url(#${id})`,
            strokeOpacity: "1",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs(
          motion.linearGradient,
          {
            className: "transform-gpu",
            id,
            gradientUnits: "userSpaceOnUse",
            initial: {
              x1: "0%",
              x2: "0%",
              y1: "0%",
              y2: "0%"
            },
            animate: {
              x1: gradientCoordinates.x1,
              x2: gradientCoordinates.x2,
              y1: gradientCoordinates.y1,
              y2: gradientCoordinates.y2
            },
            transition: {
              delay,
              duration,
              ease: [0.16, 1, 0.3, 1],
              // https://easings.net/#easeOutExpo
              repeat: Infinity,
              repeatDelay: 0
            },
            children: [
              /* @__PURE__ */ jsx("stop", { stopColor: gradientStartColor, stopOpacity: "0" }),
              /* @__PURE__ */ jsx("stop", { stopColor: gradientStartColor }),
              /* @__PURE__ */ jsx("stop", { offset: "32.5%", stopColor: gradientStopColor }),
              /* @__PURE__ */ jsx(
                "stop",
                {
                  offset: "100%",
                  stopColor: gradientStopColor,
                  stopOpacity: "0"
                }
              )
            ]
          }
        ) })
      ]
    }
  );
};
const Circle = forwardRef(({ className, children }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3",
        className
      ),
      children
    }
  );
});
Circle.displayName = "Circle";
const iconWrap = "flex size-6 shrink-0 items-center justify-center [&_svg]:size-full [&_svg]:max-h-6 [&_svg]:max-w-6";
function AnimatedBeamDemo() {
  const containerRef = useRef(null);
  const div1Ref = useRef(null);
  const div2Ref = useRef(null);
  const div3Ref = useRef(null);
  const div4Ref = useRef(null);
  const div5Ref = useRef(null);
  const div6Ref = useRef(null);
  const div7Ref = useRef(null);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative flex h-[300px] w-full items-center justify-center overflow-hidden p-10",
      ref: containerRef,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex size-full max-h-[200px] w-full max-w-4xl flex-col items-stretch justify-between gap-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between", children: [
            /* @__PURE__ */ jsx(Circle, { ref: div1Ref, children: /* @__PURE__ */ jsx("span", { className: iconWrap, children: /* @__PURE__ */ jsx(Link, { className: "size-6 text-slate-600 dark:text-slate-300" }) }) }),
            /* @__PURE__ */ jsx(Circle, { ref: div5Ref, children: /* @__PURE__ */ jsx("span", { className: iconWrap, children: /* @__PURE__ */ jsx(Store, { className: "size-6 text-slate-600 dark:text-slate-300" }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between", children: [
            /* @__PURE__ */ jsx(Circle, { ref: div2Ref, children: /* @__PURE__ */ jsx("span", { className: iconWrap, children: /* @__PURE__ */ jsx(User, { className: "size-6 text-slate-600 dark:text-slate-300" }) }) }),
            /* @__PURE__ */ jsxs("div", { ref: div4Ref, className: "relative flex size-16 shrink-0 items-center justify-center", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute size-16 rounded-full bg-slate-400/40 animate-pulse scale-110 dark:bg-slate-500/25",
                  "aria-hidden": true
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute size-20 rounded-full bg-slate-400/20 scale-110 animate-pulse dark:bg-slate-500/20",
                  "aria-hidden": true
                }
              ),
              /* @__PURE__ */ jsx(Circle, { className: "size-14 overflow-hidden border-0 bg-transparent p-0 shadow-none", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/LogoLinkiu.svg",
                  alt: "Linkiu",
                  className: "size-full rounded-full object-cover"
                }
              ) })
            ] }),
            /* @__PURE__ */ jsx(Circle, { ref: div6Ref, children: /* @__PURE__ */ jsx("span", { className: iconWrap, children: /* @__PURE__ */ jsx(UtensilsCrossed, { className: "size-6 text-slate-600 dark:text-slate-300" }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between", children: [
            /* @__PURE__ */ jsx(Circle, { ref: div3Ref, children: /* @__PURE__ */ jsx("span", { className: iconWrap, children: /* @__PURE__ */ jsx(MessageCircle, { className: "size-6 text-slate-600 dark:text-slate-300" }) }) }),
            /* @__PURE__ */ jsx(Circle, { ref: div7Ref, children: /* @__PURE__ */ jsx("span", { className: iconWrap, children: /* @__PURE__ */ jsx(Briefcase, { className: "size-6 text-slate-600 dark:text-slate-300" }) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          AnimatedBeam,
          {
            containerRef,
            fromRef: div1Ref,
            toRef: div4Ref,
            curvature: -75,
            endYOffset: -10
          }
        ),
        /* @__PURE__ */ jsx(
          AnimatedBeam,
          {
            containerRef,
            fromRef: div2Ref,
            toRef: div4Ref
          }
        ),
        /* @__PURE__ */ jsx(
          AnimatedBeam,
          {
            containerRef,
            fromRef: div3Ref,
            toRef: div4Ref,
            curvature: 75,
            endYOffset: 10
          }
        ),
        /* @__PURE__ */ jsx(
          AnimatedBeam,
          {
            containerRef,
            fromRef: div5Ref,
            toRef: div4Ref,
            curvature: -75,
            endYOffset: -10,
            reverse: true
          }
        ),
        /* @__PURE__ */ jsx(
          AnimatedBeam,
          {
            containerRef,
            fromRef: div6Ref,
            toRef: div4Ref,
            reverse: true
          }
        ),
        /* @__PURE__ */ jsx(
          AnimatedBeam,
          {
            containerRef,
            fromRef: div7Ref,
            toRef: div4Ref,
            curvature: 75,
            endYOffset: 10,
            reverse: true
          }
        )
      ]
    }
  );
}
const features = [
  {
    title: "Un solo enlace",
    description: "Tu catálogo, pedidos y contacto en un solo link. Lo compartes en redes, WhatsApp o donde quieras.",
    icon: /* @__PURE__ */ jsx(IconLink, { className: "size-6" })
  },
  {
    title: "Para todo tipo de negocio",
    description: "Restaurante, tienda, servicios o lo que tengas. La herramienta se adapta a ti.",
    icon: /* @__PURE__ */ jsx(IconBuildingStore, { className: "size-6" })
  },
  {
    title: "Pedidos en línea",
    description: "Los clientes te piden desde el enlace. Tú ves todo en un solo lugar, sin complicarte.",
    icon: /* @__PURE__ */ jsx(IconShoppingCart, { className: "size-6" })
  },
  {
    title: "Reserva y turno",
    description: "Mesas en el restaurante, citas en tu negocio o turnos. Se adapta a lo que ofreces.",
    icon: /* @__PURE__ */ jsx(IconCalendarEvent, { className: "size-6" })
  },
  {
    title: "Caja y cocina",
    description: "Para restaurantes: tomar pedidos, mandar a cocina o barra y llevar las mesas al día.",
    icon: /* @__PURE__ */ jsx(IconToolsKitchen2, { className: "size-6" })
  },
  {
    title: "Múltiples sucursales",
    description: "Si tienes más de un local, cada uno puede tener su menú o catálogo y ver todo junto.",
    icon: /* @__PURE__ */ jsx(IconMapPin, { className: "size-6" })
  },
  {
    title: "WhatsApp al instante",
    description: "Cada pedido o reserva te llega al WhatsApp en el momento. No te pierdes nada.",
    icon: /* @__PURE__ */ jsx(IconBrandWhatsapp, { className: "size-6" })
  },
  {
    title: "Shorts",
    description: "Videos cortos en tu página. Muestra tu negocio, platos o promos en formato vertical, como en redes.",
    icon: /* @__PURE__ */ jsx(IconVideo, { className: "size-6" })
  },
  {
    title: "LinkiuPay",
    description: "Cobra y gestiona pagos desde tu enlace. Ideal para vender sin tener todo el stock en casa.",
    icon: /* @__PURE__ */ jsx(IconCreditCard, { className: "size-6" })
  },
  {
    title: "Integraciones",
    description: "Conecta con lo que ya usas. Tu enlace y tus herramientas trabajando juntas.",
    icon: /* @__PURE__ */ jsx(IconPlug, { className: "size-6" })
  },
  {
    title: "LinkiuLab",
    description: "Clics, visitas, sesiones y estadísticas. Todo lo que necesitas para entender y mejorar tus ventas.",
    icon: /* @__PURE__ */ jsx(IconChartBar, { className: "size-6" })
  },
  {
    title: "Anuncios y promos",
    description: "Tickers, avisos y banners en tu página. Destaca ofertas y novedades para vender más.",
    icon: /* @__PURE__ */ jsx(IconSpeakerphone, { className: "size-6" })
  }
];
function Feature({
  title,
  description,
  icon,
  index
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex flex-col relative group/feature min-w-0",
        "shrink-0 w-[85vw] max-w-[320px] snap-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/50",
        "md:shrink-0 md:w-full md:min-w-0 md:max-w-none md:snap-align-none md:rounded-none md:border-0 md:bg-transparent md:shadow-none md:py-10 md:px-10",
        "md:border-r md:border-slate-200 dark:md:border-slate-800",
        index % 4 === 0 && "md:border-l md:border-slate-200 dark:md:border-slate-800",
        index < 8 && "md:border-b md:border-slate-200 dark:md:border-slate-800"
      ),
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute left-0 top-20 bottom-32 w-1 rounded-tr-full rounded-br-full bg-slate-300 dark:bg-slate-700 group-hover/feature:w-1.5 group-hover/feature:bg-slate-600 dark:group-hover/feature:bg-slate-500 transition-all duration-200 origin-left hidden md:block z-10",
            "aria-hidden": true
          }
        ),
        index < 8 && /* @__PURE__ */ jsx("div", { className: "opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-slate-100 dark:from-slate-800/50 to-transparent pointer-events-none rounded-xl md:rounded-none" }),
        index >= 8 && /* @__PURE__ */ jsx("div", { className: "opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-slate-100 dark:from-slate-800/50 to-transparent pointer-events-none rounded-xl md:rounded-none" }),
        /* @__PURE__ */ jsx("div", { className: "mb-4 relative z-10 text-slate-600 dark:text-slate-400", children: icon }),
        /* @__PURE__ */ jsx("div", { className: "text-lg font-bold mb-2 relative z-10", children: /* @__PURE__ */ jsx("span", { className: "group-hover/feature:translate-x-2 transition duration-200 inline-block text-slate-800 dark:text-slate-100", children: title }) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300 max-w-xs relative z-10 md:max-w-none", children: description })
      ]
    }
  );
}
const AUTO_ADVANCE_MS = 4500;
function FeaturesSection() {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = features.length;
  const goTo = (index) => {
    const i = (index % total + total) % total;
    setCurrentIndex(i);
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[i];
    if (child) {
      const left = child.offsetLeft - el.offsetWidth / 2 + child.offsetWidth / 2;
      el.scrollTo({ left, behavior: "smooth" });
    }
  };
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const children = el.children;
      let nearest = 0;
      let minDist = Infinity;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const dist = Math.abs(child.offsetLeft - scrollLeft - (el.offsetWidth - child.offsetWidth) / 2);
        if (dist < minDist) {
          minDist = dist;
          nearest = i;
        }
      }
      setCurrentIndex(nearest);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % total;
        const el = scrollRef.current;
        if (el) {
          const child = el.children[next];
          if (child) {
            const left = child.offsetLeft - el.offsetWidth / 2 + child.offsetWidth / 2;
            el.scrollTo({ left, behavior: "smooth" });
          }
        }
        return next;
      });
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [total]);
  return /* @__PURE__ */ jsxs("section", { id: "funciones", className: "relative z-10 md:-mt-16", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 md:mb-12 mb-2 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-6xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl", children: "Funciones" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto", children: "Todo lo que necesitas para llevar tu negocio a un solo enlace." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative max-w-8xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-20 flex justify-between w-full pointer-events-none", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => goTo(currentIndex - 1),
            className: "pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/95 shadow-md border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700",
            "aria-label": "Anterior",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-6" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => goTo(currentIndex + 1),
            className: "pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/95 shadow-md border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700",
            "aria-label": "Siguiente",
            children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-6" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: scrollRef,
          className: cn(
            "flex overflow-x-auto snap-x snap-mandatory gap-4 py-4 px-4 pb-6",
            "md:flex-none md:grid md:grid-cols-2 md:overflow-visible md:gap-0 md:px-6 md:pb-4",
            "lg:grid-cols-4 relative z-10"
          ),
          style: { WebkitOverflowScrolling: "touch" },
          children: features.map((feature, index) => /* @__PURE__ */ jsx(Feature, { ...feature, index }, feature.title))
        }
      )
    ] }),
    /* @__PURE__ */ jsx("p", { className: "md:hidden text-center text-xs text-slate-500 dark:text-slate-400 px-4 pb-2", children: "Desliza o usa las flechas para ver más funciones" })
  ] });
}
function BentoGrid({
  className,
  children
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[20rem]",
        className
      ),
      children
    }
  );
}
function BentoGridItem({
  className,
  title,
  description,
  header,
  icon
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "group/bento row-span-1 flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900",
        className
      ),
      children: [
        header && /* @__PURE__ */ jsx("div", { className: "min-h-[10rem] flex flex-col flex-1 shrink-0", children: header }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 shrink-0", children: [
          icon && /* @__PURE__ */ jsx("div", { className: "mb-2 text-slate-600 dark:text-slate-400", children: icon }),
          title && /* @__PURE__ */ jsx("div", { className: "font-semibold text-slate-900 dark:text-slate-100", children: title }),
          description && /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-slate-600 dark:text-slate-400", children: description })
        ] })
      ]
    }
  );
}
function WireframeStep1() {
  const variants = {
    initial: { x: 0 },
    animate: { x: 6, rotate: 2, transition: { duration: 0.2 } }
  };
  const variantsSecond = {
    initial: { x: 0 },
    animate: { x: -6, rotate: -2, transition: { duration: 0.2 } }
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: "initial",
      whileHover: "animate",
      className: "flex flex-1 w-full h-full min-h-[10rem] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-3 flex-col space-y-3",
      children: [
        /* @__PURE__ */ jsx(motion.div, { variants, className: "h-8 w-full rounded-md bg-slate-200 dark:bg-slate-700" }),
        /* @__PURE__ */ jsx(motion.div, { variants: variantsSecond, className: "h-8 w-full rounded-md bg-slate-200 dark:bg-slate-700" }),
        /* @__PURE__ */ jsx(motion.div, { variants, className: "h-8 w-2/3 rounded-md bg-slate-200 dark:bg-slate-700" }),
        /* @__PURE__ */ jsx(motion.div, { variants: variantsSecond, className: "h-9 w-full rounded-md bg-slate-900 dark:bg-slate-600 mt-2" })
      ]
    }
  );
}
function WireframeStep2() {
  const variants = {
    initial: { width: 0 },
    animate: { width: "100%", transition: { duration: 0.3 } }
  };
  const parentVariants = { initial: {}, animate: {} };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: "initial",
      whileHover: "animate",
      variants: parentVariants,
      className: "flex flex-1 w-full h-full min-h-[10rem] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-3 flex-col space-y-2",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(motion.div, { variants, className: "h-6 flex-1 rounded bg-slate-200 dark:bg-slate-700", style: { maxWidth: "60%" } }),
          /* @__PURE__ */ jsx(motion.div, { variants, className: "h-6 w-12 rounded bg-slate-200 dark:bg-slate-700" })
        ] }),
        /* @__PURE__ */ jsx(motion.div, { variants, className: "h-16 w-full rounded-md bg-slate-200/80 dark:bg-slate-700/80", style: { maxWidth: "100%" } }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 flex-1", children: [
          /* @__PURE__ */ jsx(motion.div, { variants, className: "rounded-md bg-slate-200 dark:bg-slate-700", style: { maxWidth: "100%" } }),
          /* @__PURE__ */ jsx(motion.div, { variants, className: "rounded-md bg-slate-200 dark:bg-slate-700", style: { maxWidth: "100%" } })
        ] })
      ]
    }
  );
}
function WireframeStep3() {
  const first = { initial: { x: 12, rotate: -3 }, animate: { x: 0, rotate: 0 } };
  const second = { initial: { x: -12, rotate: 3 }, animate: { x: 0, rotate: 0 } };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: "initial",
      whileHover: "animate",
      className: "flex flex-1 w-full h-full min-h-[10rem] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-3 flex-col items-center justify-center gap-3",
      children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            variants: first,
            className: "w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx("div", { className: "h-4 w-4 rounded bg-slate-300 dark:bg-slate-600 shrink-0" }),
              /* @__PURE__ */ jsx("div", { className: "h-3 flex-1 rounded-full bg-slate-200 dark:bg-slate-700 max-w-[80%]" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(motion.div, { variants: second, className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700" }),
          /* @__PURE__ */ jsx("div", { className: "h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" })
        ] })
      ]
    }
  );
}
const steps = [
  {
    title: "Regístrate",
    description: /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Crea tu cuenta en pocos minutos. Dinos tu negocio y listo." }),
    header: /* @__PURE__ */ jsx(WireframeStep1, {}),
    className: "md:col-span-1",
    icon: /* @__PURE__ */ jsx(IconUserPlus, { className: "size-5 text-slate-500" })
  },
  {
    title: "Configura",
    description: /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Sube tu catálogo, precios y fotos. Todo desde un solo lugar." }),
    header: /* @__PURE__ */ jsx(WireframeStep2, {}),
    className: "md:col-span-1",
    icon: /* @__PURE__ */ jsx(IconSettings, { className: "size-5 text-slate-500" })
  },
  {
    title: "Comparte",
    description: /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Comparte tu enlace en redes, WhatsApp o donde tengas clientes." }),
    header: /* @__PURE__ */ jsx(WireframeStep3, {}),
    className: "md:col-span-1",
    icon: /* @__PURE__ */ jsx(IconShare3, { className: "size-5 text-slate-500" })
  }
];
function HowItWorksSection() {
  return /* @__PURE__ */ jsxs("section", { id: "como-funciona", className: "relative z-10 py-16 sm:py-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 mb-12 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl", children: "Tu negocio en un solo enlace, en 3 pasos" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto", children: "Regístrate en minutos, configura tu catálogo y comparte tu enlace donde tengas clientes." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-6 max-w-4xl mx-auto", children: /* @__PURE__ */ jsx(BentoGrid, { className: "md:auto-rows-[22rem]", children: steps.map((step, i) => /* @__PURE__ */ jsx(
      BentoGridItem,
      {
        title: step.title,
        description: step.description,
        header: step.header,
        className: cn(step.className),
        icon: step.icon
      },
      step.title
    )) }) })
  ] });
}
function AnimatedTooltip({ items, className }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mouseX, setMouseX] = useState(0);
  const containerRef = useRef(null);
  const rotation = mouseX / 100 * 50;
  const translation = mouseX / 100 * 50;
  function handleMouseEnter(event, itemId) {
    setHoveredIndex(itemId);
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    setMouseX(event.clientX - rect.left - halfWidth);
  }
  function handleMouseMove(event) {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    setMouseX(event.clientX - rect.left - halfWidth);
  }
  function handleMouseLeave() {
    setHoveredIndex(null);
  }
  function initial(name) {
    return name.split(/\s+/).map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      className: cn("relative flex flex-row items-center gap-0", className),
      children: items.map((item) => /* @__PURE__ */ jsxs(
        "div",
        {
          onMouseEnter: (e) => handleMouseEnter(e, item.id),
          onMouseMove: handleMouseMove,
          onMouseLeave: handleMouseLeave,
          className: "relative -ml-2 first:ml-0",
          children: [
            item.image ? /* @__PURE__ */ jsx(
              "img",
              {
                src: item.image,
                alt: item.name,
                className: cn(
                  "size-11 shrink-0 cursor-pointer rounded-full object-cover border-4 border-white"
                )
              }
            ) : /* @__PURE__ */ jsx(
              "div",
              {
                className: "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200",
                "aria-label": `${item.name}, ${item.designation}`,
                children: initial(item.name)
              }
            ),
            /* @__PURE__ */ jsx(AnimatePresence, { children: hoveredIndex === item.id && /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: -10, x: "-50%" },
                animate: {
                  opacity: 1,
                  y: 0,
                  x: "-50%",
                  rotate: rotation,
                  translateX: translation
                },
                exit: { opacity: 0, y: -10 },
                transition: { type: "spring", stiffness: 300, damping: 25 },
                className: "absolute bottom-full left-1/2 z-50 mb-2 flex w-fit flex-col items-center rounded-md bg-slate-950 px-3 py-2 shadow-lg",
                style: { transformOrigin: "bottom center" },
                children: [
                  /* @__PURE__ */ jsx("p", { className: "whitespace-nowrap text-sm font-medium text-slate-100", children: item.name }),
                  /* @__PURE__ */ jsx("p", { className: "whitespace-nowrap text-xs text-slate-400", children: item.designation })
                ]
              }
            ) })
          ]
        },
        item.id
      ))
    }
  );
}
const people = [
  { id: 1, name: "Camila Muñoz", designation: "Sisu Art", image: "/profile_1.jpg" },
  { id: 2, name: "Carlos Ruiz", designation: "Azienda", image: "/profile_2.jpg" },
  { id: 3, name: "Ana Martínez", designation: "BeYou", image: "/profile_3.jpg" },
  { id: 4, name: "Luis Fernández", designation: "ETG Abogados", image: "/profile_4.jpg" },
  { id: 5, name: "Laura Vega", designation: "Olmos", image: "/profile_5.jpg" },
  { id: 6, name: "Pablo Soto", designation: "TCA Oriente", image: "/profile_6.jpg" }
];
function TrustedBy() {
  return /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-col items-center gap-4", children: [
    /* @__PURE__ */ jsx(AnimatedTooltip, { items: people, className: "flex-wrap justify-center " }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: "Ellos confiaron en nosotros" })
  ] });
}
const btnClass$1 = "inline-flex items-center gap-2 rounded-md bg-slate-900 px-6 py-3 text-base font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100";
function CTASection() {
  return /* @__PURE__ */ jsx("section", { className: "relative z-10 py-16 sm:py-24", children: /* @__PURE__ */ jsxs("div", { className: "px-6 text-center", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl", children: "¿Listo? Crea tu enlace en minutos" }),
    /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto", children: "Sin tarjeta para empezar. Regístrate gratis y comparte tu enlace donde tengas clientes." }),
    /* @__PURE__ */ jsx(TrustedBy, {}),
    /* @__PURE__ */ jsxs(
      Link$1,
      {
        href: route("register.tenant"),
        className: cn(btnClass$1, "mt-2 inline-flex w-auto h-10"),
        children: [
          /* @__PURE__ */ jsx(IconRocket, { className: "size-5" }),
          "Regístrate gratis"
        ]
      }
    )
  ] }) });
}
function NosotrosSection() {
  return /* @__PURE__ */ jsxs("section", { id: "nosotros", className: "relative z-10 overflow-hidden py-16 sm:py-24", children: [
    /* @__PURE__ */ jsx(
      DotPattern,
      {
        className: cn(
          "absolute inset-0 text-slate-400/40 dark:text-slate-600/30",
          "[mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,white,transparent)]"
        )
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center justify-center min-h-0 lg:min-h-[380px]", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-[280px] rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/80 dark:shadow-slate-900/50 lg:max-w-[280px]", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-slate-500 dark:text-slate-400", children: "Tu negocio" }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 flex items-baseline gap-2", children: /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: "Un solo enlace" }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50/80 px-3 py-2 dark:border-violet-800 dark:bg-violet-900/20", children: [
            /* @__PURE__ */ jsx(Link2, { className: "h-8 w-8 shrink-0 text-violet-600 dark:text-violet-400" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-slate-600 dark:text-slate-400", children: "Todo integrado" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-violet-700 dark:text-violet-300", children: "Catálogo, pedidos, reservas" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-slate-600 dark:text-slate-400", children: [
              /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" }),
              "Sin salir del link"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-slate-600 dark:text-slate-400", children: [
              /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-violet-400" }),
              "Un enlace"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 w-full max-w-[260px] rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60 lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:w-[260px]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-slate-500 dark:text-slate-400", children: [
            /* @__PURE__ */ jsx("span", { children: "Verticales" }),
            /* @__PURE__ */ jsx("span", { children: "Linkiu" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 flex gap-2", children: ["Gastronomía", "Ecommerce", "Servicios"].map((v, i) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "flex-1 rounded-lg bg-slate-100 py-2 text-center text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300",
              style: { height: 24 + i * 8 }
            },
            v
          )) }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-slate-500 dark:text-slate-400", children: "Adaptado a tu sector" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 flex max-w-[160px] rounded-xl border border-emerald-200 bg-white px-3 py-2 dark:border-emerald-800 dark:bg-slate-800/80 lg:absolute lg:bottom-8 lg:left-0 lg:mt-0 lg:max-w-none", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-emerald-700 dark:text-emerald-300", children: "Todo en un lugar" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-wider text-primary dark:text-primary", children: "Nosotros" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl", children: "Conectamos tu negocio con tus clientes en un solo lugar" }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 max-w-xl text-slate-600 dark:text-slate-400 leading-relaxed", children: "Linkiu nace para que cualquier negocio —restaurante, tienda, servicios— tenga su enlace único: catálogo, pedidos, reservas y contacto. Sin complicaciones técnicas, adaptable a lo que ofreces y pensado para que compartas un solo link en redes, WhatsApp o donde estén tus clientes." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            Link$1,
            {
              href: route("register.tenant"),
              className: cn(
                "inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              ),
              children: "Regístrate gratis"
            }
          ),
          /* @__PURE__ */ jsx(
            Link$1,
            {
              href: "/#funciones",
              className: "inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
              children: "Ver funciones"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...props,
      className: cn(
        "group flex [gap:var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        {
          "flex-row": !vertical,
          "flex-col": vertical
        },
        className
      ),
      children: Array(repeat).fill(0).map((_, i) => /* @__PURE__ */ jsx(
        "div",
        {
          className: cn("flex shrink-0 justify-around [gap:var(--gap)]", {
            "animate-marquee flex-row": !vertical,
            "animate-marquee-vertical flex-col": vertical,
            "group-hover:[animation-play-state:paused]": pauseOnHover,
            "[animation-direction:reverse]": reverse
          }),
          children
        },
        i
      ))
    }
  );
}
const reviews = [
  {
    name: "Camila Muñoz",
    username: "Sisu Art",
    body: "Mis clientes ven el catálogo y hacen la compra en el mismo Linkiu. Sin salir del enlace.",
    img: "/profile_1.jpg"
  },
  {
    name: "Carlos Ruiz",
    username: "Azienda",
    body: "Comparto el link y me compran desde ahí. Todo el proceso de compra pasa por Linkiu.",
    img: "/profile_2.jpg"
  },
  {
    name: "Ana Martínez",
    username: "BeYou",
    body: "Ellos eligen, agregan al carrito y pagan en Linkiu. Una sola herramienta para todo.",
    img: "/profile_3.jpg"
  },
  {
    name: "Luis Fernández",
    username: "ETG Abogados",
    body: "Mis clientes agendan y me contactan desde el mismo link. Y las reservas quedan en Linkiu.",
    img: "/profile_4.jpg"
  },
  {
    name: "Laura Vega",
    username: "Olmos",
    body: "El catálogo está en Linkiu y la compra se hace ahí mismo. Mis clientes no salen del enlace.",
    img: "/profile_5.jpg"
  },
  {
    name: "Pablo Soto",
    username: "TCA Oriente",
    body: "Pedidos y reservas: todo dentro de Linkiu. Los clientes compran en el mismo lugar.",
    img: "/profile_6.jpg"
  }
];
const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);
const ReviewCard = ({
  img,
  name,
  username,
  body
}) => {
  return /* @__PURE__ */ jsxs(
    "figure",
    {
      className: cn(
        "relative h-full w-64 shrink-0 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:bg-slate-800/50"
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              className: "size-8 rounded-full object-cover",
              width: 32,
              height: 32,
              alt: "",
              src: img
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("figcaption", { className: "text-sm font-medium text-slate-900 dark:text-white", children: name }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-slate-500 dark:text-slate-400", children: username })
          ] })
        ] }),
        /* @__PURE__ */ jsx("blockquote", { className: "mt-2 text-sm text-slate-600 dark:text-slate-300", children: body })
      ]
    }
  );
};
function TestimonialsSection() {
  return /* @__PURE__ */ jsxs("section", { className: "relative z-10 py-16 sm:py-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-12 px-6 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl", children: "Quienes ya usan Linkiu" }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-2 max-w-2xl text-lg text-slate-600 dark:text-slate-400", children: "Distintos tipos de negocio, un solo enlace." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex w-full flex-col items-center justify-center overflow-hidden", children: [
      /* @__PURE__ */ jsx(Marquee, { pauseOnHover: true, className: "[--duration:20s]", children: firstRow.map((review) => /* @__PURE__ */ jsx(ReviewCard, { ...review }, review.username)) }),
      /* @__PURE__ */ jsx(Marquee, { reverse: true, pauseOnHover: true, className: "[--duration:20s]", children: secondRow.map((review) => /* @__PURE__ */ jsx(ReviewCard, { ...review }, review.username)) }),
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-950" }),
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-950" })
    ] })
  ] });
}
const faqs = [
  {
    question: "¿Qué es Linkiu?",
    answer: "Linkiu es la herramienta digital que concentra tu negocio en un solo enlace. Tus clientes ven el catálogo, hacen pedidos, reservas o compras y te contactan desde el mismo lugar, sin salir del enlace. Se adapta a tu tipo de negocio: gastronomía, ecommerce, servicios y más."
  },
  {
    question: "¿Cómo puedo empezar con Linkiu?",
    answer: "Regístrate gratis, crea tu cuenta y elige el tipo de negocio (vertical). Configura tu catálogo, horarios y formas de pago. Comparte tu enlace único con tus clientes y empieza a recibir pedidos o reservas desde el primer día. Puedes probar las funciones sin compromiso."
  },
  {
    question: "¿Qué tipos de negocio puede usar Linkiu?",
    answer: "Linkiu ofrece soluciones para gastronomía (menú, mesas, cocina, reservas), ecommerce, dropshipping y servicios. Cada vertical incluye las funciones que necesitas: productos, carrito, checkout, reservas, contacto y más, todo en un solo enlace."
  },
  {
    question: "¿Linkiu es adecuado para negocios pequeños?",
    answer: "Sí. Está pensado para que cualquier negocio, desde un emprendimiento hasta varias sedes, tenga su tienda o carta en un solo enlace. La interfaz es sencilla y puedes ir creciendo: más productos, más ubicaciones o más opciones de pago cuando lo necesites."
  },
  {
    question: "¿Qué tipo de soporte ofrece Linkiu?",
    answer: "Ofrecemos tutoriales, preguntas frecuentes y un equipo de soporte para ayudarte con la configuración y el día a día. También publicamos actualizaciones y novedades para que aproveches todas las funciones de tu cuenta."
  }
];
function FAQSection() {
  return /* @__PURE__ */ jsx("section", { id: "preguntas-frecuentes", className: "relative w-full py-16 sm:py-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-4 sm:px-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "mb-10 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl", children: "Preguntas frecuentes" }),
    /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, defaultValue: "item-0", className: "w-full space-y-3", children: faqs.map((faq, index) => /* @__PURE__ */ jsxs(
      AccordionItem,
      {
        value: `item-${index}`,
        className: "rounded-xl border border-slate-200 bg-white px-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 data-[state=open]:border-slate-300 dark:data-[state=open]:border-slate-700",
        children: [
          /* @__PURE__ */ jsx(AccordionTrigger, { className: "py-5 text-left text-slate-900 hover:no-underline dark:text-slate-100 [&[data-state=open]]:pb-2", children: /* @__PURE__ */ jsx("span", { className: "pr-4 font-medium", children: faq.question }) }),
          /* @__PURE__ */ jsx(AccordionContent, { className: "text-slate-600 dark:text-slate-400", children: faq.answer })
        ]
      },
      index
    )) })
  ] }) });
}
const TYPE_ICONS = {
  new: Sparkles,
  fix: Wrench,
  improvement: Package,
  security: Shield,
  performance: Zap
};
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long" });
}
function ReleaseNotesSection({ releaseNotes = [] }) {
  const list = releaseNotes.slice(0, 3);
  return /* @__PURE__ */ jsx("section", { id: "release-notes", className: "relative w-full py-16 sm:py-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-4 sm:px-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl", children: "Novedades" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-slate-600 dark:text-slate-400", children: "Últimas actualizaciones de Linkiu." }),
    /* @__PURE__ */ jsx("div", { className: "mt-12 grid gap-0 sm:grid-cols-3 sm:divide-x sm:divide-slate-200 dark:sm:divide-slate-700", children: list.map((release) => {
      const Icon = TYPE_ICONS[release.type] ?? CalendarRange;
      return /* @__PURE__ */ jsxs(
        Link$1,
        {
          href: `/release-notes/${release.slug}`,
          className: "flex flex-col px-0 py-6 sm:px-8 sm:py-0 sm:pt-6 sm:pb-8 transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400", children: /* @__PURE__ */ jsx(Icon, { className: "size-5", "aria-hidden": true }) }),
              /* @__PURE__ */ jsx(
                "time",
                {
                  className: "text-sm text-slate-500 dark:text-slate-400",
                  dateTime: release.date,
                  children: formatDate(release.date)
                }
              )
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "mt-4 text-lg font-bold leading-snug text-slate-900 dark:text-white", children: release.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400", children: release.snippet }),
            /* @__PURE__ */ jsx("span", { className: "mt-4 inline-block text-sm font-medium text-slate-600 underline decoration-slate-400 underline-offset-2 hover:text-slate-900 dark:text-slate-400 dark:decoration-slate-500 dark:hover:text-slate-200", children: "Ver actualización" })
          ]
        },
        release.id
      );
    }) }),
    /* @__PURE__ */ jsx("p", { className: "mt-10 text-center", children: /* @__PURE__ */ jsx(
      Link$1,
      {
        href: "/release-notes",
        className: "text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200",
        children: "Ver todas las novedades →"
      }
    ) })
  ] }) });
}
const footerLinkClass = "text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100";
const columns = [
  {
    title: "Legal",
    links: [
      { label: "Política de Cookies", href: "/politica-cookies" },
      { label: "Aviso Legal", href: "/aviso-legal" },
      { label: "Política de Privacidad", href: "/politica-privacidad" },
      { label: "Política de Reembolsos", href: "/politica-reembolsos" },
      { label: "Términos y Condiciones", href: "/terminos-y-condiciones" }
    ]
  },
  {
    title: "Soluciones",
    links: [
      { label: "Gastronomía", href: "/#funciones" },
      { label: "Ecommerce", href: "/#funciones" },
      { label: "Dropshipping", href: "/#funciones" },
      { label: "Servicios", href: "/#funciones" }
    ]
  },
  {
    title: "Ayuda",
    links: [
      { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
      { label: "Tutoriales", href: "/#tutoriales" },
      { label: "Actualizaciones", href: "/actualizaciones" }
    ]
  },
  {
    title: "Empresa",
    links: [
      { label: "Nosotros", href: "/#nosotros" },
      { label: "Equipo Linkiu", href: "/equipo" },
      { label: "Partners", href: "/partners" },
      { label: "Blog", href: "/blog" }
    ]
  }
];
function FooterSection() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsx("footer", { className: "relative z-10 w-full border-t border-slate-200 bg-white pt-8 pb-0 dark:border-slate-800 dark:bg-slate-950 overflow-hidden sm:pt-12", children: /* @__PURE__ */ jsxs("div", { className: "relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:max-w-7xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-5xl font-bold pb-2 sm:text-5xl lg:text-6xl", children: [
          "Un solo enlace, ",
          /* @__PURE__ */ jsx("br", {}),
          " infinitas oportunidades"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: [
          "© ",
          year,
          " Linkiu. Todos los derechos reservados."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-6 gap-y-8 sm:grid-cols-4 sm:gap-10", children: columns.map((col) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-4 text-sm font-semibold text-slate-900 dark:text-white", children: col.title }),
        /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-3", children: col.links.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link$1,
          {
            href: link.href,
            className: cn(footerLinkClass),
            children: link.label
          }
        ) }, link.label)) })
      ] }, col.title)) })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "pointer-events-none mt-10 flex justify-center -mb-8 sm:mt-16 sm:-mb-24",
        "aria-hidden": true,
        children: /* @__PURE__ */ jsx("span", { className: "select-none text-[clamp(10rem,45vw,56rem)] font-black leading-none tracking-tighter text-slate-100 dark:text-slate-800/50 sm:text-[clamp(40rem,20vw,48rem)]", children: "Linkiu" })
      }
    )
  ] }) });
}
const NAV_LINKS = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#funciones", label: "Funciones" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#tutoriales", label: "Tutoriales" },
  { href: "/#blogs", label: "Blogs" },
  { href: "/release-notes", label: "Release Notes" },
  { href: "/#contacto", label: "Contacto" }
];
const linkClass = "rounded-md px-3 py-2 text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white";
const btnClass = "rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90";
function Welcome({
  auth,
  laravelVersion,
  phpVersion,
  releaseNotes = []
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Linkiu - Tu negocio en un solo enlace" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100", children: /* @__PURE__ */ jsxs("div", { className: "relative flex min-h-screen flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-6xl px-6 lg:max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-4 py-6 lg:py-8", children: [
          /* @__PURE__ */ jsx(Link$1, { href: "/", className: "shrink-0", "aria-label": "Linkiu inicio", children: /* @__PURE__ */ jsx("img", { src: "/logo_nav_web_linkiu.svg", alt: "Linkiu", className: "h-8 w-auto dark:invert" }) }),
          /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex flex-wrap items-center gap-1 lg:gap-2", children: [
            NAV_LINKS.map(({ href, label }) => /* @__PURE__ */ jsx(Link$1, { href, className: linkClass, children: label }, href)),
            /* @__PURE__ */ jsx(Link$1, { href: route("register.tenant"), className: cn(btnClass, "ml-2"), children: "Regístrate gratis" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex md:hidden items-center gap-2", children: [
            /* @__PURE__ */ jsx(Link$1, { href: route("register.tenant"), className: btnClass, children: "Regístrate gratis" }),
            /* @__PURE__ */ jsxs(Sheet, { open: menuOpen, onOpenChange: setMenuOpen, children: [
              /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "shrink-0", "aria-label": "Abrir menú", children: /* @__PURE__ */ jsx(Menu, { className: "size-6" }) }) }),
              /* @__PURE__ */ jsx(SheetContent, { side: "right", className: "w-full max-w-xs flex flex-col gap-2 pt-10", children: NAV_LINKS.map(({ href, label }) => /* @__PURE__ */ jsx(Link$1, { href, className: linkClass, onClick: () => setMenuOpen(false), children: label }, href)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { id: "inicio", className: "relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden py-16 sm:py-24 text-center", children: [
          /* @__PURE__ */ jsx(
            DotPattern,
            {
              className: cn(
                "text-slate-400 dark:text-slate-700",
                "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
              )
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-6xl justify-start text-left md:text-center font-black tracking-tight text-slate-900 dark:text-white md:text-7xl max-w-4xl mx-auto", children: "Tu negocio, un solo enlace" }),
            /* @__PURE__ */ jsx("p", { className: "mt-6 text-lg justify-start text-left md:text-center sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto", children: "La herramienta digital que concentra tu negocio en un solo enlace: catálogo, pedidos, reservas, contacto y más. Adaptada a tu tipo de negocio." }),
            /* @__PURE__ */ jsx("div", { className: "relative w-full max-w-4xl mx-auto min-h-[200px]", children: /* @__PURE__ */ jsx(AnimatedBeamDemo, {}) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(FeaturesSection, {}),
        /* @__PURE__ */ jsx(HowItWorksSection, {}),
        /* @__PURE__ */ jsx(CTASection, {}),
        /* @__PURE__ */ jsx(NosotrosSection, {}),
        /* @__PURE__ */ jsx(TestimonialsSection, {}),
        /* @__PURE__ */ jsx(FAQSection, {}),
        /* @__PURE__ */ jsx(ReleaseNotesSection, { releaseNotes })
      ] }),
      /* @__PURE__ */ jsx(FooterSection, {})
    ] }) })
  ] });
}
export {
  Welcome as default
};
