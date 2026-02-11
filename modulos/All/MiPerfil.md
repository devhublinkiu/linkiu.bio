# Mi Perfil

> Módulo transversal para la gestión del perfil personal del usuario administrador.

## Información General

| Campo       | Valor                                    |
|-------------|------------------------------------------|
| Verticales  | All (transversal)                        |
| Ubicación   | `Controllers/Tenant/Admin/ProfileController.php` |
| Vista       | `Pages/Tenant/Admin/Profile/Edit.tsx`    |
| Acceso      | Dropdown del avatar en la navbar         |

## Funcionalidades

- Edición de datos personales (nombre, teléfono, dirección, ciudad, país)
- Cambio de contraseña
- Subida de foto de perfil (almacenamiento por tenant en S3)
- Visualización de información del negocio (vertical, categoría)
- Visualización del rol del usuario

## Rutas

| Método | Ruta                  | Nombre                          |
|--------|-----------------------|---------------------------------|
| GET    | `/profile`            | `tenant.profile.edit`           |
| PATCH  | `/profile`            | `tenant.profile.update`         |
| PUT    | `/profile/password`   | `tenant.profile.password.update`|
| POST   | `/profile/photo`      | `tenant.profile.photo.update`   |

## Notas de diseño

- El módulo **no tiene enlace en el sidebar** — es accesible únicamente desde el dropdown del avatar en la navbar. Esta decisión es intencional para no sobrecargar el sidebar.
- Todo usuario autenticado del tenant puede ver y editar su propio perfil.
- El campo de correo electrónico no es editable ya que es el identificador único del usuario.
