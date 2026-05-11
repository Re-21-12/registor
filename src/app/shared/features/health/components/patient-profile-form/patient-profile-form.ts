import { Component, effect, input, output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline, closeOutline } from 'ionicons/icons';
import { CreatePatientProfileRequest } from '../../types';
import { DynamicForm } from '../../../dynamic-form/dynamic-form';
import { FieldBase } from '../../../dynamic-form/interfaces/field-props';
import { formFields } from '../../../dynamic-form/utils/forms';

@Component({
  selector: 'app-patient-profile-form',
  templateUrl: './patient-profile-form.html',
  styleUrl: './patient-profile-form.scss',
  imports: [IonButton, IonIcon, DynamicForm],
})
export class PatientProfileForm {
  initialData = input<Partial<CreatePatientProfileRequest> | null>(null);
  save   = output<CreatePatientProfileRequest>();
  cancel = output<void>();

  readonly fields: FieldBase<string>[] = formFields['patientProfileForm'].fields;
  formInitialData: Record<string, any> | null = null;

  constructor() {
    addIcons({ saveOutline, closeOutline });

    effect(() => {
      const data = this.initialData();
      this.formInitialData = data ? { ...data } : null;
    });
  }

  onData(payload: string): void {
    this.save.emit(JSON.parse(payload) as CreatePatientProfileRequest);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
