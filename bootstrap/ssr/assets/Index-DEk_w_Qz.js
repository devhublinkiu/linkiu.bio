import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-C8hB-Nb-.js";
import { usePage, Head, router } from "@inertiajs/react";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { C as Card, d as CardContent } from "./card-BaovBWX5.js";
import { f as formatPrice } from "./utils-B0hQsrDj.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { Star, Clock, Flame, ChevronRight, Layers, AlertCircle, Tag, MapPin, Info, Plus, Search, LayoutGrid, List, Loader2, Eye, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { S as Sheet, a as SheetContent, c as SheetTitle } from "./sheet-BclLUCFD.js";
import { S as Separator } from "./separator-DbxqJzR0.js";
import { S as ScrollArea } from "./scroll-area-iVmBTZv4.js";
import { D as DropdownMenu, i as DropdownMenuTrigger, l as DropdownMenuContent, p as DropdownMenuItem, P as PermissionDeniedModal } from "./dropdown-menu-B2I3vWlQ.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { toast } from "sonner";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-rtCrEhXP.js";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-select";
import "@radix-ui/react-switch";
import "@radix-ui/react-dialog";
import "@radix-ui/react-separator";
import "@radix-ui/react-scroll-area";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-alert-dialog";
function ProductViewDrawer({ product, open, onOpenChange }) {
  if (!product) return null;
  const getImageUrl = (img) => {
    if (!img) return "";
    return img.startsWith("http") || img.startsWith("/") ? img : `/media/${img}`;
  };
  const heroImageUrl = product.image_url || getImageUrl(product.image);
  return /* @__PURE__ */ jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxs(SheetContent, { className: "sm:max-w-md p-0 gap-0 flex flex-col", children: [
    /* @__PURE__ */ jsxs(ScrollArea, { className: "flex-1 overflow-y-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative aspect-video w-full bg-muted overflow-hidden", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: heroImageUrl,
            alt: product.name,
            className: "w-full h-full object-cover"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" }),
        /* @__PURE__ */ jsxs("div", { className: "absolute top-4 left-4 flex gap-2", children: [
          product.is_featured && /* @__PURE__ */ jsxs(Badge, { className: "bg-yellow-500 hover:bg-yellow-600 text-white border-none shadow-lg scale-110", children: [
            /* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 fill-white" }),
            " Destacado"
          ] }),
          /* @__PURE__ */ jsx(Badge, { variant: product.is_available ? "default" : "secondary", className: "shadow-lg", children: product.is_available ? "Disponible" : "Agotado" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-primary", children: product.category?.name || "Gastronomía" }),
            /* @__PURE__ */ jsx(SheetTitle, { className: "text-3xl font-black leading-tight tracking-tight", children: product.name }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-primary mt-2", children: formatPrice(product.price) })
          ] }),
          product.short_description && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: product.short_description }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 pt-2", children: [
            product.preparation_time && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border text-xs font-bold text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }),
              product.preparation_time,
              " min"
            ] }),
            product.calories && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border text-xs font-bold text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Flame, { className: "w-3.5 h-3.5 text-orange-500" }),
              product.calories,
              " Kcal"
            ] })
          ] })
        ] }),
        product.gallery && product.gallery.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3 text-primary" }),
            " Galería Adicional"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: product.gallery.map((img, i) => {
            const galleryUrl = product.gallery_urls?.[i] || getImageUrl(img);
            return /* @__PURE__ */ jsx("div", { className: "aspect-square rounded-lg overflow-hidden border bg-muted group cursor-zoom-in", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: galleryUrl,
                alt: `Gallery ${i}`,
                className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              }
            ) }, i);
          }) })
        ] }),
        (product.variant_groups || product.variantGroups) && (product.variant_groups || product.variantGroups)?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Layers, { className: "w-3 h-3 text-purple-500" }),
            " Personalización"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-3", children: (product.variant_groups || product.variantGroups)?.map((group, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-muted/30 p-3 space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: group.name }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                group.is_required && /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "text-[10px] h-5 px-1.5", children: "Req" }),
                /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] h-5 px-1.5 bg-white", children: group.type === "radio" ? "1" : "Multi" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-1", children: group.options.map((opt, j) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsx("span", { children: opt.name }),
              Number(opt.price_adjustment) > 0 && /* @__PURE__ */ jsxs("span", { className: "font-medium text-primary", children: [
                "+",
                formatPrice(opt.price_adjustment)
              ] })
            ] }, j)) })
          ] }, i)) }),
          /* @__PURE__ */ jsx(Separator, { className: "bg-muted/30" })
        ] }),
        /* @__PURE__ */ jsx(Separator, { className: "bg-muted/30" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3 text-orange-500" }),
              " Alérgenos"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: product.allergens && product.allergens.length > 0 ? product.allergens.map((allergen) => /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] font-bold bg-orange-50/50 border-orange-100 text-orange-700", children: allergen }, allergen)) : /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground italic", children: "Ninguno especificado" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Tag, { className: "w-3 h-3 text-blue-500" }),
              " Etiquetas"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: product.tags && product.tags.length > 0 ? product.tags.map((tag) => /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] font-bold bg-blue-50/50 border-blue-100 text-blue-700 capitalize", children: tag }, tag)) : /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground italic", children: "Sin etiquetas" }) })
          ] })
        ] }),
        product.locations && product.locations.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3 text-primary" }),
            " Sedes"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: product.locations.map((loc) => /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px] font-bold gap-1", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-2.5 h-2.5" }),
            " ",
            loc.name
          ] }, loc.id)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-muted/20 p-4 space-y-3 mt-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground font-medium", children: "SKU / Código" }),
            /* @__PURE__ */ jsx("span", { className: "font-bold", children: product.sku || "N/A" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground font-medium", children: "Estado General" }),
            /* @__PURE__ */ jsx(Badge, { variant: product.status === "active" ? "outline" : "secondary", className: product.status === "active" ? "text-green-600 border-green-200 bg-green-50/50" : "", children: product.status === "active" ? "● Activo" : "● Inactivo" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-4 border-t bg-white/80 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10", children: [
      /* @__PURE__ */ jsx(Info, { className: "w-4 h-4 text-primary mt-0.5 shrink-0" }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-primary/80 leading-snug italic", children: "Esta es una vista previa de cómo aparece el producto en tu menú digital. Los clientes verán un diseño similar optimizado para móviles." })
    ] }) })
  ] }) });
}
function Index({ products, categories, locations, products_limit, products_count }) {
  const { currentTenant, currentUserRole } = usePage().props;
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToToggle, setProductToToggle] = useState(null);
  const [productToView, setProductToView] = useState(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const checkPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner === true || Array.isArray(currentUserRole.permissions) && currentUserRole.permissions.includes("*") || Array.isArray(currentUserRole.permissions) && currentUserRole.permissions.includes(permission);
  };
  const handleActionWithPermission = (permission, action) => {
    if (checkPermission(permission)) {
      action();
    } else {
      setShowPermissionModal(true);
    }
  };
  const [togglingId, setTogglingId] = useState(null);
  const limitReached = products_limit !== null && products_count >= products_limit;
  const handleDelete = () => {
    if (!productToDelete) return;
    router.delete(route("tenant.admin.products.destroy", [currentTenant?.slug, productToDelete.id]), {
      onSuccess: () => {
        toast.success("Producto eliminado con éxito");
        setProductToDelete(null);
      }
    });
  };
  const confirmToggleAvailability = () => {
    if (!productToToggle) return;
    setTogglingId(productToToggle.id);
    router.patch(
      route("tenant.admin.products.toggle-availability", [currentTenant?.slug, productToToggle.id]),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success(
            productToToggle.is_available ? "Producto marcado como agotado" : "Producto disponible nuevamente"
          );
          setProductToToggle(null);
          setTogglingId(null);
        },
        onError: () => {
          toast.error("Error al cambiar disponibilidad");
          setTogglingId(null);
        }
      }
    );
  };
  const getProductImageUrl = (product) => {
    if (product.image_url) return product.image_url;
    if (product.image) return `/media/${product.image}`;
    return "";
  };
  const filteredProducts = products.data.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category_id.toString() === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Menú / Productos", children: [
    /* @__PURE__ */ jsx(Head, { title: "Productos" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Productos" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Gestiona los platos y bebidas de tu menú digital.",
            /* @__PURE__ */ jsx("span", { className: "ml-2 font-medium text-foreground", children: products_limit !== null ? `(${products_count} / ${products_limit} usados)` : `(${products_count} productos)` })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            className: "cursor-pointer gap-2",
            disabled: limitReached,
            title: limitReached ? `Has alcanzado el máximo de ${products_limit} productos en tu plan.` : "",
            onClick: () => handleActionWithPermission("products.create", () => {
              if (!limitReached) router.visit(route("tenant.admin.products.create", currentTenant?.slug));
            }),
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
              limitReached ? "Límite alcanzado" : "Nuevo Producto"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Card, { className: "border-none bg-muted/20", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 flex flex-col md:flex-row gap-4 items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 w-full md:w-auto gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Buscar producto...",
                className: "pl-9 bg-white",
                value: search,
                onChange: (e) => setSearch(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(Select, { value: categoryFilter, onValueChange: setCategoryFilter, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px] bg-white", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Categoría" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las categorías" }),
              categories.map((cat) => /* @__PURE__ */ jsx(SelectItem, { value: cat.id.toString(), children: cat.name }, cat.id))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 bg-white p-1 rounded-lg border", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: viewMode === "grid" ? "secondary" : "ghost",
              size: "sm",
              className: "px-3",
              onClick: () => setViewMode("grid"),
              children: [
                /* @__PURE__ */ jsx(LayoutGrid, { className: "w-4 h-4 mr-2" }),
                " Cuadrícula"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: viewMode === "table" ? "secondary" : "ghost",
              size: "sm",
              className: "px-3",
              onClick: () => setViewMode("table"),
              children: [
                /* @__PURE__ */ jsx(List, { className: "w-4 h-4 mr-2" }),
                " Tabla"
              ]
            }
          )
        ] })
      ] }) }),
      viewMode === "grid" ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: filteredProducts.map((product) => /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden group hover:shadow-lg transition-all duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative aspect-square overflow-hidden bg-muted", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: getProductImageUrl(product),
              alt: product.name,
              className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "absolute top-2 right-2 flex flex-col gap-2", children: [
            product.is_featured && /* @__PURE__ */ jsxs(Badge, { className: "bg-yellow-500 hover:bg-yellow-600 text-white border-none shadow-sm", children: [
              /* @__PURE__ */ jsx(Star, { className: "w-3 h-3 fill-white mr-1" }),
              " Destacado"
            ] }),
            product.status === "inactive" && /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Inactivo" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "absolute bottom-2 left-2 flex gap-1", children: [
            product.tags?.includes("picante") && /* @__PURE__ */ jsx(Badge, { className: "bg-red-500 text-white border-none", children: /* @__PURE__ */ jsx(Flame, { className: "w-3 h-3" }) }),
            product.preparation_time && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "bg-white/90 backdrop-blur-sm border-none shadow-sm flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
              " ",
              product.preparation_time,
              " min"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start gap-2 mb-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1", children: product.category?.name || "Sin categoría" }),
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg line-clamp-1", children: product.name })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx("span", { className: "text-primary font-black text-lg", children: formatPrice(product.price) }) })
          ] }),
          product.locations && product.locations.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 mb-2", children: [
            product.locations.slice(0, 2).map((loc) => /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px] h-5 gap-1", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-2.5 h-2.5" }),
              " ",
              loc.name
            ] }, loc.id)),
            product.locations.length > 2 && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px] h-5", children: [
              "+",
              product.locations.length - 2
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-4 pt-4 border-t", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              togglingId === product.id ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin text-muted-foreground" }) : /* @__PURE__ */ jsx(
                Switch,
                {
                  checked: product.is_available,
                  onCheckedChange: () => handleActionWithPermission("products.update", () => setProductToToggle(product))
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: product.is_available ? "Disponible" : "Agotado" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "h-8 w-8 hover:bg-muted text-primary",
                  onClick: () => {
                    setProductToView(product);
                    setIsViewDrawerOpen(true);
                  },
                  children: /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "h-8 w-8 hover:bg-muted",
                  onClick: () => handleActionWithPermission("products.update", () => router.visit(route("tenant.admin.products.edit", [currentTenant?.slug, product.id]))),
                  children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "w-4 h-4" }) }) }),
                /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", children: /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-red-600 focus:text-red-700 cursor-pointer", onClick: () => handleActionWithPermission("products.delete", () => setProductToDelete(product)), children: [
                  /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 mr-2" }),
                  " Eliminar"
                ] }) })
              ] })
            ] })
          ] })
        ] })
      ] }, product.id)) }) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "w-[100px]", children: "Imagen" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Producto" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Categoría" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Sedes" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Precio" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: filteredProducts.map((product) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-lg bg-muted overflow-hidden", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: getProductImageUrl(product),
              alt: product.name,
              className: "w-full h-full object-cover"
            }
          ) }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold", children: product.name }),
            product.is_featured && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-yellow-600 font-bold uppercase tracking-wider flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Star, { className: "w-2 h-2 fill-yellow-600" }),
              " Destacado"
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { children: product.category?.name }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1", children: [
            product.locations && product.locations.length > 0 ? product.locations.slice(0, 2).map((loc) => /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] h-5", children: loc.name }, loc.id)) : /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Todas" }),
            product.locations && product.locations.length > 2 && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px] h-5", children: [
              "+",
              product.locations.length - 2
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-bold text-primary", children: formatPrice(product.price) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            togglingId === product.id ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin text-muted-foreground" }) : /* @__PURE__ */ jsx(
              Switch,
              {
                checked: product.is_available,
                onCheckedChange: () => handleActionWithPermission("products.update", () => setProductToToggle(product))
              }
            ),
            /* @__PURE__ */ jsx(Badge, { variant: product.is_available ? "default" : "secondary", children: product.is_available ? "Disponible" : "Agotado" })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                className: "text-primary",
                onClick: () => {
                  setProductToView(product);
                  setIsViewDrawerOpen(true);
                },
                children: /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                onClick: () => handleActionWithPermission("products.update", () => router.visit(route("tenant.admin.products.edit", [currentTenant?.slug, product.id]))),
                children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", className: "text-red-500 hover:text-red-600 hover:bg-red-50", onClick: () => handleActionWithPermission("products.delete", () => setProductToDelete(product)), children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
          ] }) })
        ] }, product.id)) })
      ] }) }) }),
      filteredProducts.length === 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border-2 border-dashed", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-muted p-4 rounded-full mb-4", children: /* @__PURE__ */ jsx(Plus, { className: "w-8 h-8 text-muted-foreground" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold", children: "No se encontraron productos" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1 max-w-sm", children: search || categoryFilter !== "all" ? "No hay resultados para los filtros aplicados. Intenta con otros términos." : "Comienza agregando tu primer producto al menú para que tus clientes puedan verlo." }),
        !limitReached && /* @__PURE__ */ jsx(
          Button,
          {
            className: "mt-6 cursor-pointer",
            onClick: () => handleActionWithPermission("products.create", () => router.visit(route("tenant.admin.products.create", currentTenant?.slug))),
            children: "Crear Producto"
          }
        )
      ] }),
      products.links && products.data.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex justify-center py-6", children: /* @__PURE__ */ jsx(SharedPagination, { links: products.links }) })
    ] }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!productToDelete, onOpenChange: (open) => !open && setProductToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Estás completamente seguro?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "Esta acción eliminará permanentemente el producto ",
          /* @__PURE__ */ jsx("span", { className: "font-bold border-b", children: productToDelete?.name }),
          " de tu menú y no se podrá deshacer."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: handleDelete, className: "bg-red-600 hover:bg-red-700", children: "Sí, eliminar producto" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!productToToggle, onOpenChange: (open) => !open && setProductToToggle(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: productToToggle?.is_available ? "¿Marcar como agotado?" : "¿Marcar como disponible?" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: productToToggle?.is_available ? `"${productToToggle?.name}" dejará de ser visible en tu menú público.` : `"${productToToggle?.name}" volverá a ser visible para tus clientes.` })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: confirmToggleAvailability, children: productToToggle?.is_available ? "Sí, marcar agotado" : "Sí, habilitar" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      ProductViewDrawer,
      {
        product: productToView,
        open: isViewDrawerOpen,
        onOpenChange: setIsViewDrawerOpen
      }
    ),
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    )
  ] });
}
export {
  Index as default
};
