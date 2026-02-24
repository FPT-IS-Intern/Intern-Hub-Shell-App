import { Routes } from '@angular/router';
import { safeLoadRemoteRoutes } from './utils/safe-load-remote';
import { errorRoutes } from './guards/error.routes';
import { ShellLayoutComponent } from '../libs/layouts/main-layout/shell-layout.component';
import { Error404LayoutComponent } from '../libs/layouts/error-404/error-404.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: safeLoadRemoteRoutes('auth'),
  },
  {
    path: '',
    component: ShellLayoutComponent,
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
