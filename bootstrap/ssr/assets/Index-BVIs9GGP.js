import { jsxs, jsx } from "react/jsx-runtime";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Checkbox } from "./checkbox-dJXZmgY3.js";
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { E as Empty, a as EmptyHeader, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import { F as FieldError } from "./field-BEfz_npx.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { I as InputGroup, a as InputGroupAddon, b as InputGroupInput } from "./input-group-BFAJKiYP.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { Plus, Search, ShieldAlert, BadgeCheck, Store, Pencil, Trash2 } from "lucide-react";
import { P as PermissionDeniedModal } from "./dropdown-menu-Dkgv2tnp.js";
import { usePage, router, useForm, Head } from "@inertiajs/react";
import { S as SuperAdminLayout } from "./SuperAdminLayout-BMVUVnkF.js";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import { useState, useEffect } from "react";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-dialog";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./textarea-BpljFL5D.js";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-alert-dialog";
import "vaul";
import "axios";
import "sonner";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./ApplicationLogo-xMpxFOcX.js";
function Index({ categories, verticals, filters, flash }) {
  const { auth, route } = usePage().props;
  const permissions = auth.permissions || [];
  const hasPermission = (p) => permissions.includes("*") || permissions.includes(p);
  const categoriesList = categories.data || categories;
  const categoriesLinks = categories.links || [];
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [search, setSearch] = useState(filters.search || "");
  const [verticalFilter, setVerticalFilter] = useState(filters.vertical_id || "all");
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== filters.search) {
        router.get(route("categories.index"), {
          search,
          vertical_id: verticalFilter === "all" ? "" : verticalFilter
        }, { preserveState: true, replace: true });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  const handleVerticalChange = (value) => {
    setVerticalFilter(value);
    router.get(route("categories.index"), {
      search,
      vertical_id: value === "all" ? "" : value
    }, { preserveState: true, replace: true });
  };
  const { data: createData, setData: setCreateData, post: createPost, processing: createProcessing, errors: createErrors, reset: createReset } = useForm({
    name: "",
    vertical_id: "",
    require_verification: false
  });
  const submitCreate = (e) => {
    e.preventDefault();
    createPost(route("categories.store"), {
      onSuccess: () => {
        createReset();
        setCreateOpen(false);
      }
    });
  };
  const { data: editData, setData: setEditData, put: editPut, processing: editProcessing, errors: editErrors, reset: editReset } = useForm({
    name: "",
    vertical_id: "",
    require_verification: false
  });
  const openEdit = (category) => {
    if (!hasPermission("sa.categories.update")) {
      setShowPermissionModal(true);
      return;
    }
    setEditingCategory(category);
    setEditData({
      name: category.name,
      vertical_id: category.vertical_id.toString(),
      require_verification: Boolean(category.require_verification)
    });
    setEditOpen(true);
  };
  const submitEdit = (e) => {
    e.preventDefault();
    editPut(route("categories.update", editingCategory.id), {
      onSuccess: () => {
        setEditOpen(false);
        setEditingCategory(null);
      }
    });
  };
  const openDelete = (category) => {
    if (!hasPermission("sa.categories.delete")) {
      setShowPermissionModal(true);
      return;
    }
    setDeletingCategory(category);
    setDeleteOpen(true);
  };
  const submitDelete = () => {
    if (!deletingCategory) return;
    router.delete(route("categories.destroy", deletingCategory.id), {
      onSuccess: () => setDeleteOpen(false)
    });
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: "Categorías de Negocio", children: [
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    ),
    /* @__PURE__ */ jsx(Head, { title: "Categorías" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight", children: "Gestión de Categorías" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Define las reglas para cada tipo de negocio." })
      ] }),
      /* @__PURE__ */ jsxs(Dialog, { open: createOpen, onOpenChange: setCreateOpen, children: [
        /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { onClick: (e) => {
          if (!hasPermission("sa.categories.create")) {
            e.preventDefault();
            setShowPermissionModal(true);
          }
        }, children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Nueva Categoría"
        ] }) }),
        /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-[425px]", children: /* @__PURE__ */ jsxs("form", { onSubmit: submitCreate, children: [
          /* @__PURE__ */ jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsx(DialogTitle, { children: "Crear Categoría" }),
            /* @__PURE__ */ jsx(DialogDescription, { children: "Añade una nueva categoría para que los tenants la seleccionen." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "c-name", children: "Nombre" }),
              /* @__PURE__ */ jsx(Input, { id: "c-name", value: createData.name, onChange: (e) => setCreateData("name", e.target.value), required: true }),
              /* @__PURE__ */ jsx(FieldError, { children: createErrors.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "c-vertical", children: "Vertical" }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  value: createData.vertical_id,
                  onValueChange: (value) => setCreateData("vertical_id", value),
                  children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona Vertical..." }) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: verticals.map((v) => /* @__PURE__ */ jsx(SelectItem, { value: v.id.toString(), children: v.name }, v.id)) })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(FieldError, { children: createErrors.vertical_id })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 mt-2 border p-3 rounded-md bg-gray-50", children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  id: "c-verif",
                  checked: createData.require_verification,
                  onCheckedChange: (checked) => setCreateData("require_verification", checked === true)
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5 leading-none", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "c-verif", className: "text-sm font-medium leading-none cursor-pointer", children: "Requiere Aprobación Manual" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Para negocios regulados (Salud, Alcohol)." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: createProcessing, children: "Guardar" }) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full max-sm:w-full md:max-w-sm", children: /* @__PURE__ */ jsxs(InputGroup, { children: [
        /* @__PURE__ */ jsx(InputGroupAddon, { children: /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsx(
          InputGroupInput,
          {
            type: "search",
            placeholder: "Buscar categorías...",
            value: search,
            onChange: (e) => setSearch(e.target.value)
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs(Select, { value: verticalFilter, onValueChange: handleVerticalChange, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full md:w-[200px] bg-white", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Filtrar por Vertical" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las Verticales" }),
          verticals.map((v) => /* @__PURE__ */ jsx(SelectItem, { value: v.id.toString(), children: v.name }, v.id))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-md border shadow-sm", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Nombre" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Vertical" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Aprobación" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Tiendas" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
      ] }) }),
      /* @__PURE__ */ jsxs(TableBody, { children: [
        categoriesList.map((category) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxs(TableCell, { className: "font-medium", children: [
            /* @__PURE__ */ jsx("div", { children: category.name }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
              "/",
              category.slug
            ] })
          ] }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: category.vertical?.name }) }),
          /* @__PURE__ */ jsx(TableCell, { children: category.require_verification ? /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "gap-1 text-amber-600 bg-amber-50 hover:bg-amber-100", children: [
            /* @__PURE__ */ jsx(ShieldAlert, { className: "h-3 w-3" }),
            "Manual"
          ] }) : /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "gap-1 text-green-600 bg-green-50 hover:bg-green-100", children: [
            /* @__PURE__ */ jsx(BadgeCheck, { className: "h-3 w-3" }),
            "Automática"
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center text-gray-500", children: [
            /* @__PURE__ */ jsx(Store, { className: "h-4 w-4 mr-1" }),
            category.tenants_count
          ] }) }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-right space-x-2", children: [
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => openEdit(category), children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4 text-gray-500" }) }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "text-red-500 hover:text-red-700 hover:bg-red-50", onClick: () => openDelete(category), children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
          ] })
        ] }, category.id)),
        categoriesList.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 5, className: "py-12", children: /* @__PURE__ */ jsx(Empty, { children: /* @__PURE__ */ jsxs(EmptyHeader, { children: [
          /* @__PURE__ */ jsx(EmptyTitle, { children: "No se encontraron categorías" }),
          /* @__PURE__ */ jsx(EmptyDescription, { children: "No hay categorías registradas que coincidan con tu búsqueda." })
        ] }) }) }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsx(SharedPagination, { links: categoriesLinks }) }),
    /* @__PURE__ */ jsx(Dialog, { open: editOpen, onOpenChange: setEditOpen, children: /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-[425px]", children: /* @__PURE__ */ jsxs("form", { onSubmit: submitEdit, children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Editar Categoría" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Modifica los datos de la categoría." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "e-name", children: "Nombre" }),
          /* @__PURE__ */ jsx(Input, { id: "e-name", value: editData.name, onChange: (e) => setEditData("name", e.target.value), required: true }),
          /* @__PURE__ */ jsx(FieldError, { children: editErrors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "e-vertical", children: "Vertical" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: editData.vertical_id,
              onValueChange: (value) => setEditData("vertical_id", value),
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona Vertical..." }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: verticals.map((v) => /* @__PURE__ */ jsx(SelectItem, { value: v.id.toString(), children: v.name }, v.id)) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(FieldError, { children: editErrors.vertical_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 mt-2 border p-3 rounded-md bg-gray-50", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              id: "e-verif",
              checked: editData.require_verification,
              onCheckedChange: (checked) => setEditData("require_verification", checked === true)
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "grid gap-1.5 leading-none", children: /* @__PURE__ */ jsx(Label, { htmlFor: "e-verif", className: "text-sm font-medium leading-none cursor-pointer", children: "Requiere Aprobación Manual" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: editProcessing, children: "Actualizar" }) })
    ] }) }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: deleteOpen, onOpenChange: setDeleteOpen, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Estás completamente seguro?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "Esta acción no se puede deshacer. Se eliminará la categoría ",
          /* @__PURE__ */ jsx("strong", { children: deletingCategory?.name }),
          ".",
          deletingCategory?.tenants_count > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-2 p-2 bg-red-50 text-red-600 rounded-md font-medium border border-red-200", children: [
            "⚠️ ¡Atención! Esta categoría tiene ",
            deletingCategory.tenants_count,
            " tiendas asociadas. El sistema bloqueará esta eliminación."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: submitDelete, className: "bg-red-600 hover:bg-red-700", children: "Eliminar" })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
