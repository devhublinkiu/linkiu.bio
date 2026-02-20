import { jsxs, jsx } from "react/jsx-runtime";
import React__default from "react";
import { A as AdminLayout } from "./AdminLayout-CegS7XIj.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { ChevronLeft, MapPin, Edit, Info, MessageCircle, CheckCircle2, Smartphone, Globe, Navigation, Clock, Calendar } from "lucide-react";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, d as CardContent, a as CardHeader, b as CardTitle, c as CardDescription } from "./card-BaovBWX5.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { S as Separator } from "./separator-DbxqJzR0.js";
import L from "leaflet";
/* empty css                 */
import "sonner";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./dropdown-menu-Dkgv2tnp.js";
import "@radix-ui/react-slot";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./input-B_4qRSOV.js";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./menuConfig-rtCrEhXP.js";
import "./sonner-ZUDSQr7N.js";
import "class-variance-authority";
import "@radix-ui/react-separator";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});
const DAYS = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" }
];
function ManualMap({ position, zoom = 13 }) {
  const mapRef = React__default.useRef(null);
  const leafletMap = React__default.useRef(null);
  const markerRef = React__default.useRef(null);
  React__default.useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;
    leafletMap.current = L.map(mapRef.current).setView(position, zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(leafletMap.current);
    markerRef.current = L.marker(position).addTo(leafletMap.current);
    setTimeout(() => {
      leafletMap.current?.invalidateSize();
    }, 300);
    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, []);
  return /* @__PURE__ */ jsx("div", { ref: mapRef, className: "h-full w-full" });
}
function Show({ location }) {
  const { currentTenant } = usePage().props;
  const navigateToMap = (provider) => {
    if (!location.latitude || !location.longitude) return;
    const url = provider === "google" ? `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}` : `https://waze.com/ul?ll=${location.latitude},${location.longitude}&navigate=yes`;
    window.open(url, "_blank");
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: `Sede: ${location.name}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Sede: ${location.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("tenant.locations.index", currentTenant?.slug),
              className: "text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors",
              children: [
                /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }),
                " Volver a sedes"
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-black tracking-tight", children: location.name }),
            location.is_main && /* @__PURE__ */ jsx(Badge, { className: "bg-blue-100 text-blue-700 border-blue-200", children: "Sede Principal" }),
            !location.is_active && /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: "Inactiva" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "size-4" }),
            " ",
            location.address,
            ", ",
            location.city,
            ", ",
            location.state
          ] })
        ] }),
        /* @__PURE__ */ jsx(Link, { href: route("tenant.locations.edit", [currentTenant?.slug, location.id]), children: /* @__PURE__ */ jsxs(Button, { className: "font-bold", children: [
          /* @__PURE__ */ jsx(Edit, { className: "mr-2 size-4" }),
          " Editar Información"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Card, { className: "border-none bg-primary/5 shadow-none", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "bg-primary/10 p-3 rounded-xl text-primary", children: /* @__PURE__ */ jsx(Info, { className: "size-6" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wider font-bold text-primary/60", children: "Encargado" }),
                /* @__PURE__ */ jsx("p", { className: "font-bold text-lg", children: location.manager || "No asignado" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(Card, { className: "border-none bg-green-50 shadow-none", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "bg-green-100 p-3 rounded-xl text-green-600", children: /* @__PURE__ */ jsx(MessageCircle, { className: "size-6" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wider font-bold text-green-600/60", children: "WhatsApp Directo" }),
                /* @__PURE__ */ jsx("p", { className: "font-bold text-lg", children: location.whatsapp || "No configurado" })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "size-5 text-primary" }),
              " Detalles de la Sede"
            ] }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: location.description || "Sin descripción adicional para esta sede." }) }),
              /* @__PURE__ */ jsx(Separator, {}),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm text-slate-500 uppercase tracking-widest", children: "Información de contacto" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    location.phone && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                      /* @__PURE__ */ jsx(Smartphone, { className: "size-4 text-slate-400" }),
                      " ",
                      location.phone
                    ] }),
                    location.whatsapp && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                      /* @__PURE__ */ jsx(MessageCircle, { className: "size-4 text-green-500" }),
                      " ",
                      location.whatsapp
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm text-slate-500 uppercase tracking-widest", children: "Redes Sociales" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    location.social_networks?.instagram && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                      /* @__PURE__ */ jsx(Globe, { className: "size-4 text-pink-500" }),
                      " Instagram: ",
                      location.social_networks.instagram
                    ] }),
                    location.social_networks?.facebook && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                      /* @__PURE__ */ jsx(Globe, { className: "size-4 text-blue-600" }),
                      " Facebook: ",
                      location.social_networks.facebook
                    ] }),
                    location.social_networks?.tiktok && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                      /* @__PURE__ */ jsx(Globe, { className: "size-4 text-slate-800" }),
                      " TikTok: ",
                      location.social_networks.tiktok
                    ] }),
                    !location.social_networks?.instagram && !location.social_networks?.facebook && !location.social_networks?.tiktok && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground italic", children: "No configuradas" })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "bg-slate-50/50", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Navigation, { className: "size-5 text-primary" }),
                " Geocalización Exacta"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => navigateToMap("google"), className: "gap-2 h-8 text-xs font-bold", children: "Google Maps" }),
                /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => navigateToMap("waze"), className: "gap-2 h-8 text-xs font-bold", children: "Waze" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-0 h-[350px]", children: location.latitude && location.longitude ? /* @__PURE__ */ jsx(ManualMap, { position: [location.latitude, location.longitude], zoom: 15 }) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full bg-slate-50 text-muted-foreground italic", children: "Coordenadas no configuradas." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Clock, { className: "size-5 text-primary" }),
                " Horarios de Atención"
              ] }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Rangos configurados para esta sede." })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-0 px-6 pb-6", children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: DAYS.map((day) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2 border-b border-slate-50 last:border-0", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-600", children: day.label }),
              /* @__PURE__ */ jsx("div", { className: "text-right", children: (location.opening_hours?.[day.key] ?? []).length > 0 ? (location.opening_hours?.[day.key] ?? []).map((slot, idx) => /* @__PURE__ */ jsxs("div", { className: "text-xs font-medium text-slate-800", children: [
                slot.open,
                " - ",
                slot.close
              ] }, idx)) : /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] text-slate-400 border-slate-200", children: "Cerrado" }) })
            ] }, day.key)) }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "border-primary/20 bg-primary/2 px-2 py-4 flex flex-col items-center justify-center text-center gap-2", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "size-10 text-primary opacity-20" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-primary/40 leading-tight", children: "Módulo de Reservas y Disponibilidad próximamente." })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  Show as default
};
