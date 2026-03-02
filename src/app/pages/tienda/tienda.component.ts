import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { WhatsappService } from '../../services/whatsapp.service';
import { CartService } from '../../services/cart.service';
import type { Producto, Categoria, MetodoPago } from '../../models';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [RouterLink, AsyncPipe, DecimalPipe],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.scss'
})
export class TiendaComponent implements OnInit {
  api = inject(ApiService);
  whatsapp = inject(WhatsappService);
  cart = inject(CartService);

  productos$ = this.api.getProductos();
  categorias$ = this.api.getCategorias();
  configTienda = signal<{ whatsappNumero: string; mensajePlantilla?: string | null } | null>(null);
  metodosPago = signal<MetodoPago[]>([]);

  categoriaFiltro: number | null = null;
  menuOpen = false;
  cartOpen = false;
  showHeaderLogo = true;
  showHeroLogo = true;

  /** Cantidad a añadir por producto (para el input en cada card). */
  addQty = signal<Record<number, number>>({});

  totalItems = this.cart.totalItems;
  totalAmount = this.cart.totalAmount;
  cartItems = this.cart.cartItems;
  whatsappLink = computed(() => {
    const config = this.configTienda();
    const items = this.cart.cartItems();
    const total = this.cart.totalAmount();
    if (!config?.whatsappNumero || items.length === 0) return null;
    return this.whatsapp.getCartBuyLink(items, total, config.whatsappNumero, config.mensajePlantilla);
  });

  ngOnInit(): void {
    this.api.getConfiguracionTienda().subscribe({
      next: (c) => this.configTienda.set(c),
      error: () => this.configTienda.set(null)
    });
    this.api.getMetodosPago().subscribe({
      next: (list) => this.metodosPago.set(list),
      error: () => this.metodosPago.set([])
    });
    this.productos$.subscribe((productos) => {
      const map = new Map<number, number>();
      productos.forEach((p) => map.set(p.id, p.stock ?? 0));
      this.cart.updateStocks(map);
    });
  }

  hideHeaderLogo(): void {
    this.showHeaderLogo = false;
  }
  hideHeroLogo(): void {
    this.showHeroLogo = false;
  }

  setFiltro(id: number | null): void {
    this.categoriaFiltro = id;
    this.productos$ = this.api.getProductos(id ?? undefined);
  }

  imageUrl(path: string | null | undefined): string {
    return this.api.imageUrl(path);
  }

  stock(p: Producto): number {
    return p.stock ?? 0;
  }

  setAddQty(productoId: number, value: number): void {
    const n = Math.max(0, Math.floor(value));
    this.addQty.update((prev) => ({ ...prev, [productoId]: n }));
  }

  getAddQty(productoId: number): number {
    return this.addQty()[productoId] ?? 1;
  }

  addToCart(p: Producto): void {
    const qty = this.getAddQty(p.id);
    const stock = this.stock(p);
    if (stock <= 0) return;
    const toAdd = Math.min(qty, stock);
    if (toAdd <= 0) return;
    this.cart.addItem(
      {
        productoId: p.id,
        nombre: p.nombre,
        precio: p.precio,
        urlImagen: p.imagenUrl ?? p.urlImagen ?? null,
        stock
      },
      toAdd
    );
    this.cartOpen = true;
  }

  removeFromCart(productoId: number): void {
    this.cart.removeItem(productoId);
  }

  setCartQty(productoId: number, cantidad: number): void {
    this.cart.setCantidad(productoId, cantidad);
  }

  clearCart(): void {
    this.cart.clear();
    this.cartOpen = false;
  }

  /** Enlace para comprar un solo producto (fallback si no hay carrito). */
  comprarLink(p: Producto): string {
    const config = this.configTienda();
    const num = config?.whatsappNumero;
    const plantilla = config?.mensajePlantilla;
    return this.whatsapp.getBuyLink(p.nombre, p.precio, num, plantilla);
  }

}
