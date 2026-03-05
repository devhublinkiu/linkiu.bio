# Módulo: Mis Servicios (Church)

## Descripción
Catálogo de **servicios** que ofrece la iglesia (cultos, reuniones, estudios bíblicos, ministerios, etc.). Cada ítem tiene nombre, descripción y datos opcionales (horario, lugar, imagen, orden). El admin tiene CRUD; la vista pública se implementa después.

## Contexto de negocio
- **Servicio (en este módulo):** Reunión o ceremonia recurrente que la iglesia ofrece (ej. culto dominical, reunión de jóvenes, estudio bíblico, misa, vigilia). Aplica a distintas tradiciones (cristiana, católica, etc.) y puede extenderse a otros contextos (judío, musulmán) con los mismos campos.
- **Verticales:** Church / Iglesias.
- **Scope:** Por tenant (`tenant_id` en toda la tabla).

## Clasificación
- **Tipo:** Vertical Church
- **Verticales:** church, iglesias
- **Límite por plan:** Opcional (no en v1; se puede añadir `services` a `MODULE_HAS_LIMIT` y validar en store).
- **Soft delete:** No

## Stack técnico
- **Modelo:** `App\Models\Tenant\Church\ChurchService` (trait `BelongsToTenant`)
- **Controlador:** `App\Http\Controllers\Tenant\Admin\Church\ChurchServiceController`
- **FormRequests:** `StoreChurchServiceRequest`, `UpdateChurchServiceRequest`
- **Frontend Admin:** `resources/js/Pages/Tenant/Admin/Services/` (Index, Create, Edit)
- **Rutas:** `tenant.admin.services.*` (resource)
- **Permisos:** `services.view`, `services.create`, `services.update`, `services.delete`
- **Estilos:** Tailwind + Shadcn; feedback con Sonner; AlertDialog para eliminar.

## Esquema de base de datos

| Campo         | Tipo           | Nullable | Default | Descripción |
|---------------|----------------|----------|---------|-------------|
| `id`          | bigint         | No       | auto    | PK |
| `tenant_id`   | foreignId      | No       | —       | FK → tenants (cascade) |
| `name`        | string(255)    | No       | —       | Nombre del servicio (ej. Culto dominical) |
| `description` | text           | Sí       | null    | Descripción: qué se hace, a quién va dirigido |
| `schedule`    | string(500)    | Sí       | null    | Horario en texto libre (ej. "Domingos 10:00 a. m.") |
| `location`    | string(500)    | Sí       | null    | Lugar (auditorio, sala, dirección) |
| `image_url`   | string(1024)   | Sí       | null    | URL de imagen (Bunny o externa) |
| `order`       | integer        | No       | 0       | Orden de aparición en listados |
| `is_active`   | boolean        | No       | true    | Visible / publicado |
| `created_at`  | timestamp      | —        | —       | |
| `updated_at`  | timestamp      | —        | —       | |

## Flujo admin (v1)

1. **Index:** Listado paginado por `order` y nombre. Columnas: nombre, horario (schedule), estado (activo/inactivo), acciones (editar, eliminar, toggle activo). Empty state si no hay servicios. Botón "Nuevo servicio".
2. **Create / Edit:** Formulario con: nombre (requerido), descripción (opcional), horario (opcional), lugar (opcional), imagen URL (opcional), orden (número), activo (switch). Guardar / Cancelar.
3. **Eliminar:** Confirmación con AlertDialog (destructive). No soft delete.
4. **Permisos:** `services.view` para ver listado; `services.create` para crear; `services.update` para editar y toggle; `services.delete` para eliminar.

## Vista pública (futuro)
- Ruta tipo `/{tenant}/servicios` que liste solo servicios con `is_active = true`, ordenados por `order`/nombre. Sin implementar en v1.

## Referencia de conceptos (documentación de producto)
Para ampliar campos en el futuro: público objetivo, modalidad (presencial/online), frecuencia, duración, líder, contacto, tipo/categoría, enlace externo, etc. Ver debate previo en conversación.
