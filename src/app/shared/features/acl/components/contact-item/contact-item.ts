import { Component, computed, input, output } from '@angular/core';
import {
  IonItem, IonLabel, IonBadge, IonButton, IonIcon, IonChip,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mailOutline, callOutline, logoWhatsapp,
  personOutline, trashOutline, checkmarkCircle, star,
} from 'ionicons/icons';
import { Contact } from '../../types';

const TYPE_ICON: Record<string, string> = {
  CT_EMAIL:     'mail-outline',
  CT_PHONE:     'call-outline',
  CT_WHATSAPP:  'logo-whatsapp',
  CT_EMERGENCY: 'person-outline',
};

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.html',
  styleUrl: './contact-item.scss',
  imports: [
    IonItem, IonLabel, IonBadge, IonButton, IonIcon, IonChip,
  ],
})
export class ContactItem {
  contact     = input.required<Contact>();
  typeNemonic = input<string>('');

  deleteClicked = output<string>();

  typeIcon = computed(() => TYPE_ICON[this.typeNemonic()] ?? 'person-outline');

  constructor() {
    addIcons({ mailOutline, callOutline, logoWhatsapp, personOutline, trashOutline, checkmarkCircle, star });
  }
}
