import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, User, Utensils, Banknote, CreditCard, Smartphone, CheckCircle, Clock, Minus, Plus, Search, Loader2, Check, ShoppingCart, Package, Trash2, UserPlus, Ban, ChefHat, X, Printer, Armchair, Construction, BadgeCheck, Receipt, Image } from "lucide-react";
import { T as Toaster } from "./sonner-ZUDSQr7N.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { S as ScrollArea } from "./scroll-area-iVmBTZv4.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { S as Sheet, b as SheetContent, d as SheetTitle } from "./sheet-BFMMArVC.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter, d as DialogDescription } from "./dialog-QdU9y0pO.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-B4HNlFNZ.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { v4 } from "uuid";
import { f as formatCurrency, c as calculateTax } from "./currency-CoUrQw_H.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import axios from "axios";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { C as Card } from "./card-BaovBWX5.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-dialog";
import "radix-ui";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
function POSLayout({ children, title, tenant, user }) {
  const isWaiter = user?.label === "waiter" || user?.permissions?.includes("pos.waiter_mode");
  return /* @__PURE__ */ jsxs("div", { className: "h-screen bg-slate-100 flex flex-col font-outfit overflow-hidden", children: [
    /* @__PURE__ */ jsx(Head, { title: `POS - ${title}` }),
    /* @__PURE__ */ jsxs("header", { className: "h-14 bg-slate-900 flex items-center justify-between px-4 shrink-0 z-50 shadow-md border-b border-slate-800", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        !isWaiter && /* @__PURE__ */ jsx(
          Link,
          {
            href: route("tenant.dashboard", tenant.slug),
            className: "p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all",
            title: "Volver al Dashboard",
            children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "font-black text-white text-lg tracking-tight", children: [
            "LINKIU",
            /* @__PURE__ */ jsx("span", { className: "text-indigo-400", children: "POS" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: "/" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-300 text-sm hidden sm:inline", children: title })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-emerald-500 uppercase tracking-wider", children: "En Línea" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white border border-slate-700 shadow-inner", children: /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-slate-400" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "flex-1 flex overflow-hidden relative", children }),
    /* @__PURE__ */ jsx(Toaster, { position: "bottom-center" })
  ] });
}
function CheckoutDialog({ open, onOpenChange, total, items, onSuccess, customer, tenant, table, isWaiter = false, locationId }) {
  const [method, setMethod] = useState("cash");
  const [cashAmount, setCashAmount] = useState("");
  const [transferRef, setTransferRef] = useState("");
  const [magicToken, setMagicToken] = useState("");
  const [uploadedProof, setUploadedProof] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sendToKitchen, setSendToKitchen] = useState(true);
  if (!tenant) {
    console.error("CheckoutDialog: Tenant prop is missing or undefined.");
    return null;
  }
  useEffect(() => {
    if (open && !magicToken) {
      setMagicToken(v4());
    }
    if (!open) {
      setMagicToken("");
      setUploadedProof(null);
      setTransferRef("");
    }
  }, [open]);
  useEffect(() => {
    if (!magicToken || !tenant.id) return;
    let channel = null;
    try {
      const echoInstance = window.Echo;
      if (echoInstance?.connector) {
        channel = echoInstance.private(`pos.${tenant.id}.magic.${magicToken}`).listen(".proof.uploaded", (e) => {
          setUploadedProof(e.fileUrl);
          setTransferRef("Linkiu Mágico - Recibido");
          toast.success("¡Comprobante recibido!");
        });
      }
    } catch (error) {
      console.error("Echo subscription error:", error);
    }
    return () => {
      channel?.stopListening(".proof.uploaded");
    };
  }, [magicToken, tenant?.id]);
  const change = method === "cash" && cashAmount ? parseFloat(cashAmount) - total : 0;
  const isValid = method !== "cash" || parseFloat(cashAmount) >= total;
  const handleConfirm = (payNow = true) => {
    if (payNow && !isValid) return;
    setIsProcessing(true);
    router.post(route("tenant.pos.store", { tenant: tenant.slug }), {
      location_id: locationId,
      items: items.filter((item) => !item.is_sent).map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        variant_options: item.variant_options,
        notes: item.notes || null
      })),
      payment_method: payNow ? method : null,
      service_type: table ? "dine_in" : "takeout",
      cash_amount: payNow && method === "cash" ? parseFloat(cashAmount) : null,
      cash_change: payNow && method === "cash" ? change : null,
      payment_reference: payNow && method === "transfer" ? transferRef : null,
      customer_id: customer ? customer.id : null,
      customer_name: customer ? customer.name : table ? `Mesa ${table.name}` : "Mostrador",
      customer_phone: customer ? customer.phone : null,
      table_id: table ? table.id : null,
      send_to_kitchen: sendToKitchen
    }, {
      onSuccess: () => {
        setIsProcessing(false);
        onOpenChange(false);
        if (payNow) {
          onSuccess({
            orderId: 0,
            paymentMethod: method,
            cashAmount: method === "cash" ? parseFloat(cashAmount) : void 0,
            change: method === "cash" ? change : void 0
          });
        } else {
          onSuccess();
          toast.success("¡Pedido guardado y mesa ocupada!");
        }
      },
      onError: (errors) => {
        setIsProcessing(false);
        console.error(errors);
        toast.error("Error al procesar el pedido.");
      }
    });
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: (val) => !isProcessing && onOpenChange(val), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { className: "text-center text-xl font-bold", children: "Cobrar Pedido" }) }),
    /* @__PURE__ */ jsxs("div", { className: "py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Utensils, { className: "w-5 h-5 text-indigo-600" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-900", children: "Enviar a Cocina" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500", children: "¿Emitir comanda al KDS?" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: sendToKitchen ? "default" : "outline",
            size: "sm",
            className: `h-8 px-3 ${sendToKitchen ? "bg-indigo-600" : ""}`,
            onClick: () => setSendToKitchen(!sendToKitchen),
            children: sendToKitchen ? "SÍ" : "NO"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-sm", children: "Total a Pagar" }),
        /* @__PURE__ */ jsx("div", { className: "text-5xl font-black text-slate-900 mt-1", children: formatCurrency(total) })
      ] }),
      /* @__PURE__ */ jsxs(Tabs, { value: method, onValueChange: (v) => setMethod(v), className: "w-full", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-3 mb-4", children: [
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "cash", className: "flex flex-col gap-1 py-2 h-auto", children: [
            /* @__PURE__ */ jsx(Banknote, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs", children: "Efectivo" })
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "card", className: "flex flex-col gap-1 py-2 h-auto", children: [
            /* @__PURE__ */ jsx(CreditCard, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs", children: "Tarjeta" })
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "transfer", className: "flex flex-col gap-1 py-2 h-auto", children: [
            /* @__PURE__ */ jsx(Smartphone, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs", children: "Transferencia" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "cash", className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Dinero Recibido" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500", children: "$" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  value: cashAmount,
                  onChange: (e) => setCashAmount(e.target.value),
                  className: "pl-7 text-lg font-bold",
                  placeholder: "0",
                  autoFocus: true
                }
              )
            ] })
          ] }),
          cashAmount && /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg flex justify-between items-center ${change >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`, children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Cambio / Devuelta:" }),
            /* @__PURE__ */ jsx("span", { className: "font-black text-xl", children: formatCurrency(Math.max(0, change)) })
          ] }),
          method === "cash" && change < 0 && /* @__PURE__ */ jsxs("p", { className: "text-red-500 text-xs font-bold text-center", children: [
            "Faltan ",
            formatCurrency(Math.abs(change))
          ] })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "card", children: /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200", children: /* @__PURE__ */ jsx(CreditCard, { className: "w-6 h-6 text-slate-900" }) }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-600 font-medium", children: [
            "Procesar pago en datáfono por ",
            /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900", children: formatCurrency(total) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "transfer", children: /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 font-medium mb-1", children: "Total a Transferir" }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-2xl text-slate-900", children: formatCurrency(total) })
          ] }),
          uploadedProof ? /* @__PURE__ */ jsxs("div", { className: "w-full bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center gap-2 animate-in fade-in zoom-in", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "w-8 h-8 text-green-600" }),
            /* @__PURE__ */ jsx("p", { className: "text-green-800 font-bold text-sm", children: "¡Comprobante Recibido!" }),
            /* @__PURE__ */ jsx("a", { href: uploadedProof, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-indigo-600 underline", children: "Ver Comprobante" }),
            /* @__PURE__ */ jsx("img", { src: uploadedProof, alt: "Comprobante", className: "w-16 h-16 object-cover rounded border" })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-white p-2 rounded shadow-sm border", children: magicToken && /* @__PURE__ */ jsx(
              QRCodeSVG,
              {
                value: route("tenant.magic.show", { tenant: tenant.slug, token: magicToken }),
                size: 128,
                level: "M"
              }
            ) }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 uppercase tracking-wider font-bold", children: "Escanear para cargar comprobante" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "w-full space-y-2 text-left", children: [
            /* @__PURE__ */ jsx(Label, { children: "Referencia / Comprobante (Opcional)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "#123456",
                value: transferRef,
                onChange: (e) => setTransferRef(e.target.value),
                className: "bg-white"
              }
            )
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { className: "flex-col sm:flex-row gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 flex gap-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), className: "flex-1", children: "Cancelar" }),
        table && /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "secondary",
            className: "flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900",
            onClick: () => handleConfirm(false),
            disabled: isProcessing,
            children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 mr-2" }),
              "Guardar"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          size: "lg",
          className: "w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold",
          onClick: () => handleConfirm(true),
          disabled: !isValid || isProcessing,
          children: isProcessing ? "Procesando..." : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 mr-2" }),
            isWaiter ? "Enviar (Precaución)" : "Confirmar Pago"
          ] })
        }
      )
    ] })
  ] }) });
}
function VariantSelectorModal({ product, open, onOpenChange, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [notes, setNotes] = useState("");
  useEffect(() => {
    if (open && product) {
      setQuantity(1);
      setSelectedVariants({});
      setNotes("");
    }
  }, [open, product]);
  const basePrice = product ? Number(product.price) : 0;
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(price);
  };
  const unitPrice = useMemo(() => {
    if (!product) return 0;
    let total = basePrice;
    if (product.variant_groups) {
      product.variant_groups.forEach((group) => {
        const selectedOptionIds = selectedVariants[group.id] || [];
        selectedOptionIds.forEach((optionId) => {
          const option = group.options.find((o) => o.id === optionId);
          if (option) {
            total += Number(option.price_adjustment);
          }
        });
      });
    }
    return total;
  }, [product, selectedVariants, basePrice]);
  const totalPrice = unitPrice * quantity;
  const handleVariantChange = (groupId, optionId, type) => {
    setSelectedVariants((prev) => {
      const currentSelected = prev[groupId] || [];
      if (type === "radio") {
        return { ...prev, [groupId]: [optionId] };
      } else {
        if (currentSelected.includes(optionId)) {
          return { ...prev, [groupId]: currentSelected.filter((id) => id !== optionId) };
        } else {
          return { ...prev, [groupId]: [...currentSelected, optionId] };
        }
      }
    });
  };
  const handleConfirm = () => {
    if (!product) return;
    if (product.variant_groups) {
      for (const group of product.variant_groups) {
        if (group.is_required) {
          const selected = selectedVariants[group.id] || [];
          if (selected.length < group.min_selection) {
            toast.error(`Selecciona al menos ${group.min_selection} opción en ${group.name}`);
            return;
          }
        }
      }
    }
    onAddToCart(product, quantity, selectedVariants, totalPrice, notes.trim() || void 0);
  };
  if (!product) return null;
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[500px] max-h-[90vh] flex flex-col p-0 gap-0 bg-white border-0 shadow-2xl", children: [
    /* @__PURE__ */ jsx(DialogHeader, { className: "p-4 border-b border-slate-100 flex-shrink-0", children: /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { className: "font-bold text-lg text-slate-900", children: product.name }),
      /* @__PURE__ */ jsx("span", { className: "text-lg font-black text-indigo-600", children: formatPrice(unitPrice) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-6 intro-y", children: [
      product.variant_groups?.map((group) => /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 text-sm", children: group.name }),
          group.is_required && /* @__PURE__ */ jsx("span", { className: "bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase", children: "Requerido" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-2", children: group.options.map((option) => {
          const isSelected = (selectedVariants[group.id] || []).includes(option.id);
          const priceAdj = Number(option.price_adjustment);
          return /* @__PURE__ */ jsxs(
            "label",
            {
              className: `flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all active:scale-[0.99] ${isSelected ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600" : "border-slate-200 hover:border-slate-300 bg-white"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: `w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isSelected ? "bg-indigo-600 border-indigo-600" : "border-slate-300"}`, children: isSelected && /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-white rounded-full" }) }),
                  /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${isSelected ? "text-indigo-900" : "text-slate-700"}`, children: option.name })
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: group.type === "radio" ? "radio" : "checkbox",
                    name: `group-${group.id}`,
                    className: "hidden",
                    checked: isSelected,
                    onChange: () => handleVariantChange(group.id, option.id, group.type)
                  }
                ),
                priceAdj > 0 && /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-slate-600", children: [
                  "+",
                  formatPrice(priceAdj)
                ] })
              ]
            },
            option.id
          );
        }) })
      ] }, group.id)),
      (!product.variant_groups || product.variant_groups.length === 0) && /* @__PURE__ */ jsx("div", { className: "text-center py-4 text-slate-400 text-sm", children: "Este producto no tiene opciones adicionales." }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 text-sm", children: "Notas especiales" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: notes,
            onChange: (e) => setNotes(e.target.value),
            placeholder: "Ej: Sin cebolla, extra queso, término medio...",
            maxLength: 200,
            rows: 2,
            className: "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-slate-400 text-right", children: [
          notes.length,
          "/200"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { className: "p-4 border-t border-slate-100 bg-slate-50 flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center bg-white rounded-xl border border-slate-200 h-12 w-full sm:w-auto px-1 shadow-sm", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setQuantity(Math.max(1, quantity - 1)),
            className: "w-10 h-full flex items-center justify-center text-slate-500 hover:text-red-600 active:scale-90 transition-transform",
            children: /* @__PURE__ */ jsx(Minus, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "w-10 text-center font-bold text-lg text-slate-900", children: quantity }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setQuantity(quantity + 1),
            className: "w-10 h-full flex items-center justify-center text-slate-500 hover:text-indigo-600 active:scale-90 transition-transform",
            children: /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: handleConfirm,
          className: "flex-1 h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20",
          children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Agregar ",
              quantity > 1 && `(${quantity})`
            ] }),
            /* @__PURE__ */ jsx("span", { className: "ml-auto bg-black/20 px-2 py-0.5 rounded text-sm", children: formatPrice(totalPrice) })
          ]
        }
      )
    ] })
  ] }) });
}
function CustomerSelectorModal({ open, onOpenChange, onSelect }) {
  const [mode, setMode] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    document: "",
    email: "",
    address: "",
    notes: ""
  });
  useEffect(() => {
    if (open && mode === "search") {
      const delayDebounceFn = setTimeout(() => {
        if (searchQuery.length > 0) {
          fetchCustomers();
        } else {
          setCustomers([]);
        }
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, mode, open]);
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(route("tenant.admin.pos.customers.index"), {
        params: { search: searchQuery }
      });
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error buscando clientes");
    } finally {
      setLoading(false);
    }
  };
  const handleCreateWrapper = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(route("tenant.admin.pos.customers.store"), {
        name: formData.name,
        phone: formData.phone,
        identification_number: formData.document,
        email: formData.email,
        address: formData.address,
        notes: formData.notes
      });
      const newCustomer = response.data;
      toast.success("Cliente creado correctamente");
      onSelect(newCustomer);
      setFormData({ name: "", phone: "", document: "", email: "", address: "", notes: "" });
      setMode("search");
    } catch (error) {
      console.error(error);
      toast.error("Error creando cliente. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };
  const handleSelectCustomer = (customer) => {
    onSelect(customer);
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0 bg-white border-0 shadow-2xl", children: [
    /* @__PURE__ */ jsx(DialogHeader, { className: "p-4 border-b border-slate-100 flex-shrink-0 bg-slate-50", children: /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { className: "font-bold text-lg text-slate-900", children: mode === "search" ? "Seleccionar Cliente" : "Nuevo Cliente" }),
      mode === "search" ? /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: () => setMode("create"), className: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm gap-1", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
        " Nuevo"
      ] }) : /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "ghost", onClick: () => setMode("search"), className: "text-slate-500 hover:text-slate-900 gap-1", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-4 h-4" }),
        " Buscar"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-hidden flex flex-col", children: mode === "search" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "p-4 border-b border-slate-100", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Buscar por nombre, teléfono o documento...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "pl-9 h-12 text-base",
            autoFocus: true
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "p-2 space-y-1", children: [
        customers.length === 0 && searchQuery.length > 0 && !loading && /* @__PURE__ */ jsxs("div", { className: "text-center py-10 text-slate-400", children: [
          /* @__PURE__ */ jsx("p", { children: "No se encontraron clientes." }),
          /* @__PURE__ */ jsx(Button, { variant: "link", onClick: () => setMode("create"), className: "text-indigo-600", children: "Crear nuevo" })
        ] }),
        customers.length === 0 && searchQuery.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-10 text-slate-400", children: [
          /* @__PURE__ */ jsx(User, { className: "w-12 h-12 mx-auto mb-2 opacity-20" }),
          /* @__PURE__ */ jsx("p", { children: "Busca un cliente para empezar" })
        ] }),
        loading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center p-8", children: /* @__PURE__ */ jsx(Loader2, { className: "w-6 h-6 animate-spin text-slate-400" }) }) : customers.map((customer) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleSelectCustomer(customer),
            className: "w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between group",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors", children: customer.name.charAt(0) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-700 group-hover:text-indigo-900", children: customer.name }),
                  /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-400 flex gap-2", children: [
                    customer.phone && /* @__PURE__ */ jsx("span", { children: customer.phone }),
                    customer.identification_number && /* @__PURE__ */ jsxs("span", { children: [
                      "• ",
                      customer.identification_number
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(Check, { className: "w-5 h-5 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" })
            ]
          },
          customer.id
        ))
      ] }) })
    ] }) : /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-6", children: /* @__PURE__ */ jsxs("form", { id: "create-customer-form", onSubmit: handleCreateWrapper, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre Completo *" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "name",
            required: true,
            value: formData.name,
            onChange: (e) => setFormData({ ...formData, name: e.target.value }),
            className: "h-11",
            placeholder: "Ej. Juan Pérez"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "phone", children: "Teléfono / WhatsApp" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "phone",
              value: formData.phone,
              onChange: (e) => setFormData({ ...formData, phone: e.target.value }),
              className: "h-11",
              placeholder: "300 123 4567"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "document", children: "Documento / NIT" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "document",
              value: formData.document,
              onChange: (e) => setFormData({ ...formData, document: e.target.value }),
              className: "h-11",
              placeholder: "Opcional"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email (Facturación)" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            type: "email",
            value: formData.email,
            onChange: (e) => setFormData({ ...formData, email: e.target.value }),
            className: "h-11",
            placeholder: "cliente@email.com"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "address", children: "Dirección (Delivery)" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "address",
            value: formData.address,
            onChange: (e) => setFormData({ ...formData, address: e.target.value }),
            className: "resize-none",
            placeholder: "Calle 123... (Opcional)"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "notes", children: "Notas Internas" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "notes",
            value: formData.notes,
            onChange: (e) => setFormData({ ...formData, notes: e.target.value }),
            className: "h-11",
            placeholder: "Preferencias, alergias, etc."
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(DialogFooter, { className: `p-4 border-t border-slate-100 bg-slate-50 ${mode === "create" ? "justify-between" : "justify-end"}`, children: mode === "create" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", onClick: () => setMode("search"), children: "Cancelar" }),
      /* @__PURE__ */ jsxs(Button, { type: "submit", form: "create-customer-form", disabled: loading, className: "bg-indigo-600 hover:bg-indigo-700 w-32", children: [
        loading && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }),
        "Guardar"
      ] })
    ] }) : /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cerrar" }) })
  ] }) });
}
function CartSidebar({
  cart,
  cartTotal,
  selectedCustomer,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onOpenCustomerModal,
  onShowCheckout,
  onSendToKitchen,
  canPay,
  isProcessing = false,
  isTakeoutMode = false,
  selectedTable,
  onAddProducts,
  onFreeTable,
  onCancelSentItem,
  taxSettings
}) {
  const { subtotal, taxAmount, grandTotal } = useMemo(() => {
    return calculateTax(
      cartTotal,
      taxSettings?.tax_rate || 0,
      taxSettings?.price_includes_tax || false
    );
  }, [cartTotal, taxSettings]);
  if (!selectedTable && !isTakeoutMode) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full bg-white items-center justify-center p-8 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(ShoppingCart, { className: "w-8 h-8 text-slate-300" }) }),
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 text-lg mb-2", children: "Sin Mesa Seleccionada" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm", children: "Selecciona una mesa del mapa para comenzar una orden." })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full bg-white w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: `h-16 px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 ${isTakeoutMode ? "bg-indigo-100" : "bg-indigo-50"}`, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "font-black text-xl text-indigo-900 flex items-center gap-2", children: isTakeoutMode ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Package, { className: "w-5 h-5" }),
          " Pedido Rápido"
        ] }) : selectedTable?.name }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-400 font-medium", children: isTakeoutMode ? "Takeout / Delivery" : "Orden en curso" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        selectedTable?.status === "occupied" && onFreeTable && !isTakeoutMode && /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "text-[10px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 h-8 px-2 border border-red-100 uppercase",
            onClick: onFreeTable,
            children: "Liberar"
          }
        ),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "text-slate-400 hover:text-red-500", onClick: onClearCart, children: /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-4 py-3 bg-slate-50 border-b border-slate-100 shrink-0", children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        className: `w-full justify-between bg-white border-dashed h-auto py-3 ${selectedCustomer ? "border-indigo-200 bg-indigo-50/50" : "text-slate-500 hover:text-indigo-600 hover:border-indigo-300"}`,
        onClick: onOpenCustomerModal,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-left", children: [
            /* @__PURE__ */ jsx("div", { className: `p-2 rounded-full ${selectedCustomer ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"}`, children: selectedCustomer ? /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(UserPlus, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: `text-sm font-bold ${selectedCustomer ? "text-indigo-900" : "text-slate-600"}`, children: selectedCustomer ? selectedCustomer.name : "Seleccionar Cliente" }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-slate-400", children: selectedCustomer ? selectedCustomer.phone || "Cliente Registrado" : "Venta de Mostrador" })
            ] })
          ] }),
          selectedCustomer ? /* @__PURE__ */ jsx(CreditCard, { className: "w-4 h-4 text-indigo-300" }) : /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "opacity-50", children: "INVITADO" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(ScrollArea, { className: "flex-1 px-4", children: /* @__PURE__ */ jsx("div", { className: "py-4 space-y-3", children: cart.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "h-40 flex flex-col items-center justify-center text-slate-300 text-sm italic", children: [
      /* @__PURE__ */ jsx(ShoppingCart, { className: "w-10 h-10 mb-2 opacity-20" }),
      "Carrito vacío",
      /* @__PURE__ */ jsx(Button, { variant: "link", onClick: onAddProducts, className: "mt-2 text-indigo-600", children: "Agregar Productos" })
    ] }) : cart.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3 bg-white p-2 rounded-lg border border-slate-100 hover:border-indigo-100 transition-colors group", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-slate-100 rounded-md shrink-0 overflow-hidden", children: item.image_url && /* @__PURE__ */ jsx("img", { src: item.image_url, className: "w-full h-full object-cover" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsx("div", { className: "font-bold text-sm text-slate-800 truncate pr-2", children: item.name }),
          /* @__PURE__ */ jsx("div", { className: "font-bold text-sm text-slate-900", children: formatCurrency(item.total) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-400 min-h-[16px] flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            formatCurrency(item.price),
            " c/u"
          ] }),
          item.is_sent && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[9px] h-4 bg-orange-50 text-orange-600 border-orange-200", children: "En Cocina" })
        ] }),
        item.notes && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded mt-1 border border-amber-100 italic", children: [
          "📝 ",
          item.notes
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mt-2", children: !item.is_sent ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-slate-50 rounded-full px-1 border border-slate-200", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => item.quantity > 1 ? onUpdateQuantity(item.id, -1) : onRemoveFromCart(item.id), className: "w-6 h-6 flex items-center justify-center text-slate-500 hover:text-red-500", children: /* @__PURE__ */ jsx(Minus, { className: "w-3 h-3" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold w-4 text-center", children: item.quantity }),
          /* @__PURE__ */ jsx("button", { onClick: () => onUpdateQuantity(item.id, 1), className: "w-6 h-6 flex items-center justify-center text-slate-500 hover:text-indigo-600", children: /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" }) })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-slate-400", children: [
            "Cantidad: ",
            item.quantity
          ] }),
          onCancelSentItem && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => onCancelSentItem(item.id),
              className: "text-[10px] font-bold text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors",
              title: "Anular item",
              children: [
                /* @__PURE__ */ jsx(Ban, { className: "w-3 h-3" }),
                "Anular"
              ]
            }
          )
        ] }) })
      ] })
    ] }, item.id)) }) }),
    /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-slate-100", children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        className: "w-full border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50",
        onClick: onAddProducts,
        children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-2" }),
          "Agregar Productos"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] shrink-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Subtotal" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatCurrency(subtotal) })
        ] }),
        taxSettings && taxSettings.tax_rate > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-slate-500", children: [
            taxSettings.tax_name,
            " (",
            taxSettings.tax_rate,
            "%)"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatCurrency(taxAmount) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end pt-2 border-t border-dashed border-slate-200", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-lg text-slate-900", children: "Total" }),
          /* @__PURE__ */ jsx("span", { className: "font-black text-2xl text-indigo-600", children: formatCurrency(grandTotal) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3", children: canPay ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "lg",
            className: "h-14 flex flex-col items-center justify-center gap-1 border-orange-300 text-orange-600 hover:bg-orange-50",
            disabled: cart.length === 0 || isProcessing || !cart.some((item) => !item.is_sent),
            onClick: onSendToKitchen,
            children: [
              isProcessing ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 mb-0.5 animate-spin" }) : /* @__PURE__ */ jsx(ChefHat, { className: "w-5 h-5 mb-0.5" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", children: "Cocina" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            size: "lg",
            className: "h-14 flex flex-col items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white",
            disabled: cart.length === 0 || isProcessing,
            onClick: onShowCheckout,
            children: [
              /* @__PURE__ */ jsx(Banknote, { className: "w-5 h-5 mb-0.5" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", children: "Cobrar" })
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsxs(
        Button,
        {
          size: "lg",
          className: "h-14 flex flex-col items-center justify-center gap-1 bg-orange-500 hover:bg-orange-600 text-white w-full",
          disabled: cart.length === 0 || isProcessing,
          onClick: onSendToKitchen,
          children: [
            isProcessing ? /* @__PURE__ */ jsx(Loader2, { className: "w-6 h-6 mb-0.5 animate-spin" }) : /* @__PURE__ */ jsx(ChefHat, { className: "w-6 h-6 mb-0.5" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase", children: isProcessing ? "Enviando..." : "Enviar a Cocina" })
          ]
        }
      ) })
    ] })
  ] });
}
function ProductCatalogDrawer({ open, onOpenChange, categories, onProductSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories.length > 0 ? String(categories[0].id) : "all");
  const filteredProducts = useMemo(() => {
    let products = [];
    if (activeCategory === "all") {
      categories.forEach((cat) => products.push(...cat.products));
    } else {
      const category = categories.find((c) => String(c.id) === activeCategory);
      if (category) products = category.products;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query)
      );
    }
    return products;
  }, [categories, activeCategory, searchQuery]);
  return /* @__PURE__ */ jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxs(SheetContent, { side: "right", className: "w-[100vw] sm:w-[600px] p-0 flex flex-col h-full bg-slate-50", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-4 border-b bg-white", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsx(SheetTitle, { children: "Catálogo de Productos" }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-slate-400" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Buscar productos...",
            className: "pl-9 bg-slate-100 border-none",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            autoFocus: true
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-b bg-white px-4 pb-2", children: /* @__PURE__ */ jsx(ScrollArea, { className: "w-full whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-2 pb-2", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: activeCategory === "all" ? "default" : "outline",
          size: "sm",
          onClick: () => setActiveCategory("all"),
          className: activeCategory === "all" ? "bg-indigo-600 hover:bg-indigo-700" : "",
          children: "Todo"
        }
      ),
      categories.map((category) => /* @__PURE__ */ jsx(
        Button,
        {
          variant: activeCategory === String(category.id) ? "default" : "outline",
          size: "sm",
          onClick: () => setActiveCategory(String(category.id)),
          className: activeCategory === String(category.id) ? "bg-indigo-600 hover:bg-indigo-700" : "",
          children: category.name
        },
        category.id
      ))
    ] }) }) }),
    /* @__PURE__ */ jsx(ScrollArea, { className: "flex-1 p-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 pb-20", children: [
      filteredProducts.map((product) => /* @__PURE__ */ jsxs(
        Card,
        {
          className: "group cursor-pointer overflow-hidden hover:shadow-md transition-all border-slate-200",
          onClick: () => {
            onProductSelect(product);
          },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "aspect-[4/3] bg-slate-200 relative overflow-hidden", children: [
              product.image_url ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: product.image_url,
                  alt: product.name,
                  className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                }
              ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-slate-300", children: /* @__PURE__ */ jsx(ChefHat, { className: "w-8 h-8" }) }),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-slate-800 line-clamp-2 text-sm h-10 leading-tight", children: product.name }),
              /* @__PURE__ */ jsx("div", { className: "font-bold text-indigo-600 mt-1", children: formatCurrency(product.price) })
            ] })
          ]
        },
        product.id
      )),
      filteredProducts.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-full text-center py-10 text-slate-500", children: /* @__PURE__ */ jsx("p", { children: "No se encontraron productos" }) })
    ] }) })
  ] }) });
}
function ReceiptModal({ open, onOpenChange, data }) {
  const receiptRef = useRef(null);
  if (!data) return null;
  const baseTotal = data.items.reduce((acc, item) => acc + item.total, 0);
  const { subtotal, taxAmount, grandTotal } = calculateTax(
    baseTotal,
    data.taxSettings?.tax_rate || 0,
    data.taxSettings?.price_includes_tax || false
  );
  const methodLabel = {
    cash: "Efectivo",
    card: "Tarjeta",
    transfer: "Transferencia"
  };
  const now = /* @__PURE__ */ new Date();
  const dateStr = now.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
  const timeStr = now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  const handlePrint = () => {
    if (!data) return;
    const itemsHtml = data.items.map(
      (item) => `<div class="row"><span class="item-name">${item.name}</span><span class="item-price">${formatCurrency(item.total)}</span></div>
             <div class="detail">${item.quantity} x ${formatCurrency(item.price)}</div>${item.notes ? `<div class="detail" style="font-style:italic;">* ${item.notes}</div>` : ""}`
    ).join("");
    const taxHtml = data.taxSettings.tax_rate > 0 ? `<div class="row"><span>${data.taxSettings.tax_name} (${data.taxSettings.tax_rate}%)</span><span>${formatCurrency(taxAmount)}</span></div>` : "";
    const cashHtml = data.paymentMethod === "cash" && data.cashAmount !== void 0 ? `<div class="row"><span>Recibido</span><span>${formatCurrency(data.cashAmount)}</span></div>
               <div class="row bold"><span>Cambio</span><span>${formatCurrency(data.change ?? 0)}</span></div>` : "";
    const printWindow = window.open("", "_blank", "width=350,height=700");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Recibo #${data.orderId}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
@page {
    size: 80mm auto;
    margin: 0;
}
html, body {
    width: 80mm;
    margin: 0;
    padding: 0;
}
body {
    font-family: 'Courier New', 'Lucida Console', monospace;
    font-size: 12px;
    line-height: 1.5;
    color: #000;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}
.receipt {
    width: 80mm;
    max-width: 80mm;
    margin: 0 auto;
    padding: 6mm 5mm;
}
.center { text-align: center; }
.bold { font-weight: bold; }
.shop-name {
    font-size: 18px;
    font-weight: 900;
    letter-spacing: -0.5px;
    margin-bottom: 3px;
}
.date { font-size: 10px; color: #333; margin-top: 2px; }
.divider {
    border: none;
    border-top: 1px dashed #000;
    margin: 8px 0;
}
.row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 2px 0;
    font-size: 12px;
    gap: 8px;
}
.detail {
    font-size: 10px;
    color: #333;
    padding-left: 10px;
    margin-bottom: 5px;
}
.item-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 8px;
}
.item-price {
    white-space: nowrap;
    font-weight: bold;
}
.total-section .row { font-size: 12px; }
.grand-total {
    font-size: 20px;
    font-weight: 900;
    padding: 5px 0;
}
.footer {
    font-size: 9px;
    color: #555;
    margin-top: 10px;
    padding-top: 5px;
}
@media print {
    html, body { width: 80mm; }
    .receipt { width: 100%; padding: 4mm 4mm; }
}
@media screen {
    body { display: flex; justify-content: center; background: #f0f0f0; padding: 10px 0; }
    .receipt { background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
}
</style>
</head>
<body>
<div class="receipt">
<div class="center">
    <div class="shop-name">${data.tenant.name}</div>
    <div class="date">${dateStr} - ${timeStr}</div>
</div>
<div class="divider"></div>
<div class="row"><span>Pedido</span><span class="bold">#${String(data.orderId).padStart(4, "0")}</span></div>
${data.table ? `<div class="row"><span>Mesa</span><span class="bold">${data.table.name}</span></div>` : ""}
${data.customer ? `<div class="row"><span>Cliente</span><span class="bold">${data.customer.name}</span></div>` : ""}
<div class="divider"></div>
${itemsHtml}
<div class="divider"></div>
<div class="total-section">
    <div class="row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
    ${taxHtml}
    <div class="divider"></div>
    <div class="row grand-total"><span>TOTAL</span><span>${formatCurrency(grandTotal)}</span></div>
</div>
<div class="divider"></div>
<div class="row"><span>Método</span><span class="bold">${methodLabel[data.paymentMethod] || data.paymentMethod}</span></div>
${cashHtml}
<div class="divider"></div>
<div class="center footer">
    <div class="bold" style="font-size:11px;color:#000;">Gracias por su compra</div>
    <div style="margin-top:3px;">Powered by Linkiu.bio</div>
</div>
</div>
<script>window.onload = function() { window.print(); window.close(); }<\/script>
</body>
</html>`);
    printWindow.document.close();
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[360px] p-0 gap-0 bg-white overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { ref: receiptRef, className: "p-6 font-mono text-xs text-slate-900 leading-relaxed", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-lg font-black tracking-tight", children: data.tenant.name }),
        /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-slate-500 mt-1", children: [
          dateStr,
          " · ",
          timeStr
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-dashed border-slate-300 my-3" }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Pedido" }),
        /* @__PURE__ */ jsxs("span", { className: "font-bold", children: [
          "#",
          String(data.orderId).padStart(4, "0")
        ] })
      ] }),
      data.table && /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Mesa" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold", children: data.table.name })
      ] }),
      data.customer && /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Cliente" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold truncate ml-4", children: data.customer.name })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-dashed border-slate-300 my-3" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: data.items.map((item) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "truncate max-w-[180px] font-medium", children: item.name }),
          /* @__PURE__ */ jsx("span", { className: "font-bold shrink-0 ml-2", children: formatCurrency(item.total) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-slate-400 pl-2", children: [
          item.quantity,
          " x ",
          formatCurrency(item.price)
        ] }),
        item.notes && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-amber-600 pl-2 italic", children: [
          "→ ",
          item.notes
        ] })
      ] }, item.id)) }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-dashed border-slate-300 my-3" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Subtotal" }),
          /* @__PURE__ */ jsx("span", { children: formatCurrency(subtotal) })
        ] }),
        data.taxSettings.tax_rate > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-slate-500", children: [
            data.taxSettings.tax_name,
            " (",
            data.taxSettings.tax_rate,
            "%)"
          ] }),
          /* @__PURE__ */ jsx("span", { children: formatCurrency(taxAmount) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "border-t border-slate-200 my-1" }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-base font-black", children: [
          /* @__PURE__ */ jsx("span", { children: "TOTAL" }),
          /* @__PURE__ */ jsx("span", { children: formatCurrency(grandTotal) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-dashed border-slate-300 my-3" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Método" }),
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: methodLabel[data.paymentMethod] || data.paymentMethod })
        ] }),
        data.paymentMethod === "cash" && data.cashAmount !== void 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Recibido" }),
            /* @__PURE__ */ jsx("span", { children: formatCurrency(data.cashAmount) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-bold text-green-700", children: [
            /* @__PURE__ */ jsx("span", { children: "Cambio" }),
            /* @__PURE__ */ jsx("span", { children: formatCurrency(data.change ?? 0) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-dashed border-slate-300 my-4" }),
      /* @__PURE__ */ jsxs("div", { className: "text-center text-[10px] text-slate-400 space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-600", children: "Gracias por su compra" }),
        /* @__PURE__ */ jsx("p", { children: "Powered by Linkiu.bio" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 p-4 border-t border-slate-200 bg-slate-50", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          className: "flex-1",
          onClick: () => onOpenChange(false),
          children: [
            /* @__PURE__ */ jsx(X, { className: "w-4 h-4 mr-2" }),
            "Cerrar"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          className: "flex-1 bg-slate-900 hover:bg-slate-800 text-white",
          onClick: handlePrint,
          children: [
            /* @__PURE__ */ jsx(Printer, { className: "w-4 h-4 mr-2" }),
            "Imprimir"
          ]
        }
      )
    ] })
  ] }) });
}
function POSIndex({ tenant, categories, zones = [], taxSettings, currentUserRole, reservations = [], locations = [], currentLocationId }) {
  const [cart, setCart] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [activeZoneId, setActiveZoneId] = useState("all");
  const [showCheckout, setShowCheckout] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [showProductDrawer, setShowProductDrawer] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [locationId, setLocationId] = useState(currentLocationId);
  const [confirmCloseCartOpen, setConfirmCloseCartOpen] = useState(false);
  const [confirmClearCartOpen, setConfirmClearCartOpen] = useState(false);
  const [confirmFreeTableOpen, setConfirmFreeTableOpen] = useState(false);
  const [pendingTable, setPendingTable] = useState(null);
  const [tableSearch, setTableSearch] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [isTakeoutMode, setIsTakeoutMode] = useState(false);
  const [showVerifyPayment, setShowVerifyPayment] = useState(false);
  const [verifyingTable, setVerifyingTable] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [quickProductSearch, setQuickProductSearch] = useState("");
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const isWaiter = currentUserRole?.label === "waiter" || currentUserRole?.permissions?.includes("pos.waiter_mode") || false;
  const [currentReservationCheckingIn, setCurrentReservationCheckingIn] = useState(null);
  const [checkInConfirmOpen, setCheckInConfirmOpen] = useState(false);
  const [pendingCheckInTable, setPendingCheckInTable] = useState(null);
  const [pendingCheckInReservation, setPendingCheckInReservation] = useState(null);
  const canPay = currentUserRole?.is_owner || currentUserRole?.permissions?.includes("pos.process_payment") || false;
  const { cartSubtotal, cartTaxAmount, cartGrandTotal } = useMemo(() => {
    const baseTotal = cart.reduce((total, item) => total + item.total, 0);
    const { subtotal, taxAmount, grandTotal } = calculateTax(
      baseTotal,
      taxSettings?.tax_rate || 0,
      taxSettings?.price_includes_tax || false
    );
    return { cartSubtotal: subtotal, cartTaxAmount: taxAmount, cartGrandTotal: grandTotal };
  }, [cart, taxSettings]);
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);
  const allProducts = useMemo(() => {
    const products = [];
    categories.forEach((cat) => {
      if (cat.products) {
        products.push(...cat.products);
      }
    });
    return products;
  }, [categories]);
  const filteredInlineProducts = useMemo(() => {
    if (!quickProductSearch || quickProductSearch.length < 2) return [];
    const q = quickProductSearch.toLowerCase();
    return allProducts.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6);
  }, [quickProductSearch, allProducts]);
  const [readyOrderIds, setReadyOrderIds] = useState(/* @__PURE__ */ new Set());
  const [echoConnected, setEchoConnected] = useState(false);
  const [waiterCollectedIds, setWaiterCollectedIds] = useState(/* @__PURE__ */ new Set());
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
  const activeOrderIds = useMemo(() => {
    const ids = [];
    zones.forEach((zone) => {
      zone.tables.forEach((table) => {
        if (table.active_order?.id) {
          ids.push(table.active_order.id);
        }
      });
    });
    return ids;
  }, [zones]);
  useEffect(() => {
    const echoInstance = window.Echo;
    if (!echoInstance?.connector || !tenant.id || activeOrderIds.length === 0) {
      setEchoConnected(false);
      return;
    }
    setEchoConnected(true);
    const channels = [];
    activeOrderIds.forEach((orderId) => {
      const channel = echoInstance.channel(`tenant.${tenant.id}.orders.${orderId}`).listen(".order.status.updated", (e) => {
        if (e.comment === "waiter_collected") {
          setWaiterCollectedIds((prev) => new Set(prev).add(e.id));
          playNotificationSound();
          toast.success(`Mesero registró cobro del Pedido #${e.id}`, {
            id: `waiter-collected-${e.id}`,
            duration: 2e4,
            description: "Toca la mesa para verificar el pago",
            style: { background: "#ecfdf5", border: "2px solid #059669", fontWeight: "bold" }
          });
          router.reload({ only: ["zones"] });
        } else if (e.status === "ready") {
          setReadyOrderIds((prev) => new Set(prev).add(e.id));
          playNotificationSound();
          toast.success(`Pedido #${e.id} LISTO en cocina`, {
            id: `ready-${e.id}`,
            duration: 15e3,
            description: "Toca la mesa para ver el pedido",
            style: { background: "#ecfdf5", border: "2px solid #10b981", fontWeight: "bold" }
          });
        } else if (e.status === "preparing") {
          toast.info(`Pedido #${e.id} en preparación`, { id: `preparing-${e.id}`, duration: 5e3 });
        }
      });
      channels.push(channel);
    });
    return () => {
      channels.forEach((ch) => ch.stopListening(".order.status.updated"));
    };
  }, [tenant.id, activeOrderIds]);
  useEffect(() => {
    if (echoConnected || activeOrderIds.length === 0 || !tenant.slug) return;
    const poll = async () => {
      try {
        const res = await fetch(`/${tenant.slug}/admin/gastronomy/kitchen/orders?status=ready`, {
          headers: { "Accept": "application/json", "X-Requested-With": "XMLHttpRequest" }
        });
        if (!res.ok) return;
        const orders = await res.json();
        orders.forEach((order) => {
          if (order.status === "ready" && activeOrderIds.includes(order.id) && !readyOrderIds.has(order.id)) {
            setReadyOrderIds((prev) => new Set(prev).add(order.id));
            playNotificationSound();
            toast.success(`Pedido #${order.id} LISTO en cocina`, {
              id: `ready-${order.id}`,
              duration: 15e3,
              description: "Toca la mesa para ver el pedido",
              style: { background: "#ecfdf5", border: "2px solid #10b981", fontWeight: "bold" }
            });
          }
        });
      } catch {
      }
    };
    const interval = setInterval(poll, 2e4);
    poll();
    return () => clearInterval(interval);
  }, [echoConnected, activeOrderIds, tenant.slug, readyOrderIds]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (!reservations) return;
      const now = /* @__PURE__ */ new Date();
      reservations.forEach((res) => {
        if (res.status === "seated") {
          const startRes = /* @__PURE__ */ new Date(`${res.reservation_date}T${res.reservation_time}`);
          const endRes = new Date(startRes.getTime() + 72e5);
          if (now > endRes) {
            toast.warning(`La mesa ${res.table ? res.table.name : "Sin Mesa"} ha excedido el tiempo de reserva.`, {
              duration: 1e4,
              action: {
                label: "Entendido",
                onClick: () => console.log("Alert acknowledged")
              }
            });
          }
        }
      });
    }, 6e4);
    return () => clearInterval(interval);
  }, [reservations]);
  const handleCheckInConfirmation = (table, reservation) => {
    setPendingCheckInTable(table);
    setPendingCheckInReservation(reservation);
    setCheckInConfirmOpen(true);
  };
  const loadActiveOrderItems = (table) => {
    if (table.active_order && table.active_order.items) {
      const includesTax = taxSettings?.price_includes_tax || false;
      const rate = taxSettings?.tax_rate || 0;
      const existingItems = table.active_order.items.map((item) => {
        const itemTotal = parseFloat(String(item.total));
        const itemPrice = parseFloat(String(item.price));
        const normalizedTotal = !includesTax ? itemTotal / (1 + rate / 100) : itemTotal;
        const normalizedPrice = !includesTax ? itemPrice / (1 + rate / 100) : itemPrice;
        return {
          id: `sent-${item.id}`,
          product_id: item.product_id,
          name: item.product_name,
          price: normalizedPrice,
          quantity: item.quantity,
          total: normalizedTotal,
          variant_options: typeof item.variant_options === "string" ? JSON.parse(item.variant_options) : item.variant_options,
          notes: item.notes,
          is_sent: true
        };
      });
      setCart(existingItems);
      if (table.active_order.customer_id) {
        setSelectedCustomer({
          id: table.active_order.customer_id,
          name: table.active_order.customer_name,
          phone: table.active_order.customer_phone || void 0
        });
      } else {
        setSelectedCustomer(null);
      }
    } else {
      setCart([]);
      setSelectedCustomer(null);
    }
  };
  const handleVerifyPayment = async () => {
    if (!verifyingTable?.active_order?.id) return;
    setIsVerifying(true);
    try {
      await axios.post(
        route("tenant.admin.pos.verify-payment", { tenant: tenant.slug, order: verifyingTable.active_order.id })
      );
      toast.success("Pago verificado y orden completada. Mesa liberada.");
      setShowVerifyPayment(false);
      setVerifyingTable(null);
      router.reload();
    } catch {
      toast.error("Error al verificar el pago");
    } finally {
      setIsVerifying(false);
    }
  };
  const handleTableClick = (table) => {
    if (isTakeoutMode) {
      setIsTakeoutMode(false);
    }
    if (table.active_order?.waiter_collected) {
      setVerifyingTable(table);
      setShowVerifyPayment(true);
      return;
    }
    if (currentReservationCheckingIn) {
      handleCheckInConfirmation(table, currentReservationCheckingIn);
      return;
    }
    if (table.status === "reserved") {
      const reservation = reservations.find((r) => r.table_id === table.id && r.status === "confirmed");
      if (reservation) {
        handleCheckInConfirmation(table, reservation);
        return;
      }
    }
    if (selectedTable?.id === table.id) {
      loadActiveOrderItems(table);
      return;
    }
    const hasUnsentItems = cart.some((item) => !item.is_sent);
    if (selectedTable && hasUnsentItems) {
      setPendingTable(table);
      setConfirmCloseCartOpen(true);
      return;
    }
    setSelectedTable(table);
    loadActiveOrderItems(table);
  };
  const confirmCheckIn = () => {
    if (!pendingCheckInReservation || !pendingCheckInTable) return;
    const reservation = pendingCheckInReservation;
    const table = pendingCheckInTable;
    router.put(route("tenant.admin.reservations.update", {
      tenant: tenant.slug,
      reservation: reservation.id
    }), {
      status: "seated",
      table_id: table.id
    }, {
      onSuccess: () => {
        toast.success(`Check-in completado para ${reservation.customer_name}`);
        setSelectedTable(table);
        setSelectedCustomer({
          id: reservation.customer_id || 0,
          name: reservation.customer_name,
          phone: reservation.customer_phone,
          email: reservation.customer_email || ""
        });
        setCart([]);
        setCheckInConfirmOpen(false);
        setPendingCheckInTable(null);
        setPendingCheckInReservation(null);
        setCurrentReservationCheckingIn(null);
      }
    });
  };
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setShowVariantModal(true);
  };
  const addToCart = (product, variantOptions = null, finalPrice = null, quantity = 1, notes) => {
    const basePrice = parseFloat(String(product.price));
    const unitPrice = finalPrice !== null ? finalPrice : basePrice;
    const itemId = `item-${Date.now()}-${Math.random()}`;
    let formattedVariants;
    if (variantOptions && product.variant_groups) {
      const result = [];
      for (const [groupId, optionIds] of Object.entries(variantOptions)) {
        const group = product.variant_groups?.find((g) => g.id === Number(groupId));
        if (!group) continue;
        for (const optId of optionIds) {
          const opt = group.options.find((o) => o.id === optId);
          if (opt) {
            result.push({
              id: opt.id,
              name: opt.name,
              price_adjustment: opt.price_adjustment,
              group_name: group.name,
              option_name: opt.name,
              price: Number(opt.price_adjustment)
            });
          }
        }
      }
      formattedVariants = result.length > 0 ? result : void 0;
    }
    const newItem = {
      id: itemId,
      product_id: product.id,
      name: product.name,
      price: unitPrice,
      quantity,
      image_url: product.image_url,
      total: unitPrice * quantity,
      variant_options: formattedVariants,
      notes
    };
    setCart((prev) => [...prev, newItem]);
    toast.success("Producto agregado");
  };
  const updateQuantity = (id, delta) => {
    setCart((prev) => prev.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, total: newQty * item.price };
      }
      return item;
    }));
  };
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };
  const handleSendToKitchen = () => {
    const newItems = cart.filter((item) => !item.is_sent);
    if (newItems.length === 0) {
      toast.error("No hay productos nuevos para enviar a cocina");
      return;
    }
    if (!selectedTable) {
      toast.error("Selecciona una mesa primero");
      return;
    }
    setIsProcessing(true);
    router.post(route("tenant.pos.store", { tenant: tenant.slug }), {
      location_id: locationId,
      items: newItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        variant_options: item.variant_options,
        notes: item.notes || null
      })),
      service_type: "dine_in",
      table_id: selectedTable.id,
      payment_method: null,
      customer_id: selectedCustomer?.id || null,
      customer_name: selectedCustomer?.name || (selectedTable.name.toLowerCase().startsWith("mesa") ? selectedTable.name : `Mesa ${selectedTable.name}`),
      customer_phone: selectedCustomer?.phone || null,
      send_to_kitchen: true
    }, {
      onSuccess: () => {
        setIsProcessing(false);
        toast.success("Pedido enviado a cocina");
        setCart([]);
        setSelectedTable(null);
        setSelectedCustomer(null);
        setIsMobileCartOpen(false);
      },
      onError: () => {
        setIsProcessing(false);
        toast.error("Error al enviar pedido");
      }
    });
  };
  const [confirmCancelItemId, setConfirmCancelItemId] = useState(null);
  const handleCancelSentItem = (itemId) => {
    setConfirmCancelItemId(itemId);
  };
  const confirmCancelSentItem = () => {
    if (!confirmCancelItemId) return;
    const dbId = confirmCancelItemId.replace("sent-", "");
    if (!dbId || dbId === confirmCancelItemId) {
      setCart((prev) => prev.filter((i) => i.id !== confirmCancelItemId));
      setConfirmCancelItemId(null);
      return;
    }
    setIsProcessing(true);
    fetch(route("tenant.admin.pos.cancel-item", { tenant: tenant.slug, item: dbId }), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
        "Accept": "application/json"
      }
    }).then((res) => res.json()).then((data) => {
      setIsProcessing(false);
      if (data.success) {
        setCart((prev) => prev.filter((i) => i.id !== confirmCancelItemId));
        toast.success(data.message || "Item anulado");
        setConfirmCancelItemId(null);
      } else {
        toast.error(data.message || "Error al anular item");
        setConfirmCancelItemId(null);
      }
    }).catch(() => {
      setIsProcessing(false);
      toast.error("Error de red al anular item");
      setConfirmCancelItemId(null);
    });
  };
  const handleFreeTable = () => {
    if (!selectedTable) return;
    setConfirmFreeTableOpen(true);
  };
  const confirmFreeTableAction = () => {
    if (!selectedTable) return;
    router.post(route("tenant.admin.pos.free-table", {
      tenant: tenant.slug,
      table: selectedTable.id
    }), {}, {
      onSuccess: () => {
        toast.success("Mesa liberada correctamente");
        setSelectedTable(null);
        setCart([]);
        setConfirmFreeTableOpen(false);
      }
    });
  };
  const handleLocationChange = (val) => {
    router.visit(route("tenant.admin.pos", { tenant: tenant.slug, location_id: val }));
  };
  const handleClearCart = () => {
    if (cart.length === 0) return;
    const hasUnsent = cart.some((item) => !item.is_sent);
    if (hasUnsent) {
      setConfirmClearCartOpen(true);
    } else {
      setCart([]);
    }
  };
  const confirmClearCartAction = () => {
    setCart((prev) => prev.filter((item) => item.is_sent));
    setConfirmClearCartOpen(false);
  };
  const [timerTick, setTimerTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTimerTick((t) => t + 1), 3e4);
    return () => clearInterval(interval);
  }, []);
  const getElapsedTime = (createdAt) => {
    const start = new Date(createdAt);
    const now = /* @__PURE__ */ new Date();
    const diffMs = now.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 6e4);
    if (diffMins < 60) return `${diffMins}min`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };
  return /* @__PURE__ */ jsxs(POSLayout, { title: "POS | Mesas", user: currentUserRole, tenant, children: [
    /* @__PURE__ */ jsx(Head, { title: "Punto de Venta" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full flex h-[calc(100vh-64px)] overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col bg-slate-100 min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white border-b px-4 md:px-6 py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-3 z-10 shrink-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 overflow-x-auto", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setActiveZoneId("all"),
                className: `px-4 py-2 rounded-full text-sm font-bold transition-all shrink-0 ${activeZoneId === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`,
                children: "Todas"
              }
            ),
            zones.map((zone) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setActiveZoneId(String(zone.id)),
                className: `px-4 py-2 rounded-full text-sm font-bold transition-all shrink-0 ${activeZoneId === String(zone.id) ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`,
                children: zone.name
              },
              zone.id
            )),
            /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-slate-200 mx-1 shrink-0" }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  setIsTakeoutMode(true);
                  setSelectedTable(null);
                  setCart([]);
                  setSelectedCustomer(null);
                  setShowProductDrawer(true);
                },
                className: "px-4 py-2 rounded-full text-sm font-bold transition-all shrink-0 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 flex items-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsx(Package, { className: "w-4 h-4" }),
                  "Pedido Rápido"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Buscar producto...",
                  value: quickProductSearch,
                  onChange: (e) => setQuickProductSearch(e.target.value),
                  className: "pl-8 h-9 w-[160px] md:w-[200px] bg-indigo-50/50 border-indigo-200 text-sm focus:ring-indigo-300"
                }
              ),
              filteredInlineProducts.length > 0 && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 z-50 overflow-hidden max-h-64", children: filteredInlineProducts.map((product) => /* @__PURE__ */ jsxs(
                "button",
                {
                  className: "w-full px-3 py-2.5 flex items-center gap-3 hover:bg-indigo-50 transition-colors text-left",
                  onClick: () => {
                    handleProductSelect(product);
                    setQuickProductSearch("");
                  },
                  children: [
                    product.image_url ? /* @__PURE__ */ jsx("img", { src: product.image_url, className: "w-8 h-8 rounded object-cover shrink-0" }) : /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded bg-slate-100 shrink-0" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-slate-800 truncate", children: product.name }),
                      /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-400", children: formatCurrency(product.price) })
                    ] })
                  ]
                },
                product.id
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Buscar mesa...",
                  value: tableSearch,
                  onChange: (e) => setTableSearch(e.target.value),
                  className: "pl-8 h-9 w-[120px] md:w-[150px] bg-slate-50 border-slate-200 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(Select, { value: String(locationId), onValueChange: handleLocationChange, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[160px] md:w-[200px] h-9 bg-slate-50 border-slate-200", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar Sede" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: String(loc.id), children: loc.name }, loc.id)) })
            ] })
          ] })
        ] }),
        currentReservationCheckingIn && /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 text-white px-6 py-3 flex items-center justify-between z-20 animate-in fade-in slide-in-from-top duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 font-bold", children: [
            /* @__PURE__ */ jsx(Armchair, { className: "w-5 h-5 text-indigo-400" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "MODO CHECK-IN: Selecciona mesa para ",
              currentReservationCheckingIn.customer_name,
              " (",
              currentReservationCheckingIn.party_size,
              " pax)"
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "secondary",
              size: "sm",
              className: "h-8 text-xs bg-white/20 hover:bg-white/30 text-white border-0",
              onClick: () => setCurrentReservationCheckingIn(null),
              children: "Cancelar"
            }
          )
        ] }),
        isTakeoutMode && /* @__PURE__ */ jsxs("div", { className: "bg-indigo-600 text-white px-6 py-3 flex items-center justify-between z-20 animate-in fade-in slide-in-from-top duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 font-bold", children: [
            /* @__PURE__ */ jsx(Package, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { children: "PEDIDO RÁPIDO — Takeout / Delivery (sin mesa)" })
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "secondary",
              size: "sm",
              className: "h-8 text-xs bg-white/20 hover:bg-white/30 text-white border-0",
              onClick: () => {
                setIsTakeoutMode(false);
                setCart([]);
                setSelectedCustomer(null);
              },
              children: "Cancelar"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(ScrollArea, { className: "flex-1 p-6", children: !isPageLoaded ? (
          /* Skeleton Loader */
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-20", children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "h-40 rounded-xl border border-slate-200 bg-slate-50 animate-pulse flex flex-col items-center justify-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-slate-200" }),
            /* @__PURE__ */ jsx("div", { className: "w-16 h-4 rounded bg-slate-200" }),
            /* @__PURE__ */ jsx("div", { className: "w-10 h-3 rounded bg-slate-200" })
          ] }, i)) })
        ) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-20", children: [
          zones.filter((z) => activeZoneId === "all" || String(z.id) === activeZoneId).flatMap(
            (zone) => zone.tables.filter((table) => {
              if (!tableSearch) return true;
              return table.name.toLowerCase().includes(tableSearch.toLowerCase());
            }).map((table) => {
              const isReservedToday = reservations.some((r) => r.table_id === table.id && ["confirmed", "pending"].includes(r.status));
              let statusColor = "bg-white border-slate-200";
              let statusBadge = "bg-slate-100 text-slate-500";
              let icon = /* @__PURE__ */ jsx(Armchair, { className: "w-8 h-8 text-slate-300" });
              let displayStatus = table.status;
              if (displayStatus === "available" && isReservedToday) {
                displayStatus = "reserved";
              } else if (displayStatus === "reserved" && !isReservedToday) {
                displayStatus = "available";
              }
              const isOrderReady = table.active_order?.id ? readyOrderIds.has(table.active_order.id) : false;
              const isWaiterCollected = table.active_order?.waiter_collected === true || (table.active_order?.id ? waiterCollectedIds.has(table.active_order.id) : false);
              if (displayStatus === "occupied" && isWaiterCollected) {
                statusColor = "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300/50";
                statusBadge = "bg-emerald-500 text-white";
                icon = /* @__PURE__ */ jsx(ShoppingCart, { className: "w-8 h-8 text-emerald-500" });
              } else if (displayStatus === "occupied" && isOrderReady) {
                statusColor = "bg-green-50 border-green-300 ring-2 ring-green-300/30";
                statusBadge = "bg-green-100 text-green-700";
                icon = /* @__PURE__ */ jsx(CheckCircle, { className: "w-8 h-8 text-green-500" });
              } else if (displayStatus === "occupied") {
                statusColor = "bg-red-50/30 border-red-200";
                statusBadge = "bg-red-100 text-red-600";
                icon = /* @__PURE__ */ jsx(Clock, { className: "w-8 h-8 text-red-400" });
              } else if (displayStatus === "reserved") {
                statusColor = "bg-amber-50/30 border-amber-200";
                statusBadge = "bg-amber-100 text-amber-600";
                icon = /* @__PURE__ */ jsx(CheckCircle, { className: "w-8 h-8 text-amber-400" });
              } else if (displayStatus === "available") {
                statusColor = "bg-white border-slate-200 hover:bg-slate-50";
                statusBadge = "bg-slate-100 text-slate-500";
                icon = /* @__PURE__ */ jsx(Armchair, { className: "w-8 h-8 text-slate-300" });
              } else if (displayStatus === "maintenance") {
                statusColor = "bg-slate-100 border-slate-200 opacity-50";
                icon = /* @__PURE__ */ jsx(Construction, { className: "w-8 h-8 text-slate-400" });
              }
              const isSelected = selectedTable?.id === table.id;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: () => handleTableClick(table),
                  className: `
                                                        relative h-40 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer
                                                        ${statusColor}
                                                        ${isSelected ? "border-2 border-slate-900 bg-white ring-2 ring-slate-900/10" : "hover:border-slate-400"}
                                                    `,
                  children: [
                    /* @__PURE__ */ jsx("div", { className: `absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusBadge}`, children: isWaiterCollected ? "💰 Cobrado" : isOrderReady ? "Listo" : displayStatus === "available" ? "Libre" : displayStatus === "occupied" ? "Ocupada" : displayStatus === "reserved" ? "Reservada" : "Mant." }),
                    table.status === "occupied" && table.active_order && /* @__PURE__ */ jsxs("div", { className: "absolute top-3 left-3 flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 text-red-400" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-red-50 px-1.5 py-0.5 rounded text-red-600 font-mono font-bold border border-red-200", children: getElapsedTime(table.active_order.created_at) })
                    ] }),
                    icon,
                    /* @__PURE__ */ jsx("div", { className: "text-xl font-black text-slate-700 font-mono", children: table.name }),
                    /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-400 font-medium", children: [
                      table.capacity,
                      " Pax"
                    ] }),
                    table.status === "occupied" && table.active_order && isWaiterCollected && /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 text-center bg-emerald-100 py-1.5 border-t border-emerald-300 rounded-b-xl", children: /* @__PURE__ */ jsxs("div", { className: "text-xs font-black text-emerald-800", children: [
                      "VERIFICAR ",
                      formatCurrency(table.active_order.total)
                    ] }) }),
                    table.status === "occupied" && table.active_order && !isWaiterCollected && /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 text-center bg-red-50/80 py-1.5 border-t border-red-200 rounded-b-xl", children: /* @__PURE__ */ jsx("div", { className: "text-sm font-black text-red-700", children: formatCurrency(table.active_order.total) }) })
                  ]
                },
                table.id
              );
            })
          ),
          zones.length === 0 && /* @__PURE__ */ jsxs("div", { className: "col-span-full h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50", children: [
            /* @__PURE__ */ jsx(Construction, { className: "w-12 h-12 mb-4 opacity-50" }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold", children: "No hay zonas configuradas" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Configura zonas y mesas en el panel de administración." })
          ] }),
          zones.length > 0 && zones.filter((z) => activeZoneId === "all" || String(z.id) === activeZoneId).every((z) => z.tables.filter((t) => !tableSearch || t.name.toLowerCase().includes(tableSearch.toLowerCase())).length === 0) && /* @__PURE__ */ jsxs("div", { className: "col-span-full h-48 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50", children: [
            /* @__PURE__ */ jsx(Search, { className: "w-10 h-10 mb-3 opacity-30" }),
            /* @__PURE__ */ jsx("h3", { className: "text-base font-bold", children: tableSearch ? "No se encontraron mesas" : "Esta zona no tiene mesas" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm mt-1", children: tableSearch ? `Sin resultados para "${tableSearch}"` : "Agrega mesas desde el panel de administración." })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "hidden lg:flex w-[400px] border-l border-slate-200 shrink-0 bg-white z-20 h-full", children: /* @__PURE__ */ jsx(
        CartSidebar,
        {
          cart,
          cartTotal: cartSubtotal,
          selectedCustomer,
          selectedTable,
          onUpdateQuantity: updateQuantity,
          onRemoveFromCart: removeFromCart,
          onClearCart: handleClearCart,
          onOpenCustomerModal: () => setShowCustomerModal(true),
          onShowCheckout: () => setShowCheckout(true),
          onSendToKitchen: handleSendToKitchen,
          onCancelSentItem: handleCancelSentItem,
          canPay,
          isProcessing,
          isTakeoutMode,
          onAddProducts: () => {
            if (!selectedTable && !isTakeoutMode) {
              toast.error("Selecciona una mesa primero");
              return;
            }
            setShowProductDrawer(true);
          },
          onFreeTable: handleFreeTable,
          taxSettings
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx(Sheet, { open: isMobileCartOpen, onOpenChange: setIsMobileCartOpen, children: /* @__PURE__ */ jsx(SheetContent, { side: "right", className: "p-0 w-full sm:w-[400px]", children: /* @__PURE__ */ jsx(
      CartSidebar,
      {
        cart,
        cartTotal: cartSubtotal,
        selectedCustomer,
        selectedTable,
        onUpdateQuantity: updateQuantity,
        onRemoveFromCart: removeFromCart,
        onClearCart: handleClearCart,
        onOpenCustomerModal: () => setShowCustomerModal(true),
        onShowCheckout: () => {
          setShowCheckout(true);
          setIsMobileCartOpen(false);
        },
        onSendToKitchen: handleSendToKitchen,
        onCancelSentItem: handleCancelSentItem,
        canPay,
        isProcessing,
        isTakeoutMode,
        onAddProducts: () => {
          setIsMobileCartOpen(false);
          setShowProductDrawer(true);
        },
        onFreeTable: handleFreeTable,
        taxSettings
      }
    ) }) }),
    /* @__PURE__ */ jsx(
      ProductCatalogDrawer,
      {
        open: showProductDrawer,
        onOpenChange: setShowProductDrawer,
        categories,
        onProductSelect: handleProductSelect
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "lg:hidden fixed bottom-4 right-4 z-50", children: /* @__PURE__ */ jsxs(
      Button,
      {
        onClick: () => setIsMobileCartOpen(true),
        size: "lg",
        className: "rounded-full w-14 h-14 shadow-lg bg-slate-900 hover:bg-slate-800 text-white relative",
        children: [
          /* @__PURE__ */ jsx(ShoppingCart, { className: "w-6 h-6" }),
          cart.length > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white", children: cart.length })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(
      CheckoutDialog,
      {
        open: showCheckout,
        onOpenChange: setShowCheckout,
        total: cartGrandTotal,
        items: cart,
        onSuccess: (result) => {
          if (result) {
            setReceiptData({
              orderId: result.orderId,
              items: [...cart],
              paymentMethod: result.paymentMethod,
              cashAmount: result.cashAmount,
              change: result.change,
              customer: selectedCustomer,
              table: selectedTable,
              tenant,
              taxSettings
            });
            setShowReceipt(true);
          }
          setCart([]);
          setShowCheckout(false);
          setSelectedCustomer(null);
          if (!isTakeoutMode) {
            setSelectedTable(null);
          }
          setIsTakeoutMode(false);
        },
        customer: selectedCustomer,
        tenant,
        table: isTakeoutMode ? null : selectedTable,
        isWaiter,
        locationId
      }
    ),
    /* @__PURE__ */ jsx(
      ReceiptModal,
      {
        open: showReceipt,
        onOpenChange: setShowReceipt,
        data: receiptData
      }
    ),
    /* @__PURE__ */ jsx(
      VariantSelectorModal,
      {
        open: showVariantModal,
        onOpenChange: setShowVariantModal,
        product: selectedProduct,
        onAddToCart: (product, quantity, variants, totalPrice, notes) => {
          addToCart(product, variants, totalPrice, quantity, notes);
          setShowVariantModal(false);
        }
      }
    ),
    /* @__PURE__ */ jsx(
      CustomerSelectorModal,
      {
        open: showCustomerModal,
        onOpenChange: setShowCustomerModal,
        onSelect: (customer) => {
          setSelectedCustomer(customer);
          setShowCustomerModal(false);
        }
      }
    ),
    /* @__PURE__ */ jsx(AlertDialog, { open: checkInConfirmOpen, onOpenChange: setCheckInConfirmOpen, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Llegó el cliente?" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("p", { children: "Confirma el check-in de esta reserva:" }),
          pendingCheckInReservation && /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 rounded-lg space-y-1 text-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold text-slate-800", children: pendingCheckInReservation.customer_name }),
            /* @__PURE__ */ jsxs("div", { className: "text-slate-500", children: [
              pendingCheckInReservation.reservation_time?.substring(0, 5),
              " · ",
              pendingCheckInReservation.party_size,
              " personas"
            ] }),
            pendingCheckInTable && /* @__PURE__ */ jsxs("div", { className: "text-indigo-600 font-medium", children: [
              "Mesa: ",
              pendingCheckInTable.name
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400", children: [
            "La mesa cambiará a ",
            /* @__PURE__ */ jsx("strong", { className: "text-red-500", children: "ocupada" }),
            " y el cliente se vinculará al pedido."
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { onClick: () => {
          setPendingCheckInTable(null);
          setPendingCheckInReservation(null);
        }, children: "Cancelar" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: confirmCheckIn,
            className: "bg-slate-900 text-white hover:bg-slate-800",
            children: "Sí, Check-in"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: confirmCloseCartOpen, onOpenChange: setConfirmCloseCartOpen, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Cambiar de mesa?" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Tienes productos en el carrito. Al cambiar de mesa, el carrito actual se vaciará." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { onClick: () => setConfirmCloseCartOpen(false), children: "Mantener mesa actual" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: () => {
              setConfirmCloseCartOpen(false);
              if (pendingTable) {
                setSelectedTable(pendingTable);
                loadActiveOrderItems(pendingTable);
                setPendingTable(null);
              }
            },
            className: "bg-red-600 text-white hover:bg-red-700",
            children: "Vaciar y Cambiar"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: confirmClearCartOpen, onOpenChange: setConfirmClearCartOpen, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Vaciar carrito?" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Se eliminarán los productos que aún no han sido enviados a cocina. Los productos ya enviados se mantendrán." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: confirmClearCartAction,
            className: "bg-red-600 text-white hover:bg-red-700",
            children: "Sí, Vaciar"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!confirmCancelItemId, onOpenChange: (open) => {
      if (!open) setConfirmCancelItemId(null);
    }, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { className: "text-red-600", children: "¿Anular este producto?" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Este producto ya fue enviado a cocina. Al anularlo, se restará del total de la orden inmediatamente y cocina será notificada." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Volver" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: confirmCancelSentItem,
            className: "bg-red-600 text-white hover:bg-red-700",
            disabled: isProcessing,
            children: isProcessing ? "Anulando..." : "Sí, Anular Item"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: confirmFreeTableOpen, onOpenChange: setConfirmFreeTableOpen, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { className: "text-red-600", children: "¿Liberar Mesa Manualmente?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "Esta acción cambiará el estado de la mesa ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-900", children: selectedTable?.name }),
          " a ",
          /* @__PURE__ */ jsx("span", { className: "text-green-600 font-bold", children: "Disponible" }),
          " sin procesar un pago. Úsala solo en casos excepcionales (error de sistema o cliente que se retiró sin consumir)."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Volver" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: confirmFreeTableAction,
            className: "bg-red-600 text-white hover:bg-red-700",
            children: "Sí, Liberar Mesa"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: showVerifyPayment, onOpenChange: (open) => {
      if (!open) {
        setShowVerifyPayment(false);
        setVerifyingTable(null);
      }
    }, children: /* @__PURE__ */ jsx(DialogContent, { className: "max-w-md p-0 overflow-hidden rounded-2xl", children: verifyingTable?.active_order && (() => {
      const order = verifyingTable.active_order;
      const proofUrl = order.payment_proof_url || order.payment_proof;
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "bg-emerald-600 p-5 text-white", children: /* @__PURE__ */ jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-white text-lg", children: [
            /* @__PURE__ */ jsx(BadgeCheck, { className: "w-6 h-6" }),
            "Verificar Pago — ",
            verifyingTable.name
          ] }),
          /* @__PURE__ */ jsx(DialogDescription, { className: "text-emerald-100 mt-1", children: "El mesero registró el cobro de esta mesa. Revisa los detalles y verifica." })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl p-4 border border-slate-200", children: [
            /* @__PURE__ */ jsxs("h4", { className: "text-xs font-bold text-slate-500 uppercase tracking-wider mb-3", children: [
              "Resumen del Pedido #",
              order.id
            ] }),
            order.items && order.items.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: order.items.filter((i) => i.status !== "cancelled").map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-slate-700", children: [
                item.quantity,
                "x ",
                item.product_name
              ] }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: formatCurrency(Number(item.total) || Number(item.price) * item.quantity) })
            ] }, idx)) }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400", children: "Items no disponibles en vista previa" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 pt-3 border-t border-slate-200 flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-base font-black text-slate-900", children: "TOTAL" }),
              /* @__PURE__ */ jsx("span", { className: "text-xl font-black text-emerald-700", children: formatCurrency(order.total) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-blue-50 rounded-xl p-4 border border-blue-200", children: [
            /* @__PURE__ */ jsx(CreditCard, { className: "w-5 h-5 text-blue-600 flex-shrink-0" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-blue-600 uppercase", children: "Método de Pago" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-900 capitalize", children: { cash: "Efectivo", bank_transfer: "Transferencia Bancaria", dataphone: "Datáfono" }[order.payment_method || ""] || order.payment_method || "No especificado" })
            ] })
          ] }),
          order.payment_reference && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-amber-50 rounded-xl p-4 border border-amber-200", children: [
            /* @__PURE__ */ jsx(Receipt, { className: "w-5 h-5 text-amber-600 flex-shrink-0" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-amber-600 uppercase", children: "Referencia" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-900 font-mono", children: order.payment_reference })
            ] })
          ] }),
          proofUrl && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Image, { className: "w-4 h-4 text-slate-500" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-500 uppercase", children: "Comprobante de Pago" })
            ] }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: typeof proofUrl === "string" ? proofUrl : "#",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "block rounded-xl overflow-hidden border-2 border-slate-200 hover:border-emerald-400 transition-colors",
                children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: typeof proofUrl === "string" ? proofUrl : "",
                    alt: "Comprobante de pago",
                    className: "w-full max-h-64 object-contain bg-slate-100"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 text-center", children: "Toca la imagen para verla completa" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 border-t border-slate-100 bg-slate-50 space-y-2", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: handleVerifyPayment,
              disabled: isVerifying,
              className: "w-full h-12 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg",
              children: [
                isVerifying ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(BadgeCheck, { className: "w-5 h-5 mr-2" }),
                isVerifying ? "Verificando..." : "VERIFICAR Y COMPLETAR PEDIDO"
              ]
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-center text-slate-400", children: "Se marcará la orden como completada y la mesa quedará libre" })
        ] })
      ] });
    })() }) })
  ] });
}
export {
  POSIndex as default
};
