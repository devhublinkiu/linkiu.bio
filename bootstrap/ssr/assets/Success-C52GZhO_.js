import { jsx, jsxs } from "react/jsx-runtime";
import React__default, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { P as PublicLayout } from "./PublicLayout-BPgzBK4n.js";
import { g as getEcho } from "./echo-DaX0krWj.js";
import { toast } from "sonner";
import { c as cn, f as formatPrice } from "./utils-B0hQsrDj.js";
import { FileText, ThumbsUp, Clock, CheckCircle2, Home, MapPin } from "lucide-react";
import "framer-motion";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./button-BdX_X5dq.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./input-B_4qRSOV.js";
import "./label-L_u-fyc1.js";
import "@radix-ui/react-label";
import "./textarea-BpljFL5D.js";
import "@ably/laravel-echo";
import "ably";
import "clsx";
import "tailwind-merge";
const Ripple = React__default.memo(function Ripple2({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,white,transparent)] select-none",
        className
      ),
      ...props,
      children: Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = "solid";
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: `animate-ripple bg-foreground/25 absolute rounded-full border shadow-xl`,
            style: {
              "--i": i,
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              animationDelay,
              borderStyle,
              borderWidth: "1px",
              borderColor: `var(--foreground)`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) scale(1)"
            }
          },
          i
        );
      })
    }
  );
});
Ripple.displayName = "Ripple";
function Success({ tenant, order: initialOrder }) {
  const [order, setOrder] = useState(initialOrder);
  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);
  useEffect(() => {
    const echoInstance = getEcho();
    if (!echoInstance?.channel || !tenant?.id || !order?.id) return;
    const channelName = `tenant.${tenant.id}.orders.${order.id}`;
    const channel = echoInstance.channel(channelName);
    channel.listen(".order.status.updated", (e) => {
      setOrder((prev) => ({ ...prev, status: e.status }));
      let message = e.message;
      if (e.status === "confirmed") message = "¡Tu pedido ha sido confirmado!";
      if (e.status === "preparing") message = "¡Están preparando tu pedido!";
      if (e.status === "ready") message = "¡Tu pedido está listo!";
      if (e.status === "completed") message = "¡Pedido entregado! Gracias por tu compra.";
      if (e.status === "cancelled") message = "El pedido ha sido cancelado.";
      toast.success(message);
    });
    return () => {
      try {
        echoInstance.leave(channelName);
      } catch {
      }
    };
  }, [order.id, tenant.id]);
  if (order.status === "cancelled") {
    return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: "#fff", showFloatingCart: false, children: [
      /* @__PURE__ */ jsx(Head, { title: `Pedido Cancelado ${order.ticket_number}` }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx(FileText, { className: "w-10 h-10 text-red-500" }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-black text-slate-900 mb-2", children: "Pedido Cancelado" }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-500 mb-8", children: [
          "Este pedido (",
          order.ticket_number,
          ") ha sido cancelado. Si tienes dudas, contáctanos."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 w-full max-w-xs", children: [
          tenant.whatsapp_number && /* @__PURE__ */ jsx(
            "a",
            {
              href: `https://wa.me/57${tenant.whatsapp_number}?text=${encodeURIComponent(`Hola, tengo una duda sobre mi pedido cancelado ${order.ticket_number}.`)}`,
              target: "_blank",
              rel: "noreferrer",
              className: "bg-white border-2 border-green-500 text-green-600 font-bold py-3 px-6 rounded-xl hover:bg-green-50 transition-all text-center",
              "aria-label": "Contactar por WhatsApp sobre el pedido cancelado",
              children: "Contactar por WhatsApp"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: route("tenant.home", tenant.slug),
              className: "bg-slate-900 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-slate-800 transition-all text-center",
              "aria-label": "Volver al menú",
              children: "Volver al Menú"
            }
          )
        ] })
      ] })
    ] });
  }
  const getEstimatedTime = () => {
    const createdAt = new Date(order.created_at);
    const minTime = new Date(createdAt.getTime() + 45 * 6e4);
    const maxTime = new Date(createdAt.getTime() + 60 * 6e4);
    const formatTime = (date) => date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
    return `${formatTime(minTime)} a ${formatTime(maxTime)}`;
  };
  const steps = [
    { status: "pending", label: "Recibido", icon: FileText },
    { status: "confirmed", label: "Confirmado", icon: ThumbsUp },
    { status: "preparing", label: "Preparando", icon: Clock },
    { status: "ready", label: "Listo", icon: CheckCircle2 },
    { status: "completed", label: "Entregado", icon: Home }
  ];
  steps.findIndex((s) => s.status === order.status) === -1 ? 0 : steps.findIndex((s) => s.status === order.status);
  const getVisualStep = (status) => {
    if (status === "pending") return 0;
    if (status === "confirmed") return 1;
    if (status === "preparing") return 2;
    if (status === "ready") return 3;
    if (status === "completed") return 4;
    return 0;
  };
  const activeStep = getVisualStep(order.status);
  const hasWhatsApp = Boolean(tenant.whatsapp_number);
  const whatsappMessage = `Hola *${tenant.name}*, tengo una duda sobre mi pedido *${order.ticket_number}*.`;
  const whatsappLink = hasWhatsApp ? `https://wa.me/57${tenant.whatsapp_number}?text=${encodeURIComponent(whatsappMessage)}` : "#";
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: "#f8fafc", showFloatingCart: false, children: [
    /* @__PURE__ */ jsx(Head, { title: `Pedido ${order.ticket_number}` }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-lg mx-auto p-6 pb-24 min-h-[80vh] flex flex-col items-center pt-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative w-full flex flex-col items-center text-center animate-in zoom-in-50 duration-500 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -top-60 left-1/2 -translate-x-1/2 w-[560px] h-[560px] z-0 flex items-center justify-center pointer-events-none overflow-visible", children: /* @__PURE__ */ jsx(Ripple, { mainCircleSize: 100, mainCircleOpacity: 0.22, numCircles: 5 }) }),
        /* @__PURE__ */ jsx("div", { className: "relative z-10 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-10 h-10 text-green-600" }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-black text-slate-900 tracking-tight", children: "¡Pedido Recibido!" }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-500 mt-1 font-medium", children: [
          "Gracias, ",
          order.customer_name.split(" ")[0]
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 border border-blue-100 rounded-2xl p-4 w-full text-center mb-8 shadow-sm", children: [
        /* @__PURE__ */ jsx("p", { className: "text-blue-600 text-xs font-bold uppercase tracking-wider mb-1", children: "Hora estimada de entrega" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-900 text-xl font-black", children: getEstimatedTime() }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 mt-2 leading-tight px-4", children: "Este tiempo es calculado basado en la hora del pedido y el tiempo de preparación del restaurante." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full mb-10 mt-2 px-2", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-[18px] left-0 right-0 h-1 bg-slate-100 rounded-full z-0" }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute top-[18px] left-0 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full z-0 transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(34,197,94,0.4)]",
            style: { width: `${activeStep / (steps.length - 1) * 100}%` }
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "relative z-10 flex justify-between items-start", children: steps.map((step, index) => {
          const isActive = index <= activeStep;
          const isCurrent = index === activeStep;
          const isCompleted = index < activeStep;
          return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center group w-16", children: [
            /* @__PURE__ */ jsxs("div", { className: `relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10
                                           ${isCompleted ? "bg-green-500 border-2 border-green-500 text-white shadow-md shadow-green-200" : ""}
                                           ${isCurrent ? "bg-white border-2 border-green-500 text-green-600 scale-110 shadow-lg shadow-green-100" : ""}
                                           ${!isActive ? "bg-white border-2 border-slate-200 text-slate-300" : ""}
                                       `, children: [
              isCurrent && /* @__PURE__ */ jsx("span", { className: "absolute inset-0 rounded-full animate-ping bg-green-400 opacity-20" }),
              /* @__PURE__ */ jsx(step.icon, { className: `w-5 h-5 transition-transform duration-300 ${isCurrent ? "scale-110" : ""}` })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `mt-3 flex flex-col items-center transition-all duration-500 transform
                                            ${isActive ? "opacity-100 translate-y-0" : "opacity-60 translate-y-1"}
                                       `, children: [
              /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold uppercase tracking-wider text-center leading-tight
                                                ${isActive ? "text-slate-900" : "text-slate-400"}
                                                ${isCurrent ? "text-green-600" : ""}
                                            `, children: step.label }),
              isCurrent && step.status !== "completed" && /* @__PURE__ */ jsx("span", { className: "text-[9px] font-medium text-slate-400 animate-pulse mt-0.5", children: "En proceso..." })
            ] })
          ] }, step.status);
        }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "w-full flex justify-between items-end border-b border-slate-200 pb-4 mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-medium", children: "No. Pedido" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-slate-900", children: order.ticket_number })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-medium", children: "Valor Total" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-slate-900", children: formatPrice(order.total) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-full space-y-3 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-2", children: "Detalles de Entrega" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "mt-0.5", children: /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-slate-400" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-900", children: order.customer_name }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: order.customer_phone })
          ] })
        ] }),
        order.delivery_address && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "mt-0.5", children: /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-slate-400" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-900", children: order.delivery_address.neighborhood || "Dirección" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: order.delivery_address.address })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 border-t border-slate-200 pt-3 mt-1", children: [
          /* @__PURE__ */ jsx("div", { className: "mt-0.5", children: /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-slate-400" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-bold text-slate-900", children: [
              order.items.length,
              " Productos"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 line-clamp-1", children: order.items.map((i) => i.product?.name ?? i.product_name ?? "Producto").join(", ") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `grid gap-3 w-full ${hasWhatsApp ? "grid-cols-2" : "grid-cols-1"}`, children: [
        hasWhatsApp && /* @__PURE__ */ jsx(
          "a",
          {
            href: whatsappLink,
            target: "_blank",
            rel: "noreferrer",
            className: "bg-white border border-green-500 text-green-600 font-bold py-3.5 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-green-50 transition-all text-sm shadow-sm",
            "aria-label": "Contactar al restaurante por WhatsApp",
            children: /* @__PURE__ */ jsx("span", { children: "Contactar por WhatsApp" })
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: route("tenant.home", tenant.slug),
            className: "bg-slate-900 text-white font-bold py-3.5 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-slate-800 transition-all text-sm shadow-lg",
            "aria-label": "Volver al inicio",
            children: /* @__PURE__ */ jsx("span", { children: "Volver al Inicio" })
          }
        )
      ] })
    ] })
  ] });
}
export {
  Success as default
};
