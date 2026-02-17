# Auditoría — Módulo de Pedidos (Gastronomía)

> Fecha: 2026-02-14 | Estado: **Cumple al 100%**

---

## Informe de Cumplimiento

| # | Regla (Skill) | Hallazgo | Cumple |
|---|---|---|---|
| 1 | Tipos estrictos — sin `any` | Todos los tipos definidos con interfaces (`Order`, `OrderItem`, `StatusHistoryEntry`, etc.). `0` uso de `any`. | ✅ |
| 2 | Interfaces propias — no depender de `@ts-ignore` | Cero `@ts-ignore`. Tipos heredan de `pos.ts` (`Tenant`, `Location`, `EchoInstance`) y definen propios. | ✅ |
| 3 | `formatCurrency` centralizado | Se importa de `@/utils/currency.ts`. Cero formateo manual. | ✅ |
| 4 | Loading states en toda acción | `processingOrderId` bloquea botones. `loadingDetail` muestra spinner en modal. Skeleton general al cargar. | ✅ |
| 5 | Confirmación antes de cambiar estado | `AlertDialog` con mensaje contextual (cancelar = advertencia, otros = info). | ✅ |
| 6 | Validación de transiciones de estado | `UpdateOrderStatusRequest.php` con máquina de estados (`VALID_TRANSITIONS`). Backend rechaza transiciones inválidas. | ✅ |
| 7 | FormRequest dedicado | `UpdateOrderStatusRequest` reemplaza validación inline. Autoriza con `Gate::allows('orders.update')`. | ✅ |
| 8 | IDOR — scope por `tenant_id` | Controller filtra `Order::where('tenant_id', ...)` en `index()`, `show()` y `updateStatus()`. Location validada contra tenant. | ✅ |
| 9 | `$request->validated()` | `updateStatus()` usa `$request->validated()`, no `$request->all()`. | ✅ |
| 10 | Autorización granular | `Gate::authorize('orders.view')` en `index`/`show`, `Gate::allows('orders.update')` en FormRequest. | ✅ |
| 11 | Eager loading — sin N+1 | `items.product`, `table`, `location`, `creator` cargados en `index()`. `statusHistory.user` en `show()`. | ✅ |
| 12 | Paginación | `paginate(20)` en historial, `paginate(60)` en vista activa. Frontend muestra controles de paginación. | ✅ |
| 13 | `$request` inyectado — no `request()` | Controller solo usa `Request $request` inyectado. | ✅ |
| 14 | Filtro por sede | `location_id` como query param. Validado contra tenant. Selector en UI con `Building2` icon. | ✅ |
| 15 | Filtro por tipo de servicio | `serviceFilter` local: Mesa / Para Llevar / Domicilio / Todos. | ✅ |
| 16 | Búsqueda rápida | Input busca por nombre, teléfono, ticket, ID. Filtrado en frontend con `useMemo`. | ✅ |
| 17 | Historial vs Kanban | Toggle claro entre "Tablero" (kanban columnas) e "Historial" (tabla con paginación). | ✅ |
| 18 | Empty states significativos | Kanban: icono + texto "Sin pedidos". Historial: `ClipboardList` + mensaje. | ✅ |
| 19 | Notas de items visibles | `item.notes` se muestra en modal de detalle con icono `StickyNote` y color ámbar. | ✅ |
| 20 | Items cancelados diferenciados | Items con `status === 'cancelled'` se muestran con `line-through`, fondo rojo tenue y badge "Anulado". | ✅ |
| 21 | Creador visible | `order.creator.name` mostrado en modal de detalle. | ✅ |
| 22 | Info de pago visible | Método de pago traducido (no raw key), badge "Mesero" si `waiter_collected`, referencia y comprobante. | ✅ |
| 23 | Historial de estados | `status_history` con transición, usuario, fecha y notas. Cargado via `show()` endpoint. | ✅ |
| 24 | Echo / Ably — tiempo real | Canal `tenant.{id}.orders` escucha `.order.created`. Sound + toast + reload automático. | ✅ |
| 25 | Web Audio API — sin MP3 | Sonido generado con `AudioContext` + osciladores. Sin dependencia de archivos de audio. | ✅ |
| 26 | Responsive / Mobile | Mobile: tabs horizontales con scroll + cards apiladas. Desktop: columnas kanban. | ✅ |
| 27 | `key` estable — no `index` | Todas las listas usan `key={order.id}` o `key={item.id}`. Paginación usa `key={i}` (aceptable: lista estática). | ✅ |
| 28 | Sin `dangerouslySetInnerHTML` | Paginación labels sanitizados con `.replace()`. Cero uso de `dangerouslySetInnerHTML`. | ✅ |
| 29 | Liberación de mesa | Controller libera mesa (`status → available`) cuando orden pasa a `completed` o `cancelled`. | ✅ |
| 30 | WhatsApp post-cambio | Controller envía plantilla WhatsApp según nuevo estado (confirmed, ready, completed, cancelled). | ✅ |
| 31 | Transacciones DB | `DB::beginTransaction/commit/rollBack` en `updateStatus`. Evento dispatched post-commit. | ✅ |

---

## UX/UI — Mejoras Implementadas

1. **Kanban visual** — Columnas con colores por estado, contadores, cards compactas con timer.
2. **Modal de detalle completo** — Cliente, mesa, sede, creador, productos con variantes y notas, totales, pago, comprobante, historial de estados.
3. **Selector de sede** — Solo aparece si hay más de una sede.
4. **Filtros combinables** — Sede + tipo de servicio + búsqueda (cliente/ticket/teléfono).
5. **Skeleton loader** — 300ms de delay antes de renderizar para evitar flash.
6. **Acciones directas en tarjeta** — Botón de siguiente estado sin abrir modal.
7. **Cancelación protegida** — AlertDialog con advertencia diferenciada para cancelar.

---

## Archivos Modificados

| Archivo | Cambio |
|---|---|
| `OrderController.php` | Refactorizado: eager load, paginación, location filter, `$request` inyectado, scope por tenant |
| `UpdateOrderStatusRequest.php` | **NUEVO** — FormRequest con máquina de estados y mensajes en español |
| `Orders/Index.tsx` | **Reescrito** — Tipos estrictos, Kanban+Historial, filtros, responsive, Echo, detalle completo |
