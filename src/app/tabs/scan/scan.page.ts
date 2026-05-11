import { Component, inject, signal } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonSpinner, IonText, IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, checkmarkCircle, closeCircle, alertCircle } from 'ionicons/icons';
import { MeassureScanService } from '../../shared/features/health/services/meassure-scan.service';
import { MeassureScan } from '../../shared/features/health/types';
import { ScanStatus } from '../../shared/features/health/enums';

@Component({
  selector:    'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls:   ['scan.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
    IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonSpinner, IonText, IonBadge,
  ],
})
export class ScanPage {
  private scanService = inject(MeassureScanService);

  ScanStatus   = ScanStatus;
  currentScan  = signal<MeassureScan | null>(null);
  uploading    = signal(false);
  error        = signal<string | null>(null);

  constructor() {
    addIcons({ camera, checkmarkCircle, closeCircle, alertCircle });
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (!file) return;

    this.uploading.set(true);
    this.error.set(null);

    try {
      const path = await this.scanService.uploadImage(file, file.name);
      const scan = await this.scanService.create({
        user_id:      '',
        status_id:    0,
        storage_path: path,
      });
      this.currentScan.set(scan);
    } catch (e: any) {
      this.error.set(e.message);
    } finally {
      this.uploading.set(false);
    }
  }

  statusColor(statusId: number): string {
    const map: Record<number, string> = {
      1: 'medium',
      2: 'primary',
      3: 'success',
      4: 'danger',
      5: 'warning',
    };
    return map[statusId] ?? 'medium';
  }
}
