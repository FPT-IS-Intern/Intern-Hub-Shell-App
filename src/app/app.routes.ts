import { Routes } from '@angular/router';
import { safeLoadRemoteRoutes } from './utils/safe-load-remote';
import { errorRoutes } from './guards/error.routes';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'homePage',
    pathMatch: 'full',
  },

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
    redirectTo: 'error/404',
  },
];
