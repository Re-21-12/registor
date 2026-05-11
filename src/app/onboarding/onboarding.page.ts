import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonProgressBar, IonSpinner, IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, arrowBackOutline, checkmarkDoneOutline, pulseOutline } from 'ionicons/icons';
import { PatientProfileService } from '../shared/features/health/services/patient-profile.service';
import { MeassureService } from '../shared/features/health/services/meassure.service';
import { AuthService } from '../shared/features/auth/services/auth.service';
import { PatientProfileForm } from '../shared/features/health/components/patient-profile-form/patient-profile-form';
import { MeasurementForm } from '../shared/features/health/components/measurement-form/measurement-form';
import { CreatePatientProfileRequest, CreateMeassureRequest } from '../shared/features/health/types';

export type OnboardingStep = 'welcome' | 'profile' | 'measurement' | 'done';

const STEPS: OnboardingStep[] = ['welcome', 'profile', 'measurement', 'done'];

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, IonProgressBar, IonSpinner, IonText,
    PatientProfileForm, MeasurementForm,
  ],
})
export class OnboardingPage implements OnInit {
  private profileService  = inject(PatientProfileService);
  private meassureService = inject(MeassureService);
  private authService     = inject(AuthService);
  private router          = inject(Router);

  currentStep = signal<OnboardingStep>('welcome');
  loading     = signal(true);
  saving      = signal(false);
  error       = signal<string | null>(null);

  userName = computed(() => {
    const user = this.authService.getCurrentUserSync();
    return user?.user_metadata?.['full_name']?.split(' ')[0] ?? 'bienvenido';
  });

  progress = computed(() => {
    const idx = STEPS.indexOf(this.currentStep());
    return (idx + 1) / STEPS.length;
  });

  stepIndex = computed(() => STEPS.indexOf(this.currentStep()));

  constructor() {
    addIcons({ arrowForwardOutline, arrowBackOutline, checkmarkDoneOutline, pulseOutline });
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.profileService.loadCurrentProfile();
      if (this.profileService.currentProfile()) {
        this.router.navigate(['/tabs/measurements']);
        return;
      }
    } catch (e: any) {
      this.error.set(e.message);
    } finally {
      this.loading.set(false);
    }
  }

  goNext(): void {
    const idx = STEPS.indexOf(this.currentStep());
    if (idx < STEPS.length - 1) this.currentStep.set(STEPS[idx + 1]);
  }

  goBack(): void {
    const idx = STEPS.indexOf(this.currentStep());
    if (idx > 0) this.currentStep.set(STEPS[idx - 1]);
  }

  async onProfileSave(request: CreatePatientProfileRequest): Promise<void> {
    this.saving.set(true);
    this.error.set(null);
    try {
      await this.profileService.create(request);
      this.goNext();
    } catch (e: any) {
      this.error.set(e.message);
    } finally {
      this.saving.set(false);
    }
  }

  async onMeasurementSave(request: CreateMeassureRequest): Promise<void> {
    this.saving.set(true);
    this.error.set(null);
    try {
      await this.meassureService.create(request);
      this.goNext();
    } catch (e: any) {
      this.error.set(e.message);
    } finally {
      this.saving.set(false);
    }
  }

  skipMeasurement(): void {
    this.goNext();
  }

  finish(): void {
    this.router.navigate(['/tabs/measurements']);
  }
}
