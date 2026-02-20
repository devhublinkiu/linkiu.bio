import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React__default, { useMemo, useState } from "react";
import { usePage, useForm, router, Head } from "@inertiajs/react";
import { A as AdminLayout } from "./AdminLayout-CegS7XIj.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { S as Separator } from "./separator-DbxqJzR0.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { ChevronLeft, ChevronRight, Clock, Users, Armchair, Filter, Settings, CalendarDays, Phone, MapPin, Pencil, DollarSign, XCircle, CheckCircle, Timer } from "lucide-react";
import { format, startOfWeek, endOfWeek, subDays, subWeeks, subMonths, addDays, addWeeks, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { P as PermissionDeniedModal } from "./dropdown-menu-Dkgv2tnp.js";
import { E as Empty, a as EmptyHeader, e as EmptyMedia, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./card-BaovBWX5.js";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-rtCrEhXP.js";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-separator";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "@radix-ui/react-switch";
import "vaul";
import "axios";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
function parseLocalDate$1(dateStr) {
  const datePart = dateStr.substring(0, 10);
  return /* @__PURE__ */ new Date(datePart + "T00:00:00");
}
const HOURS = Array.from({ length: 16 }, (_, i) => i + 7);
const STATUS_COLORS = {
  pending: "bg-yellow-100 border-yellow-300 text-yellow-800",
  confirmed: "bg-emerald-100 border-emerald-300 text-emerald-800",
  seated: "bg-blue-100 border-blue-300 text-blue-800",
  cancelled: "bg-red-100 border-red-300 text-red-800",
  no_show: "bg-slate-100 border-slate-300 text-slate-600"
};
const STATUS_DOT = {
  pending: "bg-yellow-500",
  confirmed: "bg-emerald-500",
  seated: "bg-blue-500",
  cancelled: "bg-red-500",
  no_show: "bg-slate-400"
};
function ReservationCalendar({
  reservations,
  currentDate,
  viewMode,
  onViewChange,
  onDateChange,
  onReservationClick
}) {
  const navigate = (direction) => {
    const fn = direction === "prev" ? viewMode === "day" ? subDays : viewMode === "week" ? subWeeks : subMonths : viewMode === "day" ? addDays : viewMode === "week" ? addWeeks : addMonths;
    onDateChange(fn(currentDate, 1));
  };
  const goToToday = () => onDateChange(/* @__PURE__ */ new Date());
  const headerLabel = useMemo(() => {
    if (viewMode === "day") return format(currentDate, "EEEE d 'de' MMMM, yyyy", { locale: es });
    if (viewMode === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(start, "d MMM", { locale: es })} — ${format(end, "d MMM yyyy", { locale: es })}`;
    }
    return format(currentDate, "MMMM yyyy", { locale: es });
  }, [currentDate, viewMode]);
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm border overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b bg-slate-50/50", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => navigate("prev"), children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: goToToday, className: "text-xs font-medium", children: "Hoy" }),
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => navigate("next"), children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold text-slate-800 ml-2 capitalize", children: headerLabel })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center bg-slate-100 rounded-lg p-0.5", children: ["day", "week", "month"].map((v) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onViewChange(v),
          className: `px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === v ? "bg-white shadow text-indigo-700" : "text-slate-500 hover:text-slate-700"}`,
          children: v === "day" ? "Día" : v === "week" ? "Semana" : "Mes"
        },
        v
      )) })
    ] }),
    viewMode === "month" && /* @__PURE__ */ jsx(
      MonthView,
      {
        currentDate,
        reservations,
        onDayClick: (date) => {
          onDateChange(date);
          onViewChange("day");
        },
        onReservationClick
      }
    ),
    viewMode === "week" && /* @__PURE__ */ jsx(
      WeekView,
      {
        currentDate,
        reservations,
        onReservationClick,
        onDayClick: (date) => {
          onDateChange(date);
          onViewChange("day");
        }
      }
    ),
    viewMode === "day" && /* @__PURE__ */ jsx(
      DayView,
      {
        currentDate,
        reservations,
        onReservationClick
      }
    )
  ] });
}
function MonthView({ currentDate, reservations, onDayClick, onReservationClick }) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });
  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const getReservationsForDay = (day) => reservations.filter((r) => {
    const rDate = r.reservation_date ? parseLocalDate$1(r.reservation_date) : null;
    return rDate && isSameDay(rDate, day);
  });
  return /* @__PURE__ */ jsxs("div", { className: "p-2", children: [
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 mb-1", children: dayNames.map((d) => /* @__PURE__ */ jsx("div", { className: "text-center text-[11px] font-bold text-slate-400 uppercase py-2", children: d }, d)) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-px bg-slate-100 rounded-lg overflow-hidden", children: days.map((day) => {
      const dayReservations = getReservationsForDay(day);
      const inMonth = isSameMonth(day, currentDate);
      const today = isToday(day);
      return /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => onDayClick(day),
          className: `min-h-[90px] p-1.5 text-left transition-colors ${inMonth ? "bg-white hover:bg-indigo-50" : "bg-slate-50/50 text-slate-300"} ${today ? "ring-2 ring-inset ring-indigo-500" : ""}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: `text-xs font-bold ${today ? "bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-full" : ""}`, children: format(day, "d") }),
              dayReservations.length > 0 && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[9px] h-4 px-1 font-black bg-indigo-50 text-indigo-700 border-indigo-200", children: dayReservations.length })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
              dayReservations.slice(0, 3).map((r) => /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    onReservationClick(r);
                  },
                  className: `text-[9px] leading-tight px-1 py-0.5 rounded border truncate cursor-pointer hover:opacity-80 ${STATUS_COLORS[r.status]}`,
                  children: [
                    r.reservation_time?.substring(0, 5),
                    " ",
                    r.customer_name
                  ]
                },
                r.id
              )),
              dayReservations.length > 3 && /* @__PURE__ */ jsxs("div", { className: "text-[9px] text-slate-400 pl-1", children: [
                "+",
                dayReservations.length - 3,
                " más"
              ] })
            ] })
          ]
        },
        day.toISOString()
      );
    }) })
  ] });
}
function WeekView({ currentDate, reservations, onReservationClick, onDayClick }) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
  const getReservationsForDay = (day) => reservations.filter((r) => {
    const rDate = r.reservation_date ? parseLocalDate$1(r.reservation_date) : null;
    return rDate && isSameDay(rDate, day);
  });
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsx("div", { className: "min-w-[700px]", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[60px_repeat(7,1fr)]", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-r bg-slate-50 p-2" }),
    days.map((day) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => onDayClick(day),
        className: `border-b border-r p-2 text-center hover:bg-indigo-50 transition-colors ${isToday(day) ? "bg-indigo-50" : "bg-slate-50"}`,
        children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase font-bold text-slate-400", children: format(day, "EEE", { locale: es }) }),
          /* @__PURE__ */ jsx("div", { className: `text-sm font-black mt-0.5 ${isToday(day) ? "bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full mx-auto" : "text-slate-700"}`, children: format(day, "d") })
        ]
      },
      day.toISOString()
    )),
    HOURS.map((hour) => /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "border-r border-b px-2 py-3 text-[10px] font-bold text-slate-400 text-right", children: `${hour}:00` }),
      days.map((day) => {
        const dayRes = getReservationsForDay(day);
        const hourRes = dayRes.filter((r) => {
          const h = parseInt(r.reservation_time?.substring(0, 2) || "0");
          return h === hour;
        });
        return /* @__PURE__ */ jsx("div", { className: "border-r border-b p-0.5 min-h-[48px] relative", children: hourRes.map((r) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onReservationClick(r),
            className: `w-full text-left text-[10px] leading-tight px-1.5 py-1 rounded border mb-0.5 cursor-pointer hover:shadow transition-shadow ${STATUS_COLORS[r.status]}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "font-bold truncate", children: r.customer_name }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 opacity-70", children: [
                /* @__PURE__ */ jsx(Clock, { className: "w-2.5 h-2.5" }),
                r.reservation_time?.substring(0, 5),
                /* @__PURE__ */ jsx(Users, { className: "w-2.5 h-2.5 ml-1" }),
                r.party_size
              ] })
            ]
          },
          r.id
        )) }, `${day.toISOString()}-${hour}`);
      })
    ] }, hour))
  ] }) }) });
}
function DayView({ currentDate, reservations, onReservationClick }) {
  const dayReservations = reservations.filter((r) => {
    const rDate = r.reservation_date ? parseLocalDate$1(r.reservation_date) : null;
    return rDate && isSameDay(rDate, currentDate);
  });
  const groupedByHour = HOURS.map((hour) => ({
    hour,
    label: `${hour}:00`,
    reservations: dayReservations.filter((r) => {
      const h = parseInt(r.reservation_time?.substring(0, 2) || "0");
      return h === hour;
    })
  }));
  const pendingCount = dayReservations.filter((r) => r.status === "pending").length;
  const confirmedCount = dayReservations.filter((r) => r.status === "confirmed").length;
  const seatedCount = dayReservations.filter((r) => r.status === "seated").length;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 px-4 py-3 bg-slate-50/70 border-b text-xs", children: [
      /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-600", children: [
        dayReservations.length,
        " reservas"
      ] }),
      pendingCount > 0 && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-yellow-500" }),
        pendingCount,
        " pendientes"
      ] }),
      confirmedCount > 0 && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500" }),
        confirmedCount,
        " confirmadas"
      ] }),
      seatedCount > 0 && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-blue-500" }),
        seatedCount,
        " sentados"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "divide-y", children: groupedByHour.map(({ hour, label, reservations: hourRes }) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[70px_1fr] min-h-[56px]", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-start justify-end pr-3 pt-2 text-xs font-bold text-slate-400 border-r", children: label }),
      /* @__PURE__ */ jsx("div", { className: "p-1.5 space-y-1.5", children: hourRes.map((r) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => onReservationClick(r),
          className: `w-full text-left px-3 py-2.5 rounded-lg border transition-all hover:shadow-md cursor-pointer ${STATUS_COLORS[r.status]}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: `w-2 h-2 rounded-full ${STATUS_DOT[r.status]}` }),
                /* @__PURE__ */ jsx("span", { className: "font-bold text-sm", children: r.customer_name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs opacity-70", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
                  r.reservation_time?.substring(0, 5)
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Users, { className: "w-3 h-3" }),
                  r.party_size
                ] }),
                r.table && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 font-medium", children: [
                  /* @__PURE__ */ jsx(Armchair, { className: "w-3 h-3" }),
                  r.table.name
                ] })
              ] })
            ] }),
            r.notes && /* @__PURE__ */ jsxs("p", { className: "text-[10px] mt-1 italic opacity-60 truncate", children: [
              '"',
              r.notes,
              '"'
            ] })
          ]
        },
        r.id
      )) })
    ] }, hour)) })
  ] });
}
function parseLocalDate(dateStr) {
  const datePart = dateStr.substring(0, 10);
  return /* @__PURE__ */ new Date(datePart + "T00:00:00");
}
function AdminReservationIndex({ reservations, tables, locations, filters }) {
  const { currentTenant, currentUserRole } = usePage().props;
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const hasPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner || currentUserRole.permissions.includes("*") || currentUserRole.permissions.includes(permission);
  };
  const handleProtectedAction = (e, permission, callback) => {
    if (e) e.preventDefault();
    if (hasPermission(permission)) {
      callback();
    } else {
      setShowPermissionModal(true);
    }
  };
  const [currentDate, setCurrentDate] = useState(() => {
    const now = /* @__PURE__ */ new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const [viewMode, setViewMode] = useState("week");
  const [selectedLocationId, setSelectedLocationId] = useState(filters.location_id || "");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [seatModalOpen, setSeatModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [targetStatus, setTargetStatus] = useState("seated");
  const [editingConfigLocationId, setEditingConfigLocationId] = useState("");
  const [cancelAlertOpen, setCancelAlertOpen] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const configForm = useForm({
    reservation_price_per_person: 0,
    reservation_min_anticipation: 2,
    reservation_slot_duration: 60,
    reservation_payment_proof_required: false
  });
  const getDateRange = (date, view) => {
    if (view === "day") return { start: date, end: date };
    if (view === "week") return { start: startOfWeek(date, { weekStartsOn: 1 }), end: endOfWeek(date, { weekStartsOn: 1 }) };
    return { start: startOfMonth(date), end: endOfMonth(date) };
  };
  const fetchReservations = (date, view, locationId) => {
    const { start, end } = getDateRange(date, view);
    router.get(route("tenant.admin.reservations.index", { tenant: currentTenant.slug }), {
      date: format(date, "yyyy-MM-dd"),
      start_date: format(start, "yyyy-MM-dd"),
      end_date: format(end, "yyyy-MM-dd"),
      view,
      location_id: locationId === "all" ? "" : locationId
    }, { preserveState: true });
  };
  const handleDateChange = (date) => {
    setCurrentDate(date);
    fetchReservations(date, viewMode, selectedLocationId);
  };
  const handleViewChange = (view) => {
    setViewMode(view);
    fetchReservations(currentDate, view, selectedLocationId);
  };
  const handleLocationChange = (locationId) => {
    setSelectedLocationId(locationId);
    fetchReservations(currentDate, viewMode, locationId);
  };
  React__default.useEffect(() => {
    if (typeof window !== "undefined" && window.Echo && currentTenant?.id) {
      window.Echo.channel(`tenant.${currentTenant.id}.reservations`).listen(".reservation.created", () => {
        router.reload({ only: ["reservations"] });
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
      } catch {
      }
    };
  }, [currentTenant?.id]);
  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation);
    setIsRescheduling(false);
    setRescheduleDate(reservation.reservation_date || "");
    setRescheduleTime(reservation.reservation_time?.substring(0, 5) || "");
    setDetailModalOpen(true);
  };
  const handleReschedule = () => {
    if (!selectedReservation) return;
    router.put(route("tenant.admin.reservations.update", {
      tenant: currentTenant.slug,
      reservation: selectedReservation.id
    }), {
      status: selectedReservation.status,
      reservation_date: rescheduleDate,
      reservation_time: rescheduleTime
    }, {
      onSuccess: () => {
        toast.success("Reserva reagendada. Se notificó al cliente por WhatsApp.");
        setIsRescheduling(false);
        setDetailModalOpen(false);
      },
      onError: () => {
        toast.error("No se pudo reagendar la reserva. Intenta de nuevo.");
      }
    });
  };
  const updateStatus = (reservation, status) => {
    if (status === "confirmed" && reservation.table_id) {
      router.put(route("tenant.admin.reservations.update", {
        tenant: currentTenant.slug,
        reservation: reservation.id
      }), { status: "confirmed", table_id: reservation.table_id }, {
        onSuccess: () => {
          toast.success("Reserva confirmada");
          setDetailModalOpen(false);
        },
        onError: () => {
          toast.error("No se pudo confirmar la reserva. Intenta de nuevo.");
        }
      });
      return;
    }
    if (status === "seated" || status === "confirmed") {
      setTargetStatus(status);
      setSelectedTableId(reservation.table_id || null);
      setDetailModalOpen(false);
      setSeatModalOpen(true);
      return;
    }
    router.put(route("tenant.admin.reservations.update", {
      tenant: currentTenant.slug,
      reservation: reservation.id
    }), { status }, {
      onSuccess: () => {
        toast.success(`Reserva ${status === "cancelled" ? "cancelada" : "actualizada"}`);
        setDetailModalOpen(false);
      },
      onError: () => {
        toast.error("No se pudo actualizar la reserva. Intenta de nuevo.");
      }
    });
  };
  const confirmSeat = () => {
    if (!selectedReservation) return;
    router.put(route("tenant.admin.reservations.update", {
      tenant: currentTenant.slug,
      reservation: selectedReservation.id
    }), { status: targetStatus, table_id: selectedTableId }, {
      onSuccess: () => {
        setSeatModalOpen(false);
        toast.success(targetStatus === "seated" ? "Cliente sentado. Mesa ocupada." : "Reserva confirmada.");
      },
      onError: () => {
        toast.error("No se pudo completar la acción. Intenta de nuevo.");
      }
    });
  };
  const openSettings = () => {
    const locId = selectedLocationId && selectedLocationId !== "all" ? selectedLocationId : locations[0]?.id.toString() || "";
    setEditingConfigLocationId(locId);
    const loc = locations.find((l) => l.id.toString() === locId);
    if (loc) {
      configForm.setData({
        reservation_price_per_person: loc.reservation_price_per_person,
        reservation_min_anticipation: loc.reservation_min_anticipation,
        reservation_slot_duration: loc.reservation_slot_duration,
        reservation_payment_proof_required: loc.reservation_payment_proof_required || false
      });
    }
    setSettingsModalOpen(true);
  };
  const handleLocationConfigChange = (id) => {
    setEditingConfigLocationId(id);
    const loc = locations.find((l) => l.id.toString() === id);
    if (loc) {
      configForm.setData({
        reservation_price_per_person: loc.reservation_price_per_person,
        reservation_min_anticipation: loc.reservation_min_anticipation,
        reservation_slot_duration: loc.reservation_slot_duration,
        reservation_payment_proof_required: loc.reservation_payment_proof_required || false
      });
    }
  };
  const saveSettings = () => {
    configForm.put(route("tenant.admin.reservations.settings.update", {
      tenant: currentTenant.slug,
      location: editingConfigLocationId
    }), {
      onSuccess: () => {
        setSettingsModalOpen(false);
        toast.success("Configuración de sede actualizada");
      },
      onError: () => {
        toast.error("No se pudo actualizar la configuración. Intenta de nuevo.");
      }
    });
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-yellow-100 text-yellow-800", children: "Pendiente" });
      case "confirmed":
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-green-100 text-green-800", children: "Confirmada" });
      case "seated":
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-blue-100 text-blue-800", children: "Sentado" });
      case "cancelled":
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-red-100 text-red-800", children: "Cancelada" });
      default:
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", children: status });
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Gestión de Reservas", breadcrumbs: [{ label: "Gastronomía" }, { label: "Reservas" }], children: [
    /* @__PURE__ */ jsx(Head, { title: "Gestión de Reservas" }),
    /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Filter, { className: "w-4 h-4 text-slate-400" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: selectedLocationId || "all",
              onValueChange: handleLocationChange,
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px] h-9 text-sm", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Todas las Sedes" }) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las Sedes" }),
                  locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: loc.id.toString(), children: loc.name }, loc.id))
                ] })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: (e) => handleProtectedAction(e, "reservations.update", openSettings), className: "gap-2", children: [
          /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4" }),
          " Configuración"
        ] })
      ] }),
      reservations.length === 0 && !selectedLocationId ? /* @__PURE__ */ jsx(Empty, { className: "border-2 border-dashed rounded-xl bg-white py-12", children: /* @__PURE__ */ jsxs(EmptyHeader, { children: [
        /* @__PURE__ */ jsx(EmptyMedia, { variant: "icon", children: /* @__PURE__ */ jsx(CalendarDays, { className: "size-4" }) }),
        /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay reservas registradas" }),
        /* @__PURE__ */ jsx(EmptyDescription, { children: "Las reservas creadas por los clientes aparecerán aquí." })
      ] }) }) : /* @__PURE__ */ jsx(
        ReservationCalendar,
        {
          reservations,
          currentDate,
          viewMode,
          onViewChange: handleViewChange,
          onDateChange: handleDateChange,
          onReservationClick: handleReservationClick
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: detailModalOpen, onOpenChange: setDetailModalOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-lg", children: "Detalle de Reserva" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: selectedReservation && getStatusBadge(selectedReservation.status) })
      ] }),
      selectedReservation && /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-slate-800", children: [
            /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 text-indigo-600" }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-lg", children: selectedReservation.customer_name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-slate-600 text-sm", children: [
            /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { children: selectedReservation.customer_phone })
          ] }),
          selectedReservation.location && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-slate-500 text-sm", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { children: selectedReservation.location.name })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-lg p-3 space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 text-sm font-medium", children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-indigo-600" }),
              selectedReservation.reservation_time.substring(0, 5)
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 text-sm font-medium", children: [
              /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 text-indigo-600" }),
              selectedReservation.party_size,
              " personas"
            ] })
          ] }),
          selectedReservation.table && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-indigo-600 font-medium text-sm", children: [
            /* @__PURE__ */ jsx(Armchair, { className: "w-4 h-4" }),
            "Mesa: ",
            selectedReservation.table.name
          ] }),
          selectedReservation.reservation_date && /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-400", children: [
            "Fecha: ",
            format(parseLocalDate(selectedReservation.reservation_date), "d 'de' MMMM, yyyy", { locale: es })
          ] })
        ] }),
        selectedReservation.status !== "cancelled" && selectedReservation.status !== "seated" && /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-3 bg-white", children: !isRescheduling ? /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: (e) => handleProtectedAction(e, "reservations.update", () => setIsRescheduling(true)),
            className: "flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors w-full",
            children: [
              /* @__PURE__ */ jsx(CalendarDays, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx(Pencil, { className: "w-3 h-3" }),
              "Reagendar reserva"
            ]
          }
        ) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-slate-700 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(CalendarDays, { className: "w-3.5 h-3.5" }),
            " Reagendar reserva"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Nueva fecha" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "date",
                  value: rescheduleDate,
                  onChange: (e) => setRescheduleDate(e.target.value),
                  min: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
                  className: "text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Nueva hora" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "time",
                  value: rescheduleTime,
                  onChange: (e) => setRescheduleTime(e.target.value),
                  className: "text-sm"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => setIsRescheduling(false), children: "Cancelar" }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                size: "sm",
                onClick: (e) => handleProtectedAction(e, "reservations.update", handleReschedule),
                disabled: !rescheduleDate || !rescheduleTime,
                className: "gap-1",
                children: [
                  /* @__PURE__ */ jsx(CalendarDays, { className: "w-3.5 h-3.5" }),
                  " Guardar y Notificar"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400", children: "Se enviará notificación por WhatsApp al cliente con la nueva fecha/hora." })
        ] }) }),
        selectedReservation.notes && /* @__PURE__ */ jsxs("div", { className: "bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 italic", children: [
          '"',
          selectedReservation.notes,
          '"'
        ] }),
        selectedReservation.payment_proof && selectedReservation.payment_proof_url && /* @__PURE__ */ jsxs("div", { className: "mt-2 border rounded-lg p-2 bg-slate-50", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-slate-700 mb-2 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(DollarSign, { className: "w-3 h-3" }),
            " Comprobante de Pago"
          ] }),
          /* @__PURE__ */ jsxs("a", { href: selectedReservation.payment_proof_url, target: "_blank", rel: "noopener noreferrer", className: "block relative group overflow-hidden rounded-md border border-slate-200", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: selectedReservation.payment_proof_url,
                alt: "Comprobante",
                className: "w-full h-auto max-h-[200px] object-cover transition-transform group-hover:scale-105"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold", children: "Clic para ver completo" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 pt-2", children: [
          selectedReservation.status === "pending" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                size: "sm",
                variant: "destructive",
                className: "gap-1",
                onClick: (e) => handleProtectedAction(e, "reservations.update", () => setCancelAlertOpen(true)),
                children: [
                  /* @__PURE__ */ jsx(XCircle, { className: "w-4 h-4" }),
                  " Cancelar"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                size: "sm",
                className: "gap-1 ml-auto",
                onClick: (e) => handleProtectedAction(e, "reservations.update", () => updateStatus(selectedReservation, "confirmed")),
                children: [
                  /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }),
                  " Confirmar + Asignar Mesa"
                ]
              }
            )
          ] }),
          selectedReservation.status === "confirmed" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "gap-1",
                onClick: (e) => handleProtectedAction(e, "reservations.update", () => setCancelAlertOpen(true)),
                children: [
                  /* @__PURE__ */ jsx(XCircle, { className: "w-4 h-4" }),
                  " Cancelar"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                size: "sm",
                className: "gap-1 ml-auto",
                onClick: (e) => handleProtectedAction(e, "reservations.update", () => updateStatus(selectedReservation, "seated")),
                children: [
                  /* @__PURE__ */ jsx(Armchair, { className: "w-4 h-4" }),
                  " Sentar (Check-in)"
                ]
              }
            )
          ] }),
          (selectedReservation.status === "cancelled" || selectedReservation.status === "seated") && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 italic w-full text-center", children: selectedReservation.status === "seated" ? "El cliente ya está sentado." : "Reserva cancelada." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: cancelAlertOpen, onOpenChange: setCancelAlertOpen, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Cancelar esta reserva?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "Esta acción cancelará la reserva de ",
          /* @__PURE__ */ jsx("strong", { children: selectedReservation?.customer_name }),
          " y liberará la mesa asignada. El cliente no será notificado automáticamente."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Volver" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            variant: "destructive",
            onClick: () => {
              if (selectedReservation) {
                updateStatus(selectedReservation, "cancelled");
              }
              setCancelAlertOpen(false);
            },
            children: "Sí, cancelar reserva"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: seatModalOpen, onOpenChange: setSeatModalOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-lg", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { children: [
          "Asignar Mesa a ",
          selectedReservation?.customer_name
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { children: selectedReservation && /* @__PURE__ */ jsxs("span", { children: [
          "Reserva para las ",
          /* @__PURE__ */ jsx("strong", { children: selectedReservation.reservation_time.substring(0, 5) }),
          " — ",
          selectedReservation.party_size,
          " personas"
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 py-4 max-h-[400px] overflow-y-auto", children: tables.filter((table) => {
        if (!selectedReservation?.location) return true;
        const reservationLocationId = locations.find((l) => l.name === selectedReservation.location?.name)?.id;
        return !table.location_id || table.location_id === reservationLocationId;
      }).map((table) => {
        const tableReservations = table.reservations || [];
        const hasReservations = tableReservations.length > 0;
        const isSelected = selectedTableId === table.id;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setSelectedTableId(table.id),
            className: `rounded-xl border-2 p-3 text-left transition-all ${isSelected ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200" : table.status === "occupied" ? "border-red-200 bg-red-50 hover:border-red-400 opacity-75" : hasReservations ? "border-amber-200 bg-amber-50 hover:border-amber-400" : "border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-sm", children: table.name }),
                table.status === "occupied" ? /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase bg-red-500 text-white px-1.5 py-0.5 rounded-full", children: "Ocupada (POS)" }) : hasReservations ? /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase bg-amber-500 text-white px-1.5 py-0.5 rounded-full", children: "Reservada" }) : /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase bg-emerald-500 text-white px-1.5 py-0.5 rounded-full", children: "Libre" })
              ] }),
              hasReservations && /* @__PURE__ */ jsx("div", { className: "space-y-1", children: tableReservations.map((r) => /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-amber-800 bg-amber-100 rounded px-1.5 py-0.5", children: [
                /* @__PURE__ */ jsx(Clock, { className: "w-2.5 h-2.5 inline mr-0.5" }),
                r.reservation_time.substring(0, 5),
                " — ",
                r.customer_name
              ] }, r.id)) }),
              !hasReservations && table.status !== "occupied" && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-emerald-600 font-medium", children: "Disponible" }),
              table.status === "occupied" && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-red-600 font-medium", children: "Mesa en servicio" })
            ]
          },
          table.id
        );
      }) }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => setSeatModalOpen(false), children: "Cancelar" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: confirmSeat,
            disabled: targetStatus === "seated" && !selectedTableId,
            children: targetStatus === "seated" ? "Confirmar y Sentar" : "Confirmar Reserva"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: settingsModalOpen, onOpenChange: setSettingsModalOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5 text-indigo-600" }),
          "Configuración de Reservas"
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Ajusta los parámetros globales de reserva para tus sedes." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Seleccionar Sede para configurar" }),
          /* @__PURE__ */ jsxs(Select, { value: editingConfigLocationId, onValueChange: handleLocationConfigChange, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona sede" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: loc.id.toString(), children: loc.name }, loc.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Timer, { className: "w-4 h-4 text-slate-400" }),
              " Anticipación Mínima (Horas)"
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                step: "0.5",
                value: configForm.data.reservation_min_anticipation,
                onChange: (e) => configForm.setData("reservation_min_anticipation", parseFloat(e.target.value))
              }
            ),
            configForm.errors.reservation_min_anticipation && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600", children: configForm.errors.reservation_min_anticipation }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 italic", children: "Ej: 0.5 para permitir reservas con 30 min de antelación." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-slate-400" }),
              " Duración de la Reserva (Minutos)"
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                step: "15",
                value: configForm.data.reservation_slot_duration,
                onChange: (e) => configForm.setData("reservation_slot_duration", parseInt(e.target.value))
              }
            ),
            configForm.errors.reservation_slot_duration && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600", children: configForm.errors.reservation_slot_duration })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(DollarSign, { className: "w-4 h-4 text-slate-400" }),
              " Valor por Persona (Depósito)"
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                value: configForm.data.reservation_price_per_person,
                onChange: (e) => configForm.setData("reservation_price_per_person", parseFloat(e.target.value))
              }
            ),
            configForm.errors.reservation_price_per_person && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600", children: configForm.errors.reservation_price_per_person }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 italic", children: "Monto informativo o garantía por comensal." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-sm font-bold text-slate-700", children: "Comprobante de Pago Obligatorio" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500", children: "Si se activa, el cliente deberá subir una foto del pago para completar la reserva." })
            ] }),
            /* @__PURE__ */ jsx(
              Switch,
              {
                checked: configForm.data.reservation_payment_proof_required,
                onCheckedChange: (val) => configForm.setData("reservation_payment_proof_required", val)
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => setSettingsModalOpen(false), children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { onClick: (e) => handleProtectedAction(e, "reservations.update", saveSettings), disabled: configForm.processing, children: configForm.processing ? "Guardando..." : "Guardar Configuración" })
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
  AdminReservationIndex as default
};
