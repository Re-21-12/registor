import { Injectable, Type } from '@angular/core';
import { ModalController } from '@ionic/angular';

export interface ModalOptions {
  title?: string;
  componentProps?: Record<string, any>;
  cssClass?: string;
  breakpoints?: number[];
  initialBreakpoint?: number;
}

@Injectable({ providedIn: 'root' })
export class DynamicModalService {
  constructor(private modalCtrl: ModalController) {}

  /**
   * Abre un modal con el componente dado y espera su resultado.
   * Retorna el dato emitido al dismiss o undefined si se cerró sin acción.
   */
  async open<T = any>(component: Type<any>, options: ModalOptions = {}): Promise<T | undefined> {
    const modal = await this.modalCtrl.create({
      component,
      componentProps: options.componentProps,
      cssClass: options.cssClass,
      breakpoints: options.breakpoints,
      initialBreakpoint: options.initialBreakpoint,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss<T>();
    return data;
  }

  /** Cierra el modal superior activo con un valor opcional. */
  async dismiss(data?: any): Promise<void> {
    await this.modalCtrl.dismiss(data);
  }
}
