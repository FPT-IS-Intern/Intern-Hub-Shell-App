import { initFederation } from '@angular-architects/native-federation';
import { environment } from './environments/environment';

// Khởi tạo cấu hình Runtime Cấp Toàn Cục (Global Runtime Config)
const appEnv = {
  apiUrl: environment.apiUrl,
  lmsFileBaseUrl: (environment as any).lmsFileBaseUrl,
};

(window as any).__env = appEnv;
try {
  // await initFederation('https://s3.vn-hcm-1.vietnix.cloud/bravos/federation.manifest.json');
  await initFederation('federation.manifest.local.json');
  console.log('Nạp federation manifest thành công');
  await import('./bootstrap');
} catch (err) {
  console.error(err);
}
