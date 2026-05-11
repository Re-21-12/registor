import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonBadge, IonButton, IonIcon, IonProgressBar, IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, closeCircleOutline, alertCircleOutline, refreshOutline } from 'ionicons/icons';
import { MeassureScan } from '../../types';

@Component({
  selector: 'app-scan-result',
  templateUrl: './scan-result.html',
  styleUrl: './scan-result.scss',
  imports: [
    DatePipe,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonBadge, IonButton, IonIcon, IonProgressBar, IonText,
  ],
})
export class ScanResult {
  scan        = input.required<MeassureScan>();
  statusLabel = input<string>('');

  confirmScan = output<MeassureScan>();
  retryScan   = output<void>();

  isCompleted  = computed(() => !!this.scan().extracted_value && !this.scan().error_code);
  isFailed     = computed(() => !!this.scan().error_code);
  isProcessing = computed(() => !this.isCompleted() && !this.isFailed());

  confidenceBar = computed(() => (this.scan().ocr_confidence ?? 0) / 100);

  badgeColor = computed(() => {
    if (this.isCompleted())  return 'success';
    if (this.isFailed())     return 'danger';
    return 'primary';
  });

  statusIcon = computed(() => {
    if (this.isCompleted())  return 'checkmark-circle-outline';
    if (this.isFailed())     return 'close-circle-outline';
    return 'alert-circle-outline';
  });

  constructor() {
    addIcons({ checkmarkCircleOutline, closeCircleOutline, alertCircleOutline, refreshOutline });
  }
}
