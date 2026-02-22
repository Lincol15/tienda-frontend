import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import type { Video, VideoDatos } from '../../models';

@Component({
  selector: 'app-admin-videos',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './admin-videos.component.html',
  styleUrl: './admin-fotos.component.scss'
})
export class AdminVideosComponent {
  api = inject(ApiService);
  videos$ = this.api.adminGetVideos();
  formMode: 'create' | { id: number } | null = null;
  form: VideoDatos = { titulo: '', descripcion: null, urlVideo: null, activo: true };
  videoFile: File | null = null;
  loading = false;
  error = '';

  add(): void {
    this.formMode = 'create';
    this.form = { titulo: '', descripcion: null, urlVideo: null, activo: true };
    this.videoFile = null;
    this.error = '';
  }

  edit(video: Video): void {
    this.formMode = { id: video.id };
    this.form = {
      titulo: video.titulo,
      descripcion: video.descripcion ?? null,
      urlVideo: video.urlVideo ?? null,
      activo: video.activo
    };
    this.videoFile = null;
    this.error = '';
  }

  cancel(): void {
    this.formMode = null;
    this.videoFile = null;
    this.error = '';
  }

  onFileChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.videoFile = input.files?.[0] ?? null;
  }

  submit(): void {
    this.error = '';
    if (!this.form.titulo.trim()) {
      this.error = 'El título es obligatorio.';
      return;
    }
    const hasUrl = !!this.form.urlVideo?.trim();
    const hasFile = !!this.videoFile;
    if (!hasUrl && !hasFile) {
      this.error = 'Debes indicar una URL del video o seleccionar un archivo para subir.';
      return;
    }
    this.loading = true;
    if (this.formMode === 'create') {
      this.api.adminCreateVideo(this.form, this.videoFile ?? undefined).subscribe({
        next: () => {
          this.loading = false;
          this.cancel();
          this.videos$ = this.api.adminGetVideos();
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al crear el video.';
        }
      });
    } else if (this.formMode && 'id' in this.formMode) {
      this.api.adminUpdateVideo(this.formMode.id, this.form, this.videoFile ?? undefined).subscribe({
        next: () => {
          this.loading = false;
          this.cancel();
          this.videos$ = this.api.adminGetVideos();
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al actualizar el video.';
        }
      });
    }
  }

  delete(video: Video): void {
    if (!confirm(`¿Eliminar el video "${video.titulo}"?`)) return;
    this.api.adminDeleteVideo(video.id).subscribe({
      next: () => (this.videos$ = this.api.adminGetVideos()),
      error: () => alert('Error al eliminar.')
    });
  }
}
