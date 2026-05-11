import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

export type ToastPosition = 'top' | 'bottom' | 'middle';
export type ToastColor = 'success' | 'danger' | 'warning' | 'primary' | 'secondary' | 'dark';

export interface ToastOptions {
  message: string;
  color?: ToastColor;
  duration?: number;
  position?: ToastPosition;
  header?: string;
  icon?: string;
}

@Injectable({ providedIn: 'root' })
export class DynamicToastService {
  constructor(private toastCtrl: ToastController) {}

  async show(options: ToastOptions): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: options.message,
      header: options.header,
      color: options.color ?? 'primary',
      duration: options.duration ?? 3000,
      position: options.position ?? 'top',
      icon: options.icon,
      buttons: [{ icon: 'close', role: 'cancel', side: 'end' }],
    });
    await toast.present();
  }

  success(message: string, header?: string): Promise<void> {
    return this.show({ message, header, color: 'success', icon: 'checkmark-circle-outline' });
  }

  error(message: string, header?: string): Promise<void> {
    return this.show({ message, header, color: 'danger', icon: 'alert-circle-outline', duration: 4000 });
  }

  warning(message: string, header?: string): Promise<void> {
    return this.show({ message, header, color: 'warning', icon: 'warning-outline' });
  }

  info(message: string, header?: string): Promise<void> {
    return this.show({ message, header, color: 'primary', icon: 'information-circle-outline' });
  }
}
