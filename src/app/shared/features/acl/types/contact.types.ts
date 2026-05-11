export interface Contact {
  contact_id:  string;
  user_id:     string;
  type_id:     number;
  value:       string;
  is_primary:  boolean;
  is_verified: boolean;
  created_by:  string | null;
  created_at:  string;
  updated_by:  string | null;
  updated_at:  string | null;
  is_deleted:  boolean;
  deleted_at:  string | null;
  deleted_by:  string | null;
}

export type CreateContactRequest = Omit<
  Contact,
  'contact_id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'is_deleted' | 'deleted_at' | 'deleted_by'
>;

export type UpdateContactRequest = Partial<
  Omit<Contact, 'contact_id' | 'user_id' | 'created_at' | 'created_by' | 'is_deleted' | 'deleted_at' | 'deleted_by'>
>;
