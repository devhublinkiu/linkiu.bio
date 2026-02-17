import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { A as AdminLayout } from "./AdminLayout-C8hB-Nb-.js";
import { usePage, Head, router } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, d as CardContent } from "./card-BaovBWX5.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { S as Sheet, a as SheetContent, b as SheetHeader, c as SheetTitle, d as SheetDescription } from "./sheet-BclLUCFD.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-Bm8n8N8a.js";
import { E as Empty, a as EmptyHeader, e as EmptyMedia, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import { Plus, Megaphone, ExternalLink, Edit, Trash2, Smile, Link, Palette } from "lucide-react";
import { toast } from "sonner";
import { c as cn } from "./utils-B0hQsrDj.js";
import { P as PermissionDeniedModal } from "./dropdown-menu-B2I3vWlQ.js";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import "./badge-C_PGNHO8.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-rtCrEhXP.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-label";
import "@radix-ui/react-switch";
import "@radix-ui/react-dialog";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-popover";
import "clsx";
import "tailwind-merge";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
const PRESET_COLORS = [
  { name: "Negro", value: "#000000" },
  { name: "Rojo", value: "#EF4444" },
  { name: "Azul", value: "#3B82F6" },
  { name: "Verde", value: "#22C55E" },
  { name: "Naranja", value: "#F97316" },
  { name: "Púrpura", value: "#A855F7" },
  { name: "Blanco", value: "#FFFFFF" }
];
const EMOJI_LIST = [
  "🔥",
  "🎉",
  "🚀",
  "📢",
  "🏷️",
  "🎁",
  "💎",
  "✨",
  "⭐",
  "⚡",
  "🚚",
  "📦",
  "💳",
  "📍",
  "👉",
  "⚠️",
  "✅",
  "🆕",
  "🍔",
  "🍕",
  "🍣",
  "🥗",
  "☕",
  "🍺",
  "🍷",
  "🍰",
  "❤️",
  "💯"
];
const INITIAL_FORM = {
  content: "",
  link: "",
  background_color: "#000000",
  text_color: "#FFFFFF",
  order: 0,
  is_active: true
};
function Index({ tickers, tickers_limit, tickers_count }) {
  const { currentTenant, currentUserRole } = usePage().props;
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTicker, setEditingTicker] = useState(null);
  const [tickerToDelete, setTickerToDelete] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const contentInputRef = useRef(null);
  const atLimit = tickers_limit !== null && tickers_count >= tickers_limit;
  const checkPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner || currentUserRole.permissions.includes("*") || currentUserRole.permissions.includes(permission);
  };
  const withPermission = (permission, action) => {
    if (checkPermission(permission)) {
      action();
    } else {
      setShowPermissionModal(true);
    }
  };
  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };
  const insertEmoji = (emoji) => {
    const input = contentInputRef.current;
    if (input) {
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newText = formData.content.substring(0, start) + emoji + formData.content.substring(end);
      setField("content", newText);
      setTimeout(() => {
        input.focus();
        const pos = start + emoji.length;
        input.setSelectionRange(pos, pos);
      }, 0);
    } else {
      setField("content", formData.content + emoji);
    }
  };
  const openCreate = () => {
    setEditingTicker(null);
    setFormData({ ...INITIAL_FORM, order: tickers.total });
    setErrors({});
    setIsSheetOpen(true);
  };
  const openEdit = (ticker) => {
    setEditingTicker(ticker);
    setFormData({
      content: ticker.content,
      link: ticker.link || "",
      background_color: ticker.background_color,
      text_color: ticker.text_color,
      order: ticker.order,
      is_active: ticker.is_active
    });
    setErrors({});
    setIsSheetOpen(true);
  };
  const submit = (e) => {
    e.preventDefault();
    const permission = editingTicker ? "tickers.update" : "tickers.create";
    withPermission(permission, () => {
      setProcessing(true);
      const routeParams = editingTicker ? route("tenant.admin.tickers.update", [currentTenant?.slug, editingTicker.id]) : route("tenant.admin.tickers.store", currentTenant?.slug);
      const method = editingTicker ? "put" : "post";
      router[method](routeParams, { ...formData }, {
        preserveScroll: true,
        onSuccess: () => {
          toast.success(editingTicker ? "Ticker actualizado correctamente" : "Ticker creado correctamente");
          setIsSheetOpen(false);
          setProcessing(false);
        },
        onError: (errs) => {
          setErrors(errs);
          const limitMsg = errs?.limit;
          toast.error(typeof limitMsg === "string" ? limitMsg : "Revisa los campos del formulario");
          setProcessing(false);
        }
      });
    });
  };
  const handleDelete = () => {
    if (!tickerToDelete) return;
    setProcessing(true);
    router.delete(route("tenant.admin.tickers.destroy", [currentTenant?.slug, tickerToDelete.id]), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Ticker eliminado correctamente");
        setTickerToDelete(null);
        setProcessing(false);
      },
      onError: () => {
        toast.error("Error al eliminar el ticker");
        setProcessing(false);
      }
    });
  };
  const toggleActive = (ticker) => {
    withPermission("tickers.update", () => {
      router.put(route("tenant.admin.tickers.update", [currentTenant?.slug, ticker.id]), {
        content: ticker.content,
        link: ticker.link || "",
        background_color: ticker.background_color,
        text_color: ticker.text_color,
        order: ticker.order,
        is_active: !ticker.is_active
      }, {
        preserveScroll: true,
        onSuccess: () => toast.success(ticker.is_active ? "Ticker desactivado" : "Ticker activado")
      });
    });
  };
  const ColorPicker = ({ label, field }) => /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx(Label, { children: label }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-2", children: PRESET_COLORS.map((color) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setField(field, color.value),
        className: cn(
          "w-8 h-8 rounded-full border border-gray-200 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900",
          formData[field] === color.value && "ring-2 ring-offset-2 ring-slate-900 scale-110",
          color.value === "#FFFFFF" && "border-gray-300"
        ),
        style: { backgroundColor: color.value },
        title: color.name,
        "aria-label": `Color ${color.name}`
      },
      color.value
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(Palette, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            value: formData[field],
            onChange: (e) => setField(field, e.target.value),
            className: "pl-9 font-mono",
            placeholder: "#000000"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "color",
          value: formData[field],
          onChange: (e) => setField(field, e.target.value),
          className: "h-10 w-10 p-1 rounded-md border cursor-pointer",
          "aria-label": `Selector de ${label.toLowerCase()}`
        }
      )
    ] }),
    errors[field] && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors[field] })
  ] });
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Tickers Promocionales", children: [
    /* @__PURE__ */ jsx(Head, { title: "Tickers Promocionales" }),
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Tickers Promocionales" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Barra de anuncios y promociones en la parte superior de tu tienda.",
          tickers_limit !== null && /* @__PURE__ */ jsxs("span", { className: "ml-1 font-medium text-foreground", children: [
            "(",
            tickers_count,
            " / ",
            tickers_limit,
            " usados)"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => withPermission("tickers.create", () => !atLimit && openCreate()),
          disabled: atLimit,
          className: "gap-2",
          title: atLimit ? "Has alcanzado el máximo de tickers permitidos en tu plan" : void 0,
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            " Nuevo Ticker"
          ]
        }
      )
    ] }),
    tickers.data.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-16", children: /* @__PURE__ */ jsxs(Empty, { children: [
      /* @__PURE__ */ jsxs(EmptyHeader, { children: [
        /* @__PURE__ */ jsx(EmptyMedia, { variant: "icon", children: /* @__PURE__ */ jsx(Megaphone, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay tickers creados" }),
        /* @__PURE__ */ jsx(EmptyDescription, { children: "Los tickers promocionales aparecen como una barra animada en la parte superior de tu tienda. Crea el primero para empezar a comunicar ofertas y novedades." })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => withPermission("tickers.create", () => !atLimit && openCreate()),
          disabled: atLimit,
          className: "gap-2 mt-4",
          title: atLimit ? "Has alcanzado el máximo de tickers permitidos en tu plan" : void 0,
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            " Crear primer ticker"
          ]
        }
      )
    ] }) }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Card, { className: "hidden md:block", children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "w-[40px]", children: "#" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[300px]", children: "Mensaje" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Colores" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Enlace" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Estado" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: tickers.data.map((ticker) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground font-mono text-xs", children: ticker.order }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium max-w-[300px] truncate", children: ticker.content }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-6 h-6 rounded-full border shadow-sm flex items-center justify-center text-[8px] font-bold",
                style: { backgroundColor: ticker.background_color, color: ticker.text_color },
                title: `Fondo: ${ticker.background_color} | Texto: ${ticker.text_color}`,
                children: "Aa"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-muted-foreground", children: ticker.background_color })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { children: ticker.link ? /* @__PURE__ */ jsxs("a", { href: ticker.link, target: "_blank", rel: "noreferrer", className: "flex items-center gap-1 text-sm text-blue-600 hover:underline", children: [
            /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" }),
            " Ver enlace"
          ] }) : /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "—" }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(
            Switch,
            {
              checked: ticker.is_active,
              onCheckedChange: () => toggleActive(ticker),
              "aria-label": `${ticker.is_active ? "Desactivar" : "Activar"} ticker`
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                onClick: () => withPermission("tickers.update", () => openEdit(ticker)),
                "aria-label": "Editar ticker",
                children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                className: "text-destructive hover:text-destructive hover:bg-destructive/10",
                onClick: () => withPermission("tickers.delete", () => setTickerToDelete(ticker)),
                "aria-label": "Eliminar ticker",
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
              }
            )
          ] }) })
        ] }, ticker.id)) })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden space-y-3", children: tickers.data.map((ticker) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-full py-2 px-3 text-sm font-bold rounded-md mb-3 truncate",
            style: { backgroundColor: ticker.background_color, color: ticker.text_color },
            children: ticker.content
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              Switch,
              {
                checked: ticker.is_active,
                onCheckedChange: () => toggleActive(ticker),
                "aria-label": `${ticker.is_active ? "Desactivar" : "Activar"} ticker`
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: ticker.is_active ? "Activo" : "Inactivo" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                className: "h-8 w-8",
                onClick: () => withPermission("tickers.update", () => openEdit(ticker)),
                "aria-label": "Editar ticker",
                children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                className: "h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10",
                onClick: () => withPermission("tickers.delete", () => setTickerToDelete(ticker)),
                "aria-label": "Eliminar ticker",
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
              }
            )
          ] })
        ] })
      ] }) }, ticker.id)) }),
      /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(SharedPagination, { links: tickers.links }) })
    ] }),
    /* @__PURE__ */ jsx(Sheet, { open: isSheetOpen, onOpenChange: setIsSheetOpen, children: /* @__PURE__ */ jsxs(SheetContent, { className: "w-full sm:max-w-md overflow-y-auto", children: [
      /* @__PURE__ */ jsxs(SheetHeader, { children: [
        /* @__PURE__ */ jsx(SheetTitle, { children: editingTicker ? "Editar Ticker" : "Nuevo Ticker" }),
        /* @__PURE__ */ jsx(SheetDescription, { children: "Configura el mensaje y estilo de tu barra promocional." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6 mt-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Vista previa" }),
          /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-lg", children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: "w-full py-2.5 px-4 font-bold text-center text-sm flex items-center justify-center gap-2 whitespace-nowrap",
              style: {
                backgroundColor: formData.background_color,
                color: formData.text_color
              },
              children: [
                /* @__PURE__ */ jsx("span", { children: formData.content || "Escribe tu mensaje..." }),
                formData.link && /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 shrink-0" })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "content", children: "Mensaje" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "content",
                ref: contentInputRef,
                value: formData.content,
                onChange: (e) => setField("content", e.target.value),
                placeholder: "Ej: 🔥 Envíos gratis por compras superiores a $50.000",
                required: true,
                maxLength: 255,
                className: "flex-1"
              }
            ),
            /* @__PURE__ */ jsxs(Popover, { children: [
              /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", size: "icon", className: "shrink-0", title: "Agregar emoji", children: /* @__PURE__ */ jsx(Smile, { className: "w-5 h-5 text-gray-500" }) }) }),
              /* @__PURE__ */ jsx(PopoverContent, { className: "w-48 p-2", align: "end", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: EMOJI_LIST.map((emoji) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => insertEmoji(emoji),
                  className: "h-8 w-8 flex items-center justify-center text-lg hover:bg-slate-100 rounded transition-colors",
                  "aria-label": `Insertar ${emoji}`,
                  children: emoji
                },
                emoji
              )) }) })
            ] })
          ] }),
          errors.content && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.content })
        ] }),
        /* @__PURE__ */ jsx(ColorPicker, { label: "Color de fondo", field: "background_color" }),
        /* @__PURE__ */ jsx(ColorPicker, { label: "Color de texto", field: "text_color" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "link", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Link, { className: "w-4 h-4" }),
            " Enlace (opcional)"
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "link",
              value: formData.link,
              onChange: (e) => setField("link", e.target.value),
              placeholder: "https://...",
              type: "url"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Si agregas un enlace, toda la barra será cliqueable." }),
          errors.link && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.link })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "order", children: "Orden de aparición" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "order",
              type: "number",
              min: 0,
              value: formData.order,
              onChange: (e) => setField("order", parseInt(e.target.value) || 0)
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Menor número = aparece primero." }),
          errors.order && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.order })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border p-3 rounded-lg bg-slate-50", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "is_active", className: "cursor-pointer", children: "Activar inmediatamente" }),
          /* @__PURE__ */ jsx(
            Switch,
            {
              id: "is_active",
              checked: formData.is_active,
              onCheckedChange: (checked) => setField("is_active", checked)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-4", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setIsSheetOpen(false), children: "Cancelar" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? "Guardando..." : editingTicker ? "Guardar cambios" : "Crear ticker" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!tickerToDelete, onOpenChange: (open) => !open && setTickerToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar ticker?" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Esta acción no se puede deshacer. El ticker dejará de mostrarse en tu tienda." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: handleDelete,
            disabled: processing,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: processing ? "Eliminando..." : "Eliminar"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
