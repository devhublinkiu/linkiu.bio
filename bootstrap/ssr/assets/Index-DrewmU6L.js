import { jsxs, jsx } from "react/jsx-runtime";
import { S as SuperAdminLayout } from "./SuperAdminLayout-BMVUVnkF.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { Search, Plus, Store } from "lucide-react";
import { useState } from "react";
import { P as PermissionDeniedModal, A as Avatar, k as AvatarFallback } from "./dropdown-menu-Dkgv2tnp.js";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import { I as InputGroup, a as InputGroupAddon, b as InputGroupInput } from "./input-group-BFAJKiYP.js";
import { E as Empty, a as EmptyHeader, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import "sonner";
import "./ApplicationLogo-xMpxFOcX.js";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "vaul";
import "axios";
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
import "./textarea-BpljFL5D.js";
function Index({ tenants, filters }) {
  const { auth } = usePage().props;
  const permissions = auth.permissions || [];
  const hasPermission = (p) => permissions.includes("*") || permissions.includes(p);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [search, setSearch] = useState(filters.search || "");
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("tenants.index"), { search }, { preserveState: true });
  };
  const handleCreateClick = (e) => {
    if (!hasPermission("sa.tenants.create")) {
      e.preventDefault();
      setShowPermissionModal(true);
    }
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: "Gestión de Tiendas", children: [
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    ),
    /* @__PURE__ */ jsx(Head, { title: "Tiendas" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("form", { onSubmit: handleSearch, className: "w-full max-w-sm", children: /* @__PURE__ */ jsxs(InputGroup, { children: [
          /* @__PURE__ */ jsx(InputGroupAddon, { children: /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(
            InputGroupInput,
            {
              placeholder: "Buscar por nombre, enlace o NIT...",
              value: search,
              onChange: (e) => setSearch(e.target.value)
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: route("tenants.create"), onClick: handleCreateClick, children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
          "Nueva Tienda"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Listado de Tiendas" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Todas las tiendas registradas en la plataforma." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Nombre / Slug" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Vertical / Categoría" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Identificación" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Registro" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: tenants.data.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 5, className: "py-8", children: /* @__PURE__ */ jsx(Empty, { children: /* @__PURE__ */ jsxs(EmptyHeader, { children: [
              /* @__PURE__ */ jsx(EmptyTitle, { children: "No se encontraron tiendas" }),
              /* @__PURE__ */ jsx(EmptyDescription, { children: "No hay tiendas registradas que coincidan con tu búsqueda." })
            ] }) }) }) }) : tenants.data.map((tenant) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(Avatar, { className: "h-10 w-10 bg-blue-100 text-blue-600 rounded-lg", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-transparent rounded-lg", children: /* @__PURE__ */ jsx(Store, { className: "h-5 w-5" }) }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx("span", { children: tenant.name }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    "/",
                    tenant.slug
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: tenant.category?.vertical?.name || "-" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: tenant.category?.name || "-" })
              ] }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("span", { className: "text-xs bg-gray-100 px-2 py-1 rounded", children: tenant.doc_number || "N/A" }) }),
              /* @__PURE__ */ jsx(TableCell, { children: new Date(tenant.created_at).toLocaleDateString() }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("tenants.show", tenant.id), children: "Ver Detalle" }) }) })
            ] }, tenant.id)) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsx(SharedPagination, { links: tenants.links }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
