import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import type { Categoria, CategoriaDatos } from '../../models';

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './admin-categorias.component.html',
  styleUrl: './admin-fotos.component.scss'
})
export class AdminCategoriasComponent {
  api = inject(ApiService);
  categorias$ = this.api.adminGetCategorias();
  formMode: 'create' | { id: number } | null = null;
  form: CategoriaDatos = { nombre: '', descripcion: null };
  loading = false;
  error = '';

  add(): void {
    this.formMode = 'create';
    this.form = { nombre: '', descripcion: null };
    this.error = '';
  }

  edit(cat: Categoria): void {
    this.formMode = { id: cat.id };
    this.form = { nombre: cat.nombre, descripcion: cat.descripcion ?? null };
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
    this.loading = true;
    if (this.formMode === 'create') {
      this.api.adminCreateCategoria(this.form).subscribe({
        next: () => {
          this.loading = false;
          this.cancel();
          this.categorias$ = this.api.adminGetCategorias();
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al crear la categoría.';
        }
      });
    } else if (this.formMode && 'id' in this.formMode) {
      this.api.adminUpdateCategoria(this.formMode.id, this.form).subscribe({
        next: () => {
          this.loading = false;
          this.cancel();
          this.categorias$ = this.api.adminGetCategorias();
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al actualizar la categoría.';
        }
      });
    }
  }

  delete(cat: Categoria): void {
    if (!confirm(`¿Eliminar la categoría "${cat.nombre}"?`)) return;
    this.api.adminDeleteCategoria(cat.id).subscribe({
      next: () => (this.categorias$ = this.api.adminGetCategorias()),
      error: () => alert('Error al eliminar.')
    });
  }
}
