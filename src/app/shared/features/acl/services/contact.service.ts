import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../auth/services/supabase.service';
import { AuthService } from '../../auth/services/auth.service';
import { Contact, CreateContactRequest, UpdateContactRequest } from '../types';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private supabaseService = inject(SupabaseService);
  private authService     = inject(AuthService);

  private get db() {
    return this.supabaseService.getDatabase().schema('acl');
  }

  async getAll(): Promise<Contact[]> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.db
      .from('contact')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_deleted', false)
      .order('is_primary', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async create(request: CreateContactRequest): Promise<Contact> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.db
      .from('contact')
      .insert({ ...request, user_id: user.id, created_by: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, request: UpdateContactRequest): Promise<Contact> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.db
      .from('contact')
      .update({ ...request, updated_by: user.id, updated_at: new Date().toISOString() })
      .eq('contact_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { error } = await this.db
      .from('contact')
      .update({ is_deleted: true, deleted_at: new Date().toISOString(), deleted_by: user.id })
      .eq('contact_id', id);

    if (error) throw error;
  }
}
