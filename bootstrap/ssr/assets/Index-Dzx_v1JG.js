import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CvP9QKT2.js";
import { usePage, Head, router, useForm } from "@inertiajs/react";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BaovBWX5.js";
import { S as Switch } from "./switch-7q5oG5BF.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { B as Button } from "./button-BdX_X5dq.js";
import { B as Badge } from "./badge-C_PGNHO8.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { Smartphone, Plus, Wallet, Banknote, CreditCard, Building2, Copy, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { P as PermissionDeniedModal } from "./dropdown-menu-BCxMx_rd.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-rtCrEhXP.js";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-switch";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "vaul";
import "axios";
import "./sheet-DFnQxYfh.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-alert-dialog";
function Index({ tenant, paymentMethods, bankAccounts, bank_accounts_limit, bank_accounts_count, locations }) {
  const { currentUserRole } = usePage().props;
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState(null);
  const hasPermission = (permission) => {
    if (!currentUserRole) return false;
    return currentUserRole.is_owner === true || currentUserRole.permissions?.includes("*") === true || currentUserRole.permissions?.includes(permission) === true;
  };
  const atLimit = bank_accounts_limit !== null && bank_accounts_count >= bank_accounts_limit;
  const bankAccountsList = bankAccounts.data;
  const handleProtectedAction = (e, permission, callback) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!hasPermission(permission)) {
      setShowPermissionModal(true);
    } else {
      callback();
    }
  };
  const getMethod = (type) => paymentMethods.find((m) => m.type === type);
  const transferMethod = getMethod("bank_transfer");
  const cashMethod = getMethod("cash");
  const dataphoneMethod = getMethod("dataphone");
  const toggleMethod = (method, isActive) => {
    if (!hasPermission("payment_methods.update")) {
      setShowPermissionModal(true);
      return;
    }
    const payload = {
      is_active: isActive,
      settings: method.settings ?? {},
      location_id: method.location_id
    };
    router.put(route("tenant.payment-methods.update.method", { tenant: tenant.slug, method: method.id }), payload, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => toast.success(isActive ? "Método activado" : "Método desactivado"),
      onError: () => toast.error("Error actualizando método")
    });
  };
  const updateSettings = (method, newSettings) => {
    if (!hasPermission("payment_methods.update")) {
      setShowPermissionModal(true);
      return;
    }
    const payload = {
      is_active: method.is_active,
      location_id: method.location_id,
      settings: { ...method.settings ?? {}, ...newSettings }
    };
    router.put(route("tenant.payment-methods.update.method", { tenant: tenant.slug, method: method.id }), payload, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => toast.success("Configuración actualizada"),
      onError: () => toast.error("Error actualizando configuración")
    });
  };
  const confirmDeleteAccount = () => {
    if (!accountToDelete) return;
    router.delete(route("tenant.payment-methods.accounts.destroy", { tenant: tenant.slug, account: accountToDelete.id }), {
      onSuccess: () => {
        toast.success("Cuenta eliminada");
        setAccountToDelete(null);
      }
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Métodos de Pago", children: [
    /* @__PURE__ */ jsx(Head, { title: "Métodos de Pago - Linkiu.Bio" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto py-8 text-slate-900", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-black text-slate-900 tracking-tight", children: "Métodos de Pago" }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-500 font-medium", children: [
          "Define cómo quieres recibir el dinero de tus clientes.",
          bank_accounts_limit !== null && /* @__PURE__ */ jsxs("span", { className: "ml-1 font-medium text-foreground", children: [
            "(",
            bank_accounts_count,
            " / ",
            bank_accounts_limit,
            " cuentas bancarias)"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs(Card, { className: `border-2 transition-all ${transferMethod?.is_active ? "border-primary/50 shadow-lg shadow-primary/5" : "border-slate-100"}`, children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-blue-100 text-blue-600 rounded-xl", children: /* @__PURE__ */ jsx(Smartphone, { className: "w-6 h-6" }) }),
              /* @__PURE__ */ jsx(
                Switch,
                {
                  checked: transferMethod?.is_active,
                  onCheckedChange: (checked) => transferMethod && toggleMethod(transferMethod, checked)
                }
              )
            ] }),
            /* @__PURE__ */ jsx(CardTitle, { className: "mt-4", children: "Transferencia Bancaria" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Nequi, Daviplata, Bancolombia, etc." })
          ] }),
          transferMethod?.is_active && /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs font-bold uppercase text-slate-500", children: "Exigir Comprobante" }),
              /* @__PURE__ */ jsx(
                Switch,
                {
                  checked: transferMethod.settings?.require_proof !== false,
                  onCheckedChange: (checked) => updateSettings(transferMethod, { require_proof: checked })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-3", children: [
                /* @__PURE__ */ jsxs("h4", { className: "text-sm font-bold", children: [
                  "Cuentas (",
                  bankAccounts.total,
                  ")"
                ] }),
                atLimit ? /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", className: "h-7 text-xs gap-1", disabled: true, title: "Has alcanzado el máximo de cuentas bancarias permitidas en tu plan", children: [
                  /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" }),
                  " Agregar"
                ] }) : /* @__PURE__ */ jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "h-7 text-xs gap-1 cursor-pointer",
                    onClick: (e) => handleProtectedAction(e, "payment_methods.create", () => setShowAddModal(true)),
                    children: [
                      /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" }),
                      " Agregar"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-[300px] overflow-y-auto pr-1", children: bankAccountsList.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50", children: [
                /* @__PURE__ */ jsx("div", { className: "rounded-full bg-primary/10 p-3 mb-3", children: /* @__PURE__ */ jsx(Wallet, { className: "size-8 text-primary" }) }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-600 mb-1", children: "No tienes cuentas registradas" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mb-3", children: "Agrega una cuenta para recibir transferencias." }),
                !atLimit && /* @__PURE__ */ jsxs(Button, { size: "sm", className: "cursor-pointer", onClick: () => handleProtectedAction(null, "payment_methods.create", () => setShowAddModal(true)), children: [
                  /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5 mr-1" }),
                  " Agregar primera cuenta"
                ] })
              ] }) : bankAccountsList.map((account) => /* @__PURE__ */ jsx(
                AccountItem,
                {
                  account,
                  onDelete: (a) => handleProtectedAction(null, "payment_methods.delete", () => setAccountToDelete(a)),
                  onEdit: (a) => handleProtectedAction(null, "payment_methods.update", () => setAccountToEdit(a))
                },
                account.id
              )) }),
              bankAccounts.last_page > 1 && /* @__PURE__ */ jsx("div", { className: "mt-3 pt-3 border-t border-slate-100", children: /* @__PURE__ */ jsx(SharedPagination, { links: bankAccounts.links }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: `border-2 transition-all ${cashMethod?.is_active ? "border-green-500/50 shadow-lg shadow-green-500/5" : "border-slate-100"}`, children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-green-100 text-green-600 rounded-xl", children: /* @__PURE__ */ jsx(Banknote, { className: "w-6 h-6" }) }),
              /* @__PURE__ */ jsx(
                Switch,
                {
                  checked: cashMethod?.is_active,
                  onCheckedChange: (checked) => cashMethod && toggleMethod(cashMethod, checked)
                }
              )
            ] }),
            /* @__PURE__ */ jsx(CardTitle, { className: "mt-4", children: "Efectivo" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Pago contra entrega o en caja." })
          ] }),
          cashMethod?.is_active && /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs font-bold uppercase text-slate-500", children: "Preguntar cuánto devuelta necesita" }),
            /* @__PURE__ */ jsx(
              Switch,
              {
                checked: cashMethod.settings?.ask_change !== false,
                onCheckedChange: (checked) => updateSettings(cashMethod, { ask_change: checked })
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(Card, { className: `border-2 transition-all ${dataphoneMethod?.is_active ? "border-purple-500/50 shadow-lg shadow-purple-500/5" : "border-slate-100"}`, children: /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-purple-100 text-purple-600 rounded-xl", children: /* @__PURE__ */ jsx(CreditCard, { className: "w-6 h-6" }) }),
            /* @__PURE__ */ jsx(
              Switch,
              {
                checked: dataphoneMethod?.is_active,
                onCheckedChange: (checked) => dataphoneMethod && toggleMethod(dataphoneMethod, checked)
              }
            )
          ] }),
          /* @__PURE__ */ jsx(CardTitle, { className: "mt-4", children: "Datáfono" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Llevamos terminal para tarjetas." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(
        PermissionDeniedModal,
        {
          open: showPermissionModal,
          onOpenChange: setShowPermissionModal
        }
      ),
      /* @__PURE__ */ jsx(AlertDialog, { open: !!accountToDelete, onOpenChange: (open) => !open && setAccountToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { className: "border-red-100", children: [
        /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Seguro que deseas eliminar esta cuenta?" }),
          /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Esta acción no se puede deshacer. La cuenta bancaria será eliminada permanentemente." })
        ] }),
        /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
          /* @__PURE__ */ jsx(AlertDialogCancel, { className: "cursor-pointer", children: "Cancelar" }),
          /* @__PURE__ */ jsx(AlertDialogAction, { variant: "destructive", onClick: confirmDeleteAccount, className: "cursor-pointer", children: "Eliminar Cuenta" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(
        AddAccountModal,
        {
          isOpen: showAddModal,
          onClose: () => setShowAddModal(false),
          locations,
          tenant,
          atLimit
        }
      ),
      accountToEdit && /* @__PURE__ */ jsx(
        EditAccountModal,
        {
          isOpen: !!accountToEdit,
          onClose: () => setAccountToEdit(null),
          account: accountToEdit,
          locations,
          tenant
        }
      )
    ] })
  ] });
}
function AccountItem({ account, onDelete, onEdit }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center group", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold text-sm text-slate-800", children: account.bank_name }),
        /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-[9px] h-4 px-1", children: account.account_type }),
        account.location && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[9px] h-4 px-1 border-primary/20 bg-primary/5 text-primary", children: [
          /* @__PURE__ */ jsx(Building2, { className: "w-2 h-2 mr-1" }),
          account.location.name
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-1", children: [
        account.account_number,
        /* @__PURE__ */ jsx(Copy, { className: "w-3 h-3 cursor-pointer hover:text-primary", onClick: () => {
          navigator.clipboard.writeText(account.account_number);
          toast.success("Copiado");
        } })
      ] }),
      account.account_holder && /* @__PURE__ */ jsx("div", { className: "text-[10px] text-slate-400 font-medium truncate max-w-[150px]", children: account.account_holder })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity", children: [
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: () => onEdit(account), children: /* @__PURE__ */ jsx(Edit, { className: "w-3.5 h-3.5 text-slate-500" }) }),
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 hover:bg-red-50 hover:text-red-600", onClick: () => onDelete(account), children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }) })
    ] })
  ] });
}
function AddAccountModal({ isOpen, onClose, locations, tenant, atLimit }) {
  const { data, setData, post, processing, reset, errors } = useForm({
    bank_name: "",
    account_type: "Ahorros",
    account_number: "",
    account_holder: "",
    holder_id: "",
    location_id: "",
    is_active: true
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("tenant.payment-methods.accounts.store", { tenant: tenant.slug }), {
      onSuccess: () => {
        toast.success("Cuenta agregada");
        onClose();
        reset();
      },
      onError: () => toast.error("Revisa los campos del formulario")
    });
  };
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Nueva Cuenta Bancaria" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "¿A qué cuenta deben transferir tus clientes?" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4 pt-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Banco" }),
          /* @__PURE__ */ jsxs(Select, { value: data.bank_name, onValueChange: (v) => setData("bank_name", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "Nequi", children: "Nequi" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Daviplata", children: "Daviplata" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Bancolombia", children: "Bancolombia" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Davivienda", children: "Davivienda" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "BBVA", children: "BBVA" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Bre-b", children: "Bre-b" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Otros", children: "Otros" })
            ] })
          ] }),
          errors.bank_name && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs", children: errors.bank_name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Tipo" }),
          /* @__PURE__ */ jsxs(Select, { value: data.account_type, onValueChange: (v) => setData("account_type", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "Ahorros", children: "Ahorros" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Corriente", children: "Corriente" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Depósito Electrónico", children: "Depósito Electrónico" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Número de Cuenta (o Celular)" }),
        /* @__PURE__ */ jsx(Input, { value: data.account_number, onChange: (e) => setData("account_number", e.target.value), placeholder: "Ej: 3001234567" }),
        errors.account_number && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs", children: errors.account_number })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Titular" }),
          /* @__PURE__ */ jsx(Input, { value: data.account_holder, onChange: (e) => setData("account_holder", e.target.value) }),
          errors.account_holder && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs", children: errors.account_holder })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Cédula/NIT (Opcional)" }),
          /* @__PURE__ */ jsx(Input, { value: data.holder_id, onChange: (e) => setData("holder_id", e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Sede Asociada (Multisede)" }),
        /* @__PURE__ */ jsxs(Select, { value: data.location_id.toString(), onValueChange: (v) => setData("location_id", v), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "bg-slate-50 border-primary/20 focus:ring-primary", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsx(SelectValue, { placeholder: "Todas las sedes (Global)" })
          ] }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las sedes (Global)" }),
            locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: loc.id.toString(), children: loc.name }, loc.id))
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400", children: "Si seleccionas una sede, esta cuenta solo aparecerá en pedidos de esa sede." })
      ] }),
      /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: processing || atLimit, className: "cursor-pointer", children: [
        processing ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 size-4 animate-spin" }) : null,
        "Guardar Cuenta"
      ] }) })
    ] })
  ] }) });
}
function EditAccountModal({ isOpen, onClose, account, locations, tenant }) {
  const { data, setData, put, processing, errors } = useForm({
    bank_name: account.bank_name,
    account_type: account.account_type,
    account_number: account.account_number,
    account_holder: account.account_holder,
    holder_id: account.holder_id || "",
    location_id: account.location_id ?? "all",
    is_active: account.is_active
  });
  const submit = (e) => {
    e.preventDefault();
    put(route("tenant.payment-methods.accounts.update", { tenant: tenant.slug, account: account.id }), {
      onSuccess: () => {
        toast.success("Cuenta actualizada");
        onClose();
      },
      onError: () => toast.error("Revisa los campos del formulario")
    });
  };
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Editar Cuenta" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4 pt-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Banco" }),
          /* @__PURE__ */ jsxs(Select, { value: data.bank_name, onValueChange: (v) => setData("bank_name", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "Nequi", children: "Nequi" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Daviplata", children: "Daviplata" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Bancolombia", children: "Bancolombia" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Davivienda", children: "Davivienda" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "BBVA", children: "BBVA" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Bre-b", children: "Bre-b" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Otros", children: "Otros" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Tipo" }),
          /* @__PURE__ */ jsxs(Select, { value: data.account_type, onValueChange: (v) => setData("account_type", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "Ahorros", children: "Ahorros" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Corriente", children: "Corriente" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Depósito Electrónico", children: "Depósito Electrónico" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Número" }),
        /* @__PURE__ */ jsx(Input, { value: data.account_number, onChange: (e) => setData("account_number", e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Titular" }),
          /* @__PURE__ */ jsx(Input, { value: data.account_holder, onChange: (e) => setData("account_holder", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "ID (Opcional)" }),
          /* @__PURE__ */ jsx(Input, { value: data.holder_id, onChange: (e) => setData("holder_id", e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Sede Asociada (Multisede)" }),
        /* @__PURE__ */ jsxs(Select, { value: data.location_id.toString(), onValueChange: (v) => setData("location_id", v), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "bg-slate-50 border-primary/20 focus:ring-primary", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsx(SelectValue, { placeholder: "Todas las sedes (Global)" })
          ] }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las sedes (Global)" }),
            locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: loc.id.toString(), children: loc.name }, loc.id))
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400", children: "Si seleccionas una sede, esta cuenta solo aparecerá en pedidos de esa sede." })
      ] }),
      /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: processing, className: "cursor-pointer", children: [
        processing ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 size-4 animate-spin" }) : null,
        "Guardar Cambios"
      ] }) })
    ] })
  ] }) });
}
export {
  Index as default
};
