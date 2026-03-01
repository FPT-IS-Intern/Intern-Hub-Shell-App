import { Routes } from '@angular/router';
import { safeLoadRemoteRoutes } from './utils/safe-load-remote';
import { errorRoutes } from './guards/error.routes';
import { ShellLayoutComponent } from './layouts/main-layout/shell-layout.component';
import { Error404LayoutComponent } from './layouts/error-404/error-404.component';
import { authGuard, createAuthGuard, createNoAuthGuard } from '@goat-bravos/shared-lib-client';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: safeLoadRemoteRoutes('auth'),
    canActivate: [createNoAuthGuard('/homePage')],
  },
  {
    path: '',
    component: ShellLayoutComponent,
    canActivate: [createAuthGuard('/auth')],
    children: [
      {
        path: 'homePage',
        loadChildren: safeLoadRemoteRoutes('homePage'),
      },
      {
        path: 'lms',
        loadChildren: safeLoadRemoteRoutes('lms'),
      },
      {
        path: 'hrm',
        loadChildren: safeLoadRemoteRoutes('hrm'),
      },
      {
        path: 'error',
        children: errorRoutes,
      },
      {
        path: '**',
        component: Error404LayoutComponent,
      },
    ],
  },
];
