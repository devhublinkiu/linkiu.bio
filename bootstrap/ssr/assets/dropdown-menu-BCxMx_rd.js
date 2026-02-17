import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { ChevronRight, Bell, CheckCircle2, Trash2, Check, CreditCard, ShoppingBag, LockKeyhole, PanelLeft } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { c as cn } from "./utils-B0hQsrDj.js";
import * as React from "react";
import { useState, useEffect } from "react";
import { Drawer as Drawer$1 } from "vaul";
import { B as Button } from "./button-BdX_X5dq.js";
import { router } from "@inertiajs/react";
import axios from "axios";
import { toast } from "sonner";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { S as Separator } from "./separator-DbxqJzR0.js";
import { S as Sheet, a as SheetContent } from "./sheet-DFnQxYfh.js";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
function Breadcrumb({ ...props }) {
  return /* @__PURE__ */ jsx("nav", { "aria-label": "breadcrumb", "data-slot": "breadcrumb", ...props });
}
function BreadcrumbList({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "ol",
    {
      "data-slot": "breadcrumb-list",
      className: cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      ),
      ...props
    }
  );
}
function BreadcrumbItem({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "li",
    {
      "data-slot": "breadcrumb-item",
      className: cn("inline-flex items-center gap-1.5", className),
      ...props
    }
  );
}
function BreadcrumbLink({
  asChild,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "breadcrumb-link",
      className: cn("hover:text-foreground transition-colors", className),
      ...props
    }
  );
}
function BreadcrumbPage({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      "data-slot": "breadcrumb-page",
      role: "link",
      "aria-disabled": "true",
      "aria-current": "page",
      className: cn("text-foreground font-normal", className),
      ...props
    }
  );
}
function BreadcrumbSeparator({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "li",
    {
      "data-slot": "breadcrumb-separator",
      role: "presentation",
      "aria-hidden": "true",
      className: cn("[&>svg]:size-3.5", className),
      ...props,
      children: children ?? /* @__PURE__ */ jsx(ChevronRight, {})
    }
  );
}
const Drawer = ({
  shouldScaleBackground = true,
  ...props
}) => /* @__PURE__ */ jsx(
  Drawer$1.Root,
  {
    "data-slot": "drawer",
    shouldScaleBackground,
    ...props
  }
);
Drawer.displayName = "Drawer";
Drawer$1.Trigger;
const DrawerPortal = Drawer$1.Portal;
Drawer$1.Close;
const DrawerOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Drawer$1.Overlay,
  {
    ref,
    "data-slot": "drawer-overlay",
    className: cn(
      "fixed inset-0 z-50 bg-black/10 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DrawerOverlay.displayName = Drawer$1.Overlay.displayName;
const DrawerContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DrawerPortal, { children: [
  /* @__PURE__ */ jsx(DrawerOverlay, {}),
  /* @__PURE__ */ jsxs(
    Drawer$1.Content,
    {
      ref,
      "data-slot": "drawer-content",
      className: cn(
        "bg-background flex h-auto flex-col text-sm data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-r-xl data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-l-xl data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm group/drawer-content fixed z-50",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("div", { className: "bg-muted mx-auto mt-4 hidden h-1 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" }),
        children
      ]
    }
  )
] }));
DrawerContent.displayName = "DrawerContent";
const DrawerHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    "data-slot": "drawer-header",
    className: cn(
      "gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-0.5 md:text-left flex flex-col",
      className
    ),
    ...props
  }
);
DrawerHeader.displayName = "DrawerHeader";
const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Drawer$1.Title,
  {
    ref,
    "data-slot": "drawer-title",
    className: cn("text-foreground text-base font-medium", className),
    ...props
  }
));
DrawerTitle.displayName = Drawer$1.Title.displayName;
const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Drawer$1.Description,
  {
    ref,
    "data-slot": "drawer-description",
    className: cn("text-muted-foreground text-sm", className),
    ...props
  }
));
DrawerDescription.displayName = Drawer$1.Description.displayName;
function NotificationSidebar({
  open,
  onOpenChange,
  notifications,
  onNotificationRead,
  onAllRead
}) {
  const unreadCount = notifications.filter((n) => !n.read_at).length;
  const hasReadNotifications = notifications.some((n) => !!n.read_at);
  const [localNotifications, setLocalNotifications] = useState(notifications);
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);
  const markAsRead = async (id) => {
    if (id.includes(".") || !isNaN(parseFloat(id)) && isFinite(parseFloat(id)) && parseFloat(id) < 1) {
      if (onNotificationRead) onNotificationRead(id);
      return;
    }
    try {
      await axios.post(route("notifications.markRead", id));
      setLocalNotifications((prev) => prev.map(
        (n) => n.id === id ? { ...n, read_at: (/* @__PURE__ */ new Date()).toISOString() } : n
      ));
      if (onNotificationRead) onNotificationRead(id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
  const markAllAsRead = async () => {
    try {
      await axios.post(route("notifications.markAllRead"));
      setLocalNotifications((prev) => prev.map((n) => ({ ...n, read_at: (/* @__PURE__ */ new Date()).toISOString() })));
      if (onAllRead) onAllRead();
      toast.success("Todas las notificaciones marcadas como leídas");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };
  const deleteNotification = async (id) => {
    setLocalNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await axios.delete(route("notifications.destroy", id));
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Error al eliminar la notificación");
    }
  };
  const clearAllRead = async () => {
    setLocalNotifications((prev) => prev.filter((n) => !n.read_at));
    try {
      await axios.delete(route("notifications.destroyAllRead"));
      toast.success("Notificaciones leídas eliminadas");
    } catch (error) {
      console.error("Error clearing read notifications:", error);
    }
  };
  const handleNotificationClick = (notification) => {
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
    if (notification.data.url) {
      onOpenChange(false);
      router.visit(notification.data.url);
    }
  };
  const getIcon = (type) => {
    switch (type) {
      case "tenant_created":
        return /* @__PURE__ */ jsx(ShoppingBag, { className: "h-4 w-4 text-blue-500" });
      case "invoice_generated":
        return /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4 text-amber-500" });
      case "payment_reported":
        return /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4 text-green-500" });
      case "payment_status_updated":
        return /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4 text-primary" });
      default:
        return /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4 text-slate-400" });
    }
  };
  return /* @__PURE__ */ jsx(Drawer, { open, onOpenChange, direction: "right", children: /* @__PURE__ */ jsxs(DrawerContent, { className: "w-full sm:max-w-md p-0 gap-0 flex flex-col border-l border-border h-full outline-none", children: [
    /* @__PURE__ */ jsx(DrawerHeader, { className: "p-6 border-b border-border bg-background text-left", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5 text-primary" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(DrawerTitle, { className: "text-lg font-bold text-foreground", children: "Notificaciones" }),
          /* @__PURE__ */ jsx(DrawerDescription, { className: "sr-only", children: "Centro de notificaciones y avisos del sistema" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground font-medium", children: unreadCount > 0 ? `Tienes ${unreadCount} ${unreadCount === 1 ? "nueva notificacion" : "notificaciones nuevas"}` : "Estás al día" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        unreadCount > 0 && /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: markAllAsRead,
            className: "text-primary hover:text-primary hover:bg-primary/5 font-bold text-xs gap-2 px-2 h-8",
            title: "Marcar todo como leído",
            children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Leer todo" })
            ]
          }
        ),
        hasReadNotifications && /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: clearAllRead,
            className: "text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-bold text-xs gap-2 px-2 h-8",
            title: "Eliminar leídas",
            children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-1", children: /* @__PURE__ */ jsx("div", { className: "divide-y divide-border", children: localNotifications.length > 0 ? localNotifications.map((notification) => /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => handleNotificationClick(notification),
        className: cn(
          "p-5 transition-all cursor-pointer group hover:bg-muted/50 flex gap-4 items-start relative select-none",
          !notification.read_at && "bg-primary/5"
        ),
        children: [
          !notification.read_at && /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-0 w-1 bg-primary" }),
          /* @__PURE__ */ jsx("div", { className: cn(
            "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-sm border",
            !notification.read_at ? "bg-background border-primary/20" : "bg-muted border-border"
          ), children: getIcon(notification.data.type) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 pt-0.5", children: [
            /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start mb-1", children: /* @__PURE__ */ jsx("p", { className: cn(
              "text-sm leading-tight pr-6",
              !notification.read_at ? "font-bold text-foreground" : "font-medium text-muted-foreground"
            ), children: notification.data.message }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider", children: new Date(notification.created_at).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
              }) }),
              notification.data.url && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "h-1 w-1 rounded-full bg-border" }),
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all uppercase tracking-wider", children: [
                  "Ver detalle ",
                  /* @__PURE__ */ jsx(ChevronRight, { className: "h-2.5 w-2.5" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute right-2 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: !notification.read_at ? /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-7 w-7 rounded-lg hover:bg-background hover:text-green-600 hover:shadow-sm",
              title: "Marcar como leído",
              onClick: (e) => {
                e.stopPropagation();
                markAsRead(notification.id);
              },
              children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" })
            }
          ) : /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-7 w-7 rounded-lg hover:bg-destructive/10 hover:text-destructive",
              title: "Eliminar",
              onClick: (e) => {
                e.stopPropagation();
                deleteNotification(notification.id);
              },
              children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          ) })
        ]
      },
      notification.id
    )) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 px-8 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(Bell, { className: "h-8 w-8 text-muted-foreground/30" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-foreground font-bold mb-1", children: "Sin notificaciones" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "No tienes nada nuevo por aquí." })
    ] }) }) }),
    localNotifications.length > 0 && /* @__PURE__ */ jsx("div", { className: "p-4 bg-muted/30 border-t border-border", children: /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest", children: [
      "Mostrando últimas ",
      localNotifications.length,
      " notificaciones"
    ] }) })
  ] }) });
}
function PermissionDeniedModal({
  open,
  onOpenChange,
  title = "Acceso Restringido",
  description = "No tienes los permisos necesarios para realizar esta acción o acceder a esta sección. Contacta al administrador del equipo si crees que esto es un error."
}) {
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: "flex flex-col items-center text-center gap-4 pt-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-red-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(LockKeyhole, { className: "h-6 w-6 text-red-600" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-xl text-center", children: title }),
        /* @__PURE__ */ jsx(DialogDescription, { className: "text-center", children: description })
      ] })
    ] }),
    /* @__PURE__ */ jsx(DialogFooter, { className: "sm:justify-center pt-4", children: /* @__PURE__ */ jsx(
      Button,
      {
        variant: "secondary",
        className: "min-w-[120px] font-bold",
        onClick: () => onOpenChange(false),
        children: "Entendido"
      }
    ) })
  ] }) });
}
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(void 0);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
const TooltipProvider = React.forwardRef(({ delayDuration = 0, ...props }, ref) => /* @__PURE__ */ jsx(
  TooltipPrimitive.Provider,
  {
    "data-slot": "tooltip-provider",
    delayDuration,
    ...props
  }
));
TooltipProvider.displayName = TooltipPrimitive.Provider.displayName;
function Tooltip({
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(TooltipPrimitive.Root, { "data-slot": "tooltip", ...props }) });
}
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 0, children, ...props }, ref) => /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  TooltipPrimitive.Content,
  {
    ref,
    "data-slot": "tooltip-content",
    sideOffset,
    className: cn(
      "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 rounded-md px-3 py-1.5 text-xs bg-foreground text-background z-50 w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin)",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(TooltipPrimitive.Arrow, { className: "size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground z-50" })
    ]
  }
) }));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = React.createContext(null);
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
const SidebarProvider = React.forwardRef(
  ({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
  }, ref) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open]
    );
    const toggleSidebar = React.useCallback(() => {
      return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
    }, [isMobile, setOpen, setOpenMobile]);
    React.useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);
    const state = open ? "expanded" : "collapsed";
    const contextValue = React.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );
    return /* @__PURE__ */ jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...style
        },
        className: cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
          className
        ),
        ref,
        ...props,
        children
      }
    ) }) });
  }
);
SidebarProvider.displayName = "SidebarProvider";
const Sidebar = React.forwardRef(
  ({
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
    ...props
  }, ref) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
    if (collapsible === "none") {
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          ),
          ref,
          ...props,
          children
        }
      );
    }
    if (isMobile) {
      return /* @__PURE__ */ jsx(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsx(
        SheetContent,
        {
          "data-sidebar": "sidebar",
          "data-mobile": "true",
          className: "w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
          style: {
            "--sidebar-width": SIDEBAR_WIDTH_MOBILE
          },
          side,
          children: /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col", children })
        }
      ) });
    }
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className: "group peer hidden md:block text-sidebar-foreground",
        "data-state": state,
        "data-collapsible": state === "collapsed" ? collapsible : "",
        "data-variant": variant,
        "data-side": side,
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
                "group-data-[collapsible=offcanvas]:w-0",
                "group-data-[side=right]:rotate-180",
                variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[--sidebar-width-icon]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
                side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
                // Adjust the padding for floating and inset variants.
                variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
                className
              ),
              ...props,
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  "data-sidebar": "sidebar",
                  className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow",
                  children
                }
              )
            }
          )
        ]
      }
    );
  }
);
Sidebar.displayName = "Sidebar";
const SidebarTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      ref,
      "data-sidebar": "trigger",
      variant: "ghost",
      size: "icon",
      className: cn("h-7 w-7", className),
      onClick: (event) => {
        onClick?.(event);
        toggleSidebar();
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx(PanelLeft, {}),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
});
SidebarTrigger.displayName = "SidebarTrigger";
const SidebarRail = React.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsx(
    "button",
    {
      ref,
      "data-sidebar": "rail",
      "aria-label": "Toggle Sidebar",
      tabIndex: -1,
      onClick: toggleSidebar,
      title: "Toggle Sidebar",
      className: cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      ),
      ...props
    }
  );
});
SidebarRail.displayName = "SidebarRail";
const SidebarInset = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "main",
    {
      ref,
      className: cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-2xl/80",
        className
      ),
      ...props
    }
  );
});
SidebarInset.displayName = "SidebarInset";
const SidebarInput = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    Input,
    {
      ref,
      "data-sidebar": "input",
      className: cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      ),
      ...props
    }
  );
});
SidebarInput.displayName = "SidebarInput";
const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "header",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
});
SidebarHeader.displayName = "SidebarHeader";
const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "footer",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
});
SidebarFooter.displayName = "SidebarFooter";
const SidebarSeparator = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    Separator,
    {
      ref,
      "data-sidebar": "separator",
      className: cn("mx-2 w-auto bg-sidebar-border", className),
      ...props
    }
  );
});
SidebarSeparator.displayName = "SidebarSeparator";
const SidebarContent = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "content",
      className: cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
});
SidebarContent.displayName = "SidebarContent";
const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "group",
      className: cn("relative flex w-full min-w-0 flex-col p-2", className),
      ...props
    }
  );
});
SidebarGroup.displayName = "SidebarGroup";
const SidebarGroupLabel = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "group-label",
      className: cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      ),
      ...props
    }
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
const SidebarGroupAction = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "group-action",
      className: cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";
const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "group-content",
      className: cn("w-full text-sm", className),
      ...props
    }
  );
});
SidebarGroupContent.displayName = "SidebarGroupContent";
const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "ul",
    {
      ref,
      "data-sidebar": "menu",
      className: cn("flex w-full min-w-0 flex-col gap-1", className),
      ...props
    }
  );
});
SidebarMenu.displayName = "SidebarMenu";
const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "li",
    {
      ref,
      "data-sidebar": "menu-item",
      className: cn("group/menu-item relative", className),
      ...props
    }
  );
});
SidebarMenuItem.displayName = "SidebarMenuItem";
const SidebarMenuButton = React.forwardRef(
  ({
    asChild = false,
    isActive = false,
    variant = "default",
    size = "default",
    tooltip,
    className,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();
    const button = /* @__PURE__ */ jsx(
      Comp,
      {
        ref,
        "data-sidebar": "menu-button",
        "data-size": size,
        "data-active": isActive,
        className: cn(
          "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
          "data-[size=sm]:text-xs",
          "data-[size=lg]:text-sm",
          variant === "outline" && "border border-sidebar-border bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          className
        ),
        ...props
      }
    );
    if (!tooltip) {
      return button;
    }
    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip
      };
    }
    return /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: button }),
      /* @__PURE__ */ jsx(
        TooltipContent,
        {
          side: "right",
          align: "center",
          hidden: state !== "collapsed" || isMobile,
          ...tooltip
        }
      )
    ] });
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";
const SidebarMenuAction = React.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-action",
      className: cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      ),
      ...props
    }
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";
const SidebarMenuBadge = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "menu-badge",
      className: cn(
        "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
});
SidebarMenuBadge.displayName = "SidebarMenuBadge";
const SidebarMenuSub = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "ul",
    {
      ref,
      "data-sidebar": "menu-sub",
      className: cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
});
SidebarMenuSub.displayName = "SidebarMenuSub";
const SidebarMenuSubItem = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("li", { ref, ...props }));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
const SidebarMenuSubButton = React.forwardRef(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-sub-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        className
      ),
      ...props
    }
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
function Collapsible({
  ...props
}) {
  return /* @__PURE__ */ jsx(CollapsiblePrimitive.Root, { "data-slot": "collapsible", ...props });
}
function CollapsibleTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    CollapsiblePrimitive.CollapsibleTrigger,
    {
      "data-slot": "collapsible-trigger",
      ...props
    }
  );
}
function CollapsibleContent({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    CollapsiblePrimitive.CollapsibleContent,
    {
      "data-slot": "collapsible-content",
      ...props
    }
  );
}
const Avatar = React.forwardRef(({ className, size = "default", ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    "data-slot": "avatar",
    "data-size": size,
    className: cn(
      "group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    "data-slot": "avatar-image",
    className: cn("aspect-square size-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    "data-slot": "avatar-fallback",
    className: cn(
      "bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm group-data-[size=sm]/avatar:text-xs",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
const AvatarBadge = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "span",
  {
    ref,
    "data-slot": "avatar-badge",
    className: cn(
      "bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full ring-2 select-none",
      "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
      "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
      "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
      className
    ),
    ...props
  }
));
AvatarBadge.displayName = "AvatarBadge";
const AvatarGroup = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    "data-slot": "avatar-group",
    className: cn(
      "*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2",
      className
    ),
    ...props
  }
));
AvatarGroup.displayName = "AvatarGroup";
const AvatarGroupCount = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    "data-slot": "avatar-group-count",
    className: cn(
      "bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
      className
    ),
    ...props
  }
));
AvatarGroupCount.displayName = "AvatarGroupCount";
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  align = "start",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      align,
      className: cn("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-popover text-popover-foreground min-w-32 rounded-lg p-1 shadow-md duration-100 z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto data-[state=closed]:overflow-hidden", className),
      ...props
    }
  ) });
}
function DropdownMenuGroup({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Group, { "data-slot": "dropdown-menu-group", ...props });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive not-data-[variant=destructive]:focus:**:text-accent-foreground gap-1.5 rounded-md px-1.5 py-1 text-sm [&_svg:not([class*='size-'])]:size-4 group/dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Label,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn("text-muted-foreground px-1.5 py-1 text-xs font-medium data-[inset]:pl-8", className),
      ...props
    }
  );
}
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn("bg-border -mx-1 my-1 h-px", className),
      ...props
    }
  );
}
export {
  Avatar as A,
  Breadcrumb as B,
  Collapsible as C,
  DropdownMenu as D,
  BreadcrumbLink as E,
  BreadcrumbSeparator as F,
  BreadcrumbPage as G,
  Tooltip as H,
  TooltipTrigger as I,
  TooltipContent as J,
  NotificationSidebar as N,
  PermissionDeniedModal as P,
  SidebarGroup as S,
  TooltipProvider as T,
  SidebarMenu as a,
  SidebarMenuItem as b,
  CollapsibleTrigger as c,
  SidebarMenuButton as d,
  CollapsibleContent as e,
  SidebarMenuSub as f,
  SidebarMenuSubItem as g,
  SidebarMenuSubButton as h,
  DropdownMenuTrigger as i,
  AvatarImage as j,
  AvatarFallback as k,
  DropdownMenuContent as l,
  DropdownMenuLabel as m,
  DropdownMenuSeparator as n,
  DropdownMenuGroup as o,
  DropdownMenuItem as p,
  Sidebar as q,
  SidebarHeader as r,
  SidebarContent as s,
  SidebarFooter as t,
  useSidebar as u,
  SidebarProvider as v,
  SidebarInset as w,
  SidebarTrigger as x,
  BreadcrumbList as y,
  BreadcrumbItem as z
};
