# Especificación Técnica: Módulo de Notificaciones WhatsApp (Infobip)

Este módulo es una pieza transversal del ecosistema Linkiu.bio que permite el envío de mensajes transaccionales y alertas automatizadas a través de la API de Infobip.

## 1. Arquitectura del Motor
El sistema utilizará el driver de notificaciones de Laravel, permitiendo una integración limpia y escalable.

### Componentes Clave:
*   **InfobipService**: Clase centralizada que gestionará la autenticación, los headers de la API y el envío de payloads.
*   **Notification Channel (`InfobipChannel`)**: Canal personalizado de Laravel para que cualquier notificación del sistema pueda enviarse vía WhatsApp simplemente añadiendo `infobip` al método `via()`.
*   **Template Processor**: Lógica encargada de mapear objetos del sistema (Orden, Reserva, Cliente) a las variables numéricas `{{1}}`, `{{2}}` requeridas por las plantillas registradas.

## 2. Flujo de Envío
1.  **Evento**: Ocurre una acción (ej. Nueva Reserva).
2.  **Validación de Plan**: Se verifica si el Tenant tiene el módulo de WhatsApp activo en su suscripción.
3.  **Queue Dispatch**: La notificación se envía a una cola de trabajo (`jobs`) para evitar retrasos en la interfaz del usuario.
4.  **API Call**: Se contacta a Infobip con el `template_id` y el array de variables.
5.  **Logging**: Se registra el `messageId` para seguimiento y auditoría.

## 3. Configuración del Admin (Tenant)
Dentro del panel de control, el administrador tendrá una sección de "Notificaciones" para:
*   Definir el número de WhatsApp de alertas administrativas.
*   Activar/Desactivar tipos de alertas específicos.
*   Visualizar el estado de entrega de sus mensajes principales.

## 4. Webhooks (Feedback)
Se implementará una ruta de Webhook para recibir estados de Infobip:
*   **DELIVERED**: Mensaje entregado correctamente.
*   **SEEN**: El cliente leyó el mensaje (si aplica).
*   **FAILED**: Error en el envío (permite alertar al admin si su número está mal configurado).
