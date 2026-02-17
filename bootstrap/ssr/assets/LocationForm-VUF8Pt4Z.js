import { jsxs, jsx } from "react/jsx-runtime";
import React__default, { useState, useEffect } from "react";
import { usePage, useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-B4HNlFNZ.js";
import { S as ScrollArea } from "./scroll-area-iVmBTZv4.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { c as cn } from "./utils-B0hQsrDj.js";
import { Info, Smartphone, MapPin, Clock, Video, MessageCircle, Globe, Search, Calendar, Copy, Plus, Trash2, X, Loader2, Save } from "lucide-react";
import { S as Separator } from "./separator-DbxqJzR0.js";
import L from "leaflet";
/* empty css                 */
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
function ManualMap({ position, setPosition, zoom = 13 }) {
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
    if (setPosition) {
      leafletMap.current.on("click", (e) => {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
      });
    }
    setTimeout(() => {
      leafletMap.current?.invalidateSize();
    }, 300);
    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, []);
  React__default.useEffect(() => {
    if (leafletMap.current && markerRef.current) {
      markerRef.current.setLatLng(position);
      leafletMap.current.flyTo(position, leafletMap.current.getZoom());
    }
  }, [position]);
  return /* @__PURE__ */ jsx("div", { ref: mapRef, className: "h-full w-full" });
}
function LocationForm({ location, onSuccess, onCancel }) {
  const { currentTenant } = usePage().props;
  const [mapPosition, setMapPosition] = useState(
    location?.latitude && location?.longitude ? [Number(location.latitude), Number(location.longitude)] : [4.6097, -74.0817]
    // Default Bogota
  );
  const [isSearching, setIsSearching] = useState(false);
  const { data, setData, post, patch, processing, errors, transform } = useForm({
    name: location?.name || "",
    manager: location?.manager || "",
    description: location?.description || "",
    is_main: location?.is_main || false,
    phone: location?.phone || "",
    whatsapp: location?.whatsapp || "",
    whatsapp_message: location?.whatsapp_message || "",
    state: location?.state || "",
    city: location?.city || "",
    address: location?.address || "",
    latitude: location?.latitude || 4.6097,
    longitude: location?.longitude || -74.0817,
    opening_hours: location?.opening_hours || {
      monday: [{ open: "08:00", close: "18:00" }],
      tuesday: [{ open: "08:00", close: "18:00" }],
      wednesday: [{ open: "08:00", close: "18:00" }],
      thursday: [{ open: "08:00", close: "18:00" }],
      friday: [{ open: "08:00", close: "18:00" }],
      saturday: [{ open: "08:00", close: "14:00" }],
      sunday: []
    },
    social_networks: location?.social_networks || {
      facebook: "",
      instagram: "",
      tiktok: ""
    },
    is_active: location?.is_active ?? true,
    short_video: null,
    remove_short: false
  });
  useEffect(() => {
    setData((d) => ({
      ...d,
      latitude: mapPosition[0],
      longitude: mapPosition[1]
    }));
  }, [mapPosition]);
  const searchAddress = async () => {
    if (!data.address || !data.city) return;
    setIsSearching(true);
    const query = `${data.address}, ${data.city}, ${data.state}, Colombia`;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        {
          headers: {
            "User-Agent": "LinkiuApp/1.0"
          }
        }
      );
      const results = await response.json();
      if (results && results.length > 0) {
        const { lat, lon } = results[0];
        const newPos = [parseFloat(lat), parseFloat(lon)];
        setMapPosition(newPos);
      }
    } catch (error) {
    } finally {
      setIsSearching(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (data.address && data.city) {
        searchAddress();
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [data.address, data.city, data.state]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (location) {
      patch(route("tenant.locations.update", [currentTenant?.slug, location.id]), {
        forceFormData: true,
        onSuccess: () => {
          toast.success("Sede actualizada");
          onSuccess();
        },
        onError: () => toast.error("Revisa los errores en el formulario.")
      });
    } else {
      post(route("tenant.locations.store", currentTenant?.slug), {
        onSuccess: () => {
          toast.success("Sede creada");
          onSuccess();
        }
      });
    }
  };
  const addTimeSlot = (day) => {
    const hours = { ...data.opening_hours };
    if (!hours[day]) hours[day] = [];
    hours[day].push({ open: "08:00", close: "18:00" });
    setData("opening_hours", hours);
  };
  const removeTimeSlot = (day, index) => {
    const hours = { ...data.opening_hours };
    hours[day].splice(index, 1);
    setData("opening_hours", hours);
  };
  const updateTimeSlot = (day, index, field, value) => {
    const hours = { ...data.opening_hours };
    hours[day][index][field] = value;
    setData("opening_hours", hours);
  };
  const replicateToAllDays = () => {
    const mondayHours = data.opening_hours.monday || [];
    const hours = { ...data.opening_hours };
    DAYS.forEach((day) => {
      if (day.key !== "monday") {
        hours[day.key] = JSON.parse(JSON.stringify(mondayHours));
      }
    });
    setData("opening_hours", hours);
    toast.success("Horarios replicados a todos los días");
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex-1 flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "general", className: "w-full", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: cn("grid w-full mb-8", location ? "grid-cols-5" : "grid-cols-4"), children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "general", className: "gap-2", children: [
          /* @__PURE__ */ jsx(Info, { className: "size-4" }),
          " General"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "contact", className: "gap-2", children: [
          /* @__PURE__ */ jsx(Smartphone, { className: "size-4" }),
          " Contacto"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "location", className: "gap-2", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "size-4" }),
          " Ubicación"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "hours", className: "gap-2", children: [
          /* @__PURE__ */ jsx(Clock, { className: "size-4" }),
          " Horarios"
        ] }),
        location && /* @__PURE__ */ jsxs(TabsTrigger, { value: "short", className: "gap-2", children: [
          /* @__PURE__ */ jsx(Video, { className: "size-4" }),
          " Short"
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "general", className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", className: "font-bold", children: "Nombre de la Sede" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "name",
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              placeholder: "Ej: Sede Norte / Principal / Local 101",
              className: "h-11",
              required: true
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-red-500", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "manager", className: "font-bold", children: "Encargado" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "manager",
              value: data.manager || "",
              onChange: (e) => setData("manager", e.target.value),
              placeholder: "Nombre de la persona responsable",
              className: "h-11"
            }
          ),
          errors.manager && /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-red-500", children: errors.manager })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "description", className: "font-bold", children: "Descripción Corta" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "description",
              value: data.description || "",
              onChange: (e) => setData("description", e.target.value),
              placeholder: "Breve detalle de la sede...",
              className: "min-h-[80px]"
            }
          ),
          errors.description && /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-red-500", children: errors.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-sm font-bold", children: "¿Es la sede principal?" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Solo puede haber una sede principal." }),
            data.is_main && location && /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-600 font-medium mt-1", children: "La sede principal anterior dejará de serlo." })
          ] }),
          /* @__PURE__ */ jsx(
            Switch,
            {
              checked: data.is_main,
              onCheckedChange: (val) => setData("is_main", val)
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "contact", className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "phone", className: "font-bold", children: "Teléfono Fijo/Celular" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Smartphone, { className: "absolute left-3 top-3 size-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "phone",
                  value: data.phone || "",
                  onChange: (e) => setData("phone", e.target.value),
                  className: "pl-10 h-11",
                  placeholder: "+57..."
                }
              )
            ] }),
            errors.phone && /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-red-500", children: errors.phone })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "whatsapp", className: "font-bold", children: "WhatsApp Operativo" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(MessageCircle, { className: "absolute left-3 top-3 size-4 text-green-600" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "whatsapp",
                  value: data.whatsapp || "",
                  onChange: (e) => setData("whatsapp", e.target.value),
                  className: "pl-10 h-11",
                  placeholder: "+57..."
                }
              )
            ] }),
            errors.whatsapp && /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-red-500", children: errors.whatsapp })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "wa_message", className: "font-bold text-xs uppercase tracking-wider text-slate-500", children: "Mensaje predeterminado de WhatsApp" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "wa_message",
              value: data.whatsapp_message || "",
              onChange: (e) => setData("whatsapp_message", e.target.value),
              placeholder: "Ej: Hola, quiero contactar con la sede norte...",
              className: "min-h-[60px]"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground italic", children: "Este mensaje aparecerá cuando el cliente haga clic en el botón de WhatsApp." })
        ] }),
        /* @__PURE__ */ jsx(Separator, { className: "my-4" }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
          /* @__PURE__ */ jsxs(Label, { className: "font-bold flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Globe, { className: "size-4 text-primary" }),
            " Redes Sociales (Opcional)"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "w-20 justify-center", children: "Facebook" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: data.social_networks.facebook,
                  onChange: (e) => setData("social_networks", { ...data.social_networks, facebook: e.target.value }),
                  placeholder: "URL perfil...",
                  className: "h-9"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "w-20 justify-center", children: "Instagram" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: data.social_networks.instagram,
                  onChange: (e) => setData("social_networks", { ...data.social_networks, instagram: e.target.value }),
                  placeholder: "@usuario...",
                  className: "h-9"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "w-20 justify-center", children: "TikTok" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: data.social_networks.tiktok,
                  onChange: (e) => setData("social_networks", { ...data.social_networks, tiktok: e.target.value }),
                  placeholder: "@usuario...",
                  className: "h-9"
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "location", className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { className: "font-bold", children: "Departamento / Estado" }),
            /* @__PURE__ */ jsx(Input, { value: data.state || "", onChange: (e) => setData("state", e.target.value), placeholder: "Ej: Antioquia", className: "h-11" }),
            errors.state && /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-red-500", children: errors.state })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { className: "font-bold", children: "Ciudad / Municipio" }),
            /* @__PURE__ */ jsx(Input, { value: data.city || "", onChange: (e) => setData("city", e.target.value), placeholder: "Ej: Medellín", className: "h-11" }),
            errors.city && /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-red-500", children: errors.city })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { className: "font-bold", children: "Dirección Completa" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(Input, { value: data.address || "", onChange: (e) => setData("address", e.target.value), placeholder: "Ej: Calle 10 # 43 - 50...", className: "h-11 flex-1" }),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: searchAddress,
                disabled: isSearching || !data.address,
                className: "h-11 px-3 border-dashed hover:border-primary hover:text-primary transition-all",
                title: "Buscar en el mapa",
                children: /* @__PURE__ */ jsx(Search, { className: cn("size-4", isSearching && "animate-spin") })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { className: "font-bold flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { children: "Puntero en el Mapa" }),
              isSearching && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-blue-50 text-blue-600 animate-pulse border-blue-100 py-0 h-5 text-[10px]", children: "Buscando ubicación..." })
            ] }),
            /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "font-normal text-[10px]", children: [
              "Lat: ",
              data.latitude?.toFixed(4),
              " Lng: ",
              data.longitude?.toFixed(4)
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-[250px] w-full rounded-xl overflow-hidden border shadow-inner bg-slate-50", children: /* @__PURE__ */ jsx(ManualMap, { position: mapPosition, setPosition: setMapPosition }) }),
          /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Info, { className: "size-3" }),
            " Haz clic en el mapa para ajustar la ubicación exacta para Waze y Google Maps."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "hours", className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3 mb-4", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "size-5 text-primary mt-0.5" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-800", children: "Horarios de Atención" }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500", children: 'Configura los rangos de apertura. Si un día no tiene rangos, aparecerá como "Cerrado".' })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: replicateToAllDays,
              className: "h-8 text-xs font-bold gap-1.5 border-dashed hover:border-primary hover:text-primary",
              title: "Copiar horario de Lunes a todos los días",
              children: [
                /* @__PURE__ */ jsx(Copy, { className: "size-3.5" }),
                "Replicar Lunes"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: DAYS.map((day) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(Label, { className: "font-bold text-sm min-w-[80px]", children: day.label }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                className: "h-7 text-xs text-primary hover:bg-primary/5 font-bold",
                onClick: () => addTimeSlot(day.key),
                children: [
                  /* @__PURE__ */ jsx(Plus, { className: "size-3 mr-1" }),
                  " Añadir Rango"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            data.opening_hours[day.key]?.map((slot, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "time",
                  value: slot.open,
                  onChange: (e) => updateTimeSlot(day.key, idx, "open", e.target.value),
                  className: "h-9 w-[120px] text-xs"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "a" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "time",
                  value: slot.close,
                  onChange: (e) => updateTimeSlot(day.key, idx, "close", e.target.value),
                  className: "h-9 w-[120px] text-xs"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50",
                  onClick: () => removeTimeSlot(day.key, idx),
                  children: /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" })
                }
              )
            ] }, idx)),
            (!data.opening_hours[day.key] || data.opening_hours[day.key].length === 0) && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground italic pl-1", children: "Cerrado" })
          ] }),
          /* @__PURE__ */ jsx(Separator, { className: "mt-2 opacity-50" })
        ] }, day.key)) })
      ] }),
      location && /* @__PURE__ */ jsx(TabsContent, { value: "short", className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-4 bg-slate-50 rounded-xl border border-slate-100", children: [
        /* @__PURE__ */ jsxs("h4", { className: "text-sm font-bold text-slate-800 flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx(Video, { className: "size-4 text-primary" }),
          " Short de la sede"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 mb-4", children: "Video vertical (máx 10 s) para el selector de sedes. MP4 o MOV, recomendado 1080×1920, máx 50 MB." }),
        location.short_embed_url && !data.remove_short && !data.short_video && /* @__PURE__ */ jsxs("div", { className: "space-y-2 mb-4", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs font-bold text-slate-600", children: "Vista previa" }),
          /* @__PURE__ */ jsx("div", { className: "aspect-[9/16] max-h-[320px] w-full max-w-[180px] rounded-xl overflow-hidden border bg-black", children: /* @__PURE__ */ jsx(
            "iframe",
            {
              title: "Short sede",
              src: location.short_embed_url + "?autoplay=false&preload=true",
              className: "w-full h-full",
              allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
              allowFullScreen: true
            }
          ) }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              className: "text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300",
              onClick: () => {
                setData("remove_short", true);
                setData("short_video", null);
              },
              children: [
                /* @__PURE__ */ jsx(Trash2, { className: "size-3.5 mr-1.5" }),
                " Quitar short"
              ]
            }
          )
        ] }),
        data.remove_short && /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-600 font-medium mb-2", children: "El short se eliminará al guardar." }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "short_video", className: "font-bold", children: "Subir nuevo short" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "short_video",
              type: "file",
              accept: "video/mp4,video/quicktime",
              className: "h-10 cursor-pointer",
              onChange: (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setData("short_video", file);
                  setData("remove_short", false);
                }
              }
            }
          ),
          data.short_video && /* @__PURE__ */ jsxs("p", { className: "text-xs text-green-600 font-medium", children: [
            data.short_video.name,
            " (se subirá al guardar)"
          ] }),
          errors.short_video && /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-red-500", children: errors.short_video })
        ] })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 border-t bg-slate-50/50 flex justify-between items-center gap-4", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "ghost",
          onClick: onCancel,
          className: "font-bold text-slate-600 cursor-pointer",
          children: [
            /* @__PURE__ */ jsx(X, { className: "mr-2 size-4" }),
            " Cancelar"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "submit",
          disabled: processing,
          className: "px-10 h-11 font-bold cursor-pointer",
          children: [
            processing ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 size-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "mr-2 size-4" }),
            location ? "Guardar Cambios" : "Crear Sede"
          ]
        }
      )
    ] })
  ] });
}
export {
  LocationForm as L
};
