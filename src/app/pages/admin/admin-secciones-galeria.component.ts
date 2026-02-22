import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import type { SeccionGaleria, SeccionGaleriaDatos } from '../../models';

@Component({
  selector: 'app-admin-secciones-galeria',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './admin-secciones-galeria.component.html',
  styleUrl: './admin-fotos.component.scss'
})
export class AdminSeccionesGaleriaComponent {
  api = inject(ApiService);
  secciones$ = this.api.adminGetSeccionesGaleria();
  formMode: 'create' | { id: number } | null = null;
  form: SeccionGaleriaDatos = { titulo: '', descripcion: null, orden: 0, activo: true };
  loading = false;
  error = '';

  add(): void {
    this.formMode = 'create';
    this.form = { titulo: '', descripcion: null, orden: 0, activo: true };
    this.error = '';
  }

  edit(sec: SeccionGaleria): void {
    this.formMode = { id: sec.id };
    this.form = {
      titulo: sec.titulo,
      descripcion: sec.descripcion ?? null,
      orden: sec.orden ?? 0,
      activo: sec.activo ?? true
    };
    this.error = '';
  }

  cancel(): void {
    this.formMode = null;
    this.error = '';
  }

  submit(): void {
    this.error = '';
    if (!this.form.titulo.trim()) {
      this.error = 'El título es obligatorio.';
      return;
    }
    this.loading = true;
    if (this.formMode === 'create') {
      this.api.adminCreateSeccionGaleria(this.form).subscribe({
        next: () => {
          this.loading = false;
          this.cancel();
          this.secciones$ = this.api.adminGetSeccionesGaleria();
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al crear la sección.';
        }
      });
    } else if (this.formMode && 'id' in this.formMode) {
      this.api.adminUpdateSeccionGaleria(this.formMode.id, this.form).subscribe({
        next: () => {
          this.loading = false;
          this.cancel();
          this.secciones$ = this.api.adminGetSeccionesGaleria();
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al actualizar la sección.';
        }
      });
    }
  }

  delete(sec: SeccionGaleria): void {
    if (!confirm(`¿Eliminar la sección "${sec.titulo}"? Las fotos quedarán sin sección.`)) return;
    this.api.adminDeleteSeccionGaleria(sec.id).subscribe({
      next: () => (this.secciones$ = this.api.adminGetSeccionesGaleria()),
      error: () => alert('Error al eliminar.')
    });
  }
}
