import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../auth/services/supabase.service';
import { AuthService } from '../../auth/services/auth.service';
import { Meassure, CreateMeassureRequest, UpdateMeassureRequest } from '../types';

@Injectable({ providedIn: 'root' })
export class MeassureService {
  private supabaseService = inject(SupabaseService);
  private authService     = inject(AuthService);

  private get db() {
    return this.supabaseService.getDatabase().schema('health');
  }

  async getAll(limit = 50): Promise<Meassure[]> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.db
      .from('meassure')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_deleted', false)
      .order('measured_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  }

  async getById(id: number): Promise<Meassure> {
    const { data, error } = await this.db
      .from('meassure')
      .select('*')
      .eq('meassure_id', id)
      .eq('is_deleted', false)
      .single();

    if (error) throw error;
    return data;
  }

  async getByDateRange(from: string, to: string): Promise<Meassure[]> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.db
      .from('meassure')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_deleted', false)
      .gte('measured_at', from)
      .lte('measured_at', to)
      .order('measured_at', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async create(request: CreateMeassureRequest): Promise<Meassure> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.db
      .from('meassure')
      .insert({ ...request, user_id: user.id, created_by: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, request: UpdateMeassureRequest): Promise<Meassure> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.db
      .from('meassure')
      .update({ ...request, updated_by: user.id, updated_at: new Date().toISOString() })
      .eq('meassure_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: number): Promise<void> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { error } = await this.db
      .from('meassure')
      .update({ is_deleted: true, deleted_at: new Date().toISOString(), deleted_by: user.id })
      .eq('meassure_id', id);

    if (error) throw error;
  }
}
