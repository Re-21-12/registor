# Supabase + Auth Setup - Registor (Modular by Feature)

## 📁 Estructura Modular por Feature

```
src/app/shared/features/
├── auth/                           # Feature de Autenticación
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── supabase.service.ts
│   │   └── index.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── index.ts
│   ├── interceptors/
│   │   ├── auth.interceptor.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   └── index.ts
│   ├── pages/
│   │   ├── login/
│   │   └── signup/
│   ├── components/
│   │   └── (components específicos de auth)
│   └── index.ts (barrel export)
│
├── profile/                        # Feature de Perfil
│   ├── services/
│   │   ├── profiles.service.ts
│   │   └── index.ts
│   ├── guards/
│   │   ├── admin.guard.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── profile.types.ts
│   │   └── index.ts
│   ├── pages/
│   │   └── profile-detail/
│   └── index.ts
│
└── financial/                      # Feature de Finanzas
    ├── services/
    │   ├── accounts.service.ts
    │   ├── transactions.service.ts
    │   ├── monthly-summaries.service.ts
    │   ├── audit.service.ts
    │   └── index.ts
    ├── types/
    │   ├── account.types.ts
    │   ├── transaction.types.ts
    │   ├── monthly-summary.types.ts
    │   ├── audit.types.ts
    │   └── index.ts
    ├── pages/
    │   ├── accounts-list/
    │   ├── account-detail/
    │   ├── transactions-list/
    │   └── monthly-summary/
    ├── components/
    │   ├── account-form/
    │   ├── transaction-form/
    │   └── audit-log-viewer/
    └── index.ts
```

## ⚙️ Setup Pasos

### 1️⃣ **Registrar AuthInterceptor en main.ts**

```typescript
import { AuthInterceptor } from './app/shared/features/auth/interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
});
```

### 2️⃣ **Usar Guards en Routes**

```typescript
import { authGuard } from '@/app/shared/features/auth/guards';
import { adminGuard } from '@/app/shared/features/profile/guards';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
    ]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'financial',
    canActivate: [authGuard],
    children: [
      { path: 'accounts', component: AccountsListComponent },
      { path: 'accounts/:id', component: AccountDetailComponent },
    ]
  },
];
```

### 3️⃣ **Usar Servicios con inject()**

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from '@/app/shared/features/auth/services';
import { AccountsService } from '@/app/shared/features/financial/services';

@Component({
  selector: 'app-dashboard',
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private accountsService = inject(AccountsService);

  async ngOnInit() {
    const user = this.authService.currentUser();
    const accounts = await this.accountsService.getAccounts();
  }
}
```

## 🔐 Base de Datos

### Tablas
- ✅ `profiles` - Vinculada a `auth.users`, ENUM role
- ✅ `accounts` - Cuentas con auditoría
- ✅ `transactions` - Transacciones con auditoría
- ✅ `monthly_summaries` - Resúmenes mensuales
- ✅ `audit_logs` - Historial de cambios

### RLS
- ✅ Usuarios ven/editan solo sus datos
- ✅ Admins ven `audit_logs`
- ✅ Soft delete con `deleted_at`

### Triggers
- ✅ Auto-crear profile en signup
- ✅ Auto-registrar cambios
- ✅ Auto-actualizar `updated_at`, `updated_by`

## 📖 Uso por Feature

### Auth Feature
```typescript
import { AuthService } from '@/app/shared/features/auth/services';
import { authGuard } from '@/app/shared/features/auth/guards';

// Autenticación
await authService.signUp(email, password, fullName);
await authService.signIn(email, password);
await authService.signInWithGoogle();
await authService.signOut();

// Estado
authService.currentUser()           // Signal
authService.getCurrentUser()        // Observable
authService.getCurrentUserSync()    // Sync
authService.isAuthenticated()       // Boolean
```

### Profile Feature
```typescript
import { ProfilesService } from '@/app/shared/features/profile/services';
import { adminGuard } from '@/app/shared/features/profile/guards';

const profile = await profilesService.getProfile();
await profilesService.updateProfile({ full_name: 'Nuevo' });
const isAdmin = await profilesService.isAdmin();
```

### Financial Feature
```typescript
import { 
  AccountsService, 
  TransactionsService, 
  MonthlySummariesService,
  AuditService 
} from '@/app/shared/features/financial/services';

// Accounts
const accounts = await accountsService.getAccounts();
await accountsService.createAccount({ name: 'Mi Cuenta', ... });
await accountsService.updateAccount(id, { current_balance: 5000 });
await accountsService.deleteAccount(id);      // Soft delete
await accountsService.restoreAccount(id);

// Transactions
const txs = await transactionsService.getTransactionsByAccount(accountId);
const monthTxs = await transactionsService.getTransactionsByMonth(accountId, '2026-05');
await transactionsService.createTransaction({ account_id, type, amount, ... });

// Monthly Summaries
const summaries = await summariesService.getSummaries();
const summary = await summariesService.getSummaryByMonth('2026-05');

// Audit (Admin only)
const logs = await auditService.getAuditLogs();
const history = await auditService.getRecordHistory('accounts', accountId);
```

## 🎯 Próximos Pasos

1. **Crear pages y components** dentro de cada feature
   - `auth/pages/login`, `auth/pages/signup`
   - `financial/pages/accounts-list`, `financial/pages/account-detail`
   - `profile/pages/profile-detail`

2. **Crear auth feature routes**
   ```typescript
   // auth/auth.routes.ts
   export const AUTH_ROUTES: Routes = [
     { path: 'login', component: LoginComponent },
     { path: 'signup', component: SignupComponent },
   ];
   ```

3. **Crear financial feature routes**
   ```typescript
   // financial/financial.routes.ts
   export const FINANCIAL_ROUTES: Routes = [
     { path: 'accounts', component: AccountsListComponent },
     { path: 'accounts/:id', component: AccountDetailComponent },
   ];
   ```

4. **Lazy-load features en app.routes.ts**
   ```typescript
   {
     path: 'financial',
     loadChildren: () => import('./shared/features/financial/financial.routes')
       .then(m => m.FINANCIAL_ROUTES),
     canActivate: [authGuard]
   }
   ```

5. **Crear formularios reactivos** con validaciones
6. **Manejo de errores** y feedback de usuario
7. **Testing** unit + e2e

## 📝 Convenciones

- ✅ Cada feature es **independiente y reutilizable**
- ✅ Services, Guards, Types dentro de cada feature
- ✅ Barrel exports (`index.ts`) para importaciones limpias
- ✅ `inject()` en lugar de constructor
- ✅ Signals para state (`authService.currentUser()`)
- ✅ RLS automático en queries
- ✅ Auditoría automática en cambios

## 🔗 URLs

- Supabase: https://oesohbuwphsmeugfeyks.supabase.co
- Estructura: `src/app/shared/features/`
