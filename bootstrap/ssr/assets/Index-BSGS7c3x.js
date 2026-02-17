import { jsxs, jsx } from "react/jsx-runtime";
import { S as SuperAdminLayout } from "./SuperAdminLayout-C_fBwscp.js";
import { usePage, Head, router } from "@inertiajs/react";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { AlertCircle, ExternalLink, Image } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import { toast } from "sonner";
import { useEffect } from "react";
import "./button-BdX_X5dq.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./dropdown-menu-B2I3vWlQ.js";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./input-B_4qRSOV.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BclLUCFD.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./ApplicationLogo-xMpxFOcX.js";
import "@radix-ui/react-select";
function Index({ reports, filters, statuses }) {
  const { flash } = usePage().props;
  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
  }, [flash?.success]);
  const handleStatusChange = (reportId, status) => {
    router.patch(route("superadmin.store-reports.update-status", reportId), { status }, {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: "Reportes tiendas", children: [
    /* @__PURE__ */ jsx(Head, { title: "Reportes tiendas" }),
    /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "size-5" }),
          "Reportes de problemas con negocios"
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Reportes enviados por usuarios desde las tiendas. Email y WhatsApp son opcionales (pueden ser anónimos)." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4 flex flex-wrap gap-2", children: /* @__PURE__ */ jsxs(
          Select,
          {
            value: filters.status ?? "all",
            onValueChange: (v) => router.get(route("superadmin.store-reports.index"), { ...filters, status: v === "all" ? void 0 : v }, { preserveState: true }),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Estado" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los estados" }),
                Object.entries(statuses).map(([key, label]) => /* @__PURE__ */ jsx(SelectItem, { value: key, children: label }, key))
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Tienda" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Categoría" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Mensaje" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Contacto" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Evidencia" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Fecha" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: reports.data.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "text-center text-muted-foreground py-8", children: "No hay reportes." }) }) : reports.data.map((r) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { children: r.tenant ? /* @__PURE__ */ jsxs(
              "a",
              {
                href: route("tenants.show", r.tenant.id),
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-primary hover:underline flex items-center gap-1",
                children: [
                  r.tenant.name,
                  /* @__PURE__ */ jsx(ExternalLink, { className: "size-3" })
                ]
              }
            ) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "—" }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("span", { className: "text-sm", children: r.category_label }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "max-w-[200px]", children: /* @__PURE__ */ jsx("span", { className: "text-sm line-clamp-2", title: r.message, children: r.message_preview }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: r.reporter_email || r.reporter_whatsapp ? /* @__PURE__ */ jsxs("span", { children: [
              r.reporter_email && /* @__PURE__ */ jsx("span", { children: r.reporter_email }),
              r.reporter_email && r.reporter_whatsapp && " · ",
              r.reporter_whatsapp && /* @__PURE__ */ jsx("span", { children: r.reporter_whatsapp })
            ] }) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Anónimo" }) }),
            /* @__PURE__ */ jsx(TableCell, { children: r.image_url ? /* @__PURE__ */ jsxs(
              "a",
              {
                href: r.image_url,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-primary hover:underline flex items-center gap-1 text-sm",
                children: [
                  /* @__PURE__ */ jsx(Image, { className: "size-4" }),
                  "Ver"
                ]
              }
            ) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "—" }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(
              Select,
              {
                value: r.status,
                onValueChange: (v) => handleStatusChange(r.id, v),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[140px]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: Object.entries(statuses).map(([key, label]) => /* @__PURE__ */ jsx(SelectItem, { value: key, children: label }, key)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-muted-foreground", children: formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: es }) })
          ] }, r.id)) })
        ] }),
        reports.data.length > 0 && /* @__PURE__ */ jsx(SharedPagination, { links: reports.links, className: "mt-4" })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
