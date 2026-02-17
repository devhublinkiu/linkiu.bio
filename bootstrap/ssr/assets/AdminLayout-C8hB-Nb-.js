import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, Fragment } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { toast } from "sonner";
import { BadgeCheck, Lock, ChevronRight, Sparkles, ExternalLink, LifeBuoy, ChevronDown, Bug, Headphones, Bell, User, Settings, Shield, LogOut } from "lucide-react";
import { c as cn } from "./utils-B0hQsrDj.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { C as Card, d as CardContent } from "./card-BaovBWX5.js";
import { P as Progress } from "./progress-BW8YadT0.js";
import { q as Sidebar, P as PermissionDeniedModal, r as SidebarHeader, s as SidebarContent, S as SidebarGroup, a as SidebarMenu, C as Collapsible, b as SidebarMenuItem, c as CollapsibleTrigger, d as SidebarMenuButton, e as CollapsibleContent, f as SidebarMenuSub, g as SidebarMenuSubItem, h as SidebarMenuSubButton, t as SidebarFooter, x as SidebarTrigger, B as Breadcrumb, y as BreadcrumbList, z as BreadcrumbItem, E as BreadcrumbLink, F as BreadcrumbSeparator, G as BreadcrumbPage, D as DropdownMenu, i as DropdownMenuTrigger, l as DropdownMenuContent, p as DropdownMenuItem, n as DropdownMenuSeparator, A as Avatar, j as AvatarImage, k as AvatarFallback, m as DropdownMenuLabel, o as DropdownMenuGroup, N as NotificationSidebar, v as SidebarProvider, w as SidebarInset } from "./dropdown-menu-B2I3vWlQ.js";
import { V as VERTICAL_CONFIG, c as MODULE_CHILDREN, d as VERTICAL_FEATURES, e as MODULE_ICONS, f as MODULE_ROUTES, a as MODULE_LABELS } from "./menuConfig-rtCrEhXP.js";
import { S as Separator } from "./separator-DbxqJzR0.js";
import { T as Toaster } from "./sonner-ZUDSQr7N.js";
const MODULE_PERMISSIONS = {
  "dashboard": "dashboard.view",
  "orders": "orders.view",
  "categories": "categories.view",
  "products": "products.view",
  "product_drop": "products.view",
  "variables": "products.view",
  "files": "media.view",
  "sliders": "sliders.view",
  "inventory": "inventory.view",
  "linkiupay": "billing.view",
  "buildiu": "buildiu.view",
  "whatsapp": "whatsapp.view",
  "linkiulab": "linkiulab.view",
  "integrations": "integrations.view",
  "shipping": "shipping_zones.view",
  "support": "support.view",
  "services": "services.view",
  "agenda": "agenda.view",
  "appointments": "appointments.view",
  "customers": "customers.view",
  "team": "users.view",
  "reviews": "reviews.view",
  "payment_methods": "payment_methods.view",
  "coupons": "coupons.view",
  "tickers": "tickers.view",
  "locations": "locations.view",
  "settings": "settings.view",
  "roles": "roles.view",
  "profile": "profile.view",
  "subscription": "billing.view",
  "billing": "billing.view",
  "linkiu_pos": "pos.view",
  "digital_menu": "products.view",
  "tables": "tables.view",
  "reservations": "reservations.view",
  "kitchen": "kitchen.view",
  "waiters": "waiters.view",
  "statistics": "statistics.view",
  "logout": "dashboard.view"
  // Any auth user can logout
};
function AdminSidebar(props) {
  const { auth, currentTenant, currentUserRole } = usePage().props;
  const [showPermissionModal, setShowPermissionModal] = React.useState(false);
  const checkPermission = (moduleKey) => {
    const permission = MODULE_PERMISSIONS[moduleKey];
    if (!permission) return true;
    if (!currentUserRole) return false;
    if (currentUserRole.is_owner) return true;
    return currentUserRole.permissions.includes("*") || currentUserRole.permissions.includes(permission);
  };
  const handleNavigation = (e, moduleKey, isLocked) => {
    if (!checkPermission(moduleKey)) {
      e.preventDefault();
      e.stopPropagation();
      setShowPermissionModal(true);
      return false;
    }
    if (isLocked) {
      e.preventDefault();
      e.stopPropagation();
      if (!checkPermission("billing")) {
        setShowPermissionModal(true);
        return false;
      }
      router.get(route("tenant.subscription.index", { tenant: currentTenant.slug }));
      return false;
    }
    return true;
  };
  const rawSlug = currentTenant?.vertical?.slug?.toLowerCase() || "default";
  const verticalSlug = rawSlug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const modulesList = VERTICAL_CONFIG[verticalSlug] || VERTICAL_CONFIG["default"];
  const dynamicItems = modulesList.map((moduleKey) => {
    const icon = MODULE_ICONS[moduleKey] || MODULE_ICONS["dashboard"];
    let children = MODULE_CHILDREN[moduleKey];
    const features = VERTICAL_FEATURES[verticalSlug];
    if (features && children && moduleKey === "integrations") {
      children = children.filter((child) => {
        const featureKey = `integration_${child.label.toLowerCase().replace("é", "e")}`;
        return features[featureKey] === true;
      });
    }
    return {
      label: MODULE_LABELS[moduleKey] || moduleKey,
      route: MODULE_ROUTES[moduleKey] || "#",
      icon,
      key: moduleKey,
      children
    };
  });
  const isLockedItem = (itemKey) => {
    const planFeatures = currentTenant?.latest_subscription?.plan?.features;
    let configObject = {};
    if (Array.isArray(planFeatures)) {
      const found = planFeatures.find((f) => typeof f === "object" && !Array.isArray(f));
      if (found) configObject = found;
    } else if (typeof planFeatures === "object" && planFeatures !== null) {
      configObject = planFeatures;
    }
    return configObject[itemKey] === false;
  };
  return /* @__PURE__ */ jsxs(Sidebar, { variant: "inset", ...props, children: [
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    ),
    /* @__PURE__ */ jsx(SidebarHeader, { children: /* @__PURE__ */ jsx("div", { className: "px-2 py-2 group-data-[state=collapsed]:hidden", children: /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "w-full justify-center gap-2 py-2 border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100/50", children: [
      /* @__PURE__ */ jsx(BadgeCheck, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: "Tienda Verificada" })
    ] }) }) }),
    /* @__PURE__ */ jsx(SidebarContent, { children: /* @__PURE__ */ jsx(SidebarGroup, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: dynamicItems.map((item) => {
      const isLocked = isLockedItem(item.key);
      const isActive = item.route !== "#" && route().current(item.route);
      const hasChildren = item.children && item.children.length > 0;
      const hasPermission = checkPermission(item.key);
      return /* @__PURE__ */ jsx(React.Fragment, { children: hasChildren ? /* @__PURE__ */ jsx(Collapsible, { asChild: true, defaultOpen: isActive, className: "group/collapsible", children: /* @__PURE__ */ jsxs(SidebarMenuItem, { children: [
        /* @__PURE__ */ jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
          SidebarMenuButton,
          {
            tooltip: item.label,
            isActive,
            onClick: (e) => handleNavigation(e, item.key, isLocked),
            children: [
              /* @__PURE__ */ jsx(item.icon, { className: cn(!hasPermission && "text-red-500") }),
              /* @__PURE__ */ jsx("span", { className: cn(!hasPermission && "text-red-600 font-medium"), children: item.label }),
              !hasPermission ? /* @__PURE__ */ jsx(Lock, { className: "ml-auto h-3.5 w-3.5 text-red-500 animate-pulse" }) : isLocked ? /* @__PURE__ */ jsx(Badge, { className: "ml-auto h-5 px-1.5 text-[10px] font-bold bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100", children: "PRO" }) : /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(CollapsibleContent, { children: /* @__PURE__ */ jsx(SidebarMenuSub, { children: item.children?.map((child) => /* @__PURE__ */ jsx(SidebarMenuSubItem, { children: /* @__PURE__ */ jsx(SidebarMenuSubButton, { asChild: true, children: /* @__PURE__ */ jsxs(
          Link,
          {
            href: !hasPermission ? "#" : isLocked ? route("tenant.subscription.index", { tenant: currentTenant.slug }) : child.route === "#" ? "#" : route(child.route, { tenant: currentTenant.slug }),
            onClick: (e) => handleNavigation(e, item.key, isLocked),
            children: [
              /* @__PURE__ */ jsx("span", { children: child.label }),
              !hasPermission ? /* @__PURE__ */ jsx(Lock, { className: "ml-auto h-3 w-3 text-red-500" }) : isLocked && /* @__PURE__ */ jsx(Badge, { className: "ml-auto h-4 px-1 text-[9px] font-bold bg-amber-100 text-amber-700 border-amber-200", children: "PRO" })
            ]
          }
        ) }) }, child.label)) }) })
      ] }) }) : /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(
        SidebarMenuButton,
        {
          asChild: true,
          tooltip: item.label,
          isActive,
          onClick: (e) => handleNavigation(e, item.key, isLocked),
          children: /* @__PURE__ */ jsxs(Link, { href: !hasPermission ? "#" : isLocked ? route("tenant.subscription.index", { tenant: currentTenant.slug }) : item.route === "#" ? "#" : route(item.route, { tenant: currentTenant.slug }), children: [
            /* @__PURE__ */ jsx(item.icon, { className: cn(!hasPermission && "text-red-500") }),
            /* @__PURE__ */ jsx("span", { className: cn(!hasPermission && "text-red-600 font-medium"), children: item.label }),
            !hasPermission ? /* @__PURE__ */ jsx(Lock, { className: "ml-auto h-3.5 w-3.5 text-red-500" }) : isLocked && /* @__PURE__ */ jsx(Badge, { className: "ml-auto h-5 px-1.5 text-[10px] font-bold bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100", children: "PRO" })
          ] })
        }
      ) }) }, item.key);
    }) }) }) }),
    /* @__PURE__ */ jsx(SidebarFooter, { children: currentTenant?.latest_subscription && /* @__PURE__ */ jsxs("div", { className: "p-2", children: [
      /* @__PURE__ */ jsx(Card, { className: "group-data-[state=collapsed]:hidden border-purple-200/50 bg-gradient-to-br from-purple-50 via-white to-blue-50", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-purple-100 text-purple-700 hover:bg-purple-200", children: currentTenant.latest_subscription.plan?.name || "Pro" }),
          /* @__PURE__ */ jsx(
            Badge,
            {
              variant: "outline",
              className: cn(
                currentTenant.latest_subscription.days_remaining <= 3 && "border-red-200 text-red-600"
              ),
              children: currentTenant.latest_subscription.status === "trialing" ? `${currentTenant.latest_subscription.trial_days_remaining} días` : `${currentTenant.latest_subscription.days_remaining} días`
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Progress, { value: Math.max(5, currentTenant.latest_subscription.percent_completed) }),
        /* @__PURE__ */ jsx(Button, { asChild: true, className: "w-full", children: /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("tenant.subscription.index", { tenant: currentTenant.slug }),
            onClick: (e) => handleNavigation(e, "subscription", false),
            children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "mr-2 h-4 w-4" }),
              "Ver planes"
            ]
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "hidden group-data-[state=collapsed]:flex justify-center", children: /* @__PURE__ */ jsx(Link, { href: route("tenant.subscription.index", { tenant: currentTenant.slug }), children: /* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5 text-purple-500" }) }) })
    ] }) })
  ] });
}
function AdminNavbar({ title, breadcrumbs }) {
  const { auth, currentTenant, currentUserRole } = usePage().props;
  const user = auth?.user;
  usePage().url;
  currentUserRole?.label || "Miembro";
  currentUserRole?.is_owner;
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const canAccess = (permission) => {
    if (!currentUserRole) return false;
    if (currentUserRole.is_owner) return true;
    return currentUserRole.permissions.includes(permission) || currentUserRole.permissions.includes("*");
  };
  const handleRestrictedClick = (e, permission) => {
    if (!canAccess(permission)) {
      e.preventDefault();
      setShowPermissionModal(true);
    }
  };
  const [baseUrl, setBaseUrl] = useState("");
  useEffect(() => {
    setBaseUrl(window.location.host);
  }, []);
  const storeUrl = currentTenant ? `${baseUrl}/${currentTenant.slug}` : baseUrl;
  const [unreadCount, setUnreadCount] = useState(auth?.notifications?.unread_count || 0);
  const [recentNotifications, setRecentNotifications] = useState(auth?.notifications?.recent || []);
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);
  useEffect(() => {
    if (auth?.notifications) {
      setUnreadCount(auth.notifications.unread_count);
      setRecentNotifications(auth.notifications.recent);
    }
  }, [auth?.notifications]);
  useEffect(() => {
    if (window.Echo && currentTenant?.id) {
      window.Echo.channel(`tenant-updates.${currentTenant.id}`).listen(".invoice.generated", (e) => {
        toast.info(`¡Nueva factura generada!`, {
          description: e.message
        });
        setUnreadCount((prev) => prev + 1);
        const newNotification = {
          id: Math.random().toString(),
          data: {
            message: e.message,
            type: "invoice_generated",
            url: e.url
          },
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          read_at: null
        };
        setRecentNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);
      }).listen(".payment.status_updated", (e) => {
        const isPaid = e.status === "paid";
        if (isPaid) {
          toast.success("¡Pago Aprobado!", { description: e.message });
        } else {
          toast.error("Pago Rechazado", { description: e.message });
        }
        setUnreadCount((prev) => prev + 1);
        const newNotification = {
          id: Math.random().toString(),
          data: {
            message: e.message,
            type: "payment_status_updated",
            url: e.url
            // Link to invoice
          },
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          read_at: null
        };
        setRecentNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);
      }).listen(".icon.status_updated", (e) => {
        const isApproved = e.status === "approved";
        if (isApproved) {
          toast.success("¡Icono Aprobado!", { description: e.message });
        } else {
          toast.error("Icono Rechazado", { description: e.message });
        }
        setUnreadCount((prev) => prev + 1);
        const newNotification = {
          id: Math.random().toString(),
          data: {
            message: e.message,
            type: "icon_status_updated",
            url: e.url
          },
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          read_at: null
        };
        setRecentNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);
      }).listen(".ticket.replied", (e) => {
        if (e.is_staff) {
          toast.info("Nueva respuesta de soporte", {
            description: e.message,
            action: {
              label: "Ver",
              onClick: () => window.location.href = route("tenant.support.show", {
                tenant: currentTenant.slug,
                support: e.ticket_id
              })
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
        }
      }).listen(".ticket.assigned", (e) => {
        console.log("[Echo] Received .ticket.assigned event:", e);
        toast.success("Ticket asignado", {
          description: e.message,
          action: {
            label: "Ver",
            onClick: () => window.location.href = route("tenant.support.show", {
              tenant: currentTenant.slug,
              support: e.ticket_id
            })
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
      });
    }
  }, [currentTenant?.id]);
  const handleNotificationRead = (id) => {
    setRecentNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read_at: (/* @__PURE__ */ new Date()).toISOString() } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };
  const handleAllRead = () => {
    setRecentNotifications((prev) => prev.map((n) => ({ ...n, read_at: (/* @__PURE__ */ new Date()).toISOString() })));
    setUnreadCount(0);
  };
  return /* @__PURE__ */ jsxs("header", { className: "h-14 bg-white/80 backdrop-blur-md border-b sticky top-0 z-40 transition-all duration-300", children: [
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "h-full px-4 sm:px-8 flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(SidebarTrigger, { className: "-ml-1 md:hidden" }),
        /* @__PURE__ */ jsx(Breadcrumb, { children: /* @__PURE__ */ jsxs(BreadcrumbList, { children: [
          /* @__PURE__ */ jsx(BreadcrumbItem, { className: "hidden md:block", children: /* @__PURE__ */ jsx(BreadcrumbLink, { asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("tenant.dashboard", { tenant: currentTenant.slug }), children: "Panel" }) }) }),
          /* @__PURE__ */ jsx(BreadcrumbSeparator, { className: "hidden md:block" }),
          breadcrumbs ? breadcrumbs.map((item, index) => /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(BreadcrumbItem, { children: item.href ? /* @__PURE__ */ jsx(BreadcrumbLink, { asChild: true, children: /* @__PURE__ */ jsx(Link, { href: item.href, children: item.label }) }) : /* @__PURE__ */ jsx(BreadcrumbPage, { children: item.label }) }),
            index < breadcrumbs.length - 1 && /* @__PURE__ */ jsx(BreadcrumbSeparator, {})
          ] }, index)) : /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbPage, { children: title }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-4", children: [
        /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs("a", { href: currentTenant ? `//${storeUrl}` : "#", target: "_blank", rel: "noopener noreferrer", children: [
          /* @__PURE__ */ jsx(ExternalLink, {}),
          "Ver Tienda"
        ] }) }),
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, className: "cursor-pointer ring-0 focus:ring-0 focus:outline-none", children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", children: [
            /* @__PURE__ */ jsx(LifeBuoy, {}),
            "Ayuda",
            /* @__PURE__ */ jsx(ChevronDown, {})
          ] }) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
            /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "cursor-pointer ring-0 focus:ring-0 focus:outline-none", children: [
              /* @__PURE__ */ jsx(Bug, { className: "w-4 h-4 text-rose-500" }),
              "Reportar error"
            ] }),
            /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "cursor-pointer ring-0 focus:ring-0 focus:outline-none", children: [
              /* @__PURE__ */ jsx(LifeBuoy, { className: "w-4 h-4 text-amber-500" }),
              "Tutoriales"
            ] }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "cursor-pointer ring-0 focus:ring-0 focus:outline-none", children: [
              /* @__PURE__ */ jsx(Headphones, { className: "w-4 h-4" }),
              "Hablar con asesor"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-6 hidden sm:block" }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "relative text-muted-foreground hover:text-foreground",
            onClick: () => setIsNotificationSidebarOpen(true),
            children: [
              /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5" }),
              unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, className: "outline-none ring-0", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "relative h-8 w-8 rounded-full", children: /* @__PURE__ */ jsxs(Avatar, { className: "h-8 w-8", children: [
            /* @__PURE__ */ jsx(AvatarImage, { src: user?.profile_photo_url, alt: user?.name }),
            /* @__PURE__ */ jsx(AvatarFallback, { children: user?.name?.charAt(0) })
          ] }) }) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { className: "w-56", align: "end", forceMount: true, children: [
            /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "font-normal border-b pb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold leading-none", children: user?.name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs leading-none text-muted-foreground", children: user?.email }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "w-fit text-[10px] py-0", children: currentUserRole?.label || "Linkiu Member" })
            ] }) }),
            /* @__PURE__ */ jsxs(DropdownMenuGroup, { className: "py-1", children: [
              /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, className: "cursor-pointer ring-0 focus:ring-0 focus:outline-none", children: /* @__PURE__ */ jsxs(
                Link,
                {
                  href: currentTenant ? route("tenant.profile.edit", { tenant: currentTenant.slug }) : "#",
                  onClick: (e) => handleRestrictedClick(e, "profile.view"),
                  children: [
                    /* @__PURE__ */ jsx(User, { className: "mr-3 h-4 w-4 text-slate-400" }),
                    /* @__PURE__ */ jsx("span", { children: "Mi Perfil" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, className: "cursor-pointer ring-0 focus:ring-0 focus:outline-none", children: /* @__PURE__ */ jsxs(
                Link,
                {
                  href: currentTenant ? route("tenant.settings.edit", { tenant: currentTenant.slug }) : "#",
                  onClick: (e) => handleRestrictedClick(e, "settings.view"),
                  children: [
                    /* @__PURE__ */ jsx(Settings, { className: "mr-3 h-4 w-4 text-slate-400" }),
                    /* @__PURE__ */ jsx("span", { children: "Configuración" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, className: "cursor-pointer ring-0 focus:ring-0 focus:outline-none", children: /* @__PURE__ */ jsxs(
                Link,
                {
                  href: currentTenant ? route("tenant.roles.index", { tenant: currentTenant.slug }) : "#",
                  onClick: (e) => handleRestrictedClick(e, "roles.view"),
                  children: [
                    /* @__PURE__ */ jsx(Shield, { className: "mr-3 h-4 w-4 text-slate-400" }),
                    /* @__PURE__ */ jsx("span", { children: "Roles y Permisos" })
                  ]
                }
              ) })
            ] }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "bg-slate-50" }),
            /* @__PURE__ */ jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsx(
              DropdownMenuItem,
              {
                asChild: true,
                className: "cursor-pointer ring-0 focus:ring-0 focus:outline-none text-destructive focus:text-destructive",
                children: /* @__PURE__ */ jsxs(Link, { href: currentTenant ? route("tenant.logout", { tenant: currentTenant.slug }) : "#", method: "post", as: "button", className: "w-full text-left", children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "mr-3 h-4 w-4" }),
                  "Cerrar Sesión"
                ] })
              }
            ) })
          ] })
        ] })
      ] })
    ] }),
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
  ] });
}
function AdminFooter() {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsx("footer", { className: "py-6 px-8 bg-white border-t border-slate-100 rounded-b-3xl", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-medium text-slate-500", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "© ",
        currentYear
      ] }),
      /* @__PURE__ */ jsx(Link, { href: "/", className: "font-bold text-slate-900 hover:text-primary transition-colors", children: "Linkiu.bio" }),
      /* @__PURE__ */ jsx("span", { className: "hidden sm:inline text-slate-300", children: "•" }),
      /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Todos los derechos reservados." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsx("a", { href: "#", className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors", children: "Privacidad" }),
      /* @__PURE__ */ jsx("a", { href: "#", className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors", children: "Términos" }),
      /* @__PURE__ */ jsx("a", { href: "#", className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors", children: "Soporte" })
    ] })
  ] }) });
}
function AdminLayout({
  children,
  title,
  breadcrumbs,
  maxwidth = "max-w-7xl",
  hideSidebar = false,
  hideFooter = false,
  hideNavbar = false
}) {
  const { auth, flash, currentTenant } = usePage().props;
  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success);
    }
    if (flash.error) {
      toast.error(flash.error);
    }
    if (flash.warning) {
      toast.warning(flash.warning, { duration: 8e3 });
    }
  }, [flash]);
  useEffect(() => {
    if (typeof window !== "undefined" && window.Echo && currentTenant?.id) {
      window.Echo.channel(`tenant.${currentTenant.id}.reservations`).listen(".reservation.created", (e) => {
        toast.info(e.message, {
          description: "Nueva reserva recibida",
          duration: 1e4,
          action: {
            label: "Ver Reservas",
            onClick: () => router.get(route("tenant.admin.reservations.index", { tenant: currentTenant.slug }))
          }
        });
      });
    }
    return () => {
      try {
        if (typeof window !== "undefined" && window.Echo && currentTenant?.id) {
          const echo = window.Echo;
          if (echo.connector?.ably?.connection?.state === "connected") {
            echo.leave(`tenant.${currentTenant.id}.reservations`);
          }
        }
      } catch (error) {
      }
    };
  }, [currentTenant?.id]);
  return /* @__PURE__ */ jsxs(SidebarProvider, { children: [
    !hideSidebar && /* @__PURE__ */ jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxs(SidebarInset, { children: [
      !hideNavbar && /* @__PURE__ */ jsx(
        AdminNavbar,
        {
          title,
          breadcrumbs
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: cn(
        "flex-1 flex flex-col min-h-screen",
        !hideSidebar && "bg-slate-50/50"
      ), children: [
        /* @__PURE__ */ jsx("main", { className: cn(
          "flex-1 overflow-x-hidden",
          hideSidebar ? "p-0" : "p-4 sm:p-8"
        ), children: /* @__PURE__ */ jsx("div", { className: cn(
          hideSidebar ? "w-full" : maxwidth + " mx-auto",
          "animate-in fade-in slide-in-from-bottom-4 duration-700"
        ), children }) }),
        !hideFooter && /* @__PURE__ */ jsx(AdminFooter, {})
      ] })
    ] }),
    /* @__PURE__ */ jsx(Toaster, { position: "bottom-center" })
  ] });
}
export {
  AdminLayout as A
};
