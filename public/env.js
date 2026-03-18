(function (global) {
  var currentEnv = global.__env || {};
  var currentFirebase = currentEnv.firebase || {};

  global.__env = {
    ...currentEnv,
    firebase: {
      ...currentFirebase,
      apiKey: currentFirebase.apiKey || '',
      authDomain: currentFirebase.authDomain || '',
      projectId: currentFirebase.projectId || '',
      storageBucket: currentFirebase.storageBucket || '',
      messagingSenderId: currentFirebase.messagingSenderId || '',
      appId: currentFirebase.appId || '',
      measurementId: currentFirebase.measurementId || '',
    },
    firebaseVapidKey: currentEnv.firebaseVapidKey || '',
  };
})(globalThis);
