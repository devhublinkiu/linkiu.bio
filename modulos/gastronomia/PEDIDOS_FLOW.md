# Flujo Detallado: Módulo de Pedidos

Este archivo contiene la lógica técnica y de negocio del sistema de pedidos.

## 1. Diagrama de Flujo (Creación y Gestión)

```mermaid
sequenceDiagram
    participant C as Cliente/Mesero/Staff
    participant Co as POSController / WaiterController
    participant T as Trait: ProcessesGastronomyOrders
    participant D as Base de Datos
    participant K as Kanban / Cocina

    C->>Co: Enviar Pedido (JSON)
    Co->>T: storeGastronomyOrder()
    Note over T: Valida Impuestos (IVA)<br/>Aplica Variantes<br/>Calcula Totales
    T->>D: Insert gastronomy_orders
    T->>D: Insert gastronomy_order_items
    T->>D: Log Status History
    D-->>T: Order ID
    T->>K: Dispatch OrderCreated / OrderSentToKitchen
    K-->>C: Notificación Sonido / WebSocket
```

## 2. Reglas de Negocio Críticas
- **Impuestos**: Se calculan en el servidor para evitar manipulaciones. El Trait lee la configuración del `tenant` o del `product` individual.
- **Variantes**: Pueden ajustar el precio base del producto.
- **Multisede (PENDIENTE)**: Actualmente el pedido es global. Se debe implementar `location_id` para filtrar por sede física.

## 3. Puntos de Auditoría Actuales
- Falta protección selectiva de `Gates`.
- El origen de pedidos públicos se marca erróneamente como "POS".
