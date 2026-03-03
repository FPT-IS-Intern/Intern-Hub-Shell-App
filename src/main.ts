import { initFederation } from '@angular-architects/native-federation';
import { environment } from './environments/environment';

// Khởi tạo cấu hình Runtime Cấp Toàn Cục (Global Runtime Config)
const appEnv = {
  apiUrl: environment.apiUrl,
  storageFileBaseUrl: (environment as any).storageFileBaseUrl,
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
