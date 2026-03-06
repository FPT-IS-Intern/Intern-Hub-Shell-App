import { initFederation } from '@angular-architects/native-federation';
import { environment } from './environments/environment';

// Trigger deploy
// Khởi tạo cấu hình Runtime Cấp Toàn Cục (Global Runtime Config)
const appEnv = {
  apiUrl: environment.apiUrl,
  storageFileBaseUrl: (environment as any).storageFileBaseUrl,
  firebase: (environment as any).firebase,
  firebaseVapidKey: (environment as any).firebaseVapidKey,
};

(globalThis as any).__env = appEnv;

const manifestFile = environment.production
  ? 'federation.manifest.json'
  : 'federation.manifest.local.json';

initFederation(manifestFile)
  .then(() => {
    console.log(`Nạp federation manifest (${manifestFile}) thành công`);
    return import('./bootstrap');
  })
  .catch((err) => {
    console.error('Lỗi khi khởi tạo Native Federation:', err);
  });
