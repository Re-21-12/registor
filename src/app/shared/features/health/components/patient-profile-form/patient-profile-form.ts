import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton, IonIcon, IonItem, IonInput,
  IonLabel, IonSelect, IonSelectOption, IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline, closeOutline } from 'ionicons/icons';
import { Catalog } from '../../../acl/types';
import { CreatePatientProfileRequest } from '../../types';

@Component({
  selector: 'app-patient-profile-form',
  templateUrl: './patient-profile-form.html',
  styleUrl: './patient-profile-form.scss',
  imports: [
    ReactiveFormsModule,
    IonButton, IonIcon, IonItem, IonInput,
    IonLabel, IonSelect, IonSelectOption, IonNote,
  ],
})
export class PatientProfileForm {
  initialData         = input<Partial<CreatePatientProfileRequest> | null>(null);
  diabetesTypeOptions = input<Catalog[]>([]);
  genderOptions       = input<Catalog[]>([]);

  save   = output<CreatePatientProfileRequest>();
  cancel = output<void>();

  form = new FormGroup({
    user_id:          new FormControl<string>('', { nonNullable: true }),
    diabetes_type_id: new FormControl<number | null>(null, [Validators.required]),
    target_min_mgdl:  new FormControl<number>(70,  { nonNullable: true, validators: [Validators.required, Validators.min(40), Validators.max(150)] }),
    target_max_mgdl:  new FormControl<number>(140, { nonNullable: true, validators: [Validators.required, Validators.min(100), Validators.max(400)] }),
    date_of_birth:    new FormControl<string | null>(null),
    gender_id:        new FormControl<number | null>(null),
    diagnosis_date:   new FormControl<string | null>(null),
  });

  constructor() {
    addIcons({ saveOutline, closeOutline });

    effect(() => {
      const data = this.initialData();
      if (data) this.form.patchValue(data as any);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue() as CreatePatientProfileRequest);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }
}
