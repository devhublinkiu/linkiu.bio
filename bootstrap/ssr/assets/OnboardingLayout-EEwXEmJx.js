import { jsxs, jsx } from "react/jsx-runtime";
import { Head } from "@inertiajs/react";
function OnboardingLayout({ children, currentStep, siteSettings, title }) {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white", children: [
    title && /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsx("main", { className: "max-w-5xl mx-auto px-6 py-8 md:py-16", children })
  ] });
}
export {
  OnboardingLayout as O
};
