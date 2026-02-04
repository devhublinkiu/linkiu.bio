# Sistema de Notificaciones en Tiempo Real (Broadcast)

Este documento detalla la arquitectura implementada para las notificaciones en tiempo real en Linkiu.bio, utilizando **Pusher/Ably** y **Laravel Events**.

## 🚀 Arquitectura: Eventos vs Notificaciones

Hemos separado la lógica en dos capas para garantizar velocidad en la UI y fiabilidad en los datos:

1.  **Eventos (`App\Events`)**: 
    *   **Propósito**: Enviar alertas **inmediatas** a la interfaz de usuario (Toasts, contadores, alertas).
    *   **Tecnología**: Websockets (Ably/Pusher).
    *   **Característica Clave**: Implementan `ShouldBroadcastNow` para evitar la cola de trabajos (Queue) y salir al instante desde el servidor.

2.  **Notificaciones (`App\Notifications`)**: 
    *   **Propósito**: Persistencia (guardar en base de datos para ver el historial "campanita") y comunicación asíncrona (Emails, SMS, Slack).
    *   **Tecnología**: Base de datos, Mail drivers.
    *   **Característica Clave**: Usan la cola de trabajos (`Queueable`) para no ralentizar la petición del usuario.

---

## 🛠️ Guía Paso a Paso para Crear una Alerta Completa

Para implementar una notificación completa (ej: "Nuevo Pago Realizado"), necesitas crear tanto el Evento (para el popup inmediato) como la Notificación (para el email/historial).

### Paso 1: Crear la Notificación (Persistencia y Email)

Usa el comando de artisan para generar la clase.

```bash
php artisan make:notification PaymentReceivedNotification
```

Edita el archivo en `app/Notifications/PaymentReceivedNotification.php`:

```php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentReceivedNotification extends Notification
{
    use Queueable; // Permite que se envíe en segundo plano (Worker)

    public $payment;

    public function __construct($payment)
    {
        $this->payment = $payment;
    }

    // DEFINIR CANALES: Solo Base de Datos y Mail. ¡NO AGREGAR 'broadcast' AQUÍ!
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    // Configuración del Email
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Pago Recibido')
                    ->line("Has recibido un pago de {$this->payment->amount}")
                    ->action('Ver Pago', route('payments.show', $this->payment->id));
    }

    // Configuración para Base de Datos (Tabla 'notifications')
    public function toArray(object $notifiable): array
    {
        return [
            'amount' => $this->payment->amount,
            'message' => "Pago de {$this->payment->amount} recibido.",
            'url' => route('payments.show', $this->payment->id),
            'icon' => 'DollarSign', // Opcional, para el frontend
        ];
    }
}
```

### Paso 2: Crear el Evento (Tiempo Real)

Crea un evento en `App\Events` que implemente `ShouldBroadcastNow`.

```php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow; // <--- IMPORTANTE
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentReceived implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $payment;

    public function __construct($payment)
    {
        $this->payment = $payment;
    }

    // Canal donde se emitirá
    // 'superadmin-updates' -> Para administradores globales
    // 'tenant-updates.{id}' -> Para usuarios de una tienda específica
    public function broadcastOn(): array
    {
        return [
            new Channel('superadmin-updates'),
        ];
    }

    // Nombre del evento que escuchará el Frontend (sin prefijos de Laravel)
    public function broadcastAs(): string
    {
        return 'payment.received';
    }

    // Datos ligeros que necesita el Frontend YA (para el Toast)
    public function broadcastWith(): array
    {
        return [
            'amount' => $this->payment->amount,
            'message' => 'Nuevo pago de ' . $this->payment->amount,
            'url' => route('payments.show', $this->payment->id),
            'type' => 'payment.received'
        ];
    }
}
```

### Paso 3: Disparar ambos desde el Controlador

En tu controlador, dispara el evento y la notificación.

```php
// En PaymentController.php

public function store(Request $request) {
    $payment = Payment::create($request->all());

    // 1. Enviar alerta en Tiempo Real (Inmediato - Sin Cola)
    \App\Events\PaymentReceived::dispatch($payment);

    // 2. Guardar en BD / Enviar Email (Se va a la Cola)
    // Opción A: A un usuario específico
    $user->notify(new \App\Notifications\PaymentReceivedNotification($payment));
    
    // Opción B: A un grupo de usuarios (Facade)
    \Illuminate\Support\Facades\Notification::send(
        $admins, 
        new \App\Notifications\PaymentReceivedNotification($payment)
    );
}
```

### Paso 4: Escuchar en el Frontend (React/Inertia)

Usa `Echo` para escuchar el canal y el evento.

```tsx
useEffect(() => {
    // Escuchar canal global o de tenant según corresponda
    // @ts-ignore
    window.Echo.channel('superadmin-updates')
        .listen('.payment.received', (e: any) => { // NOTA EL PUNTO '.' AL INICIO
            toast(e.message);
        });

    return () => {
        // @ts-ignore
        window.Echo.leave('superadmin-updates');
    };
}, []);
```

---

## ⚠️ Puntos Críticos

1.  **Doble Broadcast**: Asegúrate de que `via()` en tu Notificación NO retorne `broadcast`. Si lo hace, enviarás el mensaje dos veces (uno por el Evento `ShouldBroadcastNow` y otro por la Notificación que pasa por la cola).
2.  **Queue Work**: Para que los emails y la persistencia en BD funcionen rápido, asegúrate de que `php artisan queue:work` esté corriendo siempre.
3.  **ShouldBroadcastNow**: Es vital usar `ShouldBroadcastNow` en el Evento. Si usas `ShouldBroadcast` (sin Now), el evento también se irá a la cola y podría retrasarse si la cola está ocupada o detenida.
