import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { usePage, useForm } from "@inertiajs/react";
import { Upload, X, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";
function PaymentUploadModal({ isOpen, onClose, invoice }) {
  const { auth, currentTenant } = usePage().props;
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    invoice_id: invoice?.id,
    proof: null
  });
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setData("proof", file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };
  const submit = (e) => {
    e.preventDefault();
    if (!data.proof) {
      toast.error("Por favor selecciona un archivo");
      return;
    }
    if (!currentTenant?.slug) {
      toast.error("Error de sesión: No se pudo identificar la tienda");
      return;
    }
    post(route("tenant.invoices.store", { tenant: currentTenant.slug }), {
      onSuccess: () => {
        toast.success("Comprobante enviado correctamente");
        reset();
        setPreview(null);
        onClose();
      },
      onError: (err) => {
        console.error(err);
        toast.error("Error al subir el comprobante");
      }
    });
  };
  const handleClose = () => {
    reset();
    clearErrors();
    setPreview(null);
    onClose();
  };
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: handleClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md border-primary/10 shadow-2xl", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "text-xl font-black text-slate-900 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Upload, { className: "w-5 h-5 text-primary" }),
        "Subir Comprobante"
      ] }),
      /* @__PURE__ */ jsxs(DialogDescription, { className: "text-slate-500 font-medium", children: [
        "Carga el recibo de transferencia para la Factura #",
        invoice?.id
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6 pt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => fileInputRef.current?.click(),
            className: "border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group",
            children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "file",
                  ref: fileInputRef,
                  className: "hidden",
                  accept: "image/*,.pdf",
                  onChange: handleFileChange
                }
              ),
              preview ? /* @__PURE__ */ jsxs("div", { className: "relative w-full aspect-video rounded-xl overflow-hidden border border-slate-100 shadow-sm", children: [
                /* @__PURE__ */ jsx("img", { src: preview, alt: "Vista previa", className: "w-full h-full object-cover" }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "destructive",
                    size: "icon",
                    className: "absolute top-2 right-2 h-8 w-8 rounded-full",
                    onClick: (e) => {
                      e.stopPropagation();
                      setPreview(null);
                      setData("proof", null);
                    },
                    children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
                  }
                )
              ] }) : data.proof ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-slate-50 p-4 rounded-xl w-full border border-slate-100", children: [
                /* @__PURE__ */ jsx("div", { className: "h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-700 truncate", children: data.proof.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest", children: "PDF Seleccionado" })
                ] }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    onClick: (e) => {
                      e.stopPropagation();
                      setData("proof", null);
                    },
                    children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
                  }
                )
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("div", { className: "h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all", children: /* @__PURE__ */ jsx(Upload, { className: "w-7 h-7" }) }),
                /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-700", children: "Haz clic para seleccionar" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-medium mt-1", children: "Soporta JPG, PNG o PDF (Máximo 4MB)" })
                ] })
              ] })
            ]
          }
        ),
        errors.proof && /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-red-500 flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3" }),
          " ",
          errors.proof
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "flex-col sm:flex-row gap-2 pb-2", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            onClick: handleClose,
            className: "font-bold text-slate-500 order-2 sm:order-1",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            disabled: processing || !data.proof,
            className: "font-bold shadow-lg shadow-primary/20 order-1 sm:order-2",
            children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }),
              "Subiendo..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 mr-2" }),
              "Enviar Comprobante"
            ] })
          }
        )
      ] })
    ] })
  ] }) });
}
function AlertCircle(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
        /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
        /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
      ]
    }
  );
}
export {
  PaymentUploadModal as P
};
