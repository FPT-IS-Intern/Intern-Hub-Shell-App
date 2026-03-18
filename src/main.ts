import { initFederation } from '@angular-architects/native-federation';
import { environment } from './environments/environment';

const runtimeEnv = (globalThis as any).__env ?? {};
const runtimeFirebase = runtimeEnv.firebase ?? {};

const appEnv = {
  ...runtimeEnv,
  apiUrl: runtimeEnv.apiUrl ?? environment.apiUrl,
  storageFileBaseUrl: runtimeEnv.storageFileBaseUrl ?? (environment as any).storageFileBaseUrl,
  firebase: {
    ...(environment as any).firebase,
    ...runtimeFirebase,
  },
  firebaseVapidKey: runtimeEnv.firebaseVapidKey ?? (environment as any).firebaseVapidKey,
};

(globalThis as any).__env = appEnv;

const manifestFile = environment.production
  ? 'federation.manifest.json'
  : 'federation.manifest.local.json';

initFederation(manifestFile)
  .then(() => {
    console.log(`Nap federation manifest (${manifestFile}) thanh cong`);
    return import('./bootstrap');
  })
  .catch((err) => {
    console.error('Loi khi khoi tao Native Federation:', err);
  });
