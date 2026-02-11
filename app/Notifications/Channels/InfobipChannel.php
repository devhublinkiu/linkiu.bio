<?php

namespace App\Notifications\Channels;

use App\Services\InfobipService;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class InfobipChannel
{
    protected InfobipService $infobip;

    public function __construct(InfobipService $infobip)
    {
        $this->infobip = $infobip;
    }

    /**
     * Send the given notification.
     *
     * @param  mixed  $notifiable
     * @param  \Illuminate\Notifications\Notification  $notification
     * @return void
     */
    public function send($notifiable, Notification $notification)
    {
        // First check if the tenant has the WhatsApp feature enabled
        // We assume the notifiable or the notification can provide the tenant context
        $tenant = app('currentTenant');

        if (!$tenant || !$tenant->hasFeature('whatsapp')) {
            Log::info("WhatsApp notifications skipped for tenant: " . ($tenant->name ?? 'Unknown') . " (Feature not enabled)");
            return;
        }

        // Get the WhatsApp data from the notification
        if (!method_exists($notification, 'toWhatsApp')) {
            Log::error("Notification " . get_class($notification) . " does not have toWhatsApp method.");
            return;
        }

        $data = $notification->toWhatsApp($notifiable);

        if (empty($data['to']) || empty($data['template'])) {
            Log::error("WhatsApp notification data incomplete for " . get_class($notification));
            return;
        }

        // Send the message using InfobipService
        $this->infobip->sendTemplate(
            $data['to'],
            $data['template'],
            $data['placeholders'] ?? [],
            $data['button_parameter'] ?? null,
            $data['language'] ?? 'es'
        );
    }
}
