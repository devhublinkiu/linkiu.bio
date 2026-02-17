function formatCurrency(value) {
  const num = typeof value === "string" ? parseFloat(value) : value ?? 0;
  if (isNaN(num)) return "$0";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(num);
}
function calculateTax(baseTotal, taxRate, priceIncludesTax) {
  if (taxRate <= 0) {
    return { subtotal: baseTotal, taxAmount: 0, grandTotal: baseTotal };
  }
  if (priceIncludesTax) {
    const subtotal = baseTotal / (1 + taxRate / 100);
    return {
      subtotal,
      taxAmount: baseTotal - subtotal,
      grandTotal: baseTotal
    };
  }
  const taxAmount = baseTotal * (taxRate / 100);
  return {
    subtotal: baseTotal,
    taxAmount,
    grandTotal: baseTotal + taxAmount
  };
}
export {
  calculateTax as c,
  formatCurrency as f
};
