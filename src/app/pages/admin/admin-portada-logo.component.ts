import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import type { ConfiguracionInicio } from '../../models';

@Component({
  selector: 'app-admin-portada-logo',
  standalone: true,
  imports: [],
  templateUrl: './admin-portada-logo.component.html',
  styleUrl: './admin-fotos.component.scss'
})
export class AdminPortadaLogoComponent implements OnInit {
  api = inject(ApiService);
  config = signal<ConfiguracionInicio | null>(null);
  loading = signal(false);
  saving = signal(false);
  error = signal('');
  portadaFile: File | null = null;
  logoFile: File | null = null;

  ngOnInit(): void {
    this.loading.set(true);
    this.api.getConfiguracionInicio().subscribe({
      next: (c) => {
        this.config.set(c);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.config.set({});
      }
    });
  }

  imageUrl(path: string | null | undefined): string {
    return this.api.imageUrl(path);
  }

  onPortadaChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.portadaFile = input.files?.[0] ?? null;
    this.error.set('');
  }

  onLogoChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.logoFile = input.files?.[0] ?? null;
    this.error.set('');
  }

  submit(): void {
    if (!this.portadaFile && !this.logoFile) {
      this.error.set('Selecciona al menos una imagen: portada o logo.');
      return;
    }
    this.error.set('');
    this.saving.set(true);
    this.api.putConfiguracionInicio(this.portadaFile ?? undefined, this.logoFile ?? undefined).subscribe({
      next: (c) => {
        this.config.set(c);
        this.portadaFile = null;
        this.logoFile = null;
        this.saving.set(false);
        const inputs = document.querySelectorAll<HTMLInputElement>('input[type="file"]');
        inputs.forEach((i) => (i.value = ''));
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Error al guardar. Comprueba que el backend tenga el endpoint /api/admin/configuracion-inicio.');
      }
    });
  }
}
