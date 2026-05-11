import { Component, effect, input, output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline, closeOutline } from 'ionicons/icons';
import { CreateMeassureRequest } from '../../types';
import { DynamicForm } from '../../../dynamic-form/dynamic-form';
import { FieldBase } from '../../../dynamic-form/interfaces/field-props';
import { formFields } from '../../../dynamic-form/utils/forms';

@Component({
  selector: 'app-measurement-form',
  templateUrl: './measurement-form.html',
  styleUrl: './measurement-form.scss',
  imports: [IonButton, IonIcon, DynamicForm],
})
export class MeasurementForm {
  initialData = input<Partial<CreateMeassureRequest> | null>(null);
  save   = output<CreateMeassureRequest>();
  cancel = output<void>();

  readonly fields: FieldBase<string>[] = formFields['meassureForm'].fields;
  formInitialData: Record<string, any> | null = null;

  constructor() {
    addIcons({ saveOutline, closeOutline });

    effect(() => {
      const data = this.initialData();
      if (data) {
        this.formInitialData = {
          ...data,
          measured_at: data.measured_at
            ? new Date(data.measured_at).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
        };
      } else {
        this.formInitialData = {
          measured_at: new Date().toISOString().slice(0, 16),
        };
      }
    });
  }

  onData(payload: string): void {
    this.save.emit(JSON.parse(payload) as CreateMeassureRequest);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
