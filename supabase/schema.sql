-- =============================================================
-- REGISTOR – Esquema Supabase
-- Ejecutar en: Dashboard → SQL Editor → New Query
-- =============================================================


-- ─────────────────────────────────────────────────────────────
-- 0. EXTENSIONES
-- ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ─────────────────────────────────────────────────────────────
-- 1. ENUM: ROL DE USUARIO
-- ─────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ─────────────────────────────────────────────────────────────
-- 2. TABLA: profiles (vinculada a auth.users)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  role        public.user_role NOT NULL DEFAULT 'user',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Perfil público del usuario, extendido desde auth.users';

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: usuario lee su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: usuario actualiza su propio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles: admin lee todos"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );


-- ─────────────────────────────────────────────────────────────
-- 3. TRIGGER: crear perfil automáticamente al registrar usuario
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─────────────────────────────────────────────────────────────
-- 4. FUNCIÓN HELPER: columnas de auditoría
-- ─────────────────────────────────────────────────────────────
-- Función para auto-actualizar updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


-- ─────────────────────────────────────────────────────────────
-- 5. TABLAS DE DOMINIO: finanzas personales
-- ─────────────────────────────────────────────────────────────

-- 5.1 accounts – cuentas bancarias / efectivo / tarjetas
CREATE TABLE IF NOT EXISTS public.accounts (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT        NOT NULL,
  type         TEXT        NOT NULL CHECK (type IN ('bank','cash','credit','savings','investment')),
  currency     TEXT        NOT NULL DEFAULT 'GTQ',
  balance      NUMERIC(14,2) NOT NULL DEFAULT 0,
  color        TEXT,
  icon         TEXT,
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  -- Auditoría
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by   UUID        REFERENCES auth.users(id),
  updated_by   UUID        REFERENCES auth.users(id),
  deleted_at   TIMESTAMPTZ  -- soft delete
);

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "accounts: usuario gestiona los suyos"
  ON public.accounts FOR ALL
  USING  (auth.uid() = user_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE TRIGGER accounts_updated_at
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- 5.2 categories – categorías de transacciones
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID   PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID   REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL = global
  name        TEXT   NOT NULL,
  icon        TEXT,
  color       TEXT,
  type        TEXT   NOT NULL CHECK (type IN ('income','expense','transfer')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories: lee globales o propias"
  ON public.categories FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "categories: gestiona propias"
  ON public.categories FOR ALL
  USING  (auth.uid() = user_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE TRIGGER categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- 5.3 transactions – movimientos de dinero
CREATE TABLE IF NOT EXISTS public.transactions (
  id                UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id        UUID         NOT NULL REFERENCES public.accounts(id),
  category_id       UUID         REFERENCES public.categories(id),
  type              TEXT         NOT NULL CHECK (type IN ('income','expense','transfer')),
  amount            NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  description       TEXT,
  date              DATE         NOT NULL DEFAULT CURRENT_DATE,
  -- Transferencia
  to_account_id     UUID         REFERENCES public.accounts(id),
  -- Auditoría
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_by        UUID         REFERENCES auth.users(id),
  updated_by        UUID         REFERENCES auth.users(id),
  deleted_at        TIMESTAMPTZ
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions: usuario gestiona las suyas"
  ON public.transactions FOR ALL
  USING  (auth.uid() = user_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE TRIGGER transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Actualizar balance al insertar/soft-delete transacción
CREATE OR REPLACE FUNCTION public.update_account_balance()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.type = 'income' THEN
      UPDATE public.accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
    ELSIF NEW.type = 'expense' THEN
      UPDATE public.accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
    ELSIF NEW.type = 'transfer' AND NEW.to_account_id IS NOT NULL THEN
      UPDATE public.accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
      UPDATE public.accounts SET balance = balance + NEW.amount WHERE id = NEW.to_account_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_update_balance
  AFTER INSERT ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_account_balance();


-- 5.4 monthly_summaries – resumen mensual agregado
CREATE TABLE IF NOT EXISTS public.monthly_summaries (
  id              UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year            SMALLINT     NOT NULL,
  month           SMALLINT     NOT NULL CHECK (month BETWEEN 1 AND 12),
  total_income    NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_expenses  NUMERIC(14,2) NOT NULL DEFAULT 0,
  net_balance     NUMERIC(14,2) GENERATED ALWAYS AS (total_income - total_expenses) STORED,
  -- Auditoría
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_by      UUID         REFERENCES auth.users(id),
  updated_by      UUID         REFERENCES auth.users(id),
  deleted_at      TIMESTAMPTZ,
  UNIQUE (user_id, year, month)
);

ALTER TABLE public.monthly_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "monthly_summaries: usuario gestiona los suyos"
  ON public.monthly_summaries FOR ALL
  USING  (auth.uid() = user_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "monthly_summaries: admin lee todos"
  ON public.monthly_summaries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE OR REPLACE TRIGGER monthly_summaries_updated_at
  BEFORE UPDATE ON public.monthly_summaries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Función para recalcular el resumen mensual
CREATE OR REPLACE FUNCTION public.refresh_monthly_summary(p_user_id UUID, p_year SMALLINT, p_month SMALLINT)
RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
  v_income   NUMERIC(14,2);
  v_expenses NUMERIC(14,2);
BEGIN
  SELECT
    COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0)
  INTO v_income, v_expenses
  FROM public.transactions
  WHERE user_id  = p_user_id
    AND EXTRACT(YEAR  FROM date) = p_year
    AND EXTRACT(MONTH FROM date) = p_month
    AND deleted_at IS NULL;

  INSERT INTO public.monthly_summaries (user_id, year, month, total_income, total_expenses, created_by, updated_by)
  VALUES (p_user_id, p_year, p_month, v_income, v_expenses, p_user_id, p_user_id)
  ON CONFLICT (user_id, year, month)
  DO UPDATE SET
    total_income   = EXCLUDED.total_income,
    total_expenses = EXCLUDED.total_expenses,
    updated_at     = NOW(),
    updated_by     = p_user_id;
END;
$$;


-- ─────────────────────────────────────────────────────────────
-- 6. TABLA: audit_logs (registro global de cambios)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id           BIGSERIAL    PRIMARY KEY,
  table_name   TEXT         NOT NULL,
  record_id    TEXT         NOT NULL,
  action       TEXT         NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
  old_data     JSONB,
  new_data     JSONB,
  user_id      UUID         REFERENCES auth.users(id),
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_logs_table_name_idx ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS audit_logs_record_id_idx  ON public.audit_logs(record_id);
CREATE INDEX IF NOT EXISTS audit_logs_user_id_idx    ON public.audit_logs(user_id);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Solo admins pueden leer el log
CREATE POLICY "audit_logs: admin lee todo"
  ON public.audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Nadie puede modificar el log directamente
CREATE POLICY "audit_logs: sin escritura directa"
  ON public.audit_logs FOR INSERT
  WITH CHECK (FALSE);


-- ─────────────────────────────────────────────────────────────
-- 7. TRIGGER GENÉRICO DE AUDITORÍA
-- Adjuntar a cada tabla que quieras auditar:
--   CREATE TRIGGER audit_<tabla> AFTER INSERT OR UPDATE OR DELETE
--   ON public.<tabla> FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_record_id TEXT;
BEGIN
  -- Intenta obtener el id del registro afectado
  v_record_id := COALESCE(
    (CASE WHEN TG_OP = 'DELETE' THEN OLD.id::TEXT ELSE NEW.id::TEXT END),
    'unknown'
  );

  INSERT INTO public.audit_logs (table_name, record_id, action, old_data, new_data, user_id)
  VALUES (
    TG_TABLE_NAME,
    v_record_id,
    TG_OP,
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    auth.uid()
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Adjuntar auditoría a las tablas de dominio
CREATE OR REPLACE TRIGGER audit_accounts
  AFTER INSERT OR UPDATE OR DELETE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE OR REPLACE TRIGGER audit_transactions
  AFTER INSERT OR UPDATE OR DELETE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE OR REPLACE TRIGGER audit_monthly_summaries
  AFTER INSERT OR UPDATE OR DELETE ON public.monthly_summaries
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();


-- ─────────────────────────────────────────────────────────────
-- 8. CLAIM PERSONALIZADO: rol en el JWT
-- Permite leer auth.role() en el cliente y en RLS.
-- Requiere: Auth → Hooks → Custom Access Token Hook
--   → apunta a esta función en el Dashboard
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event JSONB)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  claims JSONB;
  v_role TEXT;
BEGIN
  SELECT role::TEXT INTO v_role
  FROM public.profiles
  WHERE id = (event->>'user_id')::UUID;

  claims := event->'claims';
  claims := jsonb_set(claims, '{user_role}', to_jsonb(COALESCE(v_role, 'user')));

  RETURN jsonb_set(event, '{claims}', claims);
END;
$$;

-- Permisos para que Supabase pueda invocar el hook
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM PUBLIC, authenticated, anon;


-- ─────────────────────────────────────────────────────────────
-- 9. DATOS INICIALES: categorías globales
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.categories (id, user_id, name, icon, color, type) VALUES
  (uuid_generate_v4(), NULL, 'Salario',          'cash-outline',          '#22c55e', 'income'),
  (uuid_generate_v4(), NULL, 'Freelance',         'laptop-outline',        '#3b82f6', 'income'),
  (uuid_generate_v4(), NULL, 'Inversiones',       'trending-up-outline',   '#8b5cf6', 'income'),
  (uuid_generate_v4(), NULL, 'Alimentación',      'fast-food-outline',     '#f97316', 'expense'),
  (uuid_generate_v4(), NULL, 'Transporte',        'car-outline',           '#ef4444', 'expense'),
  (uuid_generate_v4(), NULL, 'Salud',             'medical-outline',       '#ec4899', 'expense'),
  (uuid_generate_v4(), NULL, 'Entretenimiento',   'game-controller-outline','#f59e0b','expense'),
  (uuid_generate_v4(), NULL, 'Servicios',         'flash-outline',         '#6366f1', 'expense'),
  (uuid_generate_v4(), NULL, 'Educación',         'school-outline',        '#14b8a6', 'expense'),
  (uuid_generate_v4(), NULL, 'Transferencia',     'swap-horizontal-outline','#64748b','transfer')
ON CONFLICT DO NOTHING;


-- ─────────────────────────────────────────────────────────────
-- FIN DEL SCRIPT
-- =============================================================
-- PASOS SIGUIENTES EN EL DASHBOARD:
-- 1. Authentication → URL Configuration:
--      Site URL     = http://localhost:8100  (dev) o tu dominio prod
--      Redirect URL = http://localhost:8100/**
-- 2. Authentication → Hooks → Custom Access Token Hook:
--      → selecciona public.custom_access_token_hook
-- 3. Storage → New bucket "avatars" (público o privado según tu caso)
-- =============================================================
