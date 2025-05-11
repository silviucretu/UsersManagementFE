// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) {
    // Update authentication state whenever tokens change
    this.oauthService.events.subscribe(event => {
      if (event.type === 'token_received' || 
          event.type === 'token_refreshed' || 
          event.type === 'logout') {
        this.updateAuthState();
      }
    });
    
    // Setup automatic refresh
    this.setupAutomaticRefreshToken();
    
    // Initial check
    this.updateAuthState();
  }
  
  private setupAutomaticRefreshToken() {
    // Setup automatic silent refresh if we have a refresh token
    this.oauthService.setupAutomaticSilentRefresh();
  }

  private updateAuthState() {
    const isAuthenticated = this.oauthService.hasValidAccessToken() && 
                           this.oauthService.hasValidIdToken();
    this.isAuthenticatedSubject.next(isAuthenticated);
    
    // If we're authenticated and have a redirect URL, navigate there
    if (isAuthenticated) {
      const redirectUrl = sessionStorage.getItem('redirectUrl');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectUrl');
        this.router.navigateByUrl(redirectUrl);
      }
    }
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
  }
  
  getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }
  
  getUserInfo(): any {
    return this.oauthService.getIdentityClaims();
  }

  getRefreshToken(): string {
    return this.oauthService.getRefreshToken();
  }
}