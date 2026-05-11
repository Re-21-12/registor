import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../auth/services/supabase.service';
import { Catalog } from '../types';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private supabaseService = inject(SupabaseService);

  private get db() {
    return this.supabaseService.getDatabase().schema('acl');
  }

  async getByTable(tableName: string): Promise<Catalog[]> {
    const { data, error } = await this.db
      .from('catalog')
      .select('*')
      .eq('table_name', tableName)
      .eq('is_deleted', false)
      .order('description', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async getByNemonic(neumonic: string): Promise<Catalog | null> {
    const { data, error } = await this.db
      .from('catalog')
      .select('*')
      .eq('neumonic', neumonic)
      .eq('is_deleted', false)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getById(id: number): Promise<Catalog> {
    const { data, error } = await this.db
      .from('catalog')
      .select('*')
      .eq('option_id', id)
      .eq('is_deleted', false)
      .single();

    if (error) throw error;
    return data;
  }
}
