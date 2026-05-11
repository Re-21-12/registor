import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '../../auth/services/supabase.service';
import { AuthService } from '../../auth/services/auth.service';
import { Permission } from '../types';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private supabaseService = inject(SupabaseService);
  private authService     = inject(AuthService);

  userPermissions = signal<Permission[]>([]);

  private get db() {
    return this.supabaseService.getDatabase().schema('acl');
  }

  async loadUserPermissions(): Promise<void> {
    const user = this.authService.getCurrentUserSync();
    if (!user) return;

    const { data, error } = await this.db
      .from('user_role')
      .select('role:role_id(role_permission(permission:permission_id(*)))')
      .eq('user_id', user.id)
      .eq('is_deleted', false);

    if (error) throw error;

    const permissions: Permission[] = (data ?? []).flatMap((ur: any) =>
      (ur.role?.role_permission ?? []).map((rp: any) => rp.permission),
    );

    const unique = permissions.filter(
      (p, i, arr) => arr.findIndex((x) => x.permission_id === p.permission_id) === i,
    );

    this.userPermissions.set(unique);
  }

  hasPermission(code: string): boolean {
    return this.userPermissions().some((p) => p.code === code);
  }

  getErrorFor(code: string): { error_code: string | null; error_message: string | null } | null {
    const perm = this.userPermissions().find((p) => p.code === code);
    if (!perm) return { error_code: 'ERR_PERMISSION_NOT_FOUND', error_message: 'Permission not found' };
    return null;
  }
}
