// utils/safe-load-remote.ts
import { loadRemoteModule } from '@angular-architects/native-federation';

const moduleCache = new Map<string, Promise<any>>();

export function safeLoadRemoteRoutes(remoteName: string) {
  return () => {
    if (!moduleCache.has(remoteName)) {
      const loadPromise = loadRemoteModule(remoteName, './routes')
        .then((m) => m.routes)
        .catch((err) => {
          console.error(`[Federation] Cannot load ${remoteName}`, err);
          moduleCache.delete(remoteName);
          // Return a fallback route that redirects to error page
          return [
            {
              path: '**',
              redirectTo: '/error'
            }
          ];
        });

      moduleCache.set(remoteName, loadPromise);
    }

    return moduleCache.get(remoteName)!;
  };
}
