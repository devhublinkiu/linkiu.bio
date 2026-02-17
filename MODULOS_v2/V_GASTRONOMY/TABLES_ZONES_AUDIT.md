# Auditoría: Módulo Mesas y Zonas (Tenant Admin)

**Alcance:** Zonas y mesas para gastronomía (pedidos en salón, QRs por mesa).  
**Referencias:** `linkiu_admin_implementation_rules` (skill), `modular/reglas.md` (ACL).  
**Estado:** Implementación alineada con estándares (post-correcciones).

---

## 1. Cumplimiento por estándar (skill)

### 1.1 Arquitectura y estructura
| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Admin Backend en `.../Tenant/Admin/[Modulo]/` | ✅ | `TableController` en `Tenant/Admin/Gastronomy/` |
| Admin Frontend en `.../Pages/Tenant/Admin/[Modulo]/` | ✅ | `Tables/Index.tsx`, `Print.tsx` en `Tenant/Admin/Gastronomy/Tables/` |
| Modelos tenant en `app/Models/Tenant/...` | ⚠️ | `Zone` y `Table` en `app/Models/`. La skill permite que permanezcan hasta migrarlos. |
| Namespaces = ubicación en disco | ✅ | Coinciden |

### 1.2 Seguridad y aislamiento
| Requisito | Estado | Detalle |
|-----------|--------|---------|
| BelongsToTenant en modelos | ✅ | Zone y Table |
| Rutas con auth y tenant | ✅ | Grupo bajo middlewares correspondientes |
| IDOR | ✅ | Route model binding aplica TenantScope; FormRequests validan `location_id` y `zone_id` por tenant |
| Location-awareness | ✅ | Index y datos filtrados por `location_id`; zona y mesa con sede |

### 1.3 Lógica de negocio y código
| Requisito | Estado | Detalle |
|-----------|--------|---------|
| FormRequests (no validación en controlador) | ✅ | Store/Update Zone, Store/Update Table, BulkStoreTables |
| Try-catch en operaciones críticas | ✅ | bulkStore con transacción y try-catch; redirect con flash error |
| Tipado PHP / TypeScript | ✅ | Type hints; TableStatus, sin `any` |

### 1.4 UX
| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Feedback >300ms | ✅ | Botones con `processing`; onError + toast |
| Sonner | ✅ | toast.success / toast.error |
| AlertDialog destructive | ✅ | variant="destructive" en eliminar |
| Empty state | ✅ | Empty + EmptyHeader + EmptyMedia + EmptyTitle + EmptyDescription + CTA |
| Responsividad | ✅ | Sheet, grid adaptable |

### 1.5 Rendimiento
| Requisito | Estado | Detalle |
|-----------|--------|---------|
| N+1 | ✅ | Zone::with(['tables']) en index y print |
| Paginación | ⚠️ | No aplicada; listado por sede con volumen acotado. Valorar si crece. |
| Selección de columnas | ⚠️ | Sin select() explícito; aceptable para el tamaño actual |

### 1.6 ACL
| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Permisos por módulo | ✅ | tables.view, tables.create, tables.update, tables.delete en PermissionSeeder |
| Backend Gate | ✅ | En todos los métodos del controlador |
| Frontend hasPermission / PermissionDeniedModal | ✅ | handleProtectedAction en botones; modal al no tener permiso |

---

## 2. Validaciones y consistencia
- **location_id**: Exists en `locations` con `where('tenant_id', $tenantId)` en todos los FormRequests que lo usan.
- **zone_id**: Exists en `zones` con `where('tenant_id', $tenantId)`; además withValidator comprueba que la zona pertenezca a la sede enviada.
- **Errores en frontend**: Mensajes por campo en Zone, Table y Bulk Sheets; onError en submit y delete; flash.error mostrado con toast.

---

## 3. Datos al editar
- Al abrir "Editar zona" se rellena `location_id` desde `zone.location_id` (interfaz Zone con `location_id` opcional).
- Al abrir "Editar mesa" se rellena `location_id` desde `table.location_id` (interfaz Table con `location_id` opcional).

---

## 4. Pendientes opcionales / futuro
- **Modelos**: Migrar `Zone` y `Table` a `app/Models/Tenant/Gastronomy/` cuando se alinee el resto de módulos.
- **Paginación**: Si una sede tiene muchas zonas/mesas, valorar paginar zonas o mesas en el listado.
- **Select de columnas**: En consultas de listado, pedir solo columnas necesarias si se prioriza rendimiento.

---

## 5. Resumen
El módulo cumple los estándares de la skill y de ACL. La documentación de especificación queda en **TABLES_ZONES_SPEC.md** y este archivo sirve como registro de auditoría y estado de cumplimiento.
