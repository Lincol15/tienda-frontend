# Subir el frontend a Render y conectar con el backend

Sigue estos pasos para desplegar la app Angular (Caporales Cristos / C'Origen) en Render como **Static Site** y que use tu backend ya desplegado.

---

## 1. Subir el código a GitHub

Si aún no está en GitHub:

```bash
git init
git add .
git commit -m "Frontend Angular - Caporales Cristos / C'Origen"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/caporales-vista.git
git push -u origin main
```

(Cambia `TU_USUARIO/caporales-vista` por tu repositorio.)

---

## 2. Crear el Static Site en Render

1. Entra a [Render Dashboard](https://dashboard.render.com/).
2. **New** → **Static Site**.
3. Conecta el repositorio de GitHub donde está este frontend (por ejemplo `caporales-vista` o el nombre que le hayas puesto).
4. Configura:

   | Campo | Valor |
   |-------|--------|
   | **Name** | `caporales-vista` (o el nombre que quieras) |
   | **Branch** | `main` |
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `dist/caporales-vista/browser` |

5. (Opcional) En **Environment** puedes añadir variables si en el futuro quieres cambiar la URL del API sin recompilar (por ahora la URL del backend está en el código).
6. Pulsa **Create Static Site**.

---

## 3. Regla para SPA (rutas de Angular)

Para que al recargar o entrar por una ruta como `/corigen` o `/admin` no dé 404:

1. En tu Static Site en Render, ve a **Settings**.
2. Busca **Redirects/Rewrites**.
3. Añade una regla:
   - **Type:** Rewrite
   - **Source:** `/*`
   - **Destination:** `/index.html`

Así todas las rutas sirven el `index.html` y Angular Router funciona bien.

---

## 4. Conectar con el backend

La URL del backend ya está configurada en el código:

- **Producción:** `src/environments/environment.ts` → `apiUrl: 'https://tienda-backend-ntfj.onrender.com'`
- Al hacer `npm run build`, se usa ese `environment.ts`, así que el sitio en Render ya llamará a ese backend.

No hace falta configurar nada más en Render para la URL del API, salvo que quieras usar otra (entonces habría que usar variables de entorno y ajustar el código).

---

## 5. CORS en el backend

El frontend estará en una URL como `https://caporales-vista.onrender.com` y el backend en `https://tienda-backend-ntfj.onrender.com`. El navegador aplica CORS.

En tu backend (Spring Boot) debe estar permitido el origen del frontend, por ejemplo:

- En desarrollo: `http://localhost:4200`
- En producción: `https://caporales-vista.onrender.com` (o la URL que te asigne Render)

Si al abrir el sitio en Render ves errores de CORS en la consola del navegador (F12), hay que añadir o ajustar en el backend ese origen en la configuración CORS.

---

## 6. Resumen

| Dónde | Qué |
|-------|-----|
| GitHub | Repositorio del frontend (este proyecto). |
| Render Static Site | Build: `npm install && npm run build`, Publish: `dist/caporales-vista/browser`. |
| Rewrite | `/*` → `/index.html` para SPA. |
| Backend | Ya en Render; el frontend usa `https://tienda-backend-ntfj.onrender.com` por defecto. |

Si la carpeta de publicación no existe (por ejemplo porque la versión de Angular genera otra ruta), en el build de Render revisa los logs y busca la carpeta `dist/...` que se genere y pon esa misma ruta en **Publish Directory**.
