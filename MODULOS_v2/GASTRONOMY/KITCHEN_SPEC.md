# Módulo: COCINA (Kitchen)

## Descripción
Panel de monitoreo en tiempo real (KDS - Kitchen Display System) para la gestión de comandas en establecimientos gastronómicos. Permite visualizar pedidos confirmados, priorizarlos por tiempo de espera y marcarlos como "Listos" para su despacho.

## Stack Técnico
- **Controlador**: `KitchenController.php`
- **Frontend**: `Inertia` + `React` + `Framer Motion`
- **Real-time**: `Laravel Echo` + `Pusher/Reverb`
- **Estilos**: `TailwindCSS` + `Shadcn UI`

## Flujo de Trabajo

```mermaid
graph TD
    subgraph "Ingreso de Pedido"
        A[POS / App Cliente] --> B{Confirmar Pedido}
        B -->|Event: OrderSentToKitchen| C[Channel: kitchen]
    end

    subgraph "Monitor de Cocina (KDS)"
        C --> D[Index.tsx - Recepción Real-time]
        D --> E[Visualización en Cards FIFO]
        E --> F{Gestión de Tiempos}
        F -->| < 10m | G[Verde/Normal]
        F -->| > 10m | H[Ámbar/Retraso]
        F -->| > 20m | I[Rojo/Urgente]
    end

    subgraph "Despacho"
        E --> J[Botón: Despachar]
        J --> K[KitchenController@markAsReady]
        K --> L[Update Status: ready]
        L --> M[Record History]
        L --> N[Event: OrderStatusUpdated]
    end
```

## Reglas de Negocio
1. **FIFO (First In, First Out)**: Los pedidos se muestran en orden de llegada (más antiguo primero).
2. **Aislamiento por Localización**: Si el usuario tiene asignada una sede, el monitor solo muestra pedidos de esa sede.
3. **Notificación Sonora**: Cada nuevo pedido entrante debe emitir un sonido.
4. **Historial**: Cada cambio de estado debe quedar registrado en `OrderStatusHistory`.

## Auditoría de Estándares (Solo V2)
- [x] Multi-tenant isolation (BelongsToTenant).
- [x] FormRequest validation.
- [x] Explicit TypeScript Types (No `any`).
- [x] Component Extraction (KitchenOrderCard).
