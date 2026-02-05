@component('mail::message')
# Nueva Respuesta en tu Ticket

Hola **{{ $user->name }}**,

Hay una nueva respuesta en tu ticket de soporte:

@component('mail::table')
| | |
|:---|:---|
| **Asunto** | {{ $ticket->subject }} |
| **ID** | {{ sprintf('%04d', $ticket->id) }} |
| **Estado** | {{ ucfirst(str_replace('_', ' ', $ticket->status)) }} |
@if($comment)
    | **Mensaje** | {{ $comment }} |
@endif
@endcomponent

@component('mail::button', ['url' => $actionUrl])
Ver Conversación Completa
@endcomponent

Puedes responder directamente desde el panel de soporte.

Gracias,<br>
**{{ config('app.name') }}**

@component('mail::subcopy')
Si tienes problemas para hacer clic en el botón, copia y pega la siguiente URL en tu navegador:
[{{ $actionUrl }}]({{ $actionUrl }})
@endcomponent
@endcomponent