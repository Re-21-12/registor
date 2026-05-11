-- ============================================================
-- Seed: acl.catalog
-- Todos los INSERT son idempotentes gracias al constraint
-- UNIQUE (table_name, neumonic)
-- ============================================================

INSERT INTO acl.catalog (table_name, neumonic, description, value, is_deleted) VALUES

  -- ── Tipos de diabetes (patient_profile.diabetes_type_id) ──
  ('patient_profile', 'DM1',  'Diabetes Tipo 1',    '', false),
  ('patient_profile', 'DM2',  'Diabetes Tipo 2',    '', false),
  ('patient_profile', 'DMG',  'Diabetes Gestacional', '', false),
  ('patient_profile', 'LADA', 'LADA',               '', false),
  ('patient_profile', 'MODY', 'MODY',               '', false),
  ('patient_profile', 'PRE',  'Prediabetes',        '', false),

  -- ── Géneros (patient_profile.gender_id) ──
  ('gender', 'M',  'Masculino',          '', false),
  ('gender', 'F',  'Femenino',           '', false),
  ('gender', 'NB', 'No binario',         '', false),
  ('gender', 'NR', 'Prefiero no decir',  '', false),

  -- ── Unidades de glucosa (meassure.unit_id) ──
  ('meassure_unit', 'MGDL',  'mg/dL',   '', false),
  ('meassure_unit', 'MMOLL', 'mmol/L',  '', false),

  -- ── Tipos de medición (meassure.meassure_type_id) ──
  ('meassure_type', 'FASTING',       'Ayuno',            '', false),
  ('meassure_type', 'POSTPRANDIAL',  'Postprandial',     '', false),
  ('meassure_type', 'RANDOM',        'Aleatoria',        '', false),
  ('meassure_type', 'BEDTIME',       'Antes de dormir',  '', false),
  ('meassure_type', 'PRE_EXERCISE',  'Pre-ejercicio',    '', false),
  ('meassure_type', 'POST_EXERCISE', 'Post-ejercicio',   '', false),

  -- ── Contexto de medición (meassure.context_id) ──
  ('meassure_context', 'BEFORE_BREAKFAST', 'Antes del desayuno',     '', false),
  ('meassure_context', 'AFTER_BREAKFAST',  'Después del desayuno',   '', false),
  ('meassure_context', 'BEFORE_LUNCH',     'Antes del almuerzo',     '', false),
  ('meassure_context', 'AFTER_LUNCH',      'Después del almuerzo',   '', false),
  ('meassure_context', 'BEFORE_DINNER',    'Antes de la cena',       '', false),
  ('meassure_context', 'AFTER_DINNER',     'Después de la cena',     '', false),
  ('meassure_context', 'WAKEUP',           'Al despertar',           '', false),
  ('meassure_context', 'EXERCISE',         'Durante el ejercicio',   '', false),

  -- ── Estado del escaneo OCR (meassure_scan.status_id) ──
  ('meassure_scan_status', 'PENDING',    'Pendiente',    '', false),
  ('meassure_scan_status', 'PROCESSING', 'Procesando',   '', false),
  ('meassure_scan_status', 'COMPLETED',  'Completado',   '', false),
  ('meassure_scan_status', 'FAILED',     'Fallido',      '', false),

  -- ── Tipo de dosis (user_rules.dosis_type_id) ──
  ('dosis_type', 'BOLUS',  'Insulina bolo (rápida)', '', false),
  ('dosis_type', 'BASAL',  'Insulina basal (lenta)', '', false),
  ('dosis_type', 'MIXED',  'Insulina mixta',         '', false),
  ('dosis_type', 'ORAL',   'Medicamento oral',       '', false),

  -- ── Vía de administración (user_rules.route_id) ──
  ('medication_route', 'SC', 'Subcutánea',    '', false),
  ('medication_route', 'VO', 'Oral',          '', false),
  ('medication_route', 'IV', 'Intravenosa',   '', false),
  ('medication_route', 'IM', 'Intramuscular', '', false),

  -- ── Unidad de dosis (user_rules.unit_measure_id) ──
  ('unit_measure', 'U',   'Unidades (U)',   '', false),
  ('unit_measure', 'MG',  'Miligramos',     '', false),
  ('unit_measure', 'MCG', 'Microgramos',    '', false),
  ('unit_measure', 'ML',  'Mililitros',     '', false),

  -- ── Frecuencia de medicación (user_rules.frequency_id) ──
  ('frequency', 'ONCE_DAILY',   'Una vez al día',      '', false),
  ('frequency', 'TWICE_DAILY',  'Dos veces al día',    '', false),
  ('frequency', 'THREE_DAILY',  'Tres veces al día',   '', false),
  ('frequency', 'FOUR_DAILY',   'Cuatro veces al día', '', false),
  ('frequency', 'EVERY_8H',     'Cada 8 horas',        '', false),
  ('frequency', 'EVERY_12H',    'Cada 12 horas',       '', false),
  ('frequency', 'WEEKLY',       'Semanal',             '', false),
  ('frequency', 'PRN',          'Según necesidad',     '', false),

  -- ── Tipo de contacto (acl.contact.type_id) ──
  ('contact_type', 'PHONE',     'Teléfono',            '', false),
  ('contact_type', 'EMAIL',     'Correo electrónico',  '', false),
  ('contact_type', 'WHATSAPP',  'WhatsApp',            '', false),
  ('contact_type', 'TELEGRAM',  'Telegram',            '', false),
  ('contact_type', 'OTHER',     'Otro',                '', false)

ON CONFLICT (table_name, neumonic) DO NOTHING;
