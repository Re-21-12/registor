import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonBadge, IonButton, IonIcon, IonChip, IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline, medkitOutline } from 'ionicons/icons';
import { UserRule } from '../../types';

@Component({
  selector: 'app-user-rule-card',
  templateUrl: './user-rule-card.html',
  styleUrl: './user-rule-card.scss',
  imports: [
    DatePipe,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonBadge, IonButton, IonIcon, IonChip, IonLabel,
  ],
})
export class UserRuleCard {
  rule           = input.required<UserRule>();
  dosisLabel     = input<string>('');
  routeLabel     = input<string>('');
  unitLabel      = input<string>('');
  frequencyLabel = input<string>('');
  showActions    = input<boolean>(true);

  editClicked   = output<UserRule>();
  deleteClicked = output<number>();

  isExpired = computed(() => {
    const until = this.rule().valid_until;
    return !!until && new Date(until) < new Date();
  });

  statusColor = computed(() => {
    if (!this.rule().is_active) return 'medium';
    if (this.isExpired())       return 'warning';
    return 'success';
  });

  statusLabel = computed(() => {
    if (!this.rule().is_active) return 'Inactivo';
    if (this.isExpired())       return 'Vencido';
    return 'Activo';
  });

  constructor() {
    addIcons({ createOutline, trashOutline, medkitOutline });
  }
}
