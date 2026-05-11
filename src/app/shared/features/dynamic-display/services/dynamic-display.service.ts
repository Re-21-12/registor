import { Injectable, signal, computed } from '@angular/core';
import { DisplayProps, DisplayColumn, DisplayAction } from '../interfaces/display-interface';

@Injectable()
export class DynamicDisplayService {
  private _data = signal<any[]>([]);
  private _columns = signal<DisplayColumn[]>([]);
  private _header = signal<string>('');
  private _rows = signal<number>(10);
  private _rowsPerPageOptions = signal<number[]>([5, 10, 20]);
  private _actions = signal<DisplayAction[]>(['view', 'update', 'delete']);
  private _routeBase = signal<string | undefined>(undefined);
  private _rowIdField = signal<string | undefined>(undefined);
  private _loading = signal<boolean>(false);
  private _cardTitleField = signal<string | undefined>(undefined);
  private _cardSubtitleField = signal<string | undefined>(undefined);

  private _currentPage = signal<number>(0);
  private _pageSize = signal<number>(10);

  displayProps = computed<DisplayProps>(() => ({
    header: this._header(),
    columns: this._columns(),
    data: this._data(),
    rows: this._rows(),
    rowsPerPageOptions: this._rowsPerPageOptions(),
    actions: this._actions(),
    routeBase: this._routeBase(),
    rowIdField: this._rowIdField(),
    loading: this._loading(),
    cardTitleField: this._cardTitleField(),
    cardSubtitleField: this._cardSubtitleField(),
  }));

  pagedData = computed(() => {
    const page = this._currentPage();
    const size = this._pageSize();
    const data = this._data();
    return data.slice(page * size, (page + 1) * size);
  });

  totalPages = computed(() => Math.ceil(this._data().length / this._pageSize()));
  currentPage = computed(() => this._currentPage());
  pageSize = computed(() => this._pageSize());
  totalItems = computed(() => this._data().length);

  initDisplay(props: Partial<DisplayProps>) {
    if (props.header !== undefined) this._header.set(props.header);
    if (props.columns) this._columns.set(props.columns);
    if (props.rows) { this._rows.set(props.rows); this._pageSize.set(props.rows); }
    if (props.rowsPerPageOptions) this._rowsPerPageOptions.set(props.rowsPerPageOptions);
    if (props.data) this._data.set(props.data);
    if (props.actions) this._actions.set(props.actions);
    if (props.routeBase) this._routeBase.set(props.routeBase);
    if (props.rowIdField) this._rowIdField.set(props.rowIdField);
    if (props.loading !== undefined) this._loading.set(props.loading);
    if (props.cardTitleField) this._cardTitleField.set(props.cardTitleField);
    if (props.cardSubtitleField) this._cardSubtitleField.set(props.cardSubtitleField);
  }

  setData(data: any[]) {
    this._data.set(data);
    this._currentPage.set(0);
  }

  setLoading(loading: boolean) {
    this._loading.set(loading);
  }

  goToPage(page: number) {
    const total = this.totalPages();
    if (page >= 0 && page < total) this._currentPage.set(page);
  }

  nextPage() { this.goToPage(this._currentPage() + 1); }
  prevPage() { this.goToPage(this._currentPage() - 1); }

  setPageSize(size: number) {
    this._pageSize.set(size);
    this._currentPage.set(0);
  }

  resolveRowId(rowData: Record<string, unknown>): string | null {
    const preferred = this._rowIdField();
    if (preferred && rowData[preferred] != null) return String(rowData[preferred]);
    const idField = Object.keys(rowData).find((k) => k.endsWith('_id'));
    return idField && rowData[idField] != null ? String(rowData[idField]) : null;
  }

  exportCSV() {
    const columns = this._columns();
    const data = this._data();
    const header = columns.map((c) => `"${c.header}"`).join(',');
    const rows = data.map((row) =>
      columns.map((c) => `"${String(row[c.field] ?? '')}"`).join(','),
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this._header() || 'export'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  reset() {
    this._data.set([]);
    this._currentPage.set(0);
    this._pageSize.set(10);
  }
}
