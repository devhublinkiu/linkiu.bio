import { jsx } from "react/jsx-runtime";
import * as React from "react";
import { c as cn } from "./utils-B0hQsrDj.js";
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      ref,
      "data-slot": "textarea",
      className: cn(
        "border-input dark:bg-input/30 focus-visible:border-ring aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors md:text-sm placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props
    }
  );
});
Textarea.displayName = "Textarea";
export {
  Textarea as T
};
