import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CdwLWQ00.js";
import { usePage, useForm, Head, Link, router } from "@inertiajs/react";
import { toast } from "sonner";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { ChevronLeft, Settings, Loader2, RefreshCw } from "lucide-react";
import "./echo-DaX0krWj.js";
import "@ably/laravel-echo";
import "ably";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./badge-C_PGNHO8.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "./card-BaovBWX5.js";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./dropdown-menu-Dkgv2tnp.js";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./menuConfig-vY7u-Ro3.js";
import "./sonner-ZUDSQr7N.js";
import "@radix-ui/react-label";
function Config({ youtube_config }) {
  const { currentTenant } = usePage().props;
  const [syncing, setSyncing] = useState(false);
  const { data, setData, put, processing, errors } = useForm({
    youtube_channel_id: youtube_config.youtube_channel_id ?? ""
  });
  const submit = (e) => {
    e.preventDefault();
    put(route("tenant.admin.sermons.update-config", currentTenant?.slug), {
      preserveScroll: true,
      onSuccess: () => toast.success("Canal guardado correctamente"),
      onError: () => toast.error("Revisa el ID del canal")
    });
  };
  const handleSync = () => {
    setSyncing(true);
    router.post(route("tenant.admin.sermons.sync", currentTenant?.slug), {}, {
      preserveScroll: true,
      onSuccess: () => toast.success("Sincronización completada"),
      onError: (errors2) => {
        const msg = errors2?.sync ?? "Error al sincronizar. Revisa el canal y YOUTUBE_API_KEY en .env";
        toast.error(msg);
      },
      onFinish: () => setSyncing(false)
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Configurar Predicas", children: [
    /* @__PURE__ */ jsx(Head, { title: "Configurar Predicas - Canal de YouTube" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("tenant.admin.sermons.index", currentTenant?.slug),
            className: "text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" }),
              "Volver a Predicas"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold tracking-tight flex items-center gap-2 mt-2", children: [
          /* @__PURE__ */ jsx(Settings, { className: "size-6 text-primary" }),
          "Configurar Predicas"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Vincula tu canal de YouTube para sincronizar vídeos y transmisiones en vivo." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6 rounded-xl border bg-card p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "youtube_channel_id", children: "ID del canal de YouTube" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "youtube_channel_id",
              value: data.youtube_channel_id,
              onChange: (e) => setData("youtube_channel_id", e.target.value),
              placeholder: "Ej: UCxxxxxxxxxxxxxxxxxxxxxxxxxx",
              className: errors.youtube_channel_id ? "border-destructive" : ""
            }
          ),
          errors.youtube_channel_id && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs", children: errors.youtube_channel_id }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Encuentra el ID en la URL de tu canal (youtube.com/channel/",
            /* @__PURE__ */ jsx("strong", { children: "UCxxxx" }),
            ") o en la configuración del canal en YouTube Studio."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: processing, className: "gap-2", children: [
            processing && /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }),
            "Guardar canal"
          ] }),
          /* @__PURE__ */ jsx(Link, { href: route("tenant.admin.sermons.index", currentTenant?.slug), children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", children: "Cancelar" }) })
        ] })
      ] }),
      youtube_config.last_synced_at && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-4", children: [
        "Última sincronización: ",
        new Date(youtube_config.last_synced_at).toLocaleString("es")
      ] }),
      data.youtube_channel_id && /* @__PURE__ */ jsxs("div", { className: "mt-8 p-4 rounded-xl bg-slate-50 border border-slate-100", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-slate-900 mb-2", children: "Sincronizar ahora" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "Importa los vídeos y transmisiones del canal a Predicas." }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            className: "gap-2",
            disabled: syncing,
            onClick: handleSync,
            children: [
              syncing ? /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsx(RefreshCw, { className: "size-4" }),
              "Sincronizar con YouTube"
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  Config as default
};
