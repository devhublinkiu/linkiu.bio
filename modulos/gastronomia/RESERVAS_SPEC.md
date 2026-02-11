# Especificación Técnica: Módulo de Reservas (Gastronomía)

Este documento detalla la planificación y requisitos para el sistema de reservas de mesas, diseñado para integrarse con el módulo de Sedes y Mesas/Zonas existente.

## 1. Configuración de Base (Sedes)
Las reservas dependen directamente de la ubicación física (Sede).
*   **Horarios por Sede**: Cada sede tendrá su propio CRUD de horarios (Día, Apertura, Cierre, Slot de almuerzo/cena, etc.).
*   **Capacidad Total**: Calculada automáticamente sumando la capacidad de las mesas activas vinculadas a la sede.

## 2. Requisitos de Negocio (User Input)
*   **Sistema de Aprobación**: Las reservas entran en estado `Pendiente`. El administrador debe validarlas manualmente antes de que pasen a `Confirmada`.
*   **Anticipación Mínima**: Configuración global o por sede sobre cuántas horas/días antes se puede reservar (ej. mínimo 2 horas de anticipación).
*   **Valor por Persona**: Opción de cobrar un depósito o garantía por cada comensal para evitar "No-Shows".
*   **Duración de Slots**: Configuración de cuánto tiempo permanece ocupada una mesa (ej. 90 min, 120 min).
*   **Notificaciones WhatsApp**: Integración con un módulo de notificaciones para enviar confirmaciones y recordatorios automáticos usando plantillas dinámicas.

## 3. Arquitectura de Datos (`reservations`)
| Campo | Tipo | Descripción |
|--- |--- |--- |
| `id` | UUID | Identificador único |
| `tenant_id` | Foreign Key | Vínculo con el tenant |
| `location_id` | Foreign Key | Vínculo con la Sede |
| `table_id` | Foreign Key (Nullable) | Mesa asignada (puede ser asignada después de aprobar) |
| `customer_name` | String | Nombre del cliente |
| `customer_phone` | String | WhatsApp del cliente |
| `pax` | Integer | Número de personas |
| `reservation_date` | Date | Fecha de la reserva |
| `reservation_time` | Time | Hora de la reserva |
| `status` | Enum | `pending`, `confirmed`, `cancelled`, `completed`, `no_show` |
| `deposit_amount` | Decimal | Monto pagado (si aplica valor por persona) |
| `notes` | Text | Observaciones del cliente o del admin |

## 4. Interfaz Administrativa
*   **Dashboard de Reservas**: Vista de lista y calendario filtrable por fecha y sede.
*   **Gestor de Estados**: Botones rápidos para Aprobar, Cancelar o marcar como Completada.
*   **Asignador de Mesas**: Selector de mesas disponibles que coincidan con el número de personas.
*   **WhatsApp Directo**: Botón para abrir chat con plantilla pre-cargada de reserva.

## 5. Interfaz Pública (Cliente)
*   **Landing de Reserva**: Formulario optimizado para móviles.
*   **Selector de Disponibilidad**: 
    1. Elegir Sede.
    2. Elegir Fecha (se bloquean días cerrados).
    3. Elegir Hora (se calculan slots disponibles restando capacidad actual de mesas).
*   **Confirmación**: Pantalla de éxito con opción de "Añadir a Google Calendar" y botón de ayuda por WhatsApp.

## 6. Siguientes Pasos (Roadmap Sugerido)
1.  **Módulo WhatsApp**: Implementar el motor de notificaciones primero.
2.  **CRUD de Horarios en Sedes**: Permitir que el admin defina cuándo abre y cierra cada sede.
3.  **Core de Reservas**: Backend, migraciones y lógica de slots de tiempo.
4.  **Frontend Admin & Público**: Interfaces finales.
