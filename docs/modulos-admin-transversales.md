# Módulos de administración — transversales (todas las verticales)

Ámbito: panel `/{tenant}/admin` compartido por cualquier negocio, sin contar módulos solo de Gastronomía ni solo de Iglesias.

| Nombre del módulo | Aplica | Cuál es su función | Estado |
|-------------------|--------|-------------------|--------|
| Dashboard | Todas | Resumen operativo del tenant: accesos rápidos y estado general del negocio en Linkiu. | Creado |
| Perfil de administrador | Todas | Datos del usuario logueado, cambio de contraseña y foto de perfil del staff. | Creado |
| Roles | Todas | Definición de roles y permisos del equipo sobre el panel y las acciones permitidas. | Creado |
| Miembros | Todas | Alta, edición y baja de usuarios que administran el negocio (equipo interno). | Creado |
| Categorías | Todas | Grupos de enlaces o entradas tipo “link in bio” (orden, iconos, solicitud de icono a Linkiu). | Creado |
| Sliders | Todas | Banners o carruseles promocionales en la vista pública del tenant. | Creado |
| Tickers | Todas | Franjas de texto promocional (ticker) en la experiencia pública. | Creado |
| Sedes | Todas | Ubicaciones del negocio (dirección, horarios, mapa) cuando aplica multi-sede. | Creado |
| Shorts | Todas | Vídeos cortos verticales promocionales enlazados a categorías, productos o URL externa. | Creado |
| Configuración | Todas | Marca del sitio (nombre, colores), páginas legales del tenant, logo y favicon. | Creado |
| WhatsApp | Todas | Ajustes de notificaciones o integración con WhatsApp según la implementación actual. | Creado |
| Suscripción Linkiu | Todas | Plan contratado, cambio de plan, pago de suscripción, éxito de checkout y actualización de slug del tenant. | Creado |
| Facturas (Linkiu → tenant) | Todas | Facturas emitidas por Linkiu al negocio y carga de comprobantes donde aplique. | Creado |
| Soporte | Todas | Tickets hacia el equipo Linkiu: crear conversación, respuestas y cierre. | Creado |
| Métodos de pago | Todas | Medios por los que el negocio recibe pagos de clientes (configuración y cuentas asociadas). | Creado |
| Envíos | Todas | Métodos de envío y zonas configurables para ventas con despacho. | Creado |
| Biblioteca de medios | Todas | Gestión de archivos y carpetas del tenant para usar en contenidos y administración. | Creado |

## Notas

- **Menú por vertical**: `resources/js/Config/menuConfig.ts` no muestra todos estos ítems en cada vertical; la tabla describe **módulos disponibles en rutas/backend** para cualquier tenant autenticado, no la visibilidad del sidebar.
- **Estado**: *Creado* = flujo principal implementado con rutas y pantallas; si más adelante auditas límites por plan o huecos UX, puedes pasar filas a *En proceso* o *Pendiente*.
