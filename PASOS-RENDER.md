# Pasos para subir el frontend a Render y conectar con el backend

Sigue los pasos en orden. Si tu repo en GitHub ya está actualizado, empieza por la parte 1.

---

# PARTE 1: Subir el frontend a Render (paso a paso)

## Paso 1.1 – Tener el proyecto en GitHub

1. Abre una terminal en la carpeta del proyecto (donde está `package.json`).
2. Si aún no has subido a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Frontend Angular - listo para Render"
   git branch -M main
   ```
3. En GitHub crea un repositorio nuevo (por ejemplo `tienda-frontend`). No marques “Add README”.
4. Conecta y sube:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/tienda-frontend.git
   git push -u origin main
   ```
   (Cambia `TU_USUARIO/tienda-frontend` por tu usuario y nombre del repo.)

Si ya tenías el repo, solo asegúrate de que los últimos cambios estén subidos:
```bash
git add .
git commit -m "Ajustes para Render"
git push origin main
```

---

## Paso 1.2 – Entrar a Render y crear Static Site

1. Entra a **https://dashboard.render.com** e inicia sesión.
2. Arriba a la derecha haz clic en **New** (o **Add New**).
3. Elige **Static Site**.

---

## Paso 1.3 – Conectar el repositorio de GitHub

1. Si es la primera vez, Render te pedirá conectar **GitHub**. Haz clic en **Connect GitHub** y autoriza el acceso.
2. En la lista de repositorios busca **tienda-frontend** (o el nombre que le hayas puesto al frontend).
3. Haz clic en **Connect** junto a ese repo.

---

## Paso 1.4 – Configurar el Static Site

Completa los campos así:

| Campo | Qué poner |
|-------|-----------|
| **Name** | `tienda-frontend` (o el nombre que quieras para el servicio) |
| **Branch** | `main` |
| **Root Directory** | Déjalo vacío (el proyecto está en la raíz del repo) |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist/caporales-vista/browser` |

- **Build Command:** con eso Render instala dependencias y genera el build de producción.
- **Publish Directory:** es la carpeta que Angular crea al hacer `ng build`. Si más adelante el build falla porque no encuentra esa ruta, en los logs de Render verás la carpeta que se generó (por ejemplo `dist/caporales-vista`) y puedes usar esa.

No hace falta tocar **Environment** por ahora (la URL del backend ya está en el código).

---

## Paso 1.5 – Crear el sitio

1. Revisa que todo esté como en la tabla anterior.
2. Haz clic en **Create Static Site**.
3. Render empezará el primer deploy (build + publicación). Puede tardar unos minutos.

---

## Paso 1.6 – Comprobar el build

1. En la página del servicio verás la pestaña **Events** o **Logs**.
2. Espera a que el **Build** termine en verde (**Deploy live** o similar).
3. Si aparece **Deploy failed** en rojo:
   - Entra en **Logs** y mira el error.
   - Si dice que no encuentra la carpeta de publicación, cambia **Publish Directory** en **Settings** por la ruta que veas en el log (por ejemplo `dist/caporales-vista` si no existe `browser`).
   - Vuelve a **Manual Deploy** → **Deploy latest commit**.

---

## Paso 1.6b – Si falla con "Exited with status 1"

Cuando el build falla con **"Exited with status 1 while building your code"**:

1. **Ver el error real:** En Render, entra al deploy fallido → **Logs**. Sube con el scroll hasta que veas líneas en rojo o que digan `Error:`, `Failed`, o el mensaje de Angular/Node. Ese texto es la causa.
2. **Probar con Node 20:** En el Static Site → **Environment** (Variables de entorno), añade:
   - **Key:** `NODE_VERSION`
   - **Value:** `20`
   Luego **Manual Deploy** → **Clear build cache & deploy**.
3. **Build de producción explícito:** En **Settings** → **Build & Deploy**, pon en **Build Command**:
   ```bash
   npm install && npm run build:prod
   ```
   Guarda y haz **Manual Deploy** otra vez.
4. **Si sigue fallando:** Copia el mensaje de error que salga en los logs (las últimas 20–30 líneas) y búscalo o compártelo para revisar.

---

## Paso 1.7 – Poner la regla para las rutas (SPA)

Para que al entrar a `/corigen`, `/admin`, etc. no salga 404:

1. En tu Static Site, en el menú lateral, entra a **Settings**.
2. Baja hasta la sección **Redirects/Rewrites**.
3. Haz clic en **Add Rule** (o **Add Redirect**).
4. Configura:
   - **Type:** Rewrite (no Redirect).
   - **Source (or Path):** `/*`
   - **Destination:** `/index.html`
5. Guarda.

Así todas las rutas sirven el `index.html` y Angular Router funciona bien.

---

## Paso 1.8 – Ver la URL del frontend

1. Arriba en la página del servicio verás algo como: **Your site is live at …**
2. La URL será tipo: `https://tienda-frontend-xxxx.onrender.com` (el nombre puede variar).
3. Ábrela en el navegador: deberías ver la página de inicio del frontend.

Con esto ya tienes el **frontend en Render**. Sigue con la Parte 2 para conectarlo bien al backend.

---

# PARTE 2: Conectar el frontend con el backend (paso a paso)

## Paso 2.1 – Confirmar la URL del backend

Tu backend en Render está en:

- **URL del backend:** `https://tienda-backend-ntfj.onrender.com`

En tu proyecto frontend eso ya está configurado en:

- `src/environments/environment.ts` (producción)
- `src/environments/environment.development.ts` (desarrollo)

No tienes que cambiar nada en el código si el backend sigue en esa URL.

---

## Paso 2.2 – Activar CORS en el backend

El frontend y el backend están en dominios distintos (por ejemplo `tienda-frontend-xxxx.onrender.com` y `tienda-backend-ntfj.onrender.com`). El navegador usa CORS; si el backend no permite el origen del frontend, verás errores en la consola (F12) y las peticiones fallarán.

En tu **backend** (Spring Boot), hay que permitir el origen del frontend:

1. Anota la URL de tu frontend en Render (la que viste en el Paso 1.8), por ejemplo:
   - `https://tienda-frontend-xxxx.onrender.com`
2. En el proyecto del backend, en la configuración de CORS, añade ese origen. Por ejemplo en Spring puede ser algo así (según cómo lo tengas):
   - En un `WebMvcConfigurer` o `@Configuration` con CORS:
     - `allowedOrigins`: incluir `https://tienda-frontend-xxxx.onrender.com`
     - Para desarrollo local también: `http://localhost:4200`
3. Vuelve a desplegar el backend (push a GitHub si Render hace auto-deploy) y espera a que esté en vivo.

---

## Paso 2.3 – Probar la conexión

1. Abre la URL de tu **frontend** en Render (la del Paso 1.8).
2. Abre las herramientas de desarrollo del navegador (F12) → pestaña **Console**.
3. Navega por la web:
   - Inicio (fotos, videos si los hay).
   - Tienda (productos, categorías).
   - Si ves datos (fotos, productos, etc.) y en la consola no aparecen errores de CORS ni de red, la conexión está bien.
4. Si en la consola sale un error de CORS (mensaje que mencione “CORS” o “Access-Control-Allow-Origin”):
   - Revisa en el backend que el origen de tu frontend (la URL de Render del frontend) esté en la lista de orígenes permitidos.
   - Vuelve a desplegar el backend y prueba otra vez.

---

## Paso 2.4 – Probar el panel admin

1. En el frontend, ve a **Admin** (por ejemplo `/admin/login`).
2. Inicia sesión con el usuario del backend.
3. Si el login funciona y ves el panel (fotos, productos, etc.), el frontend ya está conectado al backend.

Si el login falla o no cargan datos, revisa de nuevo la consola (F12) y que la URL del backend en `environment.ts` sea la correcta y que CORS permita tu frontend.

---

# Resumen rápido

| Qué | Dónde / Cómo |
|-----|----------------|
| Subir frontend | Render → New → Static Site → conectar repo → Build: `npm install && npm run build` → Publish: `dist/caporales-vista/browser` |
| Rutas SPA | Settings del Static Site → Redirects/Rewrites → `/*` → `/index.html` (Rewrite) |
| URL del backend | Ya en `src/environments/environment.ts` → `apiUrl: 'https://tienda-backend-ntfj.onrender.com'` |
| Conectar ambos | CORS en el backend permitiendo la URL del frontend en Render (y `http://localhost:4200` en desarrollo) |

Si en algún paso te sale un error concreto (mensaje o captura), dímelo y te digo qué cambiar.
