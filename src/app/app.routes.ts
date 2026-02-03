import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'homePage',
    pathMatch: 'full',
  },

  {
    path: 'homePage',
    loadChildren: () => loadRemoteModule('homePage', './routes').then((m) => m.routes),
  },
  // {
  //   path: 'auth',
  //   loadChildren: () => loadRemoteModule('auth', './routes').then((m) => m.routes),
  // },
  // {
  //   path: 'scheduler',
  //   loadChildren: () => loadRemoteModule('scheduler', './routes').then((m) => m.routes),
  // },
  // {
  //   path: 'notification',
  //   loadChildren: () => loadRemoteModule('notification', './routes').then((m) => m.routes),
  // },
  {
    path: 'lms',
    loadChildren: () => loadRemoteModule('lms', './routes').then((m) => m.routes),
  },
  // {
  //   path: 'hrm',
  //   loadChildren: () => loadRemoteModule('hrm', './routes').then((m) => m.routes),
  // },
  // {
  //   path: 'boPortal',
  //   loadChildren: () => loadRemoteModule('boPortal', './routes').then((m) => m.routes),
  // },
];
