import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/inicio/inicio.component').then(m => m.InicioComponent) },
  { path: 'corigen', loadComponent: () => import('./pages/tienda/tienda.component').then(m => m.TiendaComponent) },
  { path: 'admin/login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'fotos', loadComponent: () => import('./pages/admin/admin-fotos.component').then(m => m.AdminFotosComponent) },
      { path: 'portada-logo', loadComponent: () => import('./pages/admin/admin-portada-logo.component').then(m => m.AdminPortadaLogoComponent) },
      { path: 'secciones-galeria', loadComponent: () => import('./pages/admin/admin-secciones-galeria.component').then(m => m.AdminSeccionesGaleriaComponent) },
      { path: 'videos', loadComponent: () => import('./pages/admin/admin-videos.component').then(m => m.AdminVideosComponent) },
      { path: 'categorias', loadComponent: () => import('./pages/admin/admin-categorias.component').then(m => m.AdminCategoriasComponent) },
      { path: 'productos', loadComponent: () => import('./pages/admin/admin-productos.component').then(m => m.AdminProductosComponent) },
      { path: 'configuracion-tienda', loadComponent: () => import('./pages/admin/admin-configuracion-tienda.component').then(m => m.AdminConfiguracionTiendaComponent) },
      { path: 'metodos-pago', loadComponent: () => import('./pages/admin/admin-metodos-pago.component').then(m => m.AdminMetodosPagoComponent) },
      { path: 'ventas', loadComponent: () => import('./pages/admin/admin-ventas.component').then(m => m.AdminVentasComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
