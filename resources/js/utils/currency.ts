/**
 * Formatea un número como moneda colombiana (COP).
 *
 * @example formatCurrency(15000)   → "$15.000"
 * @example formatCurrency(0)       → "$0"
 */
export function formatCurrency(value: number | string | null | undefined): string {
    const num = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
    if (isNaN(num)) return '$0';

    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(num);
}

/**
 * Calcula subtotal, impuesto y total a partir de un monto base
 * y la configuración de impuestos del tenant.
 */
export interface TaxBreakdown {
    subtotal: number;
    taxAmount: number;
    grandTotal: number;
}

export function calculateTax(
    baseTotal: number,
    taxRate: number,
    priceIncludesTax: boolean
): TaxBreakdown {
    if (taxRate <= 0) {
        return { subtotal: baseTotal, taxAmount: 0, grandTotal: baseTotal };
    }

    if (priceIncludesTax) {
        const subtotal = baseTotal / (1 + taxRate / 100);
        return {
            subtotal,
            taxAmount: baseTotal - subtotal,
            grandTotal: baseTotal,
        };
    }

    const taxAmount = baseTotal * (taxRate / 100);
    return {
        subtotal: baseTotal,
        taxAmount,
        grandTotal: baseTotal + taxAmount,
    };
}
