# Tienda Frontend – Caporales Cristos / C'Origen

Frontend en **Angular** para la web de la Asociación Folklórica Caporales Cristos y la tienda C'Origen. Se conecta al backend en Render (API REST).

## Contenido

- **Página principal (Caporales Cristos):** galería de fotos, videos, historia, portada y logo configurables desde el admin.
- **Tienda (C'Origen):** productos, categorías, carrito, compra por WhatsApp.
- **Panel admin:** gestión de fotos, portada/logo, secciones de galería, videos, categorías, productos, configuración tienda, métodos de pago, ventas.

## Requisitos

- Node.js 18+
- Backend desplegado (por defecto: `https://tienda-backend-ntfj.onrender.com`).

## Desarrollo local

```bash
npm install
npm start
```

Abre `http://localhost:4200/`. La app usa la URL del backend definida en `src/environments/environment.development.ts`.

## Build para producción

```bash
npm run build
```

La salida queda en `dist/caporales-vista/browser`. El build de producción usa la URL del backend en `src/environments/environment.ts`.

## Desplegar en Render

Para subir este frontend a Render como **Static Site** y conectarlo al backend:

1. Sube el repo a GitHub (si no está ya).
2. En [Render](https://dashboard.render.com): **New** → **Static Site** → conecta el repo.
3. **Build command:** `npm install && npm run build`
4. **Publish directory:** `dist/caporales-vista/browser`
5. En **Redirects/Rewrites** añade: `/*` → `/index.html` (rewrite) para que funcionen las rutas de Angular.

Detalles en **[DEPLOY-RENDER.md](./DEPLOY-RENDER.md)**.

## Configuración del backend

- **URL del API:** `src/environments/environment.ts` (producción) y `environment.development.ts` (desarrollo). Por defecto apuntan a `https://tienda-backend-ntfj.onrender.com`.
- El backend debe tener **CORS** habilitado para el origen del frontend (p. ej. `https://tu-app.onrender.com` o `http://localhost:4200`).

## Estructura principal

- `src/app/pages/` – Inicio, tienda, admin, login.
- `src/app/services/` – API, auth, carrito, WhatsApp.
- `src/app/models/` – Interfaces TypeScript.
- `src/environments/` – URL del API y datos de WhatsApp.

---

Generado con [Angular CLI](https://github.com/angular/angular-cli).
