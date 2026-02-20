import { jsxs, jsx } from "react/jsx-runtime";
import React__default, { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CegS7XIj.js";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import { toast } from "sonner";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { S as Sheet, b as SheetContent, c as SheetHeader, d as SheetTitle, e as SheetDescription } from "./sheet-BFMMArVC.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { C as Card, d as CardContent } from "./card-BaovBWX5.js";
import { Plus, Loader2, Edit, Trash2, FolderTree, HelpCircle } from "lucide-react";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { A as Avatar, j as AvatarImage, k as AvatarFallback, P as PermissionDeniedModal } from "./dropdown-menu-Dkgv2tnp.js";
import { S as Separator } from "./separator-DbxqJzR0.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { E as Empty, a as EmptyHeader, e as EmptyMedia, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-rtCrEhXP.js";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "@radix-ui/react-switch";
import "vaul";
import "axios";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-separator";
import "@radix-ui/react-alert-dialog";
function Index({ categories, availableIcons, myRequests, parents }) {
  const requestsList = myRequests.data ?? [];
  const requestsLinks = myRequests.links ?? [];
  const { currentTenant, currentUserRole } = usePage().props;
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRequestIconOpen, setIsRequestIconOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [iconSearch, setIconSearch] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
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
  const { data, setData, post, put, processing, errors, reset, clearErrors, transform } = useForm({
    name: "",
    category_icon_id: "",
    parent_id: "root"
    // 'root' or ID
  });
  const { data: requestData, setData: setRequestData, post: postRequest, processing: processingRequest, errors: errorsRequest, reset: resetRequest } = useForm({
    requested_name: "",
    reference_image: null
  });
  const openCreate = () => {
    setEditingCategory(null);
    reset();
    clearErrors();
    setIsCreateOpen(true);
  };
  const openEdit = (category) => {
    setEditingCategory(category);
    clearErrors();
    setData({
      name: category.name,
      category_icon_id: category.category_icon_id.toString(),
      parent_id: category.parent_id ? category.parent_id.toString() : "root"
    });
    setIsCreateOpen(true);
  };
  const submit = (e) => {
    e.preventDefault();
    transform((data2) => ({
      ...data2,
      parent_id: data2.parent_id === "root" ? null : data2.parent_id
    }));
    if (editingCategory) {
      put(route("tenant.categories.update", [currentTenant?.slug, editingCategory.id]), {
        onSuccess: () => {
          toast.success("Categoría actualizada correctamente");
          setIsCreateOpen(false);
        }
      });
    } else {
      post(route("tenant.categories.store", currentTenant?.slug), {
        onSuccess: () => {
          toast.success("Categoría creada correctamente");
          setIsCreateOpen(false);
        }
      });
    }
  };
  const handleDelete = (categoryId) => {
    router.delete(route("tenant.categories.destroy", [currentTenant?.slug, categoryId]), {
      onSuccess: () => {
        toast.success("Categoría eliminada con éxito");
        setCategoryToDelete(null);
      }
    });
  };
  const submitRequestIcon = (e) => {
    e.preventDefault();
    postRequest(route("tenant.categories.request-icon", currentTenant?.slug), {
      onSuccess: () => {
        setIsRequestIconOpen(false);
        resetRequest();
      }
    });
  };
  const filteredIcons = availableIcons.filter(
    (icon) => icon.name.toLowerCase().includes(iconSearch.toLowerCase())
  );
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Categorías", children: [
    /* @__PURE__ */ jsx(Head, { title: "Categorías" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Categorías" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Organiza tus productos en categorías." })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: (e) => handleProtectedAction(e, "categories.create", openCreate),
          className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0",
          children: [
            /* @__PURE__ */ jsx(Plus, {}),
            " Nueva Categoría"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-4", children: [
        /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { className: "w-[80px]", children: "Icono" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Nombre" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Tipo" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Productos" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Estado" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: categories.data.map((category) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Avatar, { className: "rounded-lg", children: [
              category.icon && /* @__PURE__ */ jsx(AvatarImage, { src: `/media/${category.icon.path}`, alt: category.icon.name, className: "object-contain p-1" }),
              /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-muted", children: /* @__PURE__ */ jsx("div", { className: "size-2 rounded-full bg-slate-300" }) })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: category.name }),
            /* @__PURE__ */ jsx(TableCell, { children: category.parent ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-[10px] uppercase tracking-wider font-bold", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Subcategoría" }),
              /* @__PURE__ */ jsx("span", { children: category.parent.name })
            ] }) : /* @__PURE__ */ jsx(Badge, { variant: "outline", children: "Principal" }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: category.products_count || 0 }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: togglingId === category.id ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin mx-auto text-muted-foreground" }) : /* @__PURE__ */ jsx(
              Switch,
              {
                className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0",
                checked: category.is_active,
                onCheckedChange: () => handleProtectedAction(null, "categories.update", () => {
                  setTogglingId(category.id);
                  router.patch(route("tenant.categories.toggle-active", [currentTenant?.slug, category.id]), {}, {
                    preserveScroll: true,
                    onFinish: () => setTogglingId(null)
                  });
                })
              }
            ) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0",
                  onClick: (e) => handleProtectedAction(e, "categories.update", () => openEdit(category)),
                  children: /* @__PURE__ */ jsx(Edit, {})
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0 text-red-500 hover:text-red-600 hover:bg-red-50",
                  onClick: (e) => handleProtectedAction(e, "categories.delete", () => setCategoryToDelete(category)),
                  children: /* @__PURE__ */ jsx(Trash2, {})
                }
              )
            ] }) })
          ] }, category.id)) })
        ] }) }) }),
        categories.data.length === 0 && /* @__PURE__ */ jsxs(Empty, { className: "border-2 border-dashed rounded-xl bg-white py-12", children: [
          /* @__PURE__ */ jsxs(EmptyHeader, { children: [
            /* @__PURE__ */ jsx(EmptyMedia, { variant: "icon", children: /* @__PURE__ */ jsx(FolderTree, { className: "size-8 text-muted-foreground" }) }),
            /* @__PURE__ */ jsx(EmptyTitle, { children: "No tienes categorías creadas" }),
            /* @__PURE__ */ jsx(EmptyDescription, { children: "Crea categorías para organizar tus productos en la carta digital y el POS." })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              className: "mt-4 cursor-pointer",
              onClick: (e) => handleProtectedAction(e, "categories.create", openCreate),
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-2" }),
                " Nueva Categoría"
              ]
            }
          )
        ] }),
        categories.data.length > 0 && categories.links && categories.links.length > 1 && /* @__PURE__ */ jsx("div", { className: "flex justify-center pt-4", children: /* @__PURE__ */ jsx(SharedPagination, { links: categories.links }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "md:col-span-1", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-semibold mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(HelpCircle, { className: "h-4 w-4" }),
          " Mis Solicitudes de Iconos"
        ] }),
        requestsList.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "No has solicitado iconos." }) : /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          requestsList.map((req, index) => /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2 px-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: req.requested_name }),
              /* @__PURE__ */ jsx(Badge, { variant: req.status === "approved" ? "default" : req.status === "rejected" ? "destructive" : "secondary", children: req.status === "approved" ? "Aprobado" : req.status === "rejected" ? "Rechazado" : "Pendiente" })
            ] }),
            index < requestsList.length - 1 && /* @__PURE__ */ jsx(Separator, { className: "opacity-50" })
          ] }, req.id)),
          /* @__PURE__ */ jsx("div", { className: "flex justify-center pt-2", children: /* @__PURE__ */ jsx(SharedPagination, { links: requestsLinks, className: "scale-90" }) })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            className: "w-full mt-4 cursor-pointer ring-0 hover:ring-0 focus:ring-0",
            onClick: (e) => handleProtectedAction(e, "categories.create", () => setIsRequestIconOpen(true)),
            children: "Solicitar Icono Nuevo"
          }
        )
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsx(Sheet, { open: isCreateOpen, onOpenChange: setIsCreateOpen, children: /* @__PURE__ */ jsxs(SheetContent, { side: "right", children: [
      /* @__PURE__ */ jsxs(SheetHeader, { children: [
        /* @__PURE__ */ jsx(SheetTitle, { children: editingCategory ? "Editar Categoría" : "Nueva Categoría" }),
        /* @__PURE__ */ jsx(SheetDescription, { children: "Configura los detalles de la categoría." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6 mt-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "name",
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              required: true,
              className: "ring-0 hover:ring-0 focus:ring-0"
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "parent", children: "Categoría Superior (Opcional)" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: data.parent_id,
              onValueChange: (val) => setData("parent_id", val),
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "ring-0 hover:ring-0 focus:ring-0 cursor-pointer", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona..." }) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "root", children: "Ninguna (Categoría Principal)" }),
                  parents.filter((p) => !editingCategory || p.id !== editingCategory.id).map((p) => /* @__PURE__ */ jsx(SelectItem, { value: p.id.toString(), className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: p.name }, p.id))
                ] })
              ]
            }
          ),
          errors.parent_id && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs", children: errors.parent_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Icono" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "Buscar icono...",
              className: "mb-2 ring-0 hover:ring-0 focus:ring-0",
              value: iconSearch,
              onChange: (e) => setIconSearch(e.target.value)
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-2 border rounded-md p-2 max-h-48 overflow-y-auto", children: [
            filteredIcons.map((icon) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: `cursor-pointer rounded border p-2 flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${data.category_icon_id == icon.id.toString() ? "border-primary bg-primary/5" : "border-muted hover:bg-muted/50"}`,
                onClick: () => setData("category_icon_id", icon.id.toString()),
                children: [
                  /* @__PURE__ */ jsx("img", { src: `/media/${icon.path}`, alt: icon.name, className: "w-8 h-8 object-contain" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] truncate w-full text-center", title: icon.name, children: icon.name })
                ]
              },
              icon.id
            )),
            filteredIcons.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-4 text-center py-4 text-xs text-muted-foreground", children: "No se encontraron iconos." })
          ] }),
          errors.category_icon_id && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs", children: errors.category_icon_id }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-center pt-2", children: [
            "¿No encuentras el icono? ",
            /* @__PURE__ */ jsx("button", { type: "button", className: "text-blue-600 underline", onClick: () => setIsRequestIconOpen(true), children: "Solicita uno nuevo" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-4", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", onClick: () => setIsCreateOpen(false), children: "Cancelar" }),
          /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: processing, className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: [
            processing ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin mr-2" }) : null,
            editingCategory ? "Guardar Cambios" : "Crear Categoría"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: isRequestIconOpen, onOpenChange: setIsRequestIconOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Solicitar Nuevo Icono" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Sube una imagen de referencia y nosotros crearemos el icono para ti." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submitRequestIcon, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "req_name", children: "Nombre del Icono" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "req_name",
              value: requestData.requested_name,
              onChange: (e) => setRequestData("requested_name", e.target.value),
              required: true,
              className: "ring-0 hover:ring-0 focus:ring-0"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "req_image",
              type: "file",
              accept: "image/*",
              onChange: (e) => setRequestData("reference_image", e.target.files ? e.target.files[0] : null),
              required: true,
              className: "ring-0 hover:ring-0 focus:ring-0 border-dashed"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-[0.8rem] text-muted-foreground", children: "Máximo 2MB" }),
          errorsRequest.reference_image && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs", children: errorsRequest.reference_image })
        ] }),
        /* @__PURE__ */ jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", onClick: () => setIsRequestIconOpen(false), children: "Cancelar" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processingRequest, className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: "Enviar Solicitud" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!categoryToDelete, onOpenChange: (open) => !open && setCategoryToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar Categoría?" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: (categoryToDelete?.all_products_count ?? categoryToDelete?.products_count ?? 0) > 0 || (categoryToDelete?.children_count || 0) > 0 ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-red-500 font-bold", children: "No se puede eliminar esta categoría." }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-1", children: [
            ((categoryToDelete?.all_products_count ?? categoryToDelete?.products_count) || 0) > 0 && /* @__PURE__ */ jsxs("li", { children: [
              "Tiene ",
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: categoryToDelete?.all_products_count ?? categoryToDelete?.products_count }),
              " productos asociados."
            ] }),
            (categoryToDelete?.children_count || 0) > 0 && /* @__PURE__ */ jsxs("li", { children: [
              "Tiene ",
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: categoryToDelete?.children_count }),
              " subcategorías asociadas."
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Debes mover o eliminar estos elementos antes de borrar la categoría." })
        ] }) : /* @__PURE__ */ jsxs("p", { children: [
          "¿Estás seguro de que deseas eliminar la categoría ",
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: categoryToDelete?.name }),
          "? Esta acción no se puede deshacer."
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0", children: "Cerrar" }),
        ((categoryToDelete?.all_products_count ?? categoryToDelete?.products_count) || 0) === 0 && (!categoryToDelete?.children_count || categoryToDelete.children_count === 0) && /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: () => categoryToDelete && handleDelete(categoryToDelete.id),
            variant: "destructive",
            className: "cursor-pointer ring-0 hover:ring-0 focus:ring-0",
            children: "Eliminar"
          }
        )
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
