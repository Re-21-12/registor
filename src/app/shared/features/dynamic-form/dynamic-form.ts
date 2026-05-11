import { Component, input, computed, effect, inject, output } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
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

  onSubmit(): void {
    if (!this.form().valid) {
      this.form().markAllAsTouched();
      return;
    }
    this.payLoad = JSON.stringify(this.form().value);
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
