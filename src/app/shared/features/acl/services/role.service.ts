import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '../../auth/services/supabase.service';
import { AuthService } from '../../auth/services/auth.service';
import { Role } from '../types';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private supabaseService = inject(SupabaseService);
  private authService     = inject(AuthService);

  userRoles = signal<Role[]>([]);

  private get db() {
    return this.supabaseService.getDatabase().schema('acl');
  }

  async loadUserRoles(): Promise<void> {
    const user = this.authService.getCurrentUserSync();
    if (!user) return;

    const { data, error } = await this.db
      .from('user_role')
      .select('role:role_id(*)')
      .eq('user_id', user.id)
      .eq('is_deleted', false);

    if (error) throw error;
    this.userRoles.set((data ?? []).map((r: any) => r.role));
  }

  hasRole(code: string): boolean {
    return this.userRoles().some((r) => r.code === code);
  }

  hasMinLevel(level: number): boolean {
    return this.userRoles().some((r) => r.level <= level);
  }

  async getAll(): Promise<Role[]> {
    const { data, error } = await this.db
      .from('role')
      .select('*')
      .eq('is_deleted', false)
      .order('level', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }
}
