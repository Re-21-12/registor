import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../auth/services/supabase.service';
import { AuthService } from '../../auth/services/auth.service';
import { Profile } from '../types/profile.types';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);

  async getProfile(): Promise<Profile> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabaseService
      .getDatabase()
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  async getProfileById(userId: string): Promise<Profile> {
    const { data, error } = await this.supabaseService
      .getDatabase()
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    const user = this.authService.getCurrentUserSync();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabaseService
      .getDatabase()
      .from('profiles')
      .update(profile)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProfileById(
    userId: string,
    profile: Partial<Profile>,
  ): Promise<Profile> {
    const { data, error } = await this.supabaseService
      .getDatabase()
      .from('profiles')
      .update(profile)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async isAdmin(): Promise<boolean> {
    try {
      const profile = await this.getProfile();
      return profile.role === 'admin';
    } catch {
      return false;
    }
  }
}
