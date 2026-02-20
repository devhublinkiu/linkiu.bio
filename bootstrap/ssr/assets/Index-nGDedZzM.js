import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Menu } from "lucide-react";
import { S as Sheet, a as SheetTrigger, b as SheetContent } from "./sheet-BFMMArVC.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { c as cn } from "./utils-B0hQsrDj.js";
import "@radix-ui/react-dialog";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
const NAV_LINKS = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#funciones", label: "Funciones" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#tutoriales", label: "Tutoriales" },
  { href: "/#blogs", label: "Blogs" },
  { href: "/release-notes", label: "Release Notes", isCurrentPage: true },
  { href: "/#contacto", label: "Contacto" }
];
const linkClass = "rounded-md px-3 py-2 text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100";
const currentClass = "rounded-md px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100";
const btnClass = "rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100";
const TYPE_BADGES = {
  new: { label: "Nuevo", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" },
  fix: { label: "Corrección", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
  improvement: { label: "Mejora", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" },
  security: { label: "Seguridad", className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" },
  performance: { label: "Rendimiento", className: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300" }
};
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long" });
}
function Index({ categories, releases }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const filtered = activeCategory === "all" ? releases : releases.filter((r) => r.category_id === activeCategory);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Novedades - Linkiu" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100", children: /* @__PURE__ */ jsx("div", { className: "relative flex min-h-screen flex-col", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-6xl px-4 mx-auto sm:px-6 lg:max-w-7xl lg:px-8", children: [
      /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-4 py-6 lg:py-8", children: [
        /* @__PURE__ */ jsx(Link, { href: "/", className: "shrink-0", "aria-label": "Linkiu inicio", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "/logo_nav_web_linkiu.svg",
            alt: "Linkiu",
            className: "h-8 w-auto dark:invert"
          }
        ) }),
        /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex flex-wrap items-center gap-1 lg:gap-2", children: [
          NAV_LINKS.map(
            (item) => "isCurrentPage" in item && item.isCurrentPage ? /* @__PURE__ */ jsx(
              "span",
              {
                className: currentClass,
                "aria-current": "page",
                children: item.label
              },
              item.href
            ) : /* @__PURE__ */ jsx(
              Link,
              {
                href: item.href,
                className: linkClass,
                children: item.label
              },
              item.href
            )
          ),
          /* @__PURE__ */ jsx(Link, { href: route("register.tenant"), className: cn(btnClass, "ml-2"), children: "Regístrate gratis" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex md:hidden items-center gap-2", children: [
          /* @__PURE__ */ jsx(Link, { href: route("register.tenant"), className: btnClass, children: "Regístrate gratis" }),
          /* @__PURE__ */ jsxs(Sheet, { open: menuOpen, onOpenChange: setMenuOpen, children: [
            /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "shrink-0", "aria-label": "Abrir menú", children: /* @__PURE__ */ jsx(Menu, { className: "size-6" }) }) }),
            /* @__PURE__ */ jsx(SheetContent, { side: "right", className: "w-full max-w-xs flex flex-col gap-2 pt-10", children: NAV_LINKS.map(
              (item) => "isCurrentPage" in item && item.isCurrentPage ? /* @__PURE__ */ jsx("span", { className: cn(linkClass, "font-medium"), "aria-current": "page", children: item.label }, item.href) : /* @__PURE__ */ jsx(
                Link,
                {
                  href: item.href,
                  className: linkClass,
                  onClick: () => setMenuOpen(false),
                  children: item.label
                },
                item.href
              )
            ) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("main", { className: "pb-16", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl", children: "Novedades" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-slate-600 dark:text-slate-400", children: "Actualizaciones, mejoras y novedades de Linkiu." }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4", children: categories.map((cat) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setActiveCategory(cat.id),
            className: cn(
              "rounded-md px-4 py-2 text-sm font-medium transition",
              activeCategory === cat.id ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            ),
            children: cat.name
          },
          cat.id
        )) }),
        /* @__PURE__ */ jsx("div", { className: "mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3", children: filtered.map((release) => /* @__PURE__ */ jsxs(
          Link,
          {
            href: `/release-notes/${release.slug}`,
            className: "group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 transition hover:shadow-md",
            children: [
              /* @__PURE__ */ jsx("div", { className: "aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800", children: release.cover_url ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: release.cover_url,
                  alt: "",
                  className: "h-full w-full object-cover transition group-hover:scale-[1.02]"
                }
              ) : /* @__PURE__ */ jsx(
                "div",
                {
                  className: "h-full w-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800",
                  "aria-hidden": true
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col p-5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-slate-500 dark:text-slate-400", children: categories.find((c) => c.id === release.category_id)?.name ?? release.category_id }),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        TYPE_BADGES[release.type]?.className ?? TYPE_BADGES.improvement.className
                      ),
                      children: TYPE_BADGES[release.type]?.label ?? release.type
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "time",
                  {
                    className: "mt-2 block text-sm text-slate-500 dark:text-slate-400",
                    dateTime: release.date,
                    children: formatDate(release.date)
                  }
                ),
                /* @__PURE__ */ jsx("h2", { className: "mt-2 text-lg font-bold leading-snug text-slate-900 dark:text-white", children: release.title }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400", children: release.snippet }),
                /* @__PURE__ */ jsx("p", { className: "mt-4 text-xs font-medium text-slate-500 dark:text-slate-500", children: "Linkiu" })
              ] })
            ]
          },
          release.id
        )) }),
        filtered.length === 0 && /* @__PURE__ */ jsx("p", { className: "mt-12 text-center text-slate-500 dark:text-slate-400", children: "No hay publicaciones en esta categoría." })
      ] })
    ] }) }) })
  ] });
}
export {
  Index as default
};
