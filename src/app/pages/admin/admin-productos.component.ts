import { Component, inject } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import type { Producto, ProductoDatos, Categoria } from '../../models';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, FormsModule],
  templateUrl: './admin-productos.component.html',
  styleUrl: './admin-fotos.component.scss'
})
export class AdminProductosComponent {
  api = inject(ApiService);
  productos$ = this.api.adminGetProductos();
  categorias$ = this.api.adminGetCategorias();
  formMode: 'create' | { id: number } | null = null;
  form: ProductoDatos = { nombre: '', descripcion: null, precio: 0, categoriaId: 0, stock: 0, activo: true };
  imagenFile: File | null = null;
  loading = false;
  error = '';

  imageUrl(path: string | null | undefined): string {
    return this.api.imageUrl(path);
  }

  add(): void {
    this.formMode = 'create';
    this.form = { nombre: '', descripcion: null, precio: 0, categoriaId: 0, stock: 0, activo: true };
    this.imagenFile = null;
    this.error = '';
  }

  edit(p: Producto): void {
    this.formMode = { id: p.id };
    this.form = {
      nombre: p.nombre,
      descripcion: p.descripcion ?? null,
      precio: p.precio,
      categoriaId: p.categoriaId,
      stock: p.stock ?? 0,
      activo: p.activo
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
    if (!this.form.nombre.trim()) {
      this.error = 'El nombre es obligatorio.';
      return;
    }
    if (this.form.categoriaId <= 0) {
      this.error = 'Selecciona una categoría.';
      return;
    }
    if (this.form.precio < 0) {
      this.error = 'El precio no puede ser negativo.';
      return;
    }
    this.loading = true;
    if (this.formMode === 'create') {
      this.api.adminCreateProducto(this.form, this.imagenFile ?? undefined).subscribe({
        next: () => {
          this.loading = false;
          this.cancel();
          this.productos$ = this.api.adminGetProductos();
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al crear el producto.';
        }
      });
    } else if (this.formMode && 'id' in this.formMode) {
      this.api.adminUpdateProducto(this.formMode.id, this.form, this.imagenFile ?? undefined).subscribe({
        next: () => {
          this.loading = false;
          this.cancel();
          this.productos$ = this.api.adminGetProductos();
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al actualizar el producto.';
        }
      });
    }
  }

  delete(p: Producto): void {
    if (!confirm(`¿Eliminar el producto "${p.nombre}"?`)) return;
    this.api.adminDeleteProducto(p.id).subscribe({
      next: () => (this.productos$ = this.api.adminGetProductos()),
      error: () => alert('Error al eliminar.')
    });
  }
}
