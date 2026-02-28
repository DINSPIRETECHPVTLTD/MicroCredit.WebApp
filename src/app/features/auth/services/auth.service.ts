import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthRequest } from '../models/auth-request.model';
import { AuthResponse } from '../models/auth-response.model';

const AUTH_STORAGE_KEY = 'auth_session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}auth/login`, request);
  }

  setSession(response: AuthResponse): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response));
  }

  getToken(): string | null {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw) as AuthResponse;
      return session?.token ?? null;
    } catch {
      return null;
    }
  }

  clearSession(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  getSession(): AuthResponse | null {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthResponse;
    } catch {
      return null;
    }
  }

  getDisplayName(): string {
    const session = this.getSession();
    if (!session) return 'User';
    if (session.firstName || session.lastName) {
      return [session.firstName, session.lastName].filter(Boolean).join(' ').trim();
    }
    return session.email ?? 'User';
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return this.isTokenValid(token);
  }

  private isTokenValid(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      const payload = JSON.parse(atob(parts[1])) as { exp?: number };
      if (payload.exp == null) return true;
      const nowSec = Math.floor(Date.now() / 1000);
      return payload.exp > nowSec;
    } catch {
      return false;
    }
  }
}
