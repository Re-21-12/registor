import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseAuthService } from '../services/supabase-auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(SupabaseAuthService);
  const router = inject(Router);

  await auth.waitForAuthReady();

  if (auth.isLoggedIn()) return true;

  router.navigate(['/auth/login']);
  return false;
};

export const publicGuard: CanActivateFn = async () => {
  const auth = inject(SupabaseAuthService);
  const router = inject(Router);

  await auth.waitForAuthReady();

  if (!auth.isLoggedIn()) return true;

  router.navigate(['/tabs/tab1']);
  return false;
};
