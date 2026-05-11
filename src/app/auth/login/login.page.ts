import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonText, IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline } from 'ionicons/icons';
import { AuthService } from '../../shared/features/auth/services/auth.service';
import { DynamicForm } from '../../shared/features/dynamic-form/dynamic-form';
import { FieldBase } from '../../shared/features/dynamic-form/interfaces/field-props';
import { formFields } from '../../shared/features/dynamic-form/utils/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, IonText, IonSpinner,
    DynamicForm,
  ],
})
export class LoginPage {
  private authService = inject(AuthService);
  private router      = inject(Router);

  loading = signal(false);
  error   = signal<string | null>(null);

  readonly loginFields: FieldBase<string>[] = formFields['loginForm'].fields;

  constructor() {
    addIcons({ logInOutline });
  }

  async onData(payload: string): Promise<void> {
    const { email, password } = JSON.parse(payload) as { email: string; password: string };
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.authService.signIn(email, password);
      this.router.navigate(['/onboarding']);
    } catch (e: any) {
      this.error.set(e.message ?? 'Error al iniciar sesión');
    } finally {
      this.loading.set(false);
    }
  }
}
