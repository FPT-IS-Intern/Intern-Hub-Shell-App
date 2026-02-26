import { initFederation } from '@angular-architects/native-federation';
import { environment } from './environments/environment';

// Khởi tạo cấu hình Runtime Cấp Toàn Cục (Global Runtime Config)
const appEnv = {
  apiUrl: environment.apiUrl,
  lmsFileBaseUrl: (environment as any).lmsFileBaseUrl,
};

(window as any).__env = appEnv;
try {
  const manifestFile = environment.production
    ? 'federation.manifest.json'
    : 'federation.manifest.local.json';

  await initFederation(manifestFile);
  console.log(`Nạp federation manifest (${manifestFile}) thành công`);
  await import('./bootstrap');
} catch (err) {
  console.error(err);
}
