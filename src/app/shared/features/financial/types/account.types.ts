export interface Account {
  id: string;
  user_id: string;
  name: string;
  account_number?: string;
  account_type?: string;
  currency: string;
  annual_interest_rate?: number;
  tax_rate_withheld?: number;
  statement_closing_day?: number;
  payment_due_day?: number;
  web_user?: string;
  web_password?: string;
  current_balance: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  deleted_at?: string;
}
