import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../auth/services/supabase.service';
import { AuthService } from '../../auth/services/auth.service';
import { Transaction } from '../types/transaction.types';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);

  async getTransactionsByAccount(accountId: string): Promise<Transaction[]> {
    const { data, error } = await this.supabaseService.getDatabase()
      .from('transactions')
      .select('*')
      .eq('account_id', accountId)
      .is('deleted_at', null)
      .order('transaction_date', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const { data, error } = await this.supabaseService.getDatabase()
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>): Promise<Transaction> {
    const { data, error } = await this.supabaseService.getDatabase()
      .from('transactions')
      .insert([transaction])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    const { data, error } = await this.supabaseService.getDatabase()
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await this.supabaseService.getDatabase()
      .from('transactions')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }

  async restoreTransaction(id: string): Promise<Transaction> {
    const { data, error } = await this.supabaseService.getDatabase()
      .from('transactions')
      .update({ deleted_at: null })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getTransactionsByMonth(accountId: string, month: string): Promise<Transaction[]> {
    const [year, monthNum] = month.split('-');
    const nextMonth = parseInt(monthNum) + 1;
    const nextMonthStr = `${year}-${String(nextMonth).padStart(2, '0')}-01`;

    const { data, error } = await this.supabaseService.getDatabase()
      .from('transactions')
      .select('*')
      .eq('account_id', accountId)
      .gte('transaction_date', `${month}-01`)
      .lt('transaction_date', nextMonthStr)
      .is('deleted_at', null)
      .order('transaction_date', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }
}
