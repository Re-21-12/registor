import { Component, input, computed, effect, inject, output } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { TypeFields } from './enums/type-fields';
import {
  IonButton,
  IonIcon,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, closeOutline, trashOutline, saveOutline, refreshOutline } from 'ionicons/icons';
import { FieldBase } from './interfaces/field-props';
import { DynamicField } from './dynamic-field/dynamic-field';
import { FormBuilderService } from './services/form-builder.service';
import { HttpLoadingService } from '../../../core/services/http-loading.service';

@Component({
  selector: 'app-dynamic-form',
  imports: [DynamicField, IonButton, IonIcon, IonSpinner, IonGrid, IonRow, IonCol],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.scss',
})
export class DynamicForm {
  data = output<string>();

  private readonly _fb = inject(FormBuilderService);
  readonly loadingService = inject(HttpLoadingService);

  readonly fields = input<FieldBase<string>[] | null>([]);
  readonly initialData = input<Record<string, any> | null>(null);
  readonly readonlyMode = input<boolean>(false);
  readonly hideActions = input<boolean>(false);

  readonly form = computed<FormGroup>(() =>
    this._fb.toFormGroup(this.fields() as FieldBase<string>[]),
  );

  payLoad = '';

  constructor() {
    addIcons({ addOutline, closeOutline, trashOutline, saveOutline, refreshOutline });

    effect(() => {
      const data = this.initialData();
      if (data) this.form().patchValue(data);
    });

    effect(() => {
      const isReadonly = this.readonlyMode();
      const form = this.form();
      Object.values(form.controls).forEach((ctrl) =>
        isReadonly ? ctrl.disable({ emitEvent: false }) : ctrl.enable({ emitEvent: false }),
      );
    });
  }

  colSize = computed(() => {
    const count = this.fields()?.length || 0;
    return count > 2 ? '6' : '12';
  });

  colSizeSm = computed(() => '12');

  private static readonly EMPTY_TO_NULL_TYPES = new Set<string>([
    TypeFields.DATE, TypeFields.DATETIME, TypeFields.NUMBER,
    TypeFields.INTEGER, TypeFields.DECIMAL, TypeFields.CURRENCY,
    TypeFields.SELECT, TypeFields.MULTISELECT,
  ]);

  onSubmit(): void {
    if (!this.form().valid) {
      this.form().markAllAsTouched();
      return;
    }
    const raw = this.form().value as Record<string, unknown>;
    const sanitized: Record<string, unknown> = { ...raw };
    for (const field of (this.fields() ?? [])) {
      if (DynamicForm.EMPTY_TO_NULL_TYPES.has(field.controlType) && sanitized[field.key] === '') {
        sanitized[field.key] = null;
      }
    }
    this.payLoad = JSON.stringify(sanitized);
    this.data.emit(this.payLoad);
  }

  onClear(): void {
    this.form().reset();
    this.payLoad = '';
  }

  getFormArray(key: string): FormArray {
    return this.form().get(key) as FormArray;
  }

  addField(key: string): void {
    const field = this.fields()?.find((f) => f.key === key);
    if (field) {
      this._fb.addItem(this.getFormArray(key), field.value || '', field.rules || []);
    }
  }

  removeField(key: string, index: number): void {
    this._fb.removeItem(this.getFormArray(key), index);
  }

  isRepeatableField(field: FieldBase<string>): boolean {
    return field.state.repeatible.repeat === true;
  }
}
