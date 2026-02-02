<?php

namespace App\Events;

use App\Models\Tenant;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TenantCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $tenant;

    public function __construct(Tenant $tenant)
    {
        $this->tenant = $tenant;
    }

    public function broadcastOn()
    {
        return new Channel('superadmin-updates');
    }

    public function broadcastAs()
    {
        return 'tenant.created';
    }

    public function broadcastWith(): array
    {
        return [
            'tenant_id' => $this->tenant->id,
            'tenant_name' => $this->tenant->name,
            'tenant_slug' => $this->tenant->slug,
            'message' => "Se ha registrado una nueva tienda: {$this->tenant->name}",
            'type' => 'tenant_created',
            'url' => route('tenants.show', $this->tenant->id),
        ];
    }
}
