import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelloService } from '../services/hello.service';
import { AuthService } from '../services/auth.service';
import { HasPermissionDirective } from '../directives/has-permission.directive';

@Component({
  selector: 'app-protected',
  standalone: true,
  imports: [CommonModule, HasPermissionDirective],
  template: `
    <div class="protected-content">
      <h1>Protected Content</h1>
      <p>This page is only accessible to authenticated users.</p>
      
      <div class="user-info" *ngIf="userInfo">
        <h2>User Information</h2>
        <p><strong>Name:</strong> {{userInfo.name || 'Not available'}}</p>
        <p><strong>Email:</strong> {{userInfo.email || 'Not available'}}</p>
      </div>
      
      <div class="api-response" *ngIf="apiResponse">
        <h2>API Response</h2>
        <p>{{apiResponse}}</p>
      </div>
      
      <div class="error" *ngIf="errorMessage">
        <p>Error: {{errorMessage}}</p>
      </div>
      
      <div>
        <button (click)="callApi()">Call Protected API</button>
        
        <button 
          *appHasPermission="{ resource: 'button:role2', action: 'view' }"
          class="role2-button">
          Visible just for Role2
        </button>
      </div>
    </div>
  `
})
export class ProtectedComponent implements OnInit {
  userInfo: any = null;
  apiResponse: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private helloService: HelloService
  ) {}

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
  }

  async callApi(): Promise<void> {
    try {
      this.errorMessage = null;
      this.apiResponse = await this.helloService.getHello('Authenticated');
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('API call failed:', error);
    }
  }
}