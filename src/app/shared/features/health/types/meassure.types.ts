export interface Meassure {
  meassure_id:      number;
  measured_at:      string;
  user_id:          string;
  value_mgdl:       number;
  unit_id:          number;
  meassure_type_id: number;
  context_id:       number | null;
  last_eat_at:      string | null;
  notes:            string | null;
  created_by:       string | null;
  created_at:       string;
  updated_by:       string | null;
  updated_at:       string | null;
  is_deleted:       boolean;
  deleted_at:       string | null;
  deleted_by:       string | null;
}

export type CreateMeassureRequest = Omit<
  Meassure,
  'meassure_id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'is_deleted' | 'deleted_at' | 'deleted_by'
>;

export type UpdateMeassureRequest = Partial<
  Omit<Meassure, 'meassure_id' | 'user_id' | 'created_at' | 'created_by' | 'is_deleted' | 'deleted_at' | 'deleted_by'>
>;

export type GlucoseStatus = 'low' | 'in-range' | 'high';
