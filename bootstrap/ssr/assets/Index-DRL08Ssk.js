import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CdwLWQ00.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { toast } from "sonner";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, d as CardContent } from "./card-BaovBWX5.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { E as Empty, a as EmptyHeader, e as EmptyMedia, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import { Settings, Loader2, RefreshCw, Mic2, CalendarClock, ExternalLink } from "lucide-react";
import { P as PermissionDeniedModal } from "./dropdown-menu-Dkgv2tnp.js";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import "./echo-DaX0krWj.js";
import "@ably/laravel-echo";
import "ably";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-vY7u-Ro3.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "vaul";
import "axios";
import "./input-B_4qRSOV.js";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
const STATUS_LABELS = {
  live: "En vivo",
  upcoming: "Próximo",
  completed: "Grabado"
};
function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" });
}
function toDatetimeLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:${min}`;
}
function Index({ sermons, youtube_config }) {
  const { currentTenant, currentUserRole } = usePage().props;
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [editingSermon, setEditingSermon] = useState(null);
  const [editStatus, setEditStatus] = useState("completed");
  const [editLiveStartAt, setEditLiveStartAt] = useState("");
  const [saving, setSaving] = useState(false);
  const hasPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner === true || currentUserRole.permissions?.includes("*") === true || currentUserRole.permissions?.includes(permission) === true;
  };
  const withPermission = (permission, fn) => {
    if (hasPermission(permission)) fn();
    else setShowPermissionModal(true);
  };
  const handleSync = () => {
    withPermission("sermons.update", () => {
      setSyncing(true);
      router.post(route("tenant.admin.sermons.sync", currentTenant?.slug), {}, {
        preserveScroll: true,
        onSuccess: () => toast.success("Sincronización completada"),
        onError: () => toast.error("Error al sincronizar. Revisa el canal y la API key."),
        onFinish: () => setSyncing(false)
      });
    });
  };
  const openEdit = (s) => {
    setEditingSermon(s);
    setEditStatus(s.status);
    setEditLiveStartAt(toDatetimeLocal(s.live_start_at));
  };
  const handleSaveProgram = () => {
    if (!editingSermon || !currentTenant?.slug) return;
    withPermission("sermons.update", () => {
      setSaving(true);
      router.put(
        route("tenant.admin.sermons.update", [currentTenant.slug, editingSermon.id]),
        {
          status: editStatus,
          live_start_at: editLiveStartAt.trim() || null
        },
        {
          preserveScroll: true,
          onSuccess: () => {
            toast.success("Predica actualizada");
            setEditingSermon(null);
          },
          onError: () => toast.error("Error al guardar"),
          onFinish: () => setSaving(false)
        }
      );
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Predicas", children: [
    /* @__PURE__ */ jsx(Head, { title: "Predicas" }),
    /* @__PURE__ */ jsx(PermissionDeniedModal, { open: showPermissionModal, onOpenChange: setShowPermissionModal }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Predicas" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Vídeos sincronizados desde tu canal. En vivo y próximas se detectan solas al sincronizar; puedes editarlas si necesitas." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Link, { href: route("tenant.admin.sermons.config", currentTenant?.slug), children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-2", children: [
            /* @__PURE__ */ jsx(Settings, { className: "size-4" }),
            "Configurar canal"
          ] }) }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              size: "sm",
              className: "gap-2",
              disabled: syncing || !youtube_config.youtube_channel_id,
              onClick: handleSync,
              children: [
                syncing ? /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsx(RefreshCw, { className: "size-4" }),
                "Sincronizar"
              ]
            }
          )
        ] })
      ] }),
      youtube_config.last_synced_at && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "Última sincronización: ",
        new Date(youtube_config.last_synced_at).toLocaleString("es")
      ] }),
      sermons.data.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-16", children: /* @__PURE__ */ jsxs(Empty, { children: [
        /* @__PURE__ */ jsxs(EmptyHeader, { children: [
          /* @__PURE__ */ jsx(EmptyMedia, { variant: "icon", children: /* @__PURE__ */ jsx(Mic2, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay predicas" }),
          /* @__PURE__ */ jsx(EmptyDescription, { children: "Configura tu canal de YouTube y pulsa Sincronizar para importar los vídeos y transmisiones." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2 mt-4", children: /* @__PURE__ */ jsx(Link, { href: route("tenant.admin.sermons.config", currentTenant?.slug), children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "gap-2", children: [
          /* @__PURE__ */ jsx(Settings, { className: "size-4" }),
          "Configurar canal"
        ] }) }) })
      ] }) }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { className: "w-[100px]", children: "Miniatura" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Título" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Fecha" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Duración" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: sermons.data.map((s) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { children: s.thumbnail_url ? /* @__PURE__ */ jsx(
              "img",
              {
                src: s.thumbnail_url,
                alt: "",
                className: "w-20 h-11 object-cover rounded"
              }
            ) : /* @__PURE__ */ jsx("div", { className: "w-20 h-11 bg-slate-100 rounded flex items-center justify-center", children: /* @__PURE__ */ jsx(Mic2, { className: "size-5 text-slate-400" }) }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium max-w-[280px] truncate", title: s.title, children: s.title }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-sm whitespace-nowrap", children: formatDate(s.published_at) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-muted-foreground", children: s.formatted_duration ?? "—" }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
              Badge,
              {
                variant: "outline",
                className: s.status === "live" ? "bg-red-50 text-red-700 border-red-200" : s.status === "upcoming" ? "bg-amber-50 text-amber-700 border-amber-200" : "",
                children: STATUS_LABELS[s.status] ?? s.status
              }
            ) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1", children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  className: "h-8 gap-1",
                  onClick: () => openEdit(s),
                  "aria-label": "Programar transmisión",
                  children: [
                    /* @__PURE__ */ jsx(CalendarClock, { className: "size-4" }),
                    "Programar"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: s.watch_url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex p-2 text-slate-500 hover:bg-slate-100 rounded-lg",
                  "aria-label": "Ver en YouTube",
                  children: /* @__PURE__ */ jsx(ExternalLink, { className: "size-4" })
                }
              )
            ] }) })
          ] }, s.id)) })
        ] }) }) }),
        sermons.last_page > 1 && /* @__PURE__ */ jsx(SharedPagination, { links: sermons.links })
      ] }),
      /* @__PURE__ */ jsx(Dialog, { open: !!editingSermon, onOpenChange: (open) => !open && setEditingSermon(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
        /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Programar transmisión" }) }),
        editingSermon && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground truncate", title: editingSermon.title, children: editingSermon.title }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Estado" }),
              /* @__PURE__ */ jsxs(Select, { value: editStatus, onValueChange: setEditStatus, children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "live", children: "En vivo" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "upcoming", children: "Próxima transmisión" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "completed", children: "Grabado" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Fecha y hora de transmisión (opcional)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "datetime-local",
                  className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  value: editLiveStartAt,
                  onChange: (e) => setEditLiveStartAt(e.target.value)
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: 'Para "Próxima transmisión" o "En vivo" indica cuándo es o será la transmisión.' })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setEditingSermon(null), children: "Cancelar" }),
            /* @__PURE__ */ jsxs(Button, { onClick: handleSaveProgram, disabled: saving, className: "gap-2", children: [
              saving && /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }),
              "Guardar"
            ] })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Index as default
};
