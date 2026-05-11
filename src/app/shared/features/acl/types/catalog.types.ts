export interface Catalog {
  option_id:   number;
  table_name:  string;
  neumonic:    string;
  description: string;
  value:       string;
  created_by:  string | null;
  created_at:  string;
  updated_by:  string | null;
  updated_at:  string | null;
  is_deleted:  boolean;
  deleted_at:  string | null;
  deleted_by:  string | null;
}

export type CreateCatalogRequest = Omit<
  Catalog,
  'option_id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'is_deleted' | 'deleted_at' | 'deleted_by'
>;
