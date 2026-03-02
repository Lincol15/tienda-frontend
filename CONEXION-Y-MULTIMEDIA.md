# Conexión al backend y multimedia (Cloudinary)

## Environment

- **Producción:** `src/environments/environment.ts` y `environment.prod.ts`  
  `apiUrl: 'https://tienda-backend-ntfj.onrender.com'`
- **Desarrollo:** `src/environments/environment.development.ts`  
  `apiUrl: 'http://localhost:8080'` (solo para desarrollo local)

Todas las peticiones usan `environment.apiUrl` vía `ApiService` (no hay URLs hardcodeadas en servicios).

---

## Uploads (FormData, sin Content-Type)

- **Productos (create/update):** FormData con `nombre`, `descripcion`, `precio`, `categoriaId`, `stock`, `activo`, `imagen` (archivo). No se setea `Content-Type` (lo fija el navegador para `multipart/form-data`).
- **Caporales:** `ApiService.subirCaporal(data, foto?, video?)` → FormData con `titulo`, `descripcion`, `foto`, `video`. POST a `${apiUrl}/api/caporales`.
- **Portada/logo:** FormData con `portada`, `logo` (archivos). PUT a `/api/admin/configuracion-inicio`.
- **Fotos galería / Videos admin:** FormData con `datos` (JSON) + `imagen` / `video`. Sin Content-Type manual.

---

## Renderizar imágenes y videos (URLs del backend)

El backend devuelve URLs (Cloudinary o relativas). Se usa `ApiService.imageUrl(path)`: si `path` empieza por `http`, se devuelve tal cual; si no, se antepone `apiUrl`.

- **Productos:** `imagenUrl` o `urlImagen` → `<img [src]="imageUrl(p.imagenUrl ?? p.urlImagen)" />`
- **Galería (fotos):** `mediaUrl` o `urlImagen` → `<img [src]="imageUrl(foto.mediaUrl ?? foto.urlImagen)" />`
- **Portada/logo:** `portadaUrl`, `logoUrl`, `bannerUrl` → `imageUrl(config.portadaUrl ?? config.bannerUrl)` y `imageUrl(config.logoUrl)`
- **Caporales (cuando se use):** `fotoUrl` / `videoUrl` → `<img [src]="imageUrl(caporal.fotoUrl)" />` y `<video [src]="imageUrl(caporal.videoUrl)">` (o URL directa si el backend devuelve URL absoluta)

---

## Not Found al refrescar (Render Static Site)

En el Static Site de Render hay que configurar **Rewrite** para que todas las rutas sirvan `index.html`:

- **Redirects/Rewrites** → Add Rule  
- Type: **Rewrite**  
- Source: `/*`  
- Destination: `/index.html`

Así no sale "Not Found" al recargar en `/corigen`, `/admin`, etc. Detalle en **PROBLEMAS-COMUNES.md** y **PASOS-RENDER.md**.

---

## Confirmación: sin localhost en producción

- En el repo **no** hay referencias a `localhost` ni `:8080` en código de producción.
- La única aparición es en `environment.development.ts`, que se usa solo en desarrollo (`ng serve`). El build de producción usa `environment.prod.ts` (o `environment.ts` según configuración) con `apiUrl` de Render.
