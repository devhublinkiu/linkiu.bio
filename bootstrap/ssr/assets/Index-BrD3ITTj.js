import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import axios from "axios";
import { P as PublicLayout, u as useCart } from "./PublicLayout-BPgzBK4n.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon, ArrowLeft, Utensils, Store, Smartphone, Banknote, Copy, Upload, FileText, CreditCard } from "lucide-react";
import { c as cn } from "./utils-B0hQsrDj.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-BaovBWX5.js";
import { toast } from "sonner";
import "framer-motion";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "clsx";
import "tailwind-merge";
const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Root,
    {
      ref,
      "data-slot": "radio-group",
      className: cn("grid gap-2 w-full", className),
      ...props
    }
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Item,
    {
      ref,
      "data-slot": "radio-group-item",
      className: cn(
        "border-input text-primary dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 flex size-4 rounded-full focus-visible:ring-[3px] aria-invalid:ring-[3px] group/radio-group-item peer relative aspect-square shrink-0 border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        RadioGroupPrimitive.Indicator,
        {
          "data-slot": "radio-group-indicator",
          className: "group-aria-invalid/radio-group-item:text-destructive text-primary flex size-4 items-center justify-center",
          children: /* @__PURE__ */ jsx(CircleIcon, { className: "absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-current" })
        }
      )
    }
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
const CheckoutForm = ({ tenant, table, shippingMethod, bankAccounts, defaultLocationId, serviceType, setServiceType, deliveryCost }) => {
  const { items, cartTotal, clearCart } = useCart();
  const selectedLocationId = usePage().props.selected_location_id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    delivery_neighborhood: "",
    delivery_address: "",
    cash_amount: "",
    notes: ""
  });
  const [paymentProof, setPaymentProof] = useState(null);
  const total = cartTotal + deliveryCost;
  const change = paymentMethod === "cash" && formData.cash_amount ? parseFloat(formData.cash_amount) - total : 0;
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("¡Copiado al portapapeles!");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }
    setIsSubmitting(true);
    const locationId = serviceType === "dine_in" && table?.location_id ? table.location_id : selectedLocationId ?? defaultLocationId;
    if (!locationId && serviceType !== "dine_in") {
      toast.error("No se pudo determinar la sede. Recarga la página o elige una sede.");
      setIsSubmitting(false);
      return;
    }
    try {
      const payload = new FormData();
      payload.append("service_type", serviceType);
      if (serviceType === "dine_in" && table) payload.append("table_id", table.id);
      if (locationId) payload.append("location_id", String(locationId));
      payload.append("customer_name", formData.customer_name);
      if (formData.customer_phone) payload.append("customer_phone", formData.customer_phone);
      if (serviceType === "delivery") {
        payload.append("delivery_address[neighborhood]", formData.delivery_neighborhood);
        payload.append("delivery_address[address]", formData.delivery_address);
        payload.append("delivery_cost", deliveryCost.toString());
      }
      payload.append("payment_method", paymentMethod);
      if (paymentMethod === "cash") payload.append("cash_amount", formData.cash_amount);
      if (paymentMethod === "transfer" && paymentProof) payload.append("payment_proof", paymentProof);
      items.forEach((item, index) => {
        payload.append(`items[${index}][product_id]`, item.id.toString());
        payload.append(`items[${index}][quantity]`, item.quantity.toString());
        if (item.variant_options && Array.isArray(item.variant_options)) {
          item.variant_options.forEach((opt, vIndex) => {
            payload.append(`items[${index}][variant_options][${vIndex}][name]`, opt.name);
            payload.append(`items[${index}][variant_options][${vIndex}][value]`, opt.value);
            if (opt.price) {
              payload.append(`items[${index}][variant_options][${vIndex}][price]`, opt.price.toString());
            }
          });
        }
      });
      const response = await axios.post(route("tenant.checkout.process", { tenant: tenant.slug }), payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (response.data?.success && response.data?.redirect_url) {
        toast.success("¡Pedido enviado!");
        clearCart();
        window.location.href = response.data.redirect_url;
      } else {
        toast.error(response.data?.message || "Error al procesar el pedido");
      }
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.errors?.location_id?.[0] || "Error al procesar el pedido";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto p-4 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
      /* @__PURE__ */ jsx(Link, { href: route("tenant.cart", tenant.slug), className: "p-2 -ml-2 rounded-full hover:bg-slate-100", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-6 h-6 text-slate-600" }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-slate-800", children: "Finalizar Pedido" })
    ] }),
    /* @__PURE__ */ jsxs("form", { id: "checkout-form", onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold text-slate-500 uppercase mb-3 tracking-wider", children: "¿Cómo quieres tu pedido?" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: [
          table && /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setServiceType("dine_in"),
              className: `cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${serviceType === "dine_in" ? "border-black bg-slate-50" : "border-slate-100 hover:border-slate-200 bg-white"}`,
              children: [
                /* @__PURE__ */ jsx(Utensils, { className: `w-8 h-8 ${serviceType === "dine_in" ? "text-black" : "text-slate-400"}` }),
                /* @__PURE__ */ jsxs("span", { className: `font-bold text-sm ${serviceType === "dine_in" ? "text-slate-900" : "text-slate-500"}`, children: [
                  "Mesa ",
                  table.name
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setServiceType("takeout"),
              className: `cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${serviceType === "takeout" ? "border-black bg-slate-50" : "border-slate-100 hover:border-slate-200 bg-white"}`,
              children: [
                /* @__PURE__ */ jsx(Store, { className: `w-8 h-8 ${serviceType === "takeout" ? "text-black" : "text-slate-400"}` }),
                /* @__PURE__ */ jsx("span", { className: `font-bold text-sm ${serviceType === "takeout" ? "text-slate-900" : "text-slate-500"}`, children: "Para Recoger" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setServiceType("delivery"),
              className: `cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${serviceType === "delivery" ? "border-black bg-slate-50" : "border-slate-100 hover:border-slate-200 bg-white"}`,
              children: [
                /* @__PURE__ */ jsx(Smartphone, { className: `w-8 h-8 ${serviceType === "delivery" ? "text-black" : "text-slate-400"}` }),
                /* @__PURE__ */ jsx("span", { className: `font-bold text-sm ${serviceType === "delivery" ? "text-slate-900" : "text-slate-500"}`, children: "Domicilio" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Tus Datos" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "name", children: [
              "Nombre ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "name",
                placeholder: "Tu nombre",
                value: formData.customer_name,
                onChange: (e) => setFormData({ ...formData, customer_name: e.target.value }),
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "phone", children: [
              "WhatsApp ",
              serviceType === "delivery" && /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "phone",
                type: "tel",
                placeholder: "300 123 4567",
                value: formData.customer_phone,
                onChange: (e) => setFormData({ ...formData, customer_phone: e.target.value }),
                required: serviceType === "delivery"
              }
            )
          ] }),
          serviceType === "delivery" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "neighborhood", children: [
                "Barrio ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "neighborhood",
                  placeholder: "Ej: El Poblado",
                  value: formData.delivery_neighborhood,
                  onChange: (e) => setFormData({ ...formData, delivery_neighborhood: e.target.value }),
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "address", children: [
                "Dirección de Entrega ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  id: "address",
                  placeholder: "Calle 123 # 45 - 67, Apto 201",
                  value: formData.delivery_address,
                  onChange: (e) => setFormData({ ...formData, delivery_address: e.target.value }),
                  required: true
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Método de Pago" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(RadioGroup, { value: paymentMethod, onValueChange: (v) => setPaymentMethod(v), className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: `flex items-start space-x-3 space-y-0 rounded-md border p-4 ${paymentMethod === "cash" ? "border-black bg-slate-50" : ""}`, children: [
            /* @__PURE__ */ jsx(RadioGroupItem, { value: "cash", id: "cash", className: "mt-1" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "cash", className: "font-bold cursor-pointer", children: "Efectivo" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Pagas al recibir." }),
              paymentMethod === "cash" && /* @__PURE__ */ jsxs("div", { className: "pt-2 animate-in slide-in-from-top-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "cash_amount", className: "text-xs", children: "¿Con cuánto pagas?" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "$" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "cash_amount",
                      type: "number",
                      className: "h-9",
                      placeholder: "Ej: 50000",
                      value: formData.cash_amount,
                      onChange: (e) => setFormData({ ...formData, cash_amount: e.target.value })
                    }
                  )
                ] }),
                change > 0 && /* @__PURE__ */ jsxs("p", { className: "text-xs text-green-600 font-bold mt-1", children: [
                  "Cambio: $",
                  change.toLocaleString()
                ] }),
                change < 0 && formData.cash_amount && /* @__PURE__ */ jsxs("p", { className: "text-xs text-red-500 mt-1", children: [
                  "Faltan: $",
                  Math.abs(change).toLocaleString()
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Banknote, { className: "h-5 w-5 text-slate-500" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `flex items-start space-x-3 space-y-0 rounded-md border p-4 ${paymentMethod === "transfer" ? "border-black bg-slate-50" : ""}`, children: [
            /* @__PURE__ */ jsx(RadioGroupItem, { value: "transfer", id: "transfer", className: "mt-1" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "transfer", className: "font-bold cursor-pointer", children: "Transferencia Bancaria" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Envía el comprobante." }),
              paymentMethod === "transfer" && /* @__PURE__ */ jsxs("div", { className: "pt-3 animate-in fade-in slide-in-from-top-2", children: [
                bankAccounts && bankAccounts.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2 mb-4", children: bankAccounts.map((account) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex justify-between items-center shadow-sm", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-900 text-sm", children: account.bank_name }),
                    /* @__PURE__ */ jsx("p", { className: "font-mono text-slate-600 mt-0.5", children: account.account_type }),
                    /* @__PURE__ */ jsx("p", { className: "font-mono font-bold text-slate-800 text-sm tracking-wide", children: account.account_number }),
                    account.account_holder && /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-400 uppercase mt-1", children: [
                      "Titular: ",
                      account.account_holder
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      size: "icon",
                      variant: "secondary",
                      className: "h-9 w-9 shrink-0 text-slate-600 hover:text-slate-900",
                      onClick: (e) => {
                        e.preventDefault();
                        copyToClipboard(account.account_number);
                      },
                      title: "Copiar número",
                      children: /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" })
                    }
                  )
                ] }, account.id)) }) : /* @__PURE__ */ jsx("div", { className: "p-3 bg-yellow-50 text-yellow-700 text-xs rounded mb-3 border border-yellow-100", children: "No hay cuentas bancarias configuradas. Consulta al establecimiento." }),
                /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "proof", className: "text-xs font-bold text-slate-700", children: "Comprobante de Pago" }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "proof",
                        type: "file",
                        accept: "image/*",
                        className: "hidden",
                        onChange: (e) => setPaymentProof(e.target.files?.[0] || null)
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "label",
                      {
                        htmlFor: "proof",
                        className: "cursor-pointer bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center active:scale-95",
                        children: [
                          /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
                          paymentProof ? "Cambiar archivo" : "Subir Comprobante"
                        ]
                      }
                    )
                  ] }),
                  paymentProof && /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2 text-green-600 text-xs font-bold animate-in fade-in", children: [
                    /* @__PURE__ */ jsx(FileText, { className: "w-3 h-3" }),
                    /* @__PURE__ */ jsx("span", { className: "truncate max-w-[250px]", children: paymentProof.name })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Smartphone, { className: "h-5 w-5 text-slate-500" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `flex items-start space-x-3 space-y-0 rounded-md border p-4 ${paymentMethod === "card" ? "border-black bg-slate-50" : ""}`, children: [
            /* @__PURE__ */ jsx(RadioGroupItem, { value: "card", id: "card", className: "mt-1" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "card", className: "font-bold cursor-pointer", children: "Datáfono (Tarjeta)" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Llevamos el datáfono." })
            ] }),
            /* @__PURE__ */ jsx(CreditCard, { className: "h-5 w-5 text-slate-500" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-24" })
    ] })
  ] });
};
function CheckoutIndex({ tenant, table, shippingMethod, bankAccounts = [], default_location_id }) {
  const [serviceType, setServiceType] = useState(table ? "dine_in" : "takeout");
  const deliveryCost = serviceType === "delivery" ? parseFloat(shippingMethod?.cost) || 0 : 0;
  const renderFooter = (cart) => {
    const total = cart.cartTotal + deliveryCost;
    return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Subtotal" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "$",
          cart.cartTotal.toLocaleString()
        ] })
      ] }),
      serviceType === "delivery" && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Domicilio" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "$",
          deliveryCost.toLocaleString()
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xl font-bold text-slate-900 pb-2", children: [
        /* @__PURE__ */ jsx("span", { children: "Total" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "$",
          total.toLocaleString()
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => {
            const form = document.getElementById("checkout-form");
            if (form) form.requestSubmit();
          },
          disabled: cart.items.length === 0,
          className: "w-full h-12 text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-lg",
          children: [
            "Confirmar Pedido • $",
            total.toLocaleString()
          ]
        }
      )
    ] });
  };
  return /* @__PURE__ */ jsxs(
    PublicLayout,
    {
      bgColor: "#f8fafc",
      showFloatingCart: false,
      renderBottomAction: renderFooter,
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Finalizar Pedido" }),
        /* @__PURE__ */ jsx(
          CheckoutForm,
          {
            tenant,
            table,
            shippingMethod,
            bankAccounts,
            defaultLocationId: default_location_id,
            serviceType,
            setServiceType,
            deliveryCost
          }
        )
      ]
    }
  );
}
export {
  CheckoutIndex as default
};
