import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  getAuth() {
    return this.supabase.auth;
  }

  getDatabase() {
    return this.supabase;
  }
}
