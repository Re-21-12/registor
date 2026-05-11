import { inject } from '@angular/core';
import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const user = await firstValueFrom(
      authService.getCurrentUser().pipe(map((u) => u !== null)),
    );

    if (user) return true;
    router.navigate(['/auth/login']);
    return false;
  } catch {
    router.navigate(['/auth/login']);
    return false;
  }
};
