import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, d as CardContent } from "./card-BaovBWX5.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { E as Empty, a as EmptyHeader, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import { F as FieldError } from "./field-BEfz_npx.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { I as InputGroup, a as InputGroupAddon, b as InputGroupInput } from "./input-group-BFAJKiYP.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { P as PermissionDeniedModal } from "./dropdown-menu-Dkgv2tnp.js";
import { S as SuperAdminLayout } from "./SuperAdminLayout-DVPOojgY.js";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import "@radix-ui/react-alert-dialog";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./textarea-BpljFL5D.js";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-switch";
import "vaul";
import "axios";
import "sonner";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./echo-DaX0krWj.js";
import "@ably/laravel-echo";
import "ably";
import "./ApplicationLogo-xMpxFOcX.js";
function Index({ icons, verticals, businessCategories, filters }) {
  const { auth } = usePage().props;
  const permissions = auth.permissions || [];
  const hasPermission = (permission) => {
    return permissions.includes("*") || permissions.includes(permission);
  };
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [verticalFilter, setVerticalFilter] = useState(filters.vertical_id || "all");
  const [businessCategoryFilter, setBusinessCategoryFilter] = useState(filters.business_category_id || "all");
  const [isGlobalFilter, setIsGlobalFilter] = useState(filters.is_global || "all");
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  verticalFilter !== "all" ? businessCategories.filter((bc) => bc.vertical_id.toString() === verticalFilter) : [];
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingIcon, setEditingIcon] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    name: "",
    icon: null,
    vertical_id: "",
    business_category_id: "",
    is_global: false,
    _method: "POST"
    // For update spoofing if needed, but we use post for files
  });
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("category-icons.index"), {
      search: searchTerm,
      vertical_id: verticalFilter === "all" ? null : verticalFilter,
      business_category_id: businessCategoryFilter === "all" ? null : businessCategoryFilter,
      is_global: isGlobalFilter === "all" ? null : isGlobalFilter
    }, { preserveState: true });
  };
  const openCreateModal = () => {
    setEditingIcon(null);
    reset();
    clearErrors();
    setData({
      name: "",
      icon: null,
      vertical_id: "",
      business_category_id: "",
      is_global: false,
      _method: "POST"
    });
    setIsCreateOpen(true);
  };
  const openEditModal = (icon) => {
    setEditingIcon(icon);
    clearErrors();
    setData({
      name: icon.name,
      icon: null,
      // Don't prepopulate file
      vertical_id: icon.vertical_id ? icon.vertical_id.toString() : "",
      business_category_id: icon.business_category_id ? icon.business_category_id.toString() : "",
      is_global: icon.is_global,
      _method: "PUT"
      // Route resource uses PUT/PATCH, but file upload requires POST with _method spoofing
    });
    setIsCreateOpen(true);
  };
  const submit = (e) => {
    e.preventDefault();
    if (editingIcon) {
      post(route("category-icons.update", editingIcon.id), {
        onSuccess: () => setIsCreateOpen(false)
      });
    } else {
      post(route("category-icons.store"), {
        onSuccess: () => setIsCreateOpen(false)
      });
    }
  };
  const handleDelete = (id) => {
    setDeleteId(id);
  };
  const confirmDelete = () => {
    if (deleteId) {
      router.delete(route("category-icons.destroy", deleteId), {
        onSuccess: () => setDeleteId(null)
      });
    }
  };
  return /* @__PURE__ */ jsxs(
    SuperAdminLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "font-semibold text-base text-gray-800 leading-tight", children: "Gestión de Iconos y Categorías" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Iconos de Categorías" }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-white overflow-hidden shadow-sm sm:rounded-lg p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between gap-4 mb-6", children: [
            /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "flex gap-2 items-center flex-wrap w-full md:w-auto", children: [
              /* @__PURE__ */ jsx("div", { className: "w-full md:w-64", children: /* @__PURE__ */ jsxs(InputGroup, { children: [
                /* @__PURE__ */ jsx(InputGroupAddon, { children: /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx(
                  InputGroupInput,
                  {
                    placeholder: "Buscar...",
                    value: searchTerm,
                    onChange: (e) => setSearchTerm(e.target.value)
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  value: verticalFilter,
                  onValueChange: (val) => setVerticalFilter(val),
                  children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full md:w-[220px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Todas las Verticales" }) }),
                    /* @__PURE__ */ jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las Verticales" }),
                      verticals.map((v) => /* @__PURE__ */ jsx(SelectItem, { value: v.id.toString(), children: v.name }, v.id))
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  value: isGlobalFilter,
                  onValueChange: (val) => setIsGlobalFilter(val),
                  children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full md:w-[170px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Tipo de Icono" }) }),
                    /* @__PURE__ */ jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los tipos" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "true", children: "Globales" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "false", children: "Específicos" })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(Button, { type: "submit", variant: "secondary", className: "w-full md:w-auto px-6", children: "Filtrar" })
            ] }),
            /* @__PURE__ */ jsxs(Button, { onClick: (e) => {
              if (!hasPermission("sa.categories.create")) {
                e.preventDefault();
                setShowPermissionModal(true);
              } else {
                openCreateModal();
              }
            }, className: "w-full md:w-auto", children: [
              /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
              " Nuevo Icono"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4", children: icons.data.map((icon) => /* @__PURE__ */ jsxs(Card, { className: "relative group overflow-hidden shadow-none", children: [
            /* @__PURE__ */ jsx("div", { className: " bg-gray-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: `/media/${icon.path}`,
                alt: icon.name,
                className: "w-16 h-16 object-contain border rounded-md"
              }
            ) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "p-3", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold truncate text-center text-sm", title: icon.name, children: icon.name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 text-center", children: icon.is_global ? "Global" : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "block font-medium text-blue-600", children: icon.vertical?.name || "N/A" }),
                icon.business_category && /* @__PURE__ */ jsx("span", { className: "block text-gray-400", children: icon.business_category.name })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0", children: [
              /* @__PURE__ */ jsx(Button, { size: "icon", variant: "secondary", className: "h-8 w-8 shadow-sm", onClick: () => {
                if (!hasPermission("sa.categories.edit")) {
                  setShowPermissionModal(true);
                } else {
                  openEditModal(icon);
                }
              }, children: /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsx(Button, { size: "icon", variant: "destructive", className: "h-8 w-8 shadow-sm", onClick: () => {
                if (!hasPermission("sa.categories.delete")) {
                  setShowPermissionModal(true);
                } else {
                  handleDelete(icon.id);
                }
              }, children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
            ] })
          ] }, icon.id)) }),
          icons.data.length === 0 && /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx(Empty, { children: /* @__PURE__ */ jsxs(EmptyHeader, { children: [
            /* @__PURE__ */ jsx(EmptyTitle, { children: "No se encontraron iconos" }),
            /* @__PURE__ */ jsx(EmptyDescription, { children: "No hay iconos registrados que coincidan con tu búsqueda." })
          ] }) }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsx(SharedPagination, { links: icons.links }) })
        ] }) }) }),
        /* @__PURE__ */ jsx(Dialog, { open: isCreateOpen, onOpenChange: setIsCreateOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: editingIcon ? "Editar Icono" : "Nuevo Icono" }) }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "name",
                  value: data.name,
                  onChange: (e) => setData("name", e.target.value),
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(FieldError, { children: errors.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 py-1", children: [
              /* @__PURE__ */ jsx(
                Switch,
                {
                  id: "is_global",
                  checked: data.is_global,
                  onCheckedChange: (checked) => setData("is_global", checked)
                }
              ),
              /* @__PURE__ */ jsx(Label, { htmlFor: "is_global", children: "Es Global (Disponible para todos)" })
            ] }),
            !data.is_global && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "vertical", children: "Vertical" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: data.vertical_id,
                    onValueChange: (val) => setData("vertical_id", val),
                    children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { className: "border-blue-100 bg-blue-50/30", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona Vertical" }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: verticals.map((v) => /* @__PURE__ */ jsx(SelectItem, { value: v.id.toString(), children: v.name }, v.id)) })
                    ]
                  }
                )
              ] }),
              data.vertical_id && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "business_category", children: "Categoría de Negocio (Nicho) - Opcional" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: data.business_category_id,
                    onValueChange: (val) => setData("business_category_id", val),
                    children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { className: "border-blue-100 bg-blue-50/30", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona Categoría" }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: businessCategories.filter((bc) => bc.vertical_id.toString() === data.vertical_id).map((bc) => /* @__PURE__ */ jsx(SelectItem, { value: bc.id.toString(), children: bc.name }, bc.id)) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(FieldError, { children: errors.business_category_id })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "icon", children: [
                "Icono (Imagen) ",
                editingIcon && "(Opcional)"
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "icon",
                  type: "file",
                  accept: "image/*",
                  onChange: (e) => setData("icon", e.target.files ? e.target.files[0] : null),
                  required: !editingIcon,
                  className: "cursor-pointer"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-[0.75rem] text-muted-foreground", children: "Máximo 2MB" }),
              /* @__PURE__ */ jsx(FieldError, { children: errors.icon })
            ] }),
            /* @__PURE__ */ jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setIsCreateOpen(false), children: "Cancelar" }),
              /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? "Guardando..." : "Guardar" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(AlertDialog, { open: !!deleteId, onOpenChange: (open) => !open && setDeleteId(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
          /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Estás seguro?" }),
            /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Esta acción no se puede deshacer. Esto eliminará permanentemente el icono." })
          ] }),
          /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
            /* @__PURE__ */ jsx(AlertDialogAction, { onClick: confirmDelete, className: "bg-red-600 hover:bg-red-700", children: "Eliminar" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(
          PermissionDeniedModal,
          {
            open: showPermissionModal,
            onOpenChange: setShowPermissionModal
          }
        )
      ]
    }
  );
}
export {
  Index as default
};
