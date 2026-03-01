import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shell/dashboard.shell.component').then((m) => m.DashboardShellComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('../user/user.routes').then((m) => m.userRoutes),
      },
      {
        path: 'org-info',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.page').then((m) => m.PlaceholderPage),
        data: { title: 'Org Info' },
      },
      {
        path: 'branches',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.page').then((m) => m.PlaceholderPage),
        data: { title: 'Branches' },
      },
      {
        path: 'master/data',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.page').then((m) => m.PlaceholderPage),
        data: { title: 'Master Data' },
      },
      {
        path: 'master/payment-terms',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.page').then((m) => m.PlaceholderPage),
        data: { title: 'Payment Terms' },
      },
      {
        path: 'funds/investments',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.page').then((m) => m.PlaceholderPage),
        data: { title: 'Investments' },
      },
      {
        path: 'funds/ledger-balances',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.page').then((m) => m.PlaceholderPage),
        data: { title: 'Ledger Balances' },
      },
      {
        path: 'centers',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.page').then((m) => m.PlaceholderPage),
        data: { title: 'Centers' },
      },
      {
        path: 'pocs',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.page').then((m) => m.PlaceholderPage),
        data: { title: 'POCs' },
      },
      {
        path: 'staff',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.page').then((m) => m.PlaceholderPage),
        data: { title: 'Staff' },
      },
      {
        path: 'members',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.page').then((m) => m.PlaceholderPage),
        data: { title: 'Members' },
      },
      {
        path: 'loans/add',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.page').then((m) => m.PlaceholderPage),
        data: { title: 'Add Loan' },
      },
      {
        path: 'loans/manage',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.page').then((m) => m.PlaceholderPage),
        data: { title: 'Manage Loan' },
      },
      {
        path: 'recovery-posting',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.page').then((m) => m.PlaceholderPage),
        data: { title: 'Recovery Posting' },
      },
    ],
  },
];
