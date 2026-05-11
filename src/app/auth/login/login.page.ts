import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonInput, IonItem, IonLabel, IonText, IonSpinner, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, logoGoogle } from 'ionicons/icons';
import { SupabaseAuthService } from '../../core/services/supabase-auth.service';
import { DynamicToastService } from '../../shared/features/dynamic-toast/dynamic-toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    ReactiveFormsModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonInput, IonItem, IonLabel, IonText, IonSpinner, IonIcon,
  ],
})
export class LoginPage {
  private readonly auth = inject(SupabaseAuthService);
  private readonly toast = inject(DynamicToastService);
  private readonly fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = signal(false);
  showPassword = signal(false);

  constructor() {
    addIcons({ mailOutline, lockClosedOutline, logoGoogle });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    try {
      const { email, password } = this.form.value;
      const { error } = await this.auth.signInWithPassword(email, password);
      if (error) await this.toast.error(error.message, 'Error al iniciar sesión');
    } finally {
      this.loading.set(false);
    }
  }

  async onGoogleLogin(): Promise<void> {
    await this.auth.signInWithOAuth('google');
  }

  togglePassword(): void { this.showPassword.set(!this.showPassword()); }

  get emailCtrl() { return this.form.get('email'); }
  get passwordCtrl() { return this.form.get('password'); }
}
