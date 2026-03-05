# Investigación: Sincronizar TikTok e Instagram y mostrar publicaciones en Welcome

**Objetivo:** Permitir que las personas (tenants/tiendas) conecten su TikTok e Instagram y que sus publicaciones aparezcan en la sección Welcome (landing de Linkiu o página de bienvenida de cada tienda).

**Fecha:** Marzo 2026

---

## 1. Contexto actual en Linkiu

- **Welcome (landing Linkiu):** `resources/js/Pages/Welcome.tsx` — página pública de linkiu.bio con Hero, Features, How It Works, CTA, Nosotros, Testimonios, FAQ, Release Notes, Footer. No hay bloque de redes sociales con publicaciones.
- **Datos de redes ya existentes:**
  - SuperAdmin: `instagram_url` en site_settings (contacto).
  - Por sede (Location): `social_networks` con `facebook`, `instagram`, `tiktok` (solo URLs, sin feed).

Para “mostrar publicaciones en el welcome” hay que aclarar si es:
- **A)** En la **landing de Linkiu** (linkiu.bio): un bloque genérico tipo “últimas de nuestras redes” (una sola cuenta de Linkiu), o  
- **B)** En la **página de cada tienda** (ej. linkiu.bio/sisu-art): cada tenant ve **sus propias** publicaciones de Instagram/TikTok.

Esta investigación asume **B**: cada tienda conecta sus cuentas y ve su feed en su storefront/welcome.

---

## 2. Instagram

### 2.1 Estado de las APIs

- **Instagram Basic Display API:** **Deprecada desde el 4 de diciembre de 2024.** Ya no funciona.
- **Obligatorio hoy:** **Instagram Graph API** (con Facebook Login o Instagram Login).

### 2.2 Requisitos Graph API

| Requisito | Detalle |
|-----------|--------|
| Tipo de cuenta | Solo **Instagram Business o Creator** (no cuentas personales). |
| Vinculación | Cuenta de Instagram vinculada a una **página de Facebook** (si usas Facebook Login). Con “Instagram Login” pueden usar solo cuenta profesional. |
| Acceso a medios | Solo puedes pedir medios de **tu propia** cuenta (la que autorizó la app). No hay API pública para “cualquier perfil” por username sin que ese usuario autorice. |
| Token | Necesitas **long-lived access token** (no el de corta duración). |
| Límites | ~200 requests/hora; conviene cachear (ej. 1–2 horas). |

### 2.3 Flujo para “sincronizar y mostrar en welcome”

1. **App en Meta for Developers:** Crear app, producto “Instagram Graph API”, configurar OAuth (redirect URI de tu dominio).
2. **Conectar cuenta (por tenant):** El dueño de la tienda hace login con Facebook/Instagram y autoriza a la app. Guardas en BD el `access_token` (long-lived) y el `instagram_business_account_id` asociado al tenant.
3. **Obtener publicaciones:**  
   `GET /{ig-user-id}/media?fields=id,caption,media_type,media_url,timestamp,permalink&access_token=...`
4. **Mostrar en welcome:** En el front (storefront de la tienda) un bloque “Últimas de Instagram” que consuma un endpoint vuestro (Laravel) que, con el token del tenant, llame a Graph API (o sirva desde caché).

### 2.4 Limitaciones importantes

- Solo cuentas **business/creator**.
- Solo la cuenta que autorizó: no podéis mostrar el feed de un @cualquiera sin que ese usuario os dé acceso.
- Revisión de la app por Meta si usáis permisos sensibles (para solo leer medios propios suele ser más sencillo).

---

## 3. TikTok

### 3.1 Opciones

| Opción | Uso | Limitación |
|--------|-----|------------|
| **oEmbed** | `GET https://www.tiktok.com/oembed?url={video-url}` | Un **solo video** por URL. No lista “todos los videos del usuario”. |
| **Display API** | Listar videos del usuario que autorizó | Requiere **Login Kit** (OAuth) y **app review** de TikTok. |

### 3.2 Display API (para feed del usuario)

- **Scopes necesarios:** `user.info.basic`, `video.list`.
- **Endpoint:** `GET /v2/video/list/` — devuelve lista paginada de videos públicos del usuario (metadata: id, cover, share_url, descripción, métricas, etc.).
- **Flujo:**
  1. App en [TikTok for Developers](https://developers.tiktok.com/).
  2. El usuario (tenant) hace login con TikTok y autoriza la app.
  3. Guardáis el token del usuario y llamáis a `video/list` desde el backend.
  4. En welcome mostráis una grilla/carrusel con esos videos (podéis usar el `embed_html` o enlace que devuelve la API).

### 3.3 App Review (TikTok)

- Descripción clara de la app, política de privacidad, términos.
- Demo en video mostrando el uso de cada scope (incluido `video.list`).
- Dominio y redirect URIs configurados y coherentes con la demo.

---

## 4. Resumen comparativo

| Aspecto | Instagram | TikTok |
|---------|-----------|--------|
| API a usar | Graph API (Basic Display ya no existe) | Display API (video.list) u oEmbed solo por URL |
| Quién autoriza | El dueño de la tienda (cuenta business/creator) | El dueño de la tienda (cuenta TikTok) |
| Dónde se guarda | Token + ig-user-id por tenant | Token (y user id) por tenant |
| Dónde se muestra | Bloque “Últimas de Instagram” en welcome/storefront del tenant | Bloque “Últimas de TikTok” en welcome/storefront del tenant |
| Revisión plataforma | Meta App Review (según permisos) | TikTok App Review (necesario para Display API) |
| Cuentas personales | No soportadas (solo business/creator) | Display API sí permite cuentas de usuario estándar |

---

## 5. Opciones de implementación

### Opción A: Solo enlaces (ya lo tenéis)

- En welcome/storefront solo mostráis los enlaces a Instagram y TikTok (desde `social_networks` / `instagram_url`).
- **Pros:** Cero integración, sin revisión de apps.  
- **Contras:** No hay “publicaciones” visibles, solo botones.

### Opción B: Widgets de terceros (Elfsight, EmbedSocial, etc.)

- El tenant pega su @ o URL en un campo; vosotros mostráis un iframe o script del proveedor que renderiza el feed.
- **Pros:** Rápido, sin mantener tokens ni Graph/Display API.  
- **Contras:** Coste (planes de pago), dependencia del proveedor, menos control de diseño y privacidad.

### Opción C: Integración propia con APIs (Graph + Display)

- Cada tenant conecta su Instagram (Graph) y/o TikTok (Display) con OAuth; guardáis token por tenant; backend obtiene medios y los sirve (con caché) al front; en welcome mostráis un bloque “Mis redes” con sus posts/videos.
- **Pros:** Control total, misma UX para todas las tiendas, datos en vuestro backend.  
- **Contras:** Desarrollo y mantenimiento, revisión de apps (Meta y TikTok), límites de tasa y políticas de cada plataforma.

### Opción D: Híbrido

- Instagram: Graph API (solo business/creator; el resto enlace).
- TikTok: oEmbed por URL si el tenant pega hasta N URLs de videos; o Display API si queréis listar todos sus videos automáticamente (con app review).

---

## 6. Recomendación

- **Corto plazo:** Mantener enlaces en welcome (Opción A) y, si queréis algo visual sin APIs propias, valorar un widget de terceros (Opción B) para una o dos tiendas piloto.
- **Medio plazo:** Si confirmáis que muchas tiendas tienen cuenta business/creator en Instagram y quieren feed propio:
  - Implementar **conexión Instagram (Graph API)** por tenant: OAuth → guardar token + ig-user-id → job/caché que llene “últimas publicaciones” → bloque en welcome/storefront.
  - Para **TikTok**, decidir entre: (1) solo enlaces, (2) oEmbed para unas pocas URLs que el tenant configure, o (3) Display API con app review para feed automático.

---

## 7. Próximos pasos sugeridos

1. Definir si “welcome” es solo la landing de Linkiu o también (o solo) la página de cada tienda.
2. Decidir si el primer MVP es Instagram, TikTok o ambos.
3. Crear app en Meta for Developers y, si aplica, en TikTok for Developers; configurar OAuth y scopes mínimos.
4. Diseñar modelo de datos: tabla o campos por tenant para `instagram_access_token`, `instagram_user_id`, `tiktok_access_token`, etc., y política de refresco de tokens.
5. Implementar en backend: rutas OAuth callback, jobs de sincronización con caché, endpoint para el front que devuelva los medios.
6. Implementar en front: bloque “Redes” o “Últimas de Instagram/TikTok” en la página de welcome/storefront del tenant.

Si indicáis si el welcome es la landing global o el storefront por tienda y si preferís empezar por Instagram o TikTok, se puede bajar esto a un plan de tareas por sprints (endpoints, migraciones, pantallas de “conectar cuenta”, etc.).
