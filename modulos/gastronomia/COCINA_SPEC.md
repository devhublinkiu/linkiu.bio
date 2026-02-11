# Especificación: Módulo de Cocina y Meseros

**Estatus:** 🏗️ En Desarrollo (Fase de Diseño Aprobada)
**Vertical:** Gastronomía

## 1. Flujo de Comandas (Lifecycle)

### Orígenes de Pedidos
1. **Pedidos Online (Delivery/PickUp)**: 
   - Estado inicial: `pendiente`.
   - Requiere acción del Administrador: Botón "Enviar a Cocina".
   - Al confirmar -> Se emite evento `Orders.SentToKitchen`.
2. **Pedidos Locales (Meseros)**:
   - Estado inicial: `preparacion` (automático).
   - Se emite evento `Orders.SentToKitchen` inmediatamente tras el guardado del mesero.

### Estados en Cocina
- **En Espera/FIFO**: Pedidos que acaban de entrar. Ordenados cronológicamente.
- **En Preparación** (Opcional): Si el cocinero decide marcar que ya lo está trabajando.
- **Listo**: Pedido terminado. Sale de la pantalla de cocina y dispara notificaciones.

---

## 2. Monitor de Cocina (KDS) - Requerimientos de UI
- **Layout "Focus Mode"**: Screen-wide (100%), sin sidebar, sin footer.
- **Visualización**:
  - Grilla de tickets (estilo Trello/Cards).
  - Encabezado: `Mesa #X` o `Pedido #ID`.
  - Contenido: Lista de platos y sus modificadores (ej: "Sin cebolla").
  - Temporizador: Contador de minutos desde que entró a cocina.
- **Código de Colores**:
  - 🟢 < 10 min: Normal.
  - 🟡 10-20 min: Atención.
  - 🔴 > 20 min: Retrasado.

---

## 3. Panel de Meseros - Requerimientos de UI
- **Funcionalidad**: Toma rápida de pedidos vinculada a Mesas.
- **Bypass**: Los pedidos de mesero no pasan por validación de Admin para maximizar la velocidad del local.
- **Notificaciones**: Recibe alerta real-time cuando cocina marca un plato de su mesa como "Listo".

---

## 4. Especificaciones Técnicas

### Real-Time (Canales y Eventos)
- **Canal**: `tenant-updates.{tenant_id}`
- **Eventos**:
  - `OrderCreated`: Alerta a Admin de nuevo pedido online.
  - `OrderSentToKitchen`: Dispara la aparición del ticket en el KDS.
  - `OrderReady`: Dispara la notificación al mesero (o cliente vía WhatsApp).

### Roles y Permisos (Gestionados por Propietario)
- `kitchen.view`: Acceso al KDS.
- `waiters.view`: Acceso al panel de toma de pedidos.
- `waiters.order`: Permiso para enviar comandas.

---

## 5. Próximos Pasos Técnicos
1. Crear `KitchenController` y rutas `/admin/kitchen`.
2. Crear `WaiterController` y rutas `/admin/waiters`.
3. Implementar componente `KitchenMonitor.tsx` con soporte WebSocket.
