export interface Permission {
  permission_id: number;
  code:          string;
  resource:      string;
  action:        string;
  name:          string;
  error_code:    string | null;
  error_message: string | null;
  description:   string | null;
  created_by:    string | null;
  created_at:    string;
  updated_by:    string | null;
  updated_at:    string | null;
  is_deleted:    boolean;
  deleted_at:    string | null;
  deleted_by:    string | null;
}

export interface RolePermission {
  role_permission_id: number;
  role_id:            number;
  permission_id:      number;
  created_by:         string | null;
  created_at:         string;
  updated_by:         string | null;
  updated_at:         string | null;
  is_deleted:         boolean;
  deleted_at:         string | null;
  deleted_by:         string | null;
}
