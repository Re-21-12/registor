export interface MeassureScan {
  scan_id:         string;
  user_id:         string;
  storage_bucket:  string;
  storage_path:    string;
  status_id:       number;
  ocr_raw_text:    string | null;
  ocr_confidence:  number | null;
  extracted_value: number | null;
  extracted_unit:  string | null;
  meassure_id:     number | null;
  error_code:      string | null;
  error_detail:    string | null;
  scanned_at:      string;
  processed_at:    string | null;
  created_by:      string | null;
  created_at:      string;
  updated_by:      string | null;
  updated_at:      string | null;
  is_deleted:      boolean;
  deleted_at:      string | null;
  deleted_by:      string | null;
}

export type CreateMeassureScanRequest = {
  user_id:    string;
  status_id:  number;
  storage_bucket?: string;
  storage_path: string;
  scanned_at?: string;
};

export type UpdateMeassureScanRequest = Partial<
  Omit<MeassureScan, 'scan_id' | 'user_id' | 'created_at' | 'created_by' | 'is_deleted' | 'deleted_at' | 'deleted_by'>
>;
