import { jsxs, jsx } from "react/jsx-runtime";
import { R as ReportBusinessStrip, F as Footer } from "./ReportBusinessStrip-Cg46R4fS.js";
import { Toaster } from "sonner";
import { MapPin, Church, Home, Headphones, Banknote, BadgeCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";
function PublicLayout({ children, bgColor, renderBottomAction, renderFloatingBottom }) {
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
      /* @__PURE__ */ jsx("div", { className: "scrollbar-public flex-1 min-h-0 relative overflow-y-auto overflow-x-hidden", children: /* @__PURE__ */ jsxs("div", { className: "min-h-full flex flex-col", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1", children }),
        /* @__PURE__ */ jsx(ReportBusinessStrip, {}),
        /* @__PURE__ */ jsx(Footer, {})
      ] }) }),
      renderBottomAction && /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 left-0 right-0 bg-white border-t p-4 px-6 z-40 sm:absolute sm:bottom-0", children: renderBottomAction }),
      renderFloatingBottom && /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 z-40 w-full max-w-[480px] mx-auto", children: renderFloatingBottom }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-200 rounded-full sm:block hidden pointer-events-none mb-1 z-50" })
    ] }),
    /* @__PURE__ */ jsx(Toaster, { position: "top-center" })
  ] });
}
function Header({ tenantName, description, logoUrl, bgColor, textColor, descriptionColor }) {
  const { currentTenant } = usePage().props;
  const currentRoute = route().current();
  const determineActiveTab = () => {
    if (currentRoute === "tenant.public.locations") return "locations";
    if (currentRoute === "tenant.public.services") return "services";
    if (currentRoute === "tenant.home") return "home";
    if (currentRoute === "tenant.public.podcast") return "podcast";
    if (currentRoute === "tenant.public.donations") return "donations";
    return "home";
  };
  const [activeTab, setActiveTab] = useState(determineActiveTab());
  useEffect(() => {
    setActiveTab(determineActiveTab());
  }, [currentRoute]);
  const brandColor = bgColor || "#1e3a5f";
  const brandTextColor = textColor || "#ffffff";
  const menuItems = [
    { id: "locations", label: "Sedes", icon: MapPin, href: route("tenant.public.locations", currentTenant?.slug) },
    { id: "services", label: "Servicios", icon: Church, href: route("tenant.public.services", currentTenant?.slug) },
    { id: "home", label: "Inicio", icon: Home, href: route("tenant.home", currentTenant?.slug) },
    { id: "podcast", label: "Podcast", icon: Headphones, href: route("tenant.public.podcast", currentTenant?.slug) },
    { id: "donations", label: "Donaciones", icon: Banknote, href: route("tenant.public.donations", currentTenant?.slug) }
  ];
  return /* @__PURE__ */ jsx("div", { className: "w-full px-4 pt-4 pb-2 z-10 space-y-0", children: /* @__PURE__ */ jsxs("div", { className: "w-full bg-white rounded-[1rem] overflow-hidden relative", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "p-6 text-white relative overflow-hidden transition-colors duration-500",
        style: { backgroundColor: brandColor, color: brandTextColor },
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "w-20 h-20 shrink-0 rounded-full border border-white/30 shadow-lg bg-white p-1 relative group", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full bg-white/20 blur-md group-hover:blur-lg transition-all" }),
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(tenantName)}&background=random`,
                  alt: tenantName,
                  className: "w-full h-full object-cover rounded-full relative z-10"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-left", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsx("h1", { className: "text-2xl font-black tracking-tight leading-none", children: tenantName }),
                /* @__PURE__ */ jsx(BadgeCheck, { className: "w-5 h-5 text-green-400 fill-white shrink-0" })
              ] }),
              /* @__PURE__ */ jsx(
                "p",
                {
                  className: "text-xs md:text-sm font-medium leading-light line-clamp-2",
                  style: { color: descriptionColor ?? "rgba(255,255,255,0.9)" },
                  children: description || "Bienvenido. Servicios, podcast y más."
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "bg-slate-100 py-3 sm:py-4 px-4", children: /* @__PURE__ */ jsx("nav", { className: "grid grid-cols-5 gap-2 px-2 sm:px-4", "aria-label": "Navegación principal", children: menuItems.map((item) => {
      const isActive = activeTab === item.id;
      const isLink = item.href && item.href !== "#";
      const itemContent = /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center gap-0.5 transition-all duration-300", children: isActive ? /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 text-white md:px-4 px-3 py-2 md:py-3 rounded-full shadow-lg shadow-slate-900/20 flex items-center gap-1 justify-center", children: [
        /* @__PURE__ */ jsx(item.icon, { className: "w-4 h-4 sm:w-5 sm:h-5 shrink-0", "aria-hidden": true }),
        /* @__PURE__ */ jsx("span", { className: "text-xs md:text-xs font-bold whitespace-nowrap", children: item.label })
      ] }) : /* @__PURE__ */ jsx("div", { className: "rounded-full text-slate-500 flex items-center justify-center w-10 h-10 shrink-0", children: /* @__PURE__ */ jsx(item.icon, { className: "w-5 h-5 shrink-0", "aria-hidden": true }) }) });
      return isLink ? /* @__PURE__ */ jsx(
        Link,
        {
          href: item.href,
          className: "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-[1.25rem] sm:rounded-[1.5rem] flex justify-center items-center",
          "aria-current": isActive ? "page" : void 0,
          children: itemContent
        },
        item.id
      ) : /* @__PURE__ */ jsx("div", { className: "cursor-not-allowed opacity-80 flex justify-center items-center", "aria-disabled": true, children: itemContent }, item.id);
    }) }) })
  ] }) });
}
export {
  Header as H,
  PublicLayout as P
};
