import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { B as Button } from "./button-BdX_X5dq.js";
import { M as MediaManagerModal } from "./MediaManagerModal-BnB4O6SR.js";
import { Image, Upload, X } from "lucide-react";
import { c as cn } from "./utils-B0hQsrDj.js";
function MediaInput({ value, onChange, label, className, placeholder = "Seleccionar imagen", error, disabled, onDisabledClick }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    if (disabled) {
      onDisabledClick?.();
      return;
    }
    setOpen(true);
  };
  return /* @__PURE__ */ jsxs("div", { className: cn("space-y-2", className), children: [
    label && /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-start", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "relative w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group",
            value && "border-solid border-gray-200",
            error && "border-red-300 bg-red-50",
            disabled && "opacity-80 hover:bg-gray-50 cursor-pointer"
            // Keep pointer to indicate interactivity (intercepted)
          ),
          onClick: handleOpen,
          children: value ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("img", { src: value, alt: "Selected", className: "w-full h-full object-cover" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white text-xs font-medium", children: "Cambiar" }) })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1 text-gray-400 text-center p-2", children: [
            /* @__PURE__ */ jsx(Image, { className: "w-6 h-6" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase font-medium", children: "Seleccionar" })
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: handleOpen,
            className: "w-full justify-start gap-2",
            children: [
              /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
              value ? "Cambiar Imagen" : placeholder
            ]
          }
        ),
        value && /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            variant: "ghost",
            onClick: () => onChange(null),
            className: "w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50",
            children: [
              /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }),
              "Eliminar"
            ]
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Sube una imagen o selecciona una de tu biblioteca." }),
        error && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: error })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      MediaManagerModal,
      {
        open,
        onOpenChange: setOpen,
        onSelect: (file) => {
          onChange(file.url, file);
          setOpen(false);
        }
      }
    )
  ] });
}
export {
  MediaInput as M
};
