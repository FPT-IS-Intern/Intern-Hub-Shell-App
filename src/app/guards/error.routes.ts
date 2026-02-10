import { Routes } from '@angular/router';
import { Error404LayoutComponent } from '../../libs/layouts/error-404/error-404.component';

export const errorRoutes: Routes = [
  {
    path: '401',
    loadComponent: () => Promise.resolve(Error404LayoutComponent),
    data: { code: 401 },
  },
  {
    path: '403',
    loadComponent: () => Promise.resolve(Error404LayoutComponent),
    data: { code: 403 },
  },
  {
    path: '404',
    loadComponent: () => Promise.resolve(Error404LayoutComponent),
    data: { code: 404 },
  },
  {
    path: '500',
    loadComponent: () => Promise.resolve(Error404LayoutComponent),
    data: { code: 500 },
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
