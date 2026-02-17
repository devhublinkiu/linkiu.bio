import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Head } from "@inertiajs/react";
import { CheckCircle, Camera, Loader2 } from "lucide-react";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, d as CardContent, a as CardHeader, b as CardTitle, c as CardDescription } from "./card-BaovBWX5.js";
import { toast } from "sonner";
import axios from "axios";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
function MagicUpload({ token, tenant }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      await axios.post(route("tenant.magic.store", { tenant: tenant.slug, token }), formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setSuccess(true);
      toast.success("¡Comprobante enviado exitosamente!");
    } catch (error) {
      console.error(error);
      toast.error("Error al subir el comprobante. Intenta nuevamente.");
    } finally {
      setUploading(false);
    }
  };
  if (success) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-50 flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx(Head, { title: "Comprobante Enviado" }),
      /* @__PURE__ */ jsx(Card, { className: "w-full max-w-sm text-center border-none shadow-lg", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-10 pb-10 space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-10 h-10 text-green-600" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-slate-900", children: "¡Recibido!" }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-600", children: [
          "Tu comprobante ha sido enviado a la caja.",
          /* @__PURE__ */ jsx("br", {}),
          "Ya puedes cerrar esta ventana."
        ] })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx(Head, { title: `Cargar Comprobante - ${tenant.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 text-center", children: [
      tenant.logo_url && /* @__PURE__ */ jsx("img", { src: tenant.logo_url, alt: tenant.name, className: "h-12 w-auto mx-auto mb-2 object-contain" }),
      /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-slate-900", children: tenant.name })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-sm border-none shadow-lg overflow-hidden", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "bg-white border-b pb-4", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-center text-xl", children: "Adjuntar Comprobante" }),
        /* @__PURE__ */ jsx(CardDescription, { className: "text-center", children: "Toma una foto o selecciona el pantallazo de tu transferencia." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "pt-6 space-y-6", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 min-h-[250px] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors relative overflow-hidden",
            onClick: () => document.getElementById("file-upload")?.click(),
            children: [
              preview ? /* @__PURE__ */ jsx("img", { src: preview, alt: "Preview", className: "w-full h-full object-contain absolute inset-0" }) : /* @__PURE__ */ jsxs("div", { className: "text-center p-6 space-y-2", children: [
                /* @__PURE__ */ jsx("div", { className: "mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-2", children: /* @__PURE__ */ jsx(Camera, { className: "w-6 h-6" }) }),
                /* @__PURE__ */ jsx("p", { className: "font-medium text-slate-800", children: "Tocar para subir foto" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Soporta JPG, PNG, WebP (Max 10MB)" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "file-upload",
                  type: "file",
                  accept: "image/*",
                  capture: "environment",
                  className: "hidden",
                  onChange: handleFileChange
                }
              )
            ]
          }
        ),
        preview && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              className: "w-full",
              onClick: () => {
                setPreview(null);
                setFile(null);
              },
              disabled: uploading,
              children: "Cambiar"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              className: "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold",
              onClick: handleUpload,
              disabled: uploading,
              children: uploading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }),
                "Enviando..."
              ] }) : "Confirmar Envío"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-8 text-xs text-slate-400", children: "Powered by Linkiu POS" })
  ] });
}
export {
  MagicUpload as default
};
