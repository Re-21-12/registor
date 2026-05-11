import { Component, inject, signal } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonSpinner, IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, refreshOutline, checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { MeassureScanService } from '../../shared/features/health/services/meassure-scan.service';
import { OcrService } from '../../shared/features/health/services/ocr.service';
import { MeassureScan } from '../../shared/features/health/types';

@Component({
  selector:    'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls:   ['scan.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
    IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonSpinner, IonText,
  ],
})
export class ScanPage {
  private scanService = inject(MeassureScanService);
  private ocrService  = inject(OcrService);

  currentScan = signal<MeassureScan | null>(null);
  scanning    = signal(false);
  scanLabel   = signal('Escanear glucómetro');
  error       = signal<string | null>(null);

  constructor() {
    addIcons({ camera, refreshOutline, checkmarkCircleOutline, alertCircleOutline });
  }

  async onScan(): Promise<void> {
    this.scanning.set(true);
    this.scanLabel.set('Procesando…');
    this.error.set(null);
    this.currentScan.set(null);

    try {
      this.scanLabel.set('Reconociendo texto…');
      const result = await this.ocrService.captureAndScan();

      this.scanLabel.set('Guardando…');
      const path = await this.scanService.uploadImage(result.imageFile, result.imageName);

      const scan = await this.scanService.create({
        user_id:         '',
        status_id:       result.extractedValue !== null ? 3 : 5,
        storage_path:    path,
        ocr_raw_text:    result.rawText,
        ocr_confidence:  result.confidence,
        extracted_value: result.extractedValue,
        extracted_unit:  result.extractedUnit,
      });

      this.currentScan.set(scan);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error al escanear');
    } finally {
      this.scanning.set(false);
      this.scanLabel.set('Escanear glucómetro');
    }
  }

  retry(): void {
    this.currentScan.set(null);
    this.error.set(null);
  }
}
