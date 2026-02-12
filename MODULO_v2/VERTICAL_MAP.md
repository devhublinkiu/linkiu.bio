# Mapa de Verticales y Módulos

Este diagrama organiza todos los módulos del sistema según la vertical de negocio a la que pertenecen.

```mermaid
graph TD
    subgraph "ALL_VERTICALS (Módulos Base)"
        BASE[Configuración Base] --> USR[Usuarios y Roles]
        BASE --> LOC[Gestión de Sedes]
        BASE --> SET[Ajustes del Sitio]
        BASE --> WAS[WhatsApp/Notificaciones]
        BASE --> MED[Media Manager]
        BASE --> SUP[Soporte Técnico]
    end

    subgraph "V_GASTRONOMY"
        GAST[Capa Gastronomía] --> PED[Gestión de Pedidos]
        GAST --> POS_G[POS Gastronómico]
        GAST --> MES[Mesas y Zonas]
        GAST --> RES[Reservas]
        GAST --> KITCH[Sistema de Cocina KDS]
        GAST --> WAIT[Panel de Meseros]
    end

    subgraph "V_ECOMMERCE"
        ECOM[Capa E-commerce] --> SHOP[Catálogo/Tienda]
        ECOM --> CART[Carrito y Checkout]
        ECOM --> PAY[Pasarelas de Pago]
        ECOM --> SHIP[Métodos de Envío]
    end

    subgraph "V_SERVICES"
        SERV[Capa Servicios] --> APP[Citas/Agenda]
        SERV --> S_LIST[Catálogo de Servicios]
    end

    subgraph "V_DROPSHIPPING"
        DROP[Capa Dropshipping] --> INT[Integración Proveedores]
        DROP --> STO[Sincronización de Stock]
    end

    %% Conexiones Cruzadas
    USR -.-> GAST
    USR -.-> ECOM
    LOC -.-> GAST
```

## Detalles de Sub-módulos e Integraciones

### 1. LinkiuLab (Analítica)
- Visitas y tráfico
- Secciones más vistas
- Conversiones
- Más vendidos
- Heatmaps

### 2. LinkiuPay
- Formulario
- Ofertas
- Estadísticas

### 3. Marketing Operativo
- **Cupones**: Gestión de descuentos.
- **Tickers**: Mensajes promocionales dinámicos.

