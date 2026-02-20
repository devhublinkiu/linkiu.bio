import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AdminLayout } from "./AdminLayout-CegS7XIj.js";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-BaovBWX5.js";
import { QrCode, MapPin, Plus, UserPlus, MoreHorizontal, Edit, Trash2, Hash, RefreshCw } from "lucide-react";
import { S as Sheet, b as SheetContent, c as SheetHeader, d as SheetTitle, e as SheetDescription, f as SheetFooter } from "./sheet-BFMMArVC.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { D as DropdownMenu, i as DropdownMenuTrigger, l as DropdownMenuContent, p as DropdownMenuItem, P as PermissionDeniedModal } from "./dropdown-menu-Dkgv2tnp.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { E as Empty, a as EmptyHeader, e as EmptyMedia, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import { toast } from "sonner";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-rtCrEhXP.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-alert-dialog";
function normalizeTableStatus(s) {
  if (s === "active") return "available";
  if (s === "inactive") return "maintenance";
  return s;
}
function Index({ zones, locations, currentLocationId }) {
  const { currentTenant, currentUserRole, flash } = usePage().props;
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  useEffect(() => {
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash?.error]);
  const [isZoneSheetOpen, setIsZoneSheetOpen] = useState(false);
  const [isTableSheetOpen, setIsTableSheetOpen] = useState(false);
  const [isBulkSheetOpen, setIsBulkSheetOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [editingTable, setEditingTable] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const hasPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner === true || currentUserRole.permissions?.includes("*") === true || currentUserRole.permissions?.includes(permission) === true;
  };
  const handleProtectedAction = (e, permission, callback) => {
    if (!hasPermission(permission)) {
      setShowPermissionModal(true);
    } else {
      callback();
    }
  };
  const zoneForm = useForm({
    name: "",
    location_id: currentLocationId.toString()
  });
  const tableForm = useForm({
    zone_id: "",
    location_id: currentLocationId.toString(),
    name: "",
    capacity: "",
    status: "available"
  });
  const bulkForm = useForm({
    zone_id: "",
    location_id: currentLocationId.toString(),
    prefix: "Mesa ",
    start_number: 1,
    count: 10,
    capacity: ""
  });
  const handleOpenZoneSheet = (zone) => {
    if (zone) {
      setEditingZone(zone);
      zoneForm.setData({
        name: zone.name,
        location_id: (zone.location_id ?? currentLocationId).toString()
      });
    } else {
      setEditingZone(null);
      zoneForm.reset("name");
      zoneForm.setData("location_id", currentLocationId.toString());
    }
    setIsZoneSheetOpen(true);
  };
  const handleOpenTableSheet = (table, zoneId) => {
    if (table) {
      setEditingTable(table);
      tableForm.setData({
        zone_id: table.zone_id.toString(),
        name: table.name,
        capacity: table.capacity?.toString() || "",
        status: normalizeTableStatus(table.status),
        location_id: (table.location_id ?? currentLocationId).toString()
      });
    } else {
      setEditingTable(null);
      tableForm.reset("name", "capacity", "status");
      tableForm.setData("location_id", currentLocationId.toString());
      if (zoneId) tableForm.setData("zone_id", zoneId.toString());
    }
    setIsTableSheetOpen(true);
  };
  const submitZone = (e) => {
    e.preventDefault();
    const onError = () => toast.error("Revisa los campos del formulario.");
    if (editingZone) {
      zoneForm.put(route("tenant.admin.zones.update", [currentTenant?.slug, editingZone.id]), {
        onSuccess: () => {
          toast.success("Zona actualizada");
          setIsZoneSheetOpen(false);
        },
        onError
      });
    } else {
      zoneForm.post(route("tenant.admin.zones.store", currentTenant?.slug), {
        onSuccess: () => {
          toast.success("Zona creada");
          setIsZoneSheetOpen(false);
        },
        onError
      });
    }
  };
  const submitTable = (e) => {
    e.preventDefault();
    const onError = () => toast.error("Revisa los campos del formulario.");
    if (editingTable) {
      tableForm.put(route("tenant.admin.tables.update", [currentTenant?.slug, editingTable.id]), {
        onSuccess: () => {
          toast.success("Mesa actualizada");
          setIsTableSheetOpen(false);
        },
        onError
      });
    } else {
      tableForm.post(route("tenant.admin.tables.store", currentTenant?.slug), {
        onSuccess: () => {
          toast.success("Mesa creada");
          setIsTableSheetOpen(false);
        },
        onError
      });
    }
  };
  const submitBulk = (e) => {
    e.preventDefault();
    bulkForm.post(route("tenant.admin.tables.bulk", currentTenant?.slug), {
      onSuccess: () => {
        toast.success("Mesas creadas masivamente");
        setIsBulkSheetOpen(false);
        bulkForm.reset();
      },
      onError: () => toast.error("No se pudieron crear las mesas. Revisa los campos o intenta con menos cantidad.")
    });
  };
  const confirmDelete = () => {
    if (!itemToDelete) return;
    const url = itemToDelete.type === "zone" ? route("tenant.admin.zones.destroy", [currentTenant?.slug, itemToDelete.id]) : route("tenant.admin.tables.destroy", [currentTenant?.slug, itemToDelete.id]);
    router.delete(url, {
      onSuccess: () => {
        toast.success(`${itemToDelete.type === "zone" ? "Zona" : "Mesa"} eliminada`);
        setItemToDelete(null);
      },
      onError: () => toast.error("No se pudo eliminar. Inténtalo de nuevo.")
    });
  };
  const regenerateToken = (tableId) => {
    router.post(route("tenant.admin.tables.regenerate-token", [currentTenant?.slug, tableId]), {}, {
      onSuccess: () => toast.success("Token regenerado. El QR antiguo ya no funcionará.")
    });
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
      case "active":
        return /* @__PURE__ */ jsx(Badge, { className: "bg-emerald-500", children: "Disponible" });
      case "occupied":
        return /* @__PURE__ */ jsx(Badge, { className: "bg-amber-500", children: "Ocupada" });
      case "reserved":
        return /* @__PURE__ */ jsx(Badge, { className: "bg-indigo-500", children: "Reservada" });
      case "maintenance":
      case "inactive":
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-slate-400 border-slate-200 bg-slate-50", children: "Mantenimiento" });
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Mesas y Zonas", children: [
    /* @__PURE__ */ jsx(Head, { title: "Mesas y Zonas" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Mesas y Zonas" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Organiza tus espacios y genera QRs para pedidos en mesa." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider", children: "Sede:" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: currentLocationId.toString(),
                onValueChange: (val) => router.get(route("tenant.admin.tables.index", [currentTenant?.slug]), { location_id: val }, { preserveState: true }),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[200px] h-8 text-xs bg-white", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar Sede" }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: loc.id.toString(), children: loc.name }, loc.id)) })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => handleProtectedAction(null, "tables.view", () => router.get(route("tenant.admin.tables.print", [currentTenant?.slug]))),
              children: [
                /* @__PURE__ */ jsx(QrCode, { className: "w-4 h-4 mr-2" }),
                " Centro de QRs"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => handleProtectedAction(null, "tables.create", () => handleOpenZoneSheet()),
              children: [
                /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 mr-2" }),
                " Nueva Zona"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(Button, { onClick: () => handleProtectedAction(null, "tables.create", () => handleOpenTableSheet()), children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-2" }),
            " Nueva Mesa"
          ] })
        ] })
      ] }),
      zones.length === 0 ? /* @__PURE__ */ jsxs(Empty, { className: "border-2 border-dashed rounded-xl bg-white py-12", children: [
        /* @__PURE__ */ jsxs(EmptyHeader, { children: [
          /* @__PURE__ */ jsx(EmptyMedia, { variant: "icon", children: /* @__PURE__ */ jsx(MapPin, { className: "size-4" }) }),
          /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay zonas configuradas" }),
          /* @__PURE__ */ jsx(EmptyDescription, { children: 'Empieza creando una zona como "Salón Principal" o "Terraza".' })
        ] }),
        /* @__PURE__ */ jsxs(Button, { className: "mt-4", onClick: () => handleProtectedAction(null, "tables.create", () => handleOpenZoneSheet()), children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-2" }),
          " Crear mi primera zona"
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid gap-6", children: zones.map((zone) => /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden border-none shadow-sm ring-1 ring-slate-200", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "bg-slate-50/50 border-b flex flex-row items-center justify-between py-4", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-primary" }),
            zone.name,
            /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "ml-2 bg-white", children: [
              zone.tables.length,
              " mesas"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => handleProtectedAction(null, "tables.create", () => {
                  setIsBulkSheetOpen(true);
                  bulkForm.setData("zone_id", zone.id.toString());
                }),
                children: [
                  /* @__PURE__ */ jsx(UserPlus, { className: "w-4 h-4 mr-2" }),
                  " Carga Masiva"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "w-4 h-4" }) }) }),
              /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => handleProtectedAction(null, "tables.update", () => handleOpenZoneSheet(zone)), children: [
                  /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4 mr-2" }),
                  " Editar Zona"
                ] }),
                /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-red-600 focus:text-red-700", onClick: () => handleProtectedAction(null, "tables.delete", () => setItemToDelete({ type: "zone", id: zone.id })), children: [
                  /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 mr-2" }),
                  " Eliminar Zona"
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-slate-200", children: [
          zone.tables.map((table) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 group hover:bg-slate-50 transition-colors", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-bold text-slate-900 group-hover:text-primary transition-colors", children: table.name }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                  getStatusBadge(table.status),
                  table.capacity && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground flex items-center", children: [
                    /* @__PURE__ */ jsx(Hash, { className: "w-3 h-3 mr-0.5" }),
                    " Cap. ",
                    table.capacity
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "w-4 h-4" }) }) }),
                /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => handleProtectedAction(null, "tables.update", () => handleOpenTableSheet(table)), children: [
                    /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4 mr-2" }),
                    " Editar Mesa"
                  ] }),
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => handleProtectedAction(null, "tables.update", () => regenerateToken(table.id)), children: [
                    /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4 mr-2" }),
                    " Regenerar Token"
                  ] }),
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-red-600 focus:text-red-700", onClick: () => handleProtectedAction(null, "tables.delete", () => setItemToDelete({ type: "table", id: table.id })), children: [
                    /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 mr-2" }),
                    " Eliminar"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 mt-4", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase font-bold text-slate-400 tracking-wider", children: "Acceso Cliente" }),
              /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxs(Button, { variant: "secondary", size: "sm", className: "flex-1 h-8 text-xs font-bold", onClick: () => window.open(`${window.location.origin}/${currentTenant?.slug}?m=${table.token}`, "_blank"), children: [
                /* @__PURE__ */ jsx(QrCode, { className: "w-3 h-3 mr-1.5" }),
                " Ver QR"
              ] }) })
            ] })
          ] }, table.id)),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleProtectedAction(null, "tables.create", () => handleOpenTableSheet(void 0, zone.id)),
              className: "bg-slate-50 border-2 border-dashed border-slate-200 p-4 flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:bg-white transition-all group cursor-pointer",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-6 h-6 mb-2 group-hover:scale-110 transition-transform" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-tight", children: "Agregar Mesa" })
              ]
            }
          )
        ] }) })
      ] }, zone.id)) })
    ] }),
    /* @__PURE__ */ jsx(Sheet, { open: isZoneSheetOpen, onOpenChange: setIsZoneSheetOpen, children: /* @__PURE__ */ jsxs(SheetContent, { children: [
      /* @__PURE__ */ jsxs(SheetHeader, { children: [
        /* @__PURE__ */ jsx(SheetTitle, { children: editingZone ? "Editar Zona" : "Nueva Zona" }),
        /* @__PURE__ */ jsx(SheetDescription, { children: "Las zonas ayudan a organizar tus mesas (ej. Terraza, VIP)." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submitZone, className: "space-y-4 py-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "zone-name", children: "Nombre de la Zona" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "zone-name",
              value: zoneForm.data.name,
              onChange: (e) => zoneForm.setData("name", e.target.value),
              placeholder: "Ej. Terraza",
              required: true
            }
          ),
          zoneForm.errors.name && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: zoneForm.errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Sede" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: zoneForm.data.location_id,
              onValueChange: (v) => zoneForm.setData("location_id", v),
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsx(SelectContent, { children: locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: loc.id.toString(), children: loc.name }, loc.id)) })
              ]
            }
          ),
          zoneForm.errors.location_id && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: zoneForm.errors.location_id })
        ] }),
        /* @__PURE__ */ jsx(SheetFooter, { children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: zoneForm.processing, className: "w-full", children: zoneForm.processing ? "Guardando..." : editingZone ? "Actualizar" : "Crear Zona" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Sheet, { open: isTableSheetOpen, onOpenChange: setIsTableSheetOpen, children: /* @__PURE__ */ jsxs(SheetContent, { children: [
      /* @__PURE__ */ jsxs(SheetHeader, { children: [
        /* @__PURE__ */ jsx(SheetTitle, { children: editingTable ? "Editar Mesa" : "Nueva Mesa" }),
        /* @__PURE__ */ jsx(SheetDescription, { children: "Configura los detalles de la mesa individual." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submitTable, className: "space-y-4 py-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "table-zone", children: "Zona" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: tableForm.data.zone_id,
              onValueChange: (v) => tableForm.setData("zone_id", v),
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar zona" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: zones.map((z) => /* @__PURE__ */ jsx(SelectItem, { value: z.id.toString(), children: z.name }, z.id)) })
              ]
            }
          ),
          tableForm.errors.zone_id && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: tableForm.errors.zone_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "table-name", children: "Nombre / ID de Mesa" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "table-name",
              value: tableForm.data.name,
              onChange: (e) => tableForm.setData("name", e.target.value),
              placeholder: "Ej. Mesa 01",
              required: true
            }
          ),
          tableForm.errors.name && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: tableForm.errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "table-capacity", children: "Capacidad (Personas)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "table-capacity",
              type: "number",
              value: tableForm.data.capacity,
              onChange: (e) => tableForm.setData("capacity", e.target.value),
              placeholder: "Ej. 4"
            }
          ),
          tableForm.errors.capacity && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: tableForm.errors.capacity })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "table-status", children: "Estado" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: tableForm.data.status,
              onValueChange: (v) => tableForm.setData("status", v),
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "available", children: "Disponible" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "occupied", children: "Ocupada" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "reserved", children: "Reservada" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "maintenance", children: "Mantenimiento" })
                ] })
              ]
            }
          ),
          tableForm.errors.status && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: tableForm.errors.status })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Sede" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: tableForm.data.location_id,
              onValueChange: (v) => tableForm.setData("location_id", v),
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsx(SelectContent, { children: locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: loc.id.toString(), children: loc.name }, loc.id)) })
              ]
            }
          ),
          tableForm.errors.location_id && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: tableForm.errors.location_id })
        ] }),
        /* @__PURE__ */ jsx(SheetFooter, { children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: tableForm.processing, className: "w-full", children: tableForm.processing ? "Guardando..." : editingTable ? "Actualizar" : "Crear Mesa" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Sheet, { open: isBulkSheetOpen, onOpenChange: setIsBulkSheetOpen, children: /* @__PURE__ */ jsxs(SheetContent, { children: [
      /* @__PURE__ */ jsxs(SheetHeader, { children: [
        /* @__PURE__ */ jsx(SheetTitle, { children: "Carga Masiva de Mesas" }),
        /* @__PURE__ */ jsx(SheetDescription, { children: "Crea múltiples mesas rápidamente con un prefijo." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submitBulk, className: "space-y-4 py-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Zona Destino" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: bulkForm.data.zone_id,
              onValueChange: (v) => bulkForm.setData("zone_id", v),
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsx(SelectContent, { children: zones.map((z) => /* @__PURE__ */ jsx(SelectItem, { value: z.id.toString(), children: z.name }, z.id)) })
              ]
            }
          ),
          bulkForm.errors.zone_id && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: bulkForm.errors.zone_id }),
          bulkForm.errors.location_id && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: bulkForm.errors.location_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Prefijo" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: bulkForm.data.prefix,
                onChange: (e) => bulkForm.setData("prefix", e.target.value),
                placeholder: "Ej. Mesa "
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Inicia en" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                value: bulkForm.data.start_number,
                onChange: (e) => bulkForm.setData("start_number", parseInt(e.target.value) || 1)
              }
            ),
            bulkForm.errors.start_number && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: bulkForm.errors.start_number })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Cantidad a crear" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              max: "50",
              value: bulkForm.data.count,
              onChange: (e) => bulkForm.setData("count", parseInt(e.target.value) || 1)
            }
          ),
          bulkForm.errors.count && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: bulkForm.errors.count })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Capacidad por mesa" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              value: bulkForm.data.capacity,
              onChange: (e) => bulkForm.setData("capacity", e.target.value)
            }
          ),
          bulkForm.errors.capacity && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: bulkForm.errors.capacity })
        ] }),
        /* @__PURE__ */ jsx(SheetFooter, { children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: bulkForm.processing, className: "w-full", children: bulkForm.processing ? "Procesando..." : `Generar ${bulkForm.data.count} Mesas` }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!itemToDelete, onOpenChange: (open) => !open && setItemToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Confirmas la eliminación?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "Esta acción no se puede deshacer.",
          itemToDelete?.type === "zone" && " Al eliminar la zona se eliminarán también todas sus mesas asociadas."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { variant: "destructive", onClick: confirmDelete, children: "Eliminar" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    )
  ] });
}
export {
  Index as default
};
