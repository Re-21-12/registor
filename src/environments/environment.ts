export const environment = {
  production: false,
  // ────────────────────────────────────────────────
  // Supabase – rellena estos valores desde:
  // Dashboard → Settings → API
  // ────────────────────────────────────────────────
  supabaseUrl: 'https://TU_PROJECT_REF.supabase.co',
  supabaseKey: 'TU_ANON_KEY',
  // URL de redirección después del email confirm / password reset
  // Desarrollo: 'http://localhost:8100'
  // Producción móvil: esquema personalizado p.e. 'com.registor://callback'
  authRedirect: 'http://localhost:8100',
};
