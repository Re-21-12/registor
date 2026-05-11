import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline, trashOutline, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-confirm-delete',
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons,
    IonButton, IonContent, IonIcon, IonText,
  ],
  templateUrl: './confirm-delete.html',
  styleUrl: './confirm-delete.scss',
})
export class ConfirmDeleteModal {
  /** Mensaje descriptivo opcional que se muestra en el cuerpo del modal */
  @Input() label?: string;
  /** Texto del botón de confirmación */
  @Input() confirmLabel = 'Eliminar';

  constructor(private modalCtrl: ModalController) {
    addIcons({ alertCircleOutline, trashOutline, closeOutline });
  }

  cancel() { this.modalCtrl.dismiss(false); }
  confirm() { this.modalCtrl.dismiss(true); }
}
