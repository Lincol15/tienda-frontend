import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

const DEFAULT_MENSAJE = 'Hola, quiero comprar: {nombre}, Precio: S/ {precio}';

@Component({
  selector: 'app-admin-configuracion-tienda',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-configuracion-tienda.component.html',
  styleUrl: './admin-fotos.component.scss'
})
export class AdminConfiguracionTiendaComponent implements OnInit {
  api = inject(ApiService);
  whatsappNumero = '';
  mensajePlantilla = '';
  loading = signal(false);
  saving = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.loading.set(true);
    this.api.getConfiguracionTienda().subscribe({
      next: (c) => {
        this.whatsappNumero = c.whatsappNumero ?? '';
        this.mensajePlantilla = c.mensajePlantilla ?? DEFAULT_MENSAJE;
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudo cargar la configuración.');
      }
    });
  }

  clearNumber(): void {
    this.whatsappNumero = '';
    this.error.set('');
  }

  submit(): void {
    this.error.set('');
    const num = this.whatsappNumero.trim().replace(/\D/g, '');
    const mensaje = this.mensajePlantilla.trim() || null;
    this.saving.set(true);
    this.api.putConfiguracionTienda({
      whatsappNumero: num,
      mensajePlantilla: mensaje || undefined
    }).subscribe({
      next: () => {
        this.saving.set(false);
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Error al guardar.');
      }
    });
  }
}
