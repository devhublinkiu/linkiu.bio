# Módulo: LOCATIONS (Sedes)

## Descripción
Sedes y puntos de venta del tenant: nombre, encargado, contacto (teléfono, WhatsApp), dirección, coordenadas, horarios de apertura (`opening_hours`), redes sociales. Una sede puede ser **principal** (`is_main`). Las sedes activas se listan en la ruta pública; el admin tiene CRUD, límite por plan y bloqueo de eliminación si hay datos asociados.

## Clasificación
- **Tipo**: Transversal (compartido entre verticales)
- **Verticales**: Ecommerce, Gastronomía, Servicios
- **Scope**: Por tenant (cada sede tiene `tenant_id`)
- **Límite por plan**: Sí (implementado en Planes y validado en admin)
- **Soft delete**: No

## Stack Técnico
- **Modelo**: `App\Models\Tenant\Locations\Location` (trait `BelongsToTenant`)
- **Controlador**: `Tenant/Admin/Locations/LocationController.php` (type hints, try-catch)
- **FormRequests**: `StoreLocationRequest.php`, `UpdateLocationRequest.php` (mensajes en español)
- **Frontend Admin**: `Pages/Tenant/Admin/Locations/` (Index, Create, Edit, Show, LocationForm)
- **Frontend Público**: `Tenant/Public/Locations/Index` vía `PublicController::locations`
- **Estilos**: TailwindCSS + Shadcn UI

## Esquema de Base de Datos (objetivo)

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| `id` | bigint | No | auto | PK |
| `tenant_id` | foreignId | No | — | FK → tenants (cascade) |
| `name` | string(255) | No | — | Nombre de la sede |
| `manager` | string(255) | Sí | null | Encargado |
| `description` | string(255) | Sí | null | Descripción |
| `is_main` | boolean | No | false | Sede principal (una por tenant) |
| `phone` | string(255) | Sí | null | Teléfono |
| `whatsapp` | string(255) | Sí | null | WhatsApp |
| `whatsapp_message` | text | Sí | null | Mensaje por defecto WhatsApp |
| `state` | string(255) | Sí | null | Departamento/estado |
| `city` | string(255) | Sí | null | Ciudad |
| `address` | text | Sí | null | Dirección |
| `latitude` / `longitude` | decimal | Sí | null | Coordenadas |
| `opening_hours` | json | Sí | null | Horarios por día (ej. `{ "monday": [{ "open": "09:00", "close": "18:00" }] }`) |
| `social_networks` | json | Sí | null | facebook, instagram, tiktok, etc. |
| `reservation_price_per_person` | decimal(10,2) | No | 0 | Precio por persona (reservas) |
| `reservation_min_anticipation` | integer | No | 2 | Anticipación mínima (horas) |
| `reservation_slot_duration` | integer | No | 60 | Duración de franja (minutos) |
| `reservation_payment_proof_required` | boolean | No | false | Exigir comprobante en reservas |
| `is_active` | boolean | No | true | Activo/Inactivo |
| `created_at` / `updated_at` | timestamp | — | — | — |

## Flujo de Trabajo

```mermaid
graph TD
    subgraph "Panel Admin — /{tenant}/admin/locations"
        A[Usuario abre Sedes] -->|GET index| B[LocationController::index]
        B -->|tenant_id + paginate 10 + límite plan| C[Retorna locations + locations_limit + locations_count]
        C --> D["Index.tsx — Tabla desktop / Cards móvil<br/>EmptyState si vacío — (X / Y usados)<br/>Switch is_active + AlertDialog destructive"]

        D -->|Click Nueva Sede| E[Create.tsx — atLimit bloquea]
        E -->|Submit| F[StoreLocationRequest]
        F -->|Válido| G[Location::create + success]
        F -->|Inválido| H[Errores en español]

        D -->|Click Ver/Editar| I[Show.tsx / Edit.tsx + LocationForm]
        I -->|Submit Edit| J[UpdateLocationRequest]
        J --> K[location->update + success]

        D -->|Click Eliminar| L[AlertDialog destructive]
        L -->|Confirmar| M[destroy: validar dependientes]
        M -->|Hay reservas/pedidos/sliders/...| N[redirect back + flash error]
        M -->|Sin dependientes y no is_main| O[location->delete + success]
    end

    subgraph "Público"
        P[GET /{tenant}/locations] --> Q[PublicController::locations]
        Q --> R[Location activas + is_main primero]
        R --> S[Tenant/Public/Locations/Index]
    end
```

## Reglas de Negocio
1. **Sede principal**: Solo una sede por tenant con `is_main = true`; al guardar una como principal se desmarca el resto (booted en el modelo).
2. **Eliminación**: No se puede eliminar la sede principal. No se puede eliminar una sede si tiene: reservas, pedidos, sliders, mesas, zonas, métodos de envío, métodos de pago, cuentas bancarias o usuarios asignados (`tenant_user.location_id`). Conteos con `tenant_id` y `location_id` explícitos.
3. **Límite por plan**: Validar en `index`/`create`/`store` y en UI (contador "X / Y usados" y botón "Nueva Sede" deshabilitado al tope).
4. **Try-catch**: En store, update, destroy y toggleActive para errores de BD y redirección con mensaje claro.

## Estándares de implementación (checklist)
- [x] Multi-tenant: modelo en `App\Models\Tenant\Locations\Location` con `BelongsToTenant`; controlador en `Tenant/Admin/Locations/`.
- [x] FormRequests: StoreLocationRequest y UpdateLocationRequest (mensajes en español).
- [x] Try-catch en store, update, destroy, toggleActive.
- [x] Paginación: `paginate(10)` en index; SharedPagination en frontend.
- [x] Select de columnas explícito en index.
- [x] EmptyState en Index cuando no hay sedes.
- [x] AlertDialog variante `destructive` al eliminar.
- [x] Responsividad: tabla en desktop; Cards en móvil.
- [x] TypeScript: sin `any` (opening_hours y social_networks tipados en Show/Edit).
- [x] Flash success/error; AdminLayout muestra toast desde `flash`.
- [x] Permisos: `locations.view`, `locations.create`, `locations.update`, `locations.delete`; Index considera `is_owner` y `permissions.includes('*')`.
- [x] Límite por plan: MODULE_HAS_LIMIT en SuperAdmin; contador y validación en backend y UI.

## Permisos
| Permiso | Descripción | Seeded |
|---------|-------------|--------|
| `locations.view` | Ver listado y detalle de sedes | Sí |
| `locations.create` | Crear sedes | Sí |
| `locations.update` | Editar sedes y toggle activo | Sí |
| `locations.delete` | Eliminar sedes (con validación de dependientes) | Sí |

## Dependientes que bloquean eliminación
- Reservas (`gastronomy_reservations.location_id`)
- Pedidos (`gastronomy_orders.location_id`)
- Sliders (`sliders.location_id`)
- Mesas (`tables.location_id`)
- Zonas (`zones.location_id`)
- Métodos de envío (`tenant_shipping_methods.location_id`)
- Métodos de pago (`tenant_payment_methods.location_id`)
- Cuentas bancarias (`tenant_bank_accounts.location_id`)
- Usuarios asignados (`tenant_user.location_id`)

## Archivos afectados
- Migraciones: `create_locations_table`, `add_reservation_settings_to_locations_table`, `add_payment_proof_to_reservations_and_locations` (reservation_payment_proof_required en locations).
- Modelo: `App\Models\Tenant\Locations\Location` — casts opening_hours, social_networks; booted para is_main único.
- Controlador: `Tenant/Admin/Locations/LocationController` — FormRequests, try-catch, límite por plan, destroy con validación de dependientes (tenant_id + location_id explícitos).
- FormRequests: `StoreLocationRequest`, `UpdateLocationRequest`.
- Frontend: Index (EmptyState, límite X/Y, permisos, Cards móvil, AlertDialog, Switch), Create (atLimit), Edit, Show, LocationForm (loader, aviso sede principal).
- Ruta pública: `GET /{tenant}/locations` → PublicController::locations.
- Planes: `locations` en MODULE_HAS_LIMIT (SuperAdmin).

## QA / Paso QA

| Criterio | Estado |
|----------|--------|
| Aislamiento tenant (solo sedes del tenant actual) | Cumplido (where tenant_id en todas las consultas) |
| No eliminar sede principal | Cumplido |
| No eliminar sede con dependientes; mensaje claro | Cumplido |
| Formularios y errores en español desde FormRequest | Cumplido |
| Límite por plan en UI y backend | Cumplido |
| EmptyState y feedback (toast, Loader2) | Cumplido |
| AlertDialog en eliminar | Cumplido |
| Responsividad móvil (Cards) | Cumplido |
| TypeScript sin any en Show/Edit | Cumplido |

*Módulo alineado con estándares de admin y documentado en MODULOS_v2/ALL.*
