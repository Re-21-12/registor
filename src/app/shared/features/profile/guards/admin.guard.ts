import { inject } from '@angular/core';
import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ProfilesService } from '../services/profiles.service';

export const adminGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  const profilesService = inject(ProfilesService);
  const router = inject(Router);

  try {
    const user = authService.getCurrentUserSync();
    if (!user) {
      router.navigate(['/auth/login']);
      return false;
    }

    const isAdmin = await profilesService.isAdmin();
    if (isAdmin) return true;

    router.navigate(['/dashboard']);
    return false;
  } catch {
    router.navigate(['/auth/login']);
    return false;
  }
};
