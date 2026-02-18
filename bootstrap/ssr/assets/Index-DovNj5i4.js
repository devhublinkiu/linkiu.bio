import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { useForm, Head, router } from "@inertiajs/react";
import { CheckCircle, MapPin, ChevronRight, Users, Calendar, Clock, AlertCircle, User, Phone, Mail, FileText, ChevronLeft, Banknote, Copy, Upload, RefreshCw } from "lucide-react";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { T as Textarea } from "./textarea-BpljFL5D.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { format, parse, addMinutes, isAfter, isBefore } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { toast } from "sonner";
import { P as PublicLayout } from "./PublicLayout-BPgzBK4n.js";
import { H as Header } from "./Header-CDUqNXGd.js";
import { f as formatPrice } from "./utils-B0hQsrDj.js";
import axios from "axios";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "framer-motion";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
function ReservationIndex({ tenant, locations, bankAccounts = [] }) {
  const hasMultipleLocations = locations.length > 1;
  const hasNoLocations = locations.length === 0;
  const [step, setStep] = useState(hasNoLocations ? 0 : hasMultipleLocations ? 0 : 1);
  const [createdReservation, setCreatedReservation] = useState(null);
  const brandColors = tenant.brand_colors || {
    bg_color: "#f8fafc",
    name_color: "#1e293b",
    description_color: "#64748b",
    primary_color: "#4f46e5"
  };
  const { bg_color, name_color, primary_color } = brandColors;
  const primaryColor = primary_color ?? "#4f46e5";
  const form = useForm({
    location_id: locations.length === 1 ? locations[0].id : "",
    reservation_date: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
    reservation_time: "",
    party_size: 2,
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    notes: "",
    payment_proof: null
  });
  const selectedLocation = useMemo(
    () => locations.find((l) => l.id === Number(form.data.location_id)),
    [form.data.location_id, locations]
  );
  const timeSlots = useMemo(() => {
    if (!selectedLocation || !selectedLocation.opening_hours) return [];
    const date = parse(form.data.reservation_date, "yyyy-MM-dd", /* @__PURE__ */ new Date());
    const dayName = format(date, "EEEE", { locale: enUS }).toLowerCase();
    const ranges = selectedLocation.opening_hours[dayName];
    if (!ranges || !Array.isArray(ranges) || ranges.length === 0) return [];
    const slots = [];
    const minAnticipationHours = selectedLocation.reservation_min_anticipation ?? 2;
    const slotDurationMinutes = selectedLocation.reservation_slot_duration ?? 60;
    const now = /* @__PURE__ */ new Date();
    const minTime = addMinutes(now, minAnticipationHours * 60);
    ranges.forEach((range) => {
      if (!range.open || !range.close) return;
      const [openHour, openMin] = range.open.split(":").map(Number);
      const [closeHour, closeMin] = range.close.split(":").map(Number);
      let current = new Date(date);
      current.setHours(openHour, openMin, 0, 0);
      let end = new Date(date);
      end.setHours(closeHour, closeMin, 0, 0);
      if (isAfter(current, end)) {
        end.setDate(end.getDate() + 1);
      }
      while (isBefore(current, end)) {
        if (!isBefore(current, minTime)) {
          slots.push(format(current, "HH:mm"));
        }
        current = addMinutes(current, slotDurationMinutes);
      }
    });
    return Array.from(new Set(slots)).sort();
  }, [selectedLocation, form.data.reservation_date]);
  const bankAccountsForLocation = useMemo(() => {
    if (!bankAccounts?.length) return [];
    const locationId = selectedLocation?.id;
    return bankAccounts.filter(
      (acc) => acc.location_id == null || acc.location_id === locationId
    );
  }, [bankAccounts, selectedLocation?.id]);
  useEffect(() => {
    form.setData("reservation_time", "");
  }, [form.data.reservation_date, form.data.location_id]);
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("location_id", String(form.data.location_id));
    formData.append("reservation_date", form.data.reservation_date);
    formData.append("reservation_time", form.data.reservation_time);
    formData.append("party_size", String(form.data.party_size));
    formData.append("customer_name", form.data.customer_name);
    formData.append("customer_phone", form.data.customer_phone);
    if (form.data.customer_email) formData.append("customer_email", form.data.customer_email);
    if (form.data.notes) formData.append("notes", form.data.notes);
    if (form.data.payment_proof) formData.append("payment_proof", form.data.payment_proof);
    try {
      const response = await axios.post(route("tenant.reservations.store", tenant.slug), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json"
        }
      });
      if (response.data.success) {
        setCreatedReservation(response.data.reservation);
        setStep(5);
        toast.success("Reserva confirmada con éxito");
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          form.setError(key, errors[key][0]);
        });
        toast.error("Por favor corrige los errores en el formulario");
      } else {
        const serverMessage = error.response?.data?.message;
        const message = typeof serverMessage === "string" && serverMessage ? serverMessage : "Error al procesar la reserva. Intenta nuevamente.";
        toast.error(message);
      }
    }
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles");
  };
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: `Reservar en ${tenant.name}` }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsx(
      Header,
      {
        tenantName: tenant.name,
        logoUrl: tenant.logo_url,
        description: tenant.store_description,
        bgColor: bg_color,
        textColor: name_color,
        descriptionColor: brandColors.description_color
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 bg-slate-50 p-4 -mt-4 relative z-0 pb-20", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-xl mx-auto mb-8 mt-4 border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold text-slate-800", children: step === 5 ? "¡Reserva Confirmada!" : "Reservar Mesa" }),
        /* @__PURE__ */ jsxs(CardDescription, { children: [
          step === 0 && !hasNoLocations && "Selecciona la sede",
          step === 0 && hasNoLocations && "No hay sedes disponibles",
          step === 1 && "Selecciona cuándo quieres visitarnos",
          step === 2 && "Tus datos de contacto",
          step === 3 && "Pago y Comprobante",
          step === 4 && "Confirma los detalles",
          step === 5 && "Gracias por tu reserva. Te hemos enviado un WhatsApp."
        ] }),
        step < 5 && !hasNoLocations && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-1 sm:gap-8 pt-4 flex-nowrap", "aria-label": "Pasos del formulario", children: [
          { n: 0, label: "Sede" },
          { n: 1, label: "Fecha" },
          { n: 2, label: "Contacto" },
          { n: 3, label: "Pago" },
          { n: 4, label: "Resumen" }
        ].map(({ n, label }) => {
          const active = step === n;
          const done = step > n;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: `flex flex-col items-center gap-0.5 text-xs font-medium rounded-xl px-2 py-2 ${active ? "" : done ? "text-slate-500" : "text-slate-400"}`,
              style: active ? { backgroundColor: `${primaryColor}18`, color: primaryColor } : {},
              children: [
                done ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-green-500" }) : /* @__PURE__ */ jsx("span", { className: "w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px]", children: n + 1 }),
                /* @__PURE__ */ jsx("span", { children: label })
              ]
            },
            n
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        step === 0 && hasNoLocations && /* @__PURE__ */ jsxs("div", { className: "py-10 text-center space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "mx-auto w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(MapPin, { className: "w-7 h-7 text-amber-600" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-600", children: "No hay sedes disponibles para reservas en este momento." }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsx("a", { href: route("tenant.home", tenant.slug), children: "Volver al inicio" }) })
        ] }),
        step === 0 && !hasNoLocations && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-center text-slate-500", children: "Elige una sede para continuar" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-2", children: locations.map((loc) => /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => {
                form.setData("location_id", loc.id);
                setStep(1);
              },
              role: "button",
              tabIndex: 0,
              onKeyDown: (e) => e.key === "Enter" && (form.setData("location_id", loc.id), setStep(1)),
              className: "cursor-pointer p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 shadow-sm hover:shadow transition-all flex items-center justify-between group",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "p-2 rounded-full transition-colors",
                      style: { backgroundColor: `${primaryColor}15`, color: primaryColor },
                      children: /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5" })
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-medium text-slate-800", children: loc.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: loc.address })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5 text-slate-400 group-hover:text-slate-600", style: { color: primaryColor } })
              ]
            },
            loc.id
          )) })
        ] }),
        step === 1 && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium flex items-center gap-2", style: { color: primaryColor }, children: [
              /* @__PURE__ */ jsx(Users, { className: "w-4 h-4", style: { color: primaryColor } }),
              "Cantidad de Personas"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 justify-center bg-slate-100 p-3 rounded-lg", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "icon",
                  className: "h-10 w-10 rounded-full border-slate-300",
                  onClick: () => form.setData("party_size", Math.max(1, form.data.party_size - 1)),
                  disabled: form.data.party_size <= 1,
                  children: "-"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold w-12 text-center text-slate-800", children: form.data.party_size }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "icon",
                  className: "h-10 w-10 rounded-full border-slate-300",
                  onClick: () => form.setData("party_size", form.data.party_size + 1),
                  children: "+"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium flex items-center gap-2", style: { color: primaryColor }, children: [
              /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4", style: { color: primaryColor } }),
              "Fecha"
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "date",
                min: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
                value: form.data.reservation_date,
                onChange: (e) => form.setData("reservation_date", e.target.value),
                className: "bg-white",
                id: "reservation_date"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium flex items-center gap-2", style: { color: primaryColor }, children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4", style: { color: primaryColor } }),
              "Hora Disponible"
            ] }),
            timeSlots.length > 0 ? /* @__PURE__ */ jsx("div", { className: "max-h-48 overflow-y-auto pr-1", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: timeSlots.map((slot) => /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: form.data.reservation_time === slot ? "default" : "outline",
                className: "w-full",
                style: form.data.reservation_time === slot ? { backgroundColor: primaryColor, color: "#fff" } : {},
                onClick: () => form.setData("reservation_time", slot),
                children: format(parse(slot, "HH:mm", /* @__PURE__ */ new Date()), "h:mm a")
              },
              slot
            )) }) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-6 bg-amber-50 rounded-lg text-amber-700 border border-amber-200", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "w-8 h-8 mb-2" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-center", children: "No hay horarios disponibles para esta fecha." })
            ] }),
            form.errors.reservation_time && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500 bg-red-50 p-2 rounded", children: form.errors.reservation_time })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              className: "w-full mt-4 text-white",
              style: { backgroundColor: primaryColor },
              onClick: () => {
                if (!form.data.reservation_time) {
                  toast.error("Por favor selecciona una hora");
                  return;
                }
                setStep(2);
              },
              children: [
                "Continuar ",
                /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 ml-1" })
              ]
            }
          )
        ] }),
        step === 2 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "customer_name", className: "text-sm font-medium flex items-center gap-2 text-slate-700", children: [
              /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-slate-500" }),
              "Tu Nombre"
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "customer_name",
                placeholder: "Ej: Juan Pérez",
                value: form.data.customer_name,
                onChange: (e) => form.setData("customer_name", e.target.value)
              }
            ),
            form.errors.customer_name && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: form.errors.customer_name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "customer_phone", className: "text-sm font-medium flex items-center gap-2 text-slate-700", children: [
              /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 text-slate-500" }),
              "WhatsApp"
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "customer_phone",
                placeholder: "Ej: 3001234567",
                type: "tel",
                value: form.data.customer_phone,
                onChange: (e) => form.setData("customer_phone", e.target.value)
              }
            ),
            form.errors.customer_phone && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: form.errors.customer_phone })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "customer_email", className: "text-sm font-medium flex items-center gap-2 text-slate-700", children: [
              /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-slate-500" }),
              "Correo (Opcional)"
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "customer_email",
                placeholder: "correo@ejemplo.com",
                type: "email",
                value: form.data.customer_email,
                onChange: (e) => form.setData("customer_email", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "notes", className: "text-sm font-medium flex items-center gap-2 text-slate-700", children: [
              /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-slate-500" }),
              "Notas Especiales"
            ] }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                id: "notes",
                placeholder: "Cumpleaños, alergias, mesa en terraza...",
                value: form.data.notes,
                onChange: (e) => form.setData("notes", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-4", children: [
            /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "flex-1", onClick: () => setStep(1), children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 mr-1" }),
              " Atrás"
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                className: "flex-1 text-white",
                style: { backgroundColor: primaryColor },
                onClick: () => {
                  if (!form.data.customer_name || !form.data.customer_phone) {
                    toast.error("Nombre y Teléfono son obligatorios");
                    return;
                  }
                  setStep(3);
                },
                children: [
                  "Continuar ",
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 ml-1" })
                ]
              }
            )
          ] })
        ] }),
        step === 3 && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          selectedLocation && Number(selectedLocation.reservation_price_per_person ?? 0) > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: "Valor por persona" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-900", children: formatPrice(Number(selectedLocation.reservation_price_per_person)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm font-semibold border-t border-slate-200 pt-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-slate-800", children: [
                "Total (",
                form.data.party_size,
                " ",
                form.data.party_size === 1 ? "persona" : "personas",
                ")"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "font-bold", style: { color: primaryColor }, children: formatPrice(Number(selectedLocation.reservation_price_per_person) * form.data.party_size) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(Banknote, { className: "w-5 h-5 text-blue-600 mt-1" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-semibold text-blue-900", children: "Datos Bancarios" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-700 mb-2", children: "Envía el comprobante a una de las siguientes cuentas:" })
              ] })
            ] }),
            bankAccountsForLocation.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2 mb-4", children: bankAccountsForLocation.map((account) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex justify-between items-center shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-900 text-sm", children: account.bank_name }),
                /* @__PURE__ */ jsx("p", { className: "font-mono text-slate-600 mt-0.5", children: account.account_type }),
                /* @__PURE__ */ jsx("p", { className: "font-mono font-bold text-slate-800 text-sm tracking-wide", children: account.account_number }),
                account.account_holder && /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-400 uppercase mt-1", children: [
                  "Titular: ",
                  account.account_holder
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "icon",
                  variant: "secondary",
                  className: "h-9 w-9 shrink-0 text-slate-600 hover:text-slate-900",
                  onClick: (e) => {
                    e.preventDefault();
                    copyToClipboard(account.account_number);
                  },
                  title: "Copiar número",
                  children: /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" })
                }
              )
            ] }, account.id)) }) : /* @__PURE__ */ jsx("div", { className: "p-3 bg-yellow-50 text-yellow-700 text-xs rounded mb-3 border border-yellow-100", children: bankAccounts?.length ? "No hay cuentas bancarias para esta sede. Consulta al establecimiento." : "No hay cuentas bancarias configuradas. Consulta al establecimiento." }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "proof", className: "text-xs font-bold text-slate-700 flex items-center gap-2", children: [
                "Comprobante de Pago",
                selectedLocation?.reservation_payment_proof_required && /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "text-[10px] h-4 px-1", children: "Obligatorio" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "proof",
                    type: "file",
                    accept: "image/*,application/pdf",
                    className: "hidden",
                    onChange: (e) => {
                      if (e.target.files && e.target.files[0]) {
                        form.setData("payment_proof", e.target.files[0]);
                      }
                    }
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "label",
                  {
                    htmlFor: "proof",
                    className: `cursor-pointer bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm w-full justify-center active:scale-95 ${!form.data.payment_proof && selectedLocation?.reservation_payment_proof_required ? "border-red-300 ring-2 ring-red-100" : ""}`,
                    children: [
                      /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
                      form.data.payment_proof ? "Cambiar archivo" : "Subir Comprobante"
                    ]
                  }
                )
              ] }),
              form.data.payment_proof && /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2 text-green-600 text-xs font-bold animate-in fade-in", children: [
                /* @__PURE__ */ jsx(FileText, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsx("span", { className: "truncate max-w-[250px]", children: form.data.payment_proof.name })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-2", children: "Sube una captura de la transferencia para agilizar la confirmación." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-4", children: [
            /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "flex-1", onClick: () => setStep(2), children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 mr-1" }),
              " Atrás"
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                className: "flex-1 text-white",
                style: { backgroundColor: primaryColor },
                onClick: () => {
                  if (selectedLocation?.reservation_payment_proof_required && !form.data.payment_proof) {
                    toast.error("Debes subir el comprobante de pago para continuar.");
                    return;
                  }
                  setStep(4);
                },
                children: [
                  "Continuar ",
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 ml-1" })
                ]
              }
            )
          ] })
        ] }),
        step === 4 && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 rounded-lg border border-slate-200", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-slate-900 mb-3 border-b pb-2", children: "Resumen de Reserva" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-xs text-slate-500", children: "Ubicación" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: selectedLocation?.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-xs text-slate-500", children: "Personas" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: form.data.party_size })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-xs text-slate-500", children: "Fecha" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: format(parse(form.data.reservation_date, "yyyy-MM-dd", /* @__PURE__ */ new Date()), "EEEE d 'de' MMMM 'de' yyyy", { locale: es }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-xs text-slate-500", children: "Hora" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: form.data.reservation_time ? format(parse(form.data.reservation_time, "HH:mm", /* @__PURE__ */ new Date()), "h:mm a") : "-" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-slate-900 mt-4 mb-3 border-b pb-2", children: "Datos de Contacto" }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm space-y-1", children: [
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 w-16 inline-block", children: "Nombre:" }),
                " ",
                form.data.customer_name
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 w-16 inline-block", children: "Tel:" }),
                " ",
                form.data.customer_phone
              ] }),
              form.data.customer_email && /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 w-16 inline-block", children: "Email:" }),
                " ",
                form.data.customer_email
              ] })
            ] }),
            form.data.payment_proof && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded text-sm", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "Comprobante adjuntado" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-4", children: [
            /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "flex-1", onClick: () => setStep(3), children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 mr-1" }),
              " Editar"
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                className: "flex-1 bg-green-600 hover:bg-green-700",
                onClick: handleSubmit,
                disabled: form.processing,
                children: form.processing ? "Enviando..." : "Confirmar Reserva"
              }
            )
          ] })
        ] }),
        step === 5 && /* @__PURE__ */ jsxs("div", { className: "py-8 text-center space-y-6", children: [
          /* @__PURE__ */ jsx("div", { className: "mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-8 h-8 text-green-600" }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-900", children: "¡Reserva Solicitada!" }),
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-100 p-4 rounded-lg inline-block w-full max-w-xs", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 uppercase tracking-widest mb-1", children: "Código de Reserva" }),
              /* @__PURE__ */ jsxs("p", { className: "text-3xl font-mono font-black tracking-wider", style: { color: primaryColor }, children: [
                "#",
                String(createdReservation?.id || "000").padStart(4, "0")
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 rounded-lg w-full max-w-sm mx-auto border border-slate-200 text-left space-y-3 shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-slate-500 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4" }),
                  " Ubicación:"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-900", children: selectedLocation?.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-slate-500 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
                  " Fecha:"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-900", children: format(parse(form.data.reservation_date, "yyyy-MM-dd", /* @__PURE__ */ new Date()), "EEEE d 'de' MMMM", { locale: es }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-slate-500 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }),
                  " Hora:"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "font-bold px-2 py-0.5 rounded", style: { backgroundColor: `${primaryColor}22`, color: primaryColor }, children: form.data.reservation_time ? format(parse(form.data.reservation_time, "HH:mm", /* @__PURE__ */ new Date()), "h:mm a") : "-" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-slate-500 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Users, { className: "w-4 h-4" }),
                  " Personas:"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-900", children: form.data.party_size })
              ] }),
              selectedLocation && Number(selectedLocation.reservation_price_per_person ?? 0) > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm border-t border-slate-200 pt-2 mt-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-600 font-medium", children: "Valor pagado" }),
                /* @__PURE__ */ jsx("span", { className: "font-bold", style: { color: primaryColor }, children: formatPrice(Number(selectedLocation.reservation_price_per_person) * form.data.party_size) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-slate-600 text-sm max-w-sm mx-auto", children: [
              "Hemos recibido tu solicitud. Te enviaremos una confirmación a tu WhatsApp ",
              /* @__PURE__ */ jsx("strong", { children: form.data.customer_phone }),
              " en breve."
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  className: "text-white",
                  style: { backgroundColor: primaryColor },
                  onClick: () => router.visit(route("tenant.reservations.index", tenant.slug)),
                  children: [
                    /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4 mr-2" }),
                    "Hacer otra reserva"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsx("a", { href: route("tenant.home", tenant.slug), children: "Volver al inicio" }) })
            ] })
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  ReservationIndex as default
};
