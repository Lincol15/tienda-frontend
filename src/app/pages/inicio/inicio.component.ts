import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { catchError, of } from 'rxjs';
import { combineLatest, map } from 'rxjs';
import { ApiService } from '../../services/api.service';
import type { Foto, Video, ConfiguracionInicio } from '../../models';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  api = inject(ApiService);
  private sanitizer = inject(DomSanitizer);
  fotos$ = this.api.getFotos();
  /** Secciones de galería (sub-títulos). Si el backend no expone la API, queda [] y se usa fotos$ como fallback. */
  seccionesGaleria$ = this.api.getSeccionesGaleria().pipe(catchError(() => of([])));
  /** Cuando hay secciones: fotos que no pertenecen a ninguna sección, para mostrarlas arriba (ej. Cultural / Tradicional). */
  galeriaConSecciones$ = combineLatest([this.seccionesGaleria$, this.fotos$]).pipe(
    map(([secciones, fotos]) => {
      if (!secciones?.length) return { secciones: [], fotosSinSeccion: [] };
      const idsEnSecciones = new Set(secciones.flatMap(s => (s.fotos ?? []).map(f => f.id)));
      const fotosSinSeccion = fotos.filter(f => !idsEnSecciones.has(f.id));
      return { secciones, fotosSinSeccion };
    })
  );
  videos$ = this.api.getVideos();
  lightboxFoto: Foto | null = null;
  lightboxVideo: Video | null = null;
  menuOpen = false;
  /** Portada y logo desde el admin; si no hay, se usan fallbacks. */
  configInicio = signal<ConfiguracionInicio | null>(null);
  /** Logo del hero: desde API o fallback */
  heroLogoUrl = '/logo1.png';

  ngOnInit(): void {
    this.api.getConfiguracionInicio().subscribe({
      next: (c) => {
        this.configInicio.set(c);
        if (c?.logoUrl) this.heroLogoUrl = this.api.imageUrl(c.logoUrl);
      },
      error: () => this.configInicio.set(null)
    });
  }

  /** URL de la portada: desde API (portadaUrl o bannerUrl) o imagen por defecto */
  portadaUrl(): string {
    const c = this.configInicio();
    const url = c?.portadaUrl ?? c?.bannerUrl;
    return url ? this.api.imageUrl(url) : '/banner.png';
  }

  onHeroLogoError(): void {
    this.heroLogoUrl = '/caporales%20cristo.jpa.jpg';
  }

  imageUrl(path: string): string {
    return this.api.imageUrl(path);
  }

  /** URL completa para enlaces externos (baseUrl + path si es relativa). */
  fullVideoUrl(url: string | null | undefined): string {
    return url?.trim() ? this.api.imageUrl(url) : '';
  }

  openLightbox(foto: Foto): void {
    this.lightboxFoto = foto;
  }

  closeLightbox(): void {
    this.lightboxFoto = null;
  }

  openVideoLightbox(video: Video): void {
    this.lightboxVideo = video;
  }

  closeVideoLightbox(): void {
    this.lightboxVideo = null;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      if (this.lightboxFoto) this.closeLightbox();
      else if (this.lightboxVideo) this.closeVideoLightbox();
      else this.menuOpen = false;
    }
  }

  /** Marca embedUrl como segura para iframe (YouTube). */
  safeEmbedUrl(url: string | null | undefined): SafeResourceUrl {
    if (!url?.trim()) return this.sanitizer.bypassSecurityTrustResourceUrl('');
    return this.sanitizer.bypassSecurityTrustResourceUrl(url.trim());
  }

  /** URL segura para <video>; si es relativa, prefija base del API. */
  safeVideoUrl(url: string | null | undefined): SafeResourceUrl {
    if (!url?.trim()) return this.sanitizer.bypassSecurityTrustResourceUrl('');
    const u = url.trim();
    const fullUrl = u.startsWith('http') ? u : this.api.imageUrl(u);
    return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
  }

  /** Indica si embedUrl es archivo de video directo (.mp4, .webm). */
  isDirectoArchivo(url: string | null | undefined): boolean {
    if (!url?.trim()) return false;
    return /\.(mp4|webm)(\?|$)/i.test(url.trim());
  }

  /** URL de embed de Facebook para iframe. */
  facebookEmbedUrl(url: string | null | undefined): SafeResourceUrl {
    if (!url?.trim()) return this.sanitizer.bypassSecurityTrustResourceUrl('');
    const encoded = encodeURIComponent(url.trim());
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.facebook.com/plugins/video.php?href=${encoded}&width=560&show_text=false&height=315`
    );
  }
}
