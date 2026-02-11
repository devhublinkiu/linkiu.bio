# Estrategia de Onboarding: Linkiu.bio (Non-Intrusive)

**Versión:** 1.0  
**Fecha:** 04 de Febrero 2026  
**Objetivo:** Reducir la fricción en el registro, llevando al usuario al "Aha! Moment" (ver su dashboard) lo antes posible, posponiendo el pago y la configuración compleja para después.

---

## 1. El Nuevo Flujo de Registro (Express)

Este flujo busca que el usuario cree su cuenta en menos de 2 minutos.

### Paso 1: Selección de Vertical
*   **Acción:** El cliente selecciona su industria (Gastro, Ecommerce, etc.).
*   **Visual:** Cards con ilustraciones/wireframes representativos.
*   **UX:** Cambia el contexto visual de los siguientes pasos.

### Paso 2: Categoría de Negocio
*   **Acción:** Selección de sub-categoría (Ej: "Hamburguesas" dentro de "Gastro").
*   **UX:** Filtra la biblioteca de iconos y sugerencias para el Dashboard.

### Paso 3: Información del Propietario (Cuenta)
*   **Campos:** Nombre, Email y Contraseña.
*   **UX:** Creación de las credenciales de acceso al sistema.

### Paso 4: Información del Negocio (Identidad Veloz)
*   **Campos:** Solo "Nombre del Negocio".
*   **Lógica de Slug:** Se genera un **Slug Aleatorio** (Ej: `linkiu.bio/shop-82931`).
*   **UX:** Se elimina el bloqueo de "pensar un nombre disponible". El usuario entra directo.

### Paso 5: Pantalla de "Building" (Generando Valor)
*   **Visual:** Animación de carga con mensajes de progreso reales.
*   **Psicología:** "Optimizando tu catálogo para [Vertical]", "Preparando tu panel de control".

### Paso 6: Dashboard (Destino Final)
*   **Estado:** El usuario ya está dentro.
*   **Upsell:** Cards en el sidebar y banners invitando a "Personalizar link" o "Desbloquear funciones Pro".

---

## 2. Panoramas de Upgrade (Planes)

El usuario decide cuándo pagar desde la sección **"Planes"** dentro del Dashboard.

### Escenario A: Plan con Slug Personalizado
1.  **Activación:** El usuario elige un plan (Ej: Pro).
2.  **Configuración:** Se abre un modal para elegir su nuevo Slug (Ej: `linkiu.bio/mi-marca`).
3.  **Validación:** Verificación en tiempo real de disponibilidad.
4.  **Checkout:** Proceso de pago (Wompi o Transferencia).
5.  **Cierre:** Descarga de soporte/factura y redirección al Dashboard con el nuevo slug activo.

### Escenario B: Plan sin Slug (Basado en Funciones)
1.  **Activación:** El usuario elige un plan básico.
2.  **Checkout:** Pago directo.
3.  **Resultado:** Se desbloquean funciones (analíticas, más productos), pero mantiene el slug aleatorio o uno pre-generado simple.

### Escenario C: Plan Gratuito (Default)
1.  **Activación:** Registro automático al terminar el onboarding.
2.  **Checkout:** Valor $0.
3.  **Resultado:** Acceso limitado para que el usuario "pruebe y se enamore" del producto.

---

## 3. Ventajas Estratégicas
*   **Alta Conversión:** Menos campos = Más registros.
*   **Reducción de Abandono:** No hay "pared de pago" al inicio.
*   **Valor Percibido:** El usuario invierte tiempo configurando su tienda antes de que se le pida dinero. Es más probable que pague por algo que ya "personalizó".
