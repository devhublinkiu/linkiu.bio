---
name: linkiu_module_lifecycle_workflow
description: Workflow sistemático para la Auditoría de módulos existentes o el Diseño de módulos nuevos en Linkiu. Centrado en la comprensión visual mediante Mermaid y el debate técnico.
---

# Workflow de Ciclo de Vida del Módulo (Linkiu)

Este workflow guía el proceso desde la concepción de una idea hasta el reporte de auditoría final, asegurando que nada se implemente sin una comprensión visual clara y un debate previo.

## Fase 1: Identificación y Auditoría Visual
Antes de realizar cambios, la IA debe determinar el estado del módulo:

1. **Verificación de Existencia**: Buscar el módulo en `app/Http/Controllers/Tenant/Admin/`, `resources/js/Pages/Tenant/Admin/` y `menuConfig.ts`.
2. **Casuística A: Si el Módulo YA EXISTE**:
   - **Mapeo Técnico**: Leer la lógica actual (Controlador, Modelos, Vistas).
   - **Diagrama Mermaid Actual**: Generar un diagrama de flujo detallado que explique:
     * Interacción del Usuario -> Llamada API -> Validación -> Lógica de Negocio -> Persistencia.
   - **Crítica de Usabilidad**: Evaluar si el flujo es confuso, falto de feedback o si viola las reglas de `linkiu_admin_implementation_rules`.
3. **Casuística B: Si el Módulo es NUEVO**:
   - **Análisis de Propuesta**: Solicitar o inferir los objetivos del módulo.
   - **Arquitectura Sugerida**: Definir Entidades, Relaciones y Flujos de Pantalla.
   - **Diagrama Mermaid de Propuesta**: Crear una visualización clara del futuro módulo para debate.

## Fase 2: Debate Técnico y Aprobación
- **Presentación**: Mostrar el diagrama Mermaid al USER.
- **Justificación**: Explicar por qué se eligió ese flujo.
- **Refinamiento**: Iterar con el USER hasta que el flujo sea lógico, simple y "no confundible".
- **BLOQUEO**: No se permite iniciar la codificación sin la aprobación explícita del flujo por parte del USER.

## Fase 3: Documentación de Estándares (MODULOS_v2)
- Crear el directorio en `MODULOS_v2/[Vertical]/`.
- Generar el archivo `SPEC.md` incluyendo el diagrama Mermaid definitivo.
- Vincular el módulo en el `SKILL_MAP.md` correspondiente.

## Fase 4: Ejecución Guiada
- Proceder a la implementación siguiendo estrictamente la skill: `linkiu_admin_implementation_rules`.

## Protocolo de Interacción (Keywords Mandatorias)
El desarrollador (IA) debe modular su comportamiento según los encabezados o palabras clave que el USER envié en su mensaje:

1. **`Debate:`**: Se utiliza para discutir temas sobre una funcionalidad, módulo o corrección. 
   - *Acción*: El desarrollador debe responder con argumentos técnicos, pros/contras o alternativas.
   - *Restricción*: **PROHIBIDO** modificar o crear código. No se mueve ni una línea hasta recibir un `GO`.
2. **`Pregunta:`**: Consulta directa sobre el sistema o lógica.
   - *Acción*: Responder de forma clara y concisa.
   - *Restricción*: **No actuar**. Limitarse a la respuesta teórica o explicativa.
3. **`Ajuste:`**: Reporte de un error, bug o cambio menor necesario.
   - *Acción*: Proceder con la corrección técnica de forma inmediata (pasando por el flujo de planificación si es complejo).
4. **`Investiga:`**: Orden de búsqueda de información o análisis profundo.
   - *Acción*: Explorar el código, la web o la documentación para obtener conocimiento que permita un debate posterior.
5. **`GO`**: Comando de ejecución.
   - *Acción*: Avanzar con la implementación, el despliegue o la siguiente fase del workflow. Es el único comando que "abre la puerta" a la escritura de código tras un debate.

---
**OBJETIVO**: Que el usuario siempre tenga el control total del flujo y la IA no actúe por impulso sin validación previa.
