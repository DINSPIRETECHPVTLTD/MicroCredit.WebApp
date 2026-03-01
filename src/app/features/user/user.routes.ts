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
      import('./pages/add-edit-user/add-edit-user.page').then((m) => m.AddEditUserPage),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/add-edit-user/add-edit-user.page').then((m) => m.AddEditUserPage),
  },
];
