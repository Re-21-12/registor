export interface MonthlySummary {
  id: string;
  user_id: string;
  month: string;
  total_income?: number;
  total_expenses?: number;
  total_balance?: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  deleted_at?: string;
}
