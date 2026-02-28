import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap, shareReplay, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from '../../features/auth/services/auth.service';
import { AuthResponse } from '../../features/auth/models/auth-response.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /** Single in-flight refresh so concurrent 401s share one refresh call. */
  private refreshInFlight: Observable<AuthResponse | null> | null = null;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authReq = this.addAuthHeader(req);

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // 401: try refresh then retry; logout only if refresh fails
        if (error.status === 401) {
          return this.handle401(error, authReq, next);
        }
        this.logHttpError(error, authReq);
        if (error.status === 403) {
          console.warn('Access forbidden:', authReq.url);
        }
        if (error.status >= 500) {
          console.error('Server error occurred.');
        }
        return throwError(() => error);
      })
    );
  }

  // ===============================
  // Attach JWT Token
  // ===============================

  private addAuthHeader(req: HttpRequest<unknown>): HttpRequest<unknown> {
    const token = this.auth.getToken();
    if (!token || this.isAuthSkipped(req.url)) {
      return req;
    }
    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  private isAuthSkipped(url: string): boolean {
    return (
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/refresh')
    );
  }

  private isRefreshRequest(req: HttpRequest<unknown>): boolean {
    return req.url.includes('/auth/refresh');
  }

  // ===============================
  // 401 → Refresh then retry (or logout if refresh fails)
  // ===============================

  private handle401(
    error: HttpErrorResponse,
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Refresh endpoint failed → do not try refresh again, logout
    if (this.isRefreshRequest(req)) {
      this.handleUnauthorized();
      return throwError(() => error);
    }

    return this.getOrStartRefresh().pipe(
      switchMap((session) => {
        if (!session) {
          this.handleUnauthorized();
          return throwError(() => error);
        }
        // Retry original request with new token
        return next.handle(this.addAuthHeader(req));
      })
    );
  }

  /** One shared refresh in flight; concurrent 401s wait for the same result. */
  private getOrStartRefresh(): Observable<AuthResponse | null> {
    if (!this.refreshInFlight) {
      this.refreshInFlight = this.auth.refresh().pipe(
        catchError(() => of(null)),
        shareReplay({ bufferSize: 1, refCount: true }),
        finalize(() => {
          this.refreshInFlight = null;
        })
      );
    }
    return this.refreshInFlight;
  }

  // ===============================
  // Logging & logout
  // ===============================

  private logHttpError(
    error: HttpErrorResponse,
    req: HttpRequest<unknown>
  ): void {
    console.error('HTTP Error:', {
      url: req.url,
      method: req.method,
      status: error.status,
      message: error.message,
      response: error.error,
    });
  }

  private handleUnauthorized(): void {
    this.auth.logout();
    if (!this.router.url.includes('/auth/login')) {
      this.router.navigate(['/auth/login']);
    }
  }
}

export const AUTH_INTERCEPTOR_PROVIDER = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
