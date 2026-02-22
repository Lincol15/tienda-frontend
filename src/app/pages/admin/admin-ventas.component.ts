import { Component, inject } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import type { Venta } from '../../models';

const ESTADOS = ['PENDIENTE', 'CONFIRMADA', 'ENTREGADA', 'CANCELADA'] as const;

@Component({
  selector: 'app-admin-ventas',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe],
  templateUrl: './admin-ventas.component.html',
  styleUrl: './admin-fotos.component.scss'
})
export class AdminVentasComponent {
  api = inject(ApiService);
  ventas$ = this.api.adminGetVentas();
  ventaSeleccionada: Venta | null = null;
  loadingEstado = false;
  error = '';

  readonly estados = ESTADOS;

  verDetalle(v: Venta): void {
    if (this.ventaSeleccionada?.id === v.id) {
      this.ventaSeleccionada = null;
      return;
    }
    this.ventaSeleccionada = v;
    this.error = '';
  }

  cerrarDetalle(): void {
    this.ventaSeleccionada = null;
    this.error = '';
  }

  cambiarEstado(id: number, estado: string): void {
    this.loadingEstado = true;
    this.error = '';
    this.api.adminPatchVentaEstado(id, estado).subscribe({
      next: (actualizada) => {
        this.loadingEstado = false;
        if (this.ventaSeleccionada?.id === id) {
          this.ventaSeleccionada = actualizada;
        }
        this.ventas$ = this.api.adminGetVentas();
      },
      error: () => {
        this.loadingEstado = false;
        this.error = 'Error al actualizar el estado.';
      }
    });
  }

  formatoFecha(s?: string): string {
    if (!s) return '—';
    try {
      const d = new Date(s);
      return d.toLocaleDateString('es-PE', { dateStyle: 'short' }) + ' ' + d.toLocaleTimeString('es-PE', { timeStyle: 'short' });
    } catch {
      return s;
    }
  }

  subtotalItem(item: { cantidad: number; precioUnitario: number; subtotal?: number }): number {
    return item.subtotal ?? item.cantidad * item.precioUnitario;
  }
}
