import { initFederation } from '@angular-architects/native-federation';

initFederation('federation.manifest.json')
  .catch((err) => console.error(err))
  .then(() => console.log('Nạp thành công'))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));
