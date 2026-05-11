export interface Role {
  role_id:     number;
  code:        string;
  name:        string;
  level:       number;
  description: string | null;
  created_by:  string | null;
  created_at:  string;
  updated_by:  string | null;
  updated_at:  string | null;
  is_deleted:  boolean;
  deleted_at:  string | null;
  deleted_by:  string | null;
}

export interface UserRole {
  user_role_id: number;
  user_id:      string;
  role_id:      number;
  created_by:   string | null;
  created_at:   string;
  updated_by:   string | null;
  updated_at:   string | null;
  is_deleted:   boolean;
  deleted_at:   string | null;
  deleted_by:   string | null;
}
