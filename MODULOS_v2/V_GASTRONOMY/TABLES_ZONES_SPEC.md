# Módulo: MESAS Y ZONAS (Gastronomía)

## Descripción
Gestión de zonas (agrupaciones por sede) y mesas para pedidos en salón. Cada mesa tiene un **token único** usado en la URL pública `/{tenant}?m={token}` para que el cliente escanee el QR y realice pedidos asociados a esa mesa. Incluye carga masiva, regeneración de token e impresión de QRs.

## Clasificación
- **Tipo**: Central (vertical Gastronomía)
- **Scope**: Por tenant y por sede (`location_id` en Zone y Table)
- **Límite por plan**: No

## Stack Técnico
- **Modelos**: `App\Models\Zone`, `App\Models\Table` (BelongsToTenant), con `location_id`
- **Controlador**: `Tenant/Admin/Gastronomy/TableController.php` (Gate; FormRequests; transacción en bulk)
- **FormRequests**: StoreZoneRequest, UpdateZoneRequest, StoreTableRequest, UpdateTableRequest, BulkStoreTablesRequest (ownership tenant/location/zone; coherencia zona–sede)
- **Frontend**: `Tables/Index.tsx`, `Tables/Print.tsx`

## Esquema BD
- **zones**: id, tenant_id, location_id, name, timestamps. FK zone_id en tables con onDelete cascade.
- **tables**: id, tenant_id, zone_id, location_id, name, **token** (unique global), capacity, status (available|occupied|reserved|maintenance), timestamps.

## Reglas de Negocio
1. Zonas y mesas por sede; validación de ownership y que la zona pertenezca a la sede en FormRequests.
2. Token único global: generación con `withoutGlobalScope(TenantScope::class)`.
3. Borrar zona elimina sus mesas en cascada.
4. Carga masiva en transacción; try-catch y flash error + toast.

## Estándares (checklist)
- [x] Permisos tables.view, tables.create, tables.update, tables.delete (PermissionSeeder)
- [x] Gate en todos los métodos del controlador
- [x] FormRequests con ownership y coherencia zona–sede
- [x] bulkStore con DB::transaction y try-catch
- [x] generateUniqueToken sin TenantScope
- [x] Frontend: hasPermission, handleProtectedAction, PermissionDeniedModal
- [x] Empty state (Empty + EmptyHeader/Media/Title/Description)
- [x] AlertDialog variant destructive
- [x] TypeScript TableStatus, sin any
- [x] Errores validación por campo; onError en submits; flash.error con toast

## Permisos
| Permiso | Descripción |
|---------|-------------|
| tables.view | Ver listado e imprimir QRs |
| tables.create | Crear zonas, mesas y carga masiva |
| tables.update | Editar zonas/mesas y regenerar token |
| tables.delete | Eliminar zonas y mesas |

## Rutas (prefix tables)
- GET / → index | POST /zones → storeZone | PUT /zones/{zone} → updateZone | DELETE /zones/{zone} → destroyZone
- POST / → storeTable | PUT /{table} → updateTable | DELETE /{table} → destroyTable
- POST /bulk → bulkStore | POST /{table}/regenerate-token → regenerateToken | GET /print → print

## URL QR mesa
Sin ruta nombrada. Construir: `{origin}/{tenant.slug}?m={table.token}` (como en Print.tsx).

## Auditoría
Véase **TABLES_ZONES_AUDIT.md**.

## Archivos
- Backend: Zone.php, Table.php, TableController.php, FormRequests (Store/Update Zone, Store/Update/Bulk Table), web.php
- Frontend: Tables/Index.tsx, Tables/Print.tsx
- Seeders: PermissionSeeder (tables.*)
