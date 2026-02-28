import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { authRoutes } from './features/auth/auth.routes';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: authRoutes,
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
