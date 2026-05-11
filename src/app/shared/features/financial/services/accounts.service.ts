import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../auth/services/supabase.service';
import { AuthService } from '../../auth/services/auth.service';
import { Account } from '../types/account.types';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);

  async getAccounts(): Promise<Account[]> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabaseService.getDatabase()
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async getAccountById(id: string): Promise<Account> {
    const { data, error } = await this.supabaseService.getDatabase()
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createAccount(account: Omit<Account, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>): Promise<Account> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabaseService.getDatabase()
      .from('accounts')
      .insert([{ ...account, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateAccount(id: string, account: Partial<Account>): Promise<Account> {
    const { data, error } = await this.supabaseService.getDatabase()
      .from('accounts')
      .update(account)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteAccount(id: string): Promise<void> {
    const { error } = await this.supabaseService.getDatabase()
      .from('accounts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }

  async restoreAccount(id: string): Promise<Account> {
    const { data, error } = await this.supabaseService.getDatabase()
      .from('accounts')
      .update({ deleted_at: null })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
