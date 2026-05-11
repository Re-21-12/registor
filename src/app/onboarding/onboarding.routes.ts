import { Routes } from '@angular/router';

export const onboardingRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./onboarding.page').then((m) => m.OnboardingPage),
  },
];
