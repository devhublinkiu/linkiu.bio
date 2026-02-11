# Especificación del Módulo de Envíos (Shipping)

## 1. Descripción General
El módulo de envíos permite a cada Tenant configurar sus métodos de entrega, soportando tres modalidades clave:
1.  **Retiro en Tienda (Pickup):** El cliente pasa a recoger.
2.  **Envío Local (Domicilio):** Tarifa especial para la misma ciudad del comercio.
3.  **Envío Nacional (Envíos):** Cobertura específica por Departamentos/Ciudades.

## 2. Métodos de Envío

### A. Retiro en Tienda (`pickup`)
Es la opción básica.
*   **Configuración Admin:**
    *   Switch Activo/Inactivo.
    *   **Tiempo de Preparación:** (Ej: "Listo en 2 horas", "24 horas").
    *   **Instrucciones:** Texto libre para el cliente (Ej: "Presentar cédula y número de pedido").
*   **Checkout:**
    *   Siempre visible si está activo.
    *   Costo: **$0 (Gratis)**.
    *   No pide dirección de envío (o la ignora).

### B. Envío Local (`local`)
Se activa automáticamente cuando el cliente está en la misma ciudad que el comercio.
*   **Requisito:** El Tenant debe tener configurada su `city` en `Configuración > Sede Principal`.
*   **Configuración Admin:**
    *   Switch Activo/Inactivo.
    *   **Costo:** Valor del domicilio local.
    *   **Tiempo de Entrega:** (Ej: "45-60 min", "Mismo día").
    *   **Envío Gratis:** Monto mínimo de compra para que sea gratis.
    *   **Instrucciones:** (Ej: "El repartidor te llamará al llegar").

### C. Envío Nacional (`national`)
Para envíos fuera de la ciudad base.
*   **Configuración Admin (API Integrada):**
    *   Switch Activo/Inactivo.
    *   **Zonas de Cobertura:** El admin selecciona de una lista (API Colombia) los Departamentos y Ciudades a donde despacha.
    *   **Costo:** Tarifa Plana (un solo precio para todos los destinos nacionales configurados).
    *   **Envío Gratis:** Monto mínimo para gratuidad.
    *   **Instrucciones:** (Ej: "Enviamos por Interrapidísimo/Servientrega").
*   **Persistencia:** La selección del admin se guarda en la base de datos local para no depender de la API externa durante el checkout.

## 3. Arquitectura de Datos

### Tabla `tenant_shipping_methods`
Almacena la configuración de CADA tipo (`pickup`, `local`, `national`).

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | PK | ID Único |
| `tenant_id` | FK | Tenant Propietario |
| `type` | String | `pickup`, `local`, `national` |
| `is_active` | Boolean | Si está habilitado |
| `cost` | Decimal | Costo del envío (0 para pickup) |
| `free_shipping_min_amount` | Decimal | Monto para envío gratis (Nullable) |
| `delivery_time` | String | Texto corto de promesa de entrega |
| `instructions` | Text | Instrucciones visibles al cliente |

### Tabla `shipping_zones`
Solo para el método `national`. Define la lista blanca de destinos.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | PK | ID Único |
| `tenant_shipping_method_id` | FK | Relación con el método nacional |
| `department_code` | String | Código DANE Depto |
| `department_name` | String | Nombre Depto (Guardado localmente) |
| `city_code` | String | Código DANE Ciudad (Nullable) |
| `city_name` | String | Nombre Ciudad (Nullable) |

## 4. Frontend (Admin)

### Nueva Vista: `Tenant/Admin/Shipping/Index.tsx`
Una sola pantalla dividida en 3 tarjetas o pestañas:

1.  **Card: Retiro en Tienda**
    *   Simple formulario con los campos de configuración.
2.  **Card: Domicilio Local**
    *   Muestra: "Tu sede está en **[Ciudad Tenant]**".
    *   Formulario de costos.
3.  **Card: Envíos Nacionales**
    *   Formulario de costos generales.
    *   **Selector de Zonas:**
        *   Dropdown "Departamento" (Traído de API externa).
        *   Al seleccionar, carga ciudades.
        *   Checkbox "Todo el departamento" o selección múltiple de ciudades.
        *   Lista de "Zonas Guardadas" con botón de eliminar.

## 5. Frontend (Checkout)

El checkout consulta los métodos activos del Tenant (`GET /api/checkout/shipping-methods`).

*   **Lógica de Selección:**
    *   Si selecciona "Retiro en Tienda" -> Total + $0.
    *   Si selecciona "Envío a Domicilio":
        *   El usuario ingresa Depto/Ciudad.
        *   **MATCH Local:** Ciudad Usuario == Ciudad Tenant -> Aplica Tarifa `local`.
        *   **MATCH Nacional:** Ciudad Usuario IN `shipping_zones` -> Aplica Tarifa `national`.
        *   **NO MATCH:** Muestra mensaje: "Lo sentimos, no tenemos cobertura en esta zona".
