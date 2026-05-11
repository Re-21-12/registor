import { Component, OnInit, inject, signal } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonFab, IonFabButton, IonIcon, IonSpinner, IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, barChartOutline, alertCircleOutline } from 'ionicons/icons';
import { DatePipe } from '@angular/common';
import { MeassureService } from '../../shared/features/health/services/meassure.service';
import { PatientProfileService } from '../../shared/features/health/services/patient-profile.service';
import { GlucoseStatusPipe } from '../../shared/features/health/pipes/glucose-status.pipe';
import { GlucoseColorDirective } from '../../shared/features/health/directives/glucose-color.directive';
import { Meassure, GlucoseStatus } from '../../shared/features/health/types';

@Component({
  selector:    'app-measurements',
  templateUrl: 'measurements.page.html',
  styleUrls:   ['measurements.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonFab, IonFabButton, IonIcon, IonSpinner, IonText,
    DatePipe, GlucoseStatusPipe, GlucoseColorDirective,
  ],
})
export class MeasurementsPage implements OnInit {
  private meassureService       = inject(MeassureService);
  private patientProfileService = inject(PatientProfileService);

  measurements = signal<Meassure[]>([]);
  loading      = signal(true);
  error        = signal<string | null>(null);

  get targetMin(): number { return this.patientProfileService.currentProfile()?.target_min_mgdl ?? 70; }
  get targetMax(): number { return this.patientProfileService.currentProfile()?.target_max_mgdl ?? 140; }

  constructor() {
    addIcons({ add, barChartOutline, alertCircleOutline });
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.patientProfileService.loadCurrentProfile();
      const data = await this.meassureService.getAll();
      this.measurements.set(data);
    } catch (e: any) {
      this.error.set(e.message);
    } finally {
      this.loading.set(false);
    }
  }

  statusOf(value: number): GlucoseStatus {
    if (value < this.targetMin) return 'low';
    if (value > this.targetMax) return 'high';
    return 'in-range';
  }
}
