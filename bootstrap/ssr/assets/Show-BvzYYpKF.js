import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { ChevronLeft, X } from "lucide-react";
function Show({ tenant, legalPage }) {
  const bgColor = tenant.brand_colors?.bg_color ?? "#0f172a";
  const textColor = tenant.brand_colors?.name_color ?? "#ffffff";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: `${legalPage.title} - ${tenant.name}` }),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 w-full bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 pt-6 pb-10", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[480px] min-h-[min(80vh,600px)] max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxs(
        "header",
        {
          className: "shrink-0 px-4 py-4 flex items-center gap-4",
          style: { backgroundColor: bgColor, color: textColor },
          children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("tenant.home", { tenant: tenant.slug }),
                className: "flex items-center gap-1.5 text-sm font-medium opacity-90 hover:opacity-100 transition-opacity",
                style: { color: textColor },
                children: [
                  /* @__PURE__ */ jsx(ChevronLeft, { className: "size-5 shrink-0", "aria-hidden": true }),
                  "Volver"
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 flex items-center justify-center gap-3", children: [
              tenant.logo_url ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: tenant.logo_url,
                  alt: "",
                  className: "size-10 rounded-full object-cover border-2 border-white/30 shrink-0"
                }
              ) : null,
              /* @__PURE__ */ jsx("span", { className: "font-bold text-lg truncate", children: tenant.name })
            ] }),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("tenant.home", { tenant: tenant.slug }),
                className: "flex size-10 items-center justify-center rounded-full hover:bg-white/20 transition-colors",
                style: { color: textColor },
                "aria-label": "Cerrar",
                children: /* @__PURE__ */ jsx(X, { className: "size-5" })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs("main", { className: "flex-1 overflow-y-auto px-8 py-6", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-6", children: legalPage.title }),
        legalPage.content ? /* @__PURE__ */ jsx(
          "div",
          {
            className: "legal-content text-slate-700 text-base leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_ul]:space-y-1 [&_ol]:space-y-1 [&_p]:mb-4 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold",
            dangerouslySetInnerHTML: { __html: legalPage.content }
          }
        ) : /* @__PURE__ */ jsx("p", { className: "text-slate-500", children: "Este contenido aún no está disponible." })
      ] })
    ] }) })
  ] });
}
export {
  Show as default
};
