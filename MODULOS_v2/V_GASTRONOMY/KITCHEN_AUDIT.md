# Auditoría: Monitor de Cocina (KDS)

**Fecha:** 2026-02-14
**Módulo:** Kitchen Display System (KDS)
**Vertical:** Gastronomía
**Estado:** Auditado y corregido (Fase 3 completada)

---

## Tabla de Cumplimiento

| # | Regla | Hallazgo | Cumple |
|---|-------|----------|--------|
| 1 | Gate::authorize en markAsReady | FormRequest tenía Gate pero el método no. **Corregido:** Gate::authorize('kitchen.update') directo | Cumple |
| 2 | Type hints y return types PHP | $tenant, $orderId sin type hint, métodos sin return type. **Corregido:** string, int, InertiaResponse, JsonResponse | Cumple |
| 3 | Validación location_id vs tenant | Se usaba location_id del request sin verificar pertenencia. **Corregido:** método resolveLocationId() valida contra tenant | Cumple |
| 4 | Lógica duplicada index/getOrders | Misma query copiada en 2 métodos. **Corregido:** método privado getKitchenOrders() compartido | Cumple |
| 5 | Validación transición de estados | Sin verificar que confirmed→ready sea válido vs confirmed→confirmed. **Corregido:** VALID_TRANSITIONS constante con validación explícita | Cumple |
| 6 | Log::info en producción (Evento) | OrderSentToKitchen tenía 3 Log::info() en constructor y broadcastOn. **Corregido:** eliminados | Cumple |
| 7 | $request->validated() en markAsReady | Usaba $request->input() en vez de validated(). **Corregido:** $request->validated()['status'] | Cumple |
| 8 | Tipar window.Echo (TS) | Se accedía sin interfaz tipada. **Corregido:** EchoInstance y EchoChannel en types/pos.ts | Cumple |
| 9 | key={idx} en items | Items del KitchenOrderCard usaban índice. **Corregido:** key={item.id} | Cumple |
| 10 | Interfaces locales no compartidas | KitchenOrder/KitchenOrderItem estaban en el componente. **Corregido:** movidas a types/pos.ts, re-export para compat | Cumple |
| 11 | Loading state en DESPACHAR | Sin indicador visual al procesar. **Corregido:** processingId + Loader2 spinner + disabled | Cumple |
| 12 | Confirmación al despachar | Un clic accidental marcaba como listo. **Corregido:** AlertDialog "¿Despachar pedido?" antes de ejecutar | Cumple |
| 13 | Botón "Preparando" | Solo existía DESPACHAR. **Corregido:** botón intermedio "PREPARANDO" (confirmed→preparing) | Cumple |
| 14 | Filtro por estado | Sin forma de filtrar confirmed vs preparing. **Corregido:** pills Todos/Nuevos/Preparando con contadores | Cumple |
| 15 | Selector de sede | Sin forma de cambiar sede. **Corregido:** Select con locations del tenant | Cumple |
| 16 | Auto-refresh fallback | Si WebSocket fallaba, KDS se congelaba. **Corregido:** polling cada 30s cuando Echo no está conectado | Cumple |
| 17 | Indicador conexión real | Footer decía "Pusher Connected" siempre. **Corregido:** Wifi/WifiOff dinámico + "Tiempo Real" vs "Modo Polling" | Cumple |
| 18 | Audio fallback | Si audio bloqueado, falla silencioso. **Corregido:** toast visual como fallback cuando autoplay está bloqueado | Cumple |
| 19 | Items cancelados en tarjeta | Items anulados desde POS no se mostraban. **Corregido:** se muestran tachados con icono Ban en sección separada | Cumple |
| 20 | Refresh manual | Sin forma de refrescar sin recargar página. **Corregido:** botón RefreshCw en header | Cumple |
| 21 | Locations pasadas desde backend | Backend no enviaba locations. **Corregido:** se pasa Location::select('id','name') al render | Cumple |
| 22 | Sonido notificación con Web Audio API | Usaba MP3 que no existía (`/sounds/notification.mp3`). **Corregido:** reemplazado por Web Audio API (ding-dong-ding) sin dependencia de archivos | Cumple |
| 23 | Notas de productos visibles | Notas especiales de productos no llegaban a cocina. **Corregido:** OrderSentToKitchen incluye notes en broadcastWith, KitchenOrderCard muestra notas con icono StickyNote | Cumple |
| 24 | Solo mostrar items nuevos | Al agregar items a orden existente, cocina veía todos (viejos + nuevos). **Corregido:** items previos se marcan 'served' en backend, KitchenOrderCard filtra solo status='active' | Cumple |
| 25 | Glassmorphism eliminado | Fondos semi-transparentes (bg-*-50/50) generaban efecto no deseado. **Corregido:** reemplazados por fondos sólidos (bg-*-50) | Cumple |
| 26 | Validación en getOrders | $request->input('status') sin validar. **Corregido:** $request->validate(['status' => 'nullable|string|in:confirmed,preparing,ready']) | Cumple |
| 27 | Dispatch evento después de commit | OrderSentToKitchen se disparaba dentro de DB::transaction. **Corregido:** movido después de DB::commit() para garantizar persistencia antes de broadcast | Cumple |

---

## Resumen Numérico

| Estado | Cantidad |
|--------|----------|
| Cumple | 27 |
| No cumple | 0 |

---

## Archivos Modificados

### Backend (Fase 1)
- `app/Http/Controllers/Tenant/Admin/Gastronomy/KitchenController.php` — type hints, return types, Gate, resolveLocationId(), getKitchenOrders(), VALID_TRANSITIONS, locations en render
- `app/Events/OrderSentToKitchen.php` — eliminados Log::info de producción
- `app/Http/Requests/Tenant/Admin/Gastronomy/UpdateKitchenOrderStatusRequest.php` — sin cambios (ya estaba bien)

### Backend (Fase 2-3)
- `app/Http/Controllers/Tenant/Admin/Gastronomy/KitchenController.php` — validación en getOrders con $request->validate()
- `app/Events/OrderSentToKitchen.php` — notes y status en broadcastWith() para cada item
- `app/Traits/ProcessesGastronomyOrders.php` — dispatch después de commit, items previos marcados 'served' al agregar nuevos a orden existente

### Frontend (Fase 1)
- `resources/js/types/pos.ts` — KitchenOrder, KitchenOrderItem, EchoChannel, EchoInstance
- `resources/js/Pages/Tenant/Admin/Gastronomy/Kitchen/Index.tsx` — tipado Echo, polling fallback, filtro estados, selector sede, confirmación, refresh manual, indicador conexión
- `resources/js/Pages/Tenant/Admin/Gastronomy/Kitchen/Components/KitchenOrderCard.tsx` — key={item.id}, loading state, botón Preparando, items cancelados tachados, tipos compartidos

### Frontend (Fase 2-3)
- `resources/js/Pages/Tenant/Admin/Gastronomy/Kitchen/Index.tsx` — Web Audio API reemplaza MP3, polling removido (Ably es principal)
- `resources/js/Pages/Tenant/Admin/Gastronomy/Kitchen/Components/KitchenOrderCard.tsx` — notas visibles, filtro activeItems solo status='active', glassmorphism eliminado
- `resources/js/types/pos.ts` — KitchenOrderItem.status incluye 'served'
