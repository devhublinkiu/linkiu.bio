# SPEC.md: Módulo de Pedidos (Gastronomía v2)

Este documento define la arquitectura y el flujo lógico definitivo para el sistema de pedidos de Linkiu, cumpliendo con los estándares de multisede, seguridad y performance.

## Diagrama de Flujo (Mermaid)

```mermaid
graph TD
    %% Entidades Principales
    subgraph Entidades
        Order["Pedido (Order)"]
        Item["Detalle (OrderItem)"]
        Table["Mesa (Table)"]
        Res["Reserva (Reservation)"]
        Loc["Sede (Location)"]
    end

    %% Flujo de Creación
    subgraph Origen
        POS[Interface POS]
        Public[Página Pública]
        Waiter[App Mesero]
    end

    POS & Public & Waiter -->|Request| Val{Validación <br/> StoreOrderRequest}
    Val -->|Falla| UI_Error[Feedback Sonner 422]
    Val -->|Pasa| Trait[ProcessesGastronomyOrders Trait]

    %% Lógica de Negocio v2
    subgraph Logica_v2 [Lógica de Negocio v2]
        Trait -->|location_id| Filter[Filtro Multisede]
        Filter -->|¿Pagado?| Decision{¿Pago <br/> Inmediato?}
        Decision -->|No| Mesa_Occ[Estado: Ocupada / Pedido Pendiente]
        Decision -->|Si| Order_Paid[Estado: Confirmado / Pagado]
        
        Mesa_Occ & Order_Paid -->|Toggle Cocina| Kitchen_Event[Evento: OrderSentToKitchen]
    end

    %% Persistencia e Infraestructura
    subgraph Infra [Infraestructura v2]
        Kitchen_Event -->|Ably| KDS[Kitchen Display System]
        Order_Paid -->|Storage| Bunny[Bunny.net CDN Comprobante]
        Order_Paid -->|DB| DB[(MySQL Transactional)]
    end

    %% Gestión de Reservas
    Admin[Admin Panel] -->|No-show| Res_Cancel[Liberar Mesa Automáticamente]
    Res_Cancel -->|Update| Table
```

## Reglas de Oro del Módulo

1.  **Aislamiento**: Todo `ORDER`, `TABLE` y `ZONE` debe filtrar por `location_id` y `tenant_id`.
2.  **Persistencia**: Uso obligatorio de `DB::beginTransaction()` en el Trait para garantizar que no haya pedidos sin items.
3.  **CDN**: Los comprobantes se sirven únicamente desde el disco `bunny`.
4.  **UX**: Toda acción destructiva o cambio de estado masivo requiere `AlertDialog`.
5.  **Caja/Cocina**: El flujo de caja no debe bloquear el flujo de cocina; el usuario decide si envía la orden.

## Mapeo técnico
- **Modelo**: [Order.php](file:///f:/linkiu.bio/app/Models/Tenant/Gastronomy/Order.php)
- **Trait Lógica**: [ProcessesGastronomyOrders.php](file:///f:/linkiu.bio/app/Traits/ProcessesGastronomyOrders.php)
- **Frontend POS**: [Index.tsx](file:///f:/linkiu.bio/resources/js/Pages/Tenant/Admin/Gastronomy/POS/Index.tsx)
