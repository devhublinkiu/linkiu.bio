import { jsxs, jsx } from "react/jsx-runtime";
import { H as HeaderShellAll, R as ReportBusinessStrip, F as Footer } from "./HeaderShellAll-CWO03qHn.js";
import { Toaster } from "sonner";
function PublicLayout({ children, bgColor, renderPrefooter, renderBottomAction, renderFloatingBottom }) {
  return /* @__PURE__ */ jsxs("div", { className: "h-dvh w-full flex justify-center items-stretch relative overflow-hidden transition-colors duration-500 bg-white", children: [
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 -z-30 bg-[url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 -z-20 transition-colors duration-500 mix-blend-multiply opacity-80",
        style: { backgroundColor: bgColor || "#f0f2f5" }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 -z-10 backdrop-blur-[100px] bg-white/10" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[480px] h-full max-h-[100dvh] bg-white shadow-2xl overflow-hidden flex flex-col relative mx-auto z-10", children: [
      /* @__PURE__ */ jsx("div", { className: "scrollbar-public flex-1 min-h-0 relative overflow-y-auto overflow-x-hidden z-10", children: /* @__PURE__ */ jsxs("div", { className: "min-h-full flex flex-col", children: [
        /* @__PURE__ */ jsx("div", { className: "relative z-20 w-full shrink-0 pointer-events-auto px-4 pt-2", children: /* @__PURE__ */ jsx(HeaderShellAll, {}) }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0", children }),
        /* @__PURE__ */ jsx(ReportBusinessStrip, {}),
        renderPrefooter,
        /* @__PURE__ */ jsx(Footer, {})
      ] }) }),
      renderBottomAction && /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 left-0 right-0 bg-white border-t p-4 px-6 z-40 sm:absolute sm:bottom-0", children: renderBottomAction }),
      renderFloatingBottom && /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 z-40 w-full max-w-[480px] mx-auto", children: renderFloatingBottom }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-200 rounded-full sm:block hidden pointer-events-none mb-1 z-50" })
    ] }),
    /* @__PURE__ */ jsx(Toaster, { position: "top-center" })
  ] });
}
export {
  PublicLayout as P
};
