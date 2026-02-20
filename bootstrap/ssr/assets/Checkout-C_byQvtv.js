import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React__default from "react";
import { A as AdminLayout } from "./AdminLayout-CegS7XIj.js";
import { useForm, Head } from "@inertiajs/react";
import { C as Card } from "./card-BaovBWX5.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { CreditCard, Calendar, Globe, CheckCircle2, ArrowRight, ShieldCheck, Banknote, Info, FileText, UploadCloud } from "lucide-react";
import { c as cn } from "./utils-B0hQsrDj.js";
import { route } from "ziggy-js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-QdU9y0pO.js";
import "sonner";
import "./badge-C_PGNHO8.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./dropdown-menu-Dkgv2tnp.js";
import "vaul";
import "axios";
import "./input-B_4qRSOV.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./menuConfig-rtCrEhXP.js";
import "./sonner-ZUDSQr7N.js";
import "clsx";
import "tailwind-merge";
function Checkout({ tenant, plan, billing_cycle, amount, proration_credit, reserved_slug, bank_details }) {
  const [method, setMethod] = React__default.useState("wompi");
  const [showProofModal, setShowProofModal] = React__default.useState(false);
  const { data, setData, post, processing } = useForm({
    plan_id: plan.id,
    billing_cycle,
    payment_method: method,
    slug: reserved_slug,
    proof: null
  });
  React__default.useEffect(() => {
    setData("payment_method", method);
  }, [method]);
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(value);
  };
  const handleConfirm = () => {
    if (method === "transfer" && !showProofModal) {
      setShowProofModal(true);
      return;
    }
    post(route("tenant.subscription.process-payment", { tenant: tenant.slug }), {
      forceFormData: true,
      onFinish: () => setShowProofModal(false)
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Finalizar Suscripción", children: [
    /* @__PURE__ */ jsx(Head, { title: "Checkout - Suscripción" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto py-8 px-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 items-start", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsx(CreditCard, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black tracking-tight uppercase", children: "Resumen de tu Orden" })
        ] }),
        /* @__PURE__ */ jsx(Card, { className: "p-8 rounded-[32px] border-none shadow-xl shadow-slate-200/50 overflow-hidden relative bg-white", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start border-b border-slate-50 pb-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-primary", children: "Plan Seleccionado" }),
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black uppercase text-slate-900", children: plan.name }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-bold text-slate-500", children: [
                /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }),
                "Ciclo ",
                billing_cycle === "monthly" ? "Mensual" : "Anual"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-slate-900", children: formatCurrency(billing_cycle === "monthly" ? plan.monthly_price : plan.yearly_price) }) })
          ] }),
          reserved_slug && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-4 px-5 rounded-2xl bg-amber-50 border border-amber-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(Globe, { className: "w-5 h-5 text-amber-600" }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase text-amber-700 tracking-tighter", children: "Tu URL Personalizada" }),
                /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-amber-900", children: [
                  "linkiu.bio/",
                  reserved_slug
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-amber-500" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm font-bold text-slate-500", children: [
              /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
              /* @__PURE__ */ jsx("span", { children: formatCurrency(amount + (proration_credit || 0)) })
            ] }),
            proration_credit && proration_credit > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm font-bold text-green-600", children: [
              /* @__PURE__ */ jsx("span", { children: "Crédito por plan anterior (Prorrateo)" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "-",
                formatCurrency(proration_credit)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-4 border-t-2 border-slate-900 border-dashed", children: [
              /* @__PURE__ */ jsx("span", { className: "text-lg font-black uppercase", children: "Total a Pagar" }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end", children: [
                /* @__PURE__ */ jsx("span", { className: "text-3xl font-black text-primary", children: formatCurrency(amount) }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "IVA Incluido" })
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: handleConfirm,
              disabled: processing,
              className: "w-full h-16 rounded-[24px] bg-primary hover:bg-primary/90 text-white font-black text-xl uppercase tracking-widest shadow-xl shadow-primary/20 group",
              children: [
                processing ? "Procesando..." : method === "wompi" ? "Pagar con Wompi" : "Confirmar Transferencia",
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5 text-green-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-tight", children: "Transacción 100% Segura con encriptación SSL" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 mb-2", children: /* @__PURE__ */ jsx("h2", { className: "text-xl font-black tracking-tight uppercase", children: "Métodos de Pago" }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setMethod("wompi");
                setData("payment_method", "wompi");
              },
              className: cn(
                "w-full p-4 bg-white rounded-[24px] border-2 text-left transition-all relative group overflow-hidden",
                method === "wompi" ? "border-primary shadow-lg shadow-primary/5" : "border-slate-100 hover:border-slate-200"
              ),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 relative z-10", children: [
                  /* @__PURE__ */ jsx("div", { className: cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                    method === "wompi" ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                  ), children: /* @__PURE__ */ jsx(CreditCard, { className: "w-6 h-6" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-black text-slate-900 uppercase tracking-tight text-sm", children: "Wompi" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase", children: "Tarjetas, PSE, Nequi" })
                  ] })
                ] }),
                method === "wompi" && /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 animate-in zoom-in duration-300", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-primary" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setMethod("transfer");
                setData("payment_method", "transfer");
              },
              className: cn(
                "w-full p-4 bg-white rounded-[24px] border-2 text-left transition-all relative group overflow-hidden",
                method === "transfer" ? "border-primary shadow-lg shadow-primary/5" : "border-slate-100 hover:border-slate-200"
              ),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 relative z-10", children: [
                  /* @__PURE__ */ jsx("div", { className: cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                    method === "transfer" ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                  ), children: /* @__PURE__ */ jsx(Banknote, { className: "w-6 h-6" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-black text-slate-900 uppercase tracking-tight text-sm", children: "Transferencia" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase", children: "Directa a Banco" })
                  ] })
                ] }),
                method === "transfer" && /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 animate-in zoom-in duration-300", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-primary" }) })
              ]
            }
          )
        ] }),
        method === "transfer" && bank_details ? /* @__PURE__ */ jsxs(Card, { className: "p-4 bg-white rounded-[24px] border text-slate-900 space-y-4 animate-in fade-in slide-in-from-right-4 duration-500", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsx(Banknote, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-black", children: "Datos de Pago" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 tracking-widest uppercase", children: "Transferencia Directa" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 border-b border-white/10 pb-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase text-slate-500", children: "Banco" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-black", children: bank_details.bank_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 border-b border-white/10 pb-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase text-slate-500", children: "Tipo de Cuenta" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-black", children: bank_details.account_type })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 border-b border-white/10 pb-2 relative group", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase text-slate-500", children: "Número de Cuenta" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-black", children: bank_details.account_number })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 border-b border-white/10 pb-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase text-slate-500", children: "Titular" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-black", children: bank_details.account_holder })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 pb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase text-slate-500", children: "NIT / Documento" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-black", children: bank_details.nit })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4", children: /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400", children: "Reporta tu pago en la sección de facturas o vía soporte para activación inmediata." }) })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "p-8 rounded-[32px] bg-white border border-slate-100 text-slate-900 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-lg font-black uppercase leading-tight", children: "¿Listo para activar tu marca?" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 font-medium leading-relaxed", children: "Serás redirigido a la pasarela segura de **Wompi** para finalizar tu pago inmediatamente." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 justify-center text-[10px] font-black text-slate-500 uppercase tracking-widest border-t border-white/10 pt-4", children: [
            /* @__PURE__ */ jsx(Info, { className: "w-3 h-3 text-primary" }),
            "Pago seguro encriptado"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: showProofModal, onOpenChange: setShowProofModal, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md rounded-lg p-0 overflow-hidden border-none shadow-2xl", children: [
      /* @__PURE__ */ jsx(DialogHeader, { className: "pt-8 pb-0", children: /* @__PURE__ */ jsx(DialogTitle, { className: "text-2xl font-black text-center", children: "Confirmar Transferencia" }) }),
      /* @__PURE__ */ jsxs("div", { className: "px-8 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-0", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-xs font-medium text-slate-600", children: [
            '"Sube una captura de pantalla o el PDF de tu transferencia para activar tu plan **',
            plan.name,
            '**."'
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                onChange: (e) => setData("proof", e.target.files?.[0] || null),
                className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20",
                accept: "image/*,application/pdf"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: cn(
              "p-10 rounded-[28px] border-2 border-dashed transition-all flex flex-col items-center gap-4 bg-slate-50 text-center",
              data.proof ? "border-primary bg-primary/5" : "border-slate-100 group-hover:border-slate-200"
            ), children: data.proof ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg animate-in zoom-in", children: /* @__PURE__ */ jsx(FileText, { className: "w-8 h-8" }) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "block font-black text-slate-900 uppercase text-xs truncate max-w-[200px]", children: data.proof.name }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-primary uppercase", children: "¡Comprobante Listo!" })
              ] })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(UploadCloud, { className: "w-8 h-8" }) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("p", { className: "font-black text-slate-900 uppercase text-xs tracking-tight", children: "Seleccionar Comprobante" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-tighter", children: "PNG, JPG o PDF hasta 4MB" })
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: handleConfirm,
              disabled: processing || !data.proof,
              className: "w-full h-10 hover:bg-primary/90 text-white font-black text-sm uppercase shadow-xl shadow-primary/20 group",
              children: [
                processing ? "Procesando..." : "Finalizar y Notificar",
                /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 ml-2 group-hover:scale-110 transition-transform" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "destructive",
              onClick: () => setShowProofModal(false),
              disabled: processing,
              className: "w-full h-10 font-bold uppercase text-[10px] tracking-widest",
              children: "Cancelar"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 bg-slate-50 flex items-center justify-center gap-2 border-t border-slate-100", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-green-500" }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-slate-400 tracking-widest", children: "Pago Protegido con Linkiu Pay" })
      ] })
    ] }) })
  ] });
}
export {
  Checkout as default
};
