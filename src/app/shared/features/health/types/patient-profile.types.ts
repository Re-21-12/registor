export interface PatientProfile {
  patient_profile_id: string;
  user_id:            string;
  diabetes_type_id:   number;
  target_min_mgdl:    number;
  target_max_mgdl:    number;
  date_of_birth:      string | null;
  gender_id:          number | null;
  diagnosis_date:     string | null;
  created_by:         string | null;
  created_at:         string;
  updated_by:         string | null;
  updated_at:         string | null;
  is_deleted:         boolean;
  deleted_at:         string | null;
  deleted_by:         string | null;
}

export type CreatePatientProfileRequest = Omit<
  PatientProfile,
  'patient_profile_id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'is_deleted' | 'deleted_at' | 'deleted_by'
>;

export type UpdatePatientProfileRequest = Partial<
  Omit<PatientProfile, 'patient_profile_id' | 'user_id' | 'created_at' | 'created_by' | 'is_deleted' | 'deleted_at' | 'deleted_by'>
>;
