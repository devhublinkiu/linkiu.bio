# Auditoría: Panel de Meseros

**Fecha:** 2026-02-14
**Módulo:** Panel de Meseros (Waiter Panel)
**Vertical:** Gastronomía
**Estado:** Auditado y corregido (Fase 3 completada)

---

## Tabla de Cumplimiento

| # | Regla | Hallazgo | Cumple |
|---|-------|----------|--------|
| 1 | FormRequest dedicado | `storeOrder` usaba `Request` sin validación. **Corregido:** creado `StoreWaiterOrderRequest` con validación IDOR | Cumple |
| 2 | Return types PHP | Sin return types en métodos. **Corregido:** InertiaResponse, JsonResponse | Cumple |
| 3 | tenant_id en products query | Subquery de products no filtraba por tenant_id. **Corregido:** `where('tenant_id', $tenant->id)` explícito | Cumple |
| 4 | IDOR en mesa (table_id) | table_id se enviaba sin validar pertenencia. **Corregido:** Rule::exists con where tenant_id en FormRequest | Cumple |
| 5 | IDOR en productos (items.*.product_id) | Sin validación de pertenencia. **Corregido:** Rule::exists con where tenant_id | Cumple |
| 6 | location_id faltante | No se enviaba ni validaba location_id. **Corregido:** se resuelve en backend + se valida en FormRequest + se envía desde frontend | Cumple |
| 7 | Multi-sede (selector) | Sin forma de cambiar sede. **Corregido:** Select de locations en header + zones filtradas por locationId | Cumple |
| 8 | Zones filtradas por sede | Se cargaban todas las zonas sin filtrar. **Corregido:** `when($locationId, fn($q) => $q->where('location_id', $locationId))` | Cumple |
| 9 | Active order info en mesas | Mesas solo mostraban punto amarillo. **Corregido:** muestran total y tiempo transcurrido de la orden activa | Cumple |
| 10 | `tenant: any` → tipado | Prop tenant sin tipo. **Corregido:** `Tenant` de types/pos.ts | Cumple |
| 11 | `variant_options: any[]` → tipado | CartItem usaba any[]. **Corregido:** `VariantOption[]` de types/pos.ts | Cumple |
| 12 | `(v: any)` en variant display | Cast a any en map. **Corregido:** usa `v.option_name \|\| v.name` tipado | Cumple |
| 13 | `(usePage() as any)` → tipado | Cast a any para user name. **Corregido:** cast a `{ name?: string }` | Cumple |
| 14 | formatPrice local → formatCurrency | Función duplicada en 2 sitios. **Corregido:** usa `formatCurrency` centralizado en todo el componente | Cumple |
| 15 | ProductCard Intl.NumberFormat inline | Formato de moneda inline. **Corregido:** usa `formatCurrency` | Cumple |
| 16 | Impuestos no calculados | Total mostraba suma sin tax. **Corregido:** `calculateTax()` con subtotal/impuesto/total en el footer | Cumple |
| 17 | Confirmación antes de enviar | Sin confirmación al enviar a cocina. **Corregido:** AlertDialog con resumen del pedido | Cumple |
| 18 | Vaciar carrito (clear cart) | Sin forma de vaciar carrito. **Corregido:** botón Trash2 en header del cart + AlertDialog confirmación | Cumple |
| 19 | Modo Takeout / Para llevar | Solo soportaba dine_in. **Corregido:** toggle Mesa/Para llevar en header + flujo sin mesa | Cumple |
| 20 | Skeleton loader | Carga directa sin feedback. **Corregido:** skeleton animado de 8 placeholders para productos | Cumple |
| 21 | Protección al salir | Se perdía el carrito sin aviso. **Corregido:** `beforeunload` event listener cuando hay items | Cumple |
| 22 | Búsqueda de mesas | Sin filtro de mesas. **Corregido:** input de búsqueda en header de la sección de mesas | Cumple |
| 23 | Error handling detallado | Errores genéricos de axios. **Corregido:** parseo de errors de validación y muestra del primer error específico | Cumple |
| 24 | Loading state envío | Sin indicador al enviar. **Corregido:** Loader2 spinner + disabled en botón | Cumple |
| 25 | Empty state zonas sin mesas (filtradas) | Sin feedback. **Corregido:** mensaje "Sin resultados" / "Sin mesas" según contexto | Cumple |
| 26 | Notificación despacho cocina | Mesero no recibía alerta cuando cocina despachaba. **Corregido:** Echo escucha 'ready' con sonido Web Audio API + toast | Cumple |
| 27 | Estado "LISTO" persiste visualmente | Badge LISTO desaparecía al cambiar de mesa. **Corregido:** readyOrderIds como Set, zonesRef para evitar re-suscripciones Echo | Cumple |
| 28 | Agregar items a orden existente | No se podían agregar más items a mesa con orden activa. **Corregido:** handleTableSelect carga items existentes como is_sent, nuevos items se acumulan | Cumple |
| 29 | Cart no pierde items previos | Al enviar nuevos items, los anteriores desaparecían. **Corregido:** confirmSubmit fusiona items nuevos (is_sent:true) con existentes | Cumple |
| 30 | Flujo de pago mesero (pre-cuenta) | Mesero no podía mostrar cuenta ni registrar pago. **Corregido:** modal pre-cuenta con métodos de pago, cuentas bancarias, referencia, foto comprobante (BunnyCDN) | Cumple |
| 31 | Botón "En aprobación" post-cobro | Botón pre-cuenta no cambiaba estado tras registrar pago. **Corregido:** cambia a "EN APROBACIÓN — CAJA VERIFICANDO" deshabilitado | Cumple |
| 32 | Mesa muestra "Cobrado" tras pago | Sin indicador visual de que la mesa ya fue cobrada. **Corregido:** tarjeta mesa muestra borde esmeralda + badge "Cobrado" | Cumple |
| 33 | Notificación verificación de caja | Mesero no sabía cuándo caja verificaba el pago. **Corregido:** Echo escucha 'payment_verified', libera mesa localmente, sonido + toast | Cumple |
| 34 | Try-catch en submitPaymentProof | Operación crítica (subida BunnyCDN + update) sin manejo de errores. **Corregido:** try-catch con mensaje descriptivo | Cumple |
| 35 | Toasts con ID único | Toasts podían duplicarse. **Corregido:** todos los toasts tienen id único por orderId | Cumple |
| 36 | Tiempo real solo vía Ably | Se usaba polling como fallback principal. **Corregido:** polling removido, solo Echo/Ably | Cumple |
| 37 | Mesa actualiza estado inmediato | Tras enviar a cocina, mesa no se veía ocupada sin refrescar. **Corregido:** localZones se actualiza inmediatamente en confirmSubmit | Cumple |
| 38 | Métodos de pago y cuentas bancarias | Backend no pasaba datos de pago al mesero. **Corregido:** WaiterController pasa paymentMethods y bankAccounts como props | Cumple |

---

## Resumen Numérico

| Estado | Cantidad |
|--------|----------|
| Cumple | 38 |
| No cumple | 0 |

---

## Archivos Modificados

### Backend (Fase 1)
- `app/Http/Controllers/Tenant/Admin/Gastronomy/WaiterController.php` — return types, location resolver, tenant_id en products, zones por sede, locations en render, FormRequest, taxSettings
- `app/Http/Requests/Tenant/Admin/Gastronomy/StoreWaiterOrderRequest.php` — **Nuevo**: validación IDOR (table_id, product_id, location_id, customer_id) + Gate::allows

### Backend (Fase 2-3)
- `app/Http/Controllers/Tenant/Admin/Gastronomy/WaiterController.php` — storeOrder retorna order_id/total, submitPaymentProof con try-catch, dispatch OrderStatusUpdated('waiter_collected'), paymentMethods y bankAccounts en index()
- `app/Http/Requests/Tenant/Admin/Gastronomy/StoreWaiterOrderRequest.php` — send_to_kitchen como nullable|boolean
- `app/Models/Tenant/Gastronomy\Order.php` — waiter_collected en $fillable
- `database/migrations/2026_02_14_*_add_waiter_collected_to_gastronomy_orders_table.php` — **Nueva migración**
- `routes/web.php` — ruta waiters/payment-proof

### Frontend (Fase 1)
- `resources/js/Pages/Tenant/Admin/Gastronomy/Waiters/Index.tsx` — reescritura completa: tipado, formatCurrency, calculateTax, confirmaciones, takeout mode, skeleton, protección salida, búsqueda mesas, active order info, selector sede, loading states

### Frontend (Fase 2-3)
- `resources/js/Pages/Tenant/Admin/Gastronomy/Waiters/Index.tsx` — Echo/Ably real-time (readyOrderIds, sessionOrderIds), localZones state, zonesRef/selectedTableRef, flujo pre-cuenta completo (modal pago, métodos, cuentas bancarias, foto comprobante, referencia), botón "En aprobación", badge "Cobrado" en mesas, notificación payment_verified, limpieza de mesa al verificar, toasts con ID, Web Audio API
- `resources/js/types/pos.ts` — ActiveOrder ampliado (waiter_collected, payment_method, payment_proof_url, payment_reference)
