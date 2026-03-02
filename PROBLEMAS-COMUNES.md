# Problemas comunes: imágenes temporales y "Not Found" en /corigen

---

## 1. ¿Por qué al recargar /corigen (o /admin) sale "Not Found"?

### Qué está pasando

Cuando entras a **https://tienda-frontend-j5ib.onrender.com/corigen** y recargas (F5), el **servidor de Render** (Static Site) recibe la petición a la ruta `/corigen`. Como es un sitio estático, busca un **archivo** llamado `corigen` en la carpeta publicada. Ese archivo no existe (solo existe `index.html` y los JS/CSS), así que responde **404 Not Found**.

En una SPA (Angular), la ruta `/corigen` la maneja el **router de Angular** dentro del navegador; el servidor no sabe nada de esas rutas si no le dices que sirva siempre `index.html`.

### Solución (obligatoria en Render)

Hay que decirle a Render que **todas las rutas** devuelvan `index.html` (rewrite), para que Angular cargue y su router atienda `/corigen`, `/admin`, etc.

**Pasos:**

1. Entra a **https://dashboard.render.com**
2. Abre tu **Static Site** (tienda-frontend)
3. En el menú izquierdo: **Redirects/Rewrites** (o **Settings** y luego la sección Redirects/Rewrites)
4. **Add Rule** / **Add Redirect**
5. Configura:
   - **Type:** **Rewrite** (no Redirect)
   - **Source (Path):** `/*`
   - **Destination:** `/index.html`
6. Guarda

Después de eso, al recargar en **/corigen** o **/admin** el servidor devolverá `index.html` y Angular mostrará la página correcta. Ya no debería salir "Not Found" al recargar.

---

## 2. ¿Por qué las imágenes solo se guardan “temporalmente” y luego desaparecen?

### Qué está pasando

En **Render** (y en muchos hostings en la nube), el **sistema de archivos del backend es efímero**:

- El backend (Spring Boot) guarda las fotos en una carpeta del servidor, por ejemplo: `uploads/fotos/` o `/tmp/uploads/`.
- Esa carpeta **se borra** cuando:
  - Render reinicia el servicio (p. ej. por inactividad o actualización)
  - Haces un nuevo deploy del backend
  - El contenedor se recicla

Por eso las imágenes “se ven un rato” y después dan error o ya no cargan: el archivo dejó de existir en el servidor.

### Solución (en el backend)

El backend **no debe depender del disco local** para guardar imágenes de forma permanente. Tienes dos caminos:

**Opción A – Almacenamiento externo (recomendado)**  
Subir el archivo a un servicio de almacenamiento (S3, Cloudinary, etc.) y guardar en la base de datos solo la **URL** de la imagen. Esa URL sí es persistente.

- Ejemplo: subes a Cloudinary → obtienes `https://res.cloudinary.com/.../foto.jpg` → guardas esa URL en la tabla de fotos/productos.

**Opción B – Guardar la imagen en la base de datos (BLOB)**  
En lugar de guardar en `uploads/`, guardar los bytes de la imagen en una columna BLOB de la base de datos. La base de datos en Render (PostgreSQL) sí es persistente, así que las imágenes no se pierden al reiniciar.

- En el backend: entidad con campo `byte[] foto` (o similar) y un endpoint que devuelva esa imagen (o una ruta que lea desde la BD y sirva el archivo).

**Resumen:**  
- “Solo guarda imágenes temporales” = el backend está guardando en disco local del servidor, que en Render se borra.  
- Para que sean permanentes: **almacenamiento externo (URL en BD)** o **imagen en BD (BLOB)**. Esto se configura y programa **en el backend**, no en el frontend Angular.

---

## Resumen rápido

| Problema | Causa | Dónde se soluciona |
|----------|--------|---------------------|
| **Not Found al recargar /corigen** | El Static Site no sirve `index.html` para rutas como `/corigen` | **Render** → Static Site → Redirects/Rewrites → Rewrite `/*` → `/index.html` |
| **Imágenes que desaparecen** | El backend guarda en disco local; en Render el disco se borra al reiniciar/deploy | **Backend** → usar almacenamiento externo (S3, Cloudinary) o guardar imagen en BD (BLOB) |
