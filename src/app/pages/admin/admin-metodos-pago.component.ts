import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import type { MetodoPago, MetodoPagoDatos } from '../../models';

@Component({
  selector: 'app-admin-metodos-pago',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './admin-metodos-pago.component.html',
  styleUrl: './admin-fotos.component.scss'
})
export class AdminMetodosPagoComponent {
  api = inject(ApiService);
  metodos$ = this.api.adminGetMetodosPago();
  formMode: 'create' | { id: number } | null = null;
  form: MetodoPagoDatos = {
    nombre: '',
    tipo: 'YAPE',
    valor: '',
    imagenUrl: null,
    activo: true,
    orden: 0
  };
  loading = false;
  error = '';

  imageUrl(path: string | null | undefined): string {
    return this.api.imageUrl(path);
  }

  add(): void {
    this.formMode = 'create';
    this.form = { nombre: '', tipo: 'YAPE', valor: '', imagenUrl: null, activo: true, orden: 0 };
    this.error = '';
  }

  edit(m: MetodoPago): void {
    this.formMode = { id: m.id };
    this.form = {
      nombre: m.nombre,
      tipo: m.tipo,
      valor: m.valor,
      imagenUrl: m.imagenUrl ?? null,
      activo: m.activo,
      orden: m.orden
    };
    this.error = '';
  }

  cancel(): void {
    this.formMode = null;
    this.error = '';
  }

  submit(): void {
    this.error = '';
    if (!this.form.nombre.trim()) {
      this.error = 'El nombre es obligatorio.';
      return;
    }
    if (!this.form.valor.trim()) {
      this.error = 'El valor (teléfono o instrucciones) es obligatorio.';
      return;
    }
    this.loading = true;
    if (this.formMode === 'create') {
      this.api.adminCreateMetodoPago(this.form).subscribe({
        next: () => {
          this.loading = false;
          this.cancel();
          this.metodos$ = this.api.adminGetMetodosPago();
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al crear.';
        }
      });
    } else if (this.formMode && 'id' in this.formMode) {
      this.api.adminUpdateMetodoPago(this.formMode.id, this.form).subscribe({
        next: () => {
          this.loading = false;
          this.cancel();
          this.metodos$ = this.api.adminGetMetodosPago();
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al actualizar.';
        }
      });
    }
  }

  delete(m: MetodoPago): void {
    if (!confirm(`¿Eliminar el método "${m.nombre}"?`)) return;
    this.api.adminDeleteMetodoPago(m.id).subscribe({
      next: () => (this.metodos$ = this.api.adminGetMetodosPago()),
      error: () => alert('Error al eliminar.')
    });
  }
}
