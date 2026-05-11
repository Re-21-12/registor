import { Injectable } from '@angular/core';
import { DynamicToastService } from '../../shared/features/dynamic-toast/dynamic-toast.service';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private toast: DynamicToastService) {}

  notify(type: NotificationType, header: string, message: string): void {
    switch (type) {
      case 'success': this.toast.success(message, header); break;
      case 'error':   this.toast.error(message, header);   break;
      case 'warning': this.toast.warning(message, header); break;
      case 'info':    this.toast.info(message, header);    break;
    }
  }
}
