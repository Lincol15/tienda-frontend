# Prompt para pedir el frontend (Angular)

Copia y pega el siguiente texto cuando pidas que te generen el frontend en Angular.

---

## TEXTO PARA COPIAR (prompt frontend)

```
Necesito el frontend en Angular para mi proyecto "Cristos Caporales / C'Origen". El backend ya está listo en Spring Boot y expone una API REST. Resumen:

---

1) ESTRUCTURA DE LA WEB

- UNA sola aplicación Angular con DOS módulos grandes:
  - Módulo 1: CRISTOS CAPORALES (página principal): galería de fotos, videos, información de danzas. Todo público, solo lectura.
  - Módulo 2: C'ORIGEN (tienda): productos con fotos y precios. Público solo ve; la "compra" redirige a WhatsApp (no hay pago automático).

- En la web principal (Cristos Caporales) debe haber un botón tipo "Ir a C'Origen" que lleve a la tienda (puede ser otra ruta, ej. /corigen o /tienda).

- Solo hay un tipo de usuario con acceso especial: el ADMIN (el jefe). Él hace login y accede a un panel privado desde donde puede:
  - Subir, editar y eliminar fotos
  - Subir, editar y eliminar videos (URL de YouTube o enlace)
  - Crear, editar y eliminar productos y categorías
  - Definir y cambiar precios de productos
  El resto de visitantes no hace login; solo ve contenido.

---

2) BACKEND (API)

- Base URL del API: http://localhost:8080 (configurable por environment).
- Las imágenes subidas se sirven en: http://localhost:8080/uploads/... (fotos en /uploads/fotos/..., productos en /uploads/productos/...).

Autenticación:
- POST /api/auth/login
  Body: { "username": "admin", "password": "admin123" }
  Respuesta: { "token": "...", "username": "admin", "rol": "ADMIN", "expiresIn": 86400 }
- Todas las peticiones al panel admin deben llevar el header: Authorization: Bearer <token>

APIs públicas (sin token):
- GET /api/fotos → lista de fotos activas
- GET /api/fotos/{id} → una foto
- GET /api/videos → lista de videos activos
- GET /api/videos/{id} → un video
- GET /api/productos → productos activos (opcional ?categoriaId=1)
- GET /api/productos/{id} → un producto
- GET /api/categorias → categorías
- GET /api/categorias/{id} → una categoría

Panel admin (con token JWT en header Authorization: Bearer <token>):
- Fotos: GET/POST/PUT/DELETE /api/admin/fotos
  Crear/actualizar: multipart con part "datos" (JSON: titulo, descripcion, activo) y part "imagen" (archivo).
- Videos: GET/POST/PUT/DELETE /api/admin/videos
  Body JSON: titulo, descripcion, urlVideo, activo.
- Productos: GET/POST/PUT/DELETE /api/admin/productos
  Crear/actualizar: multipart con part "datos" (JSON: nombre, descripcion, precio, categoriaId, activo) y part "imagen" opcional.
- Categorías: GET/POST/PUT/DELETE /api/admin/categorias
  Body JSON: nombre, descripcion.

---

3) PANTALLAS Y FUNCIONALIDAD

Público (sin login):
- Inicio / Cristos Caporales: galería de fotos, sección de videos, información. Botón "Ir a C'Origen" que lleve a la tienda.
- C'Origen (tienda): listado de productos (con filtro por categoría si hay), foto, nombre, precio, botón "Comprar".
- Al hacer clic en "Comprar": construir mensaje tipo "Hola, quiero comprar: [nombre producto], Precio: S/ [precio]" y redirigir a https://wa.me/51NUMERO?text=MENSAJE (el número 51XXXXXXXXX debe ser configurable, ej. en environment).

Admin (con login):
- Login: formulario usuario + contraseña; llamar a POST /api/auth/login; guardar token (ej. en localStorage o servicio); redirigir al panel admin.
- Panel admin (protegido; si no hay token, redirigir a login):
  - Gestión de fotos: listar, agregar (subir imagen + titulo/descripcion), editar, eliminar.
  - Gestión de videos: listar, agregar (titulo, descripcion, URL), editar, eliminar.
  - Gestión de categorías: listar, crear, editar, eliminar.
  - Gestión de productos: listar, crear (nombre, descripcion, precio, categoría, imagen opcional), editar precios e información, eliminar.
- Opción de cerrar sesión (borrar token y volver a la parte pública).

---

4) DETALLES TÉCNICOS

- Angular (versión reciente), con rutas y lazy loading si tiene sentido para Cristos Caporales y C'Origen.
- Servicio HTTP (HttpClient) para consumir el API; interceptor que añada el token JWT a las peticiones a /api/admin/**.
- Guard para rutas del panel admin: si no hay token válido, redirigir a login.
- Variables de entorno (environment) para: baseUrl del API (ej. http://localhost:8080), número de WhatsApp para la tienda.
- Diseño responsive y claro: la parte pública debe verse bien en móvil y desktop; el panel admin puede ser más simple pero usable.
- Para subida de archivos (fotos y productos), usar FormData con part "datos" (JSON stringificado) y part "imagen" (archivo).
- Las URLs de imágenes del backend son relativas al servidor, ej. /uploads/fotos/xxx.jpg; en el frontend construir la URL completa con la baseUrl del API (ej. baseUrl + urlImagen).

---

5) RESUMEN

- Una web: Cristos Caporales (principal) + C'Origen (tienda).
- Público: solo ve fotos, videos, productos; compra por WhatsApp.
- Admin: login con JWT; panel para gestionar fotos, videos, categorías y productos (incluidos precios).
- Backend ya existe en Spring Boot; solo hay que conectar Angular a esta API.
```

---

## Después de pegar el prompt

- Si el backend no está en `http://localhost:8080`, indica la URL correcta.
- Si quieres otro número de WhatsApp o formato de mensaje, dilo en el mismo mensaje.
- Si tienes el archivo `API-BACKEND.md` del proyecto, puedes adjuntarlo o referenciarlo para más detalle de endpoints y ejemplos de JSON.

---

## PROMPT: Arreglar subida de FOTOS (Error al crear la foto)

```
La subida de fotos en "Gestión de Fotos" falla con "Error al crear la foto". El backend espera multipart/form-data con:

- part "datos": Blob con type application/json conteniendo { titulo, descripcion, activo }
- part "imagen": el archivo File (obligatorio para crear)

NO usar formData.append('datos', JSON.stringify(datos)) a secas; Spring necesita Content-Type application/json en esa parte. Usar:

formData.append('datos', new Blob([JSON.stringify(datos)], { type: 'application/json' }));
formData.append('imagen', archivoSeleccionado);

Nombres exactos: "datos" e "imagen" (minúsculas). NO definir Content-Type manualmente en la petición HTTP.
```

---

## PROMPT: Arreglar subida de PRODUCTOS (Error al crear el producto / 500)

```
La subida de productos en "Gestión de Productos" falla con "Error al crear el producto" (500 Internal Server Error). El backend espera multipart/form-data con:

- part "datos": Blob con type application/json conteniendo:
  {
    "nombre": "string",
    "descripcion": "string",
    "precio": número (ej. 90 o 90.50),
    "categoriaId": número (el ID de la categoría, NO el nombre ni el objeto),
    "activo": boolean (true/false)
  }

- part "imagen": el archivo File (opcional; puede omitirse si no hay imagen)

IMPORTANTE para categoriaId:
- Debe ser el ID numérico de la categoría (ej. 1, 2, 3), no el nombre "ropas dama".
- En el select del formulario usar: [ngValue]="categoria.id" (no [value]="categoria" ni el nombre).
- Si la categoría viene de un objeto { id: 1, nombre: "ropas dama" }, enviar solo categoriaId: 1.

Código de ejemplo:

const datos = {
  nombre: producto.nombre,
  descripcion: producto.descripcion || '',
  precio: Number(producto.precio),
  categoriaId: Number(producto.categoriaId),
  activo: producto.activo ?? true
};
formData.append('datos', new Blob([JSON.stringify(datos)], { type: 'application/json' }));
if (imagen) formData.append('imagen', imagen);

Nombres exactos: "datos" e "imagen". NO definir Content-Type en la petición; usar HttpClient.post(url, formData) sin headers adicionales.
```

---

## PROMPT: Visualizar videos en la misma página + enlace al URL

```
En la sección "Videos" (página pública):

1) Ver el video en la misma página cuando sea posible:
   - urlVideo, tipoVideo y embedUrl vienen del API. Para videos subidos como archivo, urlVideo es tipo /uploads/videos/xxx.mp4; construir URL completa con baseUrl del API: baseUrl + urlVideo.

   - Si tipoVideo === "YOUTUBE" y embedUrl existe: mostrar iframe con [src]="video.embedUrl | safeUrl" (usar DomSanitizer/SafeResourceUrl). Debajo del iframe, un enlace "Ver en YouTube" que abra urlVideo en nueva pestaña (target="_blank").

   - Si tipoVideo === "DIRECTO" y embedUrl existe (incluye /uploads/videos/ o .mp4/.webm): usar <video controls><source [src]="baseUrl + video.urlVideo"></video>. Debajo, un enlace "Abrir enlace del video" que abra la URL en nueva pestaña (por si es enlace externo).

   - Si tipoVideo === "FACEBOOK" o embedUrl es null: NO usar iframe. Mostrar tarjeta con título, descripción y botón "Ver video en Facebook" (o "Ver video") que abra urlVideo en nueva pestaña.

2) En todos los casos, incluir también un botón o enlace para "Ir al video" / "Ver en [plataforma]" que abra urlVideo en nueva pestaña, así el usuario puede ver el video en la página y además tener la opción de llevarlo al enlace original (Facebook, YouTube, etc.).
```

---

## PROMPT: Subir videos desde galería, archivos o URL (admin)

```
En el panel admin, en "Gestión de Videos", el formulario debe permitir DOS formas de añadir el video:

A) Por URL (como hasta ahora):
   - Campo de texto "URL del video" (YouTube, Facebook, enlace directo).
   - Si el usuario rellena la URL, no se sube archivo; al guardar se envía solo "datos" con urlVideo.

B) Por archivo (galería o archivos):
   - Opción "Subir desde galería" o "Elegir archivo": input type="file" con accept="video/*" (así en móvil puede abrir la galería/cámara).
   - El usuario puede elegir un video del dispositivo (galería o carpeta de archivos).
   - Si se selecciona un archivo, al guardar se envía multipart con "datos" (sin urlVideo o urlVideo null) y part "video" (el archivo).

Formato del request (siempre multipart para crear/actualizar):
- part "datos": Blob con type application/json:
  - Si es por URL: { titulo, descripcion, urlVideo, activo }
  - Si es por archivo: { titulo, descripcion, activo } (sin urlVideo)
- part "video": opcional; el archivo File cuando el usuario sube desde galería/archivos.

Código de ejemplo para crear:
  const formData = new FormData();
  const datos = { titulo: '...', descripcion: '...', activo: true };
  if (urlVideo) datos.urlVideo = urlVideo;
  formData.append('datos', new Blob([JSON.stringify(datos)], { type: 'application/json' }));
  if (archivoVideo) formData.append('video', archivoVideo);
  this.http.post(apiUrl + '/api/admin/videos', formData);

Validación: o bien se rellena URL, o bien se selecciona un archivo (al menos uno de los dos). El backend acepta hasta 100 MB por archivo de video.
```

---

## PROMPT: Galería con títulos desde el admin (secciones dinámicas)

```
En la página de inicio, la galería ya no debe tener títulos hardcodeados en el código (como "Nuestra historia", "Cultural / Tradicional", "Trajes damas"). Esos títulos y sus fotos deben venir del backend y gestionarse desde el panel admin.

---

1) API pública – secciones de galería

- GET /api/secciones-galeria
  - Devuelve un array de secciones. Cada sección tiene: id, titulo, descripcion, orden, activo, fechaCreacion, fotos (array de fotos con id, titulo, descripcion, urlImagen, activo, etc.).
  - Las secciones vienen ordenadas por el campo "orden". Cada sección incluye solo sus fotos activas.

En la página de inicio (sección Galería):
- Llamar a GET /api/secciones-galeria.
- Por cada sección del array: mostrar el título de la sección (ej. "Cultural / Tradicional", "Trajes damas") y debajo la galería de fotos de esa sección (usar baseUrl + urlImagen para cada foto).
- No hardcodear títulos ni bloques en el HTML/TS; todo debe generarse a partir de la respuesta del API.

---

2) Panel admin – gestión de secciones de galería

Nueva pantalla o ítem de menú: "Secciones de galería" (o "Títulos de galería").

- GET /api/admin/secciones-galeria → listar secciones (titulo, descripcion, orden, activo). Mostrar en tabla o lista.
- POST /api/admin/secciones-galeria → crear sección. Body JSON: { "titulo": "Trajes damas", "descripcion": "Opcional", "orden": 0, "activo": true }. El campo "orden" define el orden de aparición en la web (menor = primero).
- PUT /api/admin/secciones-galeria/{id} → actualizar sección (mismo body).
- DELETE /api/admin/secciones-galeria/{id} → eliminar sección. Las fotos que tenía quedan sin sección (no se borran).

Así el admin puede crear títulos como "Trajes damas", "Cultural / Tradicional", "Nuestra historia", etc., y cambiar orden o desactivarlos sin tocar código.

---

3) Asignar fotos a una sección

Al crear o editar una foto (Gestión de fotos), el formulario debe incluir un selector "Sección de galería" (dropdown) que liste las secciones (GET /api/admin/secciones-galeria). El valor seleccionado se envía como seccionId en el JSON de "datos" al crear/actualizar la foto:

- part "datos": { "titulo": "...", "descripcion": "...", "seccionId": 1, "activo": true }
- part "imagen": archivo

Si no se elige sección, enviar seccionId: null. Las fotos sin sección no aparecerán en la galería por secciones (o se puede mostrar en un bloque "Sin sección" si se desea).
```
