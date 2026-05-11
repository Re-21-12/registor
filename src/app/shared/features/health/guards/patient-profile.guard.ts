import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PatientProfileService } from '../services/patient-profile.service';

export const patientProfileGuard: CanActivateFn = async () => {
  const profileService = inject(PatientProfileService);
  const router         = inject(Router);

  try {
    await profileService.loadCurrentProfile();

    if (profileService.currentProfile()) return true;

    router.navigate(['/onboarding']);
    return false;
  } catch {
    router.navigate(['/onboarding']);
    return false;
  }
};
