import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React__default, { useState, useRef, useEffect } from "react";
import { A as AdminLayout } from "./AdminLayout-C8hB-Nb-.js";
import { useForm, router, Head, Link } from "@inertiajs/react";
import { C as Card } from "./card-BaovBWX5.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { CheckCircle2, ShieldCheck, Globe, Download, LayoutDashboard, Zap, Rocket, UploadCloud, FileText, Clock, Loader2 } from "lucide-react";
import { route } from "ziggy-js";
import { toast } from "sonner";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { c as cn } from "./utils-B0hQsrDj.js";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import { toPng } from "html-to-image";
import { QRCodeCanvas } from "qrcode.react";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./dropdown-menu-B2I3vWlQ.js";
import "@radix-ui/react-slot";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./input-B_4qRSOV.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BclLUCFD.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./menuConfig-rtCrEhXP.js";
import "./sonner-ZUDSQr7N.js";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
const ReceiptTicket = React__default.forwardRef(({ invoice, tenant, plan }, ref) => {
  const baseUrl = window.location.hostname === "localhost" || window.location.hostname.includes("127.0.0.1") ? "https://linkiu.bio" : window.location.origin;
  const verifyUrl = `${baseUrl}/verificar/${invoice.id}`;
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(amount);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: "w-[400px] bg-white p-8 rounded-[20px] shadow-2xl relative overflow-hidden font-sans border border-slate-100",
      style: { minHeight: "600px" },
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center text-center space-y-4 mb-8", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tighter uppercase text-slate-900 leading-none", children: "LINKIU.BIO" }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400", children: "Comprobante de Pago" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-8", children: /* @__PURE__ */ jsxs("div", { className: "px-6 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-widest", children: "Pago Aprobado" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "relative py-4 mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute left-[-40px] right-[-40px] border-t border-dashed border-slate-200" }),
          /* @__PURE__ */ jsx("div", { className: "absolute left-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-200 shadow-inner" }),
          /* @__PURE__ */ jsx("div", { className: "absolute right-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-200 shadow-inner" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6 relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold uppercase text-slate-400 tracking-widest", children: "Factura" }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm font-bold text-slate-900", children: [
                "#INV-",
                invoice.id
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-right", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold uppercase text-slate-400 tracking-widest", children: "Fecha" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-900", children: formatDate(invoice.paid_at || invoice.created_at) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1 border-t border-slate-100 pt-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold uppercase text-slate-400 tracking-widest", children: "Cliente" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-900", children: tenant.name }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-primary underline", children: [
              "linkiu.bio/",
              tenant.slug
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1 border-t border-slate-100 pt-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold uppercase text-slate-400 tracking-widest", children: "Concepto" }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-sm font-bold text-slate-900 uppercase", children: [
                "Plan ",
                plan.name
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-900", children: formatAmount(invoice.amount) })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-slate-400 pt-4", children: [
              "Suscripción activa hasta: ",
              formatDate(
                invoice.subscription?.ends_at || tenant.latest_subscription?.ends_at || tenant.latestSubscription?.ends_at || invoice.subscription?.trial_ends_at || tenant.latest_subscription?.trial_ends_at || tenant.latestSubscription?.trial_ends_at || (/* @__PURE__ */ new Date()).toISOString()
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative py-4", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute left-[-40px] right-[-40px] border-t border-dashed border-slate-200" }),
            /* @__PURE__ */ jsx("div", { className: "absolute left-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-200 shadow-inner" }),
            /* @__PURE__ */ jsx("div", { className: "absolute right-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-200 shadow-inner" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-center pt-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400", children: "Total Pagado" }),
              /* @__PURE__ */ jsx("div", { className: "text-5xl font-bold text-primary tracking-tighter", children: formatAmount(invoice.amount) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "p-1 bg-white rounded-lg border border-slate-900 shadow-sm", children: /* @__PURE__ */ jsx(
                QRCodeCanvas,
                {
                  value: verifyUrl,
                  size: 56,
                  level: "M",
                  includeMargin: false
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "text-left py-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[8px] font-bold uppercase text-slate-400 leading-none", children: "Verificado por" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-900 uppercase tracking-tighter", children: "Linkiu Pay Secure" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 text-center space-y-2 pb-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-500", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest", children: "Transacción Protegida" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[8px] font-bold text-slate-300 uppercase leading-relaxed max-w-[200px] mx-auto italic", children: "Este documento es un comprobante válido de suscripción a los servicios de Linkiu.bio" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -z-0" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -z-0" })
      ]
    }
  );
});
ReceiptTicket.displayName = "ReceiptTicket";
function Success({ tenant, plan, invoice }) {
  const isPaid = invoice.status === "paid";
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(isPaid);
  const receiptRef = useRef(null);
  const { data, setData, post, processing, errors } = useForm({
    invoice_id: invoice.id,
    proof: null
  });
  useEffect(() => {
    if (invoice.status === "pending_review" && window.Echo) {
      const channel = `tenant-updates.${tenant.id}`;
      try {
        window.Echo.channel(channel).listen(".payment.status_updated", (e) => {
          if (e.invoice_id === invoice.id && e.status === "paid") {
            setShowConfetti(true);
            toast.success("¡Pago aprobado! Redirigiendo...");
            router.reload();
          }
        });
        return () => {
          try {
            if (window.Echo && typeof window.Echo.leave === "function") {
              window.Echo.leave(channel);
            }
          } catch (cleanupErr) {
            console.error("[Echo] Cleanup error:", cleanupErr);
          }
        };
      } catch (err) {
        console.error("[Echo] Failed to subscribe:", err);
      }
    }
  }, [invoice.status, invoice.id, tenant.id]);
  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;
    try {
      const dataUrl = await toPng(receiptRef.current, {
        quality: 1,
        pixelRatio: 2,
        skipFonts: true,
        // Skip external fonts to avoid CORS issues
        cacheBust: true
        // Prevent caching issues
      });
      const link = document.createElement("a");
      link.download = `Recibo_Linkiu_#${invoice.id}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Recibo descargado correctamente.");
    } catch (err) {
      console.error("Failed to generate receipt:", err);
      toast.error("Error al generar el recibo. Por favor, intenta de nuevo.");
    }
  };
  const handleUpload = (e) => {
    e.preventDefault();
    post(route("tenant.invoices.store", { tenant: tenant.slug }), {
      onSuccess: () => toast.success("Comprobante enviado con éxito."),
      forceFormData: true
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: isPaid ? "¡Pago Exitoso!" : "Procesando tu Suscripción", children: [
    /* @__PURE__ */ jsx(Head, { title: isPaid ? "¡Felicidades! - Suscripción Activa" : "Carga tu Comprobante" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto py-12 px-4", children: [
      /* @__PURE__ */ jsx(Card, { className: "rounded-[40px] border-none shadow-2xl overflow-hidden bg-white", children: /* @__PURE__ */ jsxs("div", { className: "p-8 sm:p-12 text-center space-y-8 relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" }),
        isPaid ? /* @__PURE__ */ jsx(PaidState, { tenant, plan, invoice, onDownload: handleDownloadReceipt }) : invoice.status === "pending" ? /* @__PURE__ */ jsx(
          UploadState,
          {
            data,
            setData,
            handleUpload,
            processing,
            plan,
            invoice,
            errors
          }
        ) : /* @__PURE__ */ jsx(ReviewState, { plan, tenant })
      ] }) }),
      /* @__PURE__ */ jsx("p", { className: "mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest", children: isPaid ? "Un resumen de tu transacción ha sido enviado a tu correo electrónico." : "Tu acceso Pro se activará en cuanto el equipo verifique tu transacción." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "fixed left-[-9999px] top-0", children: /* @__PURE__ */ jsx(ReceiptTicket, { ref: receiptRef, invoice, tenant, plan }) }),
    showConfetti && /* @__PURE__ */ jsx(
      ReactConfetti,
      {
        width,
        height,
        recycle: false,
        numberOfPieces: 500,
        gravity: 0.15,
        colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE", "#000000"]
      }
    )
  ] });
}
function PaidState({ tenant, plan, invoice, onDownload }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-in zoom-in duration-500", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-16 h-16" }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-black text-slate-900 tracking-tight uppercase leading-none", children: [
        "¡Bienvenido al ",
        /* @__PURE__ */ jsx("span", { className: "text-primary", children: plan.name }),
        "!"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 font-bold text-md max-w-md mx-auto leading-relaxed", children: "Tu pago ha sido procesado correctamente. Tu marca acaba de subir de nivel. 🚀" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-left", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary", children: /* @__PURE__ */ jsx(Globe, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase text-slate-400 tracking-widest", children: "Tu Nueva URL" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-black text-slate-900 underline decoration-primary decoration-2 underline-offset-4", children: [
            "linkiu.bio/",
            tenant.slug
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Button, { className: "font-black text-[10px] uppercase tracking-widest gap-2", onClick: onDownload, children: [
        /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
        "Recibo #",
        invoice.id
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsx(Link, { href: route("tenant.dashboard", { tenant: tenant.slug }), className: "block group", children: /* @__PURE__ */ jsxs(Card, { className: "p-6 rounded-3xl border-2 border-slate-50 group-hover:border-primary transition-all group-hover:bg-primary/5 text-left h-full", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(LayoutDashboard, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsx("h4", { className: "font-black uppercase text-sm mb-1", children: "Ir al Dashboard" }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-tighter", children: "Gestiona tu tienda ahora" })
      ] }) }),
      /* @__PURE__ */ jsx(Link, { href: route("tenant.profile.edit", { tenant: tenant.slug }), className: "block group", children: /* @__PURE__ */ jsxs(Card, { className: "p-6 rounded-3xl border-2 border-slate-50 group-hover:border-primary transition-all group-hover:bg-primary/5 text-left h-full", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Zap, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsx("h4", { className: "font-black uppercase text-sm mb-1", children: "Crea tu Primer Link" }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-tighter", children: "Empieza a compartir tu marca" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsx(
      Button,
      {
        asChild: true,
        className: "w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg uppercase tracking-widest gap-3 shadow-xl",
        children: /* @__PURE__ */ jsxs(Link, { href: route("tenant.dashboard", { tenant: tenant.slug }), children: [
          "¡Comenzar Ahora!",
          /* @__PURE__ */ jsx(Rocket, { className: "w-6 h-6 animate-bounce" })
        ] })
      }
    ) })
  ] });
}
function UploadState({ data, setData, handleUpload, processing, plan, invoice, errors }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsx(UploadCloud, { className: "w-10 h-10" }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx(Badge, { className: "bg-slate-900 text-white font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest", children: "Paso Final: Confirmar Pago" }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black text-slate-900 tracking-tight uppercase", children: "Sube tu Comprobante" }),
      /* @__PURE__ */ jsxs("p", { className: "text-slate-500 font-bold text-sm max-w-md mx-auto leading-relaxed", children: [
        "Has seleccionado el plan **",
        plan.name,
        "**. Sube una foto o PDF de tu transferencia para que podamos activarlo."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleUpload, className: "space-y-6", children: [
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
          "p-10 rounded-[32px] border-4 border-dashed transition-all flex flex-col items-center gap-4 bg-slate-50",
          data.proof ? "border-primary bg-primary/5" : "border-slate-100 group-hover:border-slate-200"
        ), children: data.proof ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg animate-in zoom-in", children: /* @__PURE__ */ jsx(FileText, { className: "w-8 h-8" }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("span", { className: "block font-black text-slate-900 uppercase text-xs truncate max-w-[200px]", children: data.proof.name }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-primary uppercase", children: "Archivo listo para enviar" })
          ] })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(UploadCloud, { className: "w-8 h-8" }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-center space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "font-black text-slate-900 uppercase text-xs italic tracking-tight", children: "Seleccionar archivo" }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-tighter", children: "PNG, JPG o PDF (máx. 4MB)" })
          ] })
        ] }) })
      ] }),
      errors.proof && /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-destructive", children: errors.proof }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "submit",
          disabled: processing || !data.proof,
          className: "w-full h-16 rounded-[24px] bg-primary hover:bg-primary/90 text-white font-black text-xl uppercase tracking-widest shadow-xl shadow-primary/20",
          children: [
            processing ? "Enviando..." : "Notificar al Sistema",
            /* @__PURE__ */ jsx(Rocket, { className: "w-6 h-6 ml-3" })
          ]
        }
      )
    ] })
  ] });
}
function ReviewState({ plan, tenant }) {
  return /* @__PURE__ */ jsxs("div", { className: "py-12 space-y-8 animate-in zoom-in duration-500", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-center relative", children: [
      /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 relative z-10", children: /* @__PURE__ */ jsx(Clock, { className: "w-12 h-12 animate-pulse" }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 w-24 h-24 mx-auto rounded-full border-4 border-amber-500 border-t-transparent animate-spin opacity-20" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black text-slate-900 tracking-tight uppercase leading-none", children: "Verificando tu Pago" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 font-medium text-lg max-w-md mx-auto", children: '"Estamos procesando tu pago... por favor espera un momento mientras validamos los datos."' }),
        /* @__PURE__ */ jsxs("div", { className: "max-w-xs mx-auto p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 flex justify-center items-center gap-4", children: [
          /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 text-primary animate-spin" }),
          /* @__PURE__ */ jsx("span", { className: "text-[11px] font-black uppercase text-slate-400 tracking-widest", children: "Estado: En Revisión Manual" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-slate-100", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4", children: "Mientras tanto puedes:" }),
          /* @__PURE__ */ jsx(Button, { asChild: true, className: "h-10 rounded-xl px-8 font-black uppercase text-xs tracking-widest border-2", children: /* @__PURE__ */ jsx(Link, { href: route("tenant.dashboard", { tenant: plan.tenant_slug || tenant.slug }), children: "Volver al Dashboard" }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Success as default
};
