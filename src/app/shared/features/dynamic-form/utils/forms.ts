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

};
