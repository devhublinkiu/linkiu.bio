# Módulos de administración — Iglesias

Ámbito: panel `/{tenant}/admin` para tenants con vertical **Iglesias** (`church` o `iglesias` en `menuConfig`; el mismo listado de módulos). Aquí solo se documenta lo **específico** de este vertical; lo compartido con otros negocios está en `docs/modulos-admin-transversales.md`.

| Nombre del módulo | Aplica | Cuál es su función | Estado |
|-------------------|--------|-------------------|--------|
| Mis servicios | Solo Iglesias | Cultos, horarios y contenido de la sección pública de servicios. | Creado |
| Devocionales | Solo Iglesias | Entradas de devocionales: texto, media, publicación y reacciones en la vista pública. | Creado |
| Citas | Solo Iglesias | Solicitudes de cita pastoral recibidas desde el formulario público y su gestión en backoffice. | Creado |
| Colaboradores | Solo Iglesias | Equipo o ministerios mostrados en “Nuestro equipo” (fichas, orden, publicación). | Creado |
| Donaciones | Solo Iglesias | Registro de intenciones de donación y confirmación operativa desde el admin. | Creado |
| Audio dosis | Solo Iglesias | Episodios de audio y configuración del reproductor / listado público. | Creado |
| Predicas | Solo Iglesias | Sincronización con YouTube, listado de sermones y ajustes de canal en admin. | Creado |
| Testimonios | Solo Iglesias | Testimonios públicos: moderación, publicación e interacciones (bendición, oración, etc.). | Creado |

## Notas

- **Menú**: orden y claves en `resources/js/Config/menuConfig.ts` → `VERTICAL_CONFIG['church']` y `['iglesias']` (mismo array): `services`, `devotionals`, `appointments`, `collaborators`, `donations`, `audio_dosis`, `feed` (etiqueta **Predicas**), `reviews` (**Testimonios**), más ítems transversales (`sliders`, `tickers`, `shorts`, `files`, `locations`, `payment_methods`, `whatsapp`, `support`, `integrations`).
- **Integraciones** en sidebar comparte clave `integrations` con ruta `#` hasta definir pantallas propias; el resto de filas anteriores tienen rutas `tenant.admin.*` implementadas.
- No se añaden módulos nuevos respecto a la definición actual del menú.
