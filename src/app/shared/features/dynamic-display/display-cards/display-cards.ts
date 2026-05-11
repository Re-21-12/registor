import { Component, inject, output, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSkeletonText,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, createOutline, trashOutline } from 'ionicons/icons';
import { DynamicDisplayService } from '../services/dynamic-display.service';
import { DisplayAction } from '../interfaces/display-interface';

@Component({
  selector: 'app-display-cards',
  imports: [
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonBadge, IonButton, IonIcon, IonGrid, IonRow, IonCol,
    IonSkeletonText, IonItem, IonLabel,
  ],
  templateUrl: './display-cards.html',
  styleUrl: './display-cards.scss',
})
export class DisplayCards implements OnInit {
  readonly svc = inject(DynamicDisplayService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  delete = output<string>();
  view = output<Record<string, unknown>>();
  edit = output<Record<string, unknown>>();

  ngOnInit(): void {
    addIcons({ eyeOutline, createOutline, trashOutline });
  }

  get props() { return this.svc.displayProps(); }
  get pagedData() { return this.svc.pagedData(); }
  get columns() { return this.props.columns; }
  get actions() { return this.props.actions; }
  get loading() { return this.props.loading; }
  get skeletonCards() { return Array(this.svc.pageSize() > 6 ? 6 : this.svc.pageSize()); }

  hasAction(a: DisplayAction) { return this.actions.includes(a); }

  getCardTitle(row: Record<string, unknown>): string {
    const field = this.props.cardTitleField ?? this.columns[0]?.field;
    return field ? this.formatValue(row[field]) : '';
  }

  getCardSubtitle(row: Record<string, unknown>): string {
    const field = this.props.cardSubtitleField ?? this.columns[1]?.field;
    return field ? this.formatValue(row[field]) : '';
  }

  getBodyColumns(row: Record<string, unknown>) {
    const titleField = this.props.cardTitleField ?? this.columns[0]?.field;
    const subtitleField = this.props.cardSubtitleField ?? this.columns[1]?.field;
    return this.columns.filter((c) => c.field !== titleField && c.field !== subtitleField);
  }

  isBoolean(val: unknown): val is boolean { return typeof val === 'boolean'; }

  isDate(val: unknown): val is string {
    return typeof val === 'string' && val.length >= 10 && /^\d{4}-\d{2}-\d{2}(T|\s)/.test(val);
  }

  isStatusString(val: unknown): val is string {
    if (typeof val !== 'string') return false;
    const known = new Set([
      'active','activo','enabled','habilitado','approved','aprobado','completed','completado','paid','pagado',
      'pending','pendiente',
      'inactive','inactivo','disabled','deshabilitado','rejected','rechazado','cancelled','cancelado','error','failed','fallido',
    ]);
    return known.has(val.trim().toLowerCase());
  }

  shouldRenderAsBadge(val: unknown) { return this.isBoolean(val) || this.isStatusString(val); }

  formatValue(val: unknown): string {
    if (val == null || val === '') return '-';
    if (this.isDate(val)) {
      try {
        return new Intl.DateTimeFormat('es-GT', {
          year: 'numeric', month: 'short', day: '2-digit',
        }).format(new Date(val));
      } catch { return String(val); }
    }
    if (this.isBoolean(val)) return val ? 'Sí' : 'No';
    return String(val);
  }

  getBadgeLabel(val: unknown): string {
    if (this.isBoolean(val)) return val ? 'Sí' : 'No';
    return this.formatValue(val);
  }

  getBadgeColor(val: unknown): string {
    if (this.isBoolean(val)) return val ? 'success' : 'danger';
    if (!this.isStatusString(val)) return 'medium';
    const n = (val as string).trim().toLowerCase();
    const success = ['active','activo','enabled','habilitado','approved','aprobado','completed','completado','paid','pagado'];
    const warn = ['pending','pendiente'];
    if (success.includes(n)) return 'success';
    if (warn.includes(n)) return 'warning';
    return 'danger';
  }

  onDelete(row: Record<string, unknown>) {
    const id = this.svc.resolveRowId(row);
    if (id) this.delete.emit(id);
  }

  onView(row: Record<string, unknown>) {
    this.view.emit(row);
    const id = this.svc.resolveRowId(row);
    if (!id) return;
    const base = this.props.routeBase;
    base
      ? this.router.navigate([base, id, 'detail'])
      : this.router.navigate([id, 'detail'], { relativeTo: this.route });
  }

  onEdit(row: Record<string, unknown>) {
    this.edit.emit(row);
    const id = this.svc.resolveRowId(row);
    if (!id) return;
    const base = this.props.routeBase;
    base
      ? this.router.navigate([base, id, 'edit'])
      : this.router.navigate([id, 'edit'], { relativeTo: this.route });
  }
}
