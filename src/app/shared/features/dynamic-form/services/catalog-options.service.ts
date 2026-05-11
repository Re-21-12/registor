import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '../../auth/services/supabase.service';
import { FieldOptionSource } from '../interfaces/field-props';

export interface CatalogOption {
  key:   string | number;
  value: string;
}

interface FieldState {
  options:  CatalogOption[];
  offset:   number;          // cursor: próximo índice a cargar
  hasMore:  boolean;
  loading:  boolean;
}

@Injectable({ providedIn: 'root' })
export class CatalogOptionsService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly _state = signal<Record<string, FieldState>>({});

  // ── Lectura de estado ────────────────────────────────────
  getOptions(fieldKey: string): CatalogOption[] {
    return this._state()[fieldKey]?.options ?? [];
  }

  hasMore(fieldKey: string): boolean {
    return this._state()[fieldKey]?.hasMore ?? false;
  }

  isLoading(fieldKey: string): boolean {
    return this._state()[fieldKey]?.loading ?? false;
  }

  // ── API pública ──────────────────────────────────────────

  /** Reinicia y carga la primera página. */
  async loadOptions(fieldKey: string, source: FieldOptionSource): Promise<void> {
    this._set(fieldKey, { options: [], offset: 0, hasMore: false, loading: true });
    await this._fetchPage(fieldKey, source, 0);
  }

  /** Carga la siguiente página (cursor pagination). */
  async loadMore(fieldKey: string, source: FieldOptionSource): Promise<void> {
    const state = this._state()[fieldKey];
    if (!state?.hasMore || state.loading) return;
    this._patch(fieldKey, { loading: true });
    await this._fetchPage(fieldKey, source, state.offset);
  }

  /**
   * Carga todas las páginas secuencialmente.
   * Útil para SELECT donde el usuario necesita ver todas las opciones.
   */
  async loadAll(fieldKey: string, source: FieldOptionSource): Promise<void> {
    await this.loadOptions(fieldKey, source);
    while (this._state()[fieldKey]?.hasMore) {
      await this.loadMore(fieldKey, source);
    }
  }

  clearOptions(fieldKey: string): void {
    this._state.update(s => {
      const next = { ...s };
      delete next[fieldKey];
      return next;
    });
  }

  // ── Implementación interna ───────────────────────────────

  private async _fetchPage(
    fieldKey: string,
    source:   FieldOptionSource,
    from:     number,
  ): Promise<void> {
    const pageSize   = source.pageSize  ?? 50;
    const to         = from + pageSize  - 1;
    const valueField = source.valueField ?? 'catalog_id';
    const labelField = source.labelField ?? 'description';
    const orderField = source.orderBy   ?? labelField;
    const ascending  = (source.order    ?? 'asc') === 'asc';

    try {
      let query = this.supabaseService
        .getClient()
        .schema(source.schema ?? 'public')
        .from(source.table)
        .select('*')
        .order(orderField, { ascending })
        .range(from, to);

      if (source.filterField && source.filterValue != null) {
        query = query.eq(source.filterField, source.filterValue);
      }

      if (!source.includeDeleted) {
        query = query.eq('is_deleted', false);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`[CatalogOptions] "${fieldKey}":`, error.message);
        this._patch(fieldKey, { loading: false });
        return;
      }

      const newOptions: CatalogOption[] = (data ?? [])
        .map(item => {
          const key   = item[valueField];
          const value = item[labelField];
          if (key == null) return null;
          return { key, value: String(value ?? key) };
        })
        .filter((o): o is CatalogOption => o !== null);

      this._state.update(s => ({
        ...s,
        [fieldKey]: {
          options: [...(s[fieldKey]?.options ?? []), ...newOptions],
          offset:  from + newOptions.length,
          hasMore: newOptions.length === pageSize,
          loading: false,
        },
      }));
    } catch (err) {
      console.error(`[CatalogOptions] "${fieldKey}" unexpected:`, err);
      this._patch(fieldKey, { loading: false });
    }
  }

  private _set(fieldKey: string, state: FieldState): void {
    this._state.update(s => ({ ...s, [fieldKey]: state }));
  }

  private _patch(fieldKey: string, partial: Partial<FieldState>): void {
    this._state.update(s => ({
      ...s,
      [fieldKey]: { ...s[fieldKey], ...partial },
    }));
  }
}
