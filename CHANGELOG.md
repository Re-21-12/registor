# Changelog — Registor

All notable changes are documented here in reverse-chronological order.

---

## [Unreleased] — 2026-05-11

### Added
- **`supabase/migrations/20260511000000_add_calendar_reminders.sql`** — new `calendar_reminders` table with `frequency`, `day`, `hour`, `minute`, `second`, optional `location` and `url`, full RLS policies, and `set_updated_at()` trigger.
- **`src/app/shared/features/health/services/ocr.service.ts`** — OCR service using Tesseract.js (`createWorker`, `PSM.SINGLE_BLOCK`). Captures photo via `@capacitor/camera`, extracts glucose value via regex, returns `GlucoseOcrResult`.
- **`src/app/shared/features/dynamic-form/services/catalog-options.service.ts`** — cursor-pagination service for `SELECT`/`MULTISELECT` fields. Loads all pages from Supabase via `.range(from, to)` and exposes `getOptions()`, `isLoading()`, `loadAll()`.
- **`src/app/shared/features/dynamic-form/utils/forms.ts`** — centralised field-definition registry (`FormFields` type). Exports `formFields` with `loginForm` and `registerForm` entries built from `FieldBase` objects.
- **`FormFields` type** in `field-props.ts` — `Record<string, { fields: FieldBase<string>[] }>`.
- **`FieldOptionSource` interface** in `field-props.ts` — describes Supabase table source for dynamic option loading.
- **`hideActions` input** on `DynamicForm` — when `true`, suppresses the built-in Guardar/Limpiar buttons so the parent can provide its own submit button.

### Changed
- **`src/index.html`** — added Inter font preconnect + `<link>` tags.
- **`src/theme/variables.scss`** — full Ionic color system rewrite: primary `#4F6EF7`, success `#10B981`, warning `#F59E0B`, danger `#EF4444`, dark-mode step colors.
- **`src/global.scss`** — toolbar/tab-bar polish, `ion-input`/`ion-select` surface background, autofill yellow fix (`transition: background-color 600000s`).
- **`angular.json`** — asset entry copies Tesseract.js worker to `assets/tesseract/worker.min.js` for offline support.
- **`src/app/tabs/measurements/measurements.page.*`** — replaced `ion-list`/`ion-item` with `.summary-card` gradient + `.measure-card` left-border status cards.
- **`src/app/auth/login/login.page.*`** — migrated to `<app-dynamic-form [fields]="loginFields" [hideActions]="true">` pattern; removed manual `FormGroup`, `showPassword`, `isInvalid`.
- **`src/app/auth/register/register.page.*`** — same migration; password-match validation moved to `onData()` handler.
- **`src/app/shared/features/dynamic-form/dynamic-field/dynamic-field.*`** — injected `CatalogOptionsService`; SELECT/MULTISELECT now render `displayOptions()` with loading spinner.
- **`src/app/shared/features/health/components/patient-profile-form/patient-profile-form.*`** — migrated all `ion-input`/`ion-select` to `fill="outline"` modern Ionic API.

### Fixed
- Removed `IonItem`, `IonLabel`, `IonNote` from login/register/measurements component imports to match template changes.
- Removed `inputmode="email"` attribute that caused Safari warnings.
- Moved inline `style="width:18px;height:18px"` on `<ion-spinner>` to `.select-spinner` CSS class.

---

## Prior work (pre-session)

- Initial dynamic-form system with `FieldBase`, `FormBuilderService`, `DynamicField`, `DynamicErrors`, `DynamicHint`.
- Supabase auth integration (`AuthService`, `SupabaseService`).
- Tabs layout: Dashboard, Measurements, Profile.
- Patient-profile form and onboarding flow.
