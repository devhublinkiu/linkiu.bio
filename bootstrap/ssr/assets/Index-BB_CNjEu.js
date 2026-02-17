import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-C8hB-Nb-.js";
import { usePage, Head, useForm, router } from "@inertiajs/react";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { X, ChevronsUpDown, Search, Check, Store, CheckCircle2, MapPin, Truck, Building2, Globe, Loader2, Save, Trash2, Plus } from "lucide-react";
import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { P as PermissionDeniedModal } from "./dropdown-menu-B2I3vWlQ.js";
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { A as AlertDialog, h as AlertDialogTrigger, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { S as ScrollArea } from "./scroll-area-iVmBTZv4.js";
import { c as cn } from "./utils-B0hQsrDj.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-Bm8n8N8a.js";
import { E as Empty, a as EmptyHeader, e as EmptyMedia, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-rtCrEhXP.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-switch";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "vaul";
import "axios";
import "./sheet-BclLUCFD.js";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-select";
import "@radix-ui/react-scroll-area";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-popover";
function useColombiaApi() {
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  useEffect(() => {
    fetchDepartments();
  }, []);
  const fetchDepartments = async () => {
    setLoadingDepts(true);
    try {
      const response = await fetch("https://api-colombia.com/api/v1/Department");
      const data = await response.json();
      setDepartments(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoadingDepts(false);
    }
  };
  const fetchCities = async (departmentId) => {
    if (!departmentId) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    try {
      const response = await fetch(`https://api-colombia.com/api/v1/Department/${departmentId}/cities`);
      const data = await response.json();
      setCities(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };
  return {
    departments,
    cities,
    loadingDepts,
    loadingCities,
    fetchCities
  };
}
function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
  disabled = false
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const filteredOptions = options.filter(
    (option) => option.label.toLowerCase().includes(search.toLowerCase())
  );
  const handleSelect = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };
  const handleRemove = (value, e) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  };
  const selectedLabels = selected.map((value) => options.find((opt) => opt.value === value)).filter(Boolean);
  return /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        role: "combobox",
        "aria-expanded": open,
        className: cn(
          "w-full justify-between h-auto min-h-10 px-3 py-2 hover:bg-background",
          className
        ),
        disabled,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 items-center w-full", children: [
            selectedLabels.length > 0 ? selectedLabels.map((option) => /* @__PURE__ */ jsxs(
              Badge,
              {
                variant: "secondary",
                className: "mr-1 mb-1 font-normal",
                children: [
                  option.label,
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors",
                      onClick: (e) => handleRemove(option.value, e),
                      children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
                    }
                  )
                ]
              },
              option.value
            )) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground font-normal", children: placeholder }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 min-w-[5px]" })
          ] }),
          /* @__PURE__ */ jsx(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(PopoverContent, { className: "w-[--radix-popover-trigger-width] p-0", align: "start", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center border-b px-3", children: [
        /* @__PURE__ */ jsx(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            placeholder: "Buscar...",
            value: search,
            onChange: (e) => setSearch(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-h-64 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "p-1", children: filteredOptions.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-6 text-center text-sm text-muted-foreground", children: "No se encontraron resultados." }) : filteredOptions.map((option) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            selected.includes(option.value) && "bg-accent text-accent-foreground"
          ),
          onClick: () => handleSelect(option.value),
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                  selected.includes(option.value) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                ),
                children: /* @__PURE__ */ jsx(Check, { className: cn("h-4 w-4") })
              }
            ),
            /* @__PURE__ */ jsx("span", { children: option.label })
          ]
        },
        option.value
      )) }) }),
      selected.length > 0 && /* @__PURE__ */ jsx("div", { className: "p-2 border-t", children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          className: "w-full h-8 text-xs justify-center",
          onClick: () => onChange([]),
          children: "Limpiar Selección"
        }
      ) })
    ] })
  ] });
}
function Index({ tenant, shippingMethods, tenantCity, tenantState, locations = [], userLocationId }) {
  const { currentUserRole } = usePage().props;
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const hasPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner === true || currentUserRole.permissions?.includes("*") === true || currentUserRole.permissions?.includes(permission) === true;
  };
  const handleProtectedAction = (e, permission, callback) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!hasPermission(permission)) {
      setShowPermissionModal(true);
    } else {
      callback();
    }
  };
  const getMethod = (type) => shippingMethods.find((m) => m.type === type);
  const pickupMethod = getMethod("pickup");
  const localMethod = getMethod("local");
  const nationalMethod = getMethod("national");
  const localDisplayCity = localMethod?.location?.city ?? tenantCity;
  const localDisplayState = localMethod?.location?.state ?? tenantState;
  const localCityLabel = [localDisplayCity, localDisplayState].filter(Boolean).join(", ") || "No configurada";
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Configuración de Envíos", children: [
    /* @__PURE__ */ jsx(Head, { title: "Envíos - Linkiu.Bio" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto py-8 text-slate-900", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-black text-slate-900 tracking-tight", children: "Métodos de Envío" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 font-medium", children: "Configura cómo tus clientes reciben sus pedidos." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx(
            ShippingCard,
            {
              tenant,
              method: pickupMethod,
              title: "Retiro en Tienda",
              description: "El cliente pasa a recoger su pedido.",
              icon: /* @__PURE__ */ jsx(Store, { className: "w-6 h-6" }),
              colorClass: "bg-orange-100 text-orange-600",
              borderColorClass: "border-orange-500/50",
              handleProtectedAction,
              locations,
              children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600 font-medium", children: [
                  "Esta opción siempre es ",
                  /* @__PURE__ */ jsx("strong", { children: "Gratis" }),
                  " para el cliente."
                ] }),
                /* @__PURE__ */ jsx(MethodSettingsForm, { tenant, method: pickupMethod, type: "pickup", locations, handleProtectedAction })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            ShippingCard,
            {
              tenant,
              method: localMethod,
              title: "Domicilio Local",
              description: `Entregas en tu ciudad (${localCityLabel}).`,
              icon: /* @__PURE__ */ jsx(MapPin, { className: "w-6 h-6" }),
              colorClass: "bg-blue-100 text-blue-600",
              borderColorClass: "border-blue-500/50",
              handleProtectedAction,
              locations,
              children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                !localDisplayCity && /* @__PURE__ */ jsx("div", { className: "p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-100", children: "⚠️ Asigna una sede con ciudad configurada o configura la ciudad del negocio para que esto funcione." }),
                localDisplayCity && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100 font-medium", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4" }),
                  "Funciona para clientes en ",
                  /* @__PURE__ */ jsx("strong", { children: localCityLabel }),
                  "."
                ] }),
                /* @__PURE__ */ jsx(MethodSettingsForm, { tenant, method: localMethod, type: "local", locations, handleProtectedAction })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsx(
          ShippingCard,
          {
            tenant,
            method: nationalMethod,
            title: "Despachos Nacionales",
            description: "Envíos por transportadora a otras ciudades.",
            icon: /* @__PURE__ */ jsx(Truck, { className: "w-6 h-6" }),
            colorClass: "bg-purple-100 text-purple-600",
            borderColorClass: "border-purple-500/50",
            handleProtectedAction,
            locations,
            children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsx(MethodSettingsForm, { tenant, method: nationalMethod, type: "national", locations, handleProtectedAction }),
              nationalMethod?.is_active && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("div", { className: "h-px bg-slate-100 my-4" }),
                /* @__PURE__ */ jsx(ZonesManager, { tenant, method: nationalMethod, handleProtectedAction })
              ] })
            ] })
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx(
        PermissionDeniedModal,
        {
          open: showPermissionModal,
          onOpenChange: setShowPermissionModal
        }
      )
    ] })
  ] });
}
function ShippingCard({
  tenant,
  method,
  title,
  description,
  icon,
  colorClass,
  borderColorClass,
  children,
  handleProtectedAction,
  locations
}) {
  const handleToggle = (checked) => {
    if (!method) return;
    handleProtectedAction(null, "shipping_zones.update", () => {
      router.put(route("tenant.shipping.update", { tenant: tenant.slug, method: method.id }), {
        is_active: checked
      }, {
        preserveScroll: true,
        onSuccess: () => toast.success(checked ? "Método activado" : "Método desactivado")
      });
    });
  };
  return /* @__PURE__ */ jsxs(Card, { className: `border-2 transition-all ${method?.is_active ? borderColorClass + " shadow-lg shadow-purple-500/5" : "border-slate-100"}`, children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
        /* @__PURE__ */ jsx("div", { className: `p-2.5 rounded-xl ${colorClass}`, children: icon }),
        /* @__PURE__ */ jsx(
          Switch,
          {
            checked: method?.is_active,
            onCheckedChange: handleToggle,
            disabled: !method
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-4", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "m-0", children: title }),
        method?.location ? /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px] h-4 border-primary/20 bg-primary/5 text-primary gap-1", children: [
          /* @__PURE__ */ jsx(Building2, { className: "w-2.5 h-2.5" }),
          method.location.name
        ] }) : /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-[10px] h-4 gap-1", children: [
          /* @__PURE__ */ jsx(Globe, { className: "w-2.5 h-2.5" }),
          "Global"
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardDescription, { children: description })
    ] }),
    method?.is_active && /* @__PURE__ */ jsx(CardContent, { children })
  ] });
}
function MethodSettingsForm({
  tenant,
  method,
  type,
  locations = [],
  handleProtectedAction
}) {
  const { data, setData, put, processing, isDirty } = useForm({
    cost: method?.cost ?? 0,
    free_shipping_min_amount: method?.free_shipping_min_amount ?? "",
    delivery_time: method?.delivery_time ?? "",
    instructions: method?.instructions ?? "",
    settings: method?.settings ?? {},
    location_id: method?.location_id ?? "all"
  });
  if (!method) return null;
  const submit = (e) => {
    e.preventDefault();
    handleProtectedAction(null, "shipping_zones.update", () => {
      put(route("tenant.shipping.update", { tenant: tenant.slug, method: method.id }), {
        onSuccess: () => toast.success("Configuración guardada")
      });
    });
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { className: "text-xs font-bold text-slate-500 uppercase", children: "Sede Responsable" }),
      /* @__PURE__ */ jsxs(Select, { value: data.location_id?.toString(), onValueChange: (v) => setData("location_id", v === "all" ? "all" : v), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "bg-white border-slate-200 h-9", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Todas las sedes (Global)" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las sedes (Global)" }),
          locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: loc.id.toString(), children: loc.name }, loc.id))
        ] })
      ] })
    ] }),
    type !== "pickup" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-xs font-bold text-slate-500 uppercase", children: "Costo de Envío" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-2.5 text-slate-500 text-sm", children: "$" }),
          /* @__PURE__ */ jsx(
            CurrencyInput,
            {
              className: "pl-6",
              value: data.cost,
              onChange: (val) => setData("cost", val === "" ? 0 : val)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-xs font-bold text-slate-500 uppercase", children: "Gratis a partir de" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-2.5 text-slate-500 text-sm", children: "$" }),
          /* @__PURE__ */ jsx(
            CurrencyInput,
            {
              className: "pl-6",
              placeholder: "0",
              value: data.free_shipping_min_amount === "" || data.free_shipping_min_amount == null ? "" : Number(data.free_shipping_min_amount),
              onChange: (val) => setData("free_shipping_min_amount", val === "" ? "" : val)
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { className: "text-xs font-bold text-slate-500 uppercase", children: type === "pickup" ? "Tiempo de Preparación" : "Tiempo de Entrega" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          placeholder: type === "pickup" ? "Ej: Listo en 2 horas" : "Ej: 1-3 días hábiles",
          value: type === "pickup" ? data.settings?.prep_time || "" : data.delivery_time,
          onChange: (e) => {
            if (type === "pickup") {
              setData("settings", { ...data.settings, prep_time: e.target.value });
            } else {
              setData("delivery_time", e.target.value);
            }
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { className: "text-xs font-bold text-slate-500 uppercase", children: "Instrucciones para el cliente" }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          placeholder: "Ej: Te enviaremos el número de guía por WhatsApp.",
          className: "resize-none h-20",
          value: data.instructions,
          onChange: (e) => setData("instructions", e.target.value)
        }
      )
    ] }),
    isDirty && /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsxs(Button, { type: "submit", size: "sm", disabled: processing, className: "gap-2 bg-slate-900 hover:bg-slate-800", children: [
      processing ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
      "Guardar Cambios"
    ] }) })
  ] });
}
function ZonesManager({
  tenant,
  method,
  handleProtectedAction
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState(null);
  const [isSubmittingZones, setIsSubmittingZones] = useState(false);
  const handleDeleteZone = (zoneId) => {
    if (!zoneId) return;
    handleProtectedAction(null, "shipping_zones.update", () => {
      const newZones = (method.zones || []).filter((z) => z.id !== zoneId);
      router.post(route("tenant.shipping.zones.update", { tenant: tenant.slug, method: method.id }), {
        zones: newZones
      }, {
        preserveScroll: true,
        onStart: () => setIsSubmittingZones(true),
        onFinish: () => setIsSubmittingZones(false),
        onSuccess: () => {
          toast.success("Zona eliminada");
          setZoneToDelete(null);
        }
      });
    });
  };
  const groupedZones = useMemo(() => {
    const groups = {};
    if (!method.zones) return {};
    method.zones.forEach((zone) => {
      const deptCode = zone.department_code;
      if (!groups[deptCode]) {
        groups[deptCode] = {
          id: deptCode,
          name: zone.department_name,
          zones: []
        };
      }
      groups[deptCode].zones.push(zone);
    });
    return groups;
  }, [method.zones]);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxs("h3", { className: "font-bold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2", children: [
        "Zonas de Cobertura (",
        method.zones?.length || 0,
        ")",
        isSubmittingZones && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin text-slate-400" })
      ] }),
      /* @__PURE__ */ jsx(
        AddZoneModal,
        {
          tenant,
          method,
          isOpen: isDialogOpen,
          setIsOpen: setIsDialogOpen,
          handleProtectedAction
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      Object.values(groupedZones).map((group) => {
        const fullDeptZone = group.zones.find((z) => !z.city_code);
        return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-slate-300 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxs("h4", { className: "font-bold text-sm text-slate-700 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-slate-400" }),
              group.name
            ] }),
            fullDeptZone && /* @__PURE__ */ jsxs(AlertDialog, { children: [
              /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }) }) }),
              /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
                /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
                  /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar todo el departamento?" }),
                  /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
                    "Esta acción eliminará la cobertura para todo el departamento de ",
                    group.name,
                    "."
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
                  /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
                  /* @__PURE__ */ jsx(AlertDialogAction, { variant: "destructive", onClick: () => fullDeptZone.id != null && handleDeleteZone(fullDeptZone.id), children: "Eliminar" })
                ] })
              ] })
            ] })
          ] }),
          fullDeptZone ? /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 flex items-center justify-between gap-2 py-1 px-3", children: [
            /* @__PURE__ */ jsx("span", { children: "Todo el departamento" }),
            fullDeptZone.price && /* @__PURE__ */ jsxs("span", { className: "font-black text-blue-800", children: [
              "$",
              new Intl.NumberFormat("es-CO").format(fullDeptZone.price)
            ] })
          ] }) : /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: group.zones.map((zone) => /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-xs font-medium gap-1 pr-1 pl-3 py-1 bg-slate-50 flex items-center border-slate-200", children: [
            zone.city_name,
            zone.price != null && /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900 ml-1 border-l border-slate-200 pl-2", children: [
              "$",
              new Intl.NumberFormat("es-CO").format(zone.price)
            ] }),
            /* @__PURE__ */ jsxs(AlertDialog, { open: zoneToDelete === zone.id, onOpenChange: (open) => !open && setZoneToDelete(null), children: [
              /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  className: "h-4 w-4 hover:bg-slate-200 rounded-full ml-1 text-slate-400 hover:text-red-600",
                  onClick: () => zone.id != null && setZoneToDelete(zone.id),
                  children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
                }
              ) }),
              /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
                /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
                  /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar esta ciudad?" }),
                  /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
                    "Se quitará ",
                    zone.city_name,
                    " de la cobertura de envío."
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
                  /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
                  /* @__PURE__ */ jsx(AlertDialogAction, { variant: "destructive", onClick: () => zone.id != null && handleDeleteZone(zone.id), children: "Eliminar" })
                ] })
              ] })
            ] })
          ] }, zone.id)) })
        ] }, group.id);
      }),
      (!method.zones || method.zones.length === 0) && /* @__PURE__ */ jsx(Empty, { className: "border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50", children: /* @__PURE__ */ jsxs(EmptyHeader, { children: [
        /* @__PURE__ */ jsx(EmptyMedia, { variant: "icon", children: /* @__PURE__ */ jsx(MapPin, { className: "size-8 text-slate-400" }) }),
        /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay zonas de cobertura" }),
        /* @__PURE__ */ jsx(EmptyDescription, { children: 'Usa el botón "Nueva Zona" para agregar departamentos o ciudades.' })
      ] }) })
    ] })
  ] });
}
function AddZoneModal({
  tenant,
  method,
  isOpen,
  setIsOpen,
  handleProtectedAction
}) {
  const { departments, cities, fetchCities, loadingDepts } = useColombiaApi();
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectAllCities, setSelectAllCities] = useState(false);
  const [price, setPrice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (selectedDept) {
      fetchCities(selectedDept.id);
      setSelectedCities([]);
      setSelectAllCities(false);
      setPrice("");
    }
  }, [selectedDept]);
  const handleSave = () => {
    handleProtectedAction(null, "shipping_zones.update", () => {
      if (!selectedDept) return;
      const currentZones = method.zones || [];
      const newZones = [];
      const zonePrice = price === "" ? null : price;
      if (selectAllCities) {
        const exists = currentZones.some(
          (z) => z.department_code === String(selectedDept.id) && z.city_code === null
        );
        if (!exists) {
          newZones.push({
            department_code: String(selectedDept.id),
            department_name: selectedDept.name,
            city_code: null,
            city_name: null,
            price: zonePrice
          });
        }
      } else {
        selectedCities.forEach((city) => {
          const exists = currentZones.some(
            (z) => z.department_code === String(selectedDept.id) && z.city_code === String(city.id)
          );
          if (!exists) {
            newZones.push({
              department_code: String(selectedDept.id),
              department_name: selectedDept.name,
              city_code: String(city.id),
              city_name: city.name,
              price: zonePrice
            });
          }
        });
      }
      if (newZones.length === 0) {
        toast.error("Las zonas seleccionadas ya existen.");
        return;
      }
      const newZonesList = [...currentZones, ...newZones];
      router.post(route("tenant.shipping.zones.update", { tenant: tenant.slug, method: method.id }), {
        zones: newZonesList
      }, {
        preserveScroll: true,
        onStart: () => setIsSaving(true),
        onFinish: () => setIsSaving(false),
        onSuccess: () => {
          toast.success(`${newZones.length} zona(s) agregada(s)`);
          setIsOpen(false);
          setSelectedDept(null);
          setSelectedCities([]);
          setSelectAllCities(false);
          setPrice("");
        }
      });
    });
  };
  return /* @__PURE__ */ jsxs(Dialog, { open: isOpen, onOpenChange: (open) => handleProtectedAction(null, "shipping_zones.create", () => setIsOpen(open)), children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", className: "h-8 text-xs gap-1 border-dashed font-bold", children: [
      /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
      " Nueva Zona"
    ] }) }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "w-[calc(100vw-2rem)] max-w-[425px] max-h-[90vh] overflow-y-auto sm:w-full", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "font-black text-xl", children: "Agregar Cobertura" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Selecciona los destinos nacionales permitidos." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs font-bold uppercase text-slate-500", children: "Departamento" }),
          /* @__PURE__ */ jsxs(Select, { onValueChange: (val) => {
            const dept = departments.find((d) => String(d.id) === val);
            setSelectedDept(dept || null);
          }, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: loadingDepts ? "Cargando..." : "Selecciona Departamento" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsx(ScrollArea, { className: "h-[200px]", children: departments.map((dept) => /* @__PURE__ */ jsx(SelectItem, { value: String(dept.id), children: dept.name }, dept.id)) }) })
          ] })
        ] }),
        selectedDept && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxs(Label, { className: "text-xs font-bold uppercase text-slate-500", children: [
              "Ciudades (",
              selectAllCities ? "Todas" : selectedCities.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(
                Switch,
                {
                  id: "select-all-mode",
                  checked: selectAllCities,
                  onCheckedChange: (checked) => {
                    setSelectAllCities(checked);
                    if (checked) setSelectedCities([]);
                  }
                }
              ),
              /* @__PURE__ */ jsx(Label, { htmlFor: "select-all-mode", className: "text-xs font-normal text-slate-500", children: "Todo el departamento" })
            ] })
          ] }),
          !selectAllCities && /* @__PURE__ */ jsx(
            MultiSelect,
            {
              options: cities.map((c) => ({ label: c.name, value: String(c.id) })),
              selected: selectedCities.map((c) => String(c.id)),
              onChange: (vals) => {
                const newSelected = vals.map((id) => cities.find((c) => String(c.id) === id)).filter(Boolean);
                setSelectedCities(newSelected);
              },
              placeholder: "Seleccionar ciudades...",
              className: "w-full"
            }
          ),
          selectAllCities && /* @__PURE__ */ jsxs("div", { className: "p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 text-center font-medium", children: [
            "Aplicar a ",
            /* @__PURE__ */ jsxs("strong", { children: [
              "todo (",
              selectedDept.name,
              ")"
            ] }),
            "."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs font-bold uppercase text-slate-500", children: "Costo Especial (Opcional)" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-400", children: "$" }),
              /* @__PURE__ */ jsx(
                CurrencyInput,
                {
                  placeholder: `Tarifa base: $${new Intl.NumberFormat("es-CO").format(method.cost)}`,
                  value: price,
                  onChange: setPrice,
                  className: "h-10"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 mt-1.5 leading-relaxed", children: "Si lo dejas vacío, se cobrará el costo base configurado en el método." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsxs(Button, { onClick: handleSave, disabled: !selectedDept || !selectAllCities && selectedCities.length === 0 || isSaving, className: "w-full sm:w-auto bg-slate-900 gap-2", children: [
        isSaving ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : null,
        "Agregar ",
        selectAllCities ? "Todo el Depto" : `${selectedCities.length} Zona(s)`
      ] }) })
    ] })
  ] });
}
function CurrencyInput({
  value,
  onChange,
  className,
  placeholder,
  ...props
}) {
  const format = (val) => {
    if (val === "" || val === null || val === void 0) return "";
    const numberVal = Number(val);
    if (isNaN(numberVal)) return "";
    return new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(numberVal);
  };
  const handleChange = (e) => {
    let raw = e.target.value;
    if (raw.includes(",")) raw = raw.split(",")[0];
    raw = raw.replace(/\./g, "");
    if (raw === "") {
      onChange("");
      return;
    }
    if (isNaN(Number(raw))) return;
    onChange(Number(raw));
  };
  return /* @__PURE__ */ jsx(
    Input,
    {
      type: "text",
      className,
      placeholder,
      value: format(value),
      onChange: handleChange
    }
  );
}
export {
  Index as default
};
