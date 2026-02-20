import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { c as cn } from "./utils-B0hQsrDj.js";
import { B as Button } from "./button-BdX_X5dq.js";
const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetPortal = DialogPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    "data-slot": "sheet-overlay",
    className: cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/10 duration-100 data-ending-style:opacity-0 data-starting-style:opacity-0 backdrop-blur-sm fixed inset-0 z-50",
      className
    ),
    ...props
  }
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;
const SheetContent = React.forwardRef(({ className, children, side = "right", showCloseButton = true, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      "data-slot": "sheet-content",
      "data-side": side,
      className: cn(
        "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-open:animate-in data-closed:animate-out data-[side=right]:data-[state=closed]:slide-out-to-right-10 data-[side=right]:data-[state=open]:slide-in-from-right-10 data-[side=left]:data-[state=closed]:slide-out-to-left-10 data-[side=left]:data-[state=open]:slide-in-from-left-10 data-[side=top]:data-[state=closed]:slide-out-to-top-10 data-[side=top]:data-[state=open]:slide-in-from-top-10 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-closed:fade-out-0 data-open:fade-in-0 data-[side=bottom]:data-[state=closed]:slide-out-to-bottom-10 data-[side=bottom]:data-[state=open]:slide-in-from-bottom-10 fixed z-50 flex flex-col gap-4 p-6 bg-clip-padding text-sm shadow-lg transition duration-200 ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
        className
      ),
      ...props,
      children: [
        children,
        showCloseButton && /* @__PURE__ */ jsx(DialogPrimitive.Close, { "data-slot": "sheet-close", asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "absolute top-3 right-3", size: "icon-sm", children: [
          /* @__PURE__ */ jsx(XIcon, {}),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] }) })
      ]
    }
  )
] }));
SheetContent.displayName = "SheetContent";
const SheetHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    "data-slot": "sheet-header",
    className: cn("gap-0.5 flex flex-col", className),
    ...props
  }
);
SheetHeader.displayName = "SheetHeader";
const SheetFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    "data-slot": "sheet-footer",
    className: cn("gap-2 mt-auto flex flex-col", className),
    ...props
  }
);
SheetFooter.displayName = "SheetFooter";
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    "data-slot": "sheet-title",
    className: cn("text-foreground text-base font-medium", className),
    ...props
  }
));
SheetTitle.displayName = "SheetTitle";
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    "data-slot": "sheet-description",
    className: cn("text-muted-foreground text-sm", className),
    ...props
  }
));
SheetDescription.displayName = "SheetDescription";
export {
  Sheet as S,
  SheetTrigger as a,
  SheetContent as b,
  SheetHeader as c,
  SheetTitle as d,
  SheetDescription as e,
  SheetFooter as f
};
