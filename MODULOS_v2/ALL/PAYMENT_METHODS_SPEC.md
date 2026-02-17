# Módulo: MÉTODOS DE PAGO

## Descripción
Configuración de métodos de pago del tenant: transferencia bancaria (con cuentas asociadas), efectivo y datáfono. Cada método y cada cuenta bancaria pueden ser globales (todas las sedes) o por sede (`location_id`). El admin activa/desactiva métodos, agrega/edita/elimina cuentas bancarias. Límite de cuentas bancarias por plan (`payment_methods` en planes). Usuarios con sede asignada ven solo métodos/cuentas globales + los de su sede.

## Clasificación
- **Tipo**: Transversal (compartido entre verticales)
- **Verticales**: Ecommerce, Gastronomía, Servicios (según menuConfig)
- **Scope**: Por tenant; opcional por sede (`location_id` en métodos y cuentas)
- **Límite por plan**: Sí, aplica a **cuentas bancarias** (clave en planes: `payment_methods`, mismo patrón que sliders)
- **Soft delete**: No

## Stack Técnico
- **Modelos**: `App\Models\Tenant\Payments\PaymentMethod` (tabla `tenant_payment_methods`), `App\Models\Tenant\Payments\BankAccount` (tabla `tenant_bank_accounts`); ambos con trait `BelongsToTenant`
- **Controlador**: `Tenant/Admin/PaymentMethods/PaymentMethodController.php` (type hints, FormRequests, try-catch)
- **FormRequests**: `StoreBankAccountRequest`, `UpdateBankAccountRequest`, `UpdatePaymentMethodRequest` (mensajes en español; `location_id` validado con `Rule::exists(..., where tenant_id)`)
- **Frontend Admin**: `Pages/Tenant/Admin/PaymentMethods/Index.tsx` (Cards por tipo de método, lista de cuentas paginada, modales agregar/editar, EmptyState, límite X/Y)
- **Estilos**: TailwindCSS + Shadcn UI

## Tablas
- **tenant_payment_methods**: id, tenant_id, location_id (nullable), type (bank_transfer, cash, dataphone, gateway), is_active, settings (json), gateway_id. Métodos por defecto se crean con `ensureDefaultMethods()`.
- **tenant_bank_accounts**: id, tenant_id, location_id (nullable), bank_name, account_type, account_number, account_holder, holder_id, is_active, sort_order. Paginación 10 en index.

## Reglas de Negocio
1. **Límite de cuentas**: `getLimit('payment_methods')` desde el plan; validado en `storeAccount` y en UI (contador "X / Y cuentas bancarias", botón Agregar deshabilitado al tope).
2. **Location_id**: Solo sedes del tenant (validación en FormRequests). Valor `null` o "all" = global.
3. **IDOR**: Recurso siempre filtrado por `tenant_id`; usuarios no-owner solo ven global + su `location_id`.
4. **Try-catch**: En storeAccount, updateAccount, destroyAccount con mensaje claro en redirect.

## Estándares de implementación (checklist)
- [x] Modelos en `App\Models\Tenant\Payments\` con `BelongsToTenant`.
- [x] Controlador en `Tenant/Admin/PaymentMethods/`.
- [x] FormRequests dedicados; sin validación en controlador.
- [x] Select de columnas y `with('location:id,name')`; paginación en cuentas.
- [x] EmptyState cuando no hay cuentas (icono, CTA "Agregar primera cuenta").
- [x] AlertDialog variante `destructive` al eliminar cuenta.
- [x] Permisos: is_owner y `permissions.includes('*')` en hasPermission.
- [x] TypeScript sin `any`; Loader2 en submit de modales.
- [x] Límite por plan: clave `payment_methods` en MODULE_HAS_LIMIT (SuperAdmin); mismo patrón que sliders.

## Permisos
| Permiso | Descripción | Seeded |
|---------|-------------|--------|
| `payment_methods.view` | Ver métodos de pago y cuentas | Sí |
| `payment_methods.create` | Agregar cuentas bancarias | Sí |
| `payment_methods.update` | Editar métodos y cuentas | Sí |
| `payment_methods.delete` | Eliminar cuentas bancarias | Sí |

## Rutas
- `GET /{tenant}/admin/payment-methods` → index
- `PUT /{tenant}/admin/payment-methods/{method}` → updateMethod
- `POST /{tenant}/admin/payment-methods/accounts` → storeAccount
- `PUT /{tenant}/admin/payment-methods/accounts/{account}` → updateAccount
- `DELETE /{tenant}/admin/payment-methods/accounts/{account}` → destroyAccount

## Archivos afectados
- Modelos: `App\Models\Tenant\Payments\PaymentMethod`, `BankAccount`; `Tenant` (relaciones paymentMethods, bankAccounts).
- Controlador: `Tenant/Admin/PaymentMethods/PaymentMethodController`.
- FormRequests: `StoreBankAccountRequest`, `UpdateBankAccountRequest`, `UpdatePaymentMethodRequest` (prepareForValidation para location_id 'all'/'') .
- Frontend: `Tenant/Admin/PaymentMethods/Index.tsx` (Cards, modales, EmptyState, SharedPagination, límite).
- Config: `MODULE_HAS_LIMIT['payment_methods']` en menuConfig.ts.
- Referencias a modelos: LocationController (conteo dependientes), ReservationController, PublicController (cuentas activas).

## QA / Paso QA
| Criterio | Estado |
|----------|--------|
| Aislamiento tenant/sede | Cumplido |
| Formularios y errores en español | Cumplido |
| Límite por plan en UI y backend | Cumplido |
| EmptyState y feedback (toast, Loader2) | Cumplido |
| AlertDialog en eliminar | Cumplido |
| Responsividad (grid Cards) | Cumplido |
| TypeScript sin any | Cumplido |
| QA manual ejecutado | Paso todo |

*Módulo alineado con estándares de admin y documentado en MODULOS_v2/ALL.*
