# Endpoint Spring Boot para `/api/caporales`

Pega estos archivos en tu proyecto **tienda-backend** (Spring Boot). Ajusta el paquete (`com.tienda` o el que uses).

---

## 1. Entidad `Caporal`

**Ruta sugerida:** `src/main/java/com/tienda/entity/Caporal.java` (o tu paquete)

```java
package com.tienda.entity;  // cambia por tu paquete

import jakarta.persistence.*;
import java.util.Arrays;

@Entity
@Table(name = "caporales")
public class Caporal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Lob
    @Column(name = "foto")
    private byte[] foto;

    @Lob
    @Column(name = "video")
    private byte[] video;

    // constructors, getters, setters
    public Caporal() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public byte[] getFoto() { return foto; }
    public void setFoto(byte[] foto) { this.foto = foto; }
    public byte[] getVideo() { return video; }
    public void setVideo(byte[] video) { this.video = video; }
}
```

---

## 2. Repositorio

**Ruta sugerida:** `src/main/java/com/tienda/repository/CaporalRepository.java`

```java
package com.tienda.repository;  // cambia por tu paquete

import com.tienda.entity.Caporal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaporalRepository extends JpaRepository<Caporal, Long> {
}
```

---

## 3. Controlador (método completo)

**Ruta sugerida:** `src/main/java/com/tienda/controller/CaporalController.java`  
(o añade este método a un controlador existente y ajusta el paquete/imports).

```java
package com.tienda.controller;  // cambia por tu paquete

import com.tienda.entity.Caporal;
import com.tienda.repository.CaporalRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping
public class CaporalController {

    private final CaporalRepository caporalRepository;

    public CaporalController(CaporalRepository caporalRepository) {
        this.caporalRepository = caporalRepository;
    }

    @PostMapping("/api/caporales")
    public ResponseEntity<String> subirCaporal(
            @RequestParam("titulo") String titulo,
            @RequestParam("descripcion") String descripcion,
            @RequestParam(value = "foto", required = false) MultipartFile foto,
            @RequestParam(value = "video", required = false) MultipartFile video
    ) throws IOException {

        Caporal caporal = new Caporal();
        caporal.setTitulo(titulo != null ? titulo : "");
        caporal.setDescripcion(descripcion != null ? descripcion : "");

        if (foto != null && !foto.isEmpty()) {
            caporal.setFoto(foto.getBytes());
        }
        if (video != null && !video.isEmpty()) {
            caporal.setVideo(video.getBytes());
        }

        caporalRepository.save(caporal);
        return ResponseEntity.ok("Guardado correctamente");
    }
}
```

---

## 4. Tabla en base de datos

Si usas JPA con `ddl-auto=update` o similar, la tabla se puede crear sola. Si creas la tabla a mano (PostgreSQL ejemplo):

```sql
CREATE TABLE caporales (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    foto BYTEA,
    video BYTEA
);
```

---

## 5. Angular (ya lo tienes)

Tu método Angular es correcto y coincide con el endpoint:

```ts
subirCaporal(data: any, foto: File, video: File) {
  const formData = new FormData();
  formData.append('titulo', data.titulo);
  formData.append('descripcion', data.descripcion);
  if (foto) formData.append('foto', foto);
  if (video) formData.append('video', video);
  return this.http.post(`${environment.apiUrl}/api/caporales`, formData);
}
```

---

**Resumen:** Crea la entidad, el repositorio y el controlador en tu backend; ajusta el paquete. No se usa `@RequestBody`, los archivos son opcionales y se guardan como `byte[]`. Respuesta: `ResponseEntity.ok("Guardado correctamente")`.
