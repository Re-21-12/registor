import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { RoleService } from '../services/role.service';

export const roleGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const roleService    = inject(RoleService);
  const router         = inject(Router);
  const requiredRole   = route.data['requiredRole'] as string | undefined;
  const requiredLevel  = route.data['requiredLevel'] as number | undefined;

  try {
    await roleService.loadUserRoles();

    const allowed =
      (requiredRole  ? roleService.hasRole(requiredRole)      : true) &&
      (requiredLevel ? roleService.hasMinLevel(requiredLevel)  : true);

    if (allowed) return true;

    router.navigate(['/tabs/measurements']);
    return false;
  } catch {
    router.navigate(['/tabs/measurements']);
    return false;
  }
};
