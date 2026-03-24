import { Routes } from '@angular/router';
import { safeLoadRemoteRoutes } from './utils/safe-load-remote';
import { errorRoutes } from './guards/error.routes';
import { ShellLayoutComponent } from './layouts/main-layout/shell-layout.component';
import { Error404LayoutComponent } from './layouts/error-404/error-404.component';
import { PrivacyPolicyComponent } from './layouts/privacy-policy/privacy-policy.component';
import { TermsOfUseComponent } from './layouts/terms-of-use/terms-of-use.component';
import { createAuthGuard, createNoAuthGuard } from '@goat-bravos/shared-lib-client';

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
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    title: 'Chính sách Bảo mật - FPT Intern Hub',
  },
  {
    path: 'terms-of-use',
    component: TermsOfUseComponent,
    title: 'Điều khoản sử dụng - FPT Intern Hub',
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
        path: 'pm',
        loadChildren: safeLoadRemoteRoutes('pm'),
      },
      {
        path: 'wallet',
        loadChildren: safeLoadRemoteRoutes('wallet'),
      },
      {
        path: 'ticket',
        loadChildren: safeLoadRemoteRoutes('ticket'),
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
