import { Validators } from '@angular/forms';
import { FieldBase, FormFields } from '../interfaces/field-props';
import { TypeFields } from '../enums/type-fields';

const requiredState = {
  required: true,
  disabled: false,
  hidden: false,
  readonly: false,
  repeatible: { repeat: false, minItems: 0, maxItems: 1 },
};

const optionalState = {
  required: false,
  disabled: false,
  hidden: false,
  readonly: false,
  repeatible: { repeat: false, minItems: 0, maxItems: 1 },
};

const catalogSource = (filterValue: string) => ({
  schema: 'acl',
  table: 'catalog',
  valueField: 'option_id',
  labelField: 'description',
  filterField: 'table_name',
  filterValue,
});

export const formFields: FormFields = {

  loginForm: {
    fields: [
      new FieldBase({
        key: 'email',
        label: 'Correo electrónico',
        type: TypeFields.EMAIL,
        icon: 'mail-outline',
        placeholder: 'usuario@correo.com',
        order: 1,
        state: requiredState,
        validators: [Validators.required, Validators.email],
      }),
      new FieldBase({
        key: 'password',
        label: 'Contraseña',
        type: TypeFields.PASSWORD,
        icon: 'lock-closed-outline',
        placeholder: 'Ingresa tu contraseña',
        order: 2,
        state: requiredState,
        validators: [Validators.required, Validators.minLength(6)],
      }),
    ],
  },

  registerForm: {
    fields: [
      new FieldBase({
        key: 'fullName',
        label: 'Nombre completo',
        type: TypeFields.TEXT,
        icon: 'person-outline',
        placeholder: 'Juan Pérez',
        order: 1,
        state: requiredState,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      new FieldBase({
        key: 'email',
        label: 'Correo electrónico',
        type: TypeFields.EMAIL,
        icon: 'mail-outline',
        placeholder: 'usuario@correo.com',
        order: 2,
        state: requiredState,
        validators: [Validators.required, Validators.email],
      }),
      new FieldBase({
        key: 'password',
        label: 'Contraseña',
        type: TypeFields.PASSWORD,
        icon: 'lock-closed-outline',
        placeholder: 'Ingresa tu contraseña',
        order: 3,
        state: requiredState,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      new FieldBase({
        key: 'confirmPassword',
        label: 'Confirmar contraseña',
        type: TypeFields.PASSWORD,
        icon: 'lock-closed-outline',
        placeholder: 'Repite tu contraseña',
        order: 4,
        state: requiredState,
        validators: [Validators.required],
      }),
    ],
  },

  patientProfileForm: {
    fields: [
      new FieldBase({
        key: 'diabetes_type_id',
        label: 'Tipo de diabetes',
        type: TypeFields.SELECT,
        icon: 'medical-outline',
        order: 1,
        state: requiredState,
        validators: [Validators.required],
        source: catalogSource('patient_profile'),
      }),
      new FieldBase({
        key: 'gender_id',
        label: 'Género',
        type: TypeFields.SELECT,
        icon: 'person-outline',
        order: 2,
        state: optionalState,
        source: catalogSource('gender'),
      }),
      new FieldBase({
        key: 'target_min_mgdl',
        label: 'Glucosa mínima objetivo (mg/dL)',
        type: TypeFields.INTEGER,
        icon: 'trending-down-outline',
        placeholder: '70',
        value: '70',
        order: 3,
        state: requiredState,
        validators: [Validators.required, Validators.min(40) as any, Validators.max(150) as any],
      }),
      new FieldBase({
        key: 'target_max_mgdl',
        label: 'Glucosa máxima objetivo (mg/dL)',
        type: TypeFields.INTEGER,
        icon: 'trending-up-outline',
        placeholder: '140',
        value: '140',
        order: 4,
        state: requiredState,
        validators: [Validators.required, Validators.min(100) as any, Validators.max(400) as any],
      }),
      new FieldBase({
        key: 'date_of_birth',
        label: 'Fecha de nacimiento',
        type: TypeFields.DATE,
        icon: 'calendar-outline',
        order: 5,
        state: optionalState,
      }),
      new FieldBase({
        key: 'diagnosis_date',
        label: 'Fecha de diagnóstico',
        type: TypeFields.DATE,
        icon: 'calendar-outline',
        order: 6,
        state: optionalState,
      }),
    ],
  },

  meassureForm: {
    fields: [
      new FieldBase({
        key: 'measured_at',
        label: 'Fecha y hora',
        type: TypeFields.DATETIME,
        icon: 'time-outline',
        order: 1,
        state: requiredState,
        validators: [Validators.required],
      }),
      new FieldBase({
        key: 'value_mgdl',
        label: 'Valor de glucosa',
        type: TypeFields.DECIMAL,
        icon: 'pulse-outline',
        placeholder: 'Ej: 120',
        order: 2,
        state: requiredState,
        validators: [Validators.required, Validators.min(20) as any, Validators.max(600) as any],
      }),
      new FieldBase({
        key: 'unit_id',
        label: 'Unidad',
        type: TypeFields.SELECT,
        icon: 'options-outline',
        order: 3,
        state: requiredState,
        validators: [Validators.required],
        source: catalogSource('meassure_unit'),
      }),
      new FieldBase({
        key: 'meassure_type_id',
        label: 'Tipo de medición',
        type: TypeFields.SELECT,
        icon: 'clipboard-outline',
        order: 4,
        state: requiredState,
        validators: [Validators.required],
        source: catalogSource('meassure_type'),
      }),
      new FieldBase({
        key: 'context_id',
        label: 'Contexto',
        type: TypeFields.SELECT,
        icon: 'restaurant-outline',
        order: 5,
        state: optionalState,
        source: catalogSource('meassure_context'),
      }),
      new FieldBase({
        key: 'last_eat_at',
        label: 'Última comida',
        type: TypeFields.DATETIME,
        icon: 'fast-food-outline',
        order: 6,
        state: optionalState,
      }),
      new FieldBase({
        key: 'notes',
        label: 'Notas',
        type: TypeFields.TEXTAREA,
        icon: 'document-text-outline',
        placeholder: 'Observaciones opcionales',
        order: 7,
        state: optionalState,
        validators: [Validators.maxLength(300) as any],
      }),
    ],
  },

};
