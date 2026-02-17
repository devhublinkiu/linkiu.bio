import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { P as PublicLayout } from "./PublicLayout-SbrFcTnr.js";
import { H as Header } from "./Header-7g29WzYU.js";
import { Search, X } from "lucide-react";
import "sonner";
import "framer-motion";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./button-BdX_X5dq.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./input-B_4qRSOV.js";
import "./label-L_u-fyc1.js";
import "@radix-ui/react-label";
import "./textarea-BpljFL5D.js";
function Index({ tenant, categories }) {
  const [searchQuery, setSearchQuery] = useState("");
  const brandColors = tenant.brand_colors ?? { bg_color: "#f8fafc", name_color: "#1e293b", description_color: "#64748b" };
  const { bg_color, name_color } = brandColors;
  const filteredCategories = categories.filter(
    (cat) => cat.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: `Menú - ${tenant.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-h-screen bg-gray-50/50", children: [
      /* @__PURE__ */ jsx(
        Header,
        {
          tenantName: tenant.name,
          logoUrl: tenant.logo_url,
          description: tenant.store_description,
          bgColor: bg_color,
          textColor: name_color,
          descriptionColor: brandColors.description_color
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "p-4 bg-white mb-2", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-4", children: filteredCategories.map((category) => /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("tenant.menu.category", [tenant.slug, category.slug]),
          className: "flex flex-col items-center gap-2.5 group",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "w-[4.5rem] h-[4.5rem] rounded-[1.2rem] bg-white shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-active:scale-95 border border-slate-100/80 overflow-hidden relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-white to-slate-50 opacity-50" }),
              category.icon ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: category.icon.icon_url,
                  alt: category.name,
                  className: "w-9 h-9 object-contain relative z-10 opacity-90 group-hover:opacity-100 transition-opacity"
                }
              ) : /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-300 font-bold text-xs relative z-10", children: category.name.charAt(0) })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-slate-600 text-center leading-tight line-clamp-2 px-0.5 group-hover:text-slate-900 transition-colors", children: category.name })
          ]
        },
        category.id
      )) }) }),
      /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-[100] bg-white shadow-sm border-b border-slate-100", children: /* @__PURE__ */ jsx("div", { className: "px-4 pt-4 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-4 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(Search, { className: "size-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" }) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Buscar categoría...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "w-full h-11 pl-12 pr-10 bg-slate-100 border-transparent focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 rounded-2xl text-sm font-medium transition-all"
          }
        ),
        searchQuery && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSearchQuery(""),
            className: "absolute inset-y-0 right-3 flex items-center px-1",
            children: /* @__PURE__ */ jsx(X, { className: "size-4 text-slate-400 bg-slate-200 rounded-full p-0.5" })
          }
        )
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 bg-gray-50/50 p-4 pb-32", children: /* @__PURE__ */ jsx("div", { className: "text-center py-10 opacity-50", children: /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest", children: "Selecciona una categoría para ver productos" }) }) })
    ] }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `
    } })
  ] });
}
export {
  Index as default
};
