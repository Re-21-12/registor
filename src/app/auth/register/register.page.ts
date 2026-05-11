import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonText, IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personAddOutline } from 'ionicons/icons';
import { AuthService } from '../../shared/features/auth/services/auth.service';
import { DynamicForm } from '../../shared/features/dynamic-form/dynamic-form';
import { FieldBase } from '../../shared/features/dynamic-form/interfaces/field-props';
import { formFields } from '../../shared/features/dynamic-form/utils/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, IonText, IonSpinner,
    DynamicForm,
  ],
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router      = inject(Router);

  loading = signal(false);
  error   = signal<string | null>(null);

  readonly registerFields: FieldBase<string>[] = formFields['registerForm'].fields;

  constructor() {
    addIcons({ personAddOutline });
  }

  async onData(payload: string): Promise<void> {
    const { fullName, email, password, confirmPassword } =
      JSON.parse(payload) as { fullName: string; email: string; password: string; confirmPassword: string };

    if (password !== confirmPassword) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    try {
      await this.authService.signUp(email, password, fullName);
      this.router.navigate(['/onboarding']);
    } catch (e: any) {
      this.error.set(e.message ?? 'Error al registrarse');
    } finally {
      this.loading.set(false);
    }
  }
}
