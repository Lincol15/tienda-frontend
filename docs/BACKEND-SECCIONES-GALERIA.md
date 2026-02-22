# Backend: Secciones de galería (sub-títulos para fotos)

Instrucciones para que el admin pueda crear **sub-títulos** para la galería de fotos (ej. "Cultural / Tradicional", "Trajes damas") y asignar cada foto a una sección. En la página de inicio la galería se muestra por secciones con sus títulos.

---

## 1. Modelo de datos

**Sección de galería**

| Campo           | Tipo     | Descripción |
|-----------------|----------|-------------|
| `id`            | number   | PK, auto |
| `titulo`        | string   | Ej. "Cultural / Tradicional", "Trajes damas" |
| `descripcion`   | string \| null | Opcional |
| `orden`         | number   | Orden de aparición en la web (menor = primero). Default 0 |
| `activo`        | boolean  | Si la sección se muestra en la web. Default true |
| `fechaCreacion` | string (ISO) | Opcional |

**Foto** (extender el modelo existente)

- Añadir campo **`seccionId`** (number \| null, FK a sección de galería). Si es null, la foto no pertenece a ninguna sección (no se muestra en la galería por secciones, o se puede mostrar en un bloque "Sin sección" si se desea).

---

## 2. Endpoints públicos (sin autenticación)

- **GET** `/api/secciones-galeria`
  - Devuelve las secciones **activas** ordenadas por `orden`, cada una con su lista de **fotos activas**.
  - Respuesta: array de objetos con `id`, `titulo`, `descripcion`, `orden`, `activo`, `fechaCreacion` (opcional) y **`fotos`** (array de fotos con `id`, `titulo`, `descripcion`, `urlImagen`, `activo`, `seccionId`, etc.).
  - Solo incluir fotos con `activo = true` dentro de cada sección.

---

## 3. Endpoints admin (con autenticación JWT)

**Secciones de galería**

- **GET** `/api/admin/secciones-galeria`  
  Lista todas las secciones (para el dropdown al crear/editar fotos y para la pantalla "Secciones galería").

- **POST** `/api/admin/secciones-galeria`  
  Crear sección. Body JSON:  
  `{ "titulo": "Trajes damas", "descripcion": "Opcional", "orden": 0, "activo": true }`

- **PUT** `/api/admin/secciones-galeria/:id`  
  Actualizar sección (mismo body).

- **DELETE** `/api/admin/secciones-galeria/:id`  
  Eliminar sección. Las fotos que tenían esa `seccionId` pueden quedar con `seccionId = null` (no borrar las fotos).

**Fotos (cambios)**

- Al **crear** o **actualizar** una foto (POST/PUT multipart), el JSON en la part `datos` puede incluir **`seccionId`** (number | null).  
  Ejemplo: `{ "titulo": "...", "descripcion": "...", "activo": true, "seccionId": 1 }`  
  Si no se envía o es null, la foto no se asigna a ninguna sección.

---

## 4. Comportamiento en el frontend

- **Página de inicio:** llama a `GET /api/secciones-galeria` y, por cada sección activa, muestra el título (`titulo`) y debajo la galería de fotos de esa sección. Si el backend no expone aún la API, el front hace fallback y muestra todas las fotos en un solo bloque "Galería".
- **Admin – Secciones galería:** pantalla para listar, crear, editar y eliminar secciones (título, descripción, orden, activo).
- **Admin – Fotos:** al crear o editar una foto, el formulario incluye un selector "Sección de galería" que lista las secciones; el valor se envía como `seccionId` en el JSON de `datos`.

---

## 5. Resumen para el desarrollador backend

- Crear entidad **Sección de galería** (titulo, descripcion, orden, activo).
- Añadir **seccionId** (nullable, FK) a la entidad **Foto**.
- **Público:** `GET /api/secciones-galeria` → secciones activas ordenadas por `orden`, cada una con su array `fotos` (solo fotos activas).
- **Admin:** CRUD de secciones (`GET/POST/PUT/DELETE /api/admin/secciones-galeria` y `.../:id`) y aceptar `seccionId` en el JSON de creación/actualización de fotos (multipart con part `datos` y part `imagen`).
