import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function formatPrice(amount, includeSymbol = true) {
  const formatted = new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(amount));
  return includeSymbol ? `$${formatted}` : formatted;
}
export {
  cn as c,
  formatPrice as f
};
