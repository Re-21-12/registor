import { Component, OnInit, inject, signal } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonSpinner, IonText, IonAvatar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircle, create } from 'ionicons/icons';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../shared/features/auth/services/auth.service';
import { PatientProfileService } from '../../shared/features/health/services/patient-profile.service';
import { PatientProfile } from '../../shared/features/health/types';

@Component({
  selector:    'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls:   ['profile.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton, IonIcon,
    IonSpinner, IonText, IonAvatar, DatePipe,
  ],
})
export class ProfilePage implements OnInit {
  private authService           = inject(AuthService);
  private patientProfileService = inject(PatientProfileService);

  profile = signal<PatientProfile | null>(null);
  loading = signal(true);
  error   = signal<string | null>(null);

  get userEmail(): string {
    return this.authService.getCurrentUserSync()?.email ?? '';
  }

  constructor() {
    addIcons({ personCircle, create });
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.patientProfileService.loadCurrentProfile();
      this.profile.set(this.patientProfileService.currentProfile());
    } catch (e: any) {
      this.error.set(e.message);
    } finally {
      this.loading.set(false);
    }
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
  }
}
