export interface UserSession {
  user_session_id: string;
  session_id:      string;
  user_id:         string;
  ip_address:      string;
  user_agent:      string | null;
  device_type:     string | null;
  expires_at:      string | null;
  sign_in:         string;
  sign_out:        string | null;
  created_by:      string | null;
  created_at:      string;
  updated_by:      string | null;
  updated_at:      string | null;
  is_deleted:      boolean;
  deleted_at:      string | null;
  deleted_by:      string | null;
}

export type CreateUserSessionRequest = Omit<
  UserSession,
  'user_session_id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'is_deleted' | 'deleted_at' | 'deleted_by'
>;
