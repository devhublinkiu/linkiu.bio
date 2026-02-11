<?php

namespace App\Notifications;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentPendingReviewNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $invoice;

    /**
     * Create a new notification instance.
     */
    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return $notifiable->email ? ['mail'] : [];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $tenant = $this->invoice->tenant;

        return (new MailMessage)
            ->from(config('mail.addresses.billing'), 'Facturación ' . config('app.name'))
            ->subject('⏳ Pago Recibido - En Revisión - ' . config('app.name'))
            ->markdown('emails.billing.payment-pending', [
                'user' => $notifiable,
                'tenant' => $tenant,
                'invoice' => $this->invoice,
                'statusUrl' => route('tenant.subscription.success', [
                    'tenant' => $tenant->slug,
                    'invoice' => $this->invoice->id
                ]),
            ]);
    }
}
