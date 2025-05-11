import { Injectable } from '@angular/core';
import * as casbin from 'casbin';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CasbinService {
  private enforcer: casbin.Enforcer | null = null;
  
  constructor(private authService: AuthService) {
    this.initEnforcer();
  }

  private async initEnforcer(): Promise<void> {
    try {
      // Load model and policy from assets directory
      const modelText = await this.fetchFile('/assets/casbin/model.conf');
      const policyText = await this.fetchFile('/assets/casbin/policy.csv');
      
      // Create model from text
      const model = casbin.newModel();
      model.loadModelFromText(modelText);
      
      // Create adapter for policy
      const adapter = new casbin.StringAdapter(policyText);
      
      // Create enforcer with model and adapter
      this.enforcer = await casbin.newEnforcer(model, adapter);
    } catch (error) {
      console.error('Failed to initialize Casbin enforcer:', error);
    }
  }
  
  private async fetchFile(path: string): Promise<string> {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Error fetching ${path}:`, error);
      throw error;
    }
  }

  async hasPermission(obj: string, act: string): Promise<boolean> {
    if (!this.enforcer) {
      await this.initEnforcer();
      if (!this.enforcer) return false;
    }

    const userInfo = this.authService.getUserInfo();
    if (!userInfo) return false;

    const roles = this.extractRoles(userInfo);
    
    for (const role of roles) {
      const allowed = await this.enforcer.enforce(role, obj, act);
      if (allowed) return true;
    }
    
    return false;
  }

  private extractRoles(userInfo: any): string[] {
    const roles: string[] = [];
 
    if (userInfo['urn:zitadel:iam:org:project:roles']) {
      const zitadelRoles = userInfo['urn:zitadel:iam:org:project:roles'];
      for (const key in zitadelRoles) {
        if (Object.prototype.hasOwnProperty.call(zitadelRoles, key)) {
          roles.push(key);
        }
      }
    }
    
    return roles;
  }
}