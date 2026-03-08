# Temas – Fechas especiales (decoración)

Documento de decisión y alcance. Pendiente: debate sobre diseño (UI y comportamiento en el front).

---

## 1. Objetivo

Ofrecer a las tiendas **decoración** en el frontend público (animaciones, elementos visuales) acorde a **fechas especiales** (Día de la mujer, Navidad, etc.), de forma que sea **fácil de activar y desactivar** desde un solo lugar.

- **Solo decorativo:** no mensajes promocionales ni textos de campaña; solo ambiente visual.
- **Control centralizado:** solo SuperAdmin decide qué se muestra y a quién.

---

## 2. Quién controla

| Rol            | ¿Puede activar/desactivar temas? | ¿Puede crear/editar temas? |
|----------------|----------------------------------|----------------------------|
| **SuperAdmin** | Sí                               | Sí                         |
| **Admin tienda** | No                             | No                         |

El admin de la tienda **no tiene interruptor**. Si un tema está activo y aplica a su tienda, ve la decoración; si no aplica o SuperAdmin lo desactiva, no ve nada. No hay opción por tienda para “apagar” la decoración.

---

## 3. Dónde se gestiona

- **SuperAdmin** → sección **Temas** (o similar).
- Ahí se crean/editan los ítems de “fecha especial” y se define **alcance** y **estado** (activo/inactivo).

---

## 4. Alcance de un tema

Cada tema se puede activar de **una** de estas tres formas (a definir si en el futuro se combinan):

| Alcance        | Descripción |
|----------------|-------------|
| **Global**     | Aplica a todas las tiendas. |
| **Por vertical** | Aplica solo a tiendas de una o más verticales (ej. Church, Gastronomía). |
| **Por tienda** | Aplica solo a una lista concreta de tenants. |

- “Fácil de desactivar” = SuperAdmin desactiva el tema o cambia su alcance (por ejemplo de global a unas pocas tiendas).

---

## 5. Activación / desactivación

- **Manual:** SuperAdmin activa o desactiva cada tema cuando quiera (sin depender de que el sistema “apague” solo por fecha).
- Opcional a futuro: fechas de inicio/fin en el tema para orden o para que el front no muestre decoración fuera de rango; la decisión de “está activo” sigue siendo manual en SuperAdmin.

---

## 6. Contenido de un tema (a detallar en diseño)

- Identificador técnico (slug): ej. `dia-de-la-mujer`, `navidad`.
- Nombre para SuperAdmin: ej. “Día de la mujer”.
- Configuración **decorativa**: tipo de animación, colores, assets (imágenes/iconos), etc. — **pendiente de debatir** (diseño visual y estructura de datos).

---

## 7. Comportamiento en front (a debatir)

- Cómo se decide qué tema mostrar cuando un tenant entra (global / vertical / tienda).
- Si pueden aplicar varios temas a la misma tienda, cuál se muestra (ej. uno solo a la vez, prioridad, etc.).
- Dónde y cómo se inyecta la decoración (layout, páginas concretas, componentes reutilizables).

---

## 8. Pendiente

- **Debate de diseño:** UI en SuperAdmin (CRUD Temas, formulario de alcance), estructura de la “config decorativa”, y comportamiento exacto en el front (dónde y cómo se pinta la decoración).

---

*Documento creado a partir del debate de alcance. Actualizar tras definir diseño.*
