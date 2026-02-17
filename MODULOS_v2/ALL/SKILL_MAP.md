# Mapa de Módulos — Vertical ALL (Transversales)

Módulos compartidos entre verticales (Ecommerce, Gastronomía, Servicios). Cada entrada enlaza a su `SPEC.md` y al flujo de auditoría/diseño.

| Módulo | SPEC | Descripción breve |
|--------|------|-------------------|
| [Sedes (Locations)](LOCATIONS_SPEC.md) | `LOCATIONS_SPEC.md` | Sedes y puntos de venta; contacto, horarios, mapa; límite por plan; bloqueo al eliminar si hay dependientes. |
| [Métodos de Pago](PAYMENT_METHODS_SPEC.md) | `PAYMENT_METHODS_SPEC.md` | Transferencia, efectivo, datáfono; cuentas bancarias por sede; límite por plan (payment_methods). |
| [Tickers Promocionales](TICKERS_SPEC.md) | `TICKERS_SPEC.md` | Barra animada tipo marquee para promociones y avisos en el sitio público. |
| [Sliders (Banners)](SLIDERS_SPEC.md) | `SLIDERS_SPEC.md` | Banners/carrusel por sede; imágenes solo en Bunny; límite por plan. |
| [Notificaciones WhatsApp](WHATSAPP_SPEC.md) | `WHATSAPP_SPEC.md` | Configuración de número para alertas al admin; origen único `whatsapp_admin_phone`. |

---

*Al auditar o diseñar un módulo nuevo en esta vertical, crear su `SPEC.md` en esta carpeta y añadir una fila a esta tabla.*
