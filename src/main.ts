import { initFederation } from '@angular-architects/native-federation';

try {
  await initFederation('https://s3.vn-hcm-1.vietnix.cloud/bravos/federation.manifest.json');
  console.log('Nạp federation manifest thành công');
  await import('./bootstrap');
} catch (err) {
  console.error(err);
}
