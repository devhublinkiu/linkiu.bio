# Módulos de administración — Gastronomía

Ámbito: panel `/{tenant}/admin` **solo** para tenants con vertical **Gastronomía** (`gastronomia`): operación de restaurante, bar o comida rápida (carta, sala, cocina, pedidos y reservas).

| Nombre del módulo | Aplica | Cuál es su función | Estado |
|-------------------|--------|-------------------|--------|
| Carta digital (productos) | Solo Gastronomía | Catálogo de platos y bebidas: precios, disponibilidad, variantes y contenido mostrado en el menú público y en flujos de venta. | Creado |
| Mesas y zonas | Solo Gastronomía | Zonas del local, mesas numeradas, códigos o enlaces por mesa (incl. regeneración de token e impresión donde aplique). | Creado |
| Reservas (backoffice) | Solo Gastronomía | Gestión de reservas entrantes y parámetros por sede (horarios, cupos, reglas de reserva). | Creado |
| Inventario | Solo Gastronomía | Ítems de inventario, niveles de stock y movimientos asociados a la operación del local. | Creado |
| linkiuPOS | Solo Gastronomía | Punto de venta en sala: toma de pedidos por mesa, liberar mesa, anular ítems, verificación de pagos y clientes rápidos en mostrador. | Creado |
| Pedidos | Solo Gastronomía | Listado y detalle de pedidos del canal público (menú, carrito, checkout) con cambio de estado del pedido. | Creado |
| Cocina (KDS) | Solo Gastronomía | Pantalla de cocina: cola de pedidos entrantes y marcar platos o pedidos como listos para salida a sala. | Creado |
| Meseros | Solo Gastronomía | Flujo de mesero: captura de pedidos y envío de comprobantes de pago para conciliación con el POS. | Creado |
| Estadísticas | Solo Gastronomía | Métricas de negocio (ventas, tráfico u operación) previstas en menú; aún sin ruta dedicada en configuración. | Pendiente |

## Notas

- **Menú**: claves en `resources/js/Config/menuConfig.ts` para este vertical incluyen `digital_menu`, `linkiu_pos`, `tables`, `reservations`, `inventory`, `kitchen`, `waiters`, `orders`, `statistics`, etc.
- **Transversales**: sedes, shorts, métodos de pago, envíos, categorías de enlaces, sliders, etc. están en `docs/modulos-admin-transversales.md`, no se repiten aquí.
