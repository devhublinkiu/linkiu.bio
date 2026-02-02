<?php
$invoices = App\Models\Invoice::where('tenant_id', 9)->get();
echo "Found " . $invoices->count() . " invoices for Tenant 9.\n";
foreach ($invoices as $inv) {
    echo "ID: {$inv->id} | Status: {$inv->status} | Amount: {$inv->amount} | TenantID: {$inv->tenant_id}\n";
}
