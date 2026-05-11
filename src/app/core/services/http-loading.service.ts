import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpLoadingService {
  private _count = signal(0);

  isLoading = computed(() => this._count() > 0);

  start(): void {
    this._count.update((c) => c + 1);
  }

  stop(): void {
    this._count.update((c) => Math.max(0, c - 1));
  }
}
