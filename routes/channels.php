<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int)$user->id === (int)$id;
});

// POS Magic Link Channel
// Authorized for any authenticated user of the tenant
Broadcast::channel('pos.{tenantId}.magic.{token}', function ($user, $tenantId, $token) {
    // Check if user belongs to tenant (assuming single tenant per user or pivot table)
    // For now, if the user is logged in, they are likely authorized for the tenant context they are in.
    // Ideally check $user->tenant_id == $tenantId
    return (int)$user->tenant_id === (int)$tenantId;
});
