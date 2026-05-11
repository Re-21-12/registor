-- Calendar reminders table
CREATE TABLE public.calendar_reminders (
  id            uuid            DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid            NOT NULL REFERENCES public.profiles(id),
  title         varchar         NOT NULL,
  description   varchar,
  frequency     varchar         NOT NULL
                CHECK (frequency IN ('once','daily','weekly','monthly','yearly','custom')),
  day           integer
                CHECK (day IS NULL OR (day >= 0 AND day <= 31)),
  hour          integer         NOT NULL
                CHECK (hour >= 0 AND hour <= 23),
  minute        integer         NOT NULL
                CHECK (minute >= 0 AND minute <= 59),
  second        integer         NOT NULL DEFAULT 0
                CHECK (second >= 0 AND second <= 59),
  location      varchar,
  url           varchar,
  is_active     boolean         NOT NULL DEFAULT true,
  created_at    timestamptz     DEFAULT now(),
  updated_at    timestamptz     DEFAULT now(),
  created_by    uuid            REFERENCES public.profiles(id),
  updated_by    uuid            REFERENCES public.profiles(id),
  deleted_at    timestamptz
);

-- RLS
ALTER TABLE public.calendar_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reminders"
  ON public.calendar_reminders FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert own reminders"
  ON public.calendar_reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders"
  ON public.calendar_reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders"
  ON public.calendar_reminders FOR DELETE
  USING (auth.uid() = user_id);

-- auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_calendar_reminders_updated_at
  BEFORE UPDATE ON public.calendar_reminders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
