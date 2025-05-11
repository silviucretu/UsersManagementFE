import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private oauthService: OAuthService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.oauthService.hasValidAccessToken()) {
      return true;
    }
    
    // Store the current URL to redirect back after login
    sessionStorage.setItem('redirectUrl', state.url);
    
    // Start the login flow
    this.oauthService.initLoginFlow();
    return false;
  }
}