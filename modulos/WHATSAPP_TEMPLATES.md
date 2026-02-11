# Catálogo de Plantillas WhatsApp (Infobip)

Este documento centraliza las plantillas que deben ser registradas y aprobadas en el panel de Infobip.

---

## 📅 MÓDULO: RESERVAS

### RE-01: Confirmación de Solicitud (Cliente)
**Nombre en Infobip**: `linkiu_confirmed_v1`  
**Lenguaje**: `es`  
**Propósito**: Informar al cliente que su pedido de reserva ha sido recibido y está pendiente de aprobación.

*   **Cuerpo**:
    > "Hola *{{1}}*! 👋 Recibimos tu solicitud de reserva en *{{2}}* para el día *{{3}}* a las *{{4}}*. En unos momentos te informaremos si tu mesa ha sido confirmada. ¡Gracias!"
*   **Variables**:
    *   `{{1}}`: Nombre de la persona.
    *   `{{2}}`: Nombre de la tienda.
    *   `{{3}}`: Fecha.
    *   `{{4}}`: Hora.
*   **Botones**:
    *   Tipo: `URL`
    *   Base: `https://linkiu.bio/`
    *   Variable Botón `{{1}}`: `{tenant_slug}/sedes` (Redirige a las sedes de la tienda).

**JSON Payload**:
```json
{"messages":[{"from":"15098952530","to":"","content":{"templateName":"linkiu_confirmed_v1","templateData":{"body":{"placeholders":[]},"buttons":[{"type":"URL","parameter":""}]},"language":"es"}}]}
```

---

### RE-02: Reserva Aprobada (Cliente)
**Nombre en Infobip**: `linkiu_approved_v1`  
**Lenguaje**: `es`  
**Propósito**: Notificar éxito en la reserva.

*   **Cuerpo**:
    > "¡Buenas noticias *{{1}}*! 🎉 Tu mesa en *{{2}}* para el día *{{3}}* a las *{{4}}* ha sido **CONFIRMADA**. ¡Te esperamos! 🍴"
*   **Variables**:
    *   `{{1}}`: Nombre de la persona.
    *   `{{2}}`: Nombre de la tienda.
    *   `{{3}}`: Fecha.
    *   `{{4}}`: Hora.
*   **Botones**:
    *   Tipo: `URL`
    *   Base: `https://linkiu.bio/`
    *   Variable Botón `{{1}}`: `{tenant_slug}/sedes`

**JSON Payload**:
```json
{"messages":[{"from":"15098952530","to":"","content":{"templateName":"linkiu_approved_v1","templateData":{"body":{"placeholders":[]},"buttons":[{"type":"URL","parameter":""}]},"language":"es"}}]}
```

---

### RE-03: Alerta de Nueva Reserva (Admin)
**Nombre en Infobip**: `linkiu_alert_v1`  
**Lenguaje**: `es`  
**Propósito**: Avisar al dueño del negocio que alguien quiere reservar.

*   **Cuerpo**:
    > "Hola, 👋
    > Tienes una nueva reserva, con el cliente {{1}}, para el día {{2}}, con una cantidad de {{3}}, revisa tu panel para que puedas revisar los detalles.
    > Gracias por ser parte de nosotros."
*   **Variables**:
    *   `{{1}}`: Nombre del cliente.
    *   `{{2}}`: Fecha.
    *   `{{3}}`: Cantidad de personas.

**JSON Payload**:
```json
{"messages":[{"from":"15098952530","to":"","content":{"templateName":"linkiu_alert_v1","templateData":{"body":{"placeholders":[]}},"language":"es"}}]}
```

---

### RE-04: Recordatorio de Reserva (Cliente)
**Nombre en Infobip**: `linkiu_reminder_v1`  
**Lenguaje**: `es`  
**Propósito**: Reducir el No-Show.

*   **Cuerpo**:
    > "Hola, 👋
    > {{1}}, te recordamos que tienes una mesa reservada en {{2}} para hoy a las {{3}}.
    > ¿Sigue todo en pie? ✅"
*   **Variables**:
    *   `{{1}}`: Nombre del cliente.
    *   `{{2}}`: Nombre de la tienda.
    *   `{{3}}`: Hora.
*   **Botones**:
    *   Tipo: `URL`
    *   Base: `https://linkiu.bio/`
    *   Variable Botón `{{1}}`: `{tenant_slug}/sedes`

**JSON Payload**:
```json
{"messages":[{"from":"15098952530","to":"","content":{"templateName":"linkiu_reminder_v1","templateData":{"body":{"placeholders":[]},"buttons":[{"type":"URL","parameter":""}]},"language":"es"}}]}
```

---

## 🛒 MÓDULO: PEDIDOS (Gastronomía / Ecommerce)

Estas plantillas se disparan durante el ciclo de vida de una compra o pedido.

### PE-02: Alerta de Nuevo Pedido (Admin)
**Nombre sugerido:** `nuevo_pedido_admin_v1`  
**Uso:** Se envía al número administrativo configurado para alertas instantáneas.

> **Mensaje:**
> 🚨 **¡Nuevo Pedido Recibido!**
> 
> Tienes una nueva orden en *{{1}}*.
> 
> 👤 **Cliente:** {{2}}
> 🧾 **ID:** #{{3}}
> 💰 **Total:** {{4}}
> 🛵 **Tipo:** {{5}}
> 
> Revisa los detalles en tu panel: {{6}}

**Variables:**
*   `{{1}}`: Nombre del negocio.
*   `{{2}}`: Nombre del cliente.
*   `{{3}}`: ID del pedido.
*   `{{4}}`: Monto total.
*   `{{5}}`: Tipo de entrega.
*   `{{6}}`: Link al panel administrativo.

---

### PE-03: Actualización de Estado (Cliente)
**Nombre sugerido:** `estado_pedido_update_v1`  
**Uso:** Se envía cuando el administrador cambia el estado (En preparación, En camino, Completado).

> **Mensaje:**
> ¡Buenas noticias {{1}}! 🎉
> 
> Tu pedido #{{2}} en *{{3}}* ha cambiado su estado a: **{{4}}**.
> 
> 📅 **Actualización:** {{5}}
> 🔗 **Seguimiento:** {{6}}
> 
> ¡Gracias por elegirnos! 😊

**Variables:**
*   `{{1}}`: Nombre del cliente.
*   `{{2}}`: ID del pedido.
*   `{{3}}`: Nombre del negocio.
*   `{{4}}`: Nuevo estado (ej: En camino 🛵).
*   `{{5}}`: Fecha/Hora.
*   `{{6}}`: Link de seguimiento.

---

## 📋 NOTAS DE APROBACIÓN (Historial)
*   *2026-02-07*: Actualización de nombres técnicos (`linkiu_confirmed_v1`, etc.) y estructuras JSON según especificación de Infobip.
