import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CegS7XIj.js";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { b as buttonVariants, B as Button } from "./button-BdX_X5dq.js";
import { C as Card, d as CardContent, e as CardFooter } from "./card-BaovBWX5.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BqbZUUtD.js";
import { S as Sheet, b as SheetContent, c as SheetHeader, d as SheetTitle, e as SheetDescription } from "./sheet-BFMMArVC.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { E as Empty, a as EmptyHeader, e as EmptyMedia, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import { getDefaultClassNames, DayPicker } from "react-day-picker";
import { c as cn } from "./utils-B0hQsrDj.js";
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, CalendarIcon, Clock2Icon, Plus, Images, ExternalLink, Link, Edit, Trash2, Image, Calendar as Calendar$1, Loader2 } from "lucide-react";
import { a as Field, b as FieldLabel } from "./field-BEfz_npx.js";
import { I as InputGroup, b as InputGroupInput, a as InputGroupAddon } from "./input-group-BFAJKiYP.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-Bm8n8N8a.js";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { P as PermissionDeniedModal } from "./dropdown-menu-Dkgv2tnp.js";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-rtCrEhXP.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-switch";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "@radix-ui/react-alert-dialog";
import "clsx";
import "tailwind-merge";
import "./textarea-BpljFL5D.js";
import "@radix-ui/react-popover";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  return /* @__PURE__ */ jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn(
        "p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] bg-background group/calendar [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      ),
      captionLayout,
      locale,
      formatters: {
        formatMonthDropdown: (date) => date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters
      },
      classNames: {
        root: cn("w-full max-w-full", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative w-full",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative cn-calendar-dropdown-root rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute bg-popover inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label" ? "text-sm" : "cn-calendar-caption-label rounded-(--cell-radius) flex items-center gap-1 text-sm  [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground rounded-(--cell-radius) flex-1 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full rounded-(--cell-radius) h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius) group/day aspect-square select-none",
          props.showWeekNumber ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)" : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-(--cell-radius) bg-muted relative after:bg-muted after:absolute after:inset-y-0 after:w-4 after:right-0 -z-0 isolate",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "rounded-r-(--cell-radius) bg-muted relative after:bg-muted after:absolute after:inset-y-0 after:w-4 after:left-0 -z-0 isolate",
          defaultClassNames.range_end
        ),
        today: cn(
          "bg-muted text-foreground rounded-(--cell-radius) data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames
      },
      components: {
        Root: ({ className: className2, rootRef, ...props2 }) => {
          return /* @__PURE__ */ jsx(
            "div",
            {
              "data-slot": "calendar",
              ref: rootRef,
              className: cn(className2),
              ...props2
            }
          );
        },
        Chevron: ({ className: className2, orientation, ...props2 }) => {
          if (orientation === "left") {
            return /* @__PURE__ */ jsx(ChevronLeftIcon, { className: cn("cn-rtl-flip size-4", className2), ...props2 });
          }
          if (orientation === "right") {
            return /* @__PURE__ */ jsx(ChevronRightIcon, { className: cn("cn-rtl-flip size-4", className2), ...props2 });
          }
          return /* @__PURE__ */ jsx(ChevronDownIcon, { className: cn("size-4", className2), ...props2 });
        },
        DayButton: ({ ...props2 }) => /* @__PURE__ */ jsx(CalendarDayButton, { locale, ...props2 }),
        WeekNumber: ({ children, ...props2 }) => {
          return /* @__PURE__ */ jsx("td", { ...props2, children: /* @__PURE__ */ jsx("div", { className: "flex size-(--cell-size) items-center justify-center text-center", children }) });
        },
        ...components
      },
      ...props
    }
  );
}
function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return /* @__PURE__ */ jsx(
    Button,
    {
      ref,
      variant: "ghost",
      size: "icon",
      "data-day": day.date.toLocaleDateString(locale?.code),
      "data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
      "data-range-start": modifiers.range_start,
      "data-range-end": modifiers.range_end,
      "data-range-middle": modifiers.range_middle,
      className: cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-foreground relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      ),
      ...props
    }
  );
}
function DateTimePicker({ date, setDate, label = "Hora" }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const getTimeString = (d) => {
    if (!d) return "00:00:00";
    return d.toTimeString().split(" ")[0];
  };
  const handleDateSelect = (newDate) => {
    if (!newDate) {
      setDate(void 0);
      return;
    }
    const d = new Date(newDate);
    if (date) {
      d.setHours(date.getHours());
      d.setMinutes(date.getMinutes());
      d.setSeconds(date.getSeconds());
    }
    setDate(d);
  };
  const handleTimeChange = (e) => {
    const timeStr = e.target.value;
    if (!timeStr) return;
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    const newDate = date ? new Date(date) : /* @__PURE__ */ new Date();
    newDate.setHours(hours || 0);
    newDate.setMinutes(minutes || 0);
    newDate.setSeconds(seconds || 0);
    setDate(newDate);
  };
  return /* @__PURE__ */ jsxs(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        className: cn(
          "w-full justify-start text-left font-normal",
          !date && "text-muted-foreground"
        ),
        children: [
          /* @__PURE__ */ jsx(CalendarIcon, { className: "mr-2 h-4 w-4" }),
          date ? format(date, "PPP p", { locale: es }) : /* @__PURE__ */ jsx("span", { children: "Seleccionar fecha y hora" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(PopoverContent, { className: "w-full p-4", align: "start", children: /* @__PURE__ */ jsxs(Card, { className: "mx-auto w-auto border-0 shadow-none", children: [
      /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx(
        Calendar,
        {
          mode: "single",
          selected: date,
          onSelect: handleDateSelect,
          className: "p-0",
          locale: es
        }
      ) }),
      /* @__PURE__ */ jsx(CardFooter, { className: "bg-card border-t p-3", children: /* @__PURE__ */ jsxs(Field, { className: "w-full", children: [
        /* @__PURE__ */ jsx(FieldLabel, { children: label }),
        /* @__PURE__ */ jsxs(InputGroup, { children: [
          /* @__PURE__ */ jsx(
            InputGroupInput,
            {
              type: "time",
              step: "1",
              value: getTimeString(date),
              onChange: handleTimeChange,
              className: "appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            }
          ),
          /* @__PURE__ */ jsx(InputGroupAddon, { children: /* @__PURE__ */ jsx(Clock2Icon, { className: "text-muted-foreground w-4 h-4" }) })
        ] })
      ] }) })
    ] }) })
  ] });
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-muted rounded-md animate-pulse", className),
      ...props
    }
  );
}
function Index({ sliders, locations, sliders_limit, sliders_count, filters }) {
  const { currentTenant } = usePage().props;
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [sliderToDelete, setSliderToDelete] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const atLimit = sliders_limit !== null && sliders_count >= sliders_limit;
  const [listLoading, setListLoading] = useState(false);
  const { currentUserRole } = usePage().props;
  const checkPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner || currentUserRole.permissions.includes("*") || currentUserRole.permissions.includes(permission);
  };
  const handleActionWithPermission = (permission, action) => {
    if (checkPermission(permission)) {
      action();
    } else {
      setShowPermissionModal(true);
    }
  };
  const { data, setData, processing, errors, reset, clearErrors } = useForm({
    location_id: filters.location_id || (locations[0]?.id.toString() ?? ""),
    name: "",
    image_path: null,
    link_type: "none",
    external_url: "",
    linkable_type: "",
    linkable_id: "",
    start_at: void 0,
    end_at: void 0,
    is_active: true,
    active_days: []
  });
  const openCreate = () => {
    setEditingSlider(null);
    reset();
    setPreviewImage(null);
    clearErrors();
    setData("location_id", (filters.location_id || locations[0]?.id.toString()) ?? "");
    setIsSheetOpen(true);
  };
  const openEdit = (slider) => {
    setEditingSlider(slider);
    clearErrors();
    setData({
      location_id: slider.location_id?.toString() ?? "",
      name: slider.name,
      image_path: null,
      link_type: slider.link_type,
      external_url: slider.external_url || "",
      linkable_type: slider.linkable_type || "",
      linkable_id: slider.linkable_id ? slider.linkable_id.toString() : "",
      start_at: slider.start_at ? new Date(slider.start_at) : void 0,
      end_at: slider.end_at ? new Date(slider.end_at) : void 0,
      is_active: slider.is_active,
      active_days: slider.active_days || []
    });
    setPreviewImage(slider.image_url ?? null);
    setIsSheetOpen(true);
  };
  const submit = (e) => {
    e.preventDefault();
    const permission = editingSlider ? "sliders.update" : "sliders.create";
    handleActionWithPermission(permission, () => {
      const startAtStr = data.start_at ? format(data.start_at, "yyyy-MM-dd HH:mm:ss") : null;
      const endAtStr = data.end_at ? format(data.end_at, "yyyy-MM-dd HH:mm:ss") : null;
      const formData = {
        ...data,
        location_id: data.location_id ? String(data.location_id) : void 0,
        external_url: data.link_type === "external" ? data.external_url || null : null,
        linkable_type: data.link_type === "internal" ? data.linkable_type || null : null,
        linkable_id: data.link_type === "internal" && data.linkable_id ? Number(data.linkable_id) : null,
        start_at: startAtStr,
        end_at: endAtStr
      };
      if (formData.image_path === null || formData.image_path === void 0) {
        delete formData.image_path;
      }
      if (formData.start_at === null || formData.start_at === "") delete formData.start_at;
      if (formData.end_at === null || formData.end_at === "") delete formData.end_at;
      if (editingSlider) {
        router.post(route("tenant.sliders.update", [currentTenant?.slug, editingSlider.id]), {
          ...formData,
          _method: "put"
        }, {
          preserveScroll: true,
          onSuccess: () => {
            toast.success("Slider actualizado");
            setIsSheetOpen(false);
          },
          onError: (errs) => {
            const firstError = errs && typeof errs === "object" ? Object.values(errs)[0] : null;
            const msg = typeof firstError === "string" ? firstError : typeof errs?.limit === "string" ? errs.limit : "Revisa los campos del formulario";
            toast.error(msg);
          }
        });
      } else {
        router.post(route("tenant.sliders.store", currentTenant?.slug), { ...formData }, {
          preserveScroll: true,
          onSuccess: () => {
            toast.success("Slider creado");
            setIsSheetOpen(false);
          },
          onError: (errs) => {
            const firstError = errs && typeof errs === "object" ? Object.values(errs)[0] : null;
            const msg = typeof firstError === "string" ? firstError : typeof errs?.limit === "string" ? errs.limit : "Revisa los campos del formulario";
            toast.error(msg);
          }
        });
      }
    });
  };
  const handleDelete = () => {
    if (!sliderToDelete) return;
    router.delete(route("tenant.sliders.destroy", [currentTenant?.slug, sliderToDelete.id]), {
      onSuccess: () => {
        toast.success("Slider eliminado");
        setSliderToDelete(null);
      }
    });
  };
  const toggleActive = (slider) => {
    handleActionWithPermission("sliders.update", () => {
      router.put(route("tenant.sliders.update", [currentTenant?.slug, slider.id]), {
        name: slider.name,
        link_type: slider.link_type,
        is_active: !slider.is_active
      }, {
        onSuccess: () => toast.success("Estado actualizado")
      });
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Sliders", children: [
    /* @__PURE__ */ jsx(Head, { title: "Sliders" }),
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Sliders" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Gestiona los banners promocionales de tu tienda.",
          sliders_limit !== null && /* @__PURE__ */ jsxs("span", { className: "ml-1 font-medium text-foreground", children: [
            "(",
            sliders_count,
            " / ",
            sliders_limit,
            " usados)"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        locations.length > 0 && /* @__PURE__ */ jsxs(
          Select,
          {
            value: filters.location_id ?? "all",
            onValueChange: (val) => {
              const url = route("tenant.sliders.index", currentTenant?.slug);
              setListLoading(true);
              router.get(url, val === "all" ? {} : { location_id: val }, {
                preserveState: true,
                onFinish: () => setListLoading(false)
              });
            },
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Sede" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las sedes" }),
                locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: String(loc.id), children: loc.name }, loc.id))
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: () => handleActionWithPermission("sliders.create", () => !atLimit && openCreate()),
            disabled: atLimit,
            className: "gap-2",
            title: atLimit ? "Has alcanzado el máximo de sliders permitidos en tu plan" : void 0,
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
              " Nuevo Slider"
            ]
          }
        )
      ] })
    ] }),
    listLoading ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx("div", { className: "p-4 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-24 rounded-lg flex-shrink-0" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-3/4" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-1/2" })
      ] })
    ] }, i)) }) }) }) : sliders.data.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-16", children: /* @__PURE__ */ jsxs(Empty, { children: [
      /* @__PURE__ */ jsxs(EmptyHeader, { children: [
        /* @__PURE__ */ jsx(EmptyMedia, { variant: "icon", children: /* @__PURE__ */ jsx(Images, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx(EmptyTitle, { children: "No hay sliders creados" }),
        /* @__PURE__ */ jsx(EmptyDescription, { children: "Los sliders aparecen como carrusel en la portada de tu tienda. Crea el primero para destacar promociones o productos." })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => handleActionWithPermission("sliders.create", () => !atLimit && openCreate()),
          disabled: atLimit,
          className: "gap-2 mt-4",
          title: atLimit ? "Has alcanzado el máximo de sliders permitidos en tu plan" : void 0,
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            " Crear primer slider"
          ]
        }
      )
    ] }) }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Card, { className: "hidden md:block", children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "w-[100px]", children: "Imagen" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Nombre" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Enlace" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Clicks" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Programación" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Estado" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: sliders.data.map((slider) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "relative w-24 h-12 rounded-lg overflow-hidden bg-muted border", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: slider.image_url ?? `/media/${slider.image_path}`,
              alt: slider.name,
              className: "w-full h-full object-cover"
            }
          ) }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: slider.name }),
          /* @__PURE__ */ jsxs(TableCell, { children: [
            slider.link_type === "none" && /* @__PURE__ */ jsx(Badge, { variant: "outline", children: "Sin enlace" }),
            slider.link_type === "external" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm text-blue-600", children: [
              /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" }),
              " Externo"
            ] }),
            slider.link_type === "internal" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm text-purple-600", children: [
              /* @__PURE__ */ jsx(Link, { className: "w-3 h-3" }),
              " Interno"
            ] })
          ] }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "font-mono", children: slider.clicks_count }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center text-xs text-muted-foreground", children: slider.start_at ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsx("span", { children: new Date(slider.start_at).toLocaleDateString() }),
            slider.end_at && /* @__PURE__ */ jsxs("span", { children: [
              "hasta ",
              new Date(slider.end_at).toLocaleDateString()
            ] })
          ] }) : /* @__PURE__ */ jsx("span", { children: "Siempre visible" }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(
            Switch,
            {
              checked: slider.is_active,
              onCheckedChange: () => toggleActive(slider)
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", onClick: () => handleActionWithPermission("sliders.update", () => openEdit(slider)), children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                className: "text-red-500 hover:text-red-600 hover:bg-red-50",
                onClick: () => handleActionWithPermission("sliders.delete", () => setSliderToDelete(slider)),
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
              }
            )
          ] }) })
        ] }, slider.id)) })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden space-y-3", children: sliders.data.map((slider) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-lg overflow-hidden bg-muted border flex-shrink-0", children: /* @__PURE__ */ jsx("img", { src: slider.image_url ?? `/media/${slider.image_path}`, alt: slider.name, className: "w-full h-full object-cover" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium truncate", children: slider.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            slider.link_type === "none" && "Sin enlace",
            slider.link_type === "external" && "Enlace externo",
            slider.link_type === "internal" && "Enlace interno",
            "· ",
            slider.clicks_count,
            " clicks"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-2", children: [
            /* @__PURE__ */ jsx(Switch, { checked: slider.is_active, onCheckedChange: () => toggleActive(slider) }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", onClick: () => handleActionWithPermission("sliders.update", () => openEdit(slider)), children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", className: "text-red-500", onClick: () => handleActionWithPermission("sliders.delete", () => setSliderToDelete(slider)), children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
            ] })
          ] })
        ] })
      ] }) }) }, slider.id)) }),
      sliders.links && sliders.links.length > 3 && /* @__PURE__ */ jsx(SharedPagination, { links: sliders.links, className: "mt-4" })
    ] }),
    /* @__PURE__ */ jsx(Sheet, { open: isSheetOpen, onOpenChange: setIsSheetOpen, children: /* @__PURE__ */ jsxs(SheetContent, { className: "w-full sm:max-w-xl overflow-y-auto", children: [
      /* @__PURE__ */ jsxs(SheetHeader, { children: [
        /* @__PURE__ */ jsx(SheetTitle, { children: editingSlider ? "Editar Slider" : "Nuevo Slider" }),
        /* @__PURE__ */ jsx(SheetDescription, { children: "Configura la imagen y comportamiento del banner." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6 mt-6", children: [
        locations.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Sede" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: data.location_id,
              onValueChange: (val) => setData("location_id", val),
              required: true,
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona una sede" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: String(loc.id), children: loc.name }, loc.id)) })
              ]
            }
          ),
          errors.location_id && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs", children: errors.location_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre Administrativo" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "name",
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              placeholder: "Ej: Promo Verano",
              required: true
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-lg border p-4 bg-muted/30", children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Image, { className: "w-4 h-4" }),
            " Imágenes"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Imagen Principal (Obligatorio)" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-2", children: "Tamaño recomendado: 1200x600px (2:1)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                className: "cursor-pointer",
                type: "file",
                accept: "image/*",
                onChange: (e) => {
                  if (e.target.files) {
                    const file = e.target.files[0];
                    setData("image_path", file);
                    setPreviewImage(URL.createObjectURL(file));
                  }
                },
                required: !editingSlider
              }
            ),
            previewImage && /* @__PURE__ */ jsx("div", { className: "aspect-[2/1] rounded-lg border overflow-hidden bg-gray-100 mt-2", children: /* @__PURE__ */ jsx("img", { src: previewImage, alt: "Preview", className: "w-full h-full object-cover" }) }),
            errors.image_path && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs", children: errors.image_path })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-lg border p-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Link, { className: "w-4 h-4" }),
            " Enlace"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Tipo de Enlace" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: data.link_type,
                onValueChange: (val) => {
                  setData("link_type", val);
                  if (val === "none") {
                    setData("external_url", "");
                    setData("linkable_id", "");
                  }
                },
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "Sin enlace" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "external", children: "Externo (URL)" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "internal", disabled: true, children: "Interno (Próximamente)" })
                  ] })
                ]
              }
            )
          ] }),
          data.link_type === "external" && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "URL Destino" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "https://...",
                value: data.external_url,
                onChange: (e) => setData("external_url", e.target.value),
                required: true
              }
            ),
            errors.external_url && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs", children: errors.external_url })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-lg border p-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Calendar$1, { className: "w-4 h-4" }),
            " Programación"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "mb-2", children: "Inicio (Opcional)" }),
              /* @__PURE__ */ jsx(
                DateTimePicker,
                {
                  date: data.start_at ? new Date(data.start_at) : void 0,
                  setDate: (date) => setData("start_at", date),
                  label: "Hora Inicio"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "mb-2", children: "Fin (Opcional)" }),
              /* @__PURE__ */ jsx(
                DateTimePicker,
                {
                  date: data.end_at ? new Date(data.end_at) : void 0,
                  setDate: (date) => setData("end_at", date),
                  label: "Hora Fin"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-4", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setIsSheetOpen(false), disabled: processing, children: "Cancelar" }),
          /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: processing, className: "gap-2", children: [
            processing && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
            editingSlider ? "Guardar Cambios" : "Crear Slider"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!sliderToDelete, onOpenChange: (open) => !open && setSliderToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar Slider?" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Esta acción no se puede deshacer." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: handleDelete, variant: "destructive", children: "Eliminar" })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
