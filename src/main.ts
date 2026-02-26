import { initFederation } from '@angular-architects/native-federation';

// Khởi tạo cấu hình Runtime Cấp Toàn Cục (Global Runtime Config)
const appEnv = {
  apiUrl: 'http://localhost:8080/api/v1',
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
