<?php
try {
    $output = "";

    // 1. Setup Tenant and Auth
    $tenant = \App\Models\Tenant::where('slug', 'linkiurest')->first();
    if (!$tenant)
        die("Tenant not found\n");

    $output .= "Testing with Tenant: " . $tenant->name . " (ID: " . $tenant->id . ")\n";

    app()->instance('currentTenant', $tenant);
    \Illuminate\Support\Facades\Auth::loginUsingId($tenant->owner_id);
    $output .= "Logged in as User ID: " . $tenant->owner_id . "\n";

    // 2. Create Request with Tax Data
    $request = \Illuminate\Http\Request::create('/linkiurest/admin/settings', 'PATCH', [
        'tax_rate' => 15.5,
        'tax_name' => 'Debug Tax PHP',
        'price_includes_tax' => 1,
        'store_name' => $tenant->name
    ]);

    // 3. Execute Update
    $controller = new \App\Http\Controllers\Tenant\Admin\SettingsController;
    $output .= "Calling update method...\n";

    try {
        $response = $controller->update($request);
        $output .= "Response Status: " . $response->getStatusCode() . "\n";

        // 4. Check for Redirect/Validation Errors
        if ($response->getStatusCode() === 302) {
            $session = session()->all();
            if (isset($session['errors'])) {
                $output .= "Validation Errors:\n";
                $output .= print_r($session['errors']->getBag('default')->messages(), true);
            }
            else {
                $output .= "Redirected successfully (likely success).\n";
            }
        }
    }
    catch (\Illuminate\Validation\ValidationException $e) {
        $output .= "Validation Exception caught:\n";
        $output .= print_r($e->errors(), true);
    }

    // 5. Verify Persistence
    $tenant->refresh();
    $output .= "Current Tax Settings after Update:\n";
    $s = $tenant->settings;
    $output .= print_r([
        'tax_rate' => $s['tax_rate'] ?? 'MISSING',
        'tax_name' => $s['tax_name'] ?? 'MISSING',
        'price_includes_tax' => $s['price_includes_tax'] ?? 'MISSING'
    ], true);

    file_put_contents('f:/linkiu.bio/debug_tax.log', $output);
    echo "Log written to f:/linkiu.bio/debug_tax.log\n";

}
catch (\Exception $e) {
    file_put_contents('f:/linkiu.bio/debug_tax.log', "Exception: " . $e->getMessage() . "\n" . $e->getTraceAsString());
    echo "Exception occurred. Check log.\n";
}
