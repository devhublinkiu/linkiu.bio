<?php

namespace App\Notifications;

use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $tenant;

    /**
     * Create a new notification instance.
     */
    public function __construct(Tenant $tenant)
    {
        $this->tenant = $tenant;
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
        $subscription = $this->tenant->latestSubscription;
        $planName = $subscription && $subscription->plan ? $subscription->plan->name : 'Gratuito';
        $trialEndsAt = $this->tenant->trial_ends_at ? $this->tenant->trial_ends_at->format('d/m/Y H:i') : 'N/A';

        return (new MailMessage)
            ->from(config('mail.addresses.noreply'), config('app.name'))
            ->subject('🎉 ¡Bienvenido a ' . config('app.name') . '!')
            ->markdown('emails.tenant.welcome', [
                'user' => $notifiable,
                'tenant' => $this->tenant,
                'planName' => $planName,
                'trialEndsAt' => $trialEndsAt,
                'dashboardUrl' => route('tenant.dashboard', ['tenant' => $this->tenant->slug]),
            ]);
    }
}
