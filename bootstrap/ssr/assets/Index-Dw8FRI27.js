import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { usePage, Head, Link } from "@inertiajs/react";
import { A as AdminLayout } from "./AdminLayout-C8hB-Nb-.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-BaovBWX5.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { S as ScrollArea } from "./scroll-area-iVmBTZv4.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-B4HNlFNZ.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { ArrowLeft, ConciergeBell, Table, Package, Search, AlertCircle, Utensils, Receipt, CheckCircle, UtensilsCrossed, Trash2, Plus, StickyNote, Minus, Loader2, Send, Clock, Copy, X, Camera, Banknote, CreditCard, Wallet } from "lucide-react";
import { I as Input } from "./input-B_4qRSOV.js";
import { toast } from "sonner";
import axios from "axios";
import { c as cn } from "./utils-B0hQsrDj.js";
import { c as calculateTax, f as formatCurrency } from "./currency-CoUrQw_H.js";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./dropdown-menu-B2I3vWlQ.js";
import "@radix-ui/react-slot";
import "vaul";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BclLUCFD.js";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./menuConfig-rtCrEhXP.js";
import "./sonner-ZUDSQr7N.js";
import "class-variance-authority";
import "@radix-ui/react-scroll-area";
import "radix-ui";
import "@radix-ui/react-select";
import "@radix-ui/react-alert-dialog";
import "clsx";
import "tailwind-merge";
function WaiterIndex({ categories, zones: initialZones, tenant, locations = [], currentLocationId, taxSettings, paymentMethods = [], bankAccounts = [] }) {
  const [selectedTable, setSelectedTable] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationId, setLocationId] = useState(currentLocationId);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [tableSearch, setTableSearch] = useState("");
  const [serviceType, setServiceType] = useState("dine_in");
  const [localZones, setLocalZones] = useState(initialZones);
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [pendingLeaveUrl, setPendingLeaveUrl] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalSelectedVariants, setModalSelectedVariants] = useState({});
  const [modalNotes, setModalNotes] = useState("");
  const [readyOrderIds, setReadyOrderIds] = useState(/* @__PURE__ */ new Set());
  const [sessionOrderIds, setSessionOrderIds] = useState(/* @__PURE__ */ new Set());
  const [showBillModal, setShowBillModal] = useState(false);
  const [billPaymentMethod, setBillPaymentMethod] = useState("");
  const [billPaymentRef, setBillPaymentRef] = useState("");
  const [billProofFile, setBillProofFile] = useState(null);
  const [billProofPreview, setBillProofPreview] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);
  const playNotificationSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      [830, 1046, 1318].forEach((freq, i) => {
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
  }, []);
  const allActiveOrderIds = useMemo(() => {
    const ids = /* @__PURE__ */ new Set();
    localZones.forEach((zone) => {
      zone.tables.forEach((table) => {
        if (table.active_order?.id) ids.add(table.active_order.id);
      });
    });
    sessionOrderIds.forEach((id) => ids.add(id));
    return Array.from(ids);
  }, [localZones, sessionOrderIds]);
  const zonesRef = useRef(localZones);
  useEffect(() => {
    zonesRef.current = localZones;
  }, [localZones]);
  const selectedTableRef = useRef(selectedTable);
  useEffect(() => {
    selectedTableRef.current = selectedTable;
  }, [selectedTable]);
  useEffect(() => {
    const echoInstance = window.Echo;
    if (!echoInstance?.connector || !tenant.id || allActiveOrderIds.length === 0) return;
    const subscribedChannels = [];
    allActiveOrderIds.forEach((orderId) => {
      const channelName = `tenant.${tenant.id}.orders.${orderId}`;
      try {
        echoInstance.channel(channelName).listen(".order.status.updated", (e) => {
          const data = e;
          if (data.comment === "payment_verified") {
            playNotificationSound();
            let tableName = "";
            zonesRef.current.forEach((zone) => {
              zone.tables.forEach((table) => {
                if (table.active_order?.id === data.id) tableName = table.name;
              });
            });
            toast.success(`Pago verificado — ${tableName || `Pedido #${data.id}`} completado`, {
              id: `verified-${data.id}`,
              duration: 15e3,
              description: "Caja aprobó el pago. Mesa liberada.",
              style: { background: "#ecfdf5", border: "2px solid #059669", fontWeight: "bold" }
            });
            setLocalZones((prev) => prev.map((zone) => ({
              ...zone,
              tables: zone.tables.map((t) => {
                if (t.active_order?.id === data.id) {
                  return { ...t, status: "available", active_order: void 0 };
                }
                return t;
              })
            })));
            setReadyOrderIds((prev) => {
              const next = new Set(prev);
              next.delete(data.id);
              return next;
            });
            if (selectedTableRef.current?.active_order?.id === data.id) {
              setCart([]);
              setSelectedTable(null);
            }
          } else if (data.status === "ready") {
            setReadyOrderIds((prev) => new Set(prev).add(data.id));
            playNotificationSound();
            let tableName = "";
            zonesRef.current.forEach((zone) => {
              zone.tables.forEach((table) => {
                if (table.active_order?.id === data.id) tableName = table.name;
              });
            });
            toast.success(`Pedido ${tableName ? tableName : `#${data.id}`} LISTO`, {
              id: `ready-${data.id}`,
              duration: 2e4,
              description: "Cocina lo despachó — llévaselo al cliente",
              style: { background: "#ecfdf5", border: "2px solid #10b981", fontWeight: "bold" }
            });
          } else if (data.status === "preparing") {
            toast.info(`Pedido #${data.id} en preparación`, { id: `preparing-${data.id}`, duration: 5e3 });
          }
        });
        subscribedChannels.push(channelName);
      } catch (err) {
        console.error("[Echo] Error subscribing to channel:", channelName, err);
      }
    });
    return () => {
      subscribedChannels.forEach((ch) => {
        try {
          echoInstance.leave(ch);
        } catch {
        }
      });
    };
  }, [tenant.id, allActiveOrderIds, playNotificationSound]);
  const handleTableSelect = (table) => {
    setSelectedTable(table);
    if (table.active_order?.items && table.active_order.items.length > 0) {
      const existingItems = table.active_order.items.map((item) => ({
        id: `sent-${item.id}`,
        product_id: item.product_id,
        product_name: item.product_name,
        price: parseFloat(String(item.price)),
        quantity: item.quantity,
        variant_options: typeof item.variant_options === "string" ? JSON.parse(item.variant_options) : item.variant_options || [],
        notes: item.notes || "",
        is_sent: true
      }));
      setCart((prev) => {
        const unsent = prev.filter((i) => !i.is_sent);
        return [...existingItems, ...unsent];
      });
    } else {
      setCart((prev) => prev.filter((i) => !i.is_sent));
    }
  };
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (cart.length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [cart.length]);
  const userName = usePage().props.auth?.user?.name || "Mesero";
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return null;
    const results = [];
    categories.forEach((cat) => {
      if (cat.products) {
        cat.products.forEach((prod) => {
          if (prod.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            results.push(prod);
          }
        });
      }
    });
    return results;
  }, [categories, searchQuery]);
  const { subtotal: cartSubtotal, taxAmount: cartTaxAmount, grandTotal: cartGrandTotal } = useMemo(() => {
    const newOnly = cart.filter((i) => !i.is_sent);
    const baseTotal = newOnly.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return calculateTax(baseTotal, taxSettings?.tax_rate || 0, taxSettings?.price_includes_tax || false);
  }, [cart, taxSettings]);
  const tableGrandTotal = useMemo(() => {
    const allTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const { grandTotal } = calculateTax(allTotal, taxSettings?.tax_rate || 0, taxSettings?.price_includes_tax || false);
    return grandTotal;
  }, [cart, taxSettings]);
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
    setModalSelectedVariants({});
    setModalNotes("");
    setShowVariantModal(true);
  };
  const modalUnitPrice = useMemo(() => {
    if (!selectedProduct) return 0;
    let total = Number(selectedProduct.price);
    if (selectedProduct.variant_groups) {
      selectedProduct.variant_groups.forEach((group) => {
        const selectedOptionIds = modalSelectedVariants[group.id] || [];
        selectedOptionIds.forEach((optionId) => {
          const option = group.options.find((o) => o.id === optionId);
          if (option) total += Number(option.price_adjustment);
        });
      });
    }
    return total;
  }, [selectedProduct, modalSelectedVariants]);
  const handleVariantChange = (groupId, optionId, type) => {
    setModalSelectedVariants((prev) => {
      const currentSelected = prev[groupId] || [];
      if (type === "radio") return { ...prev, [groupId]: [optionId] };
      if (currentSelected.includes(optionId)) return { ...prev, [groupId]: currentSelected.filter((id) => id !== optionId) };
      return { ...prev, [groupId]: [...currentSelected, optionId] };
    });
  };
  const handleModalConfirm = () => {
    if (!selectedProduct) return;
    if (selectedProduct.variant_groups) {
      for (const group of selectedProduct.variant_groups) {
        if (group.is_required) {
          const selected = modalSelectedVariants[group.id] || [];
          if (selected.length < group.min_selection) {
            toast.error(`Selecciona al menos ${group.min_selection} opción en ${group.name}`);
            return;
          }
        }
      }
    }
    const variantOptions = [];
    if (selectedProduct.variant_groups) {
      selectedProduct.variant_groups.forEach((group) => {
        const selectedList = modalSelectedVariants[group.id] || [];
        selectedList.forEach((optId) => {
          const opt = group.options.find((o) => o.id === optId);
          if (opt) {
            variantOptions.push({
              id: opt.id,
              name: `${group.name}: ${opt.name}`,
              price_adjustment: opt.price_adjustment,
              price: Number(opt.price_adjustment),
              group_name: group.name,
              option_name: opt.name
            });
          }
        });
      });
    }
    const itemId = `item-${Date.now()}-${Math.random()}`;
    const newItem = {
      id: itemId,
      product_id: selectedProduct.id,
      product_name: selectedProduct.name,
      price: modalUnitPrice,
      quantity: modalQuantity,
      variant_options: variantOptions,
      notes: modalNotes.trim()
    };
    setCart((prev) => [...prev, newItem]);
    toast.success(`Añadido: ${selectedProduct.name}`);
    setShowVariantModal(false);
  };
  const updateQuantity = (itemId, delta) => {
    setCart((prev) => prev.map((item) => {
      if (item.id === itemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };
  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };
  const newItems = useMemo(() => cart.filter((i) => !i.is_sent), [cart]);
  const handleClearCart = () => {
    if (newItems.length === 0) return;
    setConfirmClearOpen(true);
  };
  const confirmClearAction = () => {
    setCart((prev) => prev.filter((i) => i.is_sent));
    setConfirmClearOpen(false);
  };
  const handleSubmit = () => {
    if (serviceType === "dine_in" && !selectedTable) {
      toast.error("Selecciona una mesa primero");
      return;
    }
    if (newItems.length === 0) {
      toast.error("No hay productos nuevos para enviar");
      return;
    }
    setConfirmSendOpen(true);
  };
  const confirmSubmit = async () => {
    setConfirmSendOpen(false);
    setIsSubmitting(true);
    try {
      const response = await axios.post(route("tenant.admin.waiters.store", { tenant: tenant.slug }), {
        service_type: serviceType,
        table_id: serviceType === "dine_in" ? selectedTable?.id : null,
        customer_name: serviceType === "dine_in" && selectedTable ? `Mesa ${selectedTable.name}` : "Mostrador",
        location_id: locationId,
        items: newItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          variant_options: item.variant_options,
          notes: item.notes || void 0
        })),
        send_to_kitchen: true
      });
      if (response.data.success) {
        const orderId = response.data.order_id;
        const orderTotal = response.data.total;
        const sentItems = cart.filter((i) => i.is_sent);
        const justSentItems = newItems.map((item, idx) => ({
          ...item,
          id: `sent-new-${Date.now()}-${idx}`,
          is_sent: true
        }));
        const allSentItems = [...sentItems, ...justSentItems];
        if (serviceType === "dine_in" && selectedTable) {
          const tableId = selectedTable.id;
          const existingCreatedAt = selectedTable.active_order?.created_at || (/* @__PURE__ */ new Date()).toISOString();
          setLocalZones((prev) => prev.map((zone) => ({
            ...zone,
            tables: zone.tables.map((t) => {
              if (t.id === tableId) {
                return {
                  ...t,
                  status: "occupied",
                  active_order: {
                    id: orderId || t.active_order?.id || 0,
                    table_id: tableId,
                    customer_name: `Mesa ${t.name}`,
                    total: orderTotal || 0,
                    status: "confirmed",
                    created_at: existingCreatedAt,
                    items: allSentItems.map((item, idx) => ({
                      id: idx + 1,
                      product_id: item.product_id,
                      product_name: item.product_name,
                      quantity: item.quantity,
                      price: item.price,
                      total: item.price * item.quantity,
                      variant_options: item.variant_options,
                      notes: item.notes
                    }))
                  }
                };
              }
              return t;
            })
          })));
          if (orderId) {
            setSessionOrderIds((prev) => new Set(prev).add(orderId));
          }
          if (orderId && readyOrderIds.has(orderId)) {
            setReadyOrderIds((prev) => {
              const next = new Set(prev);
              next.delete(orderId);
              return next;
            });
          }
        }
        toast.success("✅ Pedido enviado a cocina");
        setCart(allSentItems);
        if (serviceType === "takeout") {
          setSelectedTable(null);
          setServiceType("dine_in");
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        toast.error("Error al enviar pedido");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleLocationChange = (val) => {
    window.location.href = route("tenant.admin.waiters.index", {
      tenant: tenant.slug,
      location_id: val
    });
  };
  const handleOpenBill = () => {
    if (!selectedTable?.active_order) {
      toast.error("Esta mesa no tiene pedido activo");
      return;
    }
    setBillPaymentMethod("");
    setBillPaymentRef("");
    setBillProofFile(null);
    setBillProofPreview("");
    setShowBillModal(true);
  };
  const handleProofFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBillProofFile(file);
    const reader = new FileReader();
    reader.onload = () => setBillProofPreview(reader.result);
    reader.readAsDataURL(file);
  };
  const handleSubmitPayment = async () => {
    if (!selectedTable?.active_order?.id || !billPaymentMethod) return;
    setIsSubmittingPayment(true);
    try {
      const formData = new FormData();
      formData.append("order_id", String(selectedTable.active_order.id));
      formData.append("payment_method", billPaymentMethod);
      if (billPaymentRef) formData.append("payment_reference", billPaymentRef);
      if (billProofFile) formData.append("payment_proof", billProofFile);
      await axios.post(
        route("tenant.admin.waiters.payment-proof", { tenant: tenant.slug }),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Pago registrado — caja lo verificará");
      setShowBillModal(false);
      setLocalZones((prev) => prev.map((zone) => ({
        ...zone,
        tables: zone.tables.map((t) => {
          if (t.id === selectedTable?.id && t.active_order) {
            return { ...t, active_order: { ...t.active_order, waiter_collected: true } };
          }
          return t;
        })
      })));
    } catch {
      toast.error("Error al registrar el pago");
    } finally {
      setIsSubmittingPayment(false);
    }
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles");
  };
  const paymentMethodLabels = {
    cash: { label: "Efectivo", icon: /* @__PURE__ */ jsx(Banknote, { className: "w-5 h-5" }) },
    bank_transfer: { label: "Transferencia", icon: /* @__PURE__ */ jsx(Wallet, { className: "w-5 h-5" }) },
    dataphone: { label: "Datáfono", icon: /* @__PURE__ */ jsx(CreditCard, { className: "w-5 h-5" }) }
  };
  const activePaymentTypes = paymentMethods.filter((m) => m.is_active).map((m) => m.type);
  const getElapsedTime = (createdAt) => {
    const start = new Date(createdAt);
    const now = /* @__PURE__ */ new Date();
    const diffMs = now.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 6e4);
    if (diffMins < 60) return `${diffMins}m`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h${mins}m`;
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { hideSidebar: true, hideNavbar: true, hideFooter: true, maxwidth: "w-full h-screen", children: [
    /* @__PURE__ */ jsx(Head, { title: "Panel de Meseros" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-screen bg-slate-50 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("header", { className: "bg-white border-b border-slate-200 p-4 flex justify-between items-center shrink-0 shadow-sm z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("tenant.dashboard", { tenant: tenant.slug }), children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-6 h-6" }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-blue-600 p-2 rounded-lg", children: /* @__PURE__ */ jsx(ConciergeBell, { className: "w-6 h-6 text-white" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-slate-800 tracking-tight leading-none", children: "PANEL DE MESEROS" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1", children: "Gestión de Mesas y Comandas" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          locations.length > 1 && /* @__PURE__ */ jsxs(Select, { value: String(locationId || ""), onValueChange: handleLocationChange, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[160px] h-9 bg-slate-50 border-slate-200 text-sm", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Sede" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: String(loc.id), children: loc.name }, loc.id)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 bg-slate-100 rounded-lg p-1", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  setServiceType("dine_in");
                },
                className: `px-3 py-1.5 rounded text-xs font-bold transition-colors ${serviceType === "dine_in" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
                children: [
                  /* @__PURE__ */ jsx(Table, { className: "w-3.5 h-3.5 inline mr-1" }),
                  "Mesa"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  setServiceType("takeout");
                  setSelectedTable(null);
                },
                className: `px-3 py-1.5 rounded text-xs font-bold transition-colors ${serviceType === "takeout" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
                children: [
                  /* @__PURE__ */ jsx(Package, { className: "w-3.5 h-3.5 inline mr-1" }),
                  "Para llevar"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-8 w-px bg-slate-200 mx-1" }),
          selectedTable && /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex flex-col items-end", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-bold uppercase", children: "Atendiendo" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-black text-blue-600", children: [
              "Mesa ",
              selectedTable.name
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-bold uppercase", children: "Sesión" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-700", children: userName })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8 flex flex-col gap-4 overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Buscar productos...",
                className: "pl-10",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value)
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx(ScrollArea, { className: "flex-1 bg-white rounded-xl border border-slate-200 p-4", children: !isPageLoaded ? (
            /* Skeleton */
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "aspect-square rounded-xl bg-slate-100 animate-pulse" }, i)) })
          ) : searchQuery ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", children: filteredProducts && filteredProducts.length > 0 ? filteredProducts.map((product) => /* @__PURE__ */ jsx(ProductCard, { product, onAdd: handleProductSelect }, product.id)) : /* @__PURE__ */ jsxs("div", { className: "col-span-full flex flex-col items-center justify-center py-12 text-slate-400", children: [
            /* @__PURE__ */ jsx(Search, { className: "w-10 h-10 mb-3 opacity-40" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "No se encontraron productos" })
          ] }) }) : categories.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-slate-400", children: [
            /* @__PURE__ */ jsx(AlertCircle, { className: "w-12 h-12 mb-3 opacity-30" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold", children: "No hay categorías registradas" })
          ] }) : /* @__PURE__ */ jsxs(Tabs, { defaultValue: categories[0]?.id.toString(), className: "w-full", children: [
            /* @__PURE__ */ jsx(TabsList, { className: "w-full justify-start overflow-x-auto h-auto p-1 bg-slate-100/50 mb-4", children: categories.map((cat) => /* @__PURE__ */ jsx(TabsTrigger, { value: cat.id.toString(), className: "py-2 px-4", children: cat.name }, cat.id)) }),
            categories.map((cat) => /* @__PURE__ */ jsx(TabsContent, { value: cat.id.toString(), children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", children: cat.products && cat.products.length > 0 ? cat.products.map((product) => /* @__PURE__ */ jsx(ProductCard, { product, onAdd: handleProductSelect }, product.id)) : /* @__PURE__ */ jsxs("div", { className: "col-span-full flex flex-col items-center justify-center py-12 text-slate-400", children: [
              /* @__PURE__ */ jsx(Utensils, { className: "w-8 h-8 mb-2 opacity-30" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "Sin productos en esta categoría" })
            ] }) }) }, cat.id))
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 flex flex-col gap-4 overflow-hidden", children: [
          serviceType === "dine_in" && /* @__PURE__ */ jsxs(Card, { className: "shrink-0 border-slate-200", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "p-4 pb-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-slate-500", children: [
                /* @__PURE__ */ jsx(Table, { className: "w-4 h-4 text-blue-500" }),
                "Selección de Mesa"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: "Buscar...",
                    value: tableSearch,
                    onChange: (e) => setTableSearch(e.target.value),
                    className: "pl-7 h-7 w-[100px] text-xs bg-slate-50"
                  }
                )
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-4 pt-0", children: localZones.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-slate-400", children: [
              /* @__PURE__ */ jsx(Table, { className: "w-8 h-8 mb-2 opacity-30" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium", children: "No hay zonas ni mesas registradas" })
            ] }) : /* @__PURE__ */ jsxs(Tabs, { defaultValue: localZones[0]?.id.toString(), className: "w-full", children: [
              /* @__PURE__ */ jsx(TabsList, { className: "w-full overflow-x-auto justify-start h-auto p-0.5 bg-slate-50 mb-3", children: localZones.map((zone) => /* @__PURE__ */ jsx(TabsTrigger, { value: zone.id.toString(), className: "text-[10px] uppercase py-1 px-2", children: zone.name }, zone.id)) }),
              localZones.map((zone) => /* @__PURE__ */ jsx(TabsContent, { value: zone.id.toString(), className: "mt-0", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-2", children: [
                zone.tables.filter((t) => !tableSearch || t.name.toLowerCase().includes(tableSearch.toLowerCase())).map((table) => /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => handleTableSelect(table),
                    className: cn(
                      "flex flex-col items-center justify-center p-2 rounded-lg border text-sm transition-all relative",
                      selectedTable?.id === table.id ? "bg-blue-600 border-blue-600 text-white shadow-md ring-2 ring-blue-100" : table.active_order?.waiter_collected ? "bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-200" : table.active_order?.id && readyOrderIds.has(table.active_order.id) ? "bg-green-100 border-green-400 text-green-800 ring-2 ring-green-200 animate-pulse" : table.status === "occupied" ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                    ),
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "font-bold", children: table.name }),
                      table.active_order?.waiter_collected && selectedTable?.id !== table.id && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5 mt-0.5", children: [
                        /* @__PURE__ */ jsx(Receipt, { className: "w-3 h-3 text-emerald-600" }),
                        /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black text-emerald-700 uppercase", children: "Cobrado" })
                      ] }),
                      !table.active_order?.waiter_collected && table.active_order?.id && readyOrderIds.has(table.active_order.id) && selectedTable?.id !== table.id && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5 mt-0.5", children: [
                        /* @__PURE__ */ jsx(CheckCircle, { className: "w-3 h-3 text-green-600" }),
                        /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black text-green-700 uppercase", children: "Listo" })
                      ] }),
                      table.status === "occupied" && table.active_order && !table.active_order.waiter_collected && !(table.active_order.id && readyOrderIds.has(table.active_order.id)) && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center mt-0.5", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-[8px] font-mono opacity-70", children: getElapsedTime(table.active_order.created_at) }),
                        /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold", children: formatCurrency(table.active_order.total) })
                      ] }),
                      table.status === "occupied" && !table.active_order && /* @__PURE__ */ jsx("div", { className: "w-1 h-1 rounded-full bg-amber-500 mt-1" })
                    ]
                  },
                  table.id
                )),
                zone.tables.filter((t) => !tableSearch || t.name.toLowerCase().includes(tableSearch.toLowerCase())).length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-full py-4 text-center text-xs text-slate-400", children: tableSearch ? "Sin resultados" : "Sin mesas" })
              ] }) }, zone.id))
            ] }) })
          ] }),
          serviceType === "takeout" && /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Package, { className: "w-8 h-8 text-indigo-600 shrink-0" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-indigo-900 text-sm", children: "Pedido Para Llevar" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-600", children: "Sin mesa — directo a cocina" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "flex-1 flex flex-col overflow-hidden border-slate-200 shadow-sm", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "p-4 pb-2 bg-slate-50/50 flex flex-row items-center justify-between", children: [
              /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-slate-500", children: [
                /* @__PURE__ */ jsx(UtensilsCrossed, { className: "w-4 h-4 text-green-500" }),
                "Pedido Actual"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                selectedTable && serviceType === "dine_in" && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "bg-blue-100 text-blue-700 border-blue-200", children: [
                  "Mesa ",
                  selectedTable.name
                ] }),
                serviceType === "takeout" && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-indigo-100 text-indigo-700 border-indigo-200", children: "Para llevar" }),
                cart.length > 0 && /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 text-red-400 hover:text-red-600", onClick: handleClearCart, children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { className: "p-0 flex-1 overflow-hidden flex flex-col", children: [
              /* @__PURE__ */ jsx(ScrollArea, { className: "flex-1 px-4 py-2", children: cart.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-40 text-slate-400 opacity-60", children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-8 h-8 mb-2 border-2 border-dashed rounded-full p-1" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "Carrito vacío" })
              ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                cart.filter((i) => i.is_sent).length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 py-1", children: [
                    /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-orange-200" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold uppercase text-orange-500 tracking-widest", children: "En cocina" }),
                    /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-orange-200" })
                  ] }),
                  cart.filter((i) => i.is_sent).map((item) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5 pb-2 border-b border-orange-100 last:border-0 opacity-70", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                      /* @__PURE__ */ jsxs("span", { className: "font-medium text-xs text-slate-600 leading-tight", children: [
                        item.quantity,
                        "x ",
                        item.product_name
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "font-bold text-xs text-slate-500", children: formatCurrency(item.price * item.quantity) })
                    ] }),
                    item.notes && /* @__PURE__ */ jsxs("p", { className: "text-[9px] text-amber-500 italic pl-3", children: [
                      "→ ",
                      item.notes
                    ] })
                  ] }, item.id))
                ] }),
                cart.filter((i) => !i.is_sent).length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  cart.filter((i) => i.is_sent).length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 py-1", children: [
                    /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-blue-200" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold uppercase text-blue-500 tracking-widest", children: "Nuevos" }),
                    /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-blue-200" })
                  ] }),
                  cart.filter((i) => !i.is_sent).map((item) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 pb-3 border-b border-slate-100 last:border-0", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm text-slate-800 leading-tight", children: item.product_name }),
                      /* @__PURE__ */ jsx("span", { className: "font-bold text-sm text-slate-900", children: formatCurrency(item.price * item.quantity) })
                    ] }),
                    item.variant_options && item.variant_options.length > 0 && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-blue-600 font-medium leading-tight", children: item.variant_options.map((v) => v.option_name || v.name).join(" · ") }),
                    item.notes && /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-amber-600 font-medium flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(StickyNote, { className: "w-3 h-3 inline" }),
                      item.notes
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-1", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-slate-100 rounded-lg p-1", children: [
                        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 rounded-md hover:bg-white", onClick: () => updateQuantity(item.id, -1), children: /* @__PURE__ */ jsx(Minus, { className: "w-3 h-3" }) }),
                        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold w-4 text-center", children: item.quantity }),
                        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 rounded-md hover:bg-white", onClick: () => updateQuantity(item.id, 1), children: /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" }) })
                      ] }),
                      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 text-red-400 hover:text-red-500 hover:bg-red-50", onClick: () => removeFromCart(item.id), children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }) })
                    ] })
                  ] }, item.id))
                ] })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "p-4 bg-slate-50 border-t border-slate-200 space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  cart.some((i) => i.is_sent) && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center px-1 pb-1 mb-1 border-b border-dashed border-slate-200", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-[10px] font-bold uppercase", children: "Total Mesa" }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-600", children: formatCurrency(tableGrandTotal) })
                  ] }),
                  newItems.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center px-1", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-xs", children: "Nuevos - Subtotal" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: formatCurrency(cartSubtotal) })
                    ] }),
                    taxSettings && taxSettings.tax_rate > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center px-1", children: [
                      /* @__PURE__ */ jsxs("span", { className: "text-slate-500 text-xs", children: [
                        taxSettings.tax_name,
                        " (",
                        taxSettings.tax_rate,
                        "%)"
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: formatCurrency(cartTaxAmount) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center px-1 pt-1 border-t border-dashed border-slate-200", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-bold uppercase text-[10px] tracking-widest", children: newItems.length > 0 ? "Total Nuevos" : "Total Mesa" }),
                    /* @__PURE__ */ jsx("span", { className: "text-xl font-black text-slate-900", children: formatCurrency(newItems.length > 0 ? cartGrandTotal : tableGrandTotal) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    className: "w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold shadow-lg shadow-blue-200",
                    disabled: newItems.length === 0 || serviceType === "dine_in" && !selectedTable || isSubmitting,
                    onClick: handleSubmit,
                    children: [
                      isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(Send, { className: "w-5 h-5 mr-2" }),
                      isSubmitting ? "Enviando..." : newItems.length > 0 ? `ENVIAR ${newItems.length} NUEVO${newItems.length > 1 ? "S" : ""} A COCINA` : "ENVIAR A COCINA"
                    ]
                  }
                ),
                selectedTable?.active_order && cart.some((i) => i.is_sent) && (selectedTable.active_order.waiter_collected ? /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "outline",
                    disabled: true,
                    className: "w-full h-10 border-amber-300 bg-amber-50 text-amber-700 font-bold cursor-not-allowed",
                    children: [
                      /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 mr-2 animate-pulse" }),
                      "EN APROBACIÓN — CAJA VERIFICANDO"
                    ]
                  }
                ) : /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "outline",
                    className: "w-full h-10 border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-bold",
                    onClick: handleOpenBill,
                    children: [
                      /* @__PURE__ */ jsx(Receipt, { className: "w-4 h-4 mr-2" }),
                      "PRE-CUENTA / COBRAR"
                    ]
                  }
                ))
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: showVariantModal, onOpenChange: setShowVariantModal, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[500px] max-h-[90vh] flex flex-col p-0 gap-0 bg-white border-0 shadow-2xl", children: [
      /* @__PURE__ */ jsx(DialogHeader, { className: "p-4 border-b border-slate-100 flex-shrink-0", children: /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold text-lg text-slate-900", children: selectedProduct?.name }),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-black text-blue-600", children: formatCurrency(modalUnitPrice) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-6", children: [
        selectedProduct?.variant_groups?.map((group) => /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 text-sm", children: group.name }),
            group.is_required && /* @__PURE__ */ jsx("span", { className: "bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase", children: "Requerido" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-2", children: group.options.map((option) => {
            const isSelected = (modalSelectedVariants[group.id] || []).includes(option.id);
            const priceAdj = Number(option.price_adjustment);
            return /* @__PURE__ */ jsxs(
              "label",
              {
                className: `flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all active:scale-[0.99] ${isSelected ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600" : "border-slate-200 hover:border-slate-300 bg-white"}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("div", { className: `w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isSelected ? "bg-blue-600 border-blue-600" : "border-slate-300"}`, children: isSelected && /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-white rounded-full" }) }),
                    /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${isSelected ? "text-blue-900" : "text-slate-700"}`, children: option.name })
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
                    formatCurrency(priceAdj)
                  ] })
                ]
              },
              option.id
            );
          }) })
        ] }, group.id)),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("label", { className: "font-bold text-slate-800 text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(StickyNote, { className: "w-4 h-4 text-amber-500" }),
            "Nota para cocina"
          ] }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              placeholder: "Ej: Sin cebolla, extra salsa...",
              value: modalNotes,
              onChange: (e) => setModalNotes(e.target.value),
              className: "resize-none h-20 text-sm",
              maxLength: 200
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-400 text-right", children: [
            modalNotes.length,
            "/200"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "p-4 border-t border-slate-100 bg-slate-50 flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center bg-white rounded-xl border border-slate-200 h-12 w-full sm:w-auto px-1 shadow-sm", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setModalQuantity(Math.max(1, modalQuantity - 1)), className: "w-10 h-full flex items-center justify-center text-slate-500 hover:text-red-600", children: /* @__PURE__ */ jsx(Minus, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsx("span", { className: "w-10 text-center font-bold text-lg text-slate-900", children: modalQuantity }),
          /* @__PURE__ */ jsx("button", { onClick: () => setModalQuantity(modalQuantity + 1), className: "w-10 h-full flex items-center justify-center text-slate-500 hover:text-blue-600", children: /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }) })
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: handleModalConfirm, className: "flex-1 h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Agregar ",
            modalQuantity > 1 && `(${modalQuantity})`
          ] }),
          /* @__PURE__ */ jsx("span", { className: "ml-auto bg-black/20 px-2 py-0.5 rounded text-sm", children: formatCurrency(modalUnitPrice * modalQuantity) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: confirmSendOpen, onOpenChange: setConfirmSendOpen, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Enviar pedido a cocina?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          newItems.length,
          " producto",
          newItems.length > 1 ? "s" : "",
          " nuevo",
          newItems.length > 1 ? "s" : "",
          ".",
          serviceType === "dine_in" && selectedTable && /* @__PURE__ */ jsxs(Fragment, { children: [
            " Mesa: ",
            /* @__PURE__ */ jsx("strong", { children: selectedTable.name }),
            "."
          ] }),
          serviceType === "takeout" && /* @__PURE__ */ jsx(Fragment, { children: " Pedido para llevar." }),
          " ",
          "Esta acción enviará la comanda a cocina."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Revisar" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: confirmSubmit, className: "bg-blue-600 text-white hover:bg-blue-700", children: "Sí, Enviar" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: confirmClearOpen, onOpenChange: setConfirmClearOpen, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Vaciar carrito?" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Se eliminarán todos los productos del pedido actual." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: confirmClearAction, className: "bg-red-600 text-white hover:bg-red-700", children: "Sí, Vaciar" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: showBillModal, onOpenChange: setShowBillModal, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[500px] max-h-[90vh] flex flex-col p-0 gap-0 bg-white border-0 shadow-2xl", children: [
      /* @__PURE__ */ jsx(DialogHeader, { className: "p-4 border-b border-slate-100 flex-shrink-0", children: /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-lg font-bold text-slate-900", children: [
        /* @__PURE__ */ jsx(Receipt, { className: "w-5 h-5 text-emerald-600" }),
        "Pre-cuenta — ",
        selectedTable?.name
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl p-4 space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold uppercase text-slate-400 tracking-widest mb-2", children: "Detalle del pedido" }),
          cart.filter((i) => i.is_sent).map((item) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-baseline", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-slate-700", children: [
              item.quantity,
              "x ",
              item.product_name
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-900", children: formatCurrency(item.price * item.quantity) })
          ] }, item.id)),
          /* @__PURE__ */ jsxs("div", { className: "border-t border-dashed border-slate-200 pt-2 mt-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-baseline", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500", children: "Subtotal" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: formatCurrency((() => {
                const sent = cart.filter((i) => i.is_sent);
                const base = sent.reduce((s, i) => s + i.price * i.quantity, 0);
                return calculateTax(base, taxSettings?.tax_rate || 0, taxSettings?.price_includes_tax || false).subtotal;
              })()) })
            ] }),
            taxSettings && taxSettings.tax_rate > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-baseline", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-500", children: [
                taxSettings.tax_name,
                " (",
                taxSettings.tax_rate,
                "%)"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: formatCurrency((() => {
                const sent = cart.filter((i) => i.is_sent);
                const base = sent.reduce((s, i) => s + i.price * i.quantity, 0);
                return calculateTax(base, taxSettings?.tax_rate || 0, taxSettings?.price_includes_tax || false).taxAmount;
              })()) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-baseline pt-2 border-t border-slate-200 mt-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-black uppercase text-slate-800", children: "Total" }),
              /* @__PURE__ */ jsx("span", { className: "text-2xl font-black text-slate-900", children: formatCurrency(tableGrandTotal) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold uppercase text-slate-400 tracking-widest", children: "¿Cómo paga el cliente?" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
            ["cash", "bank_transfer", "dataphone"].filter((type) => activePaymentTypes.includes(type)).map((type) => {
              const info = paymentMethodLabels[type];
              const isSelected = billPaymentMethod === type;
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setBillPaymentMethod(type),
                  className: cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center",
                    isSelected ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  ),
                  children: [
                    /* @__PURE__ */ jsx("div", { className: cn("p-2 rounded-lg", isSelected ? "bg-emerald-100" : "bg-slate-100"), children: info.icon }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", children: info.label })
                  ]
                },
                type
              );
            }),
            activePaymentTypes.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-3 text-center py-4 text-slate-400 text-sm", children: "No hay métodos de pago configurados" })
          ] })
        ] }),
        billPaymentMethod === "bank_transfer" && bankAccounts.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold uppercase text-slate-400 tracking-widest", children: "Datos para transferencia" }),
          bankAccounts.map((acc) => /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold text-sm text-blue-900", children: acc.bank_name }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-[10px] bg-blue-100 text-blue-700", children: acc.account_type })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-mono text-blue-800 tracking-wide", children: acc.account_number }),
              /* @__PURE__ */ jsx("button", { onClick: () => copyToClipboard(acc.account_number), className: "text-blue-500 hover:text-blue-700", children: /* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5" }) })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-blue-600", children: [
              acc.account_holder,
              " — ",
              acc.holder_id
            ] })
          ] }, acc.id)),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-600", children: "Referencia / Nro. de transacción" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Ej: 123456789",
                value: billPaymentRef,
                onChange: (e) => setBillPaymentRef(e.target.value),
                className: "text-sm"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-600", children: "Foto del comprobante" }),
            /* @__PURE__ */ jsx("div", { className: "relative", children: billProofPreview ? /* @__PURE__ */ jsxs("div", { className: "relative rounded-xl overflow-hidden border border-slate-200", children: [
              /* @__PURE__ */ jsx("img", { src: billProofPreview, alt: "Comprobante", className: "w-full max-h-48 object-contain bg-slate-50" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setBillProofFile(null);
                    setBillProofPreview("");
                  },
                  className: "absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600",
                  children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
                }
              )
            ] }) : /* @__PURE__ */ jsxs("label", { className: "flex flex-col items-center gap-2 p-6 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors", children: [
              /* @__PURE__ */ jsx(Camera, { className: "w-8 h-8 text-slate-400" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500 font-medium", children: "Toca para tomar foto o seleccionar imagen" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "file",
                  accept: "image/*",
                  capture: "environment",
                  className: "hidden",
                  onChange: handleProofFileChange
                }
              )
            ] }) })
          ] })
        ] }),
        billPaymentMethod === "cash" && /* @__PURE__ */ jsxs("div", { className: "bg-green-50 border border-green-200 rounded-xl p-4 text-center", children: [
          /* @__PURE__ */ jsx(Banknote, { className: "w-8 h-8 text-green-600 mx-auto mb-2" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-green-800", children: "Recoge el efectivo y llévalo a caja" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-green-600 mt-1", children: "Caja completará el cobro" })
        ] }),
        billPaymentMethod === "dataphone" && /* @__PURE__ */ jsxs("div", { className: "bg-purple-50 border border-purple-200 rounded-xl p-4 text-center", children: [
          /* @__PURE__ */ jsx(CreditCard, { className: "w-8 h-8 text-purple-600 mx-auto mb-2" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-purple-800", children: "Lleva al cliente al datáfono o acércalo" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-purple-600 mt-1", children: "Caja confirmará el cobro" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-t border-slate-100 bg-slate-50 flex-shrink-0 space-y-2", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: handleSubmitPayment,
            disabled: !billPaymentMethod || isSubmittingPayment,
            className: "w-full h-12 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg",
            children: [
              isSubmittingPayment ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(Receipt, { className: "w-5 h-5 mr-2" }),
              isSubmittingPayment ? "Registrando..." : "REGISTRAR PAGO"
            ]
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-center text-slate-400", children: "El pago se enviará a caja para verificación" })
      ] })
    ] }) })
  ] });
}
function ProductCard({ product, onAdd }) {
  const hasVariants = product.variant_groups && product.variant_groups.length > 0;
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => onAdd(product),
      className: "flex flex-col text-left bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-400 hover:shadow-md transition-all group relative",
      children: [
        /* @__PURE__ */ jsx("div", { className: "aspect-square bg-slate-100 flex items-center justify-center overflow-hidden", children: product.image_url ? /* @__PURE__ */ jsx("img", { src: product.image_url, alt: product.name, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" }) : /* @__PURE__ */ jsx(Utensils, { className: "w-8 h-8 text-slate-300" }) }),
        hasVariants && /* @__PURE__ */ jsx("span", { className: "absolute top-1.5 right-1.5 bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase", children: "Opciones" }),
        /* @__PURE__ */ jsxs("div", { className: "p-2 space-y-1", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-xs text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors", children: product.name }),
          /* @__PURE__ */ jsx("p", { className: "text-blue-600 font-black text-sm", children: formatCurrency(product.price) })
        ] })
      ]
    }
  );
}
export {
  WaiterIndex as default
};
