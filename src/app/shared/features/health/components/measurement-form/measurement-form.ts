import { Component, OnInit, computed, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton, IonIcon, IonItem, IonInput, IonLabel,
  IonSelect, IonSelectOption, IonTextarea, IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline, closeOutline } from 'ionicons/icons';
import { Catalog } from '../../../acl/types';
import { CreateMeassureRequest } from '../../types';

@Component({
  selector: 'app-measurement-form',
  templateUrl: './measurement-form.html',
  styleUrl: './measurement-form.scss',
  imports: [
    ReactiveFormsModule,
    IonButton, IonIcon, IonItem, IonInput, IonLabel,
    IonSelect, IonSelectOption, IonTextarea, IonNote,
  ],
})
export class MeasurementForm implements OnInit {
  initialData    = input<Partial<CreateMeassureRequest> | null>(null);
  unitOptions    = input<Catalog[]>([]);
  typeOptions    = input<Catalog[]>([]);
  contextOptions = input<Catalog[]>([]);

  save   = output<CreateMeassureRequest>();
  cancel = output<void>();

  form = new FormGroup({
    measured_at:      new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    value_mgdl:       new FormControl<number | null>(null, [Validators.required, Validators.min(20), Validators.max(600)]),
    unit_id:          new FormControl<number | null>(null, [Validators.required]),
    meassure_type_id: new FormControl<number | null>(null, [Validators.required]),
    context_id:       new FormControl<number | null>(null),
    last_eat_at:      new FormControl<string | null>(null),
    notes:            new FormControl<string | null>(null, [Validators.maxLength(300)]),
    user_id:          new FormControl<string>('', { nonNullable: true }),
  });

  constructor() {
    addIcons({ saveOutline, closeOutline });

    effect(() => {
      const data = this.initialData();
      if (data) this.form.patchValue(data as any);
    });
  }

  ngOnInit(): void {
    if (!this.form.value.measured_at) {
      this.form.patchValue({ measured_at: new Date().toISOString().slice(0, 16) });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue() as CreateMeassureRequest);
  }

  onCancel(): void {
    this.form.reset();
    this.cancel.emit();
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }
}
