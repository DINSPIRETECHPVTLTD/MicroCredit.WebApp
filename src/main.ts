import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, inject } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { AuthService } from './app/features/auth/services/auth.service';
import { AUTH_INTERCEPTOR_PROVIDER } from './app/core/interceptors/auth.interceptor';

/** Load auth session from secure storage before app starts so guards work. */
function hydrateAuthSession(): () => Promise<void> {
  const auth = inject(AuthService);
  return () => auth.hydrate();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: APP_INITIALIZER, useFactory: hydrateAuthSession, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptorsFromDi()),
    AUTH_INTERCEPTOR_PROVIDER,
  ],
});
