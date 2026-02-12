---
name: linkiu_qa_and_testing_protocol
description: Protocolo estándar de Control de Calidad (QA) y Pruebas para módulos en Linkiu. Define criterios de aceptación técnica, funcional y de integridad.
---

# Protocolo de QA y Testing (Linkiu)

Este protocolo es obligatorio para validar cualquier módulo antes de ser considerado "Listo para Producción". El objetivo es garantizar que la experiencia del usuario sea infalible y que la integridad del sistema sea absoluta.

## 1. Verificación de Integridad de Datos
- **Aislamiento Tenant/Sede**: Confirmar mediante pruebas manuales o de código que no es posible acceder a registros de otros tenants o sedes mediante la URL.
- **Relaciones de Base de Datos**: 
  - Validar que al eliminar un registro "padre" (ej: Categoría), los "hijos" (ej: Productos) se gestionen según el diseño (SoftDelete, Cascade o Restrict).
  - Verificar que no queden registros "huérfanos" sin `tenant_id`.
- **Atomicidad de Operaciones**: Comprobar que procesos complejos (ej: realizar una venta) se ejecuten dentro de transacciones de base de datos (`DB::transaction`).

## 2. Pruebas Funcionales y Casos de Borde (Edge Cases)
- **Formularios e Inputs**: 
  - Intentar enviar datos vacíos, tipos de datos incorrectos (letras en campos de precio) o longitudes excesivas.
  - Verificar que el `FormRequest` devuelva errores claros y en español.
- **Búsqueda y Filtros**: Comprobar que los filtros funcionen correctamente y que, si no hay resultados, aparezca el componente `EmptyState`.
- **Paginación**: Navegar entre páginas y validar que los filtros de búsqueda se mantengan activos (`preserveState`).

## 3. Pruebas de UX e Interfaz Premium
- **Feedback de Acción**: Verificar que cada clic en "Guardar" o "Eliminar" dispare un indicador de carga y un `Sonner` (bottom-center) al finalizar.
- **Confirmación Crítica**: Comprobar que toda acción destructiva solicite confirmación mediante `AlertDialog`.
- **Estados de Carga**: Simular una conexión lenta para verificar que los `Skeletons` aparezcan correctamente antes de mostrar los datos.

## 4. Auditoría de Responsividad (Mobile-First)
- **Vista Móvil (iPhone 12/14 Pro)**: 
  - Verificar que ningún elemento se salga de la pantalla (overflow).
  - Comprobar que las tablas se transformen en `Cards` o que tengan scroll horizontal controlado.
  - Validar que los botones sean fáciles de presionar con el dedo (Touch Targets).
- **Vista Tablet (iPad)**: Comprobar que el layout de columnas se ajuste correctamente.

## 5. Rendimiento y Red (Network Check)
- **Consumo de Memoria**: Verificar que no se estén cargando campos innecesarios (selectores específicos) ni relaciones redundantes (N+1).
- **Peso de Imágenes**: Comprobar que las imágenes servidas desde **Bunny.net** estén en formato WebP y tengan un tamaño razonable.

## 6. Protocolo de "Aprobado"
Un módulo solo se considera **PASO QA** si el reporte final cumple con:
1. Cero errores 422/500 no controlados.
2. 100% responsivo en móviles.
3. Feedback visual en todas las acciones de escritura.
4. Blindaje de seguridad verificado.

---
**OBJETIVO**: Eliminar la incertidumbre y asegurar que cada despliegue en Linkiu mantenga el estándar de calidad más alto.
