import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Menu, ArrowLeft } from "lucide-react";
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
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}
function Show({ release }) {
  const [menuOpen, setMenuOpen] = useState(false);
  release.hero_url ?? release.cover_url;
  const badge = TYPE_BADGES[release.type] ?? TYPE_BADGES.improvement;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: `${release.title} - Novedades Linkiu` }),
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
            (item) => "isCurrentPage" in item && item.isCurrentPage ? /* @__PURE__ */ jsx("span", { className: currentClass, "aria-current": "page", children: item.label }, item.href) : /* @__PURE__ */ jsx(Link, { href: item.href, className: linkClass, children: item.label }, item.href)
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
      /* @__PURE__ */ jsxs("main", { className: "pb-16 mt-16", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/release-notes",
            className: "inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 mb-16",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
              "Volver a novedades"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("article", { className: "max-w-5xl mx-auto", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            release.category_name && /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-500 dark:text-slate-400", children: release.category_name }),
            /* @__PURE__ */ jsx("span", { className: cn("rounded-full px-2.5 py-0.5 text-xs font-medium", badge.className), children: badge.label })
          ] }),
          /* @__PURE__ */ jsx(
            "time",
            {
              className: "mt-2 block text-sm text-slate-500 dark:text-slate-400",
              dateTime: release.date,
              children: formatDate(release.date)
            }
          ),
          /* @__PURE__ */ jsx("h1", { className: "mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl", children: release.title }),
          release.snippet && /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-slate-600 dark:text-slate-400 text-justify", children: release.snippet }),
          release.body && /* @__PURE__ */ jsx(
            "div",
            {
              className: "mt-8 text-justify prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-slate-900 dark:prose-a:text-slate-100 prose-img:rounded-lg",
              dangerouslySetInnerHTML: { __html: release.body }
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "mt-10 text-xs font-medium text-slate-500 dark:text-slate-500", children: "Linkiu" })
        ] })
      ] })
    ] }) }) })
  ] });
}
export {
  Show as default
};
