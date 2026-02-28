import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../../../environments/environment';
import { AuthRequest } from '../models/auth-request.model';
import { AuthResponse } from '../models/auth-response.model';
import { OrgResponse } from '../models/org-response.model';

const AUTH_STORAGE_KEY = 'auth_session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  /** In-memory cache so getSession() stays sync for guards/components. Hydrated at app init. */
  private sessionCache: AuthResponse | null = null;

  constructor(private readonly http: HttpClient) {}

  // ==============================
  // API CALLS
  // ==============================

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}auth/login`, request)
      .pipe(tap((response) => this.setSession(response)));
  }

  logout(): void {
    this.clearSession();
  }

  // ==============================
  // SESSION MANAGEMENT (secure storage via @capacitor/preferences)
  // ==============================

  /**
   * Load session from secure storage into cache. Call from APP_INITIALIZER so
   * getSession() is ready before routing.
   */
  async hydrate(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: AUTH_STORAGE_KEY });
      this.sessionCache = value ? (JSON.parse(value) as AuthResponse) : null;
    } catch {
      this.sessionCache = null;
    }
  }

  private setSession(response: AuthResponse): void {
    this.sessionCache = response;
    const value = JSON.stringify(response);
    Preferences.set({ key: AUTH_STORAGE_KEY, value }).catch(() => {
      this.sessionCache = null;
    });
  }

  clearSession(): void {
    this.sessionCache = null;
    Preferences.remove({ key: AUTH_STORAGE_KEY }).catch(() => {});
  }

  getSession(): AuthResponse | null {
    return this.sessionCache;
  }

  // ==============================
  // TOKEN METHODS
  // ==============================

  getToken(): string | null {
    return this.getSession()?.token ?? null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return this.isTokenValid(token);
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload?.exp) return true;

      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  private decodeToken(token: string): any | null {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Handle Base64URL
    const base64 = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const padded =
      base64 + '='.repeat((4 - (base64.length % 4)) % 4);

    return JSON.parse(atob(padded));
  }

  // ==============================
  // USER HELPERS
  // ==============================

  getOrganization(): OrgResponse | null {
    return this.getSession()?.organization ?? null;
  }

  getDisplayName(): string {
    const session = this.getSession();
    if (!session) return 'User';

    if (session.firstName || session.lastName) {
      return [session.firstName, session.lastName]
        .filter(Boolean)
        .join(' ')
        .trim();
    }

    return session.email ?? 'User';
  }
}