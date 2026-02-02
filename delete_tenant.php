<?php
$t = App\Models\Tenant::find(3);
if ($t) {
    echo "Found tenant: {$t->name}\n";
    $t->users()->detach();
    echo "Detached users\n";
    $t->subscriptions()->delete();
    echo "Deleted subscriptions\n";

    // Check if pendingInvoice relationship returns a single model or null
    $invoice = $t->pendingInvoice;
    if ($invoice) {
        $invoice->delete();
        echo "Deleted pending invoice\n";
    }

    $t->delete();
    echo "Tenant deleted successfully.\n";
} else {
    echo "Tenant ID 3 not found.\n";
}
