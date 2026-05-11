import { Pipe, PipeTransform, inject } from '@angular/core';
import { PermissionService } from '../services/permission.service';

@Pipe({ name: 'hasPermission', standalone: true, pure: false })
export class HasPermissionPipe implements PipeTransform {
  private permissionService = inject(PermissionService);

  transform(code: string): boolean {
    return this.permissionService.hasPermission(code);
  }
}
