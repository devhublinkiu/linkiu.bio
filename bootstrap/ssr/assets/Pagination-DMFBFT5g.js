import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@inertiajs/react";
import { c as cn } from "./utils-B0hQsrDj.js";
import { b as buttonVariants } from "./button-BdX_X5dq.js";
const Pagination = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "nav",
  {
    role: "navigation",
    "aria-label": "pagination",
    className: cn("mx-auto flex w-full justify-center", className),
    ...props
  }
);
Pagination.displayName = "Pagination";
const PaginationContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ul",
  {
    ref,
    className: cn("flex flex-row items-center gap-1", className),
    ...props
  }
));
PaginationContent.displayName = "PaginationContent";
const PaginationItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("li", { ref, className: cn("", className), ...props }));
PaginationItem.displayName = "PaginationItem";
const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => /* @__PURE__ */ jsx(
  Link,
  {
    "aria-current": isActive ? "page" : void 0,
    className: cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size
      }),
      className
    ),
    ...props
  }
);
PaginationLink.displayName = "PaginationLink";
const PaginationPrevious = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxs(
  PaginationLink,
  {
    "aria-label": "Go to previous page",
    size: "default",
    className: cn("gap-1 pl-2.5", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsx("span", { children: "Previous" })
    ]
  }
);
PaginationPrevious.displayName = "PaginationPrevious";
const PaginationNext = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxs(
  PaginationLink,
  {
    "aria-label": "Go to next page",
    size: "default",
    className: cn("gap-1 pr-2.5", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { children: "Next" }),
      /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
    ]
  }
);
PaginationNext.displayName = "PaginationNext";
const PaginationEllipsis = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxs(
  "span",
  {
    "aria-hidden": true,
    className: cn("flex h-9 w-9 items-center justify-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "More pages" })
    ]
  }
);
PaginationEllipsis.displayName = "PaginationEllipsis";
function SharedPagination({ links, className = "" }) {
  if (links.length <= 3) return null;
  return /* @__PURE__ */ jsx(Pagination, { className, children: /* @__PURE__ */ jsx(PaginationContent, { children: links.map((link, key) => {
    const isPrevious = link.label.includes("Previous") || link.label.includes("pagination.previous") || link.label.includes("&laquo;");
    const isNext = link.label.includes("Next") || link.label.includes("pagination.next") || link.label.includes("&raquo;");
    const isEllipsis = link.label === "..." || link.label.includes("...");
    link.label.replace("&laquo; ", "").replace(" &raquo;", "");
    if (isEllipsis) {
      return /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(PaginationEllipsis, {}) }, key);
    }
    if (isPrevious) {
      return /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(
        PaginationPrevious,
        {
          href: link.url || "#",
          className: !link.url ? "pointer-events-none opacity-50" : ""
        }
      ) }, key);
    }
    if (isNext) {
      return /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(
        PaginationNext,
        {
          href: link.url || "#",
          className: !link.url ? "pointer-events-none opacity-50" : ""
        }
      ) }, key);
    }
    return /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(
      PaginationLink,
      {
        href: link.url || "#",
        isActive: link.active,
        dangerouslySetInnerHTML: { __html: link.label }
      }
    ) }, key);
  }) }) });
}
export {
  SharedPagination as S
};
