import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import Spline from "@splinetool/react-spline";
import { useId, useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { c as cn } from "./utils-B0hQsrDj.js";
import { IconLink, IconBuildingStore, IconShoppingCart, IconCalendarEvent, IconToolsKitchen2, IconMapPin, IconBrandWhatsapp, IconVideo, IconCreditCard, IconPlug, IconChartBar, IconSpeakerphone, IconUserPlus, IconSettings, IconShare3 } from "@tabler/icons-react";
import "clsx";
import "tailwind-merge";
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
        "flex flex-col py-10 relative group/feature lg:border-r border-slate-200 dark:border-slate-800",
        index % 4 === 0 && "lg:border-l border-slate-200 dark:border-slate-800",
        index < 8 && "lg:border-b border-slate-200 dark:border-slate-800"
      ),
      children: [
        index < 8 && /* @__PURE__ */ jsx("div", { className: "opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-slate-100 dark:from-slate-800/50 to-transparent pointer-events-none" }),
        index >= 8 && /* @__PURE__ */ jsx("div", { className: "opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-slate-100 dark:from-slate-800/50 to-transparent pointer-events-none" }),
        /* @__PURE__ */ jsx("div", { className: "mb-4 relative z-10 px-10 text-slate-600 dark:text-slate-400", children: icon }),
        /* @__PURE__ */ jsxs("div", { className: "text-lg font-bold mb-2 relative z-10 px-10", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-slate-300 dark:bg-slate-700 group-hover/feature:bg-slate-600 dark:group-hover/feature:bg-slate-500 transition-all duration-200 origin-center" }),
          /* @__PURE__ */ jsx("span", { className: "group-hover/feature:translate-x-2 transition duration-200 inline-block text-slate-800 dark:text-slate-100", children: title })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300 max-w-xs relative z-10 px-10", children: description })
      ]
    }
  );
}
function FeaturesSection() {
  return /* @__PURE__ */ jsxs("section", { id: "funciones", className: "relative z-10 py-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 mb-12 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl", children: "Funciones" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto", children: "Todo lo que necesitas para llevar tu negocio a un solo enlace." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-4 max-w-7xl mx-auto", children: features.map((feature, index) => /* @__PURE__ */ jsx(Feature, { ...feature, index }, feature.title)) })
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
const SPLINE_SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";
function Welcome({
  auth,
  laravelVersion,
  phpVersion
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Linkiu - Tu negocio en un solo enlace" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100", children: /* @__PURE__ */ jsx("div", { className: "relative flex min-h-screen flex-col", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-6xl px-6 lg:max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("header", { className: "flex flex-wrap items-center justify-between gap-4 py-6 lg:py-8", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: "/",
            className: "text-xl font-bold text-black dark:text-white",
            children: "Linkiu"
          }
        ),
        /* @__PURE__ */ jsxs("nav", { className: "flex flex-wrap items-center gap-1 sm:gap-2", children: [
          /* @__PURE__ */ jsx(Link, { href: "/#inicio", className: "rounded-md px-3 py-2 text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white", children: "Inicio" }),
          /* @__PURE__ */ jsx(Link, { href: "/#funciones", className: "rounded-md px-3 py-2 text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white", children: "Funciones" }),
          /* @__PURE__ */ jsx(Link, { href: "/#nosotros", className: "rounded-md px-3 py-2 text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white", children: "Nosotros" }),
          /* @__PURE__ */ jsx(Link, { href: "/#tutoriales", className: "rounded-md px-3 py-2 text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white", children: "Tutoriales" }),
          /* @__PURE__ */ jsx(Link, { href: "/#blogs", className: "rounded-md px-3 py-2 text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white", children: "Blogs" }),
          /* @__PURE__ */ jsx(Link, { href: "/#release-notes", className: "rounded-md px-3 py-2 text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white", children: "Release Notes" }),
          /* @__PURE__ */ jsx(Link, { href: "/#contacto", className: "rounded-md px-3 py-2 text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white", children: "Contacto" }),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("register.tenant"),
              className: "ml-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90",
              children: "Regístrate gratis"
            }
          )
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
          /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-7xl max-w-4xl mx-auto", children: "Tu negocio, un solo enlace" }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed", children: "La herramienta digital que concentra tu negocio en un solo enlace: catálogo, pedidos, reservas, contacto y más. Adaptada a tu tipo de negocio." }),
          /* @__PURE__ */ jsx("div", { className: "relative w-full max-w-6xl mx-auto h-[550px] overflow-hidden rounded-lg -mt-10", children: /* @__PURE__ */ jsx(Spline, { scene: SPLINE_SCENE_URL, className: "size-full", style: { width: "100%", height: "100%" } }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(FeaturesSection, {}),
      /* @__PURE__ */ jsx(HowItWorksSection, {}),
      /* @__PURE__ */ jsxs("footer", { className: "py-12 text-center text-sm text-slate-500 dark:text-slate-400", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Linkiu"
      ] })
    ] }) }) })
  ] });
}
export {
  Welcome as default
};
