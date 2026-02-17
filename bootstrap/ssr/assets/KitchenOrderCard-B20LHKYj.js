import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { C as Card, a as CardHeader, d as CardContent, e as CardFooter } from "./card-BaovBWX5.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { S as ScrollArea } from "./scroll-area-iVmBTZv4.js";
import { Clock, Table, Users, Ban, Loader2, ChefHat, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { c as cn } from "./utils-B0hQsrDj.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-scroll-area";
import "clsx";
import "tailwind-merge";
const KitchenOrderCard = ({ order, onReady, onPreparing, processingId }) => {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const isProcessing = processingId === order.id;
  useEffect(() => {
    const calculate = () => {
      const start = new Date(order.created_at).getTime();
      const now = (/* @__PURE__ */ new Date()).getTime();
      setElapsedMinutes(Math.floor((now - start) / 6e4));
    };
    calculate();
    const interval = setInterval(calculate, 15e3);
    return () => clearInterval(interval);
  }, [order.created_at]);
  const getUrgencyColor = () => {
    if (elapsedMinutes >= 20) return "border-red-500 bg-red-50";
    if (elapsedMinutes >= 10) return "border-amber-500 bg-amber-50";
    return "border-slate-200 bg-white";
  };
  const getTimeBadgeColor = () => {
    if (elapsedMinutes >= 20) return "bg-red-500 text-white animate-pulse";
    if (elapsedMinutes >= 10) return "bg-amber-500 text-white";
    return "bg-slate-100 text-slate-700";
  };
  const activeItems = order.items.filter((i) => i.status === "active" || !i.status);
  const cancelledItems = order.items.filter((i) => i.status === "cancelled");
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, scale: 0.9, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.8, x: 100 },
      className: "h-full",
      children: /* @__PURE__ */ jsxs(Card, { className: cn(
        "flex flex-col h-full border-t-4 transition-all duration-300 shadow-sm",
        getUrgencyColor()
      ), children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "p-3 pb-2 space-y-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-2xl font-black text-slate-900 leading-none", children: order.ticket_number }),
              order.priority === "high" && /* @__PURE__ */ jsx(Badge, { className: "bg-red-600 text-white text-[10px] py-0 px-1 font-bold animate-pulse", children: "ALTA PRIORIDAD" }),
              order.status === "preparing" && /* @__PURE__ */ jsx(Badge, { className: "bg-blue-600 text-white text-[10px] py-0 px-1 font-bold", children: "EN PREPARACIÓN" })
            ] }),
            /* @__PURE__ */ jsxs(Badge, { className: getTimeBadgeColor(), children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 mr-1" }),
              elapsedMinutes,
              " min"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-medium text-slate-500", children: [
            order.service_type === "dine_in" ? /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded", children: [
              /* @__PURE__ */ jsx(Table, { className: "w-3 h-3 mr-1" }),
              order.table?.name || "Mesa"
            ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded", children: [
              /* @__PURE__ */ jsx(Users, { className: "w-3 h-3 mr-1" }),
              order.service_type === "delivery" ? "Domicilio" : "Para llevar"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "truncate max-w-[100px]", children: order.customer_name })
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "p-3 pt-0 flex-1 overflow-hidden", children: /* @__PURE__ */ jsx(ScrollArea, { className: "h-full pr-2", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-2", children: [
          activeItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3 border-b border-slate-100 pb-2 last:border-0", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0", children: item.quantity }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold text-slate-800 leading-tight", children: item.product_name }),
              item.variant_options && item.variant_options.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: item.variant_options.map((opt, oIdx) => /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-slate-100 text-slate-600 px-1 rounded", children: opt.value || opt.name }, oIdx)) }),
              item.notes && /* @__PURE__ */ jsxs("div", { className: "mt-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200 font-medium", children: [
                "⚠️ ",
                item.notes
              ] })
            ] })
          ] }, item.id)),
          cancelledItems.length > 0 && /* @__PURE__ */ jsx("div", { className: "border-t border-red-100 pt-2 mt-2", children: cancelledItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pb-1 opacity-50", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-red-400 bg-red-50 w-6 h-6 flex items-center justify-center rounded flex-shrink-0", children: /* @__PURE__ */ jsx(Ban, { className: "w-3 h-3" }) }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-red-400 line-through leading-tight", children: [
              item.quantity,
              "x ",
              item.product_name
            ] })
          ] }, item.id)) })
        ] }) }) }),
        /* @__PURE__ */ jsxs(CardFooter, { className: "p-3 pt-2 bg-slate-50 flex flex-col gap-2", children: [
          order.status === "confirmed" && onPreparing && /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: () => onPreparing(order.id),
              variant: "outline",
              className: "w-full border-blue-300 text-blue-700 hover:bg-blue-50 font-bold h-10",
              disabled: isProcessing,
              children: [
                isProcessing ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(ChefHat, { className: "w-4 h-4 mr-2" }),
                "PREPARANDO"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: () => onReady(order.id),
              className: "w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-lg shadow-sm",
              disabled: isProcessing,
              children: [
                isProcessing ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 mr-2" }),
                isProcessing ? "PROCESANDO..." : "DESPACHAR"
              ]
            }
          )
        ] })
      ] })
    }
  );
};
export {
  KitchenOrderCard
};
