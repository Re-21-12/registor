import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../auth/services/supabase.service';
import { AuthService } from '../../auth/services/auth.service';
import { MeassureScan, CreateMeassureScanRequest, UpdateMeassureScanRequest } from '../types';

const BUCKET = 'glucometer-scans';

@Injectable({ providedIn: 'root' })
export class MeassureScanService {
  private supabaseService = inject(SupabaseService);
  private authService     = inject(AuthService);

  private get db() {
    return this.supabaseService.getDatabase().schema('health');
  }

  private get storage() {
    return this.supabaseService.getDatabase().storage;
  }

  async getAll(): Promise<MeassureScan[]> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.db
      .from('meassure_scan')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_deleted', false)
      .order('scanned_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async getById(id: string): Promise<MeassureScan> {
    const { data, error } = await this.db
      .from('meassure_scan')
      .select('*')
      .eq('scan_id', id)
      .eq('is_deleted', false)
      .single();

    if (error) throw error;
    return data;
  }

  async uploadImage(file: File | Blob, fileName: string): Promise<string> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const path = `${user.id}/${Date.now()}_${fileName}`;

    const { error } = await this.storage
      .from(BUCKET)
      .upload(path, file, { upsert: false });

    if (error) throw error;
    return path;
  }

  async create(request: CreateMeassureScanRequest): Promise<MeassureScan> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.db
      .from('meassure_scan')
      .insert({ ...request, user_id: user.id, created_by: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, request: UpdateMeassureScanRequest): Promise<MeassureScan> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.db
      .from('meassure_scan')
      .update({ ...request, updated_by: user.id, updated_at: new Date().toISOString() })
      .eq('scan_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  getImageUrl(storagePath: string): string {
    const { data } = this.storage.from(BUCKET).getPublicUrl(storagePath);
    return data.publicUrl;
  }

  async delete(id: string): Promise<void> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { error } = await this.db
      .from('meassure_scan')
      .update({ is_deleted: true, deleted_at: new Date().toISOString(), deleted_by: user.id })
      .eq('scan_id', id);

    if (error) throw error;
  }
}
