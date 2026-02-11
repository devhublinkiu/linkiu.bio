# 💳 Módulo de Pagos Flexibles: Especificación Técnica

**Versión:** 1.0
**Estado:** Propuesta Aprobada
**Alcance:** Transversal (Gastronomía, Ecommerce)

## 1. Visión General
Este módulo permite a cada Tenant configurar múltiples métodos de pago para sus clientes finales. Se prioriza la flexibilidad para operar sin necesidad obligatoria de pasarelas de pago (Wompi/PayU), permitiendo gestionar transferencias directas y efectivo de forma organizada.

## 2. Arquitectura de Datos

### Tabla: `tenant_payment_methods`
Almacena la configuración global de cada tipo de pago habilitado por la tienda.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | PK | Serial |
| `tenant_id` | FK | Relación con la tabla `tenants` |
| `type` | String | Enum: 'bank_transfer', 'cash', 'dataphone', 'gateway' |
| `is_active` | Boolean | Si el método es visible en el checkout |
| `settings` | JSON | Config específica (Ej: `{ "require_proof": true, "cash_ask_change": true }`) |
| `gateway_id` | String | Nullable. ID interno para pasarelas (ej: 'wompi', 'payu') si aplica. |
| `timestamps` | | Created/Updated at |

### Tabla: `tenant_bank_accounts`
Almacena el detalle de las cuentas bancarias para transferencias manuales.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | PK | Serial |
| `tenant_id` | FK | Relación con la tabla `tenants` |
| `bank_name` | String | Ej: 'Nequi', 'Bancolombia', 'Daviplata' |
| `account_type` | String | Ej: 'Ahorros', 'Corriente', 'Depósito' |
| `account_number` | String | El número de cuenta |
| `account_holder` | String | Nombre del titular |
| `holder_id` | String | Cédula o NIT del titular (Opcional) |
| `is_active` | Boolean | Switch para habilitar/deshabilitar temporalmente esta cuenta |
| `sort_order` | Integer | Orden de visualización |
| `timestamps` | | Created/Updated at |

## 3. Interfaces de Usuario (UI)

### A. Panel de Administración (Tenant)
**Ruta:** `/admin/payment-methods`
**Vista:** `Tenant/Admin/PaymentMethods/Index.tsx`

**Componentes:**
1.  **Tarjeta de Transferencia Bancaria:**
    *   Switch Principal (Activo/Inactivo).
    *   Switch Secundario: "Requiere Comprobante" (settings.require_proof).
    *   **Lista de Cuentas:** Tabla o lista de tarjetas con las cuentas agregadas.
    *   **Botón Agregar Cuenta:** Abre modal con formulario (Banco, Tipo, Número, Titular, ID).
2.  **Tarjeta de Efectivo:**
    *   Switch Principal.
    *   Switch Secundario: "Preguntar cambio" (settings.ask_change).
3.  **Tarjeta de Datafono:**
    *   Switch Principal.

### B. Vista Pública (Checkout)
**Componente:** `CheckoutPaymentStep.tsx` (Dentro del Drawer o Página de Checkout)

Flujo propuesto:
1.  **Selección:** Radio Group con los métodos activos.
2.  **Detalle Transferencia:**
    *   Si selecciona "Transferencia", despliega acordeón con la lista de cuentas (`tenant_bank_accounts`).
    *   Cada cuenta tiene botón "Copiar" al lado del número.
    *   **Zona de Carga:** Si `require_proof` es true, muestra un input file (Drag & Drop) para subir la imagen.
3.  **Detalle Efectivo:**
    *   Si `ask_change` es true, muestra input numérico: "¿Con cuánto vas a pagar?".

## 4. Lógica de Negocio

### Validación de Pedido
*   **Transferencia (Con Comprobante):**
    *   No permite enviar pedido si no hay archivo adjunto.
    *   El archivo se sube a `start_transaction` temporal o directamente al crear la orden.
*   **Transferencia (Sin Comprobante):**
    *   Permite enviar. El estado del pedido arranca en `pending_payment`.

### Integración WhatsApp
El mensaje generado debe incluir detalles claros:

> **Nuevo Pedido #1234**
> ... (Items) ...
>
> 💰 **Pago:** Transferencia Bancaria
> 🏦 **Cuenta:** Nequi (300123...)
> 📎 **Comprobante:** [Ver Foto] (Si se subió)

> 💰 **Pago:** Efectivo
> 💵 **Paga con:** $50.000 (Cambio: $12.500)

## 5. Plan de Implementación (Fases)

### Fase 1: Backend & DB
1.  Crear migraciones: `create_tenant_payment_methods_table`, `create_tenant_bank_accounts_table`.
2.  Crear Modelos: `TenantPaymentMethod`, `TenantBankAccount`.
3.  Crear Controladores API: `PaymentSettingsController` (Admin), `PublicPaymentController` (Lectura para checkout).

### Fase 2: Frontend Admin
1.  Implementar vista de configuración.
2.  Formularios de edición y creación de cuentas.

### Fase 3: Checkout Público
1.  Modificar `CartDrawer` / `Checkout` para soportar la selección.
2.  Implementar subida de archivos (S3/Bunny o LocalStorage temporal).
3.  Actualizar generador de mensajes de WhatsApp.
