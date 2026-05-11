export interface Transaction {
  id: string;
  account_id: string;
  type: string;
  amount: number;
  description?: string;
  is_optional: boolean;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  deleted_at?: string;
}
