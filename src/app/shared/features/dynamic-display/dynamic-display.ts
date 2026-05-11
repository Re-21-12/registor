import { Component, inject, output, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonToolbar,
  IonTitle,
  IonButtons,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  listOutline,
  gridOutline,
  downloadOutline,
  addOutline,
} from 'ionicons/icons';
import { DynamicDisplayService } from './services/dynamic-display.service';
import { DisplayTable } from './display-table/display-table';
import { DisplayCards } from './display-cards/display-cards';
import { DisplayView } from './interfaces/display-interface';

@Component({
  selector: 'app-dynamic-display',
  imports: [
    DisplayTable,
    DisplayCards,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonToolbar,
    IonTitle,
    IonButtons,
  ],
  templateUrl: './dynamic-display.html',
  styleUrl: './dynamic-display.scss',
  providers: [DynamicDisplayService],
})
export class DynamicDisplay implements OnInit {
  readonly svc = inject(DynamicDisplayService);

  delete = output<string>();
  view = output<Record<string, unknown>>();
  edit = output<Record<string, unknown>>();
  insert = output<void>();
  pageChange = output<{ page: number; size: number }>();

  viewMode = signal<DisplayView>('table');

  ngOnInit(): void {
    addIcons({ listOutline, gridOutline, downloadOutline, addOutline });
  }

  get props() { return this.svc.displayProps(); }
  get hasInsert() { return this.props.actions.includes('insert'); }

  onSegmentChange(event: CustomEvent) {
    this.viewMode.set(event.detail.value as DisplayView);
  }

  onDelete(id: string) { this.delete.emit(id); }
  onView(row: Record<string, unknown>) { this.view.emit(row); }
  onEdit(row: Record<string, unknown>) { this.edit.emit(row); }

  onExport() { this.svc.exportCSV(); }
  onInsert() { this.insert.emit(); }
}
