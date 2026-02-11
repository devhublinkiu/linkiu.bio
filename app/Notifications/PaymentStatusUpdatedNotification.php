<?php

namespace App\Notifications;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentStatusUpdatedNotification extends Notification
{
    use Queueable;
    public $invoice;
    public $status;
    public $notes;

    /**
     * Create a new notification instance.
     */
    public function __construct(Invoice $invoice, string $status, ?string $notes = null)
    {
        $this->invoice = $invoice;
        $this->status = $status; // 'paid' (approved) or 'pending' (rejected - backend sets it back to pending)
        $this->notes = $notes;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return $notifiable->email ? ['database', 'broadcast', 'mail'] : ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $tenant = $this->invoice->tenant;
        $subscription = $this->invoice->subscription;
        $plan = $subscription->plan;

        $billingCycleMap = [
            'monthly' => 'Mensual',
            'quarterly' => 'Trimestral',
            'yearly' => 'Anual',
        ];

        // If payment was approved, send confirmation email
        if ($this->status === 'paid') {
            return (new MailMessage)
                ->from(config('mail.addresses.billing'), 'Facturación ' . config('app.name'))
                ->subject('🎉 ¡Pago Confirmado! - ' . config('app.name'))
                ->markdown('emails.billing.payment-confirmed', [
                    'user' => $notifiable,
                    'tenant' => $tenant,
                    'invoice' => $this->invoice,
                    'subscription' => $subscription,
                    'planName' => $plan->name,
                    'billingCycle' => $billingCycleMap[$subscription->billing_cycle] ?? 'Mensual',
                    'dashboardUrl' => route('tenant.dashboard', ['tenant' => $tenant->slug]),
                ]);
        }

        // If payment was rejected, send rejection email (optional - can be added later)
        // For now, we'll just send database/broadcast notification for rejections
        return (new MailMessage)
            ->from(config('mail.addresses.billing'), 'Facturación ' . config('app.name'))
            ->subject('Actualización de Pago - ' . config('app.name'))
            ->line('Tu pago ha sido actualizado.')
            ->action('Ver Detalles', route('tenant.subscription.index', ['tenant' => $tenant->slug]));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $tenant = $this->invoice->tenant;
        $statusText = $this->status === 'paid' ? 'APROBADO' : 'RECHAZADO';
        $message = "Tu pago para la factura #{$this->invoice->id} ha sido {$statusText}.";

        if ($this->status !== 'paid' && $this->notes) {
            $message .= " Motivo: {$this->notes}";
        }

        return [
            'invoice_id' => $this->invoice->id,
            'status' => $this->status,
            'message' => $message,
            'type' => 'payment_status_updated',
            'url' => route('tenant.invoices.show', ['tenant' => $tenant->slug, 'invoice' => $this->invoice->id]),
        ];
    }

    /**
     * Get the broadcast representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        $tenant = $this->invoice->tenant;
        $statusText = $this->status === 'paid' ? 'APROBADO' : 'RECHAZADO';
        $message = "Tu pago para la factura #{$this->invoice->id} ha sido {$statusText}.";

        return new BroadcastMessage([
            'invoice_id' => $this->invoice->id,
            'status' => $this->status,
            'message' => $message,
            'type' => 'payment_status_updated',
            'url' => route('tenant.invoices.show', ['tenant' => $tenant->slug, 'invoice' => $this->invoice->id]),
        ]);
    }

    /**
     * Determine the broadcast channel.
     */
    public function broadcastOn()
    {
        return ['tenant-updates.' . $this->invoice->tenant_id];
    }

    /**
     * Get the broadcast name.
     */
    public function broadcastType()
    {
        return 'payment.status_updated';
    }
}
