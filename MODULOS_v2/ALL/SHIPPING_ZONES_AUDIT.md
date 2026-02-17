# Auditoría: Módulo Zonas de Envío (Métodos de Envío)

Auditoría estricta según skills `linkiu_admin_implementation_rules` y `linkiu_qa_and_testing_protocol`.  
**Alcance:** Controlador, modelos, rutas, frontend `Tenant/Admin/Shipping/Index.tsx`, permisos, validaciones.

---

## Tabla de hallazgos

| Regla | Hallazgo | Cumple / No cumple |
|-------|----------|--------------------|
| Modelos tenant en `App\Models\Tenant\...` con BelongsToTenant | `TenantShippingMethod` y `ShippingZone` están en `App\Models\`; ninguno usa trait `BelongsToTenant`. Aislamiento por tenant solo vía relación manual en consultas. | **No cumple** |
| Controlador en `Tenant/Admin/[Modulo]/` (subcarpeta por módulo) | Controlador está en `Tenant/Admin/ShippingController.php`; no existe carpeta `Tenant/Admin/Shipping/`. | **No cumple** |
| Validación con FormRequests (sin validación en controlador) | `update()` y `updateZones()` usan `$request->validate()` dentro del controlador. No hay `UpdateShippingMethodRequest` ni `UpdateZonesRequest`. | **No cumple** |
| FormRequest con mensajes en español | No aplica; no hay FormRequests. Mensajes de validación son los por defecto de Laravel. | **No cumple** |
| location_id validado por tenant (evitar IDOR) | `location_id` se valida con `exists:locations,id` sin restricción por `tenant_id`. Otros módulos (PaymentMethods, Sliders) usan `Rule::exists(..., where tenant_id)`. | **No cumple** |
| Try-catch en operaciones críticas / transacciones | `updateZones()` usa `DB::transaction` pero no try-catch; fallo deja 500 sin mensaje controlado. | **No cumple** |
| Type hints en PHP | Controlador tiene type hints en métodos; parámetro `$method` en rutas llega como ID y se resuelve con findOrFail (aceptable). | **Cumple** |
| TypeScript sin `any` | Props y parámetros usan `any`: `tenant: any`, `method: any`, `locations: any[]`, `handleProtectedAction: any`, `settings?: any`, `CurrencyInput(... : any)`. | **No cumple** |
| hasPermission considera is_owner y permissions.includes('*') | Solo se comprueba `currentUserRole?.permissions?.includes(permission)`. Owner o rol con `*` pueden quedar sin acceso en la página. | **No cumple** |
| Acciones destructivas con AlertDialog (variante destructive) | Eliminar departamento completo usa AlertDialog pero el botón de confirmar no usa `variant="destructive"`. Eliminar una ciudad individual es un botón X sin confirmación. | **No cumple** |
| EmptyState con icono y CTA cuando no hay datos | Sin zonas se muestra un div con texto y mensaje “Nueva Zona”; no es componente EmptyState con iconografía y CTA estándar. | **No cumple** |
| Feedback visual (Spinner/Skeleton) en acciones >300ms | Botón “Guardar Cambios” usa `disabled={processing}` pero no muestra Loader2 ni spinner. Submit de zonas y toggle sin indicador de carga. | **No cumple** |
| Eager loading (evitar N+1) | Se usa `with('zones', 'location')` en métodos. Correcto. | **Cumple** |
| Select de columnas (evitar select *) | `shippingMethods()` se trae sin `select()`; `locations` sí usa `select('id', 'name')`. | **No cumple** |
| Paginación en listados dinámicos | Métodos son 3 tipos fijos por ubicación (aceptable sin paginar). Zonas se cargan todas con el método; si crecen mucho podría ser problema. | **Cumple** (métodos) / **Observación** (zonas) |
| Rutas con auth y tenant | Rutas bajo grupo con middlewares adecuados. | **Cumple** |
| IDOR: recurso pertenece al tenant | En `update` y `updateZones` se comprueba `$method->tenant_id === $currentTenant->id` antes de modificar. | **Cumple** |
| Filtrado por location para usuarios no owner | Index filtra métodos por `location_id` del usuario o global; `ensureDefaultMethods` con location. | **Cumple** |
| Permisos seeded (shipping_zones.view/create/update/delete) | Permisos definidos en PermissionSeeder. | **Cumple** |
| Gate::authorize en acciones | index (view), update (update), updateZones (update). Create no tiene ruta dedicada (zonas se crean vía updateZones). | **Cumple** |
| UI 100% español | Textos de interfaz en español. | **Cumple** |
| Shadcn Only / sin window.confirm | Se usan componentes Shadcn; no hay confirm nativo. | **Cumple** |
| Atomicidad (operaciones complejas) | `updateZones` usa `DB::transaction` para borrar y crear zonas. | **Cumple** |
| Responsividad (mobile-first, touch targets) | Layout en grid; cards; botones y controles razonables. No hay tabla que requiera cards en móvil. | **Cumple** |
| Priorizar Drawers en móvil vs modales | Modal “Agregar Cobertura” es Dialog; no se usa Drawer en móvil. | **No cumple** (según regla estricta) |

---

## Resumen numérico

- **Cumple:** 11  
- **No cumple:** 15  
- **Observación:** 1 (zonas sin paginar si crecen)

---

## Experiencia y flujo – valoración

**¿Tiene buena experiencia?**  
Sí en lo básico: la pantalla es clara (tres métodos con cards), el switch activa/desactiva, los formularios por método son entendibles y el flujo “activar nacional → agregar zonas” es lógico. La integración con la API de Colombia (departamentos/ciudades) y la opción “Todo el departamento” mejoran la usabilidad.  
**Pero** la experiencia no alcanza el estándar “premium” que piden las skills: falta feedback de carga en guardar/toggle/zonas, la eliminación de una ciudad sin confirmación puede generar borrados accidentales, y el owner/rol con `*` podría no poder editar si `hasPermission` no los considera.

**Mejoras recomendadas (prioridad):**

1. **Seguridad y consistencia:** FormRequests para update y updateZones; validar `location_id` con `Rule::exists(..., where('tenant_id', ...))`; mover modelos a `Tenant\Shipping\` con BelongsToTenant; controlador en `Tenant/Admin/Shipping/ShippingController.php`.
2. **Permisos:** Incluir en `hasPermission` la lógica `is_owner || permissions.includes('*') || permissions.includes(permission)` (como en PaymentMethods/Locations).
3. **Destructivas:** Confirmación con AlertDialog también al eliminar una ciudad; botón de confirmar con `variant="destructive"` en ambos casos.
4. **Feedback:** Mostrar Loader2 (o spinner) en “Guardar Cambios”, en el submit de zonas y en el toggle del método mientras se procesa.
5. **EmptyState:** Sustituir el bloque de “No hay zonas” por un EmptyState reutilizable con icono (ej. MapPin) y CTA “Nueva Zona”.
6. **TypeScript:** Sustituir `any` por tipos/interfaces (Tenant, ShippingMethod, ShippingZone, LocationOption, etc.).
7. **Opcional:** Drawer para “Agregar Cobertura” en móvil; paginación o virtualización de zonas si en el futuro el volumen lo justifica.

Con estos cambios el módulo quedaría alineado con las skills y con una experiencia más sólida y segura.

**Realizado:** Modelos en `Tenant\Shipping\` con BelongsToTenant; controlador en `Tenant/Admin/Shipping/`; FormRequests; try-catch en updateZones; hasPermission con is_owner y `*`; AlertDialog destructive; EmptyState; Loader2; tipos TS; select de columnas; modal responsive en móvil (sin Drawer).
