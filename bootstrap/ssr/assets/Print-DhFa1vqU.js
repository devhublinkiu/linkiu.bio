import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, Head } from "@inertiajs/react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Printer, MapPin } from "lucide-react";
import { B as Button } from "./button-BdX_X5dq.js";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
function Print({ zones }) {
  const { currentTenant } = usePage().props;
  const handlePrint = () => {
    window.print();
  };
  const getTableUrl = (token) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${currentTenant?.slug}?m=${token}`;
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-50 p-4 md:p-8 print:bg-white print:p-0", children: [
    /* @__PURE__ */ jsx(Head, { title: "Imprimir QRs - Mesas" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto mb-8 flex items-center justify-between print:hidden", children: [
      /* @__PURE__ */ jsxs(Button, { variant: "ghost", onClick: () => window.history.back(), children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
        " Volver"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: /* @__PURE__ */ jsxs(Button, { onClick: handlePrint, className: "gap-2", children: [
        /* @__PURE__ */ jsx(Printer, { className: "w-4 h-4" }),
        " Imprimir QRs"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto bg-white p-8 shadow-sm border print:shadow-none print:border-none", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-black uppercase tracking-tight text-slate-900", children: currentTenant?.name }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 font-medium", children: "Códigos QR para Pedidos en Mesa" }),
        /* @__PURE__ */ jsx("div", { className: "w-24 h-1 bg-primary mx-auto mt-4 rounded-full" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-16", children: zones.map((zone) => /* @__PURE__ */ jsxs("div", { className: "break-inside-avoid", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8 border-b pb-2 border-slate-100", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-primary" }),
          /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-slate-800 uppercase tracking-wide", children: [
            "Zona: ",
            zone.name
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-8", children: zone.tables.map((table) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center p-6 border rounded-2xl bg-slate-50/30 border-slate-100 break-inside-avoid", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-white p-4 rounded-xl shadow-sm mb-4 ring-1 ring-slate-100", children: /* @__PURE__ */ jsx(
            QRCodeSVG,
            {
              value: getTableUrl(table.token),
              size: 140,
              level: "H",
              includeMargin: true
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1", children: "Escanea para pedir" }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-slate-900 uppercase", children: table.name })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 text-[9px] text-slate-300 font-mono break-all line-clamp-1 max-w-[120px]", children: table.token })
        ] }, table.id)) })
      ] }, zone.id)) }),
      /* @__PURE__ */ jsx("div", { className: "mt-16 pt-8 border-t border-dashed text-center", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400", children: "Generado automáticamente por Linkiu.bio - Gastronomía" }) })
    ] }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                @media print {
                    @page {
                        margin: 1cm;
                        size: portrait;
                    }
                    body {
                        background: white !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            `
    } })
  ] });
}
export {
  Print as default
};
