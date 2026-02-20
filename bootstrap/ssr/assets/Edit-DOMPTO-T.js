import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { S as SuperAdminLayout } from "./SuperAdminLayout-BMVUVnkF.js";
import { useForm, Head, Link, router } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { S as Separator } from "./separator-DbxqJzR0.js";
import { ArrowLeft, Calculator, Trash2, Plus } from "lucide-react";
import { C as Checkbox } from "./checkbox-dJXZmgY3.js";
import { F as FieldError } from "./field-BEfz_npx.js";
import { M as MediaInput } from "./MediaInput-Pg9PVA48.js";
import { V as VERTICAL_CONFIG, M as MODULE_HAS_LIMIT, a as MODULE_LABELS, b as LIMIT_BACKEND_KEY_TO_FORM, L as LIMIT_FORM_KEY_TO_BACKEND } from "./menuConfig-rtCrEhXP.js";
import "./dropdown-menu-Dkgv2tnp.js";
import "@radix-ui/react-slot";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "vaul";
import "axios";
import "sonner";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./ApplicationLogo-xMpxFOcX.js";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-switch";
import "@radix-ui/react-separator";
import "@radix-ui/react-checkbox";
import "./MediaManagerModal-D8ddokO_.js";
import "./scroll-area-iVmBTZv4.js";
import "@radix-ui/react-scroll-area";
import "./alert-dialog-Dk6SFJ_Z.js";
import "@radix-ui/react-alert-dialog";
import "./empty-CTOMHEXK.js";
function Edit({ plan, verticals }) {
  const { data, setData, post, processing, errors } = useForm({
    _method: "PUT",
    name: plan.name,
    slug: plan.slug,
    vertical_id: plan.vertical_id.toString(),
    description: plan.description || "",
    monthly_price: plan.monthly_price.toString(),
    currency: plan.currency,
    quarterly_discount_percent: plan.quarterly_discount_percent,
    semiannual_discount_percent: plan.semiannual_discount_percent,
    yearly_discount_percent: plan.yearly_discount_percent,
    trial_days: plan.trial_days,
    no_initial_payment_required: !!plan.no_initial_payment_required,
    support_level: plan.support_level,
    allow_custom_slug: !!plan.allow_custom_slug,
    is_public: !!plan.is_public,
    is_featured: !!plan.is_featured,
    highlight_text: plan.highlight_text || "",
    sort_order: plan.sort_order,
    features: plan.features?.filter((f) => typeof f === "string") || [""],
    cover: null,
    cover_path: plan.cover_path || "",
    // Initialize with existing path
    cover_preview: plan.cover_url
  });
  const initialModuleConfig = (() => {
    const configObj = plan.features?.find((f) => typeof f === "object" && !Array.isArray(f) && f !== null) || {};
    const vertical = verticals.find((v) => v.id.toString() === plan.vertical_id.toString());
    if (vertical) {
      const slug = vertical.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const configKey = Object.keys(VERTICAL_CONFIG).find((k) => k === slug) || "default";
      const allowedModules = VERTICAL_CONFIG[configKey] || [];
      const filtered = {};
      allowedModules.forEach((m) => {
        filtered[m] = configObj.hasOwnProperty(m) ? configObj[m] : true;
      });
      return filtered;
    }
    return {};
  })();
  const [moduleConfig, setModuleConfig] = useState(initialModuleConfig);
  const initialLimitsConfig = (() => {
    if (!plan.limits) return {};
    const result = {};
    Object.entries(plan.limits).forEach(([key, val]) => {
      const formKey = LIMIT_BACKEND_KEY_TO_FORM[key] ?? key;
      result[formKey] = val.toString();
    });
    return result;
  })();
  const [limitsConfig, setLimitsConfig] = useState(initialLimitsConfig);
  useEffect(() => {
    const vertical = verticals.find((v) => v.id.toString() === data.vertical_id);
    if (vertical) {
      const slug = vertical.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const configKey = Object.keys(VERTICAL_CONFIG).find((k) => k === slug) || "default";
      const allowedModules = VERTICAL_CONFIG[configKey] || [];
      const isOriginalVertical = data.vertical_id === plan.vertical_id.toString();
      const baseConfig = isOriginalVertical ? plan.features?.find((f) => typeof f === "object" && !Array.isArray(f) && f !== null) || {} : {};
      const newConfig = {};
      allowedModules.forEach((m) => {
        newConfig[m] = baseConfig.hasOwnProperty(m) ? baseConfig[m] : true;
      });
      setModuleConfig(newConfig);
    }
  }, [data.vertical_id]);
  const handleModuleToggle = (key, enabled) => {
    setModuleConfig((prev) => ({ ...prev, [key]: enabled }));
  };
  const handleLimitChange = (key, value) => {
    setLimitsConfig((prev) => ({ ...prev, [key]: value }));
  };
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...data.features];
    newFeatures[index] = value;
    setData("features", newFeatures);
  };
  const addFeature = () => {
    setData("features", [...data.features, ""]);
  };
  const removeFeature = (index) => {
    const newFeatures = data.features.filter((_, i) => i !== index);
    setData("features", newFeatures);
  };
  const calculateTotal = (months, discount) => {
    const price = parseFloat(data.monthly_price) || 0;
    const total = price * months;
    const final = total * (1 - discount / 100);
    return final;
  };
  const submit = (e) => {
    e.preventDefault();
    const cleanFeatures = data.features.filter((f) => typeof f === "string" && f.trim() !== "");
    const finalFeatures = [
      ...cleanFeatures,
      moduleConfig
    ];
    const finalLimits = {};
    Object.entries(limitsConfig).forEach(([key, val]) => {
      const num = parseInt(val);
      if (!isNaN(num) && num > 0) {
        const backendKey = LIMIT_FORM_KEY_TO_BACKEND[key] ?? key;
        finalLimits[backendKey] = num;
      }
    });
    router.post(route("plans.update", plan.id), {
      ...data,
      _method: "PUT",
      features: finalFeatures,
      limits: Object.keys(finalLimits).length > 0 ? finalLimits : null
    });
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: `Editar Plan: ${plan.name}`, children: [
    /* @__PURE__ */ jsx(Head, { title: "Editar Plan" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto py-6", children: [
      /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "mb-4 pl-0 hover:bg-transparent", asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: route("plans.index"), className: "flex items-center gap-2 text-muted-foreground hover:text-gray-900", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        "Volver al listado"
      ] }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-8", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Información Básica" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Detalles principales del plan y su vertical asociada." })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "grid gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "vertical", children: "Vertical de Negocio" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: data.vertical_id,
                    onValueChange: (value) => setData("vertical_id", value),
                    children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona una vertical" }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: verticals.map((vertical) => /* @__PURE__ */ jsx(SelectItem, { value: vertical.id.toString(), children: vertical.name }, vertical.id)) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(FieldError, { children: errors.vertical_id })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "currency", children: "Moneda" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: data.currency,
                    onValueChange: (value) => setData("currency", value),
                    children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Moneda" }) }),
                      /* @__PURE__ */ jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsx(SelectItem, { value: "COP", children: "Peso Colombiano (COP)" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "USD", children: "Dólar Americano (USD)" })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(FieldError, { children: errors.currency })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre del Plan" }),
                /* @__PURE__ */ jsx(Input, { id: "name", value: data.name, onChange: (e) => setData("name", e.target.value), required: true }),
                /* @__PURE__ */ jsx(FieldError, { children: errors.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "slug", children: "Slug (URL amigable)" }),
                /* @__PURE__ */ jsx(Input, { id: "slug", value: data.slug, onChange: (e) => setData("slug", e.target.value), required: true }),
                /* @__PURE__ */ jsx(FieldError, { children: errors.slug })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "description", children: "Descripción Corta" }),
              /* @__PURE__ */ jsx(Textarea, { id: "description", value: data.description, onChange: (e) => setData("description", e.target.value) }),
              /* @__PURE__ */ jsx(FieldError, { children: errors.description })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsx(Label, { children: "Imagen de Portada / Icono" }),
              /* @__PURE__ */ jsx(
                MediaInput,
                {
                  value: data.cover_preview,
                  onChange: (url, file) => {
                    if (url) {
                      setData((prev) => ({
                        ...prev,
                        cover_preview: url,
                        cover_path: file?.path || ""
                      }));
                    } else {
                      setData((prev) => ({
                        ...prev,
                        cover_preview: null,
                        cover_path: ""
                      }));
                    }
                  },
                  error: errors.cover
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground mt-1", children: "Recomendado: 800x600px o Icono SVG." }),
              /* @__PURE__ */ jsx(FieldError, { children: errors.cover })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Calculator, { className: "h-5 w-5 text-blue-600" }),
              /* @__PURE__ */ jsx(CardTitle, { children: "Motor de Precios" })
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Define el precio base mensual y los descuentos por permanencia." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { className: "space-y-8", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8 items-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-6 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "monthly_price", className: "text-base font-semibold text-blue-900", children: "Precio Base Mensual" }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1 relative", children: [
                /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-2.5 font-bold text-gray-500", children: "$" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "monthly_price",
                    type: "number",
                    min: "0",
                    step: "0.01",
                    className: "pl-8 text-lg font-bold",
                    placeholder: "0.00",
                    value: data.monthly_price,
                    onChange: (e) => setData("monthly_price", e.target.value),
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-600/80 mt-1", children: "Este es el precio que pagará el usuario si elige facturación mes a mes." }),
              /* @__PURE__ */ jsx(FieldError, { children: errors.monthly_price })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-gray-900 text-sm uppercase tracking-wide", children: "Descuentos por Periodo" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "w-40 flex-shrink-0 flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "quarterly", className: "text-xs text-gray-500 uppercase", children: "Trimestral (-%)" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative mt-0.5", children: [
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "quarterly",
                        type: "number",
                        min: "0",
                        max: "100",
                        value: data.quarterly_discount_percent,
                        onChange: (e) => setData("quarterly_discount_percent", parseInt(e.target.value) || 0)
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "absolute right-3 top-2.5 text-xs font-bold text-gray-400", children: "%" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 pt-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-[0.7rem] text-gray-500 uppercase tracking-tight", children: "Precio Final / periodo" }),
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-green-700 text-lg", children: new Intl.NumberFormat("es-CO", { style: "currency", currency: data.currency }).format(calculateTotal(3, data.quarterly_discount_percent)) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "w-40 flex-shrink-0 flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "semiannual", className: "text-xs text-gray-500 uppercase", children: "Semestral (-%)" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative mt-0.5", children: [
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "semiannual",
                        type: "number",
                        min: "0",
                        max: "100",
                        value: data.semiannual_discount_percent,
                        onChange: (e) => setData("semiannual_discount_percent", parseInt(e.target.value) || 0)
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "absolute right-3 top-2.5 text-xs font-bold text-gray-400", children: "%" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 pt-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-[0.7rem] text-gray-500 uppercase tracking-tight", children: "Precio Final / periodo" }),
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-green-700 text-lg", children: new Intl.NumberFormat("es-CO", { style: "currency", currency: data.currency }).format(calculateTotal(6, data.semiannual_discount_percent)) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "w-40 flex-shrink-0 flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "yearly", className: "text-xs text-gray-500 uppercase", children: "Anual (-%)" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative mt-0.5", children: [
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "yearly",
                        type: "number",
                        min: "0",
                        max: "100",
                        value: data.yearly_discount_percent,
                        onChange: (e) => setData("yearly_discount_percent", parseInt(e.target.value) || 0)
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "absolute right-3 top-2.5 text-xs font-bold text-gray-400", children: "%" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 pt-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-[0.7rem] text-gray-500 uppercase tracking-tight", children: "Precio Final / periodo" }),
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-green-700 text-lg", children: new Intl.NumberFormat("es-CO", { style: "currency", currency: data.currency }).format(calculateTotal(12, data.yearly_discount_percent)) })
                ] })
              ] })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsxs(Card, { className: "h-full", children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "Características (Features)" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Lista de beneficios que verá el usuario." })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
              data.features.map((feature, index) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: feature,
                    onChange: (e) => handleFeatureChange(index, e.target.value),
                    placeholder: `Característica #${index + 1}`
                  }
                ),
                /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => removeFeature(index), disabled: data.features.length === 1, children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-400" }) })
              ] }, index)),
              /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: addFeature, className: "w-full border-dashed", children: [
                /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
                " Agregar Característica"
              ] }),
              /* @__PURE__ */ jsx(FieldError, { children: errors.features })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Configuración" }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsx(Label, { children: "Días de Prueba Gratis" }),
                /* @__PURE__ */ jsx(Input, { type: "number", min: "0", value: data.trial_days, onChange: (e) => setData("trial_days", parseInt(e.target.value) || 0) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border p-3 rounded-lg", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "no-payment", className: "text-sm cursor-pointer", children: "Sin Tarjeta Requerida" }),
                /* @__PURE__ */ jsx(
                  Switch,
                  {
                    id: "no-payment",
                    checked: data.no_initial_payment_required,
                    onCheckedChange: (c) => setData("no_initial_payment_required", c)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsx(Label, { children: "Nivel de Soporte" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: data.support_level,
                    onValueChange: (value) => setData("support_level", value),
                    children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                      /* @__PURE__ */ jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsx(SelectItem, { value: "basic", children: "Básico (Email)" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "priority", children: "Prioritario (24h)" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "dedicated", children: "Dedicado (WhatsApp)" })
                      ] })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(Separator, {}),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx(Label, { className: "cursor-pointer", htmlFor: "public", children: "Público" }),
                /* @__PURE__ */ jsx(Switch, { id: "public", checked: data.is_public, onCheckedChange: (c) => setData("is_public", c) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx(Label, { className: "cursor-pointer", htmlFor: "featured", children: "Plan Destacado" }),
                /* @__PURE__ */ jsx(Switch, { id: "featured", checked: data.is_featured, onCheckedChange: (c) => setData("is_featured", c) })
              ] }),
              data.is_featured && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5 pt-2 animate-in fade-in slide-in-from-top-1", children: [
                /* @__PURE__ */ jsx(Label, { children: "Texto Destacado" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: data.highlight_text,
                    onChange: (e) => setData("highlight_text", e.target.value),
                    placeholder: "Ej. Más Popular"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx(Label, { className: "cursor-pointer", htmlFor: "custom-slug", children: "Slug Personalizado" }),
                /* @__PURE__ */ jsx(Switch, { id: "custom-slug", checked: data.allow_custom_slug, onCheckedChange: (c) => setData("allow_custom_slug", c) })
              ] })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Permisos de Módulos" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Define qué módulos del sidebar estarán activos para este plan y sus límites." })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: Object.keys(moduleConfig).length > 0 ? Object.entries(moduleConfig).map(([key, enabled]) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border p-3 rounded-lg hover:bg-slate-50 transition-colors", children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  id: `mod-${key}`,
                  checked: enabled,
                  onCheckedChange: (c) => handleModuleToggle(key, c)
                }
              ),
              /* @__PURE__ */ jsx(Label, { htmlFor: `mod-${key}`, className: "cursor-pointer text-sm font-medium leading-none flex-1", children: MODULE_LABELS[key] || key }),
              MODULE_HAS_LIMIT[key] && /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  placeholder: "∞",
                  className: "w-20 h-8 text-xs text-center",
                  value: limitsConfig[key] || "",
                  onChange: (e) => handleLimitChange(key, e.target.value),
                  title: MODULE_HAS_LIMIT[key],
                  disabled: !enabled
                }
              )
            ] }, key)) : /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 col-span-full", children: "No se detectaron módulos para esta vertical. Intenta cambiar la vertical para recargar los valores por defecto." }) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-3", children: "Los campos numéricos definen el máximo permitido. Vacío = ilimitado." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-4 pt-4", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => window.history.back(), children: "Cancelar" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, className: "min-w-[150px]", children: processing ? "Guardando..." : "Actualizar Plan" })
        ] })
      ] })
    ] })
  ] });
}
export {
  Edit as default
};
