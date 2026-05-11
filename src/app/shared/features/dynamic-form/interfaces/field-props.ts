import { Validators } from '@angular/forms';
import { TypeFields } from '../enums/type-fields';
import { StateProps } from './state-props';

export type FormFields = Record<string, { fields: FieldBase<string>[] }>;

export interface FieldOptionSource {
  table:           string;
  schema?:         string;       // default: 'public'
  valueField?:     string;       // default: 'catalog_id'
  labelField?:     string;       // default: 'description'
  orderBy?:        string;
  order?:          'asc' | 'desc';
  filterField?:    string;
  filterValue?:    string | number | boolean | null;
  includeDeleted?: boolean;
  pageSize?:       number;       // default: 50 — tamaño de página para cursor pagination
}

export class FieldBase<T> {
  value:       T | undefined;
  icon:        string;
  key:         string;
  label:       string;
  placeholder: string;
  hint:        string;
  state:       StateProps;
  order:       number;
  controlType: TypeFields | string;
  type:        string;
  options:     { key: string; value: string }[];
  rules:       Validators[];
  source?:     FieldOptionSource;   // carga opciones dinámicamente desde Supabase

  constructor(
    options: {
      value?:       T;
      icon?:        string;
      key?:         string;
      label?:       string;
      state?:       StateProps;
      order?:       number;
      placeholder?: string;
      hint?:        string;
      validators?:  Validators[];
      controlType?: TypeFields | string;
      type?:        string;
      options?:     { key: string; value: string }[];
      source?:      FieldOptionSource;
    } = {},
  ) {
    this.value       = options.value;
    this.icon        = options.icon        || '';
    this.key         = options.key         || '';
    this.label       = options.label       || '';
    this.state       = options.state       || {
      required:   false,
      disabled:   false,
      hidden:     false,
      readonly:   false,
      repeatible: { repeat: false, minItems: 0, maxItems: 1 },
    };
    this.rules       = options.validators  || [];
    this.placeholder = options.placeholder || '';
    this.hint        = options.hint        || '';
    this.order       = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type        = options.type        || '';
    this.options     = options.options     || [];
    this.source      = options.source;
  }
}
