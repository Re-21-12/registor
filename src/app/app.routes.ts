import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // Rutas públicas (solo accesibles sin sesión)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        canActivate: [publicGuard],
        loadComponent: () => import('./auth/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'register',
        canActivate: [publicGuard],
        loadComponent: () => import('./auth/register/register.page').then((m) => m.RegisterPage),
      },
    ],
  },

  // Rutas protegidas
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },

  { path: '**', redirectTo: '/auth/login' },
];
