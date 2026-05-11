-- Unique constraint on catalog to allow idempotent seeds
ALTER TABLE acl.catalog
  ADD CONSTRAINT catalog_table_neumonic_unique UNIQUE (table_name, neumonic);
