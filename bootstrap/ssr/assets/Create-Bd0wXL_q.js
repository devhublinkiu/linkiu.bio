import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { B as Button } from "./button-BdX_X5dq.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, e as CardFooter } from "./card-BaovBWX5.js";
import { C as Checkbox } from "./checkbox-dJXZmgY3.js";
import { F as FieldError } from "./field-BEfz_npx.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { I as InputGroup, a as InputGroupAddon, b as InputGroupInput } from "./input-group-BFAJKiYP.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { S as SuperAdminLayout } from "./SuperAdminLayout-C_fBwscp.js";
import { c as cn } from "./utils-B0hQsrDj.js";
import { useForm, Head } from "@inertiajs/react";
import { ShoppingBag, CreditCard, User, Building2, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-checkbox";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./textarea-BpljFL5D.js";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "./dropdown-menu-B2I3vWlQ.js";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./sheet-BclLUCFD.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./ApplicationLogo-xMpxFOcX.js";
import "clsx";
import "tailwind-merge";
function Create({ verticals, plans }) {
  const getSavedData = () => {
    const saved = localStorage.getItem("tenant_wizard_draft");
    return saved ? JSON.parse(saved) : null;
  };
  const savedData = getSavedData();
  const [currentStep, setCurrentStep] = useState(savedData?.currentStep || 1);
  const { data, setData, post, processing, errors, reset } = useForm({
    vertical_id: savedData?.data?.vertical_id || "",
    category_id: savedData?.data?.category_id || "",
    plan_id: savedData?.data?.plan_id || "",
    billing_cycle: savedData?.data?.billing_cycle || "monthly",
    owner_name: savedData?.data?.owner_name || "",
    owner_email: savedData?.data?.owner_email || "",
    owner_doc_type: savedData?.data?.owner_doc_type || "CC",
    owner_doc_number: savedData?.data?.owner_doc_number || "",
    owner_phone: savedData?.data?.owner_phone || "",
    owner_address: savedData?.data?.owner_address || "",
    owner_country: savedData?.data?.owner_country || "Colombia",
    owner_state: savedData?.data?.owner_state || "",
    owner_city: savedData?.data?.owner_city || "",
    owner_password: savedData?.data?.owner_password || "",
    tenant_name: savedData?.data?.tenant_name || "",
    slug: savedData?.data?.slug || "",
    regime: savedData?.data?.regime || "comun",
    tenant_doc_type: savedData?.data?.tenant_doc_type || "NIT",
    tenant_doc_number: savedData?.data?.tenant_doc_number || "",
    verification_digit: savedData?.data?.verification_digit || "",
    tenant_contact_email: savedData?.data?.tenant_contact_email || "",
    tenant_address: savedData?.data?.tenant_address || "",
    tenant_state: savedData?.data?.tenant_state || "",
    tenant_city: savedData?.data?.tenant_city || "",
    use_owner_address: savedData?.data?.use_owner_address || false
  });
  useEffect(() => {
    localStorage.setItem("tenant_wizard_draft", JSON.stringify({ data, currentStep }));
  }, [data, currentStep]);
  const clearDraft = () => {
    localStorage.removeItem("tenant_wizard_draft");
    reset();
    setCurrentStep(1);
    toast.success("Formulario reiniciado");
  };
  const availableCategories = verticals.find((v) => v.id.toString() === data.vertical_id)?.categories || [];
  const filteredPlans = plans.filter((p) => p.vertical_id.toString() === data.vertical_id);
  const selectedPlan = plans.find((p) => p.id.toString() === data.plan_id);
  const allowCustomSlug = selectedPlan?.allow_custom_slug !== false;
  useEffect(() => {
    if (!data.tenant_name) return;
    const baseSlug = data.tenant_name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    if (!allowCustomSlug) {
      const length = baseSlug.length;
      let generatedSlug;
      if (length > 6) {
        const start = baseSlug.substring(0, 2);
        const end = baseSlug.substring(length - 4);
        const randomMiddle = Math.random().toString(36).substring(2, 6);
        generatedSlug = start + randomMiddle + end;
      } else {
        const randomSuffix = Math.random().toString(36).substring(2, 5);
        generatedSlug = baseSlug + randomSuffix;
      }
      setData("slug", generatedSlug);
    } else {
      if (!data.slug) setData("slug", baseSlug);
    }
  }, [data.tenant_name, allowCustomSlug]);
  useEffect(() => {
    if (data.use_owner_address) {
      setData((prev) => ({
        ...prev,
        tenant_address: prev.owner_address,
        tenant_state: prev.owner_state,
        tenant_city: prev.owner_city
      }));
    }
  }, [data.use_owner_address, data.owner_address, data.owner_state, data.owner_city]);
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const step1Fields = ["vertical_id", "category_id"];
      const step2Fields = ["plan_id", "billing_cycle"];
      const step3Fields = ["owner_name", "owner_email", "owner_doc_number", "owner_password", "owner_address", "owner_doc_type", "owner_phone", "owner_state", "owner_city"];
      const hasError = (fields) => fields.some((f) => errors[f]);
      if (hasError(step1Fields)) setCurrentStep(1);
      else if (hasError(step2Fields)) setCurrentStep(2);
      else if (hasError(step3Fields)) setCurrentStep(3);
      else setCurrentStep(4);
      toast.error("Por favor verifica los campos resaltados en rojo.");
    }
  }, [errors]);
  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("tenants.store"), {
      onSuccess: () => {
        localStorage.removeItem("tenant_wizard_draft");
        toast.success("¡Tienda, Usuario y Suscripción creados!");
      },
      onError: (err) => {
        console.error("Submission Error:", err);
      }
    });
  };
  const steps = [
    { id: 1, title: "Concepto", icon: ShoppingBag, desc: "Vertical y Categoría" },
    { id: 2, title: "Plan", icon: CreditCard, desc: "Suscripción y Ciclo" },
    { id: 3, title: "Propietario", icon: User, desc: "Datos Personales" },
    { id: 4, title: "Negocio", icon: Building2, desc: "Datos Fiscales" }
  ];
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: "Alta de Nueva Tienda", children: [
    /* @__PURE__ */ jsx(Head, { title: "Nueva Tienda" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto py-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-end mb-4", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: clearDraft, className: "text-red-500 hover:text-red-700 hover:bg-red-50", children: "Reiniciar Formulario" }) }),
      /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-6 w-full h-1 bg-gray-100 -z-10 rounded-full", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full bg-blue-600 transition-all duration-500 rounded-full",
            style: { width: (currentStep - 1) / 3 * 100 + "%" }
          }
        ) }),
        steps.map((step) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-lg", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                currentStep >= step.id ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border-gray-200 text-gray-400"
              ),
              children: /* @__PURE__ */ jsx(step.icon, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: cn("text-xs font-bold uppercase tracking-wider", currentStep >= step.id ? "text-blue-700" : "text-gray-400"), children: step.title }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 font-medium hidden sm:block", children: step.desc })
          ] })
        ] }, step.id))
      ] }) }),
      /* @__PURE__ */ jsx("form", { onSubmit: submit, children: /* @__PURE__ */ jsxs(Card, { className: "min-h-[400px] flex flex-col justify-between shadow-xl border-gray-200", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "bg-gray-50/50 border-b pb-8", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-xl flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold", children: currentStep }),
            steps[currentStep - 1].title
          ] }),
          /* @__PURE__ */ jsxs(CardDescription, { children: [
            "Completa la información solicitada en el paso ",
            currentStep,
            " de 4."
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "pt-8", children: [
          currentStep === 1 && /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500", children: [
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Vertical de Negocio" }),
              /* @__PURE__ */ jsxs(Select, { value: data.vertical_id, onValueChange: (val) => setData("vertical_id", val), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "h-12 border-blue-100 bg-blue-50/30", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona una vertical..." }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: verticals.map((v) => /* @__PURE__ */ jsx(SelectItem, { value: v.id.toString(), children: v.name }, v.id)) })
              ] }),
              /* @__PURE__ */ jsx(FieldError, { children: errors.vertical_id })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Categoría Específica" }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  value: data.category_id,
                  onValueChange: (val) => setData("category_id", val),
                  disabled: !data.vertical_id,
                  children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { className: "h-12", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona una categoría..." }) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: availableCategories.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c.id.toString(), children: c.name }, c.id)) })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(FieldError, { children: errors.category_id })
            ] }) })
          ] }),
          currentStep === 2 && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-right-4 duration-500", children: [
            /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-6", children: filteredPlans.length === 0 ? /* @__PURE__ */ jsx("div", { className: "col-span-3 py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl", children: "No hay planes disponibles para esta vertical." }) : filteredPlans.map((plan) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: cn(
                  "cursor-pointer border rounded-xl p-6 transition-all hover:shadow-lg relative",
                  data.plan_id === plan.id.toString() ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : "border-gray-200 bg-white"
                ),
                onClick: () => setData("plan_id", plan.id.toString()),
                children: [
                  data.plan_id === plan.id.toString() && /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 text-blue-600", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-6 w-6" }) }),
                  /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg mb-1", children: plan.name }),
                  /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-gray-900 mb-2", children: [
                    new Intl.NumberFormat("es-CO", { style: "currency", currency: plan.currency }).format(plan.monthly_price),
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-normal text-muted-foreground", children: "/mes" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-4 line-clamp-2", children: plan.description }),
                  plan.allow_custom_slug === false && /* @__PURE__ */ jsx("div", { className: "mt-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded inline-block", children: "Slug automático" })
                ]
              },
              plan.id
            )) }),
            /* @__PURE__ */ jsx(FieldError, { className: "text-center", children: errors.plan_id }),
            /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto p-6 bg-gray-50 rounded-xl border", children: [
              /* @__PURE__ */ jsx(Label, { className: "mb-4 block text-center font-medium", children: "Ciclo de Facturación" }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: ["monthly", "quarterly", "semiannual", "yearly"].map((cycle) => /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setData("billing_cycle", cycle),
                  className: cn(
                    "px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
                    data.billing_cycle === cycle ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                  ),
                  children: [
                    cycle === "monthly" && "Mensual",
                    cycle === "quarterly" && "Trimestral",
                    cycle === "semiannual" && "Semestral",
                    cycle === "yearly" && "Anual"
                  ]
                },
                cycle
              )) })
            ] })
          ] }),
          currentStep === 3 && /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-x-8 gap-y-4 animate-in fade-in slide-in-from-right-4 duration-500", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "owner_name", children: "Nombre Completo" }),
              /* @__PURE__ */ jsx(Input, { id: "owner_name", name: "owner_name", value: data.owner_name, onChange: (e) => setData("owner_name", e.target.value) }),
              /* @__PURE__ */ jsx(FieldError, { children: errors.owner_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "owner_email", children: "Correo Electrónico" }),
              /* @__PURE__ */ jsx(Input, { id: "owner_email", name: "owner_email", type: "email", value: data.owner_email, onChange: (e) => setData("owner_email", e.target.value) }),
              /* @__PURE__ */ jsx(FieldError, { children: errors.owner_email })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Tipo Doc" }),
                /* @__PURE__ */ jsxs(Select, { value: data.owner_doc_type, onValueChange: (val) => setData("owner_doc_type", val), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "CC", children: "CC" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "CE", children: "CE" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "PAS", children: "Pasaporte" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "col-span-2 space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "owner_doc_number", children: "Número Documento" }),
                /* @__PURE__ */ jsx(Input, { id: "owner_doc_number", name: "owner_doc_number", value: data.owner_doc_number, onChange: (e) => setData("owner_doc_number", e.target.value) }),
                /* @__PURE__ */ jsx(FieldError, { children: errors.owner_doc_number })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "owner_phone", children: "Celular / WhatsApp" }),
              /* @__PURE__ */ jsx(Input, { id: "owner_phone", name: "owner_phone", value: data.owner_phone, onChange: (e) => setData("owner_phone", e.target.value) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "owner_address", children: "Dirección Personal" }),
              /* @__PURE__ */ jsx(Input, { id: "owner_address", name: "owner_address", value: data.owner_address, onChange: (e) => setData("owner_address", e.target.value) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4 md:col-span-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "owner_country", children: "País" }),
                /* @__PURE__ */ jsx(Input, { id: "owner_country", name: "owner_country", value: data.owner_country, onChange: (e) => setData("owner_country", e.target.value), readOnly: true, className: "bg-gray-50" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "owner_state", children: "Departamento" }),
                /* @__PURE__ */ jsx(Input, { id: "owner_state", name: "owner_state", value: data.owner_state, onChange: (e) => setData("owner_state", e.target.value) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "owner_city", children: "Ciudad" }),
                /* @__PURE__ */ jsx(Input, { id: "owner_city", name: "owner_city", value: data.owner_city, onChange: (e) => setData("owner_city", e.target.value) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2 pt-4 border-t", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "owner_password", className: "text-red-600", children: "Contraseña Temporal" }),
              /* @__PURE__ */ jsx(Input, { id: "owner_password", name: "owner_password", type: "text", value: data.owner_password, onChange: (e) => setData("owner_password", e.target.value), placeholder: "Asignar contraseña de acceso..." }),
              /* @__PURE__ */ jsx(FieldError, { children: errors.owner_password })
            ] })
          ] }),
          currentStep === 4 && /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-x-8 gap-y-4 animate-in fade-in slide-in-from-right-4 duration-500", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "tenant_name", children: "Nombre del Negocio (Público)" }),
              /* @__PURE__ */ jsx(Input, { id: "tenant_name", name: "tenant_name", value: data.tenant_name ?? "", onChange: (e) => setData("tenant_name", e.target.value) }),
              /* @__PURE__ */ jsx(FieldError, { children: errors.tenant_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "slug", children: "Slug (URL)" }),
              /* @__PURE__ */ jsxs(InputGroup, { children: [
                /* @__PURE__ */ jsx(InputGroupAddon, { className: "bg-muted text-muted-foreground border-r-0", children: "linkiu.bio/" }),
                /* @__PURE__ */ jsx(
                  InputGroupInput,
                  {
                    id: "slug",
                    name: "slug",
                    className: cn("text-sm", !allowCustomSlug && "bg-muted text-muted-foreground cursor-not-allowed"),
                    value: data.slug ?? "",
                    onChange: (e) => setData("slug", e.target.value),
                    readOnly: !allowCustomSlug
                  }
                )
              ] }),
              !allowCustomSlug && /* @__PURE__ */ jsxs("p", { className: "text-xs text-amber-600 mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-block w-1 h-1 bg-amber-600 rounded-full" }),
                "Este plan genera un slug único mezclando caracteres aleatorios"
              ] }),
              /* @__PURE__ */ jsx(FieldError, { children: errors.slug })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Régimen Fiscal" }),
              /* @__PURE__ */ jsxs(Select, { value: data.regime, onValueChange: (val) => setData("regime", val), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "comun", children: "Responsable de IVA" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "simple", children: "No Responsable de IVA" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "especial", children: "Régimen Simple / Especial" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2 col-span-1", children: [
                /* @__PURE__ */ jsx(Label, { children: "Doc" }),
                /* @__PURE__ */ jsxs(Select, { value: data.tenant_doc_type, onValueChange: (val) => setData("tenant_doc_type", val), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "NIT", children: "NIT" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "RUT", children: "RUT" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "col-span-2 space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "tenant_doc_number", children: "Número" }),
                /* @__PURE__ */ jsx(Input, { id: "tenant_doc_number", name: "tenant_doc_number", value: data.tenant_doc_number ?? "", onChange: (e) => setData("tenant_doc_number", e.target.value) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "col-span-1 space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "verification_digit", children: "DV" }),
                /* @__PURE__ */ jsx(Input, { id: "verification_digit", name: "verification_digit", value: data.verification_digit ?? "", maxLength: 1, onChange: (e) => setData("verification_digit", e.target.value) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 flex items-center gap-2 py-2", children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  id: "use_owner_address",
                  checked: data.use_owner_address,
                  onCheckedChange: (val) => setData("use_owner_address", val === true)
                }
              ),
              /* @__PURE__ */ jsx(Label, { htmlFor: "use_owner_address", className: "font-normal cursor-pointer", children: "Usar la misma dirección del propietario" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "tenant_address", children: "Dirección Fiscal" }),
              /* @__PURE__ */ jsx(Input, { id: "tenant_address", name: "tenant_address", value: data.tenant_address ?? "", onChange: (e) => setData("tenant_address", e.target.value), disabled: data.use_owner_address })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "tenant_state", children: "Departamento" }),
              /* @__PURE__ */ jsx(Input, { id: "tenant_state", name: "tenant_state", value: data.tenant_state ?? "", onChange: (e) => setData("tenant_state", e.target.value), disabled: data.use_owner_address })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "tenant_city", children: "Ciudad" }),
              /* @__PURE__ */ jsx(Input, { id: "tenant_city", name: "tenant_city", value: data.tenant_city ?? "", onChange: (e) => setData("tenant_city", e.target.value), disabled: data.use_owner_address })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2 pt-4", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "tenant_contact_email", children: "Email de Contacto (Público)" }),
              /* @__PURE__ */ jsx(Input, { id: "tenant_contact_email", name: "tenant_contact_email", value: data.tenant_contact_email ?? "", onChange: (e) => setData("tenant_contact_email", e.target.value), placeholder: "contacto@mitienda.com" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardFooter, { className: "bg-gray-50 flex justify-between border-t py-6", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: prevStep,
              disabled: currentStep === 1 || processing,
              children: [
                /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }),
                "Anterior"
              ]
            }
          ),
          currentStep < 4 ? /* @__PURE__ */ jsxs(Button, { type: "button", onClick: nextStep, disabled: processing, children: [
            "Siguiente",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 ml-2" })
          ] }) : /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, className: "bg-green-600 hover:bg-green-700 w-48", children: processing ? "Creando Tienda..." : /* @__PURE__ */ jsxs(Fragment, { children: [
            "Finalizar y Crear",
            /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 ml-2" })
          ] }) })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Create as default
};
