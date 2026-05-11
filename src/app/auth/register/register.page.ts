import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonInput, IonLabel, IonButton, IonIcon,
  IonNote, IonText, IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personAddOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { AuthService } from '../../shared/features/auth/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    ReactiveFormsModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonInput, IonLabel, IonButton, IonIcon,
    IonNote, IonText, IonSpinner,
  ],
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router      = inject(Router);

  loading      = signal(false);
  error        = signal<string | null>(null);
  showPassword = signal(false);

  form = new FormGroup({
    fullName:        new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    email:           new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password:        new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    addIcons({ personAddOutline, eyeOutline, eyeOffOutline });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, confirmPassword } = this.form.getRawValue();
    if (password !== confirmPassword) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const { email, fullName } = this.form.getRawValue();
      await this.authService.signUp(email, password, fullName);
      this.router.navigate(['/onboarding']);
    } catch (e: any) {
      this.error.set(e.message ?? 'Error al registrarse');
    } finally {
      this.loading.set(false);
    }
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }
}
