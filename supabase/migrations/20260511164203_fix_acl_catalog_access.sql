-- Grant schema + table access so authenticated/anon roles can read the catalog
GRANT USAGE ON SCHEMA acl TO authenticated, anon;
GRANT SELECT ON acl.catalog TO authenticated, anon;

-- RLS policies for acl.catalog
CREATE POLICY "authenticated can read catalog"
  ON acl.catalog FOR SELECT
  TO authenticated
  USING (is_deleted = false);

CREATE POLICY "anon can read catalog"
  ON acl.catalog FOR SELECT
  TO anon
  USING (is_deleted = false);
