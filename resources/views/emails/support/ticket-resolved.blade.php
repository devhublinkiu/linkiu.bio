@component('mail::message')
# Ticket Resuelto

Hola **{{ $user->name }}**,

Tu ticket de soporte ha sido marcado como resuelto:

@component('mail::table')
| | |
|:---|:---|
| **Asunto** | {{ $ticket->subject }} |
| **ID** | {{ sprintf('%04d', $ticket->id) }} |
| **Estado** | Resuelto |
@if($comment)
    | **Comentario** | {{ $comment }} |
@endif
@endcomponent

@component('mail::button', ['url' => $actionUrl])
Ver Detalles del Ticket
@endcomponent

Si necesitas ayuda adicional, no dudes en crear un nuevo ticket.

Gracias por confiar en nosotros,<br>
**{{ config('app.name') }}**

@component('mail::subcopy')
Si tienes problemas para hacer clic en el botón, copia y pega la siguiente URL en tu navegador:
[{{ $actionUrl }}]({{ $actionUrl }})
@endcomponent
@endcomponent