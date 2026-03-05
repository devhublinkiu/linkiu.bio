# Implementación Rappi en Linkiu

**Objetivo:** Integrar Rappi para que los tenants de gastronomía reciban pedidos de Rappi en Linkiu (cocina/órdenes), puedan aceptar/rechazar y marcar como listos.

**Referencia:** [Rappi Developer Portal](https://dev-portal.rappi.com/es/) (API en español).

---

## 1. Qué ofrece Rappi (API)

| Área | Descripción |
|------|-------------|
| **Autenticación** | `POST .../restaurants/auth/v1/token/login/integrations` con `client_id` y `client_secret`. Respuesta: `access_token` válido **1 semana**. Header en todas las peticiones: `x-authorization: Bearer {token}`. |
| **Dominios** | Por país (ej. Colombia, México, Brasil). Entorno de pruebas: `api.dev.rappi.com`. Lista: [Dominios por país](https://dev-portal.rappi.com/es/api-reference/content/#nuevos-dominios). |
| **Tiendas (Stores)** | Consultar tiendas del aliado; actualizar estado de integración. |
| **Menús** | Crear/actualizar menú; obtener menú aprobado por `storeId`. |
| **Órdenes** | Listar nuevas órdenes; aceptar (take) con tiempo de preparación; rechazar (reject); obtener código/handoff/QR; confirmar “lista para recoger” (ready-for-pickup). |
| **Webhooks** | Recibir eventos en tiempo real: `NEW_ORDER`, `MENU_APPROVED`, `MENU_REJECTED`. |

En Linkiu ya existe el ítem “Rappi” en el menú de integraciones (gastronomía) y el flag `integration_rappi`; la ruta está en `#`. Falta implementar backend + pantalla de configuración + flujo de órdenes.

---

## 2. Modelo de datos sugerido

### 2.1 Credenciales Rappi por tenant

Cada tenant (restaurante) puede tener su **propio** acuerdo con Rappi y sus credenciales. Guardar por tenant:

- `rappi_client_id` (string, nullable)
- `rappi_client_secret` (string, nullable, cifrado)
- `rappi_country_domain` (string, ej. `api.rappi.com` para CO)
- `rappi_store_id` (string, nullable) — ID de la tienda en Rappi (lo devuelve Rappi al dar de alta la tienda).

Opcional: tabla `rappi_tokens` (tenant_id, access_token, expires_at) para cachear el token y refrescarlo antes de que caduque (válido 1 semana).

### 2.2 Órdenes con origen Rappi

En `gastronomy_orders` (o en una tabla relacionada) identificar órdenes que vienen de Rappi y poder sincronizar estado:

- Añadir columna `source` (string): `linkiu` | `rappi` (por defecto `linkiu`).
- Añadir columna `rappi_order_id` (string, nullable) — ID de la orden en Rappi.
- Opcional: `rappi_raw_payload` (json) para guardar el payload original por si hace falta.

Así podéis:
- Crear una orden en Linkiu cuando llega un `NEW_ORDER` (webhook o poll).
- En cocina/pedidos mostrar badge “Rappi” y al aceptar/rechazar/listo llamar a la API de Rappi con `rappi_order_id` y `store_id`.

### 2.3 Mapeo productos (menú)

Rappi trabaja con SKU y estructura de menú propia. Para no bloquear la primera fase:

- **Fase 1 (solo órdenes):** Al crear la orden desde Rappi, guardar ítems con nombre/descripción que vengan en el payload; opcionalmente intentar mapear por SKU a vuestros `products` si tenéis un mapeo (tabla `rappi_product_mapping`: tenant_id, product_id, rappi_sku).
- **Fase 2 (sincronizar menú):** Exportar categorías y productos de Linkiu al formato Rappi y llamar a `POST menu`; Rappi puede aprobar o rechazar (webhooks `MENU_APPROVED` / `MENU_REJECTED`).

---

## 3. Flujo de órdenes (recomendado)

1. **Recepción**
   - **Opción A (recomendada):** Webhook `NEW_ORDER`. Rappi envía POST a una URL vuestra (ej. `https://linkiu.bio/api/rappi/webhook` o por tenant). Verificáis firma/secreto, buscáis el tenant por `store_id` (rappi_store_id), creáis `gastronomy_order` con `source=rappi`, `rappi_order_id`, ítems y totales; disparáis evento a cocina (Ably) para que aparezca en tiempo real.
   - **Opción B:** Polling con `GET restaurants/orders/v1/orders` (o por store) cada X segundos; para órdenes nuevas que aún no tengáis por `rappi_order_id`, creáis la orden igual que arriba.

2. **En cocina / listado de pedidos**
   - Las órdenes con `source=rappi` se muestran como las demás, con un badge “Rappi”.
   - Acciones:
     - **Aceptar:** llamar a `PUT .../stores/{storeId}/orders/{orderId}/cooking_time/{cookingTime}/take` (tiempo en minutos). En Linkiu podéis actualizar estado a “en preparación” y opcionalmente guardar el `cooking_time` enviado.
     - **Rechazar:** llamar a `PUT .../stores/{storeId}/orders/{orderId}/cancel_type/{cancelType}/reject` (Rappi define cancelType).
     - **Listo para recoger:** llamar a `POST .../stores/{storeId}/orders/{orderId}/ready-for-pickup`. En Linkiu estado “listo” o “entregado”.

3. **Handoff / QR**
   - Si necesitáis el código o QR para el repartidor: `GET .../stores/{storeId}/orders/{orderId}/handoff`.

Todo esto se hace desde el backend (Laravel): el front solo muestra la orden y botones; al pulsar “Aceptar”/“Rechazar”/“Listo” el backend llama a Rappi y actualiza el estado en Linkiu.

---

## 4. Autenticación (token)

- Al configurar Rappi por tenant guardáis `client_id`, `client_secret`, `rappi_country_domain`, `rappi_store_id`.
- Cuando necesitéis llamar a la API (recibir webhook y crear orden, aceptar, rechazar, listo, handoff):
  - Si tenéis tabla de tokens: si hay token no expirado, usarlo; si no, hacer `POST token/login/integrations`, guardar token y expires_at.
  - Si no tenéis tabla: en cada request (o en un servicio “RappiClient”) obtener token con `POST token/login/integrations` y cachear en Redis/Cache por tenant 1 semana (o hasta 5 minutos antes de expires_at).
- Todas las peticiones a Rappi: header `x-authorization: Bearer {access_token}`.

---

## 5. Pantalla de integración (admin)

- En **Integraciones** (o Configuración) para el vertical **gastronomía**, la opción **Rappi** (hoy `route: '#'`) debería llevar a una página tipo “Conectar Rappi” o “Configuración Rappi”.
- Campos: Client ID, Client Secret, Dominio (país), Store ID (si ya lo tienen). Guardar en tenant (o en tabla `tenant_settings` / columnas en `tenants`).
- Opcional: botón “Probar conexión” (obtener token y GET stores para validar).
- Si usáis webhooks: mostrar la URL que deben configurar en Rappi (ej. `https://linkiu.bio/api/rappi/webhook`) y recordar configurar el secreto en Rappi y validarlo en vuestro endpoint.

---

## 6. Pasos de implementación (resumen)

| Paso | Descripción |
|------|-------------|
| 1 | Migración: añadir a tenant (o settings) `rappi_client_id`, `rappi_client_secret`, `rappi_country_domain`, `rappi_store_id`. Opcional: tabla `rappi_tokens`. |
| 2 | Migración: en `gastronomy_orders` añadir `source` (default `linkiu`) y `rappi_order_id` (nullable). |
| 3 | Servicio Laravel `RappiApiService` (o similar): método `getToken(tenant)`, métodos `getNewOrders`, `takeOrder`, `rejectOrder`, `readyForPickup`, `getHandoff`. Usar dominio por tenant y token. |
| 4 | Webhook: ruta `POST /api/rappi/webhook` (o bajo tenant), verificar firma, parsear evento; si es `NEW_ORDER`, crear `gastronomy_order` + items y notificar a cocina (Ably). |
| 5 | Cocina / listado pedidos: mostrar órdenes con `source=rappi` y botones Aceptar / Rechazar / Listo; al pulsar, llamar a controlador que use `RappiApiService` y actualice estado en BD. |
| 6 | UI admin: página “Rappi” en Integraciones con formulario de credenciales y Store ID; guardar y opcional “Probar conexión”. |
| 7 | (Fase 2) Menú: mapeo productos Linkiu ↔ Rappi; job o pantalla para “Enviar menú a Rappi”; manejar `MENU_APPROVED` / `MENU_REJECTED` para feedback. |

---

## 7. Enlaces útiles

- [Portal desarrolladores Rappi (ES)](https://dev-portal.rappi.com/es/)
- [Autenticación](https://dev-portal.rappi.com/es/api-reference/authentication/)
- [Órdenes (Rests API)](https://dev-portal.rappi.com/es/api-reference/orders-rests-api/)
- [Webhooks](https://dev-portal.rappi.com/en/api-reference/webhooks) / [Eventos](https://dev-portal.rappi.com/en/webhook-events)
- [Dominios por país](https://dev-portal.rappi.com/es/api-reference/content/#nuevos-dominios)

Si queréis, el siguiente paso puede ser bajar al detalle de una sola pieza (por ejemplo: migración + modelo + RappiApiService para token y GET orders, o solo el webhook NEW_ORDER + creación de orden en Linkiu).
