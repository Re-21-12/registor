import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../auth/services/supabase.service';
import { AuditLog } from '../types/audit.types';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private supabaseService = inject(SupabaseService);

  async getAuditLogs(tableName?: string, recordId?: string, limit: number = 100): Promise<AuditLog[]> {
    let query = this.supabaseService.getDatabase()
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (tableName) {
      query = query.eq('table_name', tableName);
    }

    if (recordId) {
      query = query.eq('record_id', recordId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data ?? [];
  }

  async getRecordHistory(tableName: string, recordId: string): Promise<AuditLog[]> {
    const { data, error } = await this.supabaseService.getDatabase()
      .from('audit_logs')
      .select('*')
      .eq('table_name', tableName)
      .eq('record_id', recordId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async getTableAuditTrail(tableName: string, limit: number = 50): Promise<AuditLog[]> {
    const { data, error } = await this.supabaseService.getDatabase()
      .from('audit_logs')
      .select('*')
      .eq('table_name', tableName)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  }

  async getUserActivity(userId: string, limit: number = 50): Promise<AuditLog[]> {
    const { data, error } = await this.supabaseService.getDatabase()
      .from('audit_logs')
      .select('*')
      .eq('changed_by', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  }
}
