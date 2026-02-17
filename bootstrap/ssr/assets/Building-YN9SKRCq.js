import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { router, Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { c as cn } from "./utils-B0hQsrDj.js";
import { route } from "ziggy-js";
import { C as Card } from "./card-BaovBWX5.js";
import { P as Progress } from "./progress-BW8YadT0.js";
import { Layout, Paintbrush, Globe, Rocket, Store, Loader2, CheckCircle2 } from "lucide-react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-progress";
function Building({ tenantName, tenantSlug, requiresApproval }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const buildSteps = [
    { icon: Layout, label: "Estructurando tu tienda...", detail: "Creando bases de datos y archivos" },
    { icon: Paintbrush, label: "Aplicando diseño...", detail: "Configurando el tema visual" },
    { icon: Globe, label: "Lanzando al mundo...", detail: "Generando tu slug personalizado" },
    { icon: Rocket, label: "¡Todo listo!", detail: "Tu espacio está preparado" }
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= buildSteps.length - 1) {
          clearInterval(interval);
          setIsComplete(true);
          return prev;
        }
        return prev + 1;
      });
    }, 2e3);
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 0.5;
      });
    }, 100);
    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);
  useEffect(() => {
    if (isComplete) {
      setProgress(100);
      const timer = setTimeout(() => {
        if (requiresApproval) {
          router.visit(route("onboarding.pending"));
        } else {
          router.visit(route("onboarding.success"));
        }
      }, 1e3);
      return () => clearTimeout(timer);
    }
  }, [isComplete, requiresApproval]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Preparando tu tienda | Linkiu" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-slate-50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full space-y-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700", children: [
        /* @__PURE__ */ jsx("div", { className: "h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 animate-bounce", children: /* @__PURE__ */ jsx(Store, { className: "w-10 h-10 text-primary-foreground" }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold tracking-tight text-gray-900", children: tenantName || "Preparando tu tienda" })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-8 border-gray-100 shadow-2xl shadow-blue-100/50 relative overflow-hidden bg-white/80 backdrop-blur-md", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-8 relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-2", children: [
                /* @__PURE__ */ jsx(Loader2, { className: "w-3 h-3 animate-spin" }),
                "Configuración en curso"
              ] }),
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-800 transition-all duration-300", children: buildSteps[currentStep].label }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 italic", children: buildSteps[currentStep].detail })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs font-bold text-gray-400", children: [
                /* @__PURE__ */ jsx("span", { children: "PROGRESO" }),
                /* @__PURE__ */ jsxs("span", { className: "text-primary", children: [
                  Math.round(progress),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsx(Progress, { value: progress, className: "h-3 rounded-full bg-slate-100" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center relative py-4", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2" }),
            buildSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isDone = index < currentStep;
              return /* @__PURE__ */ jsxs("div", { className: "relative z-10 group", children: [
                /* @__PURE__ */ jsx("div", { className: cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 border-2",
                  isActive ? "bg-primary border-primary text-white scale-110 shadow-lg" : isDone ? "bg-green-100 border-green-200 text-green-600" : "bg-white border-gray-100 text-gray-300"
                ), children: isDone ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-6 h-6" }) : /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5" }) }),
                isActive && /* @__PURE__ */ jsx("div", { className: "absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rotate-45 rounded-sm animate-pulse -z-10" })
              ] }, index);
            })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4 animate-in fade-in slide-in-from-top-4 delay-500 duration-1000", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 font-medium", children: "Esto tomará menos de 30 segundos" }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse" }),
          /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse delay-75" }),
          /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse delay-150" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Building as default
};
