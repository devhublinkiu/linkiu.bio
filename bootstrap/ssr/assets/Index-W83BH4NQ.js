import { jsxs, jsx } from "react/jsx-runtime";
import { S as SuperAdminLayout } from "./SuperAdminLayout-BMVUVnkF.js";
import { Head, Link, router } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { FolderPlus, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { E as Empty, a as EmptyHeader, b as EmptyContent, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import { A as AlertDialog, h as AlertDialogTrigger, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import { useState } from "react";
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
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./ApplicationLogo-xMpxFOcX.js";
import "class-variance-authority";
import "@radix-ui/react-select";
import "@radix-ui/react-alert-dialog";
const TYPE_LABELS = {
  new: "Nuevo",
  fix: "Corrección",
  improvement: "Mejora",
  security: "Seguridad",
  performance: "Rendimiento"
};
function Index({ releases, categories, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const releasesList = releases.data || releases;
  const releasesLinks = releases.links || [];
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("release-notes.index"), { search, category_id: filters.category_id }, { preserveState: true, replace: true });
  };
  const handleCategoryFilter = (value) => {
    router.get(route("release-notes.index"), { search, category_id: value || void 0 }, { preserveState: true, replace: true });
  };
  const handleDelete = (id) => {
    router.delete(route("release-notes.destroy", id));
  };
  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: "Release Notes", children: [
    /* @__PURE__ */ jsx(Head, { title: "Release Notes" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto py-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-end gap-4 mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "Release Notes" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Novedades y changelog para la página pública." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 w-full md:w-auto", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: route("release-note-categories.index"), children: [
            /* @__PURE__ */ jsx(FolderPlus, { className: "mr-2 h-4 w-4" }),
            "Crear categoría"
          ] }) }),
          /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: route("release-notes.create"), children: [
            /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
            "Nuevo release"
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Listado" }),
            /* @__PURE__ */ jsxs(CardDescription, { children: [
              "Mostrando ",
              releasesList.length,
              " entrada(s)."
            ] })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "flex gap-2 flex-1 sm:max-w-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Buscar por título...",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  className: "pl-9"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(Button, { type: "submit", variant: "secondary", children: "Buscar" })
          ] }),
          categories.length > 0 && /* @__PURE__ */ jsxs(Select, { value: filters.category_id || "all", onValueChange: handleCategoryFilter, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Categoría" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las categorías" }),
              categories.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: String(c.id), children: c.name }, c.id))
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Título" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Categoría" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Tipo" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Fecha" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
            ] }) }),
            /* @__PURE__ */ jsxs(TableBody, { children: [
              releasesList.map((r) => /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  r.cover_url && /* @__PURE__ */ jsx("img", { src: r.cover_url, alt: "", className: "h-10 w-14 object-cover rounded" }),
                  /* @__PURE__ */ jsx("span", { children: r.title }),
                  r.is_featured && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Destacado" })
                ] }) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: r.release_note_category?.name ?? "-" }) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: TYPE_LABELS[r.type] ?? r.type }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: formatDate(r.published_at) }),
                /* @__PURE__ */ jsx(TableCell, { children: r.status === "published" ? /* @__PURE__ */ jsx(Badge, { className: "bg-green-600", children: "Publicado" }) : /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Borrador" }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("release-notes.edit", r.id), children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4 text-blue-600" }) }) }),
                  /* @__PURE__ */ jsxs(AlertDialog, { children: [
                    /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-500" }) }) }),
                    /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
                      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
                        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar este release note?" }),
                        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Esta acción no se puede deshacer." })
                      ] }),
                      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
                        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
                        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: () => handleDelete(r.id), className: "bg-red-600 hover:bg-red-700", children: "Eliminar" })
                      ] })
                    ] })
                  ] })
                ] }) })
              ] }, r.id)),
              releasesList.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "h-[300px]", children: /* @__PURE__ */ jsxs(Empty, { className: "h-full", children: [
                /* @__PURE__ */ jsx(EmptyHeader, { children: /* @__PURE__ */ jsx("div", { className: "bg-gray-50 p-4 rounded-full mb-4", children: /* @__PURE__ */ jsx(Plus, { className: "h-8 w-8 text-gray-400" }) }) }),
                /* @__PURE__ */ jsxs(EmptyContent, { children: [
                  /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay release notes" }),
                  /* @__PURE__ */ jsx(EmptyDescription, { children: "Crea el primero o gestiona las categorías desde el botón «Crear categoría»." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-6 flex gap-2", children: [
                  /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("release-notes.create"), children: "Crear release note" }) }),
                  /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("release-note-categories.index"), children: "Ir a categorías" }) })
                ] })
              ] }) }) })
            ] })
          ] }),
          releasesLinks.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsx(SharedPagination, { links: releasesLinks }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
