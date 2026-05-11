import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthChangeEvent, Provider, Session, User } from '@supabase/supabase-js';
import { jwtDecode } from 'jwt-decode';
import { SupabaseService } from './supabase.service';
import { environment } from '../../../environments/environment';

type JwtClaims = {
  user_role?: string;
};

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'user';
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseAuthService {
  private readonly _supabase = inject(SupabaseService);
  private readonly _router = inject(Router);

  // ── Señales – fuente única de verdad ──────────────────────────
  readonly session    = signal<Session | null>(null);
  readonly currentUser = signal<User | null>(null);
  readonly isLoggedIn = signal<boolean>(false);
  readonly role       = signal<string | null>(null);
  readonly authReady  = signal<boolean>(false);
  readonly profile    = signal<Profile | null>(null);

  private authReadyResolve!: () => void;
  private readonly authReadyPromise: Promise<void>;
  private authSubscription: { unsubscribe: () => void } | null = null;

  constructor() {
    this.authReadyPromise = new Promise((resolve) => {
      this.authReadyResolve = resolve;
    });
  }

  /** Los guards deben llamar esto antes de verificar sesión */
  waitForAuthReady(): Promise<void> {
    if (this.authReady()) return Promise.resolve();
    return this.authReadyPromise;
  }

  /** Inicia la escucha de cambios de estado auth (llamar desde AppComponent) */
  stateAuthChanges(): void {
    const { data: { subscription } } =
      this._supabase.client.auth.onAuthStateChange(async (event, session) => {
        await this._handleAuthState(event, session);
      });
    this.authSubscription = subscription;
  }

  private async _handleAuthState(event: AuthChangeEvent, session: Session | null): Promise<void> {
    switch (event) {
      case 'INITIAL_SESSION':
        if (session) {
          this._applySession(session);
          await this._loadProfile(session.user.id);
          await this._handleMetadata(session);
        } else {
          this._clearSession();
        }
        this.authReady.set(true);
        this.authReadyResolve();
        break;

      case 'SIGNED_IN':
        if (session) {
          this._applySession(session);
          await this._loadProfile(session.user.id);
          await this._handleMetadata(session);
        }
        break;

      case 'SIGNED_OUT':
        this._clearSession();
        this._router.navigate(['/auth/login']);
        break;

      case 'TOKEN_REFRESHED':
        if (session) this._applySession(session);
        break;

      case 'USER_UPDATED':
        if (session) this._applySession(session);
        break;
    }
  }

  private _applySession(session: Session): void {
    this.session.set(session);
    this.currentUser.set(session.user);
    this.isLoggedIn.set(true);
    try {
      const claims = jwtDecode<JwtClaims>(session.access_token);
      this.role.set(claims.user_role ?? null);
    } catch { /* token inválido o sin claim de rol */ }
  }

  private _clearSession(): void {
    this.session.set(null);
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.role.set(null);
    this.profile.set(null);
  }

  private async _handleMetadata(session: Session): Promise<void> {
    const meta = session.user.user_metadata;
    if (meta?.['force_password_change']) {
      this._router.navigate(['/auth/reset-password']);
    } else {
      this._router.navigate(['/tabs/tab1']);
    }
  }

  // ── Perfil ─────────────────────────────────────────────────────
  async _loadProfile(userId: string): Promise<void> {
    const { data } = await this._supabase.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) this.profile.set(data as Profile);
  }

  async updateProfile(updates: Partial<Omit<Profile, 'id' | 'role'>>): Promise<{ error: unknown }> {
    const userId = this.currentUser()?.id;
    if (!userId) return { error: 'No hay sesión activa' };
    const { error } = await this._supabase.client
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (!error) await this._loadProfile(userId);
    return { error };
  }

  // ── Sign In ────────────────────────────────────────────────────
  async signInWithPassword(email: string, password: string) {
    return this._supabase.client.auth.signInWithPassword({ email, password });
  }

  async signInWithOtp(email: string) {
    return this._supabase.client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: environment.authRedirect },
    });
  }

  async signInWithOAuth(provider: Provider) {
    return this._supabase.client.auth.signInWithOAuth({
      provider,
      options: { redirectTo: environment.authRedirect },
    });
  }

  // ── Sign Up ────────────────────────────────────────────────────
  async signUpWithPassword(email: string, password: string, fullName?: string) {
    return this._supabase.client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: environment.authRedirect,
        data: { full_name: fullName ?? '' },
      },
    });
  }

  // ── Password Reset ─────────────────────────────────────────────
  async requestPasswordReset(email: string) {
    return this._supabase.client.auth.resetPasswordForEmail(email, {
      redirectTo: environment.authRedirect,
    });
  }

  async setNewPassword(newPassword: string) {
    const { data, error } = await this._supabase.client.auth.updateUser({
      password: newPassword,
      data: { force_password_change: false },
    });
    if (!error) this._router.navigate(['/tabs/tab1']);
    return { data, error };
  }

  // ── Sign Out ───────────────────────────────────────────────────
  async signOut(): Promise<void> {
    await this._supabase.client.auth.signOut();
  }

  // ── Storage (avatares) ─────────────────────────────────────────
  async uploadAvatar(filePath: string, file: File) {
    return this._supabase.client.storage.from('avatars').upload(filePath, file);
  }

  async downloadAvatar(path: string) {
    return this._supabase.client.storage.from('avatars').download(path);
  }

  // ── Accesores ─────────────────────────────────────────────────
  get client() { return this._supabase.client; }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
