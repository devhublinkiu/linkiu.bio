import { useRef } from 'react';
import { Dialog, DialogContent } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Printer, X } from 'lucide-react';
import { CartItem, Customer, Table, Tenant, TaxSettings } from '@/types/pos';
import { formatCurrency, calculateTax } from '@/utils/currency';

export interface ReceiptData {
    orderId: number;
    items: CartItem[];
    paymentMethod: 'cash' | 'card' | 'transfer';
    cashAmount?: number;
    change?: number;
    customer: Customer | null;
    table: Table | null;
    tenant: Tenant;
    taxSettings: TaxSettings;
}

interface ReceiptModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: ReceiptData | null;
}

export default function ReceiptModal({ open, onOpenChange, data }: ReceiptModalProps) {
    const receiptRef = useRef<HTMLDivElement>(null);

    if (!data) return null;

    const baseTotal = data.items.reduce((acc, item) => acc + item.total, 0);
    const { subtotal, taxAmount, grandTotal } = calculateTax(
        baseTotal,
        data.taxSettings?.tax_rate || 0,
        data.taxSettings?.price_includes_tax || false
    );

    const methodLabel: Record<string, string> = {
        cash: 'Efectivo',
        card: 'Tarjeta',
        transfer: 'Transferencia',
    };

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

    const handlePrint = () => {
        if (!data) return;

        const itemsHtml = data.items.map(item =>
            `<div class="row"><span class="item-name">${item.name}</span><span class="item-price">${formatCurrency(item.total)}</span></div>
             <div class="detail">${item.quantity} x ${formatCurrency(item.price)}</div>${item.notes ? `<div class="detail" style="font-style:italic;">* ${item.notes}</div>` : ''}`
        ).join('');

        const taxHtml = data.taxSettings.tax_rate > 0
            ? `<div class="row"><span>${data.taxSettings.tax_name} (${data.taxSettings.tax_rate}%)</span><span>${formatCurrency(taxAmount)}</span></div>`
            : '';

        const cashHtml = data.paymentMethod === 'cash' && data.cashAmount !== undefined
            ? `<div class="row"><span>Recibido</span><span>${formatCurrency(data.cashAmount)}</span></div>
               <div class="row bold"><span>Cambio</span><span>${formatCurrency(data.change ?? 0)}</span></div>`
            : '';

        const printWindow = window.open('', '_blank', 'width=350,height=700');
        if (!printWindow) return;

        printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Recibo #${data.orderId}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
@page {
    size: 80mm auto;
    margin: 0;
}
html, body {
    width: 80mm;
    margin: 0;
    padding: 0;
}
body {
    font-family: 'Courier New', 'Lucida Console', monospace;
    font-size: 12px;
    line-height: 1.5;
    color: #000;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}
.receipt {
    width: 80mm;
    max-width: 80mm;
    margin: 0 auto;
    padding: 6mm 5mm;
}
.center { text-align: center; }
.bold { font-weight: bold; }
.shop-name {
    font-size: 18px;
    font-weight: 900;
    letter-spacing: -0.5px;
    margin-bottom: 3px;
}
.date { font-size: 10px; color: #333; margin-top: 2px; }
.divider {
    border: none;
    border-top: 1px dashed #000;
    margin: 8px 0;
}
.row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 2px 0;
    font-size: 12px;
    gap: 8px;
}
.detail {
    font-size: 10px;
    color: #333;
    padding-left: 10px;
    margin-bottom: 5px;
}
.item-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 8px;
}
.item-price {
    white-space: nowrap;
    font-weight: bold;
}
.total-section .row { font-size: 12px; }
.grand-total {
    font-size: 20px;
    font-weight: 900;
    padding: 5px 0;
}
.footer {
    font-size: 9px;
    color: #555;
    margin-top: 10px;
    padding-top: 5px;
}
@media print {
    html, body { width: 80mm; }
    .receipt { width: 100%; padding: 4mm 4mm; }
}
@media screen {
    body { display: flex; justify-content: center; background: #f0f0f0; padding: 10px 0; }
    .receipt { background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
}
</style>
</head>
<body>
<div class="receipt">
<div class="center">
    <div class="shop-name">${data.tenant.name}</div>
    <div class="date">${dateStr} - ${timeStr}</div>
</div>
<div class="divider"></div>
<div class="row"><span>Pedido</span><span class="bold">#${String(data.orderId).padStart(4, '0')}</span></div>
${data.table ? `<div class="row"><span>Mesa</span><span class="bold">${data.table.name}</span></div>` : ''}
${data.customer ? `<div class="row"><span>Cliente</span><span class="bold">${data.customer.name}</span></div>` : ''}
<div class="divider"></div>
${itemsHtml}
<div class="divider"></div>
<div class="total-section">
    <div class="row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
    ${taxHtml}
    <div class="divider"></div>
    <div class="row grand-total"><span>TOTAL</span><span>${formatCurrency(grandTotal)}</span></div>
</div>
<div class="divider"></div>
<div class="row"><span>Método</span><span class="bold">${methodLabel[data.paymentMethod] || data.paymentMethod}</span></div>
${cashHtml}
<div class="divider"></div>
<div class="center footer">
    <div class="bold" style="font-size:11px;color:#000;">Gracias por su compra</div>
    <div style="margin-top:3px;">Powered by Linkiu.bio</div>
</div>
</div>
<script>window.onload = function() { window.print(); window.close(); }<\/script>
</body>
</html>`);
        printWindow.document.close();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[360px] p-0 gap-0 bg-white overflow-hidden">
                {/* Receipt Content */}
                <div ref={receiptRef} className="p-6 font-mono text-xs text-slate-900 leading-relaxed">
                    {/* Header */}
                    <div className="text-center mb-4">
                        <div className="text-lg font-black tracking-tight">{data.tenant.name}</div>
                        <div className="text-[10px] text-slate-500 mt-1">
                            {dateStr} &middot; {timeStr}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dashed border-slate-300 my-3" />

                    {/* Order Info */}
                    <div className="flex justify-between mb-1">
                        <span className="text-slate-500">Pedido</span>
                        <span className="font-bold">#{String(data.orderId).padStart(4, '0')}</span>
                    </div>
                    {data.table && (
                        <div className="flex justify-between mb-1">
                            <span className="text-slate-500">Mesa</span>
                            <span className="font-bold">{data.table.name}</span>
                        </div>
                    )}
                    {data.customer && (
                        <div className="flex justify-between mb-1">
                            <span className="text-slate-500">Cliente</span>
                            <span className="font-bold truncate ml-4">{data.customer.name}</span>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-dashed border-slate-300 my-3" />

                    {/* Items */}
                    <div className="space-y-2">
                        {data.items.map((item) => (
                            <div key={item.id}>
                                <div className="flex justify-between">
                                    <span className="truncate max-w-[180px] font-medium">{item.name}</span>
                                    <span className="font-bold shrink-0 ml-2">{formatCurrency(item.total)}</span>
                                </div>
                                <div className="text-[10px] text-slate-400 pl-2">
                                    {item.quantity} x {formatCurrency(item.price)}
                                </div>
                                {item.notes && (
                                    <div className="text-[10px] text-amber-600 pl-2 italic">
                                        → {item.notes}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dashed border-slate-300 my-3" />

                    {/* Totals */}
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        {data.taxSettings.tax_rate > 0 && (
                            <div className="flex justify-between">
                                <span className="text-slate-500">{data.taxSettings.tax_name} ({data.taxSettings.tax_rate}%)</span>
                                <span>{formatCurrency(taxAmount)}</span>
                            </div>
                        )}
                        <div className="border-t border-slate-200 my-1" />
                        <div className="flex justify-between text-base font-black">
                            <span>TOTAL</span>
                            <span>{formatCurrency(grandTotal)}</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dashed border-slate-300 my-3" />

                    {/* Payment Info */}
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Método</span>
                            <span className="font-bold">{methodLabel[data.paymentMethod] || data.paymentMethod}</span>
                        </div>
                        {data.paymentMethod === 'cash' && data.cashAmount !== undefined && (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Recibido</span>
                                    <span>{formatCurrency(data.cashAmount)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-green-700">
                                    <span>Cambio</span>
                                    <span>{formatCurrency(data.change ?? 0)}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-dashed border-slate-300 my-4" />
                    <div className="text-center text-[10px] text-slate-400 space-y-1">
                        <p className="font-bold text-slate-600">Gracias por su compra</p>
                        <p>Powered by Linkiu.bio</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 p-4 border-t border-slate-200 bg-slate-50">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cerrar
                    </Button>
                    <Button
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                        onClick={handlePrint}
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimir
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
