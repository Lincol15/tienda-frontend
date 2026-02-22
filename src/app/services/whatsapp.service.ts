import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import type { CartItem } from './cart.service';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  /**
   * Enlace para comprar un solo producto.
   * @param numero WhatsApp sin + (ej. 51987654321). Si no se pasa, usa environment.
   * @param plantilla Texto con {nombre} y {precio}. Si no se pasa, usa environment.
   */
  getBuyLink(nombre: string, precio: number, numero?: string, plantilla?: string | null): string {
    const template = (plantilla && plantilla.trim()) ? plantilla.trim() : environment.whatsappMessageTemplate;
    const msg = template
      .replace(/\{nombre\}/g, nombre)
      .replace(/\{precio\}/g, String(precio));
    const num = (numero ?? environment.whatsappNumber).replace(/\D/g, '');
    if (!num) return '';
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  }

  /**
   * Mensaje con todo el carrito y total. Si prefijo es la plantilla de un producto (contiene {nombre}),
   * se usa solo la parte anterior como intro; si no, se usa el prefijo tal cual.
   */
  buildCartMessage(items: CartItem[], total: number, prefijo?: string | null): string {
    const lineas = items.map(
      (i) => `- ${i.nombre} x ${i.cantidad}: S/ ${(i.precio * i.cantidad).toFixed(2)}`
    );
    const totalStr = total.toFixed(2);
    let inicio = 'Hola, quiero comprar:\n';
    if (prefijo && prefijo.trim()) {
      const t = prefijo.trim();
      if (t.includes('{nombre}')) {
        const antes = t.split('{nombre}')[0].trim();
        if (antes) inicio = antes + '\n';
      } else {
        inicio = t + '\n';
      }
    }
    return `${inicio}${lineas.join('\n')}\nTotal: S/ ${totalStr}`;
  }

  /**
   * Enlace de WhatsApp con el mensaje del carrito.
   */
  getCartBuyLink(items: CartItem[], total: number, whatsappNumero: string, prefijoMensaje?: string | null): string {
    const num = whatsappNumero.replace(/\D/g, '');
    if (!num) return '';
    const msg = this.buildCartMessage(items, total, prefijoMensaje);
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  }
}
