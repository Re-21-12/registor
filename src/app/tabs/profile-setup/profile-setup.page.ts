import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonSpinner, IonText,
} from '@ionic/angular/standalone';
import { PatientProfileService } from '../../shared/features/health/services/patient-profile.service';
import { CatalogService } from '../../shared/features/acl/services/catalog.service';
import { PatientProfileForm } from '../../shared/features/health/components/patient-profile-form/patient-profile-form';
import { Catalog } from '../../shared/features/acl/types';
import { CreatePatientProfileRequest } from '../../shared/features/health/types';

@Component({
  selector: 'app-profile-setup',
  templateUrl: './profile-setup.page.html',
  styleUrls: ['./profile-setup.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonSpinner, IonText,
    PatientProfileForm,
  ],
})
export class ProfileSetupPage implements OnInit {
  private profileService = inject(PatientProfileService);
  private catalogService = inject(CatalogService);
  private router         = inject(Router);

  diabetesTypeOptions = signal<Catalog[]>([]);
  genderOptions       = signal<Catalog[]>([]);
  loading             = signal(true);
  error               = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      const [diabetesTypes, genders] = await Promise.all([
        this.catalogService.getByTable('patient_profile'),
        this.catalogService.getByTable('gender'),
      ]);
      this.diabetesTypeOptions.set(diabetesTypes);
      this.genderOptions.set(genders);
    } catch (e: any) {
      this.error.set(e.message);
    } finally {
      this.loading.set(false);
    }
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
