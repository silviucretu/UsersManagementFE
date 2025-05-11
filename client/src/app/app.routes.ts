import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: 'protected', 
    loadComponent: () => import('./protected/protected.component').then(m => m.ProtectedComponent),
    canActivate: [AuthGuard] 
  },
  // Default route
  { 
    path: '',
    pathMatch: 'full',
    redirectTo: 'protected'
  }
];
