import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { usePage, router, Head } from "@inertiajs/react";
import { g as getEcho } from "./echo-DaX0krWj.js";
import { A as AdminLayout } from "./AdminLayout-ndko6Pty.js";
import { C as Card, a as CardHeader, d as CardContent, e as CardFooter } from "./card-BaovBWX5.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { S as ScrollArea } from "./scroll-area-iVmBTZv4.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-QdU9y0pO.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { Building2, Filter, Search, ArrowLeftCircle, History, ClipboardList, Bike, ShoppingBag, Utensils, Eye, Loader2, Receipt, User, MapPin, StickyNote, CreditCard, Clock, Ban, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { f as formatCurrency } from "./currency-CoUrQw_H.js";
import { P as PermissionDeniedModal } from "./dropdown-menu-Dkgv2tnp.js";
import "@ably/laravel-echo";
import "ably";
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
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "@radix-ui/react-alert-dialog";
import "vaul";
import "axios";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
const STATUS_CONFIG = {
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700 border-yellow-300", kanbanColor: "bg-yellow-50 border-yellow-200" },
  confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-700 border-blue-300", kanbanColor: "bg-blue-50 border-blue-200" },
  preparing: { label: "En Cocina", color: "bg-orange-100 text-orange-700 border-orange-300", kanbanColor: "bg-orange-50 border-orange-200" },
  ready: { label: "Listo", color: "bg-purple-100 text-purple-700 border-purple-300", kanbanColor: "bg-purple-50 border-purple-200" },
  completed: { label: "Entregado", color: "bg-green-100 text-green-700 border-green-300", kanbanColor: "bg-green-50 border-green-200" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-700 border-red-300", kanbanColor: "bg-red-50 border-red-200" }
};
const SERVICE_CONFIG = {
  dine_in: { label: "Mesa", icon: Utensils },
  takeout: { label: "Para Llevar", icon: ShoppingBag },
  delivery: { label: "Domicilio", icon: Bike }
};
const PAYMENT_LABELS = {
  cash: "Efectivo",
  bank_transfer: "Transferencia",
  transfer: "Transferencia",
  card: "Tarjeta",
  dataphone: "Datáfono"
};
const NEXT_STATUS = {
  pending: { status: "confirmed", label: "Confirmar", color: "bg-blue-600 hover:bg-blue-700" },
  confirmed: { status: "preparing", label: "A Cocina", color: "bg-orange-500 hover:bg-orange-600" },
  preparing: { status: "ready", label: "Listo", color: "bg-purple-600 hover:bg-purple-700" },
  ready: { status: "completed", label: "Entregar", color: "bg-green-600 hover:bg-green-700" }
};
function OrdersIndex({ tenant, orders: paginatedOrders, isHistory, locations, currentLocationId }) {
  const { currentUserRole } = usePage().props;
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [orders, setOrders] = useState(paginatedOrders.data || []);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const checkPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner === true || Array.isArray(currentUserRole.permissions) && currentUserRole.permissions.includes("*") || Array.isArray(currentUserRole.permissions) && currentUserRole.permissions.includes(permission);
  };
  const handleActionWithPermission = (permission, action) => {
    if (checkPermission(permission)) {
      action();
    } else {
      setShowPermissionModal(true);
    }
  };
  const [serviceFilter, setServiceFilter] = useState("all");
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsPageLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    setOrders(paginatedOrders.data || []);
  }, [paginatedOrders]);
  useEffect(() => {
    if (isHistory) return;
    const echoInstance = getEcho();
    if (!echoInstance?.connector || !tenant.id) return;
    const channelName = `tenant.${tenant.id}.orders`;
    try {
      const channel = echoInstance.channel(channelName);
      channel.listen(".order.created", (e) => {
        const data = e;
        playNotificationSound();
        toast.success(data.message || `Nuevo pedido #${data.id}`, {
          id: `new-order-${data.id}`,
          duration: 15e3,
          description: `${data.customer_name} — ${formatCurrency(Number(data.total) || 0)}`,
          style: { background: "#eff6ff", border: "2px solid #3b82f6", fontWeight: "bold" }
        });
        router.reload({ only: ["orders"] });
      });
    } catch (err) {
      console.error("Error subscribing to Echo channel:", err);
    }
    return () => {
      try {
        echoInstance.leave(channelName);
      } catch {
      }
    };
  }, [tenant.id, isHistory]);
  const playNotificationSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const notes = [830, 1046, 1318];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.4, ctx.currentTime + i * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.18 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.18);
        osc.stop(ctx.currentTime + i * 0.18 + 0.3);
      });
    } catch {
    }
  };
  const filteredOrders = useMemo(() => {
    let result = orders;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) => o.customer_name?.toLowerCase().includes(q) || o.customer_phone?.includes(q) || o.ticket_number?.toLowerCase().includes(q) || String(o.id).includes(q)
      );
    }
    if (serviceFilter !== "all") {
      result = result.filter((o) => o.service_type === serviceFilter);
    }
    return result;
  }, [orders, searchQuery, serviceFilter]);
  const getOrdersByStatus = (status) => {
    const result = filteredOrders.filter((o) => o.status === status);
    if (status === "completed") return result.slice(0, 5);
    return result;
  };
  const handleStatusUpdate = (orderId, newStatus) => {
    setProcessingOrderId(orderId);
    router.post(
      route("tenant.admin.gastronomy.orders.update-status", { tenant: tenant.slug, order: orderId }),
      { status: newStatus },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Estado actualizado");
          setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
          setShowDetail(false);
          setSelectedOrder(null);
          setConfirmAction(null);
        },
        onError: (errors) => {
          const msg = errors.status || errors.order || "Error al actualizar estado";
          toast.error(typeof msg === "string" ? msg : "Error al actualizar estado");
        },
        onFinish: () => setProcessingOrderId(null)
      }
    );
  };
  const handleViewDetail = async (order) => {
    setSelectedOrder(order);
    setShowDetail(true);
    setLoadingDetail(true);
    try {
      const res = await fetch(
        route("tenant.admin.gastronomy.orders.show", { tenant: tenant.slug, order: order.id }),
        { headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" } }
      );
      if (res.ok) {
        const full = await res.json();
        setSelectedOrder(full);
      }
    } catch {
    } finally {
      setLoadingDetail(false);
    }
  };
  const handleLocationChange = (value) => {
    const params = { tenant: tenant.slug };
    if (value !== "all") params.location_id = value;
    if (isHistory) params.history = "1";
    router.visit(route("tenant.admin.gastronomy.orders.index", params));
  };
  const kanbanColumns = [
    { id: "pending", title: "Pendientes" },
    { id: "confirmed", title: "Confirmados" },
    { id: "preparing", title: "En Cocina" },
    { id: "ready", title: "Listos" },
    { id: "completed", title: "Entregados" }
  ];
  const ServiceIcon2 = ({ type }) => {
    const cfg = SERVICE_CONFIG[type];
    if (!cfg) return /* @__PURE__ */ jsx(ClipboardList, { className: "w-4 h-4" });
    const Icon = cfg.icon;
    return /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" });
  };
  const getElapsed = (createdAt) => {
    const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 6e4);
    if (diff < 1) return "Ahora";
    if (diff < 60) return `${diff}m`;
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Gestión de Pedidos", breadcrumbs: [{ label: "Gastronomía" }, { label: "Pedidos" }], maxwidth: "max-w-[2000px]", children: [
    /* @__PURE__ */ jsx(Head, { title: "Gestión de Pedidos" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 md:p-6 h-[calc(100vh-80px)] flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:justify-between md:items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl md:text-2xl font-bold tracking-tight text-slate-900", children: isHistory ? "Historial de Pedidos" : "Tablero de Pedidos" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: isHistory ? "Consulta pedidos antiguos y cancelados." : "Gestiona tus pedidos en tiempo real." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 items-center", children: [
          locations.length > 1 && /* @__PURE__ */ jsxs(Select, { value: currentLocationId ? String(currentLocationId) : "all", onValueChange: handleLocationChange, children: [
            /* @__PURE__ */ jsxs(SelectTrigger, { className: "w-[180px] h-9", children: [
              /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4 mr-1 text-slate-400" }),
              /* @__PURE__ */ jsx(SelectValue, { placeholder: "Todas las sedes" })
            ] }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las sedes" }),
              locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: String(loc.id), children: loc.name }, loc.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Select, { value: serviceFilter, onValueChange: setServiceFilter, children: [
            /* @__PURE__ */ jsxs(SelectTrigger, { className: "w-[150px] h-9", children: [
              /* @__PURE__ */ jsx(Filter, { className: "w-4 h-4 mr-1 text-slate-400" }),
              /* @__PURE__ */ jsx(SelectValue, {})
            ] }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "dine_in", children: "Mesa" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "takeout", children: "Para Llevar" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "delivery", children: "Domicilio" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Buscar ticket, nombre, tel...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "pl-9 h-9 w-[200px]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: isHistory ? "outline" : "secondary",
              size: "sm",
              onClick: () => router.visit(route("tenant.admin.gastronomy.orders.index", { tenant: tenant.slug, history: isHistory ? "0" : "1" })),
              className: "gap-1.5",
              children: [
                isHistory ? /* @__PURE__ */ jsx(ArrowLeftCircle, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(History, { className: "w-4 h-4" }),
                isHistory ? "Tablero" : "Historial"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-hidden bg-slate-50/50 rounded-xl border border-slate-200", children: !isPageLoaded ? (
        /* Skeleton */
        /* @__PURE__ */ jsx("div", { className: "flex gap-4 p-4 h-full", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-[200px] bg-slate-100 rounded-xl animate-pulse" }, i)) })
      ) : isHistory ? (
        /* HISTORY TABLE */
        /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto p-4", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { className: "w-[90px]", children: "Ticket" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Fecha" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Cliente" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Tipo" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Sede" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Pago" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Total" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-center w-[80px]", children: "Ver" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: filteredOrders.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsxs(TableCell, { colSpan: 9, className: "text-center h-32 text-slate-400", children: [
              /* @__PURE__ */ jsx(ClipboardList, { className: "w-8 h-8 mx-auto mb-2 opacity-40" }),
              "Sin pedidos en el historial."
            ] }) }) : filteredOrders.map((order) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              return /* @__PURE__ */ jsxs(TableRow, { className: "cursor-pointer hover:bg-slate-50", onClick: () => handleViewDetail(order), children: [
                /* @__PURE__ */ jsx(TableCell, { className: "font-bold font-mono", children: order.ticket_number || `#${order.id}` }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-xs text-slate-500", children: new Date(order.created_at).toLocaleString("es-CO") }),
                /* @__PURE__ */ jsxs(TableCell, { children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: order.customer_name }),
                  order.customer_phone && /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-400", children: order.customer_phone })
                ] }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm", children: [
                  /* @__PURE__ */ jsx(ServiceIcon2, { type: order.service_type }),
                  SERVICE_CONFIG[order.service_type]?.label || order.service_type
                ] }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-xs text-slate-500", children: order.location?.name || "—" }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `text-[10px] ${cfg.color}`, children: cfg.label }) }),
                /* @__PURE__ */ jsxs(TableCell, { className: "text-xs", children: [
                  Boolean(order.waiter_collected) && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300", children: "Mesero" }),
                  !order.waiter_collected && order.payment_method && /* @__PURE__ */ jsx("span", { children: PAYMENT_LABELS[order.payment_method] || order.payment_method })
                ] }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right font-bold", children: formatCurrency(Number(order.total)) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                  e.stopPropagation();
                  handleViewDetail(order);
                }, children: /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }) }) })
              ] }, order.id);
            }) })
          ] }) }) }),
          paginatedOrders.last_page > 1 && /* @__PURE__ */ jsxs("div", { className: "p-3 border-t border-slate-200 bg-white flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-slate-500", children: [
              paginatedOrders.from,
              " – ",
              paginatedOrders.to,
              " de ",
              paginatedOrders.total
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: paginatedOrders.links.map((link, i) => {
              let label = link.label;
              if (label.includes("previous") || label.includes("Previous") || label.includes("laquo")) label = "← Anterior";
              if (label.includes("next") || label.includes("Next") || label.includes("raquo")) label = "Siguiente →";
              label = label.replace(/&laquo;|&raquo;|pagination\./g, "").trim();
              return /* @__PURE__ */ jsx(
                Button,
                {
                  variant: link.active ? "default" : "outline",
                  size: "sm",
                  disabled: !link.url,
                  onClick: () => link.url && router.visit(link.url),
                  className: "h-8 px-3 text-xs",
                  children: label
                },
                i
              );
            }) })
          ] })
        ] })
      ) : (
        /* KANBAN BOARD — Desktop: columnas, Mobile: tabs+cards */
        /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "md:hidden p-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto pb-2", children: kanbanColumns.map((col) => {
              const count = getOrdersByStatus(col.id).length;
              return /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: `flex-shrink-0 gap-1 ${STATUS_CONFIG[col.id].color}`,
                  onClick: () => {
                    document.getElementById(`kanban-mobile-${col.id}`)?.scrollIntoView({ behavior: "smooth" });
                  },
                  children: [
                    col.title,
                    " ",
                    /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-1 h-5 px-1.5 text-[10px]", children: count })
                  ]
                },
                col.id
              );
            }) }),
            /* @__PURE__ */ jsx("div", { className: "space-y-6 mt-2", children: kanbanColumns.map((col) => {
              const colOrders = getOrdersByStatus(col.id);
              return /* @__PURE__ */ jsxs("div", { id: `kanban-mobile-${col.id}`, children: [
                /* @__PURE__ */ jsxs("h3", { className: `text-sm font-bold px-2 py-1 rounded mb-2 ${STATUS_CONFIG[col.id].color}`, children: [
                  col.title,
                  " (",
                  colOrders.length,
                  ")"
                ] }),
                colOrders.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-xs text-slate-400 py-4 italic", children: "Sin pedidos" }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: colOrders.map((order) => /* @__PURE__ */ jsx(
                  OrderCard,
                  {
                    order,
                    onView: () => handleViewDetail(order),
                    onAction: (status, label) => handleActionWithPermission("orders.update", () => setConfirmAction({ orderId: order.id, status, label })),
                    processing: processingOrderId === order.id,
                    getElapsed
                  },
                  order.id
                )) })
              ] }, col.id);
            }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:flex flex-1 overflow-x-auto h-full p-4", children: /* @__PURE__ */ jsx("div", { className: "flex gap-3 h-full w-full", children: kanbanColumns.map((col) => {
            const colOrders = getOrdersByStatus(col.id);
            const cfg = STATUS_CONFIG[col.id];
            return /* @__PURE__ */ jsxs("div", { className: `flex-1 min-w-[220px] flex flex-col rounded-xl border ${cfg.kanbanColor} h-full`, children: [
              /* @__PURE__ */ jsxs("div", { className: `p-3 border-b font-bold text-sm flex justify-between items-center rounded-t-xl ${cfg.color}`, children: [
                /* @__PURE__ */ jsx("span", { children: col.title }),
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-white/70 text-xs", children: colOrders.length })
              ] }),
              /* @__PURE__ */ jsx(ScrollArea, { className: "flex-1 p-2", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                colOrders.map((order) => /* @__PURE__ */ jsx(
                  OrderCard,
                  {
                    order,
                    onView: () => handleViewDetail(order),
                    onAction: (status, label) => handleActionWithPermission("orders.update", () => setConfirmAction({ orderId: order.id, status, label })),
                    processing: processingOrderId === order.id,
                    getElapsed
                  },
                  order.id
                )),
                colOrders.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-10 text-slate-400", children: [
                  /* @__PURE__ */ jsx(ClipboardList, { className: "w-8 h-8 mx-auto mb-2 opacity-30" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs italic", children: "Sin pedidos" })
                ] })
              ] }) })
            ] }, col.id);
          }) }) })
        ] })
      ) })
    ] }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!confirmAction, onOpenChange: (open) => {
      if (!open) setConfirmAction(null);
    }, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxs(AlertDialogTitle, { children: [
          '¿Cambiar estado a "',
          confirmAction?.label,
          '"?'
        ] }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: confirmAction?.status === "cancelled" ? "Esta acción cancelará el pedido. El cliente será notificado." : "El estado del pedido cambiará y se notificará al cliente." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Volver" }),
        /* @__PURE__ */ jsxs(
          AlertDialogAction,
          {
            className: confirmAction?.status === "cancelled" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700",
            onClick: () => confirmAction && handleStatusUpdate(confirmAction.orderId, confirmAction.status),
            children: [
              processingOrderId ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }) : null,
              "Sí, ",
              confirmAction?.label
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: showDetail, onOpenChange: (open) => {
      if (!open) {
        setShowDetail(false);
        setSelectedOrder(null);
      }
    }, children: /* @__PURE__ */ jsx(DialogContent, { className: "max-w-lg p-0 overflow-hidden max-h-[90vh]", children: selectedOrder && /* @__PURE__ */ jsxs("div", { className: "flex flex-col max-h-[90vh]", children: [
      /* @__PURE__ */ jsx("div", { className: "p-5 border-b border-slate-100 bg-slate-50", children: /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-lg", children: [
          /* @__PURE__ */ jsx(Receipt, { className: "w-5 h-5 text-slate-600" }),
          "Pedido ",
          selectedOrder.ticket_number || `#${selectedOrder.id}`
        ] }),
        /* @__PURE__ */ jsxs(DialogDescription, { className: "flex items-center gap-3 mt-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs", children: new Date(selectedOrder.created_at).toLocaleString("es-CO") }),
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `text-[10px] ${STATUS_CONFIG[selectedOrder.status]?.color || ""}`, children: STATUS_CONFIG[selectedOrder.status]?.label || selectedOrder.status }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(ServiceIcon2, { type: selectedOrder.service_type }),
            SERVICE_CONFIG[selectedOrder.service_type]?.label
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "overflow-y-auto flex-1 p-5 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 rounded-lg space-y-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-slate-400" }),
            /* @__PURE__ */ jsx("span", { className: "font-bold", children: selectedOrder.customer_name })
          ] }),
          selectedOrder.customer_phone && /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 ml-6", children: selectedOrder.customer_phone }),
          selectedOrder.table && /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 ml-6 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Utensils, { className: "w-3 h-3" }),
            " ",
            selectedOrder.table.name
          ] }),
          selectedOrder.location && /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 ml-6 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Building2, { className: "w-3 h-3" }),
            " ",
            selectedOrder.location.name
          ] }),
          selectedOrder.creator && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 ml-6", children: [
            "Creado por: ",
            selectedOrder.creator.name
          ] }),
          selectedOrder.delivery_address && /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 ml-6 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }),
            selectedOrder.delivery_address.neighborhood,
            " — ",
            selectedOrder.delivery_address.address
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase text-slate-500 mb-2", children: "Productos" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-1", children: selectedOrder.items?.map((item) => {
            const isCancelled = item.status === "cancelled";
            const variants = item.variant_options ? Array.isArray(item.variant_options) ? item.variant_options : Object.values(item.variant_options) : [];
            return /* @__PURE__ */ jsxs("div", { className: `flex justify-between items-start py-2 px-2 rounded-lg ${isCancelled ? "bg-red-50 opacity-60" : "hover:bg-slate-50"}`, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold bg-slate-100 w-6 h-6 flex items-center justify-center rounded-full text-xs flex-shrink-0", children: item.quantity }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${isCancelled ? "line-through text-red-500" : "text-slate-900"}`, children: item.product?.name || item.product_name }),
                  isCancelled && /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "ml-2 text-[9px] h-4", children: "Anulado" }),
                  variants.length > 0 && /* @__PURE__ */ jsx("div", { className: "text-[11px] text-slate-500 mt-0.5", children: variants.map((v, i) => /* @__PURE__ */ jsxs("span", { children: [
                    v.name || v.group_name,
                    ": ",
                    v.value || v.option_name,
                    v.price && Number(v.price) > 0 ? ` (+${formatCurrency(Number(v.price))})` : "",
                    i < variants.length - 1 ? " · " : ""
                  ] }, i)) }),
                  item.notes && /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-amber-600 flex items-center gap-1 mt-0.5", children: [
                    /* @__PURE__ */ jsx(StickyNote, { className: "w-3 h-3" }),
                    " ",
                    item.notes
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("span", { className: `text-sm font-mono font-semibold flex-shrink-0 ${isCancelled ? "line-through text-red-400" : "text-slate-700"}`, children: formatCurrency(Number(item.total)) })
            ] }, item.id);
          }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 pt-3 border-t border-slate-200 space-y-1", children: [
            selectedOrder.subtotal && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-slate-500", children: [
              /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
              /* @__PURE__ */ jsx("span", { children: formatCurrency(Number(selectedOrder.subtotal)) })
            ] }),
            selectedOrder.tax_amount && Number(selectedOrder.tax_amount) > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-slate-500", children: [
              /* @__PURE__ */ jsx("span", { children: "Impuestos" }),
              /* @__PURE__ */ jsx("span", { children: formatCurrency(Number(selectedOrder.tax_amount)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-black text-lg", children: [
              /* @__PURE__ */ jsx("span", { children: "Total" }),
              /* @__PURE__ */ jsx("span", { children: formatCurrency(Number(selectedOrder.total)) })
            ] })
          ] })
        ] }),
        (selectedOrder.payment_method || Boolean(selectedOrder.waiter_collected)) && /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 p-3 rounded-lg space-y-1", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase text-blue-600", children: "Información de Pago" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsx(CreditCard, { className: "w-4 h-4 text-blue-500" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: PAYMENT_LABELS[selectedOrder.payment_method || ""] || selectedOrder.payment_method || "No especificado" })
          ] }),
          Boolean(selectedOrder.waiter_collected) && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-emerald-50 text-emerald-700 border-emerald-300 text-[10px]", children: "Cobrado por Mesero" }),
          selectedOrder.payment_reference && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500", children: [
            "Ref: ",
            selectedOrder.payment_reference
          ] })
        ] }),
        selectedOrder.payment_proof_url && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase text-slate-500 mb-1", children: "Comprobante" }),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: selectedOrder.payment_proof_url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "block rounded-lg overflow-hidden border border-slate-200 hover:border-blue-400 transition-colors",
              children: /* @__PURE__ */ jsx("img", { src: selectedOrder.payment_proof_url, alt: "Comprobante", className: "w-full max-h-48 object-contain bg-slate-100" })
            }
          )
        ] }),
        selectedOrder.status_history && selectedOrder.status_history.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase text-slate-500 mb-2", children: "Historial de Estados" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-1", children: selectedOrder.status_history.map((entry) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 text-xs text-slate-600 py-1", children: [
            /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 mt-0.5 text-slate-400 flex-shrink-0" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
                entry.from_status ? `${STATUS_CONFIG[entry.from_status]?.label || entry.from_status} → ` : "",
                STATUS_CONFIG[entry.to_status]?.label || entry.to_status
              ] }),
              entry.user && /* @__PURE__ */ jsxs("span", { className: "text-slate-400", children: [
                " — ",
                entry.user.name
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-slate-400 ml-1", children: new Date(entry.created_at).toLocaleString("es-CO") }),
              entry.notes && /* @__PURE__ */ jsx("p", { className: "text-slate-500 italic", children: entry.notes })
            ] })
          ] }, entry.id)) })
        ] }),
        loadingDetail && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center py-4 text-slate-400 gap-2", children: [
          /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
          " Cargando detalle..."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-t border-slate-100 bg-slate-50 flex gap-2", children: [
        NEXT_STATUS[selectedOrder.status] && /* @__PURE__ */ jsxs(
          Button,
          {
            className: `flex-1 h-10 font-bold text-white ${NEXT_STATUS[selectedOrder.status].color}`,
            disabled: processingOrderId === selectedOrder.id,
            onClick: () => handleActionWithPermission("orders.update", () => setConfirmAction({
              orderId: selectedOrder.id,
              status: NEXT_STATUS[selectedOrder.status].status,
              label: NEXT_STATUS[selectedOrder.status].label
            })),
            children: [
              processingOrderId === selectedOrder.id ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }) : null,
              NEXT_STATUS[selectedOrder.status].label
            ]
          }
        ),
        selectedOrder.status !== "completed" && selectedOrder.status !== "cancelled" && /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            className: "h-10 border-red-200 text-red-600 hover:bg-red-50",
            onClick: () => handleActionWithPermission("orders.update", () => setConfirmAction({ orderId: selectedOrder.id, status: "cancelled", label: "Cancelar" })),
            children: [
              /* @__PURE__ */ jsx(Ban, { className: "w-4 h-4 mr-1" }),
              " Cancelar"
            ]
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    )
  ] });
}
function OrderCard({ order, onView, onAction, processing, getElapsed }) {
  const next = NEXT_STATUS[order.status];
  return /* @__PURE__ */ jsxs(Card, { className: "cursor-pointer hover:shadow-md transition-all border-slate-200 overflow-hidden", onClick: onView, children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "p-3 pb-1.5 space-y-0", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "h-5 gap-1 pl-1 pr-2 text-[10px]", children: [
          /* @__PURE__ */ jsx(ServiceIcon, { type: order.service_type }),
          order.ticket_number || `#${order.id}`
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-mono", children: getElapsed(order.created_at) })
      ] }),
      Boolean(order.waiter_collected) && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[9px] bg-emerald-50 text-emerald-700 border-emerald-300 h-4", children: "Mesero" })
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "p-3 py-1.5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
        /* @__PURE__ */ jsx(User, { className: "w-3 h-3 text-slate-400" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium truncate", children: order.customer_name })
      ] }),
      order.table && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-slate-500", children: [
        /* @__PURE__ */ jsx(Utensils, { className: "w-3 h-3" }),
        " ",
        order.table.name
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-[11px] text-slate-500 line-clamp-2 mt-1", children: order.items?.map((item) => `${item.quantity}x ${item.product?.name || item.product_name}`).join(", ") })
    ] }),
    /* @__PURE__ */ jsxs(CardFooter, { className: "p-3 pt-1.5 flex justify-between items-center border-t border-slate-100 bg-slate-50/50", children: [
      /* @__PURE__ */ jsx("span", { className: "font-bold text-sm", children: formatCurrency(Number(order.total)) }),
      next && /* @__PURE__ */ jsx(
        Button,
        {
          size: "sm",
          className: `h-7 text-[11px] text-white ${next.color}`,
          disabled: processing,
          onClick: (e) => {
            e.stopPropagation();
            onAction(next.status, next.label);
          },
          children: processing ? /* @__PURE__ */ jsx(Loader2, { className: "w-3 h-3 animate-spin" }) : next.label
        }
      ),
      order.status === "completed" && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px] bg-green-50 text-green-700 border-green-300", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 mr-0.5" }),
        "OK"
      ] })
    ] })
  ] });
}
function ServiceIcon({ type }) {
  const cfg = SERVICE_CONFIG[type];
  if (!cfg) return /* @__PURE__ */ jsx(ClipboardList, { className: "w-4 h-4" });
  const Icon = cfg.icon;
  return /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" });
}
export {
  OrdersIndex as default
};
