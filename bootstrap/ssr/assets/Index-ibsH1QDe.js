import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { A as AdminLayout } from "./AdminLayout-CvP9QKT2.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { Bell, ArrowLeft, ChefHat, RefreshCw, UtensilsCrossed, Wifi, WifiOff } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { KitchenOrderCard } from "./KitchenOrderCard-B20LHKYj.js";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./badge-C_PGNHO8.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "./card-BaovBWX5.js";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./dropdown-menu-BCxMx_rd.js";
import "vaul";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./input-B_4qRSOV.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-DFnQxYfh.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./menuConfig-rtCrEhXP.js";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-select";
import "@radix-ui/react-alert-dialog";
import "./scroll-area-iVmBTZv4.js";
import "@radix-ui/react-scroll-area";
function KitchenIndex({ orders: initialOrders, tenant, currentLocationId, locations = [] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [processingId, setProcessingId] = useState(null);
  const [isEchoConnected, setIsEchoConnected] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationId, setLocationId] = useState(currentLocationId);
  const [confirmAction, setConfirmAction] = useState(null);
  const playNotification = useCallback(() => {
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
      toast.info("🔔 Nuevo pedido recibido", { icon: /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4 text-blue-500" }) });
    }
  }, []);
  const updateOrderStatus = useCallback(async (id, status) => {
    setProcessingId(id);
    try {
      const response = await axios.post(route("tenant.admin.kitchen.ready", { tenant: tenant.slug, order: id }), { status });
      if (response.data.success) {
        if (status === "ready") {
          setOrders((prev) => prev.filter((o) => o.id !== id));
          toast.success("Pedido despachado");
        } else {
          setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "preparing" } : o));
          toast.success("Pedido marcado como preparando");
        }
      }
    } catch (error) {
      toast.error("Error al actualizar pedido");
    } finally {
      setProcessingId(null);
      setConfirmAction(null);
    }
  }, [tenant.slug]);
  const handleReady = (id) => {
    setConfirmAction({ id, action: "ready" });
  };
  const handlePreparing = (id) => {
    updateOrderStatus(id, "preparing");
  };
  const confirmActionExecute = () => {
    if (!confirmAction) return;
    updateOrderStatus(confirmAction.id, confirmAction.action);
  };
  useEffect(() => {
    const echoInstance = window.Echo;
    if (!echoInstance?.connector || !tenant.id) {
      setIsEchoConnected(false);
      return;
    }
    setIsEchoConnected(true);
    const channelName = locationId ? `tenant.${tenant.id}.location.${locationId}.kitchen` : `tenant.${tenant.id}.kitchen`;
    let channel = null;
    try {
      channel = echoInstance.channel(channelName).listen(".order.sent", (data) => {
        const orderData = data;
        setOrders((prev) => {
          const index = prev.findIndex((o) => o.id === orderData.id);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = orderData;
            return updated;
          }
          return [...prev, orderData];
        });
        playNotification();
        toast.info(`Nuevo pedido: ${orderData.ticket_number}`, {
          description: `${orderData.service_type === "dine_in" ? orderData.table?.name || "Mesa" : "Para llevar"}`,
          icon: /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4 text-blue-500" })
        });
      });
    } catch (error) {
      console.error("Error subscribing to Echo channel:", error);
      setIsEchoConnected(false);
    }
    return () => {
      try {
        echoInstance.leave(channelName);
      } catch {
      }
    };
  }, [tenant.id, locationId, playNotification]);
  useEffect(() => {
    if (isEchoConnected) return;
    const poll = async () => {
      try {
        const params = {};
        if (locationId) params.location_id = String(locationId);
        if (statusFilter !== "all") params.status = statusFilter;
        const response = await axios.get(route("tenant.admin.kitchen.orders", { tenant: tenant.slug }), { params });
        setOrders(response.data);
      } catch {
      }
    };
    const interval = setInterval(poll, 3e4);
    return () => clearInterval(interval);
  }, [isEchoConnected, tenant.slug, locationId, statusFilter]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const params = {};
      if (locationId) params.location_id = String(locationId);
      const response = await axios.get(route("tenant.admin.kitchen.orders", { tenant: tenant.slug }), { params });
      setOrders(response.data);
      toast.success("Comandas actualizadas");
    } catch {
      toast.error("Error al refrescar");
    } finally {
      setIsRefreshing(false);
    }
  };
  const handleLocationChange = (val) => {
    const newLocId = val === "all" ? null : Number(val);
    setLocationId(newLocId);
    window.location.href = route("tenant.admin.kitchen.index", {
      tenant: tenant.slug,
      ...newLocId ? { location_id: newLocId } : {}
    });
  };
  const filteredOrders = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);
  const confirmedCount = orders.filter((o) => o.status === "confirmed").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  return /* @__PURE__ */ jsxs(AdminLayout, { hideSidebar: true, hideNavbar: true, hideFooter: true, maxwidth: "w-full h-screen", children: [
    /* @__PURE__ */ jsx(Head, { title: "Monitor de Cocina" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-screen bg-slate-900 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("header", { className: "bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center shrink-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "text-slate-400 hover:text-white hover:bg-slate-700 rounded-full",
              asChild: true,
              children: /* @__PURE__ */ jsx(Link, { href: route("tenant.dashboard", { tenant: tenant.slug }), children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-6 h-6" }) })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-blue-600 p-2 rounded-lg", children: /* @__PURE__ */ jsx(ChefHat, { className: "w-6 h-6 text-white" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-white tracking-tight", children: "MONITOR DE COCINA" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 font-medium uppercase tracking-widest", children: "Panel de Control de Comandas" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          locations.length > 1 && /* @__PURE__ */ jsxs(Select, { value: locationId ? String(locationId) : "all", onValueChange: handleLocationChange, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[160px] h-9 bg-slate-700 border-slate-600 text-white text-xs", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Todas las sedes" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las sedes" }),
              locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: String(loc.id), children: loc.name }, loc.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 bg-slate-700/50 rounded-lg p-1", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setStatusFilter("all"),
                className: `px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors ${statusFilter === "all" ? "bg-slate-600 text-white" : "text-slate-400 hover:text-white"}`,
                children: [
                  "Todos (",
                  orders.length,
                  ")"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setStatusFilter("confirmed"),
                className: `px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors ${statusFilter === "confirmed" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-white"}`,
                children: [
                  "Nuevos (",
                  confirmedCount,
                  ")"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setStatusFilter("preparing"),
                className: `px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors ${statusFilter === "preparing" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`,
                children: [
                  "Preparando (",
                  preparingCount,
                  ")"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-10 w-px bg-slate-700 mx-1" }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "text-slate-400 hover:text-white hover:bg-slate-700",
              onClick: handleManualRefresh,
              disabled: isRefreshing,
              children: /* @__PURE__ */ jsx(RefreshCw, { className: `w-5 h-5 ${isRefreshing ? "animate-spin" : ""}` })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-slate-100" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-300 font-bold uppercase", children: "A tiempo" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-amber-500" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-300 font-bold uppercase", children: "Retraso" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-red-500" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-300 font-bold uppercase", children: "Urgente" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-10 w-px bg-slate-700 mx-1" }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-mono font-bold text-blue-400 leading-none", children: filteredOrders.length }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500 font-bold uppercase", children: "Activos" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 p-4 overflow-hidden relative", children: filteredOrders.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center text-slate-600", children: [
        /* @__PURE__ */ jsx(UtensilsCrossed, { className: "w-24 h-24 mb-4 opacity-10" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold opacity-20", children: statusFilter !== "all" ? "SIN COMANDAS EN ESTE FILTRO" : "COCINA SIN COMANDAS" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-700 opacity-20", children: "Esperando nuevos pedidos..." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 h-full content-start overflow-y-auto pr-2 custom-scrollbar", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "popLayout", children: filteredOrders.map((order) => /* @__PURE__ */ jsx(
        KitchenOrderCard,
        {
          order,
          onReady: handleReady,
          onPreparing: handlePreparing,
          processingId
        },
        order.id
      )) }) }) }),
      /* @__PURE__ */ jsx("footer", { className: "bg-slate-800/50 p-2 shrink-0 border-t border-slate-700", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest", children: [
        isEchoConnected ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Wifi, { className: "w-3.5 h-3.5 text-green-500" }),
          /* @__PURE__ */ jsx("span", { className: "text-green-400", children: "Tiempo Real Conectado" }),
          /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(WifiOff, { className: "w-3.5 h-3.5 text-amber-500" }),
          /* @__PURE__ */ jsx("span", { className: "text-amber-400", children: "Modo Polling (30s)" }),
          /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-amber-500" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "opacity-50", children: "|" }),
        /* @__PURE__ */ jsx("span", { children: "KDS v2.0" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!confirmAction, onOpenChange: (open) => {
      if (!open) setConfirmAction(null);
    }, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Despachar pedido?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "El pedido será marcado como ",
          /* @__PURE__ */ jsx("strong", { className: "text-green-600", children: "Listo" }),
          " y notificado al POS. Esta acción no se puede deshacer."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: confirmActionExecute,
            className: "bg-green-600 text-white hover:bg-green-700",
            children: "Sí, Despachar"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(30, 41, 59, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            ` })
  ] });
}
export {
  KitchenIndex as default
};
