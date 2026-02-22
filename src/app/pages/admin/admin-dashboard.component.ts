import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>Panel de administración</h1>
        <p class="lead">Gestiona fotos, videos, categorías y productos desde el menú lateral.</p>
      </header>
      <div class="cards">
        <a routerLink="/admin/fotos" class="card">
          <span class="card-icon">📷</span>
          <span class="card-title">Fotos</span>
          <span class="card-desc">Galería de imágenes</span>
        </a>
        <a routerLink="/admin/videos" class="card">
          <span class="card-icon">🎬</span>
          <span class="card-title">Videos</span>
          <span class="card-desc">Contenido multimedia</span>
        </a>
        <a routerLink="/admin/categorias" class="card">
          <span class="card-icon">📁</span>
          <span class="card-title">Categorías</span>
          <span class="card-desc">Organización de productos</span>
        </a>
        <a routerLink="/admin/productos" class="card">
          <span class="card-icon">🛍️</span>
          <span class="card-title">Productos</span>
          <span class="card-desc">Catálogo C'Origen</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      background: #fff;
      padding: 2.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0, 0, 0, 0.06);
      max-width: 900px;
    }
    .dashboard-header {
      margin-bottom: 2rem;
    }
    .dashboard h1 {
      margin: 0 0 0.5rem;
      font-family: var(--font-display);
      font-size: 1.75rem;
      font-weight: 700;
      color: #1f2937;
      letter-spacing: -0.02em;
    }
    .lead {
      margin: 0;
      color: var(--text-muted);
      font-size: 1rem;
      line-height: 1.5;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.25rem;
    }
    .card {
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      background: #f9fafb;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      text-decoration: none;
      color: inherit;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
      border-color: #6b7280;
      background: #fff;
    }
    .card-icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
      line-height: 1;
    }
    .card-title {
      font-weight: 600;
      font-size: 1.0625rem;
      color: #1f2937;
    }
    .card-desc {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
      line-height: 1.4;
    }
  `]
})
export class AdminDashboardComponent {}
