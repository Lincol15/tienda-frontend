export interface Foto {
  id: number;
  titulo: string;
  descripcion: string | null;
  urlImagen: string;
  activo: boolean;
  fechaCreacion?: string;
  seccionId?: number | null;
}

/** Sección de galería (sub-título en la página de inicio). Las fotos se asignan a una sección. */
export interface SeccionGaleria {
  id: number;
  titulo: string;
  descripcion: string | null;
  orden: number;
  activo: boolean;
  fechaCreacion?: string;
  fotos?: Foto[];
}

export interface SeccionGaleriaDatos {
  titulo: string;
  descripcion: string | null;
  orden: number;
  activo: boolean;
}

export interface Video {
  id: number;
  titulo: string;
  descripcion: string | null;
  urlVideo: string;
  tipoVideo?: 'YOUTUBE' | 'FACEBOOK' | 'DIRECTO';
  embedUrl?: string | null;
  activo: boolean;
  fechaCreacion?: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock?: number;
  urlImagen: string | null;
  activo: boolean;
  categoriaId: number;
  categoria?: Categoria;
}

export interface AuthLoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  rol: string;
  expiresIn: number;
}

export interface FotoDatos {
  titulo: string;
  descripcion: string | null;
  activo: boolean;
  seccionId?: number | null;
}

export interface VideoDatos {
  titulo: string;
  descripcion: string | null;
  urlVideo?: string | null;  // Obligatorio si se sube por URL; null si se sube por archivo
  activo: boolean;
}

export interface ProductoDatos {
  nombre: string;
  descripcion: string | null;
  precio: number;
  categoriaId: number;
  stock?: number;
  activo: boolean;
}

/** Configuración de la página de inicio: portada (banner) y logo. */
export interface ConfiguracionInicio {
  portadaUrl?: string | null;
  logoUrl?: string | null;
}

/** Configuración de la tienda (número WhatsApp y plantilla de mensaje). */
export interface ConfiguracionTienda {
  id: number;
  whatsappNumero: string;
  /** Plantilla para compra de un producto. Usar {nombre} y {precio}. Opcional. */
  mensajePlantilla?: string | null;
}

/** Método de pago (Yape, Plin, etc.). */
export interface MetodoPago {
  id: number;
  nombre: string;
  tipo: 'YAPE' | 'PLIN' | 'OTRO';
  valor: string;
  imagenUrl: string | null;
  activo: boolean;
  orden: number;
}

export interface MetodoPagoDatos {
  nombre: string;
  tipo: 'YAPE' | 'PLIN' | 'OTRO';
  valor: string;
  imagenUrl?: string | null;
  activo: boolean;
  orden: number;
}

export interface CategoriaDatos {
  nombre: string;
  descripcion: string | null;
}

/** Item para crear/registrar un pedido. */
export interface PedidoItemRequest {
  productoId: number;
  cantidad: number;
  precioUnitario?: number;
}

/** Body para POST /api/pedidos y POST /api/admin/ventas. */
export interface PedidoRequest {
  clienteNombre: string;
  clienteTelefono: string;
  estado?: string;
  metodoPago?: string;
  notas?: string;
  items: PedidoItemRequest[];
}

/** Item de una venta (respuesta del API). */
export interface VentaItem {
  productoId: number;
  productoNombre?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;
}

/** Una venta/pedido (respuesta GET ventas). */
export interface Venta {
  id: number;
  fechaCreacion?: string;
  clienteNombre: string;
  clienteTelefono: string;
  estado: string;
  metodoPago?: string | null;
  notas?: string | null;
  total: number;
  items: VentaItem[];
}
