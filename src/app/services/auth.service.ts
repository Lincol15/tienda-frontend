import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import type { AuthLoginRequest, AuthResponse } from '../models';

const TOKEN_KEY = 'cristos_caporales_token';
const USER_KEY = 'cristos_caporales_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenSignal = signal<string | null>(this.getStoredToken());
  private userSignal = signal<{ username: string; rol: string } | null>(this.getStoredUser());

  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.tokenSignal());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private getStoredUser(): { username: string; rol: string } | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  login(body: AuthLoginRequest): Observable<AuthResponse | null> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, body).pipe(
      tap((res) => {
        this.tokenSignal.set(res.token);
        this.userSignal.set({ username: res.username, rol: res.rol });
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify({ username: res.username, rol: res.rol }));
      }),
      catchError(() => of(null))
    );
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }
}
