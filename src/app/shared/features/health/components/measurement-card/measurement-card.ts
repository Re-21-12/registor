import { Component, computed, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonBadge, IonButton, IonIcon, IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';
import { Meassure, GlucoseStatus } from '../../types';
import { GlucoseStatusPipe } from '../../pipes/glucose-status.pipe';
import { GlucoseColorDirective } from '../../directives/glucose-color.directive';
import { MgdlToMmolPipe } from '../../pipes/mgdl-to-mmol.pipe';

@Component({
  selector: 'app-measurement-card',
  templateUrl: './measurement-card.html',
  styleUrl: './measurement-card.scss',
  imports: [
    DatePipe, GlucoseStatusPipe, GlucoseColorDirective, MgdlToMmolPipe,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonBadge, IonButton, IonIcon, IonLabel,
  ],
})
export class MeasurementCard {
  meassure   = input.required<Meassure>();
  targetMin  = input<number>(70);
  targetMax  = input<number>(140);
  showActions = input<boolean>(true);

  editClicked   = output<Meassure>();
  deleteClicked = output<number>();

  status = computed<GlucoseStatus>(() => {
    const v = this.meassure().value_mgdl;
    if (v < this.targetMin()) return 'low';
    if (v > this.targetMax()) return 'high';
    return 'in-range';
  });

  badgeColor = computed(() => {
    const map: Record<GlucoseStatus, string> = {
      'low':      'warning',
      'in-range': 'success',
      'high':     'danger',
    };
    return map[this.status()];
  });

  statusLabel = computed(() => {
    const map: Record<GlucoseStatus, string> = {
      'low':      'Bajo',
      'in-range': 'Normal',
      'high':     'Alto',
    };
    return map[this.status()];
  });

  constructor() {
    addIcons({ createOutline, trashOutline });
  }
}
