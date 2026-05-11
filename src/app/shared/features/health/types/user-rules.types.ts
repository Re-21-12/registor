export interface UserRule {
  rule_id:         number;
  user_id:         string;
  dr_id:           string | null;
  name:            string;
  brand:           string | null;
  dosis_type_id:   number;
  route_id:        number;
  unit_measure_id: number;
  dose_amount:     number;
  frequency_id:    number;
  requires_units:  boolean;
  valid_from:      string;
  valid_until:     string | null;
  is_active:       boolean;
  instructions:    string | null;
  description:     string | null;
  monthly_cost:    number | null;
  created_by:      string | null;
  created_at:      string;
  updated_by:      string | null;
  updated_at:      string | null;
  is_deleted:      boolean;
  deleted_at:      string | null;
  deleted_by:      string | null;
}

export type CreateUserRuleRequest = Omit<
  UserRule,
  'rule_id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'is_deleted' | 'deleted_at' | 'deleted_by'
>;

export type UpdateUserRuleRequest = Partial<
  Omit<UserRule, 'rule_id' | 'user_id' | 'created_at' | 'created_by' | 'is_deleted' | 'deleted_at' | 'deleted_by'>
>;
