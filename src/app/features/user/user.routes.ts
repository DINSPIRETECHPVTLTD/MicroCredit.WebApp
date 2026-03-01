import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/list/user-list.page').then((m) => m.UserListPage),
  },
];
