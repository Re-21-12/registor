import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { authGuard } from '../shared/features/auth/guards/auth.guard';
import { patientProfileGuard } from '../shared/features/health/guards/patient-profile.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [authGuard],
    children: [
      {
        path: 'measurements',
        canActivate: [patientProfileGuard],
        loadComponent: () =>
          import('./measurements/measurements.page').then((m) => m.MeasurementsPage),
      },
      {
        path: 'scan',
        canActivate: [patientProfileGuard],
        loadComponent: () =>
          import('./scan/scan.page').then((m) => m.ScanPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: 'profile/setup',
        loadComponent: () =>
          import('./profile-setup/profile-setup.page').then((m) => m.ProfileSetupPage),
      },
      {
        path: '',
        redirectTo: '/tabs/measurements',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/measurements',
    pathMatch: 'full',
  },
];
