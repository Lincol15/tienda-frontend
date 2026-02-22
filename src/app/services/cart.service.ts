import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  urlImagen: string | null;
  stock: number;
}

const STORAGE_KEY = 'corigen_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>(this.loadFromStorage());

  cartItems = this.items.asReadonly();
  totalItems = computed(() => this.items().reduce((s, i) => s + i.cantidad, 0));
  totalAmount = computed(() =>
    this.items().reduce((s, i) => s + i.precio * i.cantidad, 0)
  );

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch {}
    return [];
  }

  private saveToStorage(list: CartItem[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  /** Añade o suma cantidad. Respeta stock máximo. */
  addItem(item: Omit<CartItem, 'cantidad'>, cantidad: number): void {
    const maxQty = Math.max(0, item.stock);
    const toAdd = Math.min(Math.max(1, cantidad), maxQty);
    if (toAdd <= 0) return;

    const list = [...this.items()];
    const idx = list.findIndex((i) => i.productoId === item.productoId);
    if (idx >= 0) {
      const newQty = Math.min(list[idx].cantidad + toAdd, maxQty);
      if (newQty <= 0) {
        list.splice(idx, 1);
      } else {
        list[idx] = { ...list[idx], cantidad: newQty, stock: item.stock };
      }
    } else {
      list.push({ ...item, cantidad: toAdd });
    }
    this.items.set(list);
    this.saveToStorage(list);
  }

  removeItem(productoId: number): void {
    const list = this.items().filter((i) => i.productoId !== productoId);
    this.items.set(list);
    this.saveToStorage(list);
  }

  setCantidad(productoId: number, cantidad: number): void {
    const list = this.items().map((i) => {
      if (i.productoId !== productoId) return i;
      const qty = Math.max(0, Math.min(cantidad, i.stock));
      if (qty === 0) return null;
      return { ...i, cantidad: qty };
    });
    const filtered = list.filter((i): i is CartItem => i !== null);
    this.items.set(filtered);
    this.saveToStorage(filtered);
  }

  clear(): void {
    this.items.set([]);
    this.saveToStorage([]);
  }

  /** Actualiza stock de ítems en carrito (tras recargar productos). */
  updateStocks(stocks: Map<number, number>): void {
    const list = this.items().map((i) => {
      const stock = stocks.get(i.productoId) ?? i.stock;
      const cantidad = Math.min(i.cantidad, Math.max(0, stock));
      if (cantidad <= 0) return null;
      return { ...i, stock, cantidad };
    });
    const filtered = list.filter((i): i is CartItem => i !== null);
    this.items.set(filtered);
    this.saveToStorage(filtered);
  }
}
