import { initFederation } from '@angular-architects/native-federation';

try {
  await initFederation('/federation.manifest.json');
  console.log('Nạp federation manifest thành công');
  await import('./bootstrap');
} catch (err) {
  console.error(err);
}
