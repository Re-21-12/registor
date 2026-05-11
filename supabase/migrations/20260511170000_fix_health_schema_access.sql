-- Grant schema + table access for authenticated role on health schema
GRANT USAGE ON SCHEMA health TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA health TO authenticated;

-- RLS policies for health.patient_profile
CREATE POLICY "users can read own patient_profile"
  ON health.patient_profile FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "users can insert own patient_profile"
  ON health.patient_profile FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can update own patient_profile"
  ON health.patient_profile FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS policies for health.meassure
CREATE POLICY "users can read own meassures"
  ON health.meassure FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "users can insert own meassures"
  ON health.meassure FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can update own meassures"
  ON health.meassure FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can delete own meassures"
  ON health.meassure FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS policies for health.user_rules
CREATE POLICY "users can read own user_rules"
  ON health.user_rules FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "users can insert own user_rules"
  ON health.user_rules FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can update own user_rules"
  ON health.user_rules FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS policies for health.meassure_scan
CREATE POLICY "users can read own meassure_scan"
  ON health.meassure_scan FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "users can insert own meassure_scan"
  ON health.meassure_scan FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can update own meassure_scan"
  ON health.meassure_scan FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can delete own meassure_scan"
  ON health.meassure_scan FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
