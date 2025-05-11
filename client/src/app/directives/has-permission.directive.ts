import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { CasbinService } from '../services/casbin.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit {
  @Input() appHasPermission: { resource: string, action: string } = { resource: '', action: '' };
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private casbinService: CasbinService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.updateView();
  }

  private async updateView(): Promise<void> {
    const { resource, action } = this.appHasPermission;
    
    if (!resource || !action) {
      this.viewContainer.clear();
      this.hasView = false;
      return;
    }

    const hasPermission = await this.casbinService.hasPermission(resource, action);
    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}