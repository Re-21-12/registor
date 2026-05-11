import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../auth/services/supabase.service';
import { AuthService } from '../../auth/services/auth.service';
import { MonthlySummary } from '../types/monthly-summary.types';

@Injectable({
  providedIn: 'root'
})
export class MonthlySummariesService {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);

  async getSummaries(): Promise<MonthlySummary[]> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabaseService.getDatabase()
      .from('monthly_summaries')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('month', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async getSummaryByMonth(month: string): Promise<MonthlySummary | null> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabaseService.getDatabase()
      .from('monthly_summaries')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', month)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ?? null;
  }

  async createSummary(summary: Omit<MonthlySummary, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>): Promise<MonthlySummary> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabaseService.getDatabase()
      .from('monthly_summaries')
      .insert([{ ...summary, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateSummary(id: string, summary: Partial<MonthlySummary>): Promise<MonthlySummary> {
    const { data, error } = await this.supabaseService.getDatabase()
      .from('monthly_summaries')
      .update(summary)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteSummary(id: string): Promise<void> {
    const { error } = await this.supabaseService.getDatabase()
      .from('monthly_summaries')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }
}
