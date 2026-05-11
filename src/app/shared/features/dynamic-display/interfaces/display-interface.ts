export interface DisplayColumn {
  field: string;
  header: string;
}

export interface DisplayProps {
  header: string;
  columns: DisplayColumn[];
  data: any[];
  rows: number;
  rowsPerPageOptions: number[];
  actions: DisplayAction[];
  routeBase?: string;
  rowIdField?: string;
  loading?: boolean;
  /** Campo cuyo valor se usará como título en la vista de cards */
  cardTitleField?: string;
  /** Campo cuyo valor se usará como subtítulo en la vista de cards */
  cardSubtitleField?: string;
}

export type DisplayAction = 'view' | 'update' | 'delete' | 'insert';

export type DisplayView = 'table' | 'cards';

export type BadgeSeverity = 'success' | 'warning' | 'danger' | 'medium' | 'primary';
