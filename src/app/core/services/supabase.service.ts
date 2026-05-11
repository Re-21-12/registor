import { inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { HttpLoadingService } from './http-loading.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly supabase: SupabaseClient;
  private readonly loadingService = inject(HttpLoadingService);
  private readonly notificationService = inject(NotificationService);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      global: {
        fetch: async (input, init) => {
          this.loadingService.start();
          try {
            const response = await fetch(input, init);
            if (!response.ok && this.shouldNotify(response.status)) {
              this.notificationService.notify(
                'error',
                'Atención',
                this.getMessageByStatus(response.status),
              );
            }
            return response;
          } catch {
            this.notificationService.notify(
              'error',
              'Sin conexión',
              'No hay conexión a internet o el servidor no responde.',
            );
            throw new Error('Network error');
          } finally {
            this.loadingService.stop();
          }
        },
      },
    });
  }

  private shouldNotify(status: number): boolean {
    return [400, 401, 403, 404, 429, 500].includes(status) || status >= 500;
  }

  private getMessageByStatus(status: number): string {
    const messages: Record<number, string> = {
      400: 'Solicitud incorrecta. Verifica los datos enviados.',
      401: 'Sesión expirada. Por favor, inicia sesión de nuevo.',
      403: 'No tienes permiso para acceder a este recurso.',
      404: 'El servidor no encontró el registro.',
      429: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.',
      500: 'Error interno del servidor. Inténtalo más tarde.',
    };
    return messages[status] ?? 'Ocurrió un error inesperado.';
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}
