import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { P as PublicLayout } from "./PublicLayout-BPgzBK4n.js";
import { H as Header } from "./Header-CDUqNXGd.js";
import { P as ProductCard } from "./ProductCard-C_ZUuIiH.js";
import { u as useFavorites, P as ProductDetailDrawer } from "./ProductDetailDrawer-DP7yEYKQ.js";
import { Heart, Loader2 } from "lucide-react";
import axios from "axios";
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
function FavoritesIndex({ tenant }) {
  const { favorites } = useFavorites();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const brandColors = tenant.brand_colors ?? { bg_color: "#f8fafc", name_color: "#1e293b", description_color: "#64748b" };
  const { bg_color, name_color } = brandColors;
  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.post(route("tenant.menu.products.batch", [tenant.slug]), {
          ids: favorites
        });
        setProducts(response.data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [favorites, tenant.slug]);
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: `Favoritos - ${tenant.name}` }),
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
      /* @__PURE__ */ jsxs("div", { className: "bg-white px-4 pt-6 pb-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500", children: /* @__PURE__ */ jsx(Heart, { className: "size-6 fill-current" }) }),
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-black text-slate-900 tracking-tight uppercase", children: "Mis Favoritos" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 font-medium", children: "Tus platos guardados listos para pedir." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-4 pb-32 flex-1", children: loading ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "size-8 text-rose-500 animate-spin mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400 font-medium", children: "Cargando tus favoritos..." })
      ] }) : products.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4", children: products.map((product) => /* @__PURE__ */ jsx(
        ProductCard,
        {
          product,
          onClick: () => handleProductClick(product)
        },
        product.id
      )) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-slate-100 p-6 rounded-full shadow-sm mb-4", children: /* @__PURE__ */ jsx(Heart, { className: "size-10 text-slate-300" }) }),
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-lg", children: "Aún no tienes favoritos" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400 mt-2 max-w-[250px] leading-relaxed", children: "Explora el menú y dale corazón a los platos que más te gusten para guardarlos aquí." }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("tenant.menu", [tenant.slug]),
            className: "mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 active:scale-95 transition-transform",
            children: "Ir al Menú"
          }
        )
      ] }) }),
      selectedProduct && /* @__PURE__ */ jsx(
        ProductDetailDrawer,
        {
          product: selectedProduct,
          isOpen: isDrawerOpen,
          onClose: () => setIsDrawerOpen(false)
        }
      )
    ] })
  ] });
}
export {
  FavoritesIndex as default
};
