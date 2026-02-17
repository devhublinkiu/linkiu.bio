# Deploy (Laravel Forge)

## OOM en el servidor

El build de Vite (client + SSR) consume mucha RAM. En servidores con poca memoria el proceso puede ser **Killed** (código 137).

### Solución: no construir en el servidor

Los assets se commitean en el repo. En el **script de deploy de Forge** sustituye:

```bash
npm run build
```

por:

```bash
npm run build:if-missing
```

Así, si ya existe `public/build` (porque vino en el commit), no se ejecuta el build y el deploy no se queda sin memoria.

### Flujo al cambiar el frontend

1. Hacer los cambios en el código.
2. En local: `npm run build` (requiere suficiente RAM, p. ej. 8 GB).
3. Hacer commit de `public/build` y `bootstrap/ssr` junto con el resto.
4. Push; Forge ejecutará `build:if-missing` y omitirá el build.
