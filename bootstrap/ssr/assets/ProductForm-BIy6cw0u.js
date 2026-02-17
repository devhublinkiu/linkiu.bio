import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React__default from "react";
import { useForm } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-B4HNlFNZ.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { C as Checkbox } from "./checkbox-dJXZmgY3.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { S as Separator } from "./separator-DbxqJzR0.js";
import { M as MediaManagerModal } from "./MediaManagerModal-BnB4O6SR.js";
import { Info, DollarSign, Image, Layers, UtensilsCrossed, Settings, Upload, Folder, X, Plus, Trash2, ArrowUp, ArrowDown, AlertCircle, MapPin, Save } from "lucide-react";
import { f as formatPrice } from "./utils-B0hQsrDj.js";
import { A as Accordion, a as AccordionItem, b as AccordionTrigger, c as AccordionContent } from "./accordion-YG9U3R8-.js";
const ALLERGENS = [
  { id: "gluten", label: "Gluten" },
  { id: "lacteos", label: "Lácteos" },
  { id: "huevo", label: "Huevo" },
  { id: "frutos_secos", label: "Frutos Secos" },
  { id: "mariscos", label: "Mariscos" },
  { id: "soya", label: "Soya" },
  { id: "pescado", label: "Pescado" }
];
const TAGS = [
  { id: "vegano", label: "Vegano" },
  { id: "vegetariano", label: "Vegetariano" },
  { id: "sin_gluten", label: "Sin Gluten" },
  { id: "picante", label: "Picante 🌶️" },
  { id: "recomendado", label: "Recomendado" },
  { id: "nuevo", label: "Nuevo" },
  { id: "organico", label: "Orgánico" }
];
function ProductForm({ product, categories, locations = [], submitRoute, method = "post" }) {
  const [galleryModalOpen, setGalleryModalOpen] = React__default.useState(false);
  const ensureArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [val];
      } catch {
        return [val];
      }
    }
    return [];
  };
  const { data, setData, post, processing, errors } = useForm({
    _method: method === "post" ? void 0 : method,
    name: product?.name || "",
    category_id: product?.category_id || "",
    short_description: product?.short_description || "",
    price: product?.price ? Math.round(Number(product.price)).toString() : "",
    original_price: product?.original_price ? Math.round(Number(product.original_price)).toString() : "",
    cost: product?.cost ? Math.round(Number(product.cost)).toString() : "",
    sku: product?.sku || "",
    image: product?.image || null,
    image_file: null,
    gallery: ensureArray(product?.gallery),
    gallery_files: [],
    preparation_time: product?.preparation_time || "",
    calories: product?.calories || "",
    allergens: ensureArray(product?.allergens),
    tags: ensureArray(product?.tags),
    is_available: product?.is_available ?? true,
    is_featured: product?.is_featured ?? false,
    status: product?.status || "active",
    variant_groups: product?.variant_groups || [],
    tax_name: product?.tax_name || "",
    tax_rate: product?.tax_rate ? Number(product.tax_rate).toString() : "",
    price_includes_tax: product?.price_includes_tax ?? false,
    location_ids: product?.locations?.map((l) => l.id) || []
  });
  const addVariantGroup = () => {
    setData("variant_groups", [
      ...data.variant_groups,
      {
        name: "",
        type: "radio",
        min_selection: 0,
        max_selection: 1,
        is_required: false,
        sort_order: data.variant_groups.length,
        options: [
          { name: "", price_adjustment: 0, is_available: true, sort_order: 0 }
        ]
      }
    ]);
  };
  const removeVariantGroup = (index) => {
    const newGroups = [...data.variant_groups];
    newGroups.splice(index, 1);
    setData("variant_groups", newGroups);
  };
  const updateVariantGroup = (index, field, value) => {
    const newGroups = [...data.variant_groups];
    newGroups[index] = { ...newGroups[index], [field]: value };
    setData("variant_groups", newGroups);
  };
  const addOption = (groupIndex) => {
    const newGroups = [...data.variant_groups];
    newGroups[groupIndex].options.push({
      name: "",
      price_adjustment: 0,
      is_available: true,
      sort_order: newGroups[groupIndex].options.length
    });
    setData("variant_groups", newGroups);
  };
  const removeOption = (groupIndex, optionIndex) => {
    const newGroups = [...data.variant_groups];
    newGroups[groupIndex].options.splice(optionIndex, 1);
    setData("variant_groups", newGroups);
  };
  const updateOption = (groupIndex, optionIndex, field, value) => {
    const newGroups = [...data.variant_groups];
    newGroups[groupIndex].options[optionIndex] = {
      ...newGroups[groupIndex].options[optionIndex],
      [field]: value
    };
    setData("variant_groups", newGroups);
  };
  const moveOption = (groupIndex, optionIndex, direction) => {
    const newGroups = [...data.variant_groups];
    const options = newGroups[groupIndex].options;
    if (direction === "up" && optionIndex > 0) {
      [options[optionIndex], options[optionIndex - 1]] = [options[optionIndex - 1], options[optionIndex]];
    } else if (direction === "down" && optionIndex < options.length - 1) {
      [options[optionIndex], options[optionIndex + 1]] = [options[optionIndex + 1], options[optionIndex]];
    }
    setData("variant_groups", newGroups);
  };
  const calculateMargin = () => {
    const price = Number(data.price);
    const cost = Number(data.cost);
    if (!price || !cost) return 0;
    return Math.round((price - cost) / price * 100);
  };
  const submit = (e) => {
    e.preventDefault();
    post(submitRoute, {
      forceFormData: true,
      preserveScroll: true
    });
  };
  const toggleArrayItem = (field, value) => {
    const current = data[field];
    if (current.includes(value)) {
      setData(field, current.filter((i) => i !== value));
    } else {
      setData(field, [...current, value]);
    }
  };
  const toggleLocation = (locationId) => {
    const current = data.location_ids;
    if (current.includes(locationId)) {
      setData("location_ids", current.filter((id) => id !== locationId));
    } else {
      setData("location_ids", [...current, locationId]);
    }
  };
  const imageInputRef = React__default.useRef(null);
  const galleryInputRef = React__default.useRef(null);
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img instanceof File) return URL.createObjectURL(img);
    if (typeof img !== "string") return "";
    if (img.startsWith("http") || img.startsWith("/")) return img;
    return `/media/${img}`;
  };
  const getMainImagePreview = () => {
    if (data.image_file) return URL.createObjectURL(data.image_file);
    if (product?.image_url) return product.image_url;
    if (data.image) return getImageUrl(data.image);
    return "";
  };
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setData("image_file", file);
      setData("image", null);
    }
  };
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const currentGalleryCount = (data.gallery?.length || 0) + (data.gallery_files?.length || 0);
      const availableSlots = 5 - currentGalleryCount;
      if (availableSlots > 0) {
        const toAdd = files.slice(0, availableSlots);
        setData("gallery_files", [...data.gallery_files || [], ...toAdd]);
      }
    }
  };
  const getGalleryPreviewUrl = (img, index) => {
    if (product?.gallery_urls && product.gallery_urls[index]) {
      return product.gallery_urls[index];
    }
    return getImageUrl(img);
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-8 pb-20", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "file",
        ref: imageInputRef,
        className: "hidden",
        accept: "image/*",
        onChange: handleImageChange
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "file",
        ref: galleryInputRef,
        className: "hidden",
        accept: "image/*",
        multiple: true,
        onChange: handleGalleryChange
      }
    ),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "basic", className: "w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-white/50 backdrop-blur-sm sticky top-0 z-10 py-4 mb-6 border-b", children: /* @__PURE__ */ jsxs(TabsList, { className: "flex w-full max-w-3xl mx-auto h-12 p-1 bg-muted/50 rounded-xl overflow-x-auto scrollbar-none", children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "basic", className: "flex-1 py-2.5 rounded-lg data-[state=active]:!bg-white data-[state=active]:shadow-md transition-all", children: [
          /* @__PURE__ */ jsx(Info, { className: "w-4 h-4 mr-2" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Información" })
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "pricing", className: "flex-1 py-2.5 rounded-lg data-[state=active]:!bg-white data-[state=active]:shadow-md transition-all", children: [
          /* @__PURE__ */ jsx(DollarSign, { className: "w-4 h-4 mr-2" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Precios" })
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "media", className: "flex-1 py-2.5 rounded-lg data-[state=active]:!bg-white data-[state=active]:shadow-md transition-all", children: [
          /* @__PURE__ */ jsx(Image, { className: "w-4 h-4 mr-2" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Imágenes" })
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "variants", className: "flex-1 py-2.5 rounded-lg data-[state=active]:!bg-white data-[state=active]:shadow-md transition-all", children: [
          /* @__PURE__ */ jsx(Layers, { className: "w-4 h-4 mr-2" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Variables" })
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "culinary", className: "flex-1 py-2.5 rounded-lg data-[state=active]:!bg-white data-[state=active]:shadow-md transition-all", children: [
          /* @__PURE__ */ jsx(UtensilsCrossed, { className: "w-4 h-4 mr-2" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Detalles" })
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "config", className: "flex-1 py-2.5 rounded-lg data-[state=active]:!bg-white data-[state=active]:shadow-md transition-all", children: [
          /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4 mr-2" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Ajustes" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto w-full", children: [
        /* @__PURE__ */ jsx(TabsContent, { value: "basic", className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-sm", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Información Básica" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Datos esenciales del plato o bebida." })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "name", children: [
                "Nombre del Producto ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "name",
                  value: data.name,
                  onChange: (e) => setData("name", e.target.value),
                  placeholder: "Ej: Pizza Margarita",
                  className: errors.name ? "border-red-500" : ""
                }
              ),
              errors.name && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "category", children: [
                "Categoría ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  value: data.category_id.toString(),
                  onValueChange: (val) => setData("category_id", val),
                  children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { className: errors.category_id ? "border-red-500" : "", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona una categoría" }) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: categories.map((cat) => /* @__PURE__ */ jsx(SelectItem, { value: cat.id.toString(), children: cat.name }, cat.id)) })
                  ]
                }
              ),
              errors.category_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.category_id })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "short_description", children: "Descripción Corta" }),
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  id: "short_description",
                  value: data.short_description,
                  onChange: (e) => setData("short_description", e.target.value),
                  placeholder: "Describe brevemente el plato para el cliente...",
                  rows: 3,
                  maxLength: 150
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                data.short_description?.length || 0,
                "/150"
              ] }) }),
              errors.short_description && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.short_description })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "pricing", className: "space-y-6", children: [
          /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-sm", children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Precios y Costos" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Gestiona el valor comercial y el margen de ganancia." })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6 items-start", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                  /* @__PURE__ */ jsxs(Label, { htmlFor: "price", children: [
                    "Precio de Venta ",
                    /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: "$" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "price",
                        type: "text",
                        value: data.price ? formatPrice(data.price, false) : "",
                        onChange: (e) => setData("price", e.target.value.replace(/\D/g, "")),
                        placeholder: "25.000",
                        className: `pl-7 ${errors.price ? "border-red-500" : ""}`
                      }
                    )
                  ] }),
                  errors.price && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.price })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "original_price", children: "Precio Original (Antes de Descuento)" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: "$" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "original_price",
                        type: "text",
                        value: data.original_price ? formatPrice(data.original_price, false) : "",
                        onChange: (e) => setData("original_price", e.target.value.replace(/\D/g, "")),
                        placeholder: "30.000",
                        className: "pl-7"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Si llenas esto, el precio de venta se mostrará como oferta." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "cost", children: "Costo del Producto" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: "$" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "cost",
                        type: "text",
                        value: data.cost ? formatPrice(data.cost, false) : "",
                        onChange: (e) => setData("cost", e.target.value.replace(/\D/g, "")),
                        placeholder: "12.000",
                        className: "pl-7"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Opcional para calcular margen de utilidad." })
                ] })
              ] }),
              data.price && data.cost && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-primary/5 rounded-lg border border-primary/10 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "bg-primary/10 p-2 rounded-full", children: /* @__PURE__ */ jsx(DollarSign, { className: "w-4 h-4 text-primary" }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-primary uppercase tracking-wider", children: "Margen Estimado" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-2xl font-black text-primary", children: [
                      calculateMargin(),
                      "%"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground max-w-[200px] text-right", children: [
                  "Utilidad por unidad: ",
                  /* @__PURE__ */ jsxs("strong", { children: [
                    "$",
                    formatPrice(Number(data.price) - Number(data.cost))
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "sku", children: "SKU / Código Externo" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "sku",
                    value: data.sku,
                    onChange: (e) => setData("sku", e.target.value),
                    placeholder: "Ej: PIZ-001"
                  }
                ),
                errors.sku && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.sku })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-sm", children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Impuestos" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Configuración específica de impuestos para este producto (sobrescribe la configuración global)." })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 border p-3 rounded-lg bg-muted/20", children: [
                /* @__PURE__ */ jsx(
                  Switch,
                  {
                    id: "price_includes_tax",
                    checked: !!data.price_includes_tax,
                    onCheckedChange: (checked) => {
                      if (Boolean(data.price_includes_tax) !== checked) setData("price_includes_tax", checked);
                    }
                  }
                ),
                /* @__PURE__ */ jsx(Label, { htmlFor: "price_includes_tax", className: "cursor-pointer", children: "El precio de venta incluye impuestos" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "tax_name", children: "Nombre del Impuesto" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "tax_name",
                      value: data.tax_name,
                      onChange: (e) => setData("tax_name", e.target.value),
                      placeholder: "Ej: IVA, Impoconsumo"
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Dejar en blanco para usar configuración global." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "tax_rate", children: "Tasa de Impuesto (%)" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "tax_rate",
                        type: "number",
                        step: "0.01",
                        value: data.tax_rate,
                        onChange: (e) => setData("tax_rate", e.target.value),
                        placeholder: "Ej: 19",
                        className: "pr-7"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: "%" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Dejar en blanco para usar configuración global." })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "media", className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-sm", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Fotografías" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Las imágenes serán redimensionadas automáticamente a formato cuadrado (1:1)." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs(Label, { className: "text-base font-bold", children: [
                "Imagen Principal ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-6", children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "relative w-full md:w-64 aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors shrink-0",
                    onClick: () => imageInputRef.current?.click(),
                    children: [
                      data.image || data.image_file || product?.image_url ? /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: getMainImagePreview(),
                          className: "w-full h-full object-cover",
                          alt: "Principal"
                        }
                      ) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 text-muted-foreground", children: [
                        /* @__PURE__ */ jsx("div", { className: "p-3 bg-white rounded-full shadow-sm", children: /* @__PURE__ */ jsx(Upload, { className: "w-6 h-6" }) }),
                        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase", children: "Subir Imagen" })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity", children: /* @__PURE__ */ jsx("span", { className: "text-white text-xs font-bold uppercase tracking-widest", children: "Cambiar" }) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                    /* @__PURE__ */ jsxs(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        className: "h-10 px-4 rounded-xl border-dashed hover:border-primary/50 hover:bg-primary/5 justify-start text-xs font-bold uppercase transition-all",
                        onClick: () => imageInputRef.current?.click(),
                        children: [
                          /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4 mr-2 text-primary" }),
                          "Elegir Archivo"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      Button,
                      {
                        type: "button",
                        variant: "ghost",
                        size: "sm",
                        className: "h-8 text-[10px] font-bold uppercase w-fit",
                        onClick: () => {
                          setGalleryModalOpen(true);
                        },
                        children: [
                          /* @__PURE__ */ jsx(Folder, { className: "w-3 h-3 mr-1" }),
                          "Biblioteca"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-lg bg-orange-50/50 border border-orange-100 flex items-start gap-2", children: [
                    /* @__PURE__ */ jsx(Info, { className: "w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-orange-800 leading-tight", children: [
                      "Formatos: JPG, PNG, WebP. Tamaño máx: 2MB. Se convertirá automáticamente a ",
                      /* @__PURE__ */ jsx("strong", { children: "800x800px" }),
                      "."
                    ] })
                  ] }),
                  errors.image && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.image }),
                  errors.image_file && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.image_file })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Separator, { className: "bg-muted/30" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx(Label, { className: "text-base font-bold", children: "Galería Adicional" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Hasta 5 imágenes adicionales para tu producto." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold bg-muted px-2 py-1 rounded", children: [
                  (data.gallery?.length || 0) + (data.gallery_files?.length || 0),
                  " / 5"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4", children: [
                data.gallery.map((img, i) => /* @__PURE__ */ jsxs("div", { className: "relative aspect-square rounded-lg overflow-hidden border group", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: getGalleryPreviewUrl(img, i),
                      alt: `Gallery ${i}`,
                      className: "w-full h-full object-cover"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      type: "button",
                      variant: "destructive",
                      size: "icon",
                      className: "absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
                      onClick: () => {
                        const newGallery = [...data.gallery];
                        newGallery.splice(i, 1);
                        setData("gallery", newGallery);
                      },
                      children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
                    }
                  )
                ] }, `path-${i}`)),
                data.gallery_files.map((file, i) => /* @__PURE__ */ jsxs("div", { className: "relative aspect-square rounded-lg overflow-hidden border-2 border-primary/20 group animate-in fade-in zoom-in duration-300", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: getImageUrl(file),
                      alt: `New Upload ${i}`,
                      className: "w-full h-full object-cover"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute top-1 left-1 bg-primary text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase", children: "Nuevo" }),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      type: "button",
                      variant: "destructive",
                      size: "icon",
                      className: "absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
                      onClick: () => {
                        const newFiles = [...data.gallery_files];
                        newFiles.splice(i, 1);
                        setData("gallery_files", newFiles);
                      },
                      children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
                    }
                  )
                ] }, `file-${i}`)),
                data.gallery.length + data.gallery_files.length < 5 && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-2", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => galleryInputRef.current?.click(),
                      className: "flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-muted/5 hover:bg-muted/10 transition-colors aspect-square group cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4 text-primary" }) }),
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase mt-2 text-muted-foreground", children: "Subir" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      className: "h-8 text-[10px] font-bold uppercase",
                      onClick: () => setGalleryModalOpen(true),
                      children: [
                        /* @__PURE__ */ jsx(Folder, { className: "w-3 h-3 mr-1" }),
                        "Biblioteca"
                      ]
                    }
                  )
                ] })
              ] }),
              errors.gallery && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.gallery }),
              errors.gallery_files && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.gallery_files })
            ] }),
            /* @__PURE__ */ jsx(
              MediaManagerModal,
              {
                open: galleryModalOpen,
                onOpenChange: setGalleryModalOpen,
                onSelect: (file) => {
                  if (file.url) {
                    setData("gallery", [...data.gallery, file.url]);
                  }
                  setGalleryModalOpen(false);
                }
              }
            )
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "variants", className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold", children: "Modificadores y Variables" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Define opciones como tamaño, término, adiciones, etc." })
            ] }),
            /* @__PURE__ */ jsxs(Button, { type: "button", onClick: addVariantGroup, className: "gap-2", children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
              " Agregar Grupo"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            data.variant_groups.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-12 border-2 border-dashed rounded-xl bg-muted/5", children: [
              /* @__PURE__ */ jsx(Layers, { className: "w-12 h-12 text-muted-foreground mx-auto mb-3" }),
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-lg", children: "Sin variables definidas" }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm max-w-sm mx-auto mb-6", children: "Agrega grupos de opciones para permitir a tus clientes personalizar este producto." }),
              /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: addVariantGroup, children: "Crear primer grupo" })
            ] }),
            /* @__PURE__ */ jsx(Accordion, { type: "multiple", className: "w-full space-y-4", defaultValue: data.variant_groups.map((_, i) => `group-${i}`), children: data.variant_groups.map((group, gIndex) => /* @__PURE__ */ jsxs(AccordionItem, { value: `group-${gIndex}`, className: "border rounded-lg bg-card overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center px-4 bg-muted/10", children: [
                /* @__PURE__ */ jsx(AccordionTrigger, { className: "flex-1 hover:no-underline py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-left", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-lg", children: group.name || `Nuevo Grupo ${gIndex + 1}` }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsx(Badge, { variant: group.type === "radio" ? "secondary" : "outline", className: "text-[10px] h-5", children: group.type === "radio" ? "Única" : "Múltiple" }),
                    group.is_required && /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "text-[10px] h-5", children: "Requerido" })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    className: "text-muted-foreground hover:text-destructive shrink-0 ml-2",
                    onClick: (e) => {
                      e.stopPropagation();
                      removeVariantGroup(gIndex);
                    },
                    children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(AccordionContent, { className: "p-0 border-t", children: /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-start", children: [
                  /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { children: "Nombre del Grupo" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        placeholder: "Ej: Elige el tamaño, Qué salsa deseas?",
                        value: group.name,
                        onChange: (e) => updateVariantGroup(gIndex, "name", e.target.value),
                        className: `text-base ${errors[`variant_groups.${gIndex}.name`] ? "border-red-500" : ""}`
                      }
                    ),
                    errors[`variant_groups.${gIndex}.name`] && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors[`variant_groups.${gIndex}.name`] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { children: "Tipo de Selección" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          type: "button",
                          variant: group.type === "radio" ? "default" : "outline",
                          className: "flex-1",
                          onClick: () => updateVariantGroup(gIndex, "type", "radio"),
                          children: "Única"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          type: "button",
                          variant: group.type === "checkbox" ? "default" : "outline",
                          className: "flex-1",
                          onClick: () => updateVariantGroup(gIndex, "type", "checkbox"),
                          children: "Múltiple"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { children: "Configuración" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border rounded-md p-2 bg-muted/20", children: [
                      /* @__PURE__ */ jsx(
                        Switch,
                        {
                          checked: !!group.is_required,
                          onCheckedChange: (val) => {
                            if (Boolean(group.is_required) !== val) updateVariantGroup(gIndex, "is_required", val);
                          }
                        }
                      ),
                      /* @__PURE__ */ jsx(Label, { className: "text-xs uppercase font-bold text-muted-foreground cursor-pointer", onClick: () => updateVariantGroup(gIndex, "is_required", !group.is_required), children: "Obligatorio" })
                    ] })
                  ] })
                ] }),
                group.type === "checkbox" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-blue-800", children: [
                  /* @__PURE__ */ jsx(Info, { className: "w-4 h-4 text-blue-500" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { children: "Limitar selección:" }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase ml-2", children: "Mínimo" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "number",
                        value: group.min_selection,
                        onChange: (e) => updateVariantGroup(gIndex, "min_selection", parseInt(e.target.value)),
                        className: "w-16 h-8 text-xs bg-white",
                        min: 0
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase ml-2", children: "Máximo" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "number",
                        value: group.max_selection,
                        onChange: (e) => updateVariantGroup(gIndex, "max_selection", parseInt(e.target.value)),
                        className: "w-16 h-8 text-xs bg-white",
                        min: 1
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsx(Separator, {}),
                /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx(Label, { className: "uppercase text-xs font-bold text-muted-foreground", children: "Opciones del Grupo" }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      group.options.length,
                      " opciones"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-2", children: group.options.map((option, oIndex) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-2 rounded-lg border bg-white group/option hover:border-primary/30 transition-colors", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 mt-0.5", children: [
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          type: "button",
                          variant: "ghost",
                          size: "icon",
                          className: "h-6 w-6 text-muted-foreground hover:bg-muted",
                          disabled: oIndex === 0,
                          onClick: () => moveOption(gIndex, oIndex, "up"),
                          children: /* @__PURE__ */ jsx(ArrowUp, { className: "w-3 h-3" })
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          type: "button",
                          variant: "ghost",
                          size: "icon",
                          className: "h-6 w-6 text-muted-foreground hover:bg-muted",
                          disabled: oIndex === group.options.length - 1,
                          onClick: () => moveOption(gIndex, oIndex, "down"),
                          children: /* @__PURE__ */ jsx(ArrowDown, { className: "w-3 h-3" })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                        /* @__PURE__ */ jsx(
                          Input,
                          {
                            placeholder: "Nombre (Ej: Grande)",
                            value: option.name,
                            onChange: (e) => updateOption(gIndex, oIndex, "name", e.target.value),
                            className: `h-9 ${errors[`variant_groups.${gIndex}.options.${oIndex}.name`] ? "border-red-500" : ""}`
                          }
                        ),
                        /* @__PURE__ */ jsxs("div", { className: "relative w-32 shrink-0", children: [
                          /* @__PURE__ */ jsx("span", { className: "absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs", children: "$" }),
                          /* @__PURE__ */ jsx(
                            Input,
                            {
                              type: "number",
                              placeholder: "0",
                              value: option.price_adjustment,
                              onChange: (e) => updateOption(gIndex, oIndex, "price_adjustment", e.target.value),
                              className: `h-9 pl-5 ${errors[`variant_groups.${gIndex}.options.${oIndex}.price_adjustment`] ? "border-red-500" : ""}`
                            }
                          )
                        ] })
                      ] }),
                      (errors[`variant_groups.${gIndex}.options.${oIndex}.name`] || errors[`variant_groups.${gIndex}.options.${oIndex}.price_adjustment`]) && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-red-500 font-medium px-1", children: [
                        errors[`variant_groups.${gIndex}.options.${oIndex}.name`],
                        errors[`variant_groups.${gIndex}.options.${oIndex}.price_adjustment`] && /* @__PURE__ */ jsx("span", { className: "ml-2", children: errors[`variant_groups.${gIndex}.options.${oIndex}.price_adjustment`] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-0.5", children: [
                      /* @__PURE__ */ jsx(
                        Switch,
                        {
                          checked: !!option.is_available,
                          onCheckedChange: (val) => {
                            if (Boolean(option.is_available) !== val) updateOption(gIndex, oIndex, "is_available", val);
                          }
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          type: "button",
                          variant: "ghost",
                          size: "icon",
                          className: "h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                          onClick: () => removeOption(gIndex, oIndex),
                          children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
                        }
                      )
                    ] })
                  ] }, `opt-${gIndex}-${oIndex}`)) }),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      onClick: () => addOption(gIndex),
                      className: "w-full border border-dashed border-muted-foreground/30 text-muted-foreground hover:bg-muted/30 hover:text-primary",
                      children: [
                        /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3 mr-2" }),
                        " Agregar Opción"
                      ]
                    }
                  )
                ] })
              ] }) })
            ] }, `group-${gIndex}`)) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "culinary", className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-sm", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Detalles Gastronómicos" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Información extra para el cliente." })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "preparation_time", children: "Tiempo de Preparación (Minutos)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "preparation_time",
                    type: "number",
                    value: data.preparation_time,
                    onChange: (e) => setData("preparation_time", e.target.value),
                    placeholder: "Ej: 15"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "calories", children: "Calorías (Kcal)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "calories",
                    type: "number",
                    value: data.calories,
                    onChange: (e) => setData("calories", e.target.value),
                    placeholder: "Ej: 450"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-orange-500" }),
                " Alérgenos"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", children: ALLERGENS.map((allergen) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 bg-muted/20 p-2 rounded-lg border border-transparent hover:border-primary/20 transition-colors", children: [
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    id: `allergen-${allergen.id}`,
                    checked: data.allergens.includes(allergen.id),
                    onCheckedChange: () => toggleArrayItem("allergens", allergen.id)
                  }
                ),
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    htmlFor: `allergen-${allergen.id}`,
                    className: "text-xs font-medium leading-none cursor-pointer select-none",
                    children: allergen.label
                  }
                )
              ] }, allergen.id)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx(Label, { children: "Etiquetas / Tags" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: TAGS.map((tag) => /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: data.tags.includes(tag.id) ? "default" : "outline",
                  className: `cursor-pointer py-1.5 px-3 transition-all ${data.tags.includes(tag.id) ? "" : "hover:bg-primary/5"}`,
                  onClick: () => toggleArrayItem("tags", tag.id),
                  children: tag.label
                },
                tag.id
              )) })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "config", className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-sm", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Configuración de Visibilidad" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Define cómo y dónde se muestra el producto." })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-xl border bg-muted/10", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsx(Label, { className: "text-base", children: "Disponibilidad" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Activa para permitir la venta, apaga si el producto está temporalmente agotado." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { className: `text-xs font-bold uppercase tracking-widest ${data.is_available ? "text-green-600" : "text-slate-400"}`, children: data.is_available ? "Disponible" : "Agotado" }),
                /* @__PURE__ */ jsx(
                  Switch,
                  {
                    checked: !!data.is_available,
                    onCheckedChange: (val) => {
                      if (Boolean(data.is_available) !== val) setData("is_available", val);
                    }
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-xl border bg-muted/10", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Label, { className: "text-base", children: "Producto Destacado" }),
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none", children: "VIP" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Aparecerá en los primeros lugares y con un diseño especial en el menú." })
              ] }),
              /* @__PURE__ */ jsx(
                Switch,
                {
                  checked: !!data.is_featured,
                  onCheckedChange: (val) => {
                    if (Boolean(data.is_featured) !== val) setData("is_featured", val);
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4 border-t", children: [
              /* @__PURE__ */ jsx(Label, { children: "Estado General del Producto" }),
              /* @__PURE__ */ jsxs(Select, { value: data.status, onValueChange: (val) => setData("status", val), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "max-w-[200px]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "active", className: "text-green-600 font-medium", children: "Activo" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "inactive", className: "text-slate-400 font-medium", children: "Inactivo" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground italic", children: "Los productos inactivos están ocultos totalmente del menú público." })
            ] }),
            locations.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4 border-t", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2 text-base", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-primary" }),
                  "Disponibilidad por Sede"
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "Selecciona en qué sedes estará disponible este producto. Si no seleccionas ninguna, estará disponible en ",
                  /* @__PURE__ */ jsx("strong", { children: "todas" }),
                  "."
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: locations.map((loc) => {
                const isChecked = data.location_ids.includes(loc.id);
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${isChecked ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/30"}`,
                    children: [
                      /* @__PURE__ */ jsx(
                        Checkbox,
                        {
                          id: `location-${loc.id}`,
                          checked: isChecked,
                          onCheckedChange: (checked) => {
                            const next = checked === true;
                            if (isChecked !== next) toggleLocation(loc.id);
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-muted-foreground" }),
                        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: loc.name })
                      ] })
                    ]
                  },
                  loc.id
                );
              }) }),
              data.location_ids.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                  data.location_ids.length,
                  " sede",
                  data.location_ids.length !== 1 ? "s" : "",
                  " seleccionada",
                  data.location_ids.length !== 1 ? "s" : ""
                ] }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    className: "text-xs h-6",
                    onClick: () => setData("location_ids", []),
                    children: "Limpiar selección"
                  }
                )
              ] }),
              errors.location_ids && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.location_ids })
            ] })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "sticky bottom-0 -mx-6 mt-10 px-6 py-4 bg-white/80 backdrop-blur-md border-t flex justify-end gap-3 z-20", children: [
      /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", className: "cursor-pointer", onClick: () => window.history.back(), children: "Cancelar" }),
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, className: "cursor-pointer gap-2 px-8", children: processing ? /* @__PURE__ */ jsx(Fragment, { children: "Guardando..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
        product ? "Actualizar Producto" : "Crear Producto"
      ] }) })
    ] })
  ] });
}
export {
  ProductForm as P
};
