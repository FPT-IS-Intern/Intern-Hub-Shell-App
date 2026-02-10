// utils/safe-load-remote.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

const moduleCache = new Map<string, Promise<any>>();

export function safeLoadRemoteRoutes(remoteName: string) {
  return () => {
    if (!moduleCache.has(remoteName)) {
      const router = inject(Router);

      const loadPromise = loadRemoteModule(remoteName, './routes')
        .then((m) => m.routes)
        .catch((err) => {
          console.error(`[Federation] Cannot load ${remoteName}`, err);
          moduleCache.delete(remoteName);
          router.navigateByUrl('/error', { replaceUrl: true });
          return [];
        });

      moduleCache.set(remoteName, loadPromise);
    }

    return moduleCache.get(remoteName)!;
  };
}
