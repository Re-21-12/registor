import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '../../auth/services/supabase.service';
import { AuthService } from '../../auth/services/auth.service';
import { PatientProfile, CreatePatientProfileRequest, UpdatePatientProfileRequest } from '../types';

@Injectable({ providedIn: 'root' })
export class PatientProfileService {
  private supabaseService = inject(SupabaseService);
  private authService     = inject(AuthService);

  currentProfile = signal<PatientProfile | null>(null);

  private get db() {
    return this.supabaseService.getDatabase().schema('health');
  }

  async loadCurrentProfile(): Promise<void> {
    const user = this.authService.getCurrentUserSync();
    if (!user) return;

    const { data, error } = await this.db
      .from('patient_profile')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_deleted', false)
      .maybeSingle();

    if (error) throw error;
    this.currentProfile.set(data);
  }

  async create(request: CreatePatientProfileRequest): Promise<PatientProfile> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.db
      .from('patient_profile')
      .insert({ ...request, user_id: user.id, created_by: user.id })
      .select()
      .single();

    if (error) throw error;
    this.currentProfile.set(data);
    return data;
  }

  async update(id: string, request: UpdatePatientProfileRequest): Promise<PatientProfile> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.db
      .from('patient_profile')
      .update({ ...request, updated_by: user.id, updated_at: new Date().toISOString() })
      .eq('patient_profile_id', id)
      .select()
      .single();

    if (error) throw error;
    this.currentProfile.set(data);
    return data;
  }

  async delete(id: string): Promise<void> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { error } = await this.db
      .from('patient_profile')
      .update({ is_deleted: true, deleted_at: new Date().toISOString(), deleted_by: user.id })
      .eq('patient_profile_id', id);

    if (error) throw error;
    this.currentProfile.set(null);
  }
}
