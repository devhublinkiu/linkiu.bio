import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import React__default, { useState, useEffect } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import { ChevronRight, ChevronsUpDown, BadgeCheck, Settings2, LogOut, SquareTerminal, Bot, Users, BookOpen, LayoutGrid, LifeBuoy, Bell } from "lucide-react";
import { B as Button } from "./button-BdX_X5dq.js";
import { S as SidebarGroup, a as SidebarMenu, b as SidebarMenuItem, C as Collapsible, c as CollapsibleTrigger, d as SidebarMenuButton, e as CollapsibleContent, f as SidebarMenuSub, g as SidebarMenuSubItem, h as SidebarMenuSubButton, u as useSidebar, D as DropdownMenu, i as DropdownMenuTrigger, A as Avatar, j as AvatarImage, k as AvatarFallback, l as DropdownMenuContent, m as DropdownMenuLabel, n as DropdownMenuSeparator, o as DropdownMenuGroup, p as DropdownMenuItem, q as Sidebar, r as SidebarHeader, s as SidebarContent, t as SidebarFooter, v as SidebarProvider, P as PermissionDeniedModal, w as SidebarInset, x as SidebarTrigger, B as Breadcrumb, y as BreadcrumbList, z as BreadcrumbItem, E as BreadcrumbLink, F as BreadcrumbSeparator, G as BreadcrumbPage, N as NotificationSidebar } from "./dropdown-menu-BCxMx_rd.js";
import { toast } from "sonner";
import { A as ApplicationLogo } from "./ApplicationLogo-xMpxFOcX.js";
function NavMain({
  items
}) {
  return /* @__PURE__ */ jsx(SidebarGroup, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: items.map((item) => /* @__PURE__ */ jsx(SidebarMenuItem, { children: item.items?.length ? /* @__PURE__ */ jsx(Collapsible, { asChild: true, defaultOpen: item.isActive, className: "group/collapsible", children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(SidebarMenuButton, { tooltip: item.title, children: [
      item.icon && /* @__PURE__ */ jsx(item.icon, {}),
      /* @__PURE__ */ jsx("span", { children: item.title }),
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" })
    ] }) }),
    /* @__PURE__ */ jsx(CollapsibleContent, { children: /* @__PURE__ */ jsx(SidebarMenuSub, { children: item.items?.map((subItem) => /* @__PURE__ */ jsx(SidebarMenuSubItem, { children: /* @__PURE__ */ jsx(SidebarMenuSubButton, { asChild: true, children: /* @__PURE__ */ jsx("a", { href: subItem.url, children: /* @__PURE__ */ jsx("span", { children: subItem.title }) }) }) }, subItem.title)) }) })
  ] }) }) : /* @__PURE__ */ jsx(SidebarMenuButton, { asChild: true, tooltip: item.title, children: /* @__PURE__ */ jsxs("a", { href: item.url, children: [
    item.icon && /* @__PURE__ */ jsx(item.icon, {}),
    /* @__PURE__ */ jsx("span", { children: item.title })
  ] }) }) }, item.title)) }) });
}
function NavUser({
  user
}) {
  const { isMobile } = useSidebar();
  return /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      SidebarMenuButton,
      {
        size: "lg",
        className: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground outline-none ring-0 focus:ring-0 focus:outline-none",
        children: [
          /* @__PURE__ */ jsxs(Avatar, { className: "h-8 w-8 rounded-lg", children: [
            /* @__PURE__ */ jsx(AvatarImage, { src: user.avatar, alt: user.name }),
            /* @__PURE__ */ jsx(AvatarFallback, { className: "rounded-lg", children: "CN" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [
            /* @__PURE__ */ jsx("span", { className: "truncate font-medium", children: user.name }),
            /* @__PURE__ */ jsx("span", { className: "truncate text-xs", children: user.email })
          ] }),
          /* @__PURE__ */ jsx(ChevronsUpDown, { className: "ml-auto size-4" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(
      DropdownMenuContent,
      {
        className: "w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg",
        side: isMobile ? "bottom" : "right",
        align: "end",
        sideOffset: 4,
        children: [
          /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "p-0 font-normal", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-1 py-1.5 text-left text-sm", children: [
            /* @__PURE__ */ jsxs(Avatar, { className: "h-8 w-8 rounded-lg", children: [
              /* @__PURE__ */ jsx(AvatarImage, { src: user.avatar, alt: user.name }),
              /* @__PURE__ */ jsx(AvatarFallback, { className: "rounded-lg", children: "CN" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [
              /* @__PURE__ */ jsx("span", { className: "truncate font-medium", children: user.name }),
              /* @__PURE__ */ jsx("span", { className: "truncate text-xs", children: user.email })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxs(DropdownMenuGroup, { children: [
            /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, className: "cursor-pointer outline-none ring-0 focus:ring-0 focus:outline-none", children: /* @__PURE__ */ jsxs("a", { href: "/superlinkiu/profile", children: [
              /* @__PURE__ */ jsx(BadgeCheck, {}),
              "Perfil"
            ] }) }),
            /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, className: "cursor-pointer outline-none ring-0 focus:ring-0 focus:outline-none", children: /* @__PURE__ */ jsxs("a", { href: "/superlinkiu/settings", children: [
              /* @__PURE__ */ jsx(Settings2, {}),
              "Configuración"
            ] }) })
          ] }),
          /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxs(
            DropdownMenuItem,
            {
              className: "cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 hover:text-red-600 outline-none ring-0 focus:ring-0 focus:outline-none",
              onClick: () => router.post(route("logout")),
              children: [
                /* @__PURE__ */ jsx(LogOut, {}),
                "Cerrar Sesión"
              ]
            }
          )
        ]
      }
    )
  ] }) }) });
}
function SuperAdminSidebar({ user, logo, ...props }) {
  const { url } = usePage();
  const navMain = React.useMemo(() => {
    return [
      {
        title: "Dashboard",
        url: "/superlinkiu/dashboard",
        icon: SquareTerminal,
        isActive: url.startsWith("/superlinkiu/dashboard")
      },
      {
        title: "Tenants",
        url: "/superlinkiu/tenants",
        icon: Bot,
        isActive: url.startsWith("/superlinkiu/tenants")
      },
      {
        title: "Usuarios",
        url: "/superlinkiu/users",
        icon: Users,
        isActive: url.startsWith("/superlinkiu/users")
      },
      {
        title: "Facturación",
        url: "#",
        icon: BookOpen,
        isActive: url.startsWith("/superlinkiu/plans") || url.startsWith("/superlinkiu/subscriptions") || url.startsWith("/superlinkiu/payments"),
        items: [
          {
            title: "Planes",
            url: "/superlinkiu/plans"
          },
          {
            title: "Suscripciones",
            url: "/superlinkiu/subscriptions"
          },
          {
            title: "Pagos",
            url: "/superlinkiu/payments"
          }
        ]
      },
      {
        title: "Contenido",
        url: "#",
        icon: LayoutGrid,
        isActive: url.startsWith("/superlinkiu/categories") || url.startsWith("/superlinkiu/category-icons") || url.startsWith("/superlinkiu/support/requests") || url.startsWith("/superlinkiu/media"),
        items: [
          {
            title: "Categorías de negocio",
            url: "/superlinkiu/categories"
          },
          {
            title: "Categorías e Iconos",
            url: "/superlinkiu/category-icons"
          },
          {
            title: "Solicitudes de iconos",
            url: "/superlinkiu/support/requests"
          },
          {
            title: "Mis archivos",
            url: "/superlinkiu/media"
          }
        ]
      },
      {
        title: "Atención",
        url: "#",
        icon: LifeBuoy,
        isActive: url.startsWith("/superlinkiu/support") && !url.startsWith("/superlinkiu/support/requests") || url.startsWith("/superlinkiu/reportes-tiendas"),
        items: [
          {
            title: "Tickets de Soporte",
            url: "/superlinkiu/support"
          },
          {
            title: "Reportes tiendas",
            url: "/superlinkiu/reportes-tiendas"
          }
        ]
      },
      {
        title: "Configuración",
        url: "#",
        icon: Settings2,
        isActive: url.startsWith("/superlinkiu/roles") || url.startsWith("/superlinkiu/settings"),
        items: [
          {
            title: "Ajustes generales",
            url: "/superlinkiu/settings"
          },
          {
            title: "Roles y Permisos",
            url: "/superlinkiu/roles"
          }
        ]
      }
    ];
  }, [url]);
  return /* @__PURE__ */ jsxs(Sidebar, { variant: "inset", ...props, children: [
    /* @__PURE__ */ jsx(SidebarHeader, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, { size: "lg", asChild: true, className: "group-data-[state=expanded]:bg-transparent group-data-[state=expanded]:hover:bg-transparent ring-0 group-data-[state=expanded]:h-14 group-data-[state=expanded]:p-4 group-data-[state=expanded]:pl-8", children: /* @__PURE__ */ jsxs("a", { href: "/superlinkiu/dashboard", children: [
      /* @__PURE__ */ jsx("div", { className: "flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground group-data-[state=expanded]:hidden", children: /* @__PURE__ */ jsx(ApplicationLogo, { className: "size-6" }) }),
      /* @__PURE__ */ jsx("div", { className: "hidden group-data-[state=expanded]:block", children: logo?.url ? /* @__PURE__ */ jsx(
        "img",
        {
          src: logo.url,
          alt: logo.name || "Logo",
          className: "h-8 w-auto object-contain max-w-[200px]"
        }
      ) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-bold text-xl tracking-tight text-sidebar-foreground", children: [
        /* @__PURE__ */ jsx("div", { className: "h-8 w-8 flex items-center justify-center bg-primary p-1.5 rounded-lg", children: /* @__PURE__ */ jsx(ApplicationLogo, { className: "size-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsx("span", { children: logo?.name || "Linkiu.bio" })
      ] }) })
    ] }) }) }) }) }),
    /* @__PURE__ */ jsx(SidebarContent, { children: /* @__PURE__ */ jsx(NavMain, { items: navMain }) }),
    /* @__PURE__ */ jsx(SidebarFooter, { children: /* @__PURE__ */ jsx(NavUser, { user: {
      name: user.name,
      email: user.email,
      avatar: user.profile_photo_url || `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`
    } }) })
  ] });
}
function SuperAdminLayout({ children, header, breadcrumbs }) {
  const { auth, flash, site_settings } = usePage().props;
  const user = auth.user;
  auth.permissions || [];
  const [unreadCount, setUnreadCount] = useState(auth.notifications?.unread_count || 0);
  const [recentNotifications, setRecentNotifications] = useState(auth.notifications?.recent || []);
  const [newTenantsCount, setNewTenantsCount] = useState(0);
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  useEffect(() => {
    if (auth.notifications) {
      setUnreadCount(auth.notifications.unread_count);
      setRecentNotifications(auth.notifications.recent);
    }
  }, [auth.notifications]);
  const handleNotificationRead = (id) => {
    setRecentNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read_at: (/* @__PURE__ */ new Date()).toISOString() } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };
  const handleAllRead = () => {
    setRecentNotifications((prev) => prev.map((n) => ({ ...n, read_at: (/* @__PURE__ */ new Date()).toISOString() })));
    setUnreadCount(0);
  };
  useEffect(() => {
    if (window.Echo) {
      console.log("[Echo] Subscribing to superadmin-updates channel...");
      window.Echo.channel("superadmin-updates").listen(".tenant.created", (e) => {
        console.log("[Echo] Received .tenant.created event:", e);
        toast.info(`¡Nueva tienda registrada!`, {
          description: e.message
        });
        setNewTenantsCount((prev) => prev + 1);
        setUnreadCount((prev) => prev + 1);
        const newNotification = {
          id: Math.random().toString(),
          // Temp ID for list key
          data: {
            ...e,
            // Spread all properties (message, owner_email, plan_name, etc.)
            type: "tenant_created"
          },
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          read_at: null
        };
        setRecentNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);
      }).listen(".ticket.created", (e) => {
        console.log("[Echo] Received .ticket.created event:", e);
        toast.info("¡Nuevo ticket de soporte!", {
          description: e.message,
          action: {
            label: "Ver",
            onClick: () => window.location.href = e.url
          }
        });
        setUnreadCount((prev) => prev + 1);
        const newNotification = {
          id: Math.random().toString(),
          data: {
            ...e,
            type: "ticket_created"
          },
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          read_at: null
        };
        setRecentNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);
      }).listen(".ticket.replied", (e) => {
        console.log("[Echo] Received .ticket.replied event:", e);
        toast.info("Nueva respuesta en ticket", {
          description: e.message,
          action: {
            label: "Ver",
            onClick: () => window.location.href = e.url
          }
        });
        setUnreadCount((prev) => prev + 1);
        const newNotification = {
          id: Math.random().toString(),
          data: {
            ...e,
            type: "ticket_replied"
          },
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          read_at: null
        };
        setRecentNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);
      }).listen(".ticket.assigned", (e) => {
        console.log("[Echo] Received .ticket.assigned event:", e);
        toast.success("Ticket asignado", {
          description: e.message,
          action: {
            label: "Ver",
            onClick: () => window.location.href = e.url
          }
        });
        setUnreadCount((prev) => prev + 1);
        const newNotification = {
          id: Math.random().toString(),
          data: {
            ...e,
            type: "ticket_assigned"
          },
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          read_at: null
        };
        setRecentNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);
      }).listen(".payment.reported", (e) => {
        console.log("[Echo] Received .payment.reported event:", e);
        toast.success(`¡Nuevo pago reportado!`, {
          description: e.message
        });
        setUnreadCount((prev) => prev + 1);
        const newNotification = {
          id: Math.random().toString(),
          data: {
            message: e.message,
            type: "payment_reported",
            url: e.url
          },
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          read_at: null
        };
        setRecentNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);
      }).listen(".icon.requested", (e) => {
        console.log("[Echo] Received .icon.requested event:", e);
        toast.info(`¡Nueva solicitud de icono!`, {
          description: e.message
        });
        setUnreadCount((prev) => prev + 1);
        const newNotification = {
          id: Math.random().toString(),
          data: {
            message: e.message,
            type: "icon_requested",
            url: e.url
          },
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          read_at: null
        };
        setRecentNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);
      });
      console.log("[Echo] Listeners attached to superadmin-updates");
      if (window.Echo.connector.ably.connection.state === "connected") {
        console.log("[Echo] Status: Connected");
      } else {
        console.log("[Echo] Status:", window.Echo.connector.ably.connection.state);
        window.Echo.connector.ably.connection.on("connected", () => console.log("[Echo] Connected!"));
      }
      if (window.Echo.connector.ably.channels.get("superadmin-updates")) {
        window.Echo.connector.ably.channels.get("superadmin-updates").subscribe((msg) => {
          console.log("[Ably Raw] Message received:", msg.name, msg.data);
        });
      }
    } else {
      console.warn("[Echo] window.Echo not available");
    }
  }, []);
  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success);
    }
    if (flash.error) {
      toast.error(flash.error);
    }
  }, [flash]);
  return /* @__PURE__ */ jsxs(SidebarProvider, { children: [
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    ),
    /* @__PURE__ */ jsx(SuperAdminSidebar, { user, logo: { url: site_settings?.logo_url || null, name: site_settings?.app_name || "Linkiu" } }),
    /* @__PURE__ */ jsxs(SidebarInset, { children: [
      /* @__PURE__ */ jsxs("header", { className: "bg-background/80 backdrop-blur-md rounded-t-3xl border-b border-border h-12 flex items-center justify-between px-4 sticky top-0 z-30 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(SidebarTrigger, { className: "-ml-1 md:hidden" }),
          /* @__PURE__ */ jsx(Breadcrumb, { children: /* @__PURE__ */ jsxs(BreadcrumbList, { children: [
            /* @__PURE__ */ jsx(BreadcrumbItem, { className: "hidden md:block", children: /* @__PURE__ */ jsx(BreadcrumbLink, { asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("superadmin.dashboard"), children: "SuperLinkiu" }) }) }),
            /* @__PURE__ */ jsx(BreadcrumbSeparator, { className: "hidden md:block" }),
            breadcrumbs ? breadcrumbs.map((item, index) => /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
              /* @__PURE__ */ jsx(BreadcrumbItem, { children: item.href ? /* @__PURE__ */ jsx(BreadcrumbLink, { asChild: true, children: /* @__PURE__ */ jsx(Link, { href: item.href, children: item.label }) }) : /* @__PURE__ */ jsx(BreadcrumbPage, { children: item.label }) }),
              index < breadcrumbs.length - 1 && /* @__PURE__ */ jsx(BreadcrumbSeparator, {})
            ] }, index)) : /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbPage, { children: header }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "relative text-muted-foreground hover:text-foreground",
              onClick: () => setIsNotificationSidebarOpen(true),
              children: [
                /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5" }),
                unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full animate-pulse ring-2 ring-background" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            NotificationSidebar,
            {
              open: isNotificationSidebarOpen,
              onOpenChange: setIsNotificationSidebarOpen,
              notifications: recentNotifications,
              onNotificationRead: handleNotificationRead,
              onAllRead: handleAllRead
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 p-4 md:px-8 overflow-auto", children }),
      /* @__PURE__ */ jsx("footer", { className: "border-t border-border bg-background px-6 py-2 text-center rounded-b-3xl", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center p-4 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "© 2026 ",
          /* @__PURE__ */ jsx("strong", { children: "Linkiu.bio" }),
          ". Todos los derechos reservados."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mt-2 md:mt-0", children: [
          /* @__PURE__ */ jsx("span", { children: "v1.0.0 (Beta)" }),
          /* @__PURE__ */ jsx("span", { className: "h-3 w-px bg-border" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-foreground", children: "Soporte" })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  SuperAdminLayout as S
};
