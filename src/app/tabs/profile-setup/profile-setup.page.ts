import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonText,
} from '@ionic/angular/standalone';
import { PatientProfileService } from '../../shared/features/health/services/patient-profile.service';
import { PatientProfileForm } from '../../shared/features/health/components/patient-profile-form/patient-profile-form';
import { CreatePatientProfileRequest } from '../../shared/features/health/types';

@Component({
  selector: 'app-profile-setup',
  templateUrl: './profile-setup.page.html',
  styleUrls: ['./profile-setup.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonText,
    PatientProfileForm,
  ],
})
export class ProfileSetupPage implements OnInit {
  private profileService = inject(PatientProfileService);
  private router         = inject(Router);

  error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    // initial data pre-load if needed — handled by PatientProfileForm internally
  }

  async onSave(request: CreatePatientProfileRequest): Promise<void> {
    try {
      await this.profileService.create(request);
      this.router.navigate(['/tabs/measurements']);
    } catch (e: any) {
      this.error.set(e.message);
    }
  }

  onCancel(): void {
    this.router.navigate(['/tabs/profile']);
  }
}
