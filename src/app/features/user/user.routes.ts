import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/list/user-list.page').then((m) => m.UserListPage),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./pages/add-edit-user/user-form.page').then((m) => m.UserFormPage),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/add-edit-user/user-form.page').then((m) => m.UserFormPage),
  },
];
