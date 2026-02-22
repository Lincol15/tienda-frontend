# API REST – Caporales Cristos / C'Origen (Spring Boot)

Especificación para el frontend. Base URL configurable (ej. `http://localhost:8080` vía `environment.apiUrl`).

---

## 1. Endpoints públicos (sin auth)

### Fotos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/fotos` | Lista de fotos activas |
| GET | `/api/fotos/{id}` | Foto por ID |

**Response foto:** `{ id, titulo, descripcion, urlImagen, activo }` (+ fechaCreacion si aplica)

---

### Videos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/videos` | Lista de videos activos |
| GET | `/api/videos/{id}` | Video por ID |

**Response video:** `{ id, titulo, descripcion, urlVideo, tipoVideo, embedUrl, activo }`

- **tipoVideo:** `YOUTUBE` | `FACEBOOK` | `DIRECTO`
- **embedUrl:** URL para iframe (YouTube embed) o ruta directa a .mp4/.webm; `null` si es Facebook (no se puede incrustar)

---

### Productos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/productos` | Lista de productos activos |
| GET | `/api/productos?categoriaId={id}` | Lista filtrada por categoría (opcional) |
| GET | `/api/productos/{id}` | Producto por ID |
| GET | `/api/categorias` | Lista de categorías |
| GET | `/api/categorias/{id}` | Categoría por ID |

**Response producto:** `{ id, nombre, descripcion, precio, urlImagen, categoriaId, categoriaNombre, activo }`

---

### Archivos estáticos

Imágenes y videos subidos se sirven en:

- `{baseUrl}/uploads/fotos/xxx.jpg`
- `{baseUrl}/uploads/productos/xxx.jpg`
- `{baseUrl}/uploads/videos/xxx.mp4`

Ejemplo: `http://localhost:8080/uploads/fotos/abc.jpg`

---

## 2. Admin (requiere JWT Bearer)

Todas las peticiones al panel admin (excepto login) deben llevar el header:

```
Authorization: Bearer <token>
```

### Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/admin/login` | Login del admin (público) |

**Request body:** `{ "username": "admin", "password": "admin123" }`

**Response:** `{ "token": "...", "username": "admin", "rol": "ADMIN", "expiresIn": 86400 }`

*(También disponible por compatibilidad: POST `/api/auth/login` con el mismo body/response.)*

---

### Fotos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/admin/fotos` | Lista todas (activas e inactivas) |
| GET | `/api/admin/fotos/{id}` | Una por ID |
| POST | `/api/admin/fotos` | Crear |
| PUT | `/api/admin/fotos/{id}` | Actualizar |
| DELETE | `/api/admin/fotos/{id}` | Eliminar |

**Crear/Actualizar:** `multipart/form-data`

- Part **`datos`:** Blob `application/json` → `{ titulo, descripcion, activo }`
- Part **`imagen`:** File (obligatorio en crear; opcional en actualizar)

---

### Videos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/admin/videos` | Lista todas |
| GET | `/api/admin/videos/{id}` | Uno por ID |
| POST | `/api/admin/videos` | Crear |
| PUT | `/api/admin/videos/{id}` | Actualizar |
| DELETE | `/api/admin/videos/{id}` | Eliminar |

**Crear/Actualizar:** `multipart/form-data`

- Part **`datos`:** Blob `application/json` → `{ titulo, descripcion, urlVideo? (opcional si se sube archivo), activo }`
- Part **`video`:** File opcional (archivo de video: .mp4, .webm, etc.). Si se envía, se usa en lugar de `urlVideo`.

---

### Productos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/admin/productos` | Lista todos |
| GET | `/api/admin/productos/{id}` | Uno por ID |
| POST | `/api/admin/productos` | Crear |
| PUT | `/api/admin/productos/{id}` | Actualizar |
| DELETE | `/api/admin/productos/{id}` | Eliminar |

**Crear/Actualizar:** `multipart/form-data`

- Part **`datos`:** Blob `application/json` → `{ nombre, descripcion, precio, categoriaId, activo }`
- Part **`imagen`:** File opcional

---

### Categorías

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/admin/categorias` | Lista todas |
| GET | `/api/admin/categorias/{id}` | Una por ID |
| POST | `/api/admin/categorias` | Crear (body JSON) |
| PUT | `/api/admin/categorias/{id}` | Actualizar (body JSON) |
| DELETE | `/api/admin/categorias/{id}` | Eliminar |

**Body JSON:** `{ "nombre": "...", "descripcion": "..." }`

---

## 3. CORS

- Permitido origen del frontend (ej. `http://localhost:4200` o dominio de producción).
- Métodos: GET, POST, PUT, PATCH, DELETE, OPTIONS.
- Headers: `*`, `allowCredentials: true` para `/api/**` y `/uploads/**`.

---

## 4. Base URL

El frontend usa `environment.apiUrl` (ej. `http://localhost:8080`) para todas las llamadas a la API y para construir URLs de archivos: `apiUrl + urlImagen` o `apiUrl + urlVideo`.
