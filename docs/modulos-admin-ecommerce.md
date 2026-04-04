# Módulos de administración — Ecommerce

Ámbito: funcionalidad pensada **solo** para tenants con vertical **Ecommerce**. La tienda pública y gran parte del admin dedicado siguen en roadmap; la tabla describe el producto acordado y el estado frente al código.

| Nombre del módulo | Aplica | Cuál es su función | Estado |
|-------------------|--------|-------------------|--------|
| Productos (catálogo de tienda) | Solo Ecommerce | Alta y mantenimiento del catálogo vendible (fichas, precios, imágenes, publicación en la vitrina online). | Pendiente |
| Variables de producto | Solo Ecommerce | Atributos combinables (talla, color, SKU) y reglas de stock o precio por variante. | Pendiente |
| Órdenes | Solo Ecommerce | Bandeja de **pedidos del canal tienda** (checkout ecommerce): líneas, totales, pago, envío/retiro y estados de cumplimiento. Distinto de pedidos de restaurante (Gastronomía). | Pendiente |
| LinkiuOffers | Solo Ecommerce | Ofertas combinadas y upsell simple: packs, “lleva X+Y”, descuentos sugeridos en carrito o ficha (nombre de producto **LinkiuOffers**). | Pendiente |
| Bodega / almacén | Solo Ecommerce | Stock por almacén o ubicación física; movimientos y disponibilidad para despachos de tienda online. | Pendiente |
| Cupones | Solo Ecommerce | Códigos y reglas de descuento (porcentaje, monto mínimo, vigencia) en el checkout de la tienda. | Pendiente |
| Carrito abandonado | Solo Ecommerce | Carritos sin pago completado; seguimiento y **recordatorios por WhatsApp** (y enlace para retomar compra) para recuperar ventas. | Pendiente |
| Comprar por WhatsApp | Solo Ecommerce | Configuración del atajo de venta asistida: plantilla de mensaje y apertura de WhatsApp con producto/carrito prellenado desde la vitrina. | Pendiente |
| Lista de espera | Solo Ecommerce | Cliente sin stock deja contacto; aviso cuando el producto vuelva a estar disponible. | Pendiente |

## Notas

- **Menú**: claves en `resources/js/Config/menuConfig.ts` bajo el vertical `ecommerce` (incluye transversales: categorías de enlaces, sliders, sedes, métodos de pago, envíos, shorts, etc.; ver `docs/modulos-admin-transversales.md`).
- **Rutas Laravel**: módulos nuevos usan claves propias (`ecommerce_orders`, `abandoned_cart`, `buy_on_whatsapp`, `waitlist`, `linkiu_offers`, …) con ruta `#` hasta existir controladores `tenant.admin.ecommerce.*`.
- **Implementación actual**: home pública ecommerce sigue “en construcción”; catálogo en `routes/web.php` comentado. No confundir **Órdenes** ecommerce con el ítem `orders` de Gastronomía/Dropshipping en el mismo archivo de menú.
