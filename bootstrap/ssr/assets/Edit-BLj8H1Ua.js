import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-BYqPcHJa.js";
import { S as SuperAdminLayout } from "./SuperAdminLayout-BMVUVnkF.js";
import { usePage, Head } from "@inertiajs/react";
import DeleteUserForm from "./DeleteUserForm-7ISSQ-QY.js";
import UpdatePasswordForm from "./UpdatePasswordForm-C1cY7SuN.js";
import UpdateProfileInformation from "./UpdateProfileInformationForm-BaN1K3Xn.js";
import { useState } from "react";
import { P as PermissionDeniedModal } from "./dropdown-menu-Dkgv2tnp.js";
import "./ApplicationLogo-xMpxFOcX.js";
import "@headlessui/react";
import "./sonner-ZUDSQr7N.js";
import "sonner";
import "lucide-react";
import "./button-BdX_X5dq.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./field-BEfz_npx.js";
import "./label-L_u-fyc1.js";
import "@radix-ui/react-label";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "./input-B_4qRSOV.js";
import "./card-BaovBWX5.js";
import "vaul";
import "axios";
import "./sheet-BFMMArVC.js";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
function Edit({
  mustVerifyEmail,
  status
}) {
  const { auth } = usePage().props;
  const isSuperAdminEnv = auth.user?.is_super_admin || (auth.permissions?.some((p) => p.startsWith("sa.")) || auth.permissions?.some((p) => ["settings.view", "users.view", "roles.view"].includes(p))) && !auth.user?.tenant_id;
  const Layout = isSuperAdminEnv ? SuperAdminLayout : Authenticated;
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  return /* @__PURE__ */ jsxs(
    Layout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-foreground", children: "Perfil" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Perfil" }),
        /* @__PURE__ */ jsx(
          PermissionDeniedModal,
          {
            open: showPermissionModal,
            onOpenChange: setShowPermissionModal
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx(
            UpdateProfileInformation,
            {
              mustVerifyEmail,
              status,
              className: "max-w-2xl",
              onPermissionDenied: () => setShowPermissionModal(true)
            }
          ),
          /* @__PURE__ */ jsx(
            UpdatePasswordForm,
            {
              className: "max-w-2xl",
              onPermissionDenied: () => setShowPermissionModal(true)
            }
          ),
          /* @__PURE__ */ jsx(
            DeleteUserForm,
            {
              className: "max-w-2xl",
              onPermissionDenied: () => setShowPermissionModal(true)
            }
          )
        ] }) }) })
      ]
    }
  );
}
export {
  Edit as default
};
