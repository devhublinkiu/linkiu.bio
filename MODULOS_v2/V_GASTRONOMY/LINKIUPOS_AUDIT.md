# Auditoría: LinkiuPOS

**Fecha:** 2026-02-14
**Módulo:** Punto de Venta (LinkiuPOS)
**Vertical:** Gastronomía
**Estado:** Auditado y corregido (Fase 3 completada)

---

## Tabla de Cumplimiento

| # | Regla | Hallazgo | Cumple |
|---|-------|----------|--------|
| 1 | Gate::authorize en controllers | POSController, CustomerController y OrderController no tenían Gate::authorize. **Corregido:** pos.view, pos.create, pos.manage, orders.view, orders.update | Cumple |
| 2 | $request->validated() en trait | ProcessesGastronomyOrders usaba `$request->all()`. **Corregido:** usa validated() cuando es FormRequest | Cumple |
| 3 | IDOR productos cross-tenant | Product::find() sin verificar tenant_id. **Corregido:** validación en trait + Rule::exists con tenant_id en FormRequest | Cumple |
| 4 | IDOR location/table/customer | FormRequest no validaba pertenencia al tenant. **Corregido:** Rule::exists con where tenant_id | Cumple |
| 5 | FormRequest authorize() | StoreOrderRequest retornaba `true`. **Corregido:** Gate::allows('pos.create') | Cumple |
| 6 | FormRequest dedicado (Customer) | Validación inline en CustomerController@store. **Corregido:** creado StoreCustomerRequest | Cumple |
| 7 | Type hints PHP (params) | Métodos sin tipado de parámetros ni retorno. **Corregido:** string, int, return types en todos los controllers | Cumple |
| 8 | Return types PHP | Sin return types. **Corregido:** InertiaResponse, RedirectResponse, JsonResponse | Cumple |
| 9 | BelongsToTenant en Customer | Customer model no usaba BelongsToTenant. **Corregido:** trait agregado | Cumple |
| 10 | Select columnas (CustomerController) | Traía todas las columnas. **Corregido:** select() con columnas necesarias | Cumple |
| 11 | Quitar `any` TS (POSLayout) | Props `tenant: any, user: any`. **Corregido:** interfaces Tenant y UserRole tipadas | Cumple |
| 12 | Quitar `any` TS (Index.tsx) | `active_tables?: any[]`, `item: any`, `as any`. **Corregido:** interfaces OrderItemData, UserRole, Customer cast | Cumple |
| 13 | Quitar `any` TS (CheckoutDialog) | `channel: any`, `window.Echo` con ts-ignore. **Corregido:** interfaces EchoChannel, cast tipado | Cumple |
| 14 | Quitar `any` TS (VariantSelector) | `onAddToCart: (…, variants: any, …)`. **Corregido:** Record<number, number[]> | Cumple |
| 15 | Quitar `any` TS (types/pos.ts) | `[key: string]: any` en Tenant.settings, `items?: any[]` en Table. **Corregido:** Record tipado, ActiveOrder interface | Cumple |
| 16 | formatCurrency centralizado | Precios formateados con `$${x.toLocaleString()}` inconsistente. **Corregido:** utility `utils/currency.ts` usado en todos los componentes | Cumple |
| 17 | Cálculo impuestos centralizado | Lógica de tax duplicada en Index, CartSidebar, CheckoutDialog. **Corregido:** `calculateTax()` en utility | Cumple |
| 18 | Ruta frontend incorrecta | `tenant.pos.index` no existe, la ruta es `tenant.admin.pos`. **Corregido** | Cumple |
| 19 | Waiter detection (POSLayout) | Usaba `user?.card_brand` y `user?.roles?.some()` que no existen. **Corregido:** usa label + permissions | Cumple |
| 20 | Botón Tarjeta reemplazado por Cocina | "Tarjeta" era redundante con "Cobrar". **Corregido:** reemplazado por "Cocina" (enviar a cocina) | Cumple |
| 21 | Loading state | Sin feedback visual al enviar pedido. **Corregido:** isProcessing con Loader2 spinner | Cumple |
| 22 | Confirmación vaciar carrito | `onClearCart` vaciaba sin confirmar. **Corregido:** AlertDialog que preserva items enviados | Cumple |
| 23 | Timer en mesas ocupadas | Sin indicador de tiempo transcurrido. **Corregido:** `getElapsedTime()` muestra duración | Cumple |
| 24 | Búsqueda rápida de mesas | Sin filtro. **Corregido:** Input de búsqueda por nombre de mesa | Cumple |
| 25 | Sede selector en móvil | `hidden md:flex` ocultaba selector en móvil. **Corregido:** visible en todas las resoluciones | Cumple |
| 26 | EmptyState zonas sin mesas | Sin feedback cuando una zona no tiene mesas. **Corregido:** estado vacío con icono y mensaje | Cumple |
| 27 | freeTable sin cancelar orden | Liberaba mesa sin cancelar la orden activa. **Corregido:** cancela la orden + crea historial | Cumple |
| 28 | Filtro productos disponibles | POS cargaba productos no disponibles. **Corregido:** `where('is_available', true)` y scope por tenant | Cumple |
| 29 | customer_id/phone en select | activeOrder no seleccionaba customer_id ni phone. **Corregido:** agregados al select | Cumple |
| 30 | Cantidad máx por item | Sin límite en quantity. **Corregido:** max:100 en FormRequest | Cumple |
| 31 | Recibo post-pago con impresión | Sin confirmación visual post-pago. **Corregido:** ReceiptModal estilo ticket térmico con botón Imprimir | Cumple |
| 32 | Modo Takeout/Delivery sin mesa | POS solo permitía dine_in con mesa. **Corregido:** botón "Pedido Rápido" junto a zonas, flujo completo sin mesa | Cumple |
| 33 | Anular items enviados a cocina | Items enviados eran inmutables. **Corregido:** endpoint cancelItem + recálculo total + notificación KDS vía evento | Cumple |
| 34 | Badge cocina reactivo | Badge "En Cocina" era estático. **Corregido:** suscripción Echo a OrderStatusUpdated, badge verde "Listo" en mesa | Cumple |
| 35 | Default zona = "Todas" | Default era primera zona. **Corregido:** activeZoneId inicia en 'all' | Cumple |
| 36 | No enviar total desde frontend | Frontend enviaba `total` que backend ignoraba (confusión). **Corregido:** eliminado de router.post | Cumple |
| 37 | Skeleton loader mapa mesas | Sin feedback durante carga inicial. **Corregido:** skeleton animado de 10 placeholders | Cumple |
| 38 | Búsqueda rápida productos inline | Solo se podía buscar abriendo el Drawer. **Corregido:** input inline con dropdown autocompletado en header | Cumple |
| 39 | Diseño recibo impresión térmica | Impresión no se centraba ni tenía medidas térmicas. **Corregido:** handlePrint con HTML inline, 80mm width, padding, centrado | Cumple |
| 40 | Notas especiales en productos | Sin campo para notas al agregar producto. **Corregido:** textarea en VariantSelectorModal + notas visibles en cart, cocina, recibo | Cumple |
| 41 | Sonido notificación pedido listo | Sin alerta audible cuando cocina despacha. **Corregido:** Web Audio API (ding-dong-ding) en POS al recibir evento 'ready' | Cumple |
| 42 | Mesa ocupada muestra total/timer inmediato | Total y timer solo aparecían tras despacho de cocina. **Corregido:** activeOrder incluye confirmed/preparing en Table model | Cumple |
| 43 | Cargar productos de mesa ocupada | Al seleccionar mesa ocupada no mostraba productos. **Corregido:** loadActiveOrderItems carga items existentes como is_sent | Cumple |
| 44 | Verificación pago mesero | Sin forma de ver/verificar pagos del mesero en caja. **Corregido:** mesa muestra "COBRADO", modal de verificación con resumen + foto comprobante + botón verificar | Cumple |
| 45 | Notificación en tiempo real (mesero cobra) | Caja no sabía cuándo el mesero cobraba. **Corregido:** evento Echo 'waiter_collected' con sonido + toast + reload de zonas | Cumple |
| 46 | Toasts con ID único (sin duplicados) | Toasts se duplicaban entre Echo y polling. **Corregido:** todos los toasts tienen id único por orderId | Cumple |
| 47 | Traducción método de pago | Modal verificación mostraba "bank_transfer". **Corregido:** mapa de traducción (Efectivo, Transferencia Bancaria, Datáfono) | Cumple |

---

## Resumen Numérico

| Estado | Cantidad |
|--------|----------|
| Cumple | 47 |
| No cumple | 0 |

---

## Archivos Modificados

### Backend (Fase 1)
- `app/Traits/ProcessesGastronomyOrders.php` — validated(), IDOR check, type hints
- `app/Http/Controllers/Tenant/Gastronomy/POSController.php` — Gate, types, lógica freeTable, filtro productos, cancelItem endpoint
- `app/Http/Controllers/Tenant/Gastronomy/CustomerController.php` — Gate, FormRequest, select columnas
- `app/Http/Controllers/Tenant/Admin/Gastronomy/OrderController.php` — Gate, types, liberar mesa en status change
- `app/Http/Requests/Tenant/Gastronomy/StoreOrderRequest.php` — authorize(), Rule::exists scoped
- `app/Http/Requests/Tenant/Gastronomy/StoreCustomerRequest.php` — **Nuevo**
- `app/Models/Tenant/Gastronomy/Customer.php` — BelongsToTenant

### Backend (Fase 2)
- `app/Http/Controllers/Tenant/Gastronomy/POSController.php` — endpoint cancelItem con recálculo total y evento
- `app/Models/Tenant/Gastronomy/OrderItem.php` — campos status, cancelled_by, cancelled_at, notes
- `database/migrations/2026_02_14_*_add_cancellation_fields_to_gastronomy_order_items.php` — Nueva migración
- `database/migrations/2026_02_14_*_add_notes_to_gastronomy_order_items.php` — Nueva migración
- `routes/web.php` — ruta tenant.admin.pos.cancel-item

### Backend (Fase 3)
- `app/Http/Controllers/Tenant/Gastronomy/POSController.php` — endpoint verifyWaiterPayment, activeOrder select con waiter_collected/payment_method/payment_proof/payment_reference
- `app/Traits/ProcessesGastronomyOrders.php` — notas en items, dispatch después de commit, items previos marcados como 'served' al agregar nuevos
- `app/Events/OrderSentToKitchen.php` — notes y status en broadcastWith
- `app/Events/OrderStatusUpdated.php` — comment para 'waiter_collected' y 'payment_verified'
- `app/Models/Table.php` — activeOrder incluye confirmed/preparing
- `routes/web.php` — ruta tenant.admin.pos.verify-payment

### Frontend (Fase 1)
- `resources/js/utils/currency.ts` — **Nuevo**: formatCurrency + calculateTax
- `resources/js/types/pos.ts` — ActiveOrder, OrderItemData, UserRole, quitar any
- `resources/js/Pages/Tenant/Admin/Gastronomy/POS/Index.tsx` — ruta fix, loading, búsqueda, timer, vaciar confirmación, tipos
- `resources/js/Components/Tenant/Admin/Gastronomy/POS/POSLayout.tsx` — tipos, waiter detection
- `resources/js/Components/Tenant/Admin/Gastronomy/POS/CartSidebar.tsx` — formatCurrency, calculateTax, isProcessing, botón Cocina, enviar a cocina
- `resources/js/Components/Tenant/Admin/Gastronomy/POS/CheckoutDialog.tsx` — formatCurrency, quitar any/ts-ignore, notas en items payload
- `resources/js/Components/Tenant/Admin/Gastronomy/POS/ProductCatalogDrawer.tsx` — formatCurrency
- `resources/js/Components/Tenant/Admin/Gastronomy/POS/VariantSelectorModal.tsx` — tipado variants, campo notas

### Frontend (Fase 2)
- `resources/js/Components/Tenant/Admin/Gastronomy/POS/ReceiptModal.tsx` — **Nuevo**: recibo estilo ticket térmico con impresión centrada 80mm
- `resources/js/Components/Tenant/Admin/Gastronomy/POS/CheckoutDialog.tsx` — retorna CheckoutResult con datos de pago
- `resources/js/Components/Tenant/Admin/Gastronomy/POS/CartSidebar.tsx` — botón Cocina reemplaza Tarjeta, botón Anular en items enviados, soporte takeout, notas visibles

### Frontend (Fase 3)
- `resources/js/Pages/Tenant/Admin/Gastronomy/POS/Index.tsx` — Verificación pago mesero (modal con foto comprobante), notificación Echo waiter_collected, toasts con ID único, traducción métodos de pago, Web Audio API para sonidos
- `resources/js/types/pos.ts` — ActiveOrder ampliado (waiter_collected, payment_method, payment_proof_url, payment_reference), KitchenOrderItem status 'served'
