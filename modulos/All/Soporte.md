# Módulo: Soporte Técnico

**Versión:** 1.1  
**Fecha:** 04 de Febrero 2026  
**Responsable:** Antigravity / Team Linkiu  
**Alcance:** Módulo Transversal (`All`). Gestión de incidencias, consultas y ayuda técnica para todos los tenants.

---

## 1. Descripción General
El sistema de Soporte permite una comunicación fluida entre los Tenants (dueños de tienda) y el equipo de SuperAdministradores.
*   **Tenant:** Crea tickets, responde a hilos existentes y recibe notificaciones de resolución.
*   **SuperAdmin:** Gestiona todos los tickets de la plataforma, asigna agentes, cambia estados y prioridades.
*   **Real-Time:** Integración con Laravel Echo para chats en vivo y notificaciones instantáneas (Toasts).

---

## 2. Actores y Permisos

| Actor | Permisos / Rol | Acciones Principales |
| :--- | :--- | :--- |
| **SuperAdmin** | `is_super_admin` | Ver todos los tickets, asignar agentes, responder, cambiar estado/prioridad. |
| **Tenant Admin** | `auth.user.tenant_id` | Crear tickets, ver historial de su tienda, responder, cerrar tickets. |

---

## 3. Modelo de Datos

### A. `Ticket` (Principal)
Modelo centralizado que usa el trait `BelongsToTenant` para aislamiento automático.
*   `id`: PK
*   `tenant_id`: FK `tenants` (Aislamiento Multi-tenant)
*   `user_id`: FK `users` (Creador del ticket)
*   `reference_id`: string (Ej: `LG0011` - Prefijo de tienda + ID secuencial)
*   `assigned_to_id`: FK `users` (Agente asignado)
*   `subject`: string
*   `status`: enum (`open`, `in_progress`, `awaiting_response`, `resolved`, `closed`)
*   `priority`: enum (`low`, `medium`, `high`, `urgent`)
*   `category`: string (`technical`, `billing`, `account`, etc.)

### B. `TicketReply` (Conversaciones)
*   `id`: PK
*   `ticket_id`: FK `tickets`
*   `user_id`: FK `users` (Autor de la respuesta)
*   `message`: text (Contenido de la respuesta)
*   `is_staff`: boolean (Identifica si responde el equipo de soporte)

---

## 4. Flujos de Usuario (UX/UI)

### 4.1 Tenant: Gestión de Ayuda
*   **Vista:** `Panel > Soporte y Ayuda`
*   **Dashboard:** Stats de tickets (Abiertos, Resueltos, Total).
*   **Creación:** Formulario optimizado con categoría y prioridad.
*   **Chat:** Interfaz de burbujas con distinción visual entre cliente y soporte.

### 4.2 SuperAdmin: Centro de Soporte
*   **Vista:** `Sidebar > Soporte Técnico`
*   **Gestión:** Tabla global con filtros y paginación.
*   **Acciones:**
    *   **Asignar:** Dropdown para delegar el ticket a un agente específico.
    *   **Estados/Prioridad:** Cambio rápido desde el detalle del ticket.
    *   **Respuesta:** Notifica automáticamente al Tenant por Email y Tiempo Real.

---

## 5. Implementación Técnica

### Sistema de Navegación (Breadcrumbs)
Implementado mediante props dinámicas en layouts compartidos:
- **Tenant:** `Panel > Soporte y Ayuda > Ticket #XXXX`
- **SuperAdmin:** `SuperLinkiu > Soporte Técnico > Ticket #XXXX`

### Notificaciones y Eventos
*   `TicketCreatedEvent`: Notifica a SuperAdmins (Toast).
*   `TicketRepliedEvent`: Refresca la vista de chat en tiempo real.
*   `TicketAssignedEvent`: Notifica por canal privado al Tenant y Agente.
*   `SupportTicketNotification`: Envío de correos electrónicos vía Resend.

---

## 6. Lista de Verificación
- [x] Migraciones de `tickets` y `ticket_replies`.
- [x] Trait `BelongsToTenant` aplicado al modelo `Ticket`.
- [x] Controladores separados: `SuperAdmin\SupportController` y `Tenant\Admin\SupportController`.
- [x] Integración de Laravel Echo para actualizaciones en tiempo real.
- [x] Sistema de Breadcrumbs dinámicos en `AdminNavbar` y `SuperAdminLayout`.
