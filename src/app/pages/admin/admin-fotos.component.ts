import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import type { Foto, FotoDatos } from '../../models';

@Component({
  selector: 'app-admin-fotos',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './admin-fotos.component.html',
  styleUrl: './admin-fotos.component.scss'
})
export class AdminFotosComponent {
  api = inject(ApiService);
  fotos$ = this.api.adminGetFotos();
  formMode: 'create' | { id: number } | null = null;
  form: FotoDatos = { titulo: '', descripcion: null, activo: true, seccionId: null };
  imagenFile: File | null = null;
  secciones$ = this.api.adminGetSeccionesGaleria();
  loading = false;
  error = '';

  imageUrl(path: string): string {
    return this.api.imageUrl(path);
  }

  add(): void {
    this.formMode = 'create';
    this.form = { titulo: '', descripcion: null, activo: true, seccionId: null };
    this.imagenFile = null;
    this.error = '';
  }

  edit(foto: Foto): void {
    this.formMode = { id: foto.id };
    this.form = {
      titulo: foto.titulo,
      descripcion: foto.descripcion ?? null,
      activo: foto.activo,
      seccionId: foto.seccionId ?? null
    };
    this.imagenFile = null;
    this.error = '';
  }

  cancel(): void {
    this.formMode = null;
    this.error = '';
  }

  onFileChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.imagenFile = input.files?.[0] ?? null;
  }

  submit(): void {
    this.error = '';
    if (!this.form.titulo.trim()) {
      this.error = 'El título es obligatorio.';
      return;
    }
    if (this.formMode === 'create' && !this.imagenFile) {
      this.error = 'Debes seleccionar una imagen.';
      return;
    }
    this.loading = true;
    if (this.formMode === 'create') {
      this.api.adminCreateFoto(this.form, this.imagenFile!).subscribe({
        next: () => {
          this.loading = false;
          this.cancel();
          this.fotos$ = this.api.adminGetFotos();
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al crear la foto.';
        }
      });
    } else if (this.formMode && 'id' in this.formMode) {
      this.api.adminUpdateFoto(this.formMode.id, this.form, this.imagenFile ?? undefined).subscribe({
        next: () => {
          this.loading = false;
          this.cancel();
          this.fotos$ = this.api.adminGetFotos();
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al actualizar la foto.';
        }
      });
    }
  }

  delete(foto: Foto): void {
    if (!confirm(`¿Eliminar la foto "${foto.titulo}"?`)) return;
    this.api.adminDeleteFoto(foto.id).subscribe({
      next: () => (this.fotos$ = this.api.adminGetFotos()),
      error: () => alert('Error al eliminar.')
    });
  }
}
