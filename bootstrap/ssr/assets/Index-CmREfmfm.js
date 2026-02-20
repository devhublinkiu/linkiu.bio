import { jsxs, jsx } from "react/jsx-runtime";
import { S as SuperAdminLayout } from "./SuperAdminLayout-BMVUVnkF.js";
import { Head, Link, router } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { E as Empty, a as EmptyHeader, b as EmptyContent, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import { A as AlertDialog, h as AlertDialogTrigger, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import "react";
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
import "./input-B_4qRSOV.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./ApplicationLogo-xMpxFOcX.js";
import "class-variance-authority";
import "@radix-ui/react-alert-dialog";
function Index({ categories }) {
  const handleDelete = (id) => {
    router.delete(route("release-note-categories.destroy", id));
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: "Categorías de Release Notes", children: [
    /* @__PURE__ */ jsx(Head, { title: "Categorías - Release Notes" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto py-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-end gap-4 mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "Categorías" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Gestiona las categorías para las release notes." })
        ] }),
        /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: route("release-note-categories.create"), children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Crear categoría"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Listado" }),
          /* @__PURE__ */ jsxs(CardDescription, { children: [
            categories.length,
            " categoría(s)."
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Nombre" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Slug" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Orden" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
          ] }) }),
          /* @__PURE__ */ jsxs(TableBody, { children: [
            categories.map((cat) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: cat.name }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: cat.slug || "-" }),
              /* @__PURE__ */ jsx(TableCell, { children: cat.sort_order }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
                /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("release-note-categories.edit", cat.id), children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4 text-blue-600" }) }) }),
                /* @__PURE__ */ jsxs(AlertDialog, { children: [
                  /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-500" }) }) }),
                  /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
                    /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
                      /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar esta categoría?" }),
                      /* @__PURE__ */ jsx(AlertDialogDescription, { children: "No se puede eliminar si tiene release notes asociados." })
                    ] }),
                    /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
                      /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
                      /* @__PURE__ */ jsx(AlertDialogAction, { onClick: () => handleDelete(cat.id), className: "bg-red-600 hover:bg-red-700", children: "Eliminar" })
                    ] })
                  ] })
                ] })
              ] }) })
            ] }, cat.id)),
            categories.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, className: "h-[280px]", children: /* @__PURE__ */ jsxs(Empty, { className: "h-full", children: [
              /* @__PURE__ */ jsx(EmptyHeader, { children: /* @__PURE__ */ jsx("div", { className: "bg-gray-50 p-4 rounded-full mb-4", children: /* @__PURE__ */ jsx(Plus, { className: "h-8 w-8 text-gray-400" }) }) }),
              /* @__PURE__ */ jsxs(EmptyContent, { children: [
                /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay categorías" }),
                /* @__PURE__ */ jsx(EmptyDescription, { children: "Crea al menos una categoría para poder crear release notes." })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("release-note-categories.create"), children: "Crear primera categoría" }) }) })
            ] }) }) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "/superlinkiu/release-notes", children: "Volver a Release Notes" }) }) })
    ] })
  ] });
}
export {
  Index as default
};
