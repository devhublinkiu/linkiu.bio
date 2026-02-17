import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, Head } from "@inertiajs/react";
import { a as MediaManager } from "./MediaManagerModal-BXLLBMxU.js";
import { A as AdminLayout } from "./AdminLayout-C8hB-Nb-.js";
import "react";
import "./button-BdX_X5dq.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./scroll-area-iVmBTZv4.js";
import "@radix-ui/react-scroll-area";
import "./input-B_4qRSOV.js";
import "./label-L_u-fyc1.js";
import "@radix-ui/react-label";
import "lucide-react";
import "axios";
import "sonner";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./alert-dialog-Dk6SFJ_Z.js";
import "@radix-ui/react-alert-dialog";
import "./empty-CTOMHEXK.js";
import "./dropdown-menu-B2I3vWlQ.js";
import "vaul";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./sheet-BclLUCFD.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./badge-C_PGNHO8.js";
import "./card-BaovBWX5.js";
import "./progress-BW8YadT0.js";
import "@radix-ui/react-progress";
import "./menuConfig-rtCrEhXP.js";
import "./sonner-ZUDSQr7N.js";
function MediaIndex({ api_route }) {
  usePage().props;
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Mis Archivos", children: [
    /* @__PURE__ */ jsx(Head, { title: "Mis Archivos" }),
    /* @__PURE__ */ jsx("div", { className: "py-8 max-w-[1600px] mx-auto sm:px-6 lg:px-8 h-[calc(100vh-65px)] flex flex-col", children: /* @__PURE__ */ jsx("div", { className: "bg-white overflow-hidden shadow-sm sm:rounded-lg flex-1 border border-slate-200", children: /* @__PURE__ */ jsx(MediaManager, { apiRoute: api_route, className: "h-full border-0" }) }) })
  ] });
}
export {
  MediaIndex as default
};
