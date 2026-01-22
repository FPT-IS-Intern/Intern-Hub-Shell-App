import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: 'lms',
    loadChildren: () => loadRemoteModule('lms', './routes').then((m) => m.routes),
  },
  {
    path: 'hrm',
    loadChildren: () => loadRemoteModule('hrm', './routes').then((m) => m.routes),
  },
];
