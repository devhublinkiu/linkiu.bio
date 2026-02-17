import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { usePage, Head, router } from "@inertiajs/react";
import { P as PublicLayout } from "./PublicLayout-SbrFcTnr.js";
import { useRef, useEffect, useState, useMemo } from "react";
import { C as Card, d as CardContent } from "./card-BaovBWX5.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { Star, MapPin, Clock, Instagram, Facebook, Map, Navigation, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
/* empty css                 */
import L from "leaflet";
import { H as Header } from "./Header-7g29WzYU.js";
import "sonner";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./input-B_4qRSOV.js";
import "./label-L_u-fyc1.js";
import "@radix-ui/react-label";
import "class-variance-authority";
import "./textarea-BpljFL5D.js";
import "@radix-ui/react-slot";
const icon = "/build/assets/marker-icon-hN30_KVU.png";
const iconShadow = "/build/assets/marker-shadow-f7SaPCxT.png";
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
const hasValidCoords = (lat, lng) => lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng) && (lat !== 0 || lng !== 0);
function LocationMap({ latitude, longitude }) {
  const mapContainerRef = useRef(null);
  const mapInstance = useRef(null);
  const valid = hasValidCoords(latitude, longitude);
  useEffect(() => {
    if (!valid || !mapContainerRef.current) return;
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 15,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        attributionControl: false
      });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(mapInstance.current);
      L.marker([latitude, longitude]).addTo(mapInstance.current);
    } else {
      mapInstance.current.setView([latitude, longitude], 15);
      mapInstance.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstance.current?.removeLayer(layer);
        }
      });
      L.marker([latitude, longitude]).addTo(mapInstance.current);
    }
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [latitude, longitude, valid]);
  if (!valid) {
    return /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-slate-100 text-slate-500 text-sm font-medium", "aria-label": "Ubicación no disponible", children: "Ubicación no disponible" });
  }
  return /* @__PURE__ */ jsx("div", { ref: mapContainerRef, className: "w-full h-full z-0 pointer-events-none grayscale-[20%]" });
}
const DAYS_MAP = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday"
};
const DAY_LABELS = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo"
};
const ORDERED_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
function formatAddress(address, city) {
  return [address, city].filter(Boolean).join(", ") || "Ubicación sin dirección";
}
function LocationCard({ location, isCurrentSede = false, onEnterSede }) {
  const [showHours, setShowHours] = useState(false);
  const currentStatus = useMemo(() => {
    const now = /* @__PURE__ */ new Date();
    const dayKey = DAYS_MAP[now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const todayHours = location.opening_hours[dayKey] || [];
    if (todayHours.length === 0) {
      return { isOpen: false, message: "Cerrado hoy", color: "bg-red-100 text-red-700" };
    }
    for (const slot of todayHours) {
      const [openH, openM] = slot.open.split(":").map(Number);
      const [closeH, closeM] = slot.close.split(":").map(Number);
      const openTime = openH * 60 + openM;
      const closeTime = closeH * 60 + closeM;
      if (currentTime >= openTime && currentTime < closeTime) {
        return { isOpen: true, message: `Abierto hasta las ${slot.close}`, color: "bg-green-100 text-green-700 font-bold" };
      }
    }
    const nextSlot = todayHours.find((slot) => {
      const [openH, openM] = slot.open.split(":").map(Number);
      const openTime = openH * 60 + openM;
      return currentTime < openTime;
    });
    if (nextSlot) {
      return { isOpen: false, message: `Abre a las ${nextSlot.open}`, color: "bg-amber-100 text-amber-700" };
    }
    return { isOpen: false, message: "Cerrado", color: "bg-red-100 text-red-700" };
  }, [location.opening_hours]);
  const hasValidCoords2 = location.latitude != null && location.longitude != null && (location.latitude !== 0 || location.longitude !== 0);
  const googleMapsUrl = hasValidCoords2 ? `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}` : null;
  const wazeUrl = hasValidCoords2 ? `https://waze.com/ul?ll=${location.latitude},${location.longitude}&navigate=yes` : null;
  const whatsappUrl = location.whatsapp ? `https://wa.me/${location.whatsapp.replace(/\D/g, "")}${location.whatsapp_message ? `?text=${encodeURIComponent(location.whatsapp_message)}` : ""}` : null;
  return /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden border border-slate-200 shadow-lg rounded-[2rem] bg-white relative group", children: [
    /* @__PURE__ */ jsxs("div", { className: "h-32 w-full relative z-0", children: [
      /* @__PURE__ */ jsx(LocationMap, { latitude: location.latitude, longitude: location.longitude }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent z-[400]" }),
      location.is_main && /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3 z-[400]", children: /* @__PURE__ */ jsxs(Badge, { className: "bg-amber-500 text-white border-0 px-2.5 py-1 text-[10px] font-bold shadow-md rounded-full flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(Star, { className: "size-3 fill-white" }),
        "PRINCIPAL"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { className: "px-6 pb-6 pt-0 relative z-10 -mt-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white p-1 rounded-2xl shadow-sm inline-block", children: /* @__PURE__ */ jsx("div", { className: "bg-slate-50 p-2.5 rounded-xl border border-slate-100", children: /* @__PURE__ */ jsx(MapPin, { className: "size-6 text-slate-800" }) }) }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowHours(true),
            className: `text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-colors ${currentStatus.color.includes("green") ? "bg-green-50 text-green-700 border-green-100" : currentStatus.color.includes("red") ? "bg-red-50 text-red-700 border-red-100" : "bg-amber-50 text-amber-700 border-amber-100"}`,
            "aria-label": `Horario: ${currentStatus.isOpen ? "Abierto" : "Cerrado"}. Ver horarios de atención`,
            children: [
              /* @__PURE__ */ jsx(Clock, { className: "size-3.5", "aria-hidden": true }),
              currentStatus.isOpen ? "Abierto" : "Cerrado",
              /* @__PURE__ */ jsx("span", { className: "opacity-60 font-normal", children: "| Ver Horarios" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1 mb-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-black text-2xl text-slate-900 tracking-tight", children: location.name }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-600 leading-relaxed", children: formatAddress(location.address, location.city) }),
        location.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400", children: location.description })
      ] }),
      location.social_networks && Object.values(location.social_networks).some(Boolean) && /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide", role: "list", "aria-label": "Redes sociales", children: [
        location.social_networks.instagram && /* @__PURE__ */ jsx("a", { href: location.social_networks.instagram, target: "_blank", rel: "noopener noreferrer", className: "p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors", "aria-label": "Instagram", children: /* @__PURE__ */ jsx(Instagram, { className: "size-5" }) }),
        location.social_networks.facebook && /* @__PURE__ */ jsx("a", { href: location.social_networks.facebook, target: "_blank", rel: "noopener noreferrer", className: "p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors", "aria-label": "Facebook", children: /* @__PURE__ */ jsx(Facebook, { className: "size-5" }) }),
        location.social_networks.tiktok && /* @__PURE__ */ jsx("a", { href: location.social_networks.tiktok, target: "_blank", rel: "noopener noreferrer", className: "p-2 rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors", "aria-label": "TikTok", children: /* @__PURE__ */ jsx("svg", { className: "size-5", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { d: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2.5", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "default",
            onClick: () => googleMapsUrl && window.open(googleMapsUrl, "_blank"),
            className: "bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 shadow-md shadow-slate-200 text-xs sm:text-sm",
            "aria-label": "Abrir en Google Maps",
            disabled: !googleMapsUrl,
            children: [
              /* @__PURE__ */ jsx(Map, { className: "size-3 shrink-0", "aria-hidden": true }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "truncate text-xs", children: "Google Maps" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => wazeUrl && window.open(wazeUrl, "_blank"),
            className: "border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl h-12 text-xs sm:text-sm",
            "aria-label": "Abrir en Waze",
            disabled: !wazeUrl,
            children: [
              /* @__PURE__ */ jsx(Navigation, { className: "size-3 text-cyan-500 shrink-0", "aria-hidden": true }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "truncate text-xs", children: "Waze" })
            ]
          }
        ),
        whatsappUrl ? /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: () => window.open(whatsappUrl, "_blank"),
            className: "bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl h-12 font-bold shadow-md shadow-green-100 text-xs sm:text-sm",
            "aria-label": "Escribir por WhatsApp",
            children: [
              /* @__PURE__ */ jsx(MessageCircle, { className: "size-3 shrink-0", "aria-hidden": true }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "truncate text-xs", children: "WhatsApp" })
            ]
          }
        ) : /* @__PURE__ */ jsx("div", { className: "rounded-xl h-12 border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 text-xs", children: "—" }),
        isCurrentSede && /* @__PURE__ */ jsx("div", { className: "col-span-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary/10 text-primary border border-primary/20 text-sm font-bold", role: "status", "aria-live": "polite", children: "Te encuentras en esta sede" }),
        onEnterSede && /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => onEnterSede(location.id),
            className: "col-span-3 rounded-xl h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90",
            "aria-label": `Quiero entrar en esta sede: ${location.name}`,
            children: "Quiero entrar en esta sede"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: showHours && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: () => setShowHours(false),
          className: "fixed inset-0 bg-black/60 z-[9999] backdrop-blur-sm"
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "hours-modal-title",
          initial: { opacity: 0, scale: 0.95, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: 20 },
          className: "fixed inset-x-4 top-[20%] max-w-sm mx-auto bg-white rounded-[2rem] z-[10000] overflow-hidden shadow-2xl",
          children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { id: "hours-modal-title", className: "font-black text-xl text-slate-900", children: "Horarios de Atención" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: location.name })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowHours(false),
                  className: "p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors",
                  "aria-label": "Cerrar horarios",
                  children: /* @__PURE__ */ jsx(X, { className: "size-5 text-slate-600", "aria-hidden": true })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: ORDERED_DAYS.map((day) => {
              const hours = location.opening_hours[day] || [];
              const isToday = DAYS_MAP[(/* @__PURE__ */ new Date()).getDay()] === day;
              return /* @__PURE__ */ jsxs("div", { className: `flex justify-between items-center pb-2 border-b border-slate-100 last:border-0 ${isToday ? "font-bold text-slate-900" : "text-slate-500"}`, children: [
                /* @__PURE__ */ jsx("span", { className: "capitalize", children: DAY_LABELS[day] }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-col items-end", children: hours.length > 0 ? hours.map((slot, i) => /* @__PURE__ */ jsxs("span", { className: `text-sm ${isToday ? "bg-green-100 text-green-700 px-2 py-0.5 rounded-md" : ""}`, children: [
                  slot.open,
                  " - ",
                  slot.close
                ] }, i)) : /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-300 italic", children: "Cerrado" }) })
              ] }, day);
            }) }),
            /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(Button, { onClick: () => setShowHours(false), className: "w-full rounded-xl", variant: "default", children: "Entendido" }) })
          ] })
        }
      )
    ] }) })
  ] });
}
function Index({ tenant, locations, selected_location_id = null }) {
  const { locationsCount = 0 } = usePage().props;
  const slug = tenant.slug;
  const { bg_color, name_color } = tenant.brand_colors || { bg_color: "#db2777", name_color: "#ffffff" };
  const enterSede = (locationId) => {
    router.post(route("tenant.shorts.enter", { tenant: slug }), { location_id: locationId });
  };
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: `Nuestras Sedes - ${tenant.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-h-screen pb-20", children: [
      /* @__PURE__ */ jsx(
        Header,
        {
          tenantName: tenant.name,
          logoUrl: tenant.logo_url ?? void 0,
          description: tenant.store_description ?? void 0,
          bgColor: bg_color,
          textColor: name_color
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto px-4 w-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6 mt-2", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-primary/10 p-2.5 rounded-xl", children: /* @__PURE__ */ jsx(MapPin, { className: "size-6 text-primary" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-xl font-black tracking-tight", children: "Nuestras Sedes" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              locations.length,
              " ",
              locations.length === 1 ? "ubicación disponible" : "ubicaciones disponibles"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "py-6", children: locations.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-4", children: locations.map((location) => /* @__PURE__ */ jsx(
          LocationCard,
          {
            location,
            isCurrentSede: selected_location_id != null && location.id === selected_location_id,
            onEnterSede: locationsCount > 1 && selected_location_id !== location.id ? enterSede : void 0
          },
          location.id
        )) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-slate-100 rounded-full size-16 mx-auto mb-4 flex items-center justify-center", children: /* @__PURE__ */ jsx(MapPin, { className: "size-8 text-slate-400" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-600 font-medium", children: "No hay sedes disponibles" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Pronto estaremos cerca de ti" })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
