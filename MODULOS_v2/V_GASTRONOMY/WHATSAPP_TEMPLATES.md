# Plantillas WhatsApp — Vertical Gastronomía

Documentación de plantillas Infobip usadas por los módulos de Gastronomía. Origen único para nombres, variables y propósito. Idioma por defecto: `es`.

**Módulos que usan notificaciones WhatsApp en Gastronomía:**
- **Reservas**: confirmación cliente, aprobada, alerta admin, recordatorio (ver abajo).
- **Pedidos**: alerta al admin (nuevo pedido); confirmación al cliente; **estados del pedido** (confirmado, listo, completado, cancelado).

---

## Guía para que las plantillas no sean rechazadas (Utility)

Criterios que suele aplicar Meta/WhatsApp al revisar plantillas; conviene cumplirlos al crearlas en Infobip:

1. **Categoría Utility**: Mensajes transaccionales (confirmación, alerta operativa, recordatorio). No promociones ni marketing.
2. **Variables nunca al inicio ni al final del mensaje**: Siempre debe haber texto (o puntuación) antes de la primera variable y después de la última. Ejemplo: "Hola, tienes un pedido de **{{1}}**..." ✅ — "**{{1}}** ha realizado un pedido" ❌ (variable al inicio).
3. **Placeholders claros y acotados**: Evitar plantillas genéricas que permitan abuso (ej. un solo {{1}} con texto libre). Definir bien qué es cada variable (nombre, número, fecha, monto).
4. **Tono neutro y profesional**: Sin exceso de emojis (Meta suele mencionar menos de 10 por plantilla). Evitar mayúsculas excesivas o lenguaje promocional.
5. **Muestra de variables**: Al enviar a revisión, incluir valores de ejemplo para cada variable para que el revisor vea el mensaje final.
6. **Botones**: Si usas botón URL, el parámetro debe ser predecible (ej. slug, ID); no contenido dinámico arbitrario.

---

## Módulo: RESERVAS

### RE-01: Confirmación de Solicitud (Cliente)
**Nombre en Infobip**: `linkiu_confirmed_v1`  
**Lenguaje**: `es`  
**Propósito**: Informar al cliente que su solicitud de reserva ha sido recibida y está pendiente de aprobación.

- **Cuerpo**:
  > "Hola *{{1}}*! 👋 Recibimos tu solicitud de reserva en *{{2}}* para el día *{{3}}* a las *{{4}}*. En unos momentos te informaremos si tu mesa ha sido confirmada. ¡Gracias!"
- **Variables**:
  - `{{1}}`: Nombre de la persona.
  - `{{2}}`: Nombre de la tienda.
  - `{{3}}`: Fecha.
  - `{{4}}`: Hora.
- **Botones**:
  - Tipo: `URL`
  - Base: `https://linkiu.bio/`
  - Variable Botón `{{1}}`: `{tenant_slug}/sedes` (redirige a las sedes de la tienda).

**Uso en código**: Envío al cliente tras crear la reserva (ej. `ReservationController::store`). Destino: `customer_phone`. Parámetro botón: `{tenant_slug}/sedes`.

---

### RE-02: Reserva Aprobada (Cliente)
**Nombre en Infobip**: `linkiu_approved_v1`  
**Lenguaje**: `es`  
**Propósito**: Notificar al cliente que su reserva ha sido confirmada.

- **Cuerpo**:
  > "¡Buenas noticias *{{1}}*! 🎉 Tu mesa en *{{2}}* para el día *{{3}}* a las *{{4}}* ha sido **CONFIRMADA**. ¡Te esperamos! 🍴"
- **Variables**:
  - `{{1}}`: Nombre de la persona.
  - `{{2}}`: Nombre de la tienda.
  - `{{3}}`: Fecha.
  - `{{4}}`: Hora.
- **Botones**:
  - Tipo: `URL`
  - Base: `https://linkiu.bio/`
  - Variable Botón `{{1}}`: `{tenant_slug}/sedes`

**Uso en código**: Cuando el admin cambia estado a "confirmada" (ej. `AdminReservationController::update`). Destino: `reservation.customer_phone`.

---

### RE-03: Alerta de Nueva Reserva (Admin)
**Nombre en Infobip**: `linkiu_alert_v1`  
**Lenguaje**: `es`  
**Propósito**: Avisar al dueño del negocio de una nueva solicitud de reserva.

- **Cuerpo**:
  > "Hola, 👋  
  > Tienes una nueva reserva, con el cliente {{1}}, para el día {{2}}, con una cantidad de {{3}}, revisa tu panel para que puedas revisar los detalles.  
  > Gracias por ser parte de nosotros."
- **Variables**:
  - `{{1}}`: Nombre del cliente.
  - `{{2}}`: Fecha.
  - `{{3}}`: Cantidad de personas.
- **Botones**: Ninguno.

**Uso en código**: Tras crear la reserva. Destino: `tenant.settings['whatsapp_admin_phone']` (solo si feature `whatsapp` activa). Placeholders: `[customer_name, date, party_size]`.

---

### RE-04: Recordatorio de Reserva (Cliente)
**Nombre en Infobip**: `linkiu_reminder_v1`  
**Lenguaje**: `es`  
**Propósito**: Reducir el No-Show; recordar al cliente su reserva del día.

- **Cuerpo**:
  > "Hola, 👋  
  > {{1}}, te recordamos que tienes una mesa reservada en {{2}} para hoy a las {{3}}.  
  > ¿Sigue todo en pie? ✅"
- **Variables**:
  - `{{1}}`: Nombre del cliente.
  - `{{2}}`: Nombre de la tienda.
  - `{{3}}`: Hora.
- **Botones**:
  - Tipo: `URL`
  - Base: `https://linkiu.bio/`
  - Variable Botón `{{1}}`: `{tenant_slug}/sedes`

**Uso en código**: Job/command programado (ej. 1 hora antes de la hora de la reserva). Destino: `reservation.customer_phone`. Parámetro botón: `{tenant_slug}/sedes`.

---

## Módulo: PEDIDOS

### PE-01: Alerta de Nuevo Pedido (Admin)
**Nombre en Infobip**: `linkiu_order_alert_v1`  
**Lenguaje**: `es`  
**Propósito**: Avisar al negocio de un nuevo pedido para que lo preparen/atiendan.

- **Cuerpo** (texto antes y después de variables; evita rechazo):
  > "Hola, 👋  
  > Tienes un nuevo pedido *#{{1}}* del cliente *{{2}}* por un total de *{{3}}*. Revisa tu panel para ver los detalles y preparar el pedido."
- **Variables**:
  - `{{1}}`: Número o ID del pedido.
  - `{{2}}`: Nombre del cliente.
  - `{{3}}`: Total del pedido (ej. formateado: "$25.000" o "25.000 COP").
- **Botones**: Ninguno.

**JSON Payload**: {"messages":[{"from":"15098952530","to":"","content":{"templateName":"linkiu_order_alert_v1","templateData":{"body":{"placeholders":[]}},"language":"es"}}]}

**Uso en código**: Tras crear el pedido (ej. `ProcessesGastronomyOrders` o controlador que persista el pedido). Destino: `tenant.settings['whatsapp_admin_phone']`. Solo si `tenant->hasFeature('whatsapp')` y el número está configurado. Placeholders: `[order_id, customer_name, total_formatted]`.

---

### PE-02: Confirmación de Pedido Recibido (Cliente)
**Nombre en Infobip**: `linkiu_order_received_v1`  
**Lenguaje**: `es`  
**Propósito**: Confirmar al cliente que su pedido fue recibido y se está preparando.

- **Cuerpo**:
  > "Hola {{1}}, recibimos tu pedido #{{2}} en {{3}} por un total de {{4}}. Te avisaremos cuando esté listo. ¡Gracias!"
- **Variables**:
  - `{{1}}`: Nombre del cliente.
  - `{{2}}`: Número del pedido.
  - `{{3}}`: Nombre de la tienda.
  - `{{4}}`: Total formateado.
- **Botones**:
  - Tipo: `URL`
  - Base: `https://linkiu.bio/`
  - Variable Botón `{{1}}`: `{tenant_slug}/sedes`

**JSON Payload**: {"messages":[{"from":"15098952530","to":"","content":{"templateName":"linkiu_order_received_v1","templateData":{"body":{"placeholders":[]},"buttons":[{"type":"URL","parameter":""}]},"language":"es"}}]}

**Uso en código**: Tras crear el pedido, si el cliente tiene teléfono. Destino: `order.customer_phone`. Parámetro botón: `{tenant_slug}/sedes`. Placeholders: `[customer_name, order_id, tenant_name, total_formatted]`.

---

### PE-03: Pedido confirmado / en preparación (Cliente)
**Nombre en Infobip**: `linkiu_order_confirmed_v1`  
**Lenguaje**: `es`  
**Propósito**: Avisar al cliente que su pedido fue confirmado y está en preparación.

- **Cuerpo** (texto antes/después de variables):
  > "Hola {{1}}, tu pedido #{{2}} en {{3}} ha sido confirmado y está en preparación. Te avisaremos cuando esté listo."
- **Variables**:
  - `{{1}}`: Nombre del cliente.
  - `{{2}}`: Número del pedido.
  - `{{3}}`: Nombre de la tienda.
- **Botones** (si aplica en Infobip):
  - Tipo: `URL`
  - Variable Botón: `{tenant_slug}/id del pedido` (o a seguimiento del pedido)

**JSON Payload**: {"messages":[{"from":"15098952530","to":"","content":{"templateName":"linkiu_order_confirmed_v1","templateData":{"body":{"placeholders":[]},"buttons":[{"type":"URL","parameter":""}]},"language":"es"}}]}

**Uso en código**: Cuando el admin cambia el estado del pedido a `confirmed` o `preparing` (ej. `OrderController::updateStatus`). Destino: `order.customer_phone`. Solo si `hasFeature('whatsapp')` y el cliente tiene teléfono.

---

### PE-04: Pedido listo (Cliente)
**Nombre en Infobip**: `linkiu_order_ready_v1`  
**Lenguaje**: `es`  
**Propósito**: Avisar al cliente que su pedido está listo para recoger o para entrega.

- **Cuerpo**:
  > "Hola *{{1}}*, tu pedido *#{{2}}* en *{{3}}* está listo. Puedes pasar a recogerlo o lo estamos enviando según tu solicitud. ¡Gracias!"
- **Variables**:
  - `{{1}}`: Nombre del cliente.
  - `{{2}}`: Número del pedido.
  - `{{3}}`: Nombre de la tienda.
- **Botones** (si aplica en Infobip):
  - Tipo: `URL`
  - Variable Botón: `{tenant_slug}/id del pedido` (o a seguimiento del pedido)

- **JSON Payload**: {"messages":[{"from":"15098952530","to":"","content":{"templateName":"linkiu_order_ready_v1","templateData":{"body":{"placeholders":[]},"buttons":[{"type":"URL","parameter":""}]},"language":"es"}}]}

**Uso en código**: Cuando el estado del pedido pasa a `ready`. Destino: `order.customer_phone`.

---

### PE-05: Pedido completado (Cliente)
**Nombre en Infobip**: `linkiu_order_completed_v1`  
**Lenguaje**: `es`  
**Propósito**: Cerrar el ciclo; agradecer al cliente.

- **Cuerpo**:
  > "Hola {{1}}, tu pedido #{{2}} en {{3}} ha sido completado. Gracias por tu compra. ¡Te esperamos de nuevo!"
- **Variables**:
  - `{{1}}`: Nombre del cliente.
  - `{{2}}`: Número del pedido.
  - `{{3}}`: Nombre de la tienda.
- **Botones**: Ninguno.

**JSON Payload**: *(pendiente de aprobación en Infobip — pegar aquí cuando la aprueben)*

**Uso en código**: Cuando el estado del pedido pasa a `completed`. Destino: `order.customer_phone`.

---

### PE-06: Pedido cancelado (Cliente)
**Nombre en Infobip**: `linkiu_order_cancelled_v1`  
**Lenguaje**: `es`  
**Propósito**: Informar al cliente que su pedido fue cancelado.

- **Cuerpo**:
  > "Hola *{{1}}*, te informamos que tu pedido *#{{2}}* en *{{3}}* ha sido cancelado. Si tienes dudas, contáctanos."
- **Variables**:
  - `{{1}}`: Nombre del cliente.
  - `{{2}}`: Número del pedido.
  - `{{3}}`: Nombre de la tienda.
- **Botones**: Ninguno.

- **JSON Payload**: {"messages":[{"from":"15098952530","to":"","content":{"templateName":"linkiu_order_cancelled_v1","templateData":{"body":{"placeholders":[]},"buttons":[{"type":"URL","parameter":""}]},"language":"es"}}]}

**Uso en código**: Cuando el estado del pedido pasa a `cancelled`. Destino: `order.customer_phone`.
