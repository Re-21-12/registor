import { Component, input, signal, computed, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';
import {
  IonItem,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonRadioGroup,
  IonRadio,
  IonToggle,
  IonButton,
  IonIcon,
  IonLabel,
  IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  eyeOutline,
  eyeOffOutline,
  addOutline,
  closeOutline,
  calendarOutline,
} from 'ionicons/icons';
import { FieldBase } from '../interfaces/field-props';
import { DynamicErrors } from '../dynamic-errors/dynamic-errors';
import { DynamicHint } from '../dynamic-hint/dynamic-hint';
import { TypeFields } from '../enums/type-fields';
import {
  onKeypressEmail,
  onKeypressEntero,
  onKeypressDecimal,
  onKeypressMoneda,
  onKeypressLetras,
} from '../utils/on-input-validator';
import {
  validarEmailPaste,
  validarEnteroPaste,
  validarDecimalPaste,
  validarMonedaPaste,
  validarLetrasPaste,
} from '../utils/on-paste-validator';

@Component({
  selector: 'app-dynamic-field',
  imports: [
    ReactiveFormsModule,
    IonItem,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    IonRadioGroup,
    IonRadio,
    IonToggle,
    IonButton,
    IonIcon,
    IonLabel,
    IonNote,
    DynamicErrors,
    DynamicHint,
  ],
  templateUrl: './dynamic-field.html',
  styleUrl: './dynamic-field.scss',
})
export class DynamicField implements OnInit {
  // Validadores keypress
  onKeypressEmail = onKeypressEmail;
  onKeypressEntero = onKeypressEntero;
  onKeypressDecimal = onKeypressDecimal;
  onKeypressMoneda = onKeypressMoneda;
  onKeypressLetras = onKeypressLetras;

  // Validadores paste
  validarEmailPaste = validarEmailPaste;
  validarEnteroPaste = validarEnteroPaste;
  validarDecimalPaste = validarDecimalPaste;
  validarMonedaPaste = validarMonedaPaste;
  validarLetrasPaste = validarLetrasPaste;

  TypeFields = TypeFields;

  fieldControl = input.required<FieldBase<string>>();
  readonly form = input.required<FormGroup>();
  readonly isArrayItem = input<boolean>(false);
  readonly arrayIndex = input<number | null>(null);

  showPassword = signal(false);

  fieldProps = computed(() => this.fieldControl());

  hasIcon = computed(() => {
    const icon = this.fieldProps().icon;
    return icon && icon.trim().length > 0;
  });

  labelText = computed(() => {
    const label = this.fieldProps().label || '';
    return this.fieldProps().state.required ? `${label} *` : label;
  });

  formControl = computed(() => {
    const formGroup = this.form();
    const key = this.fieldControl().key;
    if (this.isArrayItem() && this.arrayIndex() !== null) {
      const formArray = formGroup.get(key) as FormArray;
      return formArray?.at(this.arrayIndex()!) as FormControl;
    }
    return formGroup.get(key) as FormControl;
  });

  ngOnInit(): void {
    addIcons({ eyeOutline, eyeOffOutline, addOutline, closeOutline, calendarOutline });
  }

  isTextualField(): boolean {
    return [
      TypeFields.TEXT,
      TypeFields.EMAIL,
      TypeFields.INTEGER,
      TypeFields.DECIMAL,
      TypeFields.CURRENCY,
      TypeFields.TEXTAREA,
      TypeFields.PASSWORD,
    ].includes(this.fieldProps().type as TypeFields);
  }

  private maxLengthCache: number | null | undefined;

  getMaxLength(): number | null {
    if (this.maxLengthCache !== undefined) return this.maxLengthCache;
    const control = this.formControl();
    const validator = control?.validator;
    if (!validator) { this.maxLengthCache = null; return null; }
    const probeControl = { value: 'x'.repeat(5000) } as FormControl;
    const result = validator(probeControl);
    const requiredLength = (result as any)?.['maxlength']?.requiredLength;
    this.maxLengthCache = typeof requiredLength === 'number' ? requiredLength : null;
    return this.maxLengthCache;
  }

  getCurrentLength(): number {
    const value = this.formControl().value;
    if (value == null) return 0;
    return typeof value === 'string' ? value.length : String(value).length;
  }

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }
}
