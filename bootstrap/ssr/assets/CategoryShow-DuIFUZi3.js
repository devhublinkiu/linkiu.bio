import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { P as PublicLayout } from "./PublicLayout-BPgzBK4n.js";
import { H as Header } from "./Header-CDUqNXGd.js";
import { ChevronLeft, Search, X, Flame, Percent, Leaf, Star } from "lucide-react";
import { P as ProductCard } from "./ProductCard-C_ZUuIiH.js";
import { P as ProductDetailDrawer } from "./ProductDetailDrawer-DP7yEYKQ.js";
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
import "react-use";
import "./sheet-DFnQxYfh.js";
const VEGGIE_TAG_VARIANTS = ["Vegetariano", "vegetariano", "veggie", "Veggie"];
function CategoryShow({ tenant, category, categories }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const brandColors = tenant.brand_colors ?? { bg_color: "#f8fafc", name_color: "#1e293b", description_color: "#64748b" };
  const { bg_color, name_color } = brandColors;
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productSlug = params.get("product");
    if (!productSlug || !category.products?.length) return;
    const product = category.products.find((p) => p.slug === productSlug);
    if (product) {
      setSelectedProduct(product);
      setIsDrawerOpen(true);
    }
  }, [category.products]);
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.visit(route("tenant.menu", tenant.slug));
    }
  };
  const tags = [
    { id: "todos", label: "Todos", icon: null },
    { id: "featured", label: "Destacados", icon: Flame },
    { id: "offers", label: "Ofertas", icon: Percent },
    { id: "veggie", label: "Vegetariano", icon: Leaf },
    { id: "top", label: "Populares", icon: Star }
  ];
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return category.products.filter((p) => {
      const matchesSearch = !query || p.name.toLowerCase().includes(query) || p.short_description && p.short_description.toLowerCase().includes(query);
      const tagMatch = activeTag === "Todos" || activeTag === "Destacados" && p.is_featured || activeTag === "Populares" && p.is_featured || activeTag === "Ofertas" && p.original_price && parseFloat(p.original_price) > parseFloat(p.price) || activeTag === "Vegetariano" && p.tags && p.tags.some((t) => VEGGIE_TAG_VARIANTS.includes(String(t))) || p.tags && p.tags.includes(activeTag);
      return matchesSearch && tagMatch;
    });
  }, [category.products, searchQuery, activeTag]);
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: `${category.name} - ${tenant.name}` }),
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
      /* @__PURE__ */ jsxs("div", { className: "bg-white px-4 pt-4 pb-2 flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleBack,
            className: "w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 active:scale-95 transition-all",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-6" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-black text-slate-900 tracking-tight uppercase", children: category.name }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white border-b border-slate-100 pb-2", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 px-4 overflow-x-auto no-scrollbar py-2", children: categories.map((cat) => {
        const isActive = cat.id === category.id;
        return /* @__PURE__ */ jsxs(
          Link,
          {
            href: isActive ? "#" : route("tenant.menu.category", [tenant.slug, cat.slug]),
            className: "flex flex-col items-center gap-2.5 shrink-0 group",
            children: [
              /* @__PURE__ */ jsxs("div", { className: `
                                        w-[4.5rem] h-[4.5rem] rounded-[1.2rem] bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-active:scale-95 border border-slate-100/80 overflow-hidden relative
                                        ${isActive ? "shadow-lg border-slate-300" : "shadow-sm"}
                                    `, children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-white to-slate-50 opacity-50" }),
                cat.icon ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: cat.icon.icon_url,
                    alt: cat.name,
                    className: "w-9 h-9 object-contain relative z-10 opacity-90 group-hover:opacity-100 transition-opacity"
                  }
                ) : /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-300 font-bold text-xs relative z-10", children: cat.name.charAt(0) })
              ] }),
              /* @__PURE__ */ jsx("span", { className: `text-[11px] font-semibold text-center leading-tight line-clamp-2 px-0.5 transition-colors ${isActive ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"}`, children: cat.name })
            ]
          },
          cat.id
        );
      }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "sticky top-0 z-[100] bg-white shadow-sm border-b border-slate-100 pb-0.5", children: [
        /* @__PURE__ */ jsx("div", { className: "px-4 pt-4 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-4 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(Search, { className: "size-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: `Buscar en ${category.name}...`,
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
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 px-4 pb-4 overflow-x-auto no-scrollbar scroll-smooth", children: tags.map((tag) => {
          const Icon = tag.icon;
          const isActive = activeTag === tag.label;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTag(tag.label),
              className: `
                                        shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border
                                        ${isActive ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105" : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"}
                                    `,
              children: [
                Icon && /* @__PURE__ */ jsx(Icon, { className: `size-3.5 ${isActive ? "fill-current" : ""}` }),
                tag.label
              ]
            },
            tag.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-4 pb-32 space-y-4", children: filteredProducts.length > 0 ? filteredProducts.map((product) => /* @__PURE__ */ jsx(
        ProductCard,
        {
          product,
          onClick: () => handleProductClick(product)
        },
        product.id
      )) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white p-6 rounded-full shadow-sm mb-4", children: /* @__PURE__ */ jsx(Search, { className: "size-10 text-slate-200" }) }),
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900", children: "No encontramos productos" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400 mt-1 max-w-[200px]", children: "Intenta con otros filtros o busca algo distinto." })
      ] }) }),
      selectedProduct && /* @__PURE__ */ jsx(
        ProductDetailDrawer,
        {
          product: selectedProduct,
          isOpen: isDrawerOpen,
          onClose: () => setIsDrawerOpen(false)
        }
      )
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
  CategoryShow as default
};
