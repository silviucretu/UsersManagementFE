
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AsyncPipe],
  template: `
    <nav>
      <ng-container *ngIf="(authService.isAuthenticated$ | async); else loggedOut">
        <button (click)="logout()">Logout</button>
      </ng-container>
      <ng-template #loggedOut>
        <button (click)="login()">Login</button>
      </ng-template>
    </nav>
    
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}