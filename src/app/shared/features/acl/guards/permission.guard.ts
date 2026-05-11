import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';

export const permissionGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const permissionService    = inject(PermissionService);
  const router               = inject(Router);
  const requiredPermission   = route.data['requiredPermission'] as string | undefined;

  if (!requiredPermission) return true;

  try {
    await permissionService.loadUserPermissions();

    if (permissionService.hasPermission(requiredPermission)) return true;

    router.navigate(['/tabs/measurements']);
    return false;
  } catch {
    router.navigate(['/tabs/measurements']);
    return false;
  }
};
