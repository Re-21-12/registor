import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../auth/services/supabase.service';
import { AuthService } from '../../auth/services/auth.service';
import { UserRule, CreateUserRuleRequest, UpdateUserRuleRequest } from '../types';

@Injectable({ providedIn: 'root' })
export class UserRulesService {
  private supabaseService = inject(SupabaseService);
  private authService     = inject(AuthService);

  private get db() {
    return this.supabaseService.getDatabase().schema('health');
  }

  async getAll(): Promise<UserRule[]> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.db
      .from('user_rules')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_deleted', false)
      .order('valid_from', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async getActive(): Promise<UserRule[]> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.db
      .from('user_rules')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_deleted', false)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async getById(id: number): Promise<UserRule> {
    const { data, error } = await this.db
      .from('user_rules')
      .select('*')
      .eq('rule_id', id)
      .eq('is_deleted', false)
      .single();

    if (error) throw error;
    return data;
  }

  async create(request: CreateUserRuleRequest): Promise<UserRule> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.db
      .from('user_rules')
      .insert({ ...request, user_id: user.id, created_by: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, request: UpdateUserRuleRequest): Promise<UserRule> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.db
      .from('user_rules')
      .update({ ...request, updated_by: user.id, updated_at: new Date().toISOString() })
      .eq('rule_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: number): Promise<void> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { error } = await this.db
      .from('user_rules')
      .update({ is_deleted: true, deleted_at: new Date().toISOString(), deleted_by: user.id })
      .eq('rule_id', id);

    if (error) throw error;
  }
}
