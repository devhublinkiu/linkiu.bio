import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { c as cn } from "./utils-B0hQsrDj.js";
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Item,
  {
    ref,
    "data-slot": "accordion-item",
    className: cn("not-last:border-b", className),
    ...props
  }
));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    "data-slot": "accordion-trigger",
    className: cn(
      "focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:after:border-ring **:data-[slot=accordion-trigger-icon]:text-muted-foreground rounded-lg py-2.5 text-left text-sm font-medium hover:underline focus-visible:ring-[3px] **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 group/accordion-trigger relative flex flex-1 items-start justify-between border border-transparent transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(
        ChevronDownIcon,
        {
          "data-slot": "accordion-trigger-icon",
          className: "pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
        }
      ),
      /* @__PURE__ */ jsx(
        ChevronUpIcon,
        {
          "data-slot": "accordion-trigger-icon",
          className: "pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
        }
      )
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    "data-slot": "accordion-content",
    className: "data-open:animate-accordion-down data-closed:animate-accordion-up text-sm overflow-hidden",
    ...props,
    children: /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "pt-0 pb-2.5 [&_a]:hover:text-foreground h-(--radix-accordion-content-height) [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4",
          className
        ),
        children
      }
    )
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
export {
  Accordion as A,
  AccordionItem as a,
  AccordionTrigger as b,
  AccordionContent as c
};
