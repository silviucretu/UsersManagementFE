import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideOAuthClient, AuthConfig, OAuthService } from 'angular-oauth2-oidc';

import { routes } from './app.routes';
import { AuthService } from './services/auth.service';

// Your auth configuration
export const authConfig: AuthConfig = {
  issuer: 'http://localhost:8080',
  redirectUri: window.location.origin,
  clientId: '318999751456522243',
  scope: 'openid profile email offline_access urn:zitadel:iam:user:metadata',
  responseType: 'code',
  showDebugInformation: true, 
  useSilentRefresh: false,
  sessionChecksEnabled: true
};

// App initialization factory
export function initializeApp(oauthService: OAuthService) {
  return () => {
    oauthService.configure(authConfig);
    return oauthService.loadDiscoveryDocumentAndTryLogin();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideOAuthClient(),
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [OAuthService],
      multi: true
    }
  ]
};
