import { jsx, jsxs } from "react/jsx-runtime";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-QdU9y0pO.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import "react";
import "@radix-ui/react-dialog";
import "lucide-react";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-select";
function UploadModal({
  open,
  onOpenChange,
  data,
  setData,
  onSubmit,
  fileInputRef,
  processing,
  folders,
  onFileSelect
}) {
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Subir Archivos" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold tracking-tight", children: "Archivos" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            ref: fileInputRef,
            type: "file",
            multiple: true,
            onChange: onFileSelect,
            className: "cursor-pointer file:font-semibold file:text-primary"
          }
        ),
        data.files.length > 0 && /* @__PURE__ */ jsxs("p", { className: "text-xs font-medium text-muted-foreground mt-2 bg-muted p-2 rounded-md", children: [
          data.files.length,
          " archivo(s) seleccionado(s)"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold tracking-tight", children: "Carpeta" }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: data.folder,
            onValueChange: (value) => setData("folder", value),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona carpeta" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "uploads", children: "uploads" }),
                folders.filter((f) => f !== "uploads").map((folder) => /* @__PURE__ */ jsx(SelectItem, { value: folder, children: folder }, folder))
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: 'Usa "Nueva Carpeta" para crear una carpeta nueva' })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold tracking-tight", children: "Descripción (opcional)" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            value: data.description,
            onChange: (e) => setData("description", e.target.value),
            placeholder: "Descripción del archivo"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing || data.files.length === 0, className: "w-full", children: processing ? "Subiendo..." : "Subir" })
    ] })
  ] }) });
}
export {
  UploadModal
};
