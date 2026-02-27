import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { SYSTEM_DESIGN_CONFIG } from 'dynamic-ds';

// ng-zorro locale
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
registerLocaleData(localeVi);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    { provide: NZ_I18N, useValue: vi_VN },
    { provide: LOCALE_ID, useValue: 'vi' },
    {
      provide: SYSTEM_DESIGN_CONFIG,
      useValue: {
        brand: '#E18308',
        primary: '#006BDF',
        secondary: '#9F5100',
        functional: '#006BDF',
        utility: '#CF0026'
      }
    }
  ]
};
