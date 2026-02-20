import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AdminLayout } from "./AdminLayout-CegS7XIj.js";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-BaovBWX5.js";
import { Search, Plus, Package, Edit, Trash2 } from "lucide-react";
import { S as Sheet, b as SheetContent, c as SheetHeader, d as SheetTitle, e as SheetDescription, f as SheetFooter } from "./sheet-BFMMArVC.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { E as Empty, a as EmptyHeader, e as EmptyMedia, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import { P as PermissionDeniedModal } from "./dropdown-menu-Dkgv2tnp.js";
import { toast } from "sonner";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-rtCrEhXP.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "@radix-ui/react-alert-dialog";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
const UNIT_LABELS = {
  kg: "Kilogramos",
  g: "Gramos",
  l: "Litros",
  ml: "Mililitros",
  units: "Unidades",
  pieces: "Piezas"
};
function Index({ items, categories, locations, filters }) {
  const { currentTenant, currentUserRole, flash } = usePage().props;
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  useEffect(() => {
    if (flash?.error) {
      toast.error(flash.error);
    }
    if (flash?.success) {
      toast.success(flash.success);
    }
  }, [flash?.error, flash?.success]);
  const hasPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner || currentUserRole.permissions.includes("*") || currentUserRole.permissions.includes(permission);
  };
  const handleProtectedAction = (e, permission, callback) => {
    if (e) e.preventDefault();
    if (hasPermission(permission)) {
      callback();
    } else {
      setShowPermissionModal(true);
    }
  };
  const form = useForm({
    name: "",
    sku: "",
    description: "",
    unit: "units",
    cost_per_unit: "",
    category: "",
    status: "active"
  });
  const handleOpenSheet = (item) => {
    if (item) {
      setEditingItem(item);
      form.setData({
        name: item.name,
        sku: item.sku || "",
        description: item.description || "",
        unit: item.unit,
        cost_per_unit: item.cost_per_unit?.toString() || "",
        category: item.category || "",
        status: item.status
      });
    } else {
      setEditingItem(null);
      form.reset();
    }
    setIsSheetOpen(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      form.put(route("tenant.admin.inventory.update", { tenant: currentTenant.slug, inventoryItem: editingItem.id }), {
        onSuccess: () => {
          setIsSheetOpen(false);
          toast.success("Item actualizado correctamente.");
        },
        onError: () => {
          toast.error("No se pudo actualizar el item. Verifica los datos.");
        }
      });
    } else {
      form.post(route("tenant.admin.inventory.store", { tenant: currentTenant.slug }), {
        onSuccess: () => {
          setIsSheetOpen(false);
          form.reset();
          toast.success("Item creado correctamente.");
        },
        onError: () => {
          toast.error("No se pudo crear el item. Verifica los datos.");
        }
      });
    }
  };
  const handleDelete = () => {
    if (!itemToDelete) return;
    router.delete(route("tenant.admin.inventory.destroy", { tenant: currentTenant.slug, inventoryItem: itemToDelete.id }), {
      onSuccess: () => {
        setItemToDelete(null);
        toast.success("Item eliminado correctamente.");
      },
      onError: () => {
        toast.error("No se pudo eliminar el item.");
      }
    });
  };
  const handleFilterChange = (key, value) => {
    router.get(route("tenant.admin.inventory.index", { tenant: currentTenant.slug }), {
      ...filters,
      [key]: value || void 0
    }, {
      preserveState: true,
      preserveScroll: true
    });
  };
  const getTotalStock = (item) => {
    if (!item.stocks || item.stocks.length === 0) return 0;
    return item.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  };
  const getStockBadge = (item) => {
    getTotalStock(item);
    const hasLowStock = item.stocks?.some((s) => s.is_low_stock) || false;
    const hasOutOfStock = item.stocks?.some((s) => s.is_out_of_stock) || false;
    if (hasOutOfStock) {
      return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-red-100 text-red-800", children: "Sin stock" });
    }
    if (hasLowStock) {
      return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-yellow-100 text-yellow-800", children: "Stock bajo" });
    }
    return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-green-100 text-green-800", children: "Disponible" });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Inventario", breadcrumbs: [{ label: "Gastronomía" }, { label: "Inventario" }], children: [
    /* @__PURE__ */ jsx(Head, { title: "Inventario" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-amber-600", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-amber-900 mb-1", children: "Módulo en proceso de implementación" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-amber-800", children: "Actualmente puedes gestionar el catálogo de items. La funcionalidad completa (registro de movimientos, control de stock por sede y reportes) estará disponible próximamente." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "text",
                placeholder: "Buscar por nombre, SKU o categoría...",
                value: filters.search || "",
                onChange: (e) => handleFilterChange("search", e.target.value),
                className: "pl-10 w-[300px]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(Select, { value: filters.category || "all", onValueChange: (v) => handleFilterChange("category", v === "all" ? "" : v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Todas las categorías" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las categorías" }),
              categories.map((cat) => /* @__PURE__ */ jsx(SelectItem, { value: cat, children: cat }, cat))
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Select, { value: filters.status || "all", onValueChange: (v) => handleFilterChange("status", v === "all" ? "" : v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[150px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Todos" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "active", children: "Activos" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "inactive", children: "Inactivos" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: (e) => handleProtectedAction(e, "inventory.create", () => handleOpenSheet()), children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-2" }),
          " Nuevo Item"
        ] })
      ] }),
      items.data.length === 0 ? /* @__PURE__ */ jsxs(Empty, { className: "border-2 border-dashed rounded-xl bg-white py-12", children: [
        /* @__PURE__ */ jsxs(EmptyHeader, { children: [
          /* @__PURE__ */ jsx(EmptyMedia, { variant: "icon", children: /* @__PURE__ */ jsx(Package, { className: "size-4" }) }),
          /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay items de inventario" }),
          /* @__PURE__ */ jsx(EmptyDescription, { children: 'Empieza creando un item como "Harina 00" o "Aceite de oliva".' })
        ] }),
        /* @__PURE__ */ jsxs(Button, { className: "mt-4", onClick: (e) => handleProtectedAction(e, "inventory.create", () => handleOpenSheet()), children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-2" }),
          " Crear mi primer item"
        ] })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: items.data.map((item) => /* @__PURE__ */ jsxs(Card, { className: "hover:shadow-md transition-shadow", children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-bold", children: item.name }),
              item.sku && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mt-1", children: [
                "SKU: ",
                item.sku
              ] })
            ] }),
            getStockBadge(item)
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: "Unidad:" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: UNIT_LABELS[item.unit] })
            ] }),
            item.category && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: "Categoría:" }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", children: item.category })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: "Stock Total:" }),
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-indigo-600", children: [
                getTotalStock(item).toFixed(2),
                " ",
                item.unit
              ] })
            ] }),
            item.cost_per_unit && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: "Costo/Unidad:" }),
              /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                "$",
                item.cost_per_unit.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "flex-1",
                  onClick: (e) => handleProtectedAction(e, "inventory.update", () => handleOpenSheet(item)),
                  children: [
                    /* @__PURE__ */ jsx(Edit, { className: "w-3 h-3 mr-1" }),
                    " Editar"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: (e) => handleProtectedAction(e, "inventory.delete", () => setItemToDelete(item)),
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" })
                }
              )
            ] })
          ] })
        ] }, item.id)) }),
        items.last_page > 1 && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-2 mt-6", children: items.links.map((link, index) => /* @__PURE__ */ jsx(
          Button,
          {
            variant: link.active ? "default" : "outline",
            size: "sm",
            disabled: !link.url,
            onClick: () => link.url && router.get(link.url),
            dangerouslySetInnerHTML: { __html: link.label }
          },
          index
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Sheet, { open: isSheetOpen, onOpenChange: setIsSheetOpen, children: /* @__PURE__ */ jsxs(SheetContent, { className: "overflow-y-auto", children: [
      /* @__PURE__ */ jsxs(SheetHeader, { children: [
        /* @__PURE__ */ jsx(SheetTitle, { children: editingItem ? "Editar Item" : "Nuevo Item" }),
        /* @__PURE__ */ jsx(SheetDescription, { children: editingItem ? "Actualiza la información del item de inventario." : "Crea un nuevo item de inventario (ingrediente o insumo)." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Nombre *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              value: form.data.name,
              onChange: (e) => form.setData("name", e.target.value),
              placeholder: "Ej: Harina 00, Aceite de oliva"
            }
          ),
          form.errors.name && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600", children: form.errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "SKU (Código)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              value: form.data.sku,
              onChange: (e) => form.setData("sku", e.target.value),
              placeholder: "Opcional"
            }
          ),
          form.errors.sku && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600", children: form.errors.sku })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Unidad de Medida *" }),
          /* @__PURE__ */ jsxs(Select, { value: form.data.unit, onValueChange: (value) => form.setData("unit", value), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "kg", children: "Kilogramos (kg)" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "g", children: "Gramos (g)" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "l", children: "Litros (l)" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "ml", children: "Mililitros (ml)" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "units", children: "Unidades" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "pieces", children: "Piezas" })
            ] })
          ] }),
          form.errors.unit && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600", children: form.errors.unit })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Categoría" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              value: form.data.category,
              onChange: (e) => form.setData("category", e.target.value),
              placeholder: "Ej: Lácteos, Carnes, Verduras"
            }
          ),
          form.errors.category && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600", children: form.errors.category })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Costo por Unidad (Opcional)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              step: "0.01",
              value: form.data.cost_per_unit,
              onChange: (e) => form.setData("cost_per_unit", e.target.value),
              placeholder: "0.00"
            }
          ),
          form.errors.cost_per_unit && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600", children: form.errors.cost_per_unit }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Se calculará automáticamente con las compras." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Descripción" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              value: form.data.description,
              onChange: (e) => form.setData("description", e.target.value),
              placeholder: "Información adicional del item...",
              rows: 3
            }
          ),
          form.errors.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600", children: form.errors.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Estado *" }),
          /* @__PURE__ */ jsxs(Select, { value: form.data.status, onValueChange: (value) => form.setData("status", value), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "active", children: "Activo" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "inactive", children: "Inactivo" })
            ] })
          ] }),
          form.errors.status && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600", children: form.errors.status })
        ] }),
        /* @__PURE__ */ jsxs(SheetFooter, { className: "mt-6", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", onClick: () => setIsSheetOpen(false), children: "Cancelar" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: form.processing, children: form.processing ? "Guardando..." : editingItem ? "Actualizar" : "Crear" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!itemToDelete, onOpenChange: (open) => !open && setItemToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar este item?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "Se eliminará ",
          /* @__PURE__ */ jsx("strong", { children: itemToDelete?.name }),
          " y todos sus registros de stock. Esta acción no se puede deshacer."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { variant: "destructive", onClick: handleDelete, children: "Eliminar" })
      ] })
    ] }) }),
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
