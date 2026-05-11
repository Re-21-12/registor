import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabseService = inject(SupabaseService);
  private currentUser$ = new BehaviorSubject<User | null>(null);
  currentUser = signal<User | null>(null);

  constructor() {
    this.initAuthState();
  }

  private initAuthState() {
    const auth = this.supabseService.getAuth();

    auth.onAuthStateChange((event, session) => {
      const user = session?.user ?? null;
      this.currentUser$.next(user);
      this.currentUser.set(user);
    });
  }

  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await this.supabseService.getAuth().signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabseService
      .getAuth()
      .signInWithPassword({
        email,
        password,
      });

    if (error) throw error;
    return data;
  }

  async signInWithGoogle() {
    const { data, error } = await this.supabseService
      .getAuth()
      .signInWithOAuth({
        provider: 'google',
      });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabseService.getAuth().signOut();
    if (error) throw error;
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  getCurrentUserSync(): User | null {
    return this.currentUser$.value;
  }

  async getSession() {
    const { data, error } = await this.supabseService.getAuth().getSession();
    if (error) throw error;
    return data.session;
  }

  isAuthenticated(): boolean {
    return this.currentUser$.value !== null;
  }
}
