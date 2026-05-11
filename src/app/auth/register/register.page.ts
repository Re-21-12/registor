import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonInput, IonItem, IonLabel, IonText, IonSpinner, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, personOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { SupabaseAuthService } from '../../core/services/supabase-auth.service';
import { DynamicToastService } from '../../shared/features/dynamic-toast/dynamic-toast.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm  = control.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    ReactiveFormsModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonInput, IonItem, IonLabel, IonText, IonSpinner, IonIcon,
  ],
})
export class RegisterPage {
  private readonly auth = inject(SupabaseAuthService);
  private readonly toast = inject(DynamicToastService);
  private readonly fb = inject(FormBuilder);

  form: FormGroup = this.fb.group(
    {
      fullName:        ['', [Validators.required, Validators.minLength(2)]],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator },
  );

  loading = signal(false);
  showPassword = signal(false);
  registered = signal(false);

  constructor() {
    addIcons({ mailOutline, lockClosedOutline, personOutline, eyeOutline, eyeOffOutline });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    try {
      const { email, password, fullName } = this.form.value;
      const { error } = await this.auth.signUpWithPassword(email, password, fullName);
      if (error) {
        await this.toast.error(error.message, 'Error al registrarse');
      } else {
        this.registered.set(true);
        await this.toast.success('Revisa tu email para confirmar tu cuenta', 'Registro exitoso');
      }
    } finally {
      this.loading.set(false);
    }
  }

  togglePassword(): void { this.showPassword.set(!this.showPassword()); }

  get fullNameCtrl()        { return this.form.get('fullName'); }
  get emailCtrl()           { return this.form.get('email'); }
  get passwordCtrl()        { return this.form.get('password'); }
  get confirmPasswordCtrl() { return this.form.get('confirmPassword'); }
}
