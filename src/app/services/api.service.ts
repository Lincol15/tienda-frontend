import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Foto, Video, Producto, Categoria, FotoDatos, VideoDatos, ProductoDatos, CategoriaDatos, SeccionGaleria, SeccionGaleriaDatos, ConfiguracionInicio, ConfiguracionTienda, MetodoPago, MetodoPagoDatos, PedidoRequest, Venta } from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Construye la URL completa para imágenes del backend (ej. /uploads/fotos/abc.png).
   * Usar siempre en [src] de <img> para galería y productos.
   */
  imageUrl(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${this.apiUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  // —— Públicos ——
  getFotos(): Observable<Foto[]> {
    return this.http.get<Foto[]>(`${this.apiUrl}/api/fotos`);
  }

  getFoto(id: number): Observable<Foto> {
    return this.http.get<Foto>(`${this.apiUrl}/api/fotos/${id}`);
  }

  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.apiUrl}/api/videos`);
  }

  getVideo(id: number): Observable<Video> {
    return this.http.get<Video>(`${this.apiUrl}/api/videos/${id}`);
  }

  getProductos(categoriaId?: number): Observable<Producto[]> {
    let params = new HttpParams();
    if (categoriaId != null) params = params.set('categoriaId', categoriaId);
    return this.http.get<Producto[]>(`${this.apiUrl}/api/productos`, { params });
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/api/productos/${id}`);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/api/categorias`);
  }

  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/api/categorias/${id}`);
  }

  /** Secciones de galería (sub-títulos) con sus fotos. Ordenadas por "orden". */
  getSeccionesGaleria(): Observable<SeccionGaleria[]> {
    return this.http.get<SeccionGaleria[]>(`${this.apiUrl}/api/secciones-galeria`);
  }

  /** Configuración de inicio: portada (banner) y logo. Público para mostrar en la página principal. */
  getConfiguracionInicio(): Observable<ConfiguracionInicio> {
    return this.http.get<ConfiguracionInicio>(`${this.apiUrl}/api/configuracion-inicio`);
  }

  /** Configuración de la tienda (número WhatsApp). Público para que la tienda construya el enlace. */
  getConfiguracionTienda(): Observable<ConfiguracionTienda> {
    return this.http.get<ConfiguracionTienda>(`${this.apiUrl}/api/configuracion-tienda`);
  }

  /** Métodos de pago activos para la tienda. */
  getMetodosPago(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(`${this.apiUrl}/api/metodos-pago`);
  }

  /** Registrar pedido (público). Descuenta stock; si no hay stock suficiente devuelve error. */
  postPedidos(body: PedidoRequest): Observable<Venta> {
    return this.http.post<Venta>(`${this.apiUrl}/api/pedidos`, body);
  }

  // —— Admin: Fotos ——
  adminGetFotos(): Observable<Foto[]> {
    return this.http.get<Foto[]>(`${this.apiUrl}/api/admin/fotos`);
  }

  adminCreateFoto(datos: FotoDatos, imagen: File): Observable<Foto> {
    const form = new FormData();
    const datosPayload: Record<string, unknown> = {
      titulo: datos.titulo,
      descripcion: datos.descripcion ?? '',
      activo: datos.activo ?? true
    };
    if (datos.seccionId != null) datosPayload['seccionId'] = datos.seccionId;
    form.append('datos', new Blob([JSON.stringify(datosPayload)], { type: 'application/json' }), 'datos.json');
    form.append('imagen', imagen);
    return this.http.post<Foto>(`${this.apiUrl}/api/admin/fotos`, form);
  }

  adminUpdateFoto(id: number, datos: FotoDatos, imagen?: File): Observable<Foto> {
    const form = new FormData();
    const datosPayload: Record<string, unknown> = {
      titulo: datos.titulo,
      descripcion: datos.descripcion ?? '',
      activo: datos.activo ?? true
    };
    if (datos.seccionId != null) datosPayload['seccionId'] = datos.seccionId;
    form.append('datos', new Blob([JSON.stringify(datosPayload)], { type: 'application/json' }), 'datos.json');
    if (imagen) form.append('imagen', imagen);
    return this.http.put<Foto>(`${this.apiUrl}/api/admin/fotos/${id}`, form);
  }

  adminDeleteFoto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/admin/fotos/${id}`);
  }

  // —— Admin: Secciones de galería ——
  adminGetSeccionesGaleria(): Observable<SeccionGaleria[]> {
    return this.http.get<SeccionGaleria[]>(`${this.apiUrl}/api/admin/secciones-galeria`);
  }

  adminCreateSeccionGaleria(datos: SeccionGaleriaDatos): Observable<SeccionGaleria> {
    return this.http.post<SeccionGaleria>(`${this.apiUrl}/api/admin/secciones-galeria`, datos);
  }

  adminUpdateSeccionGaleria(id: number, datos: SeccionGaleriaDatos): Observable<SeccionGaleria> {
    return this.http.put<SeccionGaleria>(`${this.apiUrl}/api/admin/secciones-galeria/${id}`, datos);
  }

  adminDeleteSeccionGaleria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/admin/secciones-galeria/${id}`);
  }

  // —— Admin: Videos ——
  adminGetVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.apiUrl}/api/admin/videos`);
  }

  adminCreateVideo(datos: VideoDatos, archivoVideo?: File): Observable<Video> {
    const form = new FormData();
    const payload: Record<string, unknown> = {
      titulo: datos.titulo,
      descripcion: datos.descripcion ?? '',
      activo: datos.activo ?? true
    };
    const url = datos['urlVideo'];
    if (url && typeof url === 'string' && url.trim()) payload['urlVideo'] = url.trim();
    form.append('datos', new Blob([JSON.stringify(payload)], { type: 'application/json' }), 'datos.json');
    if (archivoVideo) form.append('video', archivoVideo);
    return this.http.post<Video>(`${this.apiUrl}/api/admin/videos`, form);
  }

  adminUpdateVideo(id: number, datos: VideoDatos, archivoVideo?: File): Observable<Video> {
    const form = new FormData();
    const payload: Record<string, unknown> = {
      titulo: datos.titulo,
      descripcion: datos.descripcion ?? '',
      activo: datos.activo ?? true
    };
    const url = datos['urlVideo'];
    if (url && typeof url === 'string' && url.trim()) payload['urlVideo'] = url.trim();
    form.append('datos', new Blob([JSON.stringify(payload)], { type: 'application/json' }), 'datos.json');
    if (archivoVideo) form.append('video', archivoVideo);
    return this.http.put<Video>(`${this.apiUrl}/api/admin/videos/${id}`, form);
  }

  adminDeleteVideo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/admin/videos/${id}`);
  }

  // —— Admin: Categorías ——
  adminGetCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/api/admin/categorias`);
  }

  adminCreateCategoria(datos: CategoriaDatos): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}/api/admin/categorias`, datos);
  }

  adminUpdateCategoria(id: number, datos: CategoriaDatos): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/api/admin/categorias/${id}`, datos);
  }

  adminDeleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/admin/categorias/${id}`);
  }

  // —— Admin: Productos ——
  adminGetProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/api/admin/productos`);
  }

  adminCreateProducto(datos: ProductoDatos, imagen?: File): Observable<Producto> {
    const form = new FormData();
    const datosPayload = {
      nombre: datos.nombre,
      descripcion: datos.descripcion ?? '',
      precio: Number(datos.precio),
      categoriaId: Number(datos.categoriaId),
      stock: Number(datos.stock ?? 0),
      activo: datos.activo ?? true
    };
    form.append('datos', new Blob([JSON.stringify(datosPayload)], { type: 'application/json' }));
    if (imagen) form.append('imagen', imagen);
    return this.http.post<Producto>(`${this.apiUrl}/api/admin/productos`, form);
  }

  adminUpdateProducto(id: number, datos: ProductoDatos, imagen?: File): Observable<Producto> {
    const form = new FormData();
    const datosPayload = {
      nombre: datos.nombre,
      descripcion: datos.descripcion ?? '',
      precio: Number(datos.precio),
      categoriaId: Number(datos.categoriaId),
      stock: Number(datos.stock ?? 0),
      activo: datos.activo ?? true
    };
    form.append('datos', new Blob([JSON.stringify(datosPayload)], { type: 'application/json' }));
    if (imagen) form.append('imagen', imagen);
    return this.http.put<Producto>(`${this.apiUrl}/api/admin/productos/${id}`, form);
  }

  adminDeleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/admin/productos/${id}`);
  }

  // —— Admin: Configuración inicio (portada y logo) ——
  putConfiguracionInicio(portada?: File, logo?: File): Observable<ConfiguracionInicio> {
    const form = new FormData();
    if (portada) form.append('portada', portada);
    if (logo) form.append('logo', logo);
    return this.http.put<ConfiguracionInicio>(`${this.apiUrl}/api/admin/configuracion-inicio`, form);
  }

  // —— Admin: Configuración tienda ——
  putConfiguracionTienda(datos: { whatsappNumero: string; mensajePlantilla?: string | null }): Observable<ConfiguracionTienda> {
    return this.http.put<ConfiguracionTienda>(`${this.apiUrl}/api/admin/configuracion-tienda`, datos);
  }

  // —— Admin: Métodos de pago ——
  adminGetMetodosPago(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(`${this.apiUrl}/api/admin/metodos-pago`);
  }

  adminCreateMetodoPago(datos: MetodoPagoDatos): Observable<MetodoPago> {
    const payload = {
      nombre: datos.nombre,
      tipo: datos.tipo,
      valor: datos.valor,
      imagenUrl: datos.imagenUrl ?? null,
      activo: datos.activo ?? true,
      orden: Number(datos.orden ?? 0)
    };
    return this.http.post<MetodoPago>(`${this.apiUrl}/api/admin/metodos-pago`, payload);
  }

  adminUpdateMetodoPago(id: number, datos: MetodoPagoDatos): Observable<MetodoPago> {
    const payload = {
      nombre: datos.nombre,
      tipo: datos.tipo,
      valor: datos.valor,
      imagenUrl: datos.imagenUrl ?? null,
      activo: datos.activo ?? true,
      orden: Number(datos.orden ?? 0)
    };
    return this.http.put<MetodoPago>(`${this.apiUrl}/api/admin/metodos-pago/${id}`, payload);
  }

  adminDeleteMetodoPago(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/admin/metodos-pago/${id}`);
  }

  // —— Admin: Ventas / Pedidos ——
  adminGetVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}/api/admin/ventas`);
  }

  adminGetVenta(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.apiUrl}/api/admin/ventas/${id}`);
  }

  adminCreateVenta(body: PedidoRequest): Observable<Venta> {
    return this.http.post<Venta>(`${this.apiUrl}/api/admin/ventas`, body);
  }

  adminPatchVentaEstado(id: number, estado: string): Observable<Venta> {
    return this.http.patch<Venta>(`${this.apiUrl}/api/admin/ventas/${id}/estado`, { estado });
  }
}
