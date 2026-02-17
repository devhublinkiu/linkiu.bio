import { jsx, jsxs } from "react/jsx-runtime";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-QdU9y0pO.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import "react";
import "@radix-ui/react-dialog";
import "lucide-react";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
function CreateFolderModal({ open, onOpenChange, form, onSubmit }) {
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Crear Nueva Carpeta" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-semibold tracking-tight", children: "Nombre de la carpeta" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            value: form.data.name,
            onChange: (e) => form.setData("name", e.target.value),
            placeholder: "mi-carpeta",
            pattern: "[a-zA-Z0-9_-]+",
            title: "Solo letras, números, guiones y guiones bajos"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Solo letras, números, guiones (-) y guiones bajos (_)" })
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: form.processing || !form.data.name, className: "w-full", children: form.processing ? "Creando..." : "Crear Carpeta" })
    ] })
  ] }) });
}
export {
  CreateFolderModal
};
