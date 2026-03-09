import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { P as PublicLayout, H as Header } from "./Header-DqQsy9AV.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { Banknote, Upload, Loader2 } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import "./ReportBusinessStrip-U20bW72V.js";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./textarea-BpljFL5D.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
function DonationsIndex({ tenant, bankAccounts }) {
  const brandColors = tenant.brand_colors ?? {};
  const bg_color = brandColors.bg_color ?? "#1e3a5f";
  const fileInputRef = useRef(null);
  const { data, setData, post, processing, errors } = useForm({
    donor_name: "",
    donor_phone: "",
    amount: "",
    bank_account_id: null,
    proof: null
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("tenant.public.donations.store", tenant.slug), {
      forceFormData: !!data.proof,
      preserveScroll: true,
      onSuccess: () => {
      },
      onError: () => toast.error("Revisa los campos e intenta de nuevo.")
    });
  };
  return /* @__PURE__ */ jsxs(PublicLayout, { bgColor: bg_color, children: [
    /* @__PURE__ */ jsx(Head, { title: "Donaciones" }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsx(
      Header,
      {
        tenantName: tenant.name,
        description: tenant.store_description,
        logoUrl: tenant.logo_url,
        bgColor: bg_color,
        textColor: brandColors.name_color ?? "#ffffff",
        descriptionColor: brandColors.description_color
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 bg-slate-50/80 p-4 -mt-4 pb-20 pt-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-lg mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsx(Banknote, { className: "size-6 text-primary" }),
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-slate-900", children: "Donaciones" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 mb-6", children: "Tu ofrenda sostiene la obra. Indica tus datos para poder agradecerte y, si ya realizaste la transferencia, puedes subir tu comprobante (opcional)." }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4 rounded-2xl bg-white border border-slate-100 p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "donor_name", children: "Nombre *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "donor_name",
              value: data.donor_name,
              onChange: (e) => setData("donor_name", e.target.value),
              placeholder: "Tu nombre",
              className: errors.donor_name ? "border-destructive" : ""
            }
          ),
          errors.donor_name && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.donor_name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "donor_phone", children: "Celular *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "donor_phone",
              type: "tel",
              value: data.donor_phone,
              onChange: (e) => setData("donor_phone", e.target.value),
              placeholder: "300 123 4567",
              className: errors.donor_phone ? "border-destructive" : ""
            }
          ),
          errors.donor_phone && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.donor_phone })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "amount", children: "Monto (COP) *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "amount",
              type: "number",
              min: 1,
              step: 1,
              value: data.amount === "" ? "" : data.amount,
              onChange: (e) => setData("amount", e.target.value === "" ? "" : Number(e.target.value) || 0),
              placeholder: "Ej: 50000",
              className: errors.amount ? "border-destructive" : ""
            }
          ),
          errors.amount && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.amount })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Comprobante de pago (opcional)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              accept: ".jpg,.jpeg,.png,.pdf",
              className: "hidden",
              onChange: (e) => setData("proof", e.target.files?.[0] ?? null)
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              className: "w-full gap-2",
              onClick: () => fileInputRef.current?.click(),
              children: [
                /* @__PURE__ */ jsx(Upload, { className: "size-4" }),
                data.proof ? data.proof.name : "Seleccionar imagen o PDF"
              ]
            }
          ),
          errors.proof && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.proof })
        ] }),
        /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: processing, className: "w-full gap-2", children: [
          processing && /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }),
          "Enviar"
        ] })
      ] }),
      bankAccounts.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-8 rounded-2xl bg-white border border-slate-100 p-6 shadow-sm", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-slate-900 mb-3", children: "Dónde transferir o consignar" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 mb-4", children: "Puedes realizar tu ofrenda a cualquiera de estas cuentas:" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-4", children: bankAccounts.map((acc) => /* @__PURE__ */ jsxs(
          "li",
          {
            className: "p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm",
            children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900", children: acc.bank_name }),
              /* @__PURE__ */ jsxs("p", { className: "text-slate-600", children: [
                acc.account_type,
                ": ",
                /* @__PURE__ */ jsx("span", { className: "font-mono font-medium", children: acc.account_number })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-slate-600", children: [
                "Titular: ",
                acc.account_holder
              ] }),
              acc.holder_id && /* @__PURE__ */ jsxs("p", { className: "text-slate-600", children: [
                "NIT / Cédula: ",
                acc.holder_id
              ] })
            ]
          },
          acc.id
        )) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-center mt-6", children: /* @__PURE__ */ jsx(
        Link,
        {
          href: route("tenant.home", tenant.slug),
          className: "text-sm text-primary hover:underline",
          children: "← Volver al inicio"
        }
      ) })
    ] }) })
  ] });
}
export {
  DonationsIndex as default
};
